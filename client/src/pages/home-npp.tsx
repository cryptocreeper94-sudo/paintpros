import { useState } from "react";
import { Link } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
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
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

// Import images
import awardImage from "@assets/Screenshot_20251216_195245_Replit_1765936399782.jpg";
import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import colorWheelImage from "@assets/generated_images/paint_color_wheel_white_bg.png";
import crewImage from "@assets/generated_images/professional_painting_crew_at_work.png";
import painterCutout from "@assets/generated_images/isolated_painter_with_paint_stroke_only.png";
import estimateImage from "@assets/generated_images/painter_consulting_homeowner_estimate.png";
import solanaLogo from "@assets/solana-logo-transparent.png";

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

  // Fetch colors for preview
  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  const sherwinColors = colors.filter(c => c.brand === "sherwin-williams").slice(0, 6);
  const benjaminColors = colors.filter(c => c.brand === "benjamin-moore").slice(0, 6);

  return (
    <PageLayout>
      <main className="min-h-screen">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          {/* Painter with paint stroke effect - positioned on left side */}
          <div className="absolute left-0 bottom-0 md:left-10 lg:left-20 hidden md:block z-10">
            <img 
              src={painterCutout} 
              alt="" 
              className="h-[70vh] w-auto object-contain object-bottom opacity-90"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-tight">
                Paint Your Home
                <span className="block text-accent">The Right Way</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mt-6 max-w-2xl mx-auto">
                Nashville's Most Trusted Painters
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/estimate">
                <Button size="lg" className="text-lg px-8 py-6 gap-2" data-testid="button-hero-estimate">
                  Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#see-how">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6" data-testid="button-see-how">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free estimates · No obligation · Licensed & Insured
            </p>
          </div>
        </section>

        {/* TRUST & AWARDS SECTION */}
        <section className="py-16 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Award Card */}
              <Link href="/awards">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-auto md:h-80 rounded-2xl overflow-hidden cursor-pointer group bg-black"
                  data-testid="link-award-section"
                >
                  <img 
                    src={awardImage} 
                    alt="Best Painter Award 2025" 
                    className="w-full h-full object-contain mx-auto" 
                  />
                </motion.div>
              </Link>

              {/* Solana Verification Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative min-h-[280px] md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-teal-900 p-5 md:p-8 flex flex-col justify-between"
                data-testid="card-solana-verification"
              >
                <img src={solanaLogo} alt="" className="absolute right-4 top-4 w-16 h-16 md:w-24 md:h-24 opacity-30" />
                <div>
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-purple-500 to-teal-400">
                      <BadgeCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-teal-400 text-white border-0 text-xs md:text-sm">
                      Industry First
                    </Badge>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Solana Blockchain Verified
                  </h3>
                  <p className="text-sm md:text-base text-gray-300">
                    Every document immutably stamped for anti-fraud protection
                  </p>
                </div>
                <div className="flex items-center gap-2 text-teal-400 mt-4">
                  <span className="text-xs md:text-sm font-medium">Learn how we protect you</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SEE HOW SECTION - Our Approach */}
        <section id="see-how" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                How We Deliver Excellence
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Detailed estimates and project plans unique to you
              </p>
            </motion.div>

            {/* Large Feature Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8"
            >
              <img src={estimateImage} alt="Professional estimate consultation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="p-8 md:p-12 max-w-lg">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Detailed estimates and project plans unique to you
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* Three Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Meticulous Preparation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We protect your home with proper masking, drop cloths, and surface prep before any paint touches your walls.
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Brush className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Full-Time Professional Painters
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our crew are dedicated professionals, not day laborers. Top-tier results from experienced craftsmen.
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Perfection in Every Detail
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    From clean lines to flawless finishes, we deliver perfection down to the last brushstroke.
                  </p>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION - Interior & Exterior */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Professional painting for every space
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Interior */}
              <Link href="/services">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
                  data-testid="link-interior-services"
                >
                  <img src={interiorImage} alt="Interior Painting" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-5 h-5 text-accent" />
                      <span className="text-accent font-semibold text-sm uppercase tracking-wider">Interior</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Interior Painting</h3>
                    <p className="text-gray-300 text-sm">Walls, ceilings, trim, doors, and cabinets</p>
                  </div>
                </motion.div>
              </Link>

              {/* Exterior */}
              <Link href="/services">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
                  data-testid="link-exterior-services"
                >
                  <img src={exteriorImage} alt="Exterior Painting" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-accent" />
                      <span className="text-accent font-semibold text-sm uppercase tracking-wider">Exterior</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Exterior Painting</h3>
                    <p className="text-gray-300 text-sm">Siding, trim, decks, fences, and more</p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* DIVE INTO COLOR - Color Library Preview */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
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
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-40 h-[176px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
                  >
                    <div className="text-center">
                      <ArrowRight className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">See All</span>
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
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-40 h-[176px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-accent transition-colors"
                  >
                    <div className="text-center">
                      <ArrowRight className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">See All</span>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT TO EXPECT - Process & Timing */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                What to Expect
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Our process from start to finish
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Day 1: Prep</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Furniture moving, surface cleaning, patching holes, taping edges, laying drop cloths
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Brush className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Day 2-3: Painting</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Primer application, first coat, drying time (2-4 hours), second coat for full coverage
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Drying Time</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Touch dry: 1-2 hours. Recoat: 4 hours. Full cure: 2-4 weeks (avoid scrubbing)
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Final Walkthrough</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Touch-ups, cleanup, furniture replacement, and your satisfaction guaranteed
                  </p>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* COLORS & SHEENS - Educational Content */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Colors & Sheens Guide
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Understanding paint finishes for your project
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Flat/Matte", desc: "No shine, hides imperfections. Best for ceilings and low-traffic areas.", icon: Layers },
                { name: "Eggshell", desc: "Slight sheen, easy to clean. Perfect for living rooms and bedrooms.", icon: Droplets },
                { name: "Satin", desc: "Soft glow, durable. Great for kitchens, bathrooms, and trim.", icon: Sparkles },
                { name: "Semi-Gloss", desc: "Noticeable shine, very durable. Ideal for doors, cabinets, and trim.", icon: Shield },
                { name: "High-Gloss", desc: "Maximum shine and durability. Best for accent pieces and high-wear areas.", icon: Star },
                { name: "Primer", desc: "Seals surfaces for better paint adhesion. Essential for bare wood and repairs.", icon: Brush },
              ].map((sheen, index) => (
                <motion.div
                  key={sheen.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full p-6 bg-white dark:bg-gray-900">
                    <sheen.icon className="w-8 h-8 text-accent mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{sheen.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{sheen.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  Serving Nashville & Beyond
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  Proudly serving the greater Nashville metro area and surrounding communities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {["Nashville", "Franklin", "Brentwood", "Murfreesboro", "Hendersonville", "Mt. Juliet", "Gallatin", "Lebanon"].map((city) => (
                    <div key={city} className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-gray-700 dark:text-gray-300">{city}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative h-80 rounded-2xl overflow-hidden"
              >
                <img src={mapImage} alt="Nashville Service Area" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/30 to-transparent" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* END-TO-END COMMUNICATION */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <GlassCard className="p-8 bg-white dark:bg-gray-900">
                  <MessageSquare className="w-12 h-12 text-accent mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    End-to-End Communication
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Our project managers keep you up to date on project progress with daily text updates. 
                    You'll always know what's happening and what to expect next.
                  </p>
                  <ul className="space-y-3">
                    {["Daily progress updates", "Photo documentation", "Direct line to your project manager", "Real-time scheduling changes"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="order-1 md:order-2"
              >
                <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  Stay Connected
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  We believe in transparent communication. From your first estimate to the final walkthrough, 
                  you'll never be left wondering about your project status.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS */}
        <section className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Join hundreds of satisfied homeowners
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "James P.",
                  review: "I recently had the pleasure of having Nashville Painting Professionals paint several interior spaces of my home, and I am extremely impressed with the level of professionalism and quality of work they provided. From the initial contact to the final walkthrough, the team was friendly...",
                  rating: 5
                },
                {
                  name: "Sarah M.",
                  review: "Best painter experience we've ever had. Getting a quote was quick and simple and didn't require anyone to come to our house. Communication was superb and clear. Loved the Project Schedule we got ahead of time that outlined our preferences...",
                  rating: 5
                },
                {
                  name: "Bill D.",
                  review: "I have never had a painting experience as professional as Nashville Painting Professionals. Not only was the work they did excellent, but the communication blew me away. I received an email the week of my job telling me exactly which colors would be used...",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full p-6 bg-white dark:bg-gray-900">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-4">
                      {testimonial.review}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a 
                href="https://www.google.com/search?q=nashville+painting+professionals+reviews" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2" data-testid="link-google-reviews">
                  See All Reviews
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* RESOURCES HUB */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Resources & Guides
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Everything you need to know about your painting project
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/color-library">
                <motion.div whileHover={{ scale: 1.03 }} data-testid="link-resource-colors">
                  <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 cursor-pointer">
                    <Palette className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Color Library</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Browse our curated collection of professional paint colors
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>

              <Link href="/terms-warranty">
                <motion.div whileHover={{ scale: 1.03 }} data-testid="link-resource-warranty">
                  <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 cursor-pointer">
                    <Shield className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Warranty Info</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Learn about our {tenant.credentials?.warrantyYears || 3}-year workmanship guarantee
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>

              <Link href="/help">
                <motion.div whileHover={{ scale: 1.03 }} data-testid="link-resource-faq">
                  <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 cursor-pointer">
                    <HelpCircle className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">FAQs</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Answers to commonly asked questions about our services
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>

              <Link href="/services">
                <motion.div whileHover={{ scale: 1.03 }} data-testid="link-resource-glossary">
                  <GlassCard className="h-full p-6 bg-white dark:bg-gray-900 cursor-pointer">
                    <BookOpen className="w-10 h-10 text-accent mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Service Details</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Detailed information about each service we offer
                    </p>
                  </GlassCard>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 px-4 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
                Ready to Transform Your Space?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Get your free estimate today and see why we're Nashville's most trusted painters.
              </p>
              <Link href="/estimate">
                <Button size="lg" className="text-lg px-12 py-6 gap-2" data-testid="button-final-cta">
                  Get Your Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      
      <PWAInstallPrompt />
    </PageLayout>
  );
}
