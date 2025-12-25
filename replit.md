# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io by Orbit is a multi-tenant SaaS platform for the painting and home services industry. It provides white-label websites with a modern Bento Grid design, interactive estimating tools, comprehensive SEO management, and role-based dashboards. The platform supports both franchisable and standalone licensing, aiming to deliver a premium online presence with features like online booking, internal messaging, crew management, and integrations with the Orbit ecosystem and Solana blockchain for document stamping. The project ambition is to offer a comprehensive, cutting-edge solution that enhances efficiency and customer engagement in the home services market.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder. The client strongly prefers light themes over dark themes for better text visibility.

## System Architecture

### Multi-Tenant Architecture
The platform features a multi-tenant architecture, configured via `client/src/config/tenant.ts`. Each tenant possesses unique branding, services, pricing, SEO metadata, and feature toggles. A `TenantProvider` and `useTenant()` hook manage the tenant-specific context.

### UI/UX and Design System
The design adheres to a "Sparkle and Shine" aesthetic, utilizing a Bento Grid layout with tight spacing and mobile-first responsiveness.
- **Themes:** Exclusively light mode, prioritizing text visibility and readability.
- **Effects:** Incorporates glassmorphism, glow effects, and 3D hover animations.
- **Components:** Features custom components like `GlassCard`, `FlipButton`, auto-scroll marquees, and Embla-based carousels. Radix-based accordions are used for collapsible content.
- **Mobile Pattern:** Carousels facilitate horizontal scrolling on mobile, often containing `GlassCard` and `Accordion` components.
- **Homepage Structure (NPP):** A vertically scrolling layout inspired by Craftwork.com, featuring sections such as a Hero, Trust & Awards, Services, Color Library preview, process timeline, testimonials, and CTAs.

### Feature Specifications
- **Service Descriptions:** Clearly defined painting services (Interior/Exterior, Commercial/Residential) including Walls, Ceilings, Trim, Doors, and Drywall REPAIR.
- **Estimator Pricing Logic:** Configurable per tenant with flexible pricing models (e.g., per door, per sqft).
- **Role-Based Access:** PIN-based access for Admin, Owner, Area Manager, Developer, and Crew Lead, each with specific dashboard privileges.
- **Online Booking System:** A 5-step customer wizard for service scheduling, with administrative oversight via dashboards.
- **ORBIT Weather System:** Displays real-time weather and radar, with ZIP code search functionality.
- **Crew Management System:** Dashboard for crew leads, offering time tracking, job notes, and incident reporting.
- **Internal Messaging System:** Real-time chat widget using Socket.IO, supporting speech-to-text, typing indicators, and role-based badges.
- **PDF Document Center:** Manages contracts, estimates, invoices, and proposals with digital signatures via `react-signature-canvas`, ensuring role-based authentication and tenant scoping.
- **Franchise Management System:** Supports multi-location franchises with territory licensing, tiered pricing, and Partner API integration, including CRUD operations, location management, and API credential generation.
- **System Health Monitoring:** Real-time health dashboard for Admin, Owner, and Developer roles, monitoring database, payment, email, blockchain, and AI services.
- **SEO Management System:** Comprehensive SEO tracking and editing accessible by Admin, Owner, and Developer. Features meta tag management, Open Graph tags, Twitter Card tags, structured data, canonical URLs, and SEO scoring with audit history. Enforces tenant isolation.
- **Color Library System:** A curated database of professional paint colors from brands like Sherwin-Williams and Benjamin Moore. Includes an interactive color wheel, HSL-based classification, color detail flip cards, search, and integration with the estimate flow.
- **AI Color Visualizer:** A canvas-based tool enabling customers to upload wall photos and preview paint colors with intensity adjustment. Uses OpenAI Vision API for contextual design insights.
- **Room Scanner (Square Footage Estimator):** A "Coming Soon" camera-based tool for estimating room dimensions.
- **Painting Glossary:** A comprehensive A-Z glossary of painting and interior trim terms with search, category filtering, and alphabetical navigation.
- **Layout Switcher (Developer):** A developer dashboard feature to toggle between Bento grid and minimalist homepage layouts for demo purposes.
- **Dual-Chain Verification Shields:** Two blockchain verification cards on the demo homepage - Solana (green/purple gradient) and Darkwave (purple/blue gradient). Each opens a modal with QR code linking to the respective blockchain explorer for document verification.
- **Self-Service Trial System:** 72-hour sandbox trials with usage limits (1 estimate, 3 leads, 1 blockchain stamp). Auto-seeded sample data lets painters experience the platform immediately. Trial tenants get their own branded portal URL at `/trial/{company-slug}` with customizable colors and logo.

### Royalty Tracking System
Comprehensive royalty tracking for the Orbit Ventures SaaS portfolio (PaintPros.io, Brew and Board, Orbit Staffing):
- **Co-Ownership Agreement:** IP agreement at `/ip-agreement` recognizes Sidonie Summers as 50% co-owner with equal decision-making authority across all three platforms. Blockchain-verified on Solana and Darkwave Smart Chain (dwsc.io).
- **Multi-Product Tracking:** Database schema supports tracking revenue/expenses by productCode (paintpros, brewandboard, orbitstaffing) with all revenue flowing through single Stripe account.
- **Royalty Dashboard:** Admin dashboard at `/royalty-dashboard` for entering revenue, expenses, and payouts with automatic 50% profit share calculations.
- **Nashville Project Royalties:** Separate tracking for W-2/1099 income from Nashville painting project ($25k/year W-2 or $20k/year 1099 when Developer earns $125k+).
- **Growth Projections:** Conservative estimates show path from $15k-$30k/year (early stage) to $500k+/year (Enterprise Orbit Staffing), with Orbit Staffing valued at $20M+.
- **API Endpoints:**
  - `GET/POST /api/royalty/revenue` - Revenue entry CRUD
  - `GET/POST /api/royalty/expenses` - Expense tracking
  - `GET/POST /api/royalty/payouts` - Payment records
  - `GET/PUT /api/royalty/config` - Profit share configuration
  - `GET /api/royalty/summary` - Combined calculations

