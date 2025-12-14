import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEstimateRequestSchema, insertLeadSchema, insertEstimateSchema, insertSeoTagSchema,
  insertCrmDealSchema, insertCrmActivitySchema, insertCrmNoteSchema, insertUserPinSchema,
  insertBlockchainStampSchema, insertHallmarkSchema, insertProposalTemplateSchema, insertProposalSchema,
  insertPaymentSchema, insertRoomScanSchema, insertPageViewSchema, ANCHORABLE_TYPES, FOUNDING_ASSETS,
  insertEstimatePhotoSchema, insertEstimatePricingOptionSchema, insertProposalSignatureSchema, insertEstimateFollowupSchema,
  insertDocumentAssetSchema, TENANT_PREFIXES
} from "@shared/schema";
import * as crypto from "crypto";
import OpenAI from "openai";
import { z } from "zod";
import * as solana from "./solana";
import { orbitEcosystem } from "./orbit";
import * as hallmarkService from "./hallmarkService";
import { sendContactEmail, type ContactFormData } from "./resend";
import { setupAuth, isAuthenticated } from "./replitAuth";
import type { RequestHandler } from "express";

// Helper function to format time ago
function formatTimeAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

// Role-based access middleware
const hasRole = (allowedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    const user = req.user as any;
    
    if (!req.isAuthenticated() || !user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = user.claims.sub;
      const dbUser = await storage.getUser(userId);
      
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

// Domain to tenant mapping (server-side)
// Full custom domains map directly
const domainTenantMap: Record<string, string> = {
  "paintpros.io": "demo",
  "www.paintpros.io": "demo",
  "nashpaintpros.io": "npp",
  "www.nashpaintpros.io": "npp",
  "nashvillepaintingprofessionals.com": "npp",
  "www.nashvillepaintingprofessionals.com": "npp",
  "localhost": "npp",
};

// Subdomain to tenant mapping for *.paintpros.io
const subdomainTenantMap: Record<string, string> = {
  "nashpaintpros": "npp",
  "npp": "npp",
  "demo": "demo",
  "www": "demo",
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

function getTenantFromHostname(hostname: string): string {
  const host = hostname.toLowerCase().split(':')[0]; // Remove port if present
  
  // Check full domain mapping first (custom domains)
  if (domainTenantMap[host]) {
    return domainTenantMap[host];
  }
  
  // Check for subdomain pattern: subdomain.paintpros.io
  const parts = host.split('.');
  if (parts.length >= 3) {
    const subdomain = parts[0];
    const baseDomain = parts.slice(-2).join('.');
    
    // Only parse subdomains for paintpros.io
    if (baseDomain === 'paintpros.io' && subdomainTenantMap[subdomain]) {
      return subdomainTenantMap[subdomain];
    }
  }
  
  // Default fallback
  return "npp";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============ REPLIT AUTH ============
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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
      const validatedData = insertLeadSchema.parse(req.body);
      
      // Check if lead already exists
      let lead = await storage.getLeadByEmail(validatedData.email);
      
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
      const { search } = req.query;
      let leadsList;
      if (search && typeof search === "string") {
        leadsList = await storage.searchLeads(search);
      } else {
        leadsList = await storage.getLeads();
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
      const validatedData = insertEstimateSchema.parse(req.body);
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
      const estimates = await storage.getEstimates();
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

  // ============ CRM DEALS ============
  
  // GET /api/crm/deals - Get all deals
  app.get("/api/crm/deals", async (req, res) => {
    try {
      const { stage } = req.query;
      let deals;
      if (stage && typeof stage === "string") {
        deals = await storage.getCrmDealsByStage(stage);
      } else {
        deals = await storage.getCrmDeals();
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
      const summary = await storage.getCrmPipelineSummary();
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
      const validatedData = insertCrmDealSchema.parse(req.body);
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
      const deal = await storage.updateCrmDeal(req.params.id, req.body);
      if (!deal) {
        res.status(404).json({ error: "Deal not found" });
        return;
      }
      res.json(deal);
    } catch (error) {
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
      const validatedData = insertCrmNoteSchema.parse(req.body);
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
      const note = await storage.updateCrmNote(req.params.id, content);
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

  // POST /api/auth/pin/verify - Verify PIN
  app.post("/api/auth/pin/verify", async (req, res) => {
    try {
      const { role, pin } = req.body;
      if (!role || !pin) {
        res.status(400).json({ error: "Role and PIN required" });
        return;
      }
      const userPin = await storage.getUserPinByRole(role);
      if (!userPin) {
        res.json({ valid: false, mustChangePin: false });
        return;
      }
      const valid = userPin.pin === pin;
      res.json({ valid, mustChangePin: valid ? userPin.mustChangePin : false });
    } catch (error) {
      console.error("Error verifying PIN:", error);
      res.status(500).json({ error: "Failed to verify PIN" });
    }
  });

  // POST /api/auth/pin/change - Change PIN
  app.post("/api/auth/pin/change", async (req, res) => {
    try {
      const { role, currentPin, newPin } = req.body;
      if (!role || !currentPin || !newPin) {
        res.status(400).json({ error: "Role, current PIN, and new PIN required" });
        return;
      }
      const userPin = await storage.getUserPinByRole(role);
      if (!userPin || userPin.pin !== currentPin) {
        res.status(401).json({ error: "Invalid current PIN" });
        return;
      }
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
        { role: "area_manager", pin: "2222", mustChangePin: false },
        { role: "developer", pin: "0424", mustChangePin: false }
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
          version: "1.0.0", 
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
      let currentVersion = latestRelease?.version || "1.0.0";
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

  // POST /api/releases/:id/stamp - Stamp release to Solana (tenant-aware)
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
      
      const wallet = solana.getWalletFromPrivateKey(privateKey);
      const result = await solana.stampHashToBlockchain(
        release.contentHash,
        wallet,
        network,
        { entityType: 'release', entityId: release.id },
        release.tenantId // Pass tenant for proper memo prefix
      );
      
      const updated = await storage.updateReleaseSolanaStatus(
        release.id,
        result.signature,
        "confirmed"
      );
      
      if (release.hallmarkId) {
        const explorerUrl = network === "devnet"
          ? `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
          : `https://explorer.solana.com/tx/${result.signature}`;
        await storage.updateHallmarkBlockchain(release.hallmarkId, result.signature, explorerUrl);
      }
      
      res.json({
        release: updated,
        blockchain: {
          signature: result.signature,
          explorerUrl: network === "devnet"
            ? `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
            : `https://explorer.solana.com/tx/${result.signature}`
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
      const { messages, tenantName } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Messages array required" });
        return;
      }

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const systemPrompt = `You are Rollie, a friendly and helpful AI assistant for ${tenantName || "a professional painting company"}. 
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
Use occasional paint-related puns or references to keep things fun!`;

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
      const { text } = req.body;
      
      if (!text || typeof text !== "string") {
        res.status(400).json({ error: "Text is required" });
        return;
      }

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const mp3Response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
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
      
      if (!customerName || !customerEmail || !serviceType || !scheduledDate || !scheduledTime) {
        res.status(400).json({ error: "Missing required fields: customerName, customerEmail, serviceType, scheduledDate, scheduledTime" });
        return;
      }

      const booking = await storage.createBooking({
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

      res.status(201).json(booking);
    } catch (error) {
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

  return httpServer;
}
