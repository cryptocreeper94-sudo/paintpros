# Automated Trial-to-Tenant Provisioning System

## Overview

This document provides comprehensive technical documentation for the automated trial-to-tenant provisioning system in PaintPros.io. This system handles the complete flow from a 72-hour trial signup through payment processing and automatic production tenant creation.

## Architecture Flow

```
Trial Signup → 72-Hour Trial → Upgrade Click → Stripe Checkout → Webhook → Auto-Provision → Welcome Email
```

## Key Files

| File | Purpose |
|------|---------|
| `shared/schema.ts` | Database schemas for `trialTenants` and `tenants` tables |
| `server/tenant-provisioning.ts` | Core provisioning service with business logic |
| `server/routes.ts` | API endpoints for trial and conversion |
| `server/resend.ts` | Email notification functions |
| `client/src/pages/trial-upgrade.tsx` | Frontend upgrade page with pricing |
| `client/src/pages/trial-upgrade-success.tsx` | Post-payment success page |

---

## Database Schema

### Trial Tenants Table (`trial_tenants`)

Stores 72-hour trial data with usage limits:

```typescript
{
  id: varchar,                  // UUID primary key
  ownerEmail: text,             // Owner's email
  ownerName: text,              // Owner's full name
  companyName: text,            // Company name
  companySlug: text,            // URL-friendly slug (unique)
  primaryColor: text,           // Branding color
  accentColor: text,            // Secondary color
  logoUrl: text,                // Uploaded logo
  status: text,                 // 'active' | 'expired' | 'converted' | 'cancelled'
  trialExpiresAt: timestamp,    // 72 hours from signup
  estimatesUsed: integer,       // Usage counter (limit: 1)
  leadsUsed: integer,           // Usage counter (limit: 3)
  blockchainStampsUsed: integer // Usage counter (limit: 1)
}
```

### Production Tenants Table (`tenants`)

Stores paid customer configurations:

```typescript
{
  id: varchar,                   // UUID primary key
  trialTenantId: varchar,        // Reference to source trial
  ownerEmail: text,              // Owner's email
  ownerName: text,               // Owner's full name
  ownerUserId: varchar,          // Link to users table
  companySlug: text,             // URL identifier (unique)
  subscriptionTier: text,        // 'starter' | 'professional' | 'franchise' | 'enterprise'
  subscriptionStatus: text,      // 'active' | 'past_due' | 'cancelled' | 'paused'
  stripeCustomerId: text,        // Stripe customer ID
  stripeSubscriptionId: text,    // Stripe subscription ID
  monthlyPrice: decimal,         // Monthly rate
  setupFee: decimal,             // One-time setup fee
  setupFeePaid: boolean,         // Payment status
  featuresEnabled: jsonb,        // Feature flags object
  status: text,                  // 'provisioning' | 'active' | 'suspended' | 'cancelled'
  provisionedAt: timestamp,      // When provisioned
  activatedAt: timestamp         // When activated
}
```

---

## Subscription Tiers

Defined in `server/tenant-provisioning.ts`:

| Tier | Monthly Price | Setup Fee | Key Features |
|------|--------------|-----------|--------------|
| Starter | $349 | $5,000 | Estimator, Color Library, CRM, Booking, Messaging |
| Professional | $549 | $7,000 | + AI Visualizer, Blockchain Stamping, Analytics |
| Franchise | $799 + $99/location | $10,000 | All features + multi-location support |
| Enterprise | $1,399 | $15,000 | All features + dedicated support |

---

## API Endpoints

### Trial Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /api/trial/signup` | POST | Create new trial tenant |
| `GET /api/trial/:slug` | GET | Get trial by URL slug |
| `PATCH /api/trial/:id` | PATCH | Update trial branding |
| `POST /api/trial/:id/upgrade` | POST | Create Stripe checkout session |
| `POST /api/trial/:id/convert` | POST | Convert trial to paid tenant |
| `GET /api/trial/plans` | GET | Get available pricing plans |

### Conversion Flow

#### 1. Create Checkout Session

```javascript
POST /api/trial/:id/upgrade
Body: { planId: 'professional' }
Response: { sessionId: string, url: string, plan: object }
```

#### 2. Convert Trial (called from success page)

