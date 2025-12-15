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
- **PDF Document Center:** A comprehensive document management system with digital signature capabilities. Supports contracts, estimates, invoices, and proposals. Features include document creation, version tracking, and digital signature capture via react-signature-canvas. Integrated into Admin and Owner dashboards. API routes include role-based authentication and tenant scoping for multi-tenant isolation.

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `seo_tags`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`, and tables for Crew Management (`crew_leads`, `crew_members`, `time_entries`, `job_notes`, `incident_reports`), Internal Messaging (`conversations`, `conversation_participants`, `messages`), and Document Center (`documents`, `document_versions`, `document_signatures`).
- **File Structure:** Organized with `client/src` for frontend components, pages, config, and context; `shared/schema.ts` for database models; and `server/` for data access and API routes.

## External Dependencies

- **Solana/Helius:** Used for blockchain stamping of document hashes (requires `HELIUS_API_KEY` or `HELIUS_RPC_URL`).
- **Payments:** Stripe and Coinbase Commerce (manual secret configuration).
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

### December 2025
- **v1.1.5** - Current Release
  - PDF Document Center with digital signature capabilities
  - Document management for contracts, estimates, invoices, and proposals
  - Digital signature capture via react-signature-canvas
  - Document versioning and status tracking (draft, pending, signed, archived)
  - Role-based authentication with tenant scoping for all document endpoints
  - Document Center integrated into Admin and Owner dashboards
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