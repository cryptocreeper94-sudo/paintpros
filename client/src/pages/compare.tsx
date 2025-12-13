import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check, X, Star, Zap, Shield, Smartphone, Globe, DollarSign, Clock, Users, Palette, FileText, CreditCard, BarChart3, Bot, Lock } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/layout/footer";
import { useTenant } from "@/context/TenantContext";

interface Competitor {
  name: string;
  logo?: string;
  pricing: string;
  features: Record<string, boolean | string>;
}

const competitors: Competitor[] = [
  {
    name: "PaintPros.io",
    pricing: "$299/mo",
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
      setupFee: "$0",
      contractLength: "Month-to-month",
    },
  },
  {
    name: "Jobber",
    pricing: "$69-$349/mo",
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

const featureLabels: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  instantEstimates: { label: "Instant Estimates", icon: Zap, description: "Generate accurate quotes in seconds" },
  mobileApp: { label: "Mobile App", icon: Smartphone, description: "iOS and Android apps for field work" },
  whiteLabelWebsite: { label: "White-Label Website", icon: Globe, description: "Fully branded website included" },
  onlineBooking: { label: "Online Booking", icon: Clock, description: "Customers can book appointments online" },
  crmBuiltIn: { label: "CRM Built-In", icon: Users, description: "Customer relationship management" },
  paymentProcessing: { label: "Payment Processing", icon: CreditCard, description: "Accept cards and online payments" },
  blockchainVerification: { label: "Blockchain Verification", icon: Shield, description: "Solana-verified documents" },
  aiAssistant: { label: "AI Assistant", icon: Bot, description: "24/7 AI-powered customer support" },
  seoTools: { label: "SEO Tools", icon: BarChart3, description: "Built-in search optimization" },
  multiLocation: { label: "Multi-Location", icon: Globe, description: "Manage multiple locations" },
  customBranding: { label: "Custom Branding", icon: Palette, description: "Your logo, colors, and domain" },
  analyticsReports: { label: "Analytics & Reports", icon: BarChart3, description: "Business insights dashboard" },
  franchiseReady: { label: "Franchise Ready", icon: Users, description: "Built for franchise operations" },
  setupFee: { label: "Setup Fee", icon: DollarSign, description: "One-time onboarding cost" },
  contractLength: { label: "Contract Length", icon: FileText, description: "Commitment requirements" },
};

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-5 h-5 text-green-400" />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <X className="w-5 h-5 text-red-400" />
        </div>
      </div>
    );
  }
  return (
    <div className="text-center text-sm text-muted-foreground">{value}</div>
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How We <span className="text-accent">Compare</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See why painting professionals choose PaintPros.io over the competition
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Why PaintPros.io Wins</h2>
                <p className="text-muted-foreground">The only platform built specifically for painting professionals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <Shield className="w-8 h-8 text-accent mb-2" />
                <h3 className="font-semibold mb-1">Blockchain Verified</h3>
                <p className="text-sm text-muted-foreground">Every estimate stamped to Solana blockchain for fraud protection</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <Bot className="w-8 h-8 text-accent mb-2" />
                <h3 className="font-semibold mb-1">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">24/7 AI assistant handles customer questions automatically</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <Lock className="w-8 h-8 text-accent mb-2" />
                <h3 className="font-semibold mb-1">No Lock-In</h3>
                <p className="text-sm text-muted-foreground">Month-to-month billing, no setup fees, cancel anytime</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse" data-testid="table-comparison">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold text-lg">Feature</th>
                  {competitors.map((comp, i) => (
                    <th 
                      key={comp.name} 
                      className={`text-center py-4 px-4 min-w-[140px] ${i === 0 ? 'bg-accent/10 rounded-t-xl' : ''}`}
                    >
                      <div className={`font-bold text-lg ${i === 0 ? 'text-accent' : ''}`}>{comp.name}</div>
                      <div className={`text-sm ${i === 0 ? 'text-accent/80' : 'text-muted-foreground'}`}>{comp.pricing}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(featureLabels).map(([key, { label, icon: Icon, description }], rowIndex) => (
                  <motion.tr 
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + rowIndex * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground hidden md:block">{description}</div>
                        </div>
                      </div>
                    </td>
                    {competitors.map((comp, i) => (
                      <td 
                        key={`${comp.name}-${key}`} 
                        className={`py-4 px-4 ${i === 0 ? 'bg-accent/5' : ''}`}
                      >
                        <FeatureCell value={comp.features[key]} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-2xl p-8 border border-accent/30">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Switch to PaintPros.io?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join hundreds of painting professionals who've upgraded their business with our all-in-one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/estimate" 
                  className="px-8 py-3 bg-accent text-black font-bold rounded-xl hover:bg-accent/90 transition-colors"
                  data-testid="button-compare-demo"
                >
                  Try Free Demo
                </a>
                <a 
                  href="/investors" 
                  className="px-8 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                  data-testid="button-compare-pricing"
                >
                  View Pricing Tiers
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
