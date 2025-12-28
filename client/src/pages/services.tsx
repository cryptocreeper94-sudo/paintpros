import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Brush, Home, Building2, PaintBucket, Layers, DoorOpen, Hammer, Sun, Droplets, ArrowRight } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";

export default function Services() {
  const tenant = useTenant();

  const allServices = [
    {
      id: "interior",
      title: "Interior Painting",
      desc: "Transform your living and working spaces with expert interior painting. Walls, ceilings, trim, and doors - we handle it all with precision and care.",
      icon: <Home className="w-6 h-6 text-accent" />,
      image: interiorImage,
      enabled: tenant.services.interiorPainting
    },
    {
      id: "exterior",
      title: "Exterior Painting",
      desc: "Long-lasting weather protection and stunning curb appeal. Our exterior painting services protect your property while making it shine.",
      icon: <Sun className="w-6 h-6 text-accent" />,
      image: exteriorImage,
      enabled: tenant.services.exteriorPainting
    },
    {
      id: "commercial",
      title: "Commercial Painting",
      desc: "Professional painting solutions for offices, retail spaces, and industrial facilities. We work around your schedule with minimal disruption.",
      icon: <Building2 className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.commercialPainting
    },
    {
      id: "residential",
      title: "Residential Painting",
      desc: "Your home deserves the best. From single rooms to complete home makeovers, we deliver flawless results you'll love for years.",
      icon: <Home className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.residentialPainting
    },
    {
      id: "trim",
      title: "Trim & Molding",
      desc: "Detailed finishing work for baseboards, crown molding, window frames, and door casings. The details that make all the difference.",
      icon: <Layers className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.trimAndMolding
    },
    {
      id: "ceilings",
      title: "Ceiling Painting",
      desc: "Brighten your space from above. Expert ceiling painting with proper preparation and clean, even coverage.",
      icon: <Droplets className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.ceilings
    },
    {
      id: "doors",
      title: "Door Painting",
      desc: "Interior and exterior doors refinished to perfection. Stand-alone service or as part of your complete painting project.",
      icon: <DoorOpen className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.doors
    },
    {
      id: "drywall",
      title: "Drywall Repair",
      desc: "Minor drywall repairs done during your painting project. We fix holes, cracks, and imperfections before painting for a flawless finish. (Repair only - not installation)",
      icon: <Hammer className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.drywallRepair
    },
    {
      id: "cabinet",
      title: "Cabinet Refinishing",
      desc: "Factory-finish quality for your kitchen and bathroom cabinetry. A cost-effective alternative to full replacement.",
      icon: <PaintBucket className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.cabinetPainting
    },
    {
      id: "deck",
      title: "Deck Staining",
      desc: "Protect and beautify your outdoor living spaces with professional deck staining and sealing services.",
      icon: <Brush className="w-6 h-6 text-accent" />,
      image: null,
      enabled: tenant.services.deckStaining
    },
  ];

  const services = allServices.filter(s => s.enabled);

  return (
    <PageLayout>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <section className="pt-24 pb-12 px-4 md:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Our Services
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Professional painting services for residential and commercial properties. 
                Interior and exterior solutions delivered with exceptional craftsmanship.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`card-service-${service.id}`}
                >
                  <GlassCard className="overflow-hidden bg-white dark:bg-gray-800">
                    <div className={`flex flex-col ${service.image ? 'md:flex-row' : ''}`}>
                      {/* Image (if available) */}
                      {service.image && (
                        <div className="w-full md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className={`p-6 md:p-8 flex flex-col justify-center ${service.image ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-accent/10 p-2 rounded-lg">
                            {service.icon}
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {service.title}
                          </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="py-16 px-4 md:px-8 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
                What Sets Us Apart
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard className="p-6 bg-gray-50 dark:bg-gray-700 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <PaintBucket className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Quality Materials</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    We use only premium paints and supplies for lasting results.
                  </p>
                </GlassCard>
                
                <GlassCard className="p-6 bg-gray-50 dark:bg-gray-700 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Brush className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Clean Worksite</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    We protect your property and leave it cleaner than we found it.
                  </p>
                </GlassCard>
                
                <GlassCard className="p-6 bg-gray-50 dark:bg-gray-700 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Home className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Satisfaction Guaranteed</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Your complete satisfaction is our top priority on every project.
                  </p>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-accent/10 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get a free estimate for your painting project today.
            </p>
            <Link href="/estimate">
              <Button size="lg" className="text-lg px-8 gap-2" data-testid="button-services-estimate">
                Get Your Free Estimate
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
