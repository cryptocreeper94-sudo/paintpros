import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { hover3D, hover3DSubtle, hoverGlow, tapEffect, springTransition } from "@/lib/theme-effects";

type GlowColor = "gold" | "blue" | "green" | "purple" | "accent" | "none";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverEffect?: boolean | "3d" | "subtle" | "glow" | "lift";
  glow?: boolean | GlowColor;
  animatedBorder?: boolean;
  depth?: "shallow" | "medium" | "deep";
}

const glowColors: Record<GlowColor, string> = {
  gold: "before:bg-gold-400/25",
  blue: "before:bg-blue-500/25",
  green: "before:bg-green-500/25",
  purple: "before:bg-purple-500/25",
  accent: "before:bg-accent/25",
  none: "",
};

const depthStyles: Record<string, string> = {
  shallow: "shadow-lg",
  medium: "shadow-xl shadow-black/20",
  deep: "shadow-2xl shadow-black/30",
};

export function GlassCard({ 
  className, 
  children, 
  hoverEffect = true,
  glow = false,
  animatedBorder = false,
  depth = "medium",
  ...props 
}: GlassCardProps) {
  const getHoverEffect = () => {
    if (!hoverEffect) return undefined;
    if (hoverEffect === "3d") return hover3D;
    if (hoverEffect === "subtle") return hover3DSubtle;
    if (hoverEffect === "glow") return hoverGlow;
    if (hoverEffect === "lift") return { y: -8, transition: springTransition };
    return hover3DSubtle;
  };

  const glowColor = typeof glow === "string" ? glow : glow ? "accent" : "none";
  const showGlow = glow !== false && glow !== "none";

  return (
    <motion.div
      whileHover={getHoverEffect()}
      whileTap={hoverEffect ? tapEffect : undefined}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={cn(
        "relative rounded-xl overflow-hidden glass-panel h-full flex flex-col transition-all duration-300",
        depthStyles[depth],
        showGlow && [
          "before:absolute before:inset-0 before:-z-10 before:blur-3xl before:opacity-60 before:transition-opacity before:duration-500",
          "hover:before:opacity-80",
          glowColors[glowColor],
        ],
        animatedBorder && [
          "after:absolute after:inset-0 after:rounded-xl after:p-[1px]",
          "after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",
          "after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
          "after:pointer-events-none",
        ],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