```javascript
POST /api/trial/:id/convert
Body: { planId: 'professional', stripeSessionId: 'cs_xxx' }
Response: {
  success: true,
  tenant: { id, companyName, companySlug, subscriptionTier },
  preservedData: { branding, usage },
  nextSteps: { setupPasswordUrl, dashboardUrl }
}
```

---

## Stripe Webhook Integration

The webhook handler at `POST /api/payments/stripe/webhook` handles:

### checkout.session.completed

When `metadata.type === 'trial_upgrade'`:
1. Extracts trial ID and plan from session metadata
2. Calls `provisionTenantFromTrial()` automatically
3. Logs the conversion action

### Other Events (handled but not fully implemented)

- `customer.subscription.updated` - Handle status changes
- `customer.subscription.deleted` - Handle cancellations
- `invoice.payment_failed` - Handle payment failures

### Required Stripe Setup

1. Configure webhook endpoint: `https://your-domain.com/api/payments/stripe/webhook`
2. Add webhook secret to environment: `STRIPE_WEBHOOK_SECRET`
3. Subscribe to events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`

---

## Provisioning Service

### Main Function: `provisionTenantFromTrial()`

Located in `server/tenant-provisioning.ts`

**Parameters:**
- `trialId: string` - The trial tenant UUID
- `tier: SubscriptionTier` - Selected subscription tier
- `stripeData?: StripeCheckoutData` - Optional Stripe session data

**Process:**
1. Fetch trial tenant from database
2. Validate trial status (not already converted)
3. Check slug availability (append suffix if collision)
4. Get tier configuration (pricing, features)
5. Create production tenant record
6. Create/link owner user account
7. Migrate trial data (leads, estimates, blockchain stamps)
8. Mark tenant as active
9. Mark trial as converted
10. Send welcome email to owner
11. Send admin notification

**Returns:**
```typescript
{
  success: boolean,
  tenant?: Tenant,        // Created tenant object
  error?: string,         // Error message if failed
  message?: string        // Success message
}
```

### Data Migration

The `migrateTrialData()` function migrates:
- Leads: Updates `tenantId` from `trial-{id}` to new tenant ID
- Estimates: Updates `tenantId` similarly
- Blockchain Stamps: Updates `tenantId` similarly

---

## Email Notifications

### Welcome Email (`sendTenantWelcomeEmail`)

Sent to tenant owner after successful provisioning:
- Subscription details (plan, price, portal URL)
- Next steps (password setup, customization, first estimate)
- Support contact information

### Admin Notification (`sendAdminNotificationEmail`)

Sent to admin on new signups:
- Tenant details
- Subscription tier and pricing
- Trial usage statistics

---

## Frontend Pages

### `/trial/:slug/upgrade`

Pricing page showing 3 tier cards:
- Starter, Professional, Enterprise
- Monthly price display
- Features comparison
- "Choose Plan" buttons that trigger Stripe checkout

### `/trial/:slug/upgrade-success`

Post-payment success page:
- Calls `/api/trial/:id/convert` on mount
- Shows success animation
- Displays next steps
- Redirects to new portal

---

## Configuration Requirements

### Environment Variables

```
STRIPE_SECRET_KEY=sk_xxx          # Stripe API key
STRIPE_WEBHOOK_SECRET=whsec_xxx   # Webhook signing secret
ADMIN_EMAIL=admin@paintpros.io    # Admin notification recipient
CONTACT_EMAIL=contact@paintpros.io # Fallback contact
```

### Stripe Product Setup

Create products/prices in Stripe Dashboard:
1. Create a product for each tier
2. Set up recurring monthly prices
3. Note: Currently using subscription mode for checkout

---

## Testing the Flow

### Manual Test Steps

1. Create trial at `/trial/signup`
2. Complete trial setup at `/trial/{slug}`
3. Navigate to `/trial/{slug}/upgrade`
4. Select a plan and complete Stripe checkout
5. Verify redirect to success page
6. Check database for new tenant record
7. Verify emails sent

### API Testing

```bash
# Create test trial
curl -X POST /api/trial/signup \
  -H "Content-Type: application/json" \
  -d '{"ownerEmail":"test@example.com","ownerName":"Test User","companyName":"Test Painting"}'

# Check trial status
curl /api/trial/test-painting

