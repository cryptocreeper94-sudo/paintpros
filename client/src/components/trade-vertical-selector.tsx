import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  PaintRoller, 
  Home, 
  Wind, 
  Zap, 
  Droplets, 
  TreePine, 
  Hammer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export interface TradeVertical {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  icon: typeof PaintRoller;
  color: string;
  bgGradient: string;
  status: "live" | "coming_soon";
  marketSize: string;
  features: string[];
}

export const TRADE_VERTICALS: TradeVertical[] = [
  {
    id: "painting",
    name: "PaintPros",
    tagline: "White-Label Websites for Painting Contractors",
    domain: "paintpros.io",
    icon: PaintRoller,
    color: "text-amber-500",
    bgGradient: "from-amber-500/20 to-orange-500/10",
    status: "live",
    marketSize: "$46.5B",
    features: ["Interior/Exterior Estimates", "Color Visualizer", "Crew Management"]
  },
  {
    id: "roofing",
    name: "RoofPros",
    tagline: "White-Label Websites for Roofing Contractors",
    domain: "roofpros.io",
    icon: Home,
    color: "text-slate-500",
    bgGradient: "from-slate-500/20 to-gray-500/10",
    status: "coming_soon",
    marketSize: "$56B",
    features: ["Roof Inspections", "Storm Damage Reports", "Material Calculator"]
  },
  {
    id: "hvac",
    name: "HVACPros",
    tagline: "White-Label Websites for HVAC Contractors",
    domain: "hvacpros.io",
    icon: Wind,
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/20 to-blue-500/10",
    status: "coming_soon",
    marketSize: "$130B",
    features: ["System Sizing", "Maintenance Plans", "Energy Audits"]
  },
  {
    id: "electrical",
    name: "ElectricPros",
    tagline: "White-Label Websites for Electrical Contractors",
    domain: "electricpros.io",
    icon: Zap,
    color: "text-yellow-500",
    bgGradient: "from-yellow-500/20 to-amber-500/10",
    status: "coming_soon",
    marketSize: "$200B",
    features: ["Load Calculations", "Panel Upgrades", "EV Charger Installs"]
  },
  {
    id: "plumbing",
    name: "PlumbPros",
    tagline: "White-Label Websites for Plumbing Contractors",
    domain: "plumbpros.io",
    icon: Droplets,
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-indigo-500/10",
    status: "coming_soon",
    marketSize: "$130B",
    features: ["Drain Services", "Water Heater Installs", "Repiping Estimates"]
  },
  {
    id: "landscaping",
    name: "LandscapePros",
    tagline: "White-Label Websites for Landscaping Contractors",
    domain: "landscapepros.io",
    icon: TreePine,
    color: "text-green-500",
    bgGradient: "from-green-500/20 to-emerald-500/10",
    status: "coming_soon",
    marketSize: "$130B",
    features: ["Design Visualization", "Maintenance Plans", "Irrigation Systems"]
  },
  {
    id: "general",
    name: "BuildPros",
    tagline: "White-Label Websites for General Contractors",
    domain: "buildpros.io",
    icon: Hammer,
    color: "text-orange-500",
    bgGradient: "from-orange-500/20 to-red-500/10",
    status: "coming_soon",
    marketSize: "$1.5T",
    features: ["Project Management", "Bid Tracking", "Subcontractor Portal"]
  }
];

interface TradeVerticalSelectorProps {
  onSelect?: (vertical: TradeVertical) => void;
  selectedId?: string;
  compact?: boolean;
}

export function TradeVerticalSelector({ onSelect, selectedId = "painting", compact = false }: TradeVerticalSelectorProps) {
  const initialIndex = TRADE_VERTICALS.findIndex(v => v.id === selectedId);
  const [activeIndex, setActiveIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const activeVertical = TRADE_VERTICALS[activeIndex] ?? TRADE_VERTICALS[0];

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? TRADE_VERTICALS.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    if (onSelect) {
      onSelect(TRADE_VERTICALS[newIndex]);
    }
  };

  const handleNext = () => {
    const newIndex = activeIndex === TRADE_VERTICALS.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    if (onSelect) {
      onSelect(TRADE_VERTICALS[newIndex]);
    }
  };

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    if (onSelect) {
      onSelect(TRADE_VERTICALS[index]);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {TRADE_VERTICALS.map((vertical, index) => {
          const Icon = vertical.icon;
          return (
            <motion.button
              key={vertical.id}
              onClick={() => handleSelect(index)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                activeIndex === index
                  ? `bg-gradient-to-r ${vertical.bgGradient} border-white/30`
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`button-trade-${vertical.id}`}
            >
              <Icon className={cn("w-4 h-4", vertical.color)} />
              <span className="text-sm font-medium">{vertical.name}</span>
              {vertical.status === "live" && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <GlassCard className="p-6 overflow-visible" glow="accent" data-testid="card-trade-selector">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-purple-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              Multi-Trade Platform
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </h3>
            <p className="text-sm text-muted-foreground">Select a trade vertical to explore</p>
          </div>
        </div>
        <Link href="/trade-verticals">
          <motion.span 
            className="text-xs text-accent hover:underline cursor-pointer"
            whileHover={{ x: 3 }}
            data-testid="link-view-all-trades"
          >
            View All
          </motion.span>
        </Link>
      </div>

      {/* Carousel Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <motion.button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-testid="button-trade-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-2 justify-center">
            {TRADE_VERTICALS.map((vertical, index) => {
              const Icon = vertical.icon;
              const isActive = index === activeIndex;
              return (
                <motion.button
                  key={vertical.id}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "relative p-3 rounded-xl border transition-all",
                    isActive
                      ? `bg-gradient-to-br ${vertical.bgGradient} border-white/30 shadow-lg`
                      : "bg-white/5 border-white/10 hover:bg-white/10 opacity-60"
                  )}
                  whileHover={{ scale: isActive ? 1 : 1.05, opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  data-testid={`button-trade-icon-${vertical.id}`}
                >
                  <Icon className={cn("w-5 h-5", vertical.color)} />
                  {vertical.status === "live" && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-testid="button-trade-next"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Active Trade Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVertical.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "p-6 rounded-2xl border border-white/20 bg-gradient-to-br",
            activeVertical.bgGradient
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center",
                  "bg-white/20 backdrop-blur-sm border border-white/30"
                )}
                whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              >
                <activeVertical.icon className={cn("w-8 h-8", activeVertical.color)} />
              </motion.div>
              <div>
                <h4 className="text-2xl font-bold flex items-center gap-2">
                  {activeVertical.name}
                  {activeVertical.status === "live" ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      LIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      COMING SOON
                    </span>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground">{activeVertical.tagline}</p>
                <p className="text-xs font-mono text-accent mt-1">{activeVertical.domain}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{activeVertical.marketSize}</p>
              <p className="text-xs text-muted-foreground">Market Size</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {activeVertical.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/10 border border-white/10"
              >
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {TRADE_VERTICALS.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === activeIndex
                ? "w-6 bg-accent"
                : "bg-white/30 hover:bg-white/50"
            )}
            data-testid={`button-trade-dot-${index}`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
