import { Variants, Transition } from "framer-motion";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const smoothTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const hover3D = {
  scale: 1.02,
  y: -8,
  rotateX: 2,
  rotateY: -2,
  transition: springTransition,
};

export const hover3DSubtle = {
  scale: 1.01,
  y: -4,
  rotateX: 1,
  rotateY: -1,
  transition: smoothTransition,
};

export const hoverGlow = {
  scale: 1.02,
  y: -6,
  boxShadow: "0 25px 50px -12px rgba(212, 168, 83, 0.25), 0 0 30px rgba(212, 168, 83, 0.15)",
  transition: springTransition,
};

export const hoverLift = {
  y: -8,
  transition: springTransition,
};

export const tapEffect = {
  scale: 0.98,
  y: 0,
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const glowGradients = {
  gold: "from-gold-400/30 via-accent/20 to-orange-500/10",
  blue: "from-blue-500/30 via-purple-500/20 to-pink-500/10",
  green: "from-green-500/30 via-teal-500/20 to-cyan-500/10",
  purple: "from-purple-500/30 via-pink-500/20 to-rose-500/10",
  accent: "from-accent/30 via-gold-400/20 to-amber-500/10",
  mixed: "from-accent/20 via-blue-500/15 to-purple-500/10",
};

export const glowShadows = {
  gold: "0 0 40px rgba(212, 168, 83, 0.3), 0 0 80px rgba(212, 168, 83, 0.15)",
  blue: "0 0 40px rgba(59, 130, 246, 0.3), 0 0 80px rgba(59, 130, 246, 0.15)",
  green: "0 0 40px rgba(34, 197, 94, 0.3), 0 0 80px rgba(34, 197, 94, 0.15)",
  purple: "0 0 40px rgba(168, 85, 247, 0.3), 0 0 80px rgba(168, 85, 247, 0.15)",
  accent: "0 0 40px rgba(90, 122, 77, 0.3), 0 0 80px rgba(90, 122, 77, 0.15)",
};

export const carouselDragConstraints = {
  left: -100,
  right: 0,
};

export const carouselTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const iconContainerStyles = {
  base: "rounded-xl flex items-center justify-center shadow-lg border border-white/10",
  sizes: {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  },
  gradients: {
    gold: "bg-gradient-to-br from-gold-400/30 to-accent/20 shadow-gold-400/20",
    blue: "bg-gradient-to-br from-blue-500/30 to-purple-500/20 shadow-blue-500/20",
    green: "bg-gradient-to-br from-green-500/30 to-teal-500/20 shadow-green-500/20",
    purple: "bg-gradient-to-br from-purple-500/30 to-pink-500/20 shadow-purple-500/20",
    accent: "bg-gradient-to-br from-accent/30 to-blue-500/20 shadow-accent/20",
    yellow: "bg-gradient-to-br from-yellow-500/30 to-orange-500/20 shadow-yellow-500/20",
  },
};

export const cardBackgroundStyles = {
  gold: "bg-gradient-to-br from-gold-400/10 via-transparent to-accent/5",
  blue: "bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5",
  green: "bg-gradient-to-br from-green-500/10 via-transparent to-teal-500/5",
  purple: "bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/5",
  accent: "bg-gradient-to-br from-accent/10 via-transparent to-blue-500/5",
  yellow: "bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/5",
  mixed: "bg-gradient-to-br from-accent/10 via-blue-500/5 to-purple-500/5",
};

export const glassPanelClasses = 
  "backdrop-blur-xl bg-background/40 border border-white/10 shadow-2xl";

export const animatedBorderClasses = 
  "before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer";
