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
- **Franchise Management System:** Complete multi-location franchise support with territory licensing, tiered pricing (franchise fees, royalty percentages, platform fees), and Partner API integration. Features include franchise CRUD operations, location management, API credential generation with scoped permissions (estimates, leads, analytics, billing), and usage tracking with rate limiting (60/min, 10,000/day default). Integrated into Developer dashboard.

### System Design Choices
- **Database Schema:** Key tables include `leads`, `estimates`, `seo_tags`, `bookings`, `availability_windows`, `blockchain_stamps`, `page_views`, `document_assets`, `hallmarks`, tables for Crew Management (`crew_leads`, `crew_members`, `time_entries`, `job_notes`, `incident_reports`), Internal Messaging (`conversations`, `conversation_participants`, `messages`), Document Center (`documents`, `document_versions`, `document_signatures`), CRM Calendar (`calendar_events`, `calendar_reminders`, `calendar_attendees`), and Franchise Management (`franchises`, `franchise_locations`, `partner_api_credentials`, `partner_api_logs`).
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
- **Replit Auth:** For social/OAuth login (Google, GitHub, Apple, X, email/password).

## Darkwave Dev Hub Documentation

The `docs/` folder contains reusable architecture documentation for agents:

| Document | Description |
|----------|-------------|
| `docs/AUTHORIZATION_SYSTEM.md` | **Hybrid Authentication Architecture** - Combines Replit Auth (social login) for customers with PIN-based access for staff. Includes full implementation guide, code examples, and branding customization instructions. |

### Authentication System Summary
- **Customer Login:** Replit Auth via `/api/login` (Google, GitHub, Apple, X, email)
- **Staff Access:** PIN-based dashboard access (Admin: 4444, Owner: 1111, Developer: 0424, etc.)
- **Key Files:** `server/replit_integrations/auth/`, `client/src/hooks/use-auth.ts`, `client/src/components/ui/navbar.tsx`

## Recent Changes (Changelog)

### December 2025
- **v1.2.3** - Current Release
  - Push Notifications: Browser push notifications for appointment reminders (24h and 1h before)
  - Email Reminders: Automatic email reminders sent 24h and 1h before confirmed appointments
  - Notification Settings: User-configurable notification preferences in customer account portal
  - Reminder Scheduler: Background job checks for upcoming appointments every 5 minutes
  - Desktop Title Enhancement: Larger PaintPros.io title and subtitle on desktop screens
  - New database tables: push_subscriptions, appointment_reminders
  - Tenant-aware notifications: Reminders respect multi-tenant isolation
- **v1.2.2**
  - Email Notifications: Automatic email confirmations when customers accept estimates (to both customer and business)
  - Estimate History Filtering: Filter estimates by status (pending, sent, accepted, scheduled, in progress, completed)
  - Estimate History Sorting: Sort estimates by date or amount, ascending or descending
  - Accept Estimate Feature: Customers can accept pending estimates directly from their portal
  - Error Handling: Retry functionality and user-friendly error states for dashboard loading failures
- **v1.2.1**
  - Customer Portal (/account): Complete customer account management with bento grid layout
  - Estimate History: View all past estimates with accordion detail expansion
  - Job Tracking: Status cards for active and completed painting jobs
  - Appointment Booking: View and manage scheduled service appointments
  - Document Access: Access contracts, invoices, and proposals with accordion expansion
  - Customer Preferences: Save preferred contact method, colors, communication preferences
  - Referral Program: Quick access to referral link with clipboard copy
  - Messaging: Quick link to customer support messaging
  - Auth gating: Portal content protected with Replit Auth, sign-in prompt for unauthenticated users
  - Navbar enhancement: "My Account" link added for logged-in users
- **v1.2.0**
  - Franchise Management System: Complete multi-location franchise support with territory licensing
  - Partner API: Programmatic access with scoped permissions (estimates, leads, analytics, billing)
  - API credential management: Key generation, secret reveal, scope configuration
  - Rate limiting: Configurable requests per minute/day with usage tracking
  - Franchise tiers: Standard, Premium, Enterprise with configurable fees
  - Multi-location support: Manage multiple offices per franchise
  - Developer dashboard integration: Full CRUD for franchises, credentials, and usage logs
- **v1.1.9**
  - Terms & Warranty page (/terms): Full legal documentation with warranty, payment terms, liability, disputes, and termination sections
  - Enhanced warranty modal: Detailed coverage info with exclusions and link to full terms
  - Footer updated with "Terms & Warranty" link
  - Mobile header layout fixes: Hamburger menu, title, and theme toggle properly positioned
  - Header title gradient colors lightened for better readability
  - Homepage bento grid layout fixes: Premium Materials and On-Time cards properly aligned
  - Theme toggle (light/dark mode) restored and positioned correctly on mobile
- **v1.1.8**
  - Convert Won Deal to Job: Seamlessly transition won sales deals to the Jobs Pipeline
  - Job-specific details: Crew lead assignment, start/end dates, invoice numbers, job addresses
  - Job details display: Visual badges showing crew, dates, and location in Jobs Pipeline
  - Dashboard Preview: Admin/Owner can view all role dashboards from a single modal
  - Crew Lead PIN fix: Authentication now works across all tenants with fallback
- **v1.1.7**
  - Dual Pipeline Mode: Toggle between Sales Pipeline and Jobs Pipeline views
  - Sales Pipeline stages: New Lead, Quoted, Negotiating, Won, Lost
  - Jobs Pipeline stages (DripJobs-style): Project Accepted, Scheduled, In Progress, Touch-ups, Complete
  - Mobile-responsive CRM Calendar (compact views for phone screens)
  - QuickBooks Online integration setup added to Developer portal
  - Week view shows 3 days on mobile, full 7 on desktop
  - Touch-friendly calendar controls with abbreviated labels
- **v1.1.6**
  - CRM Calendar System with comprehensive scheduling capabilities
  - Month, Week, and Day views with smooth navigation
  - Color-coded event types (appointment, meeting, deadline, task, reminder, follow-up, estimate, job)
  - Event reminders with configurable timing (15 min to 1 week before)
  - Support for recurring events (daily, weekly, monthly, yearly)
  - Lead and estimate linking for CRM integration
  - Calendar integrated into Admin and Owner dashboards
  - Tenant-scoped events with role-based access control
- **v1.1.5**
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