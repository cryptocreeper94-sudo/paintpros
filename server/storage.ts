import { db } from "./db";
import { 
  type EstimateRequest, type InsertEstimateRequest, estimateRequests,
  type Lead, type InsertLead, leads,
  type Estimate, type InsertEstimate, estimates,
  type SeoTag, type InsertSeoTag, seoTags,
  type CrmDeal, type InsertCrmDeal, crmDeals,
  type CrmActivity, type InsertCrmActivity, crmActivities,
  type CrmNote, type InsertCrmNote, crmNotes,
  type UserPin, type InsertUserPin, userPins,
  type BlockchainStamp, type InsertBlockchainStamp, blockchainStamps,
  type Hallmark, type InsertHallmark, hallmarks,
  type HallmarkAudit, type InsertHallmarkAudit, hallmarkAudit,
  type BlockchainHashQueue, type InsertBlockchainHashQueue, blockchainHashQueue,
  type ReleaseVersion, type InsertReleaseVersion, releaseVersions,
  type ProposalTemplate, type InsertProposalTemplate, proposalTemplates,
  type Proposal, type InsertProposal, proposals,
  type Payment, type InsertPayment, payments,
  type RoomScan, type InsertRoomScan, roomScans,
  type PageView, type InsertPageView, pageViews,
  type AnalyticsSummary, type InsertAnalyticsSummary, analyticsSummary,
  assetNumberCounter
} from "@shared/schema";
import { desc, eq, ilike, or, and, sql, max } from "drizzle-orm";

export interface IStorage {
  // Leads
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadById(id: string): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;
  searchLeads(query: string): Promise<Lead[]>;
  
  // Estimates (new tool)
  createEstimate(estimate: InsertEstimate): Promise<Estimate>;
  getEstimateById(id: string): Promise<Estimate | undefined>;
  getEstimatesByLeadId(leadId: string): Promise<Estimate[]>;
  getEstimates(): Promise<Estimate[]>;
  
  // Legacy estimate requests
  createEstimateRequest(request: InsertEstimateRequest): Promise<EstimateRequest>;
  getEstimateRequests(): Promise<EstimateRequest[]>;
  getEstimateRequestById(id: string): Promise<EstimateRequest | undefined>;
  updateEstimateRequestStatus(id: string, status: string): Promise<EstimateRequest | undefined>;
  
  // SEO Tags
  createSeoTag(tag: InsertSeoTag): Promise<SeoTag>;
  getSeoTags(): Promise<SeoTag[]>;
  getSeoTagsByType(tagType: string): Promise<SeoTag[]>;
  toggleSeoTagActive(id: string, isActive: boolean): Promise<SeoTag | undefined>;
  deleteSeoTag(id: string): Promise<void>;
  
  // CRM Deals
  createCrmDeal(deal: InsertCrmDeal): Promise<CrmDeal>;
  getCrmDeals(): Promise<CrmDeal[]>;
  getCrmDealById(id: string): Promise<CrmDeal | undefined>;
  getCrmDealsByStage(stage: string): Promise<CrmDeal[]>;
  updateCrmDeal(id: string, updates: Partial<InsertCrmDeal>): Promise<CrmDeal | undefined>;
  deleteCrmDeal(id: string): Promise<void>;
  getCrmPipelineSummary(): Promise<{ stage: string; count: number; totalValue: string }[]>;
  
  // CRM Activities
  createCrmActivity(activity: InsertCrmActivity): Promise<CrmActivity>;
  getCrmActivitiesByEntity(entityType: string, entityId: string): Promise<CrmActivity[]>;
  getAllCrmActivities(): Promise<CrmActivity[]>;
  
  // CRM Notes
  createCrmNote(note: InsertCrmNote): Promise<CrmNote>;
  getCrmNotesByEntity(entityType: string, entityId: string): Promise<CrmNote[]>;
  updateCrmNote(id: string, content: string): Promise<CrmNote | undefined>;
  deleteCrmNote(id: string): Promise<void>;
  
  // User PINs
  getUserPinByRole(role: string): Promise<UserPin | undefined>;
  createOrUpdateUserPin(data: InsertUserPin): Promise<UserPin>;
  updateUserPin(role: string, pin: string, mustChangePin: boolean): Promise<UserPin | undefined>;
  
