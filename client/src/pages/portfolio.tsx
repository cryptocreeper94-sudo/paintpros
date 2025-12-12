import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";

interface PortfolioImage {
  id: string;
  title: string;
  category: string;
  location: string;
  colSpan: number;
  rowSpan: number;
  imageUrl?: string;
}

export default function Portfolio() {
  const tenant = useTenant();
  const cityName = tenant.address?.city || "Local";
  const areas = tenant.seo.serviceAreas;

  const portfolioImages: PortfolioImage[] = [
    // Bedrooms
    { id: "bed-1", title: "Master Bedroom Refresh", category: "Bedroom", location: areas[0] || cityName, colSpan: 6, rowSpan: 1 },
    { id: "bed-2", title: "Guest Room Transformation", category: "Bedroom", location: areas[1] || cityName, colSpan: 4, rowSpan: 1 },
    { id: "bed-3", title: "Bedroom Accent Wall", category: "Bedroom", location: areas[2] || cityName, colSpan: 4, rowSpan: 1 },
    
    // Kitchens
    { id: "kit-1", title: "Kitchen Cabinet Refresh", category: "Kitchen", location: areas[0] || cityName, colSpan: 8, rowSpan: 2 },
    { id: "kit-2", title: "Modern Kitchen Paint", category: "Kitchen", location: areas[1] || cityName, colSpan: 4, rowSpan: 1 },
    { id: "kit-3", title: "Kitchen Island Highlight", category: "Kitchen", location: areas[2] || cityName, colSpan: 4, rowSpan: 1 },
    
    // Bathrooms
    { id: "bath-1", title: "Master Bath Makeover", category: "Bathroom", location: areas[0] || cityName, colSpan: 6, rowSpan: 1 },
    { id: "bath-2", title: "Guest Bath Update", category: "Bathroom", location: areas[1] || cityName, colSpan: 3, rowSpan: 1 },
    { id: "bath-3", title: "Spa-Like Bathroom", category: "Bathroom", location: areas[2] || cityName, colSpan: 3, rowSpan: 1 },
    
    // Living Areas
    { id: "living-1", title: "Living Room Transformation", category: "Living Area", location: areas[0] || cityName, colSpan: 6, rowSpan: 2 },
    { id: "living-2", title: "Family Room Refresh", category: "Living Area", location: areas[1] || cityName, colSpan: 3, rowSpan: 1 },
    { id: "living-3", title: "Den Accent Colors", category: "Living Area", location: areas[2] || cityName, colSpan: 3, rowSpan: 1 },
    { id: "living-4", title: "Dining Room Elegance", category: "Living Area", location: areas[0] || cityName, colSpan: 4, rowSpan: 1 },
    
    // Exteriors
    { id: "ext-1", title: "Home Exterior Update", category: "Exterior", location: areas[0] || cityName, colSpan: 6, rowSpan: 2 },
    { id: "ext-2", title: "Trim & Door Refresh", category: "Exterior", location: areas[1] || cityName, colSpan: 4, rowSpan: 1 },
    { id: "ext-3", title: "Garage Door Paint", category: "Exterior", location: areas[2] || cityName, colSpan: 2, rowSpan: 1 },
    { id: "ext-4", title: "Porch & Entry", category: "Exterior", location: areas[0] || cityName, colSpan: 4, rowSpan: 1 },
  ];

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Bedroom": "from-purple-500/30 to-purple-600/30",
      "Kitchen": "from-orange-500/30 to-orange-600/30",
      "Bathroom": "from-blue-500/30 to-blue-600/30",
      "Living Area": "from-green-500/30 to-green-600/30",
      "Exterior": "from-amber-500/30 to-amber-600/30",
    };
    return colors[category] || "from-zinc-500/30 to-zinc-600/30";
  };

  return (
    <PageLayout>
      <main className="pt-24 px-4 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">Selected Work</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A curated collection of our finest transformations across {cityName} and surrounding areas.
          </p>
        </div>

        <BentoGrid>
          {portfolioImages.map((image) => (
            <BentoItem key={image.id} colSpan={image.colSpan} rowSpan={image.rowSpan}>
              <GlassCard 
                className={`p-0 overflow-hidden group bg-gradient-to-br ${getCategoryColor(image.category)}`}
                hoverEffect={false}
              >
                {/* Placeholder background with subtle pattern */}
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-zinc-600 text-sm mb-2">[Portfolio Image]</div>
                    <div className="text-zinc-500 text-xs">{image.id}</div>
                  </div>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-accent text-xs font-bold uppercase tracking-wider mb-2 block opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {image.category}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white mb-1" data-testid={`portfolio-title-${image.id}`}>
                    {image.title}
                  </h3>
                  <p className="text-white/70 text-sm" data-testid={`portfolio-location-${image.id}`}>
                    {image.location}
                  </p>
                </div>
              </GlassCard>
            </BentoItem>
          ))}
        </BentoGrid>
      </main>
    </PageLayout>
  );
}
