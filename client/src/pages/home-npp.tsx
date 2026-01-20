import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  Calculator,
  X,
  Camera,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

import awardImage from "@assets/Screenshot_20251216_195245_Replit_1765936399782.jpg";
import interiorImage from "@assets/generated_images/interior_wall_painting.png";
import exteriorImage from "@assets/generated_images/exterior_painting.png";
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";
import crewImage from "@assets/generated_images/professional_painting_crew_at_work.png";
import estimateImage from "@assets/generated_images/painter_consulting_homeowner_estimate.png";
import paintersImage from "@assets/generated_images/two_painters_ladder_and_ground.png";

interface PaintColor {
  id: number;
  colorName: string;
  colorCode: string;
  hexValue: string;
  brand: string;
  category: string;
}

export default function HomeNPP() {
  const tenant = useTenant();
  const [, setLocation] = useLocation();
  const [showEstimateModal, setShowEstimateModal] = useState(true);

  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  const sherwinColors = colors.filter(c => c.brand === "sherwin-williams").slice(0, 6);
  const benjaminColors = colors.filter(c => c.brand === "benjamin-moore").slice(0, 6);

  return (
    <PageLayout>
      <main className="min-h-screen">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
            <img src={crewImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                Paint Your Home
                <span className="block text-accent">The Right Way</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
                {tenant.tagline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="py-20 px-4">
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
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional painting solutions for every need
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassCard className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interior Painting</h3>
                <p className="text-muted-foreground">
                  Walls, ceilings, trim, and doors with premium finishes and meticulous attention to detail.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Exterior Painting</h3>
                <p className="text-muted-foreground">
                  Weather-resistant coatings that protect your home and enhance curb appeal.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cabinet Refinishing</h3>
                <p className="text-muted-foreground">
                  Transform your kitchen without the cost of full cabinet replacement.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Why Choose Us
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold">{tenant.credentials?.googleRating || "5.0"}</div>
                <div className="text-muted-foreground">Google Rating</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold">{tenant.credentials?.yearsInBusiness || "15"}+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-muted-foreground">Licensed & Insured</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold">24hr</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE AREA MAP */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Proudly Serving Nashville & Surrounding Areas
              </h2>
            </motion.div>

            <div className="relative rounded-2xl overflow-hidden">
              <img src={mapImage} alt="Service area map" className="w-full h-64 md:h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {["Nashville", "Franklin", "Brentwood", "Murfreesboro", "Hendersonville", "Mt. Juliet"].map((city) => (
                    <Badge key={city} variant="secondary" className="text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-4 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get an instant estimate using our AI-powered tool
            </p>
            <Link href="/estimate">
              <Button size="lg" className="gap-2" data-testid="button-cta-estimate">
                Get Your Free Estimate <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <PWAInstallPrompt />

      {/* Auto-opening Estimate Modal */}
      <AnimatePresence>
        {showEstimateModal && (
          <Dialog open={showEstimateModal} onOpenChange={setShowEstimateModal}>
            <DialogContent className="sm:max-w-md border-primary/20">
              <button
                onClick={() => setShowEstimateModal(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                data-testid="button-close-modal"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Get Your Instant Estimate</h2>
                <p className="text-muted-foreground mb-4">
                  Answer a few quick questions and get an accurate price in under 2 minutes.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary/80 mb-4">
                  <Smartphone className="w-4 h-4" />
                  <span>Use your phone to measure rooms and match colors</span>
                </div>
                
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => {
                    setShowEstimateModal(false);
                    setLocation("/estimate");
                  }}
                  data-testid="button-start-estimate"
                >
                  Start My Estimate <ArrowRight className="w-4 h-4" />
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  No commitment required. Free instant pricing.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
