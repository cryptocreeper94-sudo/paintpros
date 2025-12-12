import { motion } from "framer-motion";

interface FlipButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function FlipButton({ children, onClick, className, disabled }: FlipButtonProps) {
  return (
    <motion.button
      className={`glass-btn px-6 py-3 rounded-full text-foreground font-bold tracking-wide uppercase text-sm ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial="initial"
      whileInView="animate"
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-accent/20 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}
