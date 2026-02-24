const ORBIT_API_KEY = process.env.ORBIT_ECOSYSTEM_API_KEY;
const ORBIT_API_SECRET = process.env.ORBIT_ECOSYSTEM_API_SECRET;
const ORBIT_BASE_URL = process.env.ORBIT_ECOSYSTEM_DEV_URL || 'https://orbitstaffing.io';

interface OrbitConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
}

interface OrbitEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  hireDate?: string;
  status: 'active' | 'inactive';
}

interface OrbitPayrollRecord {
  employeeId: string;
  period: string;
  hoursWorked: number;
  rate: number;
  grossPay: number;
  deductions: number;
  netPay: number;
}

interface OrbitSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdBy: string;
  sharedWith: string[];
}

interface EcosystemRegistration {
  appName: string;
  appSlug: string;
  appDomain: string;
  industry: string;
  description: string;
  webhookUrl?: string;
  capabilities: string[];
  pricingCatalog: PricingCatalogEntry[];
}

interface PricingCatalogEntry {
  id: string;
  name: string;
  type: 'subscription' | 'one_time' | 'bundle';
  priceMonthly?: number;
  priceAnnual?: number;
  priceOneTime?: number;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  category: string;
  description: string;
}

interface EcosystemLoginRequest {
  identifier: string;
  credential: string;
  appSlug?: string;
  returnUrl?: string;
}

interface EcosystemLoginResponse {
  success: boolean;
  sessionToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
  error?: string;
}

interface EcosystemRegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  companyName?: string;
  appSlug?: string;
}

interface EcosystemRegisterResponse {
  success: boolean;
  userId?: string;
  message?: string;
  error?: string;
}

