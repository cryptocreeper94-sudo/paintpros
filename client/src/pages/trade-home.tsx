import { Link } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  Phone,
  Calendar,
  Users,
  Award,
  Handshake,
  Heart,
  Target,
  Wrench,
  Building2,
  Home,
  Zap,
  Droplets,
  TreeDeciduous,
  HardHat,
  Flame,
  Palette
} from "lucide-react";

import roofingHero from "../assets/generated_images/roofing_hero.png";
import hvacHero from "../assets/generated_images/hvac_hero.png";
import electricalHero from "../assets/generated_images/electrical_hero.png";
import plumbingHero from "../assets/generated_images/plumbing_hero.png";
import landscapingHero from "../assets/generated_images/landscaping_hero.png";
import constructionHero from "../assets/generated_images/construction_hero.png";
import paintingHero from "../assets/generated_images/painting_hero.png";

const tradeData: Record<string, {
  hero: string;
  icon: typeof Home;
  services: { title: string; description: string }[];
  benefits: string[];
}> = {
  painting: {
    hero: paintingHero,
    icon: Palette,
    services: [
      { title: "Interior Painting", description: "Walls, ceilings, trim, and accent features" },
      { title: "Exterior Painting", description: "Complete exterior transformations with quality finishes" },
      { title: "Cabinet Refinishing", description: "Refresh your cabinets without full replacement" },
      { title: "Commercial Painting", description: "Professional painting for businesses and offices" },
    ],
    benefits: ["Free estimates", "Licensed & insured", "Premium paints", "Satisfaction guaranteed"],
  },
  roofing: {
    hero: roofingHero,
    icon: Home,
    services: [
      { title: "Roof Inspections", description: "Comprehensive inspections to identify issues before they become costly repairs" },
      { title: "Roof Repairs", description: "Professional repairs for leaks, storm damage, and wear" },
      { title: "New Installations", description: "Complete roof replacement with quality materials and expert craftsmanship" },
      { title: "Commercial Roofing", description: "Specialized solutions for businesses and commercial properties" },
    ],
    benefits: ["Free inspections", "Licensed & insured", "Quality materials", "Warranty included"],
  },
  hvac: {
    hero: hvacHero,
    icon: Flame,
    services: [
      { title: "AC Repair", description: "Fast, reliable air conditioning repair to keep you cool" },
      { title: "Heating Services", description: "Furnace repair, maintenance, and installation" },
      { title: "System Installation", description: "New HVAC system design and professional installation" },
      { title: "Maintenance Plans", description: "Preventative maintenance to extend system life" },
    ],
    benefits: ["24/7 emergency service", "Licensed technicians", "Energy efficient", "Financing available"],
  },
  electrical: {
    hero: electricalHero,
    icon: Zap,
    services: [
      { title: "Panel Upgrades", description: "Electrical panel upgrades to meet modern demands" },
      { title: "Wiring & Rewiring", description: "Safe, code-compliant wiring for homes and businesses" },
      { title: "EV Charger Install", description: "Electric vehicle charger installation for your home" },
      { title: "Emergency Repairs", description: "Fast response for electrical emergencies" },
    ],
    benefits: ["Licensed electricians", "Code compliant", "Safety focused", "Free estimates"],
  },
  plumbing: {
    hero: plumbingHero,
    icon: Droplets,
    services: [
      { title: "Drain Cleaning", description: "Professional drain clearing and maintenance" },
      { title: "Water Heaters", description: "Repair and installation of water heating systems" },
      { title: "Pipe Repair", description: "Fix leaks, bursts, and damaged pipes" },
      { title: "Fixture Installation", description: "Sinks, toilets, faucets, and more" },
    ],
    benefits: ["24/7 emergency", "Licensed plumbers", "Upfront pricing", "Guaranteed work"],
  },
  landscaping: {
    hero: landscapingHero,
    icon: TreeDeciduous,
    services: [
      { title: "Lawn Care", description: "Regular mowing, fertilization, and maintenance" },
      { title: "Landscape Design", description: "Custom designs to transform your outdoor space" },
      { title: "Hardscaping", description: "Patios, walkways, retaining walls, and more" },
      { title: "Irrigation", description: "Sprinkler system installation and repair" },
    ],
    benefits: ["Custom designs", "Seasonal services", "Eco-friendly", "Free consultations"],
  },
  construction: {
    hero: constructionHero,
    icon: HardHat,
    services: [
      { title: "New Construction", description: "Ground-up building for residential and commercial" },
      { title: "Remodeling", description: "Kitchen, bathroom, and whole-home renovations" },
      { title: "Additions", description: "Room additions and home expansions" },
      { title: "Commercial Buildouts", description: "Office and retail space construction" },
    ],
    benefits: ["Licensed contractors", "Project management", "Quality craftsmanship", "On-time delivery"],
  },
};

