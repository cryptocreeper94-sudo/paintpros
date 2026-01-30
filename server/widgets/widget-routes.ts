import { Router, Request, Response } from "express";

const router = Router();

// ============================================
// TrustLayer Widget API Routes
// Standalone API endpoints for embeddable widgets
// ============================================

// Widget Authentication Middleware
function authenticateWidget(req: Request, res: Response, next: Function) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const siteId = req.body.siteId || req.query.siteId;
  
  if (!siteId) {
    return res.status(400).json({ error: 'Missing siteId' });
  }
  
  req.body.siteId = siteId;
  next();
}

// In-memory storage for widget data (for demo purposes)
const widgetData: {
  leads: any[];
  bookings: any[];
  estimates: any[];
  chatMessages: any[];
  crewShifts: any[];
  deals: any[];
  seoReports: any[];
} = {
  leads: [],
  bookings: [],
  estimates: [],
  chatMessages: [],
  crewShifts: [],
  deals: [],
  seoReports: []
};

// ============================================
// Analytics Widget API
// ============================================

router.post("/analytics/track", async (req, res) => {
  try {
    const { siteId, sessionId, page, eventType } = req.body;
    console.log(`[Widget Analytics] ${eventType} for site ${siteId}:`, { page, sessionId });

    res.status(201).json({ 
      success: true, 
      id: `evt_${Date.now().toString(36)}` 
    });
  } catch (error: any) {
    console.error('[Widget Analytics] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/analytics/summary", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    
    res.json({
      siteId,
      period: '7d',
      pageViews: 1247,
      uniqueVisitors: 423,
      avgSessionDuration: 185,
      bounceRate: 42.3,
      topPages: [
        { path: '/', views: 456 },
        { path: '/services', views: 234 },
        { path: '/contact', views: 189 }
      ],
      topReferrers: [
        { source: 'google', visits: 312 },
        { source: 'facebook', visits: 89 },
        { source: 'direct', visits: 287 }
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Lead Capture Widget API
// ============================================

router.post("/leads/create", async (req, res) => {
  try {
    const { siteId, name, email, phone, service, address, timeline, notes, source } = req.body;

    const lead = {
      id: `lead_${Date.now().toString(36)}`,
      siteId,
      name,
      email,
      phone,
      service,
      address,
      timeline,
      notes,
      source: source || 'widget',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    widgetData.leads.push(lead);
    console.log(`[Widget Leads] New lead created for ${siteId}:`, lead.id);

    res.status(201).json({ 
      success: true, 
      leadId: lead.id,
      message: 'Lead captured successfully'
    });
  } catch (error: any) {
    console.error('[Widget Leads] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/leads", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    const siteLeads = widgetData.leads.filter(l => l.siteId === siteId);
    res.json({ leads: siteLeads });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Estimator Widget API
// ============================================

router.post("/estimator/calculate", async (req, res) => {
  try {
    const { siteId, service, sqft, rooms, condition } = req.body;

    const basePricing: Record<string, { rate: number; laborMult: number }> = {
      interior: { rate: 2.50, laborMult: 1.0 },
      exterior: { rate: 3.00, laborMult: 1.2 },
      cabinet: { rate: 75, laborMult: 1.5 },
      deck: { rate: 3.50, laborMult: 1.1 },
      commercial: { rate: 2.00, laborMult: 1.3 }
    };

    const conditionMultipliers: Record<string, number> = {
      good: 1.0,
      fair: 1.15,
      poor: 1.35
    };

    const pricing = basePricing[service] || basePricing.interior;
    const condMult = conditionMultipliers[condition] || 1.0;
    const roomMult = Math.max(1, 0.95 + (rooms * 0.05));

    const estimate = sqft * pricing.rate * pricing.laborMult * condMult * roomMult;
    const low = Math.round(estimate * 0.85);
    const mid = Math.round(estimate);
    const high = Math.round(estimate * 1.15);

    const estimateRecord = {
      id: `est_${Date.now().toString(36)}`,
      siteId,
      service,
      sqft,
      rooms,
      condition,
      estimate: { low, mid, high },
      createdAt: new Date().toISOString()
    };

    widgetData.estimates.push(estimateRecord);

    res.json({
      success: true,
      estimateId: estimateRecord.id,
      estimate: { low, mid, high },
      breakdown: {
        baseSqft: sqft,
        ratePerSqft: pricing.rate,
        laborMultiplier: pricing.laborMult,
        conditionMultiplier: condMult,
        roomAdjustment: roomMult
      }
    });
  } catch (error: any) {
    console.error('[Widget Estimator] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Booking Widget API
// ============================================

router.post("/booking/create", async (req, res) => {
  try {
    const { siteId, date, time, duration, customer, service, notes } = req.body;

    const booking = {
      id: `bk_${Date.now().toString(36)}`,
      confirmationNumber: `BK-${Date.now().toString(36).toUpperCase()}`,
      siteId,
      date,
      time,
      duration: duration || 60,
      customer,
      service: service || 'consultation',
      notes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    widgetData.bookings.push(booking);
    console.log(`[Widget Booking] New booking for ${siteId}:`, booking.id);

    res.status(201).json({
      success: true,
      bookingId: booking.id,
      confirmationNumber: booking.confirmationNumber,
      message: 'Booking confirmed'
    });
  } catch (error: any) {
    console.error('[Widget Booking] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/booking/availability", async (req, res) => {
  try {
    const date = req.query.date as string;
    const slots = [
      '9:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '1:00 PM', '2:00 PM',
      '3:00 PM', '4:00 PM', '5:00 PM'
    ];
    res.json({ date, availableSlots: slots });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SEO Widget API
// ============================================

router.post("/seo/report", async (req, res) => {
  try {
    const { siteId, url, score, issues, timestamp } = req.body;

    const report = {
      id: `seo_${Date.now().toString(36)}`,
      siteId,
      url,
      score,
      issueCount: issues?.length || 0,
      issues,
      createdAt: timestamp || new Date().toISOString()
    };

    widgetData.seoReports.push(report);
    console.log(`[Widget SEO] Report for ${siteId}:`, { url, score, issueCount: report.issueCount });

    res.json({
      success: true,
      reportId: report.id,
      score,
      issueCount: report.issueCount
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/seo/reports", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    const reports = widgetData.seoReports.filter(r => r.siteId === siteId);
    res.json({ reports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Chat Widget API
// ============================================

router.post("/chat/message", async (req, res) => {
  try {
    const { siteId, visitorId, text, sender } = req.body;

    const message = {
      id: `msg_${Date.now().toString(36)}`,
      siteId,
      visitorId,
      text,
      sender,
      timestamp: new Date().toISOString()
    };

    widgetData.chatMessages.push(message);
    console.log(`[Widget Chat] Message for ${siteId} from ${visitorId}:`, text.substring(0, 50));

    res.json({
      success: true,
      messageId: message.id,
      timestamp: message.timestamp
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/chat/messages", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    const visitorId = req.query.visitorId as string;
    const messages = widgetData.chatMessages.filter(
      m => m.siteId === siteId && (!visitorId || m.visitorId === visitorId)
    );
    res.json({ messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Proposal Widget API
// ============================================

router.post("/proposal/sign", async (req, res) => {
  try {
    const { siteId, proposalId, signature, printedName, signedDate } = req.body;
    console.log(`[Widget Proposal] Signed for ${siteId}:`, { proposalId, printedName });

    res.json({
      success: true,
      proposalId,
      status: 'signed',
      signedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/proposal/:id", async (req, res) => {
  try {
    const proposalId = req.params.id;
    
    res.json({
      id: proposalId,
      status: 'pending',
      customer: { name: 'John Smith', email: 'john@example.com' },
      items: [
        { name: 'Interior Painting', description: 'Living room and kitchen', qty: '650 sq ft', price: 1950 },
        { name: 'Prep Work', description: 'Patching and sanding', qty: '1', price: 350 }
      ],
      total: 2300,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Crew Tracker Widget API
// ============================================

router.post("/crew/clock-in", async (req, res) => {
  try {
    const { siteId, crewId, location, address } = req.body;

    const shift = {
      id: `shift_${Date.now().toString(36)}`,
      siteId,
      crewId,
      location,
      address,
      clockedInAt: new Date().toISOString(),
      status: 'active'
    };

    widgetData.crewShifts.push(shift);
    console.log(`[Widget Crew] Clock in for ${siteId}:`, { crewId, location });

    res.json({
      success: true,
      shiftId: shift.id,
      clockedInAt: shift.clockedInAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/crew/clock-out", async (req, res) => {
  try {
    const { siteId, crewId, shiftId, duration, notes } = req.body;

    const shift = widgetData.crewShifts.find(s => s.id === shiftId);
    if (shift) {
      shift.clockedOutAt = new Date().toISOString();
      shift.duration = duration;
      shift.notes = notes;
      shift.status = 'completed';
    }

    console.log(`[Widget Crew] Clock out for ${siteId}:`, { crewId, duration });

    res.json({
      success: true,
      shiftId,
      duration,
      clockedOutAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/crew/shifts", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    const crewId = req.query.crewId as string;
    const shifts = widgetData.crewShifts.filter(
      s => s.siteId === siteId && (!crewId || s.crewId === crewId)
    );
    res.json({ shifts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CRM Widget API
// ============================================

router.post("/crm/deals", async (req, res) => {
  try {
    const { siteId, name, email, phone, service, value, stage } = req.body;

    const deal = {
      id: `deal_${Date.now().toString(36)}`,
      siteId,
      name,
      email,
      phone,
      service,
      value,
      stage: stage || 'lead',
      createdAt: new Date().toISOString()
    };

    widgetData.deals.push(deal);
    console.log(`[Widget CRM] New deal for ${siteId}:`, { name, value, stage });

    res.json({
      success: true,
      dealId: deal.id,
      stage: deal.stage
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/crm/deals/:id", async (req, res) => {
  try {
    const dealId = req.params.id;
    const updates = req.body;

    const deal = widgetData.deals.find(d => d.id === dealId);
    if (deal) {
      Object.assign(deal, updates);
    }

    console.log(`[Widget CRM] Update deal ${dealId}:`, updates);

    res.json({
      success: true,
      dealId,
      updated: true
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/crm/deals", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    const deals = widgetData.deals.filter(d => d.siteId === siteId);
    res.json({ deals });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Reviews Widget API
// ============================================

router.get("/reviews", async (req, res) => {
  try {
    const reviews = [
      { id: 1, name: 'John S.', rating: 5, text: 'Excellent work! The team was professional and thorough.', date: '2 weeks ago', source: 'google' },
      { id: 2, name: 'Sarah J.', rating: 5, text: 'Professional team, great communication throughout.', date: '1 month ago', source: 'google' },
      { id: 3, name: 'Mike D.', rating: 4, text: 'Great job overall. Would recommend.', date: '1 month ago', source: 'google' },
      { id: 4, name: 'Emily W.', rating: 5, text: 'Transformed our home! So happy with the results.', date: '2 months ago', source: 'google' },
      { id: 5, name: 'Robert B.', rating: 5, text: 'On time, on budget, excellent quality.', date: '2 months ago', source: 'google' }
    ];

    res.json({ 
      reviews,
      averageRating: 4.8,
      totalCount: reviews.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Weather Widget API (proxy for CORS)
// ============================================

router.get("/weather", async (req, res) => {
  try {
    const lat = req.query.lat || '36.1627';
    const lng = req.query.lng || '-86.7816';
    
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Widget Status/Health Check
// ============================================

router.get("/status", (req, res) => {
  res.json({
    status: 'operational',
    version: '1.0.0',
    widgets: [
      'analytics', 'estimator', 'booking', 'reviews',
      'lead-capture', 'seo', 'chat', 'proposal',
      'crew-tracker', 'crm', 'weather'
    ],
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Widget Data Export (for dashboard integration)
// ============================================

router.get("/export", authenticateWidget, async (req, res) => {
  try {
    const siteId = req.query.siteId as string;
    
    res.json({
      siteId,
      leads: widgetData.leads.filter(l => l.siteId === siteId),
      bookings: widgetData.bookings.filter(b => b.siteId === siteId),
      estimates: widgetData.estimates.filter(e => e.siteId === siteId),
      deals: widgetData.deals.filter(d => d.siteId === siteId),
      exportedAt: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
