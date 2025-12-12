import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
};

interface BentoItemProps {
  className?: string;
  children: React.ReactNode;
  colSpan?: number; // 1-12
  rowSpan?: number; // 1-4
}

export const BentoItem = ({ className, children, colSpan = 4, rowSpan = 1 }: BentoItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        `md:col-span-${colSpan} md:row-span-${rowSpan} col-span-12`,
        className
      )}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
      }}
    >
      {children}
    </motion.div>
  );
};
