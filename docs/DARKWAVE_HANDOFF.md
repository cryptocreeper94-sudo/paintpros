# DarkWave Studios Widget Catalog - Complete Handoff

**From:** PaintPros.io / TrustLayer Marketing  
**To:** DarkWave Studios Hub  
**Date:** January 30, 2026  
**Status:** Production Ready

---

## Overview

The TrustLayer Widget Catalog provides **11 embeddable JavaScript widgets** for third-party integration. Each widget is standalone, white-labelable, and can be embedded on any website via a simple script tag.

**Widget URL:** `https://tlid.io/widgets/`  
**API Endpoint:** `https://tlid.io/api/widgets/`

---

## Widget Inventory

| Widget | File | Purpose | Pricing |
|--------|------|---------|---------|
| Analytics | `tl-analytics.js` | Page view tracking & session analytics | $9-199/mo |
| Estimator | `tl-estimator.js` | Instant painting/service cost estimates | $49-149/mo |
| Booking | `tl-booking.js` | Appointment scheduling with calendar | $29-79/mo |
| Reviews | `tl-reviews.js` | Customer review display carousel | $9-29/mo |
| Lead Capture | `tl-lead-capture.js` | Contact form with field validation | $19-49/mo |
| SEO | `tl-seo.js` | On-page SEO health checker | $19-49/mo |
| Chat | `tl-chat.js` | Live chat widget with real-time messaging | $29-99/mo |
| Proposal | `tl-proposal.js` | Digital proposal viewer with e-signature | $39-99/mo |
| Crew Tracker | `tl-crew-tracker.js` | GPS clock in/out for field crews | $29-79/mo |
| CRM | `tl-crm.js` | Deal pipeline management | $49-149/mo |
| Weather | `tl-weather.js` | Weather forecast for job scheduling | $9-19/mo |

---

## Quick Start

### Basic Embed Pattern

```html
<!-- Load shared utilities -->
<script src="https://tlid.io/widgets/tl-shared.js"></script>

<!-- Load specific widget -->
<script 
  src="https://tlid.io/widgets/tl-estimator.js"
  data-site-id="client-123"
  data-primary-color="#2563eb"
></script>
```

### Common Configuration Attributes

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-site-id` | **Required.** Unique client identifier | - |
| `data-primary-color` | Brand accent color (hex) | `#2563eb` |
| `data-position` | Widget position (chat/weather) | `bottom-right` |
| `data-webhook-url` | POST endpoint for events | - |
| `data-api-key` | Authentication for protected endpoints | - |

---

## File Locations

### Widget Scripts (Production Ready)
```
client/public/widgets/
  tl-shared.js       # Shared utilities (5.4KB)
  tl-analytics.js    # Analytics widget (5.4KB)
  tl-estimator.js    # Estimator widget (8.9KB)
  tl-booking.js      # Booking widget (12.1KB)
  tl-reviews.js      # Reviews widget (6.4KB)
  tl-lead-capture.js # Lead capture widget (12.4KB)
  tl-seo.js          # SEO widget (7.4KB)
  tl-chat.js         # Chat widget (9.5KB)
  tl-proposal.js     # Proposal widget (11.6KB)
  tl-crew-tracker.js # Crew tracker widget (11KB)
  tl-crm.js          # CRM widget (14.5KB)
  tl-weather.js      # Weather widget (10.2KB)
```

### API Routes
```
server/widgets/widget-routes.ts  # All widget API endpoints
```

### Documentation
```
docs/snippets/
  CATALOG_INDEX.md               # Master catalog index
  TRUSTLAYER_ANALYTICS_SNIPPET.md
  TRADE_ESTIMATOR_SNIPPET.md
  BOOKING_WIDGET_SNIPPET.md
  REVIEW_WIDGET_SNIPPET.md
  LEAD_CAPTURE_SNIPPET.md
  SEO_MANAGER_SNIPPET.md
  LIVE_CHAT_SNIPPET.md
  PROPOSAL_BUILDER_SNIPPET.md
  CREW_TRACKER_SNIPPET.md
  CRM_PIPELINE_SNIPPET.md
  WEATHER_WIDGET_SNIPPET.md
```

---

## API Reference

### Authentication

Protected endpoints require an API key:

```javascript
fetch('https://tlid.io/api/widgets/leads', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
```

### Status Endpoint

Check widget service health:

```
GET /api/widgets/status
```

Response:
```json
{
  "status": "operational",
  "version": "1.0.0",
  "widgets": ["analytics", "estimator", "booking", "reviews", 
              "lead-capture", "seo", "chat", "proposal", 
              "crew-tracker", "crm", "weather"],
  "timestamp": "2026-01-30T19:41:00.000Z"
}
```

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/widgets/analytics/track` | POST | Record page view |
| `/api/widgets/analytics/summary` | GET | Get analytics stats |
| `/api/widgets/leads/create` | POST | Submit lead |
| `/api/widgets/leads` | GET | List leads |
| `/api/widgets/estimator/calculate` | POST | Get estimate |
| `/api/widgets/booking/create` | POST | Book appointment |
| `/api/widgets/booking/availability` | GET | Get available slots |
| `/api/widgets/seo/report` | POST | Submit SEO report |
| `/api/widgets/chat/message` | POST | Send chat message |
| `/api/widgets/chat/messages` | GET | Get chat history |
| `/api/widgets/proposal/:id` | GET | Get proposal |
| `/api/widgets/proposal/sign` | POST | Submit signature |
| `/api/widgets/crew/clock-in` | POST | Start shift |
| `/api/widgets/crew/clock-out` | POST | End shift |
| `/api/widgets/crm/deals` | POST | Create deal |
| `/api/widgets/crm/deals/:id` | PATCH | Update deal |
| `/api/widgets/reviews` | GET | Get reviews |
| `/api/widgets/weather` | GET | Get weather |
| `/api/widgets/export` | GET | Export all data |

---

## Revenue Summary

| Bundle | Monthly |
|--------|---------|
| Single Widget Avg | $50 |
| Complete Bundle | $299 |
| Potential MRR (100 customers x 11 widgets) | $55,000 |

---

## To Add to DarkWave Catalog

1. Read `docs/snippets/CATALOG_INDEX.md` for detailed overview
2. Copy widget files from `client/public/widgets/`
3. Import widget routes from `server/widgets/widget-routes.ts`
4. Each doc has source file locations to extract code
5. Embed pattern: `<script src="https://tlid.io/widgets/tl-{widget}.js">`

---

## Future Enhancements

1. **Database Integration** - Connect to Drizzle/PostgreSQL for persistence
2. **Real-time Updates** - Add Socket.IO for live chat/crew tracking
3. **Analytics Dashboard** - Build admin view for widget usage stats
4. **Widget Builder** - No-code configuration tool for clients
5. **A/B Testing** - Variant testing for lead capture forms

---

*DarkWave Studios - Building the future of embeddable business tools*
