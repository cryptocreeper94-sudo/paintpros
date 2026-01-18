import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Palette, 
  Shield, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Paintbrush,
  Clock,
  Droplets,
  Home,
  Building2,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

export default function Resources() {
  const tenant = useTenant();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const allResources = [
    { name: "Color Library", desc: "Professional paint colors", href: "/colors", icon: Palette, color: "text-pink-500", bg: "bg-pink-500/20" },
    { name: "Instant Estimate", desc: "AI-powered quotes", href: "/estimate", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/20" },
    { name: "Painting Glossary", desc: "A-Z terminology guide", href: "/glossary", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/20" },
    { name: "Terms & Warranty", desc: `${tenant.credentials?.warrantyYears || 3}-year guarantee`, href: "/terms", icon: Shield, color: "text-green-500", bg: "bg-green-500/20" },
    { name: "Services", desc: "Interior & Exterior", href: "/services", icon: Home, color: "text-orange-500", bg: "bg-orange-500/20" },
    { name: "Help Center", desc: "FAQs & support", href: "/help", icon: HelpCircle, color: "text-cyan-500", bg: "bg-cyan-500/20" },
  ];

  const sheenGuide = [
    { name: "Flat/Matte", desc: "No shine, hides imperfections", durability: 1, use: "Ceilings" },
    { name: "Eggshell", desc: "Subtle sheen, easy to clean", durability: 2, use: "Living rooms" },
    { name: "Satin", desc: "Soft luster, very washable", durability: 3, use: "Kitchens/baths" },
    { name: "Semi-Gloss", desc: "Reflective and durable", durability: 4, use: "Trim/doors" },
    { name: "High-Gloss", desc: "Maximum shine", durability: 5, use: "Accents" },
  ];

  const quickTips = [
    { icon: Paintbrush, title: "Surface Prep", desc: "Clean, sand, and prime for best results" },
    { icon: Droplets, title: "Sheen Matters", desc: "Higher sheen = more durable & washable" },
    { icon: Clock, title: "Dry Times", desc: "Wait 4+ hours between coats" },
  ];

  return (
    <PageLayout>
      <main className="pt-20 pb-16 px-3 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm mb-3">
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Resources</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Everything you need for your painting project.
            </p>
          </div>

          {/* Quick Links - Mobile: Carousel, Desktop: Grid */}
          <div className="md:hidden mb-6">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-2">
                {allResources.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div className="flex-[0_0_75%] min-w-0">
                      <GlassCard className="p-4 h-full">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      </GlassCard>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <button onClick={scrollPrev} className="p-2 rounded-full bg-muted" data-testid="button-resources-prev">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={scrollNext} className="p-2 rounded-full bg-muted" data-testid="button-resources-next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-3 gap-3 mb-6">
            {allResources.map((item) => (
              <Link key={item.name} href={item.href}>
                <GlassCard className="p-4 h-full cursor-pointer group" data-testid={`card-resource-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-accent transition-colors flex items-center gap-1">
                        {item.name}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          {/* Quick Tips - 3 columns */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
            {quickTips.map((tip) => (
              <GlassCard key={tip.title} className="p-3 md:p-4 text-center">
                <tip.icon className="w-6 h-6 md:w-8 md:h-8 text-accent mx-auto mb-2" />
                <h3 className="text-xs md:text-sm font-medium mb-1">{tip.title}</h3>
                <p className="text-xs text-muted-foreground hidden md:block">{tip.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Paint Sheens Guide */}
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-accent" />
              <h2 className="font-bold">Paint Sheens Guide</h2>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sheenGuide.map((sheen) => (
                <div key={sheen.name} className="text-center p-2 rounded-lg bg-white/5">
                  <p className="text-xs md:text-sm font-medium mb-1">{sheen.name}</p>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level}
                        className={`w-2 h-2 rounded-full ${level <= sheen.durability ? 'bg-accent' : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground hidden md:block">{sheen.use}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Higher rating = more durable and washable
            </p>
          </GlassCard>

          {/* Glossary CTA */}
          <Link href="/glossary">
            <GlassCard className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-indigo-400" />
                  <div>
                    <h3 className="font-bold">Painting Glossary</h3>
                    <p className="text-sm text-muted-foreground">100+ terms explained - from Adhesion to Wainscoting</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </GlassCard>
          </Link>

          {/* CTA */}
          <Link href="/estimate">
            <GlassCard className="p-4 bg-gradient-to-br from-accent/20 to-transparent">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold mb-1">Know Your Price in Seconds</h3>
                  <p className="text-sm text-muted-foreground">AI-powered instant quotes</p>
                </div>
                <Button className="w-full md:w-auto" data-testid="button-resources-estimate">
                  Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </GlassCard>
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}
