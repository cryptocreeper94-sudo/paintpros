# Meta Business Suite Integration Guide

## For: PaintPros.io / Lume Paint Co / NPP
## Date: January 24, 2026

---

## Overview

Meta Business Suite allows scheduling and publishing posts to Facebook and Instagram from your Marketing Hub. This requires setting up a Facebook App and connecting your business accounts.

---

## Prerequisites (Owner Must Complete)

### 1. Meta Business Portfolio (formerly Business Manager)
- Go to: https://business.facebook.com
- Create a Business Portfolio for each brand (Lume, NPP)
- Complete Business Verification (required for API access)

### 2. Facebook Pages
- Create/claim Facebook Page for Lume Paint Co
- Create/claim Facebook Page for NPP

### 3. Instagram Business Accounts
- Convert personal Instagram to Business Account (free)
- Link each Instagram to its corresponding Facebook Page

### 4. Facebook Developer Account
- Go to: https://developers.facebook.com
- Create developer account using business Facebook login

---

## App Setup Steps

### Step 1: Create Facebook App
1. Go to https://developers.facebook.com/apps/
2. Click "Create App"
3. Choose "Business" type
4. Name it: "PaintPros Marketing Hub"
5. Select your Business Portfolio

### Step 2: Add Products
In your app dashboard, add these products:
- **Instagram Basic Display** (for reading)
- **Instagram Graph API** (for publishing)
- **Facebook Login for Business**
- **Marketing API** (optional, for ads)

### Step 3: Configure Permissions
Request these permissions:
```
instagram_basic
instagram_content_publish
instagram_manage_comments
instagram_manage_insights
pages_show_list
pages_read_engagement
pages_manage_posts
pages_manage_metadata
business_management
```

### Step 4: Generate Tokens
1. Create a System User in Business Manager
2. Generate long-lived access token
3. Token lasts 60 days (set up refresh)

---

## Environment Variables Needed

```
META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_ACCESS_TOKEN=long-lived-system-user-token
META_PAGE_ID_LUME=lume-facebook-page-id
META_PAGE_ID_NPP=npp-facebook-page-id
META_IG_USER_ID_LUME=lume-instagram-user-id
META_IG_USER_ID_NPP=npp-instagram-user-id
```

---

## API Endpoints We'll Use

### Publish to Instagram
```
POST https://graph.facebook.com/v18.0/{ig-user-id}/media
{
  "image_url": "https://...",
  "caption": "Your post caption #hashtags",
  "access_token": "..."
}

POST https://graph.facebook.com/v18.0/{ig-user-id}/media_publish
{
  "creation_id": "{container-id-from-above}",
  "access_token": "..."
}
```

### Publish to Facebook Page
```
POST https://graph.facebook.com/v18.0/{page-id}/photos
{
  "url": "https://...",
  "message": "Your post content",
  "access_token": "..."
}
```

### Get Insights
```
GET https://graph.facebook.com/v18.0/{ig-user-id}/insights
?metric=impressions,reach,engagement
&period=day
&access_token=...
```

---

## Implementation in Marketing Hub

Once credentials are configured, we add:

1. **Connect Accounts Panel** - Shows connected FB/IG accounts per tenant
2. **One-Click Publish** - Publish approved posts directly to platforms
3. **Schedule Posts** - Use Meta's scheduling or our queue
4. **Insights Tab** - Pull engagement metrics from API

---

## What Owner Needs to Do Now

### Quick Checklist:

1. [ ] Create Meta Business Portfolio at business.facebook.com
2. [ ] Create/claim Facebook Pages for each brand
3. [ ] Convert Instagram accounts to Business
4. [ ] Link Instagram accounts to Facebook Pages
5. [ ] Create developer account at developers.facebook.com
6. [ ] Create app named "PaintPros Marketing Hub"
7. [ ] Add Instagram Graph API product
8. [ ] Submit for App Review (for `instagram_content_publish`)
9. [ ] Generate System User token
10. [ ] Share credentials securely

---

## Timeline

| Step | Time |
|------|------|
| Business verification | 1-3 days |
| App Review (Instagram publish) | 5-10 business days |
| Integration development | 1-2 days after credentials |

---

## Alternative: Manual Posting with Tracking

Until API is set up, the Marketing Hub can:
- Generate ready-to-post content (image + caption)
- Copy to clipboard for manual paste
- Track what's been posted via status flags
- Log engagement manually

This is what we have now and it works well for the immediate need.

---

## Notes

- Meta heavily rate-limits new apps
- Business verification is required before publishing
- Instagram requires Facebook Page connection (as of 2025)
- Consider using Meta's native scheduler initially

---

**Document Version:** 1.0
**Created:** January 24, 2026
