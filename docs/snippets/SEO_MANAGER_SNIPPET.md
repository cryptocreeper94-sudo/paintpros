# SEO Manager - Embeddable Snippet

**Product:** TrustLayer SEO  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $19-$49/month  

---

## Overview

Automated SEO optimization with meta tag management, structured data, and performance scoring.

---

## Quick Start

```html
<script src="https://tlid.io/widgets/tl-seo.js" 
        data-site-id="YOUR_SITE_ID"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Meta Tag Management** | Title, description, keywords |
| **Open Graph Tags** | Facebook/social sharing |
| **Twitter Cards** | Twitter-specific meta |
| **Structured Data** | JSON-LD schema markup |
| **SEO Scoring** | Real-time page scoring |
| **Recommendations** | Actionable improvement tips |
| **Sitemap Generation** | Auto-generate XML sitemap |
| **Robots.txt** | Manage crawl directives |

---

## SEO Score Breakdown

| Component | Weight | What's Measured |
|-----------|--------|-----------------|
| Title Score | 20% | Length, keywords, uniqueness |
| Meta Score | 20% | Description quality |
| Keyword Score | 20% | Keyword usage, density |
| Structured Data | 20% | Schema markup presence |
| Social Score | 20% | OG/Twitter tags |

---

## Configuration Options

```javascript
TLSEO.init({
  siteId: 'YOUR_SITE_ID',
  autoInject: true, // Auto-inject meta tags
  pages: {
    '/': {
      title: 'Home | Your Business',
      description: 'Your homepage description...',
      keywords: ['keyword1', 'keyword2'],
      schema: {
        type: 'LocalBusiness',
        name: 'Your Business',
        address: '123 Main St'
      }
    },
    '/services': {
      title: 'Services | Your Business',
      description: 'Our services...'
    }
  },
  defaults: {
    siteName: 'Your Business',
    image: '/og-image.png',
    twitterHandle: '@yourbusiness'
  }
});
```

---

## Dashboard API

```
GET https://tlid.io/api/seo/score?siteId=YOUR_SITE_ID

{
  "overallScore": 85,
  "breakdown": {
    "titleScore": 90,
    "metaScore": 80,
    "keywordScore": 85,
    "structuredDataScore": 80,
    "socialScore": 90
  },
  "issues": [
    "Missing alt text on 3 images",
    "Description too short on /about page"
  ],
  "recommendations": [
    "Add structured data to service pages",
    "Increase keyword density on homepage"
  ]
}
```

---

## Pricing Tiers

| Tier | Price | Pages | Features |
|------|-------|-------|----------|
| Starter | $19/mo | 10 | Basic meta, scoring |
| Growth | $29/mo | 50 | + Structured data, sitemap |
| Business | $49/mo | Unlimited | + White-label, API |

---

## White-Label Package

$149 setup + $49/mo minimum
- Your branding
- Customer dashboard access

---

## Source Location

`client/src/components/seo/SeoManager.tsx`  
`client/src/components/seo/SeoTracker.tsx`

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- 5-component scoring
- Auto meta injection
- Structured data support
