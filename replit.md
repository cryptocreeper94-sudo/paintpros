# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform built by Orbit for the painting and home services industry. It provides white-label websites for painting companies, featuring a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports both franchisable and standalone licensing options, aiming to deliver a premium "Sparkle and Shine" online presence. Key capabilities include multi-tenant configuration, online booking, an internal messaging system, a crew management system, and integrations with the Orbit ecosystem and Solana blockchain for document stamping.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder.

## System Architecture

### Multi-Tenant Architecture
The platform supports multiple tenants, each configured via `client/src/config/tenant.ts`. Tenant-specific settings include branding (name, logo, colors), services offered, custom pricing, SEO meta-data, feature toggles (estimator, portfolio, reviews, blog, AI assistant), and credentials (Google rating, warranty years, licenses). A `TenantProvider` and `useTenant()` hook manage tenant context throughout the application. Tenant selection is currently based on the `VITE_TENANT_ID` environment variable, with future plans for subdomain-based routing.

### UI/UX and Design System
The design goal is a premium "Sparkle and Shine" aesthetic with a true Bento Grid layout, tight spacing, and mobile-first responsiveness.
- **Themes:** Light and Dark Mode, with Dark Mode using a highly desaturated Army Green base and Gold highlights as accent.
- **Effects:** Glassmorphism, glow effects, and 3D hover animations are prevalent.
- **Components:** Custom components include `GlassCard`, `FlipButton`, auto-scroll marquees, and Embla-based horizontal carousels. Radix-based accordions are used for collapsible content (e.g., admin follow-ups, pricing tiers, proposal sections).
- **Mobile Pattern:** Carousels are the primary mechanism for horizontal scrolling on mobile, with items often containing `GlassCard` and `Accordion` for detailed content.

### Feature Specifications
- **Service Descriptions:** Must clearly articulate Interior/Exterior, Commercial/Residential painting, with options for Walls, Ceilings, Trim, Doors, and Drywall REPAIR only.
- **Estimator Pricing Logic:** Configurable per tenant, with default pricing like $150 per door, $5.00/sqft for full jobs (Walls + Trim + Ceiling), and $2.50/sqft for Walls Only.
- **Role-Based Access:** PIN-based access for Admin (4444), Owner (1111), Area Manager (2222), Developer (0424), and Crew Lead (3333). Each role has access to specific dashboards and functionalities.
- **Online Booking System:** A 5-step customer wizard for service type, date, time, contact details, and confirmation. Admin dashboards display upcoming bookings.
- **ORBIT Weather System:** Displays real-time weather in the footer and a full modal with animated radar. Uses ZIP code search and local storage for persistence.
- **Crew Management System:** Provides a dashboard for crew leads with time tracking, job notes, and incident reporting. Integrated into Admin, Owner, and Developer dashboards.
- **Internal Messaging System:** A real-time, floating chat widget with Socket.IO, speech-to-text, typing indicators, unread counts, and role-based badges.

