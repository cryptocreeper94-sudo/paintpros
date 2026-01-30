# CRM Pipeline - Embeddable Snippet

**Product:** TrustLayer CRM  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $49-$149/month  

---

## Overview

Visual deal pipeline with lead management, activity tracking, and sales automation.

---

## Quick Start

```html
<div id="tl-crm"></div>
<script src="https://tlid.io/widgets/tl-crm.js" 
        data-site-id="YOUR_SITE_ID"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Kanban Pipeline** | Drag-and-drop deal stages |
| **Lead Scoring** | AI-powered lead scoring |
| **Activity Timeline** | Full interaction history |
| **Task Management** | Follow-up reminders |
| **Email Integration** | Log emails automatically |
| **Call Logging** | Track phone calls |
| **Deal Values** | Track revenue potential |
| **Win/Loss Analysis** | Conversion analytics |
| **Import/Export** | CSV import, export to Excel |
| **Custom Fields** | Add your own data fields |

---

## Pipeline Stages (Default)

1. **New Lead** - Just came in
2. **Contacted** - Initial outreach made
3. **Qualified** - Good fit confirmed
4. **Proposal Sent** - Quote delivered
5. **Negotiation** - Working on terms
6. **Won** - Deal closed
7. **Lost** - Deal lost

---

## Configuration Options

```javascript
TLCRM.init({
  siteId: 'YOUR_SITE_ID',
  theme: 'dark',
  stages: [
    { id: 'new', name: 'New Lead', color: '#3b82f6' },
    { id: 'contacted', name: 'Contacted', color: '#8b5cf6' },
    { id: 'qualified', name: 'Qualified', color: '#f59e0b' },
    { id: 'proposal', name: 'Proposal', color: '#10b981' },
    { id: 'won', name: 'Won', color: '#22c55e' },
    { id: 'lost', name: 'Lost', color: '#ef4444' }
  ],
  leadScoring: {
    enabled: true,
    factors: [
      { field: 'budget', weight: 30 },
      { field: 'timeline', weight: 25 },
      { field: 'authority', weight: 25 },
      { field: 'need', weight: 20 }
    ]
  },
  customFields: [
    { name: 'source', label: 'Lead Source', type: 'select', options: ['Google', 'Facebook', 'Referral'] },
    { name: 'projectType', label: 'Project Type', type: 'text' }
  ],
  onDealMove: function(deal, fromStage, toStage) {
    console.log('Deal moved:', deal, fromStage, '->', toStage);
  }
});
```

---

## API Endpoints

```
# Create Lead
POST https://tlid.io/api/crm/leads
{
  "siteId": "YOUR_SITE_ID",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "615-555-1234",
  "source": "Google",
  "value": 5000
}

# Move Deal
PATCH https://tlid.io/api/crm/deals/{dealId}
{
  "stage": "proposal"
}

# Get Pipeline
GET https://tlid.io/api/crm/pipeline?siteId=YOUR_SITE_ID
```

---

## Integrations

Direct integrations:
- Google Calendar
- Gmail / Outlook
- Stripe (for won deals)
- Zapier (for everything else)

---

## Pricing Tiers

| Tier | Price | Leads/mo | Users | Features |
|------|-------|----------|-------|----------|
| Starter | $49/mo | 100 | 2 | Basic pipeline |
| Growth | $99/mo | 500 | 5 | + Lead scoring, email |
| Business | $149/mo | Unlimited | 15 | + White-label, API |

---

## White-Label Package

$399 setup + $149/mo minimum
- Your branding
- Custom domain
- Reseller pricing

---

## Source Location

`client/src/components/crm/deals-pipeline.tsx`  
`client/src/components/crm/activity-timeline.tsx`

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Kanban pipeline
- Lead scoring
- Activity tracking
