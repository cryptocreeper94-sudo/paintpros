import { Link } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Home, 
  Building2, 
  MapPin,
  Sparkles,
  Phone,
  ChevronLeft,
  ChevronRight,
  Palette,
  Star,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { LeadCaptureModal } from "@/components/lead-generation/lead-capture-modal";
import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";

interface PaintColor {
  id: number;
  colorName: string;
  colorCode: string;
  hexValue: string;
  brand: string;
  category: string;
}

export default function HomeLume() {
  const tenant = useTenant();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  const colorSamples = colors.filter(c => c.brand === "sherwin-williams").slice(0, 6);

  const services = [
    {
      id: "interior",
      icon: Home,
      title: "Interior",
      description: "Walls, ceilings, trim, and doors with premium finishes.",
      details: "Our interior painting services transform your living spaces with meticulous preparation, premium paints, and expert craftsmanship. We protect your furniture and floors, repair minor imperfections, and deliver flawless results.",
      image: interiorImage
    },
    {
      id: "exterior",
      icon: Building2,
      title: "Exterior",
      description: "Weather-resistant coatings that protect and beautify.",
      details: "Protect your home's exterior with our professional painting services. We use top-quality, weather-resistant paints and proper preparation techniques to ensure a lasting, beautiful finish that withstands the elements.",
      image: exteriorImage
    },
    {
      id: "cabinets",
      icon: Sparkles,
      title: "Cabinets",
      description: "Transform your kitchen with refinished cabinets.",
      details: "Cabinet refinishing is a cost-effective way to completely transform your kitchen or bathroom. We sand, prime, and apply durable finishes that look factory-fresh and last for years."
    }
  ];

  const features = [
    { icon: Shield, title: "Licensed & Insured", desc: "Fully covered for your peace of mind" },
    { icon: Clock, title: "On-Time Completion", desc: "We respect your schedule" },
    { icon: Star, title: "3-Year Warranty", desc: "Guaranteed workmanship" }
  ];

  return (
    <PageLayout>
      <LeadCaptureModal tenantId={tenant.id} tenantName={tenant.name} />
      
      <main className="min-h-screen bg-white">
        
        {/* HERO - Gradient band with Lume text */}
        <section 
          className="w-full py-20 md:py-28"
          style={{
            background: 'linear-gradient(to right, white 0%, #e5e7eb 25%, #9ca3af 50%, #e5e7eb 75%, white 100%)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-wide text-gray-800"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Lume
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 font-light">
              We elevate the backdrop of your life.
            </p>
          </motion.div>
        </section>

        {/* BENTO GRID - Tight 3-column layout */}
        <section className="px-3 md:px-6 py-6 md:py-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Mobile: Carousel for services */}
            <div className="md:hidden mb-4">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-2">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      className="flex-[0_0_85%] min-w-0 cursor-pointer"
                      onClick={() => setActiveModal(service.id)}
                    >
                      <GlassCard className="p-4 h-full">
                        {service.image && (
                          <div className="aspect-video rounded-lg overflow-hidden mb-3">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <service.icon className="w-5 h-5 text-gray-700" />
                          <h3 className="font-medium text-gray-800">{service.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </GlassCard>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <button onClick={scrollPrev} className="p-1.5 rounded-full bg-gray-100" data-testid="button-prev">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={scrollNext} className="p-1.5 rounded-full bg-gray-100" data-testid="button-next">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop: 3-column grid */}
            <div className="hidden md:grid grid-cols-3 gap-3">
              {/* Row 1: Services */}
              {services.map((service) => (
                <GlassCard 
                  key={service.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setActiveModal(service.id)}
                >
                  {service.image && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!service.image && (
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
                      <service.icon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <service.icon className="w-5 h-5 text-gray-700" />
                    <h3 className="font-medium text-gray-800">{service.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </GlassCard>
              ))}

              {/* Row 2: Features (3 items) */}
              {features.map((f) => (
                <GlassCard key={f.title} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{f.title}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </GlassCard>
              ))}

              {/* Row 3: Colors, Service Area, CTA */}
              {colorSamples.length > 0 && (
                <Link href="/colors">
                  <GlassCard className="p-4 cursor-pointer hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-5 h-5 text-gray-700" />
                      <h3 className="font-medium text-gray-800">Colors</h3>
                    </div>
                    <div className="grid grid-cols-6 gap-1 mb-2">
                      {colorSamples.map((c) => (
                        <div key={c.id} className="aspect-square rounded" style={{ backgroundColor: c.hexValue }} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">View our color library</p>
                  </GlassCard>
                </Link>
              )}

              <GlassCard className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  <h3 className="font-medium text-gray-800">Service Area</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {tenant.seo.serviceAreas.slice(0, 4).join(" · ")}
                </p>
                <p className="text-xs text-gray-500 mt-1">and surrounding areas</p>
              </GlassCard>

              <Link href="/estimate">
                <GlassCard className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white cursor-pointer hover:shadow-lg transition-all h-full flex flex-col justify-center">
                  <h3 className="font-medium text-lg mb-1">Get Your Estimate</h3>
                  <p className="text-sm text-gray-300 mb-3">Free AI visual editor & sq ft estimate</p>
                  <Button variant="secondary" size="sm" className="w-fit" data-testid="button-estimate">
                    Start Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </GlassCard>
              </Link>
            </div>

            {/* Mobile: Additional cards */}
            <div className="md:hidden space-y-3 mt-4">
              <div className="grid grid-cols-3 gap-2">
                {features.map((f) => (
                  <GlassCard key={f.title} className="p-3 text-center">
                    <f.icon className="w-5 h-5 text-gray-700 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-800">{f.title}</p>
                  </GlassCard>
                ))}
              </div>

              <Link href="/estimate">
                <GlassCard className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                  <h3 className="font-medium text-lg mb-1">Get Your Estimate</h3>
                  <p className="text-sm text-gray-300 mb-3">Free AI visual editor & sq ft estimate - takes less than a minute</p>
                  <Button variant="secondary" size="sm" data-testid="button-estimate-mobile">
                    Start Now <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </GlassCard>
              </Link>

              {colorSamples.length > 0 && (
                <Link href="/colors">
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-gray-700" />
                        <span className="font-medium text-gray-800">Explore Colors</span>
                      </div>
                      <div className="flex gap-1">
                        {colorSamples.slice(0, 4).map((c) => (
                          <div key={c.id} className="w-6 h-6 rounded" style={{ backgroundColor: c.hexValue }} />
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              )}

              <GlassCard className="p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-700" />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Service Area</p>
                  <p className="text-xs text-gray-500">{tenant.seo.serviceAreas.slice(0, 3).join(" · ")}</p>
                </div>
              </GlassCard>
            </div>

          </div>
        </section>

        {/* Contact Bar */}
        <section className="px-3 md:px-6 pb-8">
          <div className="max-w-5xl mx-auto">
            <GlassCard className="p-4 md:p-6 bg-gray-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div>
                  <h3 className="font-medium text-gray-800">Ready to transform your space?</h3>
                  <p className="text-sm text-gray-600">Premium painting with meticulous attention to detail.</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/estimate">
                    <Button className="bg-gray-800 hover:bg-gray-900" data-testid="button-cta-estimate">
                      Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  {tenant.phone && (
                    <a href={`tel:${tenant.phone}`}>
                      <Button variant="outline" data-testid="button-call">
                        <Phone className="w-4 h-4 mr-2" /> Call
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

      </main>

      {/* Service Detail Modals */}
      {services.map((service) => (
        <Dialog key={service.id} open={activeModal === service.id} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <service.icon className="w-5 h-5" />
                {service.title} Painting
              </DialogTitle>
            </DialogHeader>
            {service.image && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-gray-600">{service.details}</p>
            <div className="flex gap-2 mt-2">
              <Link href="/estimate" className="flex-1">
                <Button className="w-full bg-gray-800 hover:bg-gray-900" data-testid={`button-${service.id}-estimate`}>
                  Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </PageLayout>
  );
}
