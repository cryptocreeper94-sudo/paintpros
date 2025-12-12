import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}

export function Marquee({ items, direction = "left", speed = "normal", className }: MarqueeProps) {
  const duration = {
    fast: "20s",
    normal: "40s",
    slow: "60s",
  }[speed];

  return (
    <div className={cn("overflow-hidden flex w-full mask-gradient-x", className)}>
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-8 items-center py-4",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        )}
        style={{ animationDuration: duration }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-2xl font-display font-bold text-muted-foreground/50 whitespace-nowrap px-8">
            {item}
          </span>
        ))}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-8 items-center py-4",
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        )}
        style={{ animationDuration: duration }}
      >
        {items.map((item, i) => (
          <span key={`dup-${i}`} className="text-2xl font-display font-bold text-muted-foreground/50 whitespace-nowrap px-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
