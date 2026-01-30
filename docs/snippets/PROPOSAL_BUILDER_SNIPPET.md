# Proposal Builder - Embeddable Snippet

**Product:** TrustLayer Proposals  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $39-$99/month  

---

## Overview

Digital quote/proposal system with e-signature, payment integration, and automated follow-ups.

---

## Quick Start

```html
<script src="https://tlid.io/widgets/tl-proposals.js" 
        data-site-id="YOUR_SITE_ID"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Template Library** | Pre-built proposal templates |
| **Line Items** | Itemized pricing with quantities |
| **E-Signature** | Legally binding digital signatures |
| **Payment Integration** | Deposit collection via Stripe |
| **Expiration Dates** | Auto-expire old proposals |
| **Revision Tracking** | Version history |
| **Email Delivery** | Send via email with tracking |
| **View Tracking** | Know when customer views |
| **Comments** | Customer can ask questions |
| **PDF Export** | Download as PDF |

---

## Configuration Options

```javascript
TLProposals.init({
  siteId: 'YOUR_SITE_ID',
  theme: 'dark',
  company: {
    name: 'Your Company',
    logo: '/logo.png',
    address: '123 Main St',
    phone: '615-555-1234',
    email: 'info@company.com'
  },
  templates: [
    { id: 'standard', name: 'Standard Quote' },
    { id: 'detailed', name: 'Detailed Proposal' }
  ],
  payment: {
    enabled: true,
    stripeKey: 'pk_live_...',
    depositPercent: 25
  },
  signature: {
    required: true,
    legal: 'By signing, you agree to the terms...'
  },
  expiration: {
    days: 30,
    reminder: 7 // Remind 7 days before expiry
  }
});
```

---

## Create Proposal API

```
POST https://tlid.io/api/proposals
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "siteId": "YOUR_SITE_ID",
  "template": "standard",
  "customer": {
    "name": "John Smith",
    "email": "john@example.com",
    "address": "456 Oak Ave"
  },
  "items": [
    { "description": "Interior Painting", "qty": 1, "price": 2500 },
    { "description": "Trim Work", "qty": 1, "price": 500 },
    { "description": "Ceiling Paint", "qty": 1, "price": 300 }
  ],
  "notes": "Includes all materials and labor.",
  "terms": "50% deposit required to schedule."
}
```

---

## Webhook Events

| Event | Triggered When |
|-------|----------------|
| `proposal.sent` | Proposal emailed to customer |
| `proposal.viewed` | Customer opens proposal |
| `proposal.signed` | Customer signs |
| `proposal.paid` | Deposit collected |
| `proposal.expired` | Proposal expires |
| `proposal.declined` | Customer declines |

---

## Pricing Tiers

| Tier | Price | Proposals/mo | Features |
|------|-------|--------------|----------|
| Starter | $39/mo | 25 | Basic templates, e-sign |
| Growth | $69/mo | 100 | + Payments, tracking |
| Business | $99/mo | Unlimited | + White-label, API |

---

## White-Label Package

$299 setup + $99/mo minimum
- Your branding
- Custom domain for proposal links
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/pages/proposal.tsx`  
`client/src/pages/proposal-sign.tsx`

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- E-signature
- Stripe integration
- View tracking
