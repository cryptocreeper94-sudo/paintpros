# Trade Estimator Engine - Embeddable Snippet

**Product:** TrustLayer Estimator  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $49-$149/month  

---

## Overview

Interactive pricing calculator for service businesses. Currently configured for painting, easily adaptable to any trade vertical.

---

## Quick Start

```html
<div id="tl-estimator"></div>
<script src="https://tlid.io/widgets/tl-estimator.js" 
        data-site-id="YOUR_SITE_ID"
        data-trade="painting"
        data-theme="light"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Room Calculator** | Square footage, room count, surface types |
| **Service Selection** | Interior, exterior, specialty services |
| **Add-ons** | Trim, ceilings, accent walls, etc. |
| **Real-time Pricing** | Instant estimates as user selects options |
| **Lead Capture** | Collects contact info with estimate |
| **Mobile Optimized** | Full responsive design |
| **Custom Pricing** | Configure your own rates |

---

## Supported Trades

| Trade | Config Key |
|-------|------------|
| Painting | `painting` |
| Landscaping | `landscaping` |
| Roofing | `roofing` |
| Plumbing | `plumbing` |
| HVAC | `hvac` |
| Electrical | `electrical` |
| Remodeling | `remodeling` |
| General Contractor | `general` |
| Custom | `custom` |

---

## Configuration Options

```javascript
TLEstimator.init({
  siteId: 'YOUR_SITE_ID',
  trade: 'painting',
  theme: 'dark', // 'light' | 'dark' | 'auto'
  currency: 'USD',
  pricing: {
    baseRate: 3.50, // per sq ft
    minEstimate: 500,
    laborMultiplier: 1.2
  },
  services: [
    { id: 'interior', name: 'Interior Painting', rate: 3.50 },
    { id: 'exterior', name: 'Exterior Painting', rate: 4.00 },
    { id: 'cabinets', name: 'Cabinet Refinishing', rate: 75 }
  ],
  onEstimateComplete: function(estimate) {
    console.log('Estimate:', estimate);
  }
});
```

---

## Webhook Integration

Receive estimates in real-time:

```
POST https://your-site.com/webhook/estimates
Content-Type: application/json

{
  "estimateId": "est_abc123",
  "siteId": "YOUR_SITE_ID",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "615-555-1234"
  },
  "estimate": {
    "total": 2450.00,
    "services": [...],
    "sqft": 1200
  },
  "timestamp": "2026-01-30T12:00:00Z"
}
```

---

## Pricing Tiers

| Tier | Price | Estimates/mo | Features |
|------|-------|--------------|----------|
| Starter | $49/mo | 50 | Basic calculator, email leads |
| Growth | $99/mo | 250 | + Webhook, CRM integration |
| Business | $149/mo | Unlimited | + White-label, custom branding |

---

## White-Label Package

$299 setup + $149/mo minimum
- Your branding/colors
- Custom domain
- Remove "Powered by TrustLayer"
- Reseller pricing available

---

## Source Location

`client/src/pages/estimate.tsx`  
`client/src/pages/estimate-lume.tsx`

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Multi-trade support
- Real-time pricing engine
- Lead capture integration
