import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { PinChangeModal } from "@/components/ui/pin-change-modal";
import { DealsPipeline } from "@/components/crm/deals-pipeline";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { BookingsCard } from "@/components/bookings-card";
import { CrewManagementCard } from "@/components/crew-management-card";
import { DocumentCenter } from "@/components/document-center";
import { TeamManagementCard } from "@/components/team-management-card";
import { CRMCalendar } from "@/components/crm-calendar";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { Shield, Users, FileText, Bell, ArrowRight, Search, Mail, Calendar, Database, Settings, Clock, Send, X, CheckCircle, GitBranch, Eye, TrendingUp, DollarSign, Award, ListTodo, Heart } from "lucide-react";
import { hover3D, hover3DSubtle, cardVariants, staggerContainer, iconContainerStyles, cardBackgroundStyles } from "@/lib/theme-effects";
import { VersionHistory } from "@/components/version-history";
import { RoomScannerCard } from "@/components/room-scanner";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { LiveVisitorsCard } from "@/components/live-visitors-card";
import { useQuery } from "@tanstack/react-query";
import type { Lead, Estimate, EstimateFollowup } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTenant } from "@/context/TenantContext";
import { useAccess } from "@/context/AccessContext";
import { Zap } from "lucide-react";
import { MessagingWidget } from "@/components/messaging-widget";
import { PinReferenceAccordion } from "@/components/pin-reference-accordion";

const DEFAULT_PIN = "4444";

