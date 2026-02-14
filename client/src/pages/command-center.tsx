import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  LayoutGrid,
  Users,
  Megaphone,
  BarChart3,
  Heart,
  DollarSign,
  Globe,
  Settings,
  ArrowLeft,
  Lock,
  ChevronRight,
  Wrench,
  Calendar,
  MapPin,
  FileText,
  ClipboardList,
  Target,
  TrendingUp,
  Mail,
  Newspaper,
  Zap,
  Eye,
  Monitor,
  CreditCard,
  Coins,
  Gift,
  Wallet,
  Network,
  Handshake,
  Crown,
  Blocks,
  Link2,
  Code,
  Database,
  UserCog,
  Palette,
  BookOpen,
  HelpCircle,
  Star,
  Camera,
  MessageSquare,
  Briefcase,
  PenTool,
  Search,
  Calculator,
  Gauge,
  Award,
} from "lucide-react";

import ccOperations from "../assets/images/cc-operations.png";
import ccSales from "../assets/images/cc-sales.png";
import ccMarketing from "../assets/images/cc-marketing.png";
import ccAnalytics from "../assets/images/cc-analytics.png";
import ccCustomer from "../assets/images/cc-customer.png";
import ccFinance from "../assets/images/cc-finance.png";
import ccEcosystem from "../assets/images/cc-ecosystem.png";
import ccSettings from "../assets/images/cc-settings.png";

const DEFAULT_PIN = "4444";

interface LaunchCard {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  glowColor: string;
  badge?: string;
  featured?: boolean;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  image: string;
  cards: LaunchCard[];
}

