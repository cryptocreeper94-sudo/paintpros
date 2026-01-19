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
  selectedTrades: string[];
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  subscriptionTier: string;
  billingInterval: 'month' | 'year';
}

interface ProvisionResult {
  success: boolean;
  tenantId?: string;
  checkoutUrl?: string;
  error?: string;
}

const TRADE_ESTIMATORS: Record<string, { monthly: string; annual: string }> = {
  painting: { monthly: "price_1SrBzdPQpkkF93FKy15vIwzk", annual: "price_1SrBzdPQpkkF93FKlyz5qaIJ" },
  roofing: { monthly: "price_1SrBzePQpkkF93FK60VGhCdM", annual: "price_1SrBzePQpkkF93FKiwe9uQpj" },
  hvac: { monthly: "price_1SrBzfPQpkkF93FKYCsvXoQp", annual: "price_1SrBzfPQpkkF93FKz07rfQti" },
  electrical: { monthly: "price_1SrBzgPQpkkF93FKeGlRsJ4t", annual: "price_1SrBzgPQpkkF93FKcPNB1obI" },
  plumbing: { monthly: "price_1SrBzhPQpkkF93FK5T5LhOKe", annual: "price_1SrBzhPQpkkF93FKtqRu7Dc4" },
  landscaping: { monthly: "price_1SrBziPQpkkF93FKxtIWid03", annual: "price_1SrBziPQpkkF93FKRaEsWRnI" },
  construction: { monthly: "price_1SrCEMPQpkkF93FKWbCpPnSJ", annual: "price_1SrCEMPQpkkF93FKK4y5DaIC" },
};

const TRADE_BUNDLES: Record<string, { monthly: string; annual: string; trades: number }> = {
  "3-trade": { monthly: "price_1SrBziPQpkkF93FKqU4gHpG3", annual: "price_1SrBzjPQpkkF93FKHnvtYJuI", trades: 3 },
  "all-trades": { monthly: "price_1SrBzjPQpkkF93FKVn6QHOXH", annual: "price_1SrBzkPQpkkF93FKShNdCxwk", trades: 7 },
};

const PLATFORM_TIERS: Record<string, { monthly: string; annual: string; price: number }> = {
  professional: { monthly: "price_1SlCL5PQpkkF93FKe0aUduOg", annual: "price_1SlCL5PQpkkF93FKYh5D4Tj7", price: 199 },
  enterprise: { monthly: "price_1SlCL6PQpkkF93FKuFz2kDcu", annual: "price_1SlCL6PQpkkF93FKTKOkcU9A", price: 499 },
};

const COMBO_BUNDLES: Record<string, { monthly: string; annual: string; price: number }> = {
  "pro-all-trades": { monthly: "price_1SrBzkPQpkkF93FKJCxeiNix", annual: "price_1SrBzkPQpkkF93FKmHIerZg3", price: 269 },
  "enterprise-all-trades": { monthly: "price_1SrBzlPQpkkF93FKDQeUnnA5", annual: "price_1SrBzlPQpkkF93FKJ61myt1o", price: 569 },
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
          selectedTrades: request.selectedTrades.join(','),
          subscriptionTier: request.subscriptionTier,
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
        tradeworksEnabled: request.selectedTrades.length > 0,
        subscriptionTier: request.subscriptionTier,
        subscriptionStatus: "pending",
        stripeCustomerId: customer.id,
        status: "provisioning",
        orbitSyncEnabled: true,
        metadata: { selectedTrades: request.selectedTrades, billingInterval: request.billingInterval },
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
          selectedTrades: request.selectedTrades.join(','),
          subscriptionTier: request.subscriptionTier,
        },
      });
      
      await db.update(tenants)
        .set({ 
          metadata: { 
            selectedTrades: request.selectedTrades, 
            billingInterval: request.billingInterval,
            checkoutSessionId: session.id 
          } 
        })
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
        const metadata = tenant.metadata as { selectedTrades?: string[]; billingInterval?: string } || {};
        const selectedTrades = metadata.selectedTrades || [];
        const tradeCount = selectedTrades.length;
        const hasPlatform = tenant.subscriptionTier === 'professional' || tenant.subscriptionTier === 'enterprise';
        
        let totalRevenue = 0;
        if (hasPlatform && tradeCount === 7) {
          totalRevenue = tenant.subscriptionTier === 'enterprise' 
            ? COMBO_BUNDLES["enterprise-all-trades"].price 
            : COMBO_BUNDLES["pro-all-trades"].price;
        } else {
          const platformPrice = PLATFORM_TIERS[tenant.subscriptionTier]?.price || 0;
          totalRevenue = platformPrice;
          
          if (tradeCount === 7) {
            totalRevenue += 99;
          } else if (tradeCount >= 3) {
            totalRevenue += 59 + (tradeCount - 3) * 29;
          } else {
            totalRevenue += tradeCount * 29;
          }
        }
        
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
        tradeworksEnabled: request.selectedTrades.length > 0,
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
    const interval = request.billingInterval || 'month';
    const priceKey = interval === 'year' ? 'annual' : 'monthly';
    
    const tradeCount = request.selectedTrades.length;
    const hasPlatform = request.subscriptionTier === 'professional' || request.subscriptionTier === 'enterprise';
    
    if (hasPlatform && tradeCount === 7) {
      const comboKey = request.subscriptionTier === 'enterprise' ? 'enterprise-all-trades' : 'pro-all-trades';
      const combo = COMBO_BUNDLES[comboKey];
      if (combo) {
        items.push({ price: combo[priceKey], quantity: 1 });
        return items;
      }
    }
    
    if (hasPlatform) {
      const platform = PLATFORM_TIERS[request.subscriptionTier];
      if (platform) {
        items.push({ price: platform[priceKey], quantity: 1 });
      }
    }
    
    if (tradeCount === 7) {
      items.push({ price: TRADE_BUNDLES["all-trades"][priceKey], quantity: 1 });
    } else if (tradeCount >= 3) {
      items.push({ price: TRADE_BUNDLES["3-trade"][priceKey], quantity: 1 });
      const extraTrades = tradeCount - 3;
      for (let i = 3; i < tradeCount; i++) {
        const trade = request.selectedTrades[i];
        const estimator = TRADE_ESTIMATORS[trade];
        if (estimator) {
          items.push({ price: estimator[priceKey], quantity: 1 });
        }
      }
    } else if (tradeCount > 0) {
      for (const trade of request.selectedTrades) {
        const estimator = TRADE_ESTIMATORS[trade];
        if (estimator) {
          items.push({ price: estimator[priceKey], quantity: 1 });
        }
      }
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
