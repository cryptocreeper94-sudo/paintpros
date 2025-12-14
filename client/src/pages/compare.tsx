import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check, X, Star, Zap, Shield, Smartphone, Globe, DollarSign, Clock, Users, Palette, FileText, CreditCard, BarChart3, Bot, Lock, ArrowRight, ChevronDown, Crown, Rocket } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useTenant } from "@/context/TenantContext";

interface Competitor {
  name: string;
  pricing: string;
  tagline: string;
  features: Record<string, boolean | string>;
}

const competitors: Competitor[] = [
  {
    name: "PaintPros.io",
    pricing: "$349/mo",
    tagline: "Built for painters, by painters",
    features: {
      instantEstimates: true,
      mobileApp: true,
      whiteLabelWebsite: true,
      onlineBooking: true,
      crmBuiltIn: true,
      paymentProcessing: true,
      blockchainVerification: true,
      aiAssistant: true,
      seoTools: true,
      multiLocation: true,
      customBranding: true,
      analyticsReports: true,
      franchiseReady: true,
      setupFee: "$5,000",
      contractLength: "Month-to-month",
    },
  },
  {
    name: "Jobber",
    pricing: "$69-$349/mo",
    tagline: "General field service",
    features: {
      instantEstimates: false,
      mobileApp: true,
      whiteLabelWebsite: false,
      onlineBooking: true,
      crmBuiltIn: true,
      paymentProcessing: true,
      blockchainVerification: false,
      aiAssistant: false,
      seoTools: false,
      multiLocation: "Add-on",
      customBranding: false,
      analyticsReports: true,
      franchiseReady: false,
      setupFee: "$0",
      contractLength: "Annual discount",
    },
  },
  {
    name: "Housecall Pro",
    pricing: "$65-$169/mo",
    tagline: "Home service scheduling",
    features: {
      instantEstimates: false,
      mobileApp: true,
      whiteLabelWebsite: false,
      onlineBooking: true,
      crmBuiltIn: true,
      paymentProcessing: true,
      blockchainVerification: false,
      aiAssistant: false,
      seoTools: false,
      multiLocation: "Enterprise",
      customBranding: false,
      analyticsReports: true,
      franchiseReady: false,
      setupFee: "$0",
      contractLength: "Monthly",
    },
  },
  {
    name: "ServiceTitan",
    pricing: "$398+/mo",
    tagline: "Enterprise field service",
    features: {
      instantEstimates: false,
      mobileApp: true,
      whiteLabelWebsite: false,
      onlineBooking: true,
      crmBuiltIn: true,
      paymentProcessing: true,
      blockchainVerification: false,
      aiAssistant: "Add-on",
      seoTools: false,
      multiLocation: true,
      customBranding: false,
      analyticsReports: true,
      franchiseReady: true,
      setupFee: "$2,000+",
      contractLength: "Annual",
    },
  },
  {
    name: "Painter's CRM",
    pricing: "$99-$299/mo",
    tagline: "Painting-focused CRM",
    features: {
      instantEstimates: true,
      mobileApp: true,
      whiteLabelWebsite: false,
      onlineBooking: false,
      crmBuiltIn: true,
      paymentProcessing: "3rd party",
      blockchainVerification: false,
      aiAssistant: false,
      seoTools: false,
      multiLocation: false,
      customBranding: false,
      analyticsReports: true,
      franchiseReady: false,
      setupFee: "$499",
      contractLength: "Annual",
    },
  },
];

const featureCategories = [
  {
    category: "Core Features",
    features: [
      { key: "instantEstimates", label: "Instant Estimates", icon: Zap, description: "Generate accurate quotes in seconds with our smart calculator" },
      { key: "mobileApp", label: "Mobile App", icon: Smartphone, description: "iOS and Android apps for field work" },
      { key: "whiteLabelWebsite", label: "White-Label Website", icon: Globe, description: "Fully branded website with your domain included" },
      { key: "onlineBooking", label: "Online Booking", icon: Clock, description: "Customers can book appointments 24/7" },
    ]
  },
  {
    category: "Business Tools",
    features: [
      { key: "crmBuiltIn", label: "CRM Built-In", icon: Users, description: "Track leads, customers, and job history" },
      { key: "paymentProcessing", label: "Payment Processing", icon: CreditCard, description: "Accept cards and online payments" },
      { key: "analyticsReports", label: "Analytics & Reports", icon: BarChart3, description: "Business insights and performance dashboards" },
      { key: "seoTools", label: "SEO Tools", icon: Globe, description: "Built-in search engine optimization" },
    ]
  },
  {
    category: "Advanced Features",
    features: [
      { key: "blockchainVerification", label: "Blockchain Verification", icon: Shield, description: "Solana-verified documents for fraud protection" },
      { key: "aiAssistant", label: "AI Assistant", icon: Bot, description: "24/7 AI-powered customer support" },
      { key: "customBranding", label: "Custom Branding", icon: Palette, description: "Your logo, colors, and domain" },
      { key: "multiLocation", label: "Multi-Location", icon: Globe, description: "Manage multiple locations" },
      { key: "franchiseReady", label: "Franchise Ready", icon: Users, description: "Built for franchise operations" },
    ]
  },
  {
    category: "Pricing & Terms",
    features: [
      { key: "setupFee", label: "Setup Fee", icon: DollarSign, description: "One-time onboarding cost" },
      { key: "contractLength", label: "Contract Length", icon: FileText, description: "Commitment requirements" },
    ]
  }
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-green-400" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <X className="w-4 h-4 text-red-400" />
      </div>
    );
  }
  return (
    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{value}</span>
  );
}

