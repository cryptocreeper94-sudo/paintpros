import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAssetBadge, parseHallmark } from "@/lib/hallmark";

interface HallmarkBadgeProps {
  hallmarkNumber: string;
  assetNumber?: string;
  size?: "sm" | "md" | "lg";
  showTier?: boolean;
  className?: string;
}

export function HallmarkBadge({ 
  hallmarkNumber, 
  assetNumber,
  size = "md",
  showTier = true,
  className 
}: HallmarkBadgeProps) {
  const badge = getAssetBadge(assetNumber || hallmarkNumber);
  const parsed = parseHallmark(assetNumber || hallmarkNumber);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  const textSizes = {
    sm: "text-[8px]",
    md: "text-xs",
    lg: "text-sm"
  };

  return (
    <motion.div
      className={cn("relative flex flex-col items-center gap-2", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      data-testid={`hallmark-badge-${hallmarkNumber}`}
    >
      <div 
        className={cn(
          "relative rounded-full flex items-center justify-center",
          sizeClasses[size]
        )}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${badge.color}40, ${badge.color}10)`,
          boxShadow: badge.glow !== 'none' ? badge.glow : undefined,
          border: `2px solid ${badge.color}60`
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${badge.color}20, transparent, ${badge.color}20)`,
          }}
        />
        
        <div 
          className="absolute rounded-full"
          style={{
            width: '30%',
            height: '30%',
            background: `radial-gradient(circle, ${badge.color}, ${badge.color}80)`,
            boxShadow: `0 0 10px ${badge.color}`
          }}
        />
        
        <div 
          className="absolute rounded-full border opacity-30"
          style={{
            width: '60%',
            height: '60%',
            borderColor: badge.color,
            transform: 'rotate(30deg)'
          }}
        />
        <div 
          className="absolute rounded-full border opacity-20"
          style={{
            width: '80%',
            height: '80%',
            borderColor: badge.color,
            transform: 'rotate(-15deg)'
          }}
        />

        <span className="text-2xl relative z-10">{badge.icon}</span>
      </div>

      {showTier && (
        <div className="text-center">
          <div 
            className={cn("font-bold uppercase tracking-wider", textSizes[size])}
            style={{ color: badge.color }}
          >
            {badge.tier}
          </div>
          {badge.edition && (
            <div className={cn("text-muted-foreground", textSizes[size])}>
              {badge.edition}
            </div>
          )}
          {assetNumber && (
            <div 
              className={cn("font-mono mt-1", textSizes[size])}
              style={{ color: badge.color }}
            >
              {assetNumber}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
