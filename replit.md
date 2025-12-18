# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit for the painting and home services industry. It offers white-label websites with a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports franchisable and standalone licensing, aiming for a premium online presence. Key features include online booking, internal messaging, crew management, and integrations with the Orbit ecosystem and Solana blockchain for document stamping.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder.

**Light Theme Preference:** The client strongly prefers light themes over dark themes for better text visibility. The estimate page now uses a light color scheme with white backgrounds and dark gray text for maximum readability. All form inputs use gray-50 backgrounds with gray-900 text.

## System Architecture

### Multi-Tenant Architecture
The platform is multi-tenant, configured via `client/src/config/tenant.ts`. Each tenant has specific branding, services, pricing, SEO metadata, feature toggles (estimator, portfolio, reviews, blog, AI assistant), and credentials. A `TenantProvider` and `useTenant()` hook manage tenant context.

### UI/UX and Design System
The design aims for a "Sparkle and Shine" aesthetic with a Bento Grid layout, tight spacing, and mobile-first responsiveness.
- **Themes:** Light mode only (dark mode removed per client preference for better text visibility).
- **Effects:** Glassmorphism, glow effects, and 3D hover animations.
- **Components:** Custom components include `GlassCard`, `FlipButton`, auto-scroll marquees, and Embla-based carousels. Radix-based accordions are used for collapsible content.
- **Mobile Pattern:** Carousels are used for horizontal scrolling on mobile, often containing `GlassCard` and `Accordion`.
- **Homepage Structure (NPP):** Comprehensive vertical scrolling layout inspired by Craftwork.com but with NPP's unique content:
  1. **Hero Section** - "Paint Your Home The Right Way" with painter image and CTA buttons
  2. **Trust & Awards** - Award card (Best Painter 2025) + Solana Blockchain Verification card
  3. **How We Deliver Excellence** - Feature image + 3 cards (Meticulous Preparation, Full-Time Painters, Perfection in Details)
  4. **Our Services** - Interior/Exterior cards with images
  5. **Dive Into Color** - Color library preview with horizontal scroll carousels by brand (Sherwin-Williams, Benjamin Moore)
  6. **What to Expect** - Process timeline (Prep, Painting, Drying, Walkthrough)
  7. **Colors & Sheens Guide** - Educational content about paint finishes
  8. **Service Area** - Nashville metro area coverage with map
  9. **End-to-End Communication** - Daily updates feature highlight
  10. **Customer Testimonials** - 5-star reviews with customer quotes
  11. **Resources Hub** - Links to Color Library, Warranty, FAQs, Services
  12. **Final CTA** - "Get Your Free Estimate"
  Key component: `client/src/pages/home-npp.tsx`
- **Default Theme:** Light mode is now the default (client preference for better readability). Stored in `client/src/context/ThemeContext.tsx`.

