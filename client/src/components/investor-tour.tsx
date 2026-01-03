import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "[data-tour='hero']",
    title: "Welcome to PaintPros.io",
    content: "The most comprehensive trades platform ever built. 384+ API endpoints, 60+ database tables, and 6 AI-powered modules.",
    position: "bottom"
  },
  {
    target: "[data-tour='metrics']",
    title: "Real-Time Platform Metrics",
    content: "Live KPIs showing ARR, active tenants, LTV:CAC ratio, and AI usage. These numbers update in real-time from our database.",
    position: "bottom"
  },
  {
    target: "[data-tour='modules']",
    title: "v1.6.1 Breakthrough Modules",
    content: "Six competition-destroying AI systems: Field Operations, Revenue Intelligence, Site Capture, Back Office, Workforce Network, and Trust Layer.",
    position: "top"
  },
  {
    target: "[data-tour='blockchain']",
    title: "Blockchain Verification",
    content: "Industry-first dual-chain verification with Solana and Darkwave. Document stamping, NFT milestones, and smart contracts.",
    position: "left"
  },
  {
    target: "[data-tour='competitors']",
    title: "Competitor Comparison",
    content: "See how we stack up against ServiceTitan, Jobber, and HouseCall Pro. We lead in every category.",
    position: "top"
  },
  {
    target: "[data-tour='verticals']",
    title: "Multi-Vertical Expansion",
    content: "Starting with painting, expanding to roofing, HVAC, electrical, plumbing, and construction. $2.2T+ combined market.",
    position: "top"
  },
  {
    target: "[data-tour='roi']",
    title: "ROI Calculator",
    content: "Calculate your potential returns. See projected savings and revenue growth with our platform.",
    position: "top"
  },
  {
    target: "[data-tour='cta']",
    title: "Ready to Invest?",
    content: "Contact our team to schedule a detailed demo and discuss investment opportunities.",
    position: "top"
  }
];

interface InvestorTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvestorTour({ isOpen, onClose }: InvestorTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen) return;
    
    const step = TOUR_STEPS[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      
      setTimeout(() => {
        const newRect = element.getBoundingClientRect();
        let top = newRect.top + window.scrollY;
        let left = newRect.left;
        
        switch (step.position) {
          case "bottom":
            top += newRect.height + 16;
            left += newRect.width / 2 - 160;
            break;
          case "top":
            top -= 180;
            left += newRect.width / 2 - 160;
            break;
          case "left":
            left -= 340;
            top += newRect.height / 2 - 80;
            break;
          case "right":
            left += newRect.width + 16;
            top += newRect.height / 2 - 80;
            break;
        }
        
        setPosition({ top: Math.max(80, top), left: Math.max(16, Math.min(left, window.innerWidth - 340)) });
      }, 400);
    }
  }, [currentStep, isOpen]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]" 
        onClick={handleSkip}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="fixed z-[9999] w-[calc(100vw-32px)] sm:w-80 max-w-80 p-4 sm:p-5 rounded-xl bg-card border border-border shadow-2xl left-4 sm:left-auto right-4 sm:right-auto"
          style={{ 
            top: position.top,
            ...(typeof window !== 'undefined' && window.innerWidth >= 640 ? { left: position.left } : {})
          }}
        >
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 p-1 rounded-md hover:bg-white/10 transition-colors"
            data-testid="button-tour-close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <span className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{step.content}</p>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              data-testid="button-tour-prev"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentStep ? "bg-accent" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleNext}
              data-testid="button-tour-next"
            >
              {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
              {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
