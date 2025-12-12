import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { MapPin, Users, Target, Calendar, Phone, Mail, ClipboardList, ArrowRight, Palette, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DealsPipeline } from "@/components/crm/deals-pipeline";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { PinChangeModal } from "@/components/ui/pin-change-modal";
import type { Lead } from "@shared/schema";

const DEFAULT_AREA_MANAGER_PIN = "2222";

export default function AreaManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [currentPin, setCurrentPin] = useState(DEFAULT_AREA_MANAGER_PIN);
  const [showPinChangeModal, setShowPinChangeModal] = useState(false);

  useEffect(() => {
    const initPin = async () => {
      try {
        await fetch("/api/auth/pin/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "area_manager", defaultPin: DEFAULT_AREA_MANAGER_PIN }),
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
        body: JSON.stringify({ role: "area_manager", pin }),
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

  const getTotalDeals = () => {
    return pipelineSummary.reduce((sum, s) => sum + s.count, 0);
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
              <GlassCard className="relative p-10 border-teal-500/20" glow>
                <div className="text-center mb-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500/30 to-accent/20 flex items-center justify-center border border-teal-500/30 shadow-lg shadow-teal-500/20"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    transition={{ type: "spring" }}
                  >
                    <MapPin className="w-10 h-10 text-teal-400" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">Area Manager</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-teal-500/30"
                    maxLength={4}
                    data-testid="input-area-manager-pin"
                  />
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">{error}</motion.p>}
                  <FlipButton className="w-full h-14" data-testid="button-area-manager-login">
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
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/30 to-accent/20 flex items-center justify-center shadow-lg shadow-teal-500/20 border border-teal-500/20"
              whileHover={{ scale: 1.1, rotateZ: 5 }}
            >
              <MapPin className="w-7 h-7 text-teal-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Area Manager Dashboard</h1>
              <p className="text-muted-foreground">Sales & territory management</p>
            </div>
          </div>
        </div>

        {/* Configurable Notice */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 border-dashed border-teal-500/30 bg-gradient-to-r from-teal-500/5 via-accent/5 to-teal-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">Fully Customizable Dashboard</h3>
                  <Sparkles className="w-4 h-4 text-teal-400" />
                </div>
                <p className="text-muted-foreground">
                  This dashboard can be configured any way you want. Name your design, describe your needs, and it will be made to your specifications.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">My Leads</h3>
                </div>
                <div className="text-3xl font-bold text-accent mb-1">{leads.length}</div>
                <p className="text-xs text-muted-foreground">In your territory</p>
              </GlassCard>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClipboardList className="w-5 h-5 text-teal-400" />
                  <h3 className="text-lg font-bold">Active Deals</h3>
                </div>
                <div className="text-3xl font-bold text-teal-400 mb-1">{getTotalDeals()}</div>
                <p className="text-xs text-muted-foreground">In pipeline</p>
              </GlassCard>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">Appointments</h3>
                </div>
                <div className="text-3xl font-bold text-accent mb-1">--</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </GlassCard>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold">Conversions</h3>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-1">--%</div>
                <p className="text-xs text-muted-foreground">Lead to sale</p>
              </GlassCard>
            </motion.div>
          </div>

          {/* CRM Deals Pipeline */}
          <GlassCard className="p-6" glow>
            <DealsPipeline />
          </GlassCard>

          {/* Activity Timeline and Quick Actions */}
          <BentoGrid>
            <BentoItem colSpan={8} rowSpan={1}>
              <GlassCard className="h-full p-6">
                <ActivityTimeline />
              </GlassCard>
            </BentoItem>

            <BentoItem colSpan={4} rowSpan={1}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-4 text-center border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    data-testid="button-quick-call"
                  >
                    <Phone className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <p className="text-sm text-muted-foreground">Call Lead</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-4 text-center border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    data-testid="button-quick-email"
                  >
                    <Mail className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <p className="text-sm text-muted-foreground">Send Email</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-4 text-center border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    data-testid="button-quick-schedule"
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <p className="text-sm text-muted-foreground">Schedule Visit</p>
                  </motion.div>
                </div>
              </GlassCard>
            </BentoItem>
          </BentoGrid>
        </div>
      </main>

      <PinChangeModal
        isOpen={showPinChangeModal}
        role="area_manager"
        roleLabel="Area Manager"
        currentPin={currentPin}
        onSuccess={handlePinChangeSuccess}
        accentColor="teal-400"
      />
    </PageLayout>
  );
}
