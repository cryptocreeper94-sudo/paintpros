# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit for the painting and home services industry. It offers white-label websites with a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports franchisable and standalone licensing, aiming to provide a premium online presence. Key features include multi-tenant configuration, online booking, internal messaging, crew management, and integrations with the Orbit ecosystem and Solana blockchain for document stamping. The business vision is to deliver a "Sparkle and Shine" online presence, tapping into the market potential of professional home services.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder.

## System Architecture

### Multi-Tenant Architecture
The platform supports multiple tenants, configured via `client/src/config/tenant.ts`. Each tenant has customizable branding, services, pricing, SEO metadata, feature toggles, and credentials. A `TenantProvider` and `useTenant()` hook manage context. Tenant selection is currently via `VITE_TENANT_ID`, with future plans for subdomain routing.

### UI/UX and Design System
The design emphasizes a "Sparkle and Shine" aesthetic with a Bento Grid layout, tight spacing, and mobile-first responsiveness.
- **Themes:** Light and Dark Mode, with Dark Mode featuring a desaturated Army Green base and Gold accents.
- **Effects:** Utilizes Glassmorphism, glow effects, and 3D hover animations.
- **Components:** Includes custom `GlassCard`, `FlipButton`, auto-scroll marquees, Embla-based carousels, and Radix-based accordions.
- **Mobile Pattern:** Carousels are central for horizontal scrolling on mobile, often containing `GlassCard` and `Accordion` components.

