# PaintPros.io by Orbit - Documentation

## Metadata
**Tags:** #multi-tenant, #painting-industry, #saas
**Last Updated:** December 15, 2025
**Beta Version:** v1.1.7

## Product Overview
**PaintPros.io** is a multi-tenant SaaS platform for the painting and home services industry. Built by Orbit, it provides white-label websites for painting companies with:
- Modern Bento Grid design
- Interactive estimating tools
- SEO management
- Role-based dashboards (Admin, Owner, Area Manager, Developer)
- Franchisable and standalone licensing options

## Current Tenant
**Nashville Painting Professionals** - Beta test client (tenant ID: `npp`)

## Multi-Tenant Architecture

### Tenant Configuration
Location: `client/src/config/tenant.ts`

Each tenant has:
- **Branding:** Name, tagline, logo, colors
- **Services:** Toggle which services are offered (interior/exterior, commercial/residential, trim, ceilings, doors, drywall repair)
- **Pricing:** Custom rates per tenant (doors per unit, sqft rates)
- **SEO:** Title, description, keywords, service areas
- **Features:** Enable/disable estimator, portfolio, reviews, blog, AI assistant
- **Credentials:** Google rating, warranty years, licenses

### Context Provider
Location: `client/src/context/TenantContext.tsx`

- `TenantProvider` wraps the app
- `useTenant()` hook provides config anywhere in the app

### Tenant Selection
Currently uses `VITE_TENANT_ID` environment variable. Future: subdomain-based routing.

## Service Descriptions (Important)
Services must clearly convey:
- **Interior AND Exterior** painting
- **Commercial AND Residential** painting
- **Walls, Ceilings, Trim, Doors** as optional packages or standalone jobs
- **Drywall REPAIR only** (done during painting prep) - NOT drywall installation/hanging

## Design System

### Aesthetics
- **Goal:** Premium, "Sparkle and Shine" painting website
- **Themes:** Light Mode & Dark Mode
- **Dark Mode Base:** Highly desaturated Army Green (15-25% saturation)
- **Accent:** Gold highlights
- **Effects:** Glassmorphism, glow effects, 3D hover animations

### Layout
- True Bento Grid styling
- Tight layout, minimal white space
- Mixed card sizes with strict grid adherence
- Mobile-first responsive design

