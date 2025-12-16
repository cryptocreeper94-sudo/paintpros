import { db } from "./db";
import { quickbooksTokens, quickbooksSyncLog, estimates, leads } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

const QUICKBOOKS_CLIENT_ID = process.env.QUICKBOOKS_CLIENT_ID;
const QUICKBOOKS_CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET;
const QUICKBOOKS_REDIRECT_URI = process.env.QUICKBOOKS_REDIRECT_URI;
const QUICKBOOKS_ENVIRONMENT = process.env.QUICKBOOKS_ENVIRONMENT || "sandbox";

const QB_OAUTH_URL = "https://appcenter.intuit.com/connect/oauth2";
const QB_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const QB_API_BASE = QUICKBOOKS_ENVIRONMENT === "production" 
  ? "https://quickbooks.api.intuit.com" 
  : "https://sandbox-quickbooks.api.intuit.com";

export function isQuickBooksConfigured(): boolean {
  return !!(QUICKBOOKS_CLIENT_ID && QUICKBOOKS_CLIENT_SECRET && QUICKBOOKS_REDIRECT_URI);
}

export function getAuthorizationUrl(state: string): string {
  if (!isQuickBooksConfigured()) {
    throw new Error("QuickBooks is not configured");
  }

  const params = new URLSearchParams({
    client_id: QUICKBOOKS_CLIENT_ID!,
    response_type: "code",
    scope: "com.intuit.quickbooks.accounting",
    redirect_uri: QUICKBOOKS_REDIRECT_URI!,
    state,
  });

  return `${QB_OAUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string, realmId: string, tenantId: string) {
  if (!isQuickBooksConfigured()) {
    throw new Error("QuickBooks is not configured");
  }

  const credentials = Buffer.from(`${QUICKBOOKS_CLIENT_ID}:${QUICKBOOKS_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(QB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: QUICKBOOKS_REDIRECT_URI!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  const tokens = await response.json();
  
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
  const refreshTokenExpiresAt = tokens.x_refresh_token_expires_in 
    ? new Date(Date.now() + tokens.x_refresh_token_expires_in * 1000)
    : null;

  const existing = await db.select().from(quickbooksTokens).where(eq(quickbooksTokens.tenantId, tenantId));
  
  if (existing.length > 0) {
    await db.update(quickbooksTokens)
      .set({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        refreshTokenExpiresAt,
        realmId,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(quickbooksTokens.tenantId, tenantId));
  } else {
    await db.insert(quickbooksTokens).values({
      tenantId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      refreshTokenExpiresAt,
      realmId,
      isActive: true,
    });
  }

  return { success: true, realmId };
}

export async function refreshAccessToken(tenantId: string): Promise<string | null> {
  if (!isQuickBooksConfigured()) {
    return null;
  }

  const [tokenRecord] = await db.select().from(quickbooksTokens)
    .where(and(eq(quickbooksTokens.tenantId, tenantId), eq(quickbooksTokens.isActive, true)));

  if (!tokenRecord) {
    return null;
  }

  if (new Date() < new Date(tokenRecord.expiresAt.getTime() - 5 * 60 * 1000)) {
    return tokenRecord.accessToken;
  }

  const credentials = Buffer.from(`${QUICKBOOKS_CLIENT_ID}:${QUICKBOOKS_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(QB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credentials}`,
      "Accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokenRecord.refreshToken,
    }),
  });

  if (!response.ok) {
    console.error("Failed to refresh QuickBooks token");
    await db.update(quickbooksTokens)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(quickbooksTokens.id, tokenRecord.id));
    return null;
  }

  const tokens = await response.json();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await db.update(quickbooksTokens)
    .set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(quickbooksTokens.id, tokenRecord.id));

  return tokens.access_token;
}