# Simulate conversion (without Stripe)
curl -X POST /api/trial/{id}/convert \
  -H "Content-Type: application/json" \
  -d '{"planId":"professional","stripeSessionId":"test_session"}'
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Trial not found" | Invalid trial ID | Verify trial exists |
| "Trial already converted" | Double conversion attempt | Check trial status first |
| "Invalid tier" | Unknown subscription tier | Use valid tier key |
| "Payment not completed" | Stripe session not paid | Wait for payment confirmation |
| "Invalid payment session" | Session doesn't match trial | Verify metadata |

### Logging

All provisioning actions are logged with `[Provisioning]` prefix:
```
[Provisioning] Starting tenant provisioning for trial xxx, tier: professional
[Provisioning] Created tenant xxx for Company Name
[Provisioning] Migrated 3 leads
[Provisioning] Successfully provisioned tenant xxx
[Provisioning] Welcome email sent to owner@email.com
```

---

## Future Improvements

### Not Yet Implemented

1. **Subscription lifecycle management**
   - Handle subscription updates (downgrades, upgrades)
   - Process failed payments and grace periods
   - Automatic suspension on non-payment

2. **Admin dashboard for tenants**
   - View all active tenants
   - Manual status changes
   - Usage analytics

3. **Franchise-specific provisioning**
   - Multi-location setup
   - Parent-child tenant relationships
   - Per-location billing

4. **Password reset flow**
   - Email-based password setup for new owners
   - Secure token generation

### Integration Points

- **Stripe Connect**: For marketplace payments (future)
- **Darkwave Chain**: Document verification already integrated
- **Solana**: Blockchain stamping already integrated

---

## Security Measures

### Idempotency Protection

The provisioning system includes multiple layers of idempotency protection to prevent duplicate tenant creation:

1. **Pre-conversion check**: If a trial has `status === 'converted'`, the system checks for an existing tenant linked via `trialTenantId` and returns it.

2. **Race condition protection**: Before creating a new tenant, the system queries for any existing tenant with the same `trialTenantId` to handle concurrent conversion requests.

3. **Stripe validation**: When Stripe is configured, all conversions validate:
   - Session payment status must be `'paid'`
   - Session metadata `trialId` must match the trial being converted
   - Plan ID is verified from Stripe metadata (source of truth)

### Data Migration

Trial data is migrated using multiple tenant ID format checks:
- `trial-{id}` format
- `{slug}` format (company slug)
- `trial-{slug}` format
- `{id}` format (raw trial ID)

This ensures complete data transfer regardless of how trial data was stored.

### Security Warnings

When Stripe is not configured:
- Conversions still work (for development/testing)
- Warning logs are emitted for audit trail
- **In production, always configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`**

---

## Maintenance Notes

### Database Migrations

The tenants table was added via Drizzle schema push. To update:
```bash
npm run db:push
```

### Adding New Tiers

1. Add tier to `SUBSCRIPTION_TIERS` in `tenant-provisioning.ts`
2. Update frontend pricing page
3. Create corresponding Stripe product/price

### Modifying Feature Flags

Update the `featuresEnabled` type in schema and tier configurations:
```typescript
featuresEnabled: {
  estimator?: boolean;
  colorLibrary?: boolean;
  aiVisualizer?: boolean;
  blockchainStamping?: boolean;
  crm?: boolean;
  booking?: boolean;
  messaging?: boolean;
  analytics?: boolean;
  // Add new features here
}
```

---

## Quick Reference

### Key Imports

```typescript
// Provisioning service
import { provisionTenantFromTrial, SUBSCRIPTION_TIERS, type SubscriptionTier } from "./tenant-provisioning";

// Email functions
import { sendTenantWelcomeEmail, sendAdminNotificationEmail } from "./resend";

// Database types
import { tenants, trialTenants, type Tenant, type TrialTenant } from "@shared/schema";
```

### Database Queries

```typescript
// Get tenant by slug
const [tenant] = await db.select().from(tenants).where(eq(tenants.companySlug, slug));

// Get active tenants
const activeTenants = await db.select().from(tenants).where(eq(tenants.status, "active"));

// Get trial by ID
const [trial] = await db.select().from(trialTenants).where(eq(trialTenants.id, trialId));
```
