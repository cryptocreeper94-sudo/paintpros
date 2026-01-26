import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, jsonb, index, real } from "drizzle-orm/pg-core";
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

// User storage table - supports both email/password and Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  passwordHash: text("password_hash"),
  authProvider: text("auth_provider").default("email"), // 'email' or 'replit'
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: text("phone"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role"), // 'developer', 'ops_manager', 'owner', 'area_manager'
  tenantId: text("tenant_id"), // optional, for multi-tenant support
  emailVerified: boolean("email_verified").default(false),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_users_tenant_id").on(table.tenantId),
  index("idx_users_role").on(table.role),
]);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordResetToken: true,
  passwordResetExpires: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Leads Table - Email capture
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"), // Multi-tenant isolation
  email: text("email").notNull(),
  userId: varchar("user_id").references(() => users.id), // Link to customer account (optional)
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  // Marketplace lead fields
  address: text("address"),
  tradeType: text("trade_type"), // 'painting', 'electrical', 'hvac', 'carpentry', 'general'
  propertyType: text("property_type"), // 'residential' or 'commercial'
  projectTypes: text("project_types").array(), // ['interior', 'exterior', etc.]
  timeline: text("timeline"), // 'hot', 'warm', 'cold'
  urgencyScore: integer("urgency_score"), // 0-100 score
  squareFootage: text("square_footage"),
  budget: text("budget"),
  description: text("description"),
  source: text("source").default("website"), // 'website', 'marketplace', 'referral', etc.
  referralSource: text("referral_source"), // How did you hear about us? (google, facebook, billboard, etc.)
  status: text("lead_status").default("new"), // 'new', 'contacted', 'qualified', 'converted'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_leads_tenant_id").on(table.tenantId),
  index("idx_leads_timeline").on(table.timeline),
  index("idx_leads_source").on(table.source),
  index("idx_leads_referral_source").on(table.referralSource),
]);

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Estimates Table - Detailed quote storage
export const estimates = pgTable("estimates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"), // Multi-tenant isolation
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
}, (table) => [
  index("idx_estimates_tenant_id").on(table.tenantId),
]);

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

// SEO Page Metadata - Comprehensive per-page SEO settings
export const seoPages = pgTable("seo_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").default("demo"),
  pagePath: text("page_path").notNull(), // e.g., '/', '/services', '/contact'
  pageTitle: text("page_title").notNull(),
  
  // Basic Meta Tags
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"), // comma-separated
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
  twitterSite: text("twitter_site"), // @handle
  
  // JSON-LD Structured Data
  structuredDataType: text("structured_data_type"), // 'LocalBusiness', 'Service', 'Organization', 'FAQPage', 'BreadcrumbList'
  structuredData: jsonb("structured_data"), // Full JSON-LD object
  
  // Audit Fields
  seoScore: integer("seo_score").default(0), // 0-100 score
  missingFields: text("missing_fields").array(), // List of missing recommended fields
  lastAuditAt: timestamp("last_audit_at"),
  
  // Status
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

export const insertSeoPageSchema = createInsertSchema(seoPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  seoScore: true,
  missingFields: true,
  lastAuditAt: true,
});

export type InsertSeoPage = z.infer<typeof insertSeoPageSchema>;
export type SeoPage = typeof seoPages.$inferSelect;

// SEO Audit Log - Track changes and audit history
export const seoAudits = pgTable("seo_audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seoPageId: varchar("seo_page_id").references(() => seoPages.id),
  tenantId: text("tenant_id").default("demo"),
  auditType: text("audit_type").notNull(), // 'automated', 'manual', 'edit'
  previousScore: integer("previous_score"),
  newScore: integer("new_score"),
  changes: jsonb("changes"), // {field: {old: '', new: ''}}
  recommendations: text("recommendations").array(),
  performedBy: text("performed_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSeoAuditSchema = createInsertSchema(seoAudits).omit({
  id: true,
  createdAt: true,
});

export type InsertSeoAudit = z.infer<typeof insertSeoAuditSchema>;
export type SeoAudit = typeof seoAudits.$inferSelect;

// ============ CRM TABLES ============

// CRM Deals - Sales pipeline and Jobs pipeline
export const crmDeals = pgTable("crm_deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"), // Multi-tenant isolation
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
}, (table) => [
  index("idx_crm_deals_tenant_id").on(table.tenantId),
  index("idx_crm_deals_tenant_stage").on(table.tenantId, table.stage),
]);

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
  role: text("role").notNull(), // ops_manager, owner, project_manager
  pin: text("pin").notNull().unique(), // PIN is unique per person
  userName: text("user_name"), // Personalized name (Hank, Garrett, etc.)
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

// WebAuthn Credentials - Biometric login (fingerprint/Face ID)
export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userPinId: varchar("user_pin_id").notNull().references(() => userPins.id, { onDelete: "cascade" }),
  credentialId: text("credential_id").notNull().unique(), // Base64 encoded credential ID
  publicKey: text("public_key").notNull(), // Base64 encoded public key
  counter: integer("counter").notNull().default(0), // Signature counter for replay protection
  deviceName: text("device_name"), // "iPhone", "Pixel", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
});

export const insertWebauthnCredentialSchema = createInsertSchema(webauthnCredentials).omit({
  id: true,
  createdAt: true,
  lastUsedAt: true,
});

export type InsertWebauthnCredential = z.infer<typeof insertWebauthnCredentialSchema>;
export type WebauthnCredential = typeof webauthnCredentials.$inferSelect;

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
  darkwaveTxSignature: text("darkwave_tx_signature"),
  darkwaveExplorerUrl: text("darkwave_explorer_url"),
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
  darkwaveTxSignature: true,
  darkwaveExplorerUrl: true,
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
  darkwaveTxSignature: text("darkwave_tx_signature"),
  darkwaveTxStatus: text("darkwave_tx_status").default("pending"),
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
  darkwaveTxStatus: true,
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
  
  // Lead tracking
  referralSource: text("referral_source"), // How did you hear about us?
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_bookings_tenant_id").on(table.tenantId),
  index("idx_bookings_user_id").on(table.userId),
  index("idx_bookings_scheduled_date").on(table.scheduledDate),
  index("idx_bookings_status").on(table.status),
  index("idx_bookings_customer_email").on(table.customerEmail),
  index("idx_bookings_referral_source").on(table.referralSource),
]);

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

// ============ EMAIL VERIFICATION ============

// Email Verification Tokens
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailVerificationTokenSchema = createInsertSchema(emailVerificationTokens).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export type InsertEmailVerificationToken = z.infer<typeof insertEmailVerificationTokenSchema>;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;

// ============ QUICKBOOKS INTEGRATION ============

// QuickBooks OAuth Tokens - Store tenant OAuth tokens for QuickBooks
export const quickbooksTokens = pgTable("quickbooks_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().unique(),
  
  // OAuth tokens
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenType: text("token_type").default("Bearer"),
  expiresAt: timestamp("expires_at").notNull(),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  
  // QuickBooks company info
  realmId: text("realm_id").notNull(), // QuickBooks company ID
  companyName: text("company_name"),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  lastSyncAt: timestamp("last_sync_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuickbooksTokenSchema = createInsertSchema(quickbooksTokens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSyncAt: true,
});

export type InsertQuickbooksToken = z.infer<typeof insertQuickbooksTokenSchema>;
export type QuickbooksToken = typeof quickbooksTokens.$inferSelect;

// QuickBooks Sync Log - Track synced entities
export const quickbooksSyncLog = pgTable("quickbooks_sync_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  
  // Entity info
  entityType: text("entity_type").notNull(), // 'invoice', 'payment', 'customer', 'estimate'
  localId: varchar("local_id").notNull(), // Our system's ID
  quickbooksId: text("quickbooks_id"), // QuickBooks entity ID
  
  // Sync status
  syncDirection: text("sync_direction").notNull(), // 'to_quickbooks', 'from_quickbooks'
  syncStatus: text("sync_status").notNull().default("pending"), // 'pending', 'synced', 'failed', 'skipped'
  errorMessage: text("error_message"),
  
  // Sync metadata
  syncData: jsonb("sync_data"), // Store the synced data for reference
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertQuickbooksSyncLogSchema = createInsertSchema(quickbooksSyncLog).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQuickbooksSyncLog = z.infer<typeof insertQuickbooksSyncLogSchema>;
export type QuickbooksSyncLog = typeof quickbooksSyncLog.$inferSelect;

// Paint Colors Library - Curated color database for estimates and visualization
export const paintColors = pgTable("paint_colors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Brand and product line
  brand: text("brand").notNull(), // 'sherwin-williams', 'benjamin-moore', 'behr', 'ppg'
  productLine: text("product_line").notNull(), // 'Duration', 'Emerald', 'Regal Select', 'Aura'
  
  // Color identification
  colorCode: text("color_code").notNull(), // 'SW 7005', 'HC-172'
  colorName: text("color_name").notNull(), // 'Pure White', 'Revere Pewter'
  hexValue: text("hex_value").notNull(), // '#FFFFFF'
  
  // Color characteristics
  category: text("category").notNull(), // 'white', 'neutral', 'warm', 'cool', 'accent'
  undertone: text("undertone"), // 'warm', 'cool', 'neutral', 'yellow', 'pink', 'green', 'blue'
  lrv: integer("lrv"), // Light Reflectance Value (0-100)
  
  // Coordinating colors (stored as array of color codes)
  coordinatingColors: text("coordinating_colors").array(), // ['SW 7006', 'SW 7008']
  trimColors: text("trim_colors").array(), // Recommended trim colors
  accentColors: text("accent_colors").array(), // Recommended accent colors
  
  // Application recommendations
  interiorRecommended: boolean("interior_recommended").default(true),
  exteriorRecommended: boolean("exterior_recommended").default(false),
  roomTypes: text("room_types").array(), // ['living-room', 'bedroom', 'kitchen', 'bathroom']
  
  // Metadata
  description: text("description"),
  imageUrl: text("image_url"), // Swatch image
  popularity: integer("popularity").default(0), // For sorting by popularity
  
  // Tenant can have custom/favorite colors
  tenantId: text("tenant_id"), // null = global library, value = tenant-specific
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaintColorSchema = createInsertSchema(paintColors).omit({
  id: true,
  createdAt: true,
});

export type InsertPaintColor = z.infer<typeof insertPaintColorSchema>;
export type PaintColor = typeof paintColors.$inferSelect;

// Customer Color Selections - Track colors customers have selected/saved
export const customerColorSelections = pgTable("customer_color_selections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  estimateId: varchar("estimate_id").references(() => estimates.id),
  
  // Color reference
  paintColorId: varchar("paint_color_id").references(() => paintColors.id),
  
  // Where to apply
  roomName: text("room_name"), // 'Living Room', 'Master Bedroom'
  surfaceType: text("surface_type"), // 'walls', 'trim', 'ceiling', 'doors', 'cabinets'
  
  // AI visualization reference
  visualizationImageUrl: text("visualization_image_url"), // AI-generated preview
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerColorSelectionSchema = createInsertSchema(customerColorSelections).omit({
  id: true,
  createdAt: true,
});

export type InsertCustomerColorSelection = z.infer<typeof insertCustomerColorSelectionSchema>;
export type CustomerColorSelection = typeof customerColorSelections.$inferSelect;

// Production Tenants - Paid customer configurations (auto-provisioned from trial conversions)
export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Source tracking
  trialTenantId: varchar("trial_tenant_id"), // Reference to original trial (if converted)
  
  // Owner info
  ownerEmail: text("owner_email").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  ownerUserId: varchar("owner_user_id").references(() => users.id), // Link to user account
  
  // Company info
  companyName: text("company_name").notNull(),
  companySlug: text("company_slug").notNull().unique(), // URL identifier (e.g., "johnsons-painting")
  companyCity: text("company_city"),
  companyState: text("company_state"),
  companyPhone: text("company_phone"),
  companyEmail: text("company_email"),
  companyWebsite: text("company_website"),
  logoUrl: text("logo_url"),
  
  // Theme customization
  primaryColor: text("primary_color").default("#4A5D3E"),
  accentColor: text("accent_color").default("#5A6D4E"),
  
  // Subscription details
  subscriptionTier: text("subscription_tier").notNull(), // 'starter', 'professional', 'franchise', 'enterprise'
  subscriptionStatus: text("subscription_status").notNull().default("active"), // 'active', 'past_due', 'cancelled', 'paused'
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  
  // Billing info
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
  setupFee: decimal("setup_fee", { precision: 10, scale: 2 }),
  setupFeePaid: boolean("setup_fee_paid").default(false),
  billingCycleStart: timestamp("billing_cycle_start"),
  
  // Franchise-specific (for multi-location)
  parentTenantId: varchar("parent_tenant_id"), // Self-reference for franchise hierarchy
  locationCount: integer("location_count").default(1),
  perLocationPrice: decimal("per_location_price", { precision: 10, scale: 2 }),
  
  // Trade vertical info
  tradeVertical: text("trade_vertical").notNull().default("painting"), // 'painting', 'roofing', 'hvac', 'electrical', 'plumbing', 'landscaping', 'construction'
  
  // TradeWorks AI add-on
  tradeworksEnabled: boolean("tradeworks_enabled").default(false),
  tradeworksSubscriptionId: text("tradeworks_subscription_id"), // Separate subscription for TradeWorks
  tradeworksPriceId: text("tradeworks_price_id"), // Which TradeWorks tier
  tradeworksActivatedAt: timestamp("tradeworks_activated_at"),
  
  // Orbit ecosystem sync
  orbitSyncEnabled: boolean("orbit_sync_enabled").default(true),
  orbitTenantId: text("orbit_tenant_id"), // ID in Orbit Staffing system
  orbitLastSyncAt: timestamp("orbit_last_sync_at"),
  
  // Feature flags (can override defaults per tenant)
  featuresEnabled: jsonb("features_enabled").$type<{
    estimator?: boolean;
    colorLibrary?: boolean;
    aiVisualizer?: boolean;
    blockchainStamping?: boolean;
    crm?: boolean;
    booking?: boolean;
    messaging?: boolean;
    analytics?: boolean;
    tradeworksCalculators?: boolean;
    tradeworksVoice?: boolean;
    tradeworksAI?: boolean;
  }>().default({}),
  
  // Status
  status: text("status").notNull().default("provisioning"), // 'provisioning', 'active', 'suspended', 'cancelled'
  provisionedAt: timestamp("provisioned_at"),
  activatedAt: timestamp("activated_at"),
  cancelledAt: timestamp("cancelled_at"),
  
  // Metadata
  notes: text("notes"), // Internal notes from admin
  metadata: jsonb("metadata"), // Flexible storage for additional data
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tenants_slug").on(table.companySlug),
  index("idx_tenants_owner_email").on(table.ownerEmail),
  index("idx_tenants_status").on(table.status),
  index("idx_tenants_subscription").on(table.subscriptionStatus),
  index("idx_tenants_stripe_customer").on(table.stripeCustomerId),
  index("idx_tenants_parent").on(table.parentTenantId),
]);

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  provisionedAt: true,
  activatedAt: true,
  cancelledAt: true,
});

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

// Trial Tenants - Self-service trial signup with usage limits
export const trialTenants = pgTable("trial_tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Owner info
  ownerEmail: text("owner_email").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  
  // Company info (for their portal)
  companyName: text("company_name").notNull(),
  companySlug: text("company_slug").notNull().unique(), // URL-friendly unique identifier
  companyCity: text("company_city"),
  companyState: text("company_state"),
  companyPhone: text("company_phone"),
  companyEmail: text("company_email"),
  logoUrl: text("logo_url"),
  
  // Theme customization
  primaryColor: text("primary_color").default("#4A5D3E"), // Default army green
  accentColor: text("accent_color").default("#5A6D4E"),
  
  // Trade vertical info
  tradeVertical: text("trade_vertical").notNull().default("painting"), // 'painting', 'roofing', 'hvac', 'electrical', 'plumbing', 'landscaping', 'construction'
  
  // TradeWorks AI interest (for conversion)
  tradeworksInterested: boolean("tradeworks_interested").default(false),
  
  // Selected subscription tier
  selectedTier: text("selected_tier").default("starter"), // 'starter', 'professional', 'enterprise'
  
  // Trial status
  status: text("status").notNull().default("active"), // 'active', 'expired', 'converted', 'cancelled'
  trialStartedAt: timestamp("trial_started_at").defaultNow().notNull(),
  trialExpiresAt: timestamp("trial_expires_at").notNull(), // 72 hours from start
  convertedAt: timestamp("converted_at"),
  
  // Usage limits & tracking
  estimatesUsed: integer("estimates_used").default(0).notNull(),
  estimatesLimit: integer("estimates_limit").default(1).notNull(),
  leadsUsed: integer("leads_used").default(0).notNull(),
  leadsLimit: integer("leads_limit").default(3).notNull(),
  blockchainStampsUsed: integer("blockchain_stamps_used").default(0).notNull(),
  blockchainStampsLimit: integer("blockchain_stamps_limit").default(1).notNull(),
  
  // Onboarding progress
  onboardingStep: integer("onboarding_step").default(1).notNull(), // 1-5 steps
  completedSteps: text("completed_steps").array().default(sql`ARRAY[]::text[]`), // ['setup', 'visualizer', 'estimate', 'stamp']
  
  // Engagement tracking
  lastActivityAt: timestamp("last_activity_at"),
  totalPageViews: integer("total_page_views").default(0),
  
  // Sample data seeded
  sampleDataSeeded: boolean("sample_data_seeded").default(false),
  sampleEstimateId: varchar("sample_estimate_id"),
  sampleLeadId: varchar("sample_lead_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_trial_tenants_slug").on(table.companySlug),
  index("idx_trial_tenants_email").on(table.ownerEmail),
  index("idx_trial_tenants_status").on(table.status),
  index("idx_trial_tenants_expires").on(table.trialExpiresAt),
]);

