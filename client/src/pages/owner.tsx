import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, DollarSign, TrendingUp, Users, ArrowRight, Search, Plus, Tag, X, Check, ToggleLeft, ToggleRight, Trash2, Mail, Database, Target, Eye, Settings, Sparkles, MessageSquare } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { SmsMessenger } from "@/components/sms-messenger";
import { 
  hover3D, 
  hover3DSubtle, 
  cardVariants, 
  staggerContainer, 
  iconContainerStyles, 
  cardBackgroundStyles, 
  glowGradients,
  springTransition 
} from "@/lib/theme-effects";
import { OwnerResultsView } from "@/components/owner-results-view";
import { LiveVisitorsCard } from "@/components/live-visitors-card";
import { DealsPipeline } from "@/components/crm/deals-pipeline";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { BookingsCard } from "@/components/bookings-card";
import { CrewManagementCard } from "@/components/crew-management-card";
import { DocumentCenter } from "@/components/document-center";
import { TeamManagementCard } from "@/components/team-management-card";
import { CRMCalendar } from "@/components/crm-calendar";
import { RoomScannerCard } from "@/components/room-scanner";
import { VersionHistory } from "@/components/version-history";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SeoTag, Lead } from "@shared/schema";
import { format } from "date-fns";
import { PinChangeModal } from "@/components/ui/pin-change-modal";
import { useTenant } from "@/context/TenantContext";
import { useAccess } from "@/context/AccessContext";
import { Lock } from "lucide-react";
import { MessagingWidget } from "@/components/messaging-widget";
import { OfficeAssistant } from "@/components/ui/office-assistant";
import { PinReferenceAccordion } from "@/components/pin-reference-accordion";
import { DashboardPreview } from "@/components/dashboard-preview";
import { SystemHealthCard } from "@/components/system-health-card";
import { TradeVerticalsCard } from "@/components/trade-verticals-card";
import { BlogManager } from "@/components/blog-manager";
import { TenantSwitcher, useTenantFilter } from "@/components/tenant-switcher";

const DEFAULT_OWNER_PIN = "1111";

const TAG_TYPES = [
  { value: "keyword", label: "Keyword", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "meta_description", label: "Meta", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "title", label: "Title", color: "bg-gold-400/20 text-gold-400 border-gold-400/30" },
  { value: "geo", label: "Location", color: "bg-green-500/20 text-green-400 border-green-500/30" },
];

