const ORBIT_API_KEY = process.env.ORBIT_ECOSYSTEM_API_KEY;
const ORBIT_API_SECRET = process.env.ORBIT_ECOSYSTEM_API_SECRET;
const ORBIT_DEV_URL = process.env.ORBIT_ECOSYSTEM_DEV_URL;

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

class OrbitEcosystem {
  private config: OrbitConfig | null = null;

  constructor() {
    if (ORBIT_API_KEY && ORBIT_API_SECRET && ORBIT_DEV_URL) {
      this.config = {
        apiKey: ORBIT_API_KEY,
        apiSecret: ORBIT_API_SECRET,
        baseUrl: ORBIT_DEV_URL,
      };
    }
  }

  isConnected(): boolean {
    return this.config !== null;
  }

  getConnectionStatus(): { connected: boolean; endpoint?: string } {
    if (!this.config) {
      return { connected: false };
    }
    return { 
      connected: true, 
      endpoint: this.config.baseUrl 
    };
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
      throw new Error(`Orbit API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
  }): Promise<{ id: string } | null> {
    try {
      return await this.makeRequest<{ id: string }>('/api/tenants', 'POST', tenant);
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
}

export const orbitEcosystem = new OrbitEcosystem();
export type { OrbitEmployee, OrbitPayrollRecord, OrbitSnippet };