export const insertTrialTenantSchema = createInsertSchema(trialTenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  estimatesUsed: true,
  leadsUsed: true,
  blockchainStampsUsed: true,
  onboardingStep: true,
  completedSteps: true,
  lastActivityAt: true,
  totalPageViews: true,
  sampleDataSeeded: true,
  sampleEstimateId: true,
  sampleLeadId: true,
  convertedAt: true,
});

export type InsertTrialTenant = z.infer<typeof insertTrialTenantSchema>;
export type TrialTenant = typeof trialTenants.$inferSelect;

// Trial usage actions - track what users do in trial
export const trialUsageLog = pgTable("trial_usage_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trialTenantId: varchar("trial_tenant_id").references(() => trialTenants.id).notNull(),
  
  action: text("action").notNull(), // 'estimate_created', 'lead_captured', 'stamp_used', 'visualizer_used', 'page_view'
  resourceType: text("resource_type"), // 'estimate', 'lead', 'stamp', 'color'
  resourceId: varchar("resource_id"),
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_trial_usage_tenant").on(table.trialTenantId),
  index("idx_trial_usage_action").on(table.action),
]);

export const insertTrialUsageLogSchema = createInsertSchema(trialUsageLog).omit({
  id: true,
  createdAt: true,
});

export type InsertTrialUsageLog = z.infer<typeof insertTrialUsageLogSchema>;
export type TrialUsageLog = typeof trialUsageLog.$inferSelect;

// ============================================
// ROYALTY LEDGER SYSTEM
// Tracks revenue, expenses, and payouts to Sidonie
// ============================================

// Product codes for multi-product tracking
// All products originated by Sidonie Summers - 50% profit share each
export const ROYALTY_PRODUCTS = {
  paintpros: { 
    code: 'paintpros', 
    name: 'PaintPros.io', 
    domain: 'paintpros.io',
    description: 'Multi-tenant SaaS platform for painting contractors with white-label websites, estimating tools, and franchise enrollment'
  },
  brewandboard: { 
    code: 'brewandboard', 
    name: 'Brew and Board', 
    domain: 'brewandboard.coffee',
    description: 'SaaS franchise platform for coffee shop operations and management'
  },
  orbitstaffing: { 
    code: 'orbitstaffing', 
    name: 'Orbit Staffing', 
    domain: 'orbitstaffing.io',
    description: 'Full-service staffing company platform with efficient workflow management'
  },
  shared: { 
    code: 'shared', 
    name: 'Shared/Combined', 
    domain: null,
    description: 'Expenses or revenue that apply across all products'
  },
} as const;

export type RoyaltyProductCode = keyof typeof ROYALTY_PRODUCTS;

// Revenue entries - SaaS (auto from Stripe) and Nashville project (manual)
export const royaltyRevenue = pgTable("royalty_revenue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Product tracking
  productCode: text("product_code").notNull().default("paintpros"), // 'paintpros', 'brewandboard', 'shared'
  
  // Revenue type
  revenueType: text("revenue_type").notNull(), // 'saas_subscription', 'saas_setup', 'saas_other', 'nashville_paycheck'
  
  // Amount and date
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  periodStart: timestamp("period_start").notNull(), // Start of pay period
  periodEnd: timestamp("period_end").notNull(), // End of pay period
  
  // Source details
  stripePaymentId: varchar("stripe_payment_id"), // For Stripe revenue
  stripeProductId: varchar("stripe_product_id"), // Stripe product ID for mapping
  description: text("description"), // Manual description
  
  // Nashville-specific fields
  isW2: boolean("is_w2").default(true), // W-2 vs 1099 for Nashville
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_royalty_revenue_type").on(table.revenueType),
  index("idx_royalty_revenue_period").on(table.periodStart),
  index("idx_royalty_revenue_product").on(table.productCode),
]);

export const insertRoyaltyRevenueSchema = createInsertSchema(royaltyRevenue).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRoyaltyRevenue = z.infer<typeof insertRoyaltyRevenueSchema>;
export type RoyaltyRevenue = typeof royaltyRevenue.$inferSelect;

// Business expenses (for calculating net profit)
export const royaltyExpenses = pgTable("royalty_expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Product tracking (which product is this expense for)
  productCode: text("product_code").notNull().default("shared"), // 'paintpros', 'brewandboard', 'orbitstaffing', 'shared'
  
  // Expense details
  category: text("category").notNull(), // 'hosting', 'software', 'marketing', 'other'
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expenseDate: timestamp("expense_date").notNull(),
  
  // Period this applies to (for monthly calculations)
  periodMonth: integer("period_month").notNull(), // 1-12
  periodYear: integer("period_year").notNull(),
  
  // For shared expenses - how to allocate across products (optional)
  allocationPercent: decimal("allocation_percent", { precision: 5, scale: 2 }), // If shared, what % goes to each product
  
  // Metadata
  receiptUrl: text("receipt_url"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_royalty_expenses_period").on(table.periodYear, table.periodMonth),
  index("idx_royalty_expenses_product").on(table.productCode),
]);

export const insertRoyaltyExpenseSchema = createInsertSchema(royaltyExpenses).omit({
  id: true,
  createdAt: true,
});

export type InsertRoyaltyExpense = z.infer<typeof insertRoyaltyExpenseSchema>;
export type RoyaltyExpense = typeof royaltyExpenses.$inferSelect;

// Payouts to Sidonie
export const royaltyPayouts = pgTable("royalty_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Payout type
  payoutType: text("payout_type").notNull(), // 'saas_profit_share', 'nashville_base', 'nashville_overage', 'signing_bonus'
  
  // Amount
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  
  // Period covered
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  
  // Payment details
  paymentMethod: text("payment_method"), // 'venmo', 'cashapp', 'zelle', 'cashiers_check', 'stripe_connect'
  paymentReference: text("payment_reference"), // Transaction ID or check number
  
  // Status
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'confirmed'
  paidAt: timestamp("paid_at"),
  confirmedAt: timestamp("confirmed_at"),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_royalty_payouts_status").on(table.status),
  index("idx_royalty_payouts_type").on(table.payoutType),
]);

export const insertRoyaltyPayoutSchema = createInsertSchema(royaltyPayouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  paidAt: true,
  confirmedAt: true,
});

export type InsertRoyaltyPayout = z.infer<typeof insertRoyaltyPayoutSchema>;
export type RoyaltyPayout = typeof royaltyPayouts.$inferSelect;

// Royalty configuration (thresholds, percentages, etc.)
export const royaltyConfig = pgTable("royalty_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // SaaS profit share
  saasProfitSharePercent: decimal("saas_profit_share_percent", { precision: 5, scale: 2 }).default("50").notNull(),
  
  // Nashville project royalties
  nashvilleThreshold: decimal("nashville_threshold", { precision: 10, scale: 2 }).default("125000").notNull(),
  nashvilleBaseW2: decimal("nashville_base_w2", { precision: 10, scale: 2 }).default("25000").notNull(),
  nashvilleBase1099: decimal("nashville_base_1099", { precision: 10, scale: 2 }).default("20000").notNull(),
  nashvilleOveragePercent: decimal("nashville_overage_percent", { precision: 5, scale: 2 }).default("15").notNull(),
  
  // Signing bonus
  signingBonusAmount: decimal("signing_bonus_amount", { precision: 10, scale: 2 }).default("6000").notNull(),
  signingBonusPaid: boolean("signing_bonus_paid").default(false),
  
  // Contributor info
  contributorName: text("contributor_name").default("Sidonie Summers"),
  contributorEmail: text("contributor_email"),
  contributorPaymentMethod: text("contributor_payment_method"),
  contributorPaymentHandle: text("contributor_payment_handle"),
  contributorStripeAccountId: text("contributor_stripe_account_id"),
  
  // Agreement reference
  agreementVersion: text("agreement_version").default("1.0"),
  agreementHash: text("agreement_hash"),
  agreementSignedAt: timestamp("agreement_signed_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRoyaltyConfigSchema = createInsertSchema(royaltyConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRoyaltyConfig = z.infer<typeof insertRoyaltyConfigSchema>;
export type RoyaltyConfig = typeof royaltyConfig.$inferSelect;

// ============ PROJECT MANAGEMENT FEATURES ============

// Project Templates - Saved estimate templates for repeat jobs
export const projectTemplates = pgTable("project_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"), // 'residential', 'commercial', 'apartment_turnover', etc.
  
  // Template data (services, measurements, etc.)
  services: jsonb("services").$type<string[]>().default([]),
  defaultSquareFootage: integer("default_square_footage"),
  roomCount: integer("room_count"),
  
  // Pricing multipliers
  laborMultiplier: decimal("labor_multiplier", { precision: 4, scale: 2 }).default("1.0"),
  materialMultiplier: decimal("material_multiplier", { precision: 4, scale: 2 }).default("1.0"),
  
  // Usage tracking
  useCount: integer("use_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_project_templates_tenant").on(table.tenantId),
  index("idx_project_templates_category").on(table.category),
]);

export const insertProjectTemplateSchema = createInsertSchema(projectTemplates).omit({
  id: true,
  useCount: true,
  lastUsedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProjectTemplate = z.infer<typeof insertProjectTemplateSchema>;
export type ProjectTemplate = typeof projectTemplates.$inferSelect;

// Project Photos - Before/After gallery
export const projectPhotos = pgTable("project_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  
  // Link to estimate or project
  estimateId: varchar("estimate_id").references(() => estimates.id),
  projectName: text("project_name"),
  
  // Photo details
  photoType: text("photo_type").notNull(), // 'before', 'after', 'progress', 'detail'
  photoUrl: text("photo_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  roomName: text("room_name"), // 'living_room', 'kitchen', etc.
  
  // Metadata
  takenAt: timestamp("taken_at"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  isPublic: boolean("is_public").default(false), // Show in public gallery
  isFeatured: boolean("is_featured").default(false), // Featured in marketing
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_project_photos_tenant").on(table.tenantId),
  index("idx_project_photos_estimate").on(table.estimateId),
  index("idx_project_photos_type").on(table.photoType),
  index("idx_project_photos_public").on(table.isPublic),
]);

export const insertProjectPhotoSchema = createInsertSchema(projectPhotos).omit({
  id: true,
  createdAt: true,
});

export type InsertProjectPhoto = z.infer<typeof insertProjectPhotoSchema>;
export type ProjectPhoto = typeof projectPhotos.$inferSelect;

// Blueprint Uploads - PDF plans with AI-extracted dimensions
export const blueprintUploads = pgTable("blueprint_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  
  // File info
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  pageCount: integer("page_count").default(1),
  
  // Link to estimate
  estimateId: varchar("estimate_id").references(() => estimates.id),
  projectName: text("project_name"),
  
  // AI extraction results
  extractionStatus: text("extraction_status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  extractedData: jsonb("extracted_data").$type<{
    rooms?: Array<{
      name: string;
      width: number;
      length: number;
      height: number;
      squareFootage: number;
      wallArea: number;
    }>;
    totalSquareFootage?: number;
    totalWallArea?: number;
    roomCount?: number;
    notes?: string[];
  }>(),
  extractionError: text("extraction_error"),
  extractedAt: timestamp("extracted_at"),
  
  // Metadata
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_blueprint_uploads_tenant").on(table.tenantId),
  index("idx_blueprint_uploads_estimate").on(table.estimateId),
  index("idx_blueprint_uploads_status").on(table.extractionStatus),
]);

export const insertBlueprintUploadSchema = createInsertSchema(blueprintUploads).omit({
  id: true,
  extractionStatus: true,
  extractedData: true,
  extractionError: true,
  extractedAt: true,
  createdAt: true,
});

export type InsertBlueprintUpload = z.infer<typeof insertBlueprintUploadSchema>;
export type BlueprintUpload = typeof blueprintUploads.$inferSelect;

// Material Breakdowns - Detailed material lists for estimates
export const materialBreakdowns = pgTable("material_breakdowns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  estimateId: varchar("estimate_id").references(() => estimates.id).notNull(),
  
  // Material details
  category: text("category").notNull(), // 'paint', 'primer', 'supplies', 'equipment'
  itemName: text("item_name").notNull(),
  brand: text("brand"),
  sku: text("sku"),
  
  // Quantities
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // 'gallon', 'roll', 'pack', 'each'
  
  // Pricing
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  
  // Supplier info
  supplierName: text("supplier_name"),
  supplierUrl: text("supplier_url"),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_material_breakdowns_tenant").on(table.tenantId),
  index("idx_material_breakdowns_estimate").on(table.estimateId),
  index("idx_material_breakdowns_category").on(table.category),
]);

export const insertMaterialBreakdownSchema = createInsertSchema(materialBreakdowns).omit({
  id: true,
  createdAt: true,
});

export type InsertMaterialBreakdown = z.infer<typeof insertMaterialBreakdownSchema>;
export type MaterialBreakdown = typeof materialBreakdowns.$inferSelect;

// Labor Estimates - Detailed labor breakdowns
export const laborEstimates = pgTable("labor_estimates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  estimateId: varchar("estimate_id").references(() => estimates.id).notNull(),
  
  // Task details
  taskName: text("task_name").notNull(),
  taskCategory: text("task_category"), // 'prep', 'prime', 'paint', 'trim', 'cleanup'
  
  // Labor calculations
  estimatedHours: decimal("estimated_hours", { precision: 6, scale: 2 }).notNull(),
  crewSize: integer("crew_size").default(2),
  totalCrewHours: decimal("total_crew_hours", { precision: 6, scale: 2 }),
  
  // Difficulty factors
  difficultyMultiplier: decimal("difficulty_multiplier", { precision: 4, scale: 2 }).default("1.0"),
  surfaceCondition: text("surface_condition"), // 'good', 'fair', 'poor', 'damaged'
  
  // Timing
  estimatedDays: decimal("estimated_days", { precision: 4, scale: 1 }),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_labor_estimates_tenant").on(table.tenantId),
  index("idx_labor_estimates_estimate").on(table.estimateId),
]);

export const insertLaborEstimateSchema = createInsertSchema(laborEstimates).omit({
  id: true,
  createdAt: true,
});

export type InsertLaborEstimate = z.infer<typeof insertLaborEstimateSchema>;
export type LaborEstimate = typeof laborEstimates.$inferSelect;


// ============================================
// MARKETING AUTO-DEPLOY SYSTEM
// ============================================

// Marketing Posts - Content for social media rotation (tenant-scoped)
export const marketingPosts = pgTable("marketing_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("shared"),
  content: text("content").notNull(),
  category: text("category").notNull().default("general"), // general, promo, tips, testimonial
  imageUrl: text("image_url"),
  usageCount: integer("usage_count").default(0).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_posts_tenant").on(table.tenantId),
  index("idx_marketing_posts_category").on(table.category),
  index("idx_marketing_posts_active").on(table.isActive),
]);

export const insertMarketingPostSchema = createInsertSchema(marketingPosts).omit({
  id: true,
  usageCount: true,
  lastUsedAt: true,
  createdAt: true,
});

export type InsertMarketingPost = z.infer<typeof insertMarketingPostSchema>;
export type MarketingPost = typeof marketingPosts.$inferSelect;

