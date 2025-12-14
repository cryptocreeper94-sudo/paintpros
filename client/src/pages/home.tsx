import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { LogoFlipCard } from "@/components/ui/logo-flip-card";
import { FlipButton } from "@/components/ui/flip-button";
import { CarouselView } from "@/components/ui/carousel-view";
import { ArrowRight, Star, Brush, ShieldCheck, Clock, CheckCircle2, MapPin, ChevronDown, BadgeCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import heroBg from "@assets/generated_images/abstract_army_green_dark_texture_with_gold_accents.png";
import paintBrush from "@assets/generated_images/isolated_professional_paint_brush.png";
import fanDeck from "@assets/generated_images/isolated_paint_color_fan_deck.png";
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import estimateImage from "@assets/generated_images/painter_consulting_homeowner_estimate.png";
import premiumMaterialsImage from "@assets/generated_images/premium_paint_materials_display.png";
import onTimeImage from "@assets/generated_images/on-time_punctuality_clock.png";
import warrantyImage from "@assets/generated_images/warranty_shield_certificate_badge.png";
import testimonialImage from "@assets/generated_images/freshly_painted_home_interior.png";
import solanaLogo from "@assets/solana-logo-transparent.png";
import googleRatingImage from "@assets/generated_images/five_star_google_rating.png";
import { useTenant } from "@/context/TenantContext";
import { ServiceAreaModal } from "@/components/service-area-modal";
import { ColorSelectorModal } from "@/components/color-selector-modal";
import { SolanaVerifiedModal } from "@/components/solana-verified-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ContactModal } from "@/components/contact-modal";
import { CryptoPaymentModal } from "@/components/crypto-payment-modal";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import bitcoinWatermark from "@assets/generated_images/golden_bitcoin_cryptocurrency_symbol.png";

export default function Home() {
  const tenant = useTenant();
  const [serviceAreaOpen, setServiceAreaOpen] = useState(false);
  const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
  const [solanaVerifiedOpen, setSolanaVerifiedOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [cryptoModalOpen, setCryptoModalOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
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
      <main className="pt-1 md:pt-4 px-2 md:px-8">
        <BentoGrid>
          
          {/* 1. Hero Section - Main Headline */}
          <BentoItem colSpan={8} rowSpan={2} mobileColSpan={4} mobileRowSpan={4} className="relative group">
            <GlassCard className="p-3 md:p-12 flex flex-col justify-center items-start overflow-hidden border-white/20 h-full">
              <div 
                className="absolute inset-0 bg-center z-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${heroBg})`, backgroundSize: '300%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-0" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-accent/20 border border-accent/30 text-white text-[9px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-6 backdrop-blur-md">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {ratingBadge}
                </div>
                <h1 className="text-lg md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-1 md:mb-6 text-glow">
                  Extraordinary <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-700 dark:to-white">
                    Craftsmanship.
                  </span>
                </h1>
                <p className="text-[10px] md:text-xl text-cyan-700 dark:text-cyan-700 font-semibold mb-2 md:mb-8 max-w-md leading-snug md:leading-relaxed drop-shadow-lg">
                  {tenant.description || `Premium residential and commercial painting.`}
                </p>
                <a href="/portfolio" className="inline-block">
                  <FlipButton>
                    View Portfolio <ArrowRight className="w-4 h-4" />
                  </FlipButton>
                </a>
              </div>

              {/* Floating Element 1 - Hidden on mobile to avoid text overlap */}
              <img 
                src={paintBrush} 
                alt="Brush" 
                className="hidden md:block absolute -right-10 -bottom-20 w-[400px] h-auto object-contain z-[5] opacity-90 drop-shadow-2xl rotate-[-15deg] transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:translate-x-2 pointer-events-none"
              />
            </GlassCard>
          </BentoItem>

          {/* 2. CTA Card - High Contrast */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <a href="/estimate" className="block h-full" data-testid="link-free-estimate-card">
              <GlassCard className="bg-accent/10 border-accent/20 relative p-3 md:p-8 group h-full cursor-pointer hover:border-accent/40 transition-colors overflow-hidden" glow>
                <div className="relative z-10">
                  <h3 className="text-sm md:text-2xl font-display font-bold mb-0.5 md:mb-1">Free Estimates</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground pr-8">
                    Use our instant calculator to get a custom quote for your painting project in seconds.
                  </p>
                </div>
                <img 
                  src={estimateImage} 
                  alt="Professional estimate consultation" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                />
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
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <button
              onClick={() => setSolanaVerifiedOpen(true)}
              className="w-full h-full text-left"
              data-testid="button-solana-verified"
            >
              <GlassCard 
                className="p-3 md:p-4 cursor-pointer hover:border-[#14F195]/40 transition-all h-full bg-gradient-to-br from-[#9945FF]/10 via-[#14F195]/5 to-[#9945FF]/10 border-[#14F195]/30 relative overflow-hidden"
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

          {/* 4. Key Feature 1 - Premium Materials (Expandable) */}
          <BentoItem colSpan={4} rowSpan={expandedCard === 'materials' ? 2 : 1} mobileColSpan={2} mobileRowSpan={expandedCard === 'materials' ? 3 : 1}>
            <button 
              onClick={() => toggleCard('materials')} 
              className="w-full h-full text-left"
              data-testid="button-premium-materials"
            >
              <GlassCard className="p-2 md:p-6 flex flex-col h-full cursor-pointer hover:border-accent/40 transition-all relative overflow-hidden" hoverEffect>
                <img 
                  src={premiumMaterialsImage} 
                  alt="Premium paint materials" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity"
                />
                <div className="flex items-center gap-2 md:gap-4 relative z-10">
                  <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                    <Brush className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs md:text-lg">Premium Materials</h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">Top-tier paints and finishes only.</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCard === 'materials' ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedCard === 'materials' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[10px] md:text-xs text-muted-foreground">We partner with industry-leading brands:</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 bg-accent/10 rounded text-[9px] md:text-xs text-accent font-medium">Sherwin-Williams</span>
                          <span className="px-2 py-0.5 bg-accent/10 rounded text-[9px] md:text-xs text-accent font-medium">Benjamin Moore</span>
                        </div>
                        <p className="text-[9px] md:text-xs text-muted-foreground leading-relaxed">
                          Premium paints with superior coverage, durability, and color retention. Low-VOC options available for eco-conscious homes.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 5. Key Feature 2 - On-Time (Expandable) */}
          <BentoItem colSpan={4} rowSpan={expandedCard === 'ontime' ? 2 : 1} mobileColSpan={2} mobileRowSpan={expandedCard === 'ontime' ? 3 : 1}>
            <button 
              onClick={() => toggleCard('ontime')} 
              className="w-full h-full text-left"
              data-testid="button-on-time"
            >
              <GlassCard className="p-2 md:p-6 flex flex-col h-full cursor-pointer hover:border-accent/40 transition-all relative overflow-hidden" hoverEffect>
                <img 
                  src={onTimeImage} 
                  alt="On-time service" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity"
                />
                <div className="flex items-center gap-2 md:gap-4 relative z-10">
                  <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                    <Clock className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs md:text-lg">On-Time</h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">We value your time.</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCard === 'ontime' ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedCard === 'ontime' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Our scheduling promise:</p>
                        <ul className="space-y-1 text-[9px] md:text-xs text-muted-foreground">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            Same-day arrival windows
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            Real-time project updates
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            Guaranteed completion dates
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 6. Key Feature 3 - Warranty (Expandable) */}
          <BentoItem colSpan={4} rowSpan={expandedCard === 'warranty' ? 2 : 1} mobileColSpan={4} mobileRowSpan={expandedCard === 'warranty' ? 2 : 1}>
            <button 
              onClick={() => toggleCard('warranty')} 
              className="w-full h-full text-left"
              data-testid="button-warranty"
            >
              <GlassCard className="p-2 md:p-6 flex flex-col h-full cursor-pointer hover:border-accent/40 transition-all relative overflow-hidden" hoverEffect>
                <img 
                  src={warrantyImage} 
                  alt="Warranty guarantee" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 transition-opacity"
                />
                <div className="flex items-center gap-2 md:gap-4 relative z-10">
                  <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs md:text-lg">{tenant.credentials?.warrantyYears || 3}-Year Warranty</h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">Full coverage on our workmanship.</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedCard === 'warranty' ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedCard === 'warranty' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden relative z-10"
                    >
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Our commitment to quality:</p>
                        <ul className="space-y-1 text-[9px] md:text-xs text-muted-foreground">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            Full workmanship coverage
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            Free touch-ups & repairs
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                            100% satisfaction guarantee
                          </li>
                        </ul>
                        <p className="text-[9px] md:text-xs text-muted-foreground/70 italic">
                          We stand behind every project. If you're not completely satisfied, we'll make it right.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </button>
          </BentoItem>

          {/* 7. Testimonials Carousel */}
          <BentoItem colSpan={8} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-0 overflow-hidden h-full relative">
              <img 
                src={testimonialImage} 
                alt="Beautiful painted home" 
                className="absolute inset-0 w-full h-full object-cover opacity-15 transition-opacity"
              />
              <CarouselView 
                slides={testimonials.map((t, i) => (
                  <div key={i} className="p-3 md:p-8 flex flex-col justify-between h-full min-w-[200px] md:min-w-[320px] relative z-10">
                    <div className="flex gap-0.5 md:gap-1 mb-2 md:mb-4">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className={`w-3 h-3 md:w-4 md:h-4 ${idx < Math.floor(t.rating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                      ))}
                      <span className="ml-1 md:ml-2 text-[10px] md:text-sm text-muted-foreground">{t.rating}</span>
                    </div>
                    <p className="text-xs md:text-base text-foreground leading-snug md:leading-relaxed mb-2 md:mb-4 line-clamp-3 md:line-clamp-none">"{t.text}"</p>
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
          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={2} mobileRowSpan={3}>
            <button 
              onClick={() => setServiceAreaOpen(true)}
              className="w-full h-full text-left"
              data-testid="button-service-area"
            >
              <GlassCard className="p-0 overflow-hidden relative group cursor-pointer hover:border-accent/40 transition-colors h-full">
                <img 
                  src={mapImage} 
                  alt={`${cityName} Service Area`}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
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

          {/* About/Contact Card - Demo: Configurable Platform, NPP: About Us */}
          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={2} mobileRowSpan={3}>
            <GlassCard className="p-4 md:p-6 flex flex-col justify-between h-full border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              {isDemo ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-wider">White-Label Solution</span>
                    </div>
                    <h3 className="text-sm md:text-xl font-display font-bold mb-2">Fully Configurable</h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed mb-3">
                      Everything you see is customizable — branding, colors, services, pricing, and features. Built to fit <span className="text-accent font-medium">your business</span>, not the other way around.
                    </p>
                    <ul className="space-y-1.5 text-[9px] md:text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        Your logo, colors & branding
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        Custom pricing & service areas
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        Solana blockchain verification
                      </li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setContactOpen(true)}
                    className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors text-xs md:text-sm"
                    data-testid="button-contact-demo"
                  >
                    Contact Us <ArrowRight className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                      </div>
                      <span className="text-[10px] md:text-xs font-bold text-accent uppercase tracking-wider">About Us</span>
                    </div>
                    <h3 className="text-sm md:text-xl font-display font-bold mb-2">{tenant.name}</h3>
                    <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed mb-3">
                      Family-owned and operated since 2015, we've been transforming homes and businesses across Middle Tennessee with premium craftsmanship and unmatched attention to detail.
                    </p>
                    <ul className="space-y-1.5 text-[9px] md:text-xs text-muted-foreground">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        Licensed & Insured
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        {tenant.credentials?.warrantyYears || 3}-Year Workmanship Warranty
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        500+ Projects Completed
                      </li>
                    </ul>
                  </div>
                  <a 
                    href="/about" 
                    className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors text-xs md:text-sm"
                    data-testid="link-about-npp"
                  >
                    Learn More <ArrowRight className="w-3 h-3" />
                  </a>
                </>
              )}
            </GlassCard>
          </BentoItem>

          {/* 9. Google Rating */}
          {tenant.credentials?.googleRating && (
            <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
              <a 
                href={tenant.social?.googleReviews || "https://www.google.com/maps"}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
                data-testid="link-google-reviews"
              >
                <GlassCard className="p-2 md:p-8 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 cursor-pointer hover:border-accent/40 transition-colors h-full relative overflow-hidden" glow>
                  <img 
                    src={googleRatingImage} 
                    alt="Five star rating" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div className="flex items-center gap-2 md:gap-4 h-full relative z-10">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 md:w-6 md:h-6 ${i < Math.floor(tenant.credentials?.googleRating || 0) ? "fill-accent text-accent" : "text-accent/30"}`} />
                      ))}
                    </div>
                    <div>
                      <p className="text-lg md:text-3xl font-bold font-display text-accent">{tenant.credentials.googleRating}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Google</p>
                    </div>
                  </div>
                </GlassCard>
              </a>
            </BentoItem>
          )}

          {/* 10. Fan Deck Visual - Opens Color Selector Modal - Bottom Left */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2} className="relative group">
            <button 
              onClick={() => setColorSelectorOpen(true)}
              className="block h-full w-full text-left"
              data-testid="button-color-selector"
            >
              <GlassCard className="overflow-hidden cursor-pointer hover:border-accent/40 transition-colors h-full">
                <img 
                  src={fanDeck} 
                  alt="Color Selection - Click to explore paint colors" 
                  className="w-full h-full object-contain p-2 md:p-8 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
                />
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 text-[10px] md:text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Colors
                </div>
              </GlassCard>
            </button>
          </BentoItem>

          {/* Crypto Payment Banner - Full Width Horizontal at Bottom */}
          <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <button
              onClick={() => setCryptoModalOpen(true)}
              className="w-full h-full text-left"
              data-testid="button-crypto-payment"
            >
              <GlassCard className="p-3 md:p-4 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 border-orange-500/20 hover:border-orange-500/40 transition-all h-full relative overflow-hidden cursor-pointer" hoverEffect glow>
                {/* Bitcoin Watermark Background - Right side */}
                <img 
                  src={bitcoinWatermark} 
                  alt="" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 object-contain opacity-20"
                />
                
                {/* Horizontal Layout */}
                <div className="flex flex-row items-center gap-3 md:gap-6 h-full relative z-10">
                  {/* Left: Icons */}
                  <div className="flex -space-x-2 flex-shrink-0">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-orange-500/30 flex items-center justify-center">
                      <SiBitcoin className="w-4 h-4 md:w-6 md:h-6 text-orange-400" />
                    </div>
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                      <SiEthereum className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
                    </div>
                  </div>
                  
                  {/* Center: Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5 md:mb-1">
                      <span className="text-[8px] md:text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded text-white font-bold flex-shrink-0">CRYPTO ACCEPTED</span>
                      <h3 className="text-sm md:text-lg font-display font-bold">
                        The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">Payments</span>
                      </h3>
                    </div>
                    <p className="text-[9px] md:text-xs text-muted-foreground leading-snug hidden md:block">
                      Pay for your painting project with Bitcoin, Ethereum, and other cryptocurrencies. Instant, secure, no bank delays.
                    </p>
                  </div>
                  
                  {/* Right: Features (desktop) & CTA */}
                  <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                    {/* Features - hidden on mobile */}
                    <div className="hidden lg:flex items-center gap-4 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        <span>Instant & Secure</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        <span>No Bank Fees</span>
                      </div>
                    </div>
                    
                    {/* CTA Arrow */}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
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
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
      <CryptoPaymentModal
        isOpen={cryptoModalOpen}
        onClose={() => setCryptoModalOpen(false)}
      />
      <PWAInstallPrompt />
    </PageLayout>
  );
}
