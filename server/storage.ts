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
  type Document, type InsertDocument, documents,
  type DocumentVersion, type InsertDocumentVersion, documentVersions,
  type DocumentSignature, type InsertDocumentSignature, documentSignatures,
  type EstimatorConfig, type InsertEstimatorConfig, estimatorConfigs,
  type TenantCredits, type InsertTenantCredits, tenantCredits,
  type AiUsageLog, type InsertAiUsageLog, aiUsageLogs,
  type CreditPurchase, type InsertCreditPurchase, creditPurchases,
  type Job, type InsertJob, jobs,
  type JobUpdate, type InsertJobUpdate, jobUpdates,
  type ReviewRequest, type InsertReviewRequest, reviewRequests,
  type PortfolioEntry, type InsertPortfolioEntry, portfolioEntries,
  type MaterialCalculation, type InsertMaterialCalculation, materialCalculations,
  type LeadSource, type InsertLeadSource, leadSources,
  type Warranty, type InsertWarranty, warranties,
  type FollowupSequence, type InsertFollowupSequence, followupSequences,
  type FollowupStep, type InsertFollowupStep, followupSteps,
  type FollowupLog, type InsertFollowupLog, followupLogs,
  type ReferralProgram, type InsertReferralProgram, referralProgram,
  type ReferralTracking, type InsertReferralTracking, referralTracking,
  type GpsCheckin, type InsertGpsCheckin, gpsCheckins,
  type PaymentDeposit, type InsertPaymentDeposit, paymentDeposits,
  type JobCosting, type InsertJobCosting, jobCosting,
  type JobPhoto, type InsertJobPhoto, jobPhotos,
  type InventoryItem, type InsertInventoryItem, inventoryItems,
  type InventoryTransaction, type InsertInventoryTransaction, inventoryTransactions,
  type Subcontractor, type InsertSubcontractor, subcontractors,
  type SubcontractorAssignment, type InsertSubcontractorAssignment, subcontractorAssignments,
  type WeatherAlert, type InsertWeatherAlert, weatherAlerts,
  type WebhookSubscription, type InsertWebhookSubscription, webhookSubscriptions,
  type WebhookLog, type InsertWebhookLog, webhookLogs,
  type TradeVertical, type InsertTradeVertical, tradeVerticals,
  type FranchiseReport, type InsertFranchiseReport, franchiseReports,
  type FinancingPlan, type InsertFinancingPlan, financingPlans,
  type ColorPalette, type InsertColorPalette, colorPalettes,
  type CalendarExport, type InsertCalendarExport, calendarExports,
  type GoogleCalendarConnection, type InsertGoogleCalendarConnection, googleCalendarConnections,
  type GoogleLsaConnection, type InsertGoogleLsaConnection, googleLsaConnections,
  type GoogleLsaLead, type InsertGoogleLsaLead, googleLsaLeads,
  type SchedulingSlot, type InsertSchedulingSlot, schedulingSlots,
  type CustomerBooking, type InsertCustomerBooking, customerBookings,
  type PhotoAnalysis, type InsertPhotoAnalysis, photoAnalyses,
  type ChatSession, type InsertChatSession, chatSessions,
  type ChatMessage, type InsertChatMessage, chatMessages,
  type CallTrackingNumber, type InsertCallTrackingNumber, callTrackingNumbers,
  type CallLog, type InsertCallLog, callLogs,
  type ReviewResponse, type InsertReviewResponse, reviewResponses,
  type NpsSurvey, type InsertNpsSurvey, npsSurveys,
  type CrewLeaderboard, type InsertCrewLeaderboard, crewLeaderboards,
  type CrewAchievement, type InsertCrewAchievement, crewAchievements,
  type JobGeofence, type InsertJobGeofence, jobGeofences,
  type GeofenceEvent, type InsertGeofenceEvent, geofenceEvents,
  type RevenuePrediction, type InsertRevenuePrediction, revenuePredictions,
  type MarketingChannel, type InsertMarketingChannel, marketingChannels,
  type MarketingAttribution, type InsertMarketingAttribution, marketingAttribution,
  type AccountingExport, type InsertAccountingExport, accountingExports,
  type AiProposal, type InsertAiProposal, aiProposals,
  type LeadScore, type InsertLeadScore, leadScores,
  type VoiceEstimate, type InsertVoiceEstimate, voiceEstimates,
  type FollowupOptimization, type InsertFollowupOptimization, followupOptimizations,
  type CustomerPortal, type InsertCustomerPortal, customerPortals,
  type CrewLocation, type InsertCrewLocation, crewLocations,
  type CrewTip, type InsertCrewTip, crewTips,
  type PortfolioGallery, type InsertPortfolioGallery, portfolioGalleries,
  type ProfitAnalysis, type InsertProfitAnalysis, profitAnalyses,
  type DemandForecast, type InsertDemandForecast, demandForecasts,
  type CustomerLifetimeValue, type InsertCustomerLifetimeValue, customerLifetimeValues,
  type CompetitorData, type InsertCompetitorData, competitorData,
  type SmartContract, type InsertSmartContract, smartContracts,
  type ArColorPreview, type InsertArColorPreview, arColorPreviews,
  type CrewSkill, type InsertCrewSkill, crewSkills,
  type SkillMatching, type InsertSkillMatching, skillMatchings,
  type RouteOptimization, type InsertRouteOptimization, routeOptimizations,
  type JobRiskScore, type InsertJobRiskScore, jobRiskScores,
  type MaterialsOrder, type InsertMaterialsOrder, materialsOrders,
  type CashflowForecast, type InsertCashflowForecast, cashflowForecasts,
  type PricingAnalysis, type InsertPricingAnalysis, pricingAnalyses,
  type MarketingOptimization, type InsertMarketingOptimization, marketingOptimizations,
  type SiteScan, type InsertSiteScan, siteScans,
  type ArOverlay, type InsertArOverlay, arOverlays,
  type AutoInvoice, type InsertAutoInvoice, autoInvoices,
  type LienWaiver, type InsertLienWaiver, lienWaivers,
  type ComplianceDeadline, type InsertComplianceDeadline, complianceDeadlines,
  type ReconciliationRecord, type InsertReconciliationRecord, reconciliationRecords,
  type SubcontractorProfile, type InsertSubcontractorProfile, subcontractorProfiles,
  type ShiftBid, type InsertShiftBid, shiftBids,
  type BidSubmission, type InsertBidSubmission, bidSubmissions,
  type CustomerSentiment, type InsertCustomerSentiment, customerSentiments,
  type MilestoneNft, type InsertMilestoneNft, milestoneNfts,
  type EsgTracking, type InsertEsgTracking, esgTracking,
  type FinancingApplication, type InsertFinancingApplication, financingApplications,
  type FranchiseAnalytics, type InsertFranchiseAnalytics, franchiseAnalytics,
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
  setPasswordResetToken(email: string, token: string, expires: Date): Promise<boolean>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  updateUserPassword(userId: string, passwordHash: string): Promise<boolean>;
  clearPasswordResetToken(userId: string): Promise<boolean>;
  
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
  
  // Document Center
  createDocument(doc: InsertDocument): Promise<Document>;
  getDocuments(tenantId: string): Promise<Document[]>;
  getDocumentById(id: string): Promise<Document | undefined>;
  getDocumentsByType(tenantId: string, documentType: string): Promise<Document[]>;
  updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;
  
  // Document Versions
  createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion>;
  getDocumentVersions(documentId: string): Promise<DocumentVersion[]>;
  
  // Document Signatures
  createDocumentSignature(signature: InsertDocumentSignature): Promise<DocumentSignature>;
  getDocumentSignatures(documentId: string): Promise<DocumentSignature[]>;
  
  // Estimator Configurations
  getEstimatorConfig(tenantId: string): Promise<EstimatorConfig | undefined>;
  createEstimatorConfig(config: InsertEstimatorConfig): Promise<EstimatorConfig>;
  updateEstimatorConfig(tenantId: string, updates: Partial<InsertEstimatorConfig>): Promise<EstimatorConfig | undefined>;
  
  // AI Credits System
  getTenantCredits(tenantId: string): Promise<TenantCredits | undefined>;
  createTenantCredits(data: InsertTenantCredits): Promise<TenantCredits>;
  updateTenantCredits(tenantId: string, updates: Partial<InsertTenantCredits>): Promise<TenantCredits | undefined>;
  addCredits(tenantId: string, amountCents: number): Promise<TenantCredits>;
  deductCredits(tenantId: string, amountCents: number): Promise<TenantCredits | undefined>;
  
  // AI Usage Logs
  logAiUsage(data: InsertAiUsageLog): Promise<AiUsageLog>;
  getAiUsageLogs(tenantId: string, limit?: number): Promise<AiUsageLog[]>;
  getAiUsageByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<AiUsageLog[]>;
  getAiUsageSummary(tenantId: string): Promise<{ totalCostCents: number; actionCounts: Record<string, number> }>;
  
  // Credit Purchases
  createCreditPurchase(data: InsertCreditPurchase): Promise<CreditPurchase>;
  getCreditPurchaseById(id: string): Promise<CreditPurchase | undefined>;
  getCreditPurchases(tenantId: string): Promise<CreditPurchase[]>;
  updateCreditPurchaseStatus(id: string, status: string, paymentIntentId?: string): Promise<CreditPurchase | undefined>;
  
  // Jobs (Customer Portal)
  createJob(job: InsertJob): Promise<Job>;
  getJobById(id: string): Promise<Job | undefined>;
  getJobByAccessToken(token: string): Promise<Job | undefined>;
  getJobs(tenantId: string): Promise<Job[]>;
  updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined>;
  
  // Job Updates
  createJobUpdate(update: InsertJobUpdate): Promise<JobUpdate>;
  getJobUpdates(jobId: string, visibleToCustomer?: boolean): Promise<JobUpdate[]>;
  
  // Review Requests
  createReviewRequest(request: InsertReviewRequest): Promise<ReviewRequest>;
  getReviewRequests(tenantId: string): Promise<ReviewRequest[]>;
  updateReviewRequest(id: string, updates: Partial<InsertReviewRequest>): Promise<ReviewRequest | undefined>;
  
  // Portfolio
  createPortfolioEntry(entry: InsertPortfolioEntry): Promise<PortfolioEntry>;
  getPortfolioEntries(tenantId: string, publishedOnly?: boolean): Promise<PortfolioEntry[]>;
  getPortfolioEntryById(id: string): Promise<PortfolioEntry | undefined>;
  updatePortfolioEntry(id: string, updates: Partial<InsertPortfolioEntry>): Promise<PortfolioEntry | undefined>;
  deletePortfolioEntry(id: string): Promise<void>;
  
  // Material Calculations
  createMaterialCalculation(calc: InsertMaterialCalculation): Promise<MaterialCalculation>;
  getMaterialCalculations(tenantId: string): Promise<MaterialCalculation[]>;
  getMaterialCalculationsByLead(leadId: string): Promise<MaterialCalculation[]>;
  
  // Lead Sources
  createLeadSource(source: InsertLeadSource): Promise<LeadSource>;
  getLeadSources(tenantId: string): Promise<LeadSource[]>;
  updateLeadSource(id: string, updates: Partial<InsertLeadSource>): Promise<LeadSource | undefined>;
  
  // Warranties
  createWarranty(warranty: InsertWarranty): Promise<Warranty>;
  getWarranties(tenantId: string): Promise<Warranty[]>;
  getWarrantyById(id: string): Promise<Warranty | undefined>;
  updateWarranty(id: string, updates: Partial<InsertWarranty>): Promise<Warranty | undefined>;
  getExpiringWarranties(tenantId: string, daysAhead: number): Promise<Warranty[]>;
  
  // Follow-up Sequences
  createFollowupSequence(sequence: InsertFollowupSequence): Promise<FollowupSequence>;
  getFollowupSequences(tenantId: string): Promise<FollowupSequence[]>;
  createFollowupStep(step: InsertFollowupStep): Promise<FollowupStep>;
  getFollowupSteps(sequenceId: string): Promise<FollowupStep[]>;
  createFollowupLog(log: InsertFollowupLog): Promise<FollowupLog>;
  getPendingFollowups(tenantId: string): Promise<FollowupLog[]>;
  updateFollowupLog(id: string, updates: Partial<InsertFollowupLog>): Promise<FollowupLog | undefined>;
  
  // Referral Program
  createReferralProgram(program: InsertReferralProgram): Promise<ReferralProgram>;
  getReferralPrograms(tenantId: string): Promise<ReferralProgram[]>;
  getReferralByCode(code: string): Promise<ReferralProgram | undefined>;
  updateReferralProgram(id: string, updates: Partial<InsertReferralProgram>): Promise<ReferralProgram | undefined>;
  createReferralTracking(tracking: InsertReferralTracking): Promise<ReferralTracking>;
  getReferralTrackings(programId: string): Promise<ReferralTracking[]>;
  
  // GPS Check-ins
  createGpsCheckin(checkin: InsertGpsCheckin): Promise<GpsCheckin>;
  getGpsCheckins(jobId: string): Promise<GpsCheckin[]>;
  getGpsCheckinsByMember(crewMemberId: string): Promise<GpsCheckin[]>;
  
  // Payment Deposits
  createPaymentDeposit(deposit: InsertPaymentDeposit): Promise<PaymentDeposit>;
  getPaymentDeposits(tenantId: string): Promise<PaymentDeposit[]>;
  getPaymentDepositById(id: string): Promise<PaymentDeposit | undefined>;
  updatePaymentDeposit(id: string, updates: Partial<InsertPaymentDeposit>): Promise<PaymentDeposit | undefined>;
  
  // Job Costing
  createJobCosting(costing: InsertJobCosting): Promise<JobCosting>;
  getJobCostingByJobId(jobId: string): Promise<JobCosting | undefined>;
  updateJobCosting(id: string, updates: Partial<InsertJobCosting>): Promise<JobCosting | undefined>;
  getJobCostings(tenantId: string): Promise<JobCosting[]>;
  
  // Job Photos
  createJobPhoto(photo: InsertJobPhoto): Promise<JobPhoto>;
  getJobPhotos(jobId: string): Promise<JobPhoto[]>;
  deleteJobPhoto(id: string): Promise<void>;
  
  // Inventory
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  getInventoryItems(tenantId: string): Promise<InventoryItem[]>;
  updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  getInventoryTransactions(tenantId: string): Promise<InventoryTransaction[]>;
  
  // Subcontractors
  createSubcontractor(sub: InsertSubcontractor): Promise<Subcontractor>;
  getSubcontractors(tenantId: string): Promise<Subcontractor[]>;
  updateSubcontractor(id: string, updates: Partial<InsertSubcontractor>): Promise<Subcontractor | undefined>;
  createSubcontractorAssignment(assignment: InsertSubcontractorAssignment): Promise<SubcontractorAssignment>;
  getSubcontractorAssignments(jobId: string): Promise<SubcontractorAssignment[]>;
  
  // Weather Alerts
  createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert>;
  getWeatherAlerts(tenantId: string): Promise<WeatherAlert[]>;
  acknowledgeWeatherAlert(id: string, acknowledgedBy: string): Promise<WeatherAlert | undefined>;
  
  // Webhooks
  createWebhookSubscription(subscription: InsertWebhookSubscription): Promise<WebhookSubscription>;
  getWebhookSubscriptions(tenantId: string): Promise<WebhookSubscription[]>;
  updateWebhookSubscription(id: string, updates: Partial<InsertWebhookSubscription>): Promise<WebhookSubscription | undefined>;
  deleteWebhookSubscription(id: string): Promise<void>;
  createWebhookLog(log: InsertWebhookLog): Promise<WebhookLog>;
  
  // Trade Verticals
  createTradeVertical(vertical: InsertTradeVertical): Promise<TradeVertical>;
  getTradeVerticals(): Promise<TradeVertical[]>;
  
  // Franchise Reports
  createFranchiseReport(report: InsertFranchiseReport): Promise<FranchiseReport>;
  getFranchiseReports(tenantId: string): Promise<FranchiseReport[]>;
  
  // Financing Plans
  createFinancingPlan(plan: InsertFinancingPlan): Promise<FinancingPlan>;
  getFinancingPlans(tenantId: string): Promise<FinancingPlan[]>;
  
  // Color Palettes
  createColorPalette(palette: InsertColorPalette): Promise<ColorPalette>;
  getColorPalettes(tenantId: string): Promise<ColorPalette[]>;
  
  // Calendar Exports
  createCalendarExport(exportData: InsertCalendarExport): Promise<CalendarExport>;
  getCalendarExportByToken(token: string): Promise<CalendarExport | undefined>;
  
  // Google Calendar Connections
  createGoogleCalendarConnection(connection: InsertGoogleCalendarConnection): Promise<GoogleCalendarConnection>;
  getGoogleCalendarConnections(tenantId: string): Promise<GoogleCalendarConnection[]>;
  getGoogleCalendarConnectionById(id: string): Promise<GoogleCalendarConnection | undefined>;
  updateGoogleCalendarConnection(id: string, updates: Partial<InsertGoogleCalendarConnection>): Promise<GoogleCalendarConnection | undefined>;
  deleteGoogleCalendarConnection(id: string): Promise<void>;
  
  // Google Local Services Ads (LSA)
  createGoogleLsaConnection(connection: InsertGoogleLsaConnection): Promise<GoogleLsaConnection>;
  getGoogleLsaConnections(tenantId: string): Promise<GoogleLsaConnection[]>;
  getGoogleLsaConnectionById(id: string): Promise<GoogleLsaConnection | undefined>;
  updateGoogleLsaConnection(id: string, updates: Partial<InsertGoogleLsaConnection>): Promise<GoogleLsaConnection | undefined>;
  deleteGoogleLsaConnection(id: string): Promise<void>;
  createGoogleLsaLead(lead: InsertGoogleLsaLead): Promise<GoogleLsaLead>;
  getGoogleLsaLeads(tenantId: string): Promise<GoogleLsaLead[]>;
  getGoogleLsaLeadByGoogleId(googleLeadId: string): Promise<GoogleLsaLead | undefined>;
  updateGoogleLsaLead(id: string, updates: Partial<InsertGoogleLsaLead>): Promise<GoogleLsaLead | undefined>;
  
  // Self-Scheduling
  createSchedulingSlot(slot: InsertSchedulingSlot): Promise<SchedulingSlot>;
  getSchedulingSlots(tenantId: string, date?: Date): Promise<SchedulingSlot[]>;
  createCustomerBooking(booking: InsertCustomerBooking): Promise<CustomerBooking>;
  getCustomerBookings(tenantId: string): Promise<CustomerBooking[]>;
  updateSchedulingSlot(id: string, updates: Partial<InsertSchedulingSlot>): Promise<SchedulingSlot | undefined>;
  
  // Photo Analysis
  createPhotoAnalysis(analysis: InsertPhotoAnalysis): Promise<PhotoAnalysis>;
  getPhotoAnalyses(tenantId: string): Promise<PhotoAnalysis[]>;
  
  // Live Chat
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessions(tenantId: string): Promise<ChatSession[]>;
  updateChatSession(id: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Call Tracking
  createCallTrackingNumber(tracking: InsertCallTrackingNumber): Promise<CallTrackingNumber>;
  getCallTrackingNumbers(tenantId: string): Promise<CallTrackingNumber[]>;
  createCallLog(log: InsertCallLog): Promise<CallLog>;
  getCallLogs(tenantId: string): Promise<CallLog[]>;
  
  // Review Management
  createReviewResponse(review: InsertReviewResponse): Promise<ReviewResponse>;
  getReviewResponses(tenantId: string): Promise<ReviewResponse[]>;
  updateReviewResponse(id: string, updates: Partial<InsertReviewResponse>): Promise<ReviewResponse | undefined>;
  
  // NPS Surveys
  createNpsSurvey(survey: InsertNpsSurvey): Promise<NpsSurvey>;
  getNpsSurveys(tenantId: string): Promise<NpsSurvey[]>;
  updateNpsSurvey(id: string, updates: Partial<InsertNpsSurvey>): Promise<NpsSurvey | undefined>;
  
  // Crew Gamification
  createCrewLeaderboard(entry: InsertCrewLeaderboard): Promise<CrewLeaderboard>;
  getCrewLeaderboards(tenantId: string, period?: string): Promise<CrewLeaderboard[]>;
  createCrewAchievement(achievement: InsertCrewAchievement): Promise<CrewAchievement>;
  getCrewAchievements(crewMemberId: string): Promise<CrewAchievement[]>;
  
  // Geofencing
  createJobGeofence(geofence: InsertJobGeofence): Promise<JobGeofence>;
  getJobGeofence(jobId: string): Promise<JobGeofence | undefined>;
  createGeofenceEvent(event: InsertGeofenceEvent): Promise<GeofenceEvent>;
  getGeofenceEvents(crewMemberId: string): Promise<GeofenceEvent[]>;
  
  // Revenue Predictions
  createRevenuePrediction(prediction: InsertRevenuePrediction): Promise<RevenuePrediction>;
  getRevenuePredictions(tenantId: string): Promise<RevenuePrediction[]>;
  
  // Marketing Attribution
  createMarketingChannel(channel: InsertMarketingChannel): Promise<MarketingChannel>;
  getMarketingChannels(tenantId: string): Promise<MarketingChannel[]>;
  createMarketingAttribution(attribution: InsertMarketingAttribution): Promise<MarketingAttribution>;
  getMarketingAttributions(tenantId: string): Promise<MarketingAttribution[]>;
  
  // Accounting Export
  createAccountingExport(exportData: InsertAccountingExport): Promise<AccountingExport>;
  getAccountingExports(tenantId: string): Promise<AccountingExport[]>;
  
  // AI Proposals
  createAiProposal(proposal: InsertAiProposal): Promise<AiProposal>;
  getAiProposals(tenantId: string): Promise<AiProposal[]>;
  updateAiProposal(id: string, updates: Partial<InsertAiProposal>): Promise<AiProposal | undefined>;
  
  // Lead Scoring
  createLeadScore(score: InsertLeadScore): Promise<LeadScore>;
  getLeadScores(tenantId: string): Promise<LeadScore[]>;
  getLeadScore(leadId: string): Promise<LeadScore | undefined>;
  updateLeadScore(id: string, updates: Partial<InsertLeadScore>): Promise<LeadScore | undefined>;
  
  // Voice Estimates
  createVoiceEstimate(estimate: InsertVoiceEstimate): Promise<VoiceEstimate>;
  getVoiceEstimates(tenantId: string): Promise<VoiceEstimate[]>;
  
  // Follow-up Optimization
  createFollowupOptimization(optimization: InsertFollowupOptimization): Promise<FollowupOptimization>;
  getFollowupOptimizations(tenantId: string): Promise<FollowupOptimization[]>;
  
  // Customer Portal
  createCustomerPortal(portal: InsertCustomerPortal): Promise<CustomerPortal>;
  getCustomerPortalByToken(token: string): Promise<CustomerPortal | undefined>;
  updateCustomerPortal(id: string, updates: Partial<InsertCustomerPortal>): Promise<CustomerPortal | undefined>;
  
  // Crew Locations
  upsertCrewLocation(location: InsertCrewLocation): Promise<CrewLocation>;
  getCrewLocations(tenantId: string): Promise<CrewLocation[]>;
  getCrewLocationByJob(jobId: string): Promise<CrewLocation[]>;
  
  // Crew Tips
  createCrewTip(tip: InsertCrewTip): Promise<CrewTip>;
  getCrewTips(tenantId: string): Promise<CrewTip[]>;
  updateCrewTip(id: string, updates: Partial<InsertCrewTip>): Promise<CrewTip | undefined>;
  
  // Portfolio Gallery
  createPortfolioGallery(gallery: InsertPortfolioGallery): Promise<PortfolioGallery>;
  getPortfolioGalleries(tenantId: string): Promise<PortfolioGallery[]>;
  getPublicGalleries(tenantId: string): Promise<PortfolioGallery[]>;
  updatePortfolioGallery(id: string, updates: Partial<InsertPortfolioGallery>): Promise<PortfolioGallery | undefined>;
  
  // Profit Analysis
  createProfitAnalysis(analysis: InsertProfitAnalysis): Promise<ProfitAnalysis>;
  getProfitAnalyses(tenantId: string): Promise<ProfitAnalysis[]>;
  
  // Demand Forecasts
  createDemandForecast(forecast: InsertDemandForecast): Promise<DemandForecast>;
  getDemandForecasts(tenantId: string): Promise<DemandForecast[]>;
  
  // Customer Lifetime Value
  createCustomerLifetimeValue(clv: InsertCustomerLifetimeValue): Promise<CustomerLifetimeValue>;
  getCustomerLifetimeValues(tenantId: string): Promise<CustomerLifetimeValue[]>;
  getCustomerLifetimeValue(customerEmail: string): Promise<CustomerLifetimeValue | undefined>;
  updateCustomerLifetimeValue(id: string, updates: Partial<InsertCustomerLifetimeValue>): Promise<CustomerLifetimeValue | undefined>;
  
  // Competitor Data
  createCompetitorData(data: InsertCompetitorData): Promise<CompetitorData>;
  getCompetitorData(tenantId: string): Promise<CompetitorData[]>;
  updateCompetitorData(id: string, updates: Partial<InsertCompetitorData>): Promise<CompetitorData | undefined>;
  
  // Smart Contracts
  createSmartContract(contract: InsertSmartContract): Promise<SmartContract>;
  getSmartContracts(tenantId: string): Promise<SmartContract[]>;
  getSmartContract(id: string): Promise<SmartContract | undefined>;
  updateSmartContract(id: string, updates: Partial<InsertSmartContract>): Promise<SmartContract | undefined>;
  
  // AR Color Previews
  createArColorPreview(preview: InsertArColorPreview): Promise<ArColorPreview>;
  getArColorPreviews(tenantId: string): Promise<ArColorPreview[]>;
  
  // Crew Skills
  createCrewSkill(skill: InsertCrewSkill): Promise<CrewSkill>;
  getCrewSkills(crewMemberId: string): Promise<CrewSkill[]>;
  getAllCrewSkills(tenantId: string): Promise<CrewSkill[]>;
  
  // Skill Matching
  createSkillMatching(matching: InsertSkillMatching): Promise<SkillMatching>;
  getSkillMatchings(tenantId: string): Promise<SkillMatching[]>;
  getSkillMatchingByJob(jobId: string): Promise<SkillMatching | undefined>;
  
  // Route Optimization
  createRouteOptimization(route: InsertRouteOptimization): Promise<RouteOptimization>;
  getRouteOptimizations(tenantId: string): Promise<RouteOptimization[]>;
  
  // Job Risk Scores
  createJobRiskScore(risk: InsertJobRiskScore): Promise<JobRiskScore>;
  getJobRiskScores(tenantId: string): Promise<JobRiskScore[]>;
  getJobRiskScore(jobId: string): Promise<JobRiskScore | undefined>;
  
  // Materials Orders
  createMaterialsOrder(order: InsertMaterialsOrder): Promise<MaterialsOrder>;
  getMaterialsOrders(tenantId: string): Promise<MaterialsOrder[]>;
  updateMaterialsOrder(id: string, updates: Partial<InsertMaterialsOrder>): Promise<MaterialsOrder | undefined>;
  
  // Cashflow Forecasts
  createCashflowForecast(forecast: InsertCashflowForecast): Promise<CashflowForecast>;
  getCashflowForecasts(tenantId: string): Promise<CashflowForecast[]>;
  
  // Pricing Analysis
  createPricingAnalysis(analysis: InsertPricingAnalysis): Promise<PricingAnalysis>;
  getPricingAnalyses(tenantId: string): Promise<PricingAnalysis[]>;
  
  // Marketing Optimization
  createMarketingOptimization(opt: InsertMarketingOptimization): Promise<MarketingOptimization>;
  getMarketingOptimizations(tenantId: string): Promise<MarketingOptimization[]>;
  
  // Site Scans
  createSiteScan(scan: InsertSiteScan): Promise<SiteScan>;
  getSiteScans(tenantId: string): Promise<SiteScan[]>;
  updateSiteScan(id: string, updates: Partial<InsertSiteScan>): Promise<SiteScan | undefined>;
  
  // AR Overlays
  createArOverlay(overlay: InsertArOverlay): Promise<ArOverlay>;
  getArOverlays(tenantId: string): Promise<ArOverlay[]>;
  
  // Auto Invoices
  createAutoInvoice(invoice: InsertAutoInvoice): Promise<AutoInvoice>;
  getAutoInvoices(tenantId: string): Promise<AutoInvoice[]>;
  updateAutoInvoice(id: string, updates: Partial<InsertAutoInvoice>): Promise<AutoInvoice | undefined>;
  
  // Lien Waivers
  createLienWaiver(waiver: InsertLienWaiver): Promise<LienWaiver>;
  getLienWaivers(tenantId: string): Promise<LienWaiver[]>;
  updateLienWaiver(id: string, updates: Partial<InsertLienWaiver>): Promise<LienWaiver | undefined>;
  
  // Compliance Deadlines
  createComplianceDeadline(deadline: InsertComplianceDeadline): Promise<ComplianceDeadline>;
  getComplianceDeadlines(tenantId: string): Promise<ComplianceDeadline[]>;
  updateComplianceDeadline(id: string, updates: Partial<InsertComplianceDeadline>): Promise<ComplianceDeadline | undefined>;
  
  // Reconciliation Records
  createReconciliationRecord(record: InsertReconciliationRecord): Promise<ReconciliationRecord>;
  getReconciliationRecords(tenantId: string): Promise<ReconciliationRecord[]>;
  
  // Subcontractor Profiles
  createSubcontractorProfile(profile: InsertSubcontractorProfile): Promise<SubcontractorProfile>;
  getSubcontractorProfiles(tenantId: string): Promise<SubcontractorProfile[]>;
  updateSubcontractorProfile(id: string, updates: Partial<InsertSubcontractorProfile>): Promise<SubcontractorProfile | undefined>;
  
  // Shift Bids
  createShiftBid(bid: InsertShiftBid): Promise<ShiftBid>;
  getShiftBids(tenantId: string): Promise<ShiftBid[]>;
  updateShiftBid(id: string, updates: Partial<InsertShiftBid>): Promise<ShiftBid | undefined>;
  
  // Bid Submissions
  createBidSubmission(submission: InsertBidSubmission): Promise<BidSubmission>;
  getBidSubmissions(shiftBidId: string): Promise<BidSubmission[]>;
  
  // Customer Sentiments
  createCustomerSentiment(sentiment: InsertCustomerSentiment): Promise<CustomerSentiment>;
  getCustomerSentiments(tenantId: string): Promise<CustomerSentiment[]>;
  
  // Milestone NFTs
  createMilestoneNft(nft: InsertMilestoneNft): Promise<MilestoneNft>;
  getMilestoneNfts(tenantId: string): Promise<MilestoneNft[]>;
  updateMilestoneNft(id: string, updates: Partial<InsertMilestoneNft>): Promise<MilestoneNft | undefined>;
  
  // ESG Tracking
  createEsgTracking(esg: InsertEsgTracking): Promise<EsgTracking>;
  getEsgTracking(tenantId: string): Promise<EsgTracking[]>;
  
  // Financing Applications
  createFinancingApplication(app: InsertFinancingApplication): Promise<FinancingApplication>;
  getFinancingApplications(tenantId: string): Promise<FinancingApplication[]>;
  updateFinancingApplication(id: string, updates: Partial<InsertFinancingApplication>): Promise<FinancingApplication | undefined>;
  
  // Franchise Analytics
  createFranchiseAnalytics(analytics: InsertFranchiseAnalytics): Promise<FranchiseAnalytics>;
  getFranchiseAnalytics(tenantId: string): Promise<FranchiseAnalytics[]>;
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

  async setPasswordResetToken(email: string, token: string, expires: Date): Promise<boolean> {
    const result = await db.update(users)
      .set({ passwordResetToken: token, passwordResetExpires: expires, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning();
    return result.length > 0;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users)
      .where(and(
        eq(users.passwordResetToken, token),
        sql`${users.passwordResetExpires} > NOW()`
      ));
    return user;
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<boolean> {
    const result = await db.update(users)
      .set({ passwordHash, passwordResetToken: null, passwordResetExpires: null, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0;
  }

  async clearPasswordResetToken(userId: string): Promise<boolean> {
    const result = await db.update(users)
      .set({ passwordResetToken: null, passwordResetExpires: null, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return result.length > 0;
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

  // Document Center
  async createDocument(doc: InsertDocument): Promise<Document> {
    const [result] = await db.insert(documents).values(doc).returning();
    return result;
  }

  async getDocuments(tenantId: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(eq(documents.tenantId, tenantId))
      .orderBy(desc(documents.createdAt));
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    const [result] = await db.select().from(documents).where(eq(documents.id, id));
    return result;
  }

  async getDocumentsByType(tenantId: string, documentType: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(and(
        eq(documents.tenantId, tenantId),
        eq(documents.documentType, documentType)
      ))
      .orderBy(desc(documents.createdAt));
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document | undefined> {
    const [result] = await db.update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return result;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documentSignatures).where(eq(documentSignatures.documentId, id));
    await db.delete(documentVersions).where(eq(documentVersions.documentId, id));
    await db.delete(documents).where(eq(documents.id, id));
  }

  // Document Versions
  async createDocumentVersion(version: InsertDocumentVersion): Promise<DocumentVersion> {
    const [result] = await db.insert(documentVersions).values(version).returning();
    return result;
  }

  async getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    return await db.select().from(documentVersions)
      .where(eq(documentVersions.documentId, documentId))
      .orderBy(desc(documentVersions.versionNumber));
  }

  // Document Signatures
  async createDocumentSignature(signature: InsertDocumentSignature): Promise<DocumentSignature> {
    const [result] = await db.insert(documentSignatures).values(signature).returning();
    return result;
  }

  async getDocumentSignatures(documentId: string): Promise<DocumentSignature[]> {
    return await db.select().from(documentSignatures)
      .where(eq(documentSignatures.documentId, documentId))
      .orderBy(desc(documentSignatures.signedAt));
  }

  // Estimator Configurations
  async getEstimatorConfig(tenantId: string): Promise<EstimatorConfig | undefined> {
    const [result] = await db.select().from(estimatorConfigs)
      .where(eq(estimatorConfigs.tenantId, tenantId));
    return result;
  }

  async createEstimatorConfig(config: InsertEstimatorConfig): Promise<EstimatorConfig> {
    const [result] = await db.insert(estimatorConfigs).values(config).returning();
    return result;
  }

  async updateEstimatorConfig(tenantId: string, updates: Partial<InsertEstimatorConfig>): Promise<EstimatorConfig | undefined> {
    const [result] = await db.update(estimatorConfigs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(estimatorConfigs.tenantId, tenantId))
      .returning();
    return result;
  }

  // ============ AI CREDITS SYSTEM ============
  
  async getTenantCredits(tenantId: string): Promise<TenantCredits | undefined> {
    const [result] = await db.select().from(tenantCredits)
      .where(eq(tenantCredits.tenantId, tenantId));
    return result;
  }

  async createTenantCredits(data: InsertTenantCredits): Promise<TenantCredits> {
    const [result] = await db.insert(tenantCredits).values(data).returning();
    return result;
  }

  async updateTenantCredits(tenantId: string, updates: Partial<InsertTenantCredits>): Promise<TenantCredits | undefined> {
    const [result] = await db.update(tenantCredits)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tenantCredits.tenantId, tenantId))
      .returning();
    return result;
  }

  async addCredits(tenantId: string, amountCents: number): Promise<TenantCredits> {
    // Get or create tenant credits
    let credits = await this.getTenantCredits(tenantId);
    if (!credits) {
      credits = await this.createTenantCredits({ tenantId, balanceCents: 0, totalPurchasedCents: 0, totalUsedCents: 0 });
    }
    
    const newBalance = (credits.balanceCents || 0) + amountCents;
    const newTotalPurchased = (credits.totalPurchasedCents || 0) + amountCents;
    
    const [result] = await db.update(tenantCredits)
      .set({ 
        balanceCents: newBalance,
        totalPurchasedCents: newTotalPurchased,
        updatedAt: new Date()
      })
      .where(eq(tenantCredits.tenantId, tenantId))
      .returning();
    return result;
  }

  async deductCredits(tenantId: string, amountCents: number): Promise<TenantCredits | undefined> {
    const credits = await this.getTenantCredits(tenantId);
    if (!credits || (credits.balanceCents || 0) < amountCents) {
      return undefined; // Insufficient credits
    }
    
    const newBalance = (credits.balanceCents || 0) - amountCents;
    const newTotalUsed = (credits.totalUsedCents || 0) + amountCents;
    
    const [result] = await db.update(tenantCredits)
      .set({ 
        balanceCents: newBalance,
        totalUsedCents: newTotalUsed,
        updatedAt: new Date()
      })
      .where(eq(tenantCredits.tenantId, tenantId))
      .returning();
    return result;
  }

  // AI Usage Logs
  async logAiUsage(data: InsertAiUsageLog): Promise<AiUsageLog> {
    const [result] = await db.insert(aiUsageLogs).values(data).returning();
    return result;
  }

  async getAiUsageLogs(tenantId: string, limit: number = 100): Promise<AiUsageLog[]> {
    return await db.select().from(aiUsageLogs)
      .where(eq(aiUsageLogs.tenantId, tenantId))
      .orderBy(desc(aiUsageLogs.createdAt))
      .limit(limit);
  }

  async getAiUsageByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<AiUsageLog[]> {
    return await db.select().from(aiUsageLogs)
      .where(and(
        eq(aiUsageLogs.tenantId, tenantId),
        sql`${aiUsageLogs.createdAt} >= ${startDate}`,
        sql`${aiUsageLogs.createdAt} <= ${endDate}`
      ))
      .orderBy(desc(aiUsageLogs.createdAt));
  }

  async getAiUsageSummary(tenantId: string): Promise<{ totalCostCents: number; actionCounts: Record<string, number> }> {
    const logs = await db.select().from(aiUsageLogs)
      .where(eq(aiUsageLogs.tenantId, tenantId));
    
    let totalCostCents = 0;
    const actionCounts: Record<string, number> = {};
    
    for (const log of logs) {
      totalCostCents += log.costCents || 0;
      const actionType = log.actionType || 'unknown';
      actionCounts[actionType] = (actionCounts[actionType] || 0) + 1;
    }
    
    return { totalCostCents, actionCounts };
  }

  // Credit Purchases
  async createCreditPurchase(data: InsertCreditPurchase): Promise<CreditPurchase> {
    const [result] = await db.insert(creditPurchases).values(data).returning();
    return result;
  }

  async getCreditPurchaseById(id: string): Promise<CreditPurchase | undefined> {
    const [result] = await db.select().from(creditPurchases).where(eq(creditPurchases.id, id));
    return result;
  }

  async getCreditPurchases(tenantId: string): Promise<CreditPurchase[]> {
    return await db.select().from(creditPurchases)
      .where(eq(creditPurchases.tenantId, tenantId))
      .orderBy(desc(creditPurchases.createdAt));
  }

  async updateCreditPurchaseStatus(id: string, status: string, paymentIntentId?: string): Promise<CreditPurchase | undefined> {
    const updates: Partial<CreditPurchase> = { paymentStatus: status };
    if (paymentIntentId) {
      updates.stripePaymentIntentId = paymentIntentId;
    }
    const [result] = await db.update(creditPurchases)
      .set(updates)
      .where(eq(creditPurchases.id, id))
      .returning();
    return result;
  }

  // Jobs (Customer Portal)
  async createJob(job: InsertJob): Promise<Job> {
    const jobNumber = `JOB-${Date.now().toString(36).toUpperCase()}`;
    const [result] = await db.insert(jobs).values({ ...job, jobNumber }).returning();
    return result;
  }

  async getJobById(id: string): Promise<Job | undefined> {
    const [result] = await db.select().from(jobs).where(eq(jobs.id, id));
    return result;
  }

  async getJobByAccessToken(token: string): Promise<Job | undefined> {
    const [result] = await db.select().from(jobs).where(eq(jobs.accessToken, token));
    return result;
  }

  async getJobs(tenantId: string): Promise<Job[]> {
    return await db.select().from(jobs)
      .where(eq(jobs.tenantId, tenantId))
      .orderBy(desc(jobs.createdAt));
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const [result] = await db.update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return result;
  }

  // Job Updates
  async createJobUpdate(update: InsertJobUpdate): Promise<JobUpdate> {
    const [result] = await db.insert(jobUpdates).values(update).returning();
    return result;
  }

  async getJobUpdates(jobId: string, visibleToCustomer?: boolean): Promise<JobUpdate[]> {
    if (visibleToCustomer !== undefined) {
      return await db.select().from(jobUpdates)
        .where(and(eq(jobUpdates.jobId, jobId), eq(jobUpdates.visibleToCustomer, visibleToCustomer)))
        .orderBy(desc(jobUpdates.createdAt));
    }
    return await db.select().from(jobUpdates)
      .where(eq(jobUpdates.jobId, jobId))
      .orderBy(desc(jobUpdates.createdAt));
  }

  // Review Requests
  async createReviewRequest(request: InsertReviewRequest): Promise<ReviewRequest> {
    const [result] = await db.insert(reviewRequests).values(request).returning();
    return result;
  }

  async getReviewRequests(tenantId: string): Promise<ReviewRequest[]> {
    return await db.select().from(reviewRequests)
      .where(eq(reviewRequests.tenantId, tenantId))
      .orderBy(desc(reviewRequests.createdAt));
  }

  async updateReviewRequest(id: string, updates: Partial<InsertReviewRequest>): Promise<ReviewRequest | undefined> {
    const [result] = await db.update(reviewRequests)
      .set(updates)
      .where(eq(reviewRequests.id, id))
      .returning();
    return result;
  }

  // Portfolio
  async createPortfolioEntry(entry: InsertPortfolioEntry): Promise<PortfolioEntry> {
    const [result] = await db.insert(portfolioEntries).values(entry).returning();
    return result;
  }

  async getPortfolioEntries(tenantId: string, publishedOnly: boolean = false): Promise<PortfolioEntry[]> {
    if (publishedOnly) {
      return await db.select().from(portfolioEntries)
        .where(and(eq(portfolioEntries.tenantId, tenantId), eq(portfolioEntries.isPublished, true)))
        .orderBy(desc(portfolioEntries.displayOrder), desc(portfolioEntries.createdAt));
    }
    return await db.select().from(portfolioEntries)
      .where(eq(portfolioEntries.tenantId, tenantId))
      .orderBy(desc(portfolioEntries.displayOrder), desc(portfolioEntries.createdAt));
  }

  async getPortfolioEntryById(id: string): Promise<PortfolioEntry | undefined> {
    const [result] = await db.select().from(portfolioEntries).where(eq(portfolioEntries.id, id));
    return result;
  }

  async updatePortfolioEntry(id: string, updates: Partial<InsertPortfolioEntry>): Promise<PortfolioEntry | undefined> {
    const [result] = await db.update(portfolioEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(portfolioEntries.id, id))
      .returning();
    return result;
  }

  async deletePortfolioEntry(id: string): Promise<void> {
    await db.delete(portfolioEntries).where(eq(portfolioEntries.id, id));
  }

  // Material Calculations
  async createMaterialCalculation(calc: InsertMaterialCalculation): Promise<MaterialCalculation> {
    const [result] = await db.insert(materialCalculations).values(calc).returning();
    return result;
  }

  async getMaterialCalculations(tenantId: string): Promise<MaterialCalculation[]> {
    return await db.select().from(materialCalculations)
      .where(eq(materialCalculations.tenantId, tenantId))
      .orderBy(desc(materialCalculations.createdAt));
  }

  async getMaterialCalculationsByLead(leadId: string): Promise<MaterialCalculation[]> {
    return await db.select().from(materialCalculations)
      .where(eq(materialCalculations.leadId, leadId));
  }

  // Lead Sources
  async createLeadSource(source: InsertLeadSource): Promise<LeadSource> {
    const [result] = await db.insert(leadSources).values(source).returning();
    return result;
  }

  async getLeadSources(tenantId: string): Promise<LeadSource[]> {
    return await db.select().from(leadSources)
      .where(eq(leadSources.tenantId, tenantId));
  }

  async updateLeadSource(id: string, updates: Partial<InsertLeadSource>): Promise<LeadSource | undefined> {
    const [result] = await db.update(leadSources).set(updates).where(eq(leadSources.id, id)).returning();
    return result;
  }

  // Warranties
  async createWarranty(warranty: InsertWarranty): Promise<Warranty> {
    const warrantyNumber = `WTY-${Date.now().toString(36).toUpperCase()}`;
    const [result] = await db.insert(warranties).values({ ...warranty, warrantyNumber }).returning();
    return result;
  }

  async getWarranties(tenantId: string): Promise<Warranty[]> {
    return await db.select().from(warranties)
      .where(eq(warranties.tenantId, tenantId))
      .orderBy(desc(warranties.createdAt));
  }

  async getWarrantyById(id: string): Promise<Warranty | undefined> {
    const [result] = await db.select().from(warranties).where(eq(warranties.id, id));
    return result;
  }

  async updateWarranty(id: string, updates: Partial<InsertWarranty>): Promise<Warranty | undefined> {
    const [result] = await db.update(warranties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(warranties.id, id))
      .returning();
    return result;
  }

  async getExpiringWarranties(tenantId: string, daysAhead: number): Promise<Warranty[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return await db.select().from(warranties)
      .where(and(
        eq(warranties.tenantId, tenantId),
        eq(warranties.status, 'active'),
        sql`${warranties.expirationDate} <= ${futureDate}`
      ));
  }

  // Follow-up Sequences
  async createFollowupSequence(sequence: InsertFollowupSequence): Promise<FollowupSequence> {
    const [result] = await db.insert(followupSequences).values(sequence).returning();
    return result;
  }

  async getFollowupSequences(tenantId: string): Promise<FollowupSequence[]> {
    return await db.select().from(followupSequences)
      .where(eq(followupSequences.tenantId, tenantId));
  }

  async createFollowupStep(step: InsertFollowupStep): Promise<FollowupStep> {
    const [result] = await db.insert(followupSteps).values(step).returning();
    return result;
  }

  async getFollowupSteps(sequenceId: string): Promise<FollowupStep[]> {
    return await db.select().from(followupSteps)
      .where(eq(followupSteps.sequenceId, sequenceId))
      .orderBy(followupSteps.stepOrder);
  }

  async createFollowupLog(log: InsertFollowupLog): Promise<FollowupLog> {
    const [result] = await db.insert(followupLogs).values(log).returning();
    return result;
  }

  async getPendingFollowupLogs(tenantId: string): Promise<FollowupLog[]> {
    return await db.select().from(followupLogs)
      .where(and(
        eq(followupLogs.tenantId, tenantId),
        eq(followupLogs.status, 'pending'),
        sql`${followupLogs.scheduledFor} <= NOW()`
      ));
  }

  async updateFollowupLog(id: string, updates: Partial<InsertFollowupLog>): Promise<FollowupLog | undefined> {
    const [result] = await db.update(followupLogs).set(updates).where(eq(followupLogs.id, id)).returning();
    return result;
  }

  // Referral Program
  async createReferralProgram(program: InsertReferralProgram): Promise<ReferralProgram> {
    const [result] = await db.insert(referralProgram).values(program).returning();
    return result;
  }

  async getReferralPrograms(tenantId: string): Promise<ReferralProgram[]> {
    return await db.select().from(referralProgram)
      .where(eq(referralProgram.tenantId, tenantId));
  }

  async getReferralByCode(code: string): Promise<ReferralProgram | undefined> {
    const [result] = await db.select().from(referralProgram)
      .where(eq(referralProgram.referralCode, code));
    return result;
  }

  async updateReferralProgram(id: string, updates: Partial<InsertReferralProgram>): Promise<ReferralProgram | undefined> {
    const [result] = await db.update(referralProgram).set(updates).where(eq(referralProgram.id, id)).returning();
    return result;
  }

  async createReferralTracking(tracking: InsertReferralTracking): Promise<ReferralTracking> {
    const [result] = await db.insert(referralTracking).values(tracking).returning();
    return result;
  }

  async getReferralTrackings(programId: string): Promise<ReferralTracking[]> {
    return await db.select().from(referralTracking)
      .where(eq(referralTracking.referralProgramId, programId));
  }

  // GPS Check-ins
  async createGpsCheckin(checkin: InsertGpsCheckin): Promise<GpsCheckin> {
    const [result] = await db.insert(gpsCheckins).values(checkin).returning();
    return result;
  }

  async getGpsCheckins(jobId: string): Promise<GpsCheckin[]> {
    return await db.select().from(gpsCheckins)
      .where(eq(gpsCheckins.jobId, jobId))
      .orderBy(desc(gpsCheckins.timestamp));
  }

  async getGpsCheckinsByMember(crewMemberId: string): Promise<GpsCheckin[]> {
    return await db.select().from(gpsCheckins)
      .where(eq(gpsCheckins.crewMemberId, crewMemberId))
      .orderBy(desc(gpsCheckins.timestamp));
  }

  // Payment Deposits
  async createPaymentDeposit(deposit: InsertPaymentDeposit): Promise<PaymentDeposit> {
    const [result] = await db.insert(paymentDeposits).values(deposit).returning();
    return result;
  }

  async getPaymentDeposits(tenantId: string): Promise<PaymentDeposit[]> {
    return await db.select().from(paymentDeposits)
      .where(eq(paymentDeposits.tenantId, tenantId))
      .orderBy(desc(paymentDeposits.createdAt));
  }

  async getPaymentDepositById(id: string): Promise<PaymentDeposit | undefined> {
    const [result] = await db.select().from(paymentDeposits).where(eq(paymentDeposits.id, id));
    return result;
  }

  async updatePaymentDeposit(id: string, updates: Partial<InsertPaymentDeposit>): Promise<PaymentDeposit | undefined> {
    const [result] = await db.update(paymentDeposits).set(updates).where(eq(paymentDeposits.id, id)).returning();
    return result;
  }

  // Job Costing
  async createJobCosting(costing: InsertJobCosting): Promise<JobCosting> {
    const [result] = await db.insert(jobCosting).values(costing).returning();
    return result;
  }

  async getJobCostingByJobId(jobId: string): Promise<JobCosting | undefined> {
    const [result] = await db.select().from(jobCosting).where(eq(jobCosting.jobId, jobId));
    return result;
  }

  async updateJobCosting(id: string, updates: Partial<InsertJobCosting>): Promise<JobCosting | undefined> {
    const [result] = await db.update(jobCosting)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobCosting.id, id))
      .returning();
    return result;
  }

  async getJobCostings(tenantId: string): Promise<JobCosting[]> {
    return await db.select().from(jobCosting).where(eq(jobCosting.tenantId, tenantId));
  }

  // Job Photos
  async createJobPhoto(photo: InsertJobPhoto): Promise<JobPhoto> {
    const [result] = await db.insert(jobPhotos).values(photo).returning();
    return result;
  }

  async getJobPhotos(jobId: string): Promise<JobPhoto[]> {
    return await db.select().from(jobPhotos)
      .where(eq(jobPhotos.jobId, jobId))
      .orderBy(desc(jobPhotos.createdAt));
  }

  async deleteJobPhoto(id: string): Promise<void> {
    await db.delete(jobPhotos).where(eq(jobPhotos.id, id));
  }

  // Inventory
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [result] = await db.insert(inventoryItems).values(item).returning();
    return result;
  }

  async getInventoryItems(tenantId: string): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).where(eq(inventoryItems.tenantId, tenantId));
  }

  async updateInventoryItem(id: string, updates: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const [result] = await db.update(inventoryItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return result;
  }

  async createInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const [result] = await db.insert(inventoryTransactions).values(transaction).returning();
    return result;
  }

  async getInventoryTransactions(tenantId: string): Promise<InventoryTransaction[]> {
    return await db.select().from(inventoryTransactions)
      .where(eq(inventoryTransactions.tenantId, tenantId))
      .orderBy(desc(inventoryTransactions.createdAt));
  }

  // Subcontractors
  async createSubcontractor(sub: InsertSubcontractor): Promise<Subcontractor> {
    const [result] = await db.insert(subcontractors).values(sub).returning();
    return result;
  }

  async getSubcontractors(tenantId: string): Promise<Subcontractor[]> {
    return await db.select().from(subcontractors).where(eq(subcontractors.tenantId, tenantId));
  }

  async updateSubcontractor(id: string, updates: Partial<InsertSubcontractor>): Promise<Subcontractor | undefined> {
    const [result] = await db.update(subcontractors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subcontractors.id, id))
      .returning();
    return result;
  }

  async createSubcontractorAssignment(assignment: InsertSubcontractorAssignment): Promise<SubcontractorAssignment> {
    const [result] = await db.insert(subcontractorAssignments).values(assignment).returning();
    return result;
  }

  async getSubcontractorAssignments(jobId: string): Promise<SubcontractorAssignment[]> {
    return await db.select().from(subcontractorAssignments)
      .where(eq(subcontractorAssignments.jobId, jobId));
  }

  // Weather Alerts
  async createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert> {
    const [result] = await db.insert(weatherAlerts).values(alert).returning();
    return result;
  }

  async getWeatherAlerts(tenantId: string): Promise<WeatherAlert[]> {
    return await db.select().from(weatherAlerts)
      .where(eq(weatherAlerts.tenantId, tenantId))
      .orderBy(desc(weatherAlerts.createdAt));
  }

  async acknowledgeWeatherAlert(id: string, acknowledgedBy: string): Promise<WeatherAlert | undefined> {
    const [result] = await db.update(weatherAlerts)
      .set({ isAcknowledged: true, acknowledgedBy, acknowledgedAt: new Date() })
      .where(eq(weatherAlerts.id, id))
      .returning();
    return result;
  }

  // Webhooks
  async createWebhookSubscription(subscription: InsertWebhookSubscription): Promise<WebhookSubscription> {
    const [result] = await db.insert(webhookSubscriptions).values(subscription).returning();
    return result;
  }

  async getWebhookSubscriptions(tenantId: string): Promise<WebhookSubscription[]> {
    return await db.select().from(webhookSubscriptions).where(eq(webhookSubscriptions.tenantId, tenantId));
  }

  async updateWebhookSubscription(id: string, updates: Partial<InsertWebhookSubscription>): Promise<WebhookSubscription | undefined> {
    const [result] = await db.update(webhookSubscriptions).set(updates).where(eq(webhookSubscriptions.id, id)).returning();
    return result;
  }

  async deleteWebhookSubscription(id: string): Promise<void> {
    await db.delete(webhookSubscriptions).where(eq(webhookSubscriptions.id, id));
  }

  async createWebhookLog(log: InsertWebhookLog): Promise<WebhookLog> {
    const [result] = await db.insert(webhookLogs).values(log).returning();
    return result;
  }

  // Trade Verticals
  async createTradeVertical(vertical: InsertTradeVertical): Promise<TradeVertical> {
    const [result] = await db.insert(tradeVerticals).values(vertical).returning();
    return result;
  }

  async getTradeVerticals(): Promise<TradeVertical[]> {
    return await db.select().from(tradeVerticals).where(eq(tradeVerticals.isActive, true));
  }

  // Franchise Reports
  async createFranchiseReport(report: InsertFranchiseReport): Promise<FranchiseReport> {
    const [result] = await db.insert(franchiseReports).values(report).returning();
    return result;
  }

  async getFranchiseReports(tenantId: string): Promise<FranchiseReport[]> {
    return await db.select().from(franchiseReports)
      .where(eq(franchiseReports.tenantId, tenantId))
      .orderBy(desc(franchiseReports.createdAt));
  }

  // Financing Plans
  async createFinancingPlan(plan: InsertFinancingPlan): Promise<FinancingPlan> {
    const [result] = await db.insert(financingPlans).values(plan).returning();
    return result;
  }

  async getFinancingPlans(tenantId: string): Promise<FinancingPlan[]> {
    return await db.select().from(financingPlans)
      .where(and(eq(financingPlans.tenantId, tenantId), eq(financingPlans.isActive, true)))
      .orderBy(financingPlans.displayOrder);
  }

  // Color Palettes
  async createColorPalette(palette: InsertColorPalette): Promise<ColorPalette> {
    const [result] = await db.insert(colorPalettes).values(palette).returning();
    return result;
  }

  async getColorPalettes(tenantId: string): Promise<ColorPalette[]> {
    return await db.select().from(colorPalettes).where(eq(colorPalettes.tenantId, tenantId));
  }

  // Calendar Exports
  async createCalendarExport(exportData: InsertCalendarExport): Promise<CalendarExport> {
    const [result] = await db.insert(calendarExports).values(exportData).returning();
    return result;
  }

  async getCalendarExportByToken(token: string): Promise<CalendarExport | undefined> {
    const [result] = await db.select().from(calendarExports)
      .where(and(eq(calendarExports.exportToken, token), eq(calendarExports.isActive, true)));
    return result;
  }

  // Google Calendar Connections
  async createGoogleCalendarConnection(connection: InsertGoogleCalendarConnection): Promise<GoogleCalendarConnection> {
    const [result] = await db.insert(googleCalendarConnections).values(connection).returning();
    return result;
  }

  async getGoogleCalendarConnections(tenantId: string): Promise<GoogleCalendarConnection[]> {
    return await db.select().from(googleCalendarConnections)
      .where(and(eq(googleCalendarConnections.tenantId, tenantId), eq(googleCalendarConnections.isActive, true)))
      .orderBy(desc(googleCalendarConnections.createdAt));
  }

  async getGoogleCalendarConnectionById(id: string): Promise<GoogleCalendarConnection | undefined> {
    const [result] = await db.select().from(googleCalendarConnections).where(eq(googleCalendarConnections.id, id));
    return result;
  }

  async updateGoogleCalendarConnection(id: string, updates: Partial<InsertGoogleCalendarConnection>): Promise<GoogleCalendarConnection | undefined> {
    const [result] = await db.update(googleCalendarConnections).set(updates).where(eq(googleCalendarConnections.id, id)).returning();
    return result;
  }

  async deleteGoogleCalendarConnection(id: string): Promise<void> {
    await db.update(googleCalendarConnections).set({ isActive: false }).where(eq(googleCalendarConnections.id, id));
  }

  // Google Local Services Ads (LSA)
  async createGoogleLsaConnection(connection: InsertGoogleLsaConnection): Promise<GoogleLsaConnection> {
    const [result] = await db.insert(googleLsaConnections).values(connection).returning();
    return result;
  }

  async getGoogleLsaConnections(tenantId: string): Promise<GoogleLsaConnection[]> {
    return await db.select().from(googleLsaConnections)
      .where(and(eq(googleLsaConnections.tenantId, tenantId), eq(googleLsaConnections.isActive, true)))
      .orderBy(desc(googleLsaConnections.createdAt));
  }

  async getGoogleLsaConnectionById(id: string): Promise<GoogleLsaConnection | undefined> {
    const [result] = await db.select().from(googleLsaConnections).where(eq(googleLsaConnections.id, id));
    return result;
  }

  async updateGoogleLsaConnection(id: string, updates: Partial<InsertGoogleLsaConnection>): Promise<GoogleLsaConnection | undefined> {
    const [result] = await db.update(googleLsaConnections).set(updates).where(eq(googleLsaConnections.id, id)).returning();
    return result;
  }

  async deleteGoogleLsaConnection(id: string): Promise<void> {
    await db.update(googleLsaConnections).set({ isActive: false }).where(eq(googleLsaConnections.id, id));
  }

  async createGoogleLsaLead(lead: InsertGoogleLsaLead): Promise<GoogleLsaLead> {
    const [result] = await db.insert(googleLsaLeads).values(lead).returning();
    return result;
  }

  async getGoogleLsaLeads(tenantId: string): Promise<GoogleLsaLead[]> {
    return await db.select().from(googleLsaLeads)
      .where(eq(googleLsaLeads.tenantId, tenantId))
      .orderBy(desc(googleLsaLeads.importedAt));
  }

  async getGoogleLsaLeadByGoogleId(googleLeadId: string): Promise<GoogleLsaLead | undefined> {
    const [result] = await db.select().from(googleLsaLeads).where(eq(googleLsaLeads.googleLeadId, googleLeadId));
    return result;
  }

  async updateGoogleLsaLead(id: string, updates: Partial<InsertGoogleLsaLead>): Promise<GoogleLsaLead | undefined> {
    const [result] = await db.update(googleLsaLeads).set(updates).where(eq(googleLsaLeads.id, id)).returning();
    return result;
  }

  // Self-Scheduling
  async createSchedulingSlot(slot: InsertSchedulingSlot): Promise<SchedulingSlot> {
    const [result] = await db.insert(schedulingSlots).values(slot).returning();
    return result;
  }

  async getSchedulingSlots(tenantId: string, date?: Date): Promise<SchedulingSlot[]> {
    if (date) {
      return await db.select().from(schedulingSlots)
        .where(and(eq(schedulingSlots.tenantId, tenantId), eq(schedulingSlots.isAvailable, true)));
    }
    return await db.select().from(schedulingSlots)
      .where(and(eq(schedulingSlots.tenantId, tenantId), eq(schedulingSlots.isAvailable, true)));
  }

  async createCustomerBooking(booking: InsertCustomerBooking): Promise<CustomerBooking> {
    const [result] = await db.insert(customerBookings).values(booking).returning();
    return result;
  }

  async getCustomerBookings(tenantId: string): Promise<CustomerBooking[]> {
    return await db.select().from(customerBookings)
      .where(eq(customerBookings.tenantId, tenantId))
      .orderBy(desc(customerBookings.createdAt));
  }

  async updateSchedulingSlot(id: string, updates: Partial<InsertSchedulingSlot>): Promise<SchedulingSlot | undefined> {
    const [result] = await db.update(schedulingSlots).set(updates).where(eq(schedulingSlots.id, id)).returning();
    return result;
  }

  // Photo Analysis
  async createPhotoAnalysis(analysis: InsertPhotoAnalysis): Promise<PhotoAnalysis> {
    const [result] = await db.insert(photoAnalyses).values(analysis).returning();
    return result;
  }

  async getPhotoAnalyses(tenantId: string): Promise<PhotoAnalysis[]> {
    return await db.select().from(photoAnalyses)
      .where(eq(photoAnalyses.tenantId, tenantId))
      .orderBy(desc(photoAnalyses.createdAt));
  }

  // Live Chat
  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const [result] = await db.insert(chatSessions).values(session).returning();
    return result;
  }

  async getChatSessions(tenantId: string): Promise<ChatSession[]> {
    return await db.select().from(chatSessions)
      .where(eq(chatSessions.tenantId, tenantId))
      .orderBy(desc(chatSessions.startedAt));
  }

  async updateChatSession(id: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined> {
    const [result] = await db.update(chatSessions).set(updates).where(eq(chatSessions.id, id)).returning();
    return result;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [result] = await db.insert(chatMessages).values(message).returning();
    return result;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  // Call Tracking
  async createCallTrackingNumber(tracking: InsertCallTrackingNumber): Promise<CallTrackingNumber> {
    const [result] = await db.insert(callTrackingNumbers).values(tracking).returning();
    return result;
  }

  async getCallTrackingNumbers(tenantId: string): Promise<CallTrackingNumber[]> {
    return await db.select().from(callTrackingNumbers).where(eq(callTrackingNumbers.tenantId, tenantId));
  }

  async createCallLog(log: InsertCallLog): Promise<CallLog> {
    const [result] = await db.insert(callLogs).values(log).returning();
    return result;
  }

  async getCallLogs(tenantId: string): Promise<CallLog[]> {
    return await db.select().from(callLogs)
      .where(eq(callLogs.tenantId, tenantId))
      .orderBy(desc(callLogs.calledAt));
  }

  // Review Management
  async createReviewResponse(review: InsertReviewResponse): Promise<ReviewResponse> {
    const [result] = await db.insert(reviewResponses).values(review).returning();
    return result;
  }

  async getReviewResponses(tenantId: string): Promise<ReviewResponse[]> {
    return await db.select().from(reviewResponses)
      .where(eq(reviewResponses.tenantId, tenantId))
      .orderBy(desc(reviewResponses.createdAt));
  }

  async updateReviewResponse(id: string, updates: Partial<InsertReviewResponse>): Promise<ReviewResponse | undefined> {
    const [result] = await db.update(reviewResponses).set(updates).where(eq(reviewResponses.id, id)).returning();
    return result;
  }

  // NPS Surveys
  async createNpsSurvey(survey: InsertNpsSurvey): Promise<NpsSurvey> {
    const [result] = await db.insert(npsSurveys).values(survey).returning();
    return result;
  }

  async getNpsSurveys(tenantId: string): Promise<NpsSurvey[]> {
    return await db.select().from(npsSurveys)
      .where(eq(npsSurveys.tenantId, tenantId))
      .orderBy(desc(npsSurveys.createdAt));
  }

  async updateNpsSurvey(id: string, updates: Partial<InsertNpsSurvey>): Promise<NpsSurvey | undefined> {
    const [result] = await db.update(npsSurveys).set(updates).where(eq(npsSurveys.id, id)).returning();
    return result;
  }

  // Crew Gamification
  async createCrewLeaderboard(entry: InsertCrewLeaderboard): Promise<CrewLeaderboard> {
    const [result] = await db.insert(crewLeaderboards).values(entry).returning();
    return result;
  }

  async getCrewLeaderboards(tenantId: string, period?: string): Promise<CrewLeaderboard[]> {
    if (period) {
      return await db.select().from(crewLeaderboards)
        .where(and(eq(crewLeaderboards.tenantId, tenantId), eq(crewLeaderboards.period, period)))
        .orderBy(crewLeaderboards.rank);
    }
    return await db.select().from(crewLeaderboards)
      .where(eq(crewLeaderboards.tenantId, tenantId))
      .orderBy(crewLeaderboards.rank);
  }

  async createCrewAchievement(achievement: InsertCrewAchievement): Promise<CrewAchievement> {
    const [result] = await db.insert(crewAchievements).values(achievement).returning();
    return result;
  }

  async getCrewAchievements(crewMemberId: string): Promise<CrewAchievement[]> {
    return await db.select().from(crewAchievements)
      .where(eq(crewAchievements.crewMemberId, crewMemberId))
      .orderBy(desc(crewAchievements.earnedAt));
  }

  // Geofencing
  async createJobGeofence(geofence: InsertJobGeofence): Promise<JobGeofence> {
    const [result] = await db.insert(jobGeofences).values(geofence).returning();
    return result;
  }

  async getJobGeofence(jobId: string): Promise<JobGeofence | undefined> {
    const [result] = await db.select().from(jobGeofences).where(eq(jobGeofences.jobId, jobId));
    return result;
  }

  async createGeofenceEvent(event: InsertGeofenceEvent): Promise<GeofenceEvent> {
    const [result] = await db.insert(geofenceEvents).values(event).returning();
    return result;
  }

  async getGeofenceEvents(crewMemberId: string): Promise<GeofenceEvent[]> {
    return await db.select().from(geofenceEvents)
      .where(eq(geofenceEvents.crewMemberId, crewMemberId))
      .orderBy(desc(geofenceEvents.triggeredAt));
  }

  // Revenue Predictions
  async createRevenuePrediction(prediction: InsertRevenuePrediction): Promise<RevenuePrediction> {
    const [result] = await db.insert(revenuePredictions).values(prediction).returning();
    return result;
  }

  async getRevenuePredictions(tenantId: string): Promise<RevenuePrediction[]> {
    return await db.select().from(revenuePredictions)
      .where(eq(revenuePredictions.tenantId, tenantId))
      .orderBy(desc(revenuePredictions.periodStart));
  }

  // Marketing Attribution
  async createMarketingChannel(channel: InsertMarketingChannel): Promise<MarketingChannel> {
    const [result] = await db.insert(marketingChannels).values(channel).returning();
    return result;
  }

  async getMarketingChannels(tenantId: string): Promise<MarketingChannel[]> {
    return await db.select().from(marketingChannels).where(eq(marketingChannels.tenantId, tenantId));
  }

  async createMarketingAttribution(attribution: InsertMarketingAttribution): Promise<MarketingAttribution> {
    const [result] = await db.insert(marketingAttribution).values(attribution).returning();
    return result;
  }

  async getMarketingAttributions(tenantId: string): Promise<MarketingAttribution[]> {
    return await db.select().from(marketingAttribution)
      .where(eq(marketingAttribution.tenantId, tenantId))
      .orderBy(desc(marketingAttribution.periodStart));
  }

  // Accounting Export
  async createAccountingExport(exportData: InsertAccountingExport): Promise<AccountingExport> {
    const [result] = await db.insert(accountingExports).values(exportData).returning();
    return result;
  }

  async getAccountingExports(tenantId: string): Promise<AccountingExport[]> {
    return await db.select().from(accountingExports)
      .where(eq(accountingExports.tenantId, tenantId))
      .orderBy(desc(accountingExports.createdAt));
  }

  // AI Proposals
  async createAiProposal(proposal: InsertAiProposal): Promise<AiProposal> {
    const [result] = await db.insert(aiProposals).values(proposal).returning();
    return result;
  }
  async getAiProposals(tenantId: string): Promise<AiProposal[]> {
    return await db.select().from(aiProposals).where(eq(aiProposals.tenantId, tenantId)).orderBy(desc(aiProposals.createdAt));
  }
  async updateAiProposal(id: string, updates: Partial<InsertAiProposal>): Promise<AiProposal | undefined> {
    const [result] = await db.update(aiProposals).set(updates).where(eq(aiProposals.id, id)).returning();
    return result;
  }

  // Lead Scoring
  async createLeadScore(score: InsertLeadScore): Promise<LeadScore> {
    const [result] = await db.insert(leadScores).values(score).returning();
    return result;
  }
  async getLeadScores(tenantId: string): Promise<LeadScore[]> {
    return await db.select().from(leadScores).where(eq(leadScores.tenantId, tenantId)).orderBy(desc(leadScores.score));
  }
  async getLeadScore(leadId: string): Promise<LeadScore | undefined> {
    const [result] = await db.select().from(leadScores).where(eq(leadScores.leadId, leadId));
    return result;
  }
  async updateLeadScore(id: string, updates: Partial<InsertLeadScore>): Promise<LeadScore | undefined> {
    const [result] = await db.update(leadScores).set(updates).where(eq(leadScores.id, id)).returning();
    return result;
  }

  // Voice Estimates
  async createVoiceEstimate(estimate: InsertVoiceEstimate): Promise<VoiceEstimate> {
    const [result] = await db.insert(voiceEstimates).values(estimate).returning();
    return result;
  }
  async getVoiceEstimates(tenantId: string): Promise<VoiceEstimate[]> {
    return await db.select().from(voiceEstimates).where(eq(voiceEstimates.tenantId, tenantId)).orderBy(desc(voiceEstimates.createdAt));
  }

  // Follow-up Optimization
  async createFollowupOptimization(optimization: InsertFollowupOptimization): Promise<FollowupOptimization> {
    const [result] = await db.insert(followupOptimizations).values(optimization).returning();
    return result;
  }
  async getFollowupOptimizations(tenantId: string): Promise<FollowupOptimization[]> {
    return await db.select().from(followupOptimizations).where(eq(followupOptimizations.tenantId, tenantId)).orderBy(desc(followupOptimizations.createdAt));
  }

  // Customer Portal
  async createCustomerPortal(portal: InsertCustomerPortal): Promise<CustomerPortal> {
    const [result] = await db.insert(customerPortals).values(portal).returning();
    return result;
  }
  async getCustomerPortalByToken(token: string): Promise<CustomerPortal | undefined> {
    const [result] = await db.select().from(customerPortals).where(eq(customerPortals.accessToken, token));
    return result;
  }
  async updateCustomerPortal(id: string, updates: Partial<InsertCustomerPortal>): Promise<CustomerPortal | undefined> {
    const [result] = await db.update(customerPortals).set(updates).where(eq(customerPortals.id, id)).returning();
    return result;
  }

  // Crew Locations
  async upsertCrewLocation(location: InsertCrewLocation): Promise<CrewLocation> {
    const [result] = await db.insert(crewLocations).values(location).returning();
    return result;
  }
  async getCrewLocations(tenantId: string): Promise<CrewLocation[]> {
    return await db.select().from(crewLocations).where(eq(crewLocations.tenantId, tenantId));
  }
  async getCrewLocationByJob(jobId: string): Promise<CrewLocation[]> {
    return await db.select().from(crewLocations).where(eq(crewLocations.jobId, jobId));
  }

  // Crew Tips
  async createCrewTip(tip: InsertCrewTip): Promise<CrewTip> {
    const [result] = await db.insert(crewTips).values(tip).returning();
    return result;
  }
  async getCrewTips(tenantId: string): Promise<CrewTip[]> {
    return await db.select().from(crewTips).where(eq(crewTips.tenantId, tenantId)).orderBy(desc(crewTips.createdAt));
  }
  async updateCrewTip(id: string, updates: Partial<InsertCrewTip>): Promise<CrewTip | undefined> {
    const [result] = await db.update(crewTips).set(updates).where(eq(crewTips.id, id)).returning();
    return result;
  }

  // Portfolio Gallery
  async createPortfolioGallery(gallery: InsertPortfolioGallery): Promise<PortfolioGallery> {
    const [result] = await db.insert(portfolioGalleries).values(gallery).returning();
    return result;
  }
  async getPortfolioGalleries(tenantId: string): Promise<PortfolioGallery[]> {
    return await db.select().from(portfolioGalleries).where(eq(portfolioGalleries.tenantId, tenantId)).orderBy(desc(portfolioGalleries.createdAt));
  }
  async getPublicGalleries(tenantId: string): Promise<PortfolioGallery[]> {
    return await db.select().from(portfolioGalleries).where(and(eq(portfolioGalleries.tenantId, tenantId), eq(portfolioGalleries.isPublic, true))).orderBy(desc(portfolioGalleries.createdAt));
  }
  async updatePortfolioGallery(id: string, updates: Partial<InsertPortfolioGallery>): Promise<PortfolioGallery | undefined> {
    const [result] = await db.update(portfolioGalleries).set(updates).where(eq(portfolioGalleries.id, id)).returning();
    return result;
  }

  // Profit Analysis
  async createProfitAnalysis(analysis: InsertProfitAnalysis): Promise<ProfitAnalysis> {
    const [result] = await db.insert(profitAnalyses).values(analysis).returning();
    return result;
  }
  async getProfitAnalyses(tenantId: string): Promise<ProfitAnalysis[]> {
    return await db.select().from(profitAnalyses).where(eq(profitAnalyses.tenantId, tenantId)).orderBy(desc(profitAnalyses.createdAt));
  }

  // Demand Forecasts
  async createDemandForecast(forecast: InsertDemandForecast): Promise<DemandForecast> {
    const [result] = await db.insert(demandForecasts).values(forecast).returning();
    return result;
  }
  async getDemandForecasts(tenantId: string): Promise<DemandForecast[]> {
    return await db.select().from(demandForecasts).where(eq(demandForecasts.tenantId, tenantId)).orderBy(desc(demandForecasts.forecastMonth));
  }

  // Customer Lifetime Value
  async createCustomerLifetimeValue(clv: InsertCustomerLifetimeValue): Promise<CustomerLifetimeValue> {
    const [result] = await db.insert(customerLifetimeValues).values(clv).returning();
    return result;
  }
  async getCustomerLifetimeValues(tenantId: string): Promise<CustomerLifetimeValue[]> {
    return await db.select().from(customerLifetimeValues).where(eq(customerLifetimeValues.tenantId, tenantId)).orderBy(desc(customerLifetimeValues.totalRevenue));
  }
  async getCustomerLifetimeValue(customerEmail: string): Promise<CustomerLifetimeValue | undefined> {
    const [result] = await db.select().from(customerLifetimeValues).where(eq(customerLifetimeValues.customerEmail, customerEmail));
    return result;
  }
  async updateCustomerLifetimeValue(id: string, updates: Partial<InsertCustomerLifetimeValue>): Promise<CustomerLifetimeValue | undefined> {
    const [result] = await db.update(customerLifetimeValues).set(updates).where(eq(customerLifetimeValues.id, id)).returning();
    return result;
  }

  // Competitor Data
  async createCompetitorData(data: InsertCompetitorData): Promise<CompetitorData> {
    const [result] = await db.insert(competitorData).values(data).returning();
    return result;
  }
  async getCompetitorData(tenantId: string): Promise<CompetitorData[]> {
    return await db.select().from(competitorData).where(eq(competitorData.tenantId, tenantId));
  }
  async updateCompetitorData(id: string, updates: Partial<InsertCompetitorData>): Promise<CompetitorData | undefined> {
    const [result] = await db.update(competitorData).set(updates).where(eq(competitorData.id, id)).returning();
    return result;
  }

  // Smart Contracts
  async createSmartContract(contract: InsertSmartContract): Promise<SmartContract> {
    const [result] = await db.insert(smartContracts).values(contract).returning();
    return result;
  }
  async getSmartContracts(tenantId: string): Promise<SmartContract[]> {
    return await db.select().from(smartContracts).where(eq(smartContracts.tenantId, tenantId)).orderBy(desc(smartContracts.createdAt));
  }
  async getSmartContract(id: string): Promise<SmartContract | undefined> {
    const [result] = await db.select().from(smartContracts).where(eq(smartContracts.id, id));
    return result;
  }
  async updateSmartContract(id: string, updates: Partial<InsertSmartContract>): Promise<SmartContract | undefined> {
    const [result] = await db.update(smartContracts).set(updates).where(eq(smartContracts.id, id)).returning();
    return result;
  }

  // AR Color Previews
  async createArColorPreview(preview: InsertArColorPreview): Promise<ArColorPreview> {
    const [result] = await db.insert(arColorPreviews).values(preview).returning();
    return result;
  }
  async getArColorPreviews(tenantId: string): Promise<ArColorPreview[]> {
    return await db.select().from(arColorPreviews).where(eq(arColorPreviews.tenantId, tenantId)).orderBy(desc(arColorPreviews.createdAt));
  }

  // Crew Skills
  async createCrewSkill(skill: InsertCrewSkill): Promise<CrewSkill> {
    const [result] = await db.insert(crewSkills).values(skill).returning();
    return result;
  }
  async getCrewSkills(crewMemberId: string): Promise<CrewSkill[]> {
    return await db.select().from(crewSkills).where(eq(crewSkills.crewMemberId, crewMemberId));
  }
  async getAllCrewSkills(tenantId: string): Promise<CrewSkill[]> {
    return await db.select().from(crewSkills).where(eq(crewSkills.tenantId, tenantId));
  }

  // Skill Matching
  async createSkillMatching(matching: InsertSkillMatching): Promise<SkillMatching> {
    const [result] = await db.insert(skillMatchings).values(matching).returning();
    return result;
  }
  async getSkillMatchings(tenantId: string): Promise<SkillMatching[]> {
    return await db.select().from(skillMatchings).where(eq(skillMatchings.tenantId, tenantId)).orderBy(desc(skillMatchings.createdAt));
  }
  async getSkillMatchingByJob(jobId: string): Promise<SkillMatching | undefined> {
    const [result] = await db.select().from(skillMatchings).where(eq(skillMatchings.jobId, jobId));
    return result;
  }

  // Route Optimization
  async createRouteOptimization(route: InsertRouteOptimization): Promise<RouteOptimization> {
    const [result] = await db.insert(routeOptimizations).values(route).returning();
    return result;
  }
  async getRouteOptimizations(tenantId: string): Promise<RouteOptimization[]> {
    return await db.select().from(routeOptimizations).where(eq(routeOptimizations.tenantId, tenantId)).orderBy(desc(routeOptimizations.routeDate));
  }

  // Job Risk Scores
  async createJobRiskScore(risk: InsertJobRiskScore): Promise<JobRiskScore> {
    const [result] = await db.insert(jobRiskScores).values(risk).returning();
    return result;
  }
  async getJobRiskScores(tenantId: string): Promise<JobRiskScore[]> {
    return await db.select().from(jobRiskScores).where(eq(jobRiskScores.tenantId, tenantId)).orderBy(desc(jobRiskScores.overallRisk));
  }
  async getJobRiskScore(jobId: string): Promise<JobRiskScore | undefined> {
    const [result] = await db.select().from(jobRiskScores).where(eq(jobRiskScores.jobId, jobId));
    return result;
  }

  // Materials Orders
  async createMaterialsOrder(order: InsertMaterialsOrder): Promise<MaterialsOrder> {
    const [result] = await db.insert(materialsOrders).values(order).returning();
    return result;
  }
  async getMaterialsOrders(tenantId: string): Promise<MaterialsOrder[]> {
    return await db.select().from(materialsOrders).where(eq(materialsOrders.tenantId, tenantId)).orderBy(desc(materialsOrders.createdAt));
  }
  async updateMaterialsOrder(id: string, updates: Partial<InsertMaterialsOrder>): Promise<MaterialsOrder | undefined> {
    const [result] = await db.update(materialsOrders).set(updates).where(eq(materialsOrders.id, id)).returning();
    return result;
  }

  // Cashflow Forecasts
  async createCashflowForecast(forecast: InsertCashflowForecast): Promise<CashflowForecast> {
    const [result] = await db.insert(cashflowForecasts).values(forecast).returning();
    return result;
  }
  async getCashflowForecasts(tenantId: string): Promise<CashflowForecast[]> {
    return await db.select().from(cashflowForecasts).where(eq(cashflowForecasts.tenantId, tenantId)).orderBy(desc(cashflowForecasts.createdAt));
  }

  // Pricing Analysis
  async createPricingAnalysis(analysis: InsertPricingAnalysis): Promise<PricingAnalysis> {
    const [result] = await db.insert(pricingAnalyses).values(analysis).returning();
    return result;
  }
  async getPricingAnalyses(tenantId: string): Promise<PricingAnalysis[]> {
    return await db.select().from(pricingAnalyses).where(eq(pricingAnalyses.tenantId, tenantId)).orderBy(desc(pricingAnalyses.analyzedAt));
  }

  // Marketing Optimization
  async createMarketingOptimization(opt: InsertMarketingOptimization): Promise<MarketingOptimization> {
    const [result] = await db.insert(marketingOptimizations).values(opt).returning();
    return result;
  }
  async getMarketingOptimizations(tenantId: string): Promise<MarketingOptimization[]> {
    return await db.select().from(marketingOptimizations).where(eq(marketingOptimizations.tenantId, tenantId)).orderBy(desc(marketingOptimizations.createdAt));
  }

  // Site Scans
  async createSiteScan(scan: InsertSiteScan): Promise<SiteScan> {
    const [result] = await db.insert(siteScans).values(scan).returning();
    return result;
  }
  async getSiteScans(tenantId: string): Promise<SiteScan[]> {
    return await db.select().from(siteScans).where(eq(siteScans.tenantId, tenantId)).orderBy(desc(siteScans.createdAt));
  }
  async updateSiteScan(id: string, updates: Partial<InsertSiteScan>): Promise<SiteScan | undefined> {
    const [result] = await db.update(siteScans).set(updates).where(eq(siteScans.id, id)).returning();
    return result;
  }

  // AR Overlays
  async createArOverlay(overlay: InsertArOverlay): Promise<ArOverlay> {
    const [result] = await db.insert(arOverlays).values(overlay).returning();
    return result;
  }
  async getArOverlays(tenantId: string): Promise<ArOverlay[]> {
    return await db.select().from(arOverlays).where(eq(arOverlays.tenantId, tenantId)).orderBy(desc(arOverlays.createdAt));
  }

  // Auto Invoices
  async createAutoInvoice(invoice: InsertAutoInvoice): Promise<AutoInvoice> {
    const [result] = await db.insert(autoInvoices).values(invoice).returning();
    return result;
  }
  async getAutoInvoices(tenantId: string): Promise<AutoInvoice[]> {
    return await db.select().from(autoInvoices).where(eq(autoInvoices.tenantId, tenantId)).orderBy(desc(autoInvoices.createdAt));
  }
  async updateAutoInvoice(id: string, updates: Partial<InsertAutoInvoice>): Promise<AutoInvoice | undefined> {
    const [result] = await db.update(autoInvoices).set(updates).where(eq(autoInvoices.id, id)).returning();
    return result;
  }

  // Lien Waivers
  async createLienWaiver(waiver: InsertLienWaiver): Promise<LienWaiver> {
    const [result] = await db.insert(lienWaivers).values(waiver).returning();
    return result;
  }
  async getLienWaivers(tenantId: string): Promise<LienWaiver[]> {
    return await db.select().from(lienWaivers).where(eq(lienWaivers.tenantId, tenantId)).orderBy(desc(lienWaivers.createdAt));
  }
  async updateLienWaiver(id: string, updates: Partial<InsertLienWaiver>): Promise<LienWaiver | undefined> {
    const [result] = await db.update(lienWaivers).set(updates).where(eq(lienWaivers.id, id)).returning();
    return result;
  }

  // Compliance Deadlines
  async createComplianceDeadline(deadline: InsertComplianceDeadline): Promise<ComplianceDeadline> {
    const [result] = await db.insert(complianceDeadlines).values(deadline).returning();
    return result;
  }
  async getComplianceDeadlines(tenantId: string): Promise<ComplianceDeadline[]> {
    return await db.select().from(complianceDeadlines).where(eq(complianceDeadlines.tenantId, tenantId)).orderBy(complianceDeadlines.dueDate);
  }
  async updateComplianceDeadline(id: string, updates: Partial<InsertComplianceDeadline>): Promise<ComplianceDeadline | undefined> {
    const [result] = await db.update(complianceDeadlines).set(updates).where(eq(complianceDeadlines.id, id)).returning();
    return result;
  }

  // Reconciliation Records
  async createReconciliationRecord(record: InsertReconciliationRecord): Promise<ReconciliationRecord> {
    const [result] = await db.insert(reconciliationRecords).values(record).returning();
    return result;
  }
  async getReconciliationRecords(tenantId: string): Promise<ReconciliationRecord[]> {
    return await db.select().from(reconciliationRecords).where(eq(reconciliationRecords.tenantId, tenantId)).orderBy(desc(reconciliationRecords.createdAt));
  }

  // Subcontractor Profiles
  async createSubcontractorProfile(profile: InsertSubcontractorProfile): Promise<SubcontractorProfile> {
    const [result] = await db.insert(subcontractorProfiles).values(profile).returning();
    return result;
  }
  async getSubcontractorProfiles(tenantId: string): Promise<SubcontractorProfile[]> {
    return await db.select().from(subcontractorProfiles).where(eq(subcontractorProfiles.tenantId, tenantId)).orderBy(desc(subcontractorProfiles.overallRating));
  }
  async updateSubcontractorProfile(id: string, updates: Partial<InsertSubcontractorProfile>): Promise<SubcontractorProfile | undefined> {
    const [result] = await db.update(subcontractorProfiles).set(updates).where(eq(subcontractorProfiles.id, id)).returning();
    return result;
  }

  // Shift Bids
  async createShiftBid(bid: InsertShiftBid): Promise<ShiftBid> {
    const [result] = await db.insert(shiftBids).values(bid).returning();
    return result;
  }
  async getShiftBids(tenantId: string): Promise<ShiftBid[]> {
    return await db.select().from(shiftBids).where(eq(shiftBids.tenantId, tenantId)).orderBy(desc(shiftBids.createdAt));
  }
  async updateShiftBid(id: string, updates: Partial<InsertShiftBid>): Promise<ShiftBid | undefined> {
    const [result] = await db.update(shiftBids).set(updates).where(eq(shiftBids.id, id)).returning();
    return result;
  }

  // Bid Submissions
  async createBidSubmission(submission: InsertBidSubmission): Promise<BidSubmission> {
    const [result] = await db.insert(bidSubmissions).values(submission).returning();
    return result;
  }
  async getBidSubmissions(shiftBidId: string): Promise<BidSubmission[]> {
    return await db.select().from(bidSubmissions).where(eq(bidSubmissions.shiftBidId, shiftBidId)).orderBy(bidSubmissions.bidAmount);
  }

  // Customer Sentiments
  async createCustomerSentiment(sentiment: InsertCustomerSentiment): Promise<CustomerSentiment> {
    const [result] = await db.insert(customerSentiments).values(sentiment).returning();
    return result;
  }
  async getCustomerSentiments(tenantId: string): Promise<CustomerSentiment[]> {
    return await db.select().from(customerSentiments).where(eq(customerSentiments.tenantId, tenantId)).orderBy(desc(customerSentiments.analyzedAt));
  }

  // Milestone NFTs
  async createMilestoneNft(nft: InsertMilestoneNft): Promise<MilestoneNft> {
    const [result] = await db.insert(milestoneNfts).values(nft).returning();
    return result;
  }
  async getMilestoneNfts(tenantId: string): Promise<MilestoneNft[]> {
    return await db.select().from(milestoneNfts).where(eq(milestoneNfts.tenantId, tenantId)).orderBy(desc(milestoneNfts.createdAt));
  }
  async updateMilestoneNft(id: string, updates: Partial<InsertMilestoneNft>): Promise<MilestoneNft | undefined> {
    const [result] = await db.update(milestoneNfts).set(updates).where(eq(milestoneNfts.id, id)).returning();
    return result;
  }

  // ESG Tracking
  async createEsgTracking(esg: InsertEsgTracking): Promise<EsgTracking> {
    const [result] = await db.insert(esgTracking).values(esg).returning();
    return result;
  }
  async getEsgTracking(tenantId: string): Promise<EsgTracking[]> {
    return await db.select().from(esgTracking).where(eq(esgTracking.tenantId, tenantId)).orderBy(desc(esgTracking.createdAt));
  }

  // Financing Applications
  async createFinancingApplication(app: InsertFinancingApplication): Promise<FinancingApplication> {
    const [result] = await db.insert(financingApplications).values(app).returning();
    return result;
  }
  async getFinancingApplications(tenantId: string): Promise<FinancingApplication[]> {
    return await db.select().from(financingApplications).where(eq(financingApplications.tenantId, tenantId)).orderBy(desc(financingApplications.createdAt));
  }
  async updateFinancingApplication(id: string, updates: Partial<InsertFinancingApplication>): Promise<FinancingApplication | undefined> {
    const [result] = await db.update(financingApplications).set(updates).where(eq(financingApplications.id, id)).returning();
    return result;
  }

  // Franchise Analytics
  async createFranchiseAnalytics(analytics: InsertFranchiseAnalytics): Promise<FranchiseAnalytics> {
    const [result] = await db.insert(franchiseAnalytics).values(analytics).returning();
    return result;
  }
  async getFranchiseAnalytics(tenantId: string): Promise<FranchiseAnalytics[]> {
    return await db.select().from(franchiseAnalytics).where(eq(franchiseAnalytics.tenantId, tenantId)).orderBy(desc(franchiseAnalytics.generatedAt));
  }
}

export const storage = new DatabaseStorage();
