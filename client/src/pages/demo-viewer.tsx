import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FlipButton } from "@/components/ui/flip-button";
import { DemoWelcomeModal } from "@/components/demo-welcome-modal";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  hover3D, 
  hover3DSubtle, 
  cardVariants, 
  staggerContainer, 
  iconContainerStyles, 
  cardBackgroundStyles 
} from "@/lib/theme-effects";
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  Palette,
  Building2,
  Eye,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Briefcase,
  Wrench,
  HelpCircle,
  Sparkles,
  LayoutGrid,
  Crown,
  Shield,
  Hammer
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useAccess } from "@/context/AccessContext";

export default function DemoViewer() {
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const tenant = useTenant();
  const { login } = useAccess();

  useEffect(() => {
    if (isAuthenticated) {
      const hasSeenWelcome = localStorage.getItem('demo_welcome_seen');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/auth/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "demo_viewer", pin }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid PIN");
        setPin("");
        return;
      }
      
      setIsAuthenticated(true);
      login("demo_viewer", "Jenn");
      setShowWelcome(true);
    } catch (err) {
      setError("Login failed. Please try again.");
      setPin("");
    }
  };

  const handleCloseWelcome = () => {
    localStorage.setItem('demo_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const dashboards = [
    {
      title: "Owner Dashboard",
      description: "Business overview, revenue tracking, and high-level metrics",
      icon: Crown,
      path: "/owner",
      gradient: "from-purple-500/20 to-indigo-500/10",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-600",
      features: ["Revenue Analytics", "Team Performance", "Business Health"]
    },
    {
      title: "Admin Dashboard",
      description: "Operations management, bookings, and customer service",
      icon: Shield,
      path: "/admin",
      gradient: "from-blue-500/20 to-cyan-500/10",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-600",
      features: ["Bookings", "CRM Pipeline", "Documents"]
    },
    {
      title: "Developer Dashboard",
      description: "System health, integrations, and technical monitoring",
      icon: Wrench,
      path: "/developer",
      gradient: "from-emerald-500/20 to-teal-500/10",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-600",
      features: ["API Health", "SEO Tracker", "Integrations"]
    },
    {
      title: "Project Manager",
      description: "Job scheduling, crew assignments, and project tracking",
      icon: Calendar,
      path: "/project-manager",
      gradient: "from-orange-500/20 to-amber-500/10",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-600",
      features: ["Calendar", "Job Pipeline", "Crew Scheduling"]
    },
    {
      title: "Crew Lead",
      description: "Daily tasks, time tracking, and job notes",
      icon: Hammer,
      path: "/crew-lead",
      gradient: "from-teal-500/20 to-cyan-500/10",
      iconBg: "bg-teal-500/20",
      iconColor: "text-teal-600",
      features: ["Time Clock", "Job Notes", "Incident Reports"]
    }
  ];

  const quickStats = [
    { label: "Active Jobs", value: "12", icon: Briefcase, trend: "+3 this week" },
    { label: "Pending Estimates", value: "8", icon: FileText, trend: "$45,200 value" },
    { label: "Crew Members", value: "16", icon: Users, trend: "4 on jobs today" },
    { label: "Monthly Revenue", value: "$127K", icon: DollarSign, trend: "+18% vs last month" }
  ];

  const customerTools = [
    { title: "Color Library", description: "100+ curated paint colors", icon: Palette, path: "/colors" },
    { title: "Get Estimate", description: "Instant pricing calculator", icon: FileText, path: "/estimate" },
    { title: "Book Service", description: "Schedule an appointment", icon: Calendar, path: "/estimate" },
    { title: "Help Center", description: "FAQs and support", icon: HelpCircle, path: "/help" }
  ];

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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-purple-500/20" glow>
                <div className="text-center mb-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/30 to-indigo-500/20 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/20"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    transition={{ type: "spring" }}
                  >
                    <Sparkles className="w-10 h-10 text-purple-600" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">Demo Access</h1>
                  <p className="text-muted-foreground">Welcome! Enter your PIN to explore</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-black/5 border-border text-center text-2xl h-14 tracking-[0.5em] rounded-xl focus:ring-2 focus:ring-purple-500/30"
                    maxLength={4}
                    data-testid="input-demo-pin"
                  />
                  {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">{error}</motion.p>}
                  <FlipButton className="w-full h-14" data-testid="button-demo-login">
                    Start Exploring <ArrowRight className="w-5 h-5" />
                  </FlipButton>
                </form>

                <p className="text-xs text-center text-muted-foreground mt-6">
                  This is a demo environment with sample data
                </p>
              </GlassCard>
            </div>
          </motion.div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <DemoWelcomeModal open={showWelcome} onClose={handleCloseWelcome} />
      
      <main className="py-8 px-4 md:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          <motion.div variants={cardVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">
                  Demo Viewer
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  <Eye className="w-3 h-3 mr-1" /> Read-Only Access
                </Badge>
              </div>
              <h1 className="text-3xl font-display font-bold">Welcome, Jenn!</h1>
              <p className="text-muted-foreground mt-1">
                Explore the complete PaintPros.io platform and see how it powers painting businesses.
              </p>
            </div>
            <FlipButton 
              onClick={() => setShowWelcome(true)}
              className="gap-2"
              data-testid="button-show-welcome"
            >
              <HelpCircle className="w-4 h-4" />
              Platform Overview
            </FlipButton>
          </motion.div>

          <BentoGrid className="grid-cols-2 md:grid-cols-4">
            {quickStats.map((stat, i) => (
              <BentoItem key={i} className="col-span-1">
                <motion.div variants={cardVariants}>
                  <GlassCard className="p-4 h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <p className="text-xs text-emerald-600 mt-1">{stat.trend}</p>
                      </div>
                      <div className={`${iconContainerStyles} bg-accent/20`}>
                        <stat.icon className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </BentoItem>
            ))}
          </BentoGrid>

          <motion.div variants={cardVariants}>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Role Dashboards</h2>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              Each role has a dedicated dashboard tailored to their responsibilities. Click to explore.
            </p>
            <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {dashboards.map((dashboard, i) => (
                <BentoItem key={i} className="col-span-1">
                  <motion.div
                    variants={cardVariants}
                    whileHover={hover3DSubtle}
                    onClick={() => setLocation(dashboard.path)}
                    className="cursor-pointer h-full"
                    data-testid={`card-dashboard-${dashboard.path.replace('/', '')}`}
                  >
                    <GlassCard className="p-5 h-full relative overflow-visible group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${dashboard.gradient} opacity-50 rounded-xl`} />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${dashboard.iconBg} ${dashboard.iconColor}`}>
                            <dashboard.icon className="w-6 h-6" />
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{dashboard.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {dashboard.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {dashboard.features.map((feature, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </BentoItem>
              ))}
            </BentoGrid>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Customer-Facing Tools</h2>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              These are the tools your customers see and interact with on the public website.
            </p>
            <BentoGrid className="grid-cols-2 md:grid-cols-4">
              {customerTools.map((tool, i) => (
                <BentoItem key={i} className="col-span-1">
                  <motion.div
                    variants={cardVariants}
                    whileHover={hover3DSubtle}
                    onClick={() => setLocation(tool.path)}
                    className="cursor-pointer h-full"
                    data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <GlassCard className="p-4 h-full text-center">
                      <div className="p-3 bg-emerald-500/20 rounded-full w-fit mx-auto mb-3">
                        <tool.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-sm">{tool.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                    </GlassCard>
                  </motion.div>
                </BentoItem>
              ))}
            </BentoGrid>
          </motion.div>

          <motion.div variants={cardVariants}>
            <GlassCard className="p-6 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Demo Mode Active</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're viewing the platform with sample data. All features are accessible in read-only mode.
                    This is exactly what a licensed painting company would see when using PaintPros.io.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> AI Tools Active
                    </Badge>
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Sample Data Loaded
                    </Badge>
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> All Dashboards Unlocked
                    </Badge>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </main>
    </PageLayout>
  );
}
