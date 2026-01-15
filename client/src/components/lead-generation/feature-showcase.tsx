import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Wallet, 
  MapPin,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "wouter";

interface Feature {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  fullDescription: string;
  benefits: string[];
  screenshot?: string;
}

const features: Feature[] = [
  {
    id: "crm",
    title: "Lead & Customer CRM",
    shortDesc: "Track every lead from first contact to job completion",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    fullDescription: "Our built-in CRM automatically captures leads from your website, tracks communication history, and helps you convert more prospects into paying customers. Never lose a lead again.",
    benefits: [
      "Automatic lead capture from website forms",
      "Email and call tracking",
      "Lead scoring by urgency (hot/warm/cold)",
      "Pipeline visualization",
      "Follow-up reminders"
    ]
  },
  {
    id: "estimates",
    title: "AI-Powered Estimates",
    shortDesc: "Generate professional estimates in minutes, not hours",
    icon: FileText,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    fullDescription: "Create accurate, professional estimates using AI that learns your pricing. Voice-to-estimate lets you speak room dimensions and get instant quotes. Blockchain verification ensures document integrity.",
    benefits: [
      "Voice-to-estimate technology",
      "Custom pricing per service",
      "Professional PDF proposals",
      "E-signature integration",
      "Blockchain document stamping"
    ]
  },
  {
    id: "scheduling",
    title: "Smart Scheduling",
    shortDesc: "Manage jobs, crews, and calendars in one place",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    fullDescription: "Intelligent scheduling that optimizes crew routes, accounts for weather, and syncs with Google Calendar. See your entire operation at a glance and make changes on the fly.",
    benefits: [
      "Drag-and-drop calendar",
      "Google Calendar sync",
      "Weather-aware scheduling",
      "Route optimization",
      "Crew availability tracking"
    ]
  },
  {
    id: "crew",
    title: "Crew Management",
    shortDesc: "Empower your team with mobile tools",
    icon: MapPin,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    fullDescription: "Give your crews everything they need in the field. Time tracking, job notes, photo documentation, and real-time GPS location. Crew leads have their own dashboard to manage their team.",
    benefits: [
      "Mobile time clock",
      "Job photos & notes",
      "GPS crew tracking",
      "Incident reporting",
      "Crew lead dashboard"
    ]
  },
  {
    id: "messaging",
    title: "Team Messaging",
    shortDesc: "Real-time communication with your entire team",
    icon: MessageSquare,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    fullDescription: "Built-in messaging keeps everyone connected. Speech-to-text, typing indicators, and role-based access ensure the right people get the right information at the right time.",
    benefits: [
      "Real-time chat",
      "Speech-to-text input",
      "Role-based channels",
      "Unread message alerts",
      "Mobile notifications"
    ]
  },
  {
    id: "analytics",
    title: "Business Analytics",
    shortDesc: "Data-driven insights to grow your business",
    icon: BarChart3,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    fullDescription: "See exactly what's working and what's not. Track revenue, job profitability, crew performance, and marketing ROI. AI-powered forecasting helps you plan for the future.",
    benefits: [
      "Revenue dashboards",
      "Profit margin analysis",
      "Lead source tracking",
      "90-day cashflow forecasting",
      "Marketing ROI reports"
    ]
  },
  {
    id: "payments",
    title: "Payment Processing",
    shortDesc: "Get paid faster with integrated payments",
    icon: Wallet,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    fullDescription: "Accept credit cards, ACH transfers, and even crypto. Auto-invoicing generates bills automatically upon job completion. Track who owes you and send payment reminders.",
    benefits: [
      "Credit card processing",
      "ACH bank transfers",
      "Crypto payments (BTC, ETH)",
      "Auto-invoicing",
      "Payment reminders"
    ]
  },
  {
    id: "portal",
    title: "Customer Portal",
    shortDesc: "Keep customers informed every step of the way",
    icon: Shield,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    fullDescription: "Give customers their own portal to track job progress, view photos, approve change orders, and leave reviews. Token-based access with 30-day expiry keeps things secure.",
    benefits: [
      "Job status tracking",
      "Photo galleries",
      "Change order approvals",
      "Digital tip jar",
      "Review collection"
    ]
  },
];

export function FeatureShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <>
      <GlassCard className="p-6" glow="purple">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-display font-bold">Platform Features</h2>
          </div>
          <Badge variant="outline" className="text-purple-400 border-purple-400/30">
            For Contractors
          </Badge>
        </div>

        <p className="text-muted-foreground mb-6">
          Everything you need to run your painting business. Click any feature to learn more.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedFeature(feature)}
              className={`p-4 rounded-xl border border-border/50 hover:border-purple-400/50 transition-all text-left group ${feature.bgColor}`}
              data-testid={`button-feature-${feature.id}`}
            >
              <div className={`w-10 h-10 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{feature.shortDesc}</p>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Ready to streamline your business?
          </p>
          <Link href="/trial-signup">
            <Button className="bg-purple-500 hover:bg-purple-600" data-testid="button-start-trial">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </GlassCard>

      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-lg">
          {selectedFeature && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-xl ${selectedFeature.bgColor} flex items-center justify-center`}>
                    <selectedFeature.icon className={`w-6 h-6 ${selectedFeature.color}`} />
                  </div>
                  <div>
                    <DialogTitle>{selectedFeature.title}</DialogTitle>
                    <DialogDescription>{selectedFeature.shortDesc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {selectedFeature.fullDescription}
                </p>

                <div>
                  <h4 className="font-semibold mb-2">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {selectedFeature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 ${selectedFeature.color}`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Link href="/trial-signup" className="flex-1">
                    <Button className="w-full" data-testid="button-try-feature">
                      Try It Free
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setSelectedFeature(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