// Marketing Schedule Configs - Per-platform posting schedules
export const marketingScheduleConfigs = pgTable("marketing_schedule_configs", {
  platform: text("platform").primaryKey(), // twitter, discord, telegram, facebook
  intervalMinutes: integer("interval_minutes").default(240).notNull(),
  lastDeployedAt: timestamp("last_deployed_at"),
  isActive: boolean("is_active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMarketingScheduleConfigSchema = createInsertSchema(marketingScheduleConfigs).omit({
  lastDeployedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMarketingScheduleConfig = z.infer<typeof insertMarketingScheduleConfigSchema>;
export type MarketingScheduleConfig = typeof marketingScheduleConfigs.$inferSelect;

// Marketing Deploys - History of all deployments
export const marketingDeploys = pgTable("marketing_deploys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").references(() => marketingPosts.id),
  platform: text("platform").notNull(), // twitter, discord, telegram, facebook
  status: text("status").notNull().default("pending"), // pending, success, failed
  externalId: text("external_id"), // Platform-specific post ID
  errorMessage: text("error_message"),
  deployedAt: timestamp("deployed_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_deploys_platform").on(table.platform),
  index("idx_marketing_deploys_status").on(table.status),
  index("idx_marketing_deploys_deployed_at").on(table.deployedAt),
]);

export const insertMarketingDeploySchema = createInsertSchema(marketingDeploys).omit({
  id: true,
  deployedAt: true,
});

export type InsertMarketingDeploy = z.infer<typeof insertMarketingDeploySchema>;
export type MarketingDeploy = typeof marketingDeploys.$inferSelect;


// ============================================
// ESTIMATOR CONFIGURATIONS
// ============================================

// Estimator Configs - Per-tenant pricing configurations
export const estimatorConfigs = pgTable("estimator_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().unique(),
  
  // Mode settings
  mode: text("mode").notNull().default("lead"), // 'lead' = collect info only, 'estimate' = show pricing
  
  // Base rates per square foot
  wallsPerSqFt: decimal("walls_per_sqft", { precision: 8, scale: 2 }).default("2.50"),
  ceilingsPerSqFt: decimal("ceilings_per_sqft", { precision: 8, scale: 2 }).default("1.75"),
  trimPerSqFt: decimal("trim_per_sqft", { precision: 8, scale: 2 }).default("1.25"),
  
  // Combo rates (discounted when doing multiple surfaces)
  wallsAndTrimPerSqFt: decimal("walls_and_trim_per_sqft", { precision: 8, scale: 2 }).default("3.50"),
  fullJobPerSqFt: decimal("full_job_per_sqft", { precision: 8, scale: 2 }).default("5.00"),
  
  // Unit pricing
  doorsPerUnit: decimal("doors_per_unit", { precision: 8, scale: 2 }).default("150.00"),
  cabinetDoorsPerUnit: decimal("cabinet_doors_per_unit", { precision: 8, scale: 2 }).default("85.00"),
  cabinetDrawersPerUnit: decimal("cabinet_drawers_per_unit", { precision: 8, scale: 2 }).default("45.00"),
  
  // Job minimums
  minimumJobAmount: decimal("minimum_job_amount", { precision: 8, scale: 2 }).default("500.00"),
  
  // Exterior multipliers (percentage increase over interior)
  exteriorMultiplier: decimal("exterior_multiplier", { precision: 4, scale: 2 }).default("1.25"),
  
  // Commercial vs residential
  commercialMultiplier: decimal("commercial_multiplier", { precision: 4, scale: 2 }).default("1.15"),
  
  // Additional services
  drywallRepairPerSqFt: decimal("drywall_repair_per_sqft", { precision: 8, scale: 2 }).default("8.00"),
  pressureWashingPerSqFt: decimal("pressure_washing_per_sqft", { precision: 8, scale: 2 }).default("0.25"),
  deckStainingPerSqFt: decimal("deck_staining_per_sqft", { precision: 8, scale: 2 }).default("4.50"),
  
  // Lead capture settings (for lead mode)
  collectPhotos: boolean("collect_photos").default(true),
  collectColors: boolean("collect_colors").default(true),
  requireContactInfo: boolean("require_contact_info").default(true),
  
  // Email settings for lead mode
  notificationEmail: text("notification_email"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_estimator_configs_tenant").on(table.tenantId),
]);

export const insertEstimatorConfigSchema = createInsertSchema(estimatorConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEstimatorConfig = z.infer<typeof insertEstimatorConfigSchema>;
export type EstimatorConfig = typeof estimatorConfigs.$inferSelect;

// ============ AI CREDITS SYSTEM ============

// Tenant Credits - Track prepaid credit balance per tenant
export const tenantCredits = pgTable("tenant_credits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().unique(),
  
  // Credit balance in cents (e.g., 2000 = $20.00)
  balanceCents: integer("balance_cents").notNull().default(0),
  
  // Lifetime stats
  totalPurchasedCents: integer("total_purchased_cents").notNull().default(0),
  totalUsedCents: integer("total_used_cents").notNull().default(0),
  
  // Low balance warning threshold in cents
  lowBalanceThresholdCents: integer("low_balance_threshold_cents").default(500), // $5.00 default
  
  // Stripe customer ID for this tenant
  stripeCustomerId: text("stripe_customer_id"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tenant_credits_tenant").on(table.tenantId),
]);

export const insertTenantCreditsSchema = createInsertSchema(tenantCredits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTenantCredits = z.infer<typeof insertTenantCreditsSchema>;
export type TenantCredits = typeof tenantCredits.$inferSelect;

// AI Usage Logs - Track every AI action with cost
export const aiUsageLogs = pgTable("ai_usage_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  
  // Action type: 'chat', 'photo_analysis', 'voice_response', 'proposal_generation'
  actionType: text("action_type").notNull(),
  
  // Cost in cents
  costCents: integer("cost_cents").notNull(),
  
  // Details about the action
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  charactersSpoken: integer("characters_spoken"), // For TTS
  imagesAnalyzed: integer("images_analyzed"),
  
  // Model used
  model: text("model"), // 'gpt-4o', 'gpt-4o-mini', 'elevenlabs-rachel', etc.
  
  // Balance after this transaction
  balanceAfterCents: integer("balance_after_cents"),
  
  // Metadata
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_ai_usage_tenant").on(table.tenantId),
  index("idx_ai_usage_created").on(table.createdAt),
  index("idx_ai_usage_action_type").on(table.actionType),
]);

export const insertAiUsageLogSchema = createInsertSchema(aiUsageLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertAiUsageLog = z.infer<typeof insertAiUsageLogSchema>;
export type AiUsageLog = typeof aiUsageLogs.$inferSelect;

// Credit Purchases - Track credit pack purchases
export const creditPurchases = pgTable("credit_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  
  // Amount purchased in cents
  amountCents: integer("amount_cents").notNull(),
  
  // Payment details
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id"),
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  
  // Pack type: 'starter_10', 'value_25', 'pro_50', 'business_100'
  packType: text("pack_type"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_credit_purchases_tenant").on(table.tenantId),
  index("idx_credit_purchases_status").on(table.paymentStatus),
]);

export const insertCreditPurchaseSchema = createInsertSchema(creditPurchases).omit({
  id: true,
  createdAt: true,
});

export type InsertCreditPurchase = z.infer<typeof insertCreditPurchaseSchema>;
export type CreditPurchase = typeof creditPurchases.$inferSelect;

// ============ CUSTOMER PORTAL & JOB TRACKING ============

// Jobs - Track active jobs for customer portal
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  proposalId: varchar("proposal_id").references(() => proposals.id),
  leadId: varchar("lead_id").references(() => leads.id),
  
  // Job details
  jobNumber: text("job_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  address: text("address"),
  
  // Customer info
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  
  // Access token for customer portal (no login required)
  accessToken: text("access_token").notNull().default(sql`gen_random_uuid()`),
  
  // Schedule
  scheduledStartDate: timestamp("scheduled_start_date"),
  scheduledEndDate: timestamp("scheduled_end_date"),
  actualStartDate: timestamp("actual_start_date"),
  actualEndDate: timestamp("actual_end_date"),
  
  // Status
  status: text("status").notNull().default("scheduled"), // 'scheduled', 'in_progress', 'paused', 'completed', 'cancelled'
  progressPercent: integer("progress_percent").default(0),
  
  // Crew assignment
  crewLeadId: varchar("crew_lead_id").references(() => crewLeads.id),
  
  // Financials
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
  depositPaid: boolean("deposit_paid").default(false),
  balanceDue: decimal("balance_due", { precision: 10, scale: 2 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_jobs_tenant").on(table.tenantId),
  index("idx_jobs_status").on(table.status),
  index("idx_jobs_access_token").on(table.accessToken),
]);

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  accessToken: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Job Updates - Status updates visible in customer portal
export const jobUpdates = pgTable("job_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  
  // Update content
  title: text("title").notNull(),
  message: text("message"),
  updateType: text("update_type").notNull(), // 'status_change', 'progress', 'photo', 'note', 'schedule_change'
  
  // Optional photo
  photoUrl: text("photo_url"),
  
  // Progress update
  progressPercent: integer("progress_percent"),
  
  // Who posted
  postedBy: text("posted_by"), // 'crew_lead', 'admin', 'system'
  postedByName: text("posted_by_name"),
  
  // Visibility
  visibleToCustomer: boolean("visible_to_customer").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_job_updates_job").on(table.jobId),
]);

export const insertJobUpdateSchema = createInsertSchema(jobUpdates).omit({
  id: true,
  createdAt: true,
});

export type InsertJobUpdate = z.infer<typeof insertJobUpdateSchema>;
export type JobUpdate = typeof jobUpdates.$inferSelect;

// ============ REVIEW AUTOMATION ============

// Review Requests - Track automated review requests
export const reviewRequests = pgTable("review_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  jobId: varchar("job_id").references(() => jobs.id),
  
  // Customer info
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  
  // Request status
  status: text("status").notNull().default("pending"), // 'pending', 'sent', 'opened', 'completed', 'declined'
  
  // Delivery
  sentVia: text("sent_via"), // 'email', 'sms', 'both'
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
  completedAt: timestamp("completed_at"),
  
  // Review links
  googleReviewUrl: text("google_review_url"),
  yelpReviewUrl: text("yelp_review_url"),
  facebookReviewUrl: text("facebook_review_url"),
  
  // If they left a review
  reviewRating: integer("review_rating"), // 1-5
  reviewPlatform: text("review_platform"), // 'google', 'yelp', 'facebook'
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_review_requests_tenant").on(table.tenantId),
  index("idx_review_requests_job").on(table.jobId),
  index("idx_review_requests_status").on(table.status),
]);

export const insertReviewRequestSchema = createInsertSchema(reviewRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertReviewRequest = z.infer<typeof insertReviewRequestSchema>;
export type ReviewRequest = typeof reviewRequests.$inferSelect;

// ============ PORTFOLIO SYSTEM ============

// Portfolio Entries - Before/after photo showcase
export const portfolioEntries = pgTable("portfolio_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull().default("demo"),
  jobId: varchar("job_id").references(() => jobs.id),
  
  // Project info
  title: text("title").notNull(),
  description: text("description"),
  projectType: text("project_type"), // 'interior', 'exterior', 'commercial', 'residential'
  
  // Photos
  beforePhotoUrl: text("before_photo_url"),
  afterPhotoUrl: text("after_photo_url"),
  
  // AI-enhanced versions
  beforeEnhancedUrl: text("before_enhanced_url"),
  afterEnhancedUrl: text("after_enhanced_url"),
  
  // Additional photos (JSON array of URLs)
  additionalPhotos: jsonb("additional_photos"),
  
  // Details
  colorUsed: text("color_used"),
  brandUsed: text("brand_used"),
  completionDate: timestamp("completion_date"),
  
  // Display settings
  isFeatured: boolean("is_featured").default(false),
  displayOrder: integer("display_order").default(0),
  isPublished: boolean("is_published").default(false),
  
  // Customer testimonial (optional)
  customerTestimonial: text("customer_testimonial"),
  customerName: text("customer_name"),
  customerCity: text("customer_city"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_portfolio_tenant").on(table.tenantId),
  index("idx_portfolio_featured").on(table.isFeatured),
  index("idx_portfolio_published").on(table.isPublished),
]);

export const insertPortfolioEntrySchema = createInsertSchema(portfolioEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPortfolioEntry = z.infer<typeof insertPortfolioEntrySchema>;
export type PortfolioEntry = typeof portfolioEntries.$inferSelect;

// ============ MATERIAL CALCULATIONS ============
export const materialCalculations = pgTable("material_calculations", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  leadId: varchar("lead_id", { length: 36 }).references(() => leads.id),
  estimateId: varchar("estimate_id", { length: 36 }).references(() => estimates.id),
  
  // Room details
  roomName: varchar("room_name", { length: 100 }),
  squareFeet: integer("square_feet"),
  ceilingHeight: integer("ceiling_height").default(9),
  
  // Calculated materials
  paintGallons: real("paint_gallons"),
  primerGallons: real("primer_gallons"),
  coatsNeeded: integer("coats_needed").default(2),
  
  // Paint specifications
  paintType: varchar("paint_type", { length: 50 }), // interior, exterior
  finishType: varchar("finish_type", { length: 50 }), // flat, eggshell, satin, semi-gloss, gloss
  brandRecommendation: varchar("brand_recommendation", { length: 100 }),
  colorCode: varchar("color_code", { length: 50 }),
  
  // Cost estimates
  estimatedMaterialCost: integer("estimated_material_cost"), // cents
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_material_calc_tenant").on(table.tenantId),
  index("idx_material_calc_lead").on(table.leadId),
]);

export const insertMaterialCalculationSchema = createInsertSchema(materialCalculations).omit({
  id: true,
  createdAt: true,
});

export type InsertMaterialCalculation = z.infer<typeof insertMaterialCalculationSchema>;
export type MaterialCalculation = typeof materialCalculations.$inferSelect;

// ============ LEAD SOURCES ============
export const leadSources = pgTable("lead_sources", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  name: varchar("name", { length: 100 }).notNull(), // Google, Facebook, Referral, Yard Sign, etc.
  category: varchar("category", { length: 50 }), // digital, referral, signage, other
  trackingCode: varchar("tracking_code", { length: 50 }), // UTM or custom code
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_lead_source_tenant").on(table.tenantId),
]);

export const insertLeadSourceSchema = createInsertSchema(leadSources).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadSource = z.infer<typeof insertLeadSourceSchema>;
export type LeadSource = typeof leadSources.$inferSelect;

// ============ WARRANTIES ============
export const warranties = pgTable("warranties", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id),
  leadId: varchar("lead_id", { length: 36 }).references(() => leads.id),
  
  warrantyNumber: varchar("warranty_number", { length: 50 }),
  warrantyType: varchar("warranty_type", { length: 50 }), // labor, materials, full
  durationYears: integer("duration_years").default(2),
  
  startDate: timestamp("start_date"),
  expirationDate: timestamp("expiration_date"),
  
  customerName: varchar("customer_name", { length: 200 }),
  customerEmail: varchar("customer_email", { length: 200 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  propertyAddress: text("property_address"),
  
  coverageDetails: text("coverage_details"),
  exclusions: text("exclusions"),
  
  // Blockchain verification
  blockchainTxSignature: varchar("blockchain_tx_signature", { length: 200 }),
  hallmarkId: varchar("hallmark_id", { length: 36 }),
  
  // Reminder tracking
  reminderSent30Days: boolean("reminder_sent_30_days").default(false),
  reminderSent7Days: boolean("reminder_sent_7_days").default(false),
  
  status: varchar("status", { length: 20 }).default("active"), // active, expired, claimed
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_warranty_tenant").on(table.tenantId),
  index("idx_warranty_job").on(table.jobId),
  index("idx_warranty_expiration").on(table.expirationDate),
]);

export const insertWarrantySchema = createInsertSchema(warranties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWarranty = z.infer<typeof insertWarrantySchema>;
export type Warranty = typeof warranties.$inferSelect;

// ============ FOLLOW-UP SEQUENCES ============
export const followupSequences = pgTable("followup_sequences", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  name: varchar("name", { length: 100 }).notNull(),
  triggerType: varchar("trigger_type", { length: 50 }).notNull(), // estimate_sent, no_response, proposal_viewed
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_followup_seq_tenant").on(table.tenantId),
]);

export const followupSteps = pgTable("followup_steps", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sequenceId: varchar("sequence_id", { length: 36 }).references(() => followupSequences.id).notNull(),
  
  stepOrder: integer("step_order").notNull(),
  delayDays: integer("delay_days").notNull(), // days after trigger
  
  channel: varchar("channel", { length: 20 }).notNull(), // email, sms
  subject: varchar("subject", { length: 200 }),
  content: text("content").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_followup_step_sequence").on(table.sequenceId),
]);

export const followupLogs = pgTable("followup_logs", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  sequenceId: varchar("sequence_id", { length: 36 }).references(() => followupSequences.id),
  stepId: varchar("step_id", { length: 36 }).references(() => followupSteps.id),
  leadId: varchar("lead_id", { length: 36 }).references(() => leads.id),
  
  status: varchar("status", { length: 20 }).notNull(), // pending, sent, failed, cancelled
  sentAt: timestamp("sent_at"),
  scheduledFor: timestamp("scheduled_for"),
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_followup_log_tenant").on(table.tenantId),
  index("idx_followup_log_lead").on(table.leadId),
  index("idx_followup_log_scheduled").on(table.scheduledFor),
]);

export const insertFollowupSequenceSchema = createInsertSchema(followupSequences).omit({
  id: true,
  createdAt: true,
});
export const insertFollowupStepSchema = createInsertSchema(followupSteps).omit({
  id: true,
  createdAt: true,
});
export const insertFollowupLogSchema = createInsertSchema(followupLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertFollowupSequence = z.infer<typeof insertFollowupSequenceSchema>;
export type FollowupSequence = typeof followupSequences.$inferSelect;
export type InsertFollowupStep = z.infer<typeof insertFollowupStepSchema>;
export type FollowupStep = typeof followupSteps.$inferSelect;
export type InsertFollowupLog = z.infer<typeof insertFollowupLogSchema>;
export type FollowupLog = typeof followupLogs.$inferSelect;

// ============ REFERRAL PROGRAM ============
export const referralProgram = pgTable("referral_program", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  referrerName: varchar("referrer_name", { length: 200 }).notNull(),
  referrerEmail: varchar("referrer_email", { length: 200 }),
  referrerPhone: varchar("referrer_phone", { length: 50 }),
  
  referralCode: varchar("referral_code", { length: 20 }).notNull(),
  referralLink: text("referral_link"),
  
  // Stats
  totalReferrals: integer("total_referrals").default(0),
  successfulReferrals: integer("successful_referrals").default(0),
  
  // Rewards
  rewardType: varchar("reward_type", { length: 50 }), // cash, discount, gift_card
  rewardAmount: integer("reward_amount"), // cents or percentage
  totalEarned: integer("total_earned").default(0), // cents
  
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_referral_tenant").on(table.tenantId),
  index("idx_referral_code").on(table.referralCode),
]);

export const referralTracking = pgTable("referral_tracking", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  referralProgramId: varchar("referral_program_id", { length: 36 }).references(() => referralProgram.id),
  leadId: varchar("lead_id", { length: 36 }).references(() => leads.id),
  
  status: varchar("status", { length: 20 }).default("pending"), // pending, converted, rewarded
  convertedAt: timestamp("converted_at"),
  rewardPaidAt: timestamp("reward_paid_at"),
  rewardAmount: integer("reward_amount"), // cents
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_referral_track_program").on(table.referralProgramId),
  index("idx_referral_track_lead").on(table.leadId),
]);

export const insertReferralProgramSchema = createInsertSchema(referralProgram).omit({
  id: true,
  createdAt: true,
});
export const insertReferralTrackingSchema = createInsertSchema(referralTracking).omit({
  id: true,
  createdAt: true,
});

export type InsertReferralProgram = z.infer<typeof insertReferralProgramSchema>;
export type ReferralProgram = typeof referralProgram.$inferSelect;
export type InsertReferralTracking = z.infer<typeof insertReferralTrackingSchema>;
export type ReferralTracking = typeof referralTracking.$inferSelect;

// ============ GPS CHECK-INS ============
export const gpsCheckins = pgTable("gps_checkins", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id),
  crewMemberId: varchar("crew_member_id", { length: 36 }).references(() => crewMembers.id),
  
  checkinType: varchar("checkin_type", { length: 20 }).notNull(), // arrival, departure
  
  latitude: real("latitude"),
  longitude: real("longitude"),
  accuracy: real("accuracy"), // meters
  
  // Verification
  distanceFromJobSite: real("distance_from_job_site"), // meters
  isWithinRadius: boolean("is_within_radius"),
  verificationRadius: integer("verification_radius").default(100), // meters
  
  // Photo verification (optional)
  photoUrl: text("photo_url"),
  
  deviceInfo: text("device_info"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_gps_checkin_tenant").on(table.tenantId),
  index("idx_gps_checkin_job").on(table.jobId),
  index("idx_gps_checkin_member").on(table.crewMemberId),
]);

