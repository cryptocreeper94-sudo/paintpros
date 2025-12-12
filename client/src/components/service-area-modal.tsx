import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, CheckCircle2, Truck, Clock } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import mapImage from "@assets/generated_images/stylized_map_of_nashville_and_surrounding_suburbs.png";

interface ServiceAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const middleTNAreas = [
  { name: "Nashville", description: "Music City's premier painters" },
  { name: "Franklin", description: "Historic downtown to modern estates" },
  { name: "Brentwood", description: "Luxury homes & executive properties" },
  { name: "Murfreesboro", description: "Fast-growing communities we love" },
  { name: "Hendersonville", description: "Lakeside living, exceptional service" },
  { name: "Mt. Juliet", description: "Providence & beyond" },
  { name: "Smyrna", description: "Quality meets affordability" },
  { name: "Lebanon", description: "Wilson County's trusted choice" },
  { name: "Spring Hill", description: "Williamson & Maury Counties" },
  { name: "Gallatin", description: "Sumner County specialists" },
  { name: "Columbia", description: "Mule Town masterwork" },
  { name: "Dickson", description: "Western Middle TN coverage" },
];

const southernKYAreas = [
  { name: "Bowling Green", description: "Kentucky's third-largest city" },
  { name: "Franklin, KY", description: "Just across the border" },
  { name: "Russellville", description: "Logan County & surrounds" },
  { name: "Glasgow", description: "Barren County excellence" },
];

export function ServiceAreaModal({ isOpen, onClose }: ServiceAreaModalProps) {
  const tenant = useTenant();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="modal-service-area"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative glass-panel rounded-2xl border border-accent/30 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
            data-testid="button-close-service-modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto max-h-[90vh]">
            <div className="relative h-48 md:h-64 overflow-hidden">
              <img 
                src={mapImage} 
                alt="Service Area Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-6 h-6 text-accent" />
                  <span className="text-sm font-bold text-accent uppercase tracking-wide">Proudly Serving</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Middle Tennessee & Southern Kentucky</h2>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="glass-panel rounded-xl p-6 mb-8 border border-accent/20 bg-accent/5">
                <div className="flex items-start gap-4">
                  <Star className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Your Neighborhood Painting Experts</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      From the rolling hills of Franklin to the bustling streets of downtown Nashville, from the shores of Old Hickory Lake to the charming towns of Southern Kentucky — we bring <span className="text-accent font-semibold">world-class craftsmanship</span> right to your doorstep. No job too big, no detail too small. Whether you're in a historic Victorian in Germantown or a brand-new build in Mt. Juliet, we treat every home like it's our own.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold">Middle Tennessee</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {middleTNAreas.map((area) => (
                      <div 
                        key={area.name}
                        className="glass-panel rounded-lg p-3 border border-white/5 hover:border-accent/30 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="font-medium text-sm">{area.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/70 transition-colors">
                          {area.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold">Southern Kentucky</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {southernKYAreas.map((area) => (
                      <div 
                        key={area.name}
                        className="glass-panel rounded-lg p-3 border border-white/5 hover:border-accent/30 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span className="font-medium text-sm">{area.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/70 transition-colors">
                          {area.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="glass-panel rounded-xl p-5 border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-accent" />
                      <span className="font-bold">Extended Coverage</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Don't see your area? We regularly travel up to <span className="text-accent font-semibold">75 miles</span> from Nashville for the right project. Give us a call — we'd love to bring our expertise to your community!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/estimate"
                  className="py-4 px-8 bg-accent text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-lg text-lg"
                  data-testid="link-get-estimate-modal"
                >
                  Get Your Free Estimate
                </a>
                <button
                  onClick={onClose}
                  className="py-4 px-8 bg-white/10 border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-colors"
                  data-testid="button-close-modal-bottom"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
