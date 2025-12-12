import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Brush, Ruler, Home, Building2, PaintBucket } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Residential Interior",
      desc: "Transforming living spaces with precision and care. Walls, ceilings, trim, and cabinets.",
      icon: <Home className="w-8 h-8 text-accent" />,
      colSpan: 6
    },
    {
      title: "Commercial Painting",
      desc: "Scalable solutions for offices, retail, and industrial spaces. Minimal disruption.",
      icon: <Building2 className="w-8 h-8 text-accent" />,
      colSpan: 6
    },
    {
      title: "Cabinet Refinishing",
      desc: "Factory-finish quality for your kitchen and bathroom cabinetry.",
      icon: <PaintBucket className="w-8 h-8 text-accent" />,
      colSpan: 4
    },
    {
      title: "Exterior Protection",
      desc: "Long-lasting weather protection and curb appeal enhancement.",
      icon: <Brush className="w-8 h-8 text-accent" />,
      colSpan: 4
    },
    {
      title: "Color Consultation",
      desc: "Expert guidance to find the perfect palette for your space.",
      icon: <Ruler className="w-8 h-8 text-accent" />,
      colSpan: 4
    }
  ];

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Comprehensive painting solutions delivered with white-glove service.
          </p>
        </div>

        <BentoGrid>
          {services.map((service, index) => (
            <BentoItem key={index} colSpan={service.colSpan} rowSpan={1}>
              <GlassCard className="p-8 flex flex-col justify-between h-full" hoverEffect>
                <div className="mb-6 bg-accent/10 w-fit p-3 rounded-xl">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.desc}</p>
                </div>
              </GlassCard>
            </BentoItem>
          ))}
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
