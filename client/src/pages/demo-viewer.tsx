import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ArrowRight,
  Shield,
  Users,
  Handshake,
  Sparkles,
  Palette,
  Home,
  Building2,
  Zap,
  Wrench,
  Droplets,
  TreeDeciduous,
  HardHat,
  Flame,
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  Award,
  Heart,
  Globe,
  Layers
} from "lucide-react";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const tradeVerticals = [
  { id: "paint", name: "Painting", icon: Palette, color: "bg-purple-500/20", textColor: "text-purple-600", path: "/", description: "Interior & exterior painting services" },
  { id: "roof", name: "Roofing", icon: Home, color: "bg-orange-500/20", textColor: "text-orange-600", path: "/trade-home?tenant=roofpros", description: "Roof repair & replacement" },
  { id: "hvac", name: "HVAC", icon: Flame, color: "bg-red-500/20", textColor: "text-red-600", path: "/trade-home?tenant=hvacpros", description: "Heating & cooling systems" },
  { id: "electric", name: "Electrical", icon: Zap, color: "bg-amber-500/20", textColor: "text-amber-600", path: "/trade-home?tenant=electricpros", description: "Wiring & electrical work" },
  { id: "plumb", name: "Plumbing", icon: Droplets, color: "bg-blue-500/20", textColor: "text-blue-600", path: "/trade-home?tenant=plumbpros", description: "Pipes, drains & fixtures" },
  { id: "landscape", name: "Landscaping", icon: TreeDeciduous, color: "bg-emerald-500/20", textColor: "text-emerald-600", path: "/trade-home?tenant=landscapepros", description: "Lawn care & outdoor design" },
  { id: "construct", name: "Construction", icon: HardHat, color: "bg-slate-500/20", textColor: "text-slate-600", path: "/trade-home?tenant=buildpros", description: "Building & renovations" },
  { id: "general", name: "General", icon: Wrench, color: "bg-teal-500/20", textColor: "text-teal-600", path: "/tradeworks", description: "Handyman & repairs" },
];

const coreValues = [
  { icon: Shield, title: "Trust", description: "Verified businesses committed to excellence" },
  { icon: Heart, title: "Honor", description: "Integrity in every interaction" },
  { icon: Award, title: "Value", description: "Quality work at fair prices" },
  { icon: Handshake, title: "Service", description: "Customer satisfaction first" },
];

