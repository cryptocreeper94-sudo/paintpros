# DarkWave Snippet Hub - Handoff Document

## PROJECT OVERVIEW

**What:** A visual marketplace for reusable code components/snippets within the DarkWave ecosystem.

**Where it lives:** darkwave-studios.io (as a dedicated page/section)

**Purpose:**
- Organize and showcase proven, working code modules
- Enable sharing between agents/projects
- Eventually monetize as a marketplace for other developers
- Build the DarkWave Trust Layer community

---

## UI/UX VISION

### Main Page Layout

**Header:** "DarkWave Component Library" or "DarkWave Build Kit"

**Category Filter Buttons (top of page):**
- All Components
- Estimators
- AI Systems
- Trade Verticals (Painting, Roofing, HVAC, etc.)
- CRM & Booking
- Payment Integrations
- UI Components

### Component Cards (Grid Layout)

Each module appears as a clickable card:

- Large icon or visual preview
- Title (e.g., "AI Predictive System")
- Short tagline (e.g., "Smart forecasting for business metrics")
- Category badge
- "Verified" badge if tested/production-ready
- [View Details] button

### Expanded View (when card is clicked)

Shows full details:

1. **Title & Description** - What it does in plain language
2. **Technical Specs:**
   - Language/framework (React, Node, Python, etc.)
   - Dependencies required
   - Version number
3. **Preview** - Screenshot or live demo if possible
4. **Code Section:**
   - [View Code] - expandable code block
   - [Copy Code] - one-click copy
   - [Download] - download as file
5. **Pricing** (for marketplace):
   - Free / $X one-time / $X/month
6. **Usage Stats:**
   - "Used by X projects"
   - Last updated date
7. **Created By:** Attribution to developer

---

## CATEGORIES TO START WITH

1. **Estimators**
   - Lume Estimator (4-step with booking)
   - TradeWorks Calculator Suite
   - Room Scanner Integration

2. **AI Systems**
   - Predictive Analytics
   - Smart Lead Scoring
   - Voice-to-Estimate

3. **Trade Verticals**
   - Painting Module
   - Roofing Module
   - HVAC Module
   - Plumbing Module
   - Electrical Module
   - Landscaping Module

4. **CRM & Booking**
   - Appointment Scheduler
   - Lead Capture Forms
   - Customer Portal

5. **Payment Integrations**
   - Stripe Integration
   - Credit Pack System
   - Subscription Management

6. **UI Components**
   - GlassCard
   - FlipButton
   - Carousel System
   - Dark/Light Theme Toggle

---

## TECHNICAL REQUIREMENTS

### API Endpoints Needed

```
GET  /api/snippets              - List all snippets
GET  /api/snippets?category=X   - Filter by category
GET  /api/snippets/:id          - Get single snippet details
POST /api/snippets              - Create new snippet (authenticated)
PUT  /api/snippets/:id          - Update snippet (owner only)
DELETE /api/snippets/:id        - Remove snippet (owner only)
```

### Snippet Data Schema

```javascript
{
  id: string,
  title: string,
  tagline: string,
  description: string,
  category: string,
  subcategory: string,
  language: string,           // "typescript", "python", "react", etc.
  framework: string,          // "Next.js", "Express", "React", etc.
  code: string,               // The actual code
  dependencies: string[],     // ["stripe", "openai", "drizzle"]
  version: string,            // "1.0.0"
  previewImage: string,       // URL to screenshot
  demoUrl: string,            // Live demo link if available
  price: number,              // 0 for free, or dollar amount
  pricingModel: string,       // "free", "one-time", "subscription"
  isVerified: boolean,        // Tested and production-ready
  usageCount: number,         // How many projects use it
  createdBy: string,          // Developer name/ID
  createdAt: Date,
  updatedAt: Date,
  tags: string[]              // ["estimator", "booking", "mobile"]
}
```

### Authentication

- DarkWave API Key/Secret for write operations
- Public read access for browsing
- Developer accounts for contributors

---

## WHAT WE NEED BACK

1. **Orbit Ecosystem Credentials:**
   - ORBIT_ECOSYSTEM_API_KEY
   - ORBIT_ECOSYSTEM_API_SECRET
   - ORBIT_ECOSYSTEM_DEV_URL

2. **Confirmation that these endpoints are active:**
   - GET /api/snippets
   - POST /api/snippets
   - GET /api/health

3. **Schema alignment** - Confirm the snippet data structure above works or send modifications

4. **Sandbox access** - Test environment URL if available

---

## BRANDING

- **Owner:** DarkWave Studios LLC
- **Part of:** DarkWave Trust Layer Ecosystem
- **Connected Apps:** PaintPros.io, Orbit Staffing, TradeWorks, future verticals
- **Design Style:** Clean, professional, matches darkwave-studios.io aesthetic

---

## TIMELINE

- **Now:** PaintPros has read-only connection code ready (server/orbit.ts)
- **Next:** Once credentials received, can display snippets in dev dashboard
- **Future:** Full marketplace on darkwave-studios.io

---

## CONTACT

DarkWave Studios LLC
Building the future of trade industry software.
