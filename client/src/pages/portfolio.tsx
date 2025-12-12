import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";

export default function Portfolio() {
  const projects = [
    { title: "Modern Farmhouse", location: "Franklin, TN", type: "Interior", colSpan: 8, rowSpan: 2 },
    { title: "Urban Loft", location: "The Gulch", type: "Commercial", colSpan: 4, rowSpan: 1 },
    { title: "Victorian Restoration", location: "East Nashville", type: "Exterior", colSpan: 4, rowSpan: 1 },
    { title: "Luxury Condo", location: "Green Hills", type: "Interior", colSpan: 6, rowSpan: 1 },
    { title: "Executive Office", location: "Downtown", type: "Commercial", colSpan: 6, rowSpan: 1 },
  ];

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Selected Work</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A curated collection of our finest transformations across Nashville.
          </p>
        </div>

        <BentoGrid>
          {projects.map((project, index) => (
            <BentoItem key={index} colSpan={project.colSpan} rowSpan={project.rowSpan}>
              <GlassCard className="p-0 overflow-hidden group min-h-[300px]" hoverEffect={false}>
                <div className="absolute inset-0 bg-zinc-800 animate-pulse group-hover:animate-none transition-colors" />
                {/* Placeholder for actual portfolio images */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-accent text-xs font-bold uppercase tracking-wider mb-1 block opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {project.type}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white mb-1">{project.title}</h3>
                  <p className="text-white/70 text-sm">{project.location}</p>
                </div>
              </GlassCard>
            </BentoItem>
          ))}
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
