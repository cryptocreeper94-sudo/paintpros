import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glow?: boolean;
}

export function GlassCard({ 
  className, 
  children, 
  hoverEffect = true,
  glow = false,
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.01 } : undefined}
      className={cn(
        "relative rounded-xl overflow-hidden glass-panel h-full flex flex-col",
        glow && "before:absolute before:inset-0 before:-z-10 before:bg-accent/20 before:blur-3xl before:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