export const insertGpsCheckinSchema = createInsertSchema(gpsCheckins).omit({
  id: true,
  createdAt: true,
});

export type InsertGpsCheckin = z.infer<typeof insertGpsCheckinSchema>;
export type GpsCheckin = typeof gpsCheckins.$inferSelect;

// ============ PAYMENT DEPOSITS ============
export const paymentDeposits = pgTable("payment_deposits", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  estimateId: varchar("estimate_id", { length: 36 }).references(() => estimates.id),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id),
  
  amount: integer("amount").notNull(), // cents
  depositPercentage: integer("deposit_percentage"), // e.g., 25 for 25%
  
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 200 }),
  stripeChargeId: varchar("stripe_charge_id", { length: 200 }),
  
  status: varchar("status", { length: 20 }).default("pending"), // pending, paid, refunded, failed
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  
  customerEmail: varchar("customer_email", { length: 200 }),
  customerName: varchar("customer_name", { length: 200 }),
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_deposit_tenant").on(table.tenantId),
  index("idx_deposit_estimate").on(table.estimateId),
  index("idx_deposit_job").on(table.jobId),
]);

export const insertPaymentDepositSchema = createInsertSchema(paymentDeposits).omit({
  id: true,
  createdAt: true,
});
export type InsertPaymentDeposit = z.infer<typeof insertPaymentDepositSchema>;
export type PaymentDeposit = typeof paymentDeposits.$inferSelect;

// ============ JOB COSTING ============
export const jobCosting = pgTable("job_costing", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id).notNull(),
  
  // Estimated costs (from quote)
  estimatedLabor: integer("estimated_labor").default(0), // cents
  estimatedMaterials: integer("estimated_materials").default(0),
  estimatedTotal: integer("estimated_total").default(0),
  
  // Actual costs (tracked)
  actualLabor: integer("actual_labor").default(0), // cents
  actualMaterials: integer("actual_materials").default(0),
  actualTotal: integer("actual_total").default(0),
  
  // Labor tracking
  estimatedHours: real("estimated_hours"),
  actualHours: real("actual_hours"),
  laborRate: integer("labor_rate"), // cents per hour
  
  // Profit analysis
  grossProfit: integer("gross_profit"), // cents
  profitMargin: real("profit_margin"), // percentage
  
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_job_costing_tenant").on(table.tenantId),
  index("idx_job_costing_job").on(table.jobId),
]);

export const insertJobCostingSchema = createInsertSchema(jobCosting).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertJobCosting = z.infer<typeof insertJobCostingSchema>;
export type JobCosting = typeof jobCosting.$inferSelect;

// ============ JOB PHOTOS (Progress Updates) ============
export const jobPhotos = pgTable("job_photos", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id).notNull(),
  
  photoUrl: text("photo_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  
  photoType: varchar("photo_type", { length: 30 }).notNull(), // before, during, after, issue
  caption: text("caption"),
  
  uploadedBy: varchar("uploaded_by", { length: 36 }),
  uploadedByName: varchar("uploaded_by_name", { length: 200 }),
  
  isVisibleToCustomer: boolean("is_visible_to_customer").default(true),
  
  takenAt: timestamp("taken_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_job_photo_tenant").on(table.tenantId),
  index("idx_job_photo_job").on(table.jobId),
]);

export const insertJobPhotoSchema = createInsertSchema(jobPhotos).omit({
  id: true,
  createdAt: true,
});
export type InsertJobPhoto = z.infer<typeof insertJobPhotoSchema>;
export type JobPhoto = typeof jobPhotos.$inferSelect;

// ============ INVENTORY MANAGEMENT ============
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  name: varchar("name", { length: 200 }).notNull(),
  sku: varchar("sku", { length: 50 }),
  category: varchar("category", { length: 50 }).notNull(), // paint, primer, supplies, equipment
  
  brand: varchar("brand", { length: 100 }),
  colorCode: varchar("color_code", { length: 50 }),
  colorName: varchar("color_name", { length: 100 }),
  
  unit: varchar("unit", { length: 20 }).notNull(), // gallon, quart, each, roll
  quantityInStock: real("quantity_in_stock").default(0),
  minimumStock: real("minimum_stock").default(0),
  reorderPoint: real("reorder_point"),
  
  costPerUnit: integer("cost_per_unit"), // cents
  lastPurchaseDate: timestamp("last_purchase_date"),
  
  location: varchar("location", { length: 100 }), // warehouse, van, job site
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_inventory_tenant").on(table.tenantId),
  index("idx_inventory_category").on(table.category),
]);

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  itemId: varchar("item_id", { length: 36 }).references(() => inventoryItems.id).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id),
  
  transactionType: varchar("transaction_type", { length: 20 }).notNull(), // purchase, use, return, adjustment
  quantity: real("quantity").notNull(),
  previousQuantity: real("previous_quantity"),
  newQuantity: real("new_quantity"),
  
  unitCost: integer("unit_cost"), // cents
  totalCost: integer("total_cost"), // cents
  
  notes: text("notes"),
  performedBy: varchar("performed_by", { length: 200 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_inv_trans_tenant").on(table.tenantId),
  index("idx_inv_trans_item").on(table.itemId),
  index("idx_inv_trans_job").on(table.jobId),
]);

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({
  id: true,
  createdAt: true,
});
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;

// ============ SUBCONTRACTOR MANAGEMENT ============
export const subcontractors = pgTable("subcontractors", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  companyName: varchar("company_name", { length: 200 }).notNull(),
  contactName: varchar("contact_name", { length: 200 }),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 50 }),
  
  specialty: varchar("specialty", { length: 100 }), // exterior, commercial, drywall, etc.
  licenseNumber: varchar("license_number", { length: 100 }),
  insuranceExpiry: timestamp("insurance_expiry"),
  
  hourlyRate: integer("hourly_rate"), // cents
  dayRate: integer("day_rate"), // cents
  
  rating: real("rating"), // 1-5
  totalJobs: integer("total_jobs").default(0),
  
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_subcontractor_tenant").on(table.tenantId),
]);

export const subcontractorAssignments = pgTable("subcontractor_assignments", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  subcontractorId: varchar("subcontractor_id", { length: 36 }).references(() => subcontractors.id).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id).notNull(),
  
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  agreedRate: integer("agreed_rate"), // cents
  rateType: varchar("rate_type", { length: 20 }), // hourly, daily, fixed
  
  hoursWorked: real("hours_worked"),
  totalPaid: integer("total_paid"), // cents
  
  status: varchar("status", { length: 20 }).default("assigned"), // assigned, in_progress, completed, cancelled
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_sub_assign_tenant").on(table.tenantId),
  index("idx_sub_assign_sub").on(table.subcontractorId),
  index("idx_sub_assign_job").on(table.jobId),
]);

export const insertSubcontractorSchema = createInsertSchema(subcontractors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertSubcontractorAssignmentSchema = createInsertSchema(subcontractorAssignments).omit({
  id: true,
  createdAt: true,
});
export type InsertSubcontractor = z.infer<typeof insertSubcontractorSchema>;
export type Subcontractor = typeof subcontractors.$inferSelect;
export type InsertSubcontractorAssignment = z.infer<typeof insertSubcontractorAssignmentSchema>;
export type SubcontractorAssignment = typeof subcontractorAssignments.$inferSelect;

// ============ WEATHER SCHEDULING ============
export const weatherAlerts = pgTable("weather_alerts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => jobs.id),
  bookingId: varchar("booking_id", { length: 36 }).references(() => bookings.id),
  
  alertType: varchar("alert_type", { length: 30 }).notNull(), // rain, extreme_heat, extreme_cold, wind
  severity: varchar("severity", { length: 20 }).notNull(), // low, medium, high
  
  forecastDate: timestamp("forecast_date").notNull(),
  weatherDescription: text("weather_description"),
  temperature: real("temperature"),
  precipitationChance: integer("precipitation_chance"),
  windSpeed: real("wind_speed"),
  
  suggestedAction: varchar("suggested_action", { length: 50 }), // reschedule, monitor, proceed
  isAcknowledged: boolean("is_acknowledged").default(false),
  acknowledgedBy: varchar("acknowledged_by", { length: 200 }),
  acknowledgedAt: timestamp("acknowledged_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_weather_alert_tenant").on(table.tenantId),
  index("idx_weather_alert_job").on(table.jobId),
  index("idx_weather_alert_date").on(table.forecastDate),
]);

export const insertWeatherAlertSchema = createInsertSchema(weatherAlerts).omit({
  id: true,
  createdAt: true,
});
export type InsertWeatherAlert = z.infer<typeof insertWeatherAlertSchema>;
export type WeatherAlert = typeof weatherAlerts.$inferSelect;

// ============ WEBHOOK INTEGRATIONS (Zapier/Make) ============
export const webhookSubscriptions = pgTable("webhook_subscriptions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  name: varchar("name", { length: 100 }).notNull(),
  url: text("url").notNull(),
  secret: varchar("secret", { length: 100 }),
  
  events: text("events").array(), // lead.created, estimate.signed, job.completed, etc.
  
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  failureCount: integer("failure_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_webhook_tenant").on(table.tenantId),
]);

export const webhookLogs = pgTable("webhook_logs", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  subscriptionId: varchar("subscription_id", { length: 36 }).references(() => webhookSubscriptions.id).notNull(),
  
  eventType: varchar("event_type", { length: 50 }).notNull(),
  payload: jsonb("payload"),
  
  responseStatus: integer("response_status"),
  responseBody: text("response_body"),
  
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_webhook_log_sub").on(table.subscriptionId),
]);

export const insertWebhookSubscriptionSchema = createInsertSchema(webhookSubscriptions).omit({
  id: true,
  createdAt: true,
});
export const insertWebhookLogSchema = createInsertSchema(webhookLogs).omit({
  id: true,
  createdAt: true,
});
export type InsertWebhookSubscription = z.infer<typeof insertWebhookSubscriptionSchema>;
export type WebhookSubscription = typeof webhookSubscriptions.$inferSelect;
export type InsertWebhookLog = z.infer<typeof insertWebhookLogSchema>;
export type WebhookLog = typeof webhookLogs.$inferSelect;

// ============ TRADE VERTICALS ============
export const tradeVerticals = pgTable("trade_verticals", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  name: varchar("name", { length: 100 }).notNull(), // painting, hvac, roofing, plumbing, electrical
  displayName: varchar("display_name", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  
  defaultServices: jsonb("default_services"), // array of service templates
  defaultPricing: jsonb("default_pricing"), // pricing structure template
  estimatorFields: jsonb("estimator_fields"), // custom fields for estimator
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTradeVerticalSchema = createInsertSchema(tradeVerticals).omit({
  id: true,
  createdAt: true,
});
export type InsertTradeVertical = z.infer<typeof insertTradeVerticalSchema>;
export type TradeVertical = typeof tradeVerticals.$inferSelect;

// ============ FRANCHISE REPORTS ============
export const franchiseReports = pgTable("franchise_reports", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  locationId: varchar("location_id", { length: 36 }).references(() => franchiseLocations.id),
  
  reportPeriod: varchar("report_period", { length: 20 }).notNull(), // 2026-01, 2026-Q1, 2026
  periodType: varchar("period_type", { length: 20 }).notNull(), // monthly, quarterly, yearly
  
  revenue: integer("revenue").default(0), // cents
  expenses: integer("expenses").default(0),
  profit: integer("profit").default(0),
  
  leadsGenerated: integer("leads_generated").default(0),
  estimatesSent: integer("estimates_sent").default(0),
  jobsCompleted: integer("jobs_completed").default(0),
  
  avgTicket: integer("avg_ticket").default(0), // cents
  closeRate: real("close_rate"),
  customerSatisfaction: real("customer_satisfaction"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_franchise_report_tenant").on(table.tenantId),
  index("idx_franchise_report_location").on(table.locationId),
  index("idx_franchise_report_period").on(table.reportPeriod),
]);

export const insertFranchiseReportSchema = createInsertSchema(franchiseReports).omit({
  id: true,
  createdAt: true,
});
export type InsertFranchiseReport = z.infer<typeof insertFranchiseReportSchema>;
export type FranchiseReport = typeof franchiseReports.$inferSelect;

// ============ FINANCING OPTIONS ============
export const financingPlans = pgTable("financing_plans", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  
  termMonths: integer("term_months").notNull(), // 6, 12, 18, 24
  interestRate: real("interest_rate").notNull(), // APR percentage
  minAmount: integer("min_amount"), // cents
  maxAmount: integer("max_amount"), // cents
  
  provider: varchar("provider", { length: 50 }), // internal, affirm, klarna
  providerPlanId: varchar("provider_plan_id", { length: 100 }),
  
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_financing_tenant").on(table.tenantId),
]);

export const insertFinancingPlanSchema = createInsertSchema(financingPlans).omit({
  id: true,
  createdAt: true,
});
export type InsertFinancingPlan = z.infer<typeof insertFinancingPlanSchema>;
export type FinancingPlan = typeof financingPlans.$inferSelect;

// ============ COLOR PALETTES ============
export const colorPalettes = pgTable("color_palettes", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  name: varchar("name", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }), // sherwin-williams, benjamin-moore, behr
  
  colors: jsonb("colors").notNull(), // array of {name, code, hex, category}
  
  roomType: varchar("room_type", { length: 50 }), // living_room, bedroom, kitchen, exterior
  style: varchar("style", { length: 50 }), // modern, traditional, coastal, farmhouse
  
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_palette_tenant").on(table.tenantId),
  index("idx_palette_brand").on(table.brand),
]);

export const insertColorPaletteSchema = createInsertSchema(colorPalettes).omit({
  id: true,
  createdAt: true,
});
export type InsertColorPalette = z.infer<typeof insertColorPaletteSchema>;
export type ColorPalette = typeof colorPalettes.$inferSelect;

// ============ CALENDAR EXPORTS ============
export const calendarExports = pgTable("calendar_exports", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  userId: varchar("user_id", { length: 36 }),
  
  exportToken: varchar("export_token", { length: 100 }).notNull(),
  calendarType: varchar("calendar_type", { length: 30 }).notNull(), // bookings, jobs, all
  
  lastAccessed: timestamp("last_accessed"),
  accessCount: integer("access_count").default(0),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_cal_export_tenant").on(table.tenantId),
  index("idx_cal_export_token").on(table.exportToken),
]);

export const insertCalendarExportSchema = createInsertSchema(calendarExports).omit({
  id: true,
  createdAt: true,
});
export type InsertCalendarExport = z.infer<typeof insertCalendarExportSchema>;
export type CalendarExport = typeof calendarExports.$inferSelect;

