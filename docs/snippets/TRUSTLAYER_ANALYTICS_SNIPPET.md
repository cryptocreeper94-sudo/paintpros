# TrustLayer Analytics - Embeddable Snippet

**Product:** TrustLayer Analytics  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $9-$199/month  

---

## Quick Start

Add this single line to any website's `<head>` tag:

```html
<script async defer src="https://tlid.io/analytics/tl-analytics.js" data-site-id="YOUR_SITE_ID"></script>
```

That's it. Analytics will start tracking immediately.

---

## Features

| Feature | Description |
|---------|-------------|
| **Pageviews** | Automatic tracking of all page views |
| **Live Visitors** | Real-time visitor count via heartbeat |
| **Session Tracking** | Unique session IDs per visitor |
| **Duration Tracking** | Time spent on each page |
| **Device Detection** | Screen size, language, timezone |
| **Referrer Tracking** | Where visitors came from |
| **SPA Support** | Tracks pushState and hash navigation |
| **Outbound Links** | Tracks clicks to external sites |
| **Custom Events** | JavaScript API for custom tracking |

---

## No Cookies Required

TrustLayer Analytics uses session storage (not cookies) for session tracking. This means:

- GDPR compliant by default
- No cookie consent banner needed
- Privacy-first approach
- No cross-site tracking

---

## JavaScript API

For advanced tracking, use the global `TLAnalytics` object:

### Track Custom Events

```javascript
TLAnalytics.track('button_click', {
  button: 'signup',
  location: 'header'
});
```

### Identify Users

```javascript
TLAnalytics.identify('user_123', {
  plan: 'premium',
  company: 'Acme Inc'
});
```

---

## Data Collected

| Field | Description | Example |
|-------|-------------|---------|
| `siteId` | Your unique site identifier | `tl_abc123` |
| `sessionId` | Unique session ID | `tl_x9k2m_abc` |
| `page` | Current page path | `/pricing` |
| `referrer` | Traffic source | `google.com` |
| `screenWidth` | Screen width in pixels | `1920` |
| `screenHeight` | Screen height in pixels | `1080` |
| `language` | Browser language | `en-US` |
| `timezone` | Visitor timezone | `America/Chicago` |

---

## Event Types

| Event | Triggered When |
|-------|----------------|
| `pageview` | Page loads |
| `pagehide` | Tab hidden or page unload |
| `pageshow` | Tab becomes visible again |
| `unload` | Page is closing |
| `heartbeat` | Every 30 seconds (for live count) |
| `navigation` | SPA route change |
| `outbound_click` | Click on external link |
| `custom` | Via `TLAnalytics.track()` |
| `identify` | Via `TLAnalytics.identify()` |

---

## Dashboard Access

View analytics at: `https://tlid.io/analytics/dashboard?siteId=YOUR_SITE_ID`

Or use the API:

```
GET https://tlid.io/api/analytics/dashboard?siteId=YOUR_SITE_ID
Authorization: Bearer YOUR_API_KEY
```

---

## White-Label Options

For resellers and agencies:

| Package | Price | Includes |
|---------|-------|----------|
| **Standard** | $9-199/mo | TrustLayer branding |
| **White-Label** | $499 setup + $99/mo min | Your branding, your domain |

White-label includes:
- Custom colors and logo
- Dashboard on your domain
- Reseller pricing for your clients
- API access for custom integrations

---

## Integration with TrustLayer Ecosystem

TrustLayer Analytics integrates seamlessly with:

- **TrustLayer Marketing** - Track campaign performance
- **Guardian Shield** - Verified badge click tracking
- **TradeWorks AI** - Field tool usage analytics

---

## Support

- Documentation: https://tlid.io/docs/analytics
- API Reference: https://tlid.io/api/docs
- Support: support@tlid.io

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Pageview tracking
- Live visitor heartbeat
- SPA navigation support
- Custom event API
- Outbound link tracking