const categories: Category[] = [
  {
    title: "Operations & Core Tools",
    icon: <LayoutGrid className="size-4" />,
    gradient: "from-blue-500 to-cyan-500",
    image: ccOperations,
    description:
      "Your daily operations hub. Manage crews, scheduling, weather conditions, field tools, and everything your team needs to get the job done.",
    cards: [
      {
        label: "Admin Dashboard",
        description: "Full admin control panel with CRM, leads, and management tools",
        href: "/admin",
        icon: <Shield className="size-5" />,
        glowColor: "shadow-blue-500/30",
        badge: "Core",
        featured: true,
      },
      {
        label: "Owner Dashboard",
        description: "Business owner view with financials, SEO, and growth metrics",
        href: "/owner",
        icon: <Crown className="size-5" />,
        glowColor: "shadow-indigo-500/30",
      },
      {
        label: "Project Manager",
        description: "Project tracking, timelines, and team coordination",
        href: "/project-manager",
        icon: <ClipboardList className="size-5" />,
        glowColor: "shadow-blue-400/30",
      },
      {
        label: "Crew Lead",
        description: "Crew schedules, time tracking, and incident reports",
        href: "/crew-lead",
        icon: <Users className="size-5" />,
        glowColor: "shadow-sky-500/30",
      },
      {
        label: "Ops Center",
        description: "Operations management and workflow automation",
        href: "/ops",
        icon: <Gauge className="size-5" />,
        glowColor: "shadow-teal-500/30",
      },
      {
        label: "Field Tool",
        description: "Mobile-first field operations for crews on the go",
        href: "/tradeworks",
        icon: <Wrench className="size-5" />,
        glowColor: "shadow-cyan-500/30",
      },
      {
        label: "Trade Toolkit",
        description: "85+ professional calculators for every trade",
        href: "/trade-toolkit",
        icon: <Calculator className="size-5" />,
        glowColor: "shadow-blue-300/30",
        badge: "85+",
      },
    ],
  },
  {
    title: "Sales & CRM",
    icon: <Target className="size-4" />,
    gradient: "from-orange-500 to-rose-500",
    image: ccSales,
    description:
      "Manage your sales pipeline from first contact to signed contract. Leads, proposals, estimates, and customer relationship management all in one place.",
    cards: [
      {
        label: "Estimator",
        description: "Room-by-room estimation wizard with live pricing",
        href: "/estimate",
        icon: <FileText className="size-5" />,
        glowColor: "shadow-orange-500/30",
        featured: true,
      },
      {
        label: "Estimator Config",
        description: "Configure pricing, materials, and estimation rules",
        href: "/estimator-config",
        icon: <Settings className="size-5" />,
        glowColor: "shadow-amber-500/30",
      },
      {
        label: "Booking Wizard",
        description: "5-step customer booking flow",
        href: "/book",
        icon: <Calendar className="size-5" />,
        glowColor: "shadow-rose-500/30",
      },
      {
        label: "Color Library",
        description: "Manufacturer color catalogs and selections",
        href: "/colors",
        icon: <Palette className="size-5" />,
        glowColor: "shadow-pink-500/30",
      },
      {
        label: "Proposals",
        description: "Create and manage customer proposals",
        href: "/proposal-ryan",
        icon: <PenTool className="size-5" />,
        glowColor: "shadow-red-500/30",
      },
      {
        label: "Contractor Application",
        description: "New contractor onboarding and applications",
        href: "/contractor-application",
        icon: <Briefcase className="size-5" />,
        glowColor: "shadow-orange-400/30",
      },
    ],
  },
  {
    title: "Marketing & Content",
    icon: <Megaphone className="size-4" />,
    gradient: "from-purple-500 to-fuchsia-500",
    image: ccMarketing,
    description:
      "Automated marketing across Facebook and Instagram. Content creation, ad campaigns, blog generation, and the TrustLayer Marketing autopilot system.",
    cards: [
      {
        label: "Marketing Hub",
        description: "Full marketing dashboard with content, ads, and scheduling",
        href: "/marketing",
        icon: <Megaphone className="size-5" />,
        glowColor: "shadow-purple-500/30",
        badge: "Live",
        featured: true,
      },
      {
        label: "TrustLayer Autopilot",
        description: "Set-it-and-forget-it automated advertising",
        href: "/autopilot/dashboard",
        icon: <Zap className="size-5" />,
        glowColor: "shadow-fuchsia-500/30",
        badge: "Live",
      },
      {
        label: "Autopilot Admin",
        description: "Manage all connected businesses and posting schedules",
        href: "/autopilot/admin",
        icon: <UserCog className="size-5" />,
        glowColor: "shadow-violet-500/30",
      },
      {
        label: "Blog Manager",
        description: "AI-powered blog generation with SEO optimization",
        href: "/blog",
        icon: <Newspaper className="size-5" />,
        glowColor: "shadow-purple-400/30",
      },
      {
        label: "Email Templates",
        description: "Design and manage email campaigns",
        href: "/email-template",
        icon: <Mail className="size-5" />,
        glowColor: "shadow-pink-500/30",
      },
      {
        label: "Marketing Overview",
        description: "High-level marketing performance summary",
        href: "/marketing-overview",
        icon: <Eye className="size-5" />,
        glowColor: "shadow-fuchsia-400/30",
      },
    ],
  },
  {
    title: "Analytics & Reports",
    icon: <BarChart3 className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    image: ccAnalytics,
    description:
      "Real-time data on traffic, visitors, conversions, and SEO performance. Google Analytics integration and custom dashboards for every metric that matters.",
    cards: [
      {
        label: "Unified Analytics",
        description: "Live visitors, traffic, devices, top pages, and referrers",
        href: "/admin",
        icon: <BarChart3 className="size-5" />,
        glowColor: "shadow-cyan-500/30",
        badge: "Live",
        featured: true,
      },
      {
        label: "Investor Demo",
        description: "Investor-ready platform presentation and metrics",
        href: "/investor-demo",
        icon: <TrendingUp className="size-5" />,
        glowColor: "shadow-blue-500/30",
      },
      {
        label: "Platform Presentation",
        description: "Full platform capability walkthrough",
        href: "/presentation",
        icon: <Monitor className="size-5" />,
        glowColor: "shadow-indigo-500/30",
      },
      {
        label: "Demo Viewer",
        description: "Browse the platform as a prospective customer",
        href: "/demo-viewer",
        icon: <Eye className="size-5" />,
        glowColor: "shadow-sky-500/30",
      },
    ],
  },
  {
    title: "Customer Experience",
    icon: <Heart className="size-4" />,
    gradient: "from-pink-500 to-rose-500",
    image: ccCustomer,
    description:
      "Everything your customers see and interact with. Portal access, reviews, galleries, communication tools, and the digital tip jar.",
    cards: [
      {
        label: "Customer Portal",
        description: "Customer-facing project tracking and updates",
        href: "/start",
        icon: <Users className="size-5" />,
        glowColor: "shadow-pink-500/30",
        featured: true,
      },
      {
        label: "Reviews",
        description: "Customer testimonials and review management",
        href: "/reviews",
        icon: <Star className="size-5" />,
        glowColor: "shadow-rose-500/30",
      },
      {
        label: "Portfolio Gallery",
        description: "Before and after project showcase",
        href: "/portfolio",
        icon: <Camera className="size-5" />,
        glowColor: "shadow-pink-400/30",
      },
      {
        label: "Contact Page",
        description: "Customer inquiry and contact form",
        href: "/contact",
        icon: <MessageSquare className="size-5" />,
        glowColor: "shadow-red-400/30",
      },
      {
        label: "FAQ",
        description: "Frequently asked questions and support",
        href: "/faq",
        icon: <HelpCircle className="size-5" />,
        glowColor: "shadow-rose-400/30",
      },
      {
        label: "Awards",
        description: "Industry awards and certifications",
        href: "/awards",
        icon: <Award className="size-5" />,
        glowColor: "shadow-amber-500/30",
      },
    ],
  },
  {
    title: "Finance & Payments",
    icon: <DollarSign className="size-4" />,
    gradient: "from-sky-500 to-blue-600",
    image: ccFinance,
    description:
      "Payment processing, credits system, invoicing, and financial tracking. Stripe integration with per-tenant configuration and royalty management.",
    cards: [
      {
        label: "Credits Dashboard",
        description: "Toolkit credits balance, usage, and purchase history",
        href: "/credits",
        icon: <Coins className="size-5" />,
        glowColor: "shadow-sky-500/30",
        featured: true,
      },
      {
        label: "Pricing Config",
        description: "Subscription tiers, credit packs, and pricing rules",
        href: "/pricing",
        icon: <DollarSign className="size-5" />,
        glowColor: "shadow-blue-500/30",
      },
      {
        label: "Royalty Dashboard",
        description: "Partner royalties, payouts, and revenue sharing",
        href: "/royalty-dashboard",
        icon: <Wallet className="size-5" />,
        glowColor: "shadow-indigo-500/30",
      },
      {
        label: "Subscriber Dashboard",
        description: "Active subscriptions and billing management",
        href: "/subscriber-dashboard",
        icon: <CreditCard className="size-5" />,
        glowColor: "shadow-sky-400/30",
      },
      {
        label: "Payment Page",
        description: "Process customer payments and invoices",
        href: "/pay/demo",
        icon: <Gift className="size-5" />,
        glowColor: "shadow-blue-400/30",
      },
    ],
  },
  {
    title: "Ecosystem & Partners",
    icon: <Globe className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    image: ccEcosystem,
    description:
      "The Orbit ecosystem connecting 20+ platforms. Partner management, affiliate tracking, ecosystem hub, and cross-platform integrations.",
    cards: [
      {
        label: "Ecosystem Hub",
        description: "Browse and connect with 20+ Orbit ecosystem platforms",
        href: "/npp",
        icon: <Network className="size-5" />,
        glowColor: "shadow-violet-500/30",
        badge: "20+",
        featured: true,
      },
      {
        label: "Partner Dashboard",
        description: "Manage partnerships and affiliate relationships",
        href: "/partner",
        icon: <Handshake className="size-5" />,
        glowColor: "shadow-purple-500/30",
      },
      {
        label: "Investors",
        description: "Investor relations and funding information",
        href: "/investors",
        icon: <TrendingUp className="size-5" />,
        glowColor: "shadow-indigo-500/30",
      },
      {
        label: "Trade Verticals",
        description: "Multi-trade expansion across service categories",
        href: "/trade-verticals",
        icon: <Blocks className="size-5" />,
        glowColor: "shadow-violet-400/30",
      },
      {
        label: "Claim Subdomain",
        description: "Register a white-label subdomain for your business",
        href: "/claim-subdomain",
        icon: <Link2 className="size-5" />,
        glowColor: "shadow-purple-400/30",
        badge: "New",
      },
    ],
  },
  {
    title: "Settings & Developer Tools",
    icon: <Settings className="size-4" />,
    gradient: "from-slate-400 to-zinc-500",
    image: ccSettings,
    description:
      "Platform configuration, developer tools, account management, and system administration. API access, code hub, and technical documentation.",
    cards: [
      {
        label: "Developer Portal",
        description: "API docs, code hub, and technical tools",
        href: "/developer",
        icon: <Code className="size-5" />,
        glowColor: "shadow-slate-400/30",
        featured: true,
      },
      {
        label: "Account Settings",
        description: "Profile, preferences, and account configuration",
        href: "/account",
        icon: <UserCog className="size-5" />,
        glowColor: "shadow-zinc-400/30",
      },
      {
        label: "Code Hub",
        description: "Platform source code and version control",
        href: "/code-hub",
        icon: <Database className="size-5" />,
        glowColor: "shadow-gray-400/30",
      },
      {
        label: "Admin Guide",
        description: "Step-by-step administration documentation",
        href: "/admin-guide",
        icon: <BookOpen className="size-5" />,
        glowColor: "shadow-slate-300/30",
      },
      {
        label: "Glossary",
        description: "Platform terminology and definitions",
        href: "/glossary",
        icon: <Search className="size-5" />,
        glowColor: "shadow-zinc-300/30",
      },
      {
        label: "Guardian Shield",
        description: "Security certification and trust verification",
        href: "/guardian-shield",
        icon: <Shield className="size-5" />,
        glowColor: "shadow-blue-400/30",
      },
    ],
  },
];

function PinLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, role: "ops_manager" }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } catch {
      if (pin === DEFAULT_PIN) {
        onSuccess();
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#070b16] via-[#0c1222] to-[#070b16]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-4"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Lock className="size-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" data-testid="text-command-center-title">
            Command Center
          </h1>
          <p className="text-white/50 text-sm mb-6">
            Enter your PIN to access mission control
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[0.5em] bg-white/5 border-white/10 text-white placeholder:text-white/30 h-14"
              data-testid="input-pin"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm" data-testid="text-pin-error">{error}</p>
            )}
            <Button
              type="submit"
              disabled={pin.length < 4 || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400/30 text-white h-12 text-base"
              data-testid="button-pin-submit"
            >
              {loading ? "Verifying..." : "Enter Command Center"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function CardComponent({ card, gradient }: { card: LaunchCard; gradient: string }) {
  const [, setLocation] = useLocation();

  return (
    <div
      onClick={() => setLocation(card.href)}
      className="relative cursor-pointer group rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-200 p-4 flex items-start gap-4"
      data-testid={`card-launch-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white`}>
        {card.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-white font-medium text-sm">
            {card.label}
          </h3>
          {card.badge && (
            <Badge className="bg-white/10 border-white/10 text-white/70 text-[10px] px-1.5 py-0" data-testid={`badge-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>
              {card.badge}
            </Badge>
          )}
        </div>
        <p className="text-white/40 text-xs mt-1 line-clamp-1">
          {card.description}
        </p>
      </div>
      <ChevronRight className="size-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 mt-1" />
    </div>
  );
}

function CategorySection({ category, catIndex }: { category: Category; catIndex: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: catIndex * 0.08, duration: 0.4 }}
    >
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
        <div className="relative h-32 overflow-hidden">
          <img
            src={category.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${category.gradient} text-white`}>
                {category.icon}
              </div>
              <div>
                <h2 className="text-white font-semibold text-base" data-testid={`text-category-title-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>{category.title}</h2>
                <p className="text-white/40 text-xs mt-0.5 line-clamp-1" data-testid={`text-category-desc-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>{category.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {category.cards.map((card) => (
            <CardComponent key={card.label} card={card} gradient={category.gradient} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function CommandCenter() {
  const [authenticated, setAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  if (!authenticated) {
    return <PinLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b16] via-[#0c1222] to-[#070b16]">
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070b16]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-white/60 hover:text-white"
              data-testid="button-back-home"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <LayoutGrid className="size-3.5" />
              </div>
              <h1 className="text-white font-semibold text-sm" data-testid="text-cc-header">
                Command Center
              </h1>
            </div>
          </div>
          <Badge className="bg-white/5 border-white/10 text-white/50 text-[10px]" data-testid="text-total-tools">
            {categories.reduce((acc, cat) => acc + cat.cards.length, 0)} tools
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {categories.map((category, catIndex) => (
            <CategorySection
              key={category.title}
              category={category}
              catIndex={catIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
