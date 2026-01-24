# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit designed for the painting and home services industry. It provides white-label websites featuring a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports both franchisable and standalone licensing models, aiming to deliver a premium online presence with capabilities such as online booking, internal messaging, crew management, and integration with the Orbit ecosystem and Solana blockchain for document stamping. The overarching vision is to offer a "Sparkle and Shine" online presence, capitalizing on the market potential within professional home services.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder.

## Brand Taglines
- **NPP (Nashville Painting Professionals)**: "Transforming familiar spaces into extraordinary places."
- **Lume Paint Co**: "Elevating the backdrop of your life."

## System Architecture

### Multi-Tenant Architecture
The platform is built on a multi-tenant architecture, configured via `client/src/config/tenant.ts`. Each tenant benefits from customizable branding, services, pricing, SEO metadata, feature toggles, and credentials. A `TenantProvider` and `useTenant()` hook manage context, with tenant selection currently driven by `VITE_TENANT_ID`, with future plans for subdomain routing.

### UI/UX and Design System
The design emphasizes a "Sparkle and Shine" aesthetic, utilizing a Bento Grid layout, tight spacing, and mobile-first responsiveness. Key design elements include:
- **Themes:** Support for Light and Dark Mode, with Dark Mode featuring a desaturated Army Green base and Gold accents.
- **Effects:** Integration of Glassmorphism, glow effects, and 3D hover animations.
- **Components:** Custom `GlassCard`, `FlipButton`, auto-scroll marquees, Embla-based carousels, and Radix-based accordions.
- **Mobile Pattern:** Carousels are central for horizontal scrolling on mobile, often containing `GlassCard` and `Accordion` components.

### Feature Specifications
- **Service Descriptions:** Detailed definitions for various painting services (Interior/Exterior, Commercial/Residential), including specific options like Walls, Ceilings, Trim, Doors, and Drywall REPAIR.
- **Estimator Pricing Logic:** Tenant-configurable pricing with default examples.
- **Role-Based Access:** PIN-based access for Admin, Owner, Area Manager, Developer, and Crew Lead, each with specific dashboard access.
- **Online Booking System:** A 5-step customer wizard covering service type, date, time, contact, and confirmation, with bookings visible in admin dashboards.
- **ORBIT Weather System:** Displays real-time weather and an animated radar modal using ZIP code search.
- **Crew Management System:** Dashboard for crew leads including time tracking, job notes, and incident reporting.
- **Internal Messaging System:** Real-time, floating chat widget with Socket.IO, speech-to-text, typing indicators, unread counts, and role-based badges.
- **AI Credits System:** A prepaid model for metered AI features with subscription tiers and credit packs. Security involves server-side pack validation and credit deduction. Stripe is integrated for payments.
- **AI-Powered Features:** Includes AI Proposal Writer, Smart Lead Scoring, Voice-to-Estimate, Follow-up Optimizer, Profit Margin Optimizer, and Seasonal Demand Forecasting.
- **Customer Experience Features:** Customer Portal for job tracking, Real-Time Crew GPS, Digital Tip Jar, and Before/After Gallery.
- **Business Intelligence Features:** Customer Lifetime Value calculation, Competitor Intelligence, Smart Contracts (blockchain-signed), AR Color Preview, and Crew Skills Matching.
- **AI Field Operations Autopilot:** Dynamic Route Optimization, Job Risk Scoring, and Just-In-Time Materials.
- **Predictive Revenue Intelligence:** 90-Day Cashflow Forecasting, Pricing Elasticity Analysis, and Marketing Mix Optimization.
- **Immersive Site Capture:** Digital Twins and AR Overlays.
- **Autonomous Back Office:** Auto-Invoicing, Lien Waivers (digital signing with blockchain), Compliance Tracking, and AP/AR Reconciliation.
- **Orbit Workforce Network:** Subcontractor Marketplace, AI Vetting, and Shift Bidding.
- **Trust & Growth Layer:** Sentiment Analysis, Milestone NFTs, ESG Tracking, Embedded Financing, and Franchise Analytics.
- **Google Integrations:** Multi-tenant Google Calendar sync for bookings and Google Local Services Ads (LSA) integration for lead management and feedback.
- **AI Blog System:** Multi-tenant blog architecture with GPT-4o powered post generation, SEO optimization, and category seeding.
- **Unified Multi-Tenant Analytics Dashboard:** Provides live visitors, traffic metrics, device breakdown, top pages, referrers, and SEO tag counts per tenant, with GA4 integration.

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `seo_tags`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`, and tables specific to Crew Management, Internal Messaging, AI Credits, Google Calendar, Google LSA, and blog posts.
- **File Structure:** Organized into `client/src` for frontend, `shared/schema.ts` for database models, and `server/` for data access and API routes.
- **Authentication:** Firebase Authentication with Google Sign-In, complementing an existing PIN-based access system.

## External Dependencies

- **Solana/Helius:** For blockchain stamping of document hashes and Milestone NFTs.
- **Stripe:** For payment processing, including AI credit packs and subscriptions.
- **Coinbase Commerce:** For alternative payment processing.
- **OpenAI API:** Powers AI assistant features, blog generation, and various AI modules.
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
- **Google APIs:** For Google Calendar and Google Local Services Ads integrations.
- **Firebase Authentication:** For user authentication with Google Sign-In.
- **Google Analytics 4:** For tenant-aware website analytics.