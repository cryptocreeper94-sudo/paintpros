import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, TrendingUp, DollarSign, Users, Target, 
  Zap, Copy, CheckCircle, ChevronRight, Rocket,
  BarChart3, Shield, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { toast } from "sonner";
import { Link } from "wouter";

interface InvestorSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POWER_STATS = [
  { label: "LTV:CAC Ratio", value: "44:1", color: "text-green-500", icon: TrendingUp, description: "Industry-leading unit economics" },
  { label: "TAM", value: "$46.5B", color: "text-blue-500", icon: Target, description: "U.S. painting services market" },
  { label: "Gross Margin", value: "85%", color: "text-purple-500", icon: BarChart3, description: "Low infrastructure costs" },
  { label: "3-Year LTV", value: "$22.2K", color: "text-amber-500", icon: DollarSign, description: "Per customer lifetime value" },
];

const QUICK_FACTS = [
  "300,000+ painting contractors in the U.S. alone",
  "Zero competitors offer white-label + blockchain verification",
  "First-mover advantage in AI-powered estimating for painters",
  "Recurring revenue model with 85% gross margin",
  "Scalable multi-tenant architecture built for franchises",
  "Year 3 projection: $5.2M revenue, $2.8M profit",
];

export function InvestorSnapshotModal({ isOpen, onClose }: InvestorSnapshotModalProps) {
  const [copied, setCopied] = useState(false);

  const copyElevatorPitch = () => {
    const pitch = `PaintPros.io - Investment Executive Summary

OPPORTUNITY: The $46.5B U.S. painting industry has 300,000+ contractors with no modern white-label SaaS solution.

KEY METRICS:
• LTV:CAC Ratio: 44:1 (industry-leading)
• Gross Margin: 85%
• 3-Year Customer LTV: $22,200
• Customer Acquisition Cost: $500

TRACTION TARGET:
• Year 1: 50 customers, $564K revenue
• Year 3: 500 customers, $5.2M revenue, $2.8M profit

DIFFERENTIATORS:
• Only platform with white-label website + blockchain verification
• AI-powered color visualizer and instant estimates
• Multi-location franchise support with tiered pricing
• Solana + Darkwave dual-chain document stamping

PRICING: $349-$1,399/month + $5,000-$15,000 setup fees
Average deal size: $6,000 setup + $450/month

MARKET GAP: Competitors (Jobber, ServiceTitan, HouseCall Pro) offer generic CRMs. None provide branded customer-facing websites with interactive estimators.

Contact: Darkwave Studios / Orbit Development Team`;

    navigator.clipboard.writeText(pitch);
    setCopied(true);
    toast.success("Executive summary copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[85vh] overflow-auto z-50 rounded-2xl"
          >
            <GlassCard className="p-0 overflow-hidden" glow>
              <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600/90 to-emerald-600/90 backdrop-blur-md p-6 border-b border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Investor Snapshot</h2>
                      <p className="text-sm text-white/70">Executive Summary</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyElevatorPitch}
                      className="bg-white/20 text-white border-white/30"
                      data-testid="button-copy-exec-summary"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied" : "Copy Pitch"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-white"
                      data-testid="button-close-investor-snapshot"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {POWER_STATS.map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-center p-4 rounded-xl bg-white/5 border border-border"
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/20">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Why This Matters
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {QUICK_FACTS.map((fact, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/5 border border-border p-5">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-500" />
                      Pricing Model
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Starter</span>
                        <span className="font-mono text-green-500">$349/mo + $5K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Professional</span>
                        <span className="font-mono text-green-500">$549/mo + $7K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Franchise Core</span>
                        <span className="font-mono text-green-500">$799/mo + $10K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Enterprise</span>
                        <span className="font-mono text-green-500">$1,399/mo + $15K</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-border p-5">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      Revenue Trajectory
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Year 1</span>
                        <div className="text-right">
                          <span className="font-mono text-green-500">$564K</span>
                          <span className="text-xs text-muted-foreground ml-2">50 customers</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Year 2</span>
                        <div className="text-right">
                          <span className="font-mono text-green-500">$2.28M</span>
                          <span className="text-xs text-muted-foreground ml-2">200 customers</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Year 3</span>
                        <div className="text-right">
                          <span className="font-mono text-green-500">$5.2M</span>
                          <span className="text-xs text-muted-foreground ml-2">500 customers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 border border-border p-5">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Why We Win vs Competitors
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Feature</th>
                          <th className="text-center py-2 font-medium text-green-500">PaintPros</th>
                          <th className="text-center py-2 font-medium text-muted-foreground">Jobber</th>
                          <th className="text-center py-2 font-medium text-muted-foreground">ServiceTitan</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b border-white/5">
                          <td className="py-2">White-Label Website</td>
                          <td className="text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2">Customer-Facing Estimator</td>
                          <td className="text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                          <td className="text-center text-xs text-yellow-500">Internal</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2">AI Color Visualizer</td>
                          <td className="text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-2">Blockchain Verification</td>
                          <td className="text-center"><CheckCircle className="w-4 h-4 text-green-500 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                          <td className="text-center"><X className="w-4 h-4 text-red-400 mx-auto" /></td>
                        </tr>
                        <tr>
                          <td className="py-2">Setup Fee</td>
                          <td className="text-center text-green-500">$5-15K</td>
                          <td className="text-center">$0</td>
                          <td className="text-center">$5-30K</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-5 border border-green-500/20">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Competitive Moat
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Only platform combining white-label websites, AI color visualization, interactive estimating, 
                    and dual-chain blockchain verification. Competitors offer generic CRMs with no customer-facing tools.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">White-Label</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">AI Visualizer</span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">Blockchain</span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs">Franchise-Ready</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/investors" className="flex-1">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={onClose}
                      data-testid="button-view-full-investor-docs"
                    >
                      View Full Investor Documentation
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={copyElevatorPitch}
                    className="sm:w-auto"
                    data-testid="button-copy-pitch-secondary"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Elevator Pitch
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
