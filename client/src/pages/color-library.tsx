import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  Palette, 
  Droplets, 
  Sun, 
  Home, 
  ArrowRight,
  X,
  Check,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { PaintColor } from "@shared/schema";

const categories = [
  { id: "all", name: "All" },
  { id: "white", name: "Whites" },
  { id: "neutral", name: "Neutrals" },
  { id: "warm", name: "Warm" },
  { id: "cool", name: "Cool" },
  { id: "accent", name: "Accents" },
];

function ColorFlipCard({ color, onSelect }: { color: PaintColor; onSelect?: (color: PaintColor) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-80 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-testid={`card-color-${color.id}`}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div 
            className="w-full h-3/5 relative"
            style={{ backgroundColor: color.hexValue }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-black/30 backdrop-blur-sm text-white border-0">
                {color.brand === "sherwin-williams" ? "SW" : "BM"}
              </Badge>
            </div>
          </div>
          <GlassCard className="h-2/5 rounded-t-none rounded-b-xl p-4" glow="accent">
            <h3 className="font-bold text-lg truncate">{color.colorName}</h3>
            <p className="text-sm text-muted-foreground">{color.colorCode}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                LRV: {color.lrv}
              </Badge>
              {color.undertone && (
                <Badge variant="outline" className="text-xs capitalize">
                  {color.undertone}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tap for details
            </p>
          </GlassCard>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <GlassCard className="h-full p-4" glow="purple" animatedBorder>
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-full border-2 border-white/30"
                style={{ backgroundColor: color.hexValue }}
              />
              <div>
                <h3 className="font-bold text-sm">{color.colorName}</h3>
                <p className="text-xs text-muted-foreground">{color.colorCode}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Product Line</p>
                <p className="font-medium">{color.productLine}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground text-xs">Light Reflectance</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full" 
                      style={{ width: `${color.lrv}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono">{color.lrv}%</span>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Undertone</p>
                <p className="capitalize">{color.undertone || "Neutral"}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Best For</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {color.roomTypes?.slice(0, 3).map((room) => (
                    <Badge key={room} variant="secondary" className="text-xs capitalize">
                      {room.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {color.trimColors && color.trimColors.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs">Trim Colors</p>
                  <p className="text-xs">{color.trimColors.join(", ")}</p>
                </div>
              )}
            </div>

            {onSelect && (
              <Button 
                size="sm" 
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(color);
                }}
                data-testid={`button-select-color-${color.id}`}
              >
                <Check className="w-4 h-4 mr-1" />
                Select Color
              </Button>
            )}
          </GlassCard>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HorizontalColorScroller({ 
  title, 
  colors, 
  onSelect 
}: { 
  title: string; 
  colors: PaintColor[]; 
  onSelect?: (color: PaintColor) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  if (colors.length === 0) return null;

  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]/g, "-");

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={scrollLeft}
            data-testid={`button-scroll-left-${titleSlug}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={scrollRight}
            data-testid={`button-scroll-right-${titleSlug}`}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {colors.map((color) => (
          <div key={color.id} className="flex-shrink-0 w-64 snap-start">
            <ColorFlipCard color={color} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandAccordion({
  brandName,
  brandId,
  brandIcon: BrandIcon,
  colors,
  onSelect,
  defaultOpen = false
}: {
  brandName: string;
  brandId: string;
  brandIcon: typeof Droplets;
  colors: PaintColor[];
  onSelect?: (color: PaintColor) => void;
  defaultOpen?: boolean;
}) {
  const productLines = Array.from(new Set(colors.map(c => c.productLine)));
  
  const colorsByCategory = {
    white: colors.filter(c => c.category === "white"),
    neutral: colors.filter(c => c.category === "neutral"),
    warm: colors.filter(c => c.category === "warm"),
    cool: colors.filter(c => c.category === "cool"),
    accent: colors.filter(c => c.category === "accent"),
  };

  if (colors.length === 0) return null;

  return (
    <AccordionItem value={brandId} className="border rounded-xl overflow-hidden mb-4 bg-card/50">
      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-accent/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <BrandIcon className="w-6 h-6 text-accent" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">{brandName}</h2>
            <p className="text-sm text-muted-foreground">{colors.length} colors available</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4 pt-4">
          {colorsByCategory.white.length > 0 && (
            <HorizontalColorScroller 
              title="Whites & Off-Whites" 
              colors={colorsByCategory.white}
              onSelect={onSelect}
            />
          )}
          {colorsByCategory.neutral.length > 0 && (
            <HorizontalColorScroller 
              title="Neutrals & Grays" 
              colors={colorsByCategory.neutral}
              onSelect={onSelect}
            />
          )}
          {colorsByCategory.warm.length > 0 && (
            <HorizontalColorScroller 
              title="Warm Tones" 
              colors={colorsByCategory.warm}
              onSelect={onSelect}
            />
          )}
          {colorsByCategory.cool.length > 0 && (
            <HorizontalColorScroller 
              title="Cool Tones" 
              colors={colorsByCategory.cool}
              onSelect={onSelect}
            />
          )}
          {colorsByCategory.accent.length > 0 && (
            <HorizontalColorScroller 
              title="Bold Accents" 
              colors={colorsByCategory.accent}
              onSelect={onSelect}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function ColorLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<PaintColor | null>(null);

  const buildQueryUrl = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);
    const queryString = params.toString();
    return `/api/paint-colors${queryString ? `?${queryString}` : ""}`;
  };

  const { data: colors = [], isLoading } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors", selectedCategory, searchQuery],
    queryFn: async () => {
      const response = await fetch(buildQueryUrl());
      if (!response.ok) throw new Error("Failed to fetch colors");
      return response.json();
    },
  });

  const handleSelectColor = (color: PaintColor) => {
    setSelectedColor(color);
  };

  const handleCloseDetail = () => {
    setSelectedColor(null);
  };

  const sherwinWilliamsColors = colors.filter(c => c.brand === "sherwin-williams");
  const benjaminMooreColors = colors.filter(c => c.brand === "benjamin-moore");

  return (
    <PageLayout>
      <main className="pt-20 px-4 md:px-8 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Palette className="w-8 h-8 text-accent" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-bold">Color Library</h1>
                <p className="text-muted-foreground">Curated professional paint colors for your project</p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4" glow="accent">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search colors by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-colors"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "secondary"}
                    className="cursor-pointer hover-elevate"
                    onClick={() => setSelectedCategory(cat.id)}
                    data-testid={`badge-category-${cat.id}`}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {/* Accordion Layout */}
          {!isLoading && (
            <Accordion type="multiple" defaultValue={["sherwin-williams", "benjamin-moore"]} className="space-y-4">
              <BrandAccordion
                brandName="Sherwin-Williams"
                brandId="sherwin-williams"
                brandIcon={Droplets}
                colors={sherwinWilliamsColors}
                onSelect={handleSelectColor}
                defaultOpen
              />
              <BrandAccordion
                brandName="Benjamin Moore"
                brandId="benjamin-moore"
                brandIcon={Sun}
                colors={benjaminMooreColors}
                onSelect={handleSelectColor}
                defaultOpen
              />
            </Accordion>
          )}

          {/* Empty State */}
          {!isLoading && colors.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No colors found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search</p>
            </motion.div>
          )}
        </div>

        {/* Selected Color Detail Modal */}
        <AnimatePresence>
          {selectedColor && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
            >
              <motion.div
                className="w-full max-w-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <GlassCard className="p-6" glow="accent" animatedBorder>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-20 h-20 rounded-xl border-2 border-white/20"
                        style={{ backgroundColor: selectedColor.hexValue }}
                      />
                      <div>
                        <h2 className="text-2xl font-bold">{selectedColor.colorName}</h2>
                        <p className="text-muted-foreground">{selectedColor.colorCode}</p>
                        <Badge variant="outline" className="mt-1">
                          {selectedColor.brand === "sherwin-williams" ? "Sherwin-Williams" : "Benjamin Moore"} - {selectedColor.productLine}
                        </Badge>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={handleCloseDetail} data-testid="button-close-color-detail">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Hex Value</p>
                      <p className="font-mono font-bold">{selectedColor.hexValue}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">LRV (Light Reflectance)</p>
                      <p className="font-bold">{selectedColor.lrv}%</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Undertone</p>
                      <p className="font-bold capitalize">{selectedColor.undertone || "Neutral"}</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-bold capitalize">{selectedColor.category}</p>
                    </div>
                  </div>

                  {selectedColor.roomTypes && selectedColor.roomTypes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Recommended Spaces</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedColor.roomTypes.map((room) => (
                          <Badge key={room} variant="secondary" className="capitalize">
                            <Home className="w-3 h-3 mr-1" />
                            {room.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedColor.coordinatingColors && selectedColor.coordinatingColors.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Coordinating Colors</p>
                      <div className="flex gap-2">
                        {selectedColor.coordinatingColors.map((code) => (
                          <Badge key={code} variant="outline">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2" data-testid="button-add-to-estimate">
                      <Sparkles className="w-4 h-4" />
                      Add to Estimate
                    </Button>
                    <Button variant="outline" className="gap-2" data-testid="button-visualize-color">
                      <Palette className="w-4 h-4" />
                      Visualize in Room
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageLayout>
  );
}
