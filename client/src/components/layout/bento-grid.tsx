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
        "grid grid-cols-4 md:grid-cols-12 gap-3 md:gap-4 max-w-7xl mx-auto auto-rows-[minmax(120px,auto)] md:auto-rows-[minmax(180px,auto)]",
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
  colSpan?: number;
  rowSpan?: number;
  mobileColSpan?: number;
  mobileRowSpan?: number;
}

export const BentoItem = ({ 
  className, 
  children, 
  colSpan = 4, 
  rowSpan = 1,
  mobileColSpan,
  mobileRowSpan
}: BentoItemProps) => {
  const mobileCol = mobileColSpan ?? (colSpan >= 8 ? 4 : colSpan >= 4 ? 2 : 2);
  const mobileRow = mobileRowSpan ?? rowSpan;

  const mobileColSpans: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
  };

  const mobileRowSpans: Record<number, string> = {
    1: "row-span-1",
    2: "row-span-2",
    3: "row-span-3",
    4: "row-span-4",
  };

  const colSpans: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  };

  const rowSpans: Record<number, string> = {
    1: "md:row-span-1",
    2: "md:row-span-2",
    3: "md:row-span-3",
    4: "md:row-span-4",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        mobileColSpans[mobileCol] || "col-span-2",
        mobileRowSpans[mobileRow] || "row-span-1",
        colSpans[colSpan] || "md:col-span-4",
        rowSpans[rowSpan] || "md:row-span-1",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
