import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { Shield, Users, FileText, Settings, BarChart3, Bell, Lock, ArrowRight } from "lucide-react";

const ADMIN_PIN = "4444";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

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
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/30 to-blue-500/20 flex items-center justify-center border border-accent/30">
                    <Shield className="w-10 h-10 text-accent" />
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-2">Admin Access</h1>
                  <p className="text-muted-foreground">Enter your PIN to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl"
                    maxLength={4}
                    data-testid="input-admin-pin"
                  />
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your painting business</p>
            </div>
          </div>
        </div>

        <BentoGrid>
          <BentoItem colSpan={4} rowSpan={2}>
            <GlassCard className="h-full p-8" glow>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-display font-bold">Leads</h2>
              </div>
              <div className="space-y-4">
                <div className="text-5xl font-bold text-accent">--</div>
                <p className="text-muted-foreground">Total leads captured</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-muted-foreground">Lead management coming soon</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2}>
            <GlassCard className="h-full p-8" glow>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-display font-bold">Estimates</h2>
              </div>
              <div className="space-y-4">
                <div className="text-5xl font-bold text-accent">--</div>
                <p className="text-muted-foreground">Total estimates created</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-muted-foreground">View all estimates coming soon</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2}>
            <GlassCard className="h-full p-8" glow>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-display font-bold">Analytics</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">Track your business performance</p>
                <div className="h-32 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <p className="text-sm text-muted-foreground">Charts coming soon</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Recent Activity</h3>
              </div>
              <p className="text-sm text-muted-foreground">No recent activity to display</p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Quick Settings</h3>
              </div>
              <p className="text-sm text-muted-foreground">Configure notifications and preferences</p>
            </GlassCard>
          </BentoItem>
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
