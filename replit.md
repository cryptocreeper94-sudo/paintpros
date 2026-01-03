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