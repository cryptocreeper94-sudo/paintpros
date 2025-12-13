import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Leads Table - Email capture
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Estimates Table - Detailed quote storage
export const estimates = pgTable("estimates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id).notNull(),
  
  // Job selections
  includeWalls: boolean("include_walls").default(false).notNull(),
  includeTrim: boolean("include_trim").default(false).notNull(),
  includeCeilings: boolean("include_ceilings").default(false).notNull(),
  doorCount: integer("door_count").default(0).notNull(),
  
  // Measurements
  squareFootage: integer("square_footage").default(0),
  
  // Calculated pricing
  wallsPrice: decimal("walls_price", { precision: 10, scale: 2 }).default("0"),
  trimPrice: decimal("trim_price", { precision: 10, scale: 2 }).default("0"),
  ceilingsPrice: decimal("ceilings_price", { precision: 10, scale: 2 }).default("0"),
  doorsPrice: decimal("doors_price", { precision: 10, scale: 2 }).default("0"),
  totalEstimate: decimal("total_estimate", { precision: 10, scale: 2 }).notNull(),
  
  // Pricing tier used
  pricingTier: text("pricing_tier").notNull(), // 'full_job', 'walls_only', 'doors_only', 'custom'
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending, contacted, converted
});

export const insertEstimateSchema = createInsertSchema(estimates).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertEstimate = z.infer<typeof insertEstimateSchema>;
export type Estimate = typeof estimates.$inferSelect;

