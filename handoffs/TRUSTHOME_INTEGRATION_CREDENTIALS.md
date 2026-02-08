# TrustHome Integration - Credentials & Connection Details

**Status:** READY TO CONNECT
**Reference:** `TRUSTLAYER_UNIVERSAL_AGENT_CONNECTIVITY_GUIDE.md` (Version 1.0, Feb 2026)

---

## 1. ECOSYSTEM API CREDENTIALS

| Item | Status | Details |
|------|--------|---------|
| `ORBIT_ECOSYSTEM_API_KEY` | CONFIGURED | Already set in environment secrets |
| `ORBIT_ECOSYSTEM_API_SECRET` | CONFIGURED | Already set in environment secrets |
| `DARKWAVE_API_KEY` | CONFIGURED | For blockchain stamping (Solana) |
| `DARKWAVE_API_SECRET` | CONFIGURED | For blockchain stamping (Solana) |
| `ORBIT_FINANCIAL_HUB_SECRET` | CONFIGURED | For financial hub connections |

**How to use them (server-to-server):**
```javascript
const crypto = require('crypto');

function generateAuthHeader(apiKey, apiSecret) {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(`${timestamp}:${apiKey}`)
    .digest('hex');
  return `DW ${apiKey}:${timestamp}:${signature}`;
}

// Every request from TrustHome to PaintPros.io backend:
const headers = {
  'Content-Type': 'application/json',
  'Authorization': generateAuthHeader(
    process.env.ORBIT_ECOSYSTEM_API_KEY,
    process.env.ORBIT_ECOSYSTEM_API_SECRET
  ),
  'X-App-Name': 'TrustHome'
};
```

---

## 2. TENANT ID

**For development/testing:** Use `demo` (the platform-wide test tenant)

**For production TrustHome:** Provision a new tenant by calling:
```
POST /api/tenants/provision
{
  "businessName": "TrustHome Nashville",
  "email": "owner@trusthome.io",
  "tenantSlug": "trusthome-nash",
  "tradeVertical": "painting",
  "brandingModel": "custom",
  "subscriptionTier": "full_suite"
}
```

**Existing tenants available for reference/testing:**
| Tenant ID | Product |
|-----------|---------|
| `demo` | PaintPros.io Platform (safe for testing) |
| `npp` | Nashville Painting Professionals (live data) |
| `lumepaint` | Lume Paint Co / Murfreesboro (live data) |
| `tradeworks` | TradeWorks AI |

---

## 3. BASE API URL

| Environment | URL |
|-------------|-----|
| **Production** | `https://paintpros.io/api/` |
| **Development** | `https://<repl-name>.replit.dev/api/` |
| **Socket.IO** | `wss://paintpros.io` (path: `/socket.io`) |

All endpoints accept and return JSON. Include `Content-Type: application/json` on every request.

---

## 4. DEFAULT ADMIN PINs (Development)

These are the default PINs initialized when a tenant is set up. They should be changed on first use in production.

| Role | PIN | User | Notes |
|------|-----|------|-------|
| Owner | `1111` | Ryan | Must change on first use |
| Ops Manager | `4444` | Sidonie | Must change on first use |
| Project Manager | `5555` | Hank | Must change on first use |
| Project Manager | `6666` | Garrett | Must change on first use |
| Developer | `0424` | Jason | No change required |
| Crew Lead | `3333` | Crew Lead | Must change on first use |
| Marketing | `8888` | Marketing | Must change on first use |
| Demo Viewer | `7777` | Demo | No change required |

**To initialize PINs for a new TrustHome tenant:**
```
POST /api/auth/pin/init
{ "tenantId": "trusthome-nash" }
```

**To verify a PIN:**
```
POST /api/auth/pin/verify
{
  "pin": "1111",
  "role": "owner",
  "tenantId": "trusthome-nash"
}
```

---

## 5. SERVICES TO CONNECT

Here's the full list of backend services TrustHome can wire into, with the key endpoint for each:

