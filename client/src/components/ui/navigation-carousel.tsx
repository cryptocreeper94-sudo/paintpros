import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Calculator, Calendar, Users, Bell, Gift, BarChart3, FileText, MessageSquare, Lock, Settings, Shield } from "lucide-react";
import { GlassCard } from "./glass-card";
import { Button } from "./button";
import { Input } from "./input";
import { useToast } from "@/hooks/use-toast";

import painterConsulting from "@assets/generated_images/painter_consulting_with_customer.png";
import estimateCalculator from "@assets/generated_images/digital_estimate_calculator_interface.png";
import happyFamily from "@assets/generated_images/happy_family_with_painted_home.png";
import bookingCalendar from "@assets/generated_images/appointment_booking_calendar.png";
import businessDashboard from "@assets/generated_images/business_management_dashboard.png";
import paintingCrew from "@assets/generated_images/professional_painting_crew_at_work.png";

interface HelpSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: typeof Home;
  link: string;
  linkText: string;
}

const customerSlides: HelpSlide[] = [
  {
    id: "welcome",
    title: "Welcome to Your Painting Partner",
    description: "From getting a quote to booking your appointment, everything is at your fingertips.",
    image: painterConsulting,
    icon: Home,
    link: "/help",
    linkText: "Learn More"
  },
  {
    id: "estimate",
    title: "Get an Instant Estimate",
    description: "Use our smart estimator to get an accurate quote in seconds.",
    image: estimateCalculator,
    icon: Calculator,
    link: "/estimate",
    linkText: "Try Estimator"
  },
  {
    id: "booking",
    title: "Book Your Appointment",
    description: "Schedule your painting service with our easy 5-step booking wizard.",
    image: bookingCalendar,
    icon: Calendar,
    link: "/estimate",
    linkText: "Book Now"
  },
  {
    id: "account",
    title: "Your Customer Portal",
    description: "View estimates, track jobs, and manage your appointments in one place.",
    image: happyFamily,
    icon: Users,
    link: "/account",
    linkText: "My Account"
  },
  {
    id: "notifications",
    title: "Stay Informed",
    description: "Get reminders 24 hours and 1 hour before your scheduled service.",
    image: bookingCalendar,
    icon: Bell,
    link: "/account",
    linkText: "Settings"
  },
  {
    id: "referral",
    title: "Refer & Earn",
    description: "Share your referral link with friends and family to earn rewards.",
    image: happyFamily,
    icon: Gift,
    link: "/account",
    linkText: "Get Link"
  }
];

const staffSlides: HelpSlide[] = [
  {
    id: "dashboards",
    title: "Role-Based Dashboards",
    description: "Access your personalized dashboard based on your role.",
    image: businessDashboard,
    icon: BarChart3,
    link: "/admin",
    linkText: "Dashboard"
  },
  {
    id: "crm",
    title: "CRM & Pipeline",
    description: "Track leads from first contact to completed job.",
    image: businessDashboard,
    icon: Users,
    link: "/admin",
    linkText: "View CRM"
  },
  {
    id: "calendar",
    title: "CRM Calendar",
    description: "Schedule appointments and set reminders for follow-ups.",
    image: bookingCalendar,
    icon: Calendar,
    link: "/admin",
    linkText: "Calendar"
  },
  {
    id: "documents",
    title: "Document Center",
    description: "Create contracts, estimates, and get digital signatures.",
    image: estimateCalculator,
    icon: FileText,
    link: "/admin",
    linkText: "Documents"
  },
  {
    id: "crew",
    title: "Crew Management",
    description: "Time tracking, job notes, and incident reporting.",
    image: paintingCrew,
    icon: Settings,
    link: "/crew-lead",
    linkText: "Crew Portal"
  },
  {
    id: "messaging",
    title: "Internal Messaging",
    description: "Real-time chat with your team and customers.",
    image: painterConsulting,
    icon: MessageSquare,
    link: "/admin",
    linkText: "Messages"
  }
];

const VALID_PINS = ["0424", "1111", "2222", "3333", "4444"];

