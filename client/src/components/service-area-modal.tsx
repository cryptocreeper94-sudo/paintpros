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
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-8 overflow-y-auto"
        data-testid="modal-service-area"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative glass-panel rounded-2xl border border-accent/30 w-[95vw] max-w-5xl md:max-w-6xl max-h-[calc(100vh-5rem)] shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
            data-testid="button-close-service-modal"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <div className="overflow-y-auto max-h-[85vh] overscroll-contain touch-pan-y">
            {/* Landscape map header */}
            <div className="relative h-[35vw] min-h-[150px] max-h-[180px] md:h-48 overflow-hidden">
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

            <div className="p-3 md:p-6 bg-gradient-to-b from-amber-50 to-white dark:from-[#f5f0e6] dark:to-[#faf8f3]">
              <div className="rounded-xl p-3 md:p-4 mb-3 md:mb-5 border border-[#344e41]/20 bg-white/80 shadow-sm">
                <div className="flex items-start gap-2 md:gap-3">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-[#344e41] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm md:text-lg font-bold mb-1 text-gray-900">Your Neighborhood Painting Experts</h3>
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                      From the rolling hills of Franklin to downtown Nashville — we bring <span className="text-[#344e41] font-semibold">world-class craftsmanship</span> right to your doorstep.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-3 md:mb-5">
                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                    <div className="w-6 h-6 rounded-lg bg-[#344e41]/20 flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-[#344e41]" />
                    </div>
                    <h3 className="text-xs md:text-base font-bold text-gray-900">Middle TN</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {middleTNAreas.slice(0, 6).map((area) => (
                      <div 
                        key={area.name}
                        className="rounded-md px-2 py-1 border border-[#344e41]/20 bg-white/60 hover:border-[#344e41]/40 transition-colors"
                      >
                        <span className="font-medium text-[10px] md:text-xs text-gray-800">{area.name}</span>
                      </div>
                    ))}
                    <span className="text-[10px] md:text-xs text-gray-500 px-1 py-1">+{middleTNAreas.length - 6} more</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                    <div className="w-6 h-6 rounded-lg bg-[#344e41]/20 flex items-center justify-center">
                      <Truck className="w-3 h-3 text-[#344e41]" />
                    </div>
                    <h3 className="text-xs md:text-base font-bold text-gray-900">Southern KY</h3>
                  </div>
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {southernKYAreas.map((area) => (
                      <div 
                        key={area.name}
                        className="rounded-md px-2 py-1 border border-[#344e41]/20 bg-white/60 hover:border-[#344e41]/40 transition-colors"
                      >
                        <span className="font-medium text-[10px] md:text-xs text-gray-800">{area.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <div className="rounded-lg p-3 border border-[#344e41]/20 bg-[#344e41]/10 h-full flex items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#344e41] flex-shrink-0" />
                      <p className="text-xs text-gray-700">
                        We travel up to <span className="text-[#344e41] font-semibold">75 miles</span> from Nashville!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 md:gap-3 justify-center">
                <a
                  href="/estimate"
                  className="py-2 md:py-3 px-4 md:px-6 bg-[#344e41] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#2a3f35] transition-colors shadow-lg text-xs md:text-base"
                  data-testid="link-get-estimate-modal"
                >
                  Get Your Free Estimate
                </a>
                <button
                  onClick={onClose}
                  className="py-2 md:py-3 px-4 md:px-6 bg-gray-200 border border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-colors text-xs md:text-sm"
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