export default function Compare() {
  const tenant = useTenant();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (tenant.id !== "demo") {
      setLocation("/");
    }
  }, [tenant.id, setLocation]);

  if (tenant.id !== "demo") {
    return null;
  }

  const paintPros = competitors[0];
  const otherCompetitors = competitors.slice(1);

  return (
    <PageLayout>
      <main className="pt-4 px-2 md:px-8 pb-16">
        <BentoGrid>
          
          {/* Hero Section */}
          <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
            <GlassCard className="p-6 md:p-12 relative overflow-hidden" glow>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-purple-500/10 opacity-50" />
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-xs font-bold uppercase tracking-wider mb-6"
                >
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  Industry Comparison
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
                >
                  Why <span className="text-accent">PaintPros.io</span> Wins
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-muted-foreground mb-8"
                >
                  The only platform built specifically for painting professionals. See how we stack up against the competition.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <a href="/estimate">
                    <FlipButton>
                      Try Free Demo <ArrowRight className="w-4 h-4" />
                    </FlipButton>
                  </a>
                  <a href="/investors" className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/20 font-medium">
                    View Pricing
                  </a>
                </motion.div>
              </div>
            </GlassCard>
          </BentoItem>

          {/* Key Differentiators */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border-[#14F195]/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Blockchain Verified</h3>
                  <p className="text-sm text-muted-foreground">Every estimate stamped to Solana. Industry first.</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-accent/10 to-cyan-500/10 border-accent/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent flex-shrink-0">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">24/7 AI assistant handles customer questions.</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <GlassCard className="p-4 md:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-500 flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">No Lock-In</h3>
                  <p className="text-sm text-muted-foreground">Month-to-month. No setup fees. Cancel anytime.</p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          {/* Competitor Carousel */}
          <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={4}>
            <GlassCard className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold">Competitor Comparison</h2>
                <span className="text-xs text-muted-foreground">Swipe to compare</span>
              </div>
              
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {competitors.map((comp, index) => (
                    <CarouselItem key={comp.name} className="pl-2 md:pl-4 basis-[280px] md:basis-1/3 lg:basis-1/4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <GlassCard 
                          className={`p-4 h-full ${index === 0 ? 'bg-accent/10 border-accent/40' : ''}`}
                          hoverEffect={false}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {index === 0 && (
                              <Crown className="w-4 h-4 text-accent" />
                            )}
                            <h3 className={`font-bold ${index === 0 ? 'text-accent' : ''}`}>{comp.name}</h3>
                          </div>
                          <p className="text-lg font-bold mb-1">{comp.pricing}</p>
                          <p className="text-xs text-muted-foreground mb-4">{comp.tagline}</p>
                          
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="features" className="border-white/10">
                              <AccordionTrigger className="text-sm py-2">
                                <span className="flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4" />
                                  View Features
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2 pt-2">
                                  {Object.entries(comp.features).slice(0, 8).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </span>
                                      <FeatureValue value={value} />
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </GlassCard>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-background/80" />
                <CarouselNext className="right-0 bg-background/80" />
              </Carousel>
            </GlassCard>
          </BentoItem>

          {/* Feature Breakdown Accordions */}
          <BentoItem colSpan={8} rowSpan={3} mobileColSpan={4} mobileRowSpan={6}>
            <GlassCard className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Detailed Feature Breakdown</h2>
              
              <Accordion type="multiple" className="w-full space-y-2">
                {featureCategories.map((category, catIndex) => (
                  <AccordionItem 
                    key={category.category} 
                    value={category.category}
                    className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-white/5">
                      <span className="font-semibold">{category.category}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {category.features.map((feature) => (
                          <motion.div
                            key={feature.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                          >
                            <div className="p-1.5 rounded-lg bg-accent/20 flex-shrink-0">
                              <feature.icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-medium text-sm">{feature.label}</span>
                                <FeatureValue value={paintPros.features[feature.key]} />
                              </div>
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCard>
          </BentoItem>

          {/* Quick Stats */}
          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <GlassCard className="p-4 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">$0</div>
              <div className="text-sm text-muted-foreground">Setup Fee</div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={1} mobileColSpan={2} mobileRowSpan={2}>
            <GlassCard className="p-4 md:p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">0</div>
              <div className="text-sm text-muted-foreground">Contracts Required</div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-5 h-5 text-accent" />
                <h3 className="font-bold">Ready to Switch?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Join hundreds of painting professionals who've upgraded their business.
              </p>
              <a href="/investors" className="block">
                <FlipButton className="w-full justify-center">
                  View Pricing Tiers
                </FlipButton>
              </a>
            </GlassCard>
          </BentoItem>

          {/* CTA Section */}
          <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
            <GlassCard className="p-6 md:p-8 bg-gradient-to-r from-accent/20 via-accent/10 to-purple-500/20 border-accent/30" glow>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1">Start Your 14-Day Free Trial</h2>
                  <p className="text-muted-foreground">No credit card required. Full access to all features.</p>
                </div>
                <a href="/estimate">
                  <FlipButton>
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </FlipButton>
                </a>
              </div>
            </GlassCard>
          </BentoItem>

        </BentoGrid>
      </main>
    </PageLayout>
  );
}