export function NavigationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"customer" | "staff">("customer");
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [staffUnlocked, setStaffUnlocked] = useState(false);
  const { toast } = useToast();

  const slides = mode === "customer" ? customerSlides : staffSlides;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleModeToggle = (newMode: "customer" | "staff") => {
    if (newMode === "staff" && !staffUnlocked) {
      setShowPinInput(true);
    } else {
      setMode(newMode);
      setCurrentIndex(0);
    }
  };

  const handlePinSubmit = async () => {
    if (VALID_PINS.includes(pinValue)) {
      setStaffUnlocked(true);
      setMode("staff");
      setCurrentIndex(0);
      setShowPinInput(false);
      setPinValue("");
      toast({
        title: "Staff Access Granted",
        description: "You can now view staff tutorials.",
      });
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid staff PIN.",
        variant: "destructive",
      });
      setPinValue("");
    }
  };

  const currentSlide = slides[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <GlassCard 
      className="relative overflow-hidden h-full p-0"
      glow
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 pointer-events-none" />
      
      <div className="absolute top-1.5 md:top-2 left-1/2 -translate-x-1/2 z-20 flex gap-1 bg-background/50 backdrop-blur-md rounded-full p-0.5 border border-white/20">
        <button
          onClick={() => handleModeToggle("customer")}
          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-medium transition-all ${
            mode === "customer" 
              ? "bg-accent text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="button-mode-customer"
        >
          Customer
        </button>
        <button
          onClick={() => handleModeToggle("staff")}
          className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-medium transition-all flex items-center gap-1 ${
            mode === "staff" 
              ? "bg-accent text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="button-mode-staff"
        >
          {!staffUnlocked && <Lock className="w-2.5 h-2.5 md:w-3 md:h-3" />}
          Staff
        </button>
      </div>

      {showPinInput && (
        <div className="absolute inset-0 z-30 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">Staff Access</span>
            </div>
            <p className="text-xs text-muted-foreground">Enter your staff PIN</p>
            <Input
              type="password"
              maxLength={4}
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              className="w-24 text-center text-lg tracking-widest mx-auto"
              placeholder="****"
              autoFocus
              data-testid="input-staff-pin"
            />
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => { setShowPinInput(false); setPinValue(""); }}
                data-testid="button-pin-cancel"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handlePinSubmit}
                disabled={pinValue.length !== 4}
                data-testid="button-pin-submit"
              >
                Unlock
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-full flex items-center min-h-[110px] md:min-h-[130px] pt-6 md:pt-7">
        <button
          onClick={goPrev}
          className="absolute left-1 md:left-2 z-20 p-1.5 md:p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/30 hover:bg-background/90 transition-all shadow-lg hover:scale-105"
          aria-label="Previous slide"
          data-testid="button-nav-carousel-prev"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>

        <div className="flex-1 px-10 md:px-14 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${currentSlide.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              <img 
                src={currentSlide.image} 
                alt={currentSlide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-25 rounded-lg"
              />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-2 md:gap-4 py-2 md:py-3">
                <div className="p-2 md:p-3 rounded-xl bg-accent/20 backdrop-blur-sm border border-accent/30 shadow-lg flex-shrink-0">
                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-accent" />
                </div>
                
                <div className="text-center md:text-left flex-1 min-w-0">
                  <h3 className="text-xs md:text-base font-display font-bold text-foreground dark:text-white mb-0.5 truncate">
                    {currentSlide.title}
                  </h3>
                  <p className="text-[9px] md:text-sm text-muted-foreground leading-snug line-clamp-2">
                    {currentSlide.description}
                  </p>
                </div>
                
                <a href={currentSlide.link} className="flex-shrink-0">
                  <Button size="sm" variant="default" className="text-[10px] md:text-xs px-2 md:px-3" data-testid={`button-slide-${currentSlide.id}`}>
                    {currentSlide.linkText}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={goToNext}
          className="absolute right-1 md:right-2 z-20 p-1.5 md:p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/30 hover:bg-background/90 transition-all shadow-lg hover:scale-105"
          aria-label="Next slide"
          data-testid="button-nav-carousel-next"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>
      </div>

      <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? "bg-accent w-4 md:w-5" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to ${slide.title}`}
            data-testid={`button-nav-dot-${idx}`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
