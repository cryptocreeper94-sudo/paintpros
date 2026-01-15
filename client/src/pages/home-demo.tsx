import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { LogoFlipCard } from "@/components/ui/logo-flip-card";
import { FlipButton } from "@/components/ui/flip-button";
import { CarouselView } from "@/components/ui/carousel-view";
import { HeroSlideshow } from "@/components/ui/hero-slideshow";
import { Award, LayoutGrid, Rows, Eye, TrendingUp } from "lucide-react";
import awardImage from "@assets/Screenshot_20251216_195245_Replit_1765936399782.jpg";
import portfolioImage from "@assets/generated_images/freshly_painted_home_interior.png";
import { ArrowRight, Star, Brush, ShieldCheck, Clock, CheckCircle2, MapPin, BadgeCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import heroBg from "@assets/generated_images/abstract_army_green_dark_texture_with_gold_accents.png";
import paintBrush from "@assets/generated_images/isolated_professional_paint_brush.png";
import colorWheelWhiteBg from "@assets/generated_images/paint_color_wheel_white_bg.png";
import colorWheelNoBg from "@assets/generated_images/paint_color_wheel_no_bg.png";
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import estimateImage from "@assets/generated_images/painter_consulting_homeowner_estimate.png";
import premiumMaterialsImage from "@assets/generated_images/premium_paint_materials_display.png";
import onTimeImage from "@assets/generated_images/on-time_punctuality_clock.png";
import warrantyImage from "@assets/generated_images/clean_warranty_shield_badge.png";
import testimonialImage from "@assets/generated_images/freshly_painted_home_interior.png";
import solanaLogo from "@assets/solana-logo-transparent.png";
import darkwaveLogo from "@assets/generated_images/darkwave_blockchain_logo_icon.png";
import { useTenant } from "@/context/TenantContext";
import { ServiceAreaModal } from "@/components/service-area-modal";
import { ColorSelectorModal } from "@/components/color-selector-modal";
import { SolanaVerifiedModal } from "@/components/solana-verified-modal";
import { DarkwaveVerifiedModal } from "@/components/darkwave-verified-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ContactModal } from "@/components/contact-modal";
import { CryptoPaymentModal } from "@/components/crypto-payment-modal";
import { AboutUsModal } from "@/components/about-us-modal";
import { FeatureModal } from "@/components/feature-modal";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { MessagingWidget } from "@/components/messaging-widget";
import { InvestorSnapshotModal } from "@/components/investor-snapshot-modal";
import { TradeVerticalSelector } from "@/components/trade-vertical-selector";
import { EstimatorPromoCard } from "@/components/estimator-promo-card";
import { PWAStaticBanner } from "@/components/pwa-static-banner";
import { LeadSubmissionForm } from "@/components/lead-generation/lead-submission-form";
import { FeatureShowcase } from "@/components/lead-generation/feature-showcase";
import { ContractorCTA } from "@/components/lead-generation/contractor-cta";

export default function HomeDemo() {
  const tenant = useTenant();
  const [serviceAreaOpen, setServiceAreaOpen] = useState(false);
  const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
  const [solanaVerifiedOpen, setSolanaVerifiedOpen] = useState(false);
  const [darkwaveVerifiedOpen, setDarkwaveVerifiedOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [materialsModalOpen, setMaterialsModalOpen] = useState(false);
  const [ontimeModalOpen, setOntimeModalOpen] = useState(false);
  const [warrantyModalOpen, setWarrantyModalOpen] = useState(false);
  const [layoutPanelOpen, setLayoutPanelOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<string | null>(null);
  const [investorSnapshotOpen, setInvestorSnapshotOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dev_layout_override');
    setCurrentLayout(saved);
  }, []);

  const handleLayoutChange = (layout: 'bento' | 'minimalist') => {
    localStorage.setItem('dev_layout_override', layout);
    setCurrentLayout(layout);
    window.location.reload();
  };

  const testimonials = [
    {
      text: "Absolutely transformed our home. The team was punctual, polite, and the lines are razor sharp. Worth every penny.",
      author: "Sarah Jenkins",
      loc: tenant.address?.city ? `${tenant.address.city}, ${tenant.address.state}` : "Local Customer",
      rating: 4.9
    },
    {
      text: "Best painting crew we've ever hired. They finished ahead of schedule and left the place cleaner than they found it.",
      author: "Michael Ross",
      loc: tenant.seo.serviceAreas[1] ? `${tenant.seo.serviceAreas[1]}, ${tenant.address?.state || ""}` : "Nearby Customer",
      rating: 5.0
    },
    {
      text: "Professional from the first quote to the final walk-through. Highly recommend for any commercial work.",
      author: "David Chen",
      loc: tenant.address?.city ? `${tenant.address.city}, ${tenant.address.state}` : "Satisfied Customer",
      rating: 4.8
    }
  ];

  const cityName = tenant.address?.city || "Your City";
  const ratingBadge = tenant.credentials?.googleRating ? `${cityName}'s #1 Rated` : "Top Rated";
  const isDemo = tenant.id === "demo";
  const solanaLabel = isDemo ? "Painting Company Software" : "Painting Company";

  return (
    <PageLayout>
      <main className="pt-6 md:pt-8 pb-8 md:pb-12 px-3 md:px-10">
        <BentoGrid>
          
          {/* 1. Hero Slideshow - Main Card with Tutorial (FULL WIDTH) */}
          <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={3} className="relative">
            <HeroSlideshow />
          </BentoItem>

          {/* Trade Vertical Selector - Demo Only */}
          {tenant.id === "demo" && (
            <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
              <TradeVerticalSelector />
            </BentoItem>
          )}

          {/* Lead Generation - Customer Lead Form */}
          {tenant.id === "demo" && (
            <BentoItem colSpan={6} rowSpan={3} mobileColSpan={4} mobileRowSpan={4}>
              <LeadSubmissionForm />
            </BentoItem>
          )}

          {/* Contractor CTA - For Painters */}
          {tenant.id === "demo" && (
            <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
              <ContractorCTA />
            </BentoItem>
          )}

          {/* Feature Showcase Gallery */}
          {tenant.id === "demo" && (
            <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
              <FeatureShowcase />
            </BentoItem>
          )}

          {/* PWA Install Banner */}
          <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
            <PWAStaticBanner />
          </BentoItem>

          {/* AI Estimator Promotion Card - Prominent Placement */}
          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
            <EstimatorPromoCard />
          </BentoItem>

          {/* Award Card - Best Painter 2025 (NPP only) */}
          {tenant.id === "npp" && (
            <BentoItem colSpan={6} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
              <a href="/awards" className="block h-full" data-testid="link-award-card">
                <GlassCard className="p-0 overflow-hidden relative group cursor-pointer hover:border-accent/40 transition-colors h-full" hoverEffect glow>
                  <img 
                    src={awardImage} 
                    alt="Best Painter in Nashville 2025 Award" 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-[9px] md:text-xs font-bold text-accent uppercase tracking-wider">2025 Award</span>
                    </div>
                    <h3 className="text-xs md:text-lg font-display font-bold text-white">Best Painter in Nashville</h3>
                  </div>
                </GlassCard>
              </a>
            </BentoItem>
          )}

          {/* Portfolio Card */}
          <BentoItem colSpan={tenant.id === "npp" ? 6 : 12} rowSpan={1} mobileColSpan={tenant.id === "npp" ? 2 : 4} mobileRowSpan={2}>
            <a href="/portfolio" className="block h-full" data-testid="link-portfolio-card">
              <GlassCard className="p-0 overflow-hidden relative group cursor-pointer hover:border-accent/40 transition-colors h-full" hoverEffect glow>
                <img 
                  src={portfolioImage} 
                  alt="View our portfolio of completed projects" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brush className="w-4 h-4 text-accent" />
                    <span className="text-[9px] md:text-xs font-bold text-accent uppercase tracking-wider">Our Work</span>
                  </div>
                  <h3 className="text-xs md:text-lg font-display font-bold text-white">View Portfolio</h3>
                  <p className="text-[9px] md:text-xs text-gray-200 hidden md:block">Browse our gallery of transformations</p>
                </div>
                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </GlassCard>
            </a>
          </BentoItem>

          {/* 2. CTA Card - High Contrast */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <a href="/estimate" className="block h-full" data-testid="link-free-estimate-card">
              <GlassCard className="bg-accent/10 border-accent/20 relative p-3 md:p-8 group h-full cursor-pointer hover:border-accent/40 transition-colors overflow-hidden flex flex-col justify-end" glow>
                <img 
                  src={estimateImage} 
                  alt="Professional estimate consultation" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 dark:opacity-70 dark:group-hover:opacity-80 transition-opacity"
                />
                <div className="relative z-10">
                  <h3 className="text-sm md:text-2xl font-display font-bold mb-0.5 md:mb-1 text-gray-800 dark:text-white">Your Price in Seconds</h3>
                  <p className="text-[10px] md:text-xs text-gray-700 dark:text-gray-200 pr-8 font-bold">
                    Our AI-powered estimator calculates your project cost instantly. No waiting. No callbacks.
                  </p>
                </div>
                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10">
                  <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-accent text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(197,160,89,0.5)]">
                    <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
                  </div>
                </div>
              </GlassCard>
            </a>
          </BentoItem>

          {/* 3. Social Proof - Logo Flip Card */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <LogoFlipCard />
          </BentoItem>

          {/* Solana Verified Badge - FIRST IN INDUSTRY */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
            <button
              onClick={() => setSolanaVerifiedOpen(true)}
              className="w-full h-full text-left"
              data-testid="button-solana-verified"
            >
              <GlassCard 
                className="p-2 md:p-4 cursor-pointer hover:border-[#14F195]/40 transition-all h-full max-h-[90px] md:max-h-none bg-gradient-to-br from-[#9945FF]/10 via-[#14F195]/5 to-[#9945FF]/10 border-[#14F195]/30 relative overflow-hidden"
                hoverEffect
                glow
              >
                {/* Solana logo background */}
                <img 
                  src={solanaLogo} 
                  alt="" 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 object-contain opacity-25"
                />
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF]/20 via-transparent to-[#14F195]/20 animate-pulse opacity-50" />
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                  {/* First in Industry Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex-shrink-0 shadow-[0_0_15px_rgba(20,241,149,0.4)]">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-bold text-cyan-700 dark:text-[#14F195] uppercase tracking-wider">Industry First</span>
                      <span className="text-[7px] md:text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded text-white font-bold inline-block w-fit">SOLANA BLOCKCHAIN</span>
                    </div>
                  </div>
                  
                  {/* Main Headline */}
                  <h3 className="font-display font-bold text-xs md:text-base text-foreground dark:text-white leading-tight mb-1">
                    The <span className="text-cyan-700 dark:text-[#14F195]">First</span> Solana-Verified
                    <span className="text-cyan-700 dark:text-[#14F195]"> {solanaLabel}</span>
                  </h3>
                  
                  {/* Anti-fraud messaging */}
                  <p className="text-[8px] md:text-[10px] text-muted-foreground leading-snug">
                    <span className="text-cyan-700 dark:text-[#14F195] font-medium">Anti-fraud</span> • Immutable records • Document recall
                  </p>
                  
                  {/* Learn More CTA */}
                  <div className="flex items-center gap-1 pt-1 text-cyan-700 dark:text-[#14F195]">
                    <span className="text-[8px] md:text-[10px] font-medium">Learn how we protect you</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* Darkwave Verified Badge - DUAL-CHAIN PROTECTION */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
            <button
              onClick={() => setDarkwaveVerifiedOpen(true)}
              className="w-full h-full text-left"
              data-testid="button-darkwave-verified"
            >
              <GlassCard 
                className="p-2 md:p-4 cursor-pointer hover:border-[#7C3AED]/40 transition-all h-full max-h-[90px] md:max-h-none bg-gradient-to-br from-[#7C3AED]/10 via-[#3B82F6]/5 to-[#7C3AED]/10 border-[#7C3AED]/30 relative overflow-hidden"
                hoverEffect
                glow
              >
                {/* Darkwave logo background */}
                <img 
                  src={darkwaveLogo} 
                  alt="" 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 object-contain opacity-25"
                />
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 via-transparent to-[#3B82F6]/20 animate-pulse opacity-50" />
                
                <div className="relative z-10 flex flex-col justify-between h-full">
                  {/* Dual-Chain Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex-shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Dual-Chain</span>
                      <span className="text-[7px] md:text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] rounded text-white font-bold inline-block w-fit">DARKWAVE CHAIN</span>
                    </div>
                  </div>
                  
                  {/* Main Headline */}
                  <h3 className="font-display font-bold text-xs md:text-base text-foreground dark:text-white leading-tight mb-1">
                    <span className="text-purple-700 dark:text-purple-400">Secondary</span> Blockchain
                    <span className="text-purple-700 dark:text-purple-400"> Verification</span>
                  </h3>
                  
                  {/* Security messaging */}
                  <p className="text-[8px] md:text-[10px] text-muted-foreground leading-snug">
                    <span className="text-purple-700 dark:text-purple-400 font-medium">Redundant security</span> • Dual-chain stamps • Extra protection
                  </p>
                  
                  {/* Learn More CTA */}
                  <div className="flex items-center gap-1 pt-1 text-purple-700 dark:text-purple-400">
                    <span className="text-[8px] md:text-[10px] font-medium">View Darkwave verification</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 4. Key Feature 1 - Premium Materials (Modal) */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <button 
              onClick={() => setMaterialsModalOpen(true)} 
              className="w-full h-full text-left"
              data-testid="button-premium-materials"
            >
              <GlassCard className="p-2 md:p-6 flex flex-col justify-end h-full cursor-pointer hover:border-accent/40 transition-all relative overflow-hidden" hoverEffect>
                <img 
                  src={premiumMaterialsImage} 
                  alt="Premium paint materials" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent z-[1]" />
                <div className="flex items-center gap-2 md:gap-4 relative z-10">
                  <div className="bg-accent/20 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                    <Brush className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs md:text-lg text-black dark:text-white">Premium Materials</h3>
                    <p className="text-[10px] md:text-sm text-black/80 dark:text-white/80 hidden md:block font-bold">Top-tier paints and finishes only.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 5. Key Feature 2 - On-Time (Modal) */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <button 
              onClick={() => setOntimeModalOpen(true)} 
              className="w-full h-full text-left"
              data-testid="button-on-time"
            >
              <GlassCard className="p-2 md:p-6 flex flex-col justify-center items-center h-full cursor-pointer hover:border-accent/40 transition-all relative overflow-hidden" hoverEffect>
                <img 
                  src={onTimeImage} 
                  alt="On-time service" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-60 transition-opacity"
                />
                <div className="flex flex-col items-center text-center gap-1 relative z-10">
                  <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl">
                    <Clock className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-xs md:text-lg text-black">On-Time</h3>
                  <p className="text-[10px] md:text-sm text-black/80 font-bold">We value your time.</p>
                  <ArrowRight className="w-4 h-4 text-accent mt-1" />
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 6. Key Feature 3 - Warranty (Modal) */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <button 
              onClick={() => setWarrantyModalOpen(true)} 
              className="w-full h-full text-left"
              data-testid="button-warranty"
            >
              <GlassCard className="p-3 md:p-4 h-full cursor-pointer hover:border-accent/40 transition-all relative overflow-hidden" hoverEffect>
                {/* SVG Badge - floating behind text, full height, NO background */}
                <svg 
                  viewBox="0 0 100 120" 
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-[85%] w-auto z-0 opacity-30 dark:opacity-40"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--accent))" />
                      <stop offset="100%" stopColor="hsl(45, 80%, 45%)" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M50 5 L95 20 L95 55 C95 80 75 100 50 115 C25 100 5 80 5 55 L5 20 Z" 
                    fill="url(#shieldGradient)"
                    stroke="hsl(var(--accent))"
                    strokeWidth="2"
                  />
                  <path 
                    d="M50 25 L70 35 L70 55 C70 70 62 80 50 88 C38 80 30 70 30 55 L30 35 Z" 
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <text x="50" y="52" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{tenant.credentials?.warrantyYears || 3}</text>
                  <text x="50" y="66" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">YEAR</text>
                </svg>
                {/* Content on top */}
                <div className="relative z-10 flex flex-col justify-center h-full">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-wider">Peace of Mind</span>
                  </div>
                  <h3 className="font-display font-bold text-sm md:text-xl mb-1">{tenant.credentials?.warrantyYears || 3}-Year Warranty</h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground leading-snug max-w-[70%]">
                    Full coverage on labor & materials. We stand behind every project.
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-accent">
                    <span className="text-[9px] md:text-xs font-medium">Learn More</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 7. Testimonials Carousel */}
          <BentoItem colSpan={8} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-0 overflow-hidden h-full relative">
              <img 
                src={testimonialImage} 
                alt="Beautiful painted home" 
                className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-55 transition-opacity"
              />
              <CarouselView 
                slides={testimonials.map((t, i) => (
                  <div key={i} className="p-3 md:p-8 flex flex-col justify-between h-full min-w-[200px] md:min-w-[320px] relative z-10">
                    <div className="flex gap-0.5 md:gap-1 mb-2 md:mb-4">
                      {[...Array(5)].map((_, idx) => {
                        const fillPercent = Math.min(1, Math.max(0, t.rating - idx));
                        const isFull = fillPercent >= 1;
                        const isPartial = fillPercent > 0 && fillPercent < 1;
                        return (
                          <div key={idx} className="relative w-3 h-3 md:w-4 md:h-4">
                            <Star className="absolute inset-0 w-full h-full text-muted-foreground/30" />
                            {(isFull || isPartial) && (
                              <div 
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercent * 100}%` }}
                              >
                                <Star className="w-3 h-3 md:w-4 md:h-4 fill-accent text-accent" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <span className="ml-1 md:ml-2 text-[10px] md:text-sm text-muted-foreground">{t.rating}</span>
                    </div>
                    <p className="text-xs md:text-base text-foreground leading-snug md:leading-relaxed mb-2 md:mb-4 line-clamp-3 md:line-clamp-none font-bold">"{t.text}"</p>
                    <div>
                      <p className="font-bold text-xs md:text-sm">{t.author}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{t.loc}</p>
                    </div>
                  </div>
                ))} 
              />
            </GlassCard>
          </BentoItem>

          {/* 8. Service Area Map - Clickable */}
          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={2} mobileRowSpan={4}>
            <button 
              onClick={() => setServiceAreaOpen(true)}
              className="w-full h-full text-left"
              data-testid="button-service-area"
            >
              <GlassCard className="p-0 overflow-hidden relative group cursor-pointer hover:border-accent/40 transition-colors h-full">
                <img 
                  src={mapImage} 
                  alt={`${cityName} Service Area`}
                  className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ objectPosition: 'calc(100% + 80px) center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                <div className="absolute bottom-2 md:bottom-6 left-2 md:left-6 right-2 md:right-6">
                  <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                    <MapPin className="w-3 h-3 md:w-5 md:h-5 text-accent" />
                    <span className="text-[10px] md:text-sm font-bold text-accent uppercase tracking-wide">Service Areas</span>
                  </div>
                  <h3 className="text-sm md:text-2xl font-display font-bold mb-0.5 md:mb-2">{cityName} Metro</h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
                    Middle TN • Southern KY • Tap to explore
                  </p>
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* Crypto Payment Card */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            {tenant.id === 'npp' ? (
              <div
                className="w-full h-full text-left relative"
                data-testid="card-crypto-payment"
              >
                <GlassCard className="p-3 md:p-4 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 border-orange-500/20 transition-all h-full relative overflow-hidden" glow>
                  {/* Coming Soon Overlay - Only for NPP/beta */}
                  <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                    <div className="text-center">
                      <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">Coming Soon</span>
                    </div>
                  </div>
                {/* Bitcoin Watermark Background - Large & Centered */}
                <SiBitcoin className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 text-orange-400/25" />
                
                <div className="flex flex-col justify-between h-full relative z-10">
                  {/* Top: Icons + Badge */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2 flex-shrink-0">
                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-orange-500/30 flex items-center justify-center">
                          <SiBitcoin className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-400" />
                        </div>
                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                          <SiEthereum className="w-3.5 h-3.5 md:w-5 md:h-5 text-purple-400" />
                        </div>
                      </div>
                      <span className="text-[7px] md:text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded text-white font-bold">CRYPTO ACCEPTED</span>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="text-xs md:text-sm font-display font-bold leading-tight mb-0.5">
                      Pay with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">Crypto</span>
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground leading-snug">
                      Bitcoin, Ethereum & more
                    </p>
                  </div>
                  
                  {/* Bottom: CTA Arrow */}
                  <div className="flex justify-end mt-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  </div>
                </div>
              </GlassCard>
              </div>
            ) : (
              <button
                onClick={() => setCryptoModalOpen(true)}
                className="w-full h-full text-center"
                data-testid="button-crypto-payment"
              >
                <GlassCard className="p-3 md:p-4 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 border-orange-500/20 hover:border-orange-500/40 transition-all h-full relative overflow-hidden cursor-pointer" hoverEffect glow>
                  {/* Bitcoin Watermark Background - Large & Centered */}
                  <SiBitcoin className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 text-orange-400/25" />
                  
                  <div className="flex flex-col items-center justify-center h-full relative z-10">
                    {/* Icons + Badge - Centered */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2 flex-shrink-0">
                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-orange-500/30 flex items-center justify-center">
                          <SiBitcoin className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-400" />
                        </div>
                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                          <SiEthereum className="w-3.5 h-3.5 md:w-5 md:h-5 text-purple-400" />
                        </div>
                      </div>
                      <span className="text-[7px] md:text-[9px] px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded text-white font-bold">CRYPTO ACCEPTED</span>
                    </div>
                    
                    {/* Title & Description - Centered */}
                    <h3 className="text-xs md:text-sm font-display font-bold leading-tight mb-0.5">
                      Pay with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">Crypto</span>
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground leading-snug">
                      Bitcoin, Ethereum & more
                    </p>
                  </div>
                </GlassCard>
              </button>
            )}
          </BentoItem>

          {/* Fan Deck Visual - Opens Color Selector Modal */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2} className="relative group">
            <button 
              onClick={() => setColorSelectorOpen(true)}
              className="block h-full w-full text-left"
              data-testid="button-color-selector"
            >
              <GlassCard className="overflow-hidden cursor-pointer hover:border-accent/40 transition-colors h-full bg-card relative">
                <div className="absolute top-2 left-0 right-0 md:top-4 z-10 text-center">
                  <h3 className="text-xs md:text-sm font-display font-bold text-foreground">Color Palette</h3>
                </div>
                {/* Light mode: use color wheel with white bg, Dark mode: use fan deck */}
                <img 
                  src={colorWheelWhiteBg} 
                  alt="Color Selection - Click to explore paint colors" 
                  className="w-full h-full object-contain p-2 pt-6 md:p-8 md:pt-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 dark:hidden"
                />
                <img 
                  src={colorWheelNoBg} 
                  alt="Color Selection - Click to explore paint colors" 
                  className="hidden dark:block w-full h-full object-contain p-2 pt-6 md:p-8 md:pt-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
                />
                <div className="absolute bottom-2 left-0 right-0 md:bottom-4 z-10 text-center">
                  <p className="text-[10px] md:text-xs text-muted-foreground italic">Any Color You Like</p>
                </div>
              </GlassCard>
            </button>
          </BentoItem>

        </BentoGrid>
      </main>

      <ServiceAreaModal 
        isOpen={serviceAreaOpen} 
        onClose={() => setServiceAreaOpen(false)} 
      />
      <ColorSelectorModal
        isOpen={colorSelectorOpen}
        onClose={() => setColorSelectorOpen(false)}
      />
      <SolanaVerifiedModal
        isOpen={solanaVerifiedOpen}
        onClose={() => setSolanaVerifiedOpen(false)}
      />
      <DarkwaveVerifiedModal
        isOpen={darkwaveVerifiedOpen}
        onClose={() => setDarkwaveVerifiedOpen(false)}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
      <CryptoPaymentModal
        isOpen={cryptoModalOpen}
        onClose={() => setCryptoModalOpen(false)}
      />
      <AboutUsModal
        isOpen={aboutUsOpen}
        onClose={() => setAboutUsOpen(false)}
      />
      <FeatureModal
        open={materialsModalOpen}
        onOpenChange={setMaterialsModalOpen}
        type="materials"
      />
      <FeatureModal
        open={ontimeModalOpen}
        onOpenChange={setOntimeModalOpen}
        type="ontime"
      />
      <FeatureModal
        open={warrantyModalOpen}
        onOpenChange={setWarrantyModalOpen}
        type="warranty"
        warrantyYears={tenant.credentials?.warrantyYears || 3}
      />
      <PWAInstallPrompt />
      <MessagingWidget 
        currentUserId="visitor"
        currentUserRole="visitor"
        currentUserName="Visitor"
      />
      
      {/* Floating Layout Toggle for Demo - Visible to visitors */}
      {isDemo && (
        <div className="fixed bottom-14 left-4 z-40">
          <AnimatePresence>
            {layoutPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mb-2 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px]"
              >
                <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Preview Layouts
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleLayoutChange('bento')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      currentLayout === 'bento' || (!currentLayout && isDemo)
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    data-testid="button-demo-layout-bento"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Bento Grid
                  </button>
                  <button
                    onClick={() => handleLayoutChange('minimalist')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      currentLayout === 'minimalist'
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    data-testid="button-demo-layout-minimalist"
                  >
                    <Rows className="w-4 h-4" />
                    Minimalist
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 leading-tight">
                  See how your site could look with different layouts
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setLayoutPanelOpen(!layoutPanelOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 transition-colors text-sm font-medium"
            data-testid="button-layout-toggle"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Layouts</span>
          </button>
        </div>
      )}

      {/* Investor Snapshot Button - Available on demo homepage */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setInvestorSnapshotOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:from-green-700 hover:to-emerald-700 transition-colors text-sm font-medium"
          data-testid="button-investor-snapshot"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Investor Info</span>
        </button>
      </div>

      {/* Investor Snapshot Modal */}
      <InvestorSnapshotModal 
        isOpen={investorSnapshotOpen} 
        onClose={() => setInvestorSnapshotOpen(false)} 
      />
    </PageLayout>
  );
}
