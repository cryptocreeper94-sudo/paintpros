export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  standardMonthlyPrice: number;
  standardAnnualPrice: number;
  features: string[];
  limits: {
    estimatesPerMonth: number | 'unlimited';
    teamMembers: number | 'unlimited';
    aiScannerLevel: 'basic' | 'full' | 'priority';
    multiRoomScanner: boolean;
    crmAccess: boolean;
    onlineBooking: boolean;
    crewManagement: boolean;
    blockchainStamps: number | 'unlimited';
    whiteLabel: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    dedicatedAccount: boolean;
  };
  popular?: boolean;
  ctaText: string;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
}

export const FOUNDERS_CLUB_LIMIT = 100;
export const FOUNDERS_CLUB_ACTIVE = true;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for solo painters',
    monthlyPrice: 199,
    annualPrice: 1990,
    annualSavings: 398,
    standardMonthlyPrice: 399,
    standardAnnualPrice: 3990,
    features: [
      '25 estimates per month',
      'Basic AI Room Scanner',
      'Professional proposals',
      'Email support',
      'Mobile-friendly',
      'Customer portal'
    ],
    limits: {
      estimatesPerMonth: 25,
      teamMembers: 1,
      aiScannerLevel: 'basic',
      multiRoomScanner: false,
      crmAccess: false,
      onlineBooking: false,
      crewManagement: false,
      blockchainStamps: 0,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: false,
      dedicatedAccount: false
    },
    ctaText: 'Join Founders Club'
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For growing painting companies',
    monthlyPrice: 499,
    annualPrice: 4990,
    annualSavings: 998,
    standardMonthlyPrice: 799,
    standardAnnualPrice: 7990,
    features: [
      'Unlimited estimates',
      'Full AI Scanner with calibration',
      'Wall surface area calculation',
      'CRM & lead tracking',
      'Up to 5 team members',
      'Priority email support',
      'Color visualizer'
    ],
    limits: {
      estimatesPerMonth: 'unlimited',
      teamMembers: 5,
      aiScannerLevel: 'full',
      multiRoomScanner: false,
      crmAccess: true,
      onlineBooking: false,
      crewManagement: false,
      blockchainStamps: 0,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: true,
      dedicatedAccount: false
    },
    popular: true,
    ctaText: 'Join Founders Club'
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For established contractors',
    monthlyPrice: 799,
    annualPrice: 7990,
    annualSavings: 1598,
    standardMonthlyPrice: 1299,
    standardAnnualPrice: 12990,
    features: [
      'Everything in Professional',
      'Multi-Room Scanner (Priority)',
      'Online booking system',
      'Crew management & scheduling',
      'Up to 15 team members',
      '25 blockchain doc stamps/mo',
      'Dedicated support',
      'Internal messaging'
    ],
    limits: {
      estimatesPerMonth: 'unlimited',
      teamMembers: 15,
      aiScannerLevel: 'full',
      multiRoomScanner: true,
      crmAccess: true,
      onlineBooking: true,
      crewManagement: true,
      blockchainStamps: 25,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: true,
      dedicatedAccount: true
    },
    ctaText: 'Join Founders Club'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For franchises & property mgmt',
    monthlyPrice: 1499,
    annualPrice: 14990,
    annualSavings: 2998,
    standardMonthlyPrice: 2499,
    standardAnnualPrice: 24990,
    features: [
      'Everything in Business',
      'Unlimited team members',
      'White-label branding',
      'API access',
      'Unlimited blockchain stamps',
      'Multi-location support',
      'Custom integrations',
      'Dedicated account manager',
      'Franchise support'
    ],
    limits: {
      estimatesPerMonth: 'unlimited',
      teamMembers: 'unlimited',
      aiScannerLevel: 'priority',
      multiRoomScanner: true,
      crmAccess: true,
      onlineBooking: true,
      crewManagement: true,
      blockchainStamps: 'unlimited',
      whiteLabel: true,
      apiAccess: true,
      prioritySupport: true,
      dedicatedAccount: true
    },
    ctaText: 'Contact Sales'
  }
];

export function getTierById(id: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === id);
}

export function getFeatureLimitDisplay(tier: PricingTier, feature: keyof PricingTier['limits']): string {
  const value = tier.limits[feature];
  if (value === 'unlimited') return 'Unlimited';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}
