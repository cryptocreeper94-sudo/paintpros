import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Estimate Requests Table
export const estimateRequests = pgTable("estimate_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  projectType: text("project_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending, contacted, quoted, completed
});

export const insertEstimateRequestSchema = createInsertSchema(estimateRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const selectEstimateRequestSchema = createSelectSchema(estimateRequests);

export type InsertEstimateRequest = z.infer<typeof insertEstimateRequestSchema>;
export type EstimateRequest = typeof estimateRequests.$inferSelect;
