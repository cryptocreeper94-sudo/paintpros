import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, Award, Heart, CheckCircle2, MapPin, Phone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import serviceAreaMapNpp from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import serviceAreaMapLume from "@assets/generated_images/lume_service_area_map_elegant_bw.png";

export default function About() {
  const tenant = useTenant();
  const cityName = tenant.address?.city || "Our Community";
  const serviceAreaMap = tenant.id === "lume" ? serviceAreaMapLume : serviceAreaMapNpp;
  const warrantyYears = tenant.credentials?.warrantyYears || 3;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const stats = [
    { icon: Users, value: "500+", label: "Homes Transformed" },
    { icon: Award, value: `${tenant.credentials?.yearsInBusiness || "15+"}+`, label: "Years Experience" },
    { icon: CheckCircle2, value: `${warrantyYears}yr`, label: "Warranty" },
  ];

  const values = [
    { icon: Heart, title: `${cityName} Proud`, desc: "Locally owned and operated. We're your neighbors." },
    { icon: CheckCircle2, title: "Quality First", desc: "Full-time, vetted artisans - not subcontractors." },
    { icon: Award, title: "Guaranteed", desc: "We stand behind our work. No questions asked." },
  ];

  return (
    <PageLayout>
      <main className="pt-20 pb-16 px-3 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-2">Our Story</h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              Founded on integrity, craftsmanship, and community.
            </p>
          </div>

          {/* Stats Row - Always 3 columns */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
            {stats.map((stat) => (
              <GlassCard key={stat.label} className="p-3 md:p-4 text-center">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-accent mx-auto mb-1" />
                <p className="text-lg md:text-2xl font-bold font-display">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Main Story */}
          <GlassCard className="p-4 md:p-6 mb-4">
            <h2 className="text-lg md:text-xl font-bold mb-3">More Than Just Painters</h2>
            <div className="space-y-3 text-sm md:text-base text-muted-foreground">
              <p>
                {tenant.name} started with a simple mission: to bring professionalism to the trade that was sorely missing. We believe inviting someone into your home is an act of trust.
              </p>
              <p>
                Our team consists of full-time, vetted artisans—not subcontractors. We invest in their training, tools, and futures, which translates directly to the quality of work in your home.
              </p>
            </div>
          </GlassCard>

          {/* Values - Mobile carousel, Desktop grid */}
          <div className="md:hidden mb-4">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-2">
                {values.map((value) => (
                  <div key={value.title} className="flex-[0_0_80%] min-w-0">
                    <GlassCard className="p-4 h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <value.icon className="w-5 h-5 text-accent" />
                        <h3 className="font-bold text-sm">{value.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{value.desc}</p>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <button onClick={scrollPrev} className="p-2 rounded-full bg-muted" data-testid="button-values-prev">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={scrollNext} className="p-2 rounded-full bg-muted" data-testid="button-values-next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-3 gap-4 mb-4">
            {values.map((value) => (
              <GlassCard key={value.title} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <value.icon className="w-5 h-5 text-accent" />
                  <h3 className="font-bold">{value.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Service Area Map */}
          <GlassCard className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-accent" />
              <h3 className="font-bold">Service Area</h3>
            </div>
            <div className="rounded-lg overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              <img 
                src={serviceAreaMap} 
                alt={`${cityName} and surrounding areas service map`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Proudly serving {cityName} and surrounding communities
            </p>
          </GlassCard>

          {/* CTA */}
          <Link href="/estimate">
            <GlassCard className="p-4 bg-gradient-to-br from-accent/20 to-transparent">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold mb-1">Ready to transform your space?</h3>
                  <p className="text-sm text-muted-foreground">Get your free estimate today.</p>
                </div>
                <Button className="w-full md:w-auto" data-testid="button-about-estimate">
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
