import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, DollarSign, TrendingUp, Users, Calendar, FileText, ArrowRight, Palette, Sparkles, Search, Plus, Tag, X, Check, ToggleLeft, ToggleRight, Trash2, Mail, Database, Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SeoTag, Lead } from "@shared/schema";
import { format } from "date-fns";
import { PinChangeModal } from "@/components/ui/pin-change-modal";

const DEFAULT_OWNER_PIN = "1111";

const PIPELINE_STAGES = [
  { id: "new", label: "New", color: "bg-blue-500" },
  { id: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { id: "quoted", label: "Quoted", color: "bg-purple-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "won", label: "Won", color: "bg-green-500" },
  { id: "lost", label: "Lost", color: "bg-red-500" },
];

const TAG_TYPES = [
  { value: "keyword", label: "Keyword", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "meta_description", label: "Meta Description", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "title", label: "Title Tag", color: "bg-gold-400/20 text-gold-400 border-gold-400/30" },
  { value: "geo", label: "Location", color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

export default function Owner() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [currentPin, setCurrentPin] = useState(DEFAULT_OWNER_PIN);
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  
  const [newTagType, setNewTagType] = useState("keyword");
  const [newTagValue, setNewTagValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const queryClient = useQueryClient();

  useEffect(() => {
    const initPin = async () => {
      try {
        await fetch("/api/auth/pin/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "owner", defaultPin: DEFAULT_OWNER_PIN }),
        });
      } catch (err) {
        console.error("Failed to init PIN:", err);
      }
    };
    initPin();
  }, []);

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads", searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/leads?search=${encodeURIComponent(searchQuery)}`
        : "/api/leads";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const { data: seoTags = [], isLoading: tagsLoading } = useQuery<SeoTag[]>({
    queryKey: ["/api/seo-tags"],
    queryFn: async () => {
      const res = await fetch("/api/seo-tags");
      if (!res.ok) throw new Error("Failed to fetch SEO tags");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const createTagMutation = useMutation({
    mutationFn: async (tag: { tagType: string; value: string }) => {
      const res = await fetch("/api/seo-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
      });
      if (!res.ok) throw new Error("Failed to create tag");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo-tags"] });
      setNewTagValue("");
      setShowAddForm(false);
    },
  });

  const toggleTagMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/seo-tags/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle tag");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo-tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/seo-tags/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete tag");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo-tags"] });
    },
  });

  const { data: pipelineSummary = [] } = useQuery<{ stage: string; count: number; totalValue: string }[]>({
    queryKey: ["/api/crm/deals/pipeline/summary"],
    queryFn: async () => {
      const res = await fetch("/api/crm/deals/pipeline/summary");
      if (!res.ok) throw new Error("Failed to fetch pipeline");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagValue.trim()) {
      createTagMutation.mutate({ tagType: newTagType, value: newTagValue.trim() });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "owner", pin }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid PIN");
        setPin("");
        return;
      }
      
      const data = await res.json();
      
      setCurrentPin(pin);
      setIsAuthenticated(true);
      
      if (data.mustChangePin) {
        setShowPinChangeModal(true);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setPin("");
    }
  };

  const handlePinChangeSuccess = () => {
    setShowPinChangeModal(false);
  };

  const getTotalPipelineValue = () => {
    return pipelineSummary
      .filter(s => s.stage !== "lost")
      .reduce((sum, s) => sum + parseFloat(s.totalValue || "0"), 0);
  };

  const getTotalDeals = () => {
    return pipelineSummary.reduce((sum, s) => sum + s.count, 0);
  };

  const getTagTypeStyle = (type: string) => {
    return TAG_TYPES.find(t => t.value === type)?.color || TAG_TYPES[0].color;
  };

  const getTagTypeLabel = (type: string) => {
    return TAG_TYPES.find(t => t.value === type)?.label || type;
  };

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <main className="pt-24 px-4 md:px-8 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/30 to-accent/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-gold-400/20" glow>
                <div className="text-center mb-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400/30 to-accent/20 flex items-center justify-center border border-gold-400/30 shadow-lg shadow-gold-400/20"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    transition={{ type: "spring" }}
                  >
                    <Crown className="w-10 h-10 text-gold-400" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">Owner Access</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-gold-400/30"
                    maxLength={4}
                    data-testid="input-owner-pin"
                  />
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">{error}</motion.p>}
                  <FlipButton className="w-full h-14" data-testid="button-owner-login">
                    Access Dashboard <ArrowRight className="w-5 h-5" />
                  </FlipButton>
                </form>
              </GlassCard>
            </div>
          </motion.div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400/30 to-accent/20 flex items-center justify-center shadow-lg shadow-gold-400/20 border border-gold-400/20"
              whileHover={{ scale: 1.1, rotateZ: 5 }}
            >
              <Crown className="w-7 h-7 text-gold-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Owner Dashboard</h1>
              <p className="text-muted-foreground">Business overview and financials</p>
            </div>
          </div>
        </div>

        {/* Configurable Notice */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 border-dashed border-gold-400/30 bg-gradient-to-r from-gold-400/5 via-accent/5 to-gold-400/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">Fully Customizable Dashboard</h3>
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
                <p className="text-muted-foreground">
                  This dashboard can be configured any way you want. Name your design, describe your needs, and it will be made to your specifications.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <BentoGrid>
          {/* SEO Tracker - Large Card */}
          <BentoItem colSpan={8} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6 md:p-8 bg-gradient-to-br from-blue-500/10 via-transparent to-accent/5" glow>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-accent/20 flex items-center justify-center">
                      <Search className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">SEO Tracker</h2>
                      <p className="text-sm text-muted-foreground">Manage your website's search visibility</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid="button-add-seo-tag"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Tag</span>
                  </motion.button>
                </div>

                {/* Add Tag Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form 
                      onSubmit={handleAddTag}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {TAG_TYPES.map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => setNewTagType(type.value)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                newTagType === type.value 
                                  ? type.color + " ring-2 ring-white/20" 
                                  : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {type.label}
                            </motion.button>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            placeholder={`Enter ${getTagTypeLabel(newTagType).toLowerCase()}...`}
                            value={newTagValue}
                            onChange={(e) => setNewTagValue(e.target.value)}
                            className="flex-1 bg-white/5 border-white/20 rounded-xl"
                            data-testid="input-seo-tag-value"
                          />
                          <motion.button
                            type="submit"
                            disabled={!newTagValue.trim() || createTagMutation.isPending}
                            className="px-4 py-2 rounded-xl bg-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-testid="button-submit-seo-tag"
                          >
                            <Check className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 rounded-xl bg-white/10 text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Tags List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {tagsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading tags...</div>
                  ) : seoTags.length === 0 ? (
                    <div className="text-center py-12">
                      <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No SEO tags yet</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Add keywords and meta tags to improve searchability</p>
                    </div>
                  ) : (
                    seoTags.map((tag, index) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                          tag.isActive 
                            ? "bg-white/5 border-white/10" 
                            : "bg-white/2 border-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium border shrink-0 ${getTagTypeStyle(tag.tagType)}`}>
                            {getTagTypeLabel(tag.tagType)}
                          </span>
                          <span className="truncate text-sm">{tag.value}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <motion.button
                            onClick={() => toggleTagMutation.mutate({ id: tag.id, isActive: !tag.isActive })}
                            className={`p-2 rounded-lg transition-colors ${
                              tag.isActive ? "text-green-400 hover:bg-green-500/20" : "text-muted-foreground hover:bg-white/10"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid={`button-toggle-tag-${tag.id}`}
                          >
                            {tag.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </motion.button>
                          <motion.button
                            onClick={() => deleteTagMutation.mutate(tag.id)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid={`button-delete-tag-${tag.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Stats */}
                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{seoTags.filter(t => t.tagType === "keyword").length}</div>
                    <div className="text-xs text-muted-foreground">Keywords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{seoTags.filter(t => t.tagType === "meta_description").length}</div>
                    <div className="text-xs text-muted-foreground">Meta Descriptions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">{seoTags.filter(t => t.tagType === "title").length}</div>
                    <div className="text-xs text-muted-foreground">Title Tags</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{seoTags.filter(t => t.tagType === "geo").length}</div>
                    <div className="text-xs text-muted-foreground">Locations</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          {/* Email Database Card */}
          <BentoItem colSpan={4} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6 bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5" glow>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
                      <Database className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold">Email Database</h2>
                      <p className="text-xs text-muted-foreground">{leads.length} leads</p>
                    </div>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 rounded-xl h-10 text-sm"
                    data-testid="input-search-leads-owner"
                  />
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {leadsLoading ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">Loading...</div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? "No matches" : "No leads yet"}
                      </p>
                    </div>
                  ) : (
                    leads.slice(0, 10).map((lead, index) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{lead.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(lead.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6 bg-gradient-to-br from-gold-400/10 to-transparent" glow>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-gold-400" />
                  </div>
                  <h2 className="text-xl font-display font-bold">Revenue</h2>
                </div>
                <div className="text-4xl font-bold text-gold-400 mb-2">$--</div>
                <p className="text-sm text-muted-foreground">Revenue tracking coming soon</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Team</h3>
                </div>
                <div className="text-3xl font-bold text-accent mb-2">--</div>
                <p className="text-sm text-muted-foreground">Active team members</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-bold">Growth</h3>
                </div>
                <p className="text-sm text-muted-foreground">Business analytics coming soon</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={8} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Financial Reports</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <p className="text-sm text-muted-foreground">P&L Report</p>
                    <p className="text-xs text-accent mt-1">Coming Soon</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <p className="text-sm text-muted-foreground">Payroll</p>
                    <p className="text-xs text-accent mt-1">Coming Soon</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    <p className="text-sm text-muted-foreground">Tax Summary</p>
                    <p className="text-xs text-accent mt-1">Coming Soon</p>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>
          {/* Sales Pipeline Summary */}
          <BentoItem colSpan={4} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6 bg-gradient-to-br from-teal-500/10 via-transparent to-accent/5" glow>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-accent/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">Sales Pipeline</h2>
                    <p className="text-xs text-muted-foreground">{getTotalDeals()} total deals</p>
                  </div>
                </div>

                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-gold-400/10 to-accent/5 border border-gold-400/20">
                  <p className="text-xs text-muted-foreground mb-1">Pipeline Value</p>
                  <p className="text-2xl font-bold text-gold-400">
                    ${getTotalPipelineValue().toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  {PIPELINE_STAGES.map((stage) => {
                    const stageData = pipelineSummary.find(s => s.stage === stage.id);
                    const count = stageData?.count || 0;
                    const value = parseFloat(stageData?.totalValue || "0");
                    
                    return (
                      <motion.div
                        key={stage.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                          <span className="text-sm">{stage.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{count}</span>
                          {value > 0 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              ${value.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>
        </BentoGrid>
      </main>

      <PinChangeModal
        isOpen={showPinChangeModal}
        role="owner"
        roleLabel="Owner"
        currentPin={currentPin}
        onSuccess={handlePinChangeSuccess}
        accentColor="gold-400"
      />
    </PageLayout>
  );
}