// Legacy estimate requests (keeping for backwards compatibility)
export const estimateRequests = pgTable("estimate_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  projectType: text("project_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertEstimateRequestSchema = createInsertSchema(estimateRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertEstimateRequest = z.infer<typeof insertEstimateRequestSchema>;
export type EstimateRequest = typeof estimateRequests.$inferSelect;

// SEO Tags Table - Owner-managed SEO keywords and meta tags
export const seoTags = pgTable("seo_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tagType: text("tag_type").notNull(), // 'keyword', 'meta_description', 'title', 'geo'
  value: text("value").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by").default("owner"),
});

export const insertSeoTagSchema = createInsertSchema(seoTags).omit({
  id: true,
  createdAt: true,
});

export type InsertSeoTag = z.infer<typeof insertSeoTagSchema>;
export type SeoTag = typeof seoTags.$inferSelect;

// ============ CRM TABLES ============

// CRM Deals - Sales pipeline
export const crmDeals = pgTable("crm_deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).default("0"),
  stage: text("stage").notNull().default("new_lead"), // new_lead, quoted, negotiating, won, lost
  leadId: varchar("lead_id").references(() => leads.id),
  probability: integer("probability").default(50),
  expectedCloseDate: timestamp("expected_close_date"),
  ownerId: text("owner_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCrmDealSchema = createInsertSchema(crmDeals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCrmDeal = z.infer<typeof insertCrmDealSchema>;
export type CrmDeal = typeof crmDeals.$inferSelect;

// CRM Activities - Timeline/interactions
export const crmActivities = pgTable("crm_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // lead, deal
  entityId: varchar("entity_id").notNull(),
  activityType: text("activity_type").notNull(), // call, email, visit, note
  title: text("title").notNull(),
  description: text("description"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCrmActivitySchema = createInsertSchema(crmActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertCrmActivity = z.infer<typeof insertCrmActivitySchema>;
export type CrmActivity = typeof crmActivities.$inferSelect;

// CRM Notes - Notes on entities
export const crmNotes = pgTable("crm_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // lead, deal
  entityId: varchar("entity_id").notNull(),
  content: text("content").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCrmNoteSchema = createInsertSchema(crmNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCrmNote = z.infer<typeof insertCrmNoteSchema>;
export type CrmNote = typeof crmNotes.$inferSelect;

// User PIN settings (for forced PIN change on first login)
export const userPins = pgTable("user_pins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull().unique(), // ops_manager, owner
  pin: text("pin").notNull(),
  mustChangePin: boolean("must_change_pin").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserPinSchema = createInsertSchema(userPins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPin = z.infer<typeof insertUserPinSchema>;
export type UserPin = typeof userPins.$inferSelect;

// Blockchain Stamps - Solana document hashing
export const blockchainStamps = pgTable("blockchain_stamps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityType: text("entity_type").notNull(), // estimate, document, contract
  entityId: varchar("entity_id").notNull(),
  documentHash: text("document_hash").notNull(), // SHA-256 hash
  transactionSignature: text("transaction_signature"), // Solana tx signature
  network: text("network").notNull().default("devnet"), // devnet, mainnet-beta
  slot: integer("slot"), // Solana slot number
  blockTime: timestamp("block_time"), // Timestamp from blockchain
  status: text("status").notNull().default("pending"), // pending, confirmed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlockchainStampSchema = createInsertSchema(blockchainStamps).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertBlockchainStamp = z.infer<typeof insertBlockchainStampSchema>;
export type BlockchainStamp = typeof blockchainStamps.$inferSelect;

// ============ ORBIT HALLMARK SYSTEM ============

// Hallmarks Table - Unique asset identifiers
export const hallmarks = pgTable("hallmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hallmarkNumber: varchar("hallmark_number", { length: 50 }).notNull().unique(),
  assetNumber: varchar("asset_number", { length: 30 }),
  assetType: text("asset_type").notNull(),
  referenceId: varchar("reference_id"),
  createdBy: text("created_by").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientRole: text("recipient_role").notNull(),
  contentHash: text("content_hash").notNull(),
  metadata: jsonb("metadata").default({}),
  searchTerms: text("search_terms"),
  verifiedAt: timestamp("verified_at"),
  blockchainTxSignature: text("blockchain_tx_signature"),
  blockchainExplorerUrl: text("blockchain_explorer_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertHallmarkSchema = createInsertSchema(hallmarks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  verifiedAt: true,
  blockchainTxSignature: true,
  blockchainExplorerUrl: true,
});

export type InsertHallmark = z.infer<typeof insertHallmarkSchema>;
export type Hallmark = typeof hallmarks.$inferSelect;

// Hallmark Audit Table - Track all actions on hallmarks
export const hallmarkAudit = pgTable("hallmark_audit", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hallmarkId: varchar("hallmark_id").references(() => hallmarks.id).notNull(),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  details: jsonb("details").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHallmarkAuditSchema = createInsertSchema(hallmarkAudit).omit({
  id: true,
  createdAt: true,
});

export type InsertHallmarkAudit = z.infer<typeof insertHallmarkAuditSchema>;
export type HallmarkAudit = typeof hallmarkAudit.$inferSelect;

// Blockchain Hash Queue - For batched blockchain anchoring
export const blockchainHashQueue = pgTable("blockchain_hash_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hallmarkId: varchar("hallmark_id").references(() => hallmarks.id).notNull(),
  contentHash: text("content_hash").notNull(),
  assetType: text("asset_type").notNull(),
  status: text("status").notNull().default("queued"),
  merkleRoot: text("merkle_root"),
  batchId: varchar("batch_id"),
  transactionSignature: text("transaction_signature"),
  queuedAt: timestamp("queued_at").defaultNow().notNull(),
  anchoredAt: timestamp("anchored_at"),
});

export const insertBlockchainHashQueueSchema = createInsertSchema(blockchainHashQueue).omit({
  id: true,
  queuedAt: true,
  anchoredAt: true,
  status: true,
});

export type InsertBlockchainHashQueue = z.infer<typeof insertBlockchainHashQueueSchema>;
export type BlockchainHashQueue = typeof blockchainHashQueue.$inferSelect;

// Asset Number Counter - For sequential numbering
export const assetNumberCounter = pgTable("asset_number_counter", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nextMasterNumber: integer("next_master_number").notNull().default(3000),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tenant Asset Counters - Per-tenant sequential hallmark numbering
export const tenantAssetCounters = pgTable("tenant_asset_counters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().unique(), // npp, demo, orbit
  prefix: text("prefix").notNull(), // NPP, PAINTPROS, ORBIT
  nextOrdinal: integer("next_ordinal").notNull().default(2), // Start at 2 since 01 is genesis/app
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertTenantAssetCounterSchema = createInsertSchema(tenantAssetCounters).omit({
  id: true,
  lastUpdated: true,
});

export type InsertTenantAssetCounter = z.infer<typeof insertTenantAssetCounterSchema>;
export type TenantAssetCounter = typeof tenantAssetCounters.$inferSelect;

// Document Assets - Trackable assets with opt-in Solana hashing
export const documentAssets = pgTable("document_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(), // npp, demo, orbit
  sourceType: text("source_type").notNull(), // estimate, contract, invoice, employee, warranty, etc.
  sourceId: varchar("source_id").notNull(), // Reference to the source record ID
  hallmarkNumber: varchar("hallmark_number", { length: 50 }).notNull().unique(), // NPP-000000000-02
  ordinal: integer("ordinal").notNull(), // The sequence number (2, 3, 4...)
  sha256Hash: text("sha256_hash").notNull(), // Hash of the document content
  title: text("title").notNull(), // Human-readable title
  description: text("description"), // Optional description
  hashToSolana: boolean("hash_to_solana").default(false).notNull(), // User opt-in for blockchain
  solanaStatus: text("solana_status").default("not_requested"), // not_requested, queued, pending, confirmed, failed
  solanaTxSignature: text("solana_tx_signature"), // Blockchain transaction signature
  solanaSlot: integer("solana_slot"), // Solana slot number
  solanaBlockTime: timestamp("solana_block_time"), // Timestamp from blockchain
  metadata: jsonb("metadata").default({}), // Additional document metadata
  createdBy: text("created_by"), // Who created this asset
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDocumentAssetSchema = createInsertSchema(documentAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  solanaStatus: true,
  solanaTxSignature: true,
  solanaSlot: true,
  solanaBlockTime: true,
});

export type InsertDocumentAsset = z.infer<typeof insertDocumentAssetSchema>;
export type DocumentAsset = typeof documentAssets.$inferSelect;

// Founding Assets - Reserved immutable assets
export const FOUNDING_ASSETS = {
  ORBIT_GENESIS: { 
    number: '#000000000-01', 
    special: '#FE-000000000-01',
    name: 'ORBIT Genesis', 
    type: 'genesis',
    badge: 'Genesis Asset',
  },
  PAINTPROS_PLATFORM: { 
    number: 'PAINTPROS-000000000-01', 
    special: 'PAINTPROS-FE-000000000-01',
    name: 'Paint Pros by ORBIT', 
    type: 'platform',
    badge: 'Paint Pros Platform',
  },
  NPP_GENESIS: { 
    number: 'NPP-000000000-01', 
    special: 'NPP-FE-000000000-01',
    name: 'Nashville Painting Professionals', 
    type: 'tenant-genesis',
    badge: 'NPP Verified',
  },
  JASON_FOUNDER: { 
    number: '#000000002-00', 
    special: '#FE-000000002-00',
    name: 'Jason', 
    type: 'founder',
    badge: 'Founding Developer',
    access: 'dev-bypass',
  },
  SIDONIE_TEAM: { 
    number: '#000000003-00', 
    special: '#FE-000000003-00',
    name: 'Sidonie', 
    type: 'team',
    badge: 'Founding Team',
    access: 'read-only',
  },
} as const;

// Release Versions Table - Track app releases and hallmarks (tenant-aware)
export const releaseVersions = pgTable("release_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("orbit").notNull(), // orbit = platform, npp = Nashville Painting Professionals, demo = PaintPros demo
  version: text("version").notNull(),
  buildNumber: integer("build_number").notNull(),
  hallmarkId: varchar("hallmark_id").references(() => hallmarks.id),
  contentHash: text("content_hash").notNull(),
  solanaTxSignature: text("solana_tx_signature"),
  solanaTxStatus: text("solana_tx_status").default("pending"),
  deploymentId: text("deployment_id"),
  releaseNotes: text("release_notes"), // What changed in this version
  metadata: jsonb("metadata"),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReleaseVersionSchema = createInsertSchema(releaseVersions).omit({
  id: true,
  issuedAt: true,
  createdAt: true,
  solanaTxStatus: true,
});

export type InsertReleaseVersion = z.infer<typeof insertReleaseVersionSchema>;
export type ReleaseVersion = typeof releaseVersions.$inferSelect;

// Edition Prefixes
export const EDITION_PREFIXES = {
  GE: 'Genesis Edition',
  LE: 'Limited Edition',
  SE: 'Special Edition',
  FE: "Founder's Edition",
  CE: "Collector's Edition",
  ANN: 'Anniversary Edition',
  PT: 'Platinum Tier',
  DW: 'DarkWave Studios',
  PP: 'Paint Pros Edition',
  NPP: 'Nashville Painting Professionals',
} as const;

export const TENANT_PREFIXES: Record<string, { prefix: string; name: string; color: string }> = {
  npp: { prefix: 'NPP', name: 'Nashville Painting Professionals', color: '#5a7a4d' },
  demo: { prefix: 'PAINTPROS', name: 'PaintPros.io', color: '#d4a853' },
  orbit: { prefix: 'ORBIT', name: 'ORBIT Platform', color: '#9945FF' },
} as const;

// Anchorable asset types
export const ANCHORABLE_TYPES = [
  'invoice', 'paystub', 'payroll', 'letter', 'equipment', 'report',
  'contract', 'certification', 'background_check', 'i9_verification',
  'release', 'franchise', 'audit', 'estimate', 'quote', 'proposal'
] as const;

// ============ PROPOSAL TEMPLATES ============

// Proposal Templates - Painting industry proposal templates
export const proposalTemplates = pgTable("proposal_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // interior, exterior, commercial, residential
  content: text("content").notNull(), // Template content with placeholders
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProposalTemplateSchema = createInsertSchema(proposalTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProposalTemplate = z.infer<typeof insertProposalTemplateSchema>;
export type ProposalTemplate = typeof proposalTemplates.$inferSelect;

// Proposals - Generated proposals from templates
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").references(() => proposalTemplates.id),
  estimateId: varchar("estimate_id").references(() => estimates.id),
  leadId: varchar("lead_id").references(() => leads.id),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  projectDescription: text("project_description"),
  content: text("content").notNull(), // Final rendered proposal
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("draft"), // draft, sent, viewed, accepted, declined
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  respondedAt: timestamp("responded_at"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

// ============ PAYMENTS ============

// Payments Table - Track quote/proposal payments
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => estimates.id),
  proposalId: varchar("proposal_id").references(() => proposals.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed, refunded
  paymentMethod: text("payment_method"), // card, bank, crypto
  processorId: text("processor_id"), // Stripe payment intent ID
  processorResponse: jsonb("processor_response"),
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  description: text("description"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  paidAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// ============ ROOM SCANS ============

// Room Scans Table - AI-powered room dimension estimation
export const roomScans = pgTable("room_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => leads.id),
  estimateId: varchar("estimate_id").references(() => estimates.id),
  imageUrl: text("image_url"), // Base64 or stored URL
  roomType: text("room_type"), // living_room, bedroom, bathroom, etc.
  estimatedLength: decimal("estimated_length", { precision: 10, scale: 2 }),
  estimatedWidth: decimal("estimated_width", { precision: 10, scale: 2 }),
  estimatedHeight: decimal("estimated_height", { precision: 10, scale: 2 }),
  estimatedSquareFootage: decimal("estimated_square_footage", { precision: 10, scale: 2 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0-100
  aiResponse: jsonb("ai_response"), // Full AI response for debugging
  modelVersion: text("model_version").default("gpt-4o"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoomScanSchema = createInsertSchema(roomScans).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertRoomScan = z.infer<typeof insertRoomScanSchema>;
export type RoomScan = typeof roomScans.$inferSelect;

// ============ ANALYTICS ============

// Page Views Table - Track all page visits
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  page: text("page").notNull(), // /home, /services, /estimate, etc.
  referrer: text("referrer"), // Where they came from
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"), // Hashed IP for unique visitor tracking (privacy)
  sessionId: text("session_id"), // Track unique sessions
  deviceType: text("device_type"), // desktop, mobile, tablet
  browser: text("browser"),
  country: text("country"),
  city: text("city"),
  duration: integer("duration"), // Time on page in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

// Analytics Summary Cache - Pre-computed stats for fast retrieval
export const analyticsSummary = pgTable("analytics_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(), // Day of the summary
  totalViews: integer("total_views").default(0).notNull(),
  uniqueVisitors: integer("unique_visitors").default(0).notNull(),
  avgDuration: integer("avg_duration").default(0), // Average time on site in seconds
  bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }), // Percentage
  topPages: jsonb("top_pages").default([]), // [{page, views}]
  topReferrers: jsonb("top_referrers").default([]), // [{referrer, count}]
  deviceBreakdown: jsonb("device_breakdown").default({}), // {desktop: x, mobile: y, tablet: z}
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnalyticsSummarySchema = createInsertSchema(analyticsSummary).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAnalyticsSummary = z.infer<typeof insertAnalyticsSummarySchema>;
export type AnalyticsSummary = typeof analyticsSummary.$inferSelect;

// ============ ENHANCED ESTIMATING FEATURES ============

// Estimate Photos - Attach photos to estimates
export const estimatePhotos = pgTable("estimate_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => estimates.id).notNull(),
  photoUrl: text("photo_url").notNull(), // Base64 data URL or external URL
  caption: text("caption"),
  roomType: text("room_type"), // living_room, bedroom, kitchen, bathroom, exterior, etc.
  photoType: text("photo_type").notNull().default("before"), // before, during, after, damage, reference
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEstimatePhotoSchema = createInsertSchema(estimatePhotos).omit({
  id: true,
  createdAt: true,
});

export type InsertEstimatePhoto = z.infer<typeof insertEstimatePhotoSchema>;
export type EstimatePhoto = typeof estimatePhotos.$inferSelect;

// Estimate Pricing Options - Good/Better/Best tiers
export const estimatePricingOptions = pgTable("estimate_pricing_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => estimates.id).notNull(),
  optionType: text("option_type").notNull(), // good, better, best
  optionName: text("option_name").notNull(), // "Basic", "Standard", "Premium"
  description: text("description"),
  includesWalls: boolean("includes_walls").default(false),
  includesTrim: boolean("includes_trim").default(false),
  includesCeilings: boolean("includes_ceilings").default(false),
  includedDoors: integer("included_doors").default(0),
  paintQuality: text("paint_quality"), // economy, standard, premium
  warranty: text("warranty"), // 1 year, 2 years, 5 years
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  breakdown: jsonb("breakdown").default({}), // {walls: x, trim: y, ceilings: z, doors: w}
  isSelected: boolean("is_selected").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEstimatePricingOptionSchema = createInsertSchema(estimatePricingOptions).omit({
  id: true,
  createdAt: true,
  isSelected: true,
});

export type InsertEstimatePricingOption = z.infer<typeof insertEstimatePricingOptionSchema>;
export type EstimatePricingOption = typeof estimatePricingOptions.$inferSelect;

// Proposal Signatures - E-signature collection
export const proposalSignatures = pgTable("proposal_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: varchar("proposal_id").references(() => proposals.id).notNull(),
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email"),
  signatureData: text("signature_data").notNull(), // Base64 signature image
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalSignatureSchema = createInsertSchema(proposalSignatures).omit({
  id: true,
  createdAt: true,
  signedAt: true,
});

export type InsertProposalSignature = z.infer<typeof insertProposalSignatureSchema>;
export type ProposalSignature = typeof proposalSignatures.$inferSelect;

// Estimate Follow-ups - Automated reminder scheduling
export const estimateFollowups = pgTable("estimate_followups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  estimateId: varchar("estimate_id").references(() => estimates.id).notNull(),
  followupType: text("followup_type").notNull(), // initial, reminder_24h, reminder_72h, final
  scheduledFor: timestamp("scheduled_for").notNull(),
  sentAt: timestamp("sent_at"),
  status: text("status").notNull().default("pending"), // pending, sent, cancelled, failed
  emailSubject: text("email_subject"),
  emailContent: text("email_content"),
  recipientEmail: text("recipient_email").notNull(),
  templateKey: text("template_key"), // Which template was used
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEstimateFollowupSchema = createInsertSchema(estimateFollowups).omit({
  id: true,
  createdAt: true,
  sentAt: true,
  status: true,
});

export type InsertEstimateFollowup = z.infer<typeof insertEstimateFollowupSchema>;
export type EstimateFollowup = typeof estimateFollowups.$inferSelect;
