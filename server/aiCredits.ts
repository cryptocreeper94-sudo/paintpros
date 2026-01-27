import { storage } from "./storage";

export const AI_ACTION_COSTS: Record<string, number> = {
  chat_response: 5,
  photo_analysis: 10,
  voice_response: 8,
  document_analysis: 15,
  live_translation_minute: 50, // ~$0.50/min - includes STT + translation + TTS
  // Trade Toolkit tools
  measure_scan: 5,           // Room measurement scan
  color_match: 8,            // Color matching from camera
  room_visualizer: 10,       // Visualize colors on walls
  complete_estimate: 15,     // Generate complete estimate package
};

export const CREDIT_PACKS: Record<string, { 
  amountCents: number; 
  label: string; 
  priceId: string;
  productId: string;
}> = {
  starter: { 
    amountCents: 1000, 
    label: 'Starter Pack - $10',
    priceId: 'price_1SlCL0PQpkkF93FKHmRequxm',
    productId: 'prod_TidcHchxkxT0mS'
  },
  value: { 
    amountCents: 2500, 
    label: 'Value Pack - $25',
    priceId: 'price_1SlCL1PQpkkF93FKC8Sj886m',
    productId: 'prod_Tidc5VTXha0kjm'
  },
  pro: { 
    amountCents: 5000, 
    label: 'Pro Pack - $50',
    priceId: 'price_1SlCL2PQpkkF93FKq3WySCsz',
    productId: 'prod_TidcfZac0yw1Wd'
  },
  business: { 
    amountCents: 10000, 
    label: 'Business Pack - $100',
    priceId: 'price_1SlCL3PQpkkF93FKSwtcdiLH',
    productId: 'prod_TidcknVUI06OGI'
  }
};

export const SUBSCRIPTION_TIERS: Record<string, {
  name: string;
  monthlyPriceId: string;
  annualPriceId: string;
  monthlyAmount: number;
  annualAmount: number;
  productId: string;
}> = {
  estimator_only: {
    name: 'Estimator Tool',
    monthlyPriceId: 'price_1SlCL4PQpkkF93FKJ5F9y9sC',
    annualPriceId: 'price_1SlCL4PQpkkF93FKVaopUqqO',
    monthlyAmount: 2900,
    annualAmount: 29000,
    productId: 'prod_TidcZLYvHjoGku'
  },
  full_suite: {
    name: 'Full Suite',
    monthlyPriceId: 'price_1SlCL5PQpkkF93FKe0aUduOg',
    annualPriceId: 'price_1SlCL5PQpkkF93FKYh5D4Tj7',
    monthlyAmount: 19900,
    annualAmount: 199000,
    productId: 'prod_TidcccTbdU7gJT'
  },
  franchise: {
    name: 'Franchise License',
    monthlyPriceId: 'price_1SlCL6PQpkkF93FKuFz2kDcu',
    annualPriceId: 'price_1SlCL6PQpkkF93FKTKOkcU9A',
    monthlyAmount: 49900,
    annualAmount: 499000,
    productId: 'prod_TidcGbEKJECTYU'
  }
};

export function getActionCost(actionType: string): number {
  return AI_ACTION_COSTS[actionType] ?? 0;
}

export async function checkCredits(
  tenantId: string,
  actionType: string
): Promise<{ success: boolean; error?: string; currentBalance?: number; cost?: number }> {
  const cost = getActionCost(actionType);

  if (cost === 0) {
    return { success: false, error: `Unknown action type: ${actionType}` };
  }

  let tenantCreditsRecord = await storage.getTenantCredits(tenantId);

  if (!tenantCreditsRecord) {
    const knownTenants = ['demo', 'npp'];
    if (knownTenants.includes(tenantId)) {
      tenantCreditsRecord = await storage.createTenantCredits({
        tenantId,
        balanceCents: 10000,
        totalPurchasedCents: 10000,
        totalUsedCents: 0,
      });
      console.log(`[AI Credits] Auto-seeded $100 credits for tenant: ${tenantId}`);
    }
    
    if (!tenantCreditsRecord) {
      return { success: false, error: "Tenant credits not found. Please purchase credits to continue." };
    }
  }

  if (tenantCreditsRecord.balanceCents < cost) {
    return {
      success: false,
      error: `Insufficient credits. This action costs ${cost} cents but you only have ${tenantCreditsRecord.balanceCents} cents remaining.`,
    };
  }

  return { success: true, currentBalance: tenantCreditsRecord.balanceCents, cost };
}

export async function deductCreditsAfterUsage(
  tenantId: string,
  actionType: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
  const cost = getActionCost(actionType);

  if (cost === 0) {
    return { success: false, error: `Unknown action type: ${actionType}` };
  }

  const updated = await storage.deductCredits(tenantId, cost);

  if (!updated) {
    return { success: false, error: "Failed to deduct credits" };
  }

  await storage.logAiUsage({
    tenantId,
    actionType,
    costCents: cost,
    balanceAfterCents: updated.balanceCents,
    metadata: metadata || {}
  });

  return { success: true, newBalance: updated.balanceCents };
}
