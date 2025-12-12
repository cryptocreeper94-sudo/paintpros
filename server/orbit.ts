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
      'X-Orbit-API-Key': this.config.apiKey,
      'X-Orbit-API-Secret': this.config.apiSecret,
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
    return this.makeRequest<OrbitSnippet[]>('/api/snippets');
  }

  async shareSnippet(snippet: Partial<OrbitSnippet>): Promise<OrbitSnippet> {
    return this.makeRequest<OrbitSnippet>('/api/snippets', 'POST', snippet);
  }

  async getSnippetsByTag(tag: string): Promise<OrbitSnippet[]> {
    return this.makeRequest<OrbitSnippet[]>(`/api/snippets?tag=${encodeURIComponent(tag)}`);
  }

  async ping(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>('/api/health');
  }
}

export const orbitEcosystem = new OrbitEcosystem();
export type { OrbitEmployee, OrbitPayrollRecord, OrbitSnippet };
