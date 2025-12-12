import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { Crown, DollarSign, TrendingUp, Users, Calendar, FileText, ArrowRight, Palette, Sparkles } from "lucide-react";

const OWNER_PIN = "1111";

export default function Owner() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === OWNER_PIN) {
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
          <BentoItem colSpan={4} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-8 bg-gradient-to-br from-gold-400/10 to-transparent" glow>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gold-400/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-gold-400" />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Revenue</h2>
                </div>
                <div className="space-y-4">
                  <div className="text-5xl font-bold text-gold-400">$--</div>
                  <p className="text-muted-foreground">This month</p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Revenue tracking coming soon</span>
                    </div>
                  </div>
                </div>
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
                  <Calendar className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Jobs</h3>
                </div>
                <div className="text-3xl font-bold text-accent mb-2">--</div>
                <p className="text-sm text-muted-foreground">Scheduled this week</p>
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

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h3 className="text-xl font-bold">Growth</h3>
                </div>
                <p className="text-sm text-muted-foreground">Business analytics and projections coming soon</p>
              </GlassCard>
            </motion.div>
          </BentoItem>
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
