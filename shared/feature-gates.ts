import { PricingTier, PRICING_TIERS, getTierById } from './pricing-tiers';

export type FeatureKey = keyof PricingTier['limits'];
export type AIScannerLevel = 'basic' | 'full' | 'priority';

const AI_SCANNER_LEVELS: AIScannerLevel[] = ['basic', 'full', 'priority'];

export interface FeatureGate {
  allowed: boolean;
  limit?: number | 'unlimited';
  level?: AIScannerLevel;
  tierRequired?: string;
  upgradeMessage?: string;
}

export function checkFeatureAccess(
  tierId: string | undefined,
  feature: FeatureKey,
  options?: { requiredLevel?: AIScannerLevel; currentUsage?: number }
): FeatureGate {
  if (!tierId) {
    return {
      allowed: false,
      tierRequired: 'starter',
      upgradeMessage: 'Available with full platform implementation'
    };
  }

  const tier = getTierById(tierId);
  if (!tier) {
    return {
      allowed: false,
      tierRequired: 'starter',
      upgradeMessage: 'Available with full platform implementation'
    };
  }

  const value = tier.limits[feature];

  if (feature === 'aiScannerLevel' && typeof value === 'string') {
    const userLevelIndex = AI_SCANNER_LEVELS.indexOf(value as AIScannerLevel);
    const requiredLevel = options?.requiredLevel || 'basic';
    const requiredLevelIndex = AI_SCANNER_LEVELS.indexOf(requiredLevel);
    
    if (userLevelIndex < requiredLevelIndex) {
      const requiredTier = findMinimumTierForAILevel(requiredLevel);
      return {
        allowed: false,
        level: value as AIScannerLevel,
        tierRequired: requiredTier?.id,
        upgradeMessage: `${requiredLevel} AI Scanner available with ${requiredTier?.name || 'expanded'} implementation`
      };
    }
    return { allowed: true, level: value as AIScannerLevel };
  }

  if (typeof value === 'boolean') {
    if (!value) {
      const requiredTier = findMinimumTierForFeature(feature);
      return {
        allowed: false,
        tierRequired: requiredTier?.id,
        upgradeMessage: `Available with ${requiredTier?.name || 'full'} platform implementation`
      };
    }
    return { allowed: true };
  }

  if (typeof value === 'number') {
    if (value === 0) {
      const requiredTier = findMinimumTierForFeature(feature);
      return {
        allowed: false,
        limit: 0,
        tierRequired: requiredTier?.id,
        upgradeMessage: `Available with ${requiredTier?.name || 'full'} platform implementation`
      };
    }
    
    if (options?.currentUsage !== undefined && options.currentUsage >= value) {
      const nextTier = findNextTierWithHigherLimit(tierId, feature);
      return {
        allowed: false,
        limit: value,
        tierRequired: nextTier?.id,
        upgradeMessage: `Monthly limit reached. Additional capacity available with expanded implementation.`
      };
    }
    
    return { allowed: true, limit: value };
  }

  if (value === 'unlimited') {
    return { allowed: true, limit: 'unlimited' };
  }

  return { allowed: true };
}

function findMinimumTierForAILevel(level: AIScannerLevel): PricingTier | undefined {
  const requiredIndex = AI_SCANNER_LEVELS.indexOf(level);
  for (const tier of PRICING_TIERS) {
    const tierLevel = tier.limits.aiScannerLevel;
    const tierIndex = AI_SCANNER_LEVELS.indexOf(tierLevel);
    if (tierIndex >= requiredIndex) return tier;
  }
  return undefined;
}

function findNextTierWithHigherLimit(currentTierId: string, feature: FeatureKey): PricingTier | undefined {
  const currentTier = getTierById(currentTierId);
  if (!currentTier) return undefined;
  
  const currentValue = currentTier.limits[feature];
  const currentIndex = PRICING_TIERS.findIndex(t => t.id === currentTierId);
  
  for (let i = currentIndex + 1; i < PRICING_TIERS.length; i++) {
    const nextValue = PRICING_TIERS[i].limits[feature];
    if (nextValue === 'unlimited') return PRICING_TIERS[i];
    if (typeof nextValue === 'number' && typeof currentValue === 'number' && nextValue > currentValue) {
      return PRICING_TIERS[i];
    }
  }
  return undefined;
}

export function findMinimumTierForFeature(feature: FeatureKey): PricingTier | undefined {
  for (const tier of PRICING_TIERS) {
    const value = tier.limits[feature];
    if (typeof value === 'boolean' && value) return tier;
    if (typeof value === 'number' && value > 0) return tier;
    if (value === 'unlimited') return tier;
  }
  return undefined;
}

export function canAccessFeature(tierId: string | undefined, feature: FeatureKey): boolean {
  return checkFeatureAccess(tierId, feature).allowed;
}

export function getFeatureLimit(tierId: string | undefined, feature: FeatureKey): number | 'unlimited' | null {
  const gate = checkFeatureAccess(tierId, feature);
  if (!gate.allowed) return null;
  return gate.limit ?? null;
}

export function isWithinLimit(
  tierId: string | undefined,
  feature: FeatureKey,
  currentUsage: number
): boolean {
  const limit = getFeatureLimit(tierId, feature);
  if (limit === null) return false;
  if (limit === 'unlimited') return true;
  return currentUsage < limit;
}

export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  estimatesPerMonth: 'Monthly estimate limit',
  teamMembers: 'Team members allowed',
  aiScannerLevel: 'AI Scanner capability level',
  multiRoomScanner: 'Scan multiple rooms at once',
  crmAccess: 'Customer relationship management',
  onlineBooking: 'Let customers book online',
  crewManagement: 'Manage crews and schedules',
  blockchainStamps: 'Blockchain document verification',
  whiteLabel: 'Remove PaintPros branding',
  apiAccess: 'API integration access',
  prioritySupport: 'Priority customer support',
  dedicatedAccount: 'Dedicated account manager'
};
