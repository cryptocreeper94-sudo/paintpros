export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
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

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for solo painters',
    monthlyPrice: 49,
    annualPrice: 470,
    annualSavings: 118,
    features: [
      '15 estimates per month',
      'Basic AI Room Scanner',
      'Professional proposals',
      'Email support',
      'Mobile-friendly'
    ],
    limits: {
      estimatesPerMonth: 15,
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
    ctaText: 'Start Free Trial'
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'For growing painting companies',
    monthlyPrice: 99,
    annualPrice: 950,
    annualSavings: 238,
    features: [
      'Unlimited estimates',
      'Full AI Scanner with calibration',
      'Wall surface area calculation',
      'CRM & lead tracking',
      'Up to 3 team members',
      'Priority email support'
    ],
    limits: {
      estimatesPerMonth: 'unlimited',
      teamMembers: 3,
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
    ctaText: 'Start Free Trial'
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For established contractors',
    monthlyPrice: 199,
    annualPrice: 1910,
    annualSavings: 478,
    features: [
      'Everything in Professional',
      'Multi-Room Scanner (Priority)',
      'Online booking system',
      'Crew management & scheduling',
      'Up to 10 team members',
      '10 blockchain doc stamps/mo',
      'Dedicated support'
    ],
    limits: {
      estimatesPerMonth: 'unlimited',
      teamMembers: 10,
      aiScannerLevel: 'full',
      multiRoomScanner: true,
      crmAccess: true,
      onlineBooking: true,
      crewManagement: true,
      blockchainStamps: 10,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: true,
      dedicatedAccount: true
    },
    ctaText: 'Start Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For franchises & property mgmt',
    monthlyPrice: 399,
    annualPrice: 3830,
    annualSavings: 958,
    features: [
      'Everything in Business',
      'Unlimited team members',
      'White-label branding',
      'API access',
      'Unlimited blockchain stamps',
      'Multi-location support',
      'Custom integrations',
      'Dedicated account manager'
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
