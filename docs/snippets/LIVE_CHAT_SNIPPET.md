# Live Chat Widget - Embeddable Snippet

**Product:** TrustLayer Chat  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $29-$99/month  

---

## Overview

Real-time messaging widget with Socket.IO, speech-to-text, role-based badges, and team routing.

---

## Quick Start

```html
<script src="https://tlid.io/widgets/tl-chat.js" 
        data-site-id="YOUR_SITE_ID"
        data-position="bottom-right"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Real-time Messaging** | Instant delivery via WebSocket |
| **Speech-to-Text** | Voice input option |
| **File Sharing** | Send images/documents |
| **Typing Indicators** | See when others are typing |
| **Read Receipts** | Know when messages are read |
| **Team Routing** | Route to departments |
| **Canned Responses** | Quick reply templates |
| **Offline Messages** | Collect messages when offline |
| **Chat History** | Persistent conversation history |
| **Role Badges** | Admin, Support, etc. |

---

## Configuration Options

```javascript
TLChat.init({
  siteId: 'YOUR_SITE_ID',
  position: 'bottom-right', // or 'bottom-left'
  theme: 'dark',
  greeting: 'Hi! How can we help you today?',
  offlineMessage: 'We\'re offline. Leave a message!',
  departments: [
    { id: 'sales', name: 'Sales' },
    { id: 'support', name: 'Support' },
    { id: 'billing', name: 'Billing' }
  ],
  features: {
    speechToText: true,
    fileUpload: true,
    typingIndicator: true,
    readReceipts: true
  },
  businessHours: {
    timezone: 'America/Chicago',
    hours: {
      mon: { start: '08:00', end: '18:00' },
      tue: { start: '08:00', end: '18:00' },
      // ...
    }
  },
  onNewMessage: function(message) {
    console.log('New message:', message);
  }
});
```

---

## Agent Dashboard

Agents access the dashboard at:
`https://tlid.io/chat/dashboard?siteId=YOUR_SITE_ID`

Features:
- All active conversations
- Customer info sidebar
- Canned response library
- Transfer between agents
- Chat history search

---

## Webhook Integration

```
POST https://your-site.com/webhook/chat
Content-Type: application/json

{
  "event": "new_message",
  "chatId": "ch_abc123",
  "siteId": "YOUR_SITE_ID",
  "message": {
    "from": "visitor",
    "text": "I need help with my order",
    "timestamp": "2026-01-30T12:00:00Z"
  },
  "visitor": {
    "name": "Anonymous",
    "email": null,
    "page": "/products"
  }
}
```

---

## Pricing Tiers

| Tier | Price | Chats/mo | Agents | Features |
|------|-------|----------|--------|----------|
| Starter | $29/mo | 100 | 1 | Basic chat |
| Growth | $49/mo | 500 | 3 | + File upload, departments |
| Business | $99/mo | Unlimited | 10 | + White-label, API |

---

## White-Label Package

$249 setup + $99/mo minimum
- Your branding/colors
- Custom chat icon
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/components/messaging-widget.tsx`  
`server/routes.ts` - Socket.IO endpoints

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Real-time WebSocket
- Speech-to-text
- Department routing
