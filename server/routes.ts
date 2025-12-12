import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEstimateRequestSchema, insertLeadSchema, insertEstimateSchema, insertSeoTagSchema,
  insertCrmDealSchema, insertCrmActivitySchema, insertCrmNoteSchema, insertUserPinSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  return httpServer;
}
