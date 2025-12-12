import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PoweredByOrbitProps {
  variant?: "light" | "dark" | "auto";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function PoweredByOrbit({
  variant = "auto",
  size = "md",
  showIcon = true,
  className
}: PoweredByOrbitProps) {
  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-1.5",
    lg: "text-base gap-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const colorClasses = {
    light: "text-gray-400",
    dark: "text-gray-600",
    auto: "text-muted-foreground"
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center",
        sizeClasses[size],
        colorClasses[variant],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      data-testid="powered-by-orbit"
    >
      {showIcon && (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={iconSizes[size]}
        >
          <circle 
            cx="12" 
            cy="12" 
            r="8" 
            stroke="currentColor" 
            strokeWidth="1.5"
          />
          <ellipse 
            cx="12" 
            cy="12" 
            rx="11" 
            ry="4" 
            stroke="currentColor" 
            strokeWidth="1.5"
            transform="rotate(-30 12 12)"
          />
          <circle 
            cx="12" 
            cy="12" 
            r="3" 
            fill="currentColor"
          />
        </svg>
      )}
      <span>Powered by</span>
      <span className="font-semibold tracking-wide">ORBIT</span>
    </motion.div>
  );
}
