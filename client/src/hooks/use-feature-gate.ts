import { useTenant } from '@/context/TenantContext';
import { 
  FeatureKey, 
  FeatureGate, 
  AIScannerLevel,
  checkFeatureAccess, 
  canAccessFeature, 
  getFeatureLimit,
  isWithinLimit,
  FEATURE_DESCRIPTIONS
} from '@shared/feature-gates';

export function useFeatureGate() {
  const tenant = useTenant();
  const subscriptionTier: string = tenant?.id === 'npp' ? 'enterprise' : 'starter';

  const checkFeature = (
    feature: FeatureKey, 
    options?: { requiredLevel?: AIScannerLevel; currentUsage?: number }
  ): FeatureGate => {
    return checkFeatureAccess(subscriptionTier, feature, options);
  };

  const hasFeature = (feature: FeatureKey): boolean => {
    return canAccessFeature(subscriptionTier, feature);
  };

  const getLimit = (feature: FeatureKey): number | 'unlimited' | null => {
    return getFeatureLimit(subscriptionTier, feature);
  };

  const checkUsageLimit = (feature: FeatureKey, currentUsage: number): boolean => {
    return isWithinLimit(subscriptionTier, feature, currentUsage);
  };

  const getFeatureDescription = (feature: FeatureKey): string => {
    return FEATURE_DESCRIPTIONS[feature];
  };

  const checkAIScanner = (requiredLevel: AIScannerLevel): FeatureGate => {
    return checkFeatureAccess(subscriptionTier, 'aiScannerLevel', { requiredLevel });
  };

  const checkUsageWithLimit = (feature: FeatureKey, currentUsage: number): FeatureGate => {
    return checkFeatureAccess(subscriptionTier, feature, { currentUsage });
  };

  return {
    subscriptionTier,
    checkFeature,
    hasFeature,
    getLimit,
    checkUsageLimit,
    checkAIScanner,
    checkUsageWithLimit,
    getFeatureDescription,
    isEnterprise: subscriptionTier === 'enterprise',
    isBusiness: subscriptionTier === 'business' || subscriptionTier === 'enterprise',
    isPro: ['professional', 'business', 'enterprise'].includes(subscriptionTier),
  };
}

export type { FeatureKey, FeatureGate, AIScannerLevel };
