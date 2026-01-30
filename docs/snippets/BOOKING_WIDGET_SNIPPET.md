# Booking Widget - Embeddable Snippet

**Product:** TrustLayer Booking  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $29-$79/month  

---

## Overview

5-step scheduling wizard for service businesses. Handles service selection, date/time, contact info, and confirmation.

---

## Quick Start

```html
<div id="tl-booking"></div>
<script src="https://tlid.io/widgets/tl-booking.js" 
        data-site-id="YOUR_SITE_ID"
        data-theme="light"></script>
```

---

## The 5 Steps

1. **Service Type** - What service do they need?
2. **Date Selection** - Calendar with availability
3. **Time Slot** - Available times for selected date
4. **Contact Info** - Name, email, phone, address
5. **Confirmation** - Summary and booking confirmation

---

## Features

| Feature | Description |
|---------|-------------|
| **Calendar View** | Visual date picker with availability |
| **Time Slots** | Configurable appointment windows |
| **Service Duration** | Auto-blocks appropriate time |
| **Email Confirmations** | Automatic booking emails |
| **SMS Reminders** | Optional text reminders |
| **Google Calendar Sync** | Two-way calendar integration |
| **Cancellation/Reschedule** | Customer self-service |
| **Buffer Time** | Configurable gaps between appointments |

---

## Configuration Options

```javascript
TLBooking.init({
  siteId: 'YOUR_SITE_ID',
  theme: 'dark',
  services: [
    { id: 'estimate', name: 'Free Estimate', duration: 30 },
    { id: 'consultation', name: 'Consultation', duration: 60 },
    { id: 'service', name: 'Service Call', duration: 120 }
  ],
  availability: {
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '08:00',
    endTime: '18:00',
    bufferMinutes: 15
  },
  notifications: {
    emailConfirmation: true,
    smsReminder: true,
    reminderHours: 24
  },
  onBookingComplete: function(booking) {
    console.log('Booked:', booking);
  }
});
```

---

## Webhook Integration

```
POST https://your-site.com/webhook/bookings
Content-Type: application/json

{
  "bookingId": "bk_abc123",
  "siteId": "YOUR_SITE_ID",
  "customer": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "615-555-5678",
    "address": "123 Main St, Nashville, TN"
  },
  "booking": {
    "service": "Free Estimate",
    "date": "2026-02-15",
    "time": "10:00",
    "duration": 30
  },
  "timestamp": "2026-01-30T12:00:00Z"
}
```

---

## Pricing Tiers

| Tier | Price | Bookings/mo | Features |
|------|-------|-------------|----------|
| Starter | $29/mo | 50 | Basic booking, email confirm |
| Growth | $49/mo | 200 | + SMS, Google Calendar |
| Business | $79/mo | Unlimited | + White-label, API access |

---

## White-Label Package

$199 setup + $79/mo minimum
- Your branding/colors
- Custom domain
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/pages/book.tsx`  
`server/routes.ts` - booking endpoints

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- 5-step wizard
- Calendar integration
- Email/SMS notifications
