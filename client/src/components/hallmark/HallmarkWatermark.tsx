import { cn } from "@/lib/utils";

interface HallmarkWatermarkProps {
  hallmarkNumber: string;
  opacity?: number;
  className?: string;
}

export function HallmarkWatermark({
  hallmarkNumber,
  opacity = 0.05,
  className
}: HallmarkWatermarkProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none",
        className
      )}
      aria-hidden="true"
      data-testid="hallmark-watermark"
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity }}
      >
        <div className="transform -rotate-45 whitespace-nowrap scale-[10]">
          <div className="text-[8rem] font-bold tracking-widest text-current leading-none">
            ORBIT
          </div>
          <div className="text-2xl font-mono tracking-wider text-center mt-4">
            {hallmarkNumber}
          </div>
        </div>
      </div>
    </div>
  );
}
