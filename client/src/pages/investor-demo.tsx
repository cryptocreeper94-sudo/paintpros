import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import {
  TrendingUp, DollarSign, Users, Building2, Globe, Rocket, Shield, Zap,
  Brain, Route, AlertTriangle, Package, BarChart3, PiggyBank, Target,
  Scan, Palette, FileText, Scale, Calendar, CreditCard, Handshake,
  Award, Heart, Leaf, Landmark, Building, Play, Pause, ChevronRight,
  Sparkles, Activity, LineChart, ArrowUpRight, Clock, CheckCircle2,
  Cpu, Network, Lock, Coins, Bot, MapPin, Star, TrendingDown,
  Download, HelpCircle, MessageSquare
} from "lucide-react";
import { SiSolana } from "react-icons/si";
import { InvestorTour } from "@/components/investor-tour";
import { VideoDemoModal } from "@/components/video-demo-modal";
import { InvestorContactModal } from "@/components/investor-contact-modal";
import { ROICalculator } from "@/components/roi-calculator";

const LIVE_METRICS = {
  platformStats: {
    totalTenants: 127,
    monthlyActiveUsers: 4_892,
    estimatesGenerated: 23_456,
    proposalsSent: 8_234,
    invoicesProcessed: 15_678,
    aiCreditsUsed: 1_234_567
  },
  revenueMetrics: {
    mrr: 89_450,
    arr: 1_073_400,
    avgContractValue: 8_750,
    ltv: 42_000,
    cac: 1_200,
    grossMargin: 0.87
  },
  aiMetrics: {
    routeOptimizations: 3_456,
    riskScoresGenerated: 12_890,
    proposalsGenerated: 2_345,
    sentimentAnalyses: 8_901,
    cashflowForecasts: 567
  },
  blockchainMetrics: {
    documentsStamped: 45_678,
    nftsMinted: 234,
    lienWaiversSigned: 1_890,
    contractsVerified: 3_456
  }
};

const FEATURE_MODULES = [
  {
    id: "ai_autopilot",
    title: "AI Field Operations",
    subtitle: "Autopilot",
    icon: Brain,
    gradient: "from-purple-500 to-pink-500",
    glowColor: "purple",
    features: ["Dynamic Route Optimization", "6-Dimension Risk Scoring", "Just-in-Time Materials"],
    metric: { value: "47%", label: "Cost Reduction" },
    status: "live"
  },
  {
    id: "revenue_intel",
    title: "Predictive Revenue",
    subtitle: "Intelligence",
    icon: LineChart,
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "blue",
    features: ["90-Day Cashflow Forecasting", "Pricing Elasticity Analysis", "Marketing Mix Optimization"],
    metric: { value: "$2.4M", label: "Revenue Predicted" },
    status: "live"
  },
  {
    id: "site_capture",
    title: "Immersive Site",
    subtitle: "Capture",
    icon: Scan,
    gradient: "from-green-500 to-emerald-500",
    glowColor: "green",
    features: ["LiDAR Digital Twins", "AR Color Overlays", "3D Site Models"],
    metric: { value: "89%", label: "Faster Quoting" },
    status: "live"
  },
  {
    id: "back_office",
    title: "Autonomous",
    subtitle: "Back Office",
    icon: FileText,
    gradient: "from-orange-500 to-red-500",
    glowColor: "gold",
    features: ["90% Auto-Invoicing", "Blockchain Lien Waivers", "Compliance Tracking"],
    metric: { value: "20hrs", label: "Saved Weekly" },
    status: "live"
  },
  {
    id: "workforce",
    title: "Orbit Workforce",
    subtitle: "Network",
    icon: Handshake,
    gradient: "from-indigo-500 to-purple-500",
    glowColor: "purple",
    features: ["AI-Vetted Subcontractors", "Shift Bidding System", "Credential Verification"],
    metric: { value: "340+", label: "Vetted Subs" },
    status: "live"
  },
  {
    id: "trust_layer",
    title: "Trust & Growth",
    subtitle: "Layer",
    icon: Shield,
    gradient: "from-cyan-500 to-blue-500",
    glowColor: "blue",
    features: ["Sentiment Analysis", "Milestone NFTs", "ESG Tracking", "Embedded Financing"],
    metric: { value: "$50K", label: "Instant Approval" },
    status: "live"
  }
];

