import ecosystemDriverConnect from "@assets/franchise_hero_facebook.png";
import ecosystemHappyEats from "@assets/17698344491552583768895781273262_1769834987195.png";
import ecosystemVedaSolus from "@/assets/images/ecosystem-vedasolus.png";
import ecosystemGarageBot from "@/assets/images/ecosystem-garagebot.png";
import ecosystemOrbitStaffing from "@/assets/images/ecosystem-orbitstaffing.png";
import ecosystemTradeWorks from "@/assets/images/ecosystem-tradeworks.png";
import ecosystemPaintPros from "@/assets/images/ecosystem-paintpros.png";
import ecosystemNPP from "@/assets/images/ecosystem-npp.png";
import ecosystemLume from "@/assets/images/ecosystem-lume.png";
import ecosystemTrustLayerMarketing from "@/assets/images/ecosystem-trustlayer-marketing.png";
import ecosystemYourLegacy from "@/assets/images/ecosystem-yourlegacy.png";
import ecosystemDarkWaveGames from "@/assets/images/ecosystem-darkwavegames.png";
import ecosystemDWTL from "@/assets/images/ecosystem-dwtl.png";
import ecosystemDarkWaveStudios from "@/assets/images/ecosystem-darkwavestudios.png";
import ecosystemGetOrby from "@/assets/images/ecosystem-getorby.png";
import ecosystemStrikeAgent from "@/assets/images/ecosystem-strikeagent.png";
import ecosystemDarkWavePulse from "@/assets/images/ecosystem-darkwavepulse.png";
import ecosystemPulse from "@/assets/images/ecosystem-pulse.png";
import ecosystemLotOpsPro from "@/assets/images/ecosystem-lotopspro.png";
import ecosystemBrewBoard from "@/assets/images/ecosystem-brewboard.png";
import ecosystemTrustShield from "@/assets/images/ecosystem-trustshield.png";

export type EcosystemCategory = 
  | 'marketing' 
  | 'field-tools' 
  | 'trust-security' 
  | 'marketplace' 
  | 'staffing' 
  | 'gaming' 
  | 'infrastructure' 
  | 'crypto' 
  | 'operations'
  | 'tenant';

export interface EcosystemApp {
  name: string;
  desc: string;
  url: string;
  image: string;
  status: 'Live' | 'Live - In Development' | 'Coming Soon' | 'Beta' | 'Presale';
  category: EcosystemCategory;
  current?: boolean;
  featured?: boolean;
  affiliateTag?: string;
}

export const ecosystemApps: EcosystemApp[] = [
  {
    name: 'TrustLayer Marketing',
    desc: 'Automated Social Media & Ad Campaigns',
    url: 'https://tlid.io',
    image: ecosystemTrustLayerMarketing,
    status: 'Live - In Development',
    category: 'marketing',
    featured: true,
    affiliateTag: 'npp-ref'
  },
  {
    name: 'TL Driver Connect',
    desc: 'Food, Parts & Services to Truck Stops',
    url: 'https://tldriverconnect.com',
    image: ecosystemDriverConnect,
    status: 'Live - In Development',
    category: 'marketplace',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'Happy Eats',
    desc: 'Food Delivery to Truck Stops',
    url: 'https://happyeats.app',
    image: ecosystemHappyEats,
    status: 'Coming Soon',
    category: 'marketplace',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'GarageBot',
    desc: 'Auto Parts Aggregator - 40+ Retailers',
    url: 'https://garagebot.io',
    image: ecosystemGarageBot,
    status: 'Live - In Development',
    category: 'marketplace',
    featured: true,
    affiliateTag: 'npp-ref'
  },
  {
    name: 'VedaSolus',
    desc: 'Holistic Wellness & Ayurveda',
    url: 'https://vedasolus.io',
    image: ecosystemVedaSolus,
    status: 'Live - In Development',
    category: 'marketplace',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'PaintPros.io',
    desc: 'Flagship Painting Contractor Platform',
    url: 'https://paintpros.io',
    image: ecosystemPaintPros,
    status: 'Live - In Development',
    category: 'field-tools',
    featured: true,
    affiliateTag: 'npp-ref'
  },
  {
    name: 'TradeWorks AI',
    desc: '8-Trade Field Toolkit & Estimator',
    url: 'https://tradeworksai.io',
    image: ecosystemTradeWorks,
    status: 'Live - In Development',
    category: 'field-tools',
    featured: true,
    affiliateTag: 'npp-ref'
  },
  {
    name: 'ORBIT Staffing OS',
    desc: 'Automated Staffing & Payroll',
    url: 'https://orbitstaffing.io',
    image: ecosystemOrbitStaffing,
    status: 'Live - In Development',
    category: 'staffing',
    featured: true,
    affiliateTag: 'npp-ref'
  },
  {
    name: 'Lot Ops Pro',
    desc: 'Driver Performance & Lot Management',
    url: 'https://lotopspro.io',
    image: ecosystemLotOpsPro,
    status: 'Live - In Development',
    category: 'operations',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'Brew & Board',
    desc: 'B2B Coffee Concierge Nashville',
    url: 'https://brewandboardcoffee.com',
    image: ecosystemBrewBoard,
    status: 'Live - In Development',
    category: 'marketplace',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'Nash PaintPros',
    desc: 'Lead Generation & Contractor Marketplace',
    url: 'https://nashpaintpros.io',
    image: ecosystemNPP,
    status: 'Live',
    category: 'tenant'
  },
  {
    name: 'Paint Pros Co',
    desc: 'Premium White-Label Painting',
    url: 'https://paintpros.io',
    image: ecosystemLume,
    status: 'Live',
    category: 'tenant'
  },
  {
    name: 'YourLegacy.io',
    desc: 'Chronicles Game',
    url: 'https://yourlegacy.io',
    image: ecosystemYourLegacy,
    status: 'Live - In Development',
    category: 'gaming',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'DarkWave Games',
    desc: 'Arcade & Casino Games',
    url: 'https://darkwavegames.io',
    image: ecosystemDarkWaveGames,
    status: 'Live - In Development',
    category: 'gaming',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'DWTL.io',
    desc: 'Trust Infrastructure for AI Economy',
    url: 'https://dwsc.io',
    image: ecosystemDWTL,
    status: 'Presale',
    category: 'infrastructure',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'DarkWave Studios',
    desc: 'Full-Stack Dev & AI Integration',
    url: 'https://darkwavestudios.io',
    image: ecosystemDarkWaveStudios,
    status: 'Live - In Development',
    category: 'infrastructure',
    featured: true,
    affiliateTag: 'npp-ref'
  },
  {
    name: 'Orby Commander',
    desc: 'Venue Operations Platform',
    url: 'https://getorby.io',
    image: ecosystemGetOrby,
    status: 'Live - In Development',
    category: 'operations',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'StrikeAgent.io',
    desc: 'AI Token Discovery & Safety Scanner',
    url: 'https://strikeagent.io',
    image: ecosystemStrikeAgent,
    status: 'Live - In Development',
    category: 'crypto',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'Pulse',
    desc: 'AI Crypto Trading Signals',
    url: 'https://dwsc.io/pulse',
    image: ecosystemPulse,
    status: 'Live - In Development',
    category: 'crypto',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'DarkWave Pulse',
    desc: 'Crypto Research Hub',
    url: 'https://darkwavepulse.com',
    image: ecosystemDarkWavePulse,
    status: 'Live - In Development',
    category: 'crypto',
    affiliateTag: 'npp-ref'
  },
  {
    name: 'TrustShield',
    desc: 'Guardian Shield Security & AI Certification',
    url: 'https://trustshield.tech',
    image: ecosystemTrustShield,
    status: 'Live - In Development',
    category: 'trust-security',
    featured: true,
    affiliateTag: 'npp-ref'
  }
];

export const categoryLabels: Record<EcosystemCategory, string> = {
  'marketing': 'Marketing & Ads',
  'field-tools': 'Field Tools & Trades',
  'trust-security': 'Trust & Security',
  'marketplace': 'Marketplace & Commerce',
  'staffing': 'Staffing & HR',
  'gaming': 'Gaming & Entertainment',
  'infrastructure': 'Core Infrastructure',
  'crypto': 'Crypto & Trading',
  'operations': 'Operations & Logistics',
  'tenant': 'Tenant Sites'
};

export function getAppUrl(app: EcosystemApp, source?: string): string {
  const tag = source || app.affiliateTag;
  if (!tag) return app.url;
  const separator = app.url.includes('?') ? '&' : '?';
  return `${app.url}${separator}ref=${tag}&utm_source=nashpaintpros&utm_medium=ecosystem&utm_campaign=lead_gen`;
}
