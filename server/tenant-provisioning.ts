import { db } from "./db";
import { tenants, royaltyRevenue } from "@shared/schema";
import { orbitEcosystem } from "./orbit";
import { getUncachableStripeClient } from "./stripeClient";
import { eq } from "drizzle-orm";

interface TenantProvisionRequest {
  companyName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  companyCity?: string;
  companyState?: string;
  tradeVertical: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  tradeworksEnabled: boolean;
  subscriptionTier: string;
}

interface ProvisionResult {
  success: boolean;
  tenantId?: string;
  checkoutUrl?: string;
  error?: string;
}

const SUBSCRIPTION_PRICES: Record<string, { monthly: number; stripePriceId?: string }> = {
  starter: { monthly: 149 },
  professional: { monthly: 299 },
  enterprise: { monthly: 599 },
};

const TRADEWORKS_PRICE = {
  monthly: 49,
  stripePriceId: undefined as string | undefined,
};

export class TenantProvisioning {
  async provisionTenant(request: TenantProvisionRequest): Promise<ProvisionResult> {
    try {
      const stripe = await getUncachableStripeClient();
      
      const slug = this.generateSlug(request.companyName);
      
      const existingTenant = await db.select().from(tenants).where(eq(tenants.companySlug, slug)).limit(1);
      if (existingTenant.length > 0) {
        return { success: false, error: "A company with this name already exists" };
      }
      
      const customer = await stripe.customers.create({
        email: request.ownerEmail,
        name: request.ownerName,
        phone: request.ownerPhone,
        metadata: {
          companyName: request.companyName,
          tradeVertical: request.tradeVertical,
          tradeworksEnabled: String(request.tradeworksEnabled),
        },
      });
      
      const [tenant] = await db.insert(tenants).values({
        ownerEmail: request.ownerEmail,
        ownerName: request.ownerName,
        ownerPhone: request.ownerPhone,
        companyName: request.companyName,
        companySlug: slug,
        companyCity: request.companyCity,
        companyState: request.companyState,
        logoUrl: request.logoUrl,
        primaryColor: request.primaryColor,
        accentColor: request.accentColor,
        tradeVertical: request.tradeVertical,
        tradeworksEnabled: request.tradeworksEnabled,
        subscriptionTier: request.subscriptionTier,
        subscriptionStatus: "pending",
        stripeCustomerId: customer.id,
        status: "provisioning",
        orbitSyncEnabled: true,
      }).returning();
      
      await this.syncToOrbit(tenant.id, request);
      
      const lineItems = await this.buildLineItems(request, stripe);
      
      const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
      
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'subscription',
        success_url: `${protocol}://${baseUrl}/onboarding/success?tenant=${tenant.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${baseUrl}/onboarding/cancel?tenant=${tenant.id}`,
        metadata: {
          tenantId: tenant.id,
          tradeVertical: request.tradeVertical,
          tradeworksEnabled: String(request.tradeworksEnabled),
        },
      });
      
      await db.update(tenants)
        .set({ metadata: { checkoutSessionId: session.id } })
        .where(eq(tenants.id, tenant.id));
      