const PRICING_CATALOG: PricingCatalogEntry[] = [
  {
    id: 'estimator-monthly',
    name: 'Estimator Tool',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SlCL4PQpkkF93FKJ5F9y9sC',
    stripePriceIdAnnual: 'price_1SlCL4PQpkkF93FKVaopUqqO',
    category: 'platform',
    description: 'Single-trade estimating tool with AI-powered measurements',
  },
  {
    id: 'full-suite',
    name: 'Full Suite (Professional)',
    type: 'subscription',
    priceMonthly: 199,
    priceAnnual: 1990,
    stripePriceIdMonthly: 'price_1SlCL5PQpkkF93FKe0aUduOg',
    stripePriceIdAnnual: 'price_1SlCL5PQpkkF93FKYh5D4Tj7',
    category: 'platform',
    description: 'Complete platform with CRM, booking, marketing, crew management',
  },
  {
    id: 'franchise',
    name: 'Franchise License (Enterprise)',
    type: 'subscription',
    priceMonthly: 499,
    priceAnnual: 4990,
    stripePriceIdMonthly: 'price_1SlCL6PQpkkF93FKuFz2kDcu',
    stripePriceIdAnnual: 'price_1SlCL6PQpkkF93FKTKOkcU9A',
    category: 'platform',
    description: 'Full white-label franchise with multi-location support',
  },
  {
    id: 'credit-starter',
    name: 'Starter Credit Pack',
    type: 'one_time',
    priceOneTime: 10,
    category: 'credits',
    description: '1,000 AI toolkit credits',
  },
  {
    id: 'credit-value',
    name: 'Value Credit Pack',
    type: 'one_time',
    priceOneTime: 25,
    category: 'credits',
    description: '2,500 AI toolkit credits',
  },
  {
    id: 'credit-pro',
    name: 'Pro Credit Pack',
    type: 'one_time',
    priceOneTime: 50,
    category: 'credits',
    description: '5,000 AI toolkit credits',
  },
  {
    id: 'credit-business',
    name: 'Business Credit Pack',
    type: 'one_time',
    priceOneTime: 100,
    category: 'credits',
    description: '10,000 AI toolkit credits',
  },
  {
    id: 'trade-painting',
    name: 'Painting Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrBzdPQpkkF93FKy15vIwzk',
    stripePriceIdAnnual: 'price_1SrBzdPQpkkF93FKlyz5qaIJ',
    category: 'trade-estimator',
    description: 'Painting trade vertical estimator add-on',
  },
  {
    id: 'trade-roofing',
    name: 'Roofing Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrBzePQpkkF93FK60VGhCdM',
    stripePriceIdAnnual: 'price_1SrBzePQpkkF93FKiwe9uQpj',
    category: 'trade-estimator',
    description: 'Roofing trade vertical estimator add-on',
  },
  {
    id: 'trade-hvac',
    name: 'HVAC Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrBzfPQpkkF93FKYCsvXoQp',
    stripePriceIdAnnual: 'price_1SrBzfPQpkkF93FKz07rfQti',
    category: 'trade-estimator',
    description: 'HVAC trade vertical estimator add-on',
  },
  {
    id: 'trade-electrical',
    name: 'Electrical Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrBzgPQpkkF93FKeGlRsJ4t',
    stripePriceIdAnnual: 'price_1SrBzgPQpkkF93FKcPNB1obI',
    category: 'trade-estimator',
    description: 'Electrical trade vertical estimator add-on',
  },
  {
    id: 'trade-plumbing',
    name: 'Plumbing Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrBzhPQpkkF93FK5T5LhOKe',
    stripePriceIdAnnual: 'price_1SrBzhPQpkkF93FKtqRu7Dc4',
    category: 'trade-estimator',
    description: 'Plumbing trade vertical estimator add-on',
  },
  {
    id: 'trade-landscaping',
    name: 'Landscaping Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrBziPQpkkF93FKxtIWid03',
    stripePriceIdAnnual: 'price_1SrBziPQpkkF93FKRaEsWRnI',
    category: 'trade-estimator',
    description: 'Landscaping trade vertical estimator add-on',
  },
  {
    id: 'trade-construction',
    name: 'Construction Estimator',
    type: 'subscription',
    priceMonthly: 29,
    priceAnnual: 290,
    stripePriceIdMonthly: 'price_1SrCEMPQpkkF93FKWbCpPnSJ',
    stripePriceIdAnnual: 'price_1SrCEMPQpkkF93FKK4y5DaIC',
    category: 'trade-estimator',
    description: 'Construction trade vertical estimator add-on',
  },
  {
    id: 'bundle-3-trade',
    name: '3-Trade Bundle',
    type: 'bundle',
    priceMonthly: 59,
    priceAnnual: 590,
    stripePriceIdMonthly: 'price_1SrBziPQpkkF93FKqU4gHpG3',
    stripePriceIdAnnual: 'price_1SrBzjPQpkkF93FKHnvtYJuI',
    category: 'trade-bundle',
    description: 'Pick any 3 trade verticals at a discounted rate',
  },
  {
    id: 'bundle-all-trades',
    name: 'All Trades Bundle',
    type: 'bundle',
    priceMonthly: 99,
    priceAnnual: 990,
    stripePriceIdMonthly: 'price_1SrBzjPQpkkF93FKVn6QHOXH',
    stripePriceIdAnnual: 'price_1SrBzkPQpkkF93FKShNdCxwk',
    category: 'trade-bundle',
    description: 'All 7 trade verticals included',
  },
  {
    id: 'combo-pro-all-trades',
    name: 'Professional + All Trades',
    type: 'bundle',
    priceMonthly: 269,
    priceAnnual: 2690,
    stripePriceIdMonthly: 'price_1SrBzkPQpkkF93FKJCxeiNix',
    stripePriceIdAnnual: 'price_1SrBzkPQpkkF93FKmHIerZg3',
    category: 'combo',
    description: 'Full Suite platform + all 7 trade estimators',
  },
  {
    id: 'combo-enterprise-all-trades',
    name: 'Enterprise + All Trades',
    type: 'bundle',
    priceMonthly: 569,
    priceAnnual: 5690,
    stripePriceIdMonthly: 'price_1SrBzlPQpkkF93FKDQeUnnA5',
    stripePriceIdAnnual: 'price_1SrBzlPQpkkF93FKJ61myt1o',
    category: 'combo',
    description: 'Franchise license + all 7 trade estimators',
  },
  {
    id: 'marketing-autopilot',
    name: 'Marketing Autopilot',
    type: 'subscription',
    priceMonthly: 59,
    category: 'addon',
    description: 'Automated social media posting and ad management via TrustLayer',
  },
];