// ============ GOOGLE CALENDAR CONNECTIONS ============
export const googleCalendarConnections = pgTable("google_calendar_connections", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  userId: varchar("user_id", { length: 36 }),
  
  googleEmail: varchar("google_email", { length: 200 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  
  calendarId: varchar("calendar_id", { length: 200 }).default("primary"),
  syncBookings: boolean("sync_bookings").default(true),
  syncJobs: boolean("sync_jobs").default(true),
  
  lastSynced: timestamp("last_synced"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_gcal_tenant").on(table.tenantId),
  index("idx_gcal_email").on(table.googleEmail),
]);

export const insertGoogleCalendarConnectionSchema = createInsertSchema(googleCalendarConnections).omit({
  id: true,
  createdAt: true,
});
export type InsertGoogleCalendarConnection = z.infer<typeof insertGoogleCalendarConnectionSchema>;
export type GoogleCalendarConnection = typeof googleCalendarConnections.$inferSelect;

// ============ GOOGLE LOCAL SERVICES ADS (LSA) ============
export const googleLsaConnections = pgTable("google_lsa_connections", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  googleAdsCustomerId: varchar("google_ads_customer_id", { length: 50 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  
  businessName: varchar("business_name", { length: 200 }),
  serviceCategories: text("service_categories").array(),
  weeklyBudget: integer("weekly_budget"),
  
  lastLeadSync: timestamp("last_lead_sync"),
  totalLeadsImported: integer("total_leads_imported").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_lsa_tenant").on(table.tenantId),
  index("idx_lsa_customer_id").on(table.googleAdsCustomerId),
]);

export const googleLsaLeads = pgTable("google_lsa_leads", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  connectionId: varchar("connection_id", { length: 36 }).references(() => googleLsaConnections.id),
  
  googleLeadId: varchar("google_lead_id", { length: 100 }).notNull(),
  leadType: varchar("lead_type", { length: 30 }), // CALL, MESSAGE, BOOKING
  
  customerName: varchar("customer_name", { length: 200 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  customerEmail: varchar("customer_email", { length: 200 }),
  
  serviceCategory: varchar("service_category", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  
  chargeStatus: varchar("charge_status", { length: 30 }), // CHARGED, CREDITED, NOT_CHARGED
  disputeStatus: varchar("dispute_status", { length: 30 }),
  
  leadCreatedAt: timestamp("lead_created_at"),
  importedAt: timestamp("imported_at").defaultNow().notNull(),
  
  convertedToLead: boolean("converted_to_lead").default(false),
  internalLeadId: varchar("internal_lead_id", { length: 36 }),
  
  feedbackRating: integer("feedback_rating"), // 1-5
  feedbackComment: text("feedback_comment"),
}, (table) => [
  index("idx_lsa_lead_tenant").on(table.tenantId),
  index("idx_lsa_lead_google_id").on(table.googleLeadId),
]);

export const insertGoogleLsaConnectionSchema = createInsertSchema(googleLsaConnections).omit({
  id: true,
  createdAt: true,
});
export const insertGoogleLsaLeadSchema = createInsertSchema(googleLsaLeads).omit({
  id: true,
  importedAt: true,
});
export type InsertGoogleLsaConnection = z.infer<typeof insertGoogleLsaConnectionSchema>;
export type GoogleLsaConnection = typeof googleLsaConnections.$inferSelect;
export type InsertGoogleLsaLead = z.infer<typeof insertGoogleLsaLeadSchema>;
export type GoogleLsaLead = typeof googleLsaLeads.$inferSelect;

// ============ CUSTOMER SELF-SCHEDULING ============
export const schedulingSlots = pgTable("scheduling_slots", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  date: timestamp("date").notNull(),
  startTime: varchar("start_time", { length: 10 }).notNull(), // "09:00"
  endTime: varchar("end_time", { length: 10 }).notNull(), // "10:00"
  
  slotType: varchar("slot_type", { length: 30 }).default("estimate"), // estimate, consultation
  maxBookings: integer("max_bookings").default(1),
  currentBookings: integer("current_bookings").default(0),
  
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_sched_slot_tenant").on(table.tenantId),
  index("idx_sched_slot_date").on(table.date),
]);

export const customerBookings = pgTable("customer_bookings", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  slotId: varchar("slot_id", { length: 36 }).references(() => schedulingSlots.id),
  
  customerName: varchar("customer_name", { length: 200 }).notNull(),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  
  serviceType: varchar("service_type", { length: 100 }),
  projectDescription: text("project_description"),
  address: text("address"),
  
  status: varchar("status", { length: 30 }).default("confirmed"), // confirmed, cancelled, completed
  confirmationCode: varchar("confirmation_code", { length: 20 }),
  
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_cust_booking_tenant").on(table.tenantId),
  index("idx_cust_booking_slot").on(table.slotId),
]);

export const insertSchedulingSlotSchema = createInsertSchema(schedulingSlots).omit({ id: true, createdAt: true });
export const insertCustomerBookingSchema = createInsertSchema(customerBookings).omit({ id: true, createdAt: true });
export type InsertSchedulingSlot = z.infer<typeof insertSchedulingSlotSchema>;
export type SchedulingSlot = typeof schedulingSlots.$inferSelect;
export type InsertCustomerBooking = z.infer<typeof insertCustomerBookingSchema>;
export type CustomerBooking = typeof customerBookings.$inferSelect;

// ============ AI PHOTO ANALYSIS ============
export const photoAnalyses = pgTable("photo_analyses", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  imageUrl: text("image_url").notNull(),
  imageType: varchar("image_type", { length: 30 }), // room, exterior, damage
  
  estimatedSqft: integer("estimated_sqft"),
  roomType: varchar("room_type", { length: 100 }), // bedroom, kitchen, living room
  surfacesDetected: text("surfaces_detected"), // JSON array: walls, ceiling, trim, doors
  conditionNotes: text("condition_notes"),
  colorSuggestions: text("color_suggestions"),
  
  aiModel: varchar("ai_model", { length: 50 }),
  confidence: real("confidence"),
  rawResponse: text("raw_response"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_photo_analysis_tenant").on(table.tenantId),
]);

export const insertPhotoAnalysisSchema = createInsertSchema(photoAnalyses).omit({ id: true, createdAt: true });
export type InsertPhotoAnalysis = z.infer<typeof insertPhotoAnalysisSchema>;
export type PhotoAnalysis = typeof photoAnalyses.$inferSelect;

// ============ LIVE CHAT WIDGET ============
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  visitorId: varchar("visitor_id", { length: 100 }),
  visitorName: varchar("visitor_name", { length: 200 }),
  visitorEmail: varchar("visitor_email", { length: 200 }),
  visitorPhone: varchar("visitor_phone", { length: 50 }),
  
  pageUrl: text("page_url"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  
  status: varchar("status", { length: 30 }).default("active"), // active, closed, converted
  assignedTo: varchar("assigned_to", { length: 36 }),
  
  convertedToLead: boolean("converted_to_lead").default(false),
  leadId: varchar("lead_id", { length: 36 }),
  
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
}, (table) => [
  index("idx_chat_session_tenant").on(table.tenantId),
  index("idx_chat_session_status").on(table.status),
]);

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: varchar("session_id", { length: 36 }).references(() => chatSessions.id).notNull(),
  
  senderType: varchar("sender_type", { length: 20 }).notNull(), // visitor, agent, bot
  senderId: varchar("sender_id", { length: 36 }),
  senderName: varchar("sender_name", { length: 200 }),
  
  messageType: varchar("message_type", { length: 30 }).default("text"), // text, image, file
  content: text("content").notNull(),
  
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_chat_msg_session").on(table.sessionId),
]);

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({ id: true, startedAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// ============ CALL TRACKING ============
export const callTrackingNumbers = pgTable("call_tracking_numbers", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  forwardTo: varchar("forward_to", { length: 20 }).notNull(),
  
  source: varchar("source", { length: 100 }).notNull(), // google_ads, facebook, yard_sign, website
  campaign: varchar("campaign", { length: 200 }),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_call_track_tenant").on(table.tenantId),
]);

export const callLogs = pgTable("call_logs", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  trackingNumberId: varchar("tracking_number_id", { length: 36 }).references(() => callTrackingNumbers.id),
  
  callerNumber: varchar("caller_number", { length: 20 }),
  callerName: varchar("caller_name", { length: 200 }),
  
  duration: integer("duration"), // seconds
  status: varchar("status", { length: 30 }), // answered, missed, voicemail
  recordingUrl: text("recording_url"),
  
  source: varchar("source", { length: 100 }),
  campaign: varchar("campaign", { length: 200 }),
  
  convertedToLead: boolean("converted_to_lead").default(false),
  leadId: varchar("lead_id", { length: 36 }),
  notes: text("notes"),
  
  calledAt: timestamp("called_at").defaultNow().notNull(),
}, (table) => [
  index("idx_call_log_tenant").on(table.tenantId),
  index("idx_call_log_source").on(table.source),
]);

export const insertCallTrackingNumberSchema = createInsertSchema(callTrackingNumbers).omit({ id: true, createdAt: true });
export const insertCallLogSchema = createInsertSchema(callLogs).omit({ id: true, calledAt: true });
export type InsertCallTrackingNumber = z.infer<typeof insertCallTrackingNumberSchema>;
export type CallTrackingNumber = typeof callTrackingNumbers.$inferSelect;
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

// ============ REVIEW MANAGEMENT ============
export const reviewResponses = pgTable("review_responses", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  platform: varchar("platform", { length: 50 }).notNull(), // google, yelp, facebook
  externalReviewId: varchar("external_review_id", { length: 200 }),
  
  reviewerName: varchar("reviewer_name", { length: 200 }),
  rating: integer("rating"), // 1-5
  reviewText: text("review_text"),
  reviewDate: timestamp("review_date"),
  
  responseText: text("response_text"),
  respondedBy: varchar("responded_by", { length: 36 }),
  respondedAt: timestamp("responded_at"),
  
  isAutoResponse: boolean("is_auto_response").default(false),
  sentiment: varchar("sentiment", { length: 20 }), // positive, neutral, negative
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_review_resp_tenant").on(table.tenantId),
  index("idx_review_resp_platform").on(table.platform),
]);

export const insertReviewResponseSchema = createInsertSchema(reviewResponses).omit({ id: true, createdAt: true });
export type InsertReviewResponse = z.infer<typeof insertReviewResponseSchema>;
export type ReviewResponse = typeof reviewResponses.$inferSelect;

// ============ NPS SURVEYS ============
export const npsSurveys = pgTable("nps_surveys", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  
  customerName: varchar("customer_name", { length: 200 }),
  customerEmail: varchar("customer_email", { length: 200 }),
  
  score: integer("score"), // 0-10
  feedback: text("feedback"),
  
  category: varchar("category", { length: 30 }), // promoter (9-10), passive (7-8), detractor (0-6)
  
  sentAt: timestamp("sent_at"),
  completedAt: timestamp("completed_at"),
  
  followUpSent: boolean("follow_up_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_nps_tenant").on(table.tenantId),
  index("idx_nps_score").on(table.score),
]);

export const insertNpsSurveySchema = createInsertSchema(npsSurveys).omit({ id: true, createdAt: true });
export type InsertNpsSurvey = z.infer<typeof insertNpsSurveySchema>;
export type NpsSurvey = typeof npsSurveys.$inferSelect;

// ============ CREW GAMIFICATION ============
export const crewLeaderboards = pgTable("crew_leaderboards", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  crewMemberId: varchar("crew_member_id", { length: 36 }).notNull(),
  
  period: varchar("period", { length: 20 }).notNull(), // weekly, monthly, quarterly, yearly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  jobsCompleted: integer("jobs_completed").default(0),
  totalRevenue: integer("total_revenue").default(0), // cents
  avgRating: real("avg_rating"),
  onTimePercentage: real("on_time_percentage"),
  
  pointsEarned: integer("points_earned").default(0),
  rank: integer("rank"),
  
  bonusEarned: integer("bonus_earned").default(0), // cents
  achievementsBadges: text("achievements_badges"), // JSON array
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_leaderboard_tenant").on(table.tenantId),
  index("idx_leaderboard_period").on(table.period),
]);

export const crewAchievements = pgTable("crew_achievements", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  crewMemberId: varchar("crew_member_id", { length: 36 }).notNull(),
  
  achievementType: varchar("achievement_type", { length: 50 }).notNull(), // first_job, 10_jobs, perfect_rating
  achievementName: varchar("achievement_name", { length: 200 }).notNull(),
  description: text("description"),
  
  pointsAwarded: integer("points_awarded").default(0),
  badgeIcon: varchar("badge_icon", { length: 100 }),
  
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
}, (table) => [
  index("idx_achievement_member").on(table.crewMemberId),
]);

export const insertCrewLeaderboardSchema = createInsertSchema(crewLeaderboards).omit({ id: true, createdAt: true });
export const insertCrewAchievementSchema = createInsertSchema(crewAchievements).omit({ id: true, earnedAt: true });
export type InsertCrewLeaderboard = z.infer<typeof insertCrewLeaderboardSchema>;
export type CrewLeaderboard = typeof crewLeaderboards.$inferSelect;
export type InsertCrewAchievement = z.infer<typeof insertCrewAchievementSchema>;
export type CrewAchievement = typeof crewAchievements.$inferSelect;

// ============ GEOFENCE CLOCK-IN ============
export const jobGeofences = pgTable("job_geofences", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radiusMeters: integer("radius_meters").default(100),
  
  address: text("address"),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_geofence_job").on(table.jobId),
]);

export const geofenceEvents = pgTable("geofence_events", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  geofenceId: varchar("geofence_id", { length: 36 }).references(() => jobGeofences.id),
  crewMemberId: varchar("crew_member_id", { length: 36 }).notNull(),
  
  eventType: varchar("event_type", { length: 20 }).notNull(), // enter, exit
  
  latitude: real("latitude"),
  longitude: real("longitude"),
  accuracy: real("accuracy"),
  
  autoClockAction: varchar("auto_clock_action", { length: 20 }), // clock_in, clock_out
  timeEntryId: varchar("time_entry_id", { length: 36 }),
  
  triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
}, (table) => [
  index("idx_geofence_event_member").on(table.crewMemberId),
]);

export const insertJobGeofenceSchema = createInsertSchema(jobGeofences).omit({ id: true, createdAt: true });
export const insertGeofenceEventSchema = createInsertSchema(geofenceEvents).omit({ id: true, triggeredAt: true });
export type InsertJobGeofence = z.infer<typeof insertJobGeofenceSchema>;
export type JobGeofence = typeof jobGeofences.$inferSelect;
export type InsertGeofenceEvent = z.infer<typeof insertGeofenceEventSchema>;
export type GeofenceEvent = typeof geofenceEvents.$inferSelect;

// ============ PREDICTIVE ANALYTICS ============
export const revenuePredictions = pgTable("revenue_predictions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  predictionPeriod: varchar("prediction_period", { length: 20 }).notNull(), // monthly, quarterly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  predictedRevenue: integer("predicted_revenue").notNull(), // cents
  predictedJobs: integer("predicted_jobs"),
  predictedLeads: integer("predicted_leads"),
  
  confidenceLevel: real("confidence_level"), // 0-1
  factors: text("factors"), // JSON: seasonality, historical trends, pipeline
  
  actualRevenue: integer("actual_revenue"), // updated after period ends
  accuracy: real("accuracy"), // percentage
  
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_prediction_tenant").on(table.tenantId),
  index("idx_prediction_period").on(table.periodStart),
]);

export const insertRevenuePredictionSchema = createInsertSchema(revenuePredictions).omit({ id: true, generatedAt: true });
export type InsertRevenuePrediction = z.infer<typeof insertRevenuePredictionSchema>;
export type RevenuePrediction = typeof revenuePredictions.$inferSelect;

// ============ MARKETING ATTRIBUTION ============
export const marketingChannels = pgTable("marketing_channels", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  channelName: varchar("channel_name", { length: 100 }).notNull(),
  channelType: varchar("channel_type", { length: 50 }).notNull(), // paid, organic, referral, direct
  
  monthlyBudget: integer("monthly_budget").default(0), // cents
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_channel_tenant").on(table.tenantId),
]);

export const marketingAttribution = pgTable("marketing_attribution", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  channelId: varchar("channel_id", { length: 36 }).references(() => marketingChannels.id),
  
  period: varchar("period", { length: 20 }).notNull(), // monthly
  periodStart: timestamp("period_start").notNull(),
  
  leadsGenerated: integer("leads_generated").default(0),
  estimatesScheduled: integer("estimates_scheduled").default(0),
  jobsWon: integer("jobs_won").default(0),
  revenueGenerated: integer("revenue_generated").default(0), // cents
  
  spend: integer("spend").default(0), // cents
  costPerLead: integer("cost_per_lead"),
  costPerJob: integer("cost_per_job"),
  roi: real("roi"), // percentage
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_attribution_channel").on(table.channelId),
  index("idx_attribution_period").on(table.periodStart),
]);

export const insertMarketingChannelSchema = createInsertSchema(marketingChannels).omit({ id: true, createdAt: true });
export const insertMarketingAttributionSchema = createInsertSchema(marketingAttribution).omit({ id: true, createdAt: true });
export type InsertMarketingChannel = z.infer<typeof insertMarketingChannelSchema>;
export type MarketingChannel = typeof marketingChannels.$inferSelect;
export type InsertMarketingAttribution = z.infer<typeof insertMarketingAttributionSchema>;
export type MarketingAttribution = typeof marketingAttribution.$inferSelect;

// ============ QUICKBOOKS EXPORT ============
export const accountingExports = pgTable("accounting_exports", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  exportType: varchar("export_type", { length: 50 }).notNull(), // invoices, payments, expenses
  exportFormat: varchar("export_format", { length: 20 }).notNull(), // csv, json, qbo
  
  dateRangeStart: timestamp("date_range_start"),
  dateRangeEnd: timestamp("date_range_end"),
  
  recordCount: integer("record_count").default(0),
  fileUrl: text("file_url"),
  fileName: varchar("file_name", { length: 200 }),
  
  status: varchar("status", { length: 30 }).default("pending"), // pending, processing, completed, failed
  exportedBy: varchar("exported_by", { length: 36 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_accounting_export_tenant").on(table.tenantId),
]);

export const insertAccountingExportSchema = createInsertSchema(accountingExports).omit({ id: true, createdAt: true });
export type InsertAccountingExport = z.infer<typeof insertAccountingExportSchema>;
export type AccountingExport = typeof accountingExports.$inferSelect;

// ============ KILLER FEATURES - COMPETITION DESTROYERS ============

// AI-Generated Proposals
export const aiProposals = pgTable("ai_proposals", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  estimateId: varchar("estimate_id", { length: 36 }),
  customerName: varchar("customer_name", { length: 200 }).notNull(),
  projectScope: text("project_scope"),
  generatedContent: text("generated_content"),
  executiveSummary: text("executive_summary"),
  scopeOfWork: text("scope_of_work"),
  timeline: text("timeline"),
  investmentBreakdown: text("investment_breakdown"),
  termsConditions: text("terms_conditions"),
  aiModel: varchar("ai_model", { length: 50 }).default("gpt-4o"),
  tokensUsed: integer("tokens_used"),
  status: varchar("status", { length: 30 }).default("draft"),
  sentAt: timestamp("sent_at"),
  viewedAt: timestamp("viewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_ai_proposals_tenant").on(table.tenantId)]);

export const insertAiProposalSchema = createInsertSchema(aiProposals).omit({ id: true, createdAt: true });
export type InsertAiProposal = z.infer<typeof insertAiProposalSchema>;
export type AiProposal = typeof aiProposals.$inferSelect;

// Smart Lead Scoring
export const leadScores = pgTable("lead_scores", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  leadId: varchar("lead_id", { length: 36 }).notNull(),
  score: integer("score").default(0),
  signals: text("signals"),
  budgetIndicator: integer("budget_indicator"),
  urgencyIndicator: integer("urgency_indicator"),
  fitIndicator: integer("fit_indicator"),
  engagementScore: integer("engagement_score"),
  responseTimeMinutes: integer("response_time_minutes"),
  previousCustomer: boolean("previous_customer").default(false),
  referralSource: varchar("referral_source", { length: 100 }),
  propertyValue: integer("property_value"),
  aiPrediction: real("ai_prediction"),
  lastCalculated: timestamp("last_calculated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_lead_scores_tenant").on(table.tenantId)]);

export const insertLeadScoreSchema = createInsertSchema(leadScores).omit({ id: true, createdAt: true });
export type InsertLeadScore = z.infer<typeof insertLeadScoreSchema>;
export type LeadScore = typeof leadScores.$inferSelect;

