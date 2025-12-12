import { db } from "./db";
import { type EstimateRequest, type InsertEstimateRequest, estimateRequests } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  createEstimateRequest(request: InsertEstimateRequest): Promise<EstimateRequest>;
  getEstimateRequests(): Promise<EstimateRequest[]>;
  getEstimateRequestById(id: string): Promise<EstimateRequest | undefined>;
  updateEstimateRequestStatus(id: string, status: string): Promise<EstimateRequest | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createEstimateRequest(request: InsertEstimateRequest): Promise<EstimateRequest> {
    const [result] = await db.insert(estimateRequests).values(request).returning();
    return result;
  }

  async getEstimateRequests(): Promise<EstimateRequest[]> {
    return await db.select().from(estimateRequests).orderBy(desc(estimateRequests.createdAt));
  }

  async getEstimateRequestById(id: string): Promise<EstimateRequest | undefined> {
    const [result] = await db.select().from(estimateRequests).where(eq(estimateRequests.id, id));
    return result;
  }

  async updateEstimateRequestStatus(id: string, status: string): Promise<EstimateRequest | undefined> {
    const [result] = await db
      .update(estimateRequests)
      .set({ status })
      .where(eq(estimateRequests.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
