export interface TenantConfig {
  id: string;
  slug: string;
  
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
}

// Nashville Painting Professionals - Beta Tenant
export const nashvillePaintingProfessionals: TenantConfig = {
  id: "npp",
  slug: "nashville-painting-professionals",
  
  name: "Nashville Painting Professionals",
  tagline: "Exceptional Painters. Extraordinary Service.",
  description: "Nashville's premier painting company offering professional interior and exterior painting services for residential and commercial properties.",
  logo: "/icons/npp-mascot.png",
  
  phone: "",
  email: "",
  address: {
    city: "Nashville",
    state: "TN",
  },
  
  social: {
    googleReviews: "https://www.google.com/maps/place/Nashville+Painting+Professionals",
  },
  
  theme: {
    primaryColor: "hsl(85, 20%, 35%)",
    accentColor: "hsl(85, 25%, 45%)",
    darkMode: {
      background: "hsl(85, 15%, 8%)",
      foreground: "hsl(45, 30%, 95%)",
    },
    lightMode: {
      background: "hsl(45, 30%, 97%)",
      foreground: "hsl(85, 20%, 15%)",
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
    fullJobPerSqFt: 5.00,
  },
  
  seo: {
    title: "Nashville Painting Professionals | Premium Interior & Exterior Painters",
    description: "Nashville's premier painting company. Professional interior and exterior painting services with a 3-year warranty. Free estimates, 4.9 Google rating.",
    keywords: [
      "Nashville painters",
      "painting company Nashville",
      "interior painting",
      "exterior painting",
      "house painters Nashville",
      "commercial painting",
      "residential painting",
    ],
    serviceAreas: ["Nashville", "Franklin", "Brentwood", "Murfreesboro", "Hendersonville"],
  },
  
  features: {
    estimator: true,
    portfolio: true,
    reviews: true,
    blog: false,
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
};

// PaintPros.io Platform Demo (for sales presentations)
export const paintProsDemo: TenantConfig = {
  id: "demo",
  slug: "paintpros-demo",
  
  name: "PaintPros.io",
  tagline: "The First Solana-Verified Painting Company Software",
  description: "PaintPros.io is a complete white-label SaaS platform designed specifically for the painting and home services industry. Anti-fraud protection, document recall, and blockchain verification built-in.",
  logo: "/icons/paintpros-mascot.png",
  
  phone: "(888) PAINT-PRO",
  email: "demo@paintpros.io",
  
  theme: {
    primaryColor: "hsl(220, 70%, 50%)",
    accentColor: "hsl(45, 90%, 55%)",
    darkMode: {
      background: "hsl(220, 25%, 8%)",
      foreground: "hsl(45, 30%, 95%)",
    },
    lightMode: {
      background: "hsl(220, 20%, 97%)",
      foreground: "hsl(220, 25%, 15%)",
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
};

// Tenant registry
export const tenants: Record<string, TenantConfig> = {
  "npp": nashvillePaintingProfessionals,
  "demo": paintProsDemo,
};

// Domain to tenant mapping (custom domains)
const domainTenantMap: Record<string, string> = {
  "paintpros.io": "demo",
  "www.paintpros.io": "demo",
  "nashpaintpros.io": "npp",
  "www.nashpaintpros.io": "npp",
  "nashvillepaintingprofessionals.com": "npp",
  "www.nashvillepaintingprofessionals.com": "npp",
  "localhost": "npp",
};

// Subdomain to tenant mapping for *.paintpros.io
const subdomainTenantMap: Record<string, string> = {
  "nashpaintpros": "npp",
  "npp": "npp",
  "demo": "demo",
  "www": "demo",
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
  
  // Fallback to env variable
  return import.meta.env.VITE_TENANT_ID || "npp";
}

// Get current tenant based on domain or environment
export function getCurrentTenant(): TenantConfig {
  if (typeof window !== "undefined") {
    const tenantId = getTenantIdFromHostname(window.location.hostname);
    return tenants[tenantId] || nashvillePaintingProfessionals;
  }
  
  // Fallback to environment variable (for dev/staging)
  const tenantId = import.meta.env.VITE_TENANT_ID || "npp";
  return tenants[tenantId] || nashvillePaintingProfessionals;
}

// Get tenant by ID
export function getTenantById(tenantId: string): TenantConfig {
  return tenants[tenantId] || nashvillePaintingProfessionals;
}
