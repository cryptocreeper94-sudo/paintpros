import { storage } from "./storage";

export const AI_ACTION_COSTS: Record<string, number> = {
  chat_response: 5,
  photo_analysis: 10,
  voice_response: 8,
  document_analysis: 15,
};

export const CREDIT_PACKS: Record<string, { amountCents: number; label: string }> = {
  starter: { amountCents: 1000, label: 'Starter Pack - $10' },
  value: { amountCents: 2500, label: 'Value Pack - $25' },
  pro: { amountCents: 5000, label: 'Pro Pack - $50' },
  business: { amountCents: 10000, label: 'Business Pack - $100' }
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

  const tenantCreditsRecord = await storage.getTenantCredits(tenantId);

  if (!tenantCreditsRecord) {
    return { success: false, error: "Tenant credits not found. Please purchase credits to continue." };
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