      return {
        success: true,
        tenantId: tenant.id,
        checkoutUrl: session.url || undefined,
      };
      
    } catch (error: any) {
      console.error("[TenantProvisioning] Error:", error);
      return { success: false, error: error.message };
    }
  }
  
  async activateTenant(tenantId: string, stripeSubscriptionId: string): Promise<boolean> {
    try {
      const now = new Date();
      
      await db.update(tenants)
        .set({
          status: "active",
          subscriptionStatus: "active",
          stripeSubscriptionId: stripeSubscriptionId,
          provisionedAt: now,
          activatedAt: now,
          updatedAt: now,
        })
        .where(eq(tenants.id, tenantId));
      
      const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
      
      if (tenant) {
        const tierPrice = SUBSCRIPTION_PRICES[tenant.subscriptionTier]?.monthly || 0;
        const tradeworksPrice = tenant.tradeworksEnabled ? TRADEWORKS_PRICE.monthly : 0;
        const totalRevenue = tierPrice + tradeworksPrice;
        
        await db.insert(royaltyRevenue).values({
          productCode: `tradepros-${tenant.tradeVertical}`,
          revenueType: 'saas_setup',
          amount: String(totalRevenue),
          periodStart: now,
          periodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          description: `New ${tenant.tradeVertical} tenant: ${tenant.companyName}`,
          metadata: {
            tenantId: tenant.id,
            tier: tenant.subscriptionTier,
            tradeworks: tenant.tradeworksEnabled,
          },
        });
        
        if (tenant.orbitSyncEnabled) {
          await this.updateOrbitTenantStatus(tenantId, 'active');
        }
      }
      
      console.log(`[TenantProvisioning] Tenant ${tenantId} activated successfully`);
      return true;
      
    } catch (error) {
      console.error("[TenantProvisioning] Activation error:", error);
      return false;
    }
  }
  
  private async syncToOrbit(tenantId: string, request: TenantProvisionRequest): Promise<void> {
    try {
      if (!orbitEcosystem.isConnected()) {
        console.log("[TenantProvisioning] Orbit not connected, skipping sync");
        return;
      }
      
      const orbitTenant = await orbitEcosystem.syncTenant({
        externalId: tenantId,
        name: request.companyName,
        email: request.ownerEmail,
        phone: request.ownerPhone,
        vertical: request.tradeVertical,
        city: request.companyCity,
        state: request.companyState,
        status: 'provisioning',
        subscriptionTier: request.subscriptionTier,
        tradeworksEnabled: request.tradeworksEnabled,
        source: 'paintpros-onboarding',
      });
      
      if (orbitTenant?.id) {
        await db.update(tenants)
          .set({ 
            orbitTenantId: orbitTenant.id,
            orbitLastSyncAt: new Date(),
          })
          .where(eq(tenants.id, tenantId));
      }
      
      console.log(`[TenantProvisioning] Synced tenant ${tenantId} to Orbit`);
      
    } catch (error) {
      console.error("[TenantProvisioning] Orbit sync error:", error);
    }
  }
  
  private async updateOrbitTenantStatus(tenantId: string, status: string): Promise<void> {
    try {
      if (!orbitEcosystem.isConnected()) return;
      
      const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
      if (!tenant?.orbitTenantId) return;
      
      await orbitEcosystem.updateTenantStatus(tenant.orbitTenantId, status);
      
      await db.update(tenants)
        .set({ orbitLastSyncAt: new Date() })
        .where(eq(tenants.id, tenantId));
        
    } catch (error) {
      console.error("[TenantProvisioning] Orbit status update error:", error);
    }
  }
  
  private async buildLineItems(request: TenantProvisionRequest, stripe: any): Promise<any[]> {
    const items: any[] = [];
    
    const tierPrice = SUBSCRIPTION_PRICES[request.subscriptionTier];
    if (tierPrice) {
      items.push({
        price_data: {
          currency: 'usd',
          unit_amount: tierPrice.monthly * 100,
          recurring: { interval: 'month' },
          product_data: {
            name: `${this.getVerticalDisplayName(request.tradeVertical)} Pro - ${this.capitalize(request.subscriptionTier)}`,
            description: `Professional ${request.tradeVertical} website and CRM`,
            metadata: {
              tier: request.subscriptionTier,
              vertical: request.tradeVertical,
            },
          },
        },
        quantity: 1,
      });
    }
    
    if (request.tradeworksEnabled) {
      items.push({
        price_data: {
          currency: 'usd',
          unit_amount: TRADEWORKS_PRICE.monthly * 100,
          recurring: { interval: 'month' },
          product_data: {
            name: 'TradeWorks AI Toolkit',
            description: '85+ calculators, voice assistant, AI features',
            metadata: {
              addon: 'tradeworks',
              vertical: request.tradeVertical,
            },
          },
        },
        quantity: 1,
      });
    }
    
    return items;
  }
  
  private generateSlug(companyName: string): string {
    return companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  private getVerticalDisplayName(vertical: string): string {
    const names: Record<string, string> = {
      painting: 'PaintPros',
      roofing: 'RoofPros',
      hvac: 'HVACPros',
      electrical: 'ElectricPros',
      plumbing: 'PlumbPros',
      landscaping: 'LandscapePros',
      construction: 'BuildPros',
    };
    return names[vertical] || 'TradePros';
  }
  
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export const tenantProvisioning = new TenantProvisioning();
