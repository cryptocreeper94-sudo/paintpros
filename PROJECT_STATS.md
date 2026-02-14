# Orbit Platform - Complete Catalog Description

> Multi-tenant SaaS ecosystem for business automation, marketing, and field operations.
> Built by Orbit | Support: team@dwsc.io

---

## Latest Snapshot: February 14, 2026

| Metric | Value |
|--------|-------|
| Total Lines of Code (TypeScript + CSS) | 152,149 |
| Frontend Code (React/TypeScript) | 106,634 lines |
| Backend Code (Express/TypeScript) | 28,063 lines |
| Shared Schema & Types | 7,047 lines |
| Database Tables | 193 |
| API Endpoints | 560 |
| Pages | 96 |
| Reusable Components | 150 |
| UI Components (Shadcn) | 66 |
| Custom Hooks | 10 |
| PWA Manifests | 6 |
| Development Days | 62 |

### Estimated Traditional Development Cost
- US Agency Rates: $800,000 - $1,500,000
- Offshore Rates: $300,000 - $500,000
- Timeline: 12-18 months with 8-10 person team

---

## Platform Overview

The Orbit Platform is a multi-tenant SaaS ecosystem that powers four distinct websites from a single codebase. It serves the painting/home services industry while expanding to support any business type through its automated advertising platform.

---

## The Four Sites

### 1. PaintPros.io - Flagship SaaS Demo & White-Label Template
The core platform demo site and white-label template for painting contractors and franchises. Navy and white branding. Showcases the full suite of business management tools including estimating, CRM, crew management, customer portals, and marketing automation.

### 2. NashPaintPros.io (NPP) - Ecosystem Advertising Hub & Lead Generation
A dark premium landing page serving as a lead generation and affiliate marketplace. "Find your contractor, find your customer." Showcases 20+ connected platforms with category filtering, affiliate tracking (UTM parameters), and SEO optimization. Navy and white branding with dark premium aesthetic.

### 3. TLID.io - TrustLayer Marketing (Automated Advertising Platform)
A self-service automated advertising platform for ANY business type - not just trades. Users sign up, connect their Meta Business Suite (Facebook + Instagram), and TrustLayer Marketing handles everything: organic posting, ad campaigns, budget management, and performance tracking. Set-it-and-forget-it ad automation.

**5-Step Onboarding:** Industry Selection > Business Info > Meta Setup Guide > Enter Credentials > Select Plan

**Supported Industries:** Home Services, Restaurant/Food, Health/Wellness, Beauty/Salon, Retail/Shopping, Real Estate, Automotive, Professional Services, and more.

**Current Platforms:** Facebook, Instagram
**Future Platforms:** Nextdoor, X (Twitter), TikTok, YouTube

Branding: Cyan, lavender, holographic purple, dark blues. Own PWA with custom manifest and icons.

### 4. TradeWorksAI.io - Field Tools Platform
Multi-trade field tool platform for expansion across trade verticals. Mobile-first interface with 85+ professional calculators, weather radar, crew management, and voice-to-estimate capabilities.

---

## Complete Feature List

### Multi-Tenant Architecture
- [x] Single codebase powering 4 distinct websites
- [x] Tenant detection by domain (paintpros.io, nashpaintpros.io, tlid.io, tradeworksai.io)
- [x] Per-tenant branding, colors, logos, and feature toggles
- [x] Per-tenant Stripe integration and pricing
- [x] Per-tenant PWA manifests and icons (6 manifests)
- [x] Per-tenant SEO metadata and Open Graph tags
- [x] White-label website system for franchises
- [x] Subdomain claiming system for new businesses

### Marketing Automation (TrustLayer Marketing / TLID.io)
- [x] Meta Business Suite integration (Facebook + Instagram)
- [x] Automated organic posting schedule (9x daily, every 2 hours, 6am-10pm CST)
- [x] Automated ad campaign management (7-day rotation, $50/day budget)
- [x] Content type rotation (educational, gamified, sales, seasonal, evergreen, testimonial, behind-scenes)
- [x] "Today's Suggested Post" system
- [x] Underperforming ad detection and replacement
- [x] Real-time Meta API spend sync (syncs before budget checks, resets at midnight CST)
- [x] DarkWave Unified Scheduler (manages posting across 15+ tenants)
- [x] X (Twitter) posting with burst protection
- [x] Self-service 5-step onboarding for any business type
- [x] Autopilot Dashboard with performance metrics
- [x] Admin panel for managing connected businesses
- [x] Marketing Hub dashboard with content composition

