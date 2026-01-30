# DARKWAVE STUDIOS WIDGET CATALOG - AGENT HANDOFF

**Source Repository:** PaintPros.io / TrustLayer Marketing (tlid.io)
**Date:** January 30, 2026
**Status:** Production Ready - 11 Widgets Complete

---

## WIDGET FILES TO COPY

Location: `client/public/widgets/`

```
tl-shared.js        (5.4KB)  - Required shared utilities
tl-analytics.js     (5.4KB)  - Page view tracking
tl-estimator.js     (8.9KB)  - Cost calculator
tl-booking.js       (12.1KB) - Appointment scheduling
tl-reviews.js       (6.4KB)  - Review carousel
tl-lead-capture.js  (12.4KB) - Contact forms
tl-seo.js           (7.4KB)  - SEO health checker
tl-chat.js          (9.5KB)  - Live chat widget
tl-proposal.js      (11.6KB) - E-signature proposals
tl-crew-tracker.js  (11KB)   - GPS time tracking
tl-crm.js           (14.5KB) - Deal pipeline
tl-weather.js       (10.2KB) - Weather forecasts
```

---

## API BACKEND TO COPY

Location: `server/widgets/widget-routes.ts`

This single file contains all widget API endpoints. Import and mount at `/api/widgets`:

```typescript
import widgetRoutes from "./widgets/widget-routes";
app.use("/api/widgets", widgetRoutes);
```

---

## API ENDPOINTS

```
GET  /api/widgets/status                    - Health check
POST /api/widgets/analytics/track           - Record page view
GET  /api/widgets/analytics/summary         - Get stats
POST /api/widgets/leads/create              - Submit lead
GET  /api/widgets/leads                     - List leads
POST /api/widgets/estimator/calculate       - Get estimate
POST /api/widgets/booking/create            - Book appointment
GET  /api/widgets/booking/availability      - Get time slots
POST /api/widgets/seo/report                - Submit SEO scan
GET  /api/widgets/seo/reports               - Get reports
POST /api/widgets/chat/message              - Send message
GET  /api/widgets/chat/messages             - Get history
GET  /api/widgets/proposal/:id              - Get proposal
POST /api/widgets/proposal/sign             - Submit signature
POST /api/widgets/crew/clock-in             - Start shift
POST /api/widgets/crew/clock-out            - End shift
GET  /api/widgets/crew/shifts               - Get shifts
POST /api/widgets/crm/deals                 - Create deal
PATCH /api/widgets/crm/deals/:id            - Update deal
GET  /api/widgets/crm/deals                 - List deals
GET  /api/widgets/reviews                   - Get reviews
GET  /api/widgets/weather                   - Get forecast
GET  /api/widgets/export                    - Export all data
```

---

## EMBED PATTERN (FOR END CLIENTS)

```html
<script src="https://tlid.io/widgets/tl-shared.js"></script>
<script 
  src="https://tlid.io/widgets/tl-estimator.js"
  data-site-id="CLIENT_ID"
  data-primary-color="#2563eb"
></script>
```

---

## CONFIGURATION ATTRIBUTES

| Attribute | Type | Description |
|-----------|------|-------------|
| data-site-id | string | Required. Client identifier |
| data-primary-color | hex | Brand color (#2563eb) |
| data-position | string | bottom-right, bottom-left |
| data-webhook-url | url | POST endpoint for events |
| data-api-key | string | Auth for protected endpoints |

---

## PRICING TIERS

| Widget | Starter | Growth | Business |
|--------|---------|--------|----------|
| Analytics | $9 | $49 | $199 |
| Estimator | $49 | $99 | $149 |
| Booking | $29 | $49 | $79 |
| Reviews | $9 | $19 | $29 |
| Lead Capture | $19 | $29 | $49 |
| SEO | $19 | $29 | $49 |
| Chat | $29 | $59 | $99 |
| Proposal | $39 | $69 | $99 |
| Crew Tracker | $29 | $49 | $79 |
| CRM | $49 | $99 | $149 |
| Weather | $9 | $14 | $19 |
| **Bundle** | - | - | **$299** |

---

## STORAGE

Current implementation uses in-memory storage. To persist data, connect these API endpoints to your database by replacing the `widgetData` object in `widget-routes.ts` with database queries.

---

## TESTING

Verify API is running:
```bash
curl https://tlid.io/api/widgets/status
```

Expected response:
```json
{"status":"operational","version":"1.0.0","widgets":["analytics","estimator","booking","reviews","lead-capture","seo","chat","proposal","crew-tracker","crm","weather"]}
```

---

## DOCUMENTATION INDEX

Additional docs in source repo:
- `docs/snippets/CATALOG_INDEX.md` - Full catalog details
- `docs/snippets/*_SNIPPET.md` - Individual widget specs
- `docs/TRUSTLAYER_BUSINESS_PLAN.md` - Business context

---

END OF HANDOFF
