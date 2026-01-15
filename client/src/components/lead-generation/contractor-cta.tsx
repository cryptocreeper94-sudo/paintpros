import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  ArrowRight, 
  Users, 
  TrendingUp,
  Target,
  Zap,
  Paintbrush,
  Wrench,
  Thermometer,
  Hammer,
  HardHat
} from "lucide-react";
import { Link } from "wouter";

const benefits = [
  { icon: Target, text: "Pre-qualified leads in your area" },
  { icon: TrendingUp, text: "Grow your customer base" },
  { icon: Users, text: "Customers ready to hire" },
  { icon: Zap, text: "Instant lead notifications" },
];

const trades = [
  { icon: Paintbrush, label: "Painting" },
  { icon: Zap, label: "Electrical" },
  { icon: Thermometer, label: "HVAC" },
  { icon: Hammer, label: "Carpentry" },
  { icon: HardHat, label: "General" },
];

export function ContractorCTA() {
  return (
    <GlassCard className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 h-full" glow="purple">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-display font-bold">Grow Your Business</h2>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 ml-auto">
          Pro
        </Badge>
      </div>

      <p className="text-muted-foreground mb-4 text-sm">
        We generate leads for contractors like you. Register to receive pre-qualified 
        customers actively looking for your services.
      </p>

      {/* Trade icons row */}
      <div className="flex justify-center gap-3 mb-4 py-2 border-y border-border/50">
        {trades.map((trade, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <trade.icon className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] text-muted-foreground">{trade.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 text-xs"
          >
            <benefit.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{benefit.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/contractor-application" className="flex-1">
          <Button 
            className="w-full bg-purple-500 hover:bg-purple-600"
            data-testid="button-contractor-apply"
          >
            Register for Leads
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/partners">
          <Button variant="outline" data-testid="button-contractor-login">
            Login
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