### Components
- Glassmorphic cards (`GlassCard`)
- Flip buttons (`FlipButton`)
- Auto-scroll marquees
- Horizontal scroll carousels (`Carousel`, `CarouselContent`, `CarouselItem`) - Embla-based
- Accordion sections (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`) - Radix-based
- Framer Motion animations throughout

### Mobile-First Carousel Pattern
For horizontal scrolling on mobile, use:
```tsx
<Carousel opts={{ align: "start", dragFree: true }} className="w-full">
  <CarouselContent className="-ml-2">
    <CarouselItem className="pl-2 basis-[280px] md:basis-1/3">
      <GlassCard>Content with Accordion for details</GlassCard>
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious className="left-0" />
  <CarouselNext className="right-0" />
</Carousel>
```

### Accordion for Collapsible Content
Use accordions to collapse secondary information:
- Admin follow-ups: Details accordion inside each carousel card
- Pricing tiers: Features accordion below tier selector
- Proposal page: Customer/Pricing/Content sections in accordions

## Pricing Logic (Estimator)
- **Doors:** $150 per door (configurable per tenant)
- **Walls + Trim + Ceiling (Full Job):** $5.00/sqft
- **Walls Only:** $2.50/sqft
- Pricing is tenant-configurable

## Role-Based Access
- **Admin:** PIN 4444 - Lead management, estimates, analytics
- **Owner:** PIN 1111 - Revenue, team, financial reports, SEO tracker
- **Area Manager:** PIN 2222 - Leads, appointments, CRM placeholder
- **Developer:** PIN 0424 - Technical console

## Database Schema
- `leads` - Email captures from estimator
- `estimates` - Detailed quote storage with pricing breakdown
- `seo_tags` - Owner-managed SEO keywords and meta tags
- `estimate_requests` - Legacy form submissions
- `blockchain_stamps` - Solana blockchain document hashes
- `page_views` - Analytics tracking for all page visits
- `analytics_summary` - Cached analytics stats for fast retrieval
- `document_assets` - Trackable assets with opt-in Solana hashing
- `tenant_asset_counters` - Per-tenant sequential hallmark numbering
- `release_versions` - App version tracking with blockchain stamps
- `hallmarks` - ORBIT Hallmark System asset identifiers
- `bookings` - Customer consultation bookings (name, email, service type, date/time)
- `availability_windows` - Configurable availability per tenant and day of week

## Online Booking System
Location: `client/src/components/booking-wizard.tsx`

### Customer Booking Wizard
5-step wizard on the `/estimate` page:
1. **Service Type** - Interior, Exterior, Commercial, Residential
2. **Select Date** - Calendar picker (Mon-Sat available, Sundays disabled)
3. **Select Time** - Hourly slots from 8am-5pm
4. **Contact Details** - Name, email (required), phone, address, description
5. **Confirmation** - Success message with booking summary

### Admin Dashboard
`client/src/components/bookings-card.tsx` - Displays upcoming bookings on Admin, Owner, and Developer dashboards

### API Endpoints
- `POST /api/availability/init` - Initializes default availability windows for tenant
- `GET /api/availability/slots?date=YYYY-MM-DD&tenantId=xxx` - Get available time slots
- `GET /api/bookings/upcoming?tenantId=xxx` - Get upcoming bookings
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id` - Update booking status

## Business Documentation
- **BUSINESS_PLAN.md** - Comprehensive business plan v1.1 with executive summary, market analysis, pricing tiers, go-to-market strategy, and financial projections
- **INVESTOR_PRICING.md** - Investor pricing sheet v2.1 with licensing tiers, unit economics, and revenue projections
- **VERSION_SEPARATION_STRATEGY.md** - Strategy for separating beta from commercial version, includes architecture options, implementation timeline, and migration path

## Branding Assets
Location: `assets/branding/`
- `paintpros-emblem.png` - Pixar-style painter mascot (white background)
- `paintpros-emblem-transparent.png` - Painter mascot with transparent background

## Integrations & Secrets
The following secrets are configured (manually added, not using Replit connector):
- **Solana/Helius:** HELIUS_API_KEY, PHANTOM_SECRET_KEY
- **Payments:** Stripe keys, Coinbase Commerce keys
- **AI:** OpenAI API key
- **Orbit Ecosystem:** ORBIT_ECOSYSTEM_API_KEY, ORBIT_ECOSYSTEM_API_SECRET, ORBIT_ECOSYSTEM_DEV_URL

Note: Stripe integration uses manual secrets instead of Replit connector.

## Orbit Ecosystem Integration
Location: `server/orbit.ts`

Connected to Darkwave Dev Hub for:
- **Payroll Sync:** GET/POST `/api/orbit/payroll`
- **Staffing/Employees:** GET/POST `/api/orbit/employees`
- **Code Snippets:** GET/POST `/api/orbit/snippets` (shared between agents)
- **Health Check:** GET `/api/orbit/status`

## Solana Blockchain Stamping
Location: `server/solana.ts`
- Uses Helius RPC when HELIUS_API_KEY or HELIUS_RPC_URL is available
- Falls back to public Solana RPC endpoints
- Stamps document hashes to Solana memo program
- Developer dashboard has full stamping UI (Wallet, Stamp, History, Verify tabs)
- Document Asset system with opt-in blockchain hashing
- Per-tenant hallmark numbering (e.g., NPP-000000000-02)

## ORBIT Weather System
Location: Footer + Modal

### Components
- `client/src/components/FooterWeatherWidget.tsx` - Small weather icon + temperature in footer
- `client/src/components/WeatherRadarModal.tsx` - Full weather modal with radar map

### Features
- Real-time weather data via Open-Meteo API (free, no key required)
- Animated radar overlay via RainViewer API
- ZIP code location search with localStorage persistence
- Weather details: temperature, feels-like, humidity, wind, precipitation, pressure
- OpenStreetMap tiles for base map with grayscale styling
- Play/pause animation and zoom controls for radar

### API Endpoints (server/routes.ts)
- `GET /api/weather/geocode/:zip` - Convert ZIP to coordinates (Open-Meteo + Nominatim fallback)
- `GET /api/weather?lat=X&lon=Y` - Current weather by coordinates
- `GET /api/weather/radar` - RainViewer radar tile URLs

### localStorage Keys
- `orbit-weather-zip` - User's ZIP code
- `orbit-weather-coords` - { lat, lon } JSON
- `orbit-weather-location` - "City, State" string

### Default Location
Nashville, TN (36.1627, -86.7816)

## Crew Management System
Location: `client/src/pages/crew-lead.tsx`, `client/src/components/crew-management-card.tsx`

### Features
- **Crew Lead Dashboard** (`/crew-lead`) - Full dashboard for crew leads with PIN 3333
- **Time Tracking** - Log daily hours for crew members with status (pending/approved/rejected)
- **Job Notes** - Create notes that can be sent to Owner or Admin
- **Incident Reports** - Log workplace incidents with severity levels
- **Dashboard Integration** - CrewManagementCard on Admin, Owner, Developer dashboards

### Database Tables
- `crew_leads` - Crew lead profiles (name, email, phone, PIN, tenant)
- `crew_members` - Individual crew members assigned to leads
- `time_entries` - Daily time logs per crew member
- `job_notes` - Notes from job sites
- `incident_reports` - Safety/incident logging

### API Endpoints
- `GET /api/crew/leads?tenantId=xxx` - Get all crew leads
- `POST /api/crew/leads` - Create crew lead
- `GET /api/crew/members?leadId=xxx` - Get crew members
- `POST /api/crew/members` - Create crew member
- `GET /api/crew/time-entries?leadId=xxx` - Get time entries
- `POST /api/crew/time-entries` - Create time entry
- `PATCH /api/crew/time-entries/:id` - Update entry status
- `GET /api/crew/job-notes?leadId=xxx` - Get job notes
- `POST /api/crew/job-notes` - Create job note
- `GET /api/crew/incidents?leadId=xxx` - Get incident reports
- `POST /api/crew/incidents` - Create incident report
- `GET /api/crew/stats?tenantId=xxx` - Get crew statistics summary

### PIN Codes
- Crew Lead: 3333 (default)

## Recent Updates (v1.1.7)
- Crew Management System:
  - Full crew lead dashboard with time tracking, job notes, incident reports
  - CrewManagementCard integrated into Admin, Owner, and Developer dashboards
  - 5 new database tables for crew data management
  - Complete API endpoints for CRUD operations

### Previous (v1.1.6)
- ORBIT Weather System in footer:
  - Small weather widget showing icon + temperature
  - Click opens full modal with weather details + animated radar
  - ZIP code search for location changes
  - Free APIs: Open-Meteo, RainViewer, OpenStreetMap

### Previous (v1.1.5)
- Paint Buddy (Rollie) AI assistant redesign:
  - Small Rollie icon near footer (minimized state)
  - Click to open: Large Rollie centered with comic-style speech bubble
  - Male/Female voice toggle (OpenAI onyx/nova voices)
  - Speech-to-text via microphone button (Web Speech API)
  - Clear chat button
  - Responsive design for mobile and desktop

### Previous (v1.1.4)
- Pre-publish sweep: Full system verification completed
- Role-based access control refinement for Owner and Area Manager dashboards
- AccessContext with canViewSalesData property for sales feature placeholders
- Clean LSP diagnostics and console logs
- All 4 dashboards verified working (Admin, Owner, Area Manager, Developer)
- Authentication flows verified (PIN-based access)

### Previous (v1.1.x)
- Live Visitors tracking card on Admin, Owner, and Developer dashboards
- Clickable analytics metric cards with explanation modals
- Enhanced real-time visitor monitoring via page views API

### Previous (v1.0.5)
- Premium glassmorphic dashboard styling with 3D hover effects
- Unified theme-effects.ts for motion variants and glow presets
- Enhanced GlassCard with animated borders and depth effects
- Analytics integration on Admin dashboard
- Pricing tier updates across all pricing pages
- Staggered animations on all 4 dashboards (Admin, Owner, Area Manager, Developer)

### Previous (v1.0.4)
- Online Booking System with 5-step wizard and availability management
- Enhanced lead capture (firstName, lastName, email, phone fields)
- BookingWizard pre-fills from lead data for seamless UX
- Navigation improvements (Home/Back buttons on desktop pages)

## Future Features
- AI Voice Assistant (Twilio integration)
- Blog/content management
- Subdomain-based tenant routing
- Production-ready authentication (replace client-side PINs)

## File Structure
```
client/src/
├── config/tenant.ts       # Multi-tenant configuration
├── context/TenantContext.tsx  # Tenant provider
├── pages/
│   ├── home.tsx           # Homepage with Bento grid
│   ├── services.tsx       # Service listings (tenant-aware)
│   ├── estimate.tsx       # Estimator tool
│   ├── admin.tsx          # Admin dashboard
│   ├── owner.tsx          # Owner dashboard + SEO tracker
│   ├── area-manager.tsx   # Sales rep dashboard
│   ├── crew-lead.tsx      # Crew lead dashboard
│   └── developer.tsx      # Dev console
└── components/
    ├── ui/navbar.tsx      # Tenant-aware navigation
    └── layout/footer.tsx  # Tenant-aware footer

shared/schema.ts           # Database models (Drizzle)
server/storage.ts          # Data access layer
server/routes.ts           # API endpoints
```