const coreValues = [
  { icon: Shield, title: "Trust", description: "Verified, vetted professionals" },
  { icon: Heart, title: "Honor", description: "Integrity in every job" },
  { icon: Award, title: "Value", description: "Quality work, fair prices" },
  { icon: Handshake, title: "Service", description: "Customer satisfaction first" },
];

export default function TradeHome() {
  const tenant = useTenant();
  const tradeVertical = tenant.tradeVertical || "roofing";
  const data = tradeData[tradeVertical] || tradeData.roofing;
  const TradeIcon = data.icon;

  return (
    <PageLayout>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={data.hero} 
              alt={`${tenant.name} professional services`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-6xl mx-auto px-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Shield className="w-3 h-3 mr-1" />
                  TrustLayer Verified
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4" data-testid="text-hero-title">
                  {tenant.name}
                </h1>
                
                <p className="text-xl text-white/90 mb-6" data-testid="text-hero-tagline">
                  {tenant.tagline}
                </p>
                
                <p className="text-white/70 mb-8 max-w-lg" data-testid="text-hero-description">
                  {tenant.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="gap-2"
                    asChild
                    data-testid="button-get-estimate"
                  >
                    <Link href="/estimate">
                      Get Free Estimate
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2 border-white/30 text-white bg-white/10 backdrop-blur-sm"
                    asChild
                    data-testid="button-call-now"
                  >
                    <a href={`tel:${tenant.phone || '1-800-TRUST'}`}>
                      <Phone className="w-4 h-4" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-muted/50 border-y">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {data.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" data-testid={`text-benefit-${i}`}>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4">
                <TradeIcon className="w-3 h-3 mr-1" />
                Our Services
              </Badge>
              <h2 className="text-3xl font-display font-bold mb-4">What We Do</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Professional {tradeVertical} services backed by the TrustLayer guarantee. Every contractor in our network is vetted and committed to excellence.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 h-full" data-testid={`card-service-${i}`}>
                    <div className="p-3 bg-accent/20 rounded-xl w-fit mb-4">
                      <Wrench className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2" data-testid={`text-service-title-${i}`}>{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TrustLayer Values */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">The TrustLayer Promise</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every professional in our network commits to these core values. It's what makes us different.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {coreValues.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 text-center" data-testid={`card-value-${value.title.toLowerCase()}`}>
                    <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-1" data-testid={`text-value-title-${i}`}>{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 md:p-12 text-center border-accent/20" glow>
                <div className="flex justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Get a free estimate from a trusted {tradeVertical} professional in your area. No obligation, no pressure.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="gap-2"
                    asChild
                    data-testid="button-cta-estimate"
                  >
                    <Link href="/estimate">
                      <Calendar className="w-4 h-4" />
                      Schedule Free Estimate
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2"
                    asChild
                    data-testid="button-cta-contractor"
                  >
                    <Link href="/auth">
                      <Building2 className="w-4 h-4" />
                      Join as Contractor
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-display font-bold mb-4">Complete Business Solutions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Contractors: We offer more than just leads. Get the tools you need to run your entire business.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6" data-testid="card-ecosystem-orbit">
                <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2" data-testid="text-ecosystem-orbit-title">Orbit Staffing</h3>
                <p className="text-sm text-muted-foreground">Payroll, HR, and staffing solutions integrated with your operations.</p>
              </GlassCard>
              
              <GlassCard className="p-6" data-testid="card-ecosystem-marketing">
                <div className="p-3 bg-amber-500/20 rounded-xl w-fit mb-4">
                  <Palette className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold mb-2" data-testid="text-ecosystem-marketing-title">Marketing Hub</h3>
                <p className="text-sm text-muted-foreground">Social media, content creation, analytics, and campaign management.</p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a 
                href="https://darkwavestudios.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
                data-testid="link-darkwave-footer"
              >
                Dark Wave Studios
              </a>
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">&copy; 2026 All rights reserved</p>
          </div>
        </footer>
      </main>
    </PageLayout>
  );
}
