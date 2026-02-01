# PaintPros.io by Orbit - Compressed Documentation

## Project Stats & History
See `PROJECT_STATS.md` for a living document tracking development progress, line counts, cost estimates, and historical snapshots.

## Overview
PaintPros.io is a multi-tenant SaaS platform by Orbit designed for the painting and home services industry. It provides white-label websites, interactive estimating tools, SEO management, and role-based dashboards. The platform supports franchisable and standalone licensing models, with a primary focus on Lume Paint Co as a template for future expansion. The project aims to enhance customer spaces and expand across various trade verticals.

## User Preferences
- I prefer simple language and detailed explanations
- I want iterative development and for you to ask before making major changes
- Do not make changes to the `assets/branding/` folder
- Never say "AI" or "app" - use "room visualizer tool", "estimator tool", "instant estimation" instead
- Always use lucide-react icons, never emoji

## System Architecture

### Multi-Tenant Architecture
The platform employs a multi-tenant architecture managed via `client/src/config/tenant.ts`, allowing for customizable branding, services, pricing, SEO, feature toggles, and Stripe configurations per tenant. Tenant selection is driven by `VITE_TENANT_ID`. Each tenant can have its own Stripe integration.

### UI/UX and Design System
The design adheres to an "Ultra Premium Design System" with a "Sparkle and Shine" aesthetic, featuring a Bento Grid layout, mobile-first responsiveness, Light/Dark Modes, Glassmorphism, glow effects, 3D hover animations, and custom components like `GlassCard` and `FlipButton`. Tenant-specific `primaryColor` is used for accents while maintaining a consistent design language.

### Core Features
- **Service Management:** Detailed service descriptions and configurable estimator pricing logic.
- **Access Control:** Role-based (Admin, Owner, Developer, Crew Lead) PIN-based access.
- **Booking System:** A 5-step customer online booking wizard.
- **Weather & Crew Management:** Real-time ORBIT Weather System with animated radar, and a Crew Management System for time tracking and incident reporting.
- **Communication:** Internal Messaging System with real-time chat, speech-to-text, and Socket.IO.
- **Marketing Hub:** Features for content composition, ad management, budget tracking, and analytics, with content types (educational, gamified, sales, seasonal, evergreen, testimonial, behind-scenes) and a "Today's Suggested Post" system for content rotation.
- **Organic Posting Schedule:** 9x daily every 2 hours (6am, 8am, 10am, 12pm, 2pm, 4pm, 6pm, 8pm, 10pm CST) to both Facebook and Instagram.
- **Ad Campaign Management:** 7-day campaign duration with automatic rotation, $50/day budget ($25 Facebook + $25 Instagram), underperforming ad detection, and real-time Meta API spend sync (syncs before checking budgets, resets only at midnight CST).
- **Admin Onboarding:** Simplified "Add TrustLayer as Admin" wizard for Facebook Page integration.
- **AI Agent Integration:** Floating AI assistants with tenant-specific designs and ElevenLabs voice responses.
- **Toolkit Credits System:** Prepaid credit model for metered features like Measure Tool, Color Match, Room Visualizer, and Complete Estimate, with subscription tiers and credit packs integrated with Stripe.
- **AI-Powered Tools:** Live Translator (English/Spanish), Proposal Writer, Smart Lead Scoring, Voice-to-Estimate, Follow-up Optimizer, Profit Margin Optimizer, and Seasonal Demand Forecasting.
- **Customer Experience:** Customer Portal, Real-Time Crew GPS, Digital Tip Jar, and Before/After Gallery.
- **Business Intelligence:** Customer Lifetime Value, Competitor Intelligence, Smart Contracts, AR Color Preview, and Crew Skills Matching.
- **Google Integrations:** Multi-tenant Google Calendar sync and Google Local Services Ads (LSA) integration.
- **Blog System:** Multi-tenant blog architecture with GPT-4o powered post generation and SEO optimization.
- **Unified Analytics Dashboard:** Live visitors, traffic metrics, device breakdown, top pages, referrers, and SEO tag counts per tenant, with GA4 integration.

### Ecosystem Integration
The platform integrates with the broader TrustLayer ecosystem, connecting with 17 applications through a centralized hub for payroll, staffing, health checks, and a multi-app ad catalog system.

## External Dependencies

### APIs & Services
- **Solana/Helius:** Blockchain stamping for document hashes and NFTs.
- **Stripe:** Payment processing.
- **Coinbase Commerce:** Alternative payment processing.
- **OpenAI API:** AI features and content generation.
- **TrustLayer Platform:** Custom business function integrations.
- **Open-Meteo API & RainViewer API:** Weather data and radar.
- **OpenStreetMap:** Base maps.
- **Firebase Authentication:** User authentication.
- **Google Analytics 4 & Google APIs:** Analytics, Calendar, and LSA.
- **ElevenLabs API:** Speech-to-text and text-to-speech.

### Frontend Libraries
- **Framer Motion:** UI animations.
- **Embla Carousel:** Horizontal carousels.
- **Radix UI:** Accessible UI components.
- **Socket.IO:** Real-time messaging.
- **Web Speech API:** Speech-to-text.

### Backend
- **Drizzle:** ORM and database schema definition.
- **Express:** API server.