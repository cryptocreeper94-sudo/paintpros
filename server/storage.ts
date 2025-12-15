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
  type EstimatePhoto, type InsertEstimatePhoto, estimatePhotos,
  type EstimatePricingOption, type InsertEstimatePricingOption, estimatePricingOptions,
  type ProposalSignature, type InsertProposalSignature, proposalSignatures,
  type EstimateFollowup, type InsertEstimateFollowup, estimateFollowups,
  type DocumentAsset, type InsertDocumentAsset, documentAssets,
  type TenantAssetCounter, type InsertTenantAssetCounter, tenantAssetCounters,
  type User, type UpsertUser, users,
  type Booking, type InsertBooking, bookings,
  type AvailabilityWindow, type InsertAvailabilityWindow, availabilityWindows,
  type CrewLead, type InsertCrewLead, crewLeads,
  type CrewMember, type InsertCrewMember, crewMembers,
  type TimeEntry, type InsertTimeEntry, timeEntries,
  type JobNote, type InsertJobNote, jobNotes,
  type IncidentReport, type InsertIncidentReport, incidentReports,
  type Conversation, type InsertConversation, conversations,
  type ConversationParticipant, type InsertConversationParticipant, conversationParticipants,
  type Message, type InsertMessage, messages,
  assetNumberCounter,
  TENANT_PREFIXES
} from "@shared/schema";
import { desc, eq, ilike, or, and, sql, max, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserRole(id: string, role: string, tenantId?: string): Promise<User | undefined>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  
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
  
  // Tenant-filtered analytics
  getAnalyticsDashboardByTenant(tenantId: string): Promise<{
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
  getLiveVisitorCountByTenant(tenantId: string): Promise<number>;
  getAvailableTenants(): Promise<string[]>;
  
  // Estimate Photos
  createEstimatePhoto(photo: InsertEstimatePhoto): Promise<EstimatePhoto>;
  getEstimatePhotos(estimateId: string): Promise<EstimatePhoto[]>;
  deleteEstimatePhoto(id: string): Promise<void>;
  
  // Estimate Pricing Options (Good/Better/Best)
  createEstimatePricingOption(option: InsertEstimatePricingOption): Promise<EstimatePricingOption>;
  getEstimatePricingOptions(estimateId: string): Promise<EstimatePricingOption[]>;
  selectPricingOption(optionId: string, estimateId: string): Promise<EstimatePricingOption | undefined>;
  
  // Proposal Signatures
  createProposalSignature(signature: InsertProposalSignature): Promise<ProposalSignature>;
  getProposalSignature(proposalId: string): Promise<ProposalSignature | undefined>;
  
  // Estimate Follow-ups
  createEstimateFollowup(followup: InsertEstimateFollowup): Promise<EstimateFollowup>;
  getEstimateFollowups(estimateId: string): Promise<EstimateFollowup[]>;
  getPendingFollowups(): Promise<EstimateFollowup[]>;
  markFollowupSent(id: string): Promise<EstimateFollowup | undefined>;
  cancelFollowup(id: string): Promise<EstimateFollowup | undefined>;
  
  // Document Assets - Tenant-aware document hashing
  createDocumentAsset(asset: InsertDocumentAsset): Promise<DocumentAsset>;
  getDocumentAssetById(id: string): Promise<DocumentAsset | undefined>;
  getDocumentAssetByHallmark(hallmarkNumber: string): Promise<DocumentAsset | undefined>;
  getDocumentAssetsByTenant(tenantId: string): Promise<DocumentAsset[]>;
  getDocumentAssetsBySource(sourceType: string, sourceId: string): Promise<DocumentAsset[]>;
  updateDocumentAssetSolanaStatus(id: string, status: string, txSignature?: string, slot?: number, blockTime?: Date): Promise<DocumentAsset | undefined>;
  getNextTenantOrdinal(tenantId: string): Promise<{ ordinal: number; hallmarkNumber: string }>;
  initializeTenantCounter(tenantId: string): Promise<TenantAssetCounter>;
  getTenantCounter(tenantId: string): Promise<TenantAssetCounter | undefined>;
  
  // Crew Leads
  createCrewLead(lead: InsertCrewLead): Promise<CrewLead>;
  getCrewLeads(tenantId?: string): Promise<CrewLead[]>;
  getCrewLeadById(id: string): Promise<CrewLead | undefined>;
  getCrewLeadByPin(pin: string, tenantId: string): Promise<CrewLead | undefined>;
  updateCrewLead(id: string, updates: Partial<InsertCrewLead>): Promise<CrewLead | undefined>;
  deactivateCrewLead(id: string): Promise<CrewLead | undefined>;
  
  // Crew Members
  createCrewMember(member: InsertCrewMember): Promise<CrewMember>;
  getCrewMembers(leadId: string): Promise<CrewMember[]>;
  getCrewMemberById(id: string): Promise<CrewMember | undefined>;
  updateCrewMember(id: string, updates: Partial<InsertCrewMember>): Promise<CrewMember | undefined>;
  deactivateCrewMember(id: string): Promise<CrewMember | undefined>;
  
  // Time Entries
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  getTimeEntries(leadId: string): Promise<TimeEntry[]>;
  getTimeEntriesByMember(crewMemberId: string): Promise<TimeEntry[]>;
  getTimeEntriesByDateRange(leadId: string, startDate: Date, endDate: Date): Promise<TimeEntry[]>;
  updateTimeEntry(id: string, updates: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined>;
  approveTimeEntry(id: string, approvedBy: string): Promise<TimeEntry | undefined>;
  submitTimeEntriesToPayroll(ids: string[]): Promise<TimeEntry[]>;
  
  // Job Notes
  createJobNote(note: InsertJobNote): Promise<JobNote>;
  getJobNotes(leadId: string): Promise<JobNote[]>;
  getJobNoteById(id: string): Promise<JobNote | undefined>;
  updateJobNote(id: string, updates: Partial<InsertJobNote>): Promise<JobNote | undefined>;
  markJobNoteSent(id: string, sentToOwner: boolean, sentToAdmin: boolean): Promise<JobNote | undefined>;
  
  // Incident Reports
  createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport>;
  getIncidentReports(tenantId?: string): Promise<IncidentReport[]>;
  getIncidentReportsByLead(leadId: string): Promise<IncidentReport[]>;
  getIncidentReportById(id: string): Promise<IncidentReport | undefined>;
  updateIncidentReport(id: string, updates: Partial<InsertIncidentReport>): Promise<IncidentReport | undefined>;
  resolveIncidentReport(id: string, resolution: string, resolvedBy: string): Promise<IncidentReport | undefined>;
  
  // Internal Messaging
  getConversations(tenantId: string): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | undefined>;
  getConversationsByParticipant(role: string, tenantId: string): Promise<Conversation[]>;
  createConversation(data: InsertConversation): Promise<Conversation>;
  getConversationParticipants(conversationId: string): Promise<ConversationParticipant[]>;
  addConversationParticipant(data: InsertConversationParticipant): Promise<ConversationParticipant>;
  updateParticipantLastRead(participantId: string): Promise<ConversationParticipant | undefined>;
  getMessages(conversationId: string, limit?: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  searchUsersByRole(tenantId: string): Promise<{id: string, displayName: string, role: string}[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserRole(id: string, role: string, tenantId?: string): Promise<User | undefined> {
    const updateData: Partial<User> = { role, updatedAt: new Date() };
    if (tenantId !== undefined) {
      updateData.tenantId = tenantId;
    }
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async getUsersByTenant(tenantId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.tenantId, tenantId));
  }

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

  // Release Versions (tenant-aware)
  async createRelease(release: InsertReleaseVersion): Promise<ReleaseVersion> {
    const [result] = await db.insert(releaseVersions).values(release).returning();
    return result;
  }

  async getLatestRelease(tenantId?: string): Promise<ReleaseVersion | undefined> {
    if (tenantId) {
      const [result] = await db.select().from(releaseVersions)
        .where(eq(releaseVersions.tenantId, tenantId))
        .orderBy(desc(releaseVersions.buildNumber))
        .limit(1);
      return result;
    }
    // Default: get ORBIT platform releases (tenantId = 'orbit')
    const [result] = await db.select().from(releaseVersions)
      .where(eq(releaseVersions.tenantId, 'orbit'))
      .orderBy(desc(releaseVersions.buildNumber))
      .limit(1);
    return result;
  }

  async getReleasesByTenant(tenantId: string, limit: number = 20): Promise<ReleaseVersion[]> {
    return await db.select().from(releaseVersions)
      .where(eq(releaseVersions.tenantId, tenantId))
      .orderBy(desc(releaseVersions.buildNumber))
      .limit(limit);
  }

  async getAllReleases(limit: number = 50): Promise<ReleaseVersion[]> {
    return await db.select().from(releaseVersions)
      .orderBy(desc(releaseVersions.buildNumber))
      .limit(limit);
  }

  async getReleaseById(id: string): Promise<ReleaseVersion | undefined> {
    const [result] = await db.select().from(releaseVersions)
      .where(eq(releaseVersions.id, id));
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

  async updateReleaseNotes(id: string, releaseNotes: string): Promise<ReleaseVersion | undefined> {
    const [result] = await db
      .update(releaseVersions)
      .set({ releaseNotes })
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

  // Tenant-filtered analytics
  async getLiveVisitorCountByTenant(tenantId: string): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await db.select({ count: sql<number>`count(distinct ${pageViews.sessionId})::int` })
      .from(pageViews)
      .where(and(
        sql`${pageViews.createdAt} >= ${fiveMinutesAgo}`,
        eq(pageViews.tenantId, tenantId)
      ));
    return result[0]?.count || 0;
  }

  async getAvailableTenants(): Promise<string[]> {
    const result = await db.selectDistinct({ tenantId: pageViews.tenantId })
      .from(pageViews)
      .where(sql`${pageViews.tenantId} is not null`);
    return result.map(r => r.tenantId).filter((t): t is string => t !== null);
  }

  async getAnalyticsDashboardByTenant(tenantId: string): Promise<{
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
    const tenantFilter = eq(pageViews.tenantId, tenantId);

    const todayStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(and(sql`${pageViews.createdAt} >= ${startOfToday}`, tenantFilter));

    const weekStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(and(sql`${pageViews.createdAt} >= ${startOfWeek}`, tenantFilter));

    const monthStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(and(sql`${pageViews.createdAt} >= ${startOfMonth}`, tenantFilter));

    const allTimeStats = await db.select({
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews).where(tenantFilter);

    const recentViews = await db.select().from(pageViews)
      .where(tenantFilter)
      .orderBy(desc(pageViews.createdAt))
      .limit(20);

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const topPagesResult = await db.select({
      page: pageViews.page,
      views: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(and(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`, tenantFilter))
      .groupBy(pageViews.page)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    const topReferrersResult = await db.select({
      referrer: pageViews.referrer,
      count: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(and(
        sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`,
        sql`${pageViews.referrer} is not null`,
        sql`${pageViews.referrer} != ''`,
        tenantFilter
      ))
      .groupBy(pageViews.referrer)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    const deviceResult = await db.select({
      deviceType: pageViews.deviceType,
      count: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(and(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`, tenantFilter))
      .groupBy(pageViews.deviceType);

    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 };
    deviceResult.forEach(d => {
      if (d.deviceType === 'desktop') deviceBreakdown.desktop = d.count;
      else if (d.deviceType === 'mobile') deviceBreakdown.mobile = d.count;
      else if (d.deviceType === 'tablet') deviceBreakdown.tablet = d.count;
    });

    const hourlyResult = await db.select({
      hour: sql<number>`extract(hour from ${pageViews.createdAt})::int`,
      views: sql<number>`count(*)::int`
    }).from(pageViews)
      .where(and(sql`${pageViews.createdAt} >= ${startOfToday}`, tenantFilter))
      .groupBy(sql`extract(hour from ${pageViews.createdAt})`)
      .orderBy(sql`extract(hour from ${pageViews.createdAt})`);

    const dailyResult = await db.select({
      date: sql<string>`to_char(${pageViews.createdAt}, 'YYYY-MM-DD')`,
      views: sql<number>`count(*)::int`,
      visitors: sql<number>`count(distinct ${pageViews.sessionId})::int`
    }).from(pageViews)
      .where(and(sql`${pageViews.createdAt} >= ${thirtyDaysAgo}`, tenantFilter))
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

  // Estimate Photos
  async createEstimatePhoto(photo: InsertEstimatePhoto): Promise<EstimatePhoto> {
    const [result] = await db.insert(estimatePhotos).values(photo).returning();
    return result;
  }

  async getEstimatePhotos(estimateId: string): Promise<EstimatePhoto[]> {
    return await db.select().from(estimatePhotos)
      .where(eq(estimatePhotos.estimateId, estimateId))
      .orderBy(estimatePhotos.sortOrder);
  }

  async deleteEstimatePhoto(id: string): Promise<void> {
    await db.delete(estimatePhotos).where(eq(estimatePhotos.id, id));
  }

  // Estimate Pricing Options (Good/Better/Best)
  async createEstimatePricingOption(option: InsertEstimatePricingOption): Promise<EstimatePricingOption> {
    const [result] = await db.insert(estimatePricingOptions).values(option).returning();
    return result;
  }

  async getEstimatePricingOptions(estimateId: string): Promise<EstimatePricingOption[]> {
    return await db.select().from(estimatePricingOptions)
      .where(eq(estimatePricingOptions.estimateId, estimateId))
      .orderBy(estimatePricingOptions.optionType);
  }

  async selectPricingOption(optionId: string, estimateId: string): Promise<EstimatePricingOption | undefined> {
    await db.update(estimatePricingOptions)
      .set({ isSelected: false })
      .where(eq(estimatePricingOptions.estimateId, estimateId));
    
    const [result] = await db.update(estimatePricingOptions)
      .set({ isSelected: true })
      .where(eq(estimatePricingOptions.id, optionId))
      .returning();
    return result;
  }

  // Proposal Signatures
  async createProposalSignature(signature: InsertProposalSignature): Promise<ProposalSignature> {
    const [result] = await db.insert(proposalSignatures).values(signature).returning();
    await db.update(proposals)
      .set({ status: 'accepted', respondedAt: new Date() })
      .where(eq(proposals.id, signature.proposalId));
    return result;
  }

  async getProposalSignature(proposalId: string): Promise<ProposalSignature | undefined> {
    const [result] = await db.select().from(proposalSignatures)
      .where(eq(proposalSignatures.proposalId, proposalId));
    return result;
  }

  // Estimate Follow-ups
  async createEstimateFollowup(followup: InsertEstimateFollowup): Promise<EstimateFollowup> {
    const [result] = await db.insert(estimateFollowups).values(followup).returning();
    return result;
  }

  async getEstimateFollowups(estimateId: string): Promise<EstimateFollowup[]> {
    return await db.select().from(estimateFollowups)
      .where(eq(estimateFollowups.estimateId, estimateId))
      .orderBy(estimateFollowups.scheduledFor);
  }

  async getPendingFollowups(): Promise<EstimateFollowup[]> {
    const now = new Date();
    return await db.select().from(estimateFollowups)
      .where(and(
        eq(estimateFollowups.status, 'pending'),
        sql`${estimateFollowups.scheduledFor} <= ${now}`
      ))
      .orderBy(estimateFollowups.scheduledFor);
  }

  async markFollowupSent(id: string): Promise<EstimateFollowup | undefined> {
    const [result] = await db.update(estimateFollowups)
      .set({ status: 'sent', sentAt: new Date() })
      .where(eq(estimateFollowups.id, id))
      .returning();
    return result;
  }

  async cancelFollowup(id: string): Promise<EstimateFollowup | undefined> {
    const [result] = await db.update(estimateFollowups)
      .set({ status: 'cancelled' })
      .where(eq(estimateFollowups.id, id))
      .returning();
    return result;
  }

  // Document Assets - Tenant-aware document hashing
  async createDocumentAsset(asset: InsertDocumentAsset): Promise<DocumentAsset> {
    const [result] = await db.insert(documentAssets).values(asset).returning();
    return result;
  }

  async getDocumentAssetById(id: string): Promise<DocumentAsset | undefined> {
    const [result] = await db.select().from(documentAssets).where(eq(documentAssets.id, id));
    return result;
  }

  async getDocumentAssetByHallmark(hallmarkNumber: string): Promise<DocumentAsset | undefined> {
    const [result] = await db.select().from(documentAssets)
      .where(eq(documentAssets.hallmarkNumber, hallmarkNumber));
    return result;
  }

  async getDocumentAssetsByTenant(tenantId: string): Promise<DocumentAsset[]> {
    return await db.select().from(documentAssets)
      .where(eq(documentAssets.tenantId, tenantId))
      .orderBy(desc(documentAssets.createdAt));
  }

  async getDocumentAssetsBySource(sourceType: string, sourceId: string): Promise<DocumentAsset[]> {
    return await db.select().from(documentAssets)
      .where(and(
        eq(documentAssets.sourceType, sourceType),
        eq(documentAssets.sourceId, sourceId)
      ));
  }

  async updateDocumentAssetSolanaStatus(
    id: string, 
    status: string, 
    txSignature?: string, 
    slot?: number, 
    blockTime?: Date
  ): Promise<DocumentAsset | undefined> {
    const updates: Partial<DocumentAsset> = { solanaStatus: status, updatedAt: new Date() };
    if (txSignature) updates.solanaTxSignature = txSignature;
    if (slot) updates.solanaSlot = slot;
    if (blockTime) updates.solanaBlockTime = blockTime;
    
    const [result] = await db.update(documentAssets)
      .set(updates)
      .where(eq(documentAssets.id, id))
      .returning();
    return result;
  }

  async getNextTenantOrdinal(tenantId: string): Promise<{ ordinal: number; hallmarkNumber: string }> {
    let counter = await this.getTenantCounter(tenantId);
    if (!counter) {
      counter = await this.initializeTenantCounter(tenantId);
    }
    
    const ordinal = counter.nextOrdinal;
    const ordinalStr = ordinal.toString().padStart(2, '0');
    const hallmarkNumber = `${counter.prefix}-000000000-${ordinalStr}`;
    
    await db.update(tenantAssetCounters)
      .set({ nextOrdinal: ordinal + 1, lastUpdated: new Date() })
      .where(eq(tenantAssetCounters.tenantId, tenantId));
    
    return { ordinal, hallmarkNumber };
  }

  async initializeTenantCounter(tenantId: string): Promise<TenantAssetCounter> {
    const tenantConfig = TENANT_PREFIXES[tenantId];
    const prefix = tenantConfig?.prefix || tenantId.toUpperCase();
    
    const [result] = await db.insert(tenantAssetCounters)
      .values({ tenantId, prefix, nextOrdinal: 2 })
      .onConflictDoNothing()
      .returning();
    
    if (result) return result;
    
    const [existing] = await db.select().from(tenantAssetCounters)
      .where(eq(tenantAssetCounters.tenantId, tenantId));
    return existing;
  }

  async getTenantCounter(tenantId: string): Promise<TenantAssetCounter | undefined> {
    const [result] = await db.select().from(tenantAssetCounters)
      .where(eq(tenantAssetCounters.tenantId, tenantId));
    return result;
  }

  // ============ BOOKINGS ============

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [result] = await db.insert(bookings).values(booking).returning();
    return result;
  }

  async getBookings(tenantId?: string): Promise<Booking[]> {
    if (tenantId) {
      return await db.select().from(bookings)
        .where(eq(bookings.tenantId, tenantId))
        .orderBy(desc(bookings.scheduledDate));
    }
    return await db.select().from(bookings).orderBy(desc(bookings.scheduledDate));
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const [result] = await db.select().from(bookings).where(eq(bookings.id, id));
    return result;
  }

  async getBookingsByDate(date: Date, tenantId?: string): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conditions = [
      sql`${bookings.scheduledDate} >= ${startOfDay}`,
      sql`${bookings.scheduledDate} <= ${endOfDay}`
    ];
    if (tenantId) {
      conditions.push(eq(bookings.tenantId, tenantId));
    }

    return await db.select().from(bookings)
      .where(and(...conditions))
      .orderBy(bookings.scheduledTime);
  }

  async getBookingsByStatus(status: string, tenantId?: string): Promise<Booking[]> {
    const conditions = [eq(bookings.status, status)];
    if (tenantId) {
      conditions.push(eq(bookings.tenantId, tenantId));
    }
    return await db.select().from(bookings)
      .where(and(...conditions))
      .orderBy(desc(bookings.scheduledDate));
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const updates: Partial<Booking> = { status, updatedAt: new Date() };
    if (status === 'confirmed') updates.confirmedAt = new Date();
    if (status === 'completed') updates.completedAt = new Date();
    if (status === 'cancelled') updates.cancelledAt = new Date();

    const [result] = await db.update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    return result;
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking | undefined> {
    const [result] = await db.update(bookings)
      .set({ 
        status: 'cancelled', 
        cancelledAt: new Date(), 
        cancellationReason: reason,
        updatedAt: new Date() 
      })
      .where(eq(bookings.id, id))
      .returning();
    return result;
  }

  async getUpcomingBookings(tenantId?: string, limit = 10): Promise<Booking[]> {
    const now = new Date();
    const conditions = [
      sql`${bookings.scheduledDate} >= ${now}`,
      sql`${bookings.status} NOT IN ('cancelled', 'completed')`
    ];
    if (tenantId) {
      conditions.push(eq(bookings.tenantId, tenantId));
    }

    return await db.select().from(bookings)
      .where(and(...conditions))
      .orderBy(bookings.scheduledDate, bookings.scheduledTime)
      .limit(limit);
  }

  // ============ AVAILABILITY WINDOWS ============

  async createAvailabilityWindow(window: InsertAvailabilityWindow): Promise<AvailabilityWindow> {
    const [result] = await db.insert(availabilityWindows).values(window).returning();
    return result;
  }

  async getAvailabilityWindows(tenantId?: string): Promise<AvailabilityWindow[]> {
    if (tenantId) {
      return await db.select().from(availabilityWindows)
        .where(eq(availabilityWindows.tenantId, tenantId))
        .orderBy(availabilityWindows.dayOfWeek, availabilityWindows.startTime);
    }
    return await db.select().from(availabilityWindows)
      .orderBy(availabilityWindows.dayOfWeek, availabilityWindows.startTime);
  }

  async getAvailabilityByDay(dayOfWeek: number, tenantId?: string): Promise<AvailabilityWindow[]> {
    const conditions = [
      eq(availabilityWindows.dayOfWeek, dayOfWeek),
      eq(availabilityWindows.isActive, true)
    ];
    if (tenantId) {
      conditions.push(eq(availabilityWindows.tenantId, tenantId));
    }
    return await db.select().from(availabilityWindows)
      .where(and(...conditions))
      .orderBy(availabilityWindows.startTime);
  }

  async updateAvailabilityWindow(id: string, updates: Partial<InsertAvailabilityWindow>): Promise<AvailabilityWindow | undefined> {
    const [result] = await db.update(availabilityWindows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(availabilityWindows.id, id))
      .returning();
    return result;
  }

  async deleteAvailabilityWindow(id: string): Promise<void> {
    await db.delete(availabilityWindows).where(eq(availabilityWindows.id, id));
  }

  async getAvailableSlots(date: Date, tenantId: string): Promise<string[]> {
    const dayOfWeek = date.getDay();
    const windows = await this.getAvailabilityByDay(dayOfWeek, tenantId);
    const existingBookings = await this.getBookingsByDate(date, tenantId);
    
    const bookedSlots = new Set(
      existingBookings
        .filter(b => b.status !== 'cancelled')
        .map(b => b.scheduledTime)
    );

    const availableSlots: string[] = [];
    for (const window of windows) {
      const [startHour, startMin] = window.startTime.split(':').map(Number);
      const [endHour, endMin] = window.endTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        
        const bookingsAtSlot = existingBookings.filter(
          b => b.scheduledTime === timeSlot && b.status !== 'cancelled'
        ).length;
        
        if (bookingsAtSlot < window.maxBookings) {
          availableSlots.push(timeSlot);
        }
        
        currentMin += window.slotDuration;
        while (currentMin >= 60) {
          currentMin -= 60;
          currentHour++;
        }
      }
    }
    
    return availableSlots;
  }

  // ============ CREW LEADS ============
  
  async createCrewLead(lead: InsertCrewLead): Promise<CrewLead> {
    const [result] = await db.insert(crewLeads).values(lead).returning();
    return result;
  }

  async getCrewLeads(tenantId?: string): Promise<CrewLead[]> {
    if (tenantId) {
      return await db.select().from(crewLeads)
        .where(eq(crewLeads.tenantId, tenantId))
        .orderBy(desc(crewLeads.createdAt));
    }
    return await db.select().from(crewLeads).orderBy(desc(crewLeads.createdAt));
  }

  async getCrewLeadById(id: string): Promise<CrewLead | undefined> {
    const [result] = await db.select().from(crewLeads).where(eq(crewLeads.id, id));
    return result;
  }

  async getCrewLeadByPin(pin: string, tenantId: string): Promise<CrewLead | undefined> {
    const [result] = await db.select().from(crewLeads)
      .where(and(eq(crewLeads.pin, pin), eq(crewLeads.tenantId, tenantId), eq(crewLeads.isActive, true)));
    return result;
  }

  async updateCrewLead(id: string, updates: Partial<InsertCrewLead>): Promise<CrewLead | undefined> {
    const [result] = await db.update(crewLeads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(crewLeads.id, id))
      .returning();
    return result;
  }

  async deactivateCrewLead(id: string): Promise<CrewLead | undefined> {
    const [result] = await db.update(crewLeads)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(crewLeads.id, id))
      .returning();
    return result;
  }

  // ============ CREW MEMBERS ============
  
  async createCrewMember(member: InsertCrewMember): Promise<CrewMember> {
    const [result] = await db.insert(crewMembers).values(member).returning();
    return result;
  }

  async getCrewMembers(leadId: string): Promise<CrewMember[]> {
    return await db.select().from(crewMembers)
      .where(eq(crewMembers.leadId, leadId))
      .orderBy(desc(crewMembers.createdAt));
  }

  async getCrewMemberById(id: string): Promise<CrewMember | undefined> {
    const [result] = await db.select().from(crewMembers).where(eq(crewMembers.id, id));
    return result;
  }

  async updateCrewMember(id: string, updates: Partial<InsertCrewMember>): Promise<CrewMember | undefined> {
    const [result] = await db.update(crewMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(crewMembers.id, id))
      .returning();
    return result;
  }

  async deactivateCrewMember(id: string): Promise<CrewMember | undefined> {
    const [result] = await db.update(crewMembers)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(crewMembers.id, id))
      .returning();
    return result;
  }

  // ============ TIME ENTRIES ============
  
  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const [result] = await db.insert(timeEntries).values(entry).returning();
    return result;
  }

  async getTimeEntries(leadId: string): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries)
      .where(eq(timeEntries.leadId, leadId))
      .orderBy(desc(timeEntries.date));
  }

  async getTimeEntriesByMember(crewMemberId: string): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries)
      .where(eq(timeEntries.crewMemberId, crewMemberId))
      .orderBy(desc(timeEntries.date));
  }

  async getTimeEntriesByDateRange(leadId: string, startDate: Date, endDate: Date): Promise<TimeEntry[]> {
    return await db.select().from(timeEntries)
      .where(and(
        eq(timeEntries.leadId, leadId),
        sql`${timeEntries.date} >= ${startDate}`,
        sql`${timeEntries.date} <= ${endDate}`
      ))
      .orderBy(desc(timeEntries.date));
  }

  async updateTimeEntry(id: string, updates: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined> {
    const [result] = await db.update(timeEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(timeEntries.id, id))
      .returning();
    return result;
  }

  async approveTimeEntry(id: string, approvedBy: string): Promise<TimeEntry | undefined> {
    const [result] = await db.update(timeEntries)
      .set({ status: 'approved', approvedAt: new Date(), approvedBy, updatedAt: new Date() })
      .where(eq(timeEntries.id, id))
      .returning();
    return result;
  }

  async submitTimeEntriesToPayroll(ids: string[]): Promise<TimeEntry[]> {
    const results: TimeEntry[] = [];
    for (const id of ids) {
      const [result] = await db.update(timeEntries)
        .set({ status: 'submitted_to_payroll', submittedAt: new Date(), updatedAt: new Date() })
        .where(eq(timeEntries.id, id))
        .returning();
      if (result) results.push(result);
    }
    return results;
  }

  // ============ JOB NOTES ============
  
  async createJobNote(note: InsertJobNote): Promise<JobNote> {
    const [result] = await db.insert(jobNotes).values(note).returning();
    return result;
  }

  async getJobNotes(leadId: string): Promise<JobNote[]> {
    return await db.select().from(jobNotes)
      .where(eq(jobNotes.leadId, leadId))
      .orderBy(desc(jobNotes.createdAt));
  }

  async getJobNoteById(id: string): Promise<JobNote | undefined> {
    const [result] = await db.select().from(jobNotes).where(eq(jobNotes.id, id));
    return result;
  }

  async updateJobNote(id: string, updates: Partial<InsertJobNote>): Promise<JobNote | undefined> {
    const [result] = await db.update(jobNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobNotes.id, id))
      .returning();
    return result;
  }

  async markJobNoteSent(id: string, sentToOwner: boolean, sentToAdmin: boolean): Promise<JobNote | undefined> {
    const [result] = await db.update(jobNotes)
      .set({ sentToOwner, sentToAdmin, sentAt: new Date(), updatedAt: new Date() })
      .where(eq(jobNotes.id, id))
      .returning();
    return result;
  }

  // ============ INCIDENT REPORTS ============
  
  async createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport> {
    const [result] = await db.insert(incidentReports).values(report).returning();
    return result;
  }

  async getIncidentReports(tenantId?: string): Promise<IncidentReport[]> {
    if (tenantId) {
      return await db.select().from(incidentReports)
        .where(eq(incidentReports.tenantId, tenantId))
        .orderBy(desc(incidentReports.createdAt));
    }
    return await db.select().from(incidentReports).orderBy(desc(incidentReports.createdAt));
  }

  async getIncidentReportsByLead(leadId: string): Promise<IncidentReport[]> {
    return await db.select().from(incidentReports)
      .where(eq(incidentReports.leadId, leadId))
      .orderBy(desc(incidentReports.createdAt));
  }

  async getIncidentReportById(id: string): Promise<IncidentReport | undefined> {
    const [result] = await db.select().from(incidentReports).where(eq(incidentReports.id, id));
    return result;
  }

  async updateIncidentReport(id: string, updates: Partial<InsertIncidentReport>): Promise<IncidentReport | undefined> {
    const [result] = await db.update(incidentReports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(incidentReports.id, id))
      .returning();
    return result;
  }

  async resolveIncidentReport(id: string, resolution: string, resolvedBy: string): Promise<IncidentReport | undefined> {
    const [result] = await db.update(incidentReports)
      .set({ status: 'resolved', resolution, resolvedBy, resolvedAt: new Date(), updatedAt: new Date() })
      .where(eq(incidentReports.id, id))
      .returning();
    return result;
  }

  // ============ INTERNAL MESSAGING ============
  
  async getConversations(tenantId: string): Promise<Conversation[]> {
    return await db.select().from(conversations)
      .where(eq(conversations.tenantId, tenantId))
      .orderBy(desc(conversations.updatedAt));
  }

  async getConversationById(id: string): Promise<Conversation | undefined> {
    const [result] = await db.select().from(conversations).where(eq(conversations.id, id));
    return result;
  }

  async getConversationsByParticipant(role: string, tenantId: string): Promise<Conversation[]> {
    const participantConvos = await db.select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.role, role));
    
    if (participantConvos.length === 0) {
      return [];
    }
    
    const convoIds = participantConvos.map(p => p.conversationId);
    const result = await db.select().from(conversations)
      .where(and(
        eq(conversations.tenantId, tenantId),
        sql`${conversations.id} = ANY(${convoIds})`
      ))
      .orderBy(desc(conversations.updatedAt));
    
    return result;
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const [result] = await db.insert(conversations).values(data).returning();
    return result;
  }

  async getConversationParticipants(conversationId: string): Promise<ConversationParticipant[]> {
    return await db.select().from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId))
      .orderBy(conversationParticipants.joinedAt);
  }

  async addConversationParticipant(data: InsertConversationParticipant): Promise<ConversationParticipant> {
    const [result] = await db.insert(conversationParticipants).values(data).returning();
    return result;
  }

  async updateParticipantLastRead(participantId: string): Promise<ConversationParticipant | undefined> {
    const [result] = await db.update(conversationParticipants)
      .set({ lastReadAt: new Date() })
      .where(eq(conversationParticipants.id, participantId))
      .returning();
    return result;
  }

  async getMessages(conversationId: string, limit?: number): Promise<Message[]> {
    const query = db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));
    
    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [result] = await db.insert(messages).values(data).returning();
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, data.conversationId));
    return result;
  }

  async searchUsersByRole(tenantId: string): Promise<{id: string, displayName: string, role: string}[]> {
    const messagingRoles = ['owner', 'admin', 'project-manager', 'area-manager', 'crew-lead', 'developer'];
    
    // Query actual registered users with these roles
    const registeredUsers = await db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(
      and(
        inArray(users.role, messagingRoles),
        or(
          eq(users.tenantId, tenantId),
          sql`${users.tenantId} IS NULL`
        )
      )
    );
    
    // Map to display format
    const userList = registeredUsers.map(user => ({
      id: user.id,
      displayName: user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.email || user.role || 'Unknown User',
      role: user.role || 'user'
    }));
    
    // Always include developer as a fallback contact
    const hasDeveloper = userList.some(u => u.role === 'developer');
    if (!hasDeveloper) {
      userList.push({
        id: 'developer',
        displayName: 'Ryan (Developer)',
        role: 'developer'
      });
    }
    
    return userList;
  }
}

export const storage = new DatabaseStorage();
