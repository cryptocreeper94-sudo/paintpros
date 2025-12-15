import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { MapPin, Users, Target, Calendar, Phone, Mail, ClipboardList, ArrowRight, Eye, Settings, Sparkles, TrendingUp } from "lucide-react";
import { hover3D, hover3DSubtle, cardVariants, staggerContainer, iconContainerStyles, cardBackgroundStyles } from "@/lib/theme-effects";
import { RoomScannerCard } from "@/components/room-scanner";
import { useQuery } from "@tanstack/react-query";
import { DealsPipeline } from "@/components/crm/deals-pipeline";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { PinChangeModal } from "@/components/ui/pin-change-modal";
import type { Lead } from "@shared/schema";
import { useTenant } from "@/context/TenantContext";
import { useAccess } from "@/context/AccessContext";

const DEFAULT_PROJECT_MANAGER_PIN = "2222";

export default function ProjectManager() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  const [isAuthenticated, setIsAuthenticated] = useState(isDemo);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [currentPin, setCurrentPin] = useState(DEFAULT_PROJECT_MANAGER_PIN);
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);
  const { login, currentUser, canViewSalesData } = useAccess();

  useEffect(() => {
    const initPin = async () => {
      try {
        await fetch("/api/auth/pin/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "project_manager", defaultPin: DEFAULT_PROJECT_MANAGER_PIN }),
        });
      } catch (err) {
        console.error("Failed to init PIN:", err);
      }
    };
    initPin();
  }, []);

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
    enabled: isAuthenticated,
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "project_manager", pin }),
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
      login("project_manager");
      
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

  const getTotalDeals = () => {
    return pipelineSummary.reduce((sum, s) => sum + s.count, 0);
  };

  const getTotalPipelineValue = () => {
    return pipelineSummary
      .filter(s => s.stage !== "lost")
      .reduce((sum, s) => sum + parseFloat(s.totalValue || "0"), 0);
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
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-accent/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-teal-500/20" glow="blue" hoverEffect="3d" animatedBorder>
                <div className="text-center mb-8">
                  <motion.div 
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${iconContainerStyles.base} ${iconContainerStyles.gradients.blue} bg-gradient-to-br from-teal-500/30 to-accent/20 border-teal-500/30 shadow-teal-500/20`}
                    whileHover={hover3D}
                  >
                    <MapPin className="w-10 h-10 text-teal-400" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">Project Manager</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-teal-500/30"
                    maxLength={4}
                    data-testid="input-project-manager-pin"
                  />
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">{error}</motion.p>}
                  <FlipButton className="w-full h-14" data-testid="button-project-manager-login">
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
      <main className="pt-20 px-4 md:px-6 pb-24">
        {isDemo && (
          <motion.div 
            className="max-w-7xl mx-auto mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-r from-teal-500/20 via-accent/10 to-teal-500/20 border border-teal-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Eye className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="font-bold text-teal-400 text-sm">Demo Mode - Private Project Manager Control Panel</p>
                  <p className="text-xs text-muted-foreground">PIN-protected access for territory and sales management.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!isDemo && currentUser.role === "project_manager" && !canViewSalesData() && (
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
                  <p className="font-bold text-purple-400 text-sm">Welcome! Your system is being set up.</p>
                  <p className="text-xs text-muted-foreground">Sales features are being configured. Territory tools are fully available!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.lg} ${iconContainerStyles.gradients.blue} rounded-2xl`}
                whileHover={hover3D}
              >
                <MapPin className="w-6 h-6 text-teal-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Project Manager Dashboard</h1>
                <p className="text-sm text-muted-foreground">Sales & territory management</p>
              </div>
            </div>
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

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <BentoGrid>
            {/* Stats Row - 4 small cards */}
            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={0} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.blue}`} glow="blue" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.sm} ${iconContainerStyles.gradients.blue}`}>
                      <Target className="w-4 h-4 text-teal-400" />
                    </motion.div>
                    <span className="text-sm font-medium">My Leads</span>
                  </div>
                  <div className="text-3xl font-bold text-teal-400">{canViewSalesData() ? leads.length : "--"}</div>
                  <p className="text-xs text-muted-foreground mt-1">{canViewSalesData() ? "In territory" : "Coming soon"}</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={1} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.sm} ${iconContainerStyles.gradients.accent}`}>
                      <ClipboardList className="w-4 h-4 text-accent" />
                    </motion.div>
                    <span className="text-sm font-medium">Active Deals</span>
                  </div>
                  <div className="text-3xl font-bold text-accent">{canViewSalesData() ? getTotalDeals() : "--"}</div>
                  <p className="text-xs text-muted-foreground mt-1">{canViewSalesData() ? "In pipeline" : "Coming soon"}</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={2} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.gold}`} glow="gold" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.sm} ${iconContainerStyles.gradients.gold}`}>
                      <Calendar className="w-4 h-4 text-gold-400" />
                    </motion.div>
                    <span className="text-sm font-medium">Appointments</span>
                  </div>
                  <div className="text-3xl font-bold text-gold-400">--</div>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={3} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.green}`} glow="green" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.sm} ${iconContainerStyles.gradients.green}`}>
                      <Users className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <span className="text-sm font-medium">Conversions</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">--%</div>
                  <p className="text-xs text-muted-foreground mt-1">Lead to sale</p>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Deals Pipeline - Large Card */}
            <BentoItem colSpan={8} rowSpan={2}>
              <motion.div className="h-full" variants={cardVariants} custom={4} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.purple}`} glow="purple" hoverEffect={false} animatedBorder>
                  {canViewSalesData() ? (
                    <DealsPipeline />
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.purple} ${iconContainerStyles.base}`}>
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
              <motion.div className="h-full" variants={cardVariants} custom={5} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.blue}`} glow="blue" hoverEffect={false}>
                  {canViewSalesData() ? (
                    <ActivityTimeline maxHeight="280px" />
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <motion.div className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.blue} ${iconContainerStyles.base}`}>
                          <TrendingUp className="w-4 h-4 text-teal-400" />
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

            {/* Quick Actions - Medium Card */}
            <BentoItem colSpan={8} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={6} whileHover={hover3DSubtle}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.mixed}`} glow="accent" hoverEffect={false}>
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.sm} ${iconContainerStyles.gradients.blue}`}>
                      <Phone className="w-4 h-4 text-teal-400" />
                    </motion.div>
                    <h2 className="text-lg font-display font-bold">Quick Actions</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div 
                      className="bg-black/5 dark:bg-white/5 rounded-xl p-3 text-center border border-border dark:border-white/10 cursor-pointer backdrop-blur-sm"
                      whileHover={hover3DSubtle}
                      data-testid="button-quick-call"
                    >
                      <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.blue} mx-auto mb-1.5`}>
                        <Phone className="w-5 h-5 text-teal-400" />
                      </motion.div>
                      <p className="text-sm font-medium">Call Lead</p>
                      <p className="text-xs text-muted-foreground">Start conversation</p>
                    </motion.div>
                    <motion.div 
                      className="bg-black/5 dark:bg-white/5 rounded-xl p-3 text-center border border-border dark:border-white/10 cursor-pointer backdrop-blur-sm"
                      whileHover={hover3DSubtle}
                      data-testid="button-quick-email"
                    >
                      <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.accent} mx-auto mb-1.5`}>
                        <Mail className="w-5 h-5 text-accent" />
                      </motion.div>
                      <p className="text-sm font-medium">Send Email</p>
                      <p className="text-xs text-muted-foreground">Follow up</p>
                    </motion.div>
                    <motion.div 
                      className="bg-black/5 dark:bg-white/5 rounded-xl p-3 text-center border border-border dark:border-white/10 cursor-pointer backdrop-blur-sm"
                      whileHover={hover3DSubtle}
                      data-testid="button-quick-schedule"
                    >
                      <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.gold} mx-auto mb-1.5`}>
                        <Calendar className="w-5 h-5 text-gold-400" />
                      </motion.div>
                      <p className="text-sm font-medium">Schedule Visit</p>
                      <p className="text-xs text-muted-foreground">Book appointment</p>
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Room Scanner */}
            <BentoItem colSpan={4} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={7}>
                <RoomScannerCard locked={false} accentColor="teal-400" />
              </motion.div>
            </BentoItem>

            {/* Pipeline Value Summary */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={8} whileHover={hover3D}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.blue}`} glow="blue" hoverEffect={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.blue}`} whileHover={hover3DSubtle}>
                        <Target className="w-4 h-4 text-teal-400" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-display font-bold">My Pipeline Value</h2>
                        <p className="text-xs text-muted-foreground">{canViewSalesData() ? `${getTotalDeals()} active deals` : "Coming soon"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-teal-400">{canViewSalesData() ? `$${getTotalPipelineValue().toLocaleString()}` : "$--"}</div>
                      <p className="text-xs text-muted-foreground">{canViewSalesData() ? "Total potential" : "Being configured"}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </BentoItem>

            {/* Territory Info */}
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div className="h-full" variants={cardVariants} custom={9} whileHover={hover3D}>
                <GlassCard className={`h-full p-4 ${cardBackgroundStyles.accent}`} glow="accent" hoverEffect={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.accent}`} whileHover={hover3DSubtle}>
                        <MapPin className="w-4 h-4 text-accent" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-display font-bold">Territory</h2>
                        <p className="text-xs text-muted-foreground">Nashville Metro Area</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-accent">Active</div>
                      <p className="text-xs text-muted-foreground">Territory status</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </BentoItem>
          </BentoGrid>
        </motion.div>
      </main>

      <PinChangeModal
        isOpen={showPinChangeModal}
        role="project_manager"
        roleLabel="Project Manager"
        currentPin={currentPin}
        onSuccess={handlePinChangeSuccess}
        onClose={() => setShowPinChangeModal(false)}
        accentColor="teal-400"
      />
    </PageLayout>
  );
}
