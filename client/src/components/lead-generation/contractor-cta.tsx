import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  DollarSign,
  Shield
} from "lucide-react";
import { Link } from "wouter";

const benefits = [
  { icon: Users, text: "Access qualified local leads" },
  { icon: TrendingUp, text: "Grow your customer base" },
  { icon: DollarSign, text: "Increase revenue" },
  { icon: Shield, text: "Verified customer info" },
];

export function ContractorCTA() {
  return (
    <GlassCard className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20" glow="purple">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-display font-bold">Are You a Painter?</h2>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          Pro
        </Badge>
      </div>

      <p className="text-muted-foreground mb-6">
        Join the PaintPros network and get access to qualified leads in your area. 
        Our platform helps you manage your entire business - from leads to payments.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 text-sm"
          >
            <benefit.icon className="w-4 h-4 text-purple-400" />
            <span>{benefit.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/contractor-application" className="flex-1">
          <Button 
            className="w-full bg-purple-500 hover:bg-purple-600"
            data-testid="button-contractor-apply"
          >
            Join as Contractor
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href="/partners">
          <Button variant="outline" data-testid="button-contractor-login">
            Contractor Login
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
