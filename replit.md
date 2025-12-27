# PaintPros.io by Orbit - Compressed Documentation

## Overview
PaintPros.io by Orbit is a multi-tenant SaaS platform designed for the painting and home services industry. It offers white-label websites with a modern Bento Grid design, interactive estimating tools, comprehensive SEO management, and role-based dashboards. The platform supports both franchisable and standalone licensing, integrating features like online booking, internal messaging, crew management, and integrations with the Orbit ecosystem and Solana blockchain for document stamping. The project aims to provide a cutting-edge solution to enhance efficiency and customer engagement in the home services market.

## User Preferences
I prefer simple language and detailed explanations. I want iterative development and for you to ask before making major changes. Do not make changes to the `assets/branding/` folder. The client strongly prefers light themes over dark themes for better text visibility.

## System Architecture

### Multi-Tenant Architecture
The platform utilizes a multi-tenant architecture, allowing each tenant to have unique branding, services, pricing, SEO metadata, and feature toggles. Tenant-specific context is managed via a `TenantProvider` and `useTenant()` hook.

### UI/UX and Design System
The design adheres to a "Sparkle and Shine" aesthetic with a Bento Grid layout, tight spacing, and mobile-first responsiveness. It exclusively uses light themes for readability. Visual effects include glassmorphism, glow effects, and 3D hover animations. Custom components like `GlassCard` and `FlipButton` are used alongside Radix-based accordions and Embla-based carousels for mobile navigation. Homepage layouts are inspired by Craftwork.com, featuring various sections from hero to CTAs.

### Core Features
- **Service & Estimator:** Configurable painting services with flexible, tenant-specific pricing logic.
- **Rollie AI Voice Assistant:** Conversational AI chatbot powered by OpenAI with natural ElevenLabs text-to-speech voices. Supports English/Spanish, male/female voice options, and speech-to-text input. Bundled with all AI Estimator packages.
- **Role-Based Access:** PIN-based access for various roles (Admin, Owner, Developer, etc.) with specific dashboard privileges.
- **Online Booking:** A 5-step customer wizard for scheduling services, with admin oversight.
- **Weather & Crew Management:** Real-time weather display and dashboards for crew leads with time tracking and reporting.
- **Internal Messaging:** Real-time chat with Socket.IO, supporting speech-to-text and role-based badges.
- **PDF Document Center:** Manages contracts, estimates, and invoices with digital signatures and blockchain stamping.
- **Franchise Management:** Supports multi-location franchises with territory licensing and Partner API integration.
- **System Health Monitoring:** Real-time dashboard for critical service monitoring.
- **SEO Management:** Comprehensive, tenant-isolated SEO tracking and editing, including meta tags, structured data, and SEO scoring.
- **Color Library & AI Visualizer:** A curated paint color database with an interactive color wheel and an AI-powered visualizer for previewing colors on uploaded photos using OpenAI Vision API.
- **Painting Glossary:** A comprehensive A-Z glossary of painting terms.
- **Blockchain Verification:** Dual-chain verification shields (Solana, Darkwave) for document verification via QR codes.
- **Self-Service Trial System:** 72-hour sandbox trials with usage limits and auto-seeded data, providing a branded portal URL (`/trial/{company-slug}`).
- **Trial Upgrade System:** Seamless upgrade from trial to paid subscription with automated tenant provisioning, data migration, and Stripe integration for various pricing tiers.

### Trade Verticals System
The platform supports expansion into multiple trade verticals beyond painting:
- **Supported Trades:** Painting (live), Roofing, HVAC, Electrical, Plumbing, Landscaping, General Contracting
- **Configuration:** `shared/trade-verticals.ts` defines trade-specific services, estimator fields, terminology, and branding
- **Placeholder Domains:** roofpros.io, hvacpros.io, electricpros.io, plumbpros.io, landscapepros.io, buildpros.io
- **Showcase Page:** `/trade-verticals` displays all available trade platforms with status badges
- **Future Integration:** Tenants will be assigned a tradeType to inherit trade-specific services and branding

### Royalty Tracking System
A comprehensive system for tracking royalties across Orbit Ventures' SaaS portfolio (PaintPros.io, Brew and Board, Orbit Staffing). It supports multi-product tracking, revenue/expense management, and automated 50% profit share calculations, integrated with Stripe Connect for automated payouts and blockchain verification on Solana and Darkwave.

### Orbit Financial Hub Integration
PaintPros.io integrates with Orbit Staffing as the central financial hub, pushing revenue, expenses, and payouts via secure HMAC-authenticated webhooks for real-time synchronization and biweekly/monthly statement generation.

### System Design Choices
- **Database Schema:** Key tables for leads, estimates, bookings, blockchain stamps, and CRM, Crew Management, Messaging, and Franchise Management.
- **File Structure:** `client/src` for frontend, `shared/schema.ts` for database models, and `server/` for data access and APIs.
- **Authentication:** Hybrid approach with custom email/password for customers and PIN-based access for staff.

### Security Measures
Includes PIN rate limiting, database indexes, security headers (Helmet.js), Zod schema validation, XSS sanitization, and strict tenant isolation.

### Feature Roadmap
Planned enhancements and premium features:
- **Multi-Room Scanner (Coming Soon):** Upload multiple photos per room and scan entire homes for 95%+ measurement accuracy using AI cross-referencing
- **3D Room Visualization:** AR-powered room preview showing paint colors on actual walls before purchase
- **Crew GPS Tracking:** Real-time location tracking for active job sites with arrival notifications
- **Customer Portal Mobile App:** Native iOS/Android apps for customers to track project progress
- **Advanced Analytics Dashboard:** Revenue forecasting, crew utilization metrics, and seasonal trend analysis

## External Dependencies

- **Blockchain:** Solana (primary for document stamping), Darkwave Chain (secondary for verification).
- **Payments:** Stripe, Coinbase Commerce.
- **AI:** OpenAI API (for AI assistant and visualizer).
- **Orbit Ecosystem:** Custom integrations for payroll, staffing, code snippets, and health checks.
- **Weather:** Open-Meteo API, RainViewer API (radar).
- **Mapping:** OpenStreetMap.
- **Real-time Communication:** Socket.IO.
- **Speech-to-Text:** Web Speech API.
- **UI Libraries:** Framer Motion (animations), Embla Carousel, Radix UI.
- **ORM:** Drizzle.
- **Authentication:** Custom bcrypt and session management.