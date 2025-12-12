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
