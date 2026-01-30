# Review Widget - Embeddable Snippet

**Product:** TrustLayer Reviews  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $9-$29/month  

---

## Overview

Embeddable testimonial/review display widget. Pulls from Google, Facebook, or your own review database.

---

## Quick Start

```html
<div id="tl-reviews"></div>
<script src="https://tlid.io/widgets/tl-reviews.js" 
        data-site-id="YOUR_SITE_ID"
        data-layout="carousel"></script>
```

---

## Layout Options

| Layout | Description |
|--------|-------------|
| `carousel` | Rotating testimonials |
| `grid` | 3-column grid display |
| `list` | Vertical list |
| `featured` | Single featured review |
| `wall` | Masonry-style wall |

---

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Source** | Google, Facebook, manual entry |
| **Star Ratings** | Visual 5-star display |
| **Photo Reviews** | Customer photos with reviews |
| **Auto-Rotation** | Carousel auto-scrolls |
| **Verified Badge** | Shows verified customer badge |
| **Response Display** | Show owner responses |
| **Filter by Rating** | Show only 4-5 star reviews |
| **Responsive** | Works on all screen sizes |

---

## Configuration Options

```javascript
TLReviews.init({
  siteId: 'YOUR_SITE_ID',
  layout: 'carousel',
  theme: 'dark',
  sources: ['google', 'facebook', 'manual'],
  minRating: 4, // Only show 4+ stars
  maxReviews: 10,
  showPhotos: true,
  showResponses: true,
  autoRotate: true,
  rotateSpeed: 5000, // 5 seconds
  onReviewClick: function(review) {
    console.log('Clicked:', review);
  }
});
```

---

## Manual Review Entry

Add reviews via API:

```
POST https://tlid.io/api/reviews
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "siteId": "YOUR_SITE_ID",
  "customer": "John D.",
  "rating": 5,
  "text": "Excellent service! Highly recommend.",
  "date": "2026-01-15",
  "photo": "https://..."
}
```

---

## Pricing Tiers

| Tier | Price | Reviews | Features |
|------|-------|---------|----------|
| Starter | $9/mo | 20 | Manual entry, basic layouts |
| Growth | $19/mo | 100 | + Google/FB sync, all layouts |
| Business | $29/mo | Unlimited | + White-label, API |

---

## White-Label Package

$99 setup + $29/mo minimum
- Your branding/colors
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/pages/reviews.tsx`  
`client/src/components/testimonial-*.tsx`

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- 5 layout options
- Multi-source support
- Auto-rotation
