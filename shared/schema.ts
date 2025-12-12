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

// Founding Assets - Reserved immutable assets
export const FOUNDING_ASSETS = {
  ORBIT_PLATFORM: { 
    number: '#000000001-00', 
    special: '#FE-000000001-00',
    name: 'Paint Pros by ORBIT', 
    type: 'platform',
    badge: 'Genesis Platform',
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

// Release Versions Table - Track app releases and hallmarks
export const releaseVersions = pgTable("release_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  version: text("version").notNull(),
  buildNumber: integer("build_number").notNull(),
  hallmarkId: varchar("hallmark_id").references(() => hallmarks.id),
  contentHash: text("content_hash").notNull(),
  solanaTxSignature: text("solana_tx_signature"),
  solanaTxStatus: text("solana_tx_status").default("pending"),
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