async function makeQBRequest(tenantId: string, method: string, endpoint: string, body?: any) {
  const accessToken = await refreshAccessToken(tenantId);
  if (!accessToken) {
    throw new Error("No valid QuickBooks token available");
  }

  const [tokenRecord] = await db.select().from(quickbooksTokens)
    .where(eq(quickbooksTokens.tenantId, tenantId));

  const url = `${QB_API_BASE}/v3/company/${tokenRecord.realmId}/${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`QuickBooks API error: ${error}`);
  }

  return response.json();
}

export async function createQBCustomer(tenantId: string, customerData: {
  displayName: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}) {
  const qbCustomer = {
    DisplayName: customerData.displayName,
    PrimaryEmailAddr: customerData.email ? { Address: customerData.email } : undefined,
    PrimaryPhone: customerData.phone ? { FreeFormNumber: customerData.phone } : undefined,
    GivenName: customerData.firstName,
    FamilyName: customerData.lastName,
  };

  return makeQBRequest(tenantId, "POST", "customer", qbCustomer);
}

export async function createQBInvoice(tenantId: string, invoiceData: {
  customerRef: string;
  lineItems: Array<{
    description: string;
    amount: number;
    quantity?: number;
  }>;
  dueDate?: string;
}) {
  const qbInvoice = {
    CustomerRef: { value: invoiceData.customerRef },
    Line: invoiceData.lineItems.map((item, idx) => ({
      Id: String(idx + 1),
      DetailType: "SalesItemLineDetail",
      Amount: item.amount,
      Description: item.description,
      SalesItemLineDetail: {
        Qty: item.quantity || 1,
        UnitPrice: item.amount / (item.quantity || 1),
      },
    })),
    DueDate: invoiceData.dueDate,
  };

  return makeQBRequest(tenantId, "POST", "invoice", qbInvoice);
}

export async function syncEstimateToQB(tenantId: string, estimateId: string) {
  try {
    const [estimate] = await db.select().from(estimates).where(eq(estimates.id, estimateId));
    if (!estimate) {
      throw new Error("Estimate not found");
    }

    const [lead] = await db.select().from(leads).where(eq(leads.id, estimate.leadId));
    if (!lead) {
      throw new Error("Lead not found");
    }

    const existingSync = await db.select().from(quickbooksSyncLog)
      .where(and(
        eq(quickbooksSyncLog.tenantId, tenantId),
        eq(quickbooksSyncLog.localId, estimateId),
        eq(quickbooksSyncLog.entityType, "estimate")
      ));

    if (existingSync.length > 0 && existingSync[0].syncStatus === "synced") {
      return { success: true, message: "Already synced", quickbooksId: existingSync[0].quickbooksId };
    }

    const lineItems = [];
    if (estimate.includeWalls && Number(estimate.wallsPrice) > 0) {
      lineItems.push({ description: "Wall Painting", amount: Number(estimate.wallsPrice) });
    }
    if (estimate.includeTrim && Number(estimate.trimPrice) > 0) {
      lineItems.push({ description: "Trim Painting", amount: Number(estimate.trimPrice) });
    }
    if (estimate.includeCeilings && Number(estimate.ceilingsPrice) > 0) {
      lineItems.push({ description: "Ceiling Painting", amount: Number(estimate.ceilingsPrice) });
    }
    if (estimate.doorCount > 0 && Number(estimate.doorsPrice) > 0) {
      lineItems.push({ description: `Door Painting (${estimate.doorCount} doors)`, amount: Number(estimate.doorsPrice) });
    }

    await db.insert(quickbooksSyncLog).values({
      tenantId,
      entityType: "estimate",
      localId: estimateId,
      syncDirection: "to_quickbooks",
      syncStatus: "pending",
      syncData: { estimate, lead, lineItems },
    });

    return { 
      success: true, 
      message: "Sync queued - QuickBooks credentials required",
      requiresAuth: !await hasValidToken(tenantId)
    };
  } catch (error: any) {
    await db.insert(quickbooksSyncLog).values({
      tenantId,
      entityType: "estimate",
      localId: estimateId,
      syncDirection: "to_quickbooks",
      syncStatus: "failed",
      errorMessage: error.message,
    });
    throw error;
  }
}

export async function hasValidToken(tenantId: string): Promise<boolean> {
  const [token] = await db.select().from(quickbooksTokens)
    .where(and(eq(quickbooksTokens.tenantId, tenantId), eq(quickbooksTokens.isActive, true)));
  
  if (!token) return false;
  
  if (token.refreshTokenExpiresAt && new Date() > token.refreshTokenExpiresAt) {
    return false;
  }
  
  return true;
}

export async function getQBConnectionStatus(tenantId: string) {
  const [token] = await db.select().from(quickbooksTokens)
    .where(eq(quickbooksTokens.tenantId, tenantId));

  if (!token) {
    return { connected: false, configured: isQuickBooksConfigured() };
  }

  const isValid = await hasValidToken(tenantId);

  return {
    connected: token.isActive && isValid,
    configured: isQuickBooksConfigured(),
    companyName: token.companyName,
    lastSyncAt: token.lastSyncAt,
    needsReauth: !isValid && token.isActive,
  };
}

export async function disconnectQB(tenantId: string) {
  await db.update(quickbooksTokens)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(quickbooksTokens.tenantId, tenantId));
  
  return { success: true };
}