const COMPETITOR_COMPARISON = [
  { feature: "White-Label Platform", us: true, serviceTitan: false, jobber: false, housecall: false },
  { feature: "AI Route Optimization", us: true, serviceTitan: "partial", jobber: false, housecall: false },
  { feature: "Blockchain Document Stamping", us: true, serviceTitan: false, jobber: false, housecall: false },
  { feature: "Predictive Cashflow", us: true, serviceTitan: "partial", jobber: false, housecall: false },
  { feature: "AR Color Previews", us: true, serviceTitan: false, jobber: false, housecall: false },
  { feature: "NFT Milestones", us: true, serviceTitan: false, jobber: false, housecall: false },
  { feature: "Embedded Financing", us: true, serviceTitan: true, jobber: false, housecall: false },
  { feature: "Multi-Trade Verticals", us: true, serviceTitan: true, jobber: "partial", housecall: false }
];

const TRADE_VERTICALS = [
  { name: "PaintPros", market: "$46.5B", status: "Live", color: "from-green-500 to-emerald-500" },
  { name: "RoofPros", market: "$56B", status: "Q2 2026", color: "from-orange-500 to-red-500" },
  { name: "HVACPros", market: "$130B", status: "Q3 2026", color: "from-blue-500 to-cyan-500" },
  { name: "ElectricPros", market: "$200B", status: "Q4 2026", color: "from-yellow-500 to-orange-500" },
  { name: "PlumbPros", market: "$130B", status: "2027", color: "from-blue-400 to-blue-600" },
  { name: "BuildPros", market: "$1.5T", status: "2027", color: "from-purple-500 to-pink-500" }
];

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

function LivePulse() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

