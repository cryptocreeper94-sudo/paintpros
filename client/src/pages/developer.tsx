import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { Code, Database, Server, Terminal, GitBranch, Cpu, Bug, ArrowRight, Zap } from "lucide-react";

const DEVELOPER_PIN = "0424";

export default function Developer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEVELOPER_PIN) {
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-accent/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-purple-500/20" glow>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-accent/20 flex items-center justify-center border border-purple-500/30">
                    <Code className="w-10 h-10 text-purple-400" />
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-2">Developer Access</h1>
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
                    data-testid="input-developer-pin"
                  />
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <FlipButton className="w-full h-14" data-testid="button-developer-login">
                    Access Console <ArrowRight className="w-5 h-5" />
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
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Code className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Developer Console</h1>
              <p className="text-muted-foreground">System configuration and debugging</p>
            </div>
          </div>
        </div>

        <BentoGrid>
          <BentoItem colSpan={4} rowSpan={2}>
            <GlassCard className="h-full p-8 bg-gradient-to-br from-purple-500/10 to-transparent" glow>
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-display font-bold">Database</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-medium">Connected</span>
                </div>
                <div className="bg-black/30 rounded-xl p-4 font-mono text-xs text-muted-foreground">
                  <p>PostgreSQL</p>
                  <p className="text-accent">Tables: leads, estimates</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-muted-foreground">Database management coming soon</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Server className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">API Status</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-sm text-green-400">All systems operational</span>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Performance</h3>
              </div>
              <p className="text-sm text-muted-foreground">Metrics dashboard coming soon</p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={8} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold">Console</h3>
              </div>
              <div className="bg-black/50 rounded-xl p-4 font-mono text-sm h-32 overflow-auto border border-white/10">
                <p className="text-green-400">[System] Application initialized</p>
                <p className="text-muted-foreground">[Info] Database connection established</p>
                <p className="text-muted-foreground">[Info] API routes registered</p>
                <p className="text-accent">[Ready] Server listening on port 5000</p>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <GitBranch className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Version Control</h3>
              </div>
              <p className="text-sm text-muted-foreground font-mono">main branch</p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="h-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bug className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold">Debug Mode</h3>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">Development environment</span>
              </div>
            </GlassCard>
          </BentoItem>
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
