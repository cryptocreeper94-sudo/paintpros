export type SubscriptionTier = "estimator_only" | "full_suite";

export type TradeVertical = "painting" | "roofing" | "hvac" | "electrical" | "plumbing" | "landscaping" | "construction" | "multi_trade";

export type BrandingModel = "franchise" | "custom";

export interface FranchiseConfig {
  cityPrefix: string;
  parentBrand: string;
  territory: string[];
  monthlyFee: number;
  setupFee: number;
}

export interface CustomBrandConfig {
  domain: string;
  monthlyFee: number;
  setupFee: number;
}

export interface TenantConfig {
  // Trade vertical (determines service categories)
  tradeVertical?: TradeVertical;
  id: string;
  slug: string;
  
  // Branding model (franchise = [city]paintpros.io, custom = their own brand)
  // Defaults to "custom" if not specified
  brandingModel?: BrandingModel;
  franchiseConfig?: FranchiseConfig;
  customBrandConfig?: CustomBrandConfig;
  
  // Subscription tier (determines available features)
  subscriptionTier: SubscriptionTier;
  
  // Branding
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  
  // Contact
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
    zip?: string;
  };
  
  // Social
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    google?: string;
    googleReviews?: string;
  };
  
  // Theme
  theme: {
    primaryColor: string;
    accentColor: string;
    darkMode: {
      background: string;
      foreground: string;
    };
    lightMode: {
      background: string;
      foreground: string;
    };
  };
  
  // Services offered
  services: {
    interiorPainting: boolean;
    exteriorPainting: boolean;
    commercialPainting: boolean;
    residentialPainting: boolean;
    trimAndMolding: boolean;
    ceilings: boolean;
    doors: boolean;
    drywallRepair: boolean;
    cabinetPainting: boolean;
    deckStaining: boolean;
    pressureWashing: boolean;
  };
  
  // Pricing (can be customized per tenant)
  pricing: {
    doorsPerUnit: number;
    wallsPerSqFt: number;
    fullJobPerSqFt: number;
    ceilingsPerSqFt?: number;
    trimPerLinearFt?: number;
  };
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    serviceAreas: string[];
  };
  
  // Features enabled
  features: {
    estimator: boolean;
    portfolio: boolean;
    reviews: boolean;
    blog: boolean;
    onlineBooking: boolean;
    aiAssistant: boolean;
  };
  
  // Credentials/ratings
  credentials: {
    googleRating?: number;
    reviewCount?: number;
    yearsInBusiness?: number;
    warrantyYears?: number;
    licensed?: boolean;
    insured?: boolean;
    bonded?: boolean;
  };
  
  // Stripe configuration (multi-tenant billing)
  stripe?: {
    // If true, use platform's Stripe keys (for demo/TrustLayer)
    usePlatformKeys?: boolean;
    // Environment variable names for tenant-specific keys (not actual keys)
    publishableKeyEnv?: string;
    secretKeyEnv?: string;
    webhookSecretEnv?: string;
    // Account status
    configured?: boolean;
  };
}