### Feature Specifications
- **Service Descriptions:** Clearly define Interior/Exterior, Commercial/Residential painting services, including Walls, Ceilings, Trim, Doors, and Drywall REPAIR only.
- **Estimator Pricing Logic:** Configurable per tenant, with default pricing examples like $150/door, $5.00/sqft for full jobs, and $2.50/sqft for Walls Only.
- **Role-Based Access:** PIN-based access for Admin (4444), Owner (1111), Area Manager (2222), Developer (0424), and Crew Lead (3333), each with specific dashboard access.
- **Online Booking System:** A 5-step customer wizard for service type, date, time, contact, and confirmation. Admin dashboards display bookings.
- **ORBIT Weather System:** Displays real-time weather in the footer and a full modal with animated radar, using ZIP code search.
- **Crew Management System:** Dashboard for crew leads with time tracking, job notes, and incident reporting.
- **Internal Messaging System:** Real-time, floating chat widget with Socket.IO, speech-to-text, typing indicators, unread counts, and role-based badges.
- **PDF Document Center:** Document management with digital signatures for contracts, estimates, invoices, and proposals. Includes creation, version tracking, and signature capture via `react-signature-canvas`. API routes have role-based authentication and tenant scoping.
- **Franchise Management System:** Multi-location franchise support with territory licensing, tiered pricing, and Partner API integration. Includes franchise CRUD, location management, API credential generation with scoped permissions, and usage tracking with rate limiting.
- **System Health Monitoring:** Real-time health dashboard visible on Admin (4444), Owner (1111), and Developer (0424) dashboards. Monitors database, payments (Stripe), email (Resend), blockchain (Solana), and AI (OpenAI) services with color-coded status indicators and expandable details.
- **SEO Management System:** Comprehensive SEO tracking and editing for Admin, Owner, and Developer dashboards. Features include per-page meta tag management (title, description, keywords, robots), Open Graph tags (title, description, image, type, site name, locale), Twitter Card tags (card type, title, description, image, site handle), structured data (JSON-LD schemas), canonical URLs, and SEO scoring with audit history. Components: `SeoManager` for meta tag injection, `SeoTracker` for dashboard display. Database tables: `seoPages`, `seoAudits`. All routes enforce tenant isolation for multi-tenant security.
- **Color Library System:** Curated professional paint color database featuring Sherwin-Williams and Benjamin Moore colors. Features include an **interactive color wheel** for browsing by hue family (Neutrals, Reds, Oranges, Yellows, Greens, Blues, Purples, Pinks), HSL-based color classification, flip cards with color details (LRV, undertone, coordinating colors), search functionality, and integration with the estimate flow. Colors with low saturation or extreme lightness are automatically classified as Neutrals. Database tables: `paintColors` (brand, productLine, colorCode, colorName, hexValue, category, undertone, lrv, coordinatingColors, trimColors, roomTypes), `customerColorSelections` (for saving customer color choices per estimate). Key component: `client/src/pages/color-library.tsx`.
- **AI Color Visualizer:** Canvas-based tool allowing customers to upload wall photos and preview paint colors with adjustable intensity (10-90%). Uses OpenAI Vision API (`gpt-4o`) to provide contextual design insights about color choices including lighting recommendations, mood assessment, and coordination suggestions. Accessible from the Color Library page via CTA button or from individual color cards. Key component: `client/src/components/color-visualizer.tsx`. API endpoint: `/api/color-visualize`.
- **Room Scanner (Square Footage Estimator):** Camera-based tool for estimating room dimensions. Currently marked "Coming Soon" with locked state. Designed to help customers estimate square footage for accurate painting quotes. Key component: `client/src/components/room-scanner.tsx`.
- **Painting Glossary:** Comprehensive A-Z glossary of 120+ painting and interior trim terms. Features include search functionality, category filtering (Painting, Trim & Moulding, Finishes, Techniques), alphabetical navigation, and glass card design. Accessible via `/glossary` route and linked from Resources page. Key component: `client/src/pages/glossary.tsx`.
- **Layout Switcher (Developer):** Developer dashboard includes a Layout Switcher card allowing quick toggle between Bento grid and minimalist homepage layouts for client demos. Preference stored in localStorage as `dev_layout_override`.

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`, and tables for Crew Management, Internal Messaging, Document Center, CRM Calendar, and Franchise Management.
- **File Structure:** `client/src` for frontend, `shared/schema.ts` for database models, and `server/` for data access and API routes.
- **Authentication System:** Hybrid architecture with custom email/password for customers and PIN-based access for staff. Key files: `server/customAuth.ts`, `client/src/pages/auth.tsx`, `client/src/hooks/use-auth.ts`, `client/src/components/ui/navbar.tsx`.

### Security Measures
- **PIN Rate Limiting:** 5 attempts within 15-minute window, exponential backoff lockout (2^n minutes), lockout counter persists across attempts for escalation, successful login clears history. Implemented in `/api/auth/pin/verify` and `/api/auth/pin/change` endpoints.
- **Database Indexes:** Performance and security indexes on users (tenantId, role), bookings (tenantId, userId, scheduledDate, status, customerEmail), seoPages (tenantId, pagePath composite), leads (tenantId), estimates (tenantId), crmDeals (tenantId, stage composite).
- **Security Headers:** Helmet.js configured with X-Frame-Options, X-Content-Type-Options, HSTS, and other HTTP security headers. CSP disabled for Vite dev compatibility.
- **Input Validation:** Zod schema validation on messaging endpoints (conversations, messages) and booking endpoints with proper 400 error responses.
- **XSS Sanitization:** Using the `xss` library to sanitize user-controlled fields across the platform: SEO pages (metaTitle, metaDescription, metaKeywords, ogTitle, ogDescription, twitterTitle, twitterDescription, pageTitle), messages (content), CRM deals (title, notes, jobAddress), CRM notes (content), calendar events (title, description, location, notes), and documents (title, description).
- **Tenant Isolation:** All multi-tenant tables (bookings, documents, conversations, seoPages, leads, estimates, crmDeals) have tenantId columns with database indexes. Storage methods and API routes filter data by tenant using `getTenantFromHostname()` for complete data isolation between tenants.

## External Dependencies

- **Solana/Helius:** For blockchain stamping of document hashes.
- **Payments:** Stripe and Coinbase Commerce.
- **AI:** OpenAI API (for AI assistant features).
- **Orbit Ecosystem:** Custom integration for payroll sync, staffing, code snippets, and health checks.
- **Open-Meteo API:** Provides real-time weather data.
- **RainViewer API:** Provides animated weather radar tiles.
- **OpenStreetMap:** Used for base maps in the weather radar modal.
- **Socket.IO:** For real-time communication in the internal messaging system.
- **Web Speech API:** For speech-to-text functionality.
- **Framer Motion:** For UI animations.
- **Embla Carousel:** For horizontal carousels.
- **Radix UI:** For accessible UI components.
- **Drizzle:** For database schema definition.
- **Custom Auth:** Email/password authentication with bcrypt hashing and session management.

## Changelog

### December 2025 (Latest)
- **HeroSlideshow Integration**: Added interactive customer slideshow to NPP homepage with 8 feature slides (AI Visualizer, Color Library, Room Scanner, Glossary, Estimate, Booking, Portal)
- **Team Page Staff Slideshow**: Staff tutorial slideshow at /team accessible from footer Team link with PIN authentication
- **Fixed Navigation**: Hamburger menu now stays fixed at top of screen with transparent background
- **Homepage Structure Update**: Added "See How It Works" section with HeroSlideshow below hero banner
- **AI Color Visualizer**: Canvas-based color preview tool with OpenAI Vision analysis for wall photos
- **Room Scanner**: Placeholder for upcoming square footage estimation feature (Coming Soon)
- **Homepage Updates**: Updated hero tagline to highlight AI tools ("AI Room Visualizer · Square Footage Scanner · Instant Estimates")
- **Navigation**: Added Home link as first item in hamburger menu
- **UI Fixes**: Removed header border line, fixed menu scroll containment
- **Footer**: Removed Investors link from NPP tenant footer (demo-only feature)
- **Theme**: Removed dark mode completely per client preference for better readability

### PIN Authentication Reference
- **Developer**: 0424
- **Owner**: 1111  
- **Project Manager**: 2222
- **Crew Lead**: 3333
- **Ops Manager (Admin)**: 4444