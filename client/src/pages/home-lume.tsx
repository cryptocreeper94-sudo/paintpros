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
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { LeadCaptureModal } from "@/components/lead-generation/lead-capture-modal";
import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";
import serviceAreaMap from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";

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

  const colorSamples = colors.filter(c => c.brand === "sherwin-williams").slice(0, 5);

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
    { 
      id: "licensed",
      icon: Shield, 
      title: "Licensed & Insured", 
      desc: "Fully covered for your peace of mind",
      details: "We are fully licensed and insured, giving you complete peace of mind. Our comprehensive liability coverage protects your property, and our workers' compensation ensures our team is covered on every job."
    },
    { 
      id: "ontime",
      icon: Clock, 
      title: "On-Time Completion", 
      desc: "We respect your schedule",
      details: "We understand your time is valuable. That's why we provide accurate timelines upfront and stick to them. Our efficient processes and experienced crews ensure your project is completed on schedule, every time."
    },
    { 
      id: "warranty",
      icon: Star, 
      title: "3-Year Warranty", 
      desc: "Guaranteed workmanship",
      details: "Every project comes with our comprehensive 3-year warranty on workmanship. If any issues arise with our painting work, we'll make it right at no additional cost to you."
    }
  ];

  return (
    <PageLayout>
      <LeadCaptureModal tenantId={tenant.id} tenantName={tenant.name} />
      
      <main className="min-h-screen bg-white">
        
        {/* HERO - Full viewport on mobile, gradient band */}
        <section 
          className="w-full min-h-[calc(100vh-60px)] md:min-h-0 md:py-28 flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right, white 0%, #e5e7eb 25%, #9ca3af 50%, #e5e7eb 75%, white 100%)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
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
            <p className="mt-8 text-sm text-gray-400 md:hidden animate-bounce">
              Scroll to explore
            </p>
          </motion.div>
        </section>

        {/* BENTO GRID - Tight 3-column layout */}
        <section className="px-3 md:px-6 py-6 md:py-10">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-5">
            
            {/* Mobile: Carousel for services */}
            <div className="md:hidden">
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

            {/* Desktop: Row 1 - Services */}
            <div className="hidden md:grid grid-cols-3 gap-4">
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
            </div>

            {/* Row 2: Features */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {features.map((f) => (
                <GlassCard 
                  key={f.id} 
                  className="p-3 md:p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setActiveModal(f.id)}
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-xs md:text-sm">{f.title}</p>
                      <p className="text-xs text-gray-500 hidden md:block">{f.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Row 3: Colors */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-gray-700" />
                  <h3 className="font-medium text-gray-800">Choose Your Colors</h3>
                </div>
                <Link href="/colors">
                  <Button variant="ghost" size="sm" className="text-gray-600" data-testid="button-all-colors">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {colorSamples.map((color) => (
                  <GlassCard 
                    key={color.id}
                    className="p-2 md:p-3 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setActiveModal(`color-${color.id}`)}
                  >
                    <div 
                      className="aspect-square rounded-lg mb-2"
                      style={{ backgroundColor: color.hexValue }}
                    />
                    <p className="text-xs text-gray-700 font-medium truncate">{color.colorName}</p>
                    <p className="text-xs text-gray-400">{color.colorCode}</p>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Row 4: Service Area with Map */}
            <GlassCard 
              className="p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => setActiveModal("service-area")}
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-700" />
                <h3 className="font-medium text-gray-800">Service Area</h3>
              </div>
              <div className="aspect-[21/9] rounded-lg overflow-hidden mb-3">
                <img src={serviceAreaMap} alt="Service Area Map" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-gray-600">
                {tenant.seo.serviceAreas.slice(0, 5).join(" · ")}
              </p>
            </GlassCard>

            {/* Row 5: CTA */}
            <Link href="/estimate">
              <GlassCard className="p-5 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white cursor-pointer hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-xl md:text-2xl mb-2">Get Your Estimate</h3>
                    <p className="text-sm text-gray-300">Free AI visual editor & sq ft estimate - takes less than a minute</p>
                  </div>
                  <Button variant="secondary" size="lg" className="w-full md:w-auto" data-testid="button-estimate">
                    Start Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </GlassCard>
            </Link>

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
            <Link href="/estimate" className="block">
              <Button className="w-full bg-gray-800 hover:bg-gray-900" data-testid={`button-${service.id}-estimate`}>
                Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      ))}

      {/* Feature Modals */}
      {features.map((feature) => (
        <Dialog key={feature.id} open={activeModal === feature.id} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <feature.icon className="w-5 h-5" />
                {feature.title}
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">{feature.details}</p>
            <Link href="/estimate" className="block">
              <Button className="w-full bg-gray-800 hover:bg-gray-900" data-testid={`button-${feature.id}-cta`}>
                Get Your Free Estimate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      ))}

      {/* Color Modals */}
      {colorSamples.map((color) => (
        <Dialog key={color.id} open={activeModal === `color-${color.id}`} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{color.colorName}</DialogTitle>
            </DialogHeader>
            <div 
              className="aspect-square rounded-xl"
              style={{ backgroundColor: color.hexValue }}
            />
            <div className="space-y-2">
              <p className="text-sm"><span className="text-gray-500">Code:</span> {color.colorCode}</p>
              <p className="text-sm"><span className="text-gray-500">Brand:</span> {color.brand}</p>
              <p className="text-sm"><span className="text-gray-500">Category:</span> {color.category}</p>
            </div>
            <Link href="/colors" className="block">
              <Button variant="outline" className="w-full" data-testid={`button-color-${color.id}-more`}>
                Explore More Colors <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      ))}

      {/* Service Area Modal */}
      <Dialog open={activeModal === "service-area"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Our Service Area
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img src={serviceAreaMap} alt="Service Area Map" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-medium text-gray-800 mb-2">We proudly serve:</p>
            <div className="grid grid-cols-2 gap-2">
              {tenant.seo.serviceAreas.map((area) => (
                <div key={area} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {area}
                </div>
              ))}
            </div>
          </div>
          <Link href="/estimate" className="block">
            <Button className="w-full bg-gray-800 hover:bg-gray-900" data-testid="button-service-area-estimate">
              Get Your Free Estimate <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
