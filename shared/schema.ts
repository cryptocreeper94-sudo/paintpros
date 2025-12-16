import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (for Replit Auth)
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (for Replit Auth)
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role"), // 'developer', 'ops_manager', 'owner', 'area_manager'
  tenantId: text("tenant_id"), // optional, for multi-tenant support
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Leads Table - Email capture
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  userId: varchar("user_id").references(() => users.id), // Link to customer account (optional)
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
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

// CRM Deals - Sales pipeline and Jobs pipeline
export const crmDeals = pgTable("crm_deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).default("0"),
  stage: text("stage").notNull().default("new_lead"), // Sales: new_lead, quoted, negotiating, won, lost | Jobs: project_accepted, scheduled, in_progress, touch_ups, complete
  leadId: varchar("lead_id").references(() => leads.id),
  probability: integer("probability").default(50),
  expectedCloseDate: timestamp("expected_close_date"),
  ownerId: text("owner_id"),
  notes: text("notes"),
  // Pipeline type: sales or jobs
  pipelineType: text("pipeline_type").default("sales"), // "sales" or "jobs"
  // Job-specific fields (used when pipelineType = "jobs")
  crewLeadId: varchar("crew_lead_id"),
  crewLeadName: text("crew_lead_name"),
  jobStartDate: timestamp("job_start_date"),
  jobEndDate: timestamp("job_end_date"),
  invoiceNumber: text("invoice_number"),
  jobAddress: text("job_address"),
  convertedFromDealId: varchar("converted_from_deal_id"), // Reference to original sales deal
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
  tenantId: text("tenant_id").default("npp"), // Tenant/client identifier (npp, demo, etc.)
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

// ============ ONLINE BOOKING ============

// Availability Windows - Business hours and time slots
export const availabilityWindows = pgTable("availability_windows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("npp").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: text("start_time").notNull(), // "09:00" format
  endTime: text("end_time").notNull(), // "17:00" format
  slotDuration: integer("slot_duration").default(60).notNull(), // Minutes per slot
  maxBookings: integer("max_bookings").default(1).notNull(), // Concurrent bookings allowed
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAvailabilityWindowSchema = createInsertSchema(availabilityWindows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAvailabilityWindow = z.infer<typeof insertAvailabilityWindowSchema>;
export type AvailabilityWindow = typeof availabilityWindows.$inferSelect;

// Bookings - Customer appointments
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("npp").notNull(),
  leadId: varchar("lead_id").references(() => leads.id),
  userId: varchar("user_id").references(() => users.id), // Link to customer account (optional)
  
  // Customer info
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  
  // Service details
  serviceType: text("service_type").notNull(), // interior, exterior, commercial, residential, etc.
  projectDescription: text("project_description"),
  
  // Scheduling
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(), // "09:00" format
  duration: integer("duration").default(60), // Minutes
  
  // Status tracking
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled, no_show
  confirmedAt: timestamp("confirmed_at"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  
  // Notes
  internalNotes: text("internal_notes"),
  customerNotes: text("customer_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  confirmedAt: true,
  completedAt: true,
  cancelledAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// ============ CREW MANAGEMENT ============

// Crew Leads - Crew supervisors/leads
export const crewLeads = pgTable("crew_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("npp").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  pin: text("pin").notNull().default("3333"),
  assignedBy: text("assigned_by"), // admin, owner, developer who created them
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCrewLeadSchema = createInsertSchema(crewLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCrewLead = z.infer<typeof insertCrewLeadSchema>;
export type CrewLead = typeof crewLeads.$inferSelect;

// Crew Members - Workers under each crew lead
export const crewMembers = pgTable("crew_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => crewLeads.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").default("painter"), // painter, apprentice, helper
  phone: text("phone"),
  email: text("email"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCrewMemberSchema = createInsertSchema(crewMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCrewMember = z.infer<typeof insertCrewMemberSchema>;
export type CrewMember = typeof crewMembers.$inferSelect;

// Time Entries - Hours worked per crew member
export const timeEntries = pgTable("time_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  crewMemberId: varchar("crew_member_id").references(() => crewMembers.id).notNull(),
  leadId: varchar("lead_id").references(() => crewLeads.id).notNull(),
  date: timestamp("date").notNull(),
  hoursWorked: decimal("hours_worked", { precision: 5, scale: 2 }).notNull(),
  overtimeHours: decimal("overtime_hours", { precision: 5, scale: 2 }).default("0"),
  jobAddress: text("job_address"),
  notes: text("notes"),
  status: text("status").default("pending").notNull(), // pending, approved, submitted_to_payroll
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  submittedAt: true,
  approvedAt: true,
});

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;

// Job Notes - Notes from crew leads about jobs
export const jobNotes = pgTable("job_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => crewLeads.id).notNull(),
  tenantId: text("tenant_id").default("npp").notNull(),
  jobAddress: text("job_address"),
  customerName: text("customer_name"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  photos: jsonb("photos").default([]), // Array of base64 or URLs
  sentToOwner: boolean("sent_to_owner").default(false),
  sentToAdmin: boolean("sent_to_admin").default(false),
  sentAt: timestamp("sent_at"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJobNoteSchema = createInsertSchema(jobNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sentAt: true,
});

export type InsertJobNote = z.infer<typeof insertJobNoteSchema>;
export type JobNote = typeof jobNotes.$inferSelect;

// Incident Reports - On-site incidents
export const incidentReports = pgTable("incident_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").references(() => crewLeads.id).notNull(),
  tenantId: text("tenant_id").default("npp").notNull(),
  jobAddress: text("job_address"),
  incidentDate: timestamp("incident_date").notNull(),
  incidentType: text("incident_type").notNull(), // injury, property_damage, customer_complaint, equipment, weather, other
  severity: text("severity").default("low"), // low, medium, high, critical
  description: text("description").notNull(),
  witnesses: text("witnesses"),
  photos: jsonb("photos").default([]), // Array of base64 or URLs
  actionTaken: text("action_taken"),
  status: text("status").default("open").notNull(), // open, investigating, resolved, closed
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: text("resolved_by"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIncidentReportSchema = createInsertSchema(incidentReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  resolvedAt: true,
});

export type InsertIncidentReport = z.infer<typeof insertIncidentReportSchema>;
export type IncidentReport = typeof incidentReports.$inferSelect;

// ============ INTERNAL MESSAGING SYSTEM ============

// Conversations - Direct or group chats
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("npp").notNull(),
  name: text("name"), // Optional name for group chats
  type: text("type").default("direct").notNull(), // 'direct' or 'group'
  createdBy: varchar("created_by"), // User ID who created the conversation
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Conversation Participants - Who is in each conversation
export const conversationParticipants = pgTable("conversation_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  userId: varchar("user_id"), // Can be null for role-based participants
  role: text("role"), // 'owner', 'admin', 'project_manager', 'crew_lead', 'developer'
  displayName: text("display_name"), // Name to show in chat
  phone: text("phone"), // Phone number for lookup
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  lastReadAt: timestamp("last_read_at"),
});

export const insertConversationParticipantSchema = createInsertSchema(conversationParticipants).omit({
  id: true,
  joinedAt: true,
});

export type InsertConversationParticipant = z.infer<typeof insertConversationParticipantSchema>;
export type ConversationParticipant = typeof conversationParticipants.$inferSelect;

// Messages - Individual messages in conversations
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id).notNull(),
  senderId: varchar("sender_id"), // User ID or participant ID
  senderRole: text("sender_role"), // Role of sender for display
  senderName: text("sender_name"), // Display name at time of send
  content: text("content").notNull(),
  messageType: text("message_type").default("text").notNull(), // 'text', 'file', 'image', 'voice'
  attachments: jsonb("attachments").default([]), // Array of { name, url, type, size }
  isSystemMessage: boolean("is_system_message").default(false),
  replyToId: varchar("reply_to_id"), // For threaded replies
  createdAt: timestamp("created_at").defaultNow().notNull(),
  editedAt: timestamp("edited_at"),
  deletedAt: timestamp("deleted_at"),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  editedAt: true,
  deletedAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// ==========================================
// DOCUMENT CENTER - PDF Management & Signatures
// ==========================================

// Documents - Main document storage for contracts, estimates, invoices, proposals
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  documentType: text("document_type").notNull(), // 'contract', 'estimate', 'invoice', 'proposal', 'other'
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"), // bytes
  mimeType: text("mime_type").default("application/pdf"),
  fileData: text("file_data"), // Base64 encoded PDF content (for smaller files)
  filePath: text("file_path"), // For larger files stored on disk
  status: text("status").default("draft").notNull(), // 'draft', 'pending_signature', 'signed', 'archived'
  version: integer("version").default(1).notNull(),
  relatedLeadId: varchar("related_lead_id"),
  relatedEstimateId: varchar("related_estimate_id"),
  relatedBookingId: varchar("related_booking_id"),
  createdBy: text("created_by").notNull(), // role: 'admin', 'owner'
  createdByName: text("created_by_name"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Document Versions - Track edit history
export const documentVersions = pgTable("document_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id).notNull(),
  versionNumber: integer("version_number").notNull(),
  fileName: text("file_name").notNull(),
  fileData: text("file_data"),
  filePath: text("file_path"),
  changeNote: text("change_note"),
  createdBy: text("created_by").notNull(),
  createdByName: text("created_by_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDocumentVersionSchema = createInsertSchema(documentVersions).omit({
  id: true,
  createdAt: true,
});

export type InsertDocumentVersion = z.infer<typeof insertDocumentVersionSchema>;
export type DocumentVersion = typeof documentVersions.$inferSelect;

// Document Signatures - Digital signature capture
export const documentSignatures = pgTable("document_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentId: varchar("document_id").references(() => documents.id).notNull(),
  signatureType: text("signature_type").notNull(), // 'client', 'company', 'witness'
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email"),
  signerPhone: text("signer_phone"),
  signerRole: text("signer_role"), // 'customer', 'admin', 'owner', 'contractor'
  signatureData: text("signature_data").notNull(), // Base64 encoded signature image
  signedAt: timestamp("signed_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").default({}),
});

export const insertDocumentSignatureSchema = createInsertSchema(documentSignatures).omit({
  id: true,
  signedAt: true,
});

export type InsertDocumentSignature = z.infer<typeof insertDocumentSignatureSchema>;
export type DocumentSignature = typeof documentSignatures.$inferSelect;

// Calendar Events - Comprehensive scheduling system
export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  eventType: text("event_type").notNull(), // 'appointment', 'estimate', 'job', 'meeting', 'reminder', 'blocked'
  status: text("status").default("scheduled").notNull(), // 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
  colorCode: text("color_code").default("#3B82F6"), // Hex color for visual display
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  allDay: boolean("all_day").default(false).notNull(),
  location: text("location"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  assignedTo: text("assigned_to"), // Crew lead or team member ID
  assignedToName: text("assigned_to_name"),
  relatedLeadId: varchar("related_lead_id"),
  relatedEstimateId: varchar("related_estimate_id"),
  relatedBookingId: varchar("related_booking_id"),
  notes: text("notes"),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurringPattern: text("recurring_pattern"), // 'daily', 'weekly', 'monthly', 'custom'
  recurringEndDate: timestamp("recurring_end_date"),
  parentEventId: varchar("parent_event_id"), // For recurring event instances
  createdBy: text("created_by").notNull(),
  createdByName: text("created_by_name"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;

// Calendar Reminders - Reminder notifications for events
export const calendarReminders = pgTable("calendar_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => calendarEvents.id).notNull(),
  tenantId: text("tenant_id").notNull(),
  reminderType: text("reminder_type").notNull(), // 'email', 'sms', 'push', 'in_app'
  reminderTime: timestamp("reminder_time").notNull(), // When to send the reminder
  offsetMinutes: integer("offset_minutes").notNull(), // Minutes before event (15, 30, 60, 1440 for 1 day)
  recipientEmail: text("recipient_email"),
  recipientPhone: text("recipient_phone"),
  recipientRole: text("recipient_role"), // 'customer', 'admin', 'owner', 'crew_lead', 'assigned'
  message: text("message"),
  status: text("status").default("pending").notNull(), // 'pending', 'sent', 'failed', 'cancelled'
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCalendarReminderSchema = createInsertSchema(calendarReminders).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export type InsertCalendarReminder = z.infer<typeof insertCalendarReminderSchema>;
export type CalendarReminder = typeof calendarReminders.$inferSelect;

// Event Color Presets - Configurable color coding
export const eventColorPresets = pgTable("event_color_presets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  name: text("name").notNull(), // 'Estimate Visit', 'Paint Job', 'Meeting', etc.
  colorCode: text("color_code").notNull(), // Hex color
  eventType: text("event_type"), // Optional: auto-apply to specific event types
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventColorPresetSchema = createInsertSchema(eventColorPresets).omit({
  id: true,
  createdAt: true,
});

export type InsertEventColorPreset = z.infer<typeof insertEventColorPresetSchema>;
export type EventColorPreset = typeof eventColorPresets.$inferSelect;

// ==========================================
// FRANCHISE MANAGEMENT SYSTEM
// ==========================================

// Franchises Table - Multi-tenant franchise management
export const franchises = pgTable("franchises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  franchiseId: varchar("franchise_id", { length: 20 }).notNull().unique(),
  
  // Owner Information
  ownerId: varchar("owner_id"),
  ownerEmail: varchar("owner_email", { length: 255 }),
  ownerName: varchar("owner_name", { length: 100 }),
  ownerCompany: varchar("owner_company", { length: 100 }),
  ownerPhone: varchar("owner_phone", { length: 20 }),
  ownershipMode: varchar("ownership_mode", { length: 50 }).default("subscriber_managed"),
  
  // Territory
  territoryName: varchar("territory_name", { length: 100 }).notNull(),
  territoryRegion: varchar("territory_region", { length: 50 }),
  territoryExclusive: boolean("territory_exclusive").default(false),
  territoryNotes: text("territory_notes"),
  
  // Franchise Tier & Pricing
  franchiseTier: varchar("franchise_tier", { length: 20 }).default("standard"),
  franchiseFee: decimal("franchise_fee", { precision: 10, scale: 2 }),
  royaltyType: varchar("royalty_type", { length: 20 }).default("percentage"),
  royaltyPercent: decimal("royalty_percent", { precision: 5, scale: 2 }),
  royaltyAmount: decimal("royalty_amount", { precision: 10, scale: 2 }),
  platformFeeMonthly: decimal("platform_fee_monthly", { precision: 10, scale: 2 }),
  hallmarkRevenueShare: decimal("hallmark_revenue_share", { precision: 5, scale: 2 }),
  
  // Support
  supportTier: varchar("support_tier", { length: 20 }).default("standard"),
  supportResponseHours: integer("support_response_hours").default(48),
  
  // Status
  status: varchar("status", { length: 20 }).default("pending"),
  
  // Hallmark/Blockchain
  hallmarkPrefix: varchar("hallmark_prefix", { length: 10 }),
  canMintHallmarks: boolean("can_mint_hallmarks").default(false),
  hallmarksMintedTotal: integer("hallmarks_minted_total").default(0),
  
  // Custody
  custodyOwner: varchar("custody_owner", { length: 50 }).default("paintpros"),
  custodyTransferDate: timestamp("custody_transfer_date"),
  previousCustodyOwner: varchar("previous_custody_owner", { length: 50 }),
  
  // Metrics
  totalOrders: integer("total_orders").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0.00"),
  activeVendors: integer("active_vendors").default(0),
  
  // Dates
  franchiseStartDate: timestamp("franchise_start_date"),
  franchiseRenewalDate: timestamp("franchise_renewal_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFranchiseSchema = createInsertSchema(franchises).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;
export type Franchise = typeof franchises.$inferSelect;

// Partner API Credentials Table
export const partnerApiCredentials = pgTable("partner_api_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  franchiseId: varchar("franchise_id").notNull().references(() => franchises.id),
  name: varchar("name", { length: 100 }).notNull(),
  apiKey: varchar("api_key", { length: 64 }).notNull().unique(),
  apiSecret: text("api_secret").notNull(),
  environment: varchar("environment", { length: 20 }).default("production"),
  scopes: text("scopes").array().default(sql`ARRAY['orders:read']::text[]`),
  rateLimitPerMinute: integer("rate_limit_per_minute").default(60),
  rateLimitPerDay: integer("rate_limit_per_day").default(10000),
  requestCount: integer("request_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdBy: varchar("created_by", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPartnerApiCredentialSchema = createInsertSchema(partnerApiCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  requestCount: true,
  lastUsedAt: true,
});

export type InsertPartnerApiCredential = z.infer<typeof insertPartnerApiCredentialSchema>;
export type PartnerApiCredential = typeof partnerApiCredentials.$inferSelect;

// Partner API Logs Table
export const partnerApiLogs = pgTable("partner_api_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  credentialId: varchar("credential_id").notNull().references(() => partnerApiCredentials.id),
  franchiseId: varchar("franchise_id").notNull().references(() => franchises.id),
  method: varchar("method", { length: 10 }).notNull(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  statusCode: integer("status_code"),
  responseTimeMs: integer("response_time_ms"),
  errorCode: varchar("error_code", { length: 50 }),
  errorMessage: text("error_message"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPartnerApiLogSchema = createInsertSchema(partnerApiLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertPartnerApiLog = z.infer<typeof insertPartnerApiLogSchema>;
export type PartnerApiLog = typeof partnerApiLogs.$inferSelect;

// Franchise Locations Table
export const franchiseLocations = pgTable("franchise_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  franchiseId: varchar("franchise_id").notNull().references(() => franchises.id),
  name: varchar("name", { length: 100 }).notNull(),
  locationCode: varchar("location_code", { length: 20 }).notNull(),
  addressLine1: varchar("address_line1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  managerName: varchar("manager_name", { length: 100 }),
  isActive: boolean("is_active").default(true),
  operatingHours: jsonb("operating_hours"),
  serviceRadius: integer("service_radius").default(25),
  totalJobs: integer("total_jobs").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFranchiseLocationSchema = createInsertSchema(franchiseLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalJobs: true,
  totalRevenue: true,
});

export type InsertFranchiseLocation = z.infer<typeof insertFranchiseLocationSchema>;
export type FranchiseLocation = typeof franchiseLocations.$inferSelect;

// Partner API Scopes
export const PARTNER_API_SCOPES = [
  'estimates:read', 'estimates:write',
  'leads:read', 'leads:write',
  'jobs:read', 'jobs:write',
  'locations:read', 'locations:write',
  'billing:read', 'analytics:read',
  'customers:read', 'customers:write',
  'crew:read', 'crew:write',
  'documents:read', 'documents:write',
] as const;

export type PartnerApiScope = typeof PARTNER_API_SCOPES[number];

// ============ CUSTOMER ACCOUNTS ============

// Customer Preferences - Saved preferences for logged-in customers
export const customerPreferences = pgTable("customer_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  tenantId: text("tenant_id").default("npp").notNull(),
  
  // Contact preferences
  preferredContactMethod: text("preferred_contact_method").default("email"), // email, phone, text
  preferredContactTime: text("preferred_contact_time"), // morning, afternoon, evening
  marketingOptIn: boolean("marketing_opt_in").default(true),
  smsOptIn: boolean("sms_opt_in").default(false),
  
  // Project preferences
  preferredColors: jsonb("preferred_colors").default([]), // Array of color names/codes
  preferredFinish: text("preferred_finish"), // matte, eggshell, satin, semi-gloss, gloss
  preferredBrands: jsonb("preferred_brands").default([]), // Array of paint brand names
  
  // Property info
  propertyType: text("property_type"), // house, apartment, condo, commercial
  propertySize: text("property_size"), // small, medium, large
  lastServiceDate: timestamp("last_service_date"),
  
  // Notes
  specialInstructions: text("special_instructions"),
  accessNotes: text("access_notes"), // gate codes, parking, etc.
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerPreferencesSchema = createInsertSchema(customerPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCustomerPreferences = z.infer<typeof insertCustomerPreferencesSchema>;
export type CustomerPreferences = typeof customerPreferences.$inferSelect;

// ============ PUSH NOTIFICATIONS ============

// Push Subscriptions - Browser push notification subscriptions
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  tenantId: text("tenant_id").default("npp").notNull(),
  
  // Push subscription details
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(), // Public key
  auth: text("auth").notNull(), // Auth secret
  
  // User agent info
  userAgent: text("user_agent"),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;

// Appointment Reminders - Track sent reminders to prevent duplicates
export const appointmentReminders = pgTable("appointment_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id).notNull(),
  tenantId: text("tenant_id").default("npp").notNull(),
  
  reminderType: text("reminder_type").notNull(), // 'email_24h', 'email_1h', 'push_24h', 'push_1h'
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  status: text("status").notNull().default("sent"), // 'sent', 'failed', 'delivered'
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentReminderSchema = createInsertSchema(appointmentReminders).omit({
  id: true,
  createdAt: true,
  sentAt: true,
});

export type InsertAppointmentReminder = z.infer<typeof insertAppointmentReminderSchema>;
export type AppointmentReminder = typeof appointmentReminders.$inferSelect;