export default function Owner() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  const { login, currentUser, canManageSEO, canViewSalesData } = useAccess();
  const { t } = useI18n();
  const isSessionAuth = currentUser.isAuthenticated && currentUser.role === "owner";
  const [isAuthenticated, setIsAuthenticated] = useState(isDemo || isSessionAuth);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [currentPin, setCurrentPin] = useState(DEFAULT_OWNER_PIN);
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  
  const [newTagType, setNewTagType] = useState("keyword");
  const [newTagValue, setNewTagValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedTenant, setSelectedTenant, tenantLabel } = useTenantFilter();
  
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSessionAuth && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [isSessionAuth, isAuthenticated]);

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
      
      if (!data.valid) {
        setError("Invalid PIN");
        setPin("");
        return;
      }
      
      setCurrentPin(pin);
      setIsAuthenticated(true);
      login("owner");
      
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
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${iconContainerStyles.gradients.gold} ${iconContainerStyles.base} border-gold-400/30`}
                    whileHover={hover3D}
                    transition={springTransition}
                  >
                    <Crown className="w-10 h-10 text-gold-400" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">{t('owner.access')}</h1>
                  <p className="text-muted-foreground">{t('owner.enterPin')}</p>
                </div>
                {/* Language Toggle */}
                <div className="flex justify-center mb-4">
                  <LanguageToggle variant="compact" />
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-gold-400/30"
                    maxLength={4}
                    data-testid="input-owner-pin"
                  />
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">{t('owner.invalidPin')}</motion.p>}
                  <FlipButton className="w-full h-14" data-testid="button-owner-login">
                    {t('owner.accessDashboard')} <ArrowRight className="w-5 h-5" />
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
      <main className="pt-20 px-4 md:px-6 pb-24">
        {isDemo && (
          <motion.div 
            className="max-w-7xl mx-auto mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-gold-400/20 via-accent/10 to-gold-400/20 border border-gold-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold-400/20">
                  <Eye className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="font-bold text-gold-400 text-sm">Demo Mode - Private Owner Control Panel</p>
                  <p className="text-xs text-muted-foreground">PIN-protected access for SEO, analytics, and business management. <span className="text-gold-400 font-medium">SEO tracking is live!</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!isDemo && currentUser.role === "owner" && !canViewSalesData() && (
          <motion.div 
            className="max-w-7xl mx-auto mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-purple-500/20 border border-purple-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-bold text-purple-400 text-sm">Welcome, {currentUser.userName}! Your system is being set up.</p>
                  <p className="text-xs text-muted-foreground">Sales features are being configured behind the scenes. Your analytics and SEO tools are fully live!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`${iconContainerStyles.sizes.lg} rounded-2xl ${iconContainerStyles.gradients.gold} ${iconContainerStyles.base} border-gold-400/20`}
                whileHover={hover3D}
                transition={springTransition}
              >
                <Crown className="w-6 h-6 text-gold-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{t('owner.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('owner.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle variant="compact" />
              <DashboardPreview currentRole="owner" />
              {!isDemo && (
                <motion.button
                  onClick={() => setShowPinChangeModal(true)}
                  className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/5 dark:bg-white/10 border border-border dark:border-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  data-testid="button-settings"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-4">
          <TenantSwitcher 
            selectedTenant={selectedTenant} 
            onTenantChange={setSelectedTenant}
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {/* Row 1: System Health + Live Visitors + Stats = 4+4+4=12 */}
            <BentoItem colSpan={4} rowSpan={1}>
              <SystemHealthCard />
            </BentoItem>

            <BentoItem colSpan={4} rowSpan={1}>
              <LiveVisitorsCard />
            </BentoItem>

            <BentoItem colSpan={4} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={0} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full min-h-[120px] p-4 ${cardBackgroundStyles.gold}`} glow="gold" hoverEffect="3d">
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-gold-400" />
                        <span className="text-xs font-medium">{t('owner.revenue')}</span>
                      </div>
                      <div className="text-xl font-bold text-gold-400">$--</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Target className="w-3 h-3 text-teal-400" />
                        <span className="text-xs font-medium">{t('owner.pipeline')}</span>
                      </div>
                      <div className="text-xl font-bold text-teal-400">${getTotalPipelineValue().toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-medium">{t('owner.leads')}</span>
                      </div>
                      <div className="text-xl font-bold text-blue-400">{leadsLoading ? "--" : leads.length}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-xs font-medium">{t('owner.growth')}</span>
                      </div>
                      <div className="text-xl font-bold text-green-400">--%</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* SEO Tracker - Large Card */}
            <BentoItem colSpan={8} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={4} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.blue}`} glow="blue" hoverEffect="subtle">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.blue} ${iconContainerStyles.base}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={springTransition}
                      >
                        <Search className="w-4 h-4 text-blue-400" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-display font-bold">{t('owner.seoTracker')}</h2>
                        <p className="text-xs text-muted-foreground">{seoTags.length} {t('owner.tags')}</p>
                      </div>
                    </div>
                  {canManageSEO() && (
                    <motion.button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 transition-colors text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="button-add-seo-tag"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('owner.add')}</span>
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {showAddForm && (
                    <motion.form 
                      onSubmit={handleAddTag}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 overflow-hidden"
                    >
                      <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 border border-border dark:border-white/10 space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {TAG_TYPES.map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => setNewTagType(type.value)}
                              className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                                newTagType === type.value 
                                  ? type.color + " ring-1 ring-white/20" 
                                  : "bg-black/5 dark:bg-white/5 text-muted-foreground border-border dark:border-white/10 hover:bg-black/5 dark:bg-white/10"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {type.label}
                            </motion.button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder={`Enter ${getTagTypeLabel(newTagType).toLowerCase()}...`}
                            value={newTagValue}
                            onChange={(e) => setNewTagValue(e.target.value)}
                            className="flex-1 bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-lg h-8 text-sm"
                            data-testid="input-seo-tag-value"
                          />
                          <motion.button
                            type="submit"
                            disabled={!newTagValue.trim() || createTagMutation.isPending}
                            className="px-3 py-1.5 rounded-lg bg-accent text-white font-medium disabled:opacity-50 text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-testid="button-submit-seo-tag"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-white text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                  {tagsLoading ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">{t('owner.loading')}</div>
                  ) : seoTags.length === 0 ? (
                    <div className="text-center py-8">
                      <Tag className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">{t('owner.noSeoTags')}</p>
                    </div>
                  ) : (
                    seoTags.map((tag, index) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all ${
                          tag.isActive 
                            ? "bg-black/5 dark:bg-white/5 border-border dark:border-white/10" 
                            : "bg-white/2 border-white/5 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${getTagTypeStyle(tag.tagType)}`}>
                            {getTagTypeLabel(tag.tagType)}
                          </span>
                          <span className="truncate text-sm">{tag.value}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <motion.button
                            onClick={() => toggleTagMutation.mutate({ id: tag.id, isActive: !tag.isActive })}
                            className={`p-1.5 rounded transition-colors ${
                              tag.isActive ? "text-green-400 hover:bg-green-500/20" : "text-muted-foreground hover:bg-black/5 dark:bg-white/10"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid={`button-toggle-tag-${tag.id}`}
                          >
                            {tag.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                          </motion.button>
                          <motion.button
                            onClick={() => deleteTagMutation.mutate(tag.id)}
                            className="p-1.5 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            data-testid={`button-delete-tag-${tag.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-border dark:border-white/10 grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{seoTags.filter(t => t.tagType === "keyword").length}</div>
                    <div className="text-[10px] text-muted-foreground">Keywords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{seoTags.filter(t => t.tagType === "meta_description").length}</div>
                    <div className="text-[10px] text-muted-foreground">Meta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gold-400">{seoTags.filter(t => t.tagType === "title").length}</div>
                    <div className="text-[10px] text-muted-foreground">Titles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{seoTags.filter(t => t.tagType === "geo").length}</div>
                    <div className="text-[10px] text-muted-foreground">Locations</div>
                  </div>
                </div>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Email Database - Side Card */}
            <BentoItem colSpan={4} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={5} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect="subtle">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div 
                      className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.accent} ${iconContainerStyles.base}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={springTransition}
                    >
                      <Database className="w-4 h-4 text-accent" />
                    </motion.div>
                  <div>
                    <h2 className="text-lg font-display font-bold">Email Database</h2>
                    <p className="text-xs text-muted-foreground">{canViewSalesData() ? `${leads.length} leads` : "Coming soon"}</p>
                  </div>
                </div>

                {canViewSalesData() ? (
                  <>
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-lg h-8 text-sm"
                        data-testid="input-search-leads-owner"
                      />
                    </div>

                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                      {leadsLoading ? (
                        <div className="text-center py-6 text-muted-foreground text-sm">Loading...</div>
                      ) : leads.length === 0 ? (
                        <div className="text-center py-8">
                          <Mail className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? "No matches" : "No leads yet"}
                          </p>
                        </div>
                      ) : (
                        leads.slice(0, 6).map((lead, index) => (
                          <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 hover:bg-black/5 dark:bg-white/10 transition-colors"
                          >
                            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-3.5 h-3.5 text-accent" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{lead.email}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {format(new Date(lead.createdAt), "MMM d, h:mm a")}
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                    <p className="text-xs text-muted-foreground/70">Being configured</p>
                  </div>
                )}
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Deals Pipeline - Large Card */}
            <BentoItem colSpan={8} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={6} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" hoverEffect="subtle">
                  {canViewSalesData() ? (
                    <DealsPipeline />
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div 
                          className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.purple} ${iconContainerStyles.base}`}
                        >
                          <Target className="w-4 h-4 text-purple-400" />
                        </motion.div>
                        <div>
                          <h2 className="text-lg font-display font-bold">Deal Pipeline</h2>
                          <p className="text-xs text-muted-foreground">Coming soon</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center py-8">
                        <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                        <p className="text-xs text-muted-foreground/70">Being configured</p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Activity Timeline - Side Card */}
            <BentoItem colSpan={4} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={7} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect="subtle">
                  {canViewSalesData() ? (
                    <ActivityTimeline maxHeight="280px" />
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div 
                          className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.accent} ${iconContainerStyles.base}`}
                        >
                          <TrendingUp className="w-4 h-4 text-accent" />
                        </motion.div>
                        <div>
                          <h2 className="text-lg font-display font-bold">Activity</h2>
                          <p className="text-xs text-muted-foreground">Coming soon</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center py-8">
                        <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                        <p className="text-xs text-muted-foreground/70">Being configured</p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Row: Bookings + Version History/Room Scanner stacked = 6+6=12 */}
            {/* Bookings Management */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={8} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.gold}`} glow="gold" hoverEffect="subtle">
                  {canViewSalesData() ? (
                    <BookingsCard />
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div 
                          className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.gold} ${iconContainerStyles.base}`}
                        >
                          <Users className="w-4 h-4 text-gold-400" />
                        </motion.div>
                        <div>
                          <h2 className="text-lg font-display font-bold">Bookings</h2>
                          <p className="text-xs text-muted-foreground">Coming soon</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center py-8">
                        <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
                        <p className="text-xs text-muted-foreground/70">Being configured</p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Crew Management - paired with Bookings */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={10} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.gold}`} glow="gold" hoverEffect="subtle">
                  <CrewManagementCard />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Row: SMS Messenger + Version History = 6+6=12 */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={9} whileHover={hover3DSubtle}>
                <SmsMessenger />
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={9} whileHover={hover3DSubtle}>
                <VersionHistory maxItems={5} />
              </motion.div>
            </BentoItem>

            {/* Room Scanner */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={10}>
                <RoomScannerCard locked={false} accentColor="gold-400" />
              </motion.div>
            </BentoItem>

            {/* Row: PIN Reference + Team Management = 6+6=12 (both rowSpan=1) */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={10} whileHover={hover3DSubtle}>
                <PinReferenceAccordion className="h-full" />
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={11} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" hoverEffect="subtle">
                  <TeamManagementCard />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Document Center */}
            <BentoItem colSpan={12} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={12} whileHover={hover3DSubtle}>
                <DocumentCenter />
              </motion.div>
            </BentoItem>

            {/* CRM Calendar */}
            <BentoItem colSpan={12} rowSpan={3}>
              <motion.div className="h-full" variants={cardVariants} custom={13} whileHover={hover3DSubtle}>
                <CRMCalendar />
              </motion.div>
            </BentoItem>

            {/* Trade Verticals Expansion */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={14} whileHover={hover3DSubtle}>
                <TradeVerticalsCard showFullDetails={false} />
              </motion.div>
            </BentoItem>

            {/* Unified Multi-Tenant Analytics Dashboard - Full Width */}
            <BentoItem colSpan={12} rowSpan={4}>
              <motion.div className="h-full" variants={cardVariants} custom={10}>
                <GlassCard className="h-full p-4 md:p-6" glow="blue" hoverEffect={false}>
                  <OwnerResultsView />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Blog Manager */}
            <BentoItem colSpan={12} rowSpan={3}>
              <motion.div className="h-full" variants={cardVariants} custom={11}>
                <GlassCard className="h-full p-4 md:p-6" glow="gold" hoverEffect={false}>
                  <BlogManager />
                </GlassCard>
              </motion.div>
            </BentoItem>
          </BentoGrid>
        </motion.div>
      </main>

      <PinChangeModal
        isOpen={showPinChangeModal}
        role="owner"
        roleLabel="Owner"
        currentPin={currentPin}
        onSuccess={handlePinChangeSuccess}
        onClose={() => setShowPinChangeModal(false)}
        accentColor="gold-400"
      />
      
      <MessagingWidget 
        currentUserId="owner"
        currentUserRole="owner"
        currentUserName="Owner"
      />
      <OfficeAssistant />
    </PageLayout>
  );
}