### Trial Tenant Architecture
The trial system implements a "10-minute portal" approach where painters get a fully functional sandbox immediately:
- **Database Schema:** `trial_tenants` table stores owner info, company branding, usage limits, onboarding progress, and engagement metrics. `trial_usage_log` tracks all actions for analytics.
- **Usage Limits:** 1 estimate, 3 leads, 1 blockchain stamp - enforced at API level with upgrade prompts when limits are reached.
- **Expiration:** 72 hours from signup, with automatic status updates to 'expired' when checked.
- **Onboarding Steps:** Tracked via `completedSteps` array (setup, visualizer, estimate, stamp) for guided Trial Mission Control checklist.
- **API Endpoints:**
  - `POST /api/trial/signup` - Create new trial with company info
  - `GET /api/trial/plans` - Get available pricing plans (must be registered before :slug routes)
  - `GET /api/trial/:slug` - Get trial by URL slug with usage/progress info
  - `PATCH /api/trial/:id` - Update trial branding settings
  - `POST /api/trial/:id/complete-step` - Mark onboarding step complete
  - `POST /api/trial/:id/increment-usage` - Track usage with limit enforcement
  - `GET /api/trial/:id/usage-logs` - Get activity history
  - `POST /api/trial/:id/upgrade` - Create Stripe checkout session for subscription
  - `POST /api/trial/:id/convert` - Convert trial to paid tenant after successful payment

### Trial Upgrade System (B2B Licensing Model)
Seamless upgrade flow from trial to paid subscription with automated tenant provisioning:
- **Pricing Tiers:** 
  - Starter: $349/mo + $5,000 setup
  - Professional: $549/mo + $7,000 setup (most popular)
  - Franchise: $799/mo + $99/location + $10,000 setup
  - Enterprise: $1,399/mo + $15,000 setup
- **Flow:** Trial portal → Upgrade page → Stripe checkout → Webhook → Auto-Provision → Welcome Email → Dashboard
- **Automated Provisioning:** The `provisionTenantFromTrial()` service handles:
  - Creates production tenant record in `tenants` table
  - Migrates trial data (leads, estimates, blockchain stamps)
  - Creates owner user account
  - Sends welcome email to owner
  - Sends admin notification
- **Data Preservation:** All trial data (branding, leads, estimates, blockchain stamps) carries over to paid account
- **Frontend Pages:**
  - `/trial/:slug/upgrade` - Pricing page with tier cards
  - `/trial/:slug/upgrade-success` - Post-payment success page with conversion
- **Stripe Integration:** 
  - Uses checkout.sessions.create for subscription mode
  - Webhook at `/api/payments/stripe/webhook` auto-provisions on `checkout.session.completed`
  - Passes plan ID in session metadata
- **Conversion Protection:** Validates plan ID, session ID, prevents double conversion, handles errors gracefully
- **Key Files:**
  - `server/tenant-provisioning.ts` - Core provisioning logic
  - `docs/TENANT_PROVISIONING_SYSTEM.md` - Complete technical documentation

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, and tables for CRM, Crew Management, Messaging, and Franchise Management.
- **File Structure:** `client/src` for frontend, `shared/schema.ts` for database models, and `server/` for data access and APIs.
- **Authentication System:** Hybrid approach with custom email/password for customers and PIN-based access for staff.

### Security Measures
- **PIN Rate Limiting:** Implements rate limiting with exponential backoff for PIN authentication.
- **Database Indexes:** Utilizes performance and security indexes on critical tables.
- **Security Headers:** Configured with Helmet.js for various HTTP security headers.
- **Input Validation:** Employs Zod schema validation for all incoming data.
- **XSS Sanitization:** Uses the `xss` library to sanitize user-controlled input fields.
- **Tenant Isolation:** Enforces strict tenant isolation for all multi-tenant data through `tenantId` columns and API filtering.

## External Dependencies

- **Solana/Helius:** Primary blockchain for document hash stamping.
- **Darkwave Chain:** Secondary blockchain for dual-chain verification, accessed via REST API with HMAC authentication.
- **Payments:** Stripe and Coinbase Commerce.
- **AI:** OpenAI API for AI assistant features.
- **Orbit Ecosystem:** Custom integrations for payroll sync, staffing, code snippets, and health checks.
- **Open-Meteo API:** Provides real-time weather data.
- **RainViewer API:** Provides animated weather radar tiles.
- **OpenStreetMap:** Used for base maps in the weather radar modal.
- **Socket.IO:** For real-time communication in the internal messaging system.
- **Web Speech API:** For speech-to-text functionality.
- **Framer Motion:** For UI animations.
- **Embla Carousel:** For horizontal carousels.
- **Radix UI:** For accessible UI components.
- **Drizzle:** For database schema definition.
- **Custom Auth:** Email/password authentication with bcrypt and session management.