export type TradeType = 
  | 'painting'
  | 'roofing'
  | 'hvac'
  | 'electrical'
  | 'plumbing'
  | 'landscaping'
  | 'general_contracting';

export interface TradeVerticalConfig {
  id: TradeType;
  name: string;
  tagline: string;
  placeholderDomain: string;
  primaryColor: string;
  accentColor: string;
  icon: string;
  heroText: {
    subtitle: string;
    title: string;
    highlight: string;
  };
  services: TradeService[];
  estimatorFields: EstimatorField[];
  terminology: TradeTerm;
}

export interface TradeService {
  id: string;
  name: string;
  description: string;
  basePrice?: number;
  priceUnit: 'sqft' | 'linear_ft' | 'unit' | 'hour' | 'job' | 'ton';
  icon: string;
}

export interface EstimatorField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'checkbox';
  options?: string[];
  unit?: string;
}

export interface TradeTerm {
  project: string;
  estimate: string;
  crew: string;
  jobSite: string;
}

export const tradeVerticals: Record<TradeType, TradeVerticalConfig> = {
  painting: {
    id: 'painting',
    name: 'PaintPros',
    tagline: "Nashville's Most Trusted Painters",
    placeholderDomain: 'paintpros.io',
    primaryColor: '#2D5A27',
    accentColor: '#C4A052',
    icon: 'Paintbrush',
    heroText: {
      subtitle: "Nashville's Most Trusted Painters",
      title: 'Painting Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'interior', name: 'Interior Painting', description: 'Walls, ceilings, trim, and doors', priceUnit: 'sqft', icon: 'Home' },
      { id: 'exterior', name: 'Exterior Painting', description: 'Siding, trim, doors, and shutters', priceUnit: 'sqft', icon: 'Building' },
      { id: 'cabinet', name: 'Cabinet Refinishing', description: 'Kitchen and bathroom cabinets', priceUnit: 'unit', icon: 'Square' },
      { id: 'deck', name: 'Deck & Fence Staining', description: 'Staining and sealing outdoor wood', priceUnit: 'sqft', icon: 'Fence' },
      { id: 'commercial', name: 'Commercial Painting', description: 'Office, retail, and industrial spaces', priceUnit: 'sqft', icon: 'Building2' },
      { id: 'specialty', name: 'Specialty Finishes', description: 'Faux finishes, murals, and textures', priceUnit: 'job', icon: 'Sparkles' },
    ],
    estimatorFields: [
      { id: 'sqft', label: 'Square Footage', type: 'number', unit: 'sq ft' },
      { id: 'rooms', label: 'Number of Rooms', type: 'number' },
      { id: 'ceilings', label: 'Include Ceilings', type: 'checkbox' },
      { id: 'trim', label: 'Include Trim', type: 'checkbox' },
      { id: 'condition', label: 'Wall Condition', type: 'select', options: ['Good', 'Fair', 'Needs Repair'] },
    ],
    terminology: {
      project: 'Paint Job',
      estimate: 'Estimate',
      crew: 'Paint Crew',
      jobSite: 'Property',
    },
  },

  roofing: {
    id: 'roofing',
    name: 'RoofPros',
    tagline: 'Trusted Roofing Experts',
    placeholderDomain: 'roofpros.io',
    primaryColor: '#1E3A5F',
    accentColor: '#D4AF37',
    icon: 'Home',
    heroText: {
      subtitle: 'Trusted Roofing Experts',
      title: 'Roofing Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'shingle', name: 'Shingle Roofing', description: 'Asphalt and architectural shingles', priceUnit: 'sqft', icon: 'Layers' },
      { id: 'metal', name: 'Metal Roofing', description: 'Standing seam and corrugated metal', priceUnit: 'sqft', icon: 'Shield' },
      { id: 'flat', name: 'Flat Roofing', description: 'TPO, EPDM, and modified bitumen', priceUnit: 'sqft', icon: 'Square' },
      { id: 'repair', name: 'Roof Repairs', description: 'Leak repairs and storm damage', priceUnit: 'job', icon: 'Wrench' },
      { id: 'gutter', name: 'Gutters & Downspouts', description: 'Installation and repair', priceUnit: 'linear_ft', icon: 'ArrowDown' },
      { id: 'inspection', name: 'Roof Inspection', description: 'Comprehensive roof assessment', priceUnit: 'job', icon: 'Search' },
    ],
    estimatorFields: [
      { id: 'sqft', label: 'Roof Square Footage', type: 'number', unit: 'sq ft' },
      { id: 'stories', label: 'Number of Stories', type: 'select', options: ['1 Story', '2 Stories', '3+ Stories'] },
      { id: 'pitch', label: 'Roof Pitch', type: 'select', options: ['Low (0-3)', 'Medium (4-7)', 'Steep (8+)'] },
      { id: 'material', label: 'Material Type', type: 'select', options: ['Asphalt Shingle', 'Metal', 'Tile', 'Flat'] },
      { id: 'tearoff', label: 'Tear-off Required', type: 'checkbox' },
    ],
    terminology: {
      project: 'Roofing Job',
      estimate: 'Quote',
      crew: 'Roofing Crew',
      jobSite: 'Property',
    },
  },

  hvac: {
    id: 'hvac',
    name: 'HVACPros',
    tagline: 'Heating & Cooling Specialists',
    placeholderDomain: 'hvacpros.io',
    primaryColor: '#0D47A1',
    accentColor: '#FF6B35',
    icon: 'Thermometer',
    heroText: {
      subtitle: 'Heating & Cooling Specialists',
      title: 'Comfort Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'ac_install', name: 'AC Installation', description: 'Central air and ductless systems', priceUnit: 'ton', icon: 'Snowflake' },
      { id: 'heating', name: 'Heating Installation', description: 'Furnaces, heat pumps, and boilers', priceUnit: 'unit', icon: 'Flame' },
      { id: 'repair', name: 'HVAC Repair', description: 'Diagnosis and repair services', priceUnit: 'hour', icon: 'Wrench' },
      { id: 'maintenance', name: 'Preventive Maintenance', description: 'Seasonal tune-ups and inspections', priceUnit: 'job', icon: 'Calendar' },
      { id: 'ductwork', name: 'Ductwork', description: 'Installation, repair, and cleaning', priceUnit: 'linear_ft', icon: 'Wind' },
      { id: 'iaq', name: 'Indoor Air Quality', description: 'Purifiers, humidifiers, and ventilation', priceUnit: 'unit', icon: 'Cloud' },
    ],
    estimatorFields: [
      { id: 'sqft', label: 'Home Square Footage', type: 'number', unit: 'sq ft' },
      { id: 'system', label: 'System Type', type: 'select', options: ['Central AC', 'Heat Pump', 'Ductless Mini-Split', 'Furnace'] },
      { id: 'tonnage', label: 'System Size', type: 'select', options: ['2 Ton', '2.5 Ton', '3 Ton', '3.5 Ton', '4 Ton', '5 Ton'] },
      { id: 'efficiency', label: 'Efficiency Level', type: 'select', options: ['Standard', 'High Efficiency', 'Premium'] },
      { id: 'ductwork', label: 'New Ductwork Needed', type: 'checkbox' },
    ],
    terminology: {
      project: 'HVAC Job',
      estimate: 'Quote',
      crew: 'HVAC Tech',
      jobSite: 'Property',
    },
  },

  electrical: {
    id: 'electrical',
    name: 'ElectricPros',
    tagline: 'Licensed Electrical Experts',
    placeholderDomain: 'electricpros.io',
    primaryColor: '#FFC107',
    accentColor: '#212121',
    icon: 'Zap',
    heroText: {
      subtitle: 'Licensed Electrical Experts',
      title: 'Electrical Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'panel', name: 'Panel Upgrades', description: 'Service panel replacement and upgrades', priceUnit: 'job', icon: 'Box' },
      { id: 'wiring', name: 'Electrical Wiring', description: 'New construction and rewiring', priceUnit: 'sqft', icon: 'Cable' },
      { id: 'outlets', name: 'Outlets & Switches', description: 'Installation and repair', priceUnit: 'unit', icon: 'PlugZap' },
      { id: 'lighting', name: 'Lighting Installation', description: 'Indoor and outdoor lighting', priceUnit: 'unit', icon: 'Lightbulb' },
      { id: 'ev', name: 'EV Charger Installation', description: 'Level 2 home charging stations', priceUnit: 'job', icon: 'BatteryCharging' },
      { id: 'generator', name: 'Generator Installation', description: 'Standby and portable generators', priceUnit: 'job', icon: 'Power' },
    ],
    estimatorFields: [
      { id: 'service_type', label: 'Service Type', type: 'select', options: ['Repair', 'Installation', 'Upgrade', 'Inspection'] },
      { id: 'amperage', label: 'Panel Amperage', type: 'select', options: ['100 Amp', '150 Amp', '200 Amp', '400 Amp'] },
      { id: 'outlets', label: 'Number of Outlets', type: 'number' },
      { id: 'fixtures', label: 'Number of Fixtures', type: 'number' },
      { id: 'permit', label: 'Permit Required', type: 'checkbox' },
    ],
    terminology: {
      project: 'Electrical Job',
      estimate: 'Quote',
      crew: 'Electrician',
      jobSite: 'Property',
    },
  },

  plumbing: {
    id: 'plumbing',
    name: 'PlumbPros',
    tagline: 'Professional Plumbing Services',
    placeholderDomain: 'plumbpros.io',
    primaryColor: '#00695C',
    accentColor: '#0288D1',
    icon: 'Droplets',
    heroText: {
      subtitle: 'Professional Plumbing Services',
      title: 'Plumbing Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'repair', name: 'Plumbing Repairs', description: 'Leaks, clogs, and fixture repairs', priceUnit: 'hour', icon: 'Wrench' },
      { id: 'water_heater', name: 'Water Heater', description: 'Installation and repair', priceUnit: 'unit', icon: 'Flame' },
      { id: 'drain', name: 'Drain Cleaning', description: 'Clog removal and hydro jetting', priceUnit: 'job', icon: 'ArrowDown' },
      { id: 'repiping', name: 'Repiping', description: 'Whole home pipe replacement', priceUnit: 'sqft', icon: 'Cable' },
      { id: 'bathroom', name: 'Bathroom Remodel', description: 'Fixture installation and upgrades', priceUnit: 'job', icon: 'Bath' },
      { id: 'sewer', name: 'Sewer Line', description: 'Repair and replacement', priceUnit: 'linear_ft', icon: 'Construction' },
    ],
    estimatorFields: [
      { id: 'service_type', label: 'Service Type', type: 'select', options: ['Repair', 'Installation', 'Emergency', 'Maintenance'] },
      { id: 'fixtures', label: 'Number of Fixtures', type: 'number' },
      { id: 'water_heater_type', label: 'Water Heater Type', type: 'select', options: ['Tank (Gas)', 'Tank (Electric)', 'Tankless', 'Heat Pump'] },
      { id: 'emergency', label: 'Emergency Service', type: 'checkbox' },
      { id: 'permit', label: 'Permit Required', type: 'checkbox' },
    ],
    terminology: {
      project: 'Plumbing Job',
      estimate: 'Quote',
      crew: 'Plumber',
      jobSite: 'Property',
    },
  },

  landscaping: {
    id: 'landscaping',
    name: 'LandscapePros',
    tagline: 'Professional Landscaping Services',
    placeholderDomain: 'landscapepros.io',
    primaryColor: '#388E3C',
    accentColor: '#8D6E63',
    icon: 'Trees',
    heroText: {
      subtitle: 'Professional Landscaping Services',
      title: 'Landscaping Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'design', name: 'Landscape Design', description: 'Custom landscape planning', priceUnit: 'job', icon: 'PenTool' },
      { id: 'installation', name: 'Planting & Installation', description: 'Trees, shrubs, and flower beds', priceUnit: 'sqft', icon: 'Flower' },
      { id: 'hardscape', name: 'Hardscaping', description: 'Patios, walkways, and retaining walls', priceUnit: 'sqft', icon: 'Blocks' },
      { id: 'irrigation', name: 'Irrigation Systems', description: 'Sprinkler installation and repair', priceUnit: 'sqft', icon: 'Droplets' },
      { id: 'lawn', name: 'Lawn Care', description: 'Mowing, fertilization, and treatments', priceUnit: 'sqft', icon: 'Grass' },
      { id: 'lighting', name: 'Outdoor Lighting', description: 'Landscape and pathway lighting', priceUnit: 'unit', icon: 'Sun' },
    ],
    estimatorFields: [
      { id: 'sqft', label: 'Property Square Footage', type: 'number', unit: 'sq ft' },
      { id: 'service', label: 'Primary Service', type: 'select', options: ['Design', 'Installation', 'Maintenance', 'Hardscape'] },
      { id: 'irrigation', label: 'Irrigation Needed', type: 'checkbox' },
      { id: 'lighting', label: 'Outdoor Lighting', type: 'checkbox' },
      { id: 'ongoing', label: 'Ongoing Maintenance', type: 'checkbox' },
    ],
    terminology: {
      project: 'Landscape Project',
      estimate: 'Quote',
      crew: 'Landscape Crew',
      jobSite: 'Property',
    },
  },

  general_contracting: {
    id: 'general_contracting',
    name: 'BuildPros',
    tagline: 'Licensed General Contractors',
    placeholderDomain: 'buildpros.io',
    primaryColor: '#5D4037',
    accentColor: '#FF9800',
    icon: 'Hammer',
    heroText: {
      subtitle: 'Licensed General Contractors',
      title: 'Building Done',
      highlight: 'The Right Way',
    },
    services: [
      { id: 'remodel', name: 'Home Remodeling', description: 'Kitchen, bath, and whole home', priceUnit: 'sqft', icon: 'Home' },
      { id: 'addition', name: 'Home Additions', description: 'Room additions and expansions', priceUnit: 'sqft', icon: 'Plus' },
      { id: 'basement', name: 'Basement Finishing', description: 'Complete basement renovations', priceUnit: 'sqft', icon: 'ArrowDown' },
      { id: 'deck', name: 'Deck & Patio', description: 'Custom deck construction', priceUnit: 'sqft', icon: 'LayoutGrid' },
      { id: 'commercial', name: 'Commercial Build-Out', description: 'Office and retail spaces', priceUnit: 'sqft', icon: 'Building2' },
      { id: 'repair', name: 'Home Repairs', description: 'General maintenance and repairs', priceUnit: 'hour', icon: 'Wrench' },
    ],
    estimatorFields: [
      { id: 'sqft', label: 'Project Square Footage', type: 'number', unit: 'sq ft' },
      { id: 'project_type', label: 'Project Type', type: 'select', options: ['Kitchen', 'Bathroom', 'Basement', 'Addition', 'Whole Home'] },
      { id: 'finish_level', label: 'Finish Level', type: 'select', options: ['Builder Grade', 'Mid-Range', 'High-End', 'Luxury'] },
      { id: 'permits', label: 'Permits Required', type: 'checkbox' },
      { id: 'structural', label: 'Structural Changes', type: 'checkbox' },
    ],
    terminology: {
      project: 'Construction Project',
      estimate: 'Quote',
      crew: 'Construction Crew',
      jobSite: 'Job Site',
    },
  },
};

export function getTradeConfig(tradeType: TradeType): TradeVerticalConfig {
  return tradeVerticals[tradeType];
}

export function getAllTrades(): TradeVerticalConfig[] {
  return Object.values(tradeVerticals);
}
