import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, Brush, Clock, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      footer: "Only the best materials touch your walls. We never cut corners on quality.",
      exclusions: null,
      showTermsLink: false
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
      footer: "Your time matters. We show up when we say we will, every single time.",
      exclusions: null,
      showTermsLink: false
    },
    warranty: {
      title: `${warrantyYears}-Year Warranty`,
      icon: CheckCircle2,
      description: "Free from defects in workmanship for the full warranty period from project completion.",
      items: [
        "Full workmanship coverage for " + warrantyYears + " years",
        "Repairs limited to affected areas at our discretion",
        "Claims must be submitted within 30 days of discovery",
        "This warranty replaces all other warranties, express or implied"
      ],
      footer: "We stand behind every project. If you're not completely satisfied, we'll make it right.",
      exclusions: [
        "Damage from accidents, misuse, neglect, or water intrusion",
        "Normal wear and tear, fading, or extreme weather",
        "Surfaces previously identified as unsuitable (damaged wood, moisture issues)"
      ],
      showTermsLink: true
    }
  };

  const { title, icon: Icon, description, items, footer, exclusions, showTermsLink } = content[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/20">
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
                <span className="text-sm md:text-base text-foreground">{item}</span>
              </li>
            ))}
          </ul>

          {exclusions && exclusions.length > 0 && (
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs font-medium text-muted-foreground mb-2">Does NOT cover:</p>
              <ul className="space-y-1.5">
                {exclusions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="text-sm md:text-base text-muted-foreground italic pt-4 border-t border-white/10">
            {footer}
          </p>
        </div>

        {showTermsLink && (
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/terms'}
              className="gap-2"
              data-testid="button-view-full-terms"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Terms & Warranty
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
