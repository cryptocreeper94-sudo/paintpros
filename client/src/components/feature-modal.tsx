import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Brush, Clock } from "lucide-react";

interface FeatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'materials' | 'ontime' | 'warranty';
  warrantyYears?: number;
}

export function FeatureModal({ open, onOpenChange, type, warrantyYears = 3 }: FeatureModalProps) {
  const content = {
    materials: {
      title: "Premium Materials",
      icon: Brush,
      description: "We partner with industry-leading brands to deliver exceptional results.",
      items: [
        "Sherwin-Williams premium paints",
        "Benjamin Moore finest finishes", 
        "PPG professional-grade coatings",
        "Eco-friendly and low-VOC options available"
      ],
      footer: "Only the best materials touch your walls. We never cut corners on quality."
    },
    ontime: {
      title: "On-Time Guarantee",
      icon: Clock,
      description: "We value your time and schedule every project with precision.",
      items: [
        "Same-day arrival windows",
        "Real-time project updates",
        "Guaranteed completion dates",
        "Flexible scheduling options"
      ],
      footer: "Your time matters. We show up when we say we will, every single time."
    },
    warranty: {
      title: `${warrantyYears}-Year Warranty`,
      icon: CheckCircle2,
      description: "Our commitment to quality extends well beyond project completion.",
      items: [
        "Full workmanship coverage",
        "Free touch-ups & repairs",
        "100% satisfaction guarantee",
        "Transferable to new homeowners"
      ],
      footer: "We stand behind every project. If you're not completely satisfied, we'll make it right."
    }
  };

  const { title, icon: Icon, description, items, footer } = content[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto bg-background/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent/20 p-3 rounded-xl">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <DialogTitle className="text-xl md:text-2xl font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base md:text-lg text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-base md:text-lg text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          
          <p className="text-sm md:text-base text-muted-foreground italic pt-4 border-t border-white/10">
            {footer}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
