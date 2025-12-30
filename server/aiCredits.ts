import { storage } from "./storage";

export const AI_ACTION_COSTS: Record<string, number> = {
  chat_response: 5,
  photo_analysis: 10,
  voice_response: 8,
  document_analysis: 15,
};

export function getActionCost(actionType: string): number {
  return AI_ACTION_COSTS[actionType] ?? 0;
}

export async function checkAndDeductCredits(
  tenantId: string,
  actionType: string
): Promise<{ success: boolean; error?: string; newBalance?: number }> {
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

  const updated = await storage.deductCredits(tenantId, cost);

  if (!updated) {
    return { success: false, error: "Failed to deduct credits" };
  }

  return { success: true, newBalance: updated.balanceCents };
}