// Voice-to-Estimate
export const voiceEstimates = pgTable("voice_estimates", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  audioUrl: text("audio_url"),
  transcription: text("transcription"),
  parsedDimensions: text("parsed_dimensions"),
  extractedServices: text("extracted_services"),
  estimatedTotal: integer("estimated_total"),
  confidence: real("confidence"),
  processingStatus: varchar("processing_status", { length: 30 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_voice_estimates_tenant").on(table.tenantId)]);

export const insertVoiceEstimateSchema = createInsertSchema(voiceEstimates).omit({ id: true, createdAt: true });
export type InsertVoiceEstimate = z.infer<typeof insertVoiceEstimateSchema>;
export type VoiceEstimate = typeof voiceEstimates.$inferSelect;

// Follow-up Optimization
export const followupOptimizations = pgTable("followup_optimizations", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  leadId: varchar("lead_id", { length: 36 }).notNull(),
  recommendedChannel: varchar("recommended_channel", { length: 30 }),
  recommendedTime: timestamp("recommended_time"),
  recommendedDay: varchar("recommended_day", { length: 20 }),
  reasoningNotes: text("reasoning_notes"),
  historicalResponseRate: real("historical_response_rate"),
  aiConfidence: real("ai_confidence"),
  wasActioned: boolean("was_actioned").default(false),
  resultedInResponse: boolean("resulted_in_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_followup_opt_tenant").on(table.tenantId)]);

export const insertFollowupOptimizationSchema = createInsertSchema(followupOptimizations).omit({ id: true, createdAt: true });
export type InsertFollowupOptimization = z.infer<typeof insertFollowupOptimizationSchema>;
export type FollowupOptimization = typeof followupOptimizations.$inferSelect;

// Customer Portal Access
export const customerPortals = pgTable("customer_portals", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  customerId: varchar("customer_id", { length: 36 }),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  customerName: varchar("customer_name", { length: 200 }),
  accessToken: varchar("access_token", { length: 100 }).notNull(),
  tokenExpiry: timestamp("token_expiry"),
  jobIds: text("job_ids"),
  canViewProgress: boolean("can_view_progress").default(true),
  canViewPhotos: boolean("can_view_photos").default(true),
  canApproveChanges: boolean("can_approve_changes").default(true),
  canMakePayments: boolean("can_make_payments").default(true),
  lastAccessed: timestamp("last_accessed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_customer_portals_tenant").on(table.tenantId)]);

export const insertCustomerPortalSchema = createInsertSchema(customerPortals).omit({ id: true, createdAt: true });
export type InsertCustomerPortal = z.infer<typeof insertCustomerPortalSchema>;
export type CustomerPortal = typeof customerPortals.$inferSelect;

// Real-Time Crew GPS
export const crewLocations = pgTable("crew_locations", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  crewMemberId: varchar("crew_member_id", { length: 36 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy"),
  heading: real("heading"),
  speed: real("speed"),
  batteryLevel: integer("battery_level"),
  isMoving: boolean("is_moving").default(false),
  etaMinutes: integer("eta_minutes"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
}, (table) => [index("idx_crew_locations_member").on(table.crewMemberId)]);

export const insertCrewLocationSchema = createInsertSchema(crewLocations).omit({ id: true });
export type InsertCrewLocation = z.infer<typeof insertCrewLocationSchema>;
export type CrewLocation = typeof crewLocations.$inferSelect;

// Digital Tip Jar
export const crewTips = pgTable("crew_tips", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  crewMemberId: varchar("crew_member_id", { length: 36 }),
  customerId: varchar("customer_id", { length: 36 }),
  customerName: varchar("customer_name", { length: 200 }),
  amount: integer("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }),
  stripePaymentId: varchar("stripe_payment_id", { length: 100 }),
  message: text("message"),
  rating: integer("rating"),
  status: varchar("status", { length: 30 }).default("pending"),
  paidOutAt: timestamp("paid_out_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_crew_tips_tenant").on(table.tenantId)]);

export const insertCrewTipSchema = createInsertSchema(crewTips).omit({ id: true, createdAt: true });
export type InsertCrewTip = z.infer<typeof insertCrewTipSchema>;
export type CrewTip = typeof crewTips.$inferSelect;

// Before/After Gallery
export const portfolioGalleries = pgTable("portfolio_galleries", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  beforePhotoUrl: text("before_photo_url"),
  afterPhotoUrl: text("after_photo_url"),
  serviceType: varchar("service_type", { length: 50 }),
  roomType: varchar("room_type", { length: 50 }),
  colorUsed: varchar("color_used", { length: 100 }),
  colorBrand: varchar("color_brand", { length: 100 }),
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  customerApproved: boolean("customer_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_portfolio_galleries_tenant").on(table.tenantId)]);

export const insertPortfolioGallerySchema = createInsertSchema(portfolioGalleries).omit({ id: true, createdAt: true });
export type InsertPortfolioGallery = z.infer<typeof insertPortfolioGallerySchema>;
export type PortfolioGallery = typeof portfolioGalleries.$inferSelect;

// Profit Margin Optimizer
export const profitAnalyses = pgTable("profit_analyses", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobType: varchar("job_type", { length: 100 }).notNull(),
  averageRevenue: integer("average_revenue"),
  averageCost: integer("average_cost"),
  averageMargin: real("average_margin"),
  recommendedAdjustment: real("recommended_adjustment"),
  marketComparison: varchar("market_comparison", { length: 30 }),
  aiRecommendation: text("ai_recommendation"),
  dataPoints: integer("data_points"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_profit_analyses_tenant").on(table.tenantId)]);

export const insertProfitAnalysisSchema = createInsertSchema(profitAnalyses).omit({ id: true, createdAt: true });
export type InsertProfitAnalysis = z.infer<typeof insertProfitAnalysisSchema>;
export type ProfitAnalysis = typeof profitAnalyses.$inferSelect;

// Seasonal Demand Forecasting
export const demandForecasts = pgTable("demand_forecasts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  forecastMonth: varchar("forecast_month", { length: 10 }).notNull(),
  predictedLeads: integer("predicted_leads"),
  predictedJobs: integer("predicted_jobs"),
  predictedRevenue: integer("predicted_revenue"),
  demandLevel: varchar("demand_level", { length: 20 }),
  seasonalFactor: real("seasonal_factor"),
  weatherImpact: real("weather_impact"),
  historicalComparison: real("historical_comparison"),
  recommendedCrewSize: integer("recommended_crew_size"),
  recommendedMarketingSpend: integer("recommended_marketing_spend"),
  confidence: real("confidence"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_demand_forecasts_tenant").on(table.tenantId)]);

export const insertDemandForecastSchema = createInsertSchema(demandForecasts).omit({ id: true, createdAt: true });
export type InsertDemandForecast = z.infer<typeof insertDemandForecastSchema>;
export type DemandForecast = typeof demandForecasts.$inferSelect;

// Customer Lifetime Value
export const customerLifetimeValues = pgTable("customer_lifetime_values", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  customerId: varchar("customer_id", { length: 36 }),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  totalRevenue: integer("total_revenue").default(0),
  totalJobs: integer("total_jobs").default(0),
  firstJobDate: timestamp("first_job_date"),
  lastJobDate: timestamp("last_job_date"),
  averageJobValue: integer("average_job_value"),
  referralsGenerated: integer("referrals_generated").default(0),
  referralValue: integer("referral_value").default(0),
  predictedFutureValue: integer("predicted_future_value"),
  churnRisk: real("churn_risk"),
  segment: varchar("segment", { length: 30 }),
  nextPredictedPurchase: timestamp("next_predicted_purchase"),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
}, (table) => [index("idx_clv_tenant").on(table.tenantId)]);

export const insertCustomerLifetimeValueSchema = createInsertSchema(customerLifetimeValues).omit({ id: true, calculatedAt: true });
export type InsertCustomerLifetimeValue = z.infer<typeof insertCustomerLifetimeValueSchema>;
export type CustomerLifetimeValue = typeof customerLifetimeValues.$inferSelect;

// Competitor Intelligence
export const competitorData = pgTable("competitor_data", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  competitorName: varchar("competitor_name", { length: 200 }).notNull(),
  serviceArea: varchar("service_area", { length: 100 }),
  avgPricePerSqft: real("avg_price_per_sqft"),
  avgInteriorRoom: integer("avg_interior_room"),
  avgExteriorJob: integer("avg_exterior_job"),
  reviewScore: real("review_score"),
  reviewCount: integer("review_count"),
  responseTime: varchar("response_time", { length: 50 }),
  uniqueSellingPoints: text("unique_selling_points"),
  weaknesses: text("weaknesses"),
  marketShare: real("market_share"),
  dataSource: varchar("data_source", { length: 100 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
}, (table) => [index("idx_competitor_tenant").on(table.tenantId)]);

export const insertCompetitorDataSchema = createInsertSchema(competitorData).omit({ id: true, lastUpdated: true });
export type InsertCompetitorData = z.infer<typeof insertCompetitorDataSchema>;
export type CompetitorData = typeof competitorData.$inferSelect;

// Smart Contracts (Blockchain Proposals)
export const smartContracts = pgTable("smart_contracts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  proposalId: varchar("proposal_id", { length: 36 }),
  estimateId: varchar("estimate_id", { length: 36 }),
  contractHash: varchar("contract_hash", { length: 100 }),
  blockchainTxId: varchar("blockchain_tx_id", { length: 100 }),
  customerSignature: text("customer_signature"),
  customerSignedAt: timestamp("customer_signed_at"),
  contractorSignature: text("contractor_signature"),
  contractorSignedAt: timestamp("contractor_signed_at"),
  terms: text("terms"),
  paymentSchedule: text("payment_schedule"),
  changeOrdersAllowed: boolean("change_orders_allowed").default(true),
  disputeResolution: text("dispute_resolution"),
  status: varchar("status", { length: 30 }).default("pending"),
  verifiedOnChain: boolean("verified_on_chain").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_smart_contracts_tenant").on(table.tenantId)]);

export const insertSmartContractSchema = createInsertSchema(smartContracts).omit({ id: true, createdAt: true });
export type InsertSmartContract = z.infer<typeof insertSmartContractSchema>;
export type SmartContract = typeof smartContracts.$inferSelect;

// AR Color Preview
export const arColorPreviews = pgTable("ar_color_previews", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  sessionId: varchar("session_id", { length: 36 }),
  customerEmail: varchar("customer_email", { length: 200 }),
  roomPhotoUrl: text("room_photo_url"),
  selectedColors: text("selected_colors"),
  previewImageUrl: text("preview_image_url"),
  savedToFavorites: boolean("saved_to_favorites").default(false),
  sharedViaEmail: boolean("shared_via_email").default(false),
  convertedToLead: boolean("converted_to_lead").default(false),
  leadId: varchar("lead_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_ar_previews_tenant").on(table.tenantId)]);

export const insertArColorPreviewSchema = createInsertSchema(arColorPreviews).omit({ id: true, createdAt: true });
export type InsertArColorPreview = z.infer<typeof insertArColorPreviewSchema>;
export type ArColorPreview = typeof arColorPreviews.$inferSelect;

// Crew Skills & Certifications
export const crewSkills = pgTable("crew_skills", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  crewMemberId: varchar("crew_member_id", { length: 36 }).notNull(),
  skillName: varchar("skill_name", { length: 100 }).notNull(),
  skillCategory: varchar("skill_category", { length: 50 }),
  proficiencyLevel: integer("proficiency_level"),
  certificationName: varchar("certification_name", { length: 200 }),
  certificationDate: timestamp("certification_date"),
  expiryDate: timestamp("expiry_date"),
  verifiedBy: varchar("verified_by", { length: 100 }),
  documentUrl: text("document_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_crew_skills_member").on(table.crewMemberId)]);

export const insertCrewSkillSchema = createInsertSchema(crewSkills).omit({ id: true, createdAt: true });
export type InsertCrewSkill = z.infer<typeof insertCrewSkillSchema>;
export type CrewSkill = typeof crewSkills.$inferSelect;

// Crew-Job Skill Matching
export const skillMatchings = pgTable("skill_matchings", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  requiredSkills: text("required_skills"),
  recommendedCrewIds: text("recommended_crew_ids"),
  matchScores: text("match_scores"),
  assignedCrewId: varchar("assigned_crew_id", { length: 36 }),
  autoAssigned: boolean("auto_assigned").default(false),
  overrideReason: text("override_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_skill_matchings_job").on(table.jobId)]);

export const insertSkillMatchingSchema = createInsertSchema(skillMatchings).omit({ id: true, createdAt: true });
export type InsertSkillMatching = z.infer<typeof insertSkillMatchingSchema>;
export type SkillMatching = typeof skillMatchings.$inferSelect;

// ============ PHASE 2: BREAKTHROUGH MODULES ============

// AI Field Operations Autopilot - Dynamic Routing
export const routeOptimizations = pgTable("route_optimizations", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  routeDate: timestamp("route_date").notNull(),
  crewId: varchar("crew_id", { length: 36 }),
  optimizedRoute: text("optimized_route"),
  totalMiles: real("total_miles"),
  totalMinutes: integer("total_minutes"),
  fuelSavings: integer("fuel_savings"),
  jobSequence: text("job_sequence"),
  weatherAdjustments: text("weather_adjustments"),
  constraints: text("constraints"),
  optimizationScore: real("optimization_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_route_opt_tenant").on(table.tenantId)]);

export const insertRouteOptimizationSchema = createInsertSchema(routeOptimizations).omit({ id: true, createdAt: true });
export type InsertRouteOptimization = z.infer<typeof insertRouteOptimizationSchema>;
export type RouteOptimization = typeof routeOptimizations.$inferSelect;

// Job Risk Scoring
export const jobRiskScores = pgTable("job_risk_scores", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  overallRisk: integer("overall_risk"),
  weatherRisk: integer("weather_risk"),
  scopeCreepRisk: integer("scope_creep_risk"),
  paymentRisk: integer("payment_risk"),
  scheduleRisk: integer("schedule_risk"),
  safetyRisk: integer("safety_risk"),
  mitigationPlan: text("mitigation_plan"),
  riskFactors: text("risk_factors"),
  aiRecommendations: text("ai_recommendations"),
  lastAssessed: timestamp("last_assessed").defaultNow().notNull(),
}, (table) => [index("idx_job_risk_tenant").on(table.tenantId)]);

export const insertJobRiskScoreSchema = createInsertSchema(jobRiskScores).omit({ id: true, lastAssessed: true });
export type InsertJobRiskScore = z.infer<typeof insertJobRiskScoreSchema>;
export type JobRiskScore = typeof jobRiskScores.$inferSelect;

// Materials Just-In-Time
export const materialsOrders = pgTable("materials_orders", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  vendorId: varchar("vendor_id", { length: 36 }),
  vendorName: varchar("vendor_name", { length: 200 }),
  items: text("items"),
  totalCost: integer("total_cost"),
  deliveryDate: timestamp("delivery_date"),
  deliveryWindow: varchar("delivery_window", { length: 50 }),
  status: varchar("status", { length: 30 }).default("pending"),
  autoOrdered: boolean("auto_ordered").default(false),
  poNumber: varchar("po_number", { length: 50 }),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_materials_orders_tenant").on(table.tenantId)]);

export const insertMaterialsOrderSchema = createInsertSchema(materialsOrders).omit({ id: true, createdAt: true });
export type InsertMaterialsOrder = z.infer<typeof insertMaterialsOrderSchema>;
export type MaterialsOrder = typeof materialsOrders.$inferSelect;

// Predictive Revenue Intelligence
export const cashflowForecasts = pgTable("cashflow_forecasts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  forecastPeriod: varchar("forecast_period", { length: 20 }).notNull(),
  predictedRevenue: integer("predicted_revenue"),
  predictedExpenses: integer("predicted_expenses"),
  predictedCashflow: integer("predicted_cashflow"),
  confidence: real("confidence"),
  pipelineValue: integer("pipeline_value"),
  arOutstanding: integer("ar_outstanding"),
  apOutstanding: integer("ap_outstanding"),
  recommendations: text("recommendations"),
  modelVersion: varchar("model_version", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_cashflow_tenant").on(table.tenantId)]);

export const insertCashflowForecastSchema = createInsertSchema(cashflowForecasts).omit({ id: true, createdAt: true });
export type InsertCashflowForecast = z.infer<typeof insertCashflowForecastSchema>;
export type CashflowForecast = typeof cashflowForecasts.$inferSelect;

// Pricing Elasticity Analysis
export const pricingAnalyses = pgTable("pricing_analyses", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  currentPrice: integer("current_price"),
  optimalPrice: integer("optimal_price"),
  elasticity: real("elasticity"),
  expectedDemandChange: real("expected_demand_change"),
  expectedRevenueChange: integer("expected_revenue_change"),
  competitorPricing: text("competitor_pricing"),
  marketPosition: varchar("market_position", { length: 30 }),
  recommendation: text("recommendation"),
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
}, (table) => [index("idx_pricing_tenant").on(table.tenantId)]);

export const insertPricingAnalysisSchema = createInsertSchema(pricingAnalyses).omit({ id: true, analyzedAt: true });
export type InsertPricingAnalysis = z.infer<typeof insertPricingAnalysisSchema>;
export type PricingAnalysis = typeof pricingAnalyses.$inferSelect;

// Marketing Mix Optimization
export const marketingOptimizations = pgTable("marketing_optimizations", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  totalBudget: integer("total_budget"),
  channelAllocations: text("channel_allocations"),
  expectedRoi: real("expected_roi"),
  historicalPerformance: text("historical_performance"),
  recommendations: text("recommendations"),
  optimizedAllocations: text("optimized_allocations"),
  projectedLeads: integer("projected_leads"),
  projectedCostPerLead: integer("projected_cost_per_lead"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_marketing_opt_tenant").on(table.tenantId)]);

export const insertMarketingOptimizationSchema = createInsertSchema(marketingOptimizations).omit({ id: true, createdAt: true });
export type InsertMarketingOptimization = z.infer<typeof insertMarketingOptimizationSchema>;
export type MarketingOptimization = typeof marketingOptimizations.$inferSelect;

// Immersive Site Capture - Digital Twins
export const siteScans = pgTable("site_scans", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  propertyAddress: text("property_address"),
  scanType: varchar("scan_type", { length: 30 }),
  pointCloudUrl: text("point_cloud_url"),
  meshModelUrl: text("mesh_model_url"),
  thumbnailUrl: text("thumbnail_url"),
  totalSqft: real("total_sqft"),
  roomCount: integer("room_count"),
  measurements: text("measurements"),
  scanDuration: integer("scan_duration"),
  processingStatus: varchar("processing_status", { length: 30 }).default("pending"),
  accuracy: real("accuracy"),
  deviceInfo: varchar("device_info", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_site_scans_tenant").on(table.tenantId)]);

export const insertSiteScanSchema = createInsertSchema(siteScans).omit({ id: true, createdAt: true });
export type InsertSiteScan = z.infer<typeof insertSiteScanSchema>;
export type SiteScan = typeof siteScans.$inferSelect;

// AR Overlays for Sites
export const arOverlays = pgTable("ar_overlays", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  scanId: varchar("scan_id", { length: 36 }),
  overlayType: varchar("overlay_type", { length: 50 }),
  colorSelections: text("color_selections"),
  annotations: text("annotations"),
  previewImageUrl: text("preview_image_url"),
  sharedWithCustomer: boolean("shared_with_customer").default(false),
  customerApproved: boolean("customer_approved").default(false),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_ar_overlays_tenant").on(table.tenantId)]);

export const insertArOverlaySchema = createInsertSchema(arOverlays).omit({ id: true, createdAt: true });
export type InsertArOverlay = z.infer<typeof insertArOverlaySchema>;
export type ArOverlay = typeof arOverlays.$inferSelect;

// Autonomous Back Office - Auto Invoices
export const autoInvoices = pgTable("auto_invoices", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  customerId: varchar("customer_id", { length: 36 }),
  customerEmail: varchar("customer_email", { length: 200 }),
  invoiceNumber: varchar("invoice_number", { length: 50 }),
  lineItems: text("line_items"),
  subtotal: integer("subtotal"),
  taxAmount: integer("tax_amount"),
  totalAmount: integer("total_amount"),
  dueDate: timestamp("due_date"),
  status: varchar("status", { length: 30 }).default("draft"),
  autoGenerated: boolean("auto_generated").default(true),
  sentAt: timestamp("sent_at"),
  paidAt: timestamp("paid_at"),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 100 }),
  quickbooksId: varchar("quickbooks_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_auto_invoices_tenant").on(table.tenantId)]);

export const insertAutoInvoiceSchema = createInsertSchema(autoInvoices).omit({ id: true, createdAt: true });
export type InsertAutoInvoice = z.infer<typeof insertAutoInvoiceSchema>;
export type AutoInvoice = typeof autoInvoices.$inferSelect;

// Lien Waivers
export const lienWaivers = pgTable("lien_waivers", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  waiverType: varchar("waiver_type", { length: 50 }),
  amount: integer("amount"),
  throughDate: timestamp("through_date"),
  signerName: varchar("signer_name", { length: 200 }),
  signerTitle: varchar("signer_title", { length: 100 }),
  signature: text("signature"),
  signedAt: timestamp("signed_at"),
  documentUrl: text("document_url"),
  blockchainTxId: varchar("blockchain_tx_id", { length: 100 }),
  status: varchar("status", { length: 30 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_lien_waivers_tenant").on(table.tenantId)]);

export const insertLienWaiverSchema = createInsertSchema(lienWaivers).omit({ id: true, createdAt: true });
export type InsertLienWaiver = z.infer<typeof insertLienWaiverSchema>;
export type LienWaiver = typeof lienWaivers.$inferSelect;

// Compliance Deadlines
export const complianceDeadlines = pgTable("compliance_deadlines", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  complianceType: varchar("compliance_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  reminderDays: integer("reminder_days").default(7),
  status: varchar("status", { length: 30 }).default("pending"),
  completedAt: timestamp("completed_at"),
  documentUrl: text("document_url"),
  assignedTo: varchar("assigned_to", { length: 100 }),
  priority: varchar("priority", { length: 20 }).default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_compliance_tenant").on(table.tenantId)]);

export const insertComplianceDeadlineSchema = createInsertSchema(complianceDeadlines).omit({ id: true, createdAt: true });
export type InsertComplianceDeadline = z.infer<typeof insertComplianceDeadlineSchema>;
export type ComplianceDeadline = typeof complianceDeadlines.$inferSelect;

// AP/AR Reconciliation
export const reconciliationRecords = pgTable("reconciliation_records", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  recordType: varchar("record_type", { length: 20 }).notNull(),
  invoiceId: varchar("invoice_id", { length: 36 }),
  vendorId: varchar("vendor_id", { length: 36 }),
  amount: integer("amount").notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  status: varchar("status", { length: 30 }).default("pending"),
  matchedPaymentId: varchar("matched_payment_id", { length: 100 }),
  discrepancy: integer("discrepancy"),
  notes: text("notes"),
  autoReconciled: boolean("auto_reconciled").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_reconciliation_tenant").on(table.tenantId)]);

export const insertReconciliationRecordSchema = createInsertSchema(reconciliationRecords).omit({ id: true, createdAt: true });
export type InsertReconciliationRecord = z.infer<typeof insertReconciliationRecordSchema>;
export type ReconciliationRecord = typeof reconciliationRecords.$inferSelect;

// Orbit Workforce Network - Subcontractors
export const subcontractorProfiles = pgTable("subcontractor_profiles", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  contactName: varchar("contact_name", { length: 200 }),
  email: varchar("email", { length: 200 }),
  phone: varchar("phone", { length: 30 }),
  services: text("services"),
  serviceArea: text("service_area"),
  hourlyRate: integer("hourly_rate"),
  insuranceVerified: boolean("insurance_verified").default(false),
  licenseVerified: boolean("license_verified").default(false),
  backgroundCheckDate: timestamp("background_check_date"),
  overallRating: real("overall_rating"),
  totalJobs: integer("total_jobs").default(0),
  onTimeRate: real("on_time_rate"),
  qualityScore: real("quality_score"),
  vetted: boolean("vetted").default(false),
  vettedAt: timestamp("vetted_at"),
  credentialLedgerHash: varchar("credential_ledger_hash", { length: 100 }),
  status: varchar("status", { length: 30 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_subcontractor_profiles_tenant").on(table.tenantId)]);

export const insertSubcontractorProfileSchema = createInsertSchema(subcontractorProfiles).omit({ id: true, createdAt: true });
export type InsertSubcontractorProfile = z.infer<typeof insertSubcontractorProfileSchema>;
export type SubcontractorProfile = typeof subcontractorProfiles.$inferSelect;

// Shift Bidding
export const shiftBids = pgTable("shift_bids", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  shiftDate: timestamp("shift_date").notNull(),
  shiftStart: varchar("shift_start", { length: 10 }),
  shiftEnd: varchar("shift_end", { length: 10 }),
  requiredSkills: text("required_skills"),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  biddingEnds: timestamp("bidding_ends"),
  selectedBidderId: varchar("selected_bidder_id", { length: 36 }),
  selectedBidAmount: integer("selected_bid_amount"),
  status: varchar("status", { length: 30 }).default("open"),
  totalBids: integer("total_bids").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_shift_bids_tenant").on(table.tenantId)]);

export const insertShiftBidSchema = createInsertSchema(shiftBids).omit({ id: true, createdAt: true });
export type InsertShiftBid = z.infer<typeof insertShiftBidSchema>;
export type ShiftBid = typeof shiftBids.$inferSelect;

// Bid Submissions
export const bidSubmissions = pgTable("bid_submissions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  shiftBidId: varchar("shift_bid_id", { length: 36 }).notNull(),
  subcontractorId: varchar("subcontractor_id", { length: 36 }).notNull(),
  bidAmount: integer("bid_amount").notNull(),
  notes: text("notes"),
  availability: varchar("availability", { length: 50 }),
  estimatedCompletionHours: real("estimated_completion_hours"),
  status: varchar("status", { length: 30 }).default("submitted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_bid_submissions_shift").on(table.shiftBidId)]);

export const insertBidSubmissionSchema = createInsertSchema(bidSubmissions).omit({ id: true, createdAt: true });
export type InsertBidSubmission = z.infer<typeof insertBidSubmissionSchema>;
export type BidSubmission = typeof bidSubmissions.$inferSelect;

// Trust & Growth Layer - Customer Sentiment
export const customerSentiments = pgTable("customer_sentiments", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  customerId: varchar("customer_id", { length: 36 }),
  customerEmail: varchar("customer_email", { length: 200 }),
  sourceType: varchar("source_type", { length: 30 }),
  sourceContent: text("source_content"),
  sentimentScore: real("sentiment_score"),
  sentimentLabel: varchar("sentiment_label", { length: 30 }),
  emotions: text("emotions"),
  keyTopics: text("key_topics"),
  actionRequired: boolean("action_required").default(false),
  urgency: varchar("urgency", { length: 20 }),
  aiAnalysis: text("ai_analysis"),
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
}, (table) => [index("idx_sentiment_tenant").on(table.tenantId)]);

export const insertCustomerSentimentSchema = createInsertSchema(customerSentiments).omit({ id: true, analyzedAt: true });
export type InsertCustomerSentiment = z.infer<typeof insertCustomerSentimentSchema>;
export type CustomerSentiment = typeof customerSentiments.$inferSelect;

// Milestone NFTs
export const milestoneNfts = pgTable("milestone_nfts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }).notNull(),
  milestoneType: varchar("milestone_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  metadata: text("metadata"),
  mintAddress: varchar("mint_address", { length: 100 }),
  blockchainTxId: varchar("blockchain_tx_id", { length: 100 }),
  ownerWallet: varchar("owner_wallet", { length: 100 }),
  minted: boolean("minted").default(false),
  mintedAt: timestamp("minted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_milestone_nfts_tenant").on(table.tenantId)]);

export const insertMilestoneNftSchema = createInsertSchema(milestoneNfts).omit({ id: true, createdAt: true });
export type InsertMilestoneNft = z.infer<typeof insertMilestoneNftSchema>;
export type MilestoneNft = typeof milestoneNfts.$inferSelect;

// ESG/Green Materials Tracking
export const esgTracking = pgTable("esg_tracking", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  jobId: varchar("job_id", { length: 36 }),
  materialName: varchar("material_name", { length: 200 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  ecoRating: varchar("eco_rating", { length: 20 }),
  vocLevel: varchar("voc_level", { length: 30 }),
  recyclable: boolean("recyclable").default(false),
  certifications: text("certifications"),
  carbonFootprint: real("carbon_footprint"),
  quantity: real("quantity"),
  unit: varchar("unit", { length: 20 }),
  sustainabilityScore: integer("sustainability_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_esg_tracking_tenant").on(table.tenantId)]);

export const insertEsgTrackingSchema = createInsertSchema(esgTracking).omit({ id: true, createdAt: true });
export type InsertEsgTracking = z.infer<typeof insertEsgTrackingSchema>;
export type EsgTracking = typeof esgTracking.$inferSelect;

// Embedded Financing
export const financingApplications = pgTable("financing_applications", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  customerId: varchar("customer_id", { length: 36 }),
  customerEmail: varchar("customer_email", { length: 200 }).notNull(),
  customerName: varchar("customer_name", { length: 200 }),
  estimateId: varchar("estimate_id", { length: 36 }),
  requestedAmount: integer("requested_amount").notNull(),
  approvedAmount: integer("approved_amount"),
  interestRate: real("interest_rate"),
  termMonths: integer("term_months"),
  monthlyPayment: integer("monthly_payment"),
  prequalStatus: varchar("prequal_status", { length: 30 }).default("pending"),
  applicationStatus: varchar("application_status", { length: 30 }).default("pending"),
  lenderPartner: varchar("lender_partner", { length: 100 }),
  externalApplicationId: varchar("external_application_id", { length: 100 }),
  approvedAt: timestamp("approved_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("idx_financing_apps_tenant").on(table.tenantId)]);

export const insertFinancingApplicationSchema = createInsertSchema(financingApplications).omit({ id: true, createdAt: true });
export type InsertFinancingApplication = z.infer<typeof insertFinancingApplicationSchema>;
export type FinancingApplication = typeof financingApplications.$inferSelect;

// Franchise Analytics (White-label)
export const franchiseAnalytics = pgTable("franchise_analytics", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
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
}, (table) => [index("idx_franchise_analytics_tenant").on(table.tenantId)]);

export const insertFranchiseAnalyticsSchema = createInsertSchema(franchiseAnalytics).omit({ id: true, generatedAt: true });
export type InsertFranchiseAnalytics = z.infer<typeof insertFranchiseAnalyticsSchema>;
export type FranchiseAnalytics = typeof franchiseAnalytics.$inferSelect;

// ============ DATA IMPORT SYSTEM ============
// DripJobs and other CRM data import tracking

export const dataImports = pgTable("data_imports", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  sourceSystem: varchar("source_system", { length: 50 }).notNull(),
  importType: varchar("import_type", { length: 30 }).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  totalRows: integer("total_rows").default(0),
  successCount: integer("success_count").default(0),
  errorCount: integer("error_count").default(0),
  skippedCount: integer("skipped_count").default(0),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  fieldMappings: text("field_mappings"),
  errorLog: text("error_log"),
  importedBy: varchar("imported_by", { length: 100 }),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_data_imports_tenant").on(table.tenantId),
  index("idx_data_imports_status").on(table.status),
]);

export const insertDataImportSchema = createInsertSchema(dataImports).omit({ id: true, createdAt: true });
export type InsertDataImport = z.infer<typeof insertDataImportSchema>;
export type DataImport = typeof dataImports.$inferSelect;

// Individual imported records tracking
export const importedRecords = pgTable("imported_records", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  importId: varchar("import_id", { length: 36 }).references(() => dataImports.id).notNull(),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  recordType: varchar("record_type", { length: 30 }).notNull(),
  sourceId: varchar("source_id", { length: 100 }),
  targetId: varchar("target_id", { length: 36 }),
  rawData: text("raw_data"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_imported_records_import").on(table.importId),
  index("idx_imported_records_tenant").on(table.tenantId),
  index("idx_imported_records_source").on(table.sourceId),
]);

export const insertImportedRecordSchema = createInsertSchema(importedRecords).omit({ id: true, createdAt: true });
export type InsertImportedRecord = z.infer<typeof insertImportedRecordSchema>;
export type ImportedRecord = typeof importedRecords.$inferSelect;

// ============ BLOG SYSTEM ============

// Blog Categories
export const blogCategories = pgTable("blog_categories", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }).default("#D4AF37"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_blog_categories_tenant").on(table.tenantId),
  index("idx_blog_categories_slug").on(table.slug),
]);

export const insertBlogCategorySchema = createInsertSchema(blogCategories).omit({ id: true, createdAt: true });
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogCategory = typeof blogCategories.$inferSelect;

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  
  // Content
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  
  // Organization
  categoryId: varchar("category_id", { length: 36 }).references(() => blogCategories.id),
  tags: text("tags").array(),
  
  // Author
  authorName: varchar("author_name", { length: 100 }),
  authorRole: varchar("author_role", { length: 50 }),
  authorImage: text("author_image"),
  
  // SEO
  metaTitle: varchar("meta_title", { length: 70 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  metaKeywords: text("meta_keywords"),
  ogImage: text("og_image"),
  canonicalUrl: text("canonical_url"),
  
  // Status & Visibility
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, published, scheduled, archived
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  
  // Engagement
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  shareCount: integer("share_count").default(0),
  
  // AI Assistance
  aiGenerated: boolean("ai_generated").default(false),
  aiPrompt: text("ai_prompt"),
  
  // Reading
  readingTimeMinutes: integer("reading_time_minutes").default(5),
  
  // Related
  relatedPostIds: text("related_post_ids").array(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_blog_posts_tenant").on(table.tenantId),
  index("idx_blog_posts_slug").on(table.slug),
  index("idx_blog_posts_status").on(table.status),
  index("idx_blog_posts_category").on(table.categoryId),
  index("idx_blog_posts_published").on(table.publishedAt),
]);

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true, viewCount: true, likeCount: true, shareCount: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// ============================================================================
// TRADEWORKS AI - Multi-Trade Field Toolkit
// ============================================================================

// TradeWorks User Profiles - extends base users with trade-specific settings
export const tradeworksProfiles = pgTable("tradeworks_profiles", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  tenantId: text("tenant_id").default("tradeworks"),
  
  // Business info
  companyName: text("company_name"),
  phone: text("phone"),
  zipcode: varchar("zipcode", { length: 10 }),
  serviceRadius: integer("service_radius").default(25), // miles
  
  // Trade preferences
  primaryTrade: text("primary_trade").default("painting"), // painting, electrical, plumbing, hvac, roofing, carpentry, concrete, landscaping
  secondaryTrades: text("secondary_trades").array(),
  
  // Default rates
  defaultHourlyRate: decimal("default_hourly_rate", { precision: 10, scale: 2 }).default("45.00"),
  defaultMarkupPercent: integer("default_markup_percent").default(30),
  defaultHelperRate: decimal("default_helper_rate", { precision: 10, scale: 2 }).default("25.00"),
  
  // Preferences
  preferredUnits: text("preferred_units").default("imperial"), // imperial, metric
  preferredCurrency: varchar("preferred_currency", { length: 3 }).default("USD"),
  preferredVoiceId: text("preferred_voice_id"), // ElevenLabs voice ID
  voiceEnabled: boolean("voice_enabled").default(true),
  
  // Stats
  totalCalculations: integer("total_calculations").default(0),
  totalJobs: integer("total_jobs").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_profiles_user").on(table.userId),
  index("idx_tradeworks_profiles_tenant").on(table.tenantId),
  index("idx_tradeworks_profiles_zipcode").on(table.zipcode),
]);

export const insertTradeworksProfileSchema = createInsertSchema(tradeworksProfiles).omit({ id: true, createdAt: true, updatedAt: true, totalCalculations: true, totalJobs: true });
export type InsertTradeworksProfile = z.infer<typeof insertTradeworksProfileSchema>;
export type TradeworksProfile = typeof tradeworksProfiles.$inferSelect;

// TradeWorks Jobs - Project tracking
export const tradeworksJobs = pgTable("tradeworks_jobs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id", { length: 36 }).references(() => tradeworksProfiles.id).notNull(),
  tenantId: text("tenant_id").default("tradeworks"),
  
  // Job details
  jobName: text("job_name").notNull(),
  jobAddress: text("job_address"),
  clientName: text("client_name"),
  clientPhone: text("client_phone"),
  clientEmail: text("client_email"),
  
  // Classification
  trade: text("trade").notNull(), // painting, electrical, etc.
  jobType: text("job_type"), // residential, commercial, industrial
  
  // Status
  status: text("status").default("active"), // active, completed, on-hold, cancelled
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  actualValue: decimal("actual_value", { precision: 10, scale: 2 }),
  
  // Dates
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_jobs_profile").on(table.profileId),
  index("idx_tradeworks_jobs_tenant").on(table.tenantId),
  index("idx_tradeworks_jobs_status").on(table.status),
  index("idx_tradeworks_jobs_trade").on(table.trade),
]);

export const insertTradeworksJobSchema = createInsertSchema(tradeworksJobs).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTradeworksJob = z.infer<typeof insertTradeworksJobSchema>;
export type TradeworksJob = typeof tradeworksJobs.$inferSelect;

// TradeWorks Calculations - Saved calculation history
export const tradeworksCalculations = pgTable("tradeworks_calculations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id", { length: 36 }).references(() => tradeworksProfiles.id).notNull(),
  jobId: varchar("job_id", { length: 36 }).references(() => tradeworksJobs.id), // optional job association
  tenantId: text("tenant_id").default("tradeworks"),
  
  // Calculator info
  calculatorType: text("calculator_type").notNull(), // paint_gallon, voltage_drop, pipe_sizing, etc.
  trade: text("trade").notNull(), // painting, electrical, plumbing, hvac, roofing, carpentry, concrete, landscaping
  
  // User-defined label
  label: text("label"), // "Master Bedroom Walls", "Kitchen Rewire", etc.
  
  // Calculation data
  inputs: jsonb("inputs").notNull(), // All input values
  outputs: jsonb("outputs").notNull(), // All calculated results
  
  // Voice transcript if voice-input was used
  voiceTranscript: text("voice_transcript"),
  
  // Favorites
  isFavorite: boolean("is_favorite").default(false),
  isTemplate: boolean("is_template").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_calcs_profile").on(table.profileId),
  index("idx_tradeworks_calcs_job").on(table.jobId),
  index("idx_tradeworks_calcs_tenant").on(table.tenantId),
  index("idx_tradeworks_calcs_type").on(table.calculatorType),
  index("idx_tradeworks_calcs_trade").on(table.trade),
  index("idx_tradeworks_calcs_favorite").on(table.isFavorite),
]);

export const insertTradeworksCalculationSchema = createInsertSchema(tradeworksCalculations).omit({ id: true, createdAt: true });
export type InsertTradeworksCalculation = z.infer<typeof insertTradeworksCalculationSchema>;
export type TradeworksCalculation = typeof tradeworksCalculations.$inferSelect;

// TradeWorks Calculator Defaults - Per-calculator user preferences
export const tradeworksCalculatorDefaults = pgTable("tradeworks_calculator_defaults", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id", { length: 36 }).references(() => tradeworksProfiles.id).notNull(),
  tenantId: text("tenant_id").default("tradeworks"),
  
  calculatorType: text("calculator_type").notNull(),
  defaultValues: jsonb("default_values").notNull(), // Saved default values for this calculator
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_defaults_profile").on(table.profileId),
  index("idx_tradeworks_defaults_calc").on(table.calculatorType),
]);

export const insertTradeworksCalculatorDefaultsSchema = createInsertSchema(tradeworksCalculatorDefaults).omit({ id: true, updatedAt: true });
export type InsertTradeworksCalculatorDefaults = z.infer<typeof insertTradeworksCalculatorDefaultsSchema>;
export type TradeworksCalculatorDefaults = typeof tradeworksCalculatorDefaults.$inferSelect;

// TradeWorks Voice Sessions - Voice interaction history
export const tradeworksVoiceSessions = pgTable("tradeworks_voice_sessions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id", { length: 36 }).references(() => tradeworksProfiles.id).notNull(),
  tenantId: text("tenant_id").default("tradeworks"),
  
  sessionStart: timestamp("session_start").defaultNow().notNull(),
  sessionEnd: timestamp("session_end"),
  
  // Conversation transcript
  transcript: jsonb("transcript"), // Array of { role: 'user'|'assistant', text: string, timestamp: date }
  
  // Calculations made during session
  calculationIds: text("calculation_ids").array(),
  
  // Duration in seconds
  durationSeconds: integer("duration_seconds"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_voice_profile").on(table.profileId),
  index("idx_tradeworks_voice_tenant").on(table.tenantId),
]);

export const insertTradeworksVoiceSessionSchema = createInsertSchema(tradeworksVoiceSessions).omit({ id: true, createdAt: true });
export type InsertTradeworksVoiceSession = z.infer<typeof insertTradeworksVoiceSessionSchema>;
export type TradeworksVoiceSession = typeof tradeworksVoiceSessions.$inferSelect;

// TradeWorks Saved Stores - Favorite supply stores
export const tradeworksSavedStores = pgTable("tradeworks_saved_stores", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id", { length: 36 }).references(() => tradeworksProfiles.id).notNull(),
  tenantId: text("tenant_id").default("tradeworks"),
  
  // Store info
  storeName: text("store_name").notNull(),
  storeType: text("store_type").notNull(), // paint, electrical, plumbing, lumber, hvac, general
  brand: text("brand"), // sherwin-williams, home-depot, lowes, etc.
  
  // Location
  address: text("address"),
  city: text("city"),
  state: varchar("state", { length: 2 }),
  zipcode: varchar("zipcode", { length: 10 }),
  
  // Contact
  phone: text("phone"),
  website: text("website"),
  hours: text("hours"),
  
  // User data
  isFavorite: boolean("is_favorite").default(false),
  notes: text("notes"),
  accountNumber: text("account_number"), // User's account at this store
  
  // Location data
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_stores_profile").on(table.profileId),
  index("idx_tradeworks_stores_tenant").on(table.tenantId),
  index("idx_tradeworks_stores_type").on(table.storeType),
  index("idx_tradeworks_stores_zipcode").on(table.zipcode),
]);

export const insertTradeworksSavedStoreSchema = createInsertSchema(tradeworksSavedStores).omit({ id: true, createdAt: true });
export type InsertTradeworksSavedStore = z.infer<typeof insertTradeworksSavedStoreSchema>;
export type TradeworksSavedStore = typeof tradeworksSavedStores.$inferSelect;

// TradeWorks AI Usage - Track AI feature usage
export const tradeworksAiUsage = pgTable("tradeworks_ai_usage", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id", { length: 36 }).references(() => tradeworksProfiles.id).notNull(),
  tenantId: text("tenant_id").default("tradeworks"),
  
  featureType: text("feature_type").notNull(), // voice_session, color_match, ai_estimate, quote_writer
  tokensUsed: integer("tokens_used").default(0),
  costCents: integer("cost_cents").default(0),
  
  // Details
  details: jsonb("details"), // Feature-specific metadata
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_tradeworks_ai_profile").on(table.profileId),
  index("idx_tradeworks_ai_tenant").on(table.tenantId),
  index("idx_tradeworks_ai_feature").on(table.featureType),
]);

export const insertTradeworksAiUsageSchema = createInsertSchema(tradeworksAiUsage).omit({ id: true, createdAt: true });
export type InsertTradeworksAiUsage = z.infer<typeof insertTradeworksAiUsageSchema>;
export type TradeworksAiUsage = typeof tradeworksAiUsage.$inferSelect;

// Trade Types Enum for reference
export const TRADEWORKS_TRADES = [
  'painting',
  'electrical',
  'plumbing',
  'hvac',
  'roofing',
  'carpentry',
  'concrete',
  'landscaping'
] as const;

export type TradeworksTrade = typeof TRADEWORKS_TRADES[number];

// Calculator Types by Trade
export const TRADEWORKS_CALCULATORS = {
  painting: [
    'paint_gallon',
    'primer_calculator',
    'cabinet_estimator',
    'drying_time',
    'stain_deck',
    'wallpaper_calculator',
    'color_match'
  ],
  electrical: [
    'voltage_drop',
    'wire_sizing',
    'amperage',
    'conduit_fill',
    'breaker_sizing',
    'led_resistor'
  ],
  plumbing: [
    'pipe_sizing',
    'fixture_units',
    'pipe_offset',
    'water_heater_sizing',
    'drain_slope'
  ],
  hvac: [
    'btu_load',
    'duct_sizing',
    'refrigerant_charge',
    'temp_split',
    'airflow_velocity'
  ],
  roofing: [
    'roof_pitch',
    'shingle_calculator',
    'rafter_length',
    'material_estimator'
  ],
  carpentry: [
    'stair_stringer',
    'board_feet',
    'stud_spacing',
    'deck_board',
    'crown_molding'
  ],
  concrete: [
    'concrete_yards',
    'rebar_spacing',
    'block_brick',
    'mortar_mix',
    'cure_time'
  ],
  landscaping: [
    'mulch_gravel',
    'sod_calculator',
    'fence_posts',
    'topsoil'
  ],
  universal: [
    'area_calculator',
    'volume_calculator',
    'waste_calculator',
    'labor_estimator',
    'unit_converter'
  ]
} as const;

// ==========================================
// MARKETING ASSET MANAGEMENT (DAM) SYSTEM
// ==========================================

// Marketing Images - Catalog of all marketing imagery
export const marketingImages = pgTable("marketing_images", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(), // 'npp', 'lumepaint', 'shared'
  
  // Image details
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(), // Path in assets folder
  altText: text("alt_text"),
  
  // Categorization
  category: text("category").notNull(), // 'interior', 'exterior', 'cabinets', 'doors', 'trim', 'decks', 'commercial_office', 'commercial_warehouse', 'apartments', 'windows', 'general'
  subcategory: text("subcategory"), // More specific like 'accent_wall', 'full_room', 'before_after'
  tags: text("tags").array(), // ['modern', 'traditional', 'bright', 'dark', 'residential', 'commercial']
  
  // Metadata
  width: integer("width"),
  height: integer("height"),
  aspectRatio: text("aspect_ratio"), // '1:1', '16:9', '4:3', '9:16'
  
  // Usage tracking
  usageCount: integer("usage_count").default(0),
  lastUsedAt: timestamp("last_used_at"),
  
  // Status
  isActive: boolean("is_active").default(true),
  isFavorite: boolean("is_favorite").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_images_tenant").on(table.tenantId),
  index("idx_marketing_images_category").on(table.category),
  index("idx_marketing_images_active").on(table.isActive),
]);

export const insertMarketingImageSchema = createInsertSchema(marketingImages).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarketingImage = z.infer<typeof insertMarketingImageSchema>;
export type MarketingImage = typeof marketingImages.$inferSelect;

// Marketing Usage Log - Track when and where content is used
export const marketingUsageLog = pgTable("marketing_usage_log", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  
  // What was used
  assetType: text("asset_type").notNull(), // 'image', 'post'
  assetId: varchar("asset_id", { length: 36 }).notNull(),
  tenantId: text("tenant_id").notNull(),
  
  // Where it was used
  platform: text("platform").notNull(), // 'instagram', 'facebook', 'nextdoor', 'website', 'print'
  campaignName: text("campaign_name"),
  
  // When
  usedAt: timestamp("used_at").defaultNow().notNull(),
  
  // Who
  usedBy: text("used_by"),
  
  // Performance (optional, for future tracking)
  impressions: integer("impressions"),
  engagements: integer("engagements"),
  clicks: integer("clicks"),
  
  notes: text("notes"),
}, (table) => [
  index("idx_marketing_usage_asset").on(table.assetId),
  index("idx_marketing_usage_tenant").on(table.tenantId),
  index("idx_marketing_usage_platform").on(table.platform),
  index("idx_marketing_usage_date").on(table.usedAt),
]);

export const insertMarketingUsageLogSchema = createInsertSchema(marketingUsageLog).omit({ id: true });
export type InsertMarketingUsageLog = z.infer<typeof insertMarketingUsageLogSchema>;
export type MarketingUsageLog = typeof marketingUsageLog.$inferSelect;

// Marketing Analytics - Aggregated performance metrics
export const marketingAnalytics = pgTable("marketing_analytics", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  
  // Time period
  periodType: text("period_type").notNull(), // 'daily', 'weekly', 'monthly'
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  // Platform breakdown
  platform: text("platform").notNull(), // 'instagram', 'facebook', 'nextdoor', 'all'
  
  // Content metrics
  postsScheduled: integer("posts_scheduled").default(0),
  postsPublished: integer("posts_published").default(0),
  imagesUsed: integer("images_used").default(0),
  
  // Engagement metrics
  totalImpressions: integer("total_impressions").default(0),
  totalEngagements: integer("total_engagements").default(0),
  totalClicks: integer("total_clicks").default(0),
  
  // Derived metrics
  engagementRate: real("engagement_rate"), // engagements / impressions
  clickThroughRate: real("click_through_rate"), // clicks / impressions
  
  // Category performance
  topCategories: jsonb("top_categories"), // [{ category: 'interior', count: 10, engagement: 500 }]
  topPosts: jsonb("top_posts"), // [{ postId: '...', content: '...', engagements: 100 }]
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_analytics_tenant").on(table.tenantId),
  index("idx_marketing_analytics_period").on(table.periodStart),
  index("idx_marketing_analytics_platform").on(table.platform),
]);

export const insertMarketingAnalyticsSchema = createInsertSchema(marketingAnalytics).omit({ id: true, createdAt: true });
export type InsertMarketingAnalytics = z.infer<typeof insertMarketingAnalyticsSchema>;
export type MarketingAnalytics = typeof marketingAnalytics.$inferSelect;

// Marketing Categories constant
export const MARKETING_CATEGORIES = [
  'interior',
  'exterior', 
  'cabinets',
  'doors',
  'trim',
  'decks',
  'commercial_office',
  'commercial_warehouse',
  'apartments',
  'windows',
  'general',
  'before_after',
  'crew',
  'seasonal'
] as const;

export type MarketingCategory = typeof MARKETING_CATEGORIES[number];

// Marketing Platforms constant
export const MARKETING_PLATFORMS = ['instagram', 'facebook', 'nextdoor'] as const;
export type MarketingPlatform = typeof MARKETING_PLATFORMS[number];

// ============ MARKETING BUDGET & EXPENSES ============

// Marketing Expense Categories
export const MARKETING_EXPENSE_CATEGORIES = [
  'billboard',
  'car_wrap',
  'yard_sign',
  'flyer_door_hanger',
  'direct_mail',
  'print_ad',
  'radio',
  'tv',
  'facebook_ads',
  'google_ads',
  'instagram_ads',
  'nextdoor_ads',
  'yelp_ads',
  'homeadvisor',
  'sponsorship',
  'event',
  'promo_item',
  'other'
] as const;

export type MarketingExpenseCategory = typeof MARKETING_EXPENSE_CATEGORIES[number];

// Marketing Expenses Table - Track all marketing spend
export const marketingExpenses = pgTable("marketing_expenses", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  
  // Expense details
  title: text("title").notNull(), // "I-24 Billboard - January"
  description: text("description"),
  category: text("category").notNull(), // from MARKETING_EXPENSE_CATEGORIES
  vendor: text("vendor"), // "Lamar Advertising"
  
  // Financials
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  budgetedAmount: decimal("budgeted_amount", { precision: 10, scale: 2 }), // What was planned
  
  // Timing
  expenseDate: timestamp("expense_date").notNull(),
  startDate: timestamp("start_date"), // For ongoing campaigns (billboard start)
  endDate: timestamp("end_date"), // For ongoing campaigns (billboard end)
  isRecurring: boolean("is_recurring").default(false),
  recurringFrequency: text("recurring_frequency"), // 'monthly', 'weekly', 'yearly'
  
  // Tracking
  campaignName: text("campaign_name"), // Link to a campaign
  invoiceNumber: text("invoice_number"),
  receiptUrl: text("receipt_url"), // Link to uploaded receipt
  
  // Attribution
  leadsGenerated: integer("leads_generated").default(0),
  revenueGenerated: decimal("revenue_generated", { precision: 10, scale: 2 }).default("0"),
  
  // Status
  status: text("status").default("active"), // 'planned', 'active', 'completed', 'cancelled'
  
  // Audit
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_expenses_tenant").on(table.tenantId),
  index("idx_marketing_expenses_category").on(table.category),
  index("idx_marketing_expenses_date").on(table.expenseDate),
  index("idx_marketing_expenses_status").on(table.status),
]);

export const insertMarketingExpenseSchema = createInsertSchema(marketingExpenses).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarketingExpense = z.infer<typeof insertMarketingExpenseSchema>;
export type MarketingExpense = typeof marketingExpenses.$inferSelect;

// Marketing Budgets Table - Monthly budget targets
export const marketingBudgets = pgTable("marketing_budgets", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  tenantId: text("tenant_id").notNull(),
  
  // Time period
  year: integer("year").notNull(),
  month: integer("month").notNull(), // 1-12
  
  // Budget amounts by category (stored as JSON for flexibility)
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }).notNull(),
  categoryBudgets: jsonb("category_budgets"), // { billboard: 500, facebook_ads: 300, ... }
  
  // Notes
  notes: text("notes"),
  
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_marketing_budgets_tenant").on(table.tenantId),
  index("idx_marketing_budgets_period").on(table.year, table.month),
]);

export const insertMarketingBudgetSchema = createInsertSchema(marketingBudgets).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMarketingBudget = z.infer<typeof insertMarketingBudgetSchema>;
export type MarketingBudget = typeof marketingBudgets.$inferSelect;

