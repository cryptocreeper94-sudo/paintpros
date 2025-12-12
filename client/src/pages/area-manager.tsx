import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { MapPin, Users, Target, Calendar, Phone, Mail, ClipboardList, ArrowRight, Palette, Sparkles, Database, LayoutDashboard } from "lucide-react";

const AREA_MANAGER_PIN = "2222";

export default function AreaManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === AREA_MANAGER_PIN) {
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

        <BentoGrid>
          {/* CRM Placeholder - Large Card */}
          <BentoItem colSpan={8} rowSpan={2}>
            <motion.div className="h-full" whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
              <GlassCard className="h-full p-8 bg-gradient-to-br from-teal-500/10 via-transparent to-accent/5" glow>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-accent/20 flex items-center justify-center">
                    <Database className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">CRM Integration</h2>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 text-xs font-medium">Available Add-On</span>
                  </div>
                </div>
                <div className="h-48 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/10 mb-4">
                  <LayoutDashboard className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Customer Relationship Management</p>
                  <p className="text-sm text-muted-foreground mt-2">Full CRM system available as an optional feature</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-teal-400 font-semibold">CRM Features:</span> Lead tracking, customer history, follow-up reminders, pipeline management, and more. Ask about adding this to your dashboard.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">My Leads</h3>
                </div>
                <div className="text-4xl font-bold text-accent mb-2">--</div>
                <p className="text-sm text-muted-foreground">Assigned to your territory</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Appointments</h3>
                </div>
                <div className="text-4xl font-bold text-accent mb-2">--</div>
                <p className="text-sm text-muted-foreground">Scheduled this week</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ClipboardList className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Estimates Sent</h3>
                </div>
                <div className="text-4xl font-bold text-accent mb-2">--</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.02 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Conversions</h3>
                </div>
                <div className="text-4xl font-bold text-green-400 mb-2">--%</div>
                <p className="text-sm text-muted-foreground">Lead to sale ratio</p>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Phone className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Call Lead</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Send Email</p>
                  </motion.div>
                  <motion.div 
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-accent" />
                    <p className="text-xs text-muted-foreground">Schedule</p>
                  </motion.div>
                </div>
              </GlassCard>
            </motion.div>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={1}>
            <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
              <GlassCard className="h-full p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <h3 className="text-xl font-bold">My Territory</h3>
                </div>
                <p className="text-sm text-muted-foreground">Territory map and boundaries coming soon</p>
              </GlassCard>
            </motion.div>
          </BentoItem>
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
