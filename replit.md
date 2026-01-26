# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit designed for the painting and home services industry. It provides white-label websites featuring a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports both franchisable and standalone licensing models, targeting $30+/month pricing. Primary focus is on Lume Paint Co ("Elevating the backdrop of your life") as the template for future franchise expansion, with Nashville Painting Professionals (NPP) and eventual trade vertical expansion.

**Current Status**: Site is polished and ready for Monday demo to Lume owner.

## User Preferences
- I prefer simple language and detailed explanations
- I want iterative development and for you to ask before making major changes
- Do not make changes to the `assets/branding/` folder
- **Critical Language**: Never say "AI" or "app" - use "room visualizer tool", "estimator tool", "instant estimation" instead
- Always use lucide-react icons, never emoji

## Brand Taglines
- **NPP (Nashville Painting Professionals)**: "Transforming familiar spaces into extraordinary places."
- **Lume Paint Co**: "Elevating the backdrop of your life."

## Brand Colors
- **Lume Paint Co**: Dark navy blue (#1e3a5f) - used for titles, text accents, and buttons. Service area is Murfreesboro, TN (20-mile radius).

## Quick Reference - PIN Access
| PIN | User | Role | Dashboard |
|-----|------|------|-----------|
| 1111 | Ryan | Owner | /owner |
| 4444 | Sidonie | Admin/Ops Manager | /admin |
| 0424 | Jason | Developer | /developer |
| 8888 | Marketing | Marketing | /marketing-hub |
| 5555 | Hank | Project Manager | /project-manager |
| 6666 | Garrett | Project Manager | /project-manager |
| 7777 | Demo | Demo Viewer | /admin |
| 3333 | Crew Lead | Crew Lead | /crew-lead |

### Biometric Login (WebAuthn)
- Users can set up fingerprint/Face ID authentication after logging in with PIN
- Biometric credentials are stored in `webauthn_credentials` table
- Available on devices that support platform authenticators (iOS Touch/Face ID, Android fingerprint)
- Setup: Field Tool → Settings → Quick Login → "Set Up Biometric Login"

## System Architecture

### Multi-Tenant Architecture
The platform is built on a multi-tenant architecture, configured via `client/src/config/tenant.ts`. Each tenant benefits from customizable branding, services, pricing, SEO metadata, feature toggles, and credentials. A `TenantProvider` and `useTenant()` hook manage context, with tenant selection currently driven by `VITE_TENANT_ID`.

**Supported Tenants**: npp, demo, lumepaint, tradeworks, roofpros, hvacpros, electricpros, plumbpros, landscapepros, buildpros

### UI/UX and Design System
The design emphasizes a "Sparkle and Shine" aesthetic, utilizing a Bento Grid layout, tight spacing, and mobile-first responsiveness. Key design elements include:
- **Themes:** Support for Light and Dark Mode, with Dark Mode featuring a desaturated Army Green base and Gold accents
- **Effects:** Integration of Glassmorphism, glow effects, and 3D hover animations
- **Components:** Custom `GlassCard`, `FlipButton`, auto-scroll marquees, Embla-based carousels, and Radix-based accordions
- **Mobile Pattern:** Carousels are central for horizontal scrolling on mobile, often containing `GlassCard` and `Accordion` components
- **Design Rule:** Never add hover/active classes to Button components (they handle it internally)

### Key Pages (73 total)
- **Customer-Facing**: home-lume.tsx (395 lines), estimate-lume.tsx (634 lines), book.tsx (32 lines + BookingWizard 459 lines)
- **Admin Dashboards**: admin.tsx (838 lines), owner.tsx, marketing-hub.tsx, crew-lead.tsx, project-manager.tsx, developer.tsx
- **Supporting**: services.tsx, portfolio.tsx, about.tsx, reviews.tsx, blog.tsx, color-library.tsx, resources.tsx, faq.tsx, contact.tsx

### Feature Specifications
- **Service Descriptions:** Detailed definitions for various painting services (Interior/Exterior, Commercial/Residential), including specific options like Walls, Ceilings, Trim, Doors, and Drywall REPAIR
- **Estimator Pricing Logic:** Tenant-configurable pricing with default examples
- **Role-Based Access:** PIN-based access for Admin, Owner, Area Manager, Developer, and Crew Lead, each with specific dashboard access
- **Online Booking System:** A 5-step customer wizard covering service type, date, time, contact, and confirmation, with bookings visible in admin dashboards
- **ORBIT Weather System:** Displays real-time weather and an animated radar modal using ZIP code search
- **Crew Management System:** Dashboard for crew leads including time tracking, job notes, and incident reporting
- **Internal Messaging System:** Real-time, floating chat widget with Socket.IO, speech-to-text, typing indicators, unread counts, and role-based badges

### Marketing Hub Features (Redesigned January 2026)
The Marketing Hub has been completely redesigned as a premium $100k enterprise product with 5 streamlined tabs:

**Tab Structure (5 tabs replacing previous 12):**
1. **Content Studio** - Sub-tabs for Image Library, Message Templates, and Social Bundles with photo-realistic hero images
2. **Analytics Center** - All metrics with educational explanations (What it means, Why it matters)
3. **Calendar** - Weekly content scheduling with best practices tips
4. **Playbook** - Marketing psychology strategies (Social Proof, Scarcity, Reciprocity, Authority, etc.)
5. **Budget** - Marketing spend tracker with expense logging, ROI tracking, and lead attribution (NEW)

**Design Features:**
- Photo-realistic hero images throughout using existing marketing assets
- Educational approach: Every section includes "How This Works" explanations
- Navy blue branding (#1e3a5f) consistent with Lume theme
- Split-layout login page with hero image and feature badges

**Access Methods:**
- Direct PIN 88888 on /marketing page
- Also accessible via Owner (1111), Admin (4444), Developer (0424) PINs

**Photo Assets Location:** `client/src/assets/marketing/` (crew photos, interiors, exteriors, commercial spaces)

### AI Credits System
A prepaid model for metered features with subscription tiers and credit packs. Security involves server-side pack validation and credit deduction. Stripe is integrated for payments.

### AI-Powered Features
Includes Proposal Writer, Smart Lead Scoring, Voice-to-Estimate, Follow-up Optimizer, Profit Margin Optimizer, and Seasonal Demand Forecasting.

### Customer Experience Features
Customer Portal for job tracking, Real-Time Crew GPS, Digital Tip Jar, and Before/After Gallery.

### Business Intelligence Features
Customer Lifetime Value calculation, Competitor Intelligence, Smart Contracts (blockchain-signed), AR Color Preview, and Crew Skills Matching.

### Google Integrations
Multi-tenant Google Calendar sync for bookings and Google Local Services Ads (LSA) integration for lead management and feedback.

### Blog System
Multi-tenant blog architecture with GPT-4o powered post generation, SEO optimization, and category seeding.

### Unified Analytics Dashboard
Provides live visitors, traffic metrics, device breakdown, top pages, referrers, and SEO tag counts per tenant, with GA4 integration.

## Ecosystem Architecture
- **DarkWave Studios (darkwavestudios.io)**: Central ecosystem hub for code sharing and integration management across all Darkwave LLC applications
- **ORBIT Ecosystem Hub**: Connected with working credentials (dev URL active, production URL pending republish)
- **PaintPros**: Focused on painting/trade verticals, not the central nexus

## Database Schema
Key tables include:
- Core: `leads`, `estimates`, `seo_tags`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`
- Features: Crew Management, Internal Messaging, AI Credits, Google Calendar, Google LSA, blog posts

## File Structure
- `client/src` - Frontend React/TypeScript code
- `client/src/pages` - 73 page components
- `client/src/components` - Reusable UI components
- `client/src/config/tenant.ts` - Multi-tenant configuration
- `shared/schema.ts` - Database models with Drizzle
- `server/` - Backend Express routes and data access
- `server/social-connectors.ts` - Social media posting (Twitter, Facebook, Telegram, Discord)
- `server/orbit.ts` - Orbit ecosystem integration
- `docs/` - Handoff documentation

## External Dependencies

### APIs & Services
- **Solana/Helius:** Blockchain stamping of document hashes and Milestone NFTs
- **Stripe:** Payment processing for AI credit packs and subscriptions
- **Coinbase Commerce:** Alternative payment processing
- **OpenAI API:** Powers features, blog generation, and various modules
- **Orbit Ecosystem:** Custom integration for payroll sync, staffing, and health checks
- **Open-Meteo API:** Real-time weather data
- **RainViewer API:** Animated weather radar tiles
- **OpenStreetMap:** Base maps for weather radar modal
- **Firebase Authentication:** User authentication with Google Sign-In
- **Google Analytics 4:** Tenant-aware website analytics
- **Google APIs:** Calendar and Local Services Ads integrations

### Frontend Libraries
- **Framer Motion:** UI animations
- **Embla Carousel:** Horizontal carousels
- **Radix UI:** Accessible UI components
- **Socket.IO:** Real-time messaging
- **Web Speech API:** Speech-to-text

### Backend
- **Drizzle:** Database schema definition and ORM
- **Express:** API server

## Recent Changes (January 2026)
- **NEW: Marketing ROI Tracker Redesign** - Budget tab now includes:
  - "Starting From Zero" status showing no historical data exists
  - Industry benchmarks for Middle TN painting companies ($85/lead, 4:1 Google ROI, 42:1 Email ROI)
  - "What's Required" accountability section (Owner provides access, Marketing implements)
  - Timeline expectations (Month 1 setup, Months 2-3 build data, Months 4+ optimize)
  - Clear 4-step tracking process explanation
- **NEW: Marketing Budget Tracker** - 5th tab in Marketing Hub for tracking spend, ROI, and lead attribution by channel
- **NEW: Lead Source Tracking** - "How did you hear about us?" dropdown on estimate form and booking wizard captures referral source (billboard, Facebook, Google, car wrap, yard sign, referral, etc.)
- **NEW: Marketing Hub Redesign** - Complete restructure from 12 tabs to 5 tabs (Content Studio, Analytics Center, Calendar, Playbook, Budget)
- **NEW: Photo-realistic hero images** - Each Marketing Hub tab now has professional hero imagery with navy blue gradient overlays
- **NEW: Educational content** - Every section includes "How This Works" explanations, metric definitions with "What it means" and "Why it matters"
- **NEW: Fluid viewport scaling** - All tenant hero sections now scale smoothly from mobile to 4K/TV displays using clamp()
- **NEW: Scroll indicator** - "Explore" label with bouncing arrow on Lume hero to guide users to scroll
- **NEW: Lume PWA** - Full PWA support with navy blue branding, custom icons and splash screen
- **NEW: Pricing Config Panel** - Estimator pricing now editable from Admin/Owner/Developer dashboards
- **All 5 PWAs configured**: Lume, NPP, PaintPros/Demo, TradeWorks, Marketing Hub
- Social media auto-posting disabled until proper business accounts are connected
- Privacy Policy updated to January 25, 2026
- Added Marketing Psychology Playbook with 6 proven strategies
- Connected PaintPros to ORBIT Ecosystem Hub with working credentials
- Created DarkWave Ecosystem Hub handoff documentation for Code Hub implementation
- Completed site audit: All key Lume pages clean and ready for Monday demo
