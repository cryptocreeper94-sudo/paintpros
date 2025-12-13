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
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
            data-testid="button-close-service-modal"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="overflow-y-auto max-h-[90vh]">
            {/* Large landscape map on mobile */}
            <div className="relative h-[50vw] min-h-[200px] md:h-64 overflow-hidden">
              <img 
                src={mapImage} 
                alt="Service Area Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <MapPin className="w-4 h-4 md:w-6 md:h-6 text-accent" />
                  <span className="text-[10px] md:text-sm font-bold text-accent uppercase tracking-wide">Proudly Serving</span>
                </div>
                <h2 className="text-xl md:text-4xl font-display font-bold">Middle Tennessee & Southern Kentucky</h2>
              </div>
            </div>

            <div className="p-3 md:p-8">
              <div className="glass-panel rounded-xl p-3 md:p-6 mb-4 md:mb-8 border border-accent/20 bg-accent/5">
                <div className="flex items-start gap-2 md:gap-4">
                  <Star className="w-5 h-5 md:w-8 md:h-8 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">Your Neighborhood Painting Experts</h3>
                    <p className="text-xs md:text-base text-muted-foreground leading-relaxed line-clamp-3 md:line-clamp-none">
                      From the rolling hills of Franklin to downtown Nashville — we bring <span className="text-accent font-semibold">world-class craftsmanship</span> right to your doorstep.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8 mb-4 md:mb-8">
                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold">Middle TN</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                    {middleTNAreas.slice(0, 6).map((area) => (
                      <div 
                        key={area.name}
                        className="glass-panel rounded-lg p-1.5 md:p-3 border border-white/5 hover:border-accent/30 transition-colors group"
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-accent flex-shrink-0" />
                          <span className="font-medium text-[10px] md:text-sm truncate">{area.name}</span>
                        </div>
                      </div>
                    ))}
                    <div className="text-[10px] md:text-xs text-muted-foreground p-1">+{middleTNAreas.length - 6} more</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Truck className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                    </div>
                    <h3 className="text-xs md:text-lg font-bold">Southern KY</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 mb-2 md:mb-6">
                    {southernKYAreas.map((area) => (
                      <div 
                        key={area.name}
                        className="glass-panel rounded-lg p-1.5 md:p-3 border border-white/5 hover:border-accent/30 transition-colors group"
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-accent flex-shrink-0" />
                          <span className="font-medium text-[10px] md:text-sm truncate">{area.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="glass-panel rounded-lg md:rounded-xl p-2 md:p-5 border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent hidden md:block">
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-3">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                      <span className="text-xs md:text-base font-bold">Extended Coverage</span>
                    </div>
                    <p className="text-[10px] md:text-sm text-muted-foreground">
                      We travel up to <span className="text-accent font-semibold">75 miles</span> from Nashville!
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
                <a
                  href="/estimate"
                  className="py-2 md:py-4 px-4 md:px-8 bg-accent text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-lg text-sm md:text-lg"
                  data-testid="link-get-estimate-modal"
                >
                  Get Your Free Estimate
                </a>
                <button
                  onClick={onClose}
                  className="py-2 md:py-4 px-4 md:px-8 bg-white/10 border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-colors text-sm md:text-base"
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
