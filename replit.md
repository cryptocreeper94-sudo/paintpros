# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit for the painting and home services industry. It offers white-label websites with a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports franchisable and standalone licensing, aiming for a premium online presence. Key features include online booking, internal messaging, crew management, and integrations with the Orbit ecosystem and Solana blockchain for document stamping.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder.

## System Architecture

### Multi-Tenant Architecture
The platform is multi-tenant, configured via `client/src/config/tenant.ts`. Each tenant has specific branding, services, pricing, SEO metadata, feature toggles (estimator, portfolio, reviews, blog, AI assistant), and credentials. A `TenantProvider` and `useTenant()` hook manage tenant context.

### UI/UX and Design System
The design aims for a "Sparkle and Shine" aesthetic with a Bento Grid layout, tight spacing, and mobile-first responsiveness.
- **Themes:** Light and Dark Mode, with Dark Mode featuring a desaturated Army Green base and Gold highlights.
- **Effects:** Glassmorphism, glow effects, and 3D hover animations.
- **Components:** Custom components include `GlassCard`, `FlipButton`, auto-scroll marquees, and Embla-based carousels. Radix-based accordions are used for collapsible content.
- **Mobile Pattern:** Carousels are used for horizontal scrolling on mobile, often containing `GlassCard` and `Accordion`.
- **Homepage Structure:** Full-width HeroSlideshow at top (Slide 1: "Extraordinary Craftsmanship" intro, Slides 2-7: Customer/Staff help tutorials with PIN for Staff mode). Below the hero: Award card (NPP only, links to /awards) + Portfolio card side-by-side symmetrically. Key component: `client/src/components/ui/hero-slideshow.tsx`.

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