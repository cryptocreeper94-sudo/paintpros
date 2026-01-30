# Lead Capture Form - Embeddable Snippet

**Product:** TrustLayer Leads  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $19-$49/month  

---

## Overview

Multi-step lead capture forms with smart validation, conditional logic, and CRM integration.

---

## Quick Start

```html
<div id="tl-lead-form"></div>
<script src="https://tlid.io/widgets/tl-leads.js" 
        data-site-id="YOUR_SITE_ID"
        data-form="contact"></script>
```

---

## Form Types

| Type | Use Case |
|------|----------|
| `contact` | Basic contact form |
| `quote` | Quote/estimate request |
| `callback` | Request a callback |
| `multi-step` | Multi-step wizard |
| `custom` | Build your own fields |

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Step** | Break long forms into steps |
| **Conditional Logic** | Show/hide fields based on answers |
| **Smart Validation** | Real-time field validation |
| **Phone Formatting** | Auto-format phone numbers |
| **Address Autocomplete** | Google Places integration |
| **File Upload** | Accept photos/documents |
| **Spam Protection** | Honeypot + rate limiting |
| **Thank You Page** | Custom redirect after submit |

---

## Configuration Options

```javascript
TLLeads.init({
  siteId: 'YOUR_SITE_ID',
  formType: 'quote',
  theme: 'dark',
  fields: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'phone', required: true },
    { name: 'service', label: 'Service Needed', type: 'select', options: ['Interior', 'Exterior', 'Both'] },
    { name: 'message', label: 'Details', type: 'textarea' }
  ],
  submitButton: 'Get Free Quote',
  thankYou: {
    type: 'message', // or 'redirect'
    message: 'Thanks! We\'ll call you within 24 hours.',
    redirect: '/thank-you'
  },
  onSubmit: function(lead) {
    console.log('Lead:', lead);
  }
});
```

---

## Webhook Integration

```
POST https://your-site.com/webhook/leads
Content-Type: application/json

{
  "leadId": "ld_abc123",
  "siteId": "YOUR_SITE_ID",
  "formType": "quote",
  "data": {
    "name": "Mike Johnson",
    "email": "mike@example.com",
    "phone": "615-555-9999",
    "service": "Interior",
    "message": "Need quote for 3 bedroom house"
  },
  "source": {
    "page": "/services",
    "referrer": "google.com"
  },
  "timestamp": "2026-01-30T12:00:00Z"
}
```

---

## CRM Integrations

Direct integrations available:
- HubSpot
- Salesforce
- Zoho
- Pipedrive
- Custom webhook

---

## Pricing Tiers

| Tier | Price | Leads/mo | Features |
|------|-------|----------|----------|
| Starter | $19/mo | 100 | Basic forms, email notify |
| Growth | $29/mo | 500 | + CRM integrations, file upload |
| Business | $49/mo | Unlimited | + White-label, API |

---

## White-Label Package

$149 setup + $49/mo minimum
- Your branding/colors
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/components/lead-generation/lead-submission-form.tsx`  
`client/src/components/lead-generation/lead-capture-modal.tsx`

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Multi-step forms
- Conditional logic
- CRM integrations
