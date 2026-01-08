import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CrmDeal, CrewLead } from "@shared/schema";
import { format } from "date-fns";
import { 
  DollarSign, Plus, ChevronRight, Edit2, Trash2, X, Check,
  TrendingUp, AlertCircle, Clock, Trophy, XCircle, Briefcase,
  CalendarCheck, Play, Wrench, CheckCircle2, Users, FileText,
  ArrowRightCircle, Calendar, MapPin, Receipt, User
} from "lucide-react";

const SALES_STAGES = [
  { id: "new_lead", label: "New Lead", color: "bg-blue-500", textColor: "text-blue-400", icon: Clock },
  { id: "quoted", label: "Quoted", color: "bg-purple-500", textColor: "text-purple-400", icon: TrendingUp },
  { id: "negotiating", label: "Negotiating", color: "bg-amber-500", textColor: "text-amber-400", icon: AlertCircle },
  { id: "won", label: "Won", color: "bg-green-500", textColor: "text-green-400", icon: Trophy },
  { id: "lost", label: "Lost", color: "bg-red-500", textColor: "text-red-400", icon: XCircle },
];

const JOBS_STAGES = [
  { id: "project_accepted", label: "Project Accepted", shortLabel: "Accepted", color: "bg-blue-500", textColor: "text-blue-400", icon: Briefcase },
  { id: "scheduled", label: "Scheduled", shortLabel: "Scheduled", color: "bg-purple-500", textColor: "text-purple-400", icon: CalendarCheck },
  { id: "in_progress", label: "In Progress", shortLabel: "In Progress", color: "bg-amber-500", textColor: "text-amber-400", icon: Play },
  { id: "touch_ups", label: "Touch-ups Needed", shortLabel: "Touch-ups", color: "bg-orange-500", textColor: "text-orange-400", icon: Wrench },
  { id: "complete", label: "Complete", shortLabel: "Complete", color: "bg-green-500", textColor: "text-green-400", icon: CheckCircle2 },
];

type PipelineMode = "sales" | "jobs";

interface JobDetails {
  crewLeadId: string;
  crewLeadName: string;
  jobStartDate: string;
  jobEndDate: string;
  invoiceNumber: string;
  jobAddress: string;
}

interface DealsPipelineProps {
  accentColor?: string;
  defaultMode?: PipelineMode;
}

