import { Link } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import { 
  ArrowRight, 
  Award, 
  Shield, 
  Clock, 
  Home, 
  Building2, 
  MapPin,
  Sparkles,
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { LeadCaptureModal } from "@/components/lead-generation/lead-capture-modal";
import { useCallback } from "react";

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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  const getColorSamples = () => {
    const swColors = colors.filter(c => c.brand === "sherwin-williams");
    const neutrals = swColors.filter(c => c.category === "neutral");
    const warms = swColors.filter(c => c.category === "warm");
    return [...neutrals.slice(0, 3), ...warms.slice(0, 3)].slice(0, 6);
  };

  const colorSamples = getColorSamples();

  const services = [
    {
      icon: Home,
      title: "Interior Painting",
      description: "Walls, ceilings, trim, and doors with premium finishes.",
      image: interiorImage
    },
    {
      icon: Building2,
      title: "Exterior Painting",
      description: "Weather-resistant coatings that protect and beautify.",
      image: exteriorImage
    },
    {
      icon: Sparkles,
      title: "Cabinet Refinishing",
      description: "Transform your kitchen with expertly refinished cabinets."
    }
  ];

  const features = [
    { icon: Sparkles, title: "Premium Quality", desc: "Top-tier paints and materials" },
    { icon: Clock, title: "On-Time Service", desc: "Projects completed on schedule" },
    { icon: Shield, title: "3-Year Warranty", desc: "Guaranteed workmanship" }
  ];

  return (
    <PageLayout>
      <LeadCaptureModal tenantId={tenant.id} tenantName={tenant.name} />
      
      <main className="min-h-screen bg-white">
        
        {/* HERO - Gradient band with Lume text */}
        <section 
          className="w-full py-16 md:py-24"
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

        {/* BENTO GRID CONTENT */}
        <section className="px-3 md:px-6 py-8 md:py-12">
          <BentoGrid className="max-w-6xl mx-auto">
            
            {/* Services - Mobile Carousel, Desktop Grid */}
            <BentoItem colSpan={6} rowSpan={2} className="md:hidden">
              <GlassCard className="h-full p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Our Services</h3>
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-3">
                    {services.map((service) => (
                      <div key={service.title} className="flex-[0_0_80%] min-w-0">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <service.icon className="w-6 h-6 text-gray-700 mb-2" />
                          <h4 className="font-medium text-gray-800">{service.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-3">
                  <button onClick={scrollPrev} className="p-1.5 rounded-full bg-gray-100" data-testid="button-services-prev">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={scrollNext} className="p-1.5 rounded-full bg-gray-100" data-testid="button-services-next">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Services - Desktop Only */}
            {services.map((service, idx) => (
              <BentoItem key={service.title} colSpan={2} rowSpan={2} className="hidden md:block">
                <GlassCard className="h-full p-4 hover:shadow-md transition-all">
                  {service.image && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <service.icon className="w-6 h-6 text-gray-700 mb-2" />
                  <h4 className="font-medium text-gray-800">{service.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </GlassCard>
              </BentoItem>
            ))}

            {/* Why Choose Lume */}
            <BentoItem colSpan={8} rowSpan={1} mobileColSpan={4}>
              <GlassCard className="h-full p-4 md:p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Why Choose Lume</h3>
                <div className="grid grid-cols-3 gap-4">
                  {features.map((f) => (
                    <div key={f.title} className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <f.icon className="w-5 h-5 text-gray-700" />
                      </div>
                      <p className="text-xs md:text-sm font-medium text-gray-800">{f.title}</p>
                      <p className="text-xs text-gray-500 hidden md:block">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </BentoItem>

            {/* CTA */}
            <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4}>
              <GlassCard className="h-full p-4 md:p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-gray-100 to-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Get Your Free Estimate</h3>
                <p className="text-sm text-gray-600 mb-4">We respond within 24 hours</p>
                <Link href="/estimate">
                  <Button className="bg-gray-800 hover:bg-gray-900 text-white" data-testid="button-get-estimate">
                    Start Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </GlassCard>
            </BentoItem>

            {/* Color Inspiration */}
            {colorSamples.length > 0 && (
              <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4}>
                <GlassCard className="h-full p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Color Inspiration</h3>
                  <div className="flex gap-2">
                    {colorSamples.slice(0, 6).map((color) => (
                      <div 
                        key={color.id}
                        className="flex-1 aspect-square rounded-lg"
                        style={{ backgroundColor: color.hexValue }}
                        title={color.colorName}
                      />
                    ))}
                  </div>
                  <Link href="/colors" className="block mt-3">
                    <Button variant="ghost" size="sm" className="w-full text-gray-600" data-testid="button-view-colors">
                      View Color Library <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </GlassCard>
              </BentoItem>
            )}

            {/* Service Area */}
            <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4}>
              <GlassCard className="h-full p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Service Area</h3>
                  <p className="text-sm text-gray-600">
                    {tenant.seo.serviceAreas.slice(0, 3).join(" · ")}
                  </p>
                  <p className="text-xs text-gray-500">and surrounding areas</p>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Contact */}
            <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4}>
              <GlassCard className="h-full p-4 md:p-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Ready to transform your space?</h3>
                    <p className="text-gray-300 text-sm">Premium painting services with meticulous attention to detail.</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/estimate">
                      <Button variant="secondary" data-testid="button-estimate-cta">
                        Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    {tenant.phone && (
                      <a href={`tel:${tenant.phone}`}>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-call">
                          <Phone className="w-4 h-4 mr-2" /> Call
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

          </BentoGrid>
        </section>

      </main>
    </PageLayout>
  );
}
