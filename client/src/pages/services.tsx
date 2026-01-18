import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Brush, Home, Building2, PaintBucket, Layers, DoorOpen, Hammer, Sun, Droplets, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";

export default function Services() {
  const tenant = useTenant();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const allServices = [
    {
      id: "interior",
      title: "Interior Painting",
      shortDesc: "Walls, ceilings, trim, and doors",
      desc: "Transform your living and working spaces with expert interior painting. Walls, ceilings, trim, and doors - we handle it all with precision and care.",
      icon: Home,
      image: interiorImage,
      enabled: tenant.services.interiorPainting
    },
    {
      id: "exterior",
      title: "Exterior Painting",
      shortDesc: "Weather protection & curb appeal",
      desc: "Long-lasting weather protection and stunning curb appeal. Our exterior painting services protect your property while making it shine.",
      icon: Sun,
      image: exteriorImage,
      enabled: tenant.services.exteriorPainting
    },
    {
      id: "commercial",
      title: "Commercial",
      shortDesc: "Offices, retail & industrial",
      desc: "Professional painting solutions for offices, retail spaces, and industrial facilities. We work around your schedule with minimal disruption.",
      icon: Building2,
      image: null,
      enabled: tenant.services.commercialPainting
    },
    {
      id: "residential",
      title: "Residential",
      shortDesc: "Single rooms to full homes",
      desc: "Your home deserves the best. From single rooms to complete home makeovers, we deliver flawless results you'll love for years.",
      icon: Home,
      image: null,
      enabled: tenant.services.residentialPainting
    },
    {
      id: "trim",
      title: "Trim & Molding",
      shortDesc: "Baseboards, crown, frames",
      desc: "Detailed finishing work for baseboards, crown molding, window frames, and door casings. The details that make all the difference.",
      icon: Layers,
      image: null,
      enabled: tenant.services.trimAndMolding
    },
    {
      id: "ceilings",
      title: "Ceilings",
      shortDesc: "Brighten from above",
      desc: "Brighten your space from above. Expert ceiling painting with proper preparation and clean, even coverage.",
      icon: Droplets,
      image: null,
      enabled: tenant.services.ceilings
    },
    {
      id: "doors",
      title: "Doors",
      shortDesc: "Interior & exterior doors",
      desc: "Interior and exterior doors refinished to perfection. Stand-alone service or as part of your complete painting project.",
      icon: DoorOpen,
      image: null,
      enabled: tenant.services.doors
    },
    {
      id: "drywall",
      title: "Drywall Repair",
      shortDesc: "Holes, cracks & imperfections",
      desc: "Minor drywall repairs done during your painting project. We fix holes, cracks, and imperfections before painting for a flawless finish. (Repair only - not installation)",
      icon: Hammer,
      image: null,
      enabled: tenant.services.drywallRepair
    },
    {
      id: "cabinet",
      title: "Cabinet Refinishing",
      shortDesc: "Kitchen & bath cabinets",
      desc: "Factory-finish quality for your kitchen and bathroom cabinetry. A cost-effective alternative to full replacement.",
      icon: PaintBucket,
      image: null,
      enabled: tenant.services.cabinetPainting
    },
    {
      id: "deck",
      title: "Deck Staining",
      shortDesc: "Protect outdoor spaces",
      desc: "Protect and beautify your outdoor living spaces with professional deck staining and sealing services.",
      icon: Brush,
      image: null,
      enabled: tenant.services.deckStaining
    },
  ];

  const services = allServices.filter(s => s.enabled);

  return (
    <PageLayout>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <section className="pt-24 pb-8 px-4 md:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-3">
                Our Services
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Professional painting services delivered with exceptional craftsmanship.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-6 md:py-10 px-3 md:px-6">
          <div className="max-w-5xl mx-auto space-y-4">
            
            {/* Mobile: Carousel */}
            <div className="md:hidden">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-2">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      className="flex-[0_0_85%] min-w-0 cursor-pointer"
                      onClick={() => setActiveModal(service.id)}
                    >
                      <GlassCard className="p-4 h-full bg-white dark:bg-gray-800">
                        {service.image && (
                          <div className="aspect-video rounded-lg overflow-hidden mb-3">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        {!service.image && (
                          <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-3">
                            <service.icon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <service.icon className="w-5 h-5 text-accent" />
                          <h3 className="font-medium text-gray-900 dark:text-white">{service.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{service.shortDesc}</p>
                      </GlassCard>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={scrollPrev} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700" data-testid="button-services-prev">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={scrollNext} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700" data-testid="button-services-next">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop: 3-column grid */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              {services.map((service) => (
                <GlassCard 
                  key={service.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-all bg-white dark:bg-gray-800"
                  onClick={() => setActiveModal(service.id)}
                  data-testid={`card-service-${service.id}`}
                >
                  {service.image && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {!service.image && (
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-3">
                      <service.icon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <service.icon className="w-5 h-5 text-accent" />
                    <h3 className="font-medium text-gray-900 dark:text-white">{service.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{service.shortDesc}</p>
                </GlassCard>
              ))}
            </div>

            {/* CTA */}
            <Link href="/estimate">
              <GlassCard className="p-5 md:p-8 bg-gradient-to-br from-gray-800 to-gray-900 text-white cursor-pointer hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-xl md:text-2xl mb-2">Ready to get started?</h3>
                    <p className="text-sm text-gray-300">Get your free estimate in under a minute.</p>
                  </div>
                  <Button variant="secondary" size="lg" className="w-full md:w-auto" data-testid="button-services-estimate">
                    Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
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
                {service.title}
              </DialogTitle>
            </DialogHeader>
            {service.image && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-300">{service.desc}</p>
            <Link href="/estimate" className="block">
              <Button className="w-full bg-gray-800 hover:bg-gray-900" data-testid={`button-${service.id}-estimate`}>
                Get Estimate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      ))}
    </PageLayout>
  );
}
