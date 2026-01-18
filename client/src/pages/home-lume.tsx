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
  Sparkles,
  Phone
} from "lucide-react";
import { motion } from "framer-motion";
import { LeadCaptureModal } from "@/components/lead-generation/lead-capture-modal";

import lumeLogo from "@assets/generated_images/gray_black_lume_logo.png";
import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";

interface PaintColor {
  id: number;
  colorName: string;
  colorCode: string;
  hexValue: string;
  brand: string;
  category: string;
}

export default function HomeLume() {
  const tenant = useTenant();

  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  const getColorSamples = () => {
    const swColors = colors.filter(c => c.brand === "sherwin-williams");
    const neutrals = swColors.filter(c => c.category === "neutral");
    const warms = swColors.filter(c => c.category === "warm");
    return [...neutrals.slice(0, 3), ...warms.slice(0, 3)].slice(0, 6);
  };

  const colorSamples = getColorSamples();

  return (
    <PageLayout>
      <LeadCaptureModal tenantId={tenant.id} tenantName={tenant.name} />
      
      <main className="min-h-screen bg-white">
        
        {/* HERO SECTION - Gradient band with Lume text */}
        <section 
          className="w-full py-20 md:py-32"
          style={{
            background: 'linear-gradient(to right, white 0%, #d1d5db 30%, #9ca3af 50%, #d1d5db 70%, white 100%)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <h1 
              className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-wide text-gray-800"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Lume
            </h1>
          </motion.div>
        </section>

        {/* Tagline Section - White background */}
        <section className="bg-white py-16 md:py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight mb-6">
              We elevate the backdrop
              <span className="block font-medium text-gray-900">of your life.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-10">
              Premium painting services with meticulous attention to detail.
              Nashville's choice for refined spaces.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-700" />
                <span>Licensed & Insured</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-700" />
                <span>3-Year Warranty</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SERVICES SECTION - Clean Grid */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-3">
                Our Services
              </h2>
              <div className="w-16 h-0.5 bg-gray-400 mx-auto" />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={interiorImage} 
                    alt="Interior Painting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-5 h-5 text-gray-700" />
                    <h3 className="text-xl font-medium text-gray-800">Interior Painting</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Transform your living spaces with premium paints and expert craftsmanship.
                    Walls, ceilings, trim, and doors.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={exteriorImage} 
                    alt="Exterior Painting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-gray-700" />
                    <h3 className="text-xl font-medium text-gray-800">Exterior Painting</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Protect and beautify your home's exterior with weather-resistant finishes
                    built to last.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WHY LUME SECTION */}
        <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-gray-100/50 to-gray-50/30">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-3">
                Why Choose Lume
              </h2>
              <div className="w-16 h-0.5 bg-gray-400 mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "Premium Quality",
                  description: "We use only top-tier paints and materials for lasting beauty."
                },
                {
                  icon: Clock,
                  title: "Timely Service",
                  description: "Projects completed on schedule with minimal disruption."
                },
                {
                  icon: Shield,
                  title: "Guaranteed Work",
                  description: "3-year warranty on all painting services we provide."
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COLOR INSPIRATION */}
        {colorSamples.length > 0 && (
          <section className="py-16 md:py-24 px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-3">
                  Color Inspiration
                </h2>
                <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Curated palettes for refined spaces</p>
              </motion.div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                {colorSamples.map((color, index) => (
                  <motion.div
                    key={color.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div 
                      className="aspect-square rounded-xl shadow-sm group-hover:shadow-md transition-all"
                      style={{ backgroundColor: color.hexValue }}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center truncate">
                      {color.colorName}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/colors">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" data-testid="button-view-colors">
                    View Full Color Library
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SERVICE AREA */}
        <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-gray-100/50 to-gray-50/30">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-700" />
                <h2 className="text-2xl md:text-3xl font-light text-gray-800">
                  Serving Greater Nashville
                </h2>
              </div>
              <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-6" />
              <p className="text-gray-600 mb-4">
                Nashville · Franklin · Brentwood · Murfreesboro · Hendersonville
              </p>
              <p className="text-sm text-gray-500">
                and surrounding areas
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-gray-100/60 to-gray-50/40">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-4xl font-light text-gray-800 mb-4">
                Ready to transform your space?
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                Get a free, no-obligation estimate for your painting project.
                We'll respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/estimate">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-8 shadow-lg"
                    data-testid="button-get-estimate"
                  >
                    Get Your Free Estimate
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="tel:+16155550123">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-gray-400 text-gray-700 hover:bg-gray-50 px-8"
                    data-testid="button-call-us"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </PageLayout>
  );
}
