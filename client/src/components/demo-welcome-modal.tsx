import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Brain, 
  Calendar, 
  Users, 
  FileText, 
  Shield, 
  Zap, 
  Globe,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp,
  DollarSign,
  Calculator,
  Layers,
  Rocket
} from "lucide-react";
import { SiSolana } from "react-icons/si";

interface DemoWelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoWelcomeModal({ open, onClose }: DemoWelcomeModalProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tools",
      description: "Room Visualizer, Color Library with 100+ curated colors, and intelligent estimating"
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "5-step customer wizard with availability management and automated reminders"
    },
    {
      icon: Users,
      title: "Crew Management",
      description: "Time tracking, job notes, incident reporting, and real-time crew coordination"
    },
    {
      icon: FileText,
      title: "PDF Document Center",
      description: "Digital signatures, contracts, estimates, and blockchain-verified documents"
    },
    {
      icon: BarChart3,
      title: "CRM Pipeline",
      description: "Lead tracking, deal stages, customer notes, and sales forecasting"
    },
    {
      icon: MessageSquare,
      title: "Internal Messaging",
      description: "Real-time chat with speech-to-text, typing indicators, and role badges"
    }
  ];

  const ecosystemApps = [
    { name: "Orbit Payroll", description: "Automated crew payments and tax filing" },
    { name: "Orbit Staffing", description: "Contractor marketplace and scheduling" },
    { name: "Darkwave Analytics", description: "Business intelligence dashboards" },
    { name: "Darkwave Commerce", description: "Payment processing and invoicing" }
  ];

  const tradeVerticals = [
    { name: "PaintPros", domain: "paintpros.io", market: "$46.5B", status: "Live" },
    { name: "RoofPros", domain: "roofpros.io", market: "$56B", status: "Coming Soon" },
    { name: "HVACPros", domain: "hvacpros.io", market: "$130B", status: "Coming Soon" },
    { name: "ElectricPros", domain: "electricpros.io", market: "$200B", status: "Coming Soon" },
    { name: "PlumbPros", domain: "plumbpros.io", market: "$130B", status: "Coming Soon" },
    { name: "LandscapePros", domain: "landscapepros.io", market: "$130B", status: "Coming Soon" },
    { name: "BuildPros", domain: "buildpros.io", market: "$1.5T", status: "Coming Soon" },
  ];

  const productTiers = [
    { 
      name: "Estimator Tool", 
      price: "$29/mo", 
      description: "Standalone AI estimator PWA",
      projection: { subs: 100, revenue: "$2,900/mo" }
    },
    { 
      name: "Full Suite", 
      price: "$199/mo", 
      description: "Complete white-label SaaS",
      projection: { subs: 50, revenue: "$9,950/mo" }
    },
    { 
      name: "Franchise License", 
      price: "$499/mo", 
      description: "Area-exclusive franchise",
      projection: { subs: 10, revenue: "$4,990/mo" }
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Welcome to PaintPros.io
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  Complete Turnkey Business Solution
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  The All-in-One Platform for Painting Contractors
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  PaintPros.io is a white-label SaaS platform that gives painting companies 
                  a premium online presence, AI-powered tools, and complete business management.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-lg border border-border bg-muted/30 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-foreground text-sm">{feature.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(1)} className="gap-2">
                  Next: Ecosystem <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Connected Ecosystem
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Orbit + Darkwave Studios Integration
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  PaintPros.io seamlessly connects to the Orbit and Darkwave Studios 
                  ecosystem of business applications for complete operational control.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ecosystemApps.map((app, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-lg border-2 border-dashed border-border bg-card space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-foreground text-sm">{app.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{app.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <SiSolana className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Blockchain Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      All documents and estimates are stamped to the Solana blockchain 
                      for immutable proof of authenticity and tamper detection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={() => setStep(2)} className="gap-2">
                  Next: Business Model <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  Trade Vertical Platform
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Built for ALL Skilled Trades
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  This platform is designed to work for any home service trade - not just painters. 
                  Each vertical is a complete white-label SaaS with industry-specific features.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tradeVerticals.map((vertical) => (
                  <div
                    key={vertical.name}
                    className={`p-2 rounded-lg border text-center ${
                      vertical.status === "Live"
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{vertical.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{vertical.domain}</p>
                    <p className="text-xs text-accent mt-0.5">{vertical.market} TAM</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">$2.2T+</p>
                  <p className="text-xs text-muted-foreground">Combined TAM</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">2M+</p>
                  <p className="text-xs text-muted-foreground">Target Contractors</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">7</p>
                  <p className="text-xs text-muted-foreground">Trade Verticals</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  Revenue Projections by Product Tier
                </h4>
                <div className="space-y-2">
                  {productTiers.map((tier, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-accent/10 flex-shrink-0">
                          {i === 0 ? <Calculator className="w-4 h-4 text-accent" /> : 
                           i === 1 ? <Layers className="w-4 h-4 text-accent" /> : 
                           <Rocket className="w-4 h-4 text-accent" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground">{tier.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{tier.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-accent">{tier.price}</p>
                        <p className="text-xs text-muted-foreground">{tier.projection.subs} subs = {tier.projection.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">Growth Potential</p>
                    <p className="text-xs text-muted-foreground">
                      At scale with 160 combined subscribers across tiers: <span className="font-bold text-accent">$17,840/mo recurring</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Next: Your Access <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  Full Demo Access
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Explore Everything
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  As a Demo Viewer, you have read-only access to explore all dashboards 
                  and features across the entire platform.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Dashboards You Can Access:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Owner", pin: "1111" },
                    { name: "Admin", pin: "4444" },
                    { name: "Developer", pin: "0424" },
                    { name: "Project Manager", pin: "2222" },
                    { name: "Crew Lead", pin: "3333" },
                    { name: "Demo Viewer", pin: "7777" }
                  ].map((role, i) => (
                    <div key={i} className="p-2 rounded bg-muted/50 text-center">
                      <span className="text-sm font-medium text-foreground">{role.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">Read-Only Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      You can view all features and sample data, but editing is disabled 
                      to preserve the demo environment.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/trade-verticals" onClick={onClose}>
                <Button variant="outline" className="w-full gap-2">
                  <Globe className="w-4 h-4" />
                  View Full Trade Verticals Page
                </Button>
              </Link>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={onClose} 
                  className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  <Zap className="w-4 h-4" />
                  Start Exploring
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex justify-center gap-2 pt-2 border-t border-border">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === i ? 'bg-emerald-600' : 'bg-muted-foreground/30'
              }`}
              data-testid={`step-indicator-${i}`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