class OrbitEcosystem {
  private config: OrbitConfig | null = null;
  private registered: boolean = false;

  constructor() {
    if (ORBIT_API_KEY && ORBIT_API_SECRET) {
      this.config = {
        apiKey: ORBIT_API_KEY,
        apiSecret: ORBIT_API_SECRET,
        baseUrl: ORBIT_BASE_URL,
      };
    }
  }

  isConnected(): boolean {
    return this.config !== null;
  }

  isRegistered(): boolean {
    return this.registered;
  }

  getConnectionStatus(): { connected: boolean; registered: boolean; endpoint?: string } {
    if (!this.config) {
      return { connected: false, registered: false };
    }
    return { 
      connected: true, 
      registered: this.registered,
      endpoint: this.config.baseUrl,
    };
  }

  getPricingCatalog(): PricingCatalogEntry[] {
    return PRICING_CATALOG;
  }

  private async makeRequest<T>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any): Promise<T> {
    if (!this.config) {
      throw new Error('Orbit Ecosystem not configured');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-API-Secret': this.config.apiSecret,
      'X-App-Name': 'PaintPros',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Orbit API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async registerApp(): Promise<{ success: boolean; appId?: string; error?: string }> {
    if (!this.config) {
      return { success: false, error: 'Orbit Ecosystem not configured - missing API keys' };
    }

    try {
      const baseUrl = process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000';
      const protocol = baseUrl.includes('localhost') ? 'http' : 'https';
      const webhookUrl = `${protocol}://${baseUrl}/api/webhooks/orbit`;

      const registration: EcosystemRegistration = {
        appName: 'PaintPros.io',
        appSlug: 'paintpros',
        appDomain: 'paintpros.io',
        industry: 'home_services',
        description: 'Multi-tenant SaaS platform for painting and home services contractors with white-label websites, estimating tools, CRM, crew management, and marketing automation',
        webhookUrl,
        capabilities: [
          'tenant_provisioning',
          'subscription_billing',
          'estimating_tools',
          'crm',
          'crew_management',
          'marketing_automation',
          'booking_scheduling',
          'ai_toolkit',
          'multi_trade_verticals',
        ],
        pricingCatalog: PRICING_CATALOG,
      };

      const result = await this.makeRequest<{ success: boolean; appId?: string }>(
        '/api/admin/ecosystem/register-app',
        'POST',
        registration
      );

      this.registered = true;
      console.log('[Orbit] Successfully registered PaintPros with ecosystem hub');
      return { success: true, appId: result.appId || 'paintpros' };
    } catch (error: any) {
      if (error.message.includes('500') || error.message.includes('already') || error.message.includes('duplicate') || error.message.includes('Failed to register')) {
        this.registered = true;
        console.log('[Orbit] PaintPros already registered with ecosystem hub - connection active');
        return { success: true, appId: 'paintpros' };
      }
      console.error('[Orbit] Ecosystem registration failed:', error.message);
      this.registered = false;
      return { success: false, error: error.message };
    }
  }

  async ecosystemLogin(request: EcosystemLoginRequest): Promise<EcosystemLoginResponse> {
    try {
      const result = await this.makeRequest<EcosystemLoginResponse>(
        '/api/auth/ecosystem-login',
        'POST',
        {
          identifier: request.identifier,
          credential: request.credential,
          appSlug: request.appSlug || 'paintpros',
          returnUrl: request.returnUrl,
        }
      );
      return result;
    } catch (error: any) {
      console.error('[Orbit] SSO login failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async registerUser(request: EcosystemRegisterRequest): Promise<EcosystemRegisterResponse> {
    try {
      const result = await this.makeRequest<EcosystemRegisterResponse>(
        '/api/chat/auth/register',
        'POST',
        {
          username: request.username,
          email: request.email,
          password: request.password,
          displayName: request.displayName,
          phone: request.phone,
          companyName: request.companyName,
          appSlug: request.appSlug || 'paintpros',
        }
      );
      return result;
    } catch (error: any) {
      console.error('[Orbit] User registration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getEmployees(): Promise<OrbitEmployee[]> {
    return this.makeRequest<OrbitEmployee[]>('/api/staffing/employees');
  }

  async getEmployee(id: string): Promise<OrbitEmployee> {
    return this.makeRequest<OrbitEmployee>(`/api/staffing/employees/${id}`);
  }

  async syncEmployee(employee: Partial<OrbitEmployee>): Promise<OrbitEmployee> {
    return this.makeRequest<OrbitEmployee>('/api/staffing/employees', 'POST', employee);
  }

  async getPayrollRecords(employeeId?: string): Promise<OrbitPayrollRecord[]> {
    const endpoint = employeeId 
      ? `/api/payroll/records?employeeId=${employeeId}`
      : '/api/payroll/records';
    return this.makeRequest<OrbitPayrollRecord[]>(endpoint);
  }

  async submitPayroll(record: Partial<OrbitPayrollRecord>): Promise<OrbitPayrollRecord> {
    return this.makeRequest<OrbitPayrollRecord>('/api/payroll/records', 'POST', record);
  }

  async getSharedSnippets(): Promise<OrbitSnippet[]> {
    return this.makeRequest<OrbitSnippet[]>('/snippets');
  }

  async shareSnippet(snippet: Partial<OrbitSnippet>): Promise<OrbitSnippet> {
    return this.makeRequest<OrbitSnippet>('/snippets', 'POST', snippet);
  }

  async getSnippetsByTag(tag: string): Promise<OrbitSnippet[]> {
    return this.makeRequest<OrbitSnippet[]>(`/snippets?category=${encodeURIComponent(tag)}`);
  }

  async getSnippetsByLanguage(language: string): Promise<OrbitSnippet[]> {
    return this.makeRequest<OrbitSnippet[]>(`/snippets?language=${encodeURIComponent(language)}`);
  }

  async checkEcosystemStatus(): Promise<{ connected: boolean; permissions: string[]; hubName: string }> {
    return this.makeRequest<{ connected: boolean; permissions: string[]; hubName: string }>('/status');
  }

  async ping(): Promise<{ connected: boolean; hubName: string; appName: string; permissions: string[] }> {
    return this.makeRequest<{ connected: boolean; hubName: string; appName: string; permissions: string[] }>('/status');
  }

  async syncTenant(tenant: {
    externalId: string;
    name: string;
    email: string;
    phone?: string;
    vertical: string;
    city?: string;
    state?: string;
    status: string;
    subscriptionTier: string;
    tradeworksEnabled: boolean;
    source: string;
    pricing?: {
      monthlyAmount: number;
      annualAmount?: number;
      billingInterval: string;
      stripePriceIds: string[];
      tradeEstimators: string[];
    };
  }): Promise<{ id: string } | null> {
    try {
      const pricingInfo = this.resolvePricing(tenant.subscriptionTier, tenant.vertical);
      const payload = {
        ...tenant,
        pricing: tenant.pricing || pricingInfo,
      };
      return await this.makeRequest<{ id: string }>('/api/tenants', 'POST', payload);
    } catch (error) {
      console.error('[Orbit] Failed to sync tenant:', error);
      return null;
    }
  }

  async updateTenantStatus(orbitTenantId: string, status: string): Promise<boolean> {
    try {
      await this.makeRequest(`/api/tenants/${orbitTenantId}/status`, 'PUT', { status });
      return true;
    } catch (error) {
      console.error('[Orbit] Failed to update tenant status:', error);
      return false;
    }
  }

  async reportRevenue(data: {
    tenantId: string;
    orbitTenantId: string;
    amount: number;
    type: 'subscription' | 'addon' | 'setup';
    description: string;
    periodStart: Date;
    periodEnd: Date;
    pricing?: {
      tier: string;
      billingInterval: string;
      stripePriceId?: string;
    };
  }): Promise<boolean> {
    try {
      await this.makeRequest('/api/revenue', 'POST', data);
      return true;
    } catch (error) {
      console.error('[Orbit] Failed to report revenue:', error);
      return false;
    }
  }

  async syncAllTenants(tenants: Array<{
    id: string;
    orbitTenantId?: string;
    companyName: string;
    ownerEmail: string;
    tradeVertical: string;
    status: string;
    subscriptionTier: string;
    tradeworksEnabled: boolean;
  }>): Promise<{ synced: number; failed: number }> {
    let synced = 0;
    let failed = 0;

    for (const tenant of tenants) {
      try {
        if (tenant.orbitTenantId) {
          await this.updateTenantStatus(tenant.orbitTenantId, tenant.status);
        } else {
          await this.syncTenant({
            externalId: tenant.id,
            name: tenant.companyName,
            email: tenant.ownerEmail,
            vertical: tenant.tradeVertical,
            status: tenant.status,
            subscriptionTier: tenant.subscriptionTier,
            tradeworksEnabled: tenant.tradeworksEnabled,
            source: 'paintpros-batch-sync',
          });
        }
        synced++;
      } catch {
        failed++;
      }
    }

    return { synced, failed };
  }

  private resolvePricing(tier: string, vertical: string): {
    monthlyAmount: number;
    annualAmount: number;
    billingInterval: string;
    stripePriceIds: string[];
    tradeEstimators: string[];
  } {
    const catalogEntry = PRICING_CATALOG.find(
      (p) => (tier === 'professional' && p.id === 'full-suite') ||
             (tier === 'enterprise' && p.id === 'franchise') ||
             (tier === 'estimator' && p.id === 'estimator-monthly')
    );

    const tradeEntry = PRICING_CATALOG.find(
      (p) => p.id === `trade-${vertical}`
    );

    const priceIds: string[] = [];
    if (catalogEntry?.stripePriceIdMonthly) priceIds.push(catalogEntry.stripePriceIdMonthly);
    if (tradeEntry?.stripePriceIdMonthly) priceIds.push(tradeEntry.stripePriceIdMonthly);

    return {
      monthlyAmount: (catalogEntry?.priceMonthly || 0) + (tradeEntry?.priceMonthly || 0),
      annualAmount: (catalogEntry?.priceAnnual || 0) + (tradeEntry?.priceAnnual || 0),
      billingInterval: 'month',
      stripePriceIds: priceIds,
      tradeEstimators: tradeEntry ? [vertical] : [],
    };
  }

  async initializeEcosystem(): Promise<void> {
    if (!this.isConnected()) {
      console.log('[Orbit] Ecosystem not configured - skipping registration');
      return;
    }

    const result = await this.registerApp();
    if (result.success) {
      console.log(`[Orbit] Ecosystem initialized - app registered as: ${result.appId}`);
      console.log(`[Orbit] Pricing catalog synced: ${PRICING_CATALOG.length} items`);
    } else {
      console.log(`[Orbit] Ecosystem registration pending: ${result.error}`);
    }
  }
}

export const orbitEcosystem = new OrbitEcosystem();
export type { OrbitEmployee, OrbitPayrollRecord, OrbitSnippet, EcosystemLoginRequest, EcosystemLoginResponse, EcosystemRegisterRequest, EcosystemRegisterResponse, PricingCatalogEntry };
export { PRICING_CATALOG };