  // Blockchain Stamps
  createBlockchainStamp(stamp: InsertBlockchainStamp): Promise<BlockchainStamp>;
  getBlockchainStampsByEntity(entityType: string, entityId: string): Promise<BlockchainStamp[]>;
  getBlockchainStamps(): Promise<BlockchainStamp[]>;
  updateBlockchainStampStatus(id: string, status: string, txSignature?: string, slot?: number, blockTime?: Date): Promise<BlockchainStamp | undefined>;
  getBlockchainStampByHash(documentHash: string): Promise<BlockchainStamp | undefined>;
  
  // Hallmarks
  createHallmark(hallmark: InsertHallmark): Promise<Hallmark>;
  getHallmarks(): Promise<Hallmark[]>;
  getHallmarkByNumber(hallmarkNumber: string): Promise<Hallmark | undefined>;
  getHallmarkById(id: string): Promise<Hallmark | undefined>;
  searchHallmarks(query: string): Promise<Hallmark[]>;
  getHallmarksByType(assetType: string): Promise<Hallmark[]>;
  updateHallmarkBlockchain(id: string, txSignature: string, explorerUrl: string): Promise<Hallmark | undefined>;
  verifyHallmark(id: string): Promise<Hallmark | undefined>;
  getNextAssetNumber(): Promise<number>;
  
  // Hallmark Audit
  createHallmarkAudit(audit: InsertHallmarkAudit): Promise<HallmarkAudit>;
  getHallmarkAudits(hallmarkId: string): Promise<HallmarkAudit[]>;
  
  // Blockchain Hash Queue
  queueHashForAnchoring(data: InsertBlockchainHashQueue): Promise<BlockchainHashQueue>;
  getQueuedHashes(): Promise<BlockchainHashQueue[]>;
  updateQueueStatus(id: string, status: string, merkleRoot?: string, batchId?: string, txSignature?: string): Promise<BlockchainHashQueue | undefined>;
  
  // Release Versions
  createRelease(release: InsertReleaseVersion): Promise<ReleaseVersion>;
  getLatestRelease(): Promise<ReleaseVersion | undefined>;
  updateReleaseSolanaStatus(id: string, signature: string, status: string): Promise<ReleaseVersion | undefined>;
  
  // Proposal Templates
  createProposalTemplate(template: InsertProposalTemplate): Promise<ProposalTemplate>;
  getProposalTemplates(): Promise<ProposalTemplate[]>;
  getProposalTemplateById(id: string): Promise<ProposalTemplate | undefined>;
  getProposalTemplatesByCategory(category: string): Promise<ProposalTemplate[]>;
  updateProposalTemplate(id: string, updates: Partial<InsertProposalTemplate>): Promise<ProposalTemplate | undefined>;
  deleteProposalTemplate(id: string): Promise<void>;
  
  // Proposals
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  getProposals(): Promise<Proposal[]>;
  getProposalById(id: string): Promise<Proposal | undefined>;
  getProposalsByEstimate(estimateId: string): Promise<Proposal[]>;
  updateProposalStatus(id: string, status: string): Promise<Proposal | undefined>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayments(): Promise<Payment[]>;
  getPaymentById(id: string): Promise<Payment | undefined>;
  getPaymentsByEstimate(estimateId: string): Promise<Payment[]>;
  updatePaymentStatus(id: string, status: string, processorId?: string): Promise<Payment | undefined>;
  markPaymentComplete(id: string): Promise<Payment | undefined>;
  
  // Room Scans
  createRoomScan(scan: InsertRoomScan): Promise<RoomScan>;
  getRoomScanById(id: string): Promise<RoomScan | undefined>;
  getRoomScansByLead(leadId: string): Promise<RoomScan[]>;
  updateRoomScanResult(id: string, result: Partial<RoomScan>): Promise<RoomScan | undefined>;
  
