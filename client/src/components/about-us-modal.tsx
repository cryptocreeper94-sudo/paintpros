import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTenant } from "@/context/TenantContext";
import { Star, CheckCircle2, Shield, Clock, Award } from "lucide-react";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  const tenant = useTenant();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-accent fill-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-accent uppercase tracking-wider">About Us</p>
              <DialogTitle className="text-xl font-display">{tenant.name}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Family-owned and operated since 2015, we've been transforming homes and businesses across Middle Tennessee with premium craftsmanship and unmatched attention to detail.
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Our team of skilled painters brings decades of combined experience to every project, whether it's a single room refresh or a complete commercial renovation. We take pride in treating every home like our own.
          </p>

          <div className="grid grid-cols-2 gap-3 py-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10">
              <Shield className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">Licensed & Insured</p>
                <p className="text-[10px] text-muted-foreground">Full coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10">
              <Award className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">{tenant.credentials?.warrantyYears || 3}-Year Warranty</p>
                <p className="text-[10px] text-muted-foreground">Workmanship</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10">
              <Clock className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">On-Time</p>
                <p className="text-[10px] text-muted-foreground">Always punctual</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10">
              <Star className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs font-bold">500+ Projects</p>
                <p className="text-[10px] text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-bold">Our Promise</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Premium materials from trusted brands like Sherwin-Williams and Benjamin Moore</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Detailed prep work ensuring long-lasting, flawless finishes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Clean, respectful crews who protect your home and belongings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Transparent pricing with no hidden fees or surprises</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground text-center">
              Serving Nashville and surrounding areas including Franklin, Brentwood, Murfreesboro, and more.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
