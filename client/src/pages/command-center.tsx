import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  cardVariants,
  staggerContainer,
  hover3DSubtle,
  iconContainerStyles,
  cardBackgroundStyles,
} from "@/lib/theme-effects";
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
  Sparkles,
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
  badge?: string;
  featured?: boolean;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  iconGradient: keyof typeof iconContainerStyles.gradients;
  bgStyle: string;
  glowColor: "gold" | "blue" | "purple" | "accent" | "none";
  image: string;
  description: string;
  cards: LaunchCard[];
}

const categories: Category[] = [
  {
    title: "Operations & Core Tools",
    icon: <LayoutGrid className="size-4" />,
    gradient: "from-blue-500 to-cyan-500",
    iconGradient: "blue",
    bgStyle: cardBackgroundStyles.blue,
    glowColor: "blue",
    image: ccOperations,
    description: "Manage crews, scheduling, weather, field tools, and daily operations.",
    cards: [
      {
        label: "Admin Dashboard",
        description: "Full admin control panel with CRM, leads, and management tools",
        href: "/admin",
        icon: <Shield className="size-5" />,
        badge: "Core",
        featured: true,
      },
      {
        label: "Owner Dashboard",
        description: "Business owner view with financials, SEO, and growth metrics",
        href: "/owner",
        icon: <Crown className="size-5" />,
      },
      {
        label: "Project Manager",
        description: "Project tracking, timelines, and team coordination",
        href: "/project-manager",
        icon: <ClipboardList className="size-5" />,
      },
      {
        label: "Crew Lead",
        description: "Crew schedules, time tracking, and incident reports",
        href: "/crew-lead",
        icon: <Users className="size-5" />,
      },
      {
        label: "Ops Center",
        description: "Operations management and workflow automation",
        href: "/ops",
        icon: <Gauge className="size-5" />,
      },
      {
        label: "Field Tool",
        description: "Mobile-first field operations for crews on the go",
        href: "/tradeworks",
        icon: <Wrench className="size-5" />,
      },
      {
        label: "Trade Toolkit",
        description: "85+ professional calculators for every trade",
        href: "/trade-toolkit",
        icon: <Calculator className="size-5" />,
        badge: "85+",
      },
    ],
  },
  {
    title: "Sales & CRM",
    icon: <Target className="size-4" />,
    gradient: "from-orange-500 to-rose-500",
    iconGradient: "yellow",
    bgStyle: cardBackgroundStyles.yellow,
    glowColor: "gold",
    image: ccSales,
    description: "Sales pipeline from first contact to signed contract.",
    cards: [
      {
        label: "Estimator",
        description: "Room-by-room estimation wizard with live pricing",
        href: "/estimate",
        icon: <FileText className="size-5" />,
        featured: true,
      },
      {
        label: "Estimator Config",
        description: "Configure pricing, materials, and estimation rules",
        href: "/estimator-config",
        icon: <Settings className="size-5" />,
      },
      {
        label: "Booking Wizard",
        description: "5-step customer booking flow",
        href: "/book",
        icon: <Calendar className="size-5" />,
      },
      {
        label: "Color Library",
        description: "Manufacturer color catalogs and selections",
        href: "/colors",
        icon: <Palette className="size-5" />,
      },
      {
        label: "Proposals",
        description: "Create and manage customer proposals",
        href: "/proposal-ryan",
        icon: <PenTool className="size-5" />,
      },
      {
        label: "Contractor Application",
        description: "New contractor onboarding and applications",
        href: "/contractor-application",
        icon: <Briefcase className="size-5" />,
      },
    ],
  },
  {
    title: "Marketing & Content",
    icon: <Megaphone className="size-4" />,
    gradient: "from-purple-500 to-fuchsia-500",
    iconGradient: "purple",
    bgStyle: cardBackgroundStyles.purple,
    glowColor: "purple",
    image: ccMarketing,
    description: "Automated marketing, content creation, ads, and blog generation.",
    cards: [
      {
        label: "Marketing Hub",
        description: "Full marketing dashboard with content, ads, and scheduling",
        href: "/marketing",
        icon: <Megaphone className="size-5" />,
        badge: "Live",
        featured: true,
      },
      {
        label: "TrustLayer Autopilot",
        description: "Set-it-and-forget-it automated advertising",
        href: "/autopilot/dashboard",
        icon: <Zap className="size-5" />,
        badge: "Live",
      },
      {
        label: "Autopilot Admin",
        description: "Manage all connected businesses and posting schedules",
        href: "/autopilot/admin",
        icon: <UserCog className="size-5" />,
      },
      {
        label: "Blog Manager",
        description: "AI-powered blog generation with SEO optimization",
        href: "/blog",
        icon: <Newspaper className="size-5" />,
      },
      {
        label: "Email Templates",
        description: "Design and manage email campaigns",
        href: "/email-template",
        icon: <Mail className="size-5" />,
      },
      {
        label: "Marketing Overview",
        description: "High-level marketing performance summary",
        href: "/marketing-overview",
        icon: <Eye className="size-5" />,
      },
    ],
  },
  {
    title: "Analytics & Reports",
    icon: <BarChart3 className="size-4" />,
    gradient: "from-cyan-500 to-blue-500",
    iconGradient: "blue",
    bgStyle: cardBackgroundStyles.blue,
    glowColor: "blue",
    image: ccAnalytics,
    description: "Real-time traffic, visitors, conversions, and SEO performance.",
    cards: [
      {
        label: "Unified Analytics",
        description: "Live visitors, traffic, devices, top pages, and referrers",
        href: "/admin",
        icon: <BarChart3 className="size-5" />,
        badge: "Live",
        featured: true,
      },
      {
        label: "Investor Demo",
        description: "Investor-ready platform presentation and metrics",
        href: "/investor-demo",
        icon: <TrendingUp className="size-5" />,
      },
      {
        label: "Platform Presentation",
        description: "Full platform capability walkthrough",
        href: "/presentation",
        icon: <Monitor className="size-5" />,
      },
      {
        label: "Demo Viewer",
        description: "Browse the platform as a prospective customer",
        href: "/demo-viewer",
        icon: <Eye className="size-5" />,
      },
    ],
  },
  {
    title: "Customer Experience",
    icon: <Heart className="size-4" />,
    gradient: "from-pink-500 to-rose-500",
    iconGradient: "purple",
    bgStyle: cardBackgroundStyles.purple,
    glowColor: "purple",
    image: ccCustomer,
    description: "Portal access, reviews, galleries, and communication tools.",
    cards: [
      {
        label: "Customer Portal",
        description: "Customer-facing project tracking and updates",
        href: "/start",
        icon: <Users className="size-5" />,
        featured: true,
      },
      {
        label: "Reviews",
        description: "Customer testimonials and review management",
        href: "/reviews",
        icon: <Star className="size-5" />,
      },
      {
        label: "Portfolio Gallery",
        description: "Before and after project showcase",
        href: "/portfolio",
        icon: <Camera className="size-5" />,
      },
      {
        label: "Contact Page",
        description: "Customer inquiry and contact form",
        href: "/contact",
        icon: <MessageSquare className="size-5" />,
      },
      {
        label: "FAQ",
        description: "Frequently asked questions and support",
        href: "/faq",
        icon: <HelpCircle className="size-5" />,
      },
      {
        label: "Awards",
        description: "Industry awards and certifications",
        href: "/awards",
        icon: <Award className="size-5" />,
      },
    ],
  },
  {
    title: "Finance & Payments",
    icon: <DollarSign className="size-4" />,
    gradient: "from-sky-500 to-blue-600",
    iconGradient: "blue",
    bgStyle: cardBackgroundStyles.blue,
    glowColor: "blue",
    image: ccFinance,
    description: "Payment processing, credits, invoicing, and Stripe integration.",
    cards: [
      {
        label: "Credits Dashboard",
        description: "Toolkit credits balance, usage, and purchase history",
        href: "/credits",
        icon: <Coins className="size-5" />,
        featured: true,
      },
      {
        label: "Pricing Config",
        description: "Subscription tiers, credit packs, and pricing rules",
        href: "/pricing",
        icon: <DollarSign className="size-5" />,
      },
      {
        label: "Royalty Dashboard",
        description: "Partner royalties, payouts, and revenue sharing",
        href: "/royalty-dashboard",
        icon: <Wallet className="size-5" />,
      },
      {
        label: "Subscriber Dashboard",
        description: "Active subscriptions and billing management",
        href: "/subscriber-dashboard",
        icon: <CreditCard className="size-5" />,
      },
      {
        label: "Payment Page",
        description: "Process customer payments and invoices",
        href: "/pay/demo",
        icon: <Gift className="size-5" />,
      },
    ],
  },
  {
    title: "Ecosystem & Partners",
    icon: <Globe className="size-4" />,
    gradient: "from-violet-500 to-purple-500",
    iconGradient: "purple",
    bgStyle: cardBackgroundStyles.purple,
    glowColor: "purple",
    image: ccEcosystem,
    description: "20+ connected platforms, partner management, and affiliate tracking.",
    cards: [
      {
        label: "Ecosystem Hub",
        description: "Browse and connect with 20+ Orbit ecosystem platforms",
        href: "/npp",
        icon: <Network className="size-5" />,
        badge: "20+",
        featured: true,
      },
      {
        label: "Partner Dashboard",
        description: "Manage partnerships and affiliate relationships",
        href: "/partner",
        icon: <Handshake className="size-5" />,
      },
      {
        label: "Investors",
        description: "Investor relations and funding information",
        href: "/investors",
        icon: <TrendingUp className="size-5" />,
      },
      {
        label: "Trade Verticals",
        description: "Multi-trade expansion across service categories",
        href: "/trade-verticals",
        icon: <Blocks className="size-5" />,
      },
      {
        label: "Claim Subdomain",
        description: "Register a white-label subdomain for your business",
        href: "/claim-subdomain",
        icon: <Link2 className="size-5" />,
        badge: "New",
      },
    ],
  },
  {
    title: "Settings & Developer",
    icon: <Settings className="size-4" />,
    gradient: "from-slate-400 to-zinc-500",
    iconGradient: "accent",
    bgStyle: cardBackgroundStyles.accent,
    glowColor: "accent",
    image: ccSettings,
    description: "Platform configuration, API access, and system administration.",
    cards: [
      {
        label: "Developer Portal",
        description: "API docs, code hub, and technical tools",
        href: "/developer",
        icon: <Code className="size-5" />,
        featured: true,
      },
      {
        label: "Account Settings",
        description: "Profile, preferences, and account configuration",
        href: "/account",
        icon: <UserCog className="size-5" />,
      },
      {
        label: "Code Hub",
        description: "Platform source code and version control",
        href: "/code-hub",
        icon: <Database className="size-5" />,
      },
      {
        label: "Admin Guide",
        description: "Step-by-step administration documentation",
        href: "/admin-guide",
        icon: <BookOpen className="size-5" />,
      },
      {
        label: "Glossary",
        description: "Platform terminology and definitions",
        href: "/glossary",
        icon: <Search className="size-5" />,
      },
      {
        label: "Guardian Shield",
        description: "Security certification and trust verification",
        href: "/guardian-shield",
        icon: <Shield className="size-5" />,
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
        <GlassCard className="p-8 text-center border-white/10 bg-white/[0.03]" hoverEffect={false} glow="blue" depth="deep">
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
              className="text-center text-2xl tracking-[0.5em] bg-white/5 border-white/10 text-white placeholder:text-white/30"
              data-testid="input-pin"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm" data-testid="text-pin-error">{error}</p>
            )}
            <Button
              type="submit"
              disabled={pin.length < 4 || loading}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400/30 text-white"
              data-testid="button-pin-submit"
            >
              {loading ? "Verifying..." : "Enter Command Center"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function ToolCard({ card, gradient }: { card: LaunchCard; gradient: string }) {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      whileHover={hover3DSubtle}
      whileTap={{ scale: 0.98 }}
      style={{ transformStyle: "preserve-3d" }}
      onClick={() => setLocation(card.href)}
      className="cursor-pointer"
      data-testid={`card-launch-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-4 h-full group transition-all duration-300 hover-elevate">
        {card.featured && (
          <div className="absolute -top-px -right-px">
            <div className={`h-5 w-5 rounded-bl-lg rounded-tr-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <Sparkles className="size-2.5 text-white" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold text-sm truncate" data-testid={`text-tool-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>
                {card.label}
              </h3>
              {card.badge && (
                <Badge className="bg-white/10 border-white/10 text-white/70 text-[10px] px-1.5 py-0" data-testid={`badge-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {card.badge}
                </Badge>
              )}
            </div>
            <p className="text-white/40 text-xs mt-0.5 line-clamp-1" data-testid={`text-tool-desc-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>
              {card.description}
            </p>
          </div>
          <ChevronRight className="size-4 text-white/30 flex-shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}

function CategoryAccordionSection({ category, catIndex, defaultOpen }: { category: Category; catIndex: number; defaultOpen?: boolean }) {
  const featuredCard = category.cards.find(c => c.featured);
  const otherCards = category.cards.filter(c => !c.featured);

  return (
    <motion.div
      variants={cardVariants}
      custom={catIndex}
      whileHover={hover3DSubtle}
      style={{ transformStyle: "preserve-3d" }}
    >
      <GlassCard 
        className={`h-full ${category.bgStyle} border-white/[0.06]`} 
        glow={category.glowColor} 
        hoverEffect={false}
        animatedBorder
        depth="deep"
      >
        <div className="relative h-28 overflow-hidden rounded-t-xl -mx-[1px] -mt-[1px]">
          <img
            src={category.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2.5">
              <motion.div 
                className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} ${iconContainerStyles.gradients[category.iconGradient]}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {category.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-sm" data-testid={`text-category-title-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {category.title}
                </h2>
                <p className="text-white/50 text-[11px] line-clamp-1" data-testid={`text-category-desc-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {category.description}
                </p>
              </div>
              <Badge className="bg-white/10 border-white/10 text-white/60 text-[10px]" data-testid={`badge-category-count-${catIndex}`}>
                {category.cards.length}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-3">
          {featuredCard && (
            <div className="mb-2">
              <ToolCard card={featuredCard} gradient={category.gradient} />
            </div>
          )}

          <Accordion type="single" collapsible defaultValue={defaultOpen ? "tools" : undefined}>
            <AccordionItem value="tools" className="border-white/[0.06]">
              <AccordionTrigger 
                className="py-2 text-white/50 text-xs hover:no-underline"
                data-testid={`button-expand-${category.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="flex items-center gap-2">
                  <LayoutGrid className="size-3" />
                  {otherCards.length} more tools
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Carousel opts={{ align: "start", loop: false }} className="w-full">
                  <CarouselContent className="-ml-2">
                    {otherCards.map((card) => (
                      <CarouselItem key={card.label} className="pl-2 basis-full sm:basis-1/2">
                        <ToolCard card={card} gradient={category.gradient} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {otherCards.length > 2 && (
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <CarouselPrevious className="static translate-y-0 bg-white/5 border-white/10 text-white/50" data-testid={`button-carousel-prev-${catIndex}`} />
                      <CarouselNext className="static translate-y-0 bg-white/5 border-white/10 text-white/50" data-testid={`button-carousel-next-${catIndex}`} />
                    </div>
                  )}
                </Carousel>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function CommandCenter() {
  const [authenticated, setAuthenticated] = useState(false);
  const [, setLocation] = useLocation();

  if (!authenticated) {
    return <PinLogin onSuccess={() => setAuthenticated(true)} />;
  }

  const totalTools = categories.reduce((acc, cat) => acc + cat.cards.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070b16] via-[#0c1222] to-[#070b16]">
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#070b16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-white/60"
              data-testid="button-back-home"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <motion.div 
                className={`${iconContainerStyles.sizes.sm} ${iconContainerStyles.base} bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/20`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <LayoutGrid className="size-3.5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-white font-bold text-sm leading-tight" data-testid="text-cc-header">
                  Command Center
                </h1>
                <p className="text-white/40 text-[10px] leading-tight">Mission Control</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/5 border-white/10 text-white/50 text-[10px]" data-testid="text-total-tools">
              {totalTools} tools
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-300 text-[10px]" data-testid="text-categories-count">
              {categories.length} sections
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <BentoGrid className="gap-4">
            {categories.map((category, catIndex) => {
              const isLarge = catIndex < 2;
              return (
                <BentoItem
                  key={category.title}
                  colSpan={isLarge ? 6 : 4}
                  rowSpan={1}
                  mobileColSpan={4}
                >
                  <CategoryAccordionSection
                    category={category}
                    catIndex={catIndex}
                    defaultOpen={catIndex === 0}
                  />
                </BentoItem>
              );
            })}
          </BentoGrid>
        </motion.div>
      </div>
    </div>
  );
}
