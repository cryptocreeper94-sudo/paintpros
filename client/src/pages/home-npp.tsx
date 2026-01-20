import { useState } from "react";
import { Link } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowRight, 
  Award, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Brush, 
  Home, 
  Building2, 
  Palette, 
  MapPin,
  Star,
  BookOpen,
  HelpCircle,
  Layers,
  Droplets,
  BadgeCheck,
  MessageSquare,
  Calendar,
  Sparkles,
  Calculator,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { HeroSlideshow } from "@/components/ui/hero-slideshow";

// Import images
import awardImage from "@assets/Screenshot_20251216_195245_Replit_1765936399782.jpg";
import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import colorWheelImage from "@assets/generated_images/paint_color_wheel_white_bg.png";
import crewImage from "@assets/generated_images/professional_painting_crew_at_work.png";
import estimateImage from "@assets/generated_images/painter_consulting_homeowner_estimate.png";
import solanaLogo from "@assets/solana-logo-transparent.png";
import paintersImage from "@assets/generated_images/two_painters_ladder_and_ground.png";

interface PaintColor {
  id: number;
  colorName: string;
  colorCode: string;
  hexValue: string;
  brand: string;
  category: string;
  undertone?: string;
  lrv?: number;
}

export default function HomeNPP() {
  const tenant = useTenant();
  const [showEstimateModal, setShowEstimateModal] = useState(true);

  // Fetch colors for preview
  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  // Get a colorful mix - prioritize accent colors, then mix in others for variety
  const getSWColors = () => {
    const swColors = colors.filter(c => c.brand === "sherwin-williams");
    const accents = swColors.filter(c => c.category === "accent");
    const cools = swColors.filter(c => c.category === "cool");
    const warms = swColors.filter(c => c.category === "warm");
    const neutrals = swColors.filter(c => c.category === "neutral");
    // Mix: 2 accents, 1 cool, 1 warm, 2 neutrals for variety
    return [
      ...accents.slice(0, 2),
      ...cools.slice(0, 1),
      ...warms.slice(0, 1),
      ...neutrals.slice(0, 2)
    ].slice(0, 6);
  };

  const getBMColors = () => {
    const bmColors = colors.filter(c => c.brand === "benjamin-moore");
    const accents = bmColors.filter(c => c.category === "accent");
    const cools = bmColors.filter(c => c.category === "cool");
    const warms = bmColors.filter(c => c.category === "warm");
    const neutrals = bmColors.filter(c => c.category === "neutral");
    // Mix: 2 accents, 1 cool, 1 warm, 2 neutrals for variety
    return [
      ...accents.slice(0, 2),
      ...cools.slice(0, 1),
      ...warms.slice(0, 1),
      ...neutrals.slice(0, 2)
    ].slice(0, 6);
  };

  const sherwinColors = getSWColors();
  const benjaminColors = getBMColors();

  return (
    <PageLayout>
      <main className="min-h-screen">
        
        {/* HERO SECTION - Mobile-First Centered Layout */}
        <section className="relative min-h-[85vh] md:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50/70 to-white/70 px-4 py-12 pb-[100px] md:py-20 md:pb-20">
          {/* Desktop painters image - z-0 to stay behind text */}
          <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
            <div className="absolute bottom-[135px] right-[-80px] h-[80%] w-[60%]">
              <img
                src={paintersImage}
                alt="Professional painters at work"
                className="h-full w-full object-contain object-bottom opacity-90"
              />
            </div>
          </div>

          {/* Text Content - z-20 to stay above painters */}
          <div className="relative z-20 flex w-full max-w-4xl flex-col items-center space-y-6 text-center md:space-y-8 md:items-start md:text-left md:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                Nashville Painting
                <span className="block">Professionals</span>
              </h1>
              <p className="text-lg md:text-2xl text-[#800000] max-w-2xl mx-auto md:mx-0">
                Transforming familiar spaces into exceptional places
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex w-full flex-row items-center justify-center gap-3 md:w-auto md:justify-start md:gap-4"
            >
              <a href="#see-how">
                <Button size="default" className="text-sm px-4 md:px-6 bg-accent/90 text-white border-accent shadow-lg shadow-accent/20" data-testid="button-see-how">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto inline-block rounded-full bg-gray-100/55 px-4 py-2 text-xs font-medium text-gray-700 md:mx-0 md:text-sm"
            >
              Room Visualizer · Square Footage Calculator · Instant Estimates
            </motion.p>
          </div>

          {/* Mobile painters image - centered below content, shifted up visually, behind text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 z-0 w-full md:hidden pointer-events-none"
          >
            <img
              src={paintersImage}
              alt="Professional painters at work"
              className="mx-auto block w-full max-w-full object-contain -translate-y-[85px] scale-[2.309]"
            />
          </motion.div>
        </section>

        {/* HELP SLIDESHOW - See How It Works */}
        <section id="see-how" className="py-12 px-4 bg-white/55">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-[400px] md:h-[450px]">
                <HeroSlideshow />
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST & AWARDS SECTION - Bento Grid */}
        <section className="py-8 md:py-16 px-3 md:px-4 bg-gray-50/55">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: 2-column Bento Grid, Desktop: 2-column */}
            <div className="grid grid-cols-2 gap-3 md:gap-8">
              {/* Award Card - spans full width on mobile for visual impact */}
              <Link href="/awards" className="col-span-2 md:col-span-1">
                <motion.div
                  
                  className="relative h-40 md:h-80 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group bg-black"
                  data-testid="link-award-section"
                >
                  <img 
                    src={awardImage} 
                    alt="Best Painter Award 2025" 
                    className="w-full h-full object-contain mx-auto" 
                  />
                </motion.div>
              </Link>

              {/* Award Description Card */}
              <motion.div
                
                className="col-span-2 md:col-span-1 relative h-auto md:h-80 rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 p-4 md:p-8 flex flex-col justify-between border border-amber-200"
                data-testid="card-award-description"
              >
                <div className="absolute right-3 top-3 md:right-4 md:top-4 w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="p-1 md:p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600">
                      <Star className="w-3 h-3 md:w-5 md:h-5 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 text-[10px] md:text-sm">
                      2025 Winner
                    </Badge>
                  </div>
                  <h3 className="text-base md:text-2xl font-bold text-gray-900 mb-1 md:mb-2 pr-12 md:pr-0">
                    Best Painter in Nashville
                  </h3>
                  <p className="text-xs md:text-base text-gray-700 line-clamp-3 md:line-clamp-none">
                    Recognized for excellence in craftsmanship, customer service, and professional standards. Voted by Nashville homeowners as the most trusted painting company.
                  </p>
                </div>
                <Link href="/awards">
                  <div className="flex items-center gap-2 text-amber-700 mt-2 md:mt-4 cursor-pointer hover:text-amber-800 transition-colors">
                    <span className="text-[10px] md:text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEE HOW SECTION - Our Approach - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-gray-50/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
                How We Deliver Excellence
              </h2>
              <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
                Detailed estimates and project plans unique to you
              </p>
            </motion.div>

            {/* Bento Grid Layout - 2 cols on mobile, 4 cols on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {/* Large Feature Image - spans 2 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                
                className="col-span-2 md:col-span-4 relative h-56 md:h-80 rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
                
              >
                <img src={estimateImage} alt="Professional estimate consultation" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="p-4 md:p-12 max-w-lg">
                    <h3 className="text-base md:text-3xl font-bold text-white">
                      Detailed estimates unique to you
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Feature Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
                transition={{ delay: 0.1 }}
                className="col-span-1"
                
              >
                <GlassCard className="h-full p-3 md:p-6 border border-white/20 shadow-xl hover:shadow-accent/20 flex flex-col">
                  <div className="h-10 md:h-16 mb-2 md:mb-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center shadow-lg shadow-accent/20">
                      <Shield className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                    Meticulous Prep
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-600 line-clamp-3">
                    Proper masking, drop cloths, and surface prep before painting.
                  </p>
                </GlassCard>
              </motion.div>

              {/* Feature Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                transition={{ delay: 0.2 }}
                className="col-span-1"
                
              >
                <GlassCard className="h-full p-3 md:p-6 border border-white/20 shadow-xl hover:shadow-accent/20 flex flex-col">
                  <div className="h-10 md:h-16 mb-2 md:mb-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center shadow-lg shadow-accent/20">
                      <Brush className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                    Pro Painters
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-600 line-clamp-3">
                    Dedicated professionals, not day laborers. Top-tier results.
                  </p>
                </GlassCard>
              </motion.div>

              {/* Feature Card 3 - spans 2 cols on mobile for variety */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, rotateX: 3 }}
                transition={{ delay: 0.3 }}
                className="col-span-2 md:col-span-2"
                
              >
                <GlassCard className="h-full p-3 md:p-6 bg-gradient-to-br from-accent/10 to-white/80 backdrop-blur-sm border border-accent/20 shadow-xl hover:shadow-accent/30 flex flex-col">
                  <div className="h-10 md:h-16 mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                    Perfection in Every Detail
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-600 line-clamp-3">
                    From clean lines to flawless finishes, perfection down to the last brushstroke.
                  </p>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION - Interior & Exterior - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-white/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
                Our Services
              </h2>
              <p className="text-sm md:text-xl text-gray-600">
                Professional painting for every space
              </p>
            </motion.div>

            {/* 2-column Bento Grid on mobile */}
            <div className="grid grid-cols-2 gap-3 md:gap-8">
              {/* Interior */}
              <Link href="/services">
                <motion.div
                  
                  className="relative h-40 md:h-80 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
                  data-testid="link-interior-services"
                  
                >
                  <img src={interiorImage} alt="Interior Painting" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                      <div className="p-1 md:p-1.5 rounded-md bg-accent/80 shadow-lg shadow-accent/30">
                        <Home className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="text-accent font-semibold text-[10px] md:text-sm uppercase tracking-wider">Interior</span>
                    </div>
                    <h3 className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-2">Interior Painting</h3>
                    <p className="text-gray-300 text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">Walls, ceilings, trim, doors</p>
                  </div>
                </motion.div>
              </Link>

              {/* Exterior */}
              <Link href="/services">
                <motion.div
                  
                  className="relative h-40 md:h-80 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
                  data-testid="link-exterior-services"
                  
                >
                  <img src={exteriorImage} alt="Exterior Painting" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                      <div className="p-1 md:p-1.5 rounded-md bg-accent/80 shadow-lg shadow-accent/30">
                        <Building2 className="w-3 h-3 md:w-5 md:h-5 text-white" />
                      </div>
                      <span className="text-accent font-semibold text-[10px] md:text-sm uppercase tracking-wider">Exterior</span>
                    </div>
                    <h3 className="text-sm md:text-2xl font-bold text-white mb-0.5 md:mb-2">Exterior Painting</h3>
                    <p className="text-gray-300 text-[10px] md:text-sm line-clamp-1 md:line-clamp-none">Siding, trim, decks, fences</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* DIVE INTO COLOR - Color Library Preview */}
        <section className="py-20 px-4 bg-gray-50/55 dark:bg-gray-800/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                  Dive Into Color
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                  Explore our curated color library to find the perfect hue for every space
                </p>
              </div>
              <Link href="/color-library">
                <Button variant="outline" className="mt-4 md:mt-0 gap-2" data-testid="link-color-library">
                  View Full Library
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Sherwin-Williams Colors */}
            <div className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                Sherwin-Williams
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {sherwinColors.map((color) => (
                  <motion.div
                    key={color.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex-shrink-0 w-40"
                    data-testid={`color-card-${color.id}`}
                  >
                    <div 
                      className="h-32 rounded-t-xl"
                      style={{ backgroundColor: color.hexValue }}
                    />
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{color.colorName}</p>
                      <p className="text-xs text-gray-500">{color.colorCode}</p>
                    </div>
                  </motion.div>
                ))}
                <Link href="/color-library">
                  <motion.div
                    
                    className="flex-shrink-0 w-40 h-[176px] rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 cursor-pointer hover:border-accent transition-all hover:shadow-lg"
                  >
                    <div className="h-24 grid grid-cols-3 grid-rows-2 gap-0.5 p-1">
                      {colors.filter(c => c.brand === "sherwin-williams" && c.category === "accent").slice(0, 6).map((c, i) => (
                        <div key={i} className="rounded-sm" style={{ backgroundColor: c.hexValue }} />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 h-[52px] bg-white/80 dark:bg-gray-900/80">
                      <span className="text-sm font-medium text-accent">See All Colors</span>
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Benjamin Moore Colors */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                Benjamin Moore
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {benjaminColors.map((color) => (
                  <motion.div
                    key={color.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex-shrink-0 w-40"
                    data-testid={`color-card-${color.id}`}
                  >
                    <div 
                      className="h-32 rounded-t-xl"
                      style={{ backgroundColor: color.hexValue }}
                    />
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-b-xl border border-t-0 border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{color.colorName}</p>
                      <p className="text-xs text-gray-500">{color.colorCode}</p>
                    </div>
                  </motion.div>
                ))}
                <Link href="/color-library">
                  <motion.div
                    
                    className="flex-shrink-0 w-40 h-[176px] rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 cursor-pointer hover:border-accent transition-all hover:shadow-lg"
                  >
                    <div className="h-24 grid grid-cols-3 grid-rows-2 gap-0.5 p-1">
                      {colors.filter(c => c.brand === "benjamin-moore" && c.category === "accent").slice(0, 6).map((c, i) => (
                        <div key={i} className="rounded-sm" style={{ backgroundColor: c.hexValue }} />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 h-[52px] bg-white/80 dark:bg-gray-900/80">
                      <span className="text-sm font-medium text-accent">See All Colors</span>
                      <ArrowRight className="w-4 h-4 text-accent" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT TO EXPECT - Process & Timing - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-white/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
                What to Expect
              </h2>
              <p className="text-sm md:text-xl text-gray-600">
                Our process from start to finish
              </p>
            </motion.div>

            {/* 2x2 Bento Grid on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                transition={{ delay: 0.1 }}
                
              >
                <GlassCard className="h-full p-3 md:p-6  text-center shadow-xl hover:shadow-accent/20 border border-gray-100">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg shadow-accent/20">
                    <Calendar className="w-5 h-5 md:w-8 md:h-8 text-accent" />
                  </div>
                  <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Day 1: Prep</h3>
                  <p className="text-gray-600 text-[9px] md:text-sm line-clamp-3">
                    Furniture moving, cleaning, patching, taping edges
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                transition={{ delay: 0.2 }}
                
              >
                <GlassCard className="h-full p-3 md:p-6  text-center shadow-xl hover:shadow-accent/20 border border-gray-100">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg shadow-accent/20">
                    <Brush className="w-5 h-5 md:w-8 md:h-8 text-accent" />
                  </div>
                  <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Day 2-3: Paint</h3>
                  <p className="text-gray-600 text-[9px] md:text-sm line-clamp-3">
                    Primer, first coat, drying, second coat
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                transition={{ delay: 0.3 }}
                
              >
                <GlassCard className="h-full p-3 md:p-6  text-center shadow-xl hover:shadow-accent/20 border border-gray-100">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg shadow-accent/20">
                    <Clock className="w-5 h-5 md:w-8 md:h-8 text-accent" />
                  </div>
                  <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Drying Time</h3>
                  <p className="text-gray-600 text-[9px] md:text-sm line-clamp-3">
                    Touch dry: 1-2 hrs. Full cure: 2-4 weeks
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                transition={{ delay: 0.4 }}
                
              >
                <GlassCard className="h-full p-3 md:p-6 bg-gradient-to-br from-accent/10 to-white/90 backdrop-blur-sm text-center shadow-xl hover:shadow-accent/30 border border-accent/20">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg shadow-accent/30">
                    <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Walkthrough</h3>
                  <p className="text-gray-600 text-[9px] md:text-sm line-clamp-3">
                    Touch-ups, cleanup, satisfaction guaranteed
                  </p>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* COLORS & SHEENS - Educational Content - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-gray-50/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
                Colors & Sheens Guide
              </h2>
              <p className="text-sm md:text-xl text-gray-600">
                Understanding paint finishes for your project
              </p>
            </motion.div>

            {/* 2-column Bento Grid on mobile, 3 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {[
                { name: "Flat/Matte", desc: "No shine, hides imperfections. Best for ceilings.", icon: Layers },
                { name: "Eggshell", desc: "Slight sheen, easy to clean. For living rooms.", icon: Droplets },
                { name: "Satin", desc: "Soft glow, durable. For kitchens & baths.", icon: Sparkles },
                { name: "Semi-Gloss", desc: "Noticeable shine. Ideal for doors & trim.", icon: Shield },
                { name: "High-Gloss", desc: "Maximum shine & durability. Accent pieces.", icon: Star },
                { name: "Primer", desc: "Seals surfaces. Essential for bare wood.", icon: Brush },
              ].map((sheen, index) => (
                <motion.div
                  key={sheen.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  
                  transition={{ delay: index * 0.05 }}
                  
                >
                  <GlassCard className="h-full p-3 md:p-6  shadow-xl hover:shadow-accent/20 border border-gray-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-2 md:mb-4 shadow-lg shadow-accent/20">
                      <sheen.icon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">{sheen.name}</h3>
                    <p className="text-gray-600 text-[9px] md:text-sm line-clamp-3">{sheen.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE AREA - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* 2-column Bento Grid on mobile */}
            <div className="grid grid-cols-2 gap-3 md:gap-8 items-stretch">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="col-span-2 md:col-span-1 flex flex-col justify-center"
              >
                <h2 className="text-xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-6">
                  Serving Nashville & Beyond
                </h2>
                <p className="text-xs md:text-xl text-gray-600 mb-3 md:mb-6">
                  Proudly serving the greater Nashville metro area.
                </p>
                {/* Cities Grid - 4 cols on mobile */}
                <div className="grid grid-cols-4 md:grid-cols-2 gap-1.5 md:gap-4">
                  {["Nashville", "Franklin", "Brentwood", "Murfreesboro", "Hendersonville", "Mt. Juliet", "Gallatin", "Lebanon"].map((city) => (
                    <div key={city} className="flex items-center gap-1 md:gap-2 bg-gray-50 rounded-lg p-1.5 md:p-2">
                      <MapPin className="w-2.5 h-2.5 md:w-4 md:h-4 text-accent flex-shrink-0" />
                      <span className="text-gray-700 text-[8px] md:text-sm truncate">{city}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              {/* Map Image */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                
                viewport={{ once: true }}
                className="col-span-2 md:col-span-1 relative h-40 md:h-80 rounded-xl md:rounded-2xl overflow-hidden shadow-xl"
                
              >
                <img src={mapImage} alt="Nashville Service Area" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* END-TO-END COMMUNICATION - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-gray-50/55">
          <div className="max-w-6xl mx-auto">
            {/* 2-column Bento Grid on mobile */}
            <div className="grid grid-cols-2 gap-3 md:gap-8 items-stretch">
              {/* Title - spans full width on mobile for hierarchy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-2 md:col-span-1 order-1 md:order-2 flex flex-col justify-center"
              >
                <h2 className="text-xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-6">
                  Stay Connected
                </h2>
                <p className="text-xs md:text-xl text-gray-600">
                  Transparent communication from estimate to final walkthrough.
                </p>
              </motion.div>
              {/* Feature Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                
                viewport={{ once: true }}
                className="col-span-2 md:col-span-1 order-2 md:order-1"
                
              >
                <GlassCard className="p-4 md:p-8  shadow-xl border border-gray-100">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mb-3 md:mb-6 shadow-lg shadow-accent/30">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-base md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">
                    End-to-End Communication
                  </h3>
                  <p className="text-xs md:text-base text-gray-600 mb-3 md:mb-6 line-clamp-2 md:line-clamp-none">
                    Daily text updates on project progress. Always know what's happening.
                  </p>
                  <div className="grid grid-cols-2 gap-2 md:space-y-3 md:block">
                    {["Daily updates", "Photo docs", "Direct line", "Real-time"].map((item) => (
                      <div key={item} className="flex items-center gap-1.5 md:gap-2 text-gray-700">
                        <CheckCircle2 className="w-3 h-3 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-[10px] md:text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-white/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
                What Our Customers Say
              </h2>
              <p className="text-sm md:text-xl text-gray-600">
                Join hundreds of satisfied homeowners
              </p>
            </motion.div>

            {/* 2-column Bento Grid on mobile, 3 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {[
                {
                  name: "James P.",
                  review: "Extremely impressed with the professionalism and quality. The team was friendly from start to finish...",
                  rating: 5
                },
                {
                  name: "Sarah M.",
                  review: "Best painter experience ever. Quick quote, superb communication, and great project schedule...",
                  rating: 5
                },
                {
                  name: "Bill D.",
                  review: "Most professional painting experience ever. Excellent work and amazing communication throughout...",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateX: 3 }}
                  transition={{ delay: index * 0.1 }}
                  className={index === 2 ? "col-span-2 md:col-span-1" : "col-span-1"}
                  
                >
                  <GlassCard className="h-full p-3 md:p-6  shadow-xl hover:shadow-accent/20 border border-gray-100">
                    <div className="flex gap-0.5 md:gap-1 mb-2 md:mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-[10px] md:text-sm mb-2 md:mb-4 line-clamp-3 md:line-clamp-4">
                      {testimonial.review}
                    </p>
                    <p className="font-semibold text-gray-900 text-xs md:text-base">{testimonial.name}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-4 md:mt-8">
              <a 
                href="https://www.google.com/search?q=nashville+painting+professionals+reviews" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2 text-xs md:text-sm" data-testid="link-google-reviews">
                  See All Reviews
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* RESOURCES HUB - Bento Grid */}
        <section className="py-10 md:py-20 px-3 md:px-4 bg-gray-50/55">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-6 md:mb-16"
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-2 md:mb-4">
                Resources & Guides
              </h2>
              <p className="text-sm md:text-xl text-gray-600">
                Everything you need for your painting project
              </p>
            </motion.div>

            {/* 2x2 Bento Grid on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <Link href="/color-library">
                <motion.div 
                   
                  data-testid="link-resource-colors"
                  
                >
                  <GlassCard className="h-full p-3 md:p-6  cursor-pointer shadow-xl hover:shadow-accent/20 border border-gray-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-2 md:mb-4 shadow-lg shadow-accent/20">
                      <Palette className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Color Library</h3>
                    <p className="text-gray-600 text-[9px] md:text-sm line-clamp-2">
                      Browse professional paint colors
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>

              <Link href="/terms-warranty">
                <motion.div 
                   
                  data-testid="link-resource-warranty"
                  
                >
                  <GlassCard className="h-full p-3 md:p-6  cursor-pointer shadow-xl hover:shadow-accent/20 border border-gray-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-2 md:mb-4 shadow-lg shadow-accent/20">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Warranty</h3>
                    <p className="text-gray-600 text-[9px] md:text-sm line-clamp-2">
                      {tenant.credentials?.warrantyYears || 3}-year guarantee
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>

              <Link href="/help">
                <motion.div 
                   
                  data-testid="link-resource-faq"
                  
                >
                  <GlassCard className="h-full p-3 md:p-6  cursor-pointer shadow-xl hover:shadow-accent/20 border border-gray-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-2 md:mb-4 shadow-lg shadow-accent/20">
                      <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">FAQs</h3>
                    <p className="text-gray-600 text-[9px] md:text-sm line-clamp-2">
                      Common questions answered
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>

              <Link href="/services">
                <motion.div 
                   
                  data-testid="link-resource-glossary"
                  
                >
                  <GlassCard className="h-full p-3 md:p-6 bg-gradient-to-br from-accent/10 to-white/90 backdrop-blur-sm cursor-pointer shadow-xl hover:shadow-accent/30 border border-accent/20">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mb-2 md:mb-4 shadow-lg shadow-accent/30">
                      <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-1 md:mb-2">Services</h3>
                    <p className="text-gray-600 text-[9px] md:text-sm line-clamp-2">
                      Full service details
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA - Mobile Optimized */}
        <section className="py-12 md:py-24 px-3 md:px-4 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              
              viewport={{ once: true }}
              
            >
              <h2 className="text-2xl md:text-5xl font-display font-bold text-gray-900 mb-3 md:mb-6">
                Know Your Price in Seconds
              </h2>
              <p className="text-sm md:text-xl text-gray-600 mb-4 md:mb-8">
                No waiting. No guessing. Our smart estimator calculates your project cost instantly.
              </p>
              <Link href="/estimate">
                <Button size="lg" className="text-sm md:text-lg px-6 md:px-12 py-4 md:py-6 gap-2 shadow-xl shadow-accent/30" data-testid="button-final-cta">
                  See My Price Now
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      
      <PWAInstallPrompt />

      {/* Estimate Modal - Appears on every visit */}
      <Dialog open={showEstimateModal} onOpenChange={setShowEstimateModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-accent to-accent/80 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Get Your Free Estimate
              </DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-white/90">
              See your project price in under 60 seconds with our smart estimator.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Instant pricing - no waiting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Room visualizer included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No commitment required</span>
              </div>
            </div>
            <Link href="/estimate" className="block">
              <Button 
                size="lg" 
                className="w-full gap-2 shadow-lg"
                onClick={() => setShowEstimateModal(false)}
                data-testid="button-modal-estimate"
              >
                See My Price Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <button 
              onClick={() => setShowEstimateModal(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              data-testid="button-modal-dismiss"
            >
              I'll look around first
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
