import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Marquee } from "@/components/ui/marquee";
import { FlipButton } from "@/components/ui/flip-button";
import { CarouselView } from "@/components/ui/carousel-view";
import { ArrowRight, Star, Brush, ShieldCheck, Clock, CheckCircle2, MapPin } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_army_green_dark_texture_with_gold_accents.png";
import paintBrush from "@assets/generated_images/isolated_professional_paint_brush.png";
import fanDeck from "@assets/generated_images/isolated_paint_color_fan_deck.png";
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import { useTenant } from "@/context/TenantContext";
import { ServiceAreaModal } from "@/components/service-area-modal";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export default function Home() {
  const tenant = useTenant();
  const [serviceAreaOpen, setServiceAreaOpen] = useState(false);
  
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

  return (
    <PageLayout>
      <main className="pt-12 md:pt-24 px-2 md:px-8">
        <BentoGrid>
          
          {/* 1. Hero Section - Main Headline */}
          <BentoItem colSpan={8} rowSpan={2} mobileColSpan={4} mobileRowSpan={4} className="relative group">
            <GlassCard className="p-4 md:p-12 flex flex-col justify-center items-start overflow-hidden border-white/20 h-full">
              <div 
                className="absolute inset-0 bg-center z-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${heroBg})`, backgroundSize: '300%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-0" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {ratingBadge}
                </div>
                <h1 className="text-2xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-2 md:mb-6 text-glow">
                  Extraordinary <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
                    Craftsmanship.
                  </span>
                </h1>
                <p className="text-sm md:text-xl text-cyan-400 font-semibold mb-4 md:mb-8 max-w-md leading-relaxed drop-shadow-lg line-clamp-2 md:line-clamp-none">
                  {tenant.description || `Premium residential and commercial painting.`}
                </p>
                <div className="flex gap-4">
                  <FlipButton>
                    View Portfolio <ArrowRight className="w-4 h-4" />
                  </FlipButton>
                </div>
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
              <GlassCard className="bg-accent/10 border-accent/20 flex flex-col justify-between p-3 md:p-8 group h-full cursor-pointer hover:border-accent/40 transition-colors" glow>
                <div>
                  <h3 className="text-sm md:text-2xl font-display font-bold mb-0.5 md:mb-1">Free Estimates</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2">
                    Get your quote instantly!
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-accent text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(197,160,89,0.5)]">
                    <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </div>
              </GlassCard>
            </a>
          </BentoItem>

          {/* 3. Social Proof - Marquee */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <GlassCard className="flex flex-col justify-center p-0 bg-black/5 dark:bg-white/5 h-full overflow-hidden">
              <div className="px-3 md:px-6 pt-2 md:pt-4 pb-1 md:pb-2">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/70">As Seen In</span>
              </div>
              <Marquee 
                items={["The Spruce", "Homes & Gardens", "Livingetc", "The Kitchn", "Architectural Digest"]} 
                speed="slow"
              />
            </GlassCard>
          </BentoItem>

          {/* 4. Key Feature 1 */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <GlassCard className="p-2 md:p-8 flex items-center gap-2 md:gap-6 h-full" hoverEffect>
              <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                <Brush className="w-4 h-4 md:w-8 md:h-8 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-lg truncate">Premium Materials</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">Top-tier paints and finishes only.</p>
              </div>
            </GlassCard>
          </BentoItem>

          {/* 5. Key Feature 2 */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
            <GlassCard className="p-2 md:p-8 flex items-center gap-2 md:gap-6 h-full" hoverEffect>
              <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                <Clock className="w-4 h-4 md:w-8 md:h-8 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-lg truncate">On-Time</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">We value your time.</p>
              </div>
            </GlassCard>
          </BentoItem>

          {/* 6. Key Feature 3 */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
            <GlassCard className="p-2 md:p-8 flex items-center gap-2 md:gap-6 h-full" hoverEffect>
              <div className="bg-accent/10 p-1.5 md:p-3 rounded-lg md:rounded-xl flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 md:w-8 md:h-8 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs md:text-lg">{tenant.credentials?.warrantyYears || 3}-Year Warranty</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">Full coverage on our workmanship.</p>
              </div>
            </GlassCard>
          </BentoItem>

          {/* 7. Testimonials Carousel */}
          <BentoItem colSpan={8} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-0 overflow-hidden h-full">
              <CarouselView 
                slides={testimonials.map((t, i) => (
                  <div key={i} className="p-3 md:p-8 flex flex-col justify-between h-full min-w-[200px] md:min-w-[320px]">
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

          {/* 9. Google Rating */}
          {tenant.credentials?.googleRating && (
            <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
              <a 
                href={tenant.social?.googleReviews || "https://www.google.com/maps"}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
                data-testid="link-google-reviews"
              >
                <GlassCard className="p-2 md:p-8 bg-gradient-to-br from-accent/10 to-transparent border-accent/20 cursor-pointer hover:border-accent/40 transition-colors h-full" glow>
                  <div className="flex items-center gap-2 md:gap-4 h-full">
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

          {/* 10. Fan Deck Visual - Links to Sherwin Williams Color Selector */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2} className="relative group">
            <a 
              href="https://www.sherwin-williams.com/visualizer/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block h-full"
              data-testid="link-sherwin-williams-color-selector"
            >
              <GlassCard className="overflow-hidden cursor-pointer hover:border-accent/40 transition-colors h-full">
                <img 
                  src={fanDeck} 
                  alt="Color Selection - Click to explore Sherwin Williams colors" 
                  className="w-full h-full object-contain p-2 md:p-8 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
                />
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 text-[10px] md:text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Colors
                </div>
              </GlassCard>
            </a>
          </BentoItem>

        </BentoGrid>
      </main>

      <ServiceAreaModal 
        isOpen={serviceAreaOpen} 
        onClose={() => setServiceAreaOpen(false)} 
      />
      <PWAInstallPrompt />
    </PageLayout>
  );
}