// Nash PaintPros - Lead Generation & Affiliate Marketing Site (nashpaintpros.io)
export const nashPaintPros: TenantConfig = {
  id: "npp",
  slug: "nashville-paintpros",
  brandingModel: "franchise",
  franchiseConfig: {
    cityPrefix: "nash",
    parentBrand: "PaintPros",
    territory: ["Nashville", "Brentwood", "Belle Meade", "Green Hills", "Sylvan Park"],
    monthlyFee: 299,
    setupFee: 499,
  },
  subscriptionTier: "full_suite",
  
  name: "Nash PaintPros",
  tagline: "Find Your Contractor. Find Your Customer.",
  description: "Nashville's lead generation and contractor marketplace. Find trusted painting professionals or grow your contracting business with Nash PaintPros. Powered by TradeWorks AI field tools.",
  logo: "/icons/npp-mascot.png",
  
  phone: "(615) 555-PAINT",
  email: "team@dwsc.io",
  address: {
    city: "Nashville",
    state: "TN",
  },
  
  social: {
    googleReviews: "",
    facebook: "https://www.facebook.com/profile.php?id=61585553137979",
    instagram: "",
    twitter: "https://x.com/TrustSignal26",
  },
  
  theme: {
    primaryColor: "hsl(215, 50%, 45%)", // Navy blue
    accentColor: "hsl(215, 40%, 55%)", // Lighter navy
    darkMode: {
      background: "hsl(222, 47%, 11%)", // Deep navy
      foreground: "hsl(210, 40%, 98%)", // Clean white
    },
    lightMode: {
      background: "hsl(210, 40%, 98%)", // Clean white
      foreground: "hsl(222, 47%, 11%)", // Deep navy text
    },
  },
  
  services: {
    interiorPainting: true,
    exteriorPainting: true,
    commercialPainting: true,
    residentialPainting: true,
    trimAndMolding: true,
    ceilings: true,
    doors: true,
    drywallRepair: true,
    cabinetPainting: false,
    deckStaining: false,
    pressureWashing: false,
  },
  
  pricing: {
    doorsPerUnit: 150,
    wallsPerSqFt: 2.50,
    ceilingsPerSqFt: 3.00,
    trimPerLinearFt: 2.50,
    fullJobPerSqFt: 5.00,
  },
  
  seo: {
    title: "Nash PaintPros | Find Painters & Contractors in Nashville",
    description: "Nashville's contractor marketplace and lead generation platform. Find trusted painting professionals or grow your contracting business. Powered by TradeWorks AI.",
    keywords: [
      "Nashville painters",
      "find a contractor Nashville",
      "painting leads",
      "contractor marketplace",
      "TradeWorks AI",
      "Nash PaintPros",
      "home services Nashville",
    ],
    serviceAreas: ["Nashville", "Brentwood", "Belle Meade", "Green Hills", "Sylvan Park", "12 South", "East Nashville"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: false,
    aiAssistant: true,
  },
  
  credentials: {
    googleRating: 4.9,
    reviewCount: 100,
    yearsInBusiness: undefined,
    warrantyYears: 3,
    licensed: true,
    insured: true,
    bonded: false,
  },
  
  // NPP has their own Stripe account - needs to be configured
  stripe: {
    usePlatformKeys: false,
    publishableKeyEnv: "NPP_STRIPE_PUBLISHABLE_KEY",
    secretKeyEnv: "NPP_STRIPE_SECRET_KEY",
    webhookSecretEnv: "NPP_STRIPE_WEBHOOK_SECRET",
    configured: false, // Set to true once NPP provides their keys
  },
};

// TLId.io / TrustLayer Marketing Platform
export const paintProsDemo: TenantConfig = {
  id: "demo",
  slug: "tlid",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer",
  tagline: "Complete Business Trust Platform",
  description: "TrustLayer is a complete self-service automated digital marketing platform with Meta Business Suite integration. Anti-fraud protection, document verification, and blockchain stamping built-in.",
  logo: "/icons/trustlayer-shield.png",
  
  phone: "(888) TRUST-01",
  email: "hello@tlid.io",
  
  theme: {
    primaryColor: "hsl(190, 85%, 50%)", // Cyan
    accentColor: "hsl(260, 65%, 60%)", // Lavender purple
    darkMode: {
      background: "hsl(230, 45%, 10%)", // Deep dark blue
      foreground: "hsl(210, 40%, 98%)", // Clean white
    },
    lightMode: {
      background: "hsl(230, 25%, 97%)", // Cool light blue-white
      foreground: "hsl(230, 45%, 15%)", // Dark blue text
    },
  },
  
  services: {
    interiorPainting: true,
    exteriorPainting: true,
    commercialPainting: true,
    residentialPainting: true,
    trimAndMolding: true,
    ceilings: true,
    doors: true,
    drywallRepair: true,
    cabinetPainting: true,
    deckStaining: true,
    pressureWashing: true,
  },
  
  pricing: {
    doorsPerUnit: 150,
    wallsPerSqFt: 2.50,
    fullJobPerSqFt: 5.00,
    ceilingsPerSqFt: 1.75,
    trimPerLinearFt: 3.00,
  },
  
  seo: {
    title: "PaintPros.io | White-Label Painting Business Platform",
    description: "The complete SaaS platform for painting professionals. Instant estimates, CRM, scheduling, payments, and more. Built by Orbit.",
    keywords: ["painting software", "contractor platform", "painting business", "home services SaaS", "white-label website"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    googleRating: 5.0,
    reviewCount: 250,
    yearsInBusiness: 1,
    warrantyYears: 5,
    licensed: true,
    insured: true,
    bonded: true,
  },
  
  // Demo/TrustLayer uses platform Stripe keys (your business account)
  stripe: {
    usePlatformKeys: true,
    configured: true,
  },
};

// Paint Pros Co - Main brand at paintpros.io (formerly Lume)
export const lumePaintCo: TenantConfig = {
  id: "paintprosco",
  slug: "paint-pros-co",
  brandingModel: "custom",
  subscriptionTier: "full_suite",
  tradeVertical: "painting",
  
  name: "Paint Pros Co",
  tagline: "Elevating the backdrop of your life.",
  description: "Premium painting services that elevate your space. Professional interior and exterior painting with meticulous attention to detail.",
  logo: "/icons/paintpros-logo.png",
  
  phone: "(888) PAINT-PRO",
  email: "hello@paintpros.io",
  address: {
    city: "Nashville",
    state: "TN",
  },
  
  social: {
    googleReviews: "",
    facebook: "https://facebook.com/paintprosco",
    twitter: "https://twitter.com/paintprosco",
    instagram: "https://instagram.com/paintprosco",
  },
  
  theme: {
    primaryColor: "hsl(215, 50%, 45%)", // Navy blue
    accentColor: "hsl(215, 40%, 55%)", // Lighter navy
    darkMode: {
      background: "hsl(222, 47%, 11%)", // Deep navy
      foreground: "hsl(210, 40%, 98%)", // Clean white
    },
    lightMode: {
      background: "hsl(210, 40%, 98%)", // Clean white
      foreground: "hsl(222, 47%, 11%)", // Deep navy text
    },
  },
  
  services: {
    interiorPainting: true,
    exteriorPainting: true,
    commercialPainting: true,
    residentialPainting: true,
    trimAndMolding: true,
    ceilings: true,
    doors: true,
    drywallRepair: true,
    cabinetPainting: false,
    deckStaining: false,
    pressureWashing: false,
  },
  
  pricing: {
    doorsPerUnit: 150,
    wallsPerSqFt: 2.50,
    ceilingsPerSqFt: 3.00,
    trimPerLinearFt: 2.50,
    fullJobPerSqFt: 5.00,
  },
  
  seo: {
    title: "Paint Pros Co | Elevating the Backdrop of Your Life",
    description: "Premium painting services that elevate your space. Professional interior and exterior painting with meticulous attention to detail. Free estimates available.",
    keywords: [
      "professional painters",
      "Paint Pros Co",
      "interior painting",
      "exterior painting",
      "house painters",
      "residential painting",
      "commercial painting",
    ],
    serviceAreas: ["Nashville", "Middle Tennessee", "Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: false,
    aiAssistant: true,
  },
  
  credentials: {
    googleRating: 5.0,
    reviewCount: 0,
    yearsInBusiness: 1,
    warrantyYears: 3,
    licensed: true,
    insured: true,
    bonded: false,
  },
  
  // Lume has their own Stripe account - needs to be configured
  stripe: {
    usePlatformKeys: false,
    publishableKeyEnv: "LUME_STRIPE_PUBLISHABLE_KEY",
    secretKeyEnv: "LUME_STRIPE_SECRET_KEY",
    webhookSecretEnv: "LUME_STRIPE_WEBHOOK_SECRET",
    configured: false, // Set to true once Lume provides their keys
  },
};

// Estimator-Only Template (for standalone estimator subscribers)
export const estimatorOnlyTemplate: Partial<TenantConfig> = {
  subscriptionTier: "estimator_only",
  features: {
    estimator: true,
    portfolio: false,
    reviews: false,
    blog: false,
    onlineBooking: false,
    aiAssistant: true, // AI included with credits
  },
};

// Helper to create an estimator-only tenant from base config
export function createEstimatorOnlyTenant(
  baseConfig: Partial<TenantConfig> & { id: string; name: string }
): TenantConfig {
  return {
    ...paintProsDemo, // Use demo as base
    ...baseConfig,
    subscriptionTier: "estimator_only",
    features: {
      estimator: true,
      portfolio: false,
      reviews: false,
      blog: false,
      onlineBooking: false,
      aiAssistant: true,
    },
  } as TenantConfig;
}

// TradeWorks AI tenant (standalone product)
export const tradeWorksAI: TenantConfig = {
  id: "tradeworks",
  slug: "tradeworks-ai",
  subscriptionTier: "full_suite",
  
  name: "TradeWorks AI",
  tagline: "The Professional Field Toolkit",
  description: "85+ calculators for 8 trades with AI-powered voice assistant, color matching, and store finder.",
  
  theme: {
    primaryColor: "#f59e0b",
    accentColor: "#3b82f6",
    darkMode: {
      background: "#0f172a",
      foreground: "#f1f5f9",
    },
    lightMode: {
      background: "#f8fafc",
      foreground: "#0f172a",
    },
  },
  
  services: {
    interiorPainting: true,
    exteriorPainting: true,
    commercialPainting: true,
    residentialPainting: true,
    trimAndMolding: true,
    ceilings: true,
    doors: true,
    drywallRepair: true,
    cabinetPainting: true,
    deckStaining: true,
    pressureWashing: true,
  },
  
  pricing: {
    doorsPerUnit: 150,
    wallsPerSqFt: 3.5,
    fullJobPerSqFt: 5.0,
  },
  
  seo: {
    title: "TradeWorks AI | Professional Field Toolkit for 8 Trades",
    description: "85+ calculators with AI voice assistant. Painting, electrical, plumbing, HVAC, roofing, carpentry, concrete, landscaping.",
    keywords: ["trade calculator", "field toolkit", "contractor app", "AI assistant", "construction calculator"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: false,
    reviews: false,
    blog: false,
    onlineBooking: false,
    aiAssistant: true,
  },
  
  credentials: {},
};

// TrustLayer Roofing - Roofing trade vertical
export const roofPros: TenantConfig = {
  id: "roofpros",
  slug: "roofpros",
  tradeVertical: "roofing",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer Roofing",
  tagline: "Trusted Roofing Professionals",
  description: "Connecting you with trusted roofing professionals. Residential and commercial roofing, repairs, inspections, and installations.",
  
  theme: {
    primaryColor: "#dc2626",
    accentColor: "#f59e0b",
    darkMode: {
      background: "#1a1a1a",
      foreground: "#ffffff",
    },
    lightMode: {
      background: "#ffffff",
      foreground: "#1a1a1a",
    },
  },
  
  services: {
    interiorPainting: false,
    exteriorPainting: false,
    commercialPainting: false,
    residentialPainting: false,
    trimAndMolding: false,
    ceilings: false,
    doors: false,
    drywallRepair: false,
    cabinetPainting: false,
    deckStaining: false,
    pressureWashing: false,
  },
  
  pricing: {
    doorsPerUnit: 0,
    wallsPerSqFt: 0,
    fullJobPerSqFt: 8.5,
  },
  
  seo: {
    title: "TrustLayer Roofing | Trusted Roofing Professionals",
    description: "Connect with trusted roofing professionals. Free inspections, quality repairs, and complete roof installations for residential and commercial properties.",
    keywords: ["trusted roofing", "roof repair", "roof installation", "roof inspection", "commercial roofing", "residential roofing", "trustlayer"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    licensed: true,
    insured: true,
    bonded: true,
  },
};

// TrustLayer HVAC - HVAC trade vertical
export const hvacPros: TenantConfig = {
  id: "hvacpros",
  slug: "hvacpros",
  tradeVertical: "hvac",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer HVAC",
  tagline: "Trusted Climate Experts",
  description: "Connecting you with trusted HVAC professionals. Heating, ventilation, and air conditioning installation, repair, and maintenance.",
  
  theme: {
    primaryColor: "#0ea5e9",
    accentColor: "#f97316",
    darkMode: {
      background: "#0c1929",
      foreground: "#f0f9ff",
    },
    lightMode: {
      background: "#f0f9ff",
      foreground: "#0c1929",
    },
  },
  
  services: {
    interiorPainting: false,
    exteriorPainting: false,
    commercialPainting: false,
    residentialPainting: false,
    trimAndMolding: false,
    ceilings: false,
    doors: false,
    drywallRepair: false,
    cabinetPainting: false,
    deckStaining: false,
    pressureWashing: false,
  },
  
  pricing: {
    doorsPerUnit: 0,
    wallsPerSqFt: 0,
    fullJobPerSqFt: 0,
  },
  
  seo: {
    title: "TrustLayer HVAC | Trusted Climate Experts",
    description: "Connect with trusted HVAC professionals. AC repair, heating installation, and maintenance. 24/7 emergency services available.",
    keywords: ["trusted hvac", "air conditioning", "heating", "ac repair", "furnace", "heat pump", "ductwork", "trustlayer"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    licensed: true,
    insured: true,
    bonded: true,
  },
};

// TrustLayer Electric - Electrical trade vertical
export const electricPros: TenantConfig = {
  id: "electricpros",
  slug: "electricpros",
  tradeVertical: "electrical",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer Electric",
  tagline: "Trusted Electrical Professionals",
  description: "Connecting you with licensed electrical contractors. Residential and commercial electrical services, installations, repairs, and upgrades.",
  
  theme: {
    primaryColor: "#eab308",
    accentColor: "#3b82f6",
    darkMode: {
      background: "#171717",
      foreground: "#fefce8",
    },
    lightMode: {
      background: "#fefce8",
      foreground: "#171717",
    },
  },
  
  services: {
    interiorPainting: false,
    exteriorPainting: false,
    commercialPainting: false,
    residentialPainting: false,
    trimAndMolding: false,
    ceilings: false,
    doors: false,
    drywallRepair: false,
    cabinetPainting: false,
    deckStaining: false,
    pressureWashing: false,
  },
  
  pricing: {
    doorsPerUnit: 0,
    wallsPerSqFt: 0,
    fullJobPerSqFt: 0,
  },
  
  seo: {
    title: "TrustLayer Electric | Trusted Electrical Professionals",
    description: "Connect with licensed electrical contractors. Panel upgrades, rewiring, EV charger installation, and emergency repairs.",
    keywords: ["trusted electrician", "electrical contractor", "wiring", "panel upgrade", "ev charger", "electrical repair", "trustlayer"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    licensed: true,
    insured: true,
    bonded: true,
  },
};

// TrustLayer Plumbing - Plumbing trade vertical
export const plumbPros: TenantConfig = {
  id: "plumbpros",
  slug: "plumbpros",
  tradeVertical: "plumbing",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer Plumbing",
  tagline: "Trusted Plumbing Professionals",
  description: "Connecting you with trusted plumbing professionals. Repairs, installations, and emergency services for residential and commercial properties.",
  
  theme: {
    primaryColor: "#2563eb",
    accentColor: "#3b82f6",
    darkMode: {
      background: "#0f172a",
      foreground: "#dbeafe",
    },
    lightMode: {
      background: "#dbeafe",
      foreground: "#0f172a",
    },
  },
  
  services: {
    interiorPainting: false,
    exteriorPainting: false,
    commercialPainting: false,
    residentialPainting: false,
    trimAndMolding: false,
    ceilings: false,
    doors: false,
    drywallRepair: false,
    cabinetPainting: false,
    deckStaining: false,
    pressureWashing: false,
  },
  
  pricing: {
    doorsPerUnit: 0,
    wallsPerSqFt: 0,
    fullJobPerSqFt: 0,
  },
  
  seo: {
    title: "TrustLayer Plumbing | Trusted Plumbing Professionals",
    description: "Connect with trusted plumbing professionals. Drain cleaning, water heater repair, pipe installation, and 24/7 emergency service.",
    keywords: ["trusted plumber", "plumbing", "drain cleaning", "water heater", "pipe repair", "emergency plumber", "trustlayer"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    licensed: true,
    insured: true,
    bonded: true,
  },
};

// TrustLayer Landscaping - Landscaping trade vertical
export const landscapePros: TenantConfig = {
  id: "landscapepros",
  slug: "landscapepros",
  tradeVertical: "landscaping",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer Landscaping",
  tagline: "Trusted Outdoor Professionals",
  description: "Connecting you with trusted landscaping professionals. Design, installation, and maintenance for beautiful outdoor spaces.",
  
  theme: {
    primaryColor: "#3b82f6",
    accentColor: "#38bdf8",
    darkMode: {
      background: "#0f172a",
      foreground: "#dcfce7",
    },
    lightMode: {
      background: "#dcfce7",
      foreground: "#0f172a",
    },
  },
  
  services: {
    interiorPainting: false,
    exteriorPainting: false,
    commercialPainting: false,
    residentialPainting: false,
    trimAndMolding: false,
    ceilings: false,
    doors: false,
    drywallRepair: false,
    cabinetPainting: false,
    deckStaining: true,
    pressureWashing: true,
  },
  
  pricing: {
    doorsPerUnit: 0,
    wallsPerSqFt: 0,
    fullJobPerSqFt: 0,
  },
  
  seo: {
    title: "TrustLayer Landscaping | Trusted Outdoor Professionals",
    description: "Connect with trusted landscaping professionals. Lawn care, hardscaping, irrigation, and outdoor living spaces.",
    keywords: ["trusted landscaping", "lawn care", "hardscape", "irrigation", "outdoor design", "garden", "trustlayer"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    licensed: true,
    insured: true,
  },
};

// TrustLayer Construction - General construction trade vertical
export const buildPros: TenantConfig = {
  id: "buildpros",
  slug: "buildpros",
  tradeVertical: "construction",
  subscriptionTier: "full_suite",
  
  name: "TrustLayer Construction",
  tagline: "Trusted Building Professionals",
  description: "Connecting you with trusted general contractors. New construction, remodeling, additions, and commercial buildouts.",
  
  theme: {
    primaryColor: "#78716c",
    accentColor: "#f59e0b",
    darkMode: {
      background: "#1c1917",
      foreground: "#f5f5f4",
    },
    lightMode: {
      background: "#f5f5f4",
      foreground: "#1c1917",
    },
  },
  
  services: {
    interiorPainting: true,
    exteriorPainting: true,
    commercialPainting: true,
    residentialPainting: true,
    trimAndMolding: true,
    ceilings: true,
    doors: true,
    drywallRepair: true,
    cabinetPainting: true,
    deckStaining: true,
    pressureWashing: true,
  },
  
  pricing: {
    doorsPerUnit: 200,
    wallsPerSqFt: 4.0,
    fullJobPerSqFt: 150,
  },
  
  seo: {
    title: "BuildPros.io | General Contractors & Construction",
    description: "Expert general contracting services. Custom homes, renovations, additions, and commercial construction.",
    keywords: ["general contractor", "construction", "remodeling", "home builder", "renovation", "commercial buildout"],
    serviceAreas: ["Nationwide"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: true,
    onlineBooking: true,
    aiAssistant: true,
  },
  
  credentials: {
    licensed: true,
    insured: true,
    bonded: true,
  },
};

// Tenant registry
export const tenants: Record<string, TenantConfig> = {
  "npp": nashPaintPros,
  "demo": paintProsDemo,
  "paintprosco": lumePaintCo,
  "lumepaint": lumePaintCo,
  "tradeworks": tradeWorksAI,
  "roofpros": roofPros,
  "hvacpros": hvacPros,
  "electricpros": electricPros,
  "plumbpros": plumbPros,
  "landscapepros": landscapePros,
  "buildpros": buildPros,
};

// Domain to tenant mapping (custom domains)
const domainTenantMap: Record<string, string> = {
  "paintpros.io": "paintprosco",
  "www.paintpros.io": "paintprosco",
  "tlid.io": "tlid",
  "www.tlid.io": "tlid",
  "nashpaintpros.io": "npp",
  "www.nashpaintpros.io": "npp",
  "tradeworksai.io": "tradeworks",
  "www.tradeworksai.io": "tradeworks",
  "roofpros.io": "roofpros",
  "www.roofpros.io": "roofpros",
  "hvacpros.io": "hvacpros",
  "www.hvacpros.io": "hvacpros",
  "electricpros.io": "electricpros",
  "www.electricpros.io": "electricpros",
  "plumbpros.io": "plumbpros",
  "www.plumbpros.io": "plumbpros",
  "landscapepros.io": "landscapepros",
  "www.landscapepros.io": "landscapepros",
  "buildpros.io": "buildpros",
  "www.buildpros.io": "buildpros",
  "localhost": "npp",
};

// Subdomain to tenant mapping for *.paintpros.io
const subdomainTenantMap: Record<string, string> = {
  "nashpaintpros": "npp",
  "npp": "npp",
  "demo": "demo",
  "www": "demo",
  // DISABLED - Lume not ready for public yet (uncomment to enable)
  // "lumepaint": "lumepaint",
  // "lume": "lumepaint",
  "roofpros": "roofpros",
  "hvacpros": "hvacpros",
  "electricpros": "electricpros",
  "plumbpros": "plumbpros",
  "landscapepros": "landscapepros",
  "buildpros": "buildpros",
};

// Parse tenant from hostname (client-side)
export function getTenantIdFromHostname(hostname: string): string {
  const host = hostname.toLowerCase().split(':')[0];
  
  // Check full domain mapping first
  if (domainTenantMap[host]) {
    return domainTenantMap[host];
  }
  
  // Check for subdomain pattern: subdomain.paintpros.io
  const parts = host.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    const baseDomain = parts.slice(-2).join('.');
    
    if (baseDomain === 'paintpros.io' && subdomainTenantMap[subdomain]) {
      return subdomainTenantMap[subdomain];
    }
  }
  
  // Replit dev preview and unknown domains use "demo" (TLId.io / platform mode)
  if (host.includes('replit.dev') || host.includes('picard.') || host.includes('repl.co')) {
    return import.meta.env.VITE_TENANT_ID || "demo";
  }
  
  // Fallback to env variable - default to demo (platform mode with purple shield)
  return import.meta.env.VITE_TENANT_ID || "demo";
}

// Get current tenant based on domain or environment
export function getCurrentTenant(): TenantConfig {
  if (typeof window !== "undefined") {
    const tenantId = getTenantIdFromHostname(window.location.hostname);
    return tenants[tenantId] || lumePaintCo;
  }
  
  // Fallback to environment variable (for dev/staging) - default to Lume
  const tenantId = import.meta.env.VITE_TENANT_ID || "lume";
  return tenants[tenantId] || lumePaintCo;
}

// Get tenant by ID
export function getTenantById(tenantId: string): TenantConfig {
  return tenants[tenantId] || lumePaintCo;
}

interface PWAConfig {
  manifest: string;
  themeColor: string;
  appleIcon: string;
  splashImage: string;
  appTitle: string;
}

const tenantPWAConfig: Record<string, PWAConfig> = {
  tlid: {
    manifest: "/manifest-tlid.json",
    themeColor: "#06b6d4",
    appleIcon: "/pwa/tlid/icon-192.png",
    splashImage: "/pwa/tlid/splash-1024.png",
    appTitle: "TrustLayer Marketing",
  },
  npp: {
    manifest: "/manifest.json",
    themeColor: "#0f172a",
    appleIcon: "/pwa/npp/icon-192.png",
    splashImage: "/pwa/npp/splash-1024.png",
    appTitle: "Nash PaintPros",
  },
  paintprosco: {
    manifest: "/manifest-paintpros.json",
    themeColor: "#1e3a5f",
    appleIcon: "/pwa/paintpros/icon-192.png",
    splashImage: "/pwa/paintpros/splash-1024.png",
    appTitle: "Paint Pros Co.",
  },
  tradeworks: {
    manifest: "/manifest-tradeworks.json",
    themeColor: "#0f172a",
    appleIcon: "/pwa/tradeworks/icon-192.png",
    splashImage: "/pwa/tradeworks/splash.png",
    appTitle: "TradeWorks AI",
  },
  demo: {
    manifest: "/manifest-tlid.json",
    themeColor: "#06b6d4",
    appleIcon: "/pwa/tlid/icon-192.png",
    splashImage: "/pwa/tlid/splash-1024.png",
    appTitle: "TrustLayer Marketing",
  },
};

function ensureMeta(name: string, content: string): void {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureLink(rel: string, href: string): void {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applyTenantPWA(): void {
  if (typeof window === "undefined") return;

  const tenantId = getTenantIdFromHostname(window.location.hostname);
  const config = tenantPWAConfig[tenantId] || tenantPWAConfig["demo"];

  ensureLink("manifest", config.manifest);
  ensureMeta("theme-color", config.themeColor);
  ensureLink("apple-touch-icon", config.appleIcon);
  ensureLink("apple-touch-startup-image", config.splashImage);
  ensureMeta("apple-mobile-web-app-title", config.appTitle);
}
