import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { useState } from "react";
import { 
  DollarSign, Check, Paintbrush, Home, Building2, 
  Layers, Zap, Shield, Award, ArrowRight, Star,
  Ruler, DoorOpen, Grid3X3, Maximize, Sparkles,
  Phone, Calendar, Users, BarChart3, Globe, Camera,
  X, Crown, Rocket, Building, BadgeCheck
} from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PRICING_TIERS, type PricingTier } from "@shared/pricing-tiers";

const LICENSING_TIERS = [
  { 
    tier: "Starter", 
    price: "$349", 
    period: "/mo",
    setup: "$5,000", 
    target: "Solo contractors, 1 location",
    popular: false,
    features: [
      "White-label website with Bento Grid design",
      "Interactive estimator tool",
      "Basic lead capture & CRM",
      "Email support (2 business day response)",
    ],
    addons: ["Blockchain stamping available ($69/mo)"]
  },
  { 
    tier: "Professional", 
    price: "$549", 
    period: "/mo",
    setup: "$7,000", 
    target: "Growing painters, 1-3 locations",
    popular: true,
    features: [
      "Everything in Starter",
      "Full analytics dashboard",
      "Role-based dashboards (Owner, Admin, Project Manager)",
      "Phone support (24-hour response)",
      "2 strategy sessions per year",
      "Blockchain stamping included",
    ],
    addons: []
  },
  { 
    tier: "Franchise Core", 
    price: "$799", 
    period: "/mo + $99/loc",
    setup: "$10,000", 
    target: "Multi-location (5+ sites)",
    popular: false,
    features: [
      "Everything in Professional",
      "Multi-tenant management console",
      "Shared asset libraries across locations",
      "Orbit ecosystem integrations",
      "Dedicated account manager",
      "Compliance & audit trail",
    ],
    addons: []
  },
  { 
    tier: "Enterprise", 
    price: "$1,399", 
    period: "/mo base",
    setup: "$15,000", 
    target: "Large franchises",
    popular: false,
    features: [
      "Full brand suppression (Orbit/PaintPros removed)",
      "API priority access",
      "Co-branded marketing assets",
      "SLA guarantees (99.9% uptime)",
      "4-hour critical response",
      "Custom contract terms",
    ],
    addons: []
  },
];

const CUSTOMIZATION_MENU = [
  { service: "Branding Refresh", price: "$2,000", timeline: "1 week" },
  { service: "Custom Theme/Layout Pack", price: "$3,500", timeline: "2 weeks" },
  { service: "Feature Module Build", price: "$5,000 - $10,000", timeline: "3-6 weeks" },
  { service: "Third-Party Integration", price: "$150/hr", timeline: "Varies" },
  { service: "Data Migration", price: "$1,000/system", timeline: "1 week" },
];

export default function Pricing() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";

  if (isDemo) {
    return <LicensingPricing />;
  }

  return <ServicePricing tenant={tenant} />;
}

function EstimatorToolPricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const tierIcons: Record<string, any> = {
    starter: Rocket,
    professional: Crown,
    business: Building,
    enterprise: Building2
  };

  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm mb-6">
          <Camera className="w-4 h-4" />
          AI Estimator Tool
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Standalone <span className="text-purple-400">Estimator</span> Plans
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          AI-powered room scanning and instant estimates for any contractor
        </p>

        <div className="inline-flex items-center gap-2 p-1 rounded-full bg-black/5 dark:bg-white/10">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-purple-500 text-white' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid="button-billing-monthly"
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              billingCycle === 'annual' 
                ? 'bg-purple-500 text-white' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            data-testid="button-billing-annual"
          >
            Annual <span className="text-green-400 ml-1">Save 20%</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRICING_TIERS.map((tier, index) => {
          const TierIcon = tierIcons[tier.id] || Rocket;
          const price = billingCycle === 'monthly' ? tier.monthlyPrice : Math.round(tier.annualPrice / 12);
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard 
                className={`p-6 h-full flex flex-col relative ${tier.popular ? 'border-purple-500/50 bg-purple-500/5' : ''}`}
                glow={tier.popular}
                data-testid={`estimator-tier-${tier.id}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-purple-500 text-white text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${tier.popular ? 'bg-purple-500/20' : 'bg-accent/20'} flex items-center justify-center`}>
                    <TierIcon className={`w-6 h-6 ${tier.popular ? 'text-purple-400' : 'text-accent'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                    <p className="text-xs text-muted-foreground">{tier.tagline}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${tier.popular ? 'text-purple-400' : 'text-accent'}`}>
                      ${price}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-xs text-green-400 mt-1">
                      Save ${tier.annualSavings}/year
                    </p>
                  )}
                </div>

                <ul className="flex-1 space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={tier.id === 'enterprise' ? '/estimate' : '/trial-signup'}>
                  <FlipButton 
                    className={`w-full ${tier.popular ? '' : 'bg-black/5 dark:bg-white/10'}`}
                    data-testid={`button-select-estimator-${tier.id}`}
                  >
                    {tier.ctaText} <ArrowRight className="w-4 h-4 ml-2" />
                  </FlipButton>
                </a>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <GlassCard className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border dark:border-white/10">
                  <th className="text-left py-2 pr-4">Feature</th>
                  {PRICING_TIERS.map(tier => (
                    <th key={tier.id} className="text-center py-2 px-2">{tier.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 dark:border-white/5">
                  <td className="py-2 pr-4">Estimates/month</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2">
                      {tier.limits.estimatesPerMonth === 'unlimited' ? 'Unlimited' : tier.limits.estimatesPerMonth}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/50 dark:border-white/5">
                  <td className="py-2 pr-4">AI Room Scanner</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2 capitalize">{tier.limits.aiScannerLevel}</td>
                  ))}
                </tr>
                <tr className="border-b border-border/50 dark:border-white/5">
                  <td className="py-2 pr-4">Team Members</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2">
                      {tier.limits.teamMembers === 'unlimited' ? 'Unlimited' : tier.limits.teamMembers}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/50 dark:border-white/5">
                  <td className="py-2 pr-4">CRM Access</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2">
                      {tier.limits.crmAccess ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/50 dark:border-white/5">
                  <td className="py-2 pr-4">Online Booking</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2">
                      {tier.limits.onlineBooking ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/50 dark:border-white/5">
                  <td className="py-2 pr-4">Multi-Room Scanner</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2">
                      {tier.limits.multiRoomScanner ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 pr-4">White-Label</td>
                  {PRICING_TIERS.map(tier => (
                    <td key={tier.id} className="text-center py-2">
                      {tier.limits.whiteLabel ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <X className="w-4 h-4 text-muted-foreground mx-auto" />}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-sm">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-green-600 dark:text-green-400 font-medium">7-Day Money-Back Guarantee</span>
          <span className="text-muted-foreground">on all new subscriptions</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <a href="/terms#refunds" className="text-accent hover:underline">View full refund policy</a>
        </p>
      </motion.div>
    </div>
  );
}

function LicensingPricing() {
  return (
    <PageLayout>
      <main className="pt-24 pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <EstimatorToolPricing />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Full Platform Licensing
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Launch Your <span className="text-accent">Painting Business</span> Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All-inclusive white-label websites with premium features. No hidden fees.
            </p>
          </motion.div>

          <BentoGrid className="mb-12">
            {LICENSING_TIERS.map((tier, index) => (
              <BentoItem key={tier.tier} colSpan={3} rowSpan={2}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <GlassCard 
                    className={`p-6 h-full flex flex-col ${tier.popular ? 'border-accent/50 bg-accent/5' : ''}`}
                    glow={tier.popular}
                    data-testid={`pricing-tier-${tier.tier.toLowerCase()}`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 rounded-full bg-accent text-black text-xs font-bold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{tier.tier}</h3>
                      <p className="text-sm text-muted-foreground">{tier.target}</p>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-accent">{tier.price}</span>
                        <span className="text-muted-foreground">{tier.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">+ {tier.setup} setup fee</p>
                    </div>
                    
                    <div className="flex-1">
                      <ul className="space-y-2 mb-4">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {tier.addons.length > 0 && (
                        <div className="pt-3 border-t border-border dark:border-white/10">
                          {tier.addons.map((addon, i) => (
                            <p key={i} className="text-xs text-muted-foreground">+ {addon}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <a href="/estimate" className="mt-4">
                      <FlipButton 
                        className={`w-full ${tier.popular ? '' : 'bg-black/5 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'}`}
                        data-testid={`button-select-${tier.tier.toLowerCase()}`}
                      >
                        Get Started <ArrowRight className="w-4 h-4 ml-2" />
                      </FlipButton>
                    </a>
                  </GlassCard>
                </motion.div>
              </BentoItem>
            ))}
          </BentoGrid>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Customization Menu</h2>
                  <p className="text-sm text-muted-foreground">Add-on services priced separately</p>
                </div>
              </div>

              <div className="px-4 md:px-12">
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                  <CarouselContent className="-ml-3">
                    {CUSTOMIZATION_MENU.map((item, index) => (
                      <CarouselItem key={item.service} className="pl-3 basis-[260px] md:basis-1/3 lg:basis-1/4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          <GlassCard className="p-5 h-full">
                            <h3 className="font-bold mb-2">{item.service}</h3>
                            <p className="text-2xl font-bold text-accent mb-1">{item.price}</p>
                            <p className="text-xs text-muted-foreground">{item.timeline}</p>
                          </GlassCard>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </Carousel>
              </div>
            </GlassCard>
          </motion.div>

          <BentoGrid>
            <BentoItem colSpan={4} rowSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="font-bold">All Plans Include</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-accent" /> Custom domain support</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent" /> SSL encryption</li>
                    <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-accent" /> Automatic updates</li>
                    <li className="flex items-center gap-2"><Users className="w-4 h-4 text-accent" /> Unlimited leads</li>
                  </ul>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={4} rowSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold">Why PaintPros.io?</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Built for painters, not generic software</li>
                    <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-purple-400" /> Blockchain document verification</li>
                    <li className="flex items-center gap-2"><Award className="w-4 h-4 text-accent" /> Premium Bento Grid design</li>
                  </ul>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={4} rowSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <GlassCard className="p-6 h-full bg-gradient-to-br from-accent/20 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-bold">Ready to Start?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Schedule a demo to see the platform in action.
                  </p>
                  <a href="/estimate">
                    <FlipButton className="w-full" data-testid="button-schedule-demo">
                      <Calendar className="w-4 h-4 mr-2" /> Schedule Demo
                    </FlipButton>
                  </a>
                </GlassCard>
              </motion.div>
            </BentoItem>
          </BentoGrid>
        </div>
      </main>
    </PageLayout>
  );
}

function ServicePricing({ tenant }: { tenant: any }) {
  const { pricing, name, credentials } = tenant;
  const isNPP = tenant.id === 'npp';

  const FullImplementationBadge = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-8"
    >
      <GlassCard className="p-4 bg-gradient-to-r from-green-500/10 via-accent/10 to-green-500/10 border-green-500/30" glow>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-green-400">Full Implementation Active</p>
              <p className="text-xs text-muted-foreground">All premium features unlocked</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">AI Room Scanner</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">CRM</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">Crew Mgmt</span>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">Blockchain</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  const pricingItems = pricing ? [
    {
      title: "Walls Only",
      icon: Grid3X3,
      price: `$${pricing.wallsPerSqFt?.toFixed(2) || '0.00'}`,
      unit: "per sq ft",
      description: "Interior wall painting, prep included",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Full Job",
      icon: Home,
      price: `$${pricing.fullJobPerSqFt?.toFixed(2) || '0.00'}`,
      unit: "per sq ft",
      description: "Walls + Trim + Ceiling",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      popular: true,
    },
    {
      title: "Doors",
      icon: DoorOpen,
      price: `$${pricing.doorsPerUnit || '0'}`,
      unit: "per door",
      description: "Both sides, any standard door",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
  ] : [];

  if (pricing?.ceilingsPerSqFt) {
    pricingItems.push({
      title: "Ceilings Only",
      icon: Maximize,
      price: `$${pricing.ceilingsPerSqFt.toFixed(2)}`,
      unit: "per sq ft",
      description: "Ceiling painting standalone",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
    });
  }

  if (pricing?.trimPerLinearFt) {
    pricingItems.push({
      title: "Trim Only",
      icon: Ruler,
      price: `$${pricing.trimPerLinearFt.toFixed(2)}`,
      unit: "per linear ft",
      description: "Baseboards, crown molding, casings",
      color: "text-teal-400",
      bgColor: "bg-teal-500/20",
    });
  }

  return (
    <PageLayout>
      <main className="pt-24 pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm mb-6">
              <Paintbrush className="w-4 h-4" />
              Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Our <span className="text-accent">Service Rates</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, upfront pricing for all your painting needs. No surprises.
            </p>
          </motion.div>

          {isNPP && <FullImplementationBadge />}

          <div className="px-4 md:px-12 mb-12">
            <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {pricingItems.map((item, index) => (
                  <CarouselItem key={item.title} className="pl-4 basis-[280px] md:basis-1/3 lg:basis-1/4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="h-full"
                    >
                      <GlassCard 
                        className={`p-6 h-full ${item.popular ? 'border-accent/50 bg-accent/5' : ''}`}
                        glow={item.popular}
                        data-testid={`pricing-card-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="px-3 py-1 rounded-full bg-accent text-black text-xs font-bold">
                              BEST VALUE
                            </span>
                          </div>
                        )}
                        
                        <div className={`w-14 h-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-4`}>
                          <item.icon className={`w-7 h-7 ${item.color}`} />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        
                        <div className="mb-3">
                          <span className="text-4xl font-bold text-accent">{item.price}</span>
                          <span className="text-muted-foreground text-sm ml-1">{item.unit}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </GlassCard>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>

          <BentoGrid>
            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">What's Included</h2>
                      <p className="text-sm text-muted-foreground">Every job includes</p>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="prep">
                      <AccordionTrigger className="text-left">Surface Preparation</AccordionTrigger>
                      <AccordionContent>
                        Cleaning, sanding, patching small holes, taping, and priming as needed. We ensure surfaces are ready for a flawless finish.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="materials">
                      <AccordionTrigger className="text-left">Premium Materials</AccordionTrigger>
                      <AccordionContent>
                        We use high-quality paints and materials from trusted brands. Upgraded options available upon request.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="cleanup">
                      <AccordionTrigger className="text-left">Full Cleanup</AccordionTrigger>
                      <AccordionContent>
                        We leave your space spotless. All materials removed, furniture replaced, and a final walkthrough with you.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="warranty">
                      <AccordionTrigger className="text-left">{credentials?.warrantyYears || 3}-Year Warranty</AccordionTrigger>
                      <AccordionContent>
                        Peace of mind with our workmanship warranty. Any issues? We'll make it right at no extra cost.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </GlassCard>
              </motion.div>
            </BentoItem>

            <BentoItem colSpan={6} rowSpan={1}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <GlassCard className="p-6 h-full bg-gradient-to-br from-accent/20 to-transparent" glow>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Get Your Free Estimate</h2>
                      <p className="text-sm text-muted-foreground">Instant online quotes</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Use our interactive estimator to get an instant quote for your project. No obligation, no pressure.
                  </p>
                  
                  <a href="/estimate">
                    <FlipButton className="w-full" data-testid="button-get-estimate">
                      Get Free Estimate <ArrowRight className="w-4 h-4 ml-2" />
                    </FlipButton>
                  </a>
                </GlassCard>
              </motion.div>
            </BentoItem>
          </BentoGrid>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold">Commercial Projects</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Large commercial projects receive custom pricing based on scope, timeline, and specific requirements. Contact us for a tailored quote.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs">Office Buildings</span>
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs">Retail Spaces</span>
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs">Warehouses</span>
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs">Multi-Unit Properties</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
