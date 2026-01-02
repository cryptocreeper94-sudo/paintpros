// Create Stripe webhook endpoint for live account
// Run with: npx tsx server/scripts/create-webhook.ts

import { getUncachableStripeClient } from "../stripeClient";

async function createWebhook() {
  console.log("Connecting to Stripe...");
  const stripe = await getUncachableStripeClient();
  
  // Get the production domain
  const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
  const domain = domains[0] || 'your-app.replit.app';
  
  const webhookUrl = `https://${domain}/api/credits/webhook`;
  
  console.log(`Creating webhook for: ${webhookUrl}`);
  
  // Check if webhook already exists
  const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });
  const existing = existingWebhooks.data.find(w => w.url === webhookUrl);
  
  if (existing) {
    console.log(`\nWebhook already exists: ${existing.id}`);
    console.log(`URL: ${existing.url}`);
    console.log(`Status: ${existing.status}`);
    console.log(`\nTo get a new secret, delete this webhook in Stripe Dashboard and run again.`);
    return;
  }
  
  // Create new webhook endpoint
  const webhook = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: [
      'checkout.session.completed',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ],
    description: 'PaintPros.io Credits and Payments Webhook',
  });
  
  console.log(`\n========================================`);
  console.log(`WEBHOOK CREATED SUCCESSFULLY`);
  console.log(`========================================\n`);
  console.log(`Webhook ID: ${webhook.id}`);
  console.log(`URL: ${webhook.url}`);
  console.log(`\n🔑 WEBHOOK SECRET - Add this as STRIPE_WEBHOOK_SECRET:`);
  console.log(`\n${webhook.secret}\n`);
}

createWebhook()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
