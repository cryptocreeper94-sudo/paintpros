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

export default function Home() {
  const testimonials = [
    {
      text: "Absolutely transformed our home. The team was punctual, polite, and the lines are razor sharp. Worth every penny.",
      author: "Sarah Jenkins",
      loc: "Brentwood, TN",
      rating: 4.9
    },
    {
      text: "Best painting crew we've ever hired. They finished ahead of schedule and left the place cleaner than they found it.",
      author: "Michael Ross",
      loc: "Franklin, TN",
      rating: 5.0
    },
    {
      text: "Professional from the first quote to the final walk-through. Highly recommend for any commercial work.",
      author: "David Chen",
      loc: "Nashville, TN",
      rating: 4.8
    }
  ];

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8">
        <BentoGrid>
          
          {/* 1. Hero Section - Main Headline */}
          <BentoItem colSpan={8} rowSpan={2} className="relative group">
            <GlassCard className="p-6 md:p-12 flex flex-col justify-center items-start overflow-hidden border-white/20 min-h-[500px] md:min-h-0">
              <div 
                className="absolute inset-0 bg-cover bg-center z-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${heroBg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-0" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  Nashville's #1 Rated
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 text-glow">
                  Extraordinary <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">
                    Craftsmanship.
                  </span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-md leading-relaxed">
                  We don't just paint walls; we curate environments. Experience the highest standard of residential and commercial painting in Nashville.
                </p>
                <div className="flex gap-4">
                  <FlipButton>
                    View Portfolio <ArrowRight className="w-4 h-4" />
                  </FlipButton>
                </div>
              </div>

              {/* Floating Element 1 - Adjusted for Mobile */}
              <img 
                src={paintBrush} 
                alt="Brush" 
                className="absolute -right-20 -bottom-10 w-[250px] md:w-[400px] md:-right-10 md:-bottom-20 h-auto object-contain z-10 opacity-90 drop-shadow-2xl rotate-[-15deg] transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:translate-x-2 pointer-events-none"
              />
            </GlassCard>
          </BentoItem>

          {/* 2. CTA Card - High Contrast */}
          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="bg-accent/10 border-accent/20 flex flex-col justify-between p-8 group min-h-[200px]" glow>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Free Estimate</h3>
                <p className="text-sm text-muted-foreground">
                  Get a detailed, transparent quote within 24 hours. No hidden fees.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <button className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(197,160,89,0.5)]">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
              <ShieldCheck className="absolute top-4 right-4 w-24 h-24 text-accent/5 -rotate-12" />
            </GlassCard>
          </BentoItem>

          {/* 3. Social Proof - Marquee */}
          <BentoItem colSpan={4} rowSpan={1}>
            <GlassCard className="flex flex-col justify-center p-0 bg-black/5 dark:bg-white/5 min-h-[120px]">
              <div className="px-6 pt-4 pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">As Seen In</span>
              </div>
              <Marquee 
                items={["The Spruce", "Homes & Gardens", "Livingetc", "The Kitchn", "Architectural Digest"]} 
                speed="slow"
                className="opacity-70"
              />
            </GlassCard>
          </BentoItem>

          {/* 4. The Process Cluster */}
          <BentoItem colSpan={6} rowSpan={2} className="relative overflow-hidden">
            <GlassCard className="p-8">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">Our Process</h2>
                  <p className="text-muted-foreground">Systematic perfection in 4 steps.</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                   <Clock className="w-5 h-5 text-accent" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {[
                  { step: "01", title: "Consult", desc: "Vision & Color" },
                  { step: "02", title: "Prep", desc: "Protect & Prime" },
                  { step: "03", title: "Paint", desc: "Precision Application" },
                  { step: "04", title: "Clean", desc: "Spotless Finish" },
                ].map((item) => (
                  <div key={item.step} className="p-4 rounded-lg bg-background/40 border border-white/5 hover:bg-background/60 transition-colors">
                    <span className="text-xs font-mono text-accent mb-1 block">{item.step}</span>
                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Decoration */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            </GlassCard>
          </BentoItem>

          {/* 5. Testimonial - Horizontal Scroll Carousel */}
          <BentoItem colSpan={6} rowSpan={1}>
            <GlassCard className="p-0 flex items-center relative overflow-hidden">
               <img 
                src={fanDeck} 
                alt="Colors" 
                className="absolute -left-16 -top-16 w-48 h-auto object-contain z-0 opacity-20 rotate-45 blur-[2px] pointer-events-none"
              />
              <div className="relative z-10 w-full h-full">
                <CarouselView 
                  className="h-full"
                  slideClassName="h-full"
                  slides={testimonials.map((t, i) => (
                    <div key={i} className="p-8 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-1 mb-4">
                        {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-accent text-accent" />)}
                        <span className="ml-2 text-sm font-bold text-foreground">{t.rating}/5 Google Reviews</span>
                      </div>
                      <blockquote className="text-lg md:text-xl font-display italic text-foreground/90 leading-relaxed mb-4">
                        "{t.text}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/50" />
                        <div>
                          <p className="text-sm font-bold">{t.author}</p>
                          <p className="text-xs text-muted-foreground">{t.loc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                />
              </div>
            </GlassCard>
          </BentoItem>

          {/* 6. Service Area / Map Placeholder */}
          <BentoItem colSpan={6} rowSpan={1}>
             <GlassCard className="p-0 overflow-hidden group relative">
               <div className="absolute inset-0 z-0">
                  <img 
                    src={mapImage} 
                    alt="Service Area Map" 
                    className="w-full h-full object-cover opacity-60 grayscale-[50%] sepia-[20%] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
               </div>
               
               {/* Map Markers Overlay - Decorative */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full p-8 z-10 pointer-events-none">
                  {/* Nashville Center */}
                  <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-accent rounded-full animate-ping absolute inset-0" />
                    <div className="w-3 h-3 bg-accent rounded-full relative border-2 border-white shadow-lg" />
                  </div>
                  {/* Brentwood */}
                  <div className="absolute top-[60%] left-[50%]">
                    <div className="w-2 h-2 bg-white/80 rounded-full" />
                  </div>
                   {/* Franklin */}
                  <div className="absolute top-[70%] left-[45%]">
                    <div className="w-2 h-2 bg-white/80 rounded-full" />
                  </div>
               </div>

               <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-accent/20 rounded-md backdrop-blur-md border border-accent/30">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-accent text-xs font-bold uppercase tracking-wider">Service Area</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">Greater Nashville</h3>
                  <div className="flex flex-wrap gap-2 text-white/80 text-sm">
                    <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/5">Brentwood</span>
                    <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/5">Franklin</span>
                    <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/5">Belle Meade</span>
                    <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/5">Green Hills</span>
                  </div>
               </div>
             </GlassCard>
          </BentoItem>

        </BentoGrid>
      </main>
    </PageLayout>
  );
}