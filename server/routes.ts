import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketServer } from "socket.io";
import { storage } from "./storage";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { 
  insertEstimateRequestSchema, insertLeadSchema, insertEstimateSchema, insertSeoTagSchema,
  insertCrmDealSchema, insertCrmActivitySchema, insertCrmNoteSchema, insertUserPinSchema,
  insertBlockchainStampSchema, insertHallmarkSchema, insertProposalTemplateSchema, insertProposalSchema,
  insertPaymentSchema, insertRoomScanSchema, insertPageViewSchema, ANCHORABLE_TYPES, FOUNDING_ASSETS,
  insertEstimatePhotoSchema, insertEstimatePricingOptionSchema, insertProposalSignatureSchema, insertEstimateFollowupSchema,
  insertDocumentAssetSchema, TENANT_PREFIXES,
  insertCrewLeadSchema, insertCrewMemberSchema, insertTimeEntrySchema, insertJobNoteSchema, insertIncidentReportSchema,
  insertDocumentSchema, insertDocumentVersionSchema, insertDocumentSignatureSchema,
  insertCalendarEventSchema, insertCalendarReminderSchema, insertEventColorPresetSchema,
  insertFranchiseSchema, insertPartnerApiCredentialSchema, insertFranchiseLocationSchema,
  PARTNER_API_SCOPES,
  insertSeoPageSchema, seoPages, seoAudits,
  insertConversationSchema, insertMessageSchema, insertConversationParticipantSchema,
  insertBookingSchema,
  users as usersTable,
  type Lead, type Estimate, type SeoPage, type InsertSeoPage
} from "@shared/schema";
import * as crypto from "crypto";
import OpenAI from "openai";
import { z } from "zod";
import * as solana from "./solana";
import * as darkwave from "./darkwave";
import { orbitEcosystem } from "./orbit";
import * as hallmarkService from "./hallmarkService";
import { sendContactEmail, sendEstimateAcceptedEmail, type ContactFormData } from "./resend";
import { setupCustomAuth, isCustomAuthenticated } from "./customAuth";
import { getTenantFromHostname } from "./tenant";
import type { RequestHandler } from "express";
import * as quickbooks from "./quickbooks";
import xss from "xss";

// Global Socket.IO instance for real-time messaging
let io: SocketServer | null = null;
export function getSocketIO() { return io; }

// Rate limiting for PIN authentication with exponential backoff
const pinAttempts = new Map<string, { count: number; firstAttempt: number; lockoutCount: number; lockedUntil?: number }>();
const PIN_MAX_ATTEMPTS = 5;
const PIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes window for attempts

function getExponentialLockoutDuration(lockoutCount: number): number {
  // 2^lockoutCount minutes (in milliseconds): 2min, 4min, 8min, 16min, etc.
  return Math.pow(2, lockoutCount) * 60 * 1000;
}

function checkPinRateLimit(ip: string, role: string): { allowed: boolean; retryAfter?: number } {
  const key = `${ip}:${role}`;
  const now = Date.now();
  const record = pinAttempts.get(key);

  if (!record) {
    return { allowed: true };
  }

  // Check if currently locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, retryAfter: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  // If lockout expired, reset count but keep lockoutCount for escalation
  if (record.lockedUntil && now >= record.lockedUntil) {
    record.count = 0;
    record.firstAttempt = now;
    record.lockedUntil = undefined;
    pinAttempts.set(key, record);
  }

  return { allowed: true };
}

function recordPinAttempt(ip: string, role: string, success: boolean): void {
  const key = `${ip}:${role}`;
  const now = Date.now();

  if (success) {
    // Successful login clears all history
    pinAttempts.delete(key);
    return;
  }

  const record = pinAttempts.get(key) || { count: 0, firstAttempt: now, lockoutCount: 0 };

  // If the attempt window has passed without reaching limit, reset the count
  if (now - record.firstAttempt > PIN_ATTEMPT_WINDOW && !record.lockedUntil) {
    record.count = 1;
    record.firstAttempt = now;
  } else {
    record.count++;
  }

  // Check if we've reached the limit within the window
  if (record.count >= PIN_MAX_ATTEMPTS) {
    record.lockoutCount++;
    const lockoutDuration = getExponentialLockoutDuration(record.lockoutCount);
    record.lockedUntil = now + lockoutDuration;
    console.log(`[PIN Rate Limit] ${key} locked out for ${lockoutDuration / 60000} minutes (attempt #${record.lockoutCount})`);
  }

  pinAttempts.set(key, record);
}

// Helper function to format time ago
function formatTimeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// XSS sanitization for user-provided text fields using the 'xss' library
const xssOptions = {
  whiteList: {}, // Strip all HTML tags for plain text fields
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
};

function sanitizeText(input: string | null | undefined): string | null {
  if (!input) return input as null;
  return xss(input, xssOptions);
}

// Sanitize object fields for XSS protection
function sanitizeObject<T extends Record<string, any>>(obj: T, fields: string[]): T {
  const result = { ...obj };
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      (result as any)[field] = sanitizeText(result[field]);
    }
  }
  return result;
}

// Role-based access middleware
const hasRole = (allowedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    const sessionUser = (req.session as any)?.user;
    
    if (!sessionUser?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const dbUser = await storage.getUser(sessionUser.id);
      
      if (!dbUser) {
        return res.status(401).json({ message: "User not found" });
      }
      
      if (!dbUser.role || !allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role permissions" });
      }
      
      (req as any).dbUser = dbUser;
      return next();
    } catch (error) {
      console.error("Error checking user role:", error);
      return res.status(500).json({ message: "Failed to verify permissions" });
    }
  };
};


// PWA manifest configurations per tenant
const pwaConfigs: Record<string, {
  name: string;
  shortName: string;
  description: string;
  backgroundColor: string;
  themeColor: string;
  iconPath: string;
}> = {
  npp: {
    name: "Nashville Painting Professionals",
    shortName: "NPP Painters",
    description: "Professional interior & exterior painting services in Nashville, TN",
    backgroundColor: "#3a4f41",
    themeColor: "#3a4f41",
    iconPath: "/pwa/npp"
  },
  paintpros: {
    name: "PaintPros.io",
    shortName: "PaintPros",
    description: "White-label painting business platform by Orbit",
    backgroundColor: "#b49050",
    themeColor: "#d4a853",
    iconPath: "/pwa/paintpros"
  },
  demo: {
    name: "PaintPros.io",
    shortName: "PaintPros",
    description: "White-label painting business platform by Orbit",
    backgroundColor: "#b49050",
    themeColor: "#d4a853",
    iconPath: "/pwa/paintpros"
  }
};


