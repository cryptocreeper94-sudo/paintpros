// Stripe client with hybrid credential management
// Uses STRIPE_LIVE_* secrets for production, Replit managed connection for sandbox

import Stripe from 'stripe';

async function getCredentials(): Promise<{ publishableKey: string; secretKey: string }> {
  // Check for live keys first (used in production or when explicitly configured)
  const liveSecretKey = process.env.STRIPE_LIVE_SECRET_KEY;
  const livePublishableKey = process.env.STRIPE_LIVE_PUBLISHABLE_KEY;
  
  // Use live keys if available (these are your Dark Wave Studios business keys)
  if (liveSecretKey && livePublishableKey) {
    console.log('[Stripe] Using live business account credentials');
    return {
      publishableKey: livePublishableKey,
      secretKey: liveSecretKey,
    };
  }

  // Fall back to Replit managed connection (sandbox)
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken || !hostname) {
    throw new Error('No Stripe credentials found. Please configure STRIPE_LIVE_SECRET_KEY and STRIPE_LIVE_PUBLISHABLE_KEY secrets.');
  }

  const connectorName = 'stripe';
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', connectorName);
  url.searchParams.set('environment', targetEnvironment);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    });

    const data = await response.json();
    const connectionSettings = data.items?.[0];

    if (connectionSettings?.settings?.publishable && connectionSettings?.settings?.secret) {
      console.log(`[Stripe] Using Replit managed ${targetEnvironment} connection`);
      return {
        publishableKey: connectionSettings.settings.publishable,
        secretKey: connectionSettings.settings.secret,
      };
    }
  } catch (error) {
    console.warn('[Stripe] Could not fetch Replit managed connection:', error);
  }

  throw new Error('No Stripe credentials available. Please add your Stripe keys.');
}

// Get a fresh Stripe client - never cache this
export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();

  return new Stripe(secretKey, {
    apiVersion: '2025-04-30.basil' as any,
  });
}

// Get publishable key for client-side
export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

// Get secret key for server-side operations
export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

// StripeSync singleton for webhook processing and data sync
let stripeSync: any = null;

export async function getStripeSync() {
  if (!stripeSync) {
    const { StripeSync } = await import('stripe-replit-sync');
    const secretKey = await getStripeSecretKey();

    stripeSync = new StripeSync({
      poolConfig: {
        connectionString: process.env.DATABASE_URL!,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSync;
}