| Service | Test Endpoint | Method |
|---------|--------------|--------|
| CRM / Leads | `/api/leads?tenantId=demo` | GET |
| Calendar | `/api/calendar/events?tenantId=demo` | GET |
| Bookings | `/api/bookings?tenantId=demo` | GET |
| Jobs | `/api/jobs?tenantId=demo` | GET |
| Crew | `/api/crew-leads?tenantId=demo` | GET |
| Marketing Images | `/api/marketing/images/demo` | GET |
| Marketing Posts | `/api/marketing/posts/demo` | GET |
| Blog | `/api/blog/posts?tenantId=demo` | GET |
| Analytics | `/api/analytics/dashboard?tenantId=demo` | GET |
| Payments | `/api/payments?tenantId=demo` | GET |
| Warranties | `/api/warranties?tenantId=demo` | GET |
| Referrals | `/api/referrals?tenantId=demo` | GET |
| Financing | `/api/financing/plans?tenantId=demo` | GET |
| Portfolio | `/api/portfolio?tenantId=demo` | GET |
| SEO | `/api/seo-tags?tenantId=demo` | GET |
| Credits | `/api/credits/demo` | GET |
| Webhooks | `/api/webhooks?tenantId=demo` | GET |
| Blockchain | `/api/blockchain/stamps` | GET |
| Stripe Status | `/api/stripe/status` | GET |
| Online Users | `/api/messages/online-users` | GET |

---

## 6. QUICK SMOKE TEST

Run these three calls to confirm the connection is working:

**Test 1 - Basic connectivity:**
```bash
curl -s https://paintpros.io/api/analytics/live?tenantId=demo
```

**Test 2 - Authenticated call (PIN):**
```bash
curl -s -X POST https://paintpros.io/api/auth/pin/verify \
  -H "Content-Type: application/json" \
  -d '{"pin":"7777","role":"demo_viewer","tenantId":"demo"}'
```

**Test 3 - Data retrieval:**
```bash
curl -s https://paintpros.io/api/leads?tenantId=demo
```

If all three return valid JSON, the connection is live and ready.

---

## 7. WEBHOOK SETUP (for real-time event notifications)

Once connected, subscribe to events so TrustHome gets notified automatically:

```json
POST /api/webhooks
{
  "tenantId": "trusthome-nash",
  "url": "https://trusthome.io/api/webhook-receiver",
  "events": [
    "lead.created",
    "lead.updated",
    "job.created",
    "job.updated",
    "payment.received",
    "booking.confirmed",
    "booking.cancelled"
  ]
}
```

---

## 8. SOCKET.IO SETUP (for real-time messaging)

```javascript
import { io } from 'socket.io-client';

const socket = io('https://paintpros.io', {
  path: '/socket.io'
});

socket.on('connect', () => {
  console.log('TrustHome connected to PaintPros.io messaging');
  
  socket.emit('user-online', {
    userId: 'trusthome-agent',
    role: 'admin',
    displayName: 'TrustHome'
  });
});

socket.on('new-message', (message) => {
  console.log('Received:', message);
});
```

---

## NEXT STEPS

1. Hand this document to the TrustHome agent
2. Agent reads `TRUSTLAYER_UNIVERSAL_AGENT_CONNECTIVITY_GUIDE.md` for full API catalog
3. Agent runs the smoke tests above to confirm connectivity
4. Agent provisions a dedicated tenant (`trusthome-nash`)
5. Agent initializes PINs for the new tenant
6. Agent starts building UI and wiring in services
7. Agent subscribes to webhooks for real-time updates

---

**Files in handoff folder:**
- `TRUSTLAYER_UNIVERSAL_AGENT_CONNECTIVITY_GUIDE.md` - Full API catalog (26 services)
- `TRUSTHOME_FULL_BUSINESS_SUITE_HANDOFF.md` - Detailed data models and UI layouts
- `TRUSTHOME_INTEGRATION_CREDENTIALS.md` - This document (credentials + connection details)
- `GARAGEBOT_MARKETING_HUB_HANDOFF.md` - GarageBot-specific marketing setup
- `garagebot-marketing-hub.tsx` - Marketing Hub frontend reference (8,333 lines)
