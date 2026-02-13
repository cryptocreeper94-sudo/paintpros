import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { CarouselView } from "@/components/ui/carousel-view";
import { cardVariants, staggerContainer, fadeInUp, scaleIn } from "@/lib/theme-effects";
import { ecosystemApps, type EcosystemApp } from "@/data/ecosystem";

import tlidMarketingImg from "@/assets/images/tlid-marketing-dashboard.jpg";
import tlidSocialImg from "@/assets/images/tlid-social-media.jpg";
import tlidAnalyticsImg from "@/assets/images/tlid-analytics.jpg";
import tlidSecurityImg from "@/assets/images/tlid-security.jpg";
import tlidTeamImg from "@/assets/images/tlid-team.jpg";
import tlidContentImg from "@/assets/images/tlid-content.jpg";
import tlidGrowthImg from "@/assets/images/tlid-growth.jpg";
import tlidHeroBgImg from "@/assets/images/tlid-hero-bg.jpg";

import stepConnectImg from "@/assets/images/step-connect.png";
import stepPreferencesImg from "@/assets/images/step-preferences.png";
import stepSubscribeImg from "@/assets/images/step-subscribe.png";
import productMarketingImg from "@/assets/images/product-marketing.png";
import productShieldImg from "@/assets/images/product-shield.png";
import productStaffingImg from "@/assets/images/product-staffing.png";

import {
  Shield,
  Zap,
  Users,
  BarChart3,
  Lock,
  CheckCircle,
  ArrowRight,
  Facebook,
  Instagram,
  Globe,
  Building2,
  Briefcase,
  Target,
  Eye,
  TrendingUp,
  Award,
  FileCheck,
  Fingerprint,
  Network,
  Layers,
  Star,
  Sparkles,
  ExternalLink,
  Clock,
  Link2,
  Settings,
  Key,
  Loader2,
  ChevronRight,
  LayoutDashboard,
  Megaphone,
  PieChart,
  Bot,
  Palette,
  Calendar,
  Play,
  Pause,
  RefreshCw,
  MonitorSmartphone,
  Wifi,
  AlertCircle,
  Check,
  X,
  ChevronDown
} from "lucide-react";

function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
  );
}

function BentoCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-white/5 p-6">
      <SkeletonPulse className="w-12 h-12 rounded-lg mb-4" />
      <SkeletonPulse className="w-3/4 h-5 mb-3" />
      <SkeletonPulse className="w-full h-3 mb-2" />
      <SkeletonPulse className="w-2/3 h-3" />
    </div>
  );
}