### Estimating & Pricing Tools
- [x] Multi-step estimation wizard
- [x] Room-by-room estimator with configurable pricing
- [x] Color library with manufacturer catalogs
- [x] Color visualizer (room preview)
- [x] Material breakdown calculator
- [x] Blueprint upload and annotation
- [x] PDF proposal generation
- [x] Digital proposal signing
- [x] Configurable pricing panel per tenant

### CRM & Customer Management
- [x] Full CRM with deals pipeline
- [x] Smart lead scoring
- [x] Activity timeline
- [x] Proposal templates
- [x] DripJobs import integration
- [x] Customer portal with project tracking
- [x] Customer lifetime value tracking
- [x] Follow-up optimizer

### Booking & Scheduling
- [x] 5-step customer booking wizard
- [x] Google Calendar sync (multi-tenant)
- [x] CRM calendar with event management
- [x] Scheduling conflict detection

### Crew & Field Operations
- [x] Crew management system with roles
- [x] Time tracking and clock in/out
- [x] Incident reporting
- [x] Mileage tracking
- [x] Real-time crew GPS
- [x] Voice notes
- [x] Crew skills matching
- [x] Project templates

### Trade Tools & Calculators
- [x] 85+ professional calculators
- [x] Field Tool mobile interface
- [x] Room scanner
- [x] Color scanner (camera-based)
- [x] Voice-to-estimate
- [x] Measure tool
- [x] Trade toolkit with multi-vertical support

### Weather System
- [x] Real-time ORBIT Weather System
- [x] Animated weather radar (RainViewer API)
- [x] Location-based forecasts (Open-Meteo API)
- [x] Work day suitability indicators

### Communication
- [x] Internal messaging system (Socket.IO real-time chat)
- [x] SMS messenger (Twilio integration)
- [x] Speech-to-text (Web Speech API)
- [x] Live translator (English/Spanish)
- [x] Email system (Resend integration)
- [x] Email templates

### Payments & Credits
- [x] Stripe payment processing (per-tenant configuration)
- [x] Stripe Live keys (publishable + secret)
- [x] Toolkit credits system (prepaid metered features)
- [x] Subscription tiers with credit packs
- [x] Digital tip jar for customers
- [x] Coinbase Commerce alternative payments
- [x] Credits dashboard with usage tracking
- [x] Trial signup and upgrade flows

### AI-Powered Features
- [x] Floating AI chat agents with tenant-specific designs
- [x] ElevenLabs voice responses (text-to-speech)
- [x] OpenAI GPT-4o integration
- [x] AI-powered blog post generation with SEO optimization
- [x] Proposal writer
- [x] Profit margin optimizer
- [x] Seasonal demand forecasting
- [x] Competitor intelligence
- [x] Smart contracts
- [x] Ops AI assistant

### Blog System
- [x] Multi-tenant blog architecture
- [x] GPT-4o powered post generation
- [x] SEO optimization per post
- [x] Blog scheduler (automatic generation)
- [x] Blog manager (admin CRUD)

### Analytics & Reporting
- [x] Unified analytics dashboard
- [x] Live visitors tracking
- [x] Traffic metrics and device breakdown
- [x] Top pages and referrer tracking
- [x] SEO tag counts per tenant
- [x] Google Analytics 4 integration
- [x] Tenant-specific analytics dashboard
- [x] Investor demo/snapshot views

### Authentication & Access Control
- [x] Firebase Authentication
- [x] Role-based access (Admin, Owner, Developer, Crew Lead)
- [x] PIN-based quick access system
- [x] Google OAuth (Client ID + Secret)
- [x] Password reset flow
- [x] Email verification

### Google Integrations
- [x] Google Calendar sync (multi-tenant)
- [x] Google Local Services Ads (LSA) integration
- [x] Google Analytics 4

### Ecosystem & External Integrations
- [x] 20+ connected applications in ecosystem
- [x] Orbit Ecosystem hub with category filtering
- [x] Affiliate tracking (UTM parameters)
- [x] Guardian AI certification
- [x] Guardian Shield (trustshield.tech)
- [x] Blockchain document stamping (Solana/Helius)
- [x] DarkWave Trust Layer unified posting
- [x] Orbit Staffing, Orbit Commander, Strike Agent connections
- [x] Partner dashboard with royalty tracking

