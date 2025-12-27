import crypto from 'crypto';

const HUB_URL = process.env.ORBIT_FINANCIAL_HUB_URL;
const API_KEY = process.env.ORBIT_FINANCIAL_HUB_KEY || 'dw_app_paintpros';
const API_SECRET = process.env.PAINTPROS_WEBHOOK_SECRET;

function generateSignature(payload: object): string {
  const body = JSON.stringify(payload);
  return crypto.createHmac('sha256', API_SECRET!).update(body).digest('hex');
}

export function isFinancialHubConfigured(): boolean {
  return !!(HUB_URL && API_KEY && API_SECRET);
}

export async function reportRevenue(data: {
  grossAmount: number;
  netAmount?: number;
  description: string;
  externalRef?: string;
  productCode?: string;
}): Promise<{ success: boolean; error?: string; data?: any }> {
  if (!isFinancialHubConfigured()) {
    console.log('[Financial Hub] Not configured - skipping revenue sync');
    return { success: false, error: 'Financial Hub not configured' };
  }

  const payload = {
    sourceSystem: 'PaintPros.io',
    sourceAppId: 'dw_app_paintpros',
    eventType: 'revenue',
    grossAmount: data.grossAmount,
    netAmount: data.netAmount ?? data.grossAmount,
    description: data.description,
    externalRef: data.externalRef,
    productCode: data.productCode || 'paintpros',
    idempotencyKey: `paintpros_${data.externalRef || Date.now()}`
  };

  const signature = generateSignature(payload);

  try {
    const response = await fetch(`${HUB_URL}/api/financial-hub/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Orbit-Api-Key': API_KEY!,
        'X-Orbit-Signature': signature
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('[Financial Hub] Revenue synced:', data.description, data.grossAmount);
      return { success: true, data: result };
    } else {
      console.error('[Financial Hub] Revenue sync failed:', result);
      return { success: false, error: result.message || 'Sync failed' };
    }
  } catch (error) {
    console.error('[Financial Hub] Revenue sync error:', error);
    return { success: false, error: String(error) };
  }
}

export async function reportExpense(data: {
  grossAmount: number;
  description: string;
  externalRef?: string;
  category?: string;
}): Promise<{ success: boolean; error?: string; data?: any }> {
  if (!isFinancialHubConfigured()) {
    console.log('[Financial Hub] Not configured - skipping expense sync');
    return { success: false, error: 'Financial Hub not configured' };
  }

  const payload = {
    sourceSystem: 'PaintPros.io',
    sourceAppId: 'dw_app_paintpros',
    eventType: 'expense',
    grossAmount: data.grossAmount,
    netAmount: data.grossAmount,
    description: data.description,
    externalRef: data.externalRef,
    category: data.category,
    idempotencyKey: `paintpros_exp_${data.externalRef || Date.now()}`
  };

  const signature = generateSignature(payload);

  try {
    const response = await fetch(`${HUB_URL}/api/financial-hub/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Orbit-Api-Key': API_KEY!,
        'X-Orbit-Signature': signature
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('[Financial Hub] Expense synced:', data.description, data.grossAmount);
      return { success: true, data: result };
    } else {
      console.error('[Financial Hub] Expense sync failed:', result);
      return { success: false, error: result.message || 'Sync failed' };
    }
  } catch (error) {
    console.error('[Financial Hub] Expense sync error:', error);
    return { success: false, error: String(error) };
  }
}

export async function reportPayout(data: {
  grossAmount: number;
  recipientName: string;
  description: string;
  externalRef?: string;
  paymentMethod?: string;
}): Promise<{ success: boolean; error?: string; data?: any }> {
  if (!isFinancialHubConfigured()) {
    console.log('[Financial Hub] Not configured - skipping payout sync');
    return { success: false, error: 'Financial Hub not configured' };
  }

  const payload = {
    sourceSystem: 'PaintPros.io',
    sourceAppId: 'dw_app_paintpros',
    eventType: 'payout',
    grossAmount: data.grossAmount,
    netAmount: data.grossAmount,
    description: `${data.recipientName}: ${data.description}`,
    externalRef: data.externalRef,
    paymentMethod: data.paymentMethod,
    idempotencyKey: `paintpros_pay_${data.externalRef || Date.now()}`
  };

  const signature = generateSignature(payload);

  try {
    const response = await fetch(`${HUB_URL}/api/financial-hub/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Orbit-Api-Key': API_KEY!,
        'X-Orbit-Signature': signature
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('[Financial Hub] Payout synced:', data.recipientName, data.grossAmount);
      return { success: true, data: result };
    } else {
      console.error('[Financial Hub] Payout sync failed:', result);
      return { success: false, error: result.message || 'Sync failed' };
    }
  } catch (error) {
    console.error('[Financial Hub] Payout sync error:', error);
    return { success: false, error: String(error) };
  }
}

export async function checkHubStatus(): Promise<{ connected: boolean; status?: any }> {
  if (!HUB_URL) {
    return { connected: false };
  }

  try {
    const response = await fetch(`${HUB_URL}/api/financial-hub/status`);
    if (response.ok) {
      const status = await response.json();
      return { connected: true, status };
    }
    return { connected: false };
  } catch {
    return { connected: false };
  }
}
