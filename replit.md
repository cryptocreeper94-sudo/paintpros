# PaintPros.io by Orbit - Documentation

## Metadata
**Tags:** #multi-tenant, #painting-industry, #saas
**Last Updated:** December 12, 2025

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
- Horizontal scroll carousels
- Framer Motion animations throughout

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

## Future Features
- AI Voice Assistant (Twilio integration)
- Room scanning with OpenAI Vision API
- Online booking
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
│   └── developer.tsx      # Dev console
└── components/
    ├── ui/navbar.tsx      # Tenant-aware navigation
    └── layout/footer.tsx  # Tenant-aware footer

shared/schema.ts           # Database models (Drizzle)
server/storage.ts          # Data access layer
server/routes.ts           # API endpoints
```