### Progressive Web App (PWA)
- [x] 6 tenant-specific PWA manifests
- [x] Custom icons and splash screens per site
- [x] Offline support via service worker
- [x] Install prompts (Add to Home Screen)
- [x] Tenant-aware manifest switching at runtime

### Legal & Compliance
- [x] Privacy policy pages (per-tenant)
- [x] Terms of service pages
- [x] Terms & warranty
- [x] Data deletion request page
- [x] IP agreement page
- [x] Cookie/tracking compliance

### SEO & Marketing Pages
- [x] About, Services, FAQ, Contact pages
- [x] Portfolio/gallery
- [x] Reviews showcase
- [x] Team page
- [x] Resources and glossary
- [x] Awards page
- [x] "Why $40K Fails" comparison landing page
- [x] Partner/investor pages

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Shadcn/UI (66 components), Radix UI |
| Animations | Framer Motion |
| Routing | Wouter (SPA) |
| State/Data | TanStack React Query v5 |
| Backend | Express.js, TypeScript |
| Database | PostgreSQL (Neon-backed), Drizzle ORM |
| Real-time | Socket.IO |
| Auth | Firebase Authentication, Google OAuth |
| Payments | Stripe (live), Coinbase Commerce |
| AI | OpenAI GPT-4o, ElevenLabs |
| Email | Resend |
| SMS | Twilio |
| Maps | OpenStreetMap, Leaflet |
| Weather | Open-Meteo API, RainViewer API |
| Blockchain | Solana/Helius |
| Hosting | Replit Deployments |
| Object Storage | Replit Object Storage |

---

## Code Breakdown

| Section | Files | Lines |
|---------|-------|-------|
| Pages | 96 | ~55,000 |
| Components | 150 | ~25,000 |
| UI Components (Shadcn) | 66 | ~8,000 |
| Hooks & Contexts | 15 | ~2,500 |
| Server Routes | 1 | 15,634 |
| Server Services | 32 | 12,429 |
| Database Schema | 1 | 6,346 |
| Shared Types | 2 | 7,047 |
| Tenant Config | 1 | 1,117 |
| Stylesheets | 1 | 278 |
| **Total** | **~365** | **152,149** |

### Largest Pages (by line count)
| Page | Lines | Purpose |
|------|-------|---------|
| Marketing Hub | 8,333 | Full marketing automation dashboard |
| Field Tool | 5,361 | Mobile field operations interface |
| Developer Portal | 3,489 | Developer tools and API docs |
| Trade Toolkit | 2,176 | 85+ professional calculators |
| TradeWorks AI | 1,714 | Multi-trade expansion platform |
| TradeWorks App | 1,393 | Field tool mobile experience |
| TrustLayer Home | 1,381 | TLID.io landing page |
| NPP Walkthrough | 1,306 | Ecosystem presentation |
| Estimator | 1,274 | Room-by-room estimation wizard |
| Autopilot Onboarding | 1,166 | 5-step business setup flow |

---

## Historical Snapshots

### February 14, 2026
```
Lines of Code:     152,149
Database Tables:   193
API Endpoints:     560
Pages:             96
Components:        150
Status:            Production - Published
```
**Milestone:** TLID.io expanded to support any business type (not just trades). 5-step onboarding live. PWA per-tenant manifests. Demo Mode banner limited to dashboard pages only.

### February 1, 2026 (Evening)
```
Lines of Code:     299,548 (includes JSON/config)
Characters:        11.1 million
Source Files:      1,288
Status:            Production - Published
```
**Milestone:** Full system audit completed. Guardian AI integration added. Ad campaigns reactivated. Ecosystem domain links updated.

### February 1, 2026 (Morning)
```
Lines of Code:     ~136,000
Characters:        ~5 million
Source Files:      ~800
Status:            Production
```
**Milestone:** Organic posting running successfully (20,862 impressions in 48 hours). Ad campaigns paused due to Meta payment fraud alerts.

---

## Team Equivalent

To build this traditionally would require:
- 4-6 Senior Full-Stack Developers
- 1-2 UI/UX Designers
- 1 DevOps Engineer
- 1 Project Manager
- Timeline: 12-18 months

---

*Last Updated: February 14, 2026*
