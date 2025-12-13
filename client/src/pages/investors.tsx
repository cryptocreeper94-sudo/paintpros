import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { 
  DollarSign, TrendingUp, Users, Building2, Globe, 
  Rocket, Shield, Zap, Copy, CheckCircle, Award,
  BarChart3, Target, Layers, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const PRICING_TIERS = [
  { tier: "Starter", price: "$1,500/mo", setup: "$2,500", target: "Solo contractors", features: ["White-label website", "Interactive estimator", "Basic CRM", "Email support"] },
  { tier: "Professional", price: "$2,500/mo", setup: "$4,500", target: "1-3 locations", features: ["Everything in Starter", "Full analytics", "Role-based dashboards", "Phone support", "Blockchain stamping"] },
  { tier: "Franchise Core", price: "$4,000/mo + $500/loc", setup: "$7,500", target: "5+ sites", features: ["Everything in Pro", "Multi-tenant console", "Orbit integrations", "Dedicated manager"] },
  { tier: "Enterprise", price: "$8,000/mo base", setup: "$15,000", target: "Large franchises", features: ["Full brand suppression", "API priority", "Custom SLAs", "White-glove onboarding"] },
];

const PROJECTIONS = [
  { year: "2025", customers: 100, mrr: "$25K", revenue: "$300K", profit: "$120K" },
  { year: "2026", customers: 500, mrr: "$125K", revenue: "$1.5M", profit: "$900K" },
  { year: "2027", customers: 2000, mrr: "$500K", revenue: "$6M", profit: "$3.6M" },
];

export default function Investors() {
  const [copied, setCopied] = useState(false);

  const copyPricingSheet = () => {
    const content = `PaintPros.io - Investor Pricing Sheet
Prepared by: Orbit Development Team | December 2025

LICENSING TIERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tier                    Monthly             Setup Fee    Target
─────────────────────────────────────────────────────────────
Starter                 $1,500/mo           $2,500       Solo contractors
Professional            $2,500/mo           $4,500       1-3 locations
Franchise Core          $4,000/mo + $500/loc  $7,500     5+ sites
Enterprise White-Label  $8,000/mo base      $15,000      Large franchises

UNIT ECONOMICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gross Margin:           65%
LTV:CAC Ratio:          22:1
ARPU:                   $2,500/month
3-Year Customer LTV:    $8,964
CAC (projected):        $400

REVENUE PROJECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Year    Customers    MRR        Annual Revenue    Net Profit
2025    100          $25K       $300K             $120K
2026    500          $125K      $1.5M             $900K
2027    2,000        $500K      $6M               $3.6M

MARKET OPPORTUNITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

U.S. Painting Services Market: $46.5B annually
Painting Contractors: 300,000+
Residential Growth: 4.2% CAGR
Commercial Growth: 3.8% CAGR

COMPETITIVE ADVANTAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Industry Specialization - Built for painters, not generic field service
• Blockchain Trust - Solana verification for document integrity
• Orbit Ecosystem - Connected payroll, staffing, development tools
• Premium Design - Modern Bento Grid + glassmorphism aesthetics

DARKWAVE STUDIOS ECOSYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PaintPros.io is part of the Darkwave Studios portfolio:
• ORBIT Platform - Enterprise development infrastructure
• Hallmark System - Blockchain asset verification
• Dev Hub - Shared code snippets and integrations

Contact: Orbit Development Team
Website: https://paintpros.io
Ecosystem: https://darkwavestudios.io`;

    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Investor sheet copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <PageLayout>
      <main className="pt-24 pb-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              Investment Opportunity
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Invest in <span className="text-accent">PaintPros.io</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A Darkwave Studios product powering the $46.5B painting industry with cutting-edge SaaS technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6 h-full text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400">$46.5B</p>
                <p className="text-muted-foreground">U.S. Painting Market</p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6 h-full text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-400">300K+</p>
                <p className="text-muted-foreground">Target Contractors</p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 h-full text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-purple-400">22:1</p>
                <p className="text-muted-foreground">LTV:CAC Ratio</p>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <GlassCard className="p-8" glow>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Layers className="w-6 h-6 text-accent" />
                  Licensing Tiers
                </h2>
                <FlipButton
                  onClick={copyPricingSheet}
                  className="px-4"
                  data-testid="button-copy-investor-sheet"
                >
                  {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Sheet"}
                </FlipButton>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PRICING_TIERS.map((tier, i) => (
                  <motion.div
                    key={tier.tier}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`rounded-xl p-5 border ${
                      tier.tier === "Professional" 
                        ? "bg-accent/10 border-accent/30" 
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    {tier.tier === "Professional" && (
                      <div className="text-xs text-accent font-medium mb-2">MOST POPULAR</div>
                    )}
                    <h3 className="font-bold text-lg mb-1">{tier.tier}</h3>
                    <p className="text-2xl font-bold text-green-400 mb-1">{tier.price}</p>
                    <p className="text-xs text-muted-foreground mb-3">+ {tier.setup} setup</p>
                    <p className="text-sm text-muted-foreground mb-4">{tier.target}</p>
                    <ul className="space-y-2">
                      {tier.features.map((f, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Revenue Projections
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {PROJECTIONS.map((p, i) => (
                  <div
                    key={p.year}
                    className={`rounded-xl p-6 text-center ${
                      i === 2 ? "bg-gradient-to-br from-purple-500/20 to-accent/10 border border-purple-500/30" : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground mb-2">{p.year}</p>
                    <p className={`text-4xl font-bold mb-2 ${
                      i === 0 ? "text-green-400" : i === 1 ? "text-blue-400" : "text-purple-400"
                    }`}>
                      {p.revenue}
                    </p>
                    <p className="text-sm text-muted-foreground">Annual Revenue</p>
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Customers</p>
                        <p className="font-mono font-bold">{p.customers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net Profit</p>
                        <p className="font-mono font-bold text-green-400">{p.profit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard className="p-6 h-full">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  Unit Economics
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Gross Margin", value: "65%", color: "text-green-400" },
                    { label: "LTV:CAC Ratio", value: "22:1", color: "text-blue-400" },
                    { label: "ARPU", value: "$2,500/mo", color: "text-accent" },
                    { label: "3-Year Customer LTV", value: "$8,964", color: "text-purple-400" },
                    { label: "Infrastructure Cost", value: "~$45/tenant", color: "text-muted-foreground" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className={`font-mono font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <GlassCard className="p-6 h-full">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-amber-400" />
                  Competitive Advantages
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: <Zap className="w-4 h-4 text-yellow-400" />, title: "Industry Specialization", desc: "Built for painters, not generic field service" },
                    { icon: <Shield className="w-4 h-4 text-purple-400" />, title: "Blockchain Trust", desc: "Solana verification for document integrity" },
                    { icon: <Layers className="w-4 h-4 text-blue-400" />, title: "Orbit Ecosystem", desc: "Connected payroll, staffing, dev tools" },
                    { icon: <Award className="w-4 h-4 text-accent" />, title: "Premium Design", desc: "Modern Bento Grid + glassmorphism" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <GlassCard className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Darkwave Studios Ecosystem</h2>
                  <p className="text-muted-foreground">PaintPros.io is part of a larger vision</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Globe className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="font-bold">ORBIT Platform</h4>
                  <p className="text-xs text-muted-foreground">Enterprise development infrastructure with multi-tenant architecture</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Shield className="w-6 h-6 text-amber-400 mb-2" />
                  <h4 className="font-bold">Hallmark System</h4>
                  <p className="text-xs text-muted-foreground">Blockchain-based asset verification and document stamping</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <Layers className="w-6 h-6 text-purple-400 mb-2" />
                  <h4 className="font-bold">Dev Hub</h4>
                  <p className="text-xs text-muted-foreground">Shared code snippets, integrations, and development tools</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:invest@darkwavestudios.io"
                  className="flex-1"
                >
                  <FlipButton className="w-full" data-testid="button-contact-invest">
                    Contact for Investment <ArrowRight className="w-4 h-4 ml-2" />
                  </FlipButton>
                </a>
                <a
                  href="https://darkwavestudios.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <button className="w-full py-3 px-6 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-colors font-medium">
                    Visit Darkwave Studios
                  </button>
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