export default function DemoViewer() {
  const [, setLocation] = useLocation();
  const [hoveredTrade, setHoveredTrade] = useState<string | null>(null);

  return (
    <PageLayout>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          <motion.div 
            className="relative max-w-6xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30">
              <Layers className="w-3 h-3 mr-1" />
              The Trusted Network
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              <span className="text-foreground">Trust</span>
              <span className="text-accent">Layer</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
              A growing community of businesses and people committed to
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {coreValues.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Badge variant="outline" className="text-sm py-1.5 px-3 gap-1.5">
                    <value.icon className="w-3.5 h-3.5 text-accent" />
                    {value.title}
                  </Badge>
                </motion.div>
              ))}
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join free. Commit to excellence. Connect with trusted professionals and customers who share your values.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setLocation("/auth")}
                data-testid="button-join-contractor"
              >
                <Building2 className="w-4 h-4" />
                I'm a Contractor
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2"
                onClick={() => setLocation("/auth")}
                data-testid="button-join-customer"
              >
                <Users className="w-4 h-4" />
                I'm a Customer
              </Button>
            </div>
          </motion.div>
        </section>

        {/* What You Get Section */}
        <section className="py-16 px-4 bg-muted/30">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">One Network, Everything You Need</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you're a contractor looking for tools to grow your business, or a customer looking for trusted professionals - we've got you covered.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* TradeWorks */}
              <motion.div variants={cardVariants}>
                <GlassCard 
                  className="p-6 h-full cursor-pointer group"
                  onClick={() => setLocation("/tradeworks")}
                  data-testid="card-tradeworks"
                >
                  <div className="p-3 bg-emerald-500/20 rounded-xl w-fit mb-4">
                    <Target className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    TradeWorks
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    The all-in-one contractor operations tool. CRM, scheduling, invoicing, crew management, and more.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Voice Assistant</Badge>
                    <Badge variant="secondary" className="text-xs">Job Tracking</Badge>
                    <Badge variant="secondary" className="text-xs">Crew Management</Badge>
                  </div>
                </GlassCard>
              </motion.div>

              {/* PaintPros */}
              <motion.div variants={cardVariants}>
                <GlassCard 
                  className="p-6 h-full cursor-pointer group"
                  onClick={() => setLocation("/")}
                  data-testid="card-paintpros"
                >
                  <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-4">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    PaintPros
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Complete painting business platform. Instant estimates, booking, color library, and customer portal.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Instant Estimates</Badge>
                    <Badge variant="secondary" className="text-xs">Online Booking</Badge>
                    <Badge variant="secondary" className="text-xs">Color Library</Badge>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Marketing Hub */}
              <motion.div variants={cardVariants}>
                <GlassCard 
                  className="p-6 h-full cursor-pointer group"
                  onClick={() => setLocation("/marketing-overview")}
                  data-testid="card-marketing"
                >
                  <div className="p-3 bg-amber-500/20 rounded-xl w-fit mb-4">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    Marketing Hub
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Professional marketing tools. Social scheduling, content creation, analytics, and ROI tracking.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Content Calendar</Badge>
                    <Badge variant="secondary" className="text-xs">Analytics</Badge>
                    <Badge variant="secondary" className="text-xs">Copy Generator</Badge>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Trade Verticals Section */}
        <section className="py-16 px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} className="text-center mb-12">
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
                <Globe className="w-3 h-3 mr-1" />
                Trade Verticals
              </Badge>
              <h2 className="text-3xl font-display font-bold mb-4">Every Trade, One Platform</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From painting to plumbing, roofing to renovation - our platform supports contractors across all home service industries.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tradeVerticals.map((trade) => (
                <motion.div 
                  key={trade.id} 
                  variants={cardVariants}
                  onMouseEnter={() => setHoveredTrade(trade.id)}
                  onMouseLeave={() => setHoveredTrade(null)}
                >
                  <GlassCard 
                    className="p-4 h-full cursor-pointer text-center group"
                    onClick={() => setLocation(trade.path)}
                    data-testid={`card-trade-${trade.id}`}
                  >
                    <div className={`p-3 ${trade.color} rounded-xl w-fit mx-auto mb-3 transition-transform group-hover:scale-110`}>
                      <trade.icon className={`w-6 h-6 ${trade.textColor}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{trade.name}</h3>
                    <p className={`text-xs text-muted-foreground transition-all ${hoveredTrade === trade.id ? 'opacity-100' : 'opacity-70'}`}>
                      {trade.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 px-4 bg-muted/30">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={cardVariants} className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every member of TrustLayer commits to these core principles. It's what makes our network different.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {coreValues.map((value, i) => (
                <motion.div key={value.title} variants={cardVariants}>
                  <GlassCard className="p-6 text-center h-full">
                    <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Join CTA Section */}
        <section className="py-16 px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12 text-center border-accent/20" glow>
              <Sparkles className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold mb-4">Ready to Join?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Membership is free. All we ask is that you commit to being a good person and running an honest business. That's it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={() => setLocation("/auth")}
                  data-testid="button-cta-contractor"
                >
                  <Building2 className="w-4 h-4" />
                  Join as Contractor
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="gap-2"
                  onClick={() => setLocation("/auth")}
                  data-testid="button-cta-customer"
                >
                  <Users className="w-4 h-4" />
                  Join as Customer
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Free to join
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  No contracts
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Instant access
                </span>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Testimonial/Social Proof */}
        <section className="py-16 px-4 bg-muted/30">
          <motion.div 
            className="max-w-6xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <p className="text-lg italic text-muted-foreground max-w-2xl mx-auto mb-4">
              "Building a network of trusted professionals, one connection at a time."
            </p>
            <p className="text-sm text-muted-foreground">The TrustLayer Community</p>
          </motion.div>
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
