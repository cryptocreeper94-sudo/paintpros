# PaintPros.io Complete Analytics System Documentation
## For Agent Reference - Full UI/UX + Backend Implementation

---

## TABLE OF CONTENTS
1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [Storage Interface (IStorage)](#storage-interface)
4. [Storage Implementation (PostgreSQL)](#storage-implementation)
5. [Backend API Routes](#backend-api-routes)
6. [Frontend - Google Analytics Integration](#frontend-ga-integration)
7. [Frontend - Internal Page Tracking Hooks](#frontend-hooks)
8. [Frontend - Analytics Dashboard (Single Tenant)](#analytics-dashboard-single)
9. [Frontend - Unified Analytics Dashboard (Multi-Tenant)](#unified-analytics-dashboard)
10. [Frontend - Tenant Analytics Dashboard (Accordion)](#tenant-analytics-dashboard)
11. [Frontend - Live Visitors Card](#live-visitors-card)
12. [External Embeddable Tracking Script](#embeddable-script)
13. [SEO System](#seo-system)
14. [Franchise & Marketing Analytics Schema](#franchise-marketing-schema)
15. [File Locations](#file-locations)

---

## 1. SYSTEM OVERVIEW <a name="system-overview"></a>

The analytics system has 4 layers:

**Layer 1 - Data Collection:**
- Internal page view tracking via `useAnalytics()` hook (client-side)
- Google Analytics 4 integration (gtag)
- Embeddable external tracking script (`tl-analytics.js`)
- User-agent parsing for device/browser detection
- IP-based geo-lookup via ip-api.com
- Session tracking via sessionStorage

**Layer 2 - Data Storage:**
- PostgreSQL `page_views` table (core tracking data)
- `analytics_summary` table (pre-computed cache)
- `seo_tags` and `seo_pages` tables (SEO performance)
- `franchise_analytics` table (white-label reporting)
- `marketing_analytics` table (social/ad performance)

**Layer 3 - API Layer:**
- `POST /api/analytics/track` - Record page views
- `GET /api/analytics/dashboard` - Full dashboard data (all or per-tenant)
- `GET /api/analytics/live` - Live visitor count
- `GET /api/analytics/live-visitors` - Detailed live visitor breakdown
- `GET /api/analytics/geography` - Geo breakdown
- `GET /api/analytics/tenants` - Available tenants
- `GET /api/analytics/page/:page` - Per-page analytics
- SEO routes: CRUD for tags + performance scoring

**Layer 4 - UI Dashboards:**
- `AnalyticsDashboard` - Single-tenant dashboard with metric explanations
- `UnifiedAnalyticsDashboard` - Multi-tenant tabbed view (NPP, PaintPros, Demo)
- `TenantAnalyticsDashboard` - Accordion-based per-tenant expansion
- `LiveVisitorsCard` - Real-time live visitor widget with modal detail

**Multi-Tenant Architecture:**
- Every page view is tagged with a `tenantId` (default: "npp")
- Dashboard APIs accept optional `?tenantId=` query param
- Frontend hooks detect tenant from `useTenant()` context
- Unified dashboard fetches data for all tenants simultaneously

---

## 2. DATABASE SCHEMA <a name="database-schema"></a>

### Page Views Table (Core Tracking)
```typescript
// File: shared/schema.ts (line ~754)
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("npp"),
  page: text("page").notNull(),                 // /home, /services, /estimate
  referrer: text("referrer"),                    // Where they came from
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),                      // Hashed IP for privacy
  sessionId: text("session_id"),                // Track unique sessions
  deviceType: text("device_type"),              // desktop, mobile, tablet
  browser: text("browser"),
  country: text("country"),
  city: text("city"),
  duration: integer("duration"),                // Time on page in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;
```

### Analytics Summary Cache
```typescript
// File: shared/schema.ts (line ~779)
export const analyticsSummary = pgTable("analytics_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  totalViews: integer("total_views").default(0).notNull(),
  uniqueVisitors: integer("unique_visitors").default(0).notNull(),
  avgDuration: integer("avg_duration").default(0),
  bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }),
  topPages: jsonb("top_pages").default([]),           // [{page, views}]
  topReferrers: jsonb("top_referrers").default([]),    // [{referrer, count}]
  deviceBreakdown: jsonb("device_breakdown").default({}), // {desktop, mobile, tablet}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### SEO Tags Table
```typescript
// File: shared/schema.ts (line ~152)
export const seoTags = pgTable("seo_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tagType: text("tag_type").notNull(),    // 'keyword', 'meta_description', 'title', 'geo'
  value: text("value").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").default("owner"),
});
```

### SEO Pages Table (Per-Page Metadata)
```typescript
// File: shared/schema.ts (line ~170)
export const seoPages = pgTable("seo_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("demo"),
  pagePath: text("page_path").notNull(),
  pageTitle: text("page_title").notNull(),
  
  // Basic Meta Tags
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  metaRobots: text("meta_robots").default("index, follow"),
  canonicalUrl: text("canonical_url"),
  
  // Open Graph
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  ogType: text("og_type").default("website"),
  ogSiteName: text("og_site_name"),
  ogLocale: text("og_locale").default("en_US"),
  
  // Twitter Card
  twitterCard: text("twitter_card").default("summary_large_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  twitterSite: text("twitter_site"),
  
  // JSON-LD Structured Data
  structuredDataType: text("structured_data_type"),
  structuredData: jsonb("structured_data"),
  
  // Audit
  seoScore: integer("seo_score").default(0),
  missingFields: text("missing_fields").array(),
  lastAuditAt: timestamp("last_audit_at"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
}, (table) => [
  index("idx_seo_pages_tenant_id").on(table.tenantId),
  index("idx_seo_pages_page_path").on(table.pagePath),
  index("idx_seo_pages_tenant_path").on(table.tenantId, table.pagePath),
]);
```

---

## 3. STORAGE INTERFACE <a name="storage-interface"></a>

```typescript
// File: server/storage.ts - IStorage interface (analytics section)

interface IStorage {
  // SEO Tags
  createSeoTag(tag: InsertSeoTag): Promise<SeoTag>;
  getSeoTags(): Promise<SeoTag[]>;
  getSeoTagsByType(tagType: string): Promise<SeoTag[]>;
  toggleSeoTagActive(id: string, isActive: boolean): Promise<SeoTag | undefined>;
  deleteSeoTag(id: string): Promise<void>;
  getSeoPerformance(tenantId: string): Promise<{
    overallScore: number;
    breakdown: {
      titleScore: number;
      metaScore: number;
      keywordScore: number;
      structuredDataScore: number;
      socialScore: number;
    };
    totalPages: number;
    optimizedPages: number;
    issues: string[];
    recommendations: string[];
  }>;

  // Core Analytics
  trackPageView(view: InsertPageView): Promise<PageView>;
  getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]>;
  getAnalyticsDashboard(): Promise<{
    today: { views: number; visitors: number };
    thisWeek: { views: number; visitors: number };
    thisMonth: { views: number; visitors: number };
    allTime: { views: number; visitors: number };
    recentViews: PageView[];
    topPages: { page: string; views: number }[];
    topReferrers: { referrer: string; count: number }[];
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    hourlyTraffic: { hour: number; views: number }[];
    dailyTraffic: { date: string; views: number; visitors: number }[];
  }>;
  getPageViewsByPage(page: string): Promise<PageView[]>;
  getLiveVisitorCount(): Promise<number>;

  // Tenant-Filtered Analytics
  getAnalyticsDashboardByTenant(tenantId: string): Promise<{
    today: { views: number; visitors: number };
    thisWeek: { views: number; visitors: number };
    thisMonth: { views: number; visitors: number };
    allTime: { views: number; visitors: number };
    recentViews: PageView[];
    topPages: { page: string; views: number }[];
    topReferrers: { referrer: string; count: number }[];
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    hourlyTraffic: { hour: number; views: number }[];
    dailyTraffic: { date: string; views: number; visitors: number }[];
  }>;
  getLiveVisitorCountByTenant(tenantId: string): Promise<number>;
  getAvailableTenants(): Promise<string[]>;
  getGeographicBreakdown(startDate: Date, endDate: Date, tenantId?: string): Promise<{
    countries: { country: string; views: number; visitors: number }[];
    cities: { city: string; country: string; views: number }[];
    totalWithLocation: number;
    totalWithoutLocation: number;
  }>;
}
```

---

## 4. STORAGE IMPLEMENTATION <a name="storage-implementation"></a>

### trackPageView
```typescript
async trackPageView(view: InsertPageView): Promise<PageView> {
  const [result] = await db.insert(pageViews).values(view).returning();
  return result;
}
```

### getPageViews
```typescript
async getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]> {
  if (startDate && endDate) {
    return await db.select().from(pageViews)
      .where(and(
        sql`${pageViews.createdAt} >= ${startDate}`,
        sql`${pageViews.createdAt} <= ${endDate}`
      ))
      .orderBy(desc(pageViews.createdAt));
  }
  return await db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(1000);
}
```

### getLiveVisitorCount
```typescript
async getLiveVisitorCount(): Promise<number> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const result = await db.select({ count: sql<number>`count(distinct ${pageViews.sessionId})::int` })
    .from(pageViews)
    .where(sql`${pageViews.createdAt} >= ${fiveMinutesAgo}`);
  return result[0]?.count || 0;
}
```

### getLiveVisitorCountByTenant
```typescript
async getLiveVisitorCountByTenant(tenantId: string): Promise<number> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const result = await db.select({ count: sql<number>`count(distinct ${pageViews.sessionId})::int` })
    .from(pageViews)
    .where(and(
      sql`${pageViews.createdAt} >= ${fiveMinutesAgo}`,
      eq(pageViews.tenantId, tenantId)
    ));
  return result[0]?.count || 0;
}
```

### getAvailableTenants
```typescript
async getAvailableTenants(): Promise<string[]> {
  const result = await db.selectDistinct({ tenantId: pageViews.tenantId })
    .from(pageViews)
    .where(sql`${pageViews.tenantId} is not null`);
  return result.map(r => r.tenantId).filter((t): t is string => t !== null);
}
```

### getAnalyticsDashboard (Full - All Tenants)
```typescript
async getAnalyticsDashboard(): Promise<DashboardData> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Today's stats
  const todayStats = await db.select({
    views: sql<number>`count(*)::int`,
    visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
  }).from(pageViews).where(sql`${pageViews.createdAt} >= ${startOfToday}`);

  // This week's stats
  const weekStats = await db.select({
    views: sql<number>`count(*)::int`,
    visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
  }).from(pageViews).where(sql`${pageViews.createdAt} >= ${startOfWeek}`);

  // This month's stats
  const monthStats = await db.select({
    views: sql<number>`count(*)::int`,
    visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
  }).from(pageViews).where(sql`${pageViews.createdAt} >= ${startOfMonth}`);

  // All time stats
  const allTimeStats = await db.select({
    views: sql<number>`count(*)::int`,
    visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
  }).from(pageViews);

  // Recent page views
  const recentViews = await db.select().from(pageViews)
    .orderBy(desc(pageViews.createdAt)).limit(20);

  // Top pages (last 30 days)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const topPagesResult = await db.select({
    page: pageViews.page,
    views: sql<number>`count(*)::int`
  }).from(pageViews)
    .where(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`)
    .groupBy(pageViews.page)
    .orderBy(sql`count(*) desc`).limit(10);

  // Top referrers
  const topReferrersResult = await db.select({
    referrer: pageViews.referrer,
    count: sql<number>`count(*)::int`
  }).from(pageViews)
    .where(and(
      sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`,
      sql`${pageViews.referrer} is not null`,
      sql`${pageViews.referrer} != ''`
    ))
    .groupBy(pageViews.referrer)
    .orderBy(sql`count(*) desc`).limit(10);

  // Device breakdown
  const deviceResult = await db.select({
    deviceType: pageViews.deviceType,
    count: sql<number>`count(*)::int`
  }).from(pageViews)
    .where(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`)
    .groupBy(pageViews.deviceType);

  const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
  deviceResult.forEach(d => {
    if (d.deviceType === 'desktop') deviceBreakdown.desktop = d.count;
    else if (d.deviceType === 'mobile') deviceBreakdown.mobile = d.count;
    else if (d.deviceType === 'tablet') deviceBreakdown.tablet = d.count;
  });

  // Hourly traffic (today)
  const hourlyResult = await db.select({
    hour: sql<number>`extract(hour from ${pageViews.createdAt})::int`,
    views: sql<number>`count(*)::int`
  }).from(pageViews)
    .where(sql`${pageViews.createdAt} >= ${startOfToday}`)
    .groupBy(sql`extract(hour from ${pageViews.createdAt})`)
    .orderBy(sql`extract(hour from ${pageViews.createdAt})`);

  // Daily traffic (last 30 days)
  const dailyResult = await db.select({
    date: sql<string>`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`,
    views: sql<number>`count(*)::int`,
    visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
  }).from(pageViews)
    .where(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`)
    .groupBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`);

  return {
    today: todayStats[0] || { views: 0, visitors: 0 },
    thisWeek: weekStats[0] || { views: 0, visitors: 0 },
    thisMonth: monthStats[0] || { views: 0, visitors: 0 },
    allTime: allTimeStats[0] || { views: 0, visitors: 0 },
    recentViews,
    topPages: topPagesResult,
    topReferrers: topReferrersResult.map(r => ({ referrer: r.referrer || 'Direct', count: r.count })),
    deviceBreakdown,
    hourlyTraffic: hourlyResult,
    dailyTraffic: dailyResult
  };
}
```

### getAnalyticsDashboardByTenant
Same as above but every query adds `eq(pageViews.tenantId, tenantId)` as an additional filter.

### getGeographicBreakdown
```typescript
async getGeographicBreakdown(startDate: Date, endDate: Date, tenantId?: string): Promise<GeoData> {
  const dateFilter = and(
    sql`${pageViews.createdAt} >= ${startDate}`,
    sql`${pageViews.createdAt} <= ${endDate}`
  );
  const baseFilter = tenantId 
    ? and(dateFilter, eq(pageViews.tenantId, tenantId))
    : dateFilter;

  // Country breakdown (top 20)
  const countriesResult = await db.select({
    country: pageViews.country,
    views: sql<number>`count(*)::int`,
    visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
  }).from(pageViews)
    .where(and(baseFilter, sql`${pageViews.country} is not null`))
    .groupBy(pageViews.country)
    .orderBy(sql`count(*) desc`).limit(20);

  // City breakdown (top 15)
  const citiesResult = await db.select({
    city: pageViews.city,
    country: pageViews.country,
    views: sql<number>`count(*)::int`
  }).from(pageViews)
    .where(and(baseFilter, sql`${pageViews.city} is not null`))
    .groupBy(pageViews.city, pageViews.country)
    .orderBy(sql`count(*) desc`).limit(15);

  // Count with/without location
  // ... returns { countries, cities, totalWithLocation, totalWithoutLocation }
}
```

### SEO Performance Scoring
```typescript
async getSeoPerformance(tenantId: string): Promise<SeoPerformance> {
  const pages = await db.select().from(seoPages).where(eq(seoPages.tenantId, tenantId));
  
  // Scores per category (each out of 20 points per page):
  // - Title: 20 pts if 30-60 chars, 10 pts if exists but wrong length
  // - Meta Description: 20 pts if 120-160 chars, 10 pts if exists but wrong length
  // - Keywords: 20 pts if keywords exist
  // - Structured Data: 20 pts if JSON-LD exists
  // - Social (OG): 20 pts if Open Graph tags exist
  
  // Returns normalized 0-100 overall score with breakdown, issues[], recommendations[]
}
```

---

## 5. BACKEND API ROUTES <a name="backend-api-routes"></a>

### POST /api/analytics/track
```typescript
// File: server/routes.ts (line ~9586)
app.post("/api/analytics/track", async (req, res) => {
  const { page, referrer, sessionId, duration, tenantId } = req.body;
  
  // Parse user agent for device type
  const userAgent = req.headers["user-agent"] || "";
  let deviceType = "desktop";
  if (/mobile/i.test(userAgent)) deviceType = "mobile";
  else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
  
  // Parse browser
  let browser = "unknown";
  if (/chrome/i.test(userAgent)) browser = "Chrome";
  else if (/firefox/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent)) browser = "Safari";
  else if (/edge/i.test(userAgent)) browser = "Edge";
  
  // Get IP for geo-lookup
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = typeof forwardedFor === 'string' 
    ? forwardedFor.split(',')[0].trim() 
    : req.socket.remoteAddress || "";
  const ipHash = Buffer.from(String(ip)).toString("base64").slice(0, 16);
  
  // Geo-lookup via ip-api.com (skip local IPs)
  let country = null, city = null;
  if (ip && !ip.includes('127.0.0.1') && !ip.includes('::1') && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
    const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
    // ... parse geoData
  }
  
  const pageView = await storage.trackPageView({
    page, referrer, userAgent, ipHash, sessionId,
    deviceType, browser, duration,
    tenantId: tenantId || "npp",
    country, city
  });
  
  res.status(201).json({ success: true, id: pageView.id });
});
```

### GET /api/analytics/dashboard
```typescript
app.get("/api/analytics/dashboard", async (req, res) => {
  const { tenantId } = req.query;
  let dashboard, liveCount;
  
  if (tenantId && typeof tenantId === "string") {
    dashboard = await storage.getAnalyticsDashboardByTenant(tenantId);
    liveCount = await storage.getLiveVisitorCountByTenant(tenantId);
  } else {
    dashboard = await storage.getAnalyticsDashboard();
    liveCount = await storage.getLiveVisitorCount();
  }
  
  res.json({ ...dashboard, liveVisitors: liveCount });
});
```

### GET /api/analytics/live
```typescript
app.get("/api/analytics/live", async (req, res) => {
  const { tenantId } = req.query;
  const count = tenantId 
    ? await storage.getLiveVisitorCountByTenant(tenantId as string)
    : await storage.getLiveVisitorCount();
  res.json({ liveVisitors: count });
});
```

### GET /api/analytics/live-visitors (Detailed)
```typescript
app.get("/api/analytics/live-visitors", async (req, res) => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentViews = await storage.getPageViews(fiveMinutesAgo, new Date());
  
  // Groups by session, filters bots (bot|crawler|spider|headless|preview|replit)
  // Returns: { total, realVisitors, bots, byDevice, byPage, visitors[] }
  // Each visitor: { sessionId, deviceType, browser, page, lastSeen, isBot }
});
```

### GET /api/analytics/geography
```typescript
app.get("/api/analytics/geography", async (req, res) => {
  const { tenantId, days = "30" } = req.query;
  const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
  const geoData = await storage.getGeographicBreakdown(startDate, new Date(), tenantId);
  res.json(geoData);
});
```

### GET /api/analytics/tenants
```typescript
app.get("/api/analytics/tenants", async (req, res) => {
  const tenants = await storage.getAvailableTenants();
  res.json({ tenants });
});
```

### GET /api/analytics/page/:page
```typescript
app.get("/api/analytics/page/:page", async (req, res) => {
  const views = await storage.getPageViewsByPage(decodeURIComponent(req.params.page));
  res.json({ page: req.params.page, totalViews: views.length, views: views.slice(0, 100) });
});
```

### SEO Routes
```typescript
POST   /api/seo-tags          // Create SEO tag (validated via insertSeoTagSchema)
GET    /api/seo-tags           // Get all tags (optional ?type= filter)
PATCH  /api/seo-tags/:id/toggle // Toggle isActive
DELETE /api/seo-tags/:id       // Delete tag
GET    /api/seo/performance    // Get SEO score (optional ?tenantId=)
```

---

## 6. FRONTEND - GOOGLE ANALYTICS <a name="frontend-ga-integration"></a>

```typescript
// File: client/src/lib/analytics.ts

// Requires env var: VITE_GA_MEASUREMENT_ID

export const initGA = () => {
  // Injects gtag.js script + config into document.head
  // Prevents duplicate injection with gaScriptAdded flag
};

export const trackPageView = (url: string, tenantId?: string) => {
  // Sends page_path + tenant_id custom dimension to GA4
  window.gtag('config', measurementId, {
    page_path: url,
    custom_map: { 'dimension1': 'tenant_id' },
    tenant_id: tenantId
  });
};

export const trackEvent = (action, category?, label?, value?, tenantId?) => {
  window.gtag('event', action, { event_category, event_label, value, tenant_id });
};

// Convenience wrappers:
export const trackEstimateSubmission = (tenantId, estimateValue?) => { ... };
export const trackLeadCapture = (tenantId, source?) => { ... };
export const trackContractorApplication = (tenantId) => { ... };
```

---

## 7. FRONTEND - INTERNAL TRACKING HOOKS <a name="frontend-hooks"></a>

### Hook 1: use-analytics.tsx (Simple GA-only)
```typescript
// File: client/src/hooks/use-analytics.tsx
// Tracks route changes via wouter + sends to GA4
export const useAnalytics = () => {
  const [location] = useLocation();
  const tenant = useTenant();
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      trackPageView(location, tenant?.id);
    }
  }, [location, tenant?.id]);
};
```

### Hook 2: useAnalytics.ts (Full Internal + GA)
```typescript
// File: client/src/hooks/useAnalytics.ts
// Dual tracking: internal API + Google Analytics
export function useAnalytics() {
  const [location] = useLocation();
  const tenant = useTenant();

  useEffect(() => {
    const sessionId = generateSessionId(); // sessionStorage-based
    
    // POST to /api/analytics/track on every route change
    const trackPageView = async (page, duration?) => {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, referrer, sessionId, duration, tenantId })
      });
    };

    // Track previous page duration before navigating
    if (lastPageRef.current !== location) {
      const duration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      trackPageView(lastPageRef.current, duration);
    }

    trackPageView(location);
    
    // Also track with GA
    ensureGAInitialized();
    trackGAPageView(location, tenantId);

    // sendBeacon on page unload for duration tracking
    window.addEventListener("beforeunload", () => {
      navigator.sendBeacon("/api/analytics/track", JSON.stringify({
        page: location, sessionId, duration, tenantId
      }));
    });
  }, [location, tenant?.id]);
}
```

---

## 8. ANALYTICS DASHBOARD (Single Tenant) <a name="analytics-dashboard-single"></a>

**File:** `client/src/components/analytics-dashboard.tsx`  
**Component:** `<AnalyticsDashboard />`  
**Used in:** Owner dashboard, Admin dashboard

### Features:
- **5 metric cards** (grid): Live Now, Today, This Week, This Month, All Time
- **Clickable metrics** with explanation modals (METRIC_EXPLANATIONS object)
- **Traffic Over Time chart** (AreaChart - views + visitors, 30 days)
- **Device breakdown** (PieChart - Desktop/Mobile/Tablet)
- **Top Pages** (ranked list with views count)
- **Top Referrers** (ranked list with count)
- **Hourly traffic** (BarChart - today's traffic by hour)

### Data Source:
```typescript
const { data } = useQuery<AnalyticsData>({
  queryKey: ["/api/analytics/dashboard"],
  refetchInterval: 30000, // 30 second auto-refresh
});
```

### AnalyticsData Interface:
```typescript
interface AnalyticsData {
  today: { views: number; visitors: number };
  thisWeek: { views: number; visitors: number };
  thisMonth: { views: number; visitors: number };
  allTime: { views: number; visitors: number };
  liveVisitors: number;
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  hourlyTraffic: { hour: number; views: number }[];
  dailyTraffic: { date: string; views: number; visitors: number }[];
}
```

### UI Components Used:
- `GlassCard` (custom glassmorphism card)
- `BentoGrid` / `BentoItem` (custom bento layout)
- `Dialog` (shadcn - for metric explanations)
- `motion` (framer-motion for animations)
- `recharts` (AreaChart, BarChart, PieChart)
- `lucide-react` icons

### Design Language:
- Dark theme with gradient overlays per metric (green=live, gold=today, blue=week, purple=month, accent=alltime)
- GlassCard with glow effect
- Spring animations on hover (scale 1.02)
- Color scheme: gold-400 (#f59e0b), blue-500 (#3b82f6), green-500 (#10b981)

---

## 9. UNIFIED ANALYTICS DASHBOARD (Multi-Tenant) <a name="unified-analytics-dashboard"></a>

**File:** `client/src/components/unified-analytics-dashboard.tsx`  
**Component:** `<UnifiedAnalyticsDashboard />`  
**Used in:** Developer dashboard

### Features:
- **Tabbed interface** switching between tenants (NPP, PaintPros, Demo)
- **Total live visitors** count across all tenants
- **Per-tenant metrics**: Live, Today, Week, Month, All Time
- **Per-tenant charts**: Daily Traffic (7 days), Device Breakdown, Top Pages, Top Referrers
- **SEO Performance** ring chart with score breakdown
- **Geographic data** per tenant
- **Refresh All** button

### Tenant Config:
```typescript
const TENANT_CONFIG = {
  npp: { name: "Nashville Painting Pros", shortName: "NPP", icon: Paintbrush, color: "text-amber-400" },
  paintprosco: { name: "Paint Pros Co", shortName: "PaintPros", icon: Building2, color: "text-amber-400" },
  demo: { name: "Demo Marketplace", shortName: "Demo", icon: Store, color: "text-blue-400" },
};
```

### Data Fetching Pattern:
```typescript
// Fetches analytics for each tenant independently
const { data: nppData } = useQuery({ queryKey: ["/api/analytics/dashboard", "npp"] });
const { data: lumeData } = useQuery({ queryKey: ["/api/analytics/dashboard", "lumepaint"] });
const { data: demoData } = useQuery({ queryKey: ["/api/analytics/dashboard", "demo"] });

// Also fetches geo and SEO data per tenant
const { data: nppGeo } = useQuery({ queryKey: ["/api/analytics/geography", "npp"] });
const { data: nppSeo } = useQuery({ queryKey: ["/api/seo/performance", "npp"] });
// ... etc for each tenant
```

### SEO Performance Display:
- SVG ring chart showing 0-100 score
- Color coding: green >= 70, amber >= 40, red < 40
- Score breakdown: Title, Meta, Keywords, Structured Data, Social
- Issues and recommendations lists

---

## 10. TENANT ANALYTICS DASHBOARD (Accordion) <a name="tenant-analytics-dashboard"></a>

**File:** `client/src/components/tenant-analytics-dashboard.tsx`  
**Component:** `<TenantAnalyticsDashboard />`

### Features:
- **Accordion-based** - expand/collapse per tenant
- Fetches tenant list from `/api/analytics/tenants`
- Each expanded tenant shows full dashboard (metrics + charts)
- Tenant colors: NPP=#5a7a4d, PaintPros=#d4a853, Orbit=#9945FF
- BentoGrid layout with tenant-colored chart gradients

---

## 11. LIVE VISITORS CARD <a name="live-visitors-card"></a>

**File:** `client/src/components/live-visitors-card.tsx`  
**Component:** `<LiveVisitorsCard />`

### Features:
- Compact card with pulse animation (green dot)
- Shows real visitor count (bots filtered)
- **Click to expand** modal with:
  - Device breakdown (Desktop/Mobile/Tablet grid)
  - Pages being viewed (with user avatar dots)
  - Active sessions list (scrollable, per-session detail)
  - Bot count notice
- **10 second auto-refresh** (more frequent than dashboard's 30s)

### Data Source:
```typescript
const { data } = useQuery<LiveVisitorData>({
  queryKey: ["/api/analytics/live-visitors"],
  refetchInterval: 10000,
});
```

### LiveVisitorData Interface:
```typescript
interface LiveVisitorData {
  total: number;
  realVisitors: number;
  bots: number;
  byDevice: { desktop: number; mobile: number; tablet: number };
  byPage: { page: string; count: number }[];
  visitors: LiveVisitor[];
}

interface LiveVisitor {
  sessionId: string;
  deviceType: string;
  browser: string;
  page: string;
  lastSeen: string;
  isBot: boolean;
}
```

---

## 12. EMBEDDABLE TRACKING SCRIPT <a name="embeddable-script"></a>

**File:** `client/public/analytics/tl-analytics.js`

### Usage:
```html
<script src="https://tlid.io/analytics/tl-analytics.js" data-site-id="YOUR_SITE_ID"></script>
```

### Features:
- Self-contained IIFE (no dependencies)
- Session ID generation (sessionStorage-based)
- Tracks: pageview, pagehide, pageshow, unload, heartbeat, outbound_click, navigation
- sendBeacon for reliable unload tracking
- SPA support: intercepting pushState + popstate
- 30-second heartbeat for live visitor detection
- Referrer cleaning (hostname extraction)
- Global API: `window.TLAnalytics.track(eventName, data)` and `.identify(userId, traits)`

### Data Sent:
```javascript
{
  siteId, sessionId, page, referrer, eventType,
  timestamp, screenWidth, screenHeight, language, timezone
}
```

---

## 13. SEO SYSTEM <a name="seo-system"></a>

### SEO Tags (Simple Tag Management)
- CRUD via `/api/seo-tags`
- Types: keyword, meta_description, title, geo
- Toggle active/inactive
- Used in Unified Analytics Dashboard for tag count display

### SEO Pages (Per-Page Metadata)
- Full SEO metadata per page per tenant
- Includes: meta title/description, keywords, robots, canonical URL
- Open Graph: title, description, image, type, site name, locale
- Twitter Card: card type, title, description, image, @handle
- JSON-LD structured data (LocalBusiness, Service, Organization, FAQPage, BreadcrumbList)
- Audit: seo_score (0-100), missing fields list, last audit timestamp

### SEO Performance Scoring Algorithm:
Per page, scores are calculated across 5 categories (20 pts each = 100 total):
1. **Title** (20 pts): Full marks if 30-60 chars, half if exists but wrong length
2. **Meta Description** (20 pts): Full marks if 120-160 chars
3. **Keywords** (20 pts): Full marks if keywords exist
4. **Structured Data** (20 pts): Full marks if JSON-LD exists
5. **Social/OG** (20 pts): Full marks if Open Graph tags exist

Scores are averaged across all pages and normalized to 0-100.

---

## 14. FRANCHISE & MARKETING ANALYTICS SCHEMA <a name="franchise-marketing-schema"></a>

### Franchise Analytics (White-Label Reporting)
```typescript
export const franchiseAnalytics = pgTable("franchise_analytics", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  reportPeriod: varchar("report_period", { length: 20 }).notNull(),
  totalRevenue: integer("total_revenue"),
  totalJobs: integer("total_jobs"),
  avgJobValue: integer("avg_job_value"),
  conversionRate: real("conversion_rate"),
  customerSatisfaction: real("customer_satisfaction"),
  employeeCount: integer("employee_count"),
  marketingSpend: integer("marketing_spend"),
  costPerLead: integer("cost_per_lead"),
  topServices: text("top_services"),
  growthRate: real("growth_rate"),
  benchmarkComparison: text("benchmark_comparison"),
  insights: text("insights"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});
```

### Marketing Analytics (Social/Ad Performance)
```typescript
export const marketingAnalytics = pgTable("marketing_analytics", {
  id: varchar("id", { length: 36 }).primaryKey(),
  tenantId: text("tenant_id").notNull(),
  periodType: text("period_type").notNull(),    // 'daily', 'weekly', 'monthly'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  platform: text("platform").notNull(),          // 'instagram', 'facebook', 'nextdoor', 'all'
  postsScheduled: integer("posts_scheduled").default(0),
  postsPublished: integer("posts_published").default(0),
  imagesUsed: integer("images_used").default(0),
  totalImpressions: integer("total_impressions").default(0),
  totalEngagements: integer("total_engagements").default(0),
  totalClicks: integer("total_clicks").default(0),
  engagementRate: real("engagement_rate"),
  clickThroughRate: real("click_through_rate"),
  topCategories: jsonb("top_categories"),
  topPosts: jsonb("top_posts"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

---

## 15. FILE LOCATIONS <a name="file-locations"></a>

### Schema & Types
- `shared/schema.ts` - All database table definitions and types

### Backend
- `server/storage.ts` - IStorage interface + PostgreSQL implementation
- `server/routes.ts` - All API route handlers

### Frontend - Core
- `client/src/lib/analytics.ts` - Google Analytics 4 integration
- `client/src/hooks/useAnalytics.ts` - Internal + GA tracking hook (primary)
- `client/src/hooks/use-analytics.tsx` - GA-only tracking hook (legacy)

### Frontend - Dashboard Components
- `client/src/components/analytics-dashboard.tsx` - Single tenant dashboard
- `client/src/components/unified-analytics-dashboard.tsx` - Multi-tenant tabbed dashboard
- `client/src/components/tenant-analytics-dashboard.tsx` - Accordion-based tenant dashboards
- `client/src/components/live-visitors-card.tsx` - Real-time live visitors widget

### External
- `client/public/analytics/tl-analytics.js` - Embeddable tracking snippet
- `client/public/widgets/tl-analytics.js` - Widget copy of tracking snippet

### Dependencies (npm packages used)
- `recharts` - Charts (AreaChart, BarChart, PieChart)
- `framer-motion` - Animations
- `@tanstack/react-query` - Data fetching
- `wouter` - Routing (for location tracking)
- `drizzle-orm` - Database queries
- `drizzle-zod` - Schema validation
- `lucide-react` - Icons

### Design System Components Used
- `GlassCard` - Glassmorphism cards with optional glow
- `BentoGrid` / `BentoItem` - Bento grid layout system
- `Dialog` - Modal overlays (shadcn)
- `Tabs` / `TabsList` / `TabsTrigger` - Tab navigation (shadcn)
- `Accordion` - Collapsible sections (shadcn)
- `ScrollArea` - Scrollable containers (shadcn)