### AI Credits System (Prepaid Model)
The platform uses a prepaid AI credits system for metered AI features:
- **Subscription Tiers:** `estimator_only` (standalone estimator product) and `full_suite` (complete PaintPros.io platform)
- **Credit Packs:** Starter ($10/1000 credits), Value ($25/2500 credits), Pro ($50/5000 credits), Business ($100/10000 credits)
- **AI Action Costs:** Chat response (5 cents), Photo analysis (10 cents), Voice response (8 cents), Document analysis (15 cents)
- **Security:** Server-side pack validation, credits deducted only after successful AI calls
- **Database Tables:** `tenant_credits` (balances), `ai_usage_logs` (usage tracking), `credit_purchases` (purchase history)
- **Stripe Integration:** Checkout flow at `/api/credits/purchase`, webhook at `/api/credits/webhook`
- **Dashboards:** Credits Dashboard (`/credits`) for all tenants, Subscriber Dashboard (`/subscriber-dashboard`) for estimator-only tenants

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `seo_tags`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`, tables for Crew Management (`crew_leads`, `crew_members`, `time_entries`, `job_notes`, `incident_reports`), Internal Messaging (`conversations`, `conversation_participants`, `messages`), and AI Credits (`tenant_credits`, `ai_usage_logs`, `credit_purchases`).
- **File Structure:** Organized with `client/src` for frontend components, pages, config, and context; `shared/schema.ts` for database models; and `server/` for data access and API routes.

## External Dependencies

- **Solana/Helius:** Used for blockchain stamping of document hashes (requires `HELIUS_API_KEY` or `HELIUS_RPC_URL`).
- **Payments:** Stripe (Replit managed connection via `stripe-replit-sync`) and Coinbase Commerce.
- **AI:** OpenAI API (for AI assistant features).
- **Orbit Ecosystem:** Custom integration via `server/orbit.ts` for payroll sync, staffing, code snippets, and health checks (requires `ORBIT_ECOSYSTEM_API_KEY`, `ORBIT_ECOSYSTEM_API_SECRET`, `ORBIT_ECOSYSTEM_DEV_URL`).
- **Open-Meteo API:** Provides real-time weather data (no API key required).
- **RainViewer API:** Provides animated weather radar tiles.
- **OpenStreetMap:** Used for base maps in the weather radar modal.
- **Socket.IO:** For real-time communication in the internal messaging system.
- **Web Speech API:** For speech-to-text functionality in the AI assistant and messaging system.
- **Framer Motion:** For animations throughout the UI.
- **Embla Carousel:** For horizontal carousels.
- **Radix UI:** For accessible UI components like accordions.
- **Drizzle:** For database schema definition.

## Recent Changes (Changelog)

### January 2026
- **v1.2.1** - Current Release
  - Added Material Calculator API (`/api/materials/calculate`) - auto-calculate paint gallons from dimensions
  - Added Lead Source Tracking API (`/api/lead-sources`) - track where leads come from for ROI analysis
  - Added Warranty Tracker API (`/api/warranties`) - digital certificates with expiration alerts
  - Added Follow-up Sequences API (`/api/followup-sequences`) - configurable email drip campaigns
  - Added Referral Program API (`/api/referrals`) - shareable codes with conversion tracking
  - Added Voice-to-Estimate API (`/api/voice-estimate`) - GPT-4o transcript parsing to structured estimates
  - Added GPS Check-in API (`/api/gps-checkins`) - verify crew arrival at job sites
  - Added QR Code Generator API (`/api/qr-code`) - URLs for yard signs (frontend renders with qrcode.react)
  - Database schemas: materialCalculations, leadSources, warranties, followupSequences/Steps/Logs, referralProgram/Tracking, gpsCheckins
  - Push Notification foundation: Schema exists, VAPID keys configured (service worker pending)

- **v1.2.0**
  - Added Customer Portal API (`/api/jobs`, `/api/portal/:token`) - token-based job tracking for customers
  - Added Portfolio Builder API (`/api/portfolio`) - CRUD for before/after project photos
  - Added Review Automation API (`/api/review-requests`) - automated email requests via Resend
  - Storage methods implemented for jobs, jobUpdates, reviewRequests, portfolioEntries
  - E-signatures already complete via react-signature-canvas in proposal-sign.tsx and document-center.tsx
  - **Note:** Twilio SMS integration was proposed but dismissed by user - can be added later if needed

- **v1.1.9**
  - Automated email notifications for new estimate requests (via Resend connector)
  - Enhanced system health endpoint (`/api/system/health`) with real-time checks for:
    - Database (PostgreSQL), Payments (Stripe), Email (Resend), Blockchain (Solana), AI (OpenAI)
  - Fixed deployment issue: Server binds port 5000 immediately, OIDC discovery in background
  - Email health check now properly validates Resend connector status
  - Lead notifications include customer details, project type, estimated total

- **v1.1.8**
  - Stripe integration updated to use Dark Wave Studios live business account
  - Hybrid credential system: Live keys (STRIPE_LIVE_*) take priority, Replit sandbox as fallback
  - Created all Stripe products and prices with proper price IDs:
    - AI Credit Packs: Starter ($10), Value ($25), Pro ($50), Business ($100)
    - Subscriptions: Estimator ($29/mo), Full Suite ($199/mo), Franchise ($499/mo)
  - Updated checkout to use Stripe price IDs instead of dynamic pricing
  - Added seed script: `server/scripts/seed-stripe-products.ts`

- **v1.1.7**
  - Migrated Stripe integration to Replit managed connection (`stripe-replit-sync`)
  - Created `server/stripeClient.ts` for centralized Stripe credential management
  - Created `server/webhookHandlers.ts` for managed webhook processing
  - All payment routes now use dynamic Replit-managed credentials
  - Added `/api/stripe/status` endpoint for connection verification
  - Automatic sandbox-to-live transition when publishing

- **v1.1.6**
  - Added comprehensive Refund Policy section to Terms & Warranty page (`/terms#refunds`)
  - 7-Day Money-Back Guarantee for new subscriptions (Estimator, Full Suite, Franchise)
  - Monthly subscriptions: Cancel anytime, no partial refunds after 7 days
  - Annual subscriptions: Pro-rated refund within 30 days
  - AI Credit Packs: Non-refundable, credits never expire
  - Refund policy disclaimer added to Credits Dashboard
  - 7-Day Guarantee badge added to Pricing page
  - Demo Welcome Modal now includes Trade Vertical business model section with revenue projections

### December 2025
- **v1.1.5**
  - Implemented prepaid AI credits system with usage-based billing
  - Added credit packs: Starter ($10), Value ($25), Pro ($50), Business ($100)
  - Credits Dashboard at `/credits` for balance, purchases, and usage history
  - Subscriber Dashboard at `/subscriber-dashboard` for estimator-only tenants
  - Stripe checkout integration for credit purchases with webhook handling
  - AI middleware checks balance before calls, deducts only after success
  - Added `subscriptionTier` field to tenant config (estimator_only vs full_suite)
  - Estimator-only tenant template for standalone product offerings

- **v1.1.4**
  - Added Spanish language support (i18n) for Crew Lead dashboard
  - AI Assistant (Rollie/PaintBuddy) now responds in Spanish when language is set to Spanish
  - Speech recognition supports both English (en-US) and Spanish (es-ES)
  - Language toggle persisted to localStorage for consistent experience
  - All crew lead dashboard UI strings translated to Spanish
  - Blockchain hallmark system confirmed working with Solana integration
  - Real-time weather system with animated radar modal
  - Internal messaging system with Socket.IO for real-time communication
  - Comprehensive role-based dashboards (Admin, Owner, Developer, Crew Lead, Project Manager)