// Track online users: Map<socketId, { userId, role, displayName }>
const onlineUsers = new Map<string, { userId: string; role: string; displayName: string }>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============ SOCKET.IO REAL-TIME MESSAGING ============
  io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    path: "/socket.io"
  });

  io.on("connection", (socket) => {
    console.log("[Socket.IO] User connected:", socket.id);

    // Track user going online
    socket.on("user-online", (data: { userId: string; role: string; displayName: string }) => {
      onlineUsers.set(socket.id, { userId: data.userId, role: data.role, displayName: data.displayName });
      console.log(`[Socket.IO] User online: ${data.displayName} (${data.role})`);
      // Broadcast to all that user is online
      io?.emit("user-status-change", { userId: data.userId, role: data.role, displayName: data.displayName, online: true });
    });

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`[Socket.IO] ${socket.id} joined conversation:${conversationId}`);
    });

    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("send-message", async (data: {
      conversationId: string;
      senderId: string;
      senderRole: string;
      senderName: string;
      content: string;
      messageType?: string;
      attachments?: string[];
    }) => {
      try {
        const message = await storage.createMessage({
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderRole: data.senderRole,
          senderName: data.senderName,
          content: data.content,
          messageType: data.messageType || "text",
          attachments: data.attachments || [],
          isSystemMessage: false
        });
        io?.to(`conversation:${data.conversationId}`).emit("new-message", message);
      } catch (error) {
        console.error("[Socket.IO] Error sending message:", error);
        socket.emit("message-error", { error: "Failed to send message" });
      }
    });

    socket.on("typing", (data: { conversationId: string; userId: string; userName: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit("user-typing", {
        userId: data.userId,
        userName: data.userName
      });
    });

    socket.on("stop-typing", (data: { conversationId: string; userId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit("user-stop-typing", {
        userId: data.userId
      });
    });

    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        console.log(`[Socket.IO] User offline: ${user.displayName} (${user.role})`);
        io?.emit("user-status-change", { userId: user.userId, role: user.role, displayName: user.displayName, online: false });
        onlineUsers.delete(socket.id);
      }
      console.log("[Socket.IO] User disconnected:", socket.id);
    });
  });

  // GET /api/messages/online-users - Get currently online users
  app.get("/api/messages/online-users", (req, res) => {
    // Get unique online users (dedupe by userId)
    const uniqueUsers = new Map<string, { userId: string; role: string; displayName: string }>();
    onlineUsers.forEach((user) => {
      uniqueUsers.set(user.userId, user);
    });
    
    // Developer is always available
    const developerAlwaysOnline = {
      userId: "developer",
      role: "developer", 
      displayName: "Ryan (Developer)",
      alwaysAvailable: true
    };
    
    const users: Array<{ userId: string; role: string; displayName: string; alwaysAvailable: boolean }> = [];
    uniqueUsers.forEach((u) => {
      users.push({ ...u, alwaysAvailable: false });
    });
    
    // Add developer if not already in list
    if (!users.some(u => u.role === "developer")) {
      users.push(developerAlwaysOnline);
    }
    
    res.json(users);
  });

  // ============ CUSTOM AUTH ============
  await setupCustomAuth(app);

  // ============ CUSTOMER PORTAL API ============

  // GET /api/customer/dashboard - Get all customer data
  app.get('/api/customer/dashboard', isCustomAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      const tenantId = getTenantFromHostname(req.hostname);
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.json({ estimates: [], bookings: [], documents: [], preferences: null });
      }

      // Find leads by user email (filtered by tenant)
      const allLeads = await storage.getLeads(tenantId);
      const userLeads = allLeads.filter(l => l.email === user.email || l.userId === userId);
      const leadIds = userLeads.map(l => l.id);

      // Get estimates for user's leads (filtered by tenant)
      const allEstimates = await storage.getEstimates(tenantId);
      const userEstimates = allEstimates.filter(e => leadIds.includes(e.leadId));

      // Get bookings for user
      const allBookings = await storage.getBookings(tenantId);
      const userBookings = allBookings.filter(b => 
        b.customerEmail === user.email || b.userId === userId || leadIds.includes(b.leadId || '')
      );

      // Get documents for user
      const allDocs = await storage.getDocuments(tenantId);
      const userDocuments = allDocs.filter(d => 
        leadIds.includes(d.relatedLeadId || '') || 
        userEstimates.some(e => e.id === d.relatedEstimateId)
      );

      // Get preferences
      const preferences = await storage.getCustomerPreferences(userId);

      res.json({
        estimates: userEstimates,
        bookings: userBookings,
        documents: userDocuments,
        preferences,
        leads: userLeads
      });
    } catch (error) {
      console.error("Error fetching customer dashboard:", error);
      res.status(500).json({ message: "Failed to fetch customer data" });
    }
  });

  // GET /api/customer/preferences - Get customer preferences
  app.get('/api/customer/preferences', isCustomAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      const preferences = await storage.getCustomerPreferences(userId);
      res.json(preferences || {});
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // POST /api/customer/preferences - Create/update customer preferences
  app.post('/api/customer/preferences', isCustomAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      const tenantId = getTenantFromHostname(req.hostname);
      const data = { ...req.body, userId, tenantId };
      const preferences = await storage.upsertCustomerPreferences(data);
      res.json(preferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ message: "Failed to save preferences" });
    }
  });

  // POST /api/customer/link-lead - Link an existing lead to user account
  app.post('/api/customer/link-lead', isCustomAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email not found" });
      }

      // Find and update leads matching user's email (filtered by tenant)
      const tenantId = getTenantFromHostname(req.hostname);
      const leads = await storage.getLeads(tenantId);
      const matchingLeads = leads.filter(l => l.email === user.email && !l.userId);
      
      for (const lead of matchingLeads) {
        await storage.updateLeadUserId(lead.id, userId);
      }

      res.json({ linked: matchingLeads.length });
    } catch (error) {
      console.error("Error linking leads:", error);
      res.status(500).json({ message: "Failed to link leads" });
    }
  });

  // ============ PUSH NOTIFICATIONS API ============

  // GET /api/push/vapid-key - Get public VAPID key for push subscriptions
  app.get('/api/push/vapid-key', (req, res) => {
    const vapidKey = process.env.VAPID_PUBLIC_KEY || '';
    res.json({ publicKey: vapidKey });
  });

  // POST /api/push/subscribe - Register a push subscription (requires authentication)
  app.post('/api/push/subscribe', isCustomAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user?.id;
      const { endpoint, p256dh, auth, userAgent } = req.body;
      
      if (!endpoint || !p256dh || !auth) {
        return res.status(400).json({ message: "Missing subscription data" });
      }

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const tenantId = getTenantFromHostname(req.hostname);
      const subscription = await storage.createPushSubscription({
        endpoint,
        p256dh,
        auth,
        userId,
        tenantId,
        userAgent,
        isActive: true
      });

      res.json({ success: true, id: subscription.id });
    } catch (error) {
      console.error("Error creating push subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // POST /api/push/unsubscribe - Remove a push subscription (requires authentication)
  app.post('/api/push/unsubscribe', isCustomAuthenticated, async (req: any, res) => {
    try {
      const { endpoint } = req.body;
      
      if (!endpoint) {
        return res.status(400).json({ message: "Missing endpoint" });
      }

      // Verify the subscription belongs to the authenticated user
      const subscription = await storage.getPushSubscriptionByEndpoint(endpoint);
      if (subscription && subscription.userId !== (req.session as any).user?.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deletePushSubscription(endpoint);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing push subscription:", error);
      res.status(500).json({ message: "Failed to remove subscription" });
    }
  });

  // ============ TENANT API ============
  
  // GET /api/tenant - Get tenant ID based on hostname
  app.get("/api/tenant", (req, res) => {
    const tenantId = getTenantFromHostname(req.hostname);
    res.json({ 
      tenantId,
      hostname: req.hostname
    });
  });

  // ============ PWA ROUTES (Dynamic per tenant) ============

  // Dynamic manifest.json based on hostname
  app.get("/manifest.json", (req, res) => {
    const tenantId = getTenantFromHostname(req.hostname);
    const config = pwaConfigs[tenantId] || pwaConfigs.npp;
    
    const manifest = {
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      start_url: "/",
      display: "standalone",
      background_color: config.backgroundColor,
      theme_color: config.themeColor,
      orientation: "portrait-primary",
      icons: [
        {
          src: `${config.iconPath}/icon-192.png`,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: `${config.iconPath}/icon-512.png`,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ],
      categories: ["business", "lifestyle"],
      lang: "en-US",
      dir: "ltr"
    };
    
    res.setHeader('Content-Type', 'application/manifest+json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(manifest);
  });

  // Dynamic apple-touch-icon based on hostname
  app.get("/apple-touch-icon.png", (req, res) => {
    const tenantId = getTenantFromHostname(req.hostname);
    const config = pwaConfigs[tenantId] || pwaConfigs.npp;
    res.redirect(`${config.iconPath}/icon-192.png`);
  });

  // Dynamic favicon based on hostname
  app.get("/favicon.ico", (req, res) => {
    const tenantId = getTenantFromHostname(req.hostname);
    const config = pwaConfigs[tenantId] || pwaConfigs.npp;
    res.redirect(`${config.iconPath}/icon-192.png`);
  });

  // ============ CONTRACTOR APPLICATIONS ============
  
  // POST /api/contractor-applications - Submit contractor application
  app.post("/api/contractor-applications", async (req, res) => {
    try {
      const applicationData = req.body;
      console.log("Contractor application received:", applicationData);
      res.status(201).json({ success: true, message: "Application submitted successfully" });
    } catch (error) {
      console.error("Error processing contractor application:", error);
      res.status(500).json({ success: false, error: "Failed to submit application" });
    }
  });

  // ============ CONTACT FORM (Resend) ============
  
  // POST /api/contact - Send contact form email via Resend
  app.post("/api/contact", async (req, res) => {
    try {
      const contactSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        company: z.string().optional(),
        message: z.string().min(10, "Message must be at least 10 characters")
      });
      
      const validatedData = contactSchema.parse(req.body) as ContactFormData;
      const result = await sendContactEmail(validatedData);
      
      if (result.success) {
        res.status(200).json({ success: true, message: "Message sent successfully" });
      } else {
        res.status(500).json({ success: false, error: result.error || "Failed to send message" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Invalid form data", details: error.errors });
      } else {
        console.error("Error sending contact email:", error);
        res.status(500).json({ success: false, error: "Failed to send message" });
      }
    }
  });

  // ============ LEADS ============
  
  // POST /api/leads - Create or get existing lead
  app.post("/api/leads", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const validatedData = insertLeadSchema.parse({ ...req.body, tenantId });
      
      // Check if lead already exists (within tenant)
      let lead = await storage.getLeadByEmail(validatedData.email, tenantId);
      
      if (!lead) {
        lead = await storage.createLead(validatedData);
      }
      
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid email address", details: error.errors });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ error: "Failed to create lead" });
      }
    }
  });

  // GET /api/leads - Get all leads (admin/owner)
  app.get("/api/leads", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const { search } = req.query;
      let leadsList;
      if (search && typeof search === "string") {
        leadsList = await storage.searchLeads(search, tenantId);
      } else {
        leadsList = await storage.getLeads(tenantId);
      }
      res.json(leadsList);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // GET /api/leads/:id - Get a specific lead
  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLeadById(req.params.id);
      if (!lead) {
        res.status(404).json({ error: "Lead not found" });
        return;
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  // ============ ESTIMATES (New Tool) ============
  
  // POST /api/estimates - Create a new estimate
  app.post("/api/estimates", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const validatedData = insertEstimateSchema.parse({ ...req.body, tenantId });
      const estimate = await storage.createEstimate(validatedData);
      
      // TODO: Send email notification to NPP when business email is provided
      // This is where we would trigger the email alert
      
      res.status(201).json(estimate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid estimate data", details: error.errors });
      } else {
        console.error("Error creating estimate:", error);
        res.status(500).json({ error: "Failed to create estimate" });
      }
    }
  });

  // GET /api/estimates - Get all estimates (admin)
  app.get("/api/estimates", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const estimates = await storage.getEstimates(tenantId);
      res.json(estimates);
    } catch (error) {
      console.error("Error fetching estimates:", error);
      res.status(500).json({ error: "Failed to fetch estimates" });
    }
  });

  // GET /api/estimates/:id - Get a specific estimate
  app.get("/api/estimates/:id", async (req, res) => {
    try {
      const estimate = await storage.getEstimateById(req.params.id);
      if (!estimate) {
        res.status(404).json({ error: "Estimate not found" });
        return;
      }
      res.json(estimate);
    } catch (error) {
      console.error("Error fetching estimate:", error);
      res.status(500).json({ error: "Failed to fetch estimate" });
    }
  });

  // POST /api/estimates/:id/accept - Accept an estimate (customer)
  app.post("/api/estimates/:id/accept", isCustomAuthenticated, async (req: any, res) => {
    try {
      const estimate = await storage.getEstimateById(req.params.id);
      if (!estimate) {
        res.status(404).json({ error: "Estimate not found" });
        return;
      }
      
      // Verify the authenticated user owns this estimate via their lead/email
      const userId = (req.session as any).user?.id;
      if (!userId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      // Get user to check email
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      // Get user's leads to verify ownership (filtered by tenant)
      const tenantId = getTenantFromHostname(req.hostname);
      const allLeads = await storage.getLeads(tenantId);
      const userLeads = allLeads.filter((l: Lead) => l.email === user.email || l.userId === userId);
      const leadIds = userLeads.map((l: Lead) => l.id);
      
      if (estimate.leadId && !leadIds.includes(estimate.leadId)) {
        res.status(403).json({ error: "You do not have permission to accept this estimate" });
        return;
      }

      // Update estimate status to accepted using storage layer
      const updatedEstimate = await storage.updateEstimate(req.params.id, { 
        status: "accepted" 
      });
      
      if (!updatedEstimate) {
        res.status(404).json({ error: "Failed to update estimate" });
        return;
      }

      // Send email notifications (async, don't block response)
      const lead = userLeads.find((l: Lead) => l.id === estimate.leadId);
      const customerName = lead?.firstName || user.firstName || user.email?.split("@")[0] || "Customer";
      const tenantName = "PaintPros.io"; // Default tenant name for emails
      
      sendEstimateAcceptedEmail({
        customerName,
        customerEmail: user.email,
        estimateId: updatedEstimate.id,
        estimateTotal: Number(updatedEstimate.totalEstimate) || 0,
        jobType: updatedEstimate.pricingTier === "full_job" ? "Full Interior" : 
                 updatedEstimate.pricingTier === "walls_only" ? "Walls Only" : 
                 updatedEstimate.pricingTier === "doors_only" ? "Doors Only" : "Custom Job",
        squareFootage: updatedEstimate.squareFootage || undefined,
        tenantName
      }).catch(err => console.error("Failed to send estimate accepted email:", err));
      
      res.json(updatedEstimate);
    } catch (error) {
      console.error("Error accepting estimate:", error);
      res.status(500).json({ error: "Failed to accept estimate" });
    }
  });

  // GET /api/estimates/:id/payment - Get payment for an estimate
  app.get("/api/estimates/:id/payment", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByEstimate(req.params.id);
      const payment = payments.length > 0 ? payments[0] : null;
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  // ============ LEGACY ESTIMATE REQUESTS ============
  
  // POST /api/estimate-requests - Create a new estimate request
  app.post("/api/estimate-requests", async (req, res) => {
    try {
      const validatedData = insertEstimateRequestSchema.parse(req.body);
      const estimateRequest = await storage.createEstimateRequest(validatedData);
      res.status(201).json(estimateRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        console.error("Error creating estimate request:", error);
        res.status(500).json({ error: "Failed to create estimate request" });
      }
    }
  });

  // GET /api/estimate-requests - Get all estimate requests (admin)
  app.get("/api/estimate-requests", async (req, res) => {
    try {
      const requests = await storage.getEstimateRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching estimate requests:", error);
      res.status(500).json({ error: "Failed to fetch estimate requests" });
    }
  });

  // GET /api/estimate-requests/:id - Get a specific estimate request
  app.get("/api/estimate-requests/:id", async (req, res) => {
    try {
      const request = await storage.getEstimateRequestById(req.params.id);
      if (!request) {
        res.status(404).json({ error: "Estimate request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching estimate request:", error);
      res.status(500).json({ error: "Failed to fetch estimate request" });
    }
  });

  // PATCH /api/estimate-requests/:id/status - Update estimate request status
  app.patch("/api/estimate-requests/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        res.status(400).json({ error: "Invalid status" });
        return;
      }
      const request = await storage.updateEstimateRequestStatus(req.params.id, status);
      if (!request) {
        res.status(404).json({ error: "Estimate request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      console.error("Error updating estimate request:", error);
      res.status(500).json({ error: "Failed to update estimate request" });
    }
  });

  // ============ SEO TAGS ============
  
  // POST /api/seo-tags - Create a new SEO tag
  app.post("/api/seo-tags", async (req, res) => {
    try {
      const validatedData = insertSeoTagSchema.parse(req.body);
      const tag = await storage.createSeoTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid SEO tag data", details: error.errors });
      } else {
        console.error("Error creating SEO tag:", error);
        res.status(500).json({ error: "Failed to create SEO tag" });
      }
    }
  });

  // GET /api/seo-tags - Get all SEO tags (optionally filter by type)
  app.get("/api/seo-tags", async (req, res) => {
    try {
      const { type } = req.query;
      let tags;
      if (type && typeof type === "string") {
        tags = await storage.getSeoTagsByType(type);
      } else {
        tags = await storage.getSeoTags();
      }
      res.json(tags);
    } catch (error) {
      console.error("Error fetching SEO tags:", error);
      res.status(500).json({ error: "Failed to fetch SEO tags" });
    }
  });

  // PATCH /api/seo-tags/:id/toggle - Toggle SEO tag active status
  app.patch("/api/seo-tags/:id/toggle", async (req, res) => {
    try {
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        res.status(400).json({ error: "Invalid isActive value" });
        return;
      }
      const tag = await storage.toggleSeoTagActive(req.params.id, isActive);
      if (!tag) {
        res.status(404).json({ error: "SEO tag not found" });
        return;
      }
      res.json(tag);
    } catch (error) {
      console.error("Error toggling SEO tag:", error);
      res.status(500).json({ error: "Failed to toggle SEO tag" });
    }
  });

  // DELETE /api/seo-tags/:id - Delete an SEO tag
  app.delete("/api/seo-tags/:id", async (req, res) => {
    try {
      await storage.deleteSeoTag(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting SEO tag:", error);
      res.status(500).json({ error: "Failed to delete SEO tag" });
    }
  });

  // ============ SEO PAGES (Comprehensive SEO Management) ============
  
  // Helper function to calculate SEO score
  function calculateSeoScore(page: Partial<SeoPage>): { score: number; missingFields: string[] } {
    const missingFields: string[] = [];
    let score = 0;
    const maxScore = 100;
    
    // Required fields (10 points each)
    if (page.metaTitle && page.metaTitle.length >= 30 && page.metaTitle.length <= 60) score += 10;
    else missingFields.push("metaTitle (30-60 chars)");
    
    if (page.metaDescription && page.metaDescription.length >= 120 && page.metaDescription.length <= 160) score += 10;
    else missingFields.push("metaDescription (120-160 chars)");
    
    if (page.metaKeywords && page.metaKeywords.length > 0) score += 5;
    else missingFields.push("metaKeywords");
    
    if (page.canonicalUrl) score += 5;
    else missingFields.push("canonicalUrl");
    
    // Open Graph (5 points each)
    if (page.ogTitle) score += 5; else missingFields.push("ogTitle");
    if (page.ogDescription) score += 5; else missingFields.push("ogDescription");
    if (page.ogImage) score += 10; else missingFields.push("ogImage");
    if (page.ogType) score += 5;
    
    // Twitter Card (5 points each)
    if (page.twitterTitle) score += 5; else missingFields.push("twitterTitle");
    if (page.twitterDescription) score += 5; else missingFields.push("twitterDescription");
    if (page.twitterImage) score += 10; else missingFields.push("twitterImage");
    if (page.twitterCard) score += 5;
    
    // Structured Data (20 points)
    if (page.structuredData && page.structuredDataType) score += 20;
    else missingFields.push("structuredData (JSON-LD)");
    
    return { score: Math.min(score, maxScore), missingFields };
  }
  
  // GET /api/seo/pages - Get all SEO pages for a tenant
  app.get("/api/seo/pages", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const pages = await db.select().from(seoPages).where(eq(seoPages.tenantId, tenantId));
      res.json(pages);
    } catch (error) {
      console.error("Error fetching SEO pages:", error);
      res.status(500).json({ error: "Failed to fetch SEO pages" });
    }
  });
  
  // GET /api/seo/pages/:id - Get a specific SEO page
  app.get("/api/seo/pages/:id", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const [page] = await db.select().from(seoPages)
        .where(and(eq(seoPages.id, req.params.id), eq(seoPages.tenantId, tenantId)));
      if (!page) {
        res.status(404).json({ error: "SEO page not found" });
        return;
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching SEO page:", error);
      res.status(500).json({ error: "Failed to fetch SEO page" });
    }
  });
  
  // GET /api/seo/pages/path/:path - Get SEO page by path
  app.get("/api/seo/pages/path/*", async (req, res) => {
    try {
      const path = "/" + ((req.params as any)[0] || "");
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const [page] = await db.select().from(seoPages)
        .where(and(eq(seoPages.pagePath, path), eq(seoPages.tenantId, tenantId)));
      
      if (!page) {
        res.status(404).json({ error: "SEO page not found" });
        return;
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching SEO page by path:", error);
      res.status(500).json({ error: "Failed to fetch SEO page" });
    }
  });
  
  // POST /api/seo/pages - Create a new SEO page
  app.post("/api/seo/pages", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const rawData = { ...req.body, tenantId };
      
      // Sanitize text fields that could contain HTML/XSS
      const seoTextFields = ['metaTitle', 'metaDescription', 'metaKeywords', 'ogTitle', 'ogDescription', 'twitterTitle', 'twitterDescription', 'pageTitle'];
      const sanitizedData = sanitizeObject(rawData, seoTextFields);
      
      const validatedData = insertSeoPageSchema.parse(sanitizedData);
      
      // Calculate SEO score
      const { score, missingFields } = calculateSeoScore(validatedData);
      
      const [page] = await db.insert(seoPages).values({
        ...validatedData,
        seoScore: score,
        missingFields,
        lastAuditAt: new Date(),
      }).returning();
      
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid SEO page data", details: error.errors });
      } else {
        console.error("Error creating SEO page:", error);
        res.status(500).json({ error: "Failed to create SEO page" });
      }
    }
  });
  
  // PATCH /api/seo/pages/:id - Update an SEO page
  app.patch("/api/seo/pages/:id", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const [existing] = await db.select().from(seoPages)
        .where(and(eq(seoPages.id, req.params.id), eq(seoPages.tenantId, tenantId)));
      if (!existing) {
        res.status(404).json({ error: "SEO page not found" });
        return;
      }
      
      const updatedData = { ...existing, ...req.body };
      const { score, missingFields } = calculateSeoScore(updatedData);
      
      // Track changes for audit
      const changes: Record<string, { old: any; new: any }> = {};
      for (const key of Object.keys(req.body)) {
        if ((existing as any)[key] !== req.body[key]) {
          changes[key] = { old: (existing as any)[key], new: req.body[key] };
        }
      }
      
      const [page] = await db.update(seoPages)
        .set({
          ...req.body,
          seoScore: score,
          missingFields,
          lastAuditAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(seoPages.id, req.params.id))
        .returning();
      
      // Create audit log
      if (Object.keys(changes).length > 0) {
        await db.insert(seoAudits).values({
          seoPageId: req.params.id,
          tenantId: existing.tenantId,
          auditType: "edit",
          previousScore: existing.seoScore,
          newScore: score,
          changes,
          performedBy: (req.session as any)?.user?.email || "system",
        });
      }
      
      res.json(page);
    } catch (error) {
      console.error("Error updating SEO page:", error);
      res.status(500).json({ error: "Failed to update SEO page" });
    }
  });
  
  // DELETE /api/seo/pages/:id - Delete an SEO page
  app.delete("/api/seo/pages/:id", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      await db.delete(seoPages).where(and(eq(seoPages.id, req.params.id), eq(seoPages.tenantId, tenantId)));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting SEO page:", error);
      res.status(500).json({ error: "Failed to delete SEO page" });
    }
  });
  
  // POST /api/seo/pages/initialize - Initialize SEO pages with defaults for all routes
  app.post("/api/seo/pages/initialize", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      
      // Default pages to initialize
      const defaultPages = [
        { pagePath: "/", pageTitle: "Home" },
        { pagePath: "/services", pageTitle: "Services" },
        { pagePath: "/estimator", pageTitle: "Free Estimate" },
        { pagePath: "/portfolio", pageTitle: "Portfolio" },
        { pagePath: "/about", pageTitle: "About Us" },
        { pagePath: "/contact", pageTitle: "Contact" },
        { pagePath: "/book", pageTitle: "Book Appointment" },
        { pagePath: "/faq", pageTitle: "FAQ" },
        { pagePath: "/help", pageTitle: "Help Center" },
        { pagePath: "/account", pageTitle: "My Account" },
        { pagePath: "/auth", pageTitle: "Sign In" },
      ];
      
      const created: SeoPage[] = [];
      
      for (const page of defaultPages) {
        // Check if page already exists
        const [existing] = await db.select().from(seoPages)
          .where(and(eq(seoPages.pagePath, page.pagePath), eq(seoPages.tenantId, tenantId)));
        
        if (!existing) {
          const [newPage] = await db.insert(seoPages).values({
            tenantId,
            pagePath: page.pagePath,
            pageTitle: page.pageTitle,
            seoScore: 0,
            missingFields: ["metaTitle (30-60 chars)", "metaDescription (120-160 chars)", "metaKeywords", "canonicalUrl", "ogTitle", "ogDescription", "ogImage", "twitterTitle", "twitterDescription", "twitterImage", "structuredData (JSON-LD)"],
          }).returning();
          created.push(newPage);
        }
      }
      
      res.json({ message: `Initialized ${created.length} SEO pages`, pages: created });
    } catch (error) {
      console.error("Error initializing SEO pages:", error);
      res.status(500).json({ error: "Failed to initialize SEO pages" });
    }
  });
  
  // GET /api/seo/audits - Get SEO audit history
  app.get("/api/seo/audits", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const audits = await db.select().from(seoAudits)
        .where(eq(seoAudits.tenantId, tenantId))
        .orderBy(desc(seoAudits.createdAt))
        .limit(100);
      res.json(audits);
    } catch (error) {
      console.error("Error fetching SEO audits:", error);
      res.status(500).json({ error: "Failed to fetch SEO audits" });
    }
  });
  
  // GET /api/seo/summary - Get SEO summary stats
  app.get("/api/seo/summary", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const pages = await db.select().from(seoPages).where(eq(seoPages.tenantId, tenantId));
      
      const totalPages = pages.length;
      const averageScore = totalPages > 0 ? Math.round(pages.reduce((acc, p) => acc + (p.seoScore || 0), 0) / totalPages) : 0;
      const pagesWithFullSeo = pages.filter(p => (p.seoScore || 0) >= 80).length;
      const pagesNeedingWork = pages.filter(p => (p.seoScore || 0) < 50).length;
      
      res.json({
        totalPages,
        averageScore,
        pagesWithFullSeo,
        pagesNeedingWork,
        pages: pages.map(p => ({
          id: p.id,
          pagePath: p.pagePath,
          pageTitle: p.pageTitle,
          seoScore: p.seoScore,
          missingFields: p.missingFields,
        })),
      });
    } catch (error) {
      console.error("Error fetching SEO summary:", error);
      res.status(500).json({ error: "Failed to fetch SEO summary" });
    }
  });

  // ============ CRM DEALS ============
  
  // GET /api/crm/deals - Get all deals
  app.get("/api/crm/deals", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const { stage } = req.query;
      let deals;
      if (stage && typeof stage === "string") {
        deals = await storage.getCrmDealsByStage(stage, tenantId);
      } else {
        deals = await storage.getCrmDeals(tenantId);
      }
      res.json(deals);
    } catch (error) {
      console.error("Error fetching deals:", error);
      res.status(500).json({ error: "Failed to fetch deals" });
    }
  });

  // GET /api/crm/deals/pipeline/summary - Get pipeline summary
  app.get("/api/crm/deals/pipeline/summary", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const summary = await storage.getCrmPipelineSummary(tenantId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching pipeline summary:", error);
      res.status(500).json({ error: "Failed to fetch pipeline summary" });
    }
  });

  // GET /api/crm/deals/:id - Get a specific deal
  app.get("/api/crm/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getCrmDealById(req.params.id);
      if (!deal) {
        res.status(404).json({ error: "Deal not found" });
        return;
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching deal:", error);
      res.status(500).json({ error: "Failed to fetch deal" });
    }
  });

  // POST /api/crm/deals - Create a new deal
  app.post("/api/crm/deals", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      // Sanitize text fields that could contain XSS
      const textFields = ['title', 'notes', 'jobAddress'];
      const sanitizedBody = sanitizeObject({ ...req.body, tenantId }, textFields);
      const validatedData = insertCrmDealSchema.parse(sanitizedBody);
      const deal = await storage.createCrmDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid deal data", details: error.errors });
      } else {
        console.error("Error creating deal:", error);
        res.status(500).json({ error: "Failed to create deal" });
      }
    }
  });

  // PATCH /api/crm/deals/:id - Update a deal
  app.patch("/api/crm/deals/:id", async (req, res) => {
    try {
      // Validate partial update using partial schema
      const partialSchema = insertCrmDealSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      
      // Sanitize text fields that could contain XSS
      const textFields = ['title', 'notes', 'jobAddress'];
      const sanitizedData = sanitizeObject(validatedData, textFields);
      
      const deal = await storage.updateCrmDeal(req.params.id, sanitizedData);
      if (!deal) {
        res.status(404).json({ error: "Deal not found" });
        return;
      }
      res.json(deal);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid deal data", details: error.errors });
        return;
      }
      console.error("Error updating deal:", error);
      res.status(500).json({ error: "Failed to update deal" });
    }
  });

  // DELETE /api/crm/deals/:id - Delete a deal
  app.delete("/api/crm/deals/:id", async (req, res) => {
    try {
      await storage.deleteCrmDeal(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting deal:", error);
      res.status(500).json({ error: "Failed to delete deal" });
    }
  });

  // POST /api/crm/deals/:id/convert-to-job - Convert a won deal to a job
  app.post("/api/crm/deals/:id/convert-to-job", async (req, res) => {
    try {
      const existingDeal = await storage.getCrmDealById(req.params.id);
      if (!existingDeal) {
        res.status(404).json({ error: "Deal not found" });
        return;
      }
      
      const { crewLeadId, crewLeadName, jobStartDate, jobEndDate, invoiceNumber, jobAddress } = req.body;
      
      // Create a new job entry based on the won deal
      const jobData = {
        title: existingDeal.title,
        value: existingDeal.value,
        stage: "project_accepted",
        pipelineType: "jobs",
        crewLeadId: crewLeadId || null,
        crewLeadName: crewLeadName || null,
        jobStartDate: jobStartDate ? new Date(jobStartDate) : null,
        jobEndDate: jobEndDate ? new Date(jobEndDate) : null,
        invoiceNumber: invoiceNumber || null,
        jobAddress: jobAddress || null,
        convertedFromDealId: existingDeal.id,
        leadId: existingDeal.leadId,
        notes: existingDeal.notes,
      };
      
      const newJob = await storage.createCrmDeal(jobData);
      
      // Mark the original deal as converted (optional: keep it in won state or update notes)
      await storage.updateCrmDeal(existingDeal.id, { 
        notes: `${existingDeal.notes || ""}\n[Converted to Job: ${newJob.id}]`.trim()
      });
      
      res.status(201).json(newJob);
    } catch (error) {
      console.error("Error converting deal to job:", error);
      res.status(500).json({ error: "Failed to convert deal to job" });
    }
  });

  // ============ CRM ACTIVITIES ============
  
  // GET /api/crm/activities - Get all activities
  app.get("/api/crm/activities", async (req, res) => {
    try {
      const activities = await storage.getAllCrmActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // GET /api/crm/activities/:entityType/:entityId - Get activities for an entity
  app.get("/api/crm/activities/:entityType/:entityId", async (req, res) => {
    try {
      const activities = await storage.getCrmActivitiesByEntity(req.params.entityType, req.params.entityId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // POST /api/crm/activities - Create a new activity
  app.post("/api/crm/activities", async (req, res) => {
    try {
      const validatedData = insertCrmActivitySchema.parse(req.body);
      const activity = await storage.createCrmActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid activity data", details: error.errors });
      } else {
        console.error("Error creating activity:", error);
        res.status(500).json({ error: "Failed to create activity" });
      }
    }
  });

  // ============ CRM NOTES ============
  
  // GET /api/crm/notes/:entityType/:entityId - Get notes for an entity
  app.get("/api/crm/notes/:entityType/:entityId", async (req, res) => {
    try {
      const notes = await storage.getCrmNotesByEntity(req.params.entityType, req.params.entityId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  // POST /api/crm/notes - Create a new note
  app.post("/api/crm/notes", async (req, res) => {
    try {
      // Sanitize content field for XSS
      const sanitizedBody = {
        ...req.body,
        content: req.body.content ? sanitizeText(req.body.content) : req.body.content
      };
      const validatedData = insertCrmNoteSchema.parse(sanitizedBody);
      const note = await storage.createCrmNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid note data", details: error.errors });
      } else {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Failed to create note" });
      }
    }
  });

  // PATCH /api/crm/notes/:id - Update a note
  app.patch("/api/crm/notes/:id", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        res.status(400).json({ error: "Invalid content" });
        return;
      }
      // Sanitize content for XSS (content is validated as string above, so sanitizeText won't return null)
      const sanitizedContent = sanitizeText(content) as string;
      const note = await storage.updateCrmNote(req.params.id, sanitizedContent);
      if (!note) {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // DELETE /api/crm/notes/:id - Delete a note
  app.delete("/api/crm/notes/:id", async (req, res) => {
    try {
      await storage.deleteCrmNote(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  // ============ USER PINS ============
  
  // GET /api/auth/pin/:role - Check if PIN change is required
  app.get("/api/auth/pin/:role", async (req, res) => {
    try {
      const userPin = await storage.getUserPinByRole(req.params.role);
      if (!userPin) {
        res.json({ exists: false, mustChangePin: true });
        return;
      }
      res.json({ exists: true, mustChangePin: userPin.mustChangePin });
    } catch (error) {
      console.error("Error checking PIN:", error);
      res.status(500).json({ error: "Failed to check PIN" });
    }
  });

  // POST /api/auth/pin/verify - Verify PIN (with rate limiting)
  app.post("/api/auth/pin/verify", async (req, res) => {
    try {
      const { role, pin } = req.body;
      if (!role || !pin) {
        res.status(400).json({ error: "Role and PIN required" });
        return;
      }

      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const rateLimit = checkPinRateLimit(clientIp, role);
      
      if (!rateLimit.allowed) {
        res.status(429).json({ 
          error: "Too many failed attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        });
        return;
      }

      const userPin = await storage.getUserPinByRole(role);
      if (!userPin) {
        recordPinAttempt(clientIp, role, false);
        res.json({ valid: false, mustChangePin: false });
        return;
      }
      
      const valid = userPin.pin === pin;
      recordPinAttempt(clientIp, role, valid);
      
      res.json({ valid, mustChangePin: valid ? userPin.mustChangePin : false });
    } catch (error) {
      console.error("Error verifying PIN:", error);
      res.status(500).json({ error: "Failed to verify PIN" });
    }
  });

  // POST /api/auth/pin/change - Change PIN (with rate limiting)
  app.post("/api/auth/pin/change", async (req, res) => {
    try {
      const { role, currentPin, newPin } = req.body;
      if (!role || !currentPin || !newPin) {
        res.status(400).json({ error: "Role, current PIN, and new PIN required" });
        return;
      }

      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const rateLimit = checkPinRateLimit(clientIp, `change:${role}`);
      
      if (!rateLimit.allowed) {
        res.status(429).json({ 
          error: "Too many failed attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        });
        return;
      }

      const userPin = await storage.getUserPinByRole(role);
      if (!userPin || userPin.pin !== currentPin) {
        recordPinAttempt(clientIp, `change:${role}`, false);
        res.status(401).json({ error: "Invalid current PIN" });
        return;
      }
      
      recordPinAttempt(clientIp, `change:${role}`, true);
      const updated = await storage.updateUserPin(role, newPin, false);
      res.json({ success: true, updated });
    } catch (error) {
      console.error("Error changing PIN:", error);
      res.status(500).json({ error: "Failed to change PIN" });
    }
  });

  // POST /api/auth/pin/init - Initialize default PINs (run once on setup)
  app.post("/api/auth/pin/init", async (req, res) => {
    try {
      const defaultPins = [
        { role: "ops_manager", pin: "4444", mustChangePin: true },
        { role: "owner", pin: "1111", mustChangePin: true },
        { role: "project_manager", pin: "2222", mustChangePin: false },
        { role: "crew_lead", pin: "3333", mustChangePin: false },
        { role: "developer", pin: "0424", mustChangePin: false },
        { role: "demo_viewer", pin: "7777", mustChangePin: false }
      ];
      
      for (const pinData of defaultPins) {
        await storage.createOrUpdateUserPin(pinData);
      }
      
      res.json({ success: true, message: "PINs initialized" });
    } catch (error) {
      console.error("Error initializing PINs:", error);
      res.status(500).json({ error: "Failed to initialize PINs" });
    }
  });

  // POST /api/auth/pin/verify-any - Verify PIN against all roles (returns matching role)
  app.post("/api/auth/pin/verify-any", async (req, res) => {
    try {
      const { pin } = req.body;
      if (!pin) {
        res.status(400).json({ success: false, message: "PIN required" });
        return;
      }

      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const rateLimit = checkPinRateLimit(clientIp, "any");
      
      if (!rateLimit.allowed) {
        res.status(429).json({ 
          success: false,
          message: "Too many failed attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        });
        return;
      }

      // Check PIN against all known roles
      const roles = ["owner", "ops_manager", "project_manager", "crew_lead", "developer", "demo_viewer"];
      
      for (const role of roles) {
        const userPin = await storage.getUserPinByRole(role);
        if (userPin && userPin.pin === pin) {
          recordPinAttempt(clientIp, "any", true);
          res.json({ 
            success: true, 
            role,
            mustChangePin: userPin.mustChangePin 
          });
          return;
        }
      }
      
      recordPinAttempt(clientIp, "any", false);
      res.json({ success: false, message: "Invalid PIN" });
    } catch (error) {
      console.error("Error verifying PIN:", error);
      res.status(500).json({ success: false, message: "Failed to verify PIN" });
    }
  });

  // ============ BLOCKCHAIN STAMPING ============
  
  // POST /api/blockchain/hash - Generate hash from data
  app.post("/api/blockchain/hash", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data || typeof data !== "string") {
        res.status(400).json({ error: "Data string required" });
        return;
      }
      const hash = solana.hashData(data);
      res.json({ hash });
    } catch (error) {
      console.error("Error hashing data:", error);
      res.status(500).json({ error: "Failed to hash data" });
    }
  });
  
  // POST /api/blockchain/stamp - Stamp hash to Solana blockchain
  app.post("/api/blockchain/stamp", async (req, res) => {
    try {
      const { entityType, entityId, documentHash, network = "mainnet-beta" } = req.body;
      
      if (!entityType || !entityId || !documentHash) {
        res.status(400).json({ error: "entityType, entityId, and documentHash required" });
        return;
      }
      
      const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
      if (!privateKey) {
        res.status(500).json({ error: "Solana wallet not configured" });
        return;
      }
      
      const stamp = await storage.createBlockchainStamp({
        entityType,
        entityId,
        documentHash,
        network
      });
      
      try {
        const wallet = solana.getWalletFromPrivateKey(privateKey);
        const result = await solana.stampHashToBlockchain(documentHash, wallet, network, { entityType, entityId });
        
        const updated = await storage.updateBlockchainStampStatus(
          stamp.id, 
          "confirmed", 
          result.signature, 
          result.slot, 
          result.blockTime
        );
        
        res.status(201).json({
          ...updated,
          explorerUrl: network === "devnet" 
            ? `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
            : `https://explorer.solana.com/tx/${result.signature}`
        });
      } catch (stampError: any) {
        await storage.updateBlockchainStampStatus(stamp.id, "failed");
        console.error("Blockchain stamp failed:", stampError);
        res.status(500).json({ 
          error: "Failed to stamp to blockchain", 
          details: stampError.message,
          stamp 
        });
      }
    } catch (error) {
      console.error("Error creating stamp:", error);
      res.status(500).json({ error: "Failed to create stamp" });
    }
  });
  
  // GET /api/blockchain/stamps - Get all stamps
  app.get("/api/blockchain/stamps", async (req, res) => {
    try {
      const stamps = await storage.getBlockchainStamps();
      res.json(stamps);
    } catch (error) {
      console.error("Error fetching stamps:", error);
      res.status(500).json({ error: "Failed to fetch stamps" });
    }
  });
  
  // GET /api/blockchain/stamps/:entityType/:entityId - Get stamps for entity
  app.get("/api/blockchain/stamps/:entityType/:entityId", async (req, res) => {
    try {
      const stamps = await storage.getBlockchainStampsByEntity(req.params.entityType, req.params.entityId);
      res.json(stamps);
    } catch (error) {
      console.error("Error fetching stamps:", error);
      res.status(500).json({ error: "Failed to fetch stamps" });
    }
  });
  
  // POST /api/blockchain/verify - Verify a stamp on blockchain
  app.post("/api/blockchain/verify", async (req, res) => {
    try {
      const { signature, network = "devnet" } = req.body;
      if (!signature) {
        res.status(400).json({ error: "Transaction signature required" });
        return;
      }
      const result = await solana.verifyStamp(signature, network);
      res.json(result);
    } catch (error) {
      console.error("Error verifying stamp:", error);
      res.status(500).json({ error: "Failed to verify stamp" });
    }
  });
  
  // POST /api/blockchain/wallet/generate - Generate new wallet (dev only)
  app.post("/api/blockchain/wallet/generate", async (req, res) => {
    try {
      const wallet = solana.generateNewWallet();
      res.json(wallet);
    } catch (error) {
      console.error("Error generating wallet:", error);
      res.status(500).json({ error: "Failed to generate wallet" });
    }
  });
  
  // GET /api/blockchain/wallet/balance - Get wallet balance
  app.get("/api/blockchain/wallet/balance", async (req, res) => {
    try {
      const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
      const network = (req.query.network as string) || "mainnet-beta";
      
      if (!privateKey) {
        res.status(500).json({ error: "Solana wallet not configured" });
        return;
      }
      
      const wallet = solana.getWalletFromPrivateKey(privateKey);
      const publicKey = wallet.publicKey.toBase58();
      const balance = await solana.getWalletBalance(publicKey, network as "devnet" | "mainnet-beta");
      res.json({ publicKey, balance, network });
    } catch (error) {
      console.error("Error getting balance:", error);
      res.status(500).json({ error: "Failed to get balance" });
    }
  });
  
  // POST /api/blockchain/wallet/airdrop - Request devnet airdrop
  app.post("/api/blockchain/wallet/airdrop", async (req, res) => {
    try {
      const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
      
      if (!privateKey) {
        res.status(500).json({ error: "Solana wallet not configured" });
        return;
      }
      
      const wallet = solana.getWalletFromPrivateKey(privateKey);
      const publicKey = wallet.publicKey.toBase58();
      const signature = await solana.requestDevnetAirdrop(publicKey);
      const balance = await solana.getWalletBalance(publicKey, "devnet");
      
      res.json({ 
        success: true, 
        signature, 
        newBalance: balance,
        explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      });
    } catch (error) {
      console.error("Error requesting airdrop:", error);
      res.status(500).json({ error: "Failed to request airdrop" });
    }
  });

  // ============ ORBIT ECOSYSTEM ============
  
  // GET /api/orbit/status - Check Orbit connection status
  app.get("/api/orbit/status", async (req, res) => {
    try {
      const status = orbitEcosystem.getConnectionStatus();
      if (status.connected) {
        try {
          const ping = await orbitEcosystem.ping();
          res.json({ ...status, health: ping });
        } catch {
          res.json({ ...status, health: { status: 'unreachable' } });
        }
      } else {
        res.json(status);
      }
    } catch (error) {
      console.error("Error checking Orbit status:", error);
      res.status(500).json({ error: "Failed to check Orbit status" });
    }
  });

  // GET /api/orbit/employees - Get employees from staffing app
  app.get("/api/orbit/employees", async (req, res) => {
    try {
      if (!orbitEcosystem.isConnected()) {
        res.status(503).json({ error: "Orbit Ecosystem not configured" });
        return;
      }
      const employees = await orbitEcosystem.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees from Orbit" });
    }
  });

  // POST /api/orbit/employees - Sync employee to staffing app
  app.post("/api/orbit/employees", async (req, res) => {
    try {
      if (!orbitEcosystem.isConnected()) {
        res.status(503).json({ error: "Orbit Ecosystem not configured" });
        return;
      }
      const employee = await orbitEcosystem.syncEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error syncing employee:", error);
      res.status(500).json({ error: "Failed to sync employee to Orbit" });
    }
  });

  // GET /api/orbit/payroll - Get payroll records
  app.get("/api/orbit/payroll", async (req, res) => {
    try {
      if (!orbitEcosystem.isConnected()) {
        res.status(503).json({ error: "Orbit Ecosystem not configured" });
        return;
      }
      const employeeId = req.query.employeeId as string | undefined;
      const records = await orbitEcosystem.getPayrollRecords(employeeId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching payroll:", error);
      res.status(500).json({ error: "Failed to fetch payroll from Orbit" });
    }
  });

  // POST /api/orbit/payroll - Submit payroll record
  app.post("/api/orbit/payroll", async (req, res) => {
    try {
      if (!orbitEcosystem.isConnected()) {
        res.status(503).json({ error: "Orbit Ecosystem not configured" });
        return;
      }
      const record = await orbitEcosystem.submitPayroll(req.body);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error submitting payroll:", error);
      res.status(500).json({ error: "Failed to submit payroll to Orbit" });
    }
  });

  // GET /api/orbit/snippets - Get shared code snippets
  app.get("/api/orbit/snippets", async (req, res) => {
    try {
      if (!orbitEcosystem.isConnected()) {
        res.status(503).json({ error: "Orbit Ecosystem not configured" });
        return;
      }
      const tag = req.query.tag as string | undefined;
      const snippets = tag 
        ? await orbitEcosystem.getSnippetsByTag(tag)
        : await orbitEcosystem.getSharedSnippets();
      res.json(snippets);
    } catch (error) {
      console.error("Error fetching snippets:", error);
      res.status(500).json({ error: "Failed to fetch snippets from Orbit" });
    }
  });

  // POST /api/orbit/snippets - Share a code snippet
  app.post("/api/orbit/snippets", async (req, res) => {
    try {
      if (!orbitEcosystem.isConnected()) {
        res.status(503).json({ error: "Orbit Ecosystem not configured" });
        return;
      }
      const snippet = await orbitEcosystem.shareSnippet(req.body);
      res.status(201).json(snippet);
    } catch (error) {
      console.error("Error sharing snippet:", error);
      res.status(500).json({ error: "Failed to share snippet to Orbit" });
    }
  });

  // ============ ORBIT HALLMARK SYSTEM ============
  
  // POST /api/hallmarks - Create a new hallmark
  app.post("/api/hallmarks", async (req, res) => {
    try {
      const { assetType, recipientName, recipientRole, createdBy, content, metadata = {}, referenceId, useAssetNumber } = req.body;
      
      if (!assetType || !recipientName || !recipientRole || !createdBy || !content) {
        res.status(400).json({ error: "Missing required fields: assetType, recipientName, recipientRole, createdBy, content" });
        return;
      }
      
      let assetNumber: string | undefined;
      if (useAssetNumber) {
        const nextNumber = await storage.getNextAssetNumber();
        assetNumber = hallmarkService.formatAssetNumber(nextNumber);
      }
      
      const hallmarkData = hallmarkService.createHallmarkData(
        assetType, recipientName, recipientRole, createdBy, content, metadata, referenceId, assetNumber
      );
      
      const hallmark = await storage.createHallmark({
        hallmarkNumber: hallmarkData.hallmarkNumber,
        assetNumber: hallmarkData.assetNumber,
        assetType: hallmarkData.assetType,
        referenceId: hallmarkData.referenceId,
        createdBy: hallmarkData.createdBy,
        recipientName: hallmarkData.recipientName,
        recipientRole: hallmarkData.recipientRole,
        contentHash: hallmarkData.contentHash,
        metadata: hallmarkData.metadata,
        searchTerms: hallmarkData.searchTerms,
      });
      
      await storage.createHallmarkAudit({
        hallmarkId: hallmark.id,
        action: 'created',
        actor: createdBy,
        details: { assetType, referenceId },
      });
      
      let blockchainStatus = { queued: false, message: 'Not configured for anchoring' };
      if (hallmarkService.shouldAnchorToBlockchain(assetType)) {
        await storage.queueHashForAnchoring({
          hallmarkId: hallmark.id,
          contentHash: hallmarkData.contentHash,
          assetType,
        });
        blockchainStatus = { queued: true, message: 'Queued for blockchain anchoring' };
      }
      
      res.status(201).json({ hallmark, blockchainStatus });
    } catch (error) {
      console.error("Error creating hallmark:", error);
      res.status(500).json({ error: "Failed to create hallmark" });
    }
  });
  
  // GET /api/hallmarks - Get all hallmarks
  app.get("/api/hallmarks", async (req, res) => {
    try {
      const { search, type } = req.query;
      let result;
      if (search && typeof search === 'string') {
        result = await storage.searchHallmarks(search);
      } else if (type && typeof type === 'string') {
        result = await storage.getHallmarksByType(type);
      } else {
        result = await storage.getHallmarks();
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching hallmarks:", error);
      res.status(500).json({ error: "Failed to fetch hallmarks" });
    }
  });
  
  // GET /api/hallmarks/:hallmarkNumber - Get hallmark by number
  app.get("/api/hallmarks/:hallmarkNumber", async (req, res) => {
    try {
      const hallmark = await storage.getHallmarkByNumber(req.params.hallmarkNumber);
      if (!hallmark) {
        res.status(404).json({ error: "Hallmark not found" });
        return;
      }
      const badge = hallmarkService.getAssetBadge(hallmark.assetNumber || hallmark.hallmarkNumber);
      res.json({ hallmark, badge });
    } catch (error) {
      console.error("Error fetching hallmark:", error);
      res.status(500).json({ error: "Failed to fetch hallmark" });
    }
  });
  
  // GET /api/verify/:hallmarkNumber - Public verification endpoint
  app.get("/api/verify/:hallmarkNumber", async (req, res) => {
    try {
      const hallmark = await storage.getHallmarkByNumber(req.params.hallmarkNumber);
      if (!hallmark) {
        res.json({ valid: false, error: "Hallmark not found" });
        return;
      }
      
      await storage.createHallmarkAudit({
        hallmarkId: hallmark.id,
        action: 'verified',
        actor: 'public',
        details: { timestamp: new Date().toISOString() },
      });
      
      const badge = hallmarkService.getAssetBadge(hallmark.assetNumber || hallmark.hallmarkNumber);
      
      res.json({
        valid: true,
        hallmark: {
          hallmarkNumber: hallmark.hallmarkNumber,
          assetNumber: hallmark.assetNumber,
          assetType: hallmark.assetType,
          recipientName: hallmark.recipientName,
          createdAt: hallmark.createdAt,
          verifiedAt: hallmark.verifiedAt,
        },
        badge,
        blockchain: hallmark.blockchainTxSignature ? {
          verified: true,
          transactionSignature: hallmark.blockchainTxSignature,
          explorerUrl: hallmark.blockchainExplorerUrl,
        } : { verified: false },
      });
    } catch (error) {
      console.error("Error verifying hallmark:", error);
      res.status(500).json({ error: "Failed to verify hallmark" });
    }
  });
  
  // GET /api/hallmarks/:hallmarkNumber/badge - Get badge tier for hallmark
  app.get("/api/hallmarks/:hallmarkNumber/badge", async (req, res) => {
    try {
      const badge = hallmarkService.getAssetBadge(req.params.hallmarkNumber);
      res.json(badge);
    } catch (error) {
      console.error("Error getting badge:", error);
      res.status(500).json({ error: "Failed to get badge" });
    }
  });
  
  // GET /api/hallmarks/:id/audit - Get audit trail for hallmark
  app.get("/api/hallmarks/:id/audit", async (req, res) => {
    try {
      const audits = await storage.getHallmarkAudits(req.params.id);
      res.json(audits);
    } catch (error) {
      console.error("Error fetching audit trail:", error);
      res.status(500).json({ error: "Failed to fetch audit trail" });
    }
  });
  
  // POST /api/hallmarks/:id/anchor - Anchor hallmark to blockchain
  app.post("/api/hallmarks/:id/anchor", async (req, res) => {
    try {
      const hallmark = await storage.getHallmarkById(req.params.id);
      if (!hallmark) {
        res.status(404).json({ error: "Hallmark not found" });
        return;
      }
      
      const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
      if (!privateKey) {
        res.status(500).json({ error: "Solana wallet not configured" });
        return;
      }
      
      const wallet = solana.getWalletFromPrivateKey(privateKey);
      const network = (req.body.network || "mainnet-beta") as "devnet" | "mainnet-beta";
      
      const result = await solana.stampHashToBlockchain(
        hallmark.contentHash,
        wallet,
        network,
        { entityType: hallmark.assetType, entityId: hallmark.id }
      );
      
      const explorerUrl = network === "devnet"
        ? `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
        : `https://explorer.solana.com/tx/${result.signature}`;
      
      const updated = await storage.updateHallmarkBlockchain(hallmark.id, result.signature, explorerUrl);
      
      await storage.createHallmarkAudit({
        hallmarkId: hallmark.id,
        action: 'anchored',
        actor: 'system',
        details: { transactionSignature: result.signature, network },
      });
      
      res.json({ hallmark: updated, blockchain: { signature: result.signature, explorerUrl } });
    } catch (error) {
      console.error("Error anchoring hallmark:", error);
      res.status(500).json({ error: "Failed to anchor hallmark to blockchain" });
    }
  });
  
  // GET /api/hallmarks/founding-assets - Get reserved founding assets
  app.get("/api/hallmarks/founding-assets", async (req, res) => {
    try {
      const assets = {
        ORBIT_GENESIS: hallmarkService.getFoundingAsset('ORBIT_GENESIS'),
        PAINTPROS_PLATFORM: hallmarkService.getFoundingAsset('PAINTPROS_PLATFORM'),
        NPP_GENESIS: hallmarkService.getFoundingAsset('NPP_GENESIS'),
        JASON_FOUNDER: hallmarkService.getFoundingAsset('JASON_FOUNDER'),
        SIDONIE_TEAM: hallmarkService.getFoundingAsset('SIDONIE_TEAM'),
      };
      res.json(assets);
    } catch (error) {
      console.error("Error fetching founding assets:", error);
      res.status(500).json({ error: "Failed to fetch founding assets" });
    }
  });

  // ============ RELEASE VERSIONS ============
  
  // GET /api/releases/latest - Get latest release version (supports tenantId query param)
  app.get("/api/releases/latest", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string | undefined;
      const release = await storage.getLatestRelease(tenantId);
      
      if (!release) {
        const genesisAsset = tenantId === 'npp' 
          ? FOUNDING_ASSETS.NPP_GENESIS 
          : FOUNDING_ASSETS.PAINTPROS_PLATFORM;
        res.json({ 
          version: "1.2.6", 
          buildNumber: 0,
          tenantId: tenantId || 'orbit',
          hallmarkNumber: genesisAsset.number,
          solanaTxStatus: "genesis"
        });
        return;
      }
      
      let hallmark = null;
      if (release.hallmarkId) {
        hallmark = await storage.getHallmarkById(release.hallmarkId);
      }
      
      res.json({
        ...release,
        hallmarkNumber: hallmark?.hallmarkNumber || FOUNDING_ASSETS.PAINTPROS_PLATFORM.number,
        hallmarkDetails: hallmark
      });
    } catch (error) {
      console.error("Error fetching latest release:", error);
      res.status(500).json({ error: "Failed to fetch latest release" });
    }
  });

  // GET /api/releases - Get all releases (supports tenantId filter)
  app.get("/api/releases", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const releases = tenantId 
        ? await storage.getReleasesByTenant(tenantId, limit)
        : await storage.getAllReleases(limit);
      
      res.json(releases);
    } catch (error) {
      console.error("Error fetching releases:", error);
      res.status(500).json({ error: "Failed to fetch releases" });
    }
  });

  // POST /api/releases/bump - Bump version and create hallmark (tenant-aware)
  app.post("/api/releases/bump", async (req, res) => {
    try {
      const { bumpType = "patch", tenantId = "orbit", releaseNotes } = req.body;
      
      // Get tenant-specific latest release
      const latestRelease = await storage.getLatestRelease(tenantId);
      let currentVersion = latestRelease?.version || "1.2.6";
      let buildNumber = (latestRelease?.buildNumber || 0) + 1;
      
      const [major, minor, patch] = currentVersion.split('.').map(Number);
      let newVersion: string;
      
      switch (bumpType) {
        case 'major':
          newVersion = `${major + 1}.0.0`;
          break;
        case 'minor':
          newVersion = `${major}.${minor + 1}.0`;
          break;
        case 'patch':
        default:
          newVersion = `${major}.${minor}.${patch + 1}`;
      }
      
      // Include tenant ID in the hash for uniqueness
      const contentHash = solana.hashData(`${tenantId}-${newVersion}-${buildNumber}-${Date.now()}`);
      
      // Get tenant name for hallmark
      const tenantNames: Record<string, string> = {
        'orbit': 'ORBIT Platform',
        'npp': 'Nashville Painting Professionals',
        'demo': 'PaintPros.io Demo',
      };
      const recipientName = tenantNames[tenantId] || tenantId;
      
      const hallmarkData = hallmarkService.createHallmarkData(
        'release',
        recipientName,
        'system',
        'system',
        `v${newVersion} build ${buildNumber}`,
        { version: newVersion, buildNumber, bumpType, tenantId },
        undefined,
        undefined,
        tenantId // Pass tenantId for proper prefix (NPP-, PP-, etc.)
      );
      
      const savedHallmark = await storage.createHallmark(hallmarkData);
      
      const release = await storage.createRelease({
        tenantId,
        version: newVersion,
        buildNumber,
        hallmarkId: savedHallmark.id,
        contentHash,
        releaseNotes,
      });
      
      res.status(201).json({
        release,
        hallmark: savedHallmark,
        message: `${recipientName} version bumped to ${newVersion} (Build ${buildNumber})`
      });
    } catch (error) {
      console.error("Error bumping version:", error);
      res.status(500).json({ error: "Failed to bump version" });
    }
  });

  // POST /api/releases/:id/stamp - Stamp release to Solana and Darkwave (dual-chain)
  app.post("/api/releases/:id/stamp", async (req, res) => {
    try {
      const { network = "mainnet-beta" } = req.body;
      const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
      
      if (!privateKey) {
        res.status(500).json({ error: "Solana wallet not configured" });
        return;
      }
      
      const release = await storage.getReleaseById(req.params.id);
      if (!release) {
        res.status(404).json({ error: "Release not found" });
        return;
      }
      
      // Stamp to Solana
      const wallet = solana.getWalletFromPrivateKey(privateKey);
      const solanaResult = await solana.stampHashToBlockchain(
        release.contentHash,
        wallet,
        network,
        { entityType: 'release', entityId: release.id },
        release.tenantId
      );
      
      await storage.updateReleaseSolanaStatus(
        release.id,
        solanaResult.signature,
        "confirmed"
      );
      
      // Stamp to Darkwave Chain (if configured)
      let darkwaveResult: { success: boolean; txHash?: string; explorerUrl?: string } = { success: false };
      if (darkwave.isDarkwaveConfigured()) {
        darkwaveResult = await darkwave.submitHashToDarkwave(
          release.contentHash,
          {
            entityType: 'release',
            entityId: release.id,
            tenantId: release.tenantId,
            version: release.version
          }
        );
        
        if (darkwaveResult.success && darkwaveResult.txHash) {
          await storage.updateReleaseDarkwaveStatus(
            release.id,
            darkwaveResult.txHash,
            "confirmed"
          );
        }
      }
      
      // Update hallmark with blockchain info
      if (release.hallmarkId) {
        const solanaExplorerUrl = network === "devnet"
          ? `https://explorer.solana.com/tx/${solanaResult.signature}?cluster=devnet`
          : `https://explorer.solana.com/tx/${solanaResult.signature}`;
        await storage.updateHallmarkBlockchain(release.hallmarkId, solanaResult.signature, solanaExplorerUrl);
        
        if (darkwaveResult.success && darkwaveResult.txHash) {
          await storage.updateHallmarkDarkwave(release.hallmarkId, darkwaveResult.txHash, darkwaveResult.explorerUrl || '');
        }
      }
      
      const updated = await storage.getReleaseById(release.id);
      
      res.json({
        release: updated,
        blockchain: {
          solana: {
            signature: solanaResult.signature,
            explorerUrl: network === "devnet"
              ? `https://explorer.solana.com/tx/${solanaResult.signature}?cluster=devnet`
              : `https://explorer.solana.com/tx/${solanaResult.signature}`
          },
          darkwave: darkwaveResult.success ? {
            txHash: darkwaveResult.txHash,
            explorerUrl: darkwaveResult.explorerUrl
          } : null
        }
      });
    } catch (error) {
      console.error("Error stamping release:", error);
      res.status(500).json({ error: "Failed to stamp release to blockchain" });
    }
  });

  // ============ PROPOSAL TEMPLATES ============

  app.get("/api/proposal-templates", async (req, res) => {
    try {
      const { category } = req.query;
      const templates = category && typeof category === "string"
        ? await storage.getProposalTemplatesByCategory(category)
        : await storage.getProposalTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching proposal templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/proposal-templates", async (req, res) => {
    try {
      const validatedData = insertProposalTemplateSchema.parse(req.body);
      const template = await storage.createProposalTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid template data", details: error.errors });
      } else {
        console.error("Error creating template:", error);
        res.status(500).json({ error: "Failed to create template" });
      }
    }
  });

  app.put("/api/proposal-templates/:id", async (req, res) => {
    try {
      const updated = await storage.updateProposalTemplate(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Template not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/proposal-templates/:id", async (req, res) => {
    try {
      await storage.deleteProposalTemplate(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // ============ PROPOSALS ============

  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      res.json(proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposal = await storage.getProposalById(req.params.id);
      if (!proposal) {
        res.status(404).json({ error: "Proposal not found" });
        return;
      }
      res.json(proposal);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const validatedData = insertProposalSchema.parse(req.body);
      const proposal = await storage.createProposal(validatedData);
      res.status(201).json(proposal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid proposal data", details: error.errors });
      } else {
        console.error("Error creating proposal:", error);
        res.status(500).json({ error: "Failed to create proposal" });
      }
    }
  });

  app.patch("/api/proposals/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateProposalStatus(req.params.id, status);
      if (!updated) {
        res.status(404).json({ error: "Proposal not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating proposal:", error);
      res.status(500).json({ error: "Failed to update proposal" });
    }
  });

  // ============ PAYMENTS ============

  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.get("/api/payments/:id", async (req, res) => {
    try {
      const payment = await storage.getPaymentById(req.params.id);
      if (!payment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid payment data", details: error.errors });
      } else {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: "Failed to create payment" });
      }
    }
  });

  app.patch("/api/payments/:id/status", async (req, res) => {
    try {
      const { status, processorId } = req.body;
      const updated = await storage.updatePaymentStatus(req.params.id, status, processorId);
      if (!updated) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  app.post("/api/payments/:id/complete", async (req, res) => {
    try {
      const updated = await storage.markPaymentComplete(req.params.id);
      if (!updated) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error completing payment:", error);
      res.status(500).json({ error: "Failed to complete payment" });
    }
  });

  // GET /api/estimates/:id/payment - Get payment info for an estimate
  app.get("/api/estimates/:id/payment", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByEstimate(req.params.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching estimate payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // ============ COLOR VISUALIZER (AI-Powered) ============
  
  // POST /api/color-visualize - Analyze wall photo and provide color recommendations
  app.post("/api/color-visualize", async (req, res) => {
    try {
      const { imageBase64, colorHex, colorName, intensity } = req.body;
      
      if (!imageBase64 || !colorHex) {
        res.status(400).json({ error: "Image and color data required" });
        return;
      }
      
      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });
      
      // Use AI to analyze the wall and provide insights
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert interior designer and color consultant. Analyze the room/wall photo and provide a brief, encouraging comment about how the selected paint color (${colorName}, ${colorHex}) would look in this space. Keep your response to 1-2 sentences. Be specific about features you see in the room. Do not use emojis.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `The customer wants to paint this wall/room with ${colorName} (${colorHex}) at ${intensity}% intensity. What do you think about this color choice for this space?`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const analysis = response.choices[0]?.message?.content || 
        `${colorName} would be a beautiful choice for this space!`;

      res.json({
        success: true,
        analysis,
        colorHex,
        colorName,
      });
    } catch (error: any) {
      console.error("Color visualization error:", error);
      // Return a generic positive response if AI fails
      res.json({
        success: true,
        analysis: `${req.body.colorName || "This color"} would look great in your space!`,
        colorHex: req.body.colorHex,
        colorName: req.body.colorName,
      });
    }
  });

  // ============ ROOM SCAN (AI Vision) ============
  
  // POST /api/room-scan - Analyze room image with AI Vision
  app.post("/api/room-scan", async (req, res) => {
    try {
      const { imageBase64, leadId, estimateId, roomType } = req.body;
      
      if (!imageBase64) {
        res.status(400).json({ error: "Image data required" });
        return;
      }
      
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        res.status(500).json({ error: "AI service not configured" });
        return;
      }
      
      // Create initial scan record (store truncated image reference)
      const scanData = {
        leadId: leadId || undefined,
        estimateId: estimateId || undefined,
        imageUrl: imageBase64.substring(0, 100) + "...",
        roomType: roomType || "unknown",
        modelVersion: "gpt-4o",
      };
      const scan = await storage.createRoomScan(scanData);
      
      // Update status to processing
      await storage.updateRoomScanResult(scan.id, { status: "processing" });
      
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert at estimating room dimensions from photographs. 
Analyze the image and estimate the room's approximate dimensions.
Consider visual cues like:
- Standard door heights (6'8" or 80 inches)
- Standard ceiling heights (8-10 feet)
- Furniture sizes for scale
- Floor tiles or flooring patterns
- Outlet and switch plate sizes

IMPORTANT: Provide conservative estimates. It's better to underestimate than overestimate.

Respond ONLY with a JSON object in this exact format:
{
  "length_ft": <number>,
  "width_ft": <number>,
  "height_ft": <number>,
  "square_footage": <number>,
  "confidence": <number 0-100>,
  "room_type_detected": "<string>",
  "reasoning": "<brief explanation of how you estimated>"
}

Do not include any text before or after the JSON.`
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this ${roomType || 'room'} image and estimate its dimensions for painting purposes.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                    detail: "high"
                  }
                }
              ]
            }
          ],
          max_tokens: 500
        });
        
        const content = response.choices[0]?.message?.content || "";
        
        // Parse AI response
        let parsed;
        try {
          // Extract JSON from response (handle potential markdown code blocks)
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("No JSON found in response");
          parsed = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("Failed to parse AI response:", content);
          await storage.updateRoomScanResult(scan.id, { 
            status: "failed",
            errorMessage: "Failed to parse AI response",
            aiResponse: { raw: content }
          });
          res.status(500).json({ error: "Failed to parse room analysis" });
          return;
        }
        
        // Update scan with results
        const updated = await storage.updateRoomScanResult(scan.id, {
          status: "completed",
          estimatedLength: parsed.length_ft?.toString(),
          estimatedWidth: parsed.width_ft?.toString(),
          estimatedHeight: parsed.height_ft?.toString(),
          estimatedSquareFootage: parsed.square_footage?.toString(),
          confidence: parsed.confidence?.toString(),
          roomType: parsed.room_type_detected || roomType,
          aiResponse: parsed
        });
        
        res.json({
          id: scan.id,
          estimatedSquareFootage: parsed.square_footage,
          estimatedLength: parsed.length_ft,
          estimatedWidth: parsed.width_ft,
          estimatedHeight: parsed.height_ft,
          confidence: parsed.confidence,
          roomType: parsed.room_type_detected || roomType,
          reasoning: parsed.reasoning,
          status: "completed"
        });
        
      } catch (aiError: any) {
        console.error("OpenAI Vision error:", aiError);
        await storage.updateRoomScanResult(scan.id, { 
          status: "failed",
          errorMessage: aiError.message || "AI processing failed"
        });
        res.status(500).json({ 
          error: "Failed to analyze room image",
          details: aiError.message
        });
      }
      
    } catch (error) {
      console.error("Error processing room scan:", error);
      res.status(500).json({ error: "Failed to process room scan" });
    }
  });
  
  // GET /api/room-scans/:leadId - Get scans for a lead
  app.get("/api/room-scans/:leadId", async (req, res) => {
    try {
      const scans = await storage.getRoomScansByLead(req.params.leadId);
      res.json(scans);
    } catch (error) {
      console.error("Error fetching room scans:", error);
      res.status(500).json({ error: "Failed to fetch room scans" });
    }
  });

  // ============ ANALYTICS ============

  // POST /api/analytics/track - Track a page view
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { page, referrer, sessionId, duration, tenantId } = req.body;
      
      // Parse user agent for device type and browser
      const userAgent = req.headers["user-agent"] || "";
      let deviceType = "desktop";
      if (/mobile/i.test(userAgent)) deviceType = "mobile";
      else if (/tablet|ipad/i.test(userAgent)) deviceType = "tablet";
      
      let browser = "unknown";
      if (/chrome/i.test(userAgent)) browser = "Chrome";
      else if (/firefox/i.test(userAgent)) browser = "Firefox";
      else if (/safari/i.test(userAgent)) browser = "Safari";
      else if (/edge/i.test(userAgent)) browser = "Edge";
      
      // Hash IP for privacy
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
      const ipHash = Buffer.from(String(ip)).toString("base64").slice(0, 16);
      
      const pageView = await storage.trackPageView({
        page: page || "/",
        referrer: referrer || null,
        userAgent: userAgent.slice(0, 500),
        ipHash,
        sessionId: sessionId || null,
        deviceType,
        browser,
        duration: duration || null,
        tenantId: tenantId || "npp"
      });
      
      res.status(201).json({ success: true, id: pageView.id });
    } catch (error) {
      console.error("Error tracking page view:", error);
      res.status(500).json({ error: "Failed to track page view" });
    }
  });

  // GET /api/analytics/tenants - Get available tenants for filtering
  app.get("/api/analytics/tenants", async (req, res) => {
    try {
      const tenants = await storage.getAvailableTenants();
      res.json({ tenants });
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ error: "Failed to fetch tenants" });
    }
  });

  // GET /api/analytics/dashboard - Get full analytics dashboard data (optionally filtered by tenant)
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const { tenantId } = req.query;
      let dashboard;
      let liveCount;
      
      if (tenantId && typeof tenantId === "string") {
        dashboard = await storage.getAnalyticsDashboardByTenant(tenantId);
        liveCount = await storage.getLiveVisitorCountByTenant(tenantId);
      } else {
        dashboard = await storage.getAnalyticsDashboard();
        liveCount = await storage.getLiveVisitorCount();
      }
      
      res.json({ ...dashboard, liveVisitors: liveCount });
    } catch (error) {
      console.error("Error fetching analytics dashboard:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // GET /api/analytics/live - Get live visitor count (optionally filtered by tenant)
  app.get("/api/analytics/live", async (req, res) => {
    try {
      const { tenantId } = req.query;
      let count;
      
      if (tenantId && typeof tenantId === "string") {
        count = await storage.getLiveVisitorCountByTenant(tenantId);
      } else {
        count = await storage.getLiveVisitorCount();
      }
      
      res.json({ liveVisitors: count });
    } catch (error) {
      console.error("Error fetching live count:", error);
      res.status(500).json({ error: "Failed to fetch live visitors" });
    }
  });

  // GET /api/analytics/live-visitors - Get detailed live visitor data
  app.get("/api/analytics/live-visitors", async (req, res) => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentViews = await storage.getPageViews(fiveMinutesAgo, new Date());
      
      // Group by session to get unique visitors
      const sessionMap = new Map<string, {
        sessionId: string;
        deviceType: string;
        browser: string;
        page: string;
        userAgent: string;
        lastSeen: Date;
      }>();
      
      const botPatterns = /bot|crawler|spider|headless|preview|replit/i;
      
      for (const view of recentViews) {
        const sessionId = view.sessionId || view.ipHash || `anon-${view.id}`;
        const existing = sessionMap.get(sessionId);
        const viewTime = new Date(view.createdAt);
        
        if (!existing || viewTime > existing.lastSeen) {
          sessionMap.set(sessionId, {
            sessionId,
            deviceType: view.deviceType || "desktop",
            browser: view.browser || "Unknown",
            page: view.page,
            userAgent: view.userAgent || "",
            lastSeen: viewTime,
          });
        }
      }
      
      const visitors = Array.from(sessionMap.values());
      const realVisitors = visitors.filter(v => !botPatterns.test(v.userAgent));
      const bots = visitors.filter(v => botPatterns.test(v.userAgent));
      
      // Count by device
      const byDevice = { desktop: 0, mobile: 0, tablet: 0 };
      for (const v of realVisitors) {
        if (v.deviceType === "mobile") byDevice.mobile++;
        else if (v.deviceType === "tablet") byDevice.tablet++;
        else byDevice.desktop++;
      }
      
      // Count by page
      const pageCount = new Map<string, number>();
      for (const v of realVisitors) {
        pageCount.set(v.page, (pageCount.get(v.page) || 0) + 1);
      }
      const byPage = Array.from(pageCount.entries())
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count);
      
      // Format visitor data
      const now = Date.now();
      const formattedVisitors = realVisitors.map(v => ({
        sessionId: v.sessionId.slice(0, 8) + "...",
        deviceType: v.deviceType,
        browser: v.browser,
        page: v.page,
        lastSeen: formatTimeAgo(now - v.lastSeen.getTime()),
        isBot: false,
      }));
      
      res.json({
        total: visitors.length,
        realVisitors: realVisitors.length,
        bots: bots.length,
        byDevice,
        byPage,
        visitors: formattedVisitors,
      });
    } catch (error) {
      console.error("Error fetching live visitors:", error);
      res.status(500).json({ error: "Failed to fetch live visitors" });
    }
  });

  // GET /api/analytics/page/:page - Get analytics for a specific page
  app.get("/api/analytics/page/:page", async (req, res) => {
    try {
      const views = await storage.getPageViewsByPage(decodeURIComponent(req.params.page));
      res.json({ 
        page: req.params.page,
        totalViews: views.length,
        views: views.slice(0, 100)
      });
    } catch (error) {
      console.error("Error fetching page analytics:", error);
      res.status(500).json({ error: "Failed to fetch page analytics" });
    }
  });

  // ============ ESTIMATE PHOTOS ============
  
  // POST /api/estimates/:id/photos - Add photo to estimate
  app.post("/api/estimates/:id/photos", async (req, res) => {
    try {
      const { imageBase64, caption, roomType } = req.body;
      if (!imageBase64) {
        res.status(400).json({ error: "Image data required" });
        return;
      }
      
      const estimate = await storage.getEstimateById(req.params.id);
      if (!estimate) {
        res.status(404).json({ error: "Estimate not found" });
        return;
      }
      
      const existingPhotos = await storage.getEstimatePhotos(req.params.id);
      
      const photoData = {
        estimateId: req.params.id,
        imageBase64,
        caption: caption || null,
        roomType: roomType || null,
        sortOrder: existingPhotos.length
      };
      
      const validatedData = insertEstimatePhotoSchema.parse(photoData);
      const photo = await storage.createEstimatePhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid photo data", details: error.errors });
      } else {
        console.error("Error adding photo:", error);
        res.status(500).json({ error: "Failed to add photo" });
      }
    }
  });

  // GET /api/estimates/:id/photos - Get all photos for estimate
  app.get("/api/estimates/:id/photos", async (req, res) => {
    try {
      const photos = await storage.getEstimatePhotos(req.params.id);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching photos:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  // DELETE /api/estimates/:id/photos/:photoId - Delete photo
  app.delete("/api/estimates/:id/photos/:photoId", async (req, res) => {
    try {
      await storage.deleteEstimatePhoto(req.params.photoId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  // ============ ESTIMATE PRICING OPTIONS (Good/Better/Best) ============
  
  // POST /api/estimates/:id/pricing-options - Create pricing option
  app.post("/api/estimates/:id/pricing-options", async (req, res) => {
    try {
      const estimate = await storage.getEstimateById(req.params.id);
      if (!estimate) {
        res.status(404).json({ error: "Estimate not found" });
        return;
      }
      
      const optionData = {
        ...req.body,
        estimateId: req.params.id
      };
      
      const validatedData = insertEstimatePricingOptionSchema.parse(optionData);
      const option = await storage.createEstimatePricingOption(validatedData);
      res.status(201).json(option);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid pricing option data", details: error.errors });
      } else {
        console.error("Error creating pricing option:", error);
        res.status(500).json({ error: "Failed to create pricing option" });
      }
    }
  });

  // GET /api/estimates/:id/pricing-options - Get all pricing options
  app.get("/api/estimates/:id/pricing-options", async (req, res) => {
    try {
      const options = await storage.getEstimatePricingOptions(req.params.id);
      res.json(options);
    } catch (error) {
      console.error("Error fetching pricing options:", error);
      res.status(500).json({ error: "Failed to fetch pricing options" });
    }
  });

  // POST /api/estimates/:id/pricing-options/:optionId/select - Select a pricing option
  app.post("/api/estimates/:id/pricing-options/:optionId/select", async (req, res) => {
    try {
      const option = await storage.selectPricingOption(req.params.optionId, req.params.id);
      if (!option) {
        res.status(404).json({ error: "Pricing option not found" });
        return;
      }
      res.json(option);
    } catch (error) {
      console.error("Error selecting pricing option:", error);
      res.status(500).json({ error: "Failed to select pricing option" });
    }
  });

  // ============ PROPOSAL SIGNATURES ============
  
  // POST /api/proposals/:id/signature - Submit e-signature
  app.post("/api/proposals/:id/signature", async (req, res) => {
    try {
      const { signatureData, signerName, signerEmail, ipAddress } = req.body;
      if (!signatureData || !signerName) {
        res.status(400).json({ error: "Signature data and signer name required" });
        return;
      }
      
      const existingSignature = await storage.getProposalSignature(req.params.id);
      if (existingSignature) {
        res.status(400).json({ error: "Proposal already signed" });
        return;
      }
      
      const signaturePayload = {
        proposalId: req.params.id,
        signatureData,
        signerName,
        signerEmail: signerEmail || null,
        ipAddress: ipAddress || req.ip || null
      };
      
      const validatedData = insertProposalSignatureSchema.parse(signaturePayload);
      const signature = await storage.createProposalSignature(validatedData);
      res.status(201).json(signature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid signature data", details: error.errors });
      } else {
        console.error("Error saving signature:", error);
        res.status(500).json({ error: "Failed to save signature" });
      }
    }
  });

  // GET /api/proposals/:id/signature - Get signature for proposal
  app.get("/api/proposals/:id/signature", async (req, res) => {
    try {
      const signature = await storage.getProposalSignature(req.params.id);
      res.json(signature || null);
    } catch (error) {
      console.error("Error fetching signature:", error);
      res.status(500).json({ error: "Failed to fetch signature" });
    }
  });

  // ============ ESTIMATE FOLLOW-UPS ============
  
  // POST /api/estimates/:id/followups - Schedule follow-up
  app.post("/api/estimates/:id/followups", async (req, res) => {
    try {
      const estimate = await storage.getEstimateById(req.params.id);
      if (!estimate) {
        res.status(404).json({ error: "Estimate not found" });
        return;
      }
      
      const { followupType, scheduledFor, emailSubject, emailBody } = req.body;
      if (!followupType || !scheduledFor) {
        res.status(400).json({ error: "Follow-up type and scheduled date required" });
        return;
      }
      
      const followupData = {
        estimateId: req.params.id,
        followupType,
        scheduledFor: new Date(scheduledFor),
        emailSubject: emailSubject || null,
        emailBody: emailBody || null
      };
      
      const validatedData = insertEstimateFollowupSchema.parse(followupData);
      const followup = await storage.createEstimateFollowup(validatedData);
      res.status(201).json(followup);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid follow-up data", details: error.errors });
      } else {
        console.error("Error scheduling follow-up:", error);
        res.status(500).json({ error: "Failed to schedule follow-up" });
      }
    }
  });

  // GET /api/estimates/:id/followups - Get follow-ups for estimate
  app.get("/api/estimates/:id/followups", async (req, res) => {
    try {
      const followups = await storage.getEstimateFollowups(req.params.id);
      res.json(followups);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      res.status(500).json({ error: "Failed to fetch follow-ups" });
    }
  });

  // GET /api/followups/pending - Get all pending follow-ups (for cron job)
  app.get("/api/followups/pending", async (req, res) => {
    try {
      const followups = await storage.getPendingFollowups();
      res.json(followups);
    } catch (error) {
      console.error("Error fetching pending follow-ups:", error);
      res.status(500).json({ error: "Failed to fetch pending follow-ups" });
    }
  });

  // POST /api/followups/:id/sent - Mark follow-up as sent
  app.post("/api/followups/:id/sent", async (req, res) => {
    try {
      const followup = await storage.markFollowupSent(req.params.id);
      if (!followup) {
        res.status(404).json({ error: "Follow-up not found" });
        return;
      }
      res.json(followup);
    } catch (error) {
      console.error("Error marking follow-up sent:", error);
      res.status(500).json({ error: "Failed to mark follow-up sent" });
    }
  });

  // POST /api/followups/:id/cancel - Cancel follow-up
  app.post("/api/followups/:id/cancel", async (req, res) => {
    try {
      const followup = await storage.cancelFollowup(req.params.id);
      if (!followup) {
        res.status(404).json({ error: "Follow-up not found" });
        return;
      }
      res.json(followup);
    } catch (error) {
      console.error("Error cancelling follow-up:", error);
      res.status(500).json({ error: "Failed to cancel follow-up" });
    }
  });

  // ============ PAINT BUDDY AI CHAT ============
  
  // POST /api/chat - Chat with Rollie the paint buddy
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, tenantName, language } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Messages array required" });
        return;
      }

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const isSpanish = language === "es";
      
      const systemPrompt = isSpanish 
        ? `Eres Rollie, un asistente de inteligencia artificial amigable y servicial para ${tenantName || "una empresa profesional de pintura"}. 
Eres un lindo personaje de rodillo de pintura que le encanta ayudar a los clientes con sus necesidades de pintura.

Tu personalidad:
- Alegre, cálido y accesible
- Conocedor de los servicios de pintura (interior, exterior, residencial, comercial)
- Útil con estimados, programación y responder preguntas
- Profesional pero amigable - usas un lenguaje casual pero te mantienes en el tema

Servicios clave con los que puedes ayudar:
- Pintura interior (paredes, techos, molduras, puertas)
- Pintura exterior (revestimientos, terrazas, cercas)
- Proyectos comerciales y residenciales
- Reparación de paneles de yeso (como parte del trabajo de preparación)
- Estimados gratuitos a través del estimador interactivo en el sitio

Cuando alguien pida un estimado, guíalos a usar la página "Obtener Estimado" en el sitio web.
Mantén las respuestas concisas (2-3 oraciones máximo) a menos que pidan información detallada.
Usa juegos de palabras o referencias relacionadas con la pintura ocasionalmente para mantener las cosas divertidas.

IMPORTANTE: SIEMPRE responde en español. NUNCA uses emojis en tus respuestas - solo texto.`
        : `You are Rollie, a friendly and helpful AI assistant for ${tenantName || "a professional painting company"}. 
You're a cute paint roller character who loves helping customers with their painting needs.

Your personality:
- Cheerful, warm, and approachable
- Knowledgeable about painting services (interior, exterior, residential, commercial)
- Helpful with estimates, scheduling, and answering questions
- Professional but friendly - you use casual language but stay on topic

Key services you can help with:
- Interior painting (walls, ceilings, trim, doors)
- Exterior painting (siding, decks, fences)
- Commercial and residential projects
- Drywall repair (as part of prep work)
- Free estimates through the interactive estimator on the site

When someone asks for an estimate, guide them to use the "Get Estimate" page on the website.
Keep responses concise (2-3 sentences max) unless they ask for detailed information.
Use occasional paint-related puns or references to keep things fun.

IMPORTANT: NEVER use emojis in your responses - text only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10),
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        "I'm having a little trouble thinking right now. Can you try asking again?";

      res.json({ message: assistantMessage });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ error: "Failed to get response from Rollie" });
    }
  });

  // POST /api/tts - Convert text to speech using OpenAI TTS
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, voice } = req.body;
      
      if (!text || typeof text !== "string") {
        res.status(400).json({ error: "Text is required" });
        return;
      }

      // Valid OpenAI voices: alloy, echo, fable, onyx, nova, shimmer
      const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
      const selectedVoice = validVoices.includes(voice) ? voice : "nova";

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: selectedVoice,
        input: text.slice(0, 4096),
      });

      const buffer = Buffer.from(await mp3Response.arrayBuffer());
      
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      });
      res.send(buffer);
    } catch (error) {
      console.error("Error in TTS:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // ============ DOCUMENT ASSETS - Tenant-aware document hashing ============

  // POST /api/document-assets - Create a document asset with hallmark number
  app.post("/api/document-assets", async (req, res) => {
    try {
      const { tenantId, sourceType, sourceId, title, description, content, hashToSolana, createdBy, metadata } = req.body;
      
      if (!tenantId || !sourceType || !sourceId || !title || !content) {
        res.status(400).json({ error: "tenantId, sourceType, sourceId, title, and content are required" });
        return;
      }
      
      // Generate SHA-256 hash of content
      const sha256Hash = crypto.createHash('sha256').update(content).digest('hex');
      
      // Get next hallmark number for this tenant
      const { ordinal, hallmarkNumber } = await storage.getNextTenantOrdinal(tenantId);
      
      const asset = await storage.createDocumentAsset({
        tenantId,
        sourceType,
        sourceId,
        hallmarkNumber,
        ordinal,
        sha256Hash,
        title,
        description,
        hashToSolana: hashToSolana || false,
        metadata: metadata || {},
        createdBy
      });
      
      // If user opted in for Solana hashing, queue it
      if (hashToSolana) {
        await storage.updateDocumentAssetSolanaStatus(asset.id, 'queued');
        
        // Immediately stamp to Solana if wallet is configured
        const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
        if (privateKey) {
          try {
            const wallet = solana.getWalletFromPrivateKey(privateKey);
            const result = await solana.stampHashToBlockchain(
              sha256Hash, 
              wallet, 
              'mainnet-beta',
              { entityType: sourceType, entityId: hallmarkNumber },
              tenantId
            );
            
            await storage.updateDocumentAssetSolanaStatus(
              asset.id, 
              'confirmed', 
              result.signature, 
              result.slot, 
              result.blockTime
            );
            
            res.status(201).json({
              ...asset,
              solanaStatus: 'confirmed',
              solanaTxSignature: result.signature,
              solscanUrl: `https://solscan.io/tx/${result.signature}`
            });
            return;
          } catch (stampError: any) {
            console.error("Failed to stamp document asset:", stampError);
            await storage.updateDocumentAssetSolanaStatus(asset.id, 'failed');
          }
        }
      }
      
      res.status(201).json(asset);
    } catch (error) {
      console.error("Error creating document asset:", error);
      res.status(500).json({ error: "Failed to create document asset" });
    }
  });

  // GET /api/document-assets - Get document assets by tenant
  app.get("/api/document-assets", async (req, res) => {
    try {
      const tenantId = req.query.tenantId as string;
      if (!tenantId) {
        res.status(400).json({ error: "tenantId query parameter required" });
        return;
      }
      const assets = await storage.getDocumentAssetsByTenant(tenantId);
      res.json(assets);
    } catch (error) {
      console.error("Error fetching document assets:", error);
      res.status(500).json({ error: "Failed to fetch document assets" });
    }
  });

  // GET /api/document-assets/:id - Get single document asset
  app.get("/api/document-assets/:id", async (req, res) => {
    try {
      const asset = await storage.getDocumentAssetById(req.params.id);
      if (!asset) {
        res.status(404).json({ error: "Document asset not found" });
        return;
      }
      res.json(asset);
    } catch (error) {
      console.error("Error fetching document asset:", error);
      res.status(500).json({ error: "Failed to fetch document asset" });
    }
  });

  // POST /api/document-assets/:id/hash - Hash an existing document to Solana
  app.post("/api/document-assets/:id/hash", async (req, res) => {
    try {
      const asset = await storage.getDocumentAssetById(req.params.id);
      if (!asset) {
        res.status(404).json({ error: "Document asset not found" });
        return;
      }
      
      if (asset.solanaStatus === 'confirmed') {
        res.status(400).json({ 
          error: "Already hashed to Solana", 
          solscanUrl: `https://solscan.io/tx/${asset.solanaTxSignature}` 
        });
        return;
      }
      
      const privateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
      if (!privateKey) {
        res.status(500).json({ error: "Solana wallet not configured" });
        return;
      }
      
      await storage.updateDocumentAssetSolanaStatus(asset.id, 'pending');
      
      try {
        const wallet = solana.getWalletFromPrivateKey(privateKey);
        const result = await solana.stampHashToBlockchain(
          asset.sha256Hash, 
          wallet, 
          'mainnet-beta',
          { entityType: asset.sourceType, entityId: asset.hallmarkNumber },
          asset.tenantId
        );
        
        const updated = await storage.updateDocumentAssetSolanaStatus(
          asset.id, 
          'confirmed', 
          result.signature, 
          result.slot, 
          result.blockTime
        );
        
        res.json({
          ...updated,
          solscanUrl: `https://solscan.io/tx/${result.signature}`
        });
      } catch (stampError: any) {
        await storage.updateDocumentAssetSolanaStatus(asset.id, 'failed');
        res.status(500).json({ error: "Failed to stamp to Solana", details: stampError.message });
      }
    } catch (error) {
      console.error("Error hashing document asset:", error);
      res.status(500).json({ error: "Failed to hash document asset" });
    }
  });

  // GET /api/tenant-counter/:tenantId - Get tenant's asset counter info
  app.get("/api/tenant-counter/:tenantId", async (req, res) => {
    try {
      let counter = await storage.getTenantCounter(req.params.tenantId);
      if (!counter) {
        counter = await storage.initializeTenantCounter(req.params.tenantId);
      }
      res.json(counter);
    } catch (error) {
      console.error("Error fetching tenant counter:", error);
      res.status(500).json({ error: "Failed to fetch tenant counter" });
    }
  });

  // ============ ONLINE BOOKING ============

  // GET /api/bookings - Get all bookings (optionally filtered by tenant)
  app.get("/api/bookings", async (req, res) => {
    try {
      const { tenantId } = req.query;
      const bookings = await storage.getBookings(tenantId as string | undefined);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // GET /api/bookings/upcoming - Get upcoming bookings
  app.get("/api/bookings/upcoming", async (req, res) => {
    try {
      const { tenantId, limit } = req.query;
      const bookings = await storage.getUpcomingBookings(
        tenantId as string | undefined,
        limit ? parseInt(limit as string) : 10
      );
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ error: "Failed to fetch upcoming bookings" });
    }
  });

  // GET /api/bookings/:id - Get booking by ID
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBookingById(req.params.id);
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  // POST /api/bookings - Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, customerAddress, serviceType, projectDescription, scheduledDate, scheduledTime, customerNotes, tenantId } = req.body;
      
      const validated = insertBookingSchema.parse({
        tenantId: tenantId || "npp",
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        serviceType,
        projectDescription,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        customerNotes
      });

      const booking = await storage.createBooking(validated);

      res.status(201).json(booking);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
        return;
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // PATCH /api/bookings/:id/status - Update booking status
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !['pending', 'confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
        res.status(400).json({ error: "Invalid status" });
        return;
      }

      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  // POST /api/bookings/:id/cancel - Cancel a booking
  app.post("/api/bookings/:id/cancel", async (req, res) => {
    try {
      const { reason } = req.body;
      const booking = await storage.cancelBooking(req.params.id, reason);
      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  // ============ AVAILABILITY WINDOWS ============

  // GET /api/availability - Get all availability windows
  app.get("/api/availability", async (req, res) => {
    try {
      const { tenantId } = req.query;
      const windows = await storage.getAvailabilityWindows(tenantId as string | undefined);
      res.json(windows);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  // GET /api/availability/slots - Get available time slots for a specific date
  app.get("/api/availability/slots", async (req, res) => {
    try {
      const { date, tenantId } = req.query;
      if (!date) {
        res.status(400).json({ error: "Date parameter required" });
        return;
      }

      const slots = await storage.getAvailableSlots(
        new Date(date as string),
        (tenantId as string) || "npp"
      );
      res.json({ date, slots });
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ error: "Failed to fetch available slots" });
    }
  });

  // POST /api/availability - Create availability window
  app.post("/api/availability", async (req, res) => {
    try {
      const { tenantId, dayOfWeek, startTime, endTime, slotDuration, maxBookings } = req.body;
      
      if (dayOfWeek === undefined || !startTime || !endTime) {
        res.status(400).json({ error: "Missing required fields: dayOfWeek, startTime, endTime" });
        return;
      }

      const window = await storage.createAvailabilityWindow({
        tenantId: tenantId || "npp",
        dayOfWeek,
        startTime,
        endTime,
        slotDuration: slotDuration || 60,
        maxBookings: maxBookings || 1
      });

      res.status(201).json(window);
    } catch (error) {
      console.error("Error creating availability window:", error);
      res.status(500).json({ error: "Failed to create availability window" });
    }
  });

  // PATCH /api/availability/:id - Update availability window
  app.patch("/api/availability/:id", async (req, res) => {
    try {
      const window = await storage.updateAvailabilityWindow(req.params.id, req.body);
      if (!window) {
        res.status(404).json({ error: "Availability window not found" });
        return;
      }
      res.json(window);
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ error: "Failed to update availability" });
    }
  });

  // DELETE /api/availability/:id - Delete availability window
  app.delete("/api/availability/:id", async (req, res) => {
    try {
      await storage.deleteAvailabilityWindow(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting availability:", error);
      res.status(500).json({ error: "Failed to delete availability" });
    }
  });

  // POST /api/availability/init - Initialize default business hours
  app.post("/api/availability/init", async (req, res) => {
    try {
      const { tenantId } = req.body;
      const tenant = tenantId || "npp";
      
      const existing = await storage.getAvailabilityWindows(tenant);
      if (existing.length > 0) {
        res.json({ message: "Availability already configured", windows: existing });
        return;
      }

      const defaultHours = [
        { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 3, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 5, startTime: "08:00", endTime: "17:00" },
        { dayOfWeek: 6, startTime: "09:00", endTime: "14:00" },
      ];

      const created = [];
      for (const hours of defaultHours) {
        const window = await storage.createAvailabilityWindow({
          tenantId: tenant,
          ...hours,
          slotDuration: 60,
          maxBookings: 2
        });
        created.push(window);
      }

      res.status(201).json({ message: "Default availability created", windows: created });
    } catch (error) {
      console.error("Error initializing availability:", error);
      res.status(500).json({ error: "Failed to initialize availability" });
    }
  });

  // ============ STRIPE PAYMENT ENDPOINTS ============
  
  // Initialize Stripe
  const Stripe = await import("stripe");
  const stripeSecretKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  const stripe = stripeSecretKey ? new Stripe.default(stripeSecretKey) : null;

  // POST /api/payments/stripe/create-checkout-session - Create Stripe checkout session
  app.post("/api/payments/stripe/create-checkout-session", async (req, res) => {
    try {
      if (!stripe) {
        res.status(500).json({ error: "Stripe not configured" });
        return;
      }

      const { estimateId, amount, description, customerEmail, successUrl, cancelUrl } = req.body;

      if (!estimateId || !amount) {
        res.status(400).json({ error: "Missing required fields: estimateId and amount" });
        return;
      }

      // Get the host for redirect URLs
      const host = `https://${req.get("host")}`;
      const success = successUrl || `${host}/pay/${estimateId}?status=success`;
      const cancel = cancelUrl || `${host}/pay/${estimateId}?status=cancelled`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: description || "Painting Services Deposit",
                description: `Estimate #${estimateId}`,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: success,
        cancel_url: cancel,
        customer_email: customerEmail,
        metadata: {
          estimateId,
          type: "deposit",
        },
      });

      res.json({ 
        sessionId: session.id, 
        url: session.url 
      });
    } catch (error: any) {
      console.error("Error creating Stripe checkout session:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // POST /api/payments/stripe/webhook - Handle Stripe webhooks
  app.post("/api/payments/stripe/webhook", async (req, res) => {
    try {
      if (!stripe) {
        res.status(500).json({ error: "Stripe not configured" });
        return;
      }

      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      if (webhookSecret && sig) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err: any) {
          console.error("Webhook signature verification failed:", err.message);
          res.status(400).json({ error: `Webhook Error: ${err.message}` });
          return;
        }
      } else {
        // For testing without webhook signature
        event = req.body;
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          console.log("Payment successful for estimate:", session.metadata?.estimateId);
          
          // Create payment record
          if (session.metadata?.estimateId) {
            await storage.createPayment({
              estimateId: session.metadata.estimateId,
              amount: String((session.amount_total || 0) / 100),
              paymentMethod: "card",
              processorId: session.payment_intent as string,
              paidAt: new Date(),
            });
          }
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Error processing Stripe webhook:", error);
      res.status(500).json({ error: error.message || "Webhook processing failed" });
    }
  });

  // ============ COINBASE COMMERCE ENDPOINTS ============

  // POST /api/payments/coinbase/create-charge - Create Coinbase Commerce charge
  app.post("/api/payments/coinbase/create-charge", async (req, res) => {
    try {
      const coinbaseApiKey = process.env.COINBASE_COMMERCE_API_KEY;
      
      if (!coinbaseApiKey) {
        res.status(500).json({ error: "Coinbase Commerce not configured" });
        return;
      }

      const { estimateId, amount, description, customerEmail } = req.body;

      if (!estimateId || !amount) {
        res.status(400).json({ error: "Missing required fields: estimateId and amount" });
        return;
      }

      const host = `https://${req.get("host")}`;

      const chargeData = {
        name: description || "Painting Services Deposit",
        description: `Estimate #${estimateId}`,
        pricing_type: "fixed_price",
        local_price: {
          amount: String(amount),
          currency: "USD",
        },
        metadata: {
          estimateId,
          customerEmail,
        },
        redirect_url: `${host}/pay/${estimateId}?status=success&method=crypto`,
        cancel_url: `${host}/pay/${estimateId}?status=cancelled&method=crypto`,
      };

      const response = await fetch("https://api.commerce.coinbase.com/charges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CC-Api-Key": coinbaseApiKey,
          "X-CC-Version": "2018-03-22",
        },
        body: JSON.stringify(chargeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create charge");
      }

      const charge = await response.json();

      res.json({
        chargeId: charge.data.id,
        code: charge.data.code,
        url: charge.data.hosted_url,
        expiresAt: charge.data.expires_at,
      });
    } catch (error: any) {
      console.error("Error creating Coinbase charge:", error);
      res.status(500).json({ error: error.message || "Failed to create crypto payment" });
    }
  });

  // POST /api/payments/coinbase/webhook - Handle Coinbase Commerce webhooks
  app.post("/api/payments/coinbase/webhook", async (req, res) => {
    try {
      const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
      const signature = req.headers["x-cc-webhook-signature"];

      // Verify webhook signature if secret is configured
      if (webhookSecret && signature) {
        const hmac = crypto.createHmac("sha256", webhookSecret);
        const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        const computedSignature = hmac.update(rawBody).digest("hex");
        
        if (signature !== computedSignature) {
          console.error("Coinbase webhook signature mismatch");
          res.status(400).json({ error: "Invalid signature" });
          return;
        }
      }

      const event = req.body;
      const eventType = event.event?.type;

      switch (eventType) {
        case "charge:confirmed":
        case "charge:completed":
          const charge = event.event?.data;
          console.log("Crypto payment confirmed for estimate:", charge?.metadata?.estimateId);
          
          if (charge?.metadata?.estimateId) {
            const pricing = charge.pricing?.local || charge.pricing?.bitcoin;
            await storage.createPayment({
              estimateId: charge.metadata.estimateId,
              amount: pricing?.amount || "0",
              paymentMethod: "crypto",
              processorId: charge.code,
              paidAt: new Date(),
            });
          }
          break;
        case "charge:failed":
          console.log("Crypto payment failed:", event.event?.data?.code);
          break;
        default:
          console.log(`Unhandled Coinbase event type: ${eventType}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Error processing Coinbase webhook:", error);
      res.status(500).json({ error: error.message || "Webhook processing failed" });
    }
  });

  // ============ QUICKBOOKS INTEGRATION ============

  // GET /api/quickbooks/status - Check QuickBooks connection status
  app.get("/api/quickbooks/status", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const status = await quickbooks.getQBConnectionStatus(tenantId);
      res.json(status);
    } catch (error: any) {
      console.error("QuickBooks status error:", error);
      res.status(500).json({ error: error.message || "Failed to check QuickBooks status" });
    }
  });

  // GET /api/quickbooks/auth - Get QuickBooks OAuth authorization URL
  app.get("/api/quickbooks/auth", async (req, res) => {
    try {
      if (!quickbooks.isQuickBooksConfigured()) {
        res.status(501).json({ 
          error: "QuickBooks not configured",
          message: "Please configure QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET, and QUICKBOOKS_REDIRECT_URI environment variables"
        });
        return;
      }

      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const state = crypto.randomBytes(16).toString("hex");
      
      (req.session as any).qbState = state;
      (req.session as any).qbTenantId = tenantId;
      
      const authUrl = quickbooks.getAuthorizationUrl(state);
      res.json({ authUrl });
    } catch (error: any) {
      console.error("QuickBooks auth error:", error);
      res.status(500).json({ error: error.message || "Failed to generate auth URL" });
    }
  });

  // GET /api/quickbooks/callback - Handle OAuth callback from QuickBooks
  app.get("/api/quickbooks/callback", async (req, res) => {
    try {
      const { code, state, realmId, error: qbError } = req.query;

      if (qbError) {
        res.redirect("/admin?qb_error=" + encodeURIComponent(qbError as string));
        return;
      }

      const sessionState = (req.session as any).qbState;
      const tenantId = (req.session as any).qbTenantId;

      if (!sessionState || state !== sessionState) {
        res.redirect("/admin?qb_error=invalid_state");
        return;
      }

      if (!code || !realmId) {
        res.redirect("/admin?qb_error=missing_params");
        return;
      }

      await quickbooks.exchangeCodeForTokens(code as string, realmId as string, tenantId);
      
      delete (req.session as any).qbState;
      delete (req.session as any).qbTenantId;

      res.redirect("/admin?qb_connected=true");
    } catch (error: any) {
      console.error("QuickBooks callback error:", error);
      res.redirect("/admin?qb_error=" + encodeURIComponent(error.message));
    }
  });

  // POST /api/quickbooks/disconnect - Disconnect QuickBooks
  app.post("/api/quickbooks/disconnect", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      await quickbooks.disconnectQB(tenantId);
      res.json({ success: true, message: "QuickBooks disconnected" });
    } catch (error: any) {
      console.error("QuickBooks disconnect error:", error);
      res.status(500).json({ error: error.message || "Failed to disconnect QuickBooks" });
    }
  });

  // POST /api/quickbooks/sync/estimate/:id - Sync an estimate to QuickBooks
  app.post("/api/quickbooks/sync/estimate/:id", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname || "localhost");
      const estimateId = req.params.id;
      
      const result = await quickbooks.syncEstimateToQB(tenantId, estimateId);
      res.json(result);
    } catch (error: any) {
      console.error("QuickBooks sync error:", error);
      res.status(500).json({ error: error.message || "Failed to sync estimate" });
    }
  });

  // ============ WEATHER API (ORBIT Weather System) ============

  // GET /api/weather/geocode/:zip - Convert ZIP code to coordinates
  app.get("/api/weather/geocode/:zip", async (req, res) => {
    try {
      const zip = req.params.zip;
      
      // Use Open-Meteo geocoding API (free, no key required)
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(zip)}&count=1&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error("Geocoding API failed");
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        // Try US ZIP code lookup via nominatim
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=US&format=json&limit=1`,
          { headers: { 'User-Agent': 'PaintPros.io/1.0' } }
        );
        
        if (nominatimResponse.ok) {
          const nominatimData = await nominatimResponse.json();
          if (nominatimData.length > 0) {
            const result = nominatimData[0];
            res.json({
              lat: parseFloat(result.lat),
              lon: parseFloat(result.lon),
              name: result.display_name.split(',')[0],
              state: result.display_name.split(',')[1]?.trim() || '',
              country: 'US'
            });
            return;
          }
        }
        
        res.status(404).json({ error: "Location not found" });
        return;
      }
      
      const result = data.results[0];
      res.json({
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        state: result.admin1 || '',
        country: result.country || ''
      });
    } catch (error) {
      console.error("Geocoding error:", error);
      res.status(500).json({ error: "Failed to geocode location" });
    }
  });

  // GET /api/weather - Fetch current weather by coordinates
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        res.status(400).json({ error: "lat and lon query parameters are required" });
        return;
      }
      
      // Use Open-Meteo API (free, no key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Weather API failed");
      }
      
      const data = await response.json();
      const current = data.current;
      
      // Map WMO weather codes to conditions and icons
      const weatherCode = current.weather_code;
      const isDay = current.is_day === 1;
      
      const { condition, description, icon } = getWeatherFromCode(weatherCode, isDay);
      
      // Convert wind direction degrees to compass
      const windDirection = getWindDirection(current.wind_direction_10m);
      
      res.json({
        temp: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition,
        description,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection,
        precipitation: current.precipitation,
        pressure: Math.round(current.pressure_msl),
        isDay,
        icon,
        alerts: [] // Open-Meteo free tier doesn't include alerts
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
      res.status(500).json({ error: "Failed to fetch weather" });
    }
  });

  // GET /api/weather/radar - Get radar tile URLs from RainViewer
  app.get("/api/weather/radar", async (req, res) => {
    try {
      const response = await fetch("https://api.rainviewer.com/public/weather-maps.json");
      
      if (!response.ok) {
        throw new Error("RainViewer API failed");
      }
      
      const data = await response.json();
      
      res.json({
        generated: data.generated,
        host: data.host,
        radar: data.radar,
        satellite: data.satellite
      });
    } catch (error) {
      console.error("Radar fetch error:", error);
      res.status(500).json({ error: "Failed to fetch radar data" });
    }
  });

  // ============ CREW LEAD MANAGEMENT ============

  // POST /api/crew/auth - Authenticate crew lead by PIN (with rate limiting)
  app.post("/api/crew/auth", async (req, res) => {
    try {
      const { pin, tenantId } = req.body;
      if (!pin || typeof pin !== "string") {
        res.status(400).json({ error: "PIN is required" });
        return;
      }

      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const rateLimit = checkPinRateLimit(clientIp, "crew");
      
      if (!rateLimit.allowed) {
        res.status(429).json({ 
          error: "Too many failed attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter 
        });
        return;
      }
      
      // Try the specified tenant first
      let crewLead = await storage.getCrewLeadByPin(pin, tenantId || "demo");
      
      // If not found, try other common tenants
      if (!crewLead && tenantId !== "demo") {
        crewLead = await storage.getCrewLeadByPin(pin, "demo");
      }
      if (!crewLead && tenantId !== "npp") {
        crewLead = await storage.getCrewLeadByPin(pin, "npp");
      }
      
      if (!crewLead) {
        recordPinAttempt(clientIp, "crew", false);
        res.status(401).json({ error: "Invalid PIN" });
        return;
      }
      if (!crewLead.isActive) {
        res.status(403).json({ error: "Account is deactivated" });
        return;
      }
      
      recordPinAttempt(clientIp, "crew", true);
      res.json(crewLead);
    } catch (error) {
      console.error("Error authenticating crew lead:", error);
      res.status(500).json({ error: "Failed to authenticate" });
    }
  });

  // GET /api/crew/stats - Get crew statistics for dashboard
  app.get("/api/crew/stats", async (req, res) => {
    try {
      const { tenantId } = req.query;
      const tid = tenantId as string || "npp";
      const leads = await storage.getCrewLeads(tid);
      let totalMembers = 0;
      let pendingTimeEntries = 0;
      let openIncidents = 0;
      
      for (const lead of leads) {
        const members = await storage.getCrewMembers(lead.id);
        totalMembers += members.filter(m => m.isActive).length;
        const entries = await storage.getTimeEntries(lead.id);
        pendingTimeEntries += entries.filter((e: { status: string }) => e.status === "pending").length;
        const incidents = await storage.getIncidentReportsByLead(lead.id);
        openIncidents += incidents.filter((i: { status: string }) => i.status === "open" || i.status === "investigating").length;
      }
      
      res.json({ totalMembers, pendingTimeEntries, openIncidents });
    } catch (error) {
      console.error("Error fetching crew stats:", error);
      res.json({ totalMembers: 0, pendingTimeEntries: 0, openIncidents: 0 });
    }
  });

  // GET /api/crew/leads - Get all crew leads
  app.get("/api/crew/leads", async (req, res) => {
    try {
      const { tenantId } = req.query;
      const leads = await storage.getCrewLeads(tenantId as string || "npp");
      res.json(leads);
    } catch (error) {
      console.error("Error fetching crew leads:", error);
      res.status(500).json({ error: "Failed to fetch crew leads" });
    }
  });

  // GET /api/crew/leads/:id - Get a specific crew lead
  app.get("/api/crew/leads/:id", async (req, res) => {
    try {
      const crewLead = await storage.getCrewLeadById(req.params.id);
      if (!crewLead) {
        res.status(404).json({ error: "Crew lead not found" });
        return;
      }
      res.json(crewLead);
    } catch (error) {
      console.error("Error fetching crew lead:", error);
      res.status(500).json({ error: "Failed to fetch crew lead" });
    }
  });

  // POST /api/crew/leads - Create a new crew lead
  app.post("/api/crew/leads", async (req, res) => {
    try {
      const validatedData = insertCrewLeadSchema.parse(req.body);
      const crewLead = await storage.createCrewLead(validatedData);
      res.status(201).json(crewLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid crew lead data", details: error.errors });
      } else {
        console.error("Error creating crew lead:", error);
        res.status(500).json({ error: "Failed to create crew lead" });
      }
    }
  });

  // PATCH /api/crew/leads/:id - Update a crew lead
  app.patch("/api/crew/leads/:id", async (req, res) => {
    try {
      const crewLead = await storage.updateCrewLead(req.params.id, req.body);
      if (!crewLead) {
        res.status(404).json({ error: "Crew lead not found" });
        return;
      }
      res.json(crewLead);
    } catch (error) {
      console.error("Error updating crew lead:", error);
      res.status(500).json({ error: "Failed to update crew lead" });
    }
  });

  // PATCH /api/crew/leads/:id/deactivate - Deactivate a crew lead
  app.patch("/api/crew/leads/:id/deactivate", async (req, res) => {
    try {
      const crewLead = await storage.deactivateCrewLead(req.params.id);
      if (!crewLead) {
        res.status(404).json({ error: "Crew lead not found" });
        return;
      }
      res.json(crewLead);
    } catch (error) {
      console.error("Error deactivating crew lead:", error);
      res.status(500).json({ error: "Failed to deactivate crew lead" });
    }
  });

  // ============ CREW MEMBERS ============

  // GET /api/crew/leads/:leadId/members - Get members for a crew lead
  app.get("/api/crew/leads/:leadId/members", async (req, res) => {
    try {
      const members = await storage.getCrewMembers(req.params.leadId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching crew members:", error);
      res.status(500).json({ error: "Failed to fetch crew members" });
    }
  });

  // GET /api/crew/members/:id - Get a specific crew member
  app.get("/api/crew/members/:id", async (req, res) => {
    try {
      const member = await storage.getCrewMemberById(req.params.id);
      if (!member) {
        res.status(404).json({ error: "Crew member not found" });
        return;
      }
      res.json(member);
    } catch (error) {
      console.error("Error fetching crew member:", error);
      res.status(500).json({ error: "Failed to fetch crew member" });
    }
  });

  // POST /api/crew/members - Create a new crew member
  app.post("/api/crew/members", async (req, res) => {
    try {
      const validatedData = insertCrewMemberSchema.parse(req.body);
      const member = await storage.createCrewMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid crew member data", details: error.errors });
      } else {
        console.error("Error creating crew member:", error);
        res.status(500).json({ error: "Failed to create crew member" });
      }
    }
  });

  // PATCH /api/crew/members/:id - Update a crew member
  app.patch("/api/crew/members/:id", async (req, res) => {
    try {
      const member = await storage.updateCrewMember(req.params.id, req.body);
      if (!member) {
        res.status(404).json({ error: "Crew member not found" });
        return;
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating crew member:", error);
      res.status(500).json({ error: "Failed to update crew member" });
    }
  });

  // PATCH /api/crew/members/:id/deactivate - Deactivate a crew member
  app.patch("/api/crew/members/:id/deactivate", async (req, res) => {
    try {
      const member = await storage.deactivateCrewMember(req.params.id);
      if (!member) {
        res.status(404).json({ error: "Crew member not found" });
        return;
      }
      res.json(member);
    } catch (error) {
      console.error("Error deactivating crew member:", error);
      res.status(500).json({ error: "Failed to deactivate crew member" });
    }
  });

  // ============ TIME ENTRIES ============

  // GET /api/crew/time-entries - Get time entries with optional filters
  app.get("/api/crew/time-entries", async (req, res) => {
    try {
      const { crewLeadId, crewMemberId, startDate, endDate } = req.query;
      let entries;
      
      if (startDate && endDate && crewLeadId) {
        entries = await storage.getTimeEntriesByDateRange(
          crewLeadId as string,
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else if (crewMemberId) {
        entries = await storage.getTimeEntriesByMember(crewMemberId as string);
      } else if (crewLeadId) {
        entries = await storage.getTimeEntries(crewLeadId as string);
      } else {
        res.status(400).json({ error: "Must provide crewLeadId, crewMemberId, or date range" });
        return;
      }
      res.json(entries);
    } catch (error) {
      console.error("Error fetching time entries:", error);
      res.status(500).json({ error: "Failed to fetch time entries" });
    }
  });

  // POST /api/crew/time-entries - Create a new time entry
  app.post("/api/crew/time-entries", async (req, res) => {
    try {
      const validatedData = insertTimeEntrySchema.parse(req.body);
      const entry = await storage.createTimeEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid time entry data", details: error.errors });
      } else {
        console.error("Error creating time entry:", error);
        res.status(500).json({ error: "Failed to create time entry" });
      }
    }
  });

  // PATCH /api/crew/time-entries/:id - Update a time entry
  app.patch("/api/crew/time-entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateTimeEntry(req.params.id, req.body);
      if (!entry) {
        res.status(404).json({ error: "Time entry not found" });
        return;
      }
      res.json(entry);
    } catch (error) {
      console.error("Error updating time entry:", error);
      res.status(500).json({ error: "Failed to update time entry" });
    }
  });

  // PATCH /api/crew/time-entries/:id/approve - Approve a time entry
  app.patch("/api/crew/time-entries/:id/approve", async (req, res) => {
    try {
      const { approvedBy } = req.body;
      const entry = await storage.approveTimeEntry(req.params.id, approvedBy);
      if (!entry) {
        res.status(404).json({ error: "Time entry not found" });
        return;
      }
      res.json(entry);
    } catch (error) {
      console.error("Error approving time entry:", error);
      res.status(500).json({ error: "Failed to approve time entry" });
    }
  });

  // PATCH /api/crew/time-entries/:id/submit-payroll - Submit to payroll
  app.patch("/api/crew/time-entries/:id/submit-payroll", async (req, res) => {
    try {
      const [entry] = await storage.submitTimeEntriesToPayroll([req.params.id]);
      if (!entry) {
        res.status(404).json({ error: "Time entry not found" });
        return;
      }
      res.json(entry);
    } catch (error) {
      console.error("Error submitting to payroll:", error);
      res.status(500).json({ error: "Failed to submit to payroll" });
    }
  });

  // ============ JOB NOTES ============

  // GET /api/crew/job-notes - Get job notes for a crew lead
  app.get("/api/crew/job-notes", async (req, res) => {
    try {
      const { crewLeadId } = req.query;
      if (!crewLeadId) {
        res.status(400).json({ error: "crewLeadId is required" });
        return;
      }
      const notes = await storage.getJobNotes(crewLeadId as string);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching job notes:", error);
      res.status(500).json({ error: "Failed to fetch job notes" });
    }
  });

  // GET /api/crew/job-notes/:id - Get a specific job note
  app.get("/api/crew/job-notes/:id", async (req, res) => {
    try {
      const note = await storage.getJobNoteById(req.params.id);
      if (!note) {
        res.status(404).json({ error: "Job note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      console.error("Error fetching job note:", error);
      res.status(500).json({ error: "Failed to fetch job note" });
    }
  });

  // POST /api/crew/job-notes - Create a new job note
  app.post("/api/crew/job-notes", async (req, res) => {
    try {
      const validatedData = insertJobNoteSchema.parse(req.body);
      const note = await storage.createJobNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid job note data", details: error.errors });
      } else {
        console.error("Error creating job note:", error);
        res.status(500).json({ error: "Failed to create job note" });
      }
    }
  });

  // PATCH /api/crew/job-notes/:id - Update a job note
  app.patch("/api/crew/job-notes/:id", async (req, res) => {
    try {
      const note = await storage.updateJobNote(req.params.id, req.body);
      if (!note) {
        res.status(404).json({ error: "Job note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      console.error("Error updating job note:", error);
      res.status(500).json({ error: "Failed to update job note" });
    }
  });

  // PATCH /api/crew/job-notes/:id/mark-sent - Mark job note as sent
  app.patch("/api/crew/job-notes/:id/mark-sent", async (req, res) => {
    try {
      const { sentToOwner = true, sentToAdmin = true } = req.body;
      const note = await storage.markJobNoteSent(req.params.id, sentToOwner, sentToAdmin);
      if (!note) {
        res.status(404).json({ error: "Job note not found" });
        return;
      }
      res.json(note);
    } catch (error) {
      console.error("Error marking job note as sent:", error);
      res.status(500).json({ error: "Failed to mark job note as sent" });
    }
  });

  // ============ INCIDENT REPORTS ============

  // GET /api/crew/incident-reports - Get all incident reports
  app.get("/api/crew/incident-reports", async (req, res) => {
    try {
      const { crewLeadId, tenantId } = req.query;
      let reports;
      if (crewLeadId) {
        reports = await storage.getIncidentReportsByLead(crewLeadId as string);
      } else {
        reports = await storage.getIncidentReports(tenantId as string || "npp");
      }
      res.json(reports);
    } catch (error) {
      console.error("Error fetching incident reports:", error);
      res.status(500).json({ error: "Failed to fetch incident reports" });
    }
  });

  // GET /api/crew/incident-reports/:id - Get a specific incident report
  app.get("/api/crew/incident-reports/:id", async (req, res) => {
    try {
      const report = await storage.getIncidentReportById(req.params.id);
      if (!report) {
        res.status(404).json({ error: "Incident report not found" });
        return;
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching incident report:", error);
      res.status(500).json({ error: "Failed to fetch incident report" });
    }
  });

  // POST /api/crew/incident-reports - Create a new incident report
  app.post("/api/crew/incident-reports", async (req, res) => {
    try {
      const validatedData = insertIncidentReportSchema.parse(req.body);
      const report = await storage.createIncidentReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid incident report data", details: error.errors });
      } else {
        console.error("Error creating incident report:", error);
        res.status(500).json({ error: "Failed to create incident report" });
      }
    }
  });

  // PATCH /api/crew/incident-reports/:id - Update an incident report
  app.patch("/api/crew/incident-reports/:id", async (req, res) => {
    try {
      const report = await storage.updateIncidentReport(req.params.id, req.body);
      if (!report) {
        res.status(404).json({ error: "Incident report not found" });
        return;
      }
      res.json(report);
    } catch (error) {
      console.error("Error updating incident report:", error);
      res.status(500).json({ error: "Failed to update incident report" });
    }
  });

  // PATCH /api/crew/incident-reports/:id/resolve - Resolve an incident report
  app.patch("/api/crew/incident-reports/:id/resolve", async (req, res) => {
    try {
      const { resolution, resolvedBy } = req.body;
      if (!resolution || !resolvedBy) {
        res.status(400).json({ error: "resolution and resolvedBy are required" });
        return;
      }
      const report = await storage.resolveIncidentReport(req.params.id, resolution, resolvedBy);
      if (!report) {
        res.status(404).json({ error: "Incident report not found" });
        return;
      }
      res.json(report);
    } catch (error) {
      console.error("Error resolving incident report:", error);
      res.status(500).json({ error: "Failed to resolve incident report" });
    }
  });

  // ============ INTERNAL MESSAGING ============

  // GET /api/messages/conversations - List conversations for a tenant
  app.get("/api/messages/conversations", async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || "npp";
      const role = req.query.role as string;
      
      let convos;
      if (role) {
        convos = await storage.getConversationsByParticipant(role, tenantId);
      } else {
        convos = await storage.getConversations(tenantId);
      }
      
      const result = await Promise.all(convos.map(async (convo) => {
        const participants = await storage.getConversationParticipants(convo.id);
        const recentMessages = await storage.getMessages(convo.id, 1);
        return {
          ...convo,
          participants,
          lastMessage: recentMessages[0] || null
        };
      }));
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // POST /api/messages/conversations - Create a new conversation
  app.post("/api/messages/conversations", async (req, res) => {
    try {
      const { tenantId, name, type, createdBy, participants } = req.body;
      
      const validated = insertConversationSchema.parse({
        tenantId: tenantId || "npp",
        name,
        type: type || "direct",
        createdBy
      });
      
      const conversation = await storage.createConversation(validated);
      
      if (participants && Array.isArray(participants)) {
        for (const p of participants) {
          const participantValidated = insertConversationParticipantSchema.parse({
            conversationId: conversation.id,
            userId: p.userId,
            role: p.role,
            displayName: p.displayName,
            phone: p.phone
          });
          await storage.addConversationParticipant(participantValidated);
        }
      }
      
      const fullParticipants = await storage.getConversationParticipants(conversation.id);
      res.status(201).json({ ...conversation, participants: fullParticipants });
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
        return;
      }
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // GET /api/messages/conversations/:id - Get a single conversation
  app.get("/api/messages/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversationById(req.params.id);
      if (!conversation) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
      const participants = await storage.getConversationParticipants(conversation.id);
      res.json({ ...conversation, participants });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // GET /api/messages/conversations/:id/messages - Get messages in a conversation
  app.get("/api/messages/conversations/:id/messages", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const msgs = await storage.getMessages(req.params.id, limit);
      res.json(msgs.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // POST /api/messages/conversations/:id/messages - Send a message
  app.post("/api/messages/conversations/:id/messages", async (req, res) => {
    try {
      const { senderId, senderRole, senderName, content, messageType, attachments, replyToId } = req.body;
      
      // Sanitize message content to prevent XSS
      const sanitizedContent = sanitizeText(content);
      
      const validated = insertMessageSchema.parse({
        conversationId: req.params.id,
        senderId,
        senderRole,
        senderName,
        content: sanitizedContent,
        messageType: messageType || "text",
        attachments: attachments || [],
        replyToId,
        isSystemMessage: false
      });
      
      const message = await storage.createMessage(validated);
      
      res.status(201).json(message);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
        return;
      }
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // PATCH /api/messages/read/:participantId - Mark messages as read
  app.patch("/api/messages/read/:participantId", async (req, res) => {
    try {
      const participant = await storage.updateParticipantLastRead(req.params.participantId);
      if (!participant) {
        res.status(404).json({ error: "Participant not found" });
        return;
      }
      res.json(participant);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  // GET /api/messages/users - Get available users/roles for messaging
  app.get("/api/messages/users", async (req, res) => {
    try {
      const tenantId = (req.query.tenantId as string) || "npp";
      const users = await storage.searchUsersByRole(tenantId);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // ============ TEAM MANAGEMENT ============

  // GET /api/team/users - Get users for team management (authenticated, tenant-scoped)
  app.get("/api/team/users", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      // Use the authenticated user's tenant for isolation - don't trust client input
      const tenantId = dbUser.tenantId || "npp";
      
      // Filter users by the authenticated user's tenant
      const tenantUsers = await storage.getUsersByTenant(tenantId);
      res.json(tenantUsers);
    } catch (error) {
      console.error("Error fetching team users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // PATCH /api/team/users/:id/role - Update user role (authenticated, tenant-scoped)
  app.patch("/api/team/users/:id/role", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const { role } = req.body;
      
      // Use authenticated user's tenant - don't trust client-supplied tenantId
      const requestingTenantId = dbUser.tenantId || "npp";
      
      const validRoles = ['owner', 'admin', 'project-manager', 'area-manager', 'crew-lead', 'developer', null];
      
      if (role !== null && !validRoles.includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }
      
      // Verify the target user belongs to the same tenant as the requesting user
      const existingUser = await storage.getUser(req.params.id);
      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      // Only allow updating users within the same tenant
      if (existingUser.tenantId && existingUser.tenantId !== requestingTenantId) {
        res.status(403).json({ error: "Cannot modify users from other tenants" });
        return;
      }
      
      const user = await storage.updateUserRole(req.params.id, role, requestingTenantId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // ============================================
  // DOCUMENT CENTER ROUTES
  // ============================================

  // GET /api/documents - Get all documents for tenant
  app.get("/api/documents", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      const { type } = req.query;
      
      let docs;
      if (type && typeof type === 'string') {
        docs = await storage.getDocumentsByType(tenantId, type);
      } else {
        docs = await storage.getDocuments(tenantId);
      }
      res.json(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // GET /api/documents/:id - Get single document with versions and signatures
  app.get("/api/documents/:id", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      
      // Verify tenant access
      if (doc.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      const versions = await storage.getDocumentVersions(doc.id);
      const signatures = await storage.getDocumentSignatures(doc.id);
      
      res.json({ ...doc, versions, signatures });
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  // POST /api/documents - Create a new document
  app.post("/api/documents", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      // Sanitize text fields for XSS
      const textFields = ['title', 'description'];
      const sanitizedBody = sanitizeObject(req.body, textFields);
      
      const validated = insertDocumentSchema.parse({
        ...sanitizedBody,
        tenantId,
        createdBy: dbUser.id,
      });
      
      const doc = await storage.createDocument(validated);
      
      // Create initial version if file content provided
      if (req.body.fileContent) {
        await storage.createDocumentVersion({
          documentId: doc.id,
          versionNumber: 1,
          fileName: req.body.fileName || 'document',
          fileData: req.body.fileContent || '',
          changeNote: 'Initial version',
          createdBy: dbUser.id,
        });
      }
      
      res.status(201).json(doc);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // PATCH /api/documents/:id - Update document
  app.patch("/api/documents/:id", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      // Verify document exists and belongs to tenant
      const existing = await storage.getDocumentById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      if (existing.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      const doc = await storage.updateDocument(req.params.id, req.body);
      res.json(doc);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  // DELETE /api/documents/:id - Delete document and all related data
  app.delete("/api/documents/:id", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      // Verify document exists and belongs to tenant
      const existing = await storage.getDocumentById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      if (existing.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      await storage.deleteDocument(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // POST /api/documents/:id/versions - Add new version
  app.post("/api/documents/:id/versions", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      // Verify document exists and belongs to tenant
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      if (doc.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      const existingVersions = await storage.getDocumentVersions(req.params.id);
      const nextVersionNumber = existingVersions.length > 0 
        ? Math.max(...existingVersions.map(v => v.versionNumber)) + 1 
        : 1;
      
      const validated = insertDocumentVersionSchema.parse({
        ...req.body,
        documentId: req.params.id,
        versionNumber: nextVersionNumber,
        createdBy: dbUser.id,
      });
      
      const version = await storage.createDocumentVersion(validated);
      res.status(201).json(version);
    } catch (error) {
      console.error("Error creating document version:", error);
      res.status(500).json({ error: "Failed to create document version" });
    }
  });

  // POST /api/documents/:id/signatures - Add signature to document
  // Note: This endpoint is intentionally less restrictive to allow customers to sign documents via shared links
  // However, we validate that the document exists and is in a signable state
  app.post("/api/documents/:id/signatures", async (req: any, res) => {
    try {
      const { signerName, signerEmail, signatureData, signatureType } = req.body;
      
      // First verify the document exists and is pending signature
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      
      if (doc.status === 'signed') {
        res.status(400).json({ error: "Document has already been signed" });
        return;
      }
      
      if (doc.status === 'archived' || doc.status === 'expired') {
        res.status(400).json({ error: "Document is no longer available for signing" });
        return;
      }
      
      // Validate required fields
      if (!signerName || !signerEmail || !signatureData) {
        res.status(400).json({ error: "Signer name, email, and signature are required" });
        return;
      }
      
      const validated = insertDocumentSignatureSchema.parse({
        documentId: req.params.id,
        signerName,
        signerEmail,
        signatureData,
        signatureType: signatureType || 'drawn',
        ipAddress: req.ip || 'unknown',
      });
      
      const signature = await storage.createDocumentSignature(validated);
      
      // Update document status to signed
      await storage.updateDocument(req.params.id, { status: 'signed' });
      
      res.status(201).json(signature);
    } catch (error) {
      console.error("Error adding signature:", error);
      res.status(500).json({ error: "Failed to add signature" });
    }
  });

  // GET /api/documents/:id/signatures - Get all signatures for a document (authenticated)
  app.get("/api/documents/:id/signatures", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const doc = await storage.getDocumentById(req.params.id);
      if (!doc) {
        res.status(404).json({ error: "Document not found" });
        return;
      }
      
      // Verify tenant access
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      if (doc.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      const signatures = await storage.getDocumentSignatures(req.params.id);
      res.json(signatures);
    } catch (error) {
      console.error("Error fetching signatures:", error);
      res.status(500).json({ error: "Failed to fetch signatures" });
    }
  });

  // ===== CRM Calendar Routes =====
  
  // GET /api/calendar/events - Get calendar events for tenant
  app.get("/api/calendar/events", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      const { startDate, endDate, assignedTo } = req.query;
      
      let events;
      if (assignedTo) {
        events = await storage.getCalendarEventsByAssignee(tenantId, assignedTo as string);
      } else if (startDate && endDate) {
        events = await storage.getCalendarEvents(
          tenantId, 
          new Date(startDate as string), 
          new Date(endDate as string)
        );
      } else {
        events = await storage.getCalendarEvents(tenantId);
      }
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });
  
  // GET /api/calendar/events/:id - Get single event
  app.get("/api/calendar/events/:id", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const event = await storage.getCalendarEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      
      // Verify tenant access
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      if (event.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      // Get reminders for this event
      const reminders = await storage.getCalendarReminders(req.params.id);
      
      res.json({ ...event, reminders });
    } catch (error) {
      console.error("Error fetching calendar event:", error);
      res.status(500).json({ error: "Failed to fetch calendar event" });
    }
  });
  
  // GET /api/calendar/events/date/:date - Get events for a specific date
  app.get("/api/calendar/events/date/:date", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      const date = new Date(req.params.date);
      
      const events = await storage.getCalendarEventsByDate(tenantId, date);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events by date:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });
  
  // POST /api/calendar/events - Create new event
  app.post("/api/calendar/events", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      const { title, description, eventType, startTime, endTime, isAllDay, allDay, location, 
              color, colorCode, assignedTo, leadId, estimateId, recurringPattern, 
              recurringEndDate, notes, reminders } = req.body;
      
      // Sanitize text fields for XSS
      const sanitizedTitle = title ? sanitizeText(title) : title;
      const sanitizedDescription = description ? sanitizeText(description) : description;
      const sanitizedLocation = location ? sanitizeText(location) : location;
      const sanitizedNotes = notes ? sanitizeText(notes) : notes;
      
      const validated = insertCalendarEventSchema.parse({
        tenantId,
        title: sanitizedTitle,
        description: sanitizedDescription,
        eventType: eventType || 'appointment',
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : new Date(startTime),
        allDay: allDay ?? isAllDay ?? false,
        location: sanitizedLocation,
        colorCode: colorCode || color || '#3B82F6',
        assignedTo,
        createdBy: dbUser.id,
        relatedLeadId: leadId,
        relatedEstimateId: estimateId,
        recurringPattern,
        recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
        notes: sanitizedNotes,
      });
      
      const event = await storage.createCalendarEvent(validated);
      
      // Create reminders if provided
      if (reminders && Array.isArray(reminders)) {
        for (const reminder of reminders) {
          const reminderValidated = insertCalendarReminderSchema.parse({
            eventId: event.id,
            reminderTime: new Date(reminder.reminderTime),
            reminderType: reminder.reminderType || 'notification',
            reminderMinutes: reminder.reminderMinutes || 15,
          });
          await storage.createCalendarReminder(reminderValidated);
        }
      }
      
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({ error: "Failed to create calendar event" });
    }
  });
  
  // PATCH /api/calendar/events/:id - Update event
  app.patch("/api/calendar/events/:id", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const event = await storage.getCalendarEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      
      // Verify tenant access
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      if (event.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      const { title, description, eventType, startTime, endTime, isAllDay, allDay, location, 
              color, colorCode, assignedTo, status, leadId, estimateId, 
              recurringPattern, recurringEndDate, notes } = req.body;
      
      const updates: any = {};
      // Sanitize text fields for XSS
      if (title !== undefined) updates.title = sanitizeText(title);
      if (description !== undefined) updates.description = sanitizeText(description);
      if (eventType !== undefined) updates.eventType = eventType;
      if (startTime !== undefined) updates.startTime = new Date(startTime);
      if (endTime !== undefined) updates.endTime = endTime ? new Date(endTime) : null;
      if (allDay !== undefined) updates.allDay = allDay;
      else if (isAllDay !== undefined) updates.allDay = isAllDay;
      if (location !== undefined) updates.location = sanitizeText(location);
      if (colorCode !== undefined) updates.colorCode = colorCode;
      else if (color !== undefined) updates.colorCode = color;
      if (assignedTo !== undefined) updates.assignedTo = assignedTo;
      if (status !== undefined) updates.status = status;
      if (leadId !== undefined) updates.relatedLeadId = leadId;
      if (estimateId !== undefined) updates.relatedEstimateId = estimateId;
      if (recurringPattern !== undefined) updates.recurringPattern = recurringPattern;
      if (recurringEndDate !== undefined) updates.recurringEndDate = recurringEndDate ? new Date(recurringEndDate) : null;
      if (notes !== undefined) updates.notes = sanitizeText(notes);
      
      const updated = await storage.updateCalendarEvent(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      console.error("Error updating calendar event:", error);
      res.status(500).json({ error: "Failed to update calendar event" });
    }
  });
  
  // DELETE /api/calendar/events/:id - Delete event
  app.delete("/api/calendar/events/:id", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const event = await storage.getCalendarEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      
      // Verify tenant access
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      if (event.tenantId !== tenantId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }
      
      await storage.deleteCalendarEvent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      res.status(500).json({ error: "Failed to delete calendar event" });
    }
  });
  
  // ===== Calendar Reminders =====
  
  // GET /api/calendar/events/:id/reminders - Get reminders for event
  app.get("/api/calendar/events/:id/reminders", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const event = await storage.getCalendarEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      
      const reminders = await storage.getCalendarReminders(req.params.id);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders" });
    }
  });
  
  // POST /api/calendar/events/:id/reminders - Add reminder to event
  app.post("/api/calendar/events/:id/reminders", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const event = await storage.getCalendarEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: "Event not found" });
        return;
      }
      
      const { reminderTime, reminderType, reminderMinutes } = req.body;
      
      const validated = insertCalendarReminderSchema.parse({
        eventId: req.params.id,
        reminderTime: new Date(reminderTime),
        reminderType: reminderType || 'notification',
        reminderMinutes: reminderMinutes || 15,
      });
      
      const reminder = await storage.createCalendarReminder(validated);
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  });
  
  // DELETE /api/calendar/reminders/:id - Delete reminder
  app.delete("/api/calendar/reminders/:id", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      await storage.deleteCalendarReminder(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder" });
    }
  });
  
  // ===== Color Presets =====
  
  // GET /api/calendar/color-presets - Get color presets for tenant
  app.get("/api/calendar/color-presets", hasRole(['owner', 'admin', 'developer', 'project-manager']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      const presets = await storage.getEventColorPresets(tenantId);
      res.json(presets);
    } catch (error) {
      console.error("Error fetching color presets:", error);
      res.status(500).json({ error: "Failed to fetch color presets" });
    }
  });
  
  // POST /api/calendar/color-presets - Create color preset
  app.post("/api/calendar/color-presets", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const dbUser = req.dbUser;
      const tenantId = dbUser.tenantId || "npp";
      
      const { name, color, eventType } = req.body;
      
      const validated = insertEventColorPresetSchema.parse({
        tenantId,
        name,
        color,
        eventType,
      });
      
      const preset = await storage.createEventColorPreset(validated);
      res.status(201).json(preset);
    } catch (error) {
      console.error("Error creating color preset:", error);
      res.status(500).json({ error: "Failed to create color preset" });
    }
  });
  
  // DELETE /api/calendar/color-presets/:id - Delete color preset
  app.delete("/api/calendar/color-presets/:id", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      await storage.deleteEventColorPreset(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting color preset:", error);
      res.status(500).json({ error: "Failed to delete color preset" });
    }
  });
  
  // GET /api/calendar/pending-reminders - Get pending reminders (for background processing)
  app.get("/api/calendar/pending-reminders", hasRole(['owner', 'admin', 'developer']), async (req: any, res) => {
    try {
      const now = new Date();
      const reminders = await storage.getPendingReminders(now);
      res.json(reminders);
    } catch (error) {
      console.error("Error fetching pending reminders:", error);
      res.status(500).json({ error: "Failed to fetch pending reminders" });
    }
  });

  // ==========================================
  // FRANCHISE MANAGEMENT API ROUTES
  // ==========================================

  // Helper functions for API key generation
  function generateApiKey(): string {
    return `pp_live_${crypto.randomBytes(24).toString("hex")}`;
  }
  
  function generateApiSecret(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // GET /api/franchises - Get all franchises
  app.get("/api/franchises", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const franchises = await storage.getFranchises();
      res.json(franchises);
    } catch (error) {
      console.error("Error fetching franchises:", error);
      res.status(500).json({ error: "Failed to fetch franchises" });
    }
  });

  // POST /api/franchises - Create a new franchise
  app.post("/api/franchises", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const validated = insertFranchiseSchema.parse(req.body);
      const franchise = await storage.createFranchise(validated);
      res.status(201).json(franchise);
    } catch (error) {
      console.error("Error creating franchise:", error);
      res.status(500).json({ error: "Failed to create franchise" });
    }
  });

  // GET /api/franchises/:id - Get franchise by ID
  app.get("/api/franchises/:id", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const franchise = await storage.getFranchiseById(req.params.id);
      if (!franchise) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.json(franchise);
    } catch (error) {
      console.error("Error fetching franchise:", error);
      res.status(500).json({ error: "Failed to fetch franchise" });
    }
  });

  // PUT /api/franchises/:id - Update franchise
  app.put("/api/franchises/:id", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const franchise = await storage.updateFranchise(req.params.id, req.body);
      if (!franchise) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.json(franchise);
    } catch (error) {
      console.error("Error updating franchise:", error);
      res.status(500).json({ error: "Failed to update franchise" });
    }
  });

  // DELETE /api/franchises/:id - Delete franchise
  app.delete("/api/franchises/:id", hasRole(['developer']), async (req: any, res) => {
    try {
      await storage.deleteFranchise(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting franchise:", error);
      res.status(500).json({ error: "Failed to delete franchise" });
    }
  });

  // Franchise Locations
  app.get("/api/franchises/:franchiseId/locations", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const locations = await storage.getFranchiseLocations(req.params.franchiseId);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.post("/api/franchises/:franchiseId/locations", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const validated = insertFranchiseLocationSchema.parse({
        ...req.body,
        franchiseId: req.params.franchiseId
      });
      const location = await storage.createFranchiseLocation(validated);
      res.status(201).json(location);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  app.put("/api/franchises/:franchiseId/locations/:id", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const location = await storage.updateFranchiseLocation(req.params.id, req.body);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Failed to update location" });
    }
  });

  app.delete("/api/franchises/:franchiseId/locations/:id", hasRole(['developer']), async (req: any, res) => {
    try {
      await storage.deleteFranchiseLocation(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ error: "Failed to delete location" });
    }
  });

  // Partner API Credentials Management
  app.get("/api/franchises/:franchiseId/credentials", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const credentials = await storage.getPartnerApiCredentials(req.params.franchiseId);
      // Mask secrets for display
      const masked = credentials.map(c => ({ ...c, apiSecret: "••••••••" }));
      res.json(masked);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      res.status(500).json({ error: "Failed to fetch credentials" });
    }
  });

  app.post("/api/franchises/:franchiseId/credentials", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const { name, environment, scopes } = req.body;
      const apiKey = generateApiKey();
      const apiSecret = generateApiSecret();
      
      const credential = await storage.createPartnerApiCredential({
        franchiseId: req.params.franchiseId,
        name,
        apiKey,
        apiSecret,
        environment: environment || "production",
        scopes: scopes || ["estimates:read"],
        isActive: true,
        createdBy: req.dbUser?.email || "admin"
      });
      
      // Return the secret only once - must be saved by the user
      res.status(201).json({
        ...credential,
        apiSecret,
        message: "Save this API secret - it will never be shown again!"
      });
    } catch (error) {
      console.error("Error creating credential:", error);
      res.status(500).json({ error: "Failed to create credential" });
    }
  });

  app.put("/api/franchises/:franchiseId/credentials/:id", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const { name, isActive, scopes, rateLimitPerMinute, rateLimitPerDay } = req.body;
      const credential = await storage.updatePartnerApiCredential(req.params.id, {
        name,
        isActive,
        scopes,
        rateLimitPerMinute,
        rateLimitPerDay
      });
      if (!credential) {
        return res.status(404).json({ error: "Credential not found" });
      }
      res.json({ ...credential, apiSecret: "••••••••" });
    } catch (error) {
      console.error("Error updating credential:", error);
      res.status(500).json({ error: "Failed to update credential" });
    }
  });

  app.delete("/api/franchises/:franchiseId/credentials/:id", hasRole(['developer']), async (req: any, res) => {
    try {
      await storage.deletePartnerApiCredential(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting credential:", error);
      res.status(500).json({ error: "Failed to delete credential" });
    }
  });

  // API Logs
  app.get("/api/franchises/:franchiseId/api-logs", hasRole(['developer', 'owner']), async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getPartnerApiLogs(req.params.franchiseId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching API logs:", error);
      res.status(500).json({ error: "Failed to fetch API logs" });
    }
  });

  // ==========================================
  // PARTNER API v1 ENDPOINTS (External Access)
  // ==========================================

  // Partner API Authentication Middleware
  const partnerApiAuth: RequestHandler = async (req, res, next) => {
    const startTime = Date.now();
    const apiKey = req.headers["x-api-key"] as string;
    
    if (!apiKey) {
      return res.status(401).json({ error: "Missing API key", code: "MISSING_API_KEY" });
    }
    
    const credential = await storage.getPartnerApiCredentialByApiKey(apiKey);
    if (!credential) {
      return res.status(401).json({ error: "Invalid API key", code: "INVALID_API_KEY" });
    }
    
    if (!credential.isActive) {
      return res.status(403).json({ error: "API key is disabled", code: "KEY_DISABLED" });
    }
    
    const franchise = await storage.getFranchiseById(credential.franchiseId);
    if (!franchise || franchise.status !== "active") {
      return res.status(403).json({ error: "Franchise is not active", code: "FRANCHISE_INACTIVE" });
    }
    
    // Increment request count
    await storage.incrementPartnerApiRequestCount(credential.id);
    
    // Attach franchise and credential info to request
    (req as any).franchise = {
      id: franchise.id,
      franchiseId: franchise.franchiseId,
      name: franchise.territoryName
    };
    (req as any).credential = {
      id: credential.id,
      scopes: credential.scopes || []
    };
    
    // Log API request on response finish
    res.on("finish", async () => {
      try {
        await storage.createPartnerApiLog({
          credentialId: credential.id,
          franchiseId: franchise.id,
          method: req.method,
          endpoint: req.originalUrl,
          statusCode: res.statusCode,
          responseTimeMs: Date.now() - startTime,
          ipAddress: req.ip || req.socket?.remoteAddress || null,
          userAgent: req.headers["user-agent"] || null
        });
      } catch (e) {
        console.error("Failed to log API request:", e);
      }
    });
    
    return next();
  };

  // Scope check middleware factory
  const requireScope = (scope: string): RequestHandler => {
    return (req, res, next) => {
      const scopes = (req as any).credential?.scopes || [];
      if (!scopes.includes(scope)) {
        return res.status(403).json({
          error: `Missing required scope: ${scope}`,
          code: "INSUFFICIENT_SCOPE"
        });
      }
      return next();
    };
  };

  // GET /api/partner/v1/health - Health check (no auth required)
  app.get("/api/partner/v1/health", (req, res) => {
    res.json({
      status: "healthy",
      version: "1.2.6",
      timestamp: new Date().toISOString()
    });
  });

  // ============ SYSTEM HEALTH ============

  // GET /api/system/health - Comprehensive system health check for dashboards
  app.get("/api/system/health", async (req, res) => {
    const startTime = Date.now();
    const checks: {
      name: string;
      status: "healthy" | "degraded" | "error";
      message: string;
      responseTime?: number;
      lastError?: string;
    }[] = [];

    // 1. Database Health Check
    const dbStart = Date.now();
    try {
      await storage.getLeads();
      checks.push({
        name: "database",
        status: "healthy",
        message: "PostgreSQL connection active",
        responseTime: Date.now() - dbStart
      });
    } catch (error) {
      checks.push({
        name: "database",
        status: "error",
        message: "Database connection failed",
        responseTime: Date.now() - dbStart,
        lastError: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // 2. Payment Processor (Stripe) Health Check
    const stripeKey = process.env.STRIPE_LIVE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    const stripeConfigured = !!stripeKey;
    if (stripeConfigured) {
      try {
        const StripeModule = await import("stripe");
        const stripeClient = new StripeModule.default(stripeKey);
        const stripeStart = Date.now();
        await stripeClient.paymentIntents.list({ limit: 1 });
        checks.push({
          name: "payments",
          status: "healthy",
          message: "Stripe API responding",
          responseTime: Date.now() - stripeStart
        });
      } catch (error) {
        checks.push({
          name: "payments",
          status: "error",
          message: "Stripe connection failed",
          lastError: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } else {
      checks.push({
        name: "payments",
        status: "degraded",
        message: "Stripe not configured"
      });
    }

    // 3. Email Service (Resend) Health Check
    const resendConfigured = !!process.env.RESEND_API_KEY;
    checks.push({
      name: "email",
      status: resendConfigured ? "healthy" : "degraded",
      message: resendConfigured ? "Resend API configured" : "Email service not configured"
    });

    // 4. Blockchain (Solana) Health Check
    const solanaPrivateKey = process.env.PHANTOM_SECRET_KEY || process.env.SOLANA_PRIVATE_KEY;
    if (solanaPrivateKey) {
      try {
        const solanaStart = Date.now();
        const wallet = solana.getWalletFromPrivateKey(solanaPrivateKey);
        const balance = await solana.getWalletBalance(wallet.publicKey.toBase58(), 'mainnet-beta');
        checks.push({
          name: "blockchain",
          status: "healthy",
          message: `Solana wallet active (${balance.toFixed(4)} SOL)`,
          responseTime: Date.now() - solanaStart
        });
      } catch (error) {
        checks.push({
          name: "blockchain",
          status: "degraded",
          message: "Blockchain service unavailable",
          lastError: error instanceof Error ? error.message : "Unknown error"
        });
      }
    } else {
      checks.push({
        name: "blockchain",
        status: "degraded",
        message: "Blockchain not configured"
      });
    }

    // 5. AI Service (OpenAI) Health Check
    const openaiConfigured = !!process.env.OPENAI_API_KEY;
    checks.push({
      name: "ai",
      status: openaiConfigured ? "healthy" : "degraded",
      message: openaiConfigured ? "OpenAI API configured" : "AI service not configured"
    });

    // Calculate overall status
    const hasError = checks.some(c => c.status === "error");
    const hasDegraded = checks.some(c => c.status === "degraded");
    const overallStatus = hasError ? "error" : hasDegraded ? "degraded" : "healthy";

    res.json({
      status: overallStatus,
      version: "1.2.6",
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      checks
    });
  });

  // GET /api/partner/v1/scopes - List available scopes
  app.get("/api/partner/v1/scopes", (req, res) => {
    res.json({ scopes: PARTNER_API_SCOPES });
  });

  // GET /api/partner/v1/me - Get current franchise info
  app.get("/api/partner/v1/me", partnerApiAuth, (req: any, res) => {
    res.json({
      franchise: req.franchise,
      scopes: req.credential?.scopes
    });
  });

  // GET /api/partner/v1/estimates - Get estimates for franchise
  app.get("/api/partner/v1/estimates", partnerApiAuth, requireScope("estimates:read"), async (req: any, res) => {
    try {
      // Filter estimates by franchise's tenant (franchise.tenantId or fall back to hostname)
      const tenantId = req.franchise.tenantId || getTenantFromHostname(req.hostname);
      const estimates = await storage.getEstimates(tenantId);
      res.json({
        data: estimates,
        meta: {
          total: estimates.length,
          franchiseId: req.franchise.franchiseId
        }
      });
    } catch (error) {
      console.error("Partner API error:", error);
      res.status(500).json({ error: "Failed to fetch estimates" });
    }
  });

  // GET /api/partner/v1/leads - Get leads for franchise
  app.get("/api/partner/v1/leads", partnerApiAuth, requireScope("leads:read"), async (req: any, res) => {
    try {
      // Filter leads by franchise's tenant (franchise.tenantId or fall back to hostname)
      const tenantId = req.franchise.tenantId || getTenantFromHostname(req.hostname);
      const leads = await storage.getLeads(tenantId);
      res.json({
        data: leads,
        meta: {
          total: leads.length,
          franchiseId: req.franchise.franchiseId
        }
      });
    } catch (error) {
      console.error("Partner API error:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // GET /api/partner/v1/locations - Get franchise locations
  app.get("/api/partner/v1/locations", partnerApiAuth, requireScope("locations:read"), async (req: any, res) => {
    try {
      const locations = await storage.getFranchiseLocations(req.franchise.id);
      res.json({
        data: locations,
        meta: { total: locations.length }
      });
    } catch (error) {
      console.error("Partner API error:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // POST /api/partner/v1/locations - Create franchise location
  app.post("/api/partner/v1/locations", partnerApiAuth, requireScope("locations:write"), async (req: any, res) => {
    try {
      const location = await storage.createFranchiseLocation({
        ...req.body,
        franchiseId: req.franchise.id
      });
      res.status(201).json({ data: location });
    } catch (error) {
      console.error("Partner API error:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  // GET /api/partner/v1/billing - Get billing info for franchise
  app.get("/api/partner/v1/billing", partnerApiAuth, requireScope("billing:read"), async (req: any, res) => {
    try {
      const franchise = await storage.getFranchiseById(req.franchise.id);
      res.json({
        data: {
          franchiseTier: franchise?.franchiseTier,
          platformFeeMonthly: franchise?.platformFeeMonthly,
          royaltyPercent: franchise?.royaltyPercent,
          royaltyType: franchise?.royaltyType,
          totalRevenue: franchise?.totalRevenue,
          totalOrders: franchise?.totalOrders
        }
      });
    } catch (error) {
      console.error("Partner API error:", error);
      res.status(500).json({ error: "Failed to fetch billing info" });
    }
  });

  // GET /api/partner/v1/analytics - Get analytics for franchise
  app.get("/api/partner/v1/analytics", partnerApiAuth, requireScope("analytics:read"), async (req: any, res) => {
    try {
      const franchise = await storage.getFranchiseById(req.franchise.id);
      const locations = await storage.getFranchiseLocations(req.franchise.id);
      
      res.json({
        data: {
          totalRevenue: franchise?.totalRevenue || "0.00",
          totalOrders: franchise?.totalOrders || 0,
          activeLocations: locations.filter(l => l.isActive).length,
          hallmarksMinted: franchise?.hallmarksMintedTotal || 0
        },
        meta: {
          range: req.query.range || "30days",
          franchiseId: req.franchise.franchiseId
        }
      });
    } catch (error) {
      console.error("Partner API error:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // ============ PAINT COLORS LIBRARY ============

  // Get all paint colors with optional filters
  app.get("/api/paint-colors", async (req, res) => {
    try {
      const { brand, category, search, limit = "50" } = req.query;
      const colors = await storage.getPaintColors({
        brand: brand as string | undefined,
        category: category as string | undefined,
        search: search as string | undefined,
        limit: parseInt(limit as string)
      });
      res.json(colors);
    } catch (error) {
      console.error("Error fetching paint colors:", error);
      res.status(500).json({ error: "Failed to fetch paint colors" });
    }
  });

  // Get a single paint color by ID
  app.get("/api/paint-colors/:id", async (req, res) => {
    try {
      const color = await storage.getPaintColorById(req.params.id);
      if (!color) {
        return res.status(404).json({ error: "Color not found" });
      }
      res.json(color);
    } catch (error) {
      console.error("Error fetching paint color:", error);
      res.status(500).json({ error: "Failed to fetch paint color" });
    }
  });

  // Get paint colors by brand
  app.get("/api/paint-colors/brand/:brand", async (req, res) => {
    try {
      const colors = await storage.getPaintColors({
        brand: req.params.brand,
        limit: 100
      });
      res.json(colors);
    } catch (error) {
      console.error("Error fetching paint colors by brand:", error);
      res.status(500).json({ error: "Failed to fetch paint colors" });
    }
  });

  // Get coordinating colors for a specific color
  app.get("/api/paint-colors/:id/coordinating", async (req, res) => {
    try {
      const color = await storage.getPaintColorById(req.params.id);
      if (!color) {
        return res.status(404).json({ error: "Color not found" });
      }
      const coordinatingColors = await storage.getCoordinatingColors(color);
      res.json(coordinatingColors);
    } catch (error) {
      console.error("Error fetching coordinating colors:", error);
      res.status(500).json({ error: "Failed to fetch coordinating colors" });
    }
  });

  // Seed paint colors (developer only - one-time setup)
  app.post("/api/paint-colors/seed", async (req, res) => {
    try {
      const count = await storage.seedPaintColors();
      res.json({ success: true, message: `Seeded ${count} paint colors` });
    } catch (error) {
      console.error("Error seeding paint colors:", error);
      res.status(500).json({ error: "Failed to seed paint colors" });
    }
  });

  // Customer color selections
  app.post("/api/color-selections", async (req, res) => {
    try {
      const tenantId = getTenantFromHostname(req.hostname);
      const selection = await storage.createColorSelection({
        ...req.body,
        tenantId
      });
      res.json(selection);
    } catch (error) {
      console.error("Error creating color selection:", error);
      res.status(500).json({ error: "Failed to create color selection" });
    }
  });

  app.get("/api/color-selections/estimate/:estimateId", async (req, res) => {
    try {
      const selections = await storage.getColorSelectionsByEstimate(req.params.estimateId);
      res.json(selections);
    } catch (error) {
      console.error("Error fetching color selections:", error);
      res.status(500).json({ error: "Failed to fetch color selections" });
    }
  });

  // ============ TRIAL TENANTS ============
  
  // Zod schemas for trial tenant validation
  const trialSignupSchema = z.object({
    ownerEmail: z.string().email("Valid email required"),
    ownerName: z.string().min(1, "Name required").max(100),
    ownerPhone: z.string().max(20).optional().nullable(),
    companyName: z.string().min(1, "Company name required").max(100),
    companyCity: z.string().max(100).optional().nullable(),
    companyState: z.string().max(50).optional().nullable(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  });
  
  const trialUpdateSchema = z.object({
    companyName: z.string().min(1).max(100).optional(),
    companyCity: z.string().max(100).optional().nullable(),
    companyState: z.string().max(50).optional().nullable(),
    companyPhone: z.string().max(20).optional().nullable(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    logoUrl: z.string().url().optional().nullable(),
  });
  
  // POST /api/trial/signup - Create a new trial tenant
  app.post("/api/trial/signup", async (req, res) => {
    try {
      // Validate input with Zod
      const parsed = trialSignupSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.errors });
        return;
      }
      
      const { ownerEmail, ownerName, ownerPhone, companyName, companyCity, companyState, primaryColor, accentColor } = parsed.data;
      
      // Check if email already has a trial
      const existingTrial = await storage.getTrialTenantByEmail(ownerEmail);
      if (existingTrial) {
        if (existingTrial.status === 'active') {
          res.status(400).json({ 
            error: "Trial already exists", 
            trialId: existingTrial.id,
            slug: existingTrial.companySlug,
            expiresAt: existingTrial.trialExpiresAt
          });
          return;
        }
      }
      
      // Generate URL-safe slug from company name with timestamp for uniqueness
      const baseSlug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 40);
      
      // Add random suffix for uniqueness (prevents race conditions)
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      let slug = `${baseSlug}-${randomSuffix}`;
      
      // Fallback check in case of collision
      let counter = 1;
      while (await storage.getTrialTenantBySlug(slug) && counter < 10) {
        slug = `${baseSlug}-${randomSuffix}${counter}`;
        counter++;
      }
      
      // Calculate 72-hour expiration
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000);
      
      const trial = await storage.createTrialTenant({
        ownerEmail,
        ownerName,
        ownerPhone: ownerPhone || null,
        companyName,
        companySlug: slug,
        companyCity: companyCity || null,
        companyState: companyState || null,
        companyPhone: null,
        companyEmail: ownerEmail,
        logoUrl: null,
        primaryColor: primaryColor || '#4A5D3E',
        accentColor: accentColor || '#5A6D4E',
        status: 'active',
        trialExpiresAt: expiresAt,
        estimatesLimit: 1,
        leadsLimit: 3,
        blockchainStampsLimit: 1,
      });
      
      // Log the trial creation
      await storage.logTrialUsage({
        trialTenantId: trial.id,
        action: 'trial_created',
        resourceType: 'trial',
        resourceId: trial.id,
        metadata: { source: 'api_signup' }
      });
      
      res.status(201).json({
        success: true,
        trial: {
          id: trial.id,
          slug: trial.companySlug,
          expiresAt: trial.trialExpiresAt,
          limits: {
            estimates: trial.estimatesLimit,
            leads: trial.leadsLimit,
            blockchainStamps: trial.blockchainStampsLimit
          }
        },
        portalUrl: `/trial/${trial.companySlug}`
      });
    } catch (error) {
      console.error("Error creating trial tenant:", error);
      res.status(500).json({ error: "Failed to create trial" });
    }
  });

  // ============ TRIAL UPGRADE ENDPOINTS (MUST COME BEFORE :slug ROUTES) ============
  
  // Pricing plans for trial upgrade
  const UPGRADE_PLANS = {
    starter: {
      id: 'starter',
      name: 'Starter',
      price: 49,
      interval: 'month',
      features: ['Unlimited estimates', 'Up to 50 leads/month', '5 blockchain stamps/month', 'Basic branding']
    },
    professional: {
      id: 'professional', 
      name: 'Professional',
      price: 99,
      interval: 'month',
      features: ['Unlimited estimates', 'Unlimited leads', '25 blockchain stamps/month', 'Full branding', 'Priority support']
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      interval: 'month',
      features: ['Everything in Professional', 'Unlimited blockchain stamps', 'White-label domain', 'API access', 'Dedicated support']
    }
  };
  
  // GET /api/trial/plans - Get available upgrade plans (MUST BE BEFORE :slug)
  app.get("/api/trial/plans", async (req, res) => {
    res.json(Object.values(UPGRADE_PLANS));
  });
  
  // GET /api/trial/:slug - Get trial tenant by slug
  app.get("/api/trial/:slug", async (req, res) => {
    try {
      const trial = await storage.getTrialTenantBySlug(req.params.slug);
      if (!trial) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      // Check if expired
      const now = new Date();
      if (trial.status === 'active' && new Date(trial.trialExpiresAt) < now) {
        await storage.updateTrialTenant(trial.id, { status: 'expired' });
        trial.status = 'expired';
      }
      
      // Calculate time remaining
      const expiresAt = new Date(trial.trialExpiresAt);
      const hoursRemaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));
      
      res.json({
        ...trial,
        hoursRemaining,
        isExpired: trial.status === 'expired' || hoursRemaining === 0,
        usage: {
          estimates: { used: trial.estimatesUsed, limit: trial.estimatesLimit },
          leads: { used: trial.leadsUsed, limit: trial.leadsLimit },
          blockchainStamps: { used: trial.blockchainStampsUsed, limit: trial.blockchainStampsLimit }
        },
        progress: {
          currentStep: trial.onboardingStep,
          completedSteps: trial.completedSteps || []
        }
      });
    } catch (error) {
      console.error("Error fetching trial tenant:", error);
      res.status(500).json({ error: "Failed to fetch trial" });
    }
  });
  
  // PATCH /api/trial/:id - Update trial tenant settings
  app.patch("/api/trial/:id", async (req, res) => {
    try {
      // Validate input with Zod
      const parsed = trialUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.errors });
        return;
      }
      
      const updates: Record<string, any> = {};
      Object.entries(parsed.data).forEach(([key, value]) => {
        if (value !== undefined) {
          updates[key] = value;
        }
      });
      
      if (Object.keys(updates).length === 0) {
        res.status(400).json({ error: "No valid updates provided" });
        return;
      }
      
      const trial = await storage.updateTrialTenant(req.params.id, updates);
      if (!trial) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      res.json(trial);
    } catch (error) {
      console.error("Error updating trial tenant:", error);
      res.status(500).json({ error: "Failed to update trial" });
    }
  });
  
  // Zod schema for step completion
  const trialStepSchema = z.object({
    step: z.enum(['setup', 'visualizer', 'estimate', 'stamp'], {
      errorMap: () => ({ message: "Step must be one of: setup, visualizer, estimate, stamp" })
    }),
  });
  
  // Zod schema for usage increment
  const trialUsageSchema = z.object({
    field: z.enum(['estimatesUsed', 'leadsUsed', 'blockchainStampsUsed'], {
      errorMap: () => ({ message: "Field must be one of: estimatesUsed, leadsUsed, blockchainStampsUsed" })
    }),
  });
  
  // POST /api/trial/:id/complete-step - Mark a trial step as complete
  app.post("/api/trial/:id/complete-step", async (req, res) => {
    try {
      const parsed = trialStepSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.errors });
        return;
      }
      const { step } = parsed.data;
      
      const trial = await storage.markTrialStepComplete(req.params.id, step);
      if (!trial) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      // Log the step completion
      await storage.logTrialUsage({
        trialTenantId: trial.id,
        action: 'step_completed',
        resourceType: 'onboarding',
        resourceId: step,
        metadata: { step, totalCompleted: trial.completedSteps?.length || 0 }
      });
      
      res.json({
        completedSteps: trial.completedSteps,
        currentStep: trial.onboardingStep
      });
    } catch (error) {
      console.error("Error completing trial step:", error);
      res.status(500).json({ error: "Failed to complete step" });
    }
  });
  
  // POST /api/trial/:id/increment-usage - Increment usage counter
  app.post("/api/trial/:id/increment-usage", async (req, res) => {
    try {
      const parsed = trialUsageSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Validation failed", details: parsed.error.errors });
        return;
      }
      const { field } = parsed.data;
      
      // Check current limits first
      const existing = await storage.getTrialTenantById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      const limitField = field.replace('Used', 'Limit') as 'estimatesLimit' | 'leadsLimit' | 'blockchainStampsLimit';
      const currentUsage = existing[field as 'estimatesUsed' | 'leadsUsed' | 'blockchainStampsUsed'];
      const limit = existing[limitField];
      
      if (currentUsage >= limit) {
        res.status(403).json({ 
          error: "Usage limit reached",
          field,
          used: currentUsage,
          limit,
          upgradeRequired: true
        });
        return;
      }
      
      const trial = await storage.incrementTrialUsage(req.params.id, field as 'estimatesUsed' | 'leadsUsed' | 'blockchainStampsUsed');
      if (!trial) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      // Log the usage
      await storage.logTrialUsage({
        trialTenantId: trial.id,
        action: field.replace('Used', '_used'),
        resourceType: field.replace('Used', '').toLowerCase(),
        metadata: { newCount: trial[field as 'estimatesUsed' | 'leadsUsed' | 'blockchainStampsUsed'] }
      });
      
      res.json({
        success: true,
        usage: {
          estimates: { used: trial.estimatesUsed, limit: trial.estimatesLimit },
          leads: { used: trial.leadsUsed, limit: trial.leadsLimit },
          blockchainStamps: { used: trial.blockchainStampsUsed, limit: trial.blockchainStampsLimit }
        }
      });
    } catch (error) {
      console.error("Error incrementing trial usage:", error);
      res.status(500).json({ error: "Failed to increment usage" });
    }
  });
  
  // GET /api/trial/:id/usage-logs - Get trial usage history
  app.get("/api/trial/:id/usage-logs", async (req, res) => {
    try {
      const logs = await storage.getTrialUsageLogs(req.params.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching trial usage logs:", error);
      res.status(500).json({ error: "Failed to fetch usage logs" });
    }
  });
  
  // POST /api/trial/expire-all - Expire all trials past their expiration (admin endpoint)
  app.post("/api/trial/expire-all", async (req, res) => {
    try {
      const count = await storage.expireTrialTenants();
      res.json({ expired: count });
    } catch (error) {
      console.error("Error expiring trial tenants:", error);
      res.status(500).json({ error: "Failed to expire trials" });
    }
  });

  // POST /api/trial/:id/upgrade - Create upgrade checkout session
  app.post("/api/trial/:id/upgrade", async (req, res) => {
    try {
      if (!stripe) {
        res.status(500).json({ error: "Payment processing not configured" });
        return;
      }
      
      const { planId } = req.body;
      if (!planId || !UPGRADE_PLANS[planId as keyof typeof UPGRADE_PLANS]) {
        res.status(400).json({ error: "Invalid plan selected" });
        return;
      }
      
      const trial = await storage.getTrialTenantById(req.params.id);
      if (!trial) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      const plan = UPGRADE_PLANS[planId as keyof typeof UPGRADE_PLANS];
      const host = `https://${req.get("host")}`;
      
      // Create Stripe checkout session for subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `PaintPros.io ${plan.name} Plan`,
                description: `Monthly subscription for ${trial.companyName}`,
              },
              unit_amount: plan.price * 100,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${host}/trial/${trial.companySlug}/upgrade-success?session_id={CHECKOUT_SESSION_ID}&plan=${plan.id}`,
        cancel_url: `${host}/trial/${trial.companySlug}?upgrade=cancelled`,
        customer_email: trial.ownerEmail,
        metadata: {
          trialId: trial.id,
          trialSlug: trial.companySlug,
          planId: plan.id,
          type: "trial_upgrade",
        },
        subscription_data: {
          metadata: {
            trialId: trial.id,
            companyName: trial.companyName,
            planId: plan.id,
          },
        },
      });
      
      // Log the upgrade attempt
      await storage.logTrialUsage({
        trialTenantId: trial.id,
        action: 'upgrade_initiated',
        resourceType: 'subscription',
        metadata: { planId: plan.id, sessionId: session.id }
      });
      
      res.json({ 
        sessionId: session.id, 
        url: session.url,
        plan: plan
      });
    } catch (error: any) {
      console.error("Error creating upgrade checkout:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });
  
  // POST /api/trial/:id/convert - Convert trial to full tenant (called after successful payment)
  app.post("/api/trial/:id/convert", async (req, res) => {
    try {
      const { planId, stripeSessionId } = req.body;
      
      // Validate plan ID
      const validPlans = ['starter', 'professional', 'enterprise'];
      if (!planId || !validPlans.includes(planId)) {
        res.status(400).json({ error: "Invalid plan selected" });
        return;
      }
      
      // Validate session ID exists
      if (!stripeSessionId) {
        res.status(400).json({ error: "Missing payment session" });
        return;
      }
      
      const trial = await storage.getTrialTenantById(req.params.id);
      if (!trial) {
        res.status(404).json({ error: "Trial not found" });
        return;
      }
      
      // Prevent double conversion
      if (trial.status === 'converted') {
        res.json({
          success: true,
          message: "Trial already converted",
          tenant: {
            id: `tenant_${trial.companySlug}`,
            companyName: trial.companyName,
            companySlug: trial.companySlug,
            ownerEmail: trial.ownerEmail,
            planId,
          }
        });
        return;
      }
      
      // Verify status is active or expired (expired can still upgrade)
      if (trial.status !== 'active' && trial.status !== 'expired') {
        res.status(400).json({ error: "Trial cannot be upgraded" });
        return;
      }
      
      // Verify Stripe session if Stripe is configured
      let verifiedPlanId = planId;
      let stripeCustomerId: string | undefined;
      let stripeSubscriptionId: string | undefined;
      
      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
          
          // Verify session is completed
          if (session.payment_status !== 'paid') {
            res.status(400).json({ error: "Payment not completed" });
            return;
          }
          
          // Verify session belongs to this trial
          if (session.metadata?.trialId !== trial.id) {
            res.status(400).json({ error: "Invalid payment session" });
            return;
          }
          
          // Use plan from Stripe metadata (source of truth)
          if (session.metadata?.planId && validPlans.includes(session.metadata.planId)) {
            verifiedPlanId = session.metadata.planId;
          }
          
          stripeCustomerId = session.customer as string | undefined;
          stripeSubscriptionId = session.subscription as string | undefined;
        } catch (stripeError: any) {
          console.error("Stripe session verification failed:", stripeError);
          res.status(400).json({ error: "Could not verify payment" });
          return;
        }
      }
      
      // Update trial status to converted
      await storage.updateTrialTenant(trial.id, { 
        status: 'converted',
        convertedAt: new Date(),
      });
      
      // Generate the new tenant ID from the slug
      const newTenantId = `tenant_${trial.companySlug}`;
      
      // Log the conversion
      await storage.logTrialUsage({
        trialTenantId: trial.id,
        action: 'converted_to_paid',
        resourceType: 'tenant',
        metadata: { 
          planId: verifiedPlanId, 
          newTenantId,
          stripeSessionId,
          stripeCustomerId,
          stripeSubscriptionId
        }
      });
      
      res.json({
        success: true,
        message: "Trial successfully converted to paid account",
        tenant: {
          id: newTenantId,
          companyName: trial.companyName,
          companySlug: trial.companySlug,
          ownerEmail: trial.ownerEmail,
          planId: verifiedPlanId,
        },
        // All trial data is preserved and accessible
        preservedData: {
          branding: {
            primaryColor: trial.primaryColor,
            accentColor: trial.accentColor,
            logoUrl: trial.logoUrl,
          },
          usage: {
            estimatesCreated: trial.estimatesUsed,
            leadsCaptured: trial.leadsUsed,
            blockchainStamps: trial.blockchainStampsUsed,
          },
          portalUrl: `/trial/${trial.companySlug}`, // Will redirect to full portal
        }
      });
    } catch (error) {
      console.error("Error converting trial:", error);
      res.status(500).json({ error: "Failed to convert trial" });
    }
  });

  return httpServer;
}

// Helper: Convert WMO weather code to condition/description/icon
function getWeatherFromCode(code: number, isDay: boolean): { condition: string; description: string; icon: string } {
  const dayIcons: Record<number, { condition: string; description: string; icon: string }> = {
    0: { condition: "Clear", description: "Clear sky", icon: "sun" },
    1: { condition: "Mostly Clear", description: "Mainly clear", icon: "sun" },
    2: { condition: "Partly Cloudy", description: "Partly cloudy", icon: "cloud-sun" },
    3: { condition: "Overcast", description: "Overcast", icon: "cloud" },
    45: { condition: "Foggy", description: "Fog", icon: "cloud-fog" },
    48: { condition: "Foggy", description: "Depositing rime fog", icon: "cloud-fog" },
    51: { condition: "Drizzle", description: "Light drizzle", icon: "cloud-drizzle" },
    53: { condition: "Drizzle", description: "Moderate drizzle", icon: "cloud-drizzle" },
    55: { condition: "Drizzle", description: "Dense drizzle", icon: "cloud-drizzle" },
    56: { condition: "Freezing Drizzle", description: "Light freezing drizzle", icon: "cloud-drizzle" },
    57: { condition: "Freezing Drizzle", description: "Dense freezing drizzle", icon: "cloud-drizzle" },
    61: { condition: "Rain", description: "Slight rain", icon: "cloud-rain" },
    63: { condition: "Rain", description: "Moderate rain", icon: "cloud-rain" },
    65: { condition: "Heavy Rain", description: "Heavy rain", icon: "cloud-rain" },
    66: { condition: "Freezing Rain", description: "Light freezing rain", icon: "cloud-rain" },
    67: { condition: "Freezing Rain", description: "Heavy freezing rain", icon: "cloud-rain" },
    71: { condition: "Snow", description: "Slight snowfall", icon: "cloud-snow" },
    73: { condition: "Snow", description: "Moderate snowfall", icon: "cloud-snow" },
    75: { condition: "Heavy Snow", description: "Heavy snowfall", icon: "cloud-snow" },
    77: { condition: "Snow Grains", description: "Snow grains", icon: "cloud-snow" },
    80: { condition: "Rain Showers", description: "Slight rain showers", icon: "cloud-rain" },
    81: { condition: "Rain Showers", description: "Moderate rain showers", icon: "cloud-rain" },
    82: { condition: "Heavy Showers", description: "Violent rain showers", icon: "cloud-rain" },
    85: { condition: "Snow Showers", description: "Slight snow showers", icon: "cloud-snow" },
    86: { condition: "Snow Showers", description: "Heavy snow showers", icon: "cloud-snow" },
    95: { condition: "Thunderstorm", description: "Thunderstorm", icon: "cloud-lightning" },
    96: { condition: "Thunderstorm", description: "Thunderstorm with slight hail", icon: "cloud-lightning" },
    99: { condition: "Thunderstorm", description: "Thunderstorm with heavy hail", icon: "cloud-lightning" }
  };
  
  const result = dayIcons[code] || { condition: "Unknown", description: "Unknown conditions", icon: "cloud" };
  
  // Swap day icons for night icons
  if (!isDay) {
    if (result.icon === "sun") result.icon = "moon";
    if (result.icon === "cloud-sun") result.icon = "cloud-moon";
  }
  
  return result;
}

// Helper: Convert wind direction degrees to compass direction
function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