function MetaIntegrationSection() {
  const [, setLocation] = useLocation();
  const [metaToken, setMetaToken] = useState("");
  const [step, setStep] = useState<"input" | "connecting" | "select-page" | "configure" | "complete">("input");
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [postFrequency, setPostFrequency] = useState("9x");
  const [adBudget, setAdBudget] = useState("50");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mockPages = [
    { id: "1", name: "Nash PaintPros", followers: "2,340", category: "Home Services" },
    { id: "2", name: "Paint Pros Co", followers: "1,890", category: "Professional Services" },
    { id: "3", name: "My Business Page", followers: "567", category: "Local Business" },
  ];

  const handleConnect = () => {
    if (!metaToken.trim()) return;
    setStep("connecting");
    setTimeout(() => setStep("select-page"), 2000);
  };

  const handleSelectPage = (pageId: string) => {
    setSelectedPage(pageId);
    setStep("configure");
  };

  const handleActivate = () => {
    setStep("complete");
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 blur-[100px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2" data-testid="badge-meta-connect">
            <Key className="w-4 h-4 mr-2" />
            Meta Business Suite Integration
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Connect & Automate in{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Minutes
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Paste your Meta Business Suite token below. We'll find your pages, set up automated posting, 
            and start running your marketing on autopilot.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {["input", "connecting", "select-page", "configure", "complete"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step === s ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30" :
                ["input", "connecting", "select-page", "configure", "complete"].indexOf(step) > i 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                  : "bg-slate-800/50 text-slate-500 border border-white/10"
              }`}>
                {["input", "connecting", "select-page", "configure", "complete"].indexOf(step) > i ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 4 && <div className={`w-8 h-0.5 ${
                ["input", "connecting", "select-page", "configure", "complete"].indexOf(step) > i 
                  ? "bg-cyan-500/50" : "bg-white/10"
              }`} />}
            </div>
          ))}
        </div>

        <GlassCard hoverEffect={false} glow="blue" animatedBorder depth="deep" className="overflow-visible">
          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {step === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Step 1: Paste Your Meta Token</h3>
                      <p className="text-slate-400 text-sm">Get this from Meta Business Suite &gt; Settings &gt; API</p>
                    </div>
                  </div>

                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="EAAxxxxxxxxx... (Your Meta Business Suite Token)"
                      value={metaToken}
                      onChange={(e) => setMetaToken(e.target.value)}
                      className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-14 text-lg pr-32 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      data-testid="input-meta-token"
                    />
                    <Button
                      onClick={handleConnect}
                      disabled={!metaToken.trim()}
                      className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                      data-testid="button-connect-meta"
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>256-bit encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Never stored in plain text</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4" />
                      <span>SOC 2 compliant</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "connecting" && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-cyan-500/20 border-t-cyan-500"
                  />
                  <h3 className="text-xl font-bold text-white mb-2">Connecting to Meta Business Suite...</h3>
                  <p className="text-slate-400">Verifying your token and fetching your pages</p>
                </motion.div>
              )}

              {step === "select-page" && (
                <motion.div
                  key="select-page"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                      <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Step 2: Select Your Page</h3>
                      <p className="text-slate-400 text-sm">Choose the Facebook Page to automate</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mockPages.map((page) => (
                      <motion.div
                        key={page.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectPage(page.id)}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/10 cursor-pointer hover:border-cyan-500/30 transition-colors group"
                        data-testid={`button-select-page-${page.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                            <Facebook className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{page.name}</p>
                            <p className="text-slate-400 text-sm">{page.category} &middot; {page.followers} followers</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === "configure" && (
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Step 3: Configure Automation</h3>
                      <p className="text-slate-400 text-sm">Set your posting preferences and ad budget</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-300 mb-2 block font-medium">Posting Frequency</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "3x", label: "3x/day" },
                            { value: "6x", label: "6x/day" },
                            { value: "9x", label: "9x/day" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setPostFrequency(opt.value)}
                              className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                postFrequency === opt.value
                                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300"
                                  : "bg-slate-800/50 border border-white/10 text-slate-400 hover:text-white"
                              }`}
                              data-testid={`button-frequency-${opt.value}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-slate-300 mb-2 block font-medium">Daily Ad Budget</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "25", label: "$25/day" },
                            { value: "50", label: "$50/day" },
                            { value: "100", label: "$100/day" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setAdBudget(opt.value)}
                              className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                                adBudget === opt.value
                                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300"
                                  : "bg-slate-800/50 border border-white/10 text-slate-400 hover:text-white"
                              }`}
                              data-testid={`button-budget-${opt.value}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                        <h4 className="text-white font-semibold text-sm mb-3">Platforms</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Facebook className="w-5 h-5 text-blue-400" />
                              <span className="text-slate-200 text-sm">Facebook</span>
                            </div>
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Instagram className="w-5 h-5 text-pink-400" />
                              <span className="text-slate-200 text-sm">Instagram</span>
                            </div>
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">Enabled</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-800/30 border border-white/5">
                        <h4 className="text-white font-semibold text-sm mb-3">Schedule Preview</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(postFrequency === "9x" ? ["6am","8am","10am","12pm","2pm","4pm","6pm","8pm","10pm"] :
                            postFrequency === "6x" ? ["7am","10am","12pm","3pm","6pm","9pm"] :
                            ["9am","1pm","6pm"]).map((time) => (
                            <Badge key={time} className="bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleActivate}
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-lg py-6 shadow-xl shadow-cyan-500/25"
                    data-testid="button-activate-autopilot"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Activate Marketing Autopilot
                  </Button>
                </motion.div>
              )}

              {step === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/40"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Autopilot Activated</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Your automated marketing is now configured. Posts will begin according to your schedule.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      variant="outline"
                      className="border-white/10 bg-white/5 backdrop-blur-sm"
                      onClick={() => setLocation('/trustlayer/marketing')}
                      data-testid="button-view-dashboard"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                    <Button
                      onClick={() => { setStep("input"); setMetaToken(""); setSelectedPage(null); }}
                      variant="outline"
                      className="border-white/10 bg-white/5 backdrop-blur-sm"
                      data-testid="button-connect-another"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Connect Another Page
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function TrustLayerHome() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    document.title = "TrustLayer Marketing - Automated Social Media Marketing | Set It & Forget It";

    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Connect your Meta Business Suite and let TrustLayer Marketing handle your Facebook & Instagram posts, ad campaigns, and analytics automatically. From $99/mo.";
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = "automated marketing, social media automation, Facebook marketing, Instagram marketing, small business marketing, digital marketing platform, Meta Business Suite, automated posting";
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }

    const ogTags = [
      { property: 'og:title', content: 'TrustLayer Marketing - Automated Social Media Marketing' },
      { property: 'og:description', content: 'Set it once, run forever. Automated Facebook & Instagram posting, smart ad boosting, and real-time analytics. From $99/mo.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://tlid.io' },
      { property: 'og:site_name', content: 'TrustLayer Marketing' },
      { property: 'og:image', content: 'https://tlid.io/og-trustlayer.png' }
    ];

    ogTags.forEach(tag => {
      let meta = document.querySelector(`meta[property="${tag.property}"]`);
      if (meta) {
        meta.setAttribute('content', tag.content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });

    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'TrustLayer Marketing - Automated Social Media Marketing' },
      { name: 'twitter:description', content: 'Set it once, run forever. Automated Facebook & Instagram posting from $99/mo.' },
      { name: 'twitter:image', content: 'https://tlid.io/og-trustlayer.png' }
    ];

    twitterTags.forEach(tag => {
      let meta = document.querySelector(`meta[name="${tag.name}"]`);
      if (meta) {
        meta.setAttribute('content', tag.content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://tlid.io');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://tlid.io');
      document.head.appendChild(canonical);
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'TrustLayer Marketing Home',
        page_path: '/trustlayer'
      });
    }

    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const connectedSystems = ecosystemApps.map(app => ({
    name: app.name,
    desc: app.desc,
    url: app.url,
    image: app.image,
    status: app.status,
    current: app.current,
    primary: app.featured
  }));

  const testimonials = [
    { name: "Marcus J.", business: "Nash PaintPros", quote: "Set up in 10 minutes. Posts every day automatically while I focus on estimates.", rating: 5 },
    { name: "Sarah T.", business: "Elite Remodeling", quote: "Our engagement jumped 340% in the first month. The ad boosting is incredible.", rating: 5 },
    { name: "Devon R.", business: "Crown Painters", quote: "Went from zero social media presence to 9 posts a day across Facebook and Instagram.", rating: 5 },
  ];

  const ecosystemSlides = connectedSystems.map((system: any, i: number) => (
    <motion.div
      key={i}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => system.url && window.open(system.url, '_blank')}
      className={`relative h-[280px] rounded-xl overflow-hidden cursor-pointer group ${
        system.primary ? 'ring-2 ring-cyan-500/50' : 'ring-1 ring-white/10'
      }`}
    >
      <div className="absolute inset-0">
        <img
          src={system.image}
          alt={system.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {system.current && (
          <Badge className="mb-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">You Are Here</Badge>
        )}
        {system.status && (
          <Badge className={`mb-2 text-xs ${
            system.status === 'Live' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' :
            system.status === 'Beta' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
            system.status === 'Coming Soon' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
            'bg-slate-500/20 text-slate-400 border-slate-500/30'
          }`}>
            {system.status}
          </Badge>
        )}
        <h4 className="text-white font-semibold text-sm">{system.name}</h4>
        <p className="text-slate-400 text-xs">{system.desc}</p>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-purple-500/10 via-transparent to-cyan-500/10" />
    </motion.div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"
        />
      </div>

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative border-b border-white/5 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25"
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-xl font-bold text-white">TrustLayer Marketing</p>
                <p className="text-slate-500 text-xs tracking-wider">TLId.io</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/trustlayer/marketing')}
                className="text-slate-400 hidden md:inline-flex"
              >
                Marketing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/trustlayer/guardian')}
                className="text-slate-400 hidden md:inline-flex"
              >
                Guardian Shield
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://dwsc.io/guardian-ai', '_blank')}
                className="text-slate-400 hidden md:inline-flex"
                data-testid="button-guardian-ai"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Guardian AI
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://trustshield.tech', '_blank')}
                className="text-slate-400 hidden md:inline-flex"
                data-testid="button-guardian-shield-nav"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                TrustShield
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/25"
                data-testid="button-signup"
                onClick={() => setLocation('/autopilot/onboarding')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ===== HERO SECTION ===== */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={tlidHeroBgImg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/90 to-slate-950" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
              >
                <Layers className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">TrustLayer Marketing</p>
                <p className="text-slate-400 text-sm">Automated Social Media Platform</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex justify-center">
              <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2 backdrop-blur-sm">
                <Zap className="w-4 h-4 mr-2" />
                Automated Digital Marketing
              </Badge>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight text-center"
          >
            Connect Your Business.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Automate Everything.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed text-center"
          >
            Link your Meta Business Suite and let TrustLayer Marketing handle your Facebook & Instagram
            posts, ad campaigns, and analytics. Set it once, run forever.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-3 sm:gap-6 mb-10 flex-wrap"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-sm sm:text-base">Facebook</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
              <span className="text-sm sm:text-base">Instagram</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              <span className="text-sm sm:text-base">Nextdoor</span>
              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px] sm:text-xs px-1.5 py-0">Soon</Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold px-10 py-7 shadow-xl shadow-cyan-500/30 border border-white/20"
              onClick={() => document.getElementById('meta-connect')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-connect-now"
            >
              <Zap className="w-6 h-6 mr-2" />
              Get Started - Connect Meta
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ===== BENTO GRID - FEATURES ===== */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Everything Your Marketing Needs</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete automated marketing ecosystem, from content creation to analytics
            </p>
          </motion.div>

          {!isLoaded ? (
            <div className="grid grid-cols-4 md:grid-cols-12 gap-2 md:gap-4 max-w-7xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${i < 2 ? 'col-span-4 md:col-span-6' : 'col-span-2 md:col-span-4'}`}>
                  <BentoCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <BentoGrid>
              {/* Large Card - Marketing Autopilot */}
              <BentoItem colSpan={8} rowSpan={2} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[320px] md:min-h-[400px] cursor-pointer group"
                  onClick={() => setLocation('/trustlayer/marketing')}
                >
                  <div className="absolute inset-0">
                    <img src={tlidMarketingImg} alt="Marketing Dashboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="absolute inset-0 backdrop-blur-[1px]" />
                  <div className="relative p-6 md:p-8 flex flex-col h-full justify-end">
                    <Badge className="mb-3 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 self-start backdrop-blur-sm">
                      <Megaphone className="w-3 h-3 mr-1" />
                      Core Feature
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Marketing Autopilot</h3>
                    <p className="text-slate-300 text-sm md:text-base mb-4 max-w-lg">
                      Automated Facebook & Instagram posting, smart ad boosting, content rotation, and real-time analytics. Set it once, it runs forever.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Auto Posting", "Ad Boosting", "Analytics", "Content Library"].map((tag) => (
                        <Badge key={tag} className="bg-white/10 text-white/80 border-white/10 backdrop-blur-sm text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </BentoItem>

              {/* Right Column - Social Media */}
              <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[180px] cursor-pointer group"
                >
                  <div className="absolute inset-0">
                    <img src={tlidSocialImg} alt="Social Media" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
                  </div>
                  <div className="relative p-5 flex flex-col h-full justify-end">
                    <div className="flex items-center gap-3 mb-2">
                      <Facebook className="w-5 h-5 text-blue-400" />
                      <Instagram className="w-5 h-5 text-pink-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Multi-Platform</h4>
                    <p className="text-slate-300 text-sm">Post to Facebook & Instagram simultaneously</p>
                  </div>
                </motion.div>
              </BentoItem>

              {/* Right Column - Analytics */}
              <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[180px] cursor-pointer group"
                >
                  <div className="absolute inset-0">
                    <img src={tlidAnalyticsImg} alt="Analytics" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
                  </div>
                  <div className="relative p-5 flex flex-col h-full justify-end">
                    <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
                    <h4 className="text-lg font-bold text-white">Real-Time Analytics</h4>
                    <p className="text-slate-300 text-sm">Track reach, engagement & conversions live</p>
                  </div>
                </motion.div>
              </BentoItem>

              {/* Bottom Row - 3 cards */}
              <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[200px] cursor-pointer group"
                  onClick={() => setLocation('/trustlayer/guardian')}
                >
                  <div className="absolute inset-0">
                    <img src={tlidSecurityImg} alt="Security" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
                  </div>
                  <div className="relative p-5 flex flex-col h-full justify-end">
                    <Shield className="w-6 h-6 text-cyan-400 mb-2" />
                    <h4 className="text-lg font-bold text-white">Guardian Shield</h4>
                    <p className="text-slate-300 text-sm">Business verification & trust badges</p>
                  </div>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[200px] cursor-pointer group"
                >
                  <div className="absolute inset-0">
                    <img src={tlidContentImg} alt="Content Creation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
                  </div>
                  <div className="relative p-5 flex flex-col h-full justify-end">
                    <Palette className="w-6 h-6 text-violet-400 mb-2" />
                    <h4 className="text-lg font-bold text-white">Content Engine</h4>
                    <p className="text-slate-300 text-sm">AI-generated posts or use your own templates</p>
                  </div>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[200px] cursor-pointer group"
                  onClick={() => window.open('https://orbitstaffing.io', '_blank')}
                >
                  <div className="absolute inset-0">
                    <img src={tlidTeamImg} alt="Team Management" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30" />
                  </div>
                  <div className="relative p-5 flex flex-col h-full justify-end">
                    <Users className="w-6 h-6 text-amber-400 mb-2" />
                    <h4 className="text-lg font-bold text-white">Orbit Staffing</h4>
                    <p className="text-slate-300 text-sm">Crew management, payroll & time tracking</p>
                  </div>
                </motion.div>
              </BentoItem>
            </BentoGrid>
          )}
        </div>
      </div>

      {/* ===== HOW IT WORKS - 3 Steps ===== */}
      <div className="relative py-20 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-slate-500 text-sm uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="text-4xl font-bold text-white">Three Steps to Autopilot</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Connect Meta', desc: 'Link your Facebook Page & Instagram in 5 minutes', icon: Link2, image: stepConnectImg },
              { step: '2', title: 'Set Preferences', desc: 'Choose your content style, schedule & budget', icon: Settings, image: stepPreferencesImg },
              { step: '3', title: 'Subscribe & Go', desc: 'From $99/mo - We handle everything automatically', icon: Zap, image: stepSubscribeImg }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/85 to-slate-900/40" />
                </div>
                <div className="relative p-6 pt-16 text-center min-h-[220px] flex flex-col justify-end">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-slate-300 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== META BUSINESS SUITE INTEGRATION ===== */}
      <div id="meta-connect" className="relative py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <MetaIntegrationSection />
        </div>
      </div>

      {/* ===== CONNECTED ECOSYSTEM CAROUSEL ===== */}
      <div className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
              <Network className="w-4 h-4 mr-2" />
              Connected Ecosystem
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">One Platform, Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Build and grow your business with our fully connected ecosystem of tools and automation.</p>
          </motion.div>

          <CarouselView
            slides={ecosystemSlides}
            options={{ loop: true, align: 'start' }}
            slideClassName="flex-[0_0_220px] min-w-0 pl-4"
          />
        </div>
      </div>

      {/* ===== PRODUCTS BENTO GRID ===== */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Complete Solutions
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">Products & Services</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Build trust, grow visibility, and manage operations</p>
          </motion.div>

          <BentoGrid>
            {[
              {
                name: 'TrustLayer Marketing',
                tagline: 'Automated Social Media',
                desc: 'Set it and forget it marketing. Automated Facebook & Instagram posting, smart ad boosting, and real-time analytics.',
                icon: Zap,
                color: 'from-blue-500 to-purple-500',
                features: ['Automated Posting', 'Smart Ad Boosting', 'Full Analytics', 'Content Library'],
                price: 'From $99/mo',
                link: '/trustlayer/marketing',
                image: productMarketingImg,
                colSpan: 6,
              },
              {
                name: 'Guardian Shield',
                tagline: 'Business Security',
                desc: 'Complete business verification and security infrastructure. Protect your reputation with certified trust badges.',
                icon: Shield,
                color: 'from-cyan-500 to-blue-500',
                features: ['Business Verification', 'Trust Badges', 'Security Monitoring', 'Credential Management'],
                price: '$49/mo',
                link: '/trustlayer/guardian',
                image: productShieldImg,
                colSpan: 6,
              },
              {
                name: 'Orbit Staffing Connect',
                tagline: 'Workforce & Financials',
                desc: 'Connected crew management, payroll, time tracking, and financial hub integration.',
                icon: Users,
                color: 'from-amber-500 to-orange-500',
                features: ['Crew Management', 'Payroll', 'Financial Hub', 'Time Tracking'],
                price: '$79/mo',
                link: 'https://orbitstaffing.io',
                external: true,
                image: productStaffingImg,
                colSpan: 12,
              }
            ].map((product, i) => (
              <BentoItem key={product.name} colSpan={(product as any).colSpan} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[280px] cursor-pointer group border border-white/5"
                  onClick={() => (product as any).external ? window.open(product.link, '_blank') : setLocation(product.link)}
                >
                  <div className="absolute inset-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/50" />
                  </div>
                  <div className="relative p-6 md:p-8 flex flex-col h-full justify-end">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <product.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-2">{product.tagline}</p>
                    <p className="text-slate-300 text-sm mb-4">{product.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-slate-200">
                          <CheckCircle className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-bold text-white">{product.price}</span>
                      <Button size="sm" className="bg-white/10 backdrop-blur-sm text-white">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </BentoItem>
            ))}
          </BentoGrid>
        </div>
      </div>

      {/* ===== LIVE STATS BENTO ===== */}
      <div className="relative py-16 border-y border-white/5 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-3">Platform at a Glance</h2>
            <p className="text-slate-400">Real numbers from businesses using TrustLayer Marketing</p>
          </motion.div>

          <BentoGrid className="max-w-5xl">
            {[
              { label: "Posts Automated", value: "52,000+", icon: Megaphone, color: "text-cyan-400", bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20" },
              { label: "Engagement Rate", value: "4.7%", icon: TrendingUp, color: "text-purple-400", bg: "from-purple-500/10 to-violet-500/10", border: "border-purple-500/20" },
              { label: "Businesses Active", value: "340+", icon: Building2, color: "text-blue-400", bg: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/20" },
              { label: "Ad Spend Managed", value: "$1.2M", icon: Target, color: "text-amber-400", bg: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/20" },
              { label: "Hours Saved Monthly", value: "12,400+", icon: Clock, color: "text-cyan-400", bg: "from-cyan-500/10 to-blue-500/10", border: "border-cyan-500/20" },
              { label: "Avg ROI Increase", value: "287%", icon: PieChart, color: "text-violet-400", bg: "from-violet-500/10 to-purple-500/10", border: "border-violet-500/20" },
            ].map((stat, i) => (
              <BentoItem key={stat.label} colSpan={4} rowSpan={1} mobileColSpan={2}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`rounded-xl bg-gradient-to-br ${stat.bg} border ${stat.border} p-5 md:p-6 backdrop-blur-sm h-full`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              </BentoItem>
            ))}
          </BentoGrid>
        </div>
      </div>

      {/* ===== TESTIMONIALS CAROUSEL ===== */}
      <div className="relative py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-3">Already Powering Growth</h2>
          </motion.div>

          <CarouselView
            slides={testimonials.map((t, i) => (
              <GlassCard key={i} hoverEffect="subtle" glow="blue" depth="medium" className="overflow-visible">
                <div className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-white text-lg mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{t.name}</p>
                      <p className="text-slate-400 text-sm">{t.business}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
            options={{ loop: true }}
          />
        </div>
      </div>

      {/* ===== PAIN POINTS BENTO ===== */}
      <div className="relative py-16 border-y border-white/5 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Sound Familiar?</h2>

          <BentoGrid className="max-w-5xl">
            {[
              { problem: "Hours on social media daily", solution: "Auto-posts while you work", icon: Clock, image: tlidSocialImg },
              { problem: "Posts get zero engagement", solution: "Analytics optimize your results", icon: TrendingUp, image: tlidGrowthImg },
              { problem: "Same content getting stale", solution: "Fresh content rotation daily", icon: Sparkles, image: tlidContentImg }
            ].map((item, i) => (
              <BentoItem key={i} colSpan={4} rowSpan={1} mobileColSpan={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden h-full min-h-[220px] group"
                >
                  <div className="absolute inset-0">
                    <img src={item.image} alt={item.problem} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60" />
                  </div>
                  <div className="relative p-6 flex flex-col h-full justify-end">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">Problem</Badge>
                    </div>
                    <p className="text-white font-semibold mb-3">{item.problem}</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-300 text-sm font-medium">{item.solution}</span>
                    </div>
                  </div>
                </motion.div>
              </BentoItem>
            ))}
          </BentoGrid>

          <p className="text-center text-white font-semibold mt-10 text-xl">
            "Set it up once. It runs forever."
          </p>
        </div>
      </div>

      {/* ===== BUNDLE OFFER ===== */}
      <div className="relative py-16">
        <div className="max-w-4xl mx-auto px-6">
          <GlassCard hoverEffect="glow" glow="blue" animatedBorder depth="deep" className="overflow-visible">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <Badge className="mb-3 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Best Value
                  </Badge>
                  <h3 className="text-3xl font-bold text-white mb-2">TrustLayer Marketing Complete Bundle</h3>
                  <p className="text-slate-400">Marketing + Guardian Shield + Orbit Staffing Connect - All in one</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500 text-sm line-through mb-1">$187/mo</p>
                  <p className="text-5xl font-bold text-white mb-2">
                    $149<span className="text-lg text-slate-400">/mo</span>
                  </p>
                  <Button
                    className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 shadow-xl"
                    data-testid="button-get-bundle"
                  >
                    Get the Bundle
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ===== ECOSYSTEM LINKS ===== */}
      <div className="relative border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-white font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            TrustLayer Marketing Ecosystem
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center md:flex-wrap">
            {[
              { name: 'TLId.io', url: 'https://tlid.io', active: true },
              { name: 'DWSC.io', url: 'https://dwsc.io' },
              { name: 'Guardian AI', url: 'https://dwsc.io/guardian-ai' },
              { name: 'AI Agents', url: 'https://dwsc.io/ai-agents' },
              { name: 'Guardian Shield', url: 'https://trustshield.tech' },
              { name: 'DarkWave Studios', url: 'https://darkwavestudios.io' },
              { name: 'DarkWave Games', url: 'https://darkwavegames.io' },
              { name: 'YourLegacy.io', url: 'https://yourlegacy.io' },
              { name: 'DWTL.io', url: 'https://dwtl.io' },
              { name: 'OrbitStaffing.io', url: 'https://orbitstaffing.io' },
              { name: 'VedaSolus.io', url: 'https://vedasolus.io' },
              { name: 'StrikeAgent.io', url: 'https://strikeagent.io' },
              { name: 'DarkWavePulse.com', url: 'https://darkwavepulse.com' },
            ].map((site, i) => (
              <a
                key={i}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-shrink-0 snap-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  site.active
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:text-white hover:border-white/20'
                }`}
                data-testid={`link-ecosystem-${site.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              >
                {site.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">TrustLayer Marketing</p>
                <p className="text-slate-500 text-xs">TLId.io</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs">
              <button
                onClick={() => setLocation('/trustlayer/privacy')}
                className="hover:text-white transition-colors"
                data-testid="link-privacy"
              >
                Privacy
              </button>
              <button
                onClick={() => setLocation('/trustlayer/terms')}
                className="hover:text-white transition-colors"
                data-testid="link-terms"
              >
                Terms
              </button>
              <span>support@tlid.io</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
