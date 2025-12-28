import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CrmDeal } from "@shared/schema";
import { format } from "date-fns";
import { 
  DollarSign, Plus, ChevronRight, Edit2, Trash2, X, Check,
  TrendingUp, AlertCircle, Clock, Trophy, XCircle
} from "lucide-react";

const STAGES = [
  { id: "new_lead", label: "New Lead", color: "bg-blue-500", textColor: "text-blue-400", icon: Clock },
  { id: "quoted", label: "Quoted", color: "bg-purple-500", textColor: "text-purple-400", icon: TrendingUp },
  { id: "negotiating", label: "Negotiating", color: "bg-amber-500", textColor: "text-amber-400", icon: AlertCircle },
  { id: "won", label: "Won", color: "bg-green-500", textColor: "text-green-400", icon: Trophy },
  { id: "lost", label: "Lost", color: "bg-red-500", textColor: "text-red-400", icon: XCircle },
];

interface DealsPipelineProps {
  accentColor?: string;
}

export function DealsPipeline({ accentColor = "accent" }: DealsPipelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState<CrmDeal | null>(null);
  const [newDeal, setNewDeal] = useState({ title: "", value: "", stage: "new_lead" });
  
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading } = useQuery<CrmDeal[]>({
    queryKey: ["/api/crm/deals"],
    queryFn: async () => {
      const res = await fetch("/api/crm/deals");
      if (!res.ok) throw new Error("Failed to fetch deals");
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
    mutationFn: async (deal: { title: string; value: string; stage: string }) => {
      const res = await fetch("/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deal),
      });
      if (!res.ok) throw new Error("Failed to create deal");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals/pipeline/summary"] });
      setShowAddForm(false);
      setNewDeal({ title: "", value: "", stage: "new_lead" });
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

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeal.title.trim()) {
      createDealMutation.mutate(newDeal);
    }
  };

  const getStageInfo = (stageId: string) => {
    return STAGES.find(s => s.id === stageId) || STAGES[0];
  };

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter(d => d.stage === stage.id);
    return acc;
  }, {} as Record<string, CrmDeal[]>);

  const totalPipelineValue = deals
    .filter(d => d.stage !== "lost")
    .reduce((sum, d) => sum + parseFloat(d.value || "0"), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Deals Pipeline</h2>
          <p className="text-sm text-muted-foreground">
            {deals.length} deals | ${totalPipelineValue.toLocaleString()} total value
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-testid="button-add-deal"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Deal</span>
        </motion.button>
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
                  placeholder="Deal title..."
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
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                  className="bg-black/5 dark:bg-white/5 border border-border dark:border-white/20 rounded-xl px-4 py-2 text-foreground"
                  data-testid="select-deal-stage"
                >
                  {STAGES.slice(0, 3).map(stage => (
                    <option key={stage.id} value={stage.id} className="bg-background">
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <motion.button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!newDeal.title.trim() || createDealMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-accent text-white font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="button-submit-deal"
                >
                  <Check className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const stageDeals = dealsByStage[stage.id] || [];
          const stageValue = stageDeals.reduce((sum, d) => sum + parseFloat(d.value || "0"), 0);
          const Icon = stage.icon;
          
          return (
            <motion.div
              key={stage.id}
              className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                <span className={`text-xs font-medium ${stage.textColor}`}>{stage.label}</span>
              </div>
              <div className="text-2xl font-bold">{stageDeals.length}</div>
              <div className="text-xs text-muted-foreground">${stageValue.toLocaleString()}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading deals...</div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No deals yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Create your first deal to get started</p>
          </div>
        ) : (
          deals.map((deal, index) => {
            const stageInfo = getStageInfo(deal.stage);
            const Icon = stageInfo.icon;
            
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 hover:bg-black/5 dark:bg-white/10 transition-colors"
                data-testid={`deal-row-${deal.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${stageInfo.color}/20 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${stageInfo.textColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{deal.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`px-2 py-0.5 rounded-full ${stageInfo.color}/20 ${stageInfo.textColor}`}>
                        {stageInfo.label}
                      </span>
                      <span>${parseFloat(deal.value || "0").toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={deal.stage}
                    onChange={(e) => updateDealMutation.mutate({ id: deal.id, updates: { stage: e.target.value } })}
                    className="bg-black/5 dark:bg-white/5 border border-border dark:border-white/20 rounded-lg px-2 py-1 text-xs"
                    data-testid={`select-stage-${deal.id}`}
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id} className="bg-background">{s.label}</option>
                    ))}
                  </select>
                  <motion.button
                    onClick={() => deleteDealMutation.mutate(deal.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    data-testid={`button-delete-deal-${deal.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
