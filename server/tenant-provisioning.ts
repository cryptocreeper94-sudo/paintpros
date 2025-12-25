import { db } from "./db";
import { tenants, trialTenants, users, leads, estimates, blockchainStamps } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { Tenant, TrialTenant, InsertTenant } from "@shared/schema";
import { sendTenantWelcomeEmail, sendAdminNotificationEmail } from "./resend";

// Pricing configuration for each tier
export const SUBSCRIPTION_TIERS = {
  starter: {
    name: "Starter",
    monthlyPrice: 349,
    setupFee: 5000,
    features: {
      estimator: true,
      colorLibrary: true,
      aiVisualizer: false,
      blockchainStamping: false,
      crm: true,
      booking: true,
      messaging: true,
      analytics: false,
    }
  },
  professional: {
    name: "Professional",
    monthlyPrice: 549,
    setupFee: 7000,
    features: {
      estimator: true,
      colorLibrary: true,
      aiVisualizer: true,
      blockchainStamping: true,
      crm: true,
      booking: true,
      messaging: true,
      analytics: true,
    }
  },
  franchise: {
    name: "Franchise Core",
    monthlyPrice: 799,
    setupFee: 10000,
    perLocationPrice: 99,
    features: {
      estimator: true,
      colorLibrary: true,
      aiVisualizer: true,
      blockchainStamping: true,
      crm: true,
      booking: true,
      messaging: true,
      analytics: true,
    }
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 1399,
    setupFee: 15000,
    features: {
      estimator: true,
      colorLibrary: true,
      aiVisualizer: true,
      blockchainStamping: true,
      crm: true,
      booking: true,
      messaging: true,
      analytics: true,
    }
  }
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

interface ProvisioningResult {
  success: boolean;
  tenant?: Tenant;
  error?: string;
  message?: string;
}

interface StripeCheckoutData {
  sessionId: string;
  customerId: string;
  subscriptionId: string;
  planId: SubscriptionTier;
}

export async function provisionTenantFromTrial(
  trialId: string,
  tier: SubscriptionTier,
  stripeData?: StripeCheckoutData
): Promise<ProvisioningResult> {
  console.log(`[Provisioning] Starting tenant provisioning for trial ${trialId}, tier: ${tier}`);

  try {
    // 1. Fetch the trial tenant
    const [trial] = await db.select().from(trialTenants).where(eq(trialTenants.id, trialId));
    
    if (!trial) {
      return { success: false, error: "Trial not found" };
    }

    if (trial.status === "converted") {
      // Check if tenant already exists (idempotency - return existing tenant)
      const existingTenant = await db.select().from(tenants).where(eq(tenants.trialTenantId, trial.id));
      if (existingTenant.length > 0) {
        console.log(`[Provisioning] Trial ${trialId} already converted to tenant ${existingTenant[0].id} (idempotent return)`);
        return { 
          success: true, 
          tenant: existingTenant[0],
          message: `Trial already converted to ${existingTenant[0].companyName}`,
        };
      }
      return { success: false, error: "Trial already converted" };
    }

    // 2. Idempotency check: ensure no tenant was already created for this trial (race condition protection)
    const existingTenantForTrial = await db.select().from(tenants).where(eq(tenants.trialTenantId, trial.id));
    if (existingTenantForTrial.length > 0) {
      console.log(`[Provisioning] Tenant already exists for trial ${trialId}, returning existing (race condition handled)`);
      return {
        success: true,
        tenant: existingTenantForTrial[0],
        message: `Tenant already provisioned for ${trial.companyName}`,
      };
    }

    // 4. Check if slug is already taken by another production tenant
    const existingSlugTenant = await db.select().from(tenants).where(eq(tenants.companySlug, trial.companySlug));
    
    let finalSlug = trial.companySlug;
    if (existingSlugTenant.length > 0) {
      // Append a unique suffix
      finalSlug = `${trial.companySlug}-${Date.now().toString(36)}`;
      console.log(`[Provisioning] Slug collision, using: ${finalSlug}`);
    }

    // 3. Get tier configuration
    const tierConfig = SUBSCRIPTION_TIERS[tier];
    if (!tierConfig) {
      return { success: false, error: `Invalid tier: ${tier}` };
    }

    // 4. Create the production tenant
    const tenantData: InsertTenant = {
      trialTenantId: trial.id,
      ownerEmail: trial.ownerEmail,
      ownerName: trial.ownerName,
      ownerPhone: trial.ownerPhone || undefined,
      companyName: trial.companyName,
      companySlug: finalSlug,
      companyCity: trial.companyCity || undefined,
      companyState: trial.companyState || undefined,
      companyPhone: trial.companyPhone || undefined,
      companyEmail: trial.companyEmail || undefined,
      logoUrl: trial.logoUrl || undefined,
      primaryColor: trial.primaryColor || "#4A5D3E",
      accentColor: trial.accentColor || "#5A6D4E",
      subscriptionTier: tier,
      subscriptionStatus: "active",
      stripeCustomerId: stripeData?.customerId,
      stripeSubscriptionId: stripeData?.subscriptionId,
      monthlyPrice: tierConfig.monthlyPrice.toString(),
      setupFee: tierConfig.setupFee.toString(),
      setupFeePaid: !!stripeData, // If we have Stripe data, setup was paid
      billingCycleStart: new Date(),
      locationCount: 1,
      perLocationPrice: "perLocationPrice" in tierConfig ? tierConfig.perLocationPrice?.toString() : undefined,
      featuresEnabled: tierConfig.features,
      status: "provisioning",
      notes: `Auto-provisioned from trial ${trial.id} on ${new Date().toISOString()}`,
      metadata: {
        trialStartedAt: trial.trialStartedAt,
        trialExpiresAt: trial.trialExpiresAt,
        stripeSessionId: stripeData?.sessionId,
        provisionedAutomatically: true,
      },
    };

    const [newTenant] = await db.insert(tenants).values(tenantData).returning();

    console.log(`[Provisioning] Created tenant ${newTenant.id} for ${newTenant.companyName}`);

    // 5. Create owner user account if doesn't exist
    const existingUser = await db.select().from(users).where(eq(users.email, trial.ownerEmail));
    
    let ownerUserId: string | undefined;
    if (existingUser.length === 0) {
      // Create a new user account for the tenant owner
      const [newUser] = await db.insert(users).values({
        email: trial.ownerEmail,
        firstName: trial.ownerName.split(" ")[0],
        lastName: trial.ownerName.split(" ").slice(1).join(" ") || undefined,
        phone: trial.ownerPhone || undefined,
        role: "owner",
        tenantId: newTenant.id,
        authProvider: "email",
        emailVerified: false, // They'll need to verify
      }).returning();
      
      ownerUserId = newUser.id;
      console.log(`[Provisioning] Created owner user account ${newUser.id}`);
    } else {
      ownerUserId = existingUser[0].id;
      // Update existing user to be owner of this tenant
      await db.update(users)
        .set({ tenantId: newTenant.id, role: "owner" })
        .where(eq(users.id, ownerUserId));
    }

    // 6. Link owner user to tenant
    await db.update(tenants)
      .set({ ownerUserId })
      .where(eq(tenants.id, newTenant.id));

    // 7. Migrate trial data (leads, estimates, blockchain stamps)
    await migrateTrialData(trial.id, trial.companySlug, newTenant.id);

    // 8. Mark tenant as active
    await db.update(tenants)
      .set({ 
        status: "active",
        provisionedAt: new Date(),
        activatedAt: new Date(),
      })
      .where(eq(tenants.id, newTenant.id));

    // 9. Mark trial as converted
    await db.update(trialTenants)
      .set({ 
        status: "converted",
        convertedAt: new Date(),
      })
      .where(eq(trialTenants.id, trial.id));

    console.log(`[Provisioning] Successfully provisioned tenant ${newTenant.id}`);

    // Fetch the updated tenant
    const [finalTenant] = await db.select().from(tenants).where(eq(tenants.id, newTenant.id));

    // 10. Send welcome email to the new tenant owner
    try {
      await sendTenantWelcomeEmail({
        ownerName: finalTenant.ownerName,
        ownerEmail: finalTenant.ownerEmail,
        companyName: finalTenant.companyName,
        companySlug: finalTenant.companySlug,
        subscriptionTier: finalTenant.subscriptionTier,
        monthlyPrice: finalTenant.monthlyPrice || tierConfig.monthlyPrice.toString(),
      });
      console.log(`[Provisioning] Welcome email sent to ${finalTenant.ownerEmail}`);
    } catch (emailError) {
      console.error("[Provisioning] Failed to send welcome email:", emailError);
      // Don't fail provisioning if email fails
    }

    // 11. Send admin notification
    try {
      await sendAdminNotificationEmail({
        type: 'new_tenant',
        tenantName: finalTenant.companyName,
        tenantEmail: finalTenant.ownerEmail,
        details: {
          tenantId: finalTenant.id,
          subscriptionTier: finalTenant.subscriptionTier,
          monthlyPrice: finalTenant.monthlyPrice,
          setupFee: finalTenant.setupFee,
          convertedFrom: trial.id,
          trialUsage: {
            estimates: trial.estimatesUsed,
            leads: trial.leadsUsed,
            stamps: trial.blockchainStampsUsed,
          }
        }
      });
      console.log(`[Provisioning] Admin notification sent`);
    } catch (adminEmailError) {
      console.error("[Provisioning] Failed to send admin notification:", adminEmailError);
    }

    return {
      success: true,
      tenant: finalTenant,
      message: `Successfully provisioned ${tierConfig.name} plan for ${trial.companyName}`,
    };

  } catch (error) {
    console.error("[Provisioning] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown provisioning error",
    };
  }
}

async function migrateTrialData(trialId: string, trialSlug: string, newTenantId: string): Promise<void> {
  console.log(`[Provisioning] Migrating data from trial ${trialId} (slug: ${trialSlug}) to tenant ${newTenantId}`);

  // Trial data may be stored with different tenant ID formats:
  // - trial-{id} format
  // - {slug} format (the company slug)
  // - trial-{slug} format
  // We check all possible formats to ensure complete migration
  
  const possibleTenantIds = [
    `trial-${trialId}`,
    trialSlug,
    `trial-${trialSlug}`,
    trialId,
  ];

  let totalLeads = 0;
  let totalEstimates = 0;
  let totalStamps = 0;

  for (const tenantIdFormat of possibleTenantIds) {
    // Migrate leads
    const matchingLeads = await db.select().from(leads).where(eq(leads.tenantId, tenantIdFormat));
    if (matchingLeads.length > 0) {
      await db.update(leads)
        .set({ tenantId: newTenantId })
        .where(eq(leads.tenantId, tenantIdFormat));
      totalLeads += matchingLeads.length;
    }

    // Migrate estimates
    const matchingEstimates = await db.select().from(estimates).where(eq(estimates.tenantId, tenantIdFormat));
    if (matchingEstimates.length > 0) {
      await db.update(estimates)
        .set({ tenantId: newTenantId })
        .where(eq(estimates.tenantId, tenantIdFormat));
      totalEstimates += matchingEstimates.length;
    }

    // Migrate blockchain stamps
    const matchingStamps = await db.select().from(blockchainStamps).where(eq(blockchainStamps.tenantId, tenantIdFormat));
    if (matchingStamps.length > 0) {
      await db.update(blockchainStamps)
        .set({ tenantId: newTenantId })
        .where(eq(blockchainStamps.tenantId, tenantIdFormat));
      totalStamps += matchingStamps.length;
    }
  }

  console.log(`[Provisioning] Migrated ${totalLeads} leads, ${totalEstimates} estimates, ${totalStamps} blockchain stamps`);
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const [tenant] = await db.select().from(tenants).where(eq(tenants.companySlug, slug));
  return tenant || null;
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
  return tenant || null;
}

export async function updateTenantSubscription(
  tenantId: string,
  updates: {
    subscriptionStatus?: string;
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
  }
): Promise<Tenant | null> {
  const [updated] = await db.update(tenants)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(tenants.id, tenantId))
    .returning();
  
  return updated || null;
}

export async function listActiveTenants(): Promise<Tenant[]> {
  return db.select().from(tenants).where(eq(tenants.status, "active"));
}

export async function suspendTenant(tenantId: string, reason?: string): Promise<boolean> {
  await db.update(tenants)
    .set({ 
      status: "suspended",
      subscriptionStatus: "cancelled",
      notes: reason ? `Suspended: ${reason}` : "Suspended",
      updatedAt: new Date(),
    })
    .where(eq(tenants.id, tenantId));
  
  return true;
}
