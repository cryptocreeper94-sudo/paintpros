# Crew Tracker - Embeddable Snippet

**Product:** TrustLayer Crews  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $29-$79/month  

---

## Overview

Field service time tracking with GPS, job notes, incident reporting, and Before/After photos.

---

## Quick Start

```html
<!-- For crew members (mobile) -->
<script src="https://tlid.io/widgets/tl-crews.js" 
        data-site-id="YOUR_SITE_ID"
        data-mode="field"></script>
```

```html
<!-- For managers (dashboard) -->
<script src="https://tlid.io/widgets/tl-crews.js" 
        data-site-id="YOUR_SITE_ID"
        data-mode="dashboard"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Clock In/Out** | One-tap time tracking |
| **GPS Location** | Track crew location in real-time |
| **Job Assignment** | Assign jobs to crews |
| **Job Notes** | Add notes per job |
| **Photo Upload** | Before/After photos |
| **Incident Reports** | Log issues/accidents |
| **Break Tracking** | Paid/unpaid break logging |
| **Overtime Alerts** | Notify when approaching OT |
| **Payroll Export** | Export to payroll systems |
| **Geofencing** | Auto clock-in at job site |

---

## Configuration Options

```javascript
TLCrews.init({
  siteId: 'YOUR_SITE_ID',
  mode: 'field', // or 'dashboard'
  theme: 'dark',
  features: {
    gps: true,
    photos: true,
    incidents: true,
    breaks: true,
    geofencing: true
  },
  overtime: {
    dailyLimit: 8,
    weeklyLimit: 40,
    alertAt: 7.5 // Alert at 7.5 hours
  },
  breaks: {
    paidBreak: 15, // minutes
    unpaidBreak: 30 // minutes
  },
  geofencing: {
    radius: 100 // meters
  },
  onClockIn: function(data) {
    console.log('Clocked in:', data);
  },
  onClockOut: function(data) {
    console.log('Clocked out:', data);
  }
});
```

---

## Dashboard API

```
GET https://tlid.io/api/crews/status?siteId=YOUR_SITE_ID

{
  "activeCrews": 5,
  "totalToday": 8,
  "crews": [
    {
      "id": "crew_123",
      "name": "Mike's Crew",
      "status": "working",
      "clockedIn": "2026-01-30T08:00:00Z",
      "currentJob": "123 Main St",
      "location": { "lat": 36.16, "lng": -86.78 }
    }
  ]
}
```

---

## Payroll Export

```
GET https://tlid.io/api/crews/payroll?siteId=YOUR_SITE_ID&start=2026-01-01&end=2026-01-15

{
  "period": { "start": "2026-01-01", "end": "2026-01-15" },
  "entries": [
    {
      "crewId": "crew_123",
      "name": "John Doe",
      "regularHours": 72,
      "overtimeHours": 8,
      "jobs": 12
    }
  ]
}
```

---

## Pricing Tiers

| Tier | Price | Crew Members | Features |
|------|-------|--------------|----------|
| Starter | $29/mo | 5 | Time tracking, notes |
| Growth | $49/mo | 15 | + GPS, photos, incidents |
| Business | $79/mo | Unlimited | + White-label, payroll export |

---

## White-Label Package

$199 setup + $79/mo minimum
- Your branding
- Custom mobile app icon
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/pages/crew-lead.tsx`  
`server/routes.ts` - crew management endpoints

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- GPS tracking
- Photo upload
- Incident reports