export function DealsPipeline({ accentColor = "accent", defaultMode }: DealsPipelineProps) {
  const [pipelineMode, setPipelineMode] = useState<PipelineMode>(() => {
    if (defaultMode) return defaultMode;
    const saved = localStorage.getItem("pipeline-mode");
    return (saved as PipelineMode) || "sales";
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<CrmDeal | null>(null);
  const [newDeal, setNewDeal] = useState({ title: "", value: "", stage: "" });
  const [convertingDeal, setConvertingDeal] = useState<CrmDeal | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    crewLeadId: "",
    crewLeadName: "",
    jobStartDate: "",
    jobEndDate: "",
    invoiceNumber: "",
    jobAddress: "",
  });
  const [viewingJob, setViewingJob] = useState<CrmDeal | null>(null);
  
  const queryClient = useQueryClient();

  const STAGES = pipelineMode === "sales" ? SALES_STAGES : JOBS_STAGES;

  useEffect(() => {
    localStorage.setItem("pipeline-mode", pipelineMode);
    setNewDeal(prev => ({ ...prev, stage: STAGES[0].id }));
  }, [pipelineMode]);

  const { data: deals = [], isLoading } = useQuery<CrmDeal[]>({
    queryKey: ["/api/crm/deals"],
    queryFn: async () => {
      const res = await fetch("/api/crm/deals");
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json();
    },
  });

  const { data: crewLeads = [] } = useQuery<CrewLead[]>({
    queryKey: ["/api/crew/leads"],
    queryFn: async () => {
      const res = await fetch("/api/crew/leads");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: pipelineSummary = [] } = useQuery<{ stage: string; count: number; totalValue: string }[]>({
    queryKey: ["/api/crm/deals/pipeline/summary"],
    queryFn: async () => {
      const res = await fetch("/api/crm/deals/pipeline/summary");
      if (!res.ok) throw new Error("Failed to fetch pipeline summary");
      return res.json();
    },
  });

  const createDealMutation = useMutation({
    mutationFn: async (deal: { title: string; value: string; stage: string; pipelineType?: string }) => {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...deal, pipelineType: pipelineMode }),
      });
      if (!res.ok) throw new Error("Failed to create deal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals/pipeline/summary"] });
      setShowAddForm(false);
      setNewDeal({ title: "", value: "", stage: STAGES[0].id });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CrmDeal> }) => {
      const res = await fetch(`/api/crm/deals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update deal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals/pipeline/summary"] });
      setEditingDeal(null);
      setViewingJob(null);
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/crm/deals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete deal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals/pipeline/summary"] });
    },
  });

  const convertToJobMutation = useMutation({
    mutationFn: async ({ dealId, jobData }: { dealId: string; jobData: JobDetails }) => {
      const res = await fetch(`/api/crm/deals/${dealId}/convert-to-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      if (!res.ok) throw new Error("Failed to convert deal to job");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals/pipeline/summary"] });
      setConvertingDeal(null);
      setJobDetails({
        crewLeadId: "",
        crewLeadName: "",
        jobStartDate: "",
        jobEndDate: "",
        invoiceNumber: "",
        jobAddress: "",
      });
      setPipelineMode("jobs");
    },
  });

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeal.title.trim()) {
      createDealMutation.mutate({
        ...newDeal,
        stage: newDeal.stage || STAGES[0].id,
      });
    }
  };

  const handleConvertToJob = () => {
    if (convertingDeal) {
      const selectedCrewLead = crewLeads.find(c => c.id === jobDetails.crewLeadId);
      convertToJobMutation.mutate({
        dealId: convertingDeal.id,
        jobData: {
          ...jobDetails,
          crewLeadName: selectedCrewLead ? `${selectedCrewLead.firstName} ${selectedCrewLead.lastName}` : jobDetails.crewLeadName,
        },
      });
    }
  };

  const getStageInfo = (stageId: string) => {
    const allStages = [...SALES_STAGES, ...JOBS_STAGES];
    return allStages.find(s => s.id === stageId) || STAGES[0];
  };

  const salesStageIds = SALES_STAGES.map(s => s.id);
  const jobsStageIds = JOBS_STAGES.map(s => s.id);

  const filteredDeals = deals.filter(d => {
    if (pipelineMode === "sales") {
      return salesStageIds.includes(d.stage) && (!d.pipelineType || d.pipelineType === "sales");
    } else {
      return jobsStageIds.includes(d.stage) || d.pipelineType === "jobs";
    }
  });

  const wonDealsReadyToConvert = deals.filter(
    d => d.stage === "won" && (!d.pipelineType || d.pipelineType === "sales")
  );

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = filteredDeals.filter(d => d.stage === stage.id);
    return acc;
  }, {} as Record<string, CrmDeal[]>);

  const totalPipelineValue = filteredDeals
    .filter(d => d.stage !== "lost" && d.stage !== "complete")
    .reduce((sum, d) => sum + parseFloat(d.value || "0"), 0);

  const completedValue = filteredDeals
    .filter(d => d.stage === "complete" || d.stage === "won")
    .reduce((sum, d) => sum + parseFloat(d.value || "0"), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-display font-bold">
            {pipelineMode === "sales" ? "Sales Pipeline" : "Jobs Pipeline"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {filteredDeals.length} {pipelineMode === "sales" ? "deals" : "jobs"} | ${totalPipelineValue.toLocaleString()} active
            {completedValue > 0 && ` | $${completedValue.toLocaleString()} ${pipelineMode === "sales" ? "won" : "completed"}`}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setPipelineMode("sales")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                pipelineMode === "sales" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-transparent hover:bg-muted"
              }`}
              data-testid="button-sales-mode"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sales</span>
            </button>
            <button
              onClick={() => setPipelineMode("jobs")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                pipelineMode === "jobs" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-transparent hover:bg-muted"
              }`}
              data-testid="button-jobs-mode"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Jobs</span>
            </button>
          </div>
          
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            data-testid="button-add-deal"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">
              New {pipelineMode === "sales" ? "Deal" : "Job"}
            </span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleAddDeal}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder={pipelineMode === "sales" ? "Deal title..." : "Job name..."}
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                  data-testid="input-deal-title"
                />
                <Input
                  type="number"
                  placeholder="Value ($)"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                  data-testid="input-deal-value"
                />
                <select
                  value={newDeal.stage || STAGES[0].id}
                  onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                  className="bg-black/5 dark:bg-white/5 border border-border dark:border-white/20 rounded-xl px-4 py-2 text-foreground"
                  data-testid="select-deal-stage"
                >
                  {STAGES.slice(0, pipelineMode === "sales" ? 3 : 4).map(stage => (
                    <option key={stage.id} value={stage.id} className="bg-background">
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newDeal.title.trim() || createDealMutation.isPending}
                  data-testid="button-submit-deal"
                >
                  <Check className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {STAGES.map(stage => {
          const stageDeals = dealsByStage[stage.id] || [];
          const stageValue = stageDeals.reduce((sum, d) => sum + parseFloat(d.value || "0"), 0);
          const Icon = stage.icon;
          
          return (
            <motion.div
              key={stage.id}
              className={`p-2 sm:p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                <span className={`text-[10px] sm:text-xs font-medium ${stage.textColor} truncate`}>
                  {(stage as { shortLabel?: string }).shortLabel || stage.label}
                </span>
              </div>
              <div className="text-lg sm:text-2xl font-bold">{stageDeals.length}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">${stageValue.toLocaleString()}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading {pipelineMode === "sales" ? "deals" : "jobs"}...
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            {pipelineMode === "sales" ? (
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            ) : (
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            )}
            <p className="text-muted-foreground">
              No {pipelineMode === "sales" ? "deals" : "jobs"} yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {pipelineMode === "sales" 
                ? "Create your first deal to track your sales pipeline"
                : wonDealsReadyToConvert.length > 0
                  ? `${wonDealsReadyToConvert.length} won deal(s) ready to convert`
                  : "Win a deal in Sales Pipeline to create jobs"
              }
            </p>
          </div>
        ) : (
          filteredDeals.map((deal, index) => {
            const stageInfo = getStageInfo(deal.stage);
            const Icon = stageInfo.icon;
            const isJob = pipelineMode === "jobs";
            const isWonDeal = deal.stage === "won" && pipelineMode === "sales";
            
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col gap-2 p-3 sm:p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                data-testid={`deal-row-${deal.id}`}
              >
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${stageInfo.color}/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stageInfo.textColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm sm:text-base">{deal.title}</p>
                      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full ${stageInfo.color}/20 ${stageInfo.textColor}`}>
                          {'shortLabel' in stageInfo ? stageInfo.shortLabel : stageInfo.label}
                        </span>
                        <span>${parseFloat(deal.value || "0").toLocaleString()}</span>
                        {isJob && deal.invoiceNumber && (
                          <span className="flex items-center gap-1">
                            <Receipt className="w-3 h-3" />
                            {deal.invoiceNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {isWonDeal && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConvertingDeal(deal)}
                        className="text-green-400 border-green-500/30 hover:bg-green-500/10"
                        data-testid={`button-convert-${deal.id}`}
                      >
                        <ArrowRightCircle className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Convert to Job</span>
                        <span className="sm:hidden">Job</span>
                      </Button>
                    )}
                    {isJob && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingJob(deal)}
                        data-testid={`button-view-job-${deal.id}`}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    )}
                    <select
                      value={deal.stage}
                      onChange={(e) => updateDealMutation.mutate({ id: deal.id, updates: { stage: e.target.value } })}
                      className="bg-black/5 dark:bg-white/5 border border-border dark:border-white/20 rounded-lg px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs max-w-[80px] sm:max-w-none"
                      data-testid={`select-stage-${deal.id}`}
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id} className="bg-background">
                          {'shortLabel' in s ? s.shortLabel : s.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteDealMutation.mutate(deal.id)}
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/20"
                      data-testid={`button-delete-deal-${deal.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {isJob && (deal.crewLeadName || deal.jobStartDate || deal.jobAddress) && (
                  <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs text-muted-foreground pl-10 sm:pl-13">
                    {deal.crewLeadName && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded-full text-blue-400">
                        <User className="w-3 h-3" />
                        {deal.crewLeadName}
                      </span>
                    )}
                    {deal.jobStartDate && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 rounded-full text-purple-400">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(deal.jobStartDate), "MMM d")}
                        {deal.jobEndDate && ` - ${format(new Date(deal.jobEndDate), "MMM d")}`}
                      </span>
                    )}
                    {deal.jobAddress && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 rounded-full text-green-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{deal.jobAddress}</span>
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
      
      {pipelineMode === "sales" && wonDealsReadyToConvert.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
        >
          <p className="text-xs text-green-400 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>
              {wonDealsReadyToConvert.length} won deal(s) ready to convert to jobs
            </span>
          </p>
        </motion.div>
      )}

      <Dialog open={!!convertingDeal} onOpenChange={(open) => !open && setConvertingDeal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightCircle className="w-5 h-5 text-green-400" />
              Convert to Job
            </DialogTitle>
          </DialogHeader>
          
          {convertingDeal && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="font-medium">{convertingDeal.title}</p>
                <p className="text-sm text-muted-foreground">
                  Value: ${parseFloat(convertingDeal.value || "0").toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Crew Lead</label>
                  <select
                    value={jobDetails.crewLeadId}
                    onChange={(e) => setJobDetails({ ...jobDetails, crewLeadId: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border dark:border-white/20 rounded-xl px-4 py-2 text-foreground"
                    data-testid="select-crew-lead"
                  >
                    <option value="" className="bg-background">Select crew lead...</option>
                    {crewLeads.map(lead => (
                      <option key={lead.id} value={lead.id} className="bg-background">
                        {lead.firstName} {lead.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                    <Input
                      type="date"
                      value={jobDetails.jobStartDate}
                      onChange={(e) => setJobDetails({ ...jobDetails, jobStartDate: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                      data-testid="input-start-date"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">End Date</label>
                    <Input
                      type="date"
                      value={jobDetails.jobEndDate}
                      onChange={(e) => setJobDetails({ ...jobDetails, jobEndDate: e.target.value })}
                      className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                      data-testid="input-end-date"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Invoice Number</label>
                  <Input
                    type="text"
                    placeholder="INV-001"
                    value={jobDetails.invoiceNumber}
                    onChange={(e) => setJobDetails({ ...jobDetails, invoiceNumber: e.target.value })}
                    className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                    data-testid="input-invoice"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Job Address</label>
                  <Input
                    type="text"
                    placeholder="123 Main St, Nashville TN"
                    value={jobDetails.jobAddress}
                    onChange={(e) => setJobDetails({ ...jobDetails, jobAddress: e.target.value })}
                    className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                    data-testid="input-address"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConvertingDeal(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConvertToJob}
              disabled={convertToJobMutation.isPending}
              className="gap-2"
              data-testid="button-confirm-convert"
            >
              {convertToJobMutation.isPending ? (
                "Converting..."
              ) : (
                <>
                  <ArrowRightCircle className="w-4 h-4" />
                  Convert to Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingJob} onOpenChange={(open) => !open && setViewingJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Job Details
            </DialogTitle>
          </DialogHeader>
          
          {viewingJob && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <p className="font-medium text-lg">{viewingJob.title}</p>
                <p className="text-sm text-muted-foreground">
                  Value: ${parseFloat(viewingJob.value || "0").toLocaleString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" /> Crew Lead
                  </p>
                  <p className="font-medium">{viewingJob.crewLeadName || "Not assigned"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Receipt className="w-4 h-4" /> Invoice
                  </p>
                  <p className="font-medium">{viewingJob.invoiceNumber || "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Dates
                  </p>
                  <p className="font-medium">
                    {viewingJob.jobStartDate 
                      ? format(new Date(viewingJob.jobStartDate), "MMM d, yyyy")
                      : "Not scheduled"}
                    {viewingJob.jobEndDate && ` - ${format(new Date(viewingJob.jobEndDate), "MMM d, yyyy")}`}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Address
                  </p>
                  <p className="font-medium">{viewingJob.jobAddress || "Not set"}</p>
                </div>
              </div>
              
              {viewingJob.notes && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm p-3 bg-black/5 dark:bg-white/5 rounded-xl">{viewingJob.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setViewingJob(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
