import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Calculator, Paintbrush, Zap, Droplets, Wind, 
  Home, Hammer, HardHat, TreeDeciduous, Mic, Sparkles 
} from "lucide-react";

const trades = [
  { name: "Painting", icon: Paintbrush, color: "text-orange-400", count: 10 },
  { name: "Electrical", icon: Zap, color: "text-yellow-400", count: 10 },
  { name: "Plumbing", icon: Droplets, color: "text-blue-400", count: 10 },
  { name: "HVAC", icon: Wind, color: "text-cyan-400", count: 10 },
  { name: "Roofing", icon: Home, color: "text-red-400", count: 10 },
  { name: "Carpentry", icon: Hammer, color: "text-amber-600", count: 10 },
  { name: "Concrete", icon: HardHat, color: "text-gray-400", count: 10 },
  { name: "Landscaping", icon: TreeDeciduous, color: "text-green-400", count: 10 },
];

export function TradeWorksBlogBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="my-8"
    >
      <GlassCard className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-amber-500/30" glow="gold">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white" data-testid="text-tradeworks-title">
                  TradeWorks AI
                </h3>
                <p className="text-amber-400 text-sm">The Professional Field Toolkit</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">
              85+ calculators for 8 trades with AI-powered voice assistant. Get instant estimates, 
              material calculations, and job pricing right from your phone.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {trades.map((trade) => (
                <Badge 
                  key={trade.name}
                  variant="outline" 
                  className={`${trade.color} border-current/30 bg-current/10`}
                >
                  <trade.icon className="w-3 h-3 mr-1" />
                  {trade.name}
                  <span className="ml-1 text-xs opacity-70">({trade.count})</span>
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Voice-powered by ElevenLabs</span>
              <Sparkles className="w-4 h-4 text-amber-400 ml-2" />
              <span>AI Assistance Included</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/tradeworks">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold w-full"
                data-testid="button-tradeworks-try"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Try Free Calculator
              </Button>
            </Link>
            <Link href="/tradeworks#features">
              <Button 
                variant="outline" 
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 w-full"
                data-testid="button-tradeworks-features"
              >
                View All 85+ Tools
              </Button>
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
