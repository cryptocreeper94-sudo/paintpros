import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";

// Import portfolio images
import img1 from "@assets/image-6659437108452578519_1765556659912.jpg";
import img2 from "@assets/image-4159103785892811837_1765556694068.jpg";
import img3 from "@assets/image-7877320386517089825_1765556733833.jpg";
import img4 from "@assets/image-9026901987564662371_1765556828087.jpg";
import img5 from "@assets/image-7112493224091651029_1765556777283.jpg";
import img6 from "@assets/image-3750419214632467212_1765556810890.jpg";
import img7 from "@assets/image-4031028444572203316_1765556760806.jpg";
import img8 from "@assets/image-5024505268070063169_1765556874455.jpg";
import img9 from "@assets/image-2031027012020148910_1765556860483.jpg";
import img10 from "@assets/image-7516974362034260370_1765556910322.jpg";
import img11 from "@assets/image_1765557569989.png";
import img12 from "@assets/image_1765558252664.png";
import img13 from "@assets/image_1765558266319.png";
import img14 from "@assets/image_1765558298096.png";

interface PortfolioImage {
  id: string;
  title: string;
  category: string;
  location: string;
  colSpan: number;
  rowSpan: number;
  imageUrl: string;
}

export default function Portfolio() {
  const tenant = useTenant();
  const cityName = tenant.address?.city || "Local";
  const areas = tenant.seo.serviceAreas;

  const portfolioImages: PortfolioImage[] = [
    // Bedrooms
    { id: "bed-1", title: "Master Bedroom Refresh", category: "Bedroom", location: areas[0] || cityName, colSpan: 6, rowSpan: 1, imageUrl: img1 },
    { id: "bed-2", title: "Guest Room Transformation", category: "Bedroom", location: areas[1] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img2 },
    { id: "bed-3", title: "Bedroom Accent Wall", category: "Bedroom", location: areas[2] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img3 },
    
    // Kitchens
    { id: "kit-1", title: "Kitchen Cabinet Refresh", category: "Kitchen", location: areas[0] || cityName, colSpan: 8, rowSpan: 2, imageUrl: img4 },
    { id: "kit-2", title: "Modern Kitchen Paint", category: "Kitchen", location: areas[1] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img5 },
    { id: "kit-3", title: "Kitchen Island Highlight", category: "Kitchen", location: areas[2] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img6 },
    
    // Bathrooms
    { id: "bath-1", title: "Master Bath Makeover", category: "Bathroom", location: areas[0] || cityName, colSpan: 6, rowSpan: 1, imageUrl: img7 },
    { id: "bath-2", title: "Guest Bath Update", category: "Bathroom", location: areas[1] || cityName, colSpan: 3, rowSpan: 1, imageUrl: img8 },
    { id: "bath-3", title: "Spa-Like Bathroom", category: "Bathroom", location: areas[2] || cityName, colSpan: 3, rowSpan: 1, imageUrl: img9 },
    
    // Living Areas
    { id: "living-1", title: "Living Room Transformation", category: "Living Area", location: areas[0] || cityName, colSpan: 6, rowSpan: 2, imageUrl: img10 },
    { id: "living-2", title: "Family Room Refresh", category: "Living Area", location: areas[1] || cityName, colSpan: 3, rowSpan: 1, imageUrl: img11 },
    { id: "living-3", title: "Den Accent Colors", category: "Living Area", location: areas[2] || cityName, colSpan: 3, rowSpan: 1, imageUrl: img12 },
    { id: "living-4", title: "Dining Room Elegance", category: "Living Area", location: areas[0] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img13 },
    
    // Exteriors
    { id: "ext-1", title: "Home Exterior Update", category: "Exterior", location: areas[0] || cityName, colSpan: 6, rowSpan: 2, imageUrl: img14 },
    { id: "ext-2", title: "Trim & Door Refresh", category: "Exterior", location: areas[1] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img1 },
    { id: "ext-3", title: "Garage Door Paint", category: "Exterior", location: areas[2] || cityName, colSpan: 2, rowSpan: 1, imageUrl: img2 },
    { id: "ext-4", title: "Porch & Entry", category: "Exterior", location: areas[0] || cityName, colSpan: 4, rowSpan: 1, imageUrl: img3 },
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
                className="p-0 overflow-hidden group min-h-[300px]"
                hoverEffect={false}
              >
                {/* Portfolio Image */}
                <img 
                  src={image.imageUrl}
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black via-black/70 to-transparent">
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
