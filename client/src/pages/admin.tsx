import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { Shield, Users, FileText, Settings, BarChart3, Bell, Sparkles, ArrowRight, Palette, Search, Mail, Calendar, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Lead, Estimate } from "@shared/schema";
import { format } from "date-fns";

const ADMIN_PIN = "4444";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: estimates = [], isLoading: estimatesLoading } = useQuery<Estimate[]>({
    queryKey: ["/api/estimates"],
    queryFn: async () => {
      const res = await fetch("/api/estimates");
      if (!res.ok) throw new Error("Failed to fetch estimates");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid PIN");
      setPin("");
    }
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
                  <h1 className="text-3xl font-display font-bold mb-2">Admin Access</h1>
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
      <main className="pt-24 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-blue-500/20 flex items-center justify-center shadow-lg shadow-accent/20 border border-accent/20"
              whileHover={{ scale: 1.1, rotateZ: 5 }}
            >
              <Shield className="w-7 h-7 text-accent" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your painting business</p>
            </div>
          </div>
        </div>

        {/* Configurable Notice */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 border-dashed border-accent/30 bg-gradient-to-r from-accent/5 via-purple-500/5 to-accent/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">Fully Customizable Dashboard</h3>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <p className="text-muted-foreground">
                  This dashboard can be configured any way you want. Name your design, describe your needs, and it will be made to your specifications.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <BentoGrid>
          {/* Email Database - Large Card */}
          <BentoItem colSpan={8} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6 md:p-8 bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5" glow>
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

                {/* Search Bar */}
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

                {/* Leads List */}
                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
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
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-8" glow>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Estimates</h2>
                </div>
                <div className="space-y-4">
                  <div className="text-5xl font-bold text-accent">{estimatesLoading ? "--" : estimates.length}</div>
                  <p className="text-muted-foreground">Total estimates created</p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground">
                      {estimates.length > 0 
                        ? `$${estimates.reduce((sum, e) => sum + parseFloat(e.totalEstimate || "0"), 0).toLocaleString()} total value`
                        : "No estimates yet"}
                    </p>
                  </div>
                </div>
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
            <motion.div className="h-full" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-6" glow>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-display font-bold">Analytics</h2>
                </div>
                <p className="text-sm text-muted-foreground">Track your business performance</p>
                <p className="text-xs text-accent mt-2">Coming Soon</p>
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
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
