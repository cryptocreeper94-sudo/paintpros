export interface BlockchainStamp {
  id: string;
  entityType: string;
  entityId: string;
  documentHash: string;
  transactionSignature: string | null;
  network: string;
  slot: number | null;
  blockTime: string | null;
  status: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  email: string;
  createdAt: string;
}

export interface Estimate {
  id: string;
  leadId: string;
  includeWalls: boolean;
  includeTrim: boolean;
  includeCeilings: boolean;
  doorCount: number;
  squareFootage: number | null;
  wallsPrice: string;
  trimPrice: string;
  ceilingsPrice: string;
  doorsPrice: string;
  totalEstimate: string;
  pricingTier: string;
  createdAt: string;
  status: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  tagline: string;
  colors: {
    primary: string;
    accent: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  pricing: {
    wallsPerSqFt: number;
    fullJobPerSqFt: number;
    doorsPerUnit: number;
  };
  foundingAsset: {
    number: string;
    badge: string;
    solscanUrl: string;
  };
}

export const FOUNDING_ASSETS = {
  ORBIT_GENESIS: { 
    number: '#000000000-01', 
    special: '#FE-000000000-01',
    name: 'ORBIT Genesis', 
    type: 'genesis',
    badge: 'Genesis Asset',
  },
  PAINTPROS_PLATFORM: { 
    number: '#000000000-02', 
    special: '#FE-000000000-02',
    name: 'Paint Pros by ORBIT', 
    type: 'platform',
    badge: 'Paint Pros Platform',
  },
  NPP_GENESIS: { 
    number: 'NPP-00000000-01', 
    special: 'NPP-FE-00000000-01',
    name: 'Nashville Painting Professionals', 
    type: 'tenant-genesis',
    badge: 'NPP Genesis',
  },
} as const;

export const NPP_TENANT: TenantConfig = {
  id: 'npp',
  name: 'Nashville Painting Professionals',
  tagline: 'Exceptional Painters. Extraordinary Service.',
  colors: {
    primary: 'hsl(85, 20%, 35%)',
    accent: 'hsl(45, 90%, 55%)',
  },
  contact: {
    phone: '(615) 555-PAINT',
    email: 'service@nashvillepaintingprofessionals.com',
    website: 'nashpaintpros.io',
  },
  pricing: {
    wallsPerSqFt: 2.50,
    fullJobPerSqFt: 5.00,
    doorsPerUnit: 150,
  },
  foundingAsset: {
    number: '#0000001',
    badge: 'Founding Member',
    solscanUrl: 'https://solscan.io/account/NPP0000000001',
  },
};

export type Role = 'none' | 'admin' | 'owner' | 'manager' | 'developer';

export const ROLE_PINS: Record<string, Role> = {
  '4444': 'admin',
  '1111': 'owner',
  '2222': 'manager',
  '0424': 'developer',
};
