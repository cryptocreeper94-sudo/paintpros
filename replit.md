# PaintPros.io by Orbit - Documentation

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit designed for the painting and home services industry. It provides white-label websites featuring a modern Bento Grid design, interactive estimating tools, SEO management, and role-based dashboards. The platform supports both franchisable and standalone licensing models, targeting $30+/month pricing. Its primary focus is on Lume Paint Co as a template for future franchise expansion, with eventual trade vertical expansion. The project aims to elevate the backdrop of customers' lives and transform familiar spaces into extraordinary places.

## User Preferences
- I prefer simple language and detailed explanations
- I want iterative development and for you to ask before making major changes
- Do not make changes to the `assets/branding/` folder
- Never say "AI" or "app" - use "room visualizer tool", "estimator tool", "instant estimation" instead
- Always use lucide-react icons, never emoji

## System Architecture

### Multi-Tenant Architecture
The platform utilizes a multi-tenant architecture managed via `client/src/config/tenant.ts`. Each tenant can customize branding, services, pricing, SEO metadata, feature toggles, credentials, and Stripe billing configuration. Tenant selection is driven by `VITE_TENANT_ID`.

**Multi-Tenant Stripe:** Each tenant has their own Stripe configuration:
- `usePlatformKeys: true` - Demo/TrustLayer uses platform's Stripe keys (STRIPE_LIVE_SECRET_KEY, STRIPE_LIVE_PUBLISHABLE_KEY)
- `usePlatformKeys: false` - NPP and Lume need their own Stripe accounts configured via environment variables (e.g., NPP_STRIPE_SECRET_KEY, LUME_STRIPE_SECRET_KEY)

### UI/UX and Design System
The design emphasizes a "Sparkle and Shine" aesthetic with a Bento Grid layout, tight spacing, and mobile-first responsiveness. It supports Light and Dark Modes, incorporates Glassmorphism, glow effects, and 3D hover animations. Custom components include `GlassCard` and `FlipButton`. Carousels are used for mobile horizontal scrolling.

**Ultra Premium Design System:** All tools and dashboards adhere to a consistent ultra-premium design language featuring glass morphism cards, gradient icons, Framer Motion animations, full-width hero banners with gradient overlays, and premium shadows. Tenant-specific `primaryColor` is used for accents, while design language remains consistent across tenants. Login screens have full-screen backgrounds, floating glow orbs, glass morphism cards, and an Enterprise Security badge. Dashboards utilize 3-column (Field Tools, Quick Actions) and 4-column (Business Tools) grids with consistent section headers and gradient backgrounds.

### Core Features
- **Service Descriptions:** Detailed definitions for painting services including specific options.
- **Estimator Pricing Logic:** Tenant-configurable pricing.
- **Role-Based Access:** PIN-based access for various roles (Admin, Owner, Developer, Crew Lead) with specific dashboard access.
- **Online Booking System:** A 5-step customer wizard for service type, date, time, contact, and confirmation.
- **ORBIT Weather System:** Real-time weather and animated radar modal.
- **Crew Management System:** Dashboard for time tracking, notes, and incident reporting.
- **Internal Messaging System:** Real-time chat widget with Socket.IO, speech-to-text, and role-based badges.
- **Marketing Hub:** Redesigned with 5 tabs: Content Studio, Analytics Center, Calendar, Playbook, and Budget. Features photo-realistic hero images, educational content, and marketing psychology strategies.
- **AI Credits System:** Prepaid model for metered features with subscription tiers and credit packs, integrated with Stripe for payments.
- **Live Translator:** Real-time speech translation (English/Spanish) using ElevenLabs STT + OpenAI translation + ElevenLabs TTS. Costs 50 credits/minute (~$0.50/min profit margin).
- **AI-Powered Features:** Includes Proposal Writer, Smart Lead Scoring, Voice-to-Estimate, Follow-up Optimizer, Profit Margin Optimizer, and Seasonal Demand Forecasting.
- **Customer Experience Features:** Customer Portal, Real-Time Crew GPS, Digital Tip Jar, and Before/After Gallery.
- **Business Intelligence Features:** Customer Lifetime Value, Competitor Intelligence, Smart Contracts, AR Color Preview, and Crew Skills Matching.
- **Google Integrations:** Multi-tenant Google Calendar sync and Google Local Services Ads (LSA) integration.
- **Blog System:** Multi-tenant blog architecture with GPT-4o powered post generation and SEO optimization.
- **Unified Analytics Dashboard:** Live visitors, traffic metrics, device breakdown, top pages, referrers, and SEO tag counts per tenant, with GA4 integration.

### Ecosystem Integration
- **DarkWave Studios:** Central ecosystem hub for code sharing.
- **ORBIT Ecosystem Hub:** Connected for payroll sync, staffing, and health checks.

### Database Schema
Key tables cover leads, estimates, SEO, bookings, availability, blockchain stamps, page views, document assets, hallmarks, crew management, internal messaging, AI credits, Google Calendar, Google LSA, and blog posts.

## External Dependencies

### APIs & Services
- **Solana/Helius:** Blockchain stamping of document hashes and Milestone NFTs.
- **Stripe:** Payment processing.
- **Coinbase Commerce:** Alternative payment processing.
- **OpenAI API:** Powers AI features and content generation.
- **Orbit Ecosystem:** Custom integration for various business functions.
- **Open-Meteo API:** Real-time weather data.
- **RainViewer API:** Animated weather radar tiles.
- **OpenStreetMap:** Base maps for weather radar.
- **Firebase Authentication:** User authentication.
- **Google Analytics 4:** Website analytics.
- **Google APIs:** Calendar and Local Services Ads.

### Frontend Libraries
- **Framer Motion:** UI animations.
- **Embla Carousel:** Horizontal carousels.
- **Radix UI:** Accessible UI components.
- **Socket.IO:** Real-time messaging.
- **Web Speech API:** Speech-to-text.
- **ElevenLabs API:** Speech-to-text and text-to-speech for Live Translator.

### Internationalization (i18n)
- Full bilingual support (English/Spanish) via `client/src/lib/i18n.tsx`
- Language toggle in Settings, stored in localStorage as 'paintpros-language'
- Google Play app store descriptions in both languages for Play Store submission

### Backend
- **Drizzle:** Database schema definition and ORM.
- **Express:** API server.