  // Analytics
  trackPageView(view: InsertPageView): Promise<PageView>;
  getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]>;
  getAnalyticsDashboard(): Promise<{
    today: { views: number; visitors: number };
    thisWeek: { views: number; visitors: number };
    thisMonth: { views: number; visitors: number };
    allTime: { views: number; visitors: number };
    recentViews: PageView[];
    topPages: { page: string; views: number }[];
    topReferrers: { referrer: string; count: number }[];
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    hourlyTraffic: { hour: number; views: number }[];
    dailyTraffic: { date: string; views: number; visitors: number }[];
  }>;
  getPageViewsByPage(page: string): Promise<PageView[]>;
  getLiveVisitorCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // Leads
  async createLead(lead: InsertLead): Promise<Lead> {
    const [result] = await db.insert(leads).values(lead).returning();
    return result;
  }

  async getLeadById(id: string): Promise<Lead | undefined> {
    const [result] = await db.select().from(leads).where(eq(leads.id, id));
    return result;
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const [result] = await db.select().from(leads).where(eq(leads.email, email));
    return result;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async searchLeads(query: string): Promise<Lead[]> {
    return await db.select().from(leads)
      .where(ilike(leads.email, `%${query}%`))
      .orderBy(desc(leads.createdAt));
  }

  // Estimates
  async createEstimate(estimate: InsertEstimate): Promise<Estimate> {
    const [result] = await db.insert(estimates).values(estimate).returning();
    return result;
  }

  async getEstimateById(id: string): Promise<Estimate | undefined> {
    const [result] = await db.select().from(estimates).where(eq(estimates.id, id));
    return result;
  }

  async getEstimatesByLeadId(leadId: string): Promise<Estimate[]> {
    return await db.select().from(estimates).where(eq(estimates.leadId, leadId)).orderBy(desc(estimates.createdAt));
  }

  async getEstimates(): Promise<Estimate[]> {
    return await db.select().from(estimates).orderBy(desc(estimates.createdAt));
  }

  // Legacy estimate requests
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

  // SEO Tags
  async createSeoTag(tag: InsertSeoTag): Promise<SeoTag> {
    const [result] = await db.insert(seoTags).values(tag).returning();
    return result;
  }

  async getSeoTags(): Promise<SeoTag[]> {
    return await db.select().from(seoTags).orderBy(desc(seoTags.createdAt));
  }

  async getSeoTagsByType(tagType: string): Promise<SeoTag[]> {
    return await db.select().from(seoTags).where(eq(seoTags.tagType, tagType)).orderBy(desc(seoTags.createdAt));
  }

  async toggleSeoTagActive(id: string, isActive: boolean): Promise<SeoTag | undefined> {
    const [result] = await db
      .update(seoTags)
      .set({ isActive })
      .where(eq(seoTags.id, id))
      .returning();
    return result;
  }

  async deleteSeoTag(id: string): Promise<void> {
    await db.delete(seoTags).where(eq(seoTags.id, id));
  }

  // CRM Deals
  async createCrmDeal(deal: InsertCrmDeal): Promise<CrmDeal> {
    const [result] = await db.insert(crmDeals).values(deal).returning();
    return result;
  }

  async getCrmDeals(): Promise<CrmDeal[]> {
    return await db.select().from(crmDeals).orderBy(desc(crmDeals.createdAt));
  }

  async getCrmDealById(id: string): Promise<CrmDeal | undefined> {
    const [result] = await db.select().from(crmDeals).where(eq(crmDeals.id, id));
    return result;
  }

  async getCrmDealsByStage(stage: string): Promise<CrmDeal[]> {
    return await db.select().from(crmDeals).where(eq(crmDeals.stage, stage)).orderBy(desc(crmDeals.createdAt));
  }

  async updateCrmDeal(id: string, updates: Partial<InsertCrmDeal>): Promise<CrmDeal | undefined> {
    const [result] = await db
      .update(crmDeals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(crmDeals.id, id))
      .returning();
    return result;
  }

  async deleteCrmDeal(id: string): Promise<void> {
    await db.delete(crmDeals).where(eq(crmDeals.id, id));
  }

  async getCrmPipelineSummary(): Promise<{ stage: string; count: number; totalValue: string }[]> {
    const result = await db
      .select({
        stage: crmDeals.stage,
        count: sql<number>`count(*)::int`,
        totalValue: sql<string>`coalesce(sum(${crmDeals.value}), 0)::text`
      })
      .from(crmDeals)
      .groupBy(crmDeals.stage);
    return result;
  }

  // CRM Activities
  async createCrmActivity(activity: InsertCrmActivity): Promise<CrmActivity> {
    const [result] = await db.insert(crmActivities).values(activity).returning();
    return result;
  }

  async getCrmActivitiesByEntity(entityType: string, entityId: string): Promise<CrmActivity[]> {
    return await db.select().from(crmActivities)
      .where(and(eq(crmActivities.entityType, entityType), eq(crmActivities.entityId, entityId)))
      .orderBy(desc(crmActivities.createdAt));
  }

  async getAllCrmActivities(): Promise<CrmActivity[]> {
    return await db.select().from(crmActivities).orderBy(desc(crmActivities.createdAt));
  }

  // CRM Notes
  async createCrmNote(note: InsertCrmNote): Promise<CrmNote> {
    const [result] = await db.insert(crmNotes).values(note).returning();
    return result;
  }

  async getCrmNotesByEntity(entityType: string, entityId: string): Promise<CrmNote[]> {
    return await db.select().from(crmNotes)
      .where(and(eq(crmNotes.entityType, entityType), eq(crmNotes.entityId, entityId)))
      .orderBy(desc(crmNotes.createdAt));
  }

  async updateCrmNote(id: string, content: string): Promise<CrmNote | undefined> {
    const [result] = await db
      .update(crmNotes)
      .set({ content, updatedAt: new Date() })
      .where(eq(crmNotes.id, id))
      .returning();
    return result;
  }

  async deleteCrmNote(id: string): Promise<void> {
    await db.delete(crmNotes).where(eq(crmNotes.id, id));
  }

  // User PINs
  async getUserPinByRole(role: string): Promise<UserPin | undefined> {
    const [result] = await db.select().from(userPins).where(eq(userPins.role, role));
    return result;
  }

  async createOrUpdateUserPin(data: InsertUserPin): Promise<UserPin> {
    const existing = await this.getUserPinByRole(data.role);
    if (existing) {
      const [result] = await db
        .update(userPins)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userPins.role, data.role))
        .returning();
      return result;
    }
    const [result] = await db.insert(userPins).values(data).returning();
    return result;
  }

  async updateUserPin(role: string, pin: string, mustChangePin: boolean): Promise<UserPin | undefined> {
    const [result] = await db
      .update(userPins)
      .set({ pin, mustChangePin, updatedAt: new Date() })
      .where(eq(userPins.role, role))
      .returning();
    return result;
  }

  // Blockchain Stamps
  async createBlockchainStamp(stamp: InsertBlockchainStamp): Promise<BlockchainStamp> {
    const [result] = await db.insert(blockchainStamps).values(stamp).returning();
    return result;
  }

  async getBlockchainStampsByEntity(entityType: string, entityId: string): Promise<BlockchainStamp[]> {
    return await db.select().from(blockchainStamps)
      .where(and(eq(blockchainStamps.entityType, entityType), eq(blockchainStamps.entityId, entityId)))
      .orderBy(desc(blockchainStamps.createdAt));
  }

  async getBlockchainStamps(): Promise<BlockchainStamp[]> {
    return await db.select().from(blockchainStamps).orderBy(desc(blockchainStamps.createdAt));
  }

  async updateBlockchainStampStatus(id: string, status: string, txSignature?: string, slot?: number, blockTime?: Date): Promise<BlockchainStamp | undefined> {
    const updates: Partial<BlockchainStamp> = { status };
    if (txSignature) updates.transactionSignature = txSignature;
    if (slot) updates.slot = slot;
    if (blockTime) updates.blockTime = blockTime;
    
    const [result] = await db
      .update(blockchainStamps)
      .set(updates)
      .where(eq(blockchainStamps.id, id))
      .returning();
    return result;
  }

  async getBlockchainStampByHash(documentHash: string): Promise<BlockchainStamp | undefined> {
    const [result] = await db.select().from(blockchainStamps).where(eq(blockchainStamps.documentHash, documentHash));
    return result;
  }

  // Hallmarks
  async createHallmark(hallmark: InsertHallmark): Promise<Hallmark> {
    const [result] = await db.insert(hallmarks).values(hallmark).returning();
    return result;
  }

  async getHallmarks(): Promise<Hallmark[]> {
    return await db.select().from(hallmarks).orderBy(desc(hallmarks.createdAt));
  }

  async getHallmarkByNumber(hallmarkNumber: string): Promise<Hallmark | undefined> {
    const [result] = await db.select().from(hallmarks).where(eq(hallmarks.hallmarkNumber, hallmarkNumber));
    return result;
  }

  async getHallmarkById(id: string): Promise<Hallmark | undefined> {
    const [result] = await db.select().from(hallmarks).where(eq(hallmarks.id, id));
    return result;
  }

  async searchHallmarks(query: string): Promise<Hallmark[]> {
    return await db.select().from(hallmarks)
      .where(or(
        ilike(hallmarks.searchTerms, `%${query}%`),
        ilike(hallmarks.hallmarkNumber, `%${query}%`),
        ilike(hallmarks.recipientName, `%${query}%`)
      ))
      .orderBy(desc(hallmarks.createdAt));
  }

  async getHallmarksByType(assetType: string): Promise<Hallmark[]> {
    return await db.select().from(hallmarks).where(eq(hallmarks.assetType, assetType)).orderBy(desc(hallmarks.createdAt));
  }

  async updateHallmarkBlockchain(id: string, txSignature: string, explorerUrl: string): Promise<Hallmark | undefined> {
    const [result] = await db
      .update(hallmarks)
      .set({ blockchainTxSignature: txSignature, blockchainExplorerUrl: explorerUrl, updatedAt: new Date() })
      .where(eq(hallmarks.id, id))
      .returning();
    return result;
  }

  async verifyHallmark(id: string): Promise<Hallmark | undefined> {
    const [result] = await db
      .update(hallmarks)
      .set({ verifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(hallmarks.id, id))
      .returning();
    return result;
  }

  async getNextAssetNumber(): Promise<number> {
    const [counter] = await db.select().from(assetNumberCounter);
    if (!counter) {
      await db.insert(assetNumberCounter).values({ nextMasterNumber: 3001 });
      return 3000;
    }
    const currentNumber = counter.nextMasterNumber;
    await db.update(assetNumberCounter)
      .set({ nextMasterNumber: currentNumber + 1, updatedAt: new Date() })
      .where(eq(assetNumberCounter.id, counter.id));
    return currentNumber;
  }

  // Hallmark Audit
  async createHallmarkAudit(audit: InsertHallmarkAudit): Promise<HallmarkAudit> {
    const [result] = await db.insert(hallmarkAudit).values(audit).returning();
    return result;
  }

  async getHallmarkAudits(hallmarkId: string): Promise<HallmarkAudit[]> {
    return await db.select().from(hallmarkAudit)
      .where(eq(hallmarkAudit.hallmarkId, hallmarkId))
      .orderBy(desc(hallmarkAudit.createdAt));
  }

  // Blockchain Hash Queue
  async queueHashForAnchoring(data: InsertBlockchainHashQueue): Promise<BlockchainHashQueue> {
    const [result] = await db.insert(blockchainHashQueue).values(data).returning();
    return result;
  }

  async getQueuedHashes(): Promise<BlockchainHashQueue[]> {
    return await db.select().from(blockchainHashQueue)
      .where(eq(blockchainHashQueue.status, 'queued'))
      .orderBy(blockchainHashQueue.queuedAt);
  }

  async updateQueueStatus(
    id: string, 
    status: string, 
    merkleRoot?: string, 
    batchId?: string, 
    txSignature?: string
  ): Promise<BlockchainHashQueue | undefined> {
    const updates: Partial<BlockchainHashQueue> = { status };
    if (merkleRoot) updates.merkleRoot = merkleRoot;
    if (batchId) updates.batchId = batchId;
    if (txSignature) updates.transactionSignature = txSignature;
    if (status === 'anchored') updates.anchoredAt = new Date();
    
    const [result] = await db
      .update(blockchainHashQueue)
      .set(updates)
      .where(eq(blockchainHashQueue.id, id))
      .returning();
    return result;
  }

  // Release Versions
  async createRelease(release: InsertReleaseVersion): Promise<ReleaseVersion> {
    const [result] = await db.insert(releaseVersions).values(release).returning();
    return result;
  }

  async getLatestRelease(): Promise<ReleaseVersion | undefined> {
    const [result] = await db.select().from(releaseVersions)
      .orderBy(desc(releaseVersions.buildNumber))
      .limit(1);
    return result;
  }

  async updateReleaseSolanaStatus(id: string, signature: string, status: string): Promise<ReleaseVersion | undefined> {
    const [result] = await db
      .update(releaseVersions)
      .set({ solanaTxSignature: signature, solanaTxStatus: status })
      .where(eq(releaseVersions.id, id))
      .returning();
    return result;
  }

  // Proposal Templates
  async createProposalTemplate(template: InsertProposalTemplate): Promise<ProposalTemplate> {
    const [result] = await db.insert(proposalTemplates).values(template).returning();
    return result;
  }

  async getProposalTemplates(): Promise<ProposalTemplate[]> {
    return await db.select().from(proposalTemplates).where(eq(proposalTemplates.isActive, true)).orderBy(desc(proposalTemplates.createdAt));
  }

  async getProposalTemplateById(id: string): Promise<ProposalTemplate | undefined> {
    const [result] = await db.select().from(proposalTemplates).where(eq(proposalTemplates.id, id));
    return result;
  }

  async getProposalTemplatesByCategory(category: string): Promise<ProposalTemplate[]> {
    return await db.select().from(proposalTemplates)
      .where(and(eq(proposalTemplates.category, category), eq(proposalTemplates.isActive, true)))
      .orderBy(desc(proposalTemplates.createdAt));
  }

  async updateProposalTemplate(id: string, updates: Partial<InsertProposalTemplate>): Promise<ProposalTemplate | undefined> {
    const [result] = await db
      .update(proposalTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(proposalTemplates.id, id))
      .returning();
    return result;
  }

  async deleteProposalTemplate(id: string): Promise<void> {
    await db.update(proposalTemplates).set({ isActive: false, updatedAt: new Date() }).where(eq(proposalTemplates.id, id));
  }

  // Proposals
  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const [result] = await db.insert(proposals).values(proposal).returning();
    return result;
  }

  async getProposals(): Promise<Proposal[]> {
    return await db.select().from(proposals).orderBy(desc(proposals.createdAt));
  }

  async getProposalById(id: string): Promise<Proposal | undefined> {
    const [result] = await db.select().from(proposals).where(eq(proposals.id, id));
    return result;
  }

  async getProposalsByEstimate(estimateId: string): Promise<Proposal[]> {
    return await db.select().from(proposals).where(eq(proposals.estimateId, estimateId)).orderBy(desc(proposals.createdAt));
  }

  async updateProposalStatus(id: string, status: string): Promise<Proposal | undefined> {
    const updates: Partial<Proposal> = { status, updatedAt: new Date() };
    if (status === 'sent') updates.sentAt = new Date();
    if (status === 'viewed') updates.viewedAt = new Date();
    if (status === 'accepted' || status === 'declined') updates.respondedAt = new Date();
    
    const [result] = await db
      .update(proposals)
      .set(updates)
      .where(eq(proposals.id, id))
      .returning();
    return result;
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [result] = await db.insert(payments).values(payment).returning();
    return result;
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPaymentById(id: string): Promise<Payment | undefined> {
    const [result] = await db.select().from(payments).where(eq(payments.id, id));
    return result;
  }

  async getPaymentsByEstimate(estimateId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.estimateId, estimateId)).orderBy(desc(payments.createdAt));
  }

  async updatePaymentStatus(id: string, status: string, processorId?: string): Promise<Payment | undefined> {
    const updates: Partial<Payment> = { status, updatedAt: new Date() };
    if (processorId) updates.processorId = processorId;
    
    const [result] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return result;
  }

  async markPaymentComplete(id: string): Promise<Payment | undefined> {
    const [result] = await db
      .update(payments)
      .set({ status: 'completed', paidAt: new Date(), updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return result;
  }

  // Room Scans
  async createRoomScan(scan: InsertRoomScan): Promise<RoomScan> {
    const [result] = await db.insert(roomScans).values(scan).returning();
    return result;
  }

  async getRoomScanById(id: string): Promise<RoomScan | undefined> {
    const [result] = await db.select().from(roomScans).where(eq(roomScans.id, id));
    return result;
  }

  async getRoomScansByLead(leadId: string): Promise<RoomScan[]> {
    return await db.select().from(roomScans).where(eq(roomScans.leadId, leadId)).orderBy(desc(roomScans.createdAt));
  }

  async updateRoomScanResult(id: string, result: Partial<RoomScan>): Promise<RoomScan | undefined> {
    const [updated] = await db
      .update(roomScans)
      .set(result)
      .where(eq(roomScans.id, id))
      .returning();
    return updated;
  }

  // Analytics
  async trackPageView(view: InsertPageView): Promise<PageView> {
    const [result] = await db.insert(pageViews).values(view).returning();
    return result;
  }

  async getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]> {
    if (startDate && endDate) {
      return await db.select().from(pageViews)
        .where(and(
          sql`${pageViews.createdAt} >= ${startDate}`,
          sql`${pageViews.createdAt} <= ${endDate}`
        ))
        .orderBy(desc(pageViews.createdAt));
    }
    return await db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(1000);
  }

  async getPageViewsByPage(page: string): Promise<PageView[]> {
    return await db.select().from(pageViews)
      .where(eq(pageViews.page, page))
      .orderBy(desc(pageViews.createdAt));
  }

  async getLiveVisitorCount(): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await db.select({ count: sql<number>`count(distinct ${pageViews.sessionId})::int` })
      .from(pageViews)
      .where(sql`${pageViews.createdAt} >= ${fiveMinutesAgo}`);
    return result[0]?.count || 0;
  }

  async getAnalyticsDashboard(): Promise<{
    today: { views: number; visitors: number };
    thisWeek: { views: number; visitors: number };
    thisMonth: { views: number; visitors: number };
    allTime: { views: number; visitors: number };
    recentViews: PageView[];
    topPages: { page: string; views: number }[];
    topReferrers: { referrer: string; count: number }[];
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    hourlyTraffic: { hour: number; views: number }[];
    dailyTraffic: { date: string; views: number; visitors: number }[];
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's stats
    const todayStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(sql`${pageViews.createdAt} >= ${startOfToday}`);

    // This week's stats
    const weekStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(sql`${pageViews.createdAt} >= ${startOfWeek}`);

    // This month's stats
    const monthStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(sql`${pageViews.createdAt} >= ${startOfMonth}`);

    // All time stats
    const allTimeStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews);

    // Recent page views
    const recentViews = await db.select().from(pageViews)
      .orderBy(desc(pageViews.createdAt))
      .limit(20);

    // Top pages (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const topPagesResult = await db.select({
      page: pageViews.page,
      views: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`)
      .groupBy(pageViews.page)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Top referrers
    const topReferrersResult = await db.select({
      referrer: pageViews.referrer,
      count: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(and(
        sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`,
        sql`${pageViews.referrer} is not null`,
        sql`${pageViews.referrer} != ''`
      ))
      .groupBy(pageViews.referrer)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Device breakdown
    const deviceResult = await db.select({
      deviceType: pageViews.deviceType,
      count: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`)
      .groupBy(pageViews.deviceType);

    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
    deviceResult.forEach(d => {
      if (d.deviceType === 'desktop') deviceBreakdown.desktop = d.count;
      else if (d.deviceType === 'mobile') deviceBreakdown.mobile = d.count;
      else if (d.deviceType === 'tablet') deviceBreakdown.tablet = d.count;
    });

    // Hourly traffic (today)
    const hourlyResult = await db.select({
      hour: sql<number>`extract(hour from ${pageViews.createdAt})::int`,
      views: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(sql`${pageViews.createdAt} >= ${startOfToday}`)
      .groupBy(sql`extract(hour from ${pageViews.createdAt})`)
      .orderBy(sql`extract(hour from ${pageViews.createdAt})`);

    // Daily traffic (last 30 days)
    const dailyResult = await db.select({
      date: sql<string>`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`,
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews)
      .where(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`)
      .groupBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`);

    return {
      today: todayStats[0] || { views: 0, visitors: 0 },
      thisWeek: weekStats[0] || { views: 0, visitors: 0 },
      thisMonth: monthStats[0] || { views: 0, visitors: 0 },
      allTime: allTimeStats[0] || { views: 0, visitors: 0 },
      recentViews,
      topPages: topPagesResult,
      topReferrers: topReferrersResult.map(r => ({ referrer: r.referrer || 'Direct', count: r.count })),
      deviceBreakdown,
      hourlyTraffic: hourlyResult,
      dailyTraffic: dailyResult
    };
  }
}

export const storage = new DatabaseStorage();