export default function Admin() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  const [isAuthenticated, setIsAuthenticated] = useState(isDemo);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState(DEFAULT_PIN);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const queryClient = useQueryClient();
  const { login, currentUser, canEdit } = useAccess();

  useEffect(() => {
    const initPin = async () => {
      try {
        await fetch("/api/auth/pin/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "ops_manager", defaultPin: DEFAULT_PIN }),
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
    enabled: isAuthenticated && !showPinChange,
  });

  const { data: estimates = [], isLoading: estimatesLoading } = useQuery<Estimate[]>({
    queryKey: ["/api/estimates"],
    queryFn: async () => {
      const res = await fetch("/api/estimates");
      if (!res.ok) throw new Error("Failed to fetch estimates");
      return res.json();
    },
    enabled: isAuthenticated && !showPinChange,
  });

  const { data: pendingFollowups = [], isLoading: followupsLoading } = useQuery<EstimateFollowup[]>({
    queryKey: ["/api/followups/pending"],
    queryFn: async () => {
      const res = await fetch("/api/followups/pending");
      if (!res.ok) throw new Error("Failed to fetch follow-ups");
      return res.json();
    },
    enabled: isAuthenticated && !showPinChange,
  });

  const handleMarkSent = async (followupId: string) => {
    try {
      const res = await fetch(`/api/followups/${followupId}/sent`, { method: "POST" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/followups/pending"] });
      }
    } catch (err) {
      console.error("Failed to mark follow-up as sent:", err);
    }
  };

  const handleCancelFollowup = async (followupId: string) => {
    try {
      const res = await fetch(`/api/followups/${followupId}/cancel`, { method: "POST" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/followups/pending"] });
      }
    } catch (err) {
      console.error("Failed to cancel follow-up:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "ops_manager", pin }),
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
      login("admin");
      
      if (data.mustChangePin) {
        setShowPinChange(true);
      } else {
        setShowWelcomeModal(true);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setPin("");
    }
  };

  const handlePinChangeSuccess = () => {
    setShowPinChange(false);
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
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-blue-500/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-accent/20" glow>
                <div className="text-center mb-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/30 to-blue-500/20 flex items-center justify-center border border-accent/30 shadow-lg shadow-accent/20"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    transition={{ type: "spring" }}
                  >
                    <Shield className="w-10 h-10 text-accent" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">Admin</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-accent/30"
                    maxLength={4}
                    data-testid="input-admin-pin"
                  />
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">{error}</motion.p>}
                  <FlipButton className="w-full h-14" data-testid="button-admin-login">
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
      <PinChangeModal
        isOpen={showPinChange}
        role="ops_manager"
        roleLabel="Admin"
        currentPin={currentPin}
        onSuccess={handlePinChangeSuccess}
        onClose={() => setShowPinChange(false)}
      />

      {showWelcomeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowWelcomeModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6 md:p-8 bg-gray-900/95 border-white/20" glow>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-pink-400" />
                  <h2 className="text-2xl font-display font-bold text-white">Hey Sid, is this better?</h2>
                </div>
                <motion.button
                  onClick={() => setShowWelcomeModal(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid="button-close-welcome"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300">
                  Hey, just wanted to show you this - here's where we stand with PaintPros.io:
                </p>

                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-500/40">
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-white">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Valuation Projections
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-black/40 rounded-lg p-3">
                      <p className="text-xs text-gray-400">250 tenants</p>
                      <p className="font-bold text-lg text-green-400">$7.5M-$12M</p>
                      <p className="text-xs text-gray-400">~$1.5M ARR</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3">
                      <p className="text-xs text-gray-400">500 tenants</p>
                      <p className="font-bold text-lg text-blue-400">$15M-$24M</p>
                      <p className="text-xs text-gray-400">~$3M ARR</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3">
                      <p className="text-xs text-gray-400">2,000 tenants</p>
                      <p className="font-bold text-lg text-purple-400">$50M+</p>
                      <p className="text-xs text-gray-400">~$10M ARR</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">SaaS companies trade at 5-8x annual recurring revenue</p>
                </div>

                <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-xl p-4 border border-accent/40">
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-white">
                    <Award className="w-5 h-5 text-accent" />
                    Competitive Edge
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    We outshine Jobber, Housecall Pro, and ServiceTitan in these areas:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Blockchain verification</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> White-label multi-tenant</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Bilingual AI assistant</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Premium Bento UI design</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <h3 className="font-bold flex items-center gap-2 mb-3 text-white">
                    <ListTodo className="w-5 h-5 text-blue-400" />
                    Next Steps (One per day)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/20 border border-green-500/40">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="line-through text-gray-400">Stripe & Coinbase payments</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/30 text-green-400">Done</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/20">
                      <div className="w-4 h-4 rounded border-2 border-gray-500" />
                      <span className="text-gray-200">Tenant provisioning automation</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/20">
                      <div className="w-4 h-4 rounded border-2 border-gray-500" />
                      <span className="text-gray-200">QuickBooks Online integration</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/20">
                      <div className="w-4 h-4 rounded border-2 border-gray-500" />
                      <span className="text-gray-200">Customer portal</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-4 border border-pink-500/40 text-center">
                  <p className="text-lg font-medium text-gray-200">
                    I'll see you shortly!
                  </p>
                  <p className="text-xl font-bold text-pink-400 mt-1">
                    - Jason
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      <main className="pt-20 px-4 md:px-6 pb-24">
        {isDemo && (
          <motion.div 
            className="max-w-7xl mx-auto mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 via-accent/10 to-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-blue-400 text-sm">Demo Mode - Private Back-Office Control Panel</p>
                  <p className="text-xs text-muted-foreground">PIN-protected access for your operations team.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!isDemo && canEdit() && currentUser.role === "admin" && (
          <motion.div 
            className="max-w-7xl mx-auto mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 via-teal-500/10 to-green-500/20 border border-green-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="font-bold text-green-400 text-sm">Live Access - Welcome, {currentUser.userName}!</p>
                  <p className="text-xs text-muted-foreground">Full database access enabled. All changes sync in real-time.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-blue-500/20 flex items-center justify-center shadow-lg shadow-accent/20 border border-accent/20"
                whileHover={{ scale: 1.1, rotateZ: 5 }}
              >
                <Shield className="w-6 h-6 text-accent" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Lead & Deal Management</p>
              </div>
            </div>
            {!isDemo && (
              <motion.button
                onClick={() => setShowPinChange(true)}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/5 dark:bg-white/10 border border-border dark:border-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                data-testid="button-settings"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            )}
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {/* Live Visitors Card */}
            <BentoItem colSpan={3} rowSpan={1}>
              <LiveVisitorsCard />
            </BentoItem>

            {/* Stats Row - 4 small cards */}
            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={0}
                whileHover={hover3D}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.gold}`} glow="gold" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} ${iconContainerStyles.gradients.gold}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FileText className="w-4 h-4 text-accent" />
                    </motion.div>
                    <span className="text-sm font-medium">Estimates</span>
                  </div>
                  <div className="text-3xl font-bold text-accent">{estimatesLoading ? "--" : estimates.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${estimates.reduce((sum, e) => sum + parseFloat(e.totalEstimate || "0"), 0).toLocaleString()}
                  </p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={1}
                whileHover={hover3D}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.blue}`} glow="blue" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} ${iconContainerStyles.gradients.blue}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Users className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span className="text-sm font-medium">Leads</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">{leadsLoading ? "--" : leads.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total captured</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={2}
                whileHover={hover3D}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.yellow}`} glow="gold" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} ${iconContainerStyles.gradients.yellow}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Clock className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                    <span className="text-sm font-medium">Follow-ups</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-400">{followupsLoading ? "--" : pendingFollowups.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={3}
                whileHover={hover3D}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.green}`} glow="green" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} ${iconContainerStyles.gradients.green}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Bell className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <span className="text-sm font-medium">Activity</span>
                  </div>
                  <div className="text-lg font-bold text-green-400">
                    {leads.length > 0 ? format(new Date(leads[0]?.createdAt || new Date()), "MMM d") : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last lead</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Deals Pipeline - Large Card */}
            <BentoItem colSpan={8} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={4}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 md:p-6 ${cardBackgroundStyles.mixed}`} glow="gold" hoverEffect={false}>
                  <DealsPipeline />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Activity Timeline - Side Card */}
            <BentoItem colSpan={4} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={5}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" hoverEffect={false}>
                  <ActivityTimeline maxHeight="280px" />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Email Database - Medium Card */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={6}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect={false}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.accent}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Database className="w-4 h-4 text-accent" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-display font-bold">Email Database</h2>
                        <p className="text-xs text-muted-foreground">{leads.length} leads</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-lg h-9 text-sm"
                      data-testid="input-search-leads"
                    />
                  </div>

                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
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
                      leads.slice(0, 8).map((lead, index) => (
                        <motion.div
                          key={lead.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 hover:bg-black/5 dark:bg-white/10 transition-colors"
                          data-testid={`lead-row-${lead.id}`}
                        >
                          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{lead.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(lead.createdAt), "MMM d, h:mm a")}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Follow-ups - Medium Card with Carousel */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={7}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.yellow}`} glow="gold" hoverEffect={false}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.yellow}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Clock className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-display font-bold">Follow-ups</h2>
                        <p className="text-xs text-muted-foreground">{pendingFollowups.length} pending</p>
                      </div>
                    </div>
                  </div>

                  {followupsLoading ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">Loading...</div>
                  ) : pendingFollowups.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500/50" />
                      <p className="text-sm text-muted-foreground">All caught up!</p>
                    </div>
                  ) : (
                    <div className="px-8">
                      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                        <CarouselContent className="-ml-2">
                          {pendingFollowups.map((followup, index) => (
                            <CarouselItem key={followup.id} className="pl-2 basis-[220px]">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <GlassCard 
                                  className="p-3 h-full border border-border dark:border-white/10"
                                  glow="gold"
                                  hoverEffect="subtle"
                                  data-testid={`followup-card-${followup.id}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                                      followup.followupType === "reminder" 
                                        ? "bg-blue-500/20 text-blue-400"
                                        : followup.followupType === "quote_expiring"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-purple-500/20 text-purple-400"
                                    }`}>
                                      {followup.followupType === "reminder" ? "Reminder" : 
                                       followup.followupType === "quote_expiring" ? "Expiring" : "Thanks"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">#{followup.estimateId}</span>
                                  </div>
                                  
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(followup.scheduledFor), "MMM d, h:mm a")}
                                  </p>

                                  <div className="flex gap-1.5 mb-2">
                                    <motion.button
                                      onClick={() => handleMarkSent(followup.id)}
                                      className="flex-1 p-1.5 rounded-md bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors flex items-center justify-center gap-1 text-[10px]"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      data-testid={`button-mark-sent-${followup.id}`}
                                    >
                                      <Send className="w-2.5 h-2.5" /> Sent
                                    </motion.button>
                                    <motion.button
                                      onClick={() => handleCancelFollowup(followup.id)}
                                      className="flex-1 p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors flex items-center justify-center gap-1 text-[10px]"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      data-testid={`button-cancel-followup-${followup.id}`}
                                    >
                                      <X className="w-2.5 h-2.5" /> Cancel
                                    </motion.button>
                                  </div>

                                  <Accordion type="single" collapsible className="border-t border-border dark:border-white/10">
                                    <AccordionItem value="details" className="border-b-0">
                                      <AccordionTrigger className="text-[10px] py-1.5 hover:no-underline">Details</AccordionTrigger>
                                      <AccordionContent className="text-[10px]">
                                        {followup.emailSubject && <p className="font-medium mb-1">{followup.emailSubject}</p>}
                                        <p className="text-muted-foreground">{format(new Date(followup.scheduledFor), "EEEE, MMM d 'at' h:mm a")}</p>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                </GlassCard>
                              </motion.div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-0 h-6 w-6" />
                        <CarouselNext className="right-0 h-6 w-6" />
                      </Carousel>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Bookings Management */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={8}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect={false}>
                  <BookingsCard />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Version History - Medium Card */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={9}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div 
                      className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} ${iconContainerStyles.gradients.purple}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <GitBranch className="w-4 h-4 text-purple-400" />
                    </motion.div>
                    <h2 className="text-lg font-display font-bold">Version History</h2>
                  </div>
                  <VersionHistory maxItems={3} compact />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Room Scanner */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div 
                variants={cardVariants}
                custom={10}
              >
                <RoomScannerCard locked={false} accentColor="accent" />
              </motion.div>
            </BentoItem>

            {/* Default PINs Reference */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={11}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <PinReferenceAccordion className="h-full" />
              </motion.div>
            </BentoItem>

            {/* Crew Management */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={11}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect={false}>
                  <CrewManagementCard />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Team Management */}
            <BentoItem colSpan={6} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={10}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" hoverEffect={false}>
                  <TeamManagementCard />
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Document Center */}
            <BentoItem colSpan={12} rowSpan={2}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={12}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <DocumentCenter />
              </motion.div>
            </BentoItem>

            {/* CRM Calendar */}
            <BentoItem colSpan={12} rowSpan={3}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={13}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <CRMCalendar />
              </motion.div>
            </BentoItem>

            {/* Site Analytics */}
            <BentoItem colSpan={12} rowSpan={4}>
              <motion.div 
                className="h-full" 
                variants={cardVariants}
                custom={11}
                whileHover={hover3DSubtle}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className={`h-full p-4 md:p-6 ${cardBackgroundStyles.mixed}`} glow="blue" hoverEffect={false}>
                  <AnalyticsDashboard />
                </GlassCard>
              </motion.div>
            </BentoItem>
          </BentoGrid>
        </motion.div>
      </main>
      
      <MessagingWidget 
        currentUserId="admin"
        currentUserRole="admin"
        currentUserName="Admin"
      />
    </PageLayout>
  );
}
