/**
 * Darkwave Chain Integration Client
 * 
 * Connects to the Darkwave ecosystem for dual-chain hashing
 * alongside Solana for release verification and hallmarks.
 */

import crypto from 'crypto';

const DARKWAVE_BASE_URL = process.env.DARKWAVE_API_URL || 'https://api.darkwave.io';

interface DarkwaveHashResponse {
  success: boolean;
  txHash?: string;
  blockNumber?: number;
  timestamp?: string;
  explorerUrl?: string;
  error?: string;
}

interface DarkwaveHallmarkResponse {
  success: boolean;
  hallmarkId?: string;
  hallmarkNumber?: string;
  qrCodeUrl?: string;
  txHash?: string;
  error?: string;
}

/**
 * Generate HMAC signature for API authentication
 */
function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Get authentication headers for Darkwave API with HMAC signature
 */
function getAuthHeaders(payload: string): Record<string, string> {
  const apiKey = process.env.DARKWAVE_API_KEY;
  const apiSecret = process.env.DARKWAVE_API_SECRET;
  
  if (!apiKey) {
    throw new Error('DARKWAVE_API_KEY not configured');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    'X-Timestamp': Date.now().toString(),
  };
  
  if (apiSecret) {
    headers['X-Signature'] = generateSignature(payload, apiSecret);
  }
  
  return headers;
}

/**
 * Submit a hash to Darkwave Chain
 */
export async function submitHashToDarkwave(
  contentHash: string,
  metadata: {
    entityType: string;
    entityId: string;
    tenantId?: string;
    version?: string;
  }
): Promise<DarkwaveHashResponse> {
  try {
    const apiKey = process.env.DARKWAVE_API_KEY;
    
    if (!apiKey) {
      console.log('[Darkwave] API key not configured, skipping');
      return { success: false, error: 'DARKWAVE_API_KEY not configured' };
    }

    const payload = {
      hash: contentHash,
      entityType: metadata.entityType,
      entityId: metadata.entityId,
      tenantId: metadata.tenantId || 'npp',
      version: metadata.version,
      timestamp: new Date().toISOString(),
      source: 'paintpros.io'
    };

    console.log(`[Darkwave] Submitting hash for ${metadata.entityType}: ${metadata.entityId}`);

    const payloadStr = JSON.stringify(payload);
    const response = await fetch(`${DARKWAVE_BASE_URL}/api/hash/submit`, {
      method: 'POST',
      headers: getAuthHeaders(payloadStr),
      body: payloadStr,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Darkwave] API error: ${response.status} - ${errorText}`);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    
    console.log(`[Darkwave] Hash submitted successfully. TX: ${data.txHash || 'pending'}`);
    
    return {
      success: true,
      txHash: data.txHash || data.transactionHash,
      blockNumber: data.blockNumber,
      timestamp: data.timestamp,
      explorerUrl: data.explorerUrl || `https://explorer.darkwave.io/tx/${data.txHash}`,
    };
  } catch (error) {
    console.error('[Darkwave] Error submitting hash:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Generate a Darkwave Hallmark for a release or document
 */
export async function generateDarkwaveHallmark(
  contentHash: string,
  metadata: {
    type: 'release' | 'document' | 'contract' | 'estimate';
    name: string;
    version?: string;
    tenantId?: string;
    recipientName?: string;
  }
): Promise<DarkwaveHallmarkResponse> {
  try {
    const apiKey = process.env.DARKWAVE_API_KEY;
    
    if (!apiKey) {
      console.log('[Darkwave] API key not configured, skipping hallmark generation');
      return { success: false, error: 'DARKWAVE_API_KEY not configured' };
    }

    const payload = {
      contentHash,
      assetType: metadata.type,
      name: metadata.name,
      version: metadata.version,
      tenantId: metadata.tenantId || 'npp',
      recipientName: metadata.recipientName,
      source: 'paintpros.io',
      timestamp: new Date().toISOString(),
    };

    console.log(`[Darkwave] Generating hallmark for ${metadata.type}: ${metadata.name}`);

    const payloadStr = JSON.stringify(payload);
    const response = await fetch(`${DARKWAVE_BASE_URL}/api/hallmark/generate`, {
      method: 'POST',
      headers: getAuthHeaders(payloadStr),
      body: payloadStr,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Darkwave] Hallmark API error: ${response.status} - ${errorText}`);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    
    console.log(`[Darkwave] Hallmark generated: ${data.hallmarkNumber || data.hallmarkId}`);
    
    return {
      success: true,
      hallmarkId: data.hallmarkId || data.id,
      hallmarkNumber: data.hallmarkNumber,
      qrCodeUrl: data.qrCodeUrl,
      txHash: data.txHash,
    };
  } catch (error) {
    console.error('[Darkwave] Error generating hallmark:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Verify a hallmark on Darkwave Chain
 */
export async function verifyDarkwaveHallmark(hallmarkId: string): Promise<{
  verified: boolean;
  hallmark?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`${DARKWAVE_BASE_URL}/api/hallmark/${hallmarkId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return { verified: false, error: `Hallmark not found: ${hallmarkId}` };
    }

    const data = await response.json();
    
    return {
      verified: true,
      hallmark: data,
    };
  } catch (error) {
    return { 
      verified: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Check if Darkwave integration is configured
 */
export function isDarkwaveConfigured(): boolean {
  return !!process.env.DARKWAVE_API_KEY;
}

/**
 * Hash data using SHA-256 (same as Solana implementation)
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}
