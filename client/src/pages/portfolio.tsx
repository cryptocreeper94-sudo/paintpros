import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import AI-generated portfolio images
import masterBedroom from "@assets/generated_images/master_bedroom_refresh.png";
import guestRoom from "@assets/generated_images/guest_room_transformation.png";
import bedroomAccent from "@assets/generated_images/bedroom_accent_wall.png";
import kitchenCabinet from "@assets/generated_images/kitchen_cabinet_refresh.png";
import kitchenModern from "@assets/generated_images/modern_kitchen_paint.png";
import kitchenIsland from "@assets/generated_images/kitchen_island_highlight.png";
import masterBath from "@assets/generated_images/master_bath_makeover.png";
import guestBath from "@assets/generated_images/guest_bath_update.png";
import spaLikeBath from "@assets/generated_images/spa-like_bathroom.png";
import livingRoom from "@assets/generated_images/living_room_transformation.png";
import familyRoom from "@assets/generated_images/family_room_refresh.png";
import denAccent from "@assets/generated_images/den_accent_colors.png";
import diningRoom from "@assets/generated_images/dining_room_elegance.png";
import exteriorHome from "@assets/generated_images/home_exterior_update.png";
import trimDoor from "@assets/generated_images/trim_&_door_refresh.png";
import garageDoor from "@assets/generated_images/garage_door_paint.png";
import porch from "@assets/generated_images/porch_&_entry.png";

interface PortfolioImage {
  id: string;
  title: string;
  category: string;
  location: string;
  colSpan: number;
  rowSpan: number;
  mobileColSpan: number;
  mobileRowSpan: number;
  imageUrl: string;
}

export default function Portfolio() {
  const tenant = useTenant();
  const cityName = tenant.address?.city || "Local";
  const areas = tenant.seo.serviceAreas;
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null);

  const portfolioImages: PortfolioImage[] = [
    // Bedrooms
    { id: "bed-1", title: "Master Bedroom Refresh", category: "Bedroom", location: areas[0] || cityName, colSpan: 6, rowSpan: 1, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: masterBedroom },
    { id: "bed-2", title: "Guest Room Transformation", category: "Bedroom", location: areas[1] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: guestRoom },
    { id: "bed-3", title: "Bedroom Accent Wall", category: "Bedroom", location: areas[2] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: bedroomAccent },
    
    // Kitchens
    { id: "kit-1", title: "Kitchen Cabinet Refresh", category: "Kitchen", location: areas[0] || cityName, colSpan: 8, rowSpan: 2, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: kitchenCabinet },
    { id: "kit-2", title: "Modern Kitchen Paint", category: "Kitchen", location: areas[1] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: kitchenModern },
    { id: "kit-3", title: "Kitchen Island Highlight", category: "Kitchen", location: areas[2] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: kitchenIsland },
    
    // Bathrooms
    { id: "bath-1", title: "Master Bath Makeover", category: "Bathroom", location: areas[0] || cityName, colSpan: 6, rowSpan: 1, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: masterBath },
    { id: "bath-2", title: "Guest Bath Update", category: "Bathroom", location: areas[1] || cityName, colSpan: 3, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: guestBath },
    { id: "bath-3", title: "Spa-Like Bathroom", category: "Bathroom", location: areas[2] || cityName, colSpan: 3, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: spaLikeBath },
    
    // Living Areas
    { id: "living-1", title: "Living Room Transformation", category: "Living Area", location: areas[0] || cityName, colSpan: 6, rowSpan: 2, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: livingRoom },
    { id: "living-2", title: "Family Room Refresh", category: "Living Area", location: areas[1] || cityName, colSpan: 3, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: familyRoom },
    { id: "living-3", title: "Den Accent Colors", category: "Living Area", location: areas[2] || cityName, colSpan: 3, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: denAccent },
    { id: "living-4", title: "Dining Room Elegance", category: "Living Area", location: areas[0] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: diningRoom },
    
    // Exteriors
    { id: "ext-1", title: "Home Exterior Update", category: "Exterior", location: areas[0] || cityName, colSpan: 6, rowSpan: 2, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: exteriorHome },
    { id: "ext-2", title: "Trim & Door Refresh", category: "Exterior", location: areas[1] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: trimDoor },
    { id: "ext-3", title: "Garage Door Paint", category: "Exterior", location: areas[2] || cityName, colSpan: 2, rowSpan: 1, mobileColSpan: 2, mobileRowSpan: 2, imageUrl: garageDoor },
    { id: "ext-4", title: "Porch & Entry", category: "Exterior", location: areas[0] || cityName, colSpan: 4, rowSpan: 1, mobileColSpan: 4, mobileRowSpan: 2, imageUrl: porch },
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
        <div className="max-w-7xl mx-auto mb-6 md:mb-12">
          <h1 className="text-2xl md:text-6xl font-display font-bold text-foreground mb-2 md:mb-4">Selected Work</h1>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl">
            A curated collection of our finest transformations across {cityName} and surrounding areas.
          </p>
        </div>

        <BentoGrid>
          {portfolioImages.map((image) => (
            <BentoItem key={image.id} colSpan={image.colSpan} rowSpan={image.rowSpan} mobileColSpan={image.mobileColSpan} mobileRowSpan={image.mobileRowSpan}>
              <button 
                onClick={() => setSelectedImage(image)}
                className="w-full h-full text-left"
                data-testid={`button-portfolio-${image.id}`}
              >
                <GlassCard 
                  className="p-0 overflow-hidden group min-h-[150px] md:min-h-[300px] cursor-pointer"
                  hoverEffect={false}
                >
                  <img 
                    src={image.imageUrl}
                    alt={image.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 bg-gradient-to-t from-black via-black/70 to-transparent">
                    <h3 className="text-sm md:text-lg font-display font-bold text-white mb-0.5" data-testid={`portfolio-title-${image.id}`}>
                      {image.title}
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm" data-testid={`portfolio-location-${image.id}`}>
                      {image.location}
                    </p>
                  </div>
                </GlassCard>
              </button>
            </BentoItem>
          ))}
        </BentoGrid>
      </main>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              data-testid="button-close-lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