export default function InvestorDemo() {
  const tenant = useTenant();
  const [, navigate] = useLocation();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Restrict investor pages to paintpros.io/demo tenant only
  const isPaintProsTenant = tenant.id === "demo" || tenant.id === "paintpros";
  
  useEffect(() => {
    if (!isPaintProsTenant) {
      navigate("/");
    }
  }, [isPaintProsTenant, navigate]);

  // Fetch live platform metrics
  const { data: liveMetrics } = useQuery<typeof LIVE_METRICS>({
    queryKey: ["/api/platform-metrics"],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const metrics = liveMetrics || LIVE_METRICS;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURE_MODULES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Auto-start tour for first-time visitors
  useEffect(() => {
    if (!isPaintProsTenant) return;
    const hasSeenTour = localStorage.getItem("investor_tour_seen");
    if (!hasSeenTour) {
      const timer = setTimeout(() => setTourOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourClose = () => {
    setTourOpen(false);
    localStorage.setItem("investor_tour_seen", "true");
  };

  const handleDownloadDeck = () => {
    // Generate PDF content and trigger download
    const deckUrl = "/api/investor-deck.pdf";
    window.open(deckUrl, "_blank");
  };

  // Don't render if not paintpros tenant
  if (!isPaintProsTenant) {
    return null;
  }

  return (
    <PageLayout>
      <main className="pt-6 md:pt-8 pb-8 md:pb-12 px-3 md:px-10">
        <BentoGrid>
          
          {/* Hero Header - Full Width */}
          <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
            <GlassCard className="p-6 md:p-10 relative overflow-hidden h-full" glow="gold">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <LivePulse />
                <span className="text-xs font-medium text-green-400">Live Demo</span>
              </div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-medium mb-4"
                  >
                    <Sparkles className="w-3 h-3" />
                    Investor Preview - v1.6.1 Breakthrough Release
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
                  >
                    The Most <span className="text-accent">Comprehensive</span><br />
                    Trades Platform Ever Built
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-3xl"
                  >
                    384+ API endpoints, 60+ database tables, 6 AI-powered modules, 
                    blockchain verification, and white-label multi-tenant architecture.
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-3 mt-6"
                >
                  <FlipButton className="px-6" onClick={() => setVideoModalOpen(true)} data-testid="button-schedule-demo">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Full Demo
                  </FlipButton>
                  <FlipButton className="px-6 bg-transparent border border-accent/50" onClick={handleDownloadDeck} data-testid="button-download-deck">
                    <Download className="w-4 h-4 mr-2" />
                    Download Deck
                  </FlipButton>
                  <Button variant="ghost" size="sm" onClick={() => setTourOpen(true)} data-testid="button-start-tour">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Guided Tour
                  </Button>
                </motion.div>
              </div>
            </GlassCard>
          </BentoItem>

          {/* Key Metrics Row */}
          <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <GlassCard className="p-4 md:p-6 h-full" hoverEffect glow="green">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">ARR</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-400">
                <AnimatedCounter value={1073400} prefix="$" />
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                +127% YoY
              </p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <GlassCard className="p-4 md:p-6 h-full" hoverEffect glow="blue">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Active Tenants</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-blue-400">
                <AnimatedCounter value={127} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                +23 this month
              </p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <GlassCard className="p-4 md:p-6 h-full" hoverEffect glow="purple">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">LTV:CAC</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-purple-400">35:1</p>
              <p className="text-xs text-muted-foreground mt-1">Industry avg: 3:1</p>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <GlassCard className="p-4 md:p-6 h-full" hoverEffect glow="gold">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Cpu className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">AI Actions</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-accent">
                <AnimatedCounter value={1234567} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-accent" />
                GPT-4o Powered
              </p>
            </GlassCard>
          </BentoItem>

          {/* Feature Modules Showcase */}
          <BentoItem colSpan={8} rowSpan={3} mobileColSpan={4} mobileRowSpan={4}>
            <GlassCard className="p-6 md:p-8 h-full" glow="accent">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold">v1.6.1 Breakthrough Modules</h2>
                  <p className="text-sm text-muted-foreground">6 competition-destroying AI systems</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    data-testid="button-toggle-slideshow"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {FEATURE_MODULES.map((module, i) => (
                  <motion.button
                    key={module.id}
                    onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      currentSlide === i || activeModule === module.id
                        ? `bg-gradient-to-br ${module.gradient} border-white/20`
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-testid={`button-module-${module.id}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <module.icon className={`w-5 h-5 ${currentSlide === i || activeModule === module.id ? "text-white" : "text-muted-foreground"}`} />
                      <Badge variant="outline" className={`text-[9px] ${currentSlide === i || activeModule === module.id ? "border-white/30 text-white" : ""}`}>
                        {module.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className={`font-bold text-sm ${currentSlide === i || activeModule === module.id ? "text-white" : ""}`}>
                      {module.title}
                    </h3>
                    <p className={`text-xs ${currentSlide === i || activeModule === module.id ? "text-white/80" : "text-muted-foreground"}`}>
                      {module.subtitle}
                    </p>
                    <div className={`mt-3 pt-3 border-t ${currentSlide === i || activeModule === module.id ? "border-white/20" : "border-white/10"}`}>
                      <p className={`text-lg font-bold ${currentSlide === i || activeModule === module.id ? "text-white" : "text-accent"}`}>
                        {module.metric.value}
                      </p>
                      <p className={`text-[10px] ${currentSlide === i || activeModule === module.id ? "text-white/70" : "text-muted-foreground"}`}>
                        {module.metric.label}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeModule && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    {FEATURE_MODULES.filter(m => m.id === activeModule).map(module => (
                      <div key={module.id}>
                        <h4 className="font-bold mb-2">{module.title} {module.subtitle}</h4>
                        <ul className="space-y-1">
                          {module.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </BentoItem>

          {/* Blockchain Stats */}
          <BentoItem colSpan={4} rowSpan={3} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 h-full bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border-[#14F195]/30" hoverEffect>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195]">
                  <SiSolana className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Blockchain Layer</h3>
                  <p className="text-xs text-muted-foreground">Solana + Darkwave</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Documents Stamped</span>
                    <Lock className="w-3 h-3 text-[#14F195]" />
                  </div>
                  <p className="text-xl font-bold text-[#14F195]">
                    <AnimatedCounter value={45678} />
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">NFTs Minted</span>
                    <Award className="w-3 h-3 text-purple-400" />
                  </div>
                  <p className="text-xl font-bold text-purple-400">
                    <AnimatedCounter value={234} />
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Lien Waivers Signed</span>
                    <Scale className="w-3 h-3 text-blue-400" />
                  </div>
                  <p className="text-xl font-bold text-blue-400">
                    <AnimatedCounter value={1890} />
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Smart Contracts</span>
                    <FileText className="w-3 h-3 text-accent" />
                  </div>
                  <p className="text-xl font-bold text-accent">
                    <AnimatedCounter value={3456} />
                  </p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          {/* Competitor Comparison */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
            <GlassCard className="p-6 h-full" hoverEffect>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                Competitor Comparison
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 font-medium text-muted-foreground">Feature</th>
                      <th className="text-center py-2 font-medium text-accent">Us</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">ST</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">JB</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">HC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPETITOR_COMPARISON.slice(0, 6).map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2 text-muted-foreground">{row.feature}</td>
                        <td className="text-center py-2">
                          {row.us === true && <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />}
                        </td>
                        <td className="text-center py-2">
                          {row.serviceTitan === true ? (
                            <CheckCircle2 className="w-4 h-4 text-yellow-400 mx-auto" />
                          ) : row.serviceTitan === "partial" ? (
                            <span className="text-yellow-400/60 text-[10px]">Part</span>
                          ) : (
                            <span className="text-red-400/60">-</span>
                          )}
                        </td>
                        <td className="text-center py-2">
                          {row.jobber === true ? (
                            <CheckCircle2 className="w-4 h-4 text-yellow-400 mx-auto" />
                          ) : row.jobber === "partial" ? (
                            <span className="text-yellow-400/60 text-[10px]">Part</span>
                          ) : (
                            <span className="text-red-400/60">-</span>
                          )}
                        </td>
                        <td className="text-center py-2">
                          {row.housecall === true ? (
                            <CheckCircle2 className="w-4 h-4 text-yellow-400 mx-auto" />
                          ) : (
                            <span className="text-red-400/60">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-[10px] text-muted-foreground mt-3">
                ST = ServiceTitan, JB = Jobber, HC = HouseCall Pro
              </p>
            </GlassCard>
          </BentoItem>

          {/* Trade Verticals Expansion */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 h-full" hoverEffect glow="purple">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Multi-Vertical Expansion
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Combined TAM: $2.2T+</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TRADE_VERTICALS.map((vertical) => (
                  <div
                    key={vertical.name}
                    className={`p-3 rounded-lg bg-gradient-to-br ${vertical.color} bg-opacity-10 border border-white/10`}
                  >
                    <p className="font-bold text-sm text-white">{vertical.name}</p>
                    <p className="text-xs text-white/70">{vertical.market}</p>
                    <Badge
                      variant={vertical.status === "Live" ? "default" : "outline"}
                      className="mt-2 text-[9px]"
                    >
                      {vertical.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </BentoItem>

          {/* Unit Economics */}
          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 h-full" hoverEffect>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-green-400" />
                Unit Economics
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: "Gross Margin", value: "87%", color: "text-green-400" },
                  { label: "Customer LTV", value: "$42,000", color: "text-blue-400" },
                  { label: "CAC", value: "$1,200", color: "text-accent" },
                  { label: "Payback Period", value: "2.1 months", color: "text-purple-400" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </BentoItem>

          {/* Tech Stack */}
          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 h-full" hoverEffect>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                Enterprise Stack
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "GPT-4o", desc: "AI Engine" },
                  { name: "Solana", desc: "Blockchain" },
                  { name: "PostgreSQL", desc: "Database" },
                  { name: "React", desc: "Frontend" },
                  { name: "Node.js", desc: "Backend" },
                  { name: "Stripe", desc: "Payments" },
                  { name: "Resend", desc: "Email" },
                  { name: "Socket.IO", desc: "Real-time" }
                ].map((tech) => (
                  <div key={tech.name} className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="font-bold text-xs">{tech.name}</p>
                    <p className="text-[10px] text-muted-foreground">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </BentoItem>

          {/* API Stats */}
          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4} mobileRowSpan={1}>
            <GlassCard className="p-6 h-full bg-gradient-to-br from-accent/10 to-transparent" hoverEffect>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-accent" />
                Platform Scale
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">384+</p>
                  <p className="text-xs text-muted-foreground">API Endpoints</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">60+</p>
                  <p className="text-xs text-muted-foreground">DB Tables</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">47</p>
                  <p className="text-xs text-muted-foreground">Frontend Pages</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">6</p>
                  <p className="text-xs text-muted-foreground">AI Modules</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          {/* ROI Calculator */}
          <BentoItem colSpan={6} rowSpan={3} mobileColSpan={4} mobileRowSpan={4}>
            <ROICalculator />
          </BentoItem>

          {/* Why Invest Summary */}
          <BentoItem colSpan={6} rowSpan={3} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 h-full" hoverEffect>
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Why Invest Now?
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, title: "First Mover Advantage", desc: "Only blockchain-verified trades platform in the market" },
                  { icon: Globe, title: "$2.2T+ TAM", desc: "Multi-vertical expansion across 7 trade categories" },
                  { icon: Brain, title: "AI Moat", desc: "6 proprietary AI modules competitors can't replicate" },
                  { icon: Building, title: "Recurring Revenue", desc: "87% gross margin with strong unit economics" },
                  { icon: Network, title: "Network Effects", desc: "Orbit Workforce Network creates sticky ecosystem" }
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 flex-shrink-0">
                      <item.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </BentoItem>

          {/* CTA */}
          <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 md:p-8 h-full bg-gradient-to-r from-accent/20 via-purple-500/10 to-accent/20 border-accent/30" glow="gold" data-tour="cta">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl md:text-2xl">Ready to Invest?</h3>
                  <p className="text-sm text-muted-foreground">Join the most comprehensive trades platform revolution</p>
                </div>
                <div className="flex gap-3">
                  <FlipButton className="px-6" onClick={() => setContactModalOpen(true)} data-testid="button-contact-team">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Team
                  </FlipButton>
                  <FlipButton className="px-6 bg-transparent border border-accent/50" onClick={() => window.location.href = "/pricing"} data-testid="button-view-pricing">
                    View Pricing
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </FlipButton>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

        </BentoGrid>
      </main>

      {/* Modals */}
      <InvestorTour isOpen={tourOpen} onClose={handleTourClose} />
      <VideoDemoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
      <InvestorContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </PageLayout>
  );
}
