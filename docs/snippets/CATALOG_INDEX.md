# TrustLayer Widget Catalog

**For:** DarkWave Studios / TrustLayer Hub  
**Last Updated:** January 2026  
**Total Products:** 11 White-Label Ready Widgets

---

## Quick Reference

| # | Product | Monthly Price | White-Label | Status |
|---|---------|---------------|-------------|--------|
| 1 | TrustLayer Analytics | $9-199 | $99/mo min | Ready |
| 2 | Trade Estimator | $49-149 | $149/mo min | Ready |
| 3 | Booking Widget | $29-79 | $79/mo min | Ready |
| 4 | Review Widget | $9-29 | $29/mo min | Ready |
| 5 | Lead Capture | $19-49 | $49/mo min | Ready |
| 6 | SEO Manager | $19-49 | $49/mo min | Ready |
| 7 | Live Chat | $29-99 | $99/mo min | Ready |
| 8 | Proposal Builder | $39-99 | $99/mo min | Ready |
| 9 | Crew Tracker | $29-79 | $79/mo min | Ready |
| 10 | CRM Pipeline | $49-149 | $149/mo min | Ready |
| 11 | Weather Widget | $9-19 | $19/mo min | Ready |
| 12 | Live Translator | $0.50/min | 20% markup | Ready |

---

## Category Breakdown

### Analytics & Insights
- **TrustLayer Analytics** - Website traffic, SEO scoring
- **SEO Manager** - Meta tags, structured data

### Lead Generation
- **Lead Capture** - Multi-step forms
- **Trade Estimator** - Interactive pricing calculator
- **Booking Widget** - Appointment scheduling

### Sales & CRM
- **CRM Pipeline** - Deal management
- **Proposal Builder** - Quotes with e-signature

### Operations
- **Crew Tracker** - Time tracking, GPS
- **Live Chat** - Customer messaging
- **Live Translator** - Speech-to-speech translation

### Marketing
- **Review Widget** - Testimonial display
- **Weather Widget** - Outdoor service planning

---

## Documentation Files

```
docs/snippets/
├── CATALOG_INDEX.md          # This file
├── TRUSTLAYER_ANALYTICS_SNIPPET.md
├── TRADE_ESTIMATOR_SNIPPET.md
├── BOOKING_WIDGET_SNIPPET.md
├── REVIEW_WIDGET_SNIPPET.md
├── LEAD_CAPTURE_SNIPPET.md
├── SEO_MANAGER_SNIPPET.md
├── LIVE_CHAT_SNIPPET.md
├── PROPOSAL_BUILDER_SNIPPET.md
├── CREW_TRACKER_SNIPPET.md
├── CRM_PIPELINE_SNIPPET.md
├── WEATHER_WIDGET_SNIPPET.md
└── LIVE_TRANSLATOR_SNIPPET.md
```

---

## Embed Pattern

All widgets follow the same embed pattern:

```html
<div id="tl-{widget}"></div>
<script src="https://tlid.io/widgets/tl-{widget}.js" 
        data-site-id="YOUR_SITE_ID"
        data-theme="dark"></script>
```

---

## API Pattern

All widgets have REST APIs:

```
Base URL: https://tlid.io/api/{widget}

Authentication: Bearer token
Header: Authorization: Bearer YOUR_API_KEY

Common endpoints:
GET  /api/{widget}/status
POST /api/{widget}/create
GET  /api/{widget}/{id}
PATCH /api/{widget}/{id}
DELETE /api/{widget}/{id}
```

---

## Webhook Pattern

All widgets support webhooks:

```json
{
  "event": "{widget}.{action}",
  "siteId": "YOUR_SITE_ID",
  "timestamp": "2026-01-30T12:00:00Z",
  "data": { ... }
}
```

---

## White-Label Tiers

### Standard (Included)
- TrustLayer branding
- Hosted on tlid.io
- Standard support

### White-Label ($setup + monthly)
- Your branding/colors
- Optional custom domain
- Remove "Powered by TrustLayer"
- Priority support

### Reseller (Contact sales)
- Volume discounts
- Reseller dashboard
- Sub-accounts for clients
- API for automation

---

## Bundle Pricing

| Bundle | Includes | Standalone | Bundle Price | Savings |
|--------|----------|------------|--------------|---------|
| **Starter** | Analytics + Lead Capture | $28/mo | $19/mo | 32% |
| **Growth** | Estimator + Booking + CRM | $177/mo | $129/mo | 27% |
| **Complete** | All 11 widgets | $500+/mo | $299/mo | 40%+ |

---

## Integration Points

All widgets integrate with:
- **TrustLayer Marketing** - Track campaign leads
- **Guardian Shield** - Verified business badges
- **TradeWorks AI** - Field tool connection
- **DWTL.io** - Blockchain verification

---

## Source Locations

| Widget | Primary Source |
|--------|----------------|
| Analytics | `client/src/components/unified-analytics-dashboard.tsx` |
| Estimator | `client/src/pages/estimate.tsx` |
| Booking | `client/src/pages/book.tsx` |
| Reviews | `client/src/pages/reviews.tsx` |
| Lead Capture | `client/src/components/lead-generation/` |
| SEO | `client/src/components/seo/` |
| Chat | `client/src/components/messaging-widget.tsx` |
| Proposals | `client/src/pages/proposal.tsx` |
| Crews | `client/src/pages/crew-lead.tsx` |
| CRM | `client/src/components/crm/` |
| Weather | `client/src/components/weather-*.tsx` |
| Translator | `client/src/components/live-translator.tsx` |

---

## Revenue Potential

At 100 customers per widget (average $50/mo):

| Metric | Value |
|--------|-------|
| Widgets | 11 |
| Avg Price | $50/mo |
| Customers/Widget | 100 |
| **Monthly Revenue** | **$55,000** |
| **Annual Revenue** | **$660,000** |

---

## Next Steps

1. Create actual widget JS files in `client/public/widgets/`
2. Build widget configuration dashboard
3. Set up Stripe billing per widget
4. Create reseller portal
5. Launch marketing site for each widget

---

*This catalog is maintained by DarkWave Studios for the TrustLayer Hub.*
