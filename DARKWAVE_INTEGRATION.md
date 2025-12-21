# Darkwave Chain Integration Guide

## Overview
Darkwave Chain is a secondary blockchain used alongside Solana for dual-chain document verification. This integration provides redundant, immutable records across two independent blockchains for maximum security and tamper-proof document stamping.

## Quick Start

### 1. Environment Variables
Add these secrets to your project:
```
DARKWAVE_API_KEY=your_api_key
DARKWAVE_API_SECRET=your_api_secret
DARKWAVE_API_URL=https://api.darkwave.io (optional, defaults to this)
```

### 2. Server-Side Integration

#### API Client (server/darkwave.ts)
```typescript
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

function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function getAuthHeaders(payload: string): Record<string, string> {
  const apiKey = process.env.DARKWAVE_API_KEY;
  const apiSecret = process.env.DARKWAVE_API_SECRET;
  
  if (!apiKey) throw new Error('DARKWAVE_API_KEY not configured');
  
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

export async function submitHashToDarkwave(
  contentHash: string,
  metadata: { entityType: string; entityId: string; tenantId?: string; version?: string }
): Promise<DarkwaveHashResponse> {
  try {
    const apiKey = process.env.DARKWAVE_API_KEY;
    if (!apiKey) return { success: false, error: 'DARKWAVE_API_KEY not configured' };

    const payload = {
      hash: contentHash,
      entityType: metadata.entityType,
      entityId: metadata.entityId,
      tenantId: metadata.tenantId || 'default',
      version: metadata.version,
      timestamp: new Date().toISOString(),
      source: 'your-app-name'
    };

    const payloadStr = JSON.stringify(payload);
    const response = await fetch(`${DARKWAVE_BASE_URL}/api/hash/submit`, {
      method: 'POST',
      headers: getAuthHeaders(payloadStr),
      body: payloadStr,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    const txHash = data.txHash || data.transactionHash;
    
    if (!txHash) return { success: false, error: 'No transaction hash returned' };
    
    return {
      success: true,
      txHash,
      blockNumber: data.blockNumber,
      timestamp: data.timestamp,
      explorerUrl: data.explorerUrl || `https://explorer.darkwave.io/tx/${txHash}`,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
```

### 3. Database Schema
Add these fields to your document/release tables:
```typescript
// In your Drizzle schema
darkwaveTxSignature: text("darkwave_tx_signature"),
darkwaveTxStatus: text("darkwave_tx_status").default("pending"),
```

### 4. Auto-Deploy Stamping
Add to your deployment function after Solana stamping:
```typescript
// After Solana stamp succeeds
try {
  const darkwaveResult = await darkwave.submitHashToDarkwave(contentHash, {
    entityType: 'release',
    entityId: release.id,
    tenantId: tenant.id,
    version: newVersion,
  });
  
  if (darkwaveResult.success && darkwaveResult.txHash) {
    await storage.updateReleaseDarkwaveStatus(release.id, darkwaveResult.txHash, "confirmed");
    console.log(`Darkwave SUCCESS! TX: ${darkwaveResult.txHash}`);
  }
} catch (error) {
  console.error('Darkwave stamp failed:', error);
  // Solana success is preserved even if Darkwave fails
}
```

### 5. Frontend Shield Component
Create a verification modal with QR code:
```tsx
import { QRCodeCanvas } from "qrcode.react";

const darkwaveExplorerUrl = release?.darkwaveTxSignature 
  ? `https://explorer.darkwave.io/tx/${release.darkwaveTxSignature}`
  : null;

{darkwaveExplorerUrl && (
  <a href={darkwaveExplorerUrl} target="_blank" rel="noopener noreferrer">
    <QRCodeCanvas 
      value={darkwaveExplorerUrl}
      size={40}
      bgColor="#7C3AED"
      fgColor="#FFFFFF"
    />
    <span>Verify on Darkwave</span>
  </a>
)}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/hash/submit` | POST | Submit a hash for blockchain stamping |
| `/api/hallmark/generate` | POST | Generate a Darkwave hallmark ID |
| `/api/hash/verify` | GET | Verify a hash exists on chain |

## Authentication
- **X-API-Key**: Your Darkwave API key
- **X-Signature**: HMAC-SHA256 signature of the request body
- **X-Timestamp**: Unix timestamp in milliseconds

## Error Handling
- Always wrap Darkwave calls in try/catch
- Store Darkwave failures separately from Solana successes
- Log errors but don't block primary chain operations

## Best Practices
1. Submit to both chains in parallel when possible
2. Store both transaction signatures independently
3. Show verification status for each chain separately
4. Use purple/blue gradient for Darkwave UI elements
5. Use green/purple gradient for Solana UI elements
