import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Brush, Home, Building2, PaintBucket, Layers, DoorOpen, Hammer, Sun, Droplets } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";

export default function Services() {
  const tenant = useTenant();

  const allServices = [
    {
      id: "interior",
      title: "Interior Painting",
      desc: "Transform your living and working spaces with expert interior painting. Walls, ceilings, trim, and doors - we handle it all with precision and care.",
      icon: <Home className="w-8 h-8 text-accent" />,
      colSpan: 6,
      enabled: tenant.services.interiorPainting
    },
    {
      id: "exterior",
      title: "Exterior Painting",
      desc: "Long-lasting weather protection and stunning curb appeal. Our exterior painting services protect your property while making it shine.",
      icon: <Sun className="w-8 h-8 text-accent" />,
      colSpan: 6,
      enabled: tenant.services.exteriorPainting
    },
    {
      id: "commercial",
      title: "Commercial Painting",
      desc: "Professional painting solutions for offices, retail spaces, and industrial facilities. We work around your schedule with minimal disruption.",
      icon: <Building2 className="w-8 h-8 text-accent" />,
      colSpan: 6,
      enabled: tenant.services.commercialPainting
    },
    {
      id: "residential",
      title: "Residential Painting",
      desc: "Your home deserves the best. From single rooms to complete home makeovers, we deliver flawless results you'll love for years.",
      icon: <Home className="w-8 h-8 text-accent" />,
      colSpan: 6,
      enabled: tenant.services.residentialPainting
    },
    {
      id: "trim",
      title: "Trim & Molding",
      desc: "Detailed finishing work for baseboards, crown molding, window frames, and door casings. The details that make all the difference.",
      icon: <Layers className="w-8 h-8 text-accent" />,
      colSpan: 4,
      enabled: tenant.services.trimAndMolding
    },
    {
      id: "ceilings",
      title: "Ceiling Painting",
      desc: "Brighten your space from above. Expert ceiling painting with proper preparation and clean, even coverage.",
      icon: <Droplets className="w-8 h-8 text-accent" />,
      colSpan: 4,
      enabled: tenant.services.ceilings
    },
    {
      id: "doors",
      title: "Door Painting",
      desc: "Interior and exterior doors refinished to perfection. Stand-alone service or as part of your complete painting project.",
      icon: <DoorOpen className="w-8 h-8 text-accent" />,
      colSpan: 4,
      enabled: tenant.services.doors
    },
    {
      id: "drywall",
      title: "Drywall Repair",
      desc: "Minor drywall repairs done during your painting project. We fix holes, cracks, and imperfections before painting for a flawless finish. (Repair only - not installation)",
      icon: <Hammer className="w-8 h-8 text-accent" />,
      colSpan: 4,
      enabled: tenant.services.drywallRepair
    },
    {
      id: "cabinet",
      title: "Cabinet Refinishing",
      desc: "Factory-finish quality for your kitchen and bathroom cabinetry. A cost-effective alternative to full replacement.",
      icon: <PaintBucket className="w-8 h-8 text-accent" />,
      colSpan: 4,
      enabled: tenant.services.cabinetPainting
    },
    {
      id: "deck",
      title: "Deck Staining",
      desc: "Protect and beautify your outdoor living spaces with professional deck staining and sealing services.",
      icon: <Brush className="w-8 h-8 text-accent" />,
      colSpan: 4,
      enabled: tenant.services.deckStaining
    },
  ];

  const services = allServices.filter(s => s.enabled);

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Professional painting services for residential and commercial properties. Interior and exterior solutions delivered with exceptional craftsmanship.
            </p>
          </motion.div>
        </div>

        <BentoGrid>
          {services.map((service, index) => (
            <BentoItem key={service.id} colSpan={service.colSpan} rowSpan={1}>
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassCard className="p-8 flex flex-col justify-between h-full" hoverEffect>
                  <div className="mb-6 bg-accent/10 w-fit p-3 rounded-xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            </BentoItem>
          ))}
        </BentoGrid>

        {/* Service Highlights */}
        <motion.div 
          className="max-w-7xl mx-auto mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-accent">Quality Materials</h4>
                <p className="text-muted-foreground text-sm">We use only premium paints and supplies for lasting results.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-accent">Clean Worksite</h4>
                <p className="text-muted-foreground text-sm">We protect your property and leave it cleaner than we found it.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-accent">Satisfaction Guaranteed</h4>
                <p className="text-muted-foreground text-sm">Your complete satisfaction is our top priority on every project.</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </PageLayout>
  );
}
