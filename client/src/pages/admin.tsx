import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { PinChangeModal } from "@/components/ui/pin-change-modal";
import { DealsPipeline } from "@/components/crm/deals-pipeline";
import { ActivityTimeline } from "@/components/crm/activity-timeline";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { Shield, Users, FileText, BarChart3, Bell, Sparkles, ArrowRight, Palette, Search, Mail, Calendar, Database, Settings, Camera, Clock, Send, X, CheckCircle } from "lucide-react";
import { RoomScannerCard } from "@/components/room-scanner";
import { useQuery } from "@tanstack/react-query";
import type { Lead, Estimate, EstimateFollowup } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const DEFAULT_PIN = "4444";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState(DEFAULT_PIN);
  const [activeTab, setActiveTab] = useState<"deals" | "leads" | "activities" | "followups">("deals");
  const queryClient = useQueryClient();

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
      
      if (data.mustChangePin) {
        setShowPinChange(true);
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
                  <h1 className="text-3xl font-display font-bold mb-2">Chief Operations Officer</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-accent/30"
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
        roleLabel="Chief Operations Officer"
        currentPin={currentPin}
        onSuccess={handlePinChangeSuccess}
      />

      <main className="pt-20 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-blue-500/20 flex items-center justify-center shadow-lg shadow-accent/20 border border-accent/20"
                whileHover={{ scale: 1.1, rotateZ: 5 }}
              >
                <Shield className="w-7 h-7 text-accent" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Chief Operations Officer</h1>
                <p className="text-muted-foreground">CRM & Business Operations</p>
              </div>
            </div>
            <motion.button
              onClick={() => setShowPinChange(true)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "deals", label: "Deals Pipeline", icon: BarChart3 },
              { id: "leads", label: "Email Database", icon: Database },
              { id: "followups", label: "Follow-ups", icon: Clock, badge: pendingFollowups.length },
              { id: "activities", label: "Activities", icon: Bell },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-accent/20 border-accent/30 text-accent"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === "followups" ? "Follow" : tab.id === "activities" ? "Activity" : tab.id === "deals" ? "Deals" : "Leads"}</span>
                {"badge" in tab && typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-accent/30 text-accent">
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === "deals" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 md:p-8" glow>
                <DealsPipeline />
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "leads" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 md:p-8 bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5" glow>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
                      <Database className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">Email Database</h2>
                      <p className="text-sm text-muted-foreground">Search and manage leads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-accent">{leads.length}</div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                  </div>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-white/5 border-white/20 rounded-xl h-12"
                    data-testid="input-search-leads"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {leadsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading leads...</div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        {searchQuery ? "No leads match your search" : "No leads captured yet"}
                      </p>
                    </div>
                  ) : (
                    leads.map((lead, index) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        data-testid={`lead-row-${lead.id}`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{lead.email}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "activities" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 md:p-8" glow>
                <ActivityTimeline showAll maxHeight="500px" />
              </GlassCard>
            </motion.div>
          )}

          {activeTab === "followups" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 md:p-8 bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5" glow>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">Scheduled Follow-ups</h2>
                      <p className="text-sm text-muted-foreground">Manage pending email reminders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-accent">{pendingFollowups.length}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {followupsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading follow-ups...</div>
                  ) : pendingFollowups.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500/50" />
                      <p className="text-muted-foreground">All caught up! No pending follow-ups.</p>
                    </div>
                  ) : (
                    pendingFollowups.map((followup, index) => (
                      <motion.div
                        key={followup.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        data-testid={`followup-row-${followup.id}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                followup.followupType === "reminder" 
                                  ? "bg-blue-500/20 text-blue-400"
                                  : followup.followupType === "quote_expiring"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-purple-500/20 text-purple-400"
                              }`}>
                                {followup.followupType === "reminder" ? "Reminder" : 
                                 followup.followupType === "quote_expiring" ? "Quote Expiring" : "Thank You"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Estimate #{followup.estimateId}
                              </span>
                            </div>
                            {followup.emailSubject && (
                              <p className="font-medium mb-1 truncate">{followup.emailSubject}</p>
                            )}
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Scheduled: {format(new Date(followup.scheduledFor), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => handleMarkSent(followup.id)}
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Mark as sent"
                              data-testid={`button-mark-sent-${followup.id}`}
                            >
                              <Send className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleCancelFollowup(followup.id)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              title="Cancel follow-up"
                              data-testid={`button-cancel-followup-${followup.id}`}
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>

        <BentoGrid className="mt-8">
          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6" glow>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-display font-bold">Estimates</h2>
                </div>
                <div className="text-4xl font-bold text-accent mb-2">{estimatesLoading ? "--" : estimates.length}</div>
                <p className="text-sm text-muted-foreground">
                  {estimates.length > 0 
                    ? `$${estimates.reduce((sum, e) => sum + parseFloat(e.totalEstimate || "0"), 0).toLocaleString()} total`
                    : "No estimates yet"}
                </p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6" glow>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-display font-bold">Leads</h2>
                </div>
                <div className="text-4xl font-bold text-accent mb-2">{leadsLoading ? "--" : leads.length}</div>
                <p className="text-sm text-muted-foreground">Total leads captured</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {leads.length > 0 
                    ? `Last lead: ${format(new Date(leads[0]?.createdAt || new Date()), "MMM d")}`
                    : "No recent activity"}
                </p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <RoomScannerCard locked={true} accentColor="accent" />
          </BentoItem>
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