### Feature Specifications
- **Service Descriptions:** Clearly defines Interior/Exterior, Commercial/Residential painting, with specific options like Walls, Ceilings, Trim, Doors, and Drywall REPAIR.
- **Estimator Pricing Logic:** Tenant-configurable, with default pricing examples (e.g., $150 per door, $5.00/sqft for full jobs).
- **Role-Based Access:** PIN-based access for Admin, Owner, Area Manager, Developer, and Crew Lead, each with specific dashboard access.
- **Online Booking System:** A 5-step customer wizard for service type, date, time, contact, and confirmation. Bookings are visible in admin dashboards.
- **ORBIT Weather System:** Displays real-time weather in the footer and an animated radar modal, using ZIP code search.
- **Crew Management System:** Provides a dashboard for crew leads with time tracking, job notes, and incident reporting, integrated into higher-level dashboards.
- **Internal Messaging System:** A real-time, floating chat widget with Socket.IO, speech-to-text, typing indicators, unread counts, and role-based badges.
- **AI Credits System:** A prepaid model for metered AI features with subscription tiers (`estimator_only`, `full_suite`) and credit packs (Starter, Value, Pro, Business). AI action costs are defined (e.g., chat response 5 cents). Security includes server-side pack validation and credit deduction post-successful AI calls. Database tables manage balances, usage, and purchases. Stripe is integrated for checkout and webhooks. Dashboards exist for credit management.

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `seo_tags`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`, and tables for Crew Management, Internal Messaging, and AI Credits.
- **File Structure:** Organized with `client/src` for frontend, `shared/schema.ts` for database models, and `server/` for data access and API routes.

## External Dependencies

- **Solana/Helius:** For blockchain stamping of document hashes.
- **Stripe:** For payment processing, including AI credit packs and subscriptions.
- **Coinbase Commerce:** For alternative payment processing.
- **OpenAI API:** Powers AI assistant features.
- **Orbit Ecosystem:** Custom integration for payroll sync, staffing, and health checks.
- **Open-Meteo API:** Provides real-time weather data.
- **RainViewer API:** Provides animated weather radar tiles.
- **OpenStreetMap:** Used for base maps in the weather radar modal.
- **Socket.IO:** For real-time communication in the internal messaging system.
- **Web Speech API:** For speech-to-text functionality.
- **Framer Motion:** For UI animations.
- **Embla Carousel:** For horizontal carousels.
- **Radix UI:** For accessible UI components.
- **Drizzle:** For database schema definition.

## v1.6.1 - Breakthrough Modules (20+ Tables, 40+ Endpoints)

### Module 1: AI Field Operations Autopilot
- **Dynamic Route Optimization** (`POST /api/routes/optimize`, `GET /api/routes/optimizations`) - AI-powered crew route optimization with weather-aware scheduling
- **Job Risk Scoring** (`POST /api/jobs/risk-score`, `GET /api/jobs/risks`) - 6-dimension risk analysis (weather, scope creep, payment, schedule, safety, overall)
- **Just-In-Time Materials** (`POST /api/materials/order`, `GET /api/materials/orders`) - Auto-ordering materials with delivery windows

### Module 2: Predictive Revenue Intelligence
- **90-Day Cashflow Forecasting** (`POST /api/cashflow/forecast`, `GET /api/cashflow/forecasts`) - AI-driven revenue/expense predictions with confidence scores
- **Pricing Elasticity Analysis** (`POST /api/pricing/analyze`, `GET /api/pricing/analyses`) - Optimal pricing recommendations with elasticity coefficients
- **Marketing Mix Optimization** (`POST /api/marketing/optimize`, `GET /api/marketing/optimizations`) - Budget allocation with projected ROI

### Module 3: Immersive Site Capture
- **Digital Twins** (`POST /api/scans`, `GET /api/scans`, `PATCH /api/scans/:id`) - LiDAR/photogrammetry site scan storage
- **AR Overlays** (`POST /api/ar/overlays`, `GET /api/ar/overlays`) - Color visualization overlays for customer approval

### Module 4: Autonomous Back Office
- **Auto-Invoicing** (`POST /api/invoices/auto-generate`, `GET /api/invoices/auto`, `PATCH /api/invoices/auto/:id`) - 90% automated invoice generation with tax calculation
- **Lien Waivers** (`POST /api/lien-waivers`, `GET /api/lien-waivers`, `POST /api/lien-waivers/:id/sign`) - Digital signing with blockchain stamping
- **Compliance Tracking** (`POST /api/compliance/deadlines`, `GET /api/compliance/deadlines`) - License/permit deadline management
- **AP/AR Reconciliation** (`POST /api/reconciliation`, `GET /api/reconciliation`) - Auto-matching payments to invoices

### Module 5: Orbit Workforce Network
- **Subcontractor Marketplace** (`POST /api/workforce/subcontractors`, `GET /api/workforce/subcontractors`, `PATCH /api/workforce/subcontractors/:id`) - Vetted subcontractor profiles
- **AI Vetting** (`POST /api/workforce/vet`) - AI-powered credential verification and quality scoring
- **Shift Bidding** (`POST /api/workforce/shifts`, `GET /api/workforce/shifts`, `POST /api/workforce/shifts/:id/bid`, `POST /api/workforce/shifts/:id/select`) - Competitive bid system

### Module 6: Trust & Growth Layer
- **Sentiment Analysis** (`POST /api/sentiment/analyze`, `GET /api/sentiment`) - Real-time customer emotion detection with urgency flags
- **Milestone NFTs** (`POST /api/milestones/nft`, `GET /api/milestones/nfts`, `POST /api/milestones/nft/:id/mint`) - Solana blockchain achievement tokens
- **ESG Tracking** (`POST /api/esg/track`, `GET /api/esg`, `GET /api/esg/report`) - Green materials and sustainability scoring
- **Embedded Financing** (`POST /api/financing/apply`, `GET /api/financing/applications`, `POST /api/financing/prequalify`) - Pre-qualification with instant approval (<$50k)
- **Franchise Analytics** (`POST /api/franchise/analytics/generate`, `GET /api/franchise/analytics`) - White-label performance metrics

## Competition-Destroying Features (v1.6.0)

### AI-Powered Features (GPT-4o)
1. **AI Proposal Writer** (`/api/proposals/generate`) - Generates professional proposals from estimate data with executive summary, scope, timeline, and terms
2. **Smart Lead Scoring** (`/api/leads/score`, `/api/leads/score-ai`) - Rule-based and AI-powered lead ranking by conversion likelihood
3. **Voice-to-Estimate** (`/api/voice-estimate`) - Speak room dimensions, AI extracts measurements and generates quotes
4. **Follow-up Optimizer** (`/api/followup/optimize`) - AI determines best time/channel for customer contact
5. **Profit Margin Optimizer** (`/api/profit/analyze`) - AI pricing suggestions based on job type profitability
6. **Seasonal Demand Forecasting** (`/api/demand/forecast`) - Predict busy/slow periods with staffing recommendations

### Customer Experience Features
7. **Customer Portal** (`/api/portal/create`, `/api/portal/:token`) - Token-based access for job tracking, photos, change orders (30-day expiry)
8. **Real-Time Crew GPS** (`/api/crew/location`) - Uber-like crew tracking with ETA, heading, speed
9. **Digital Tip Jar** (`/api/tips`) - Customers can tip crews with ratings and messages
10. **Before/After Gallery** (`/api/gallery`, `/api/gallery/public`) - Auto-generate portfolio from job photos

### Business Intelligence Features
11. **Customer Lifetime Value** (`/api/clv/calculate`) - CLV calculation with churn risk and customer segmentation
12. **Competitor Intelligence** (`/api/competitors`) - Track competitor pricing and market positioning
13. **Smart Contracts** (`/api/contracts`, `/api/contracts/:id/sign`, `/api/contracts/:id/stamp`) - Blockchain-signed agreements via Solana
14. **AR Color Preview** (`/api/ar/previews`, `/api/ar/colors`) - Color visualization API with popular paint palettes
15. **Crew Skills Matching** (`/api/crew/skills`, `/api/jobs/match-crew`) - Auto-assign crews by certifications and proficiency

## v1.6.2 - Google Integrations (January 2026)

### Google Calendar Integration
- **Multi-tenant OAuth** - Each tenant can connect their own Google Calendar
- **Calendar Sync** (`POST /api/google-calendar/sync`) - Push bookings and jobs to connected calendars
- **Connection Management** (`GET/DELETE /api/google-calendar/connections`) - View and manage calendar connections
- **UI Component** - `GoogleCalendarConnect` component for tenant dashboards with connect/sync/disconnect actions

### Google Local Services Ads (LSA) Integration
- **LSA OAuth Flow** (`GET /api/google-lsa/auth`, `/api/google-lsa/callback`) - Connect Google Ads accounts
- **Connection Management** (`GET/PATCH/DELETE /api/google-lsa/connections`) - Manage LSA connections with customer ID setup
- **Lead Management** (`GET /api/google-lsa/leads`) - View imported LSA leads
- **Lead Sync** (`POST /api/google-lsa/sync-leads`) - Sync leads from Google LSA (requires Google Ads API developer token)
- **Lead Feedback** (`POST /api/google-lsa/leads/:id/feedback`) - Submit lead quality feedback (1-5 rating)
- **Lead Conversion** (`POST /api/google-lsa/leads/:id/convert`) - Convert LSA leads to internal CRM leads

### Database Tables Added
- `google_calendar_connections` - OAuth tokens and sync settings per tenant
- `google_lsa_connections` - Google Ads customer IDs and OAuth tokens
- `google_lsa_leads` - Imported LSA leads with conversion tracking

## Changelog

### January 15, 2026
- Added Lume Paint Co tenant (lumepaint.co) - sister site to NPP with "We elevate the backdrop of your life" branding
- Transformed paintpros.io into lead generation marketplace
- Created LeadSubmissionForm with 3-step wizard (timeline urgency, project details, contact info)
- Added FeatureShowcase component with clickable feature cards showing platform capabilities
- Added ContractorCTA component for painter registration
- Extended leads schema with marketplace fields (address, propertyType, projectTypes, timeline, urgencyScore, budget, description, source)
- New API endpoint: `POST /api/marketplace/leads` for customer lead submission with urgency scoring

### January 4, 2026
- Added Google Calendar multi-tenant OAuth integration
- Created GoogleCalendarConnect UI component for tenant dashboards
- Added Google LSA integration framework with OAuth flow and lead tracking
- Fixed query key cache invalidation in calendar component
- Sanitized LSA API responses to prevent OAuth token exposure
- Integrated Firebase Authentication with Google Sign-In (DarkWave Auth project)
- Created FirebaseAuthProvider context and FirebaseLoginButton component
- Added Google Sign-In option to /auth page alongside email/password login
- PIN system remains unchanged and fully operational