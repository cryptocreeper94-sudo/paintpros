import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Calculator, Calendar, Users, Bell, Gift, BarChart3, FileText, MessageSquare, Lock, Settings, Shield, Star, CheckCircle2, Palette, Camera, Sparkles, Eye, BookOpen } from "lucide-react";
import { GlassCard } from "./glass-card";
import { Button } from "./button";
import { Input } from "./input";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/context/TenantContext";

import heroBg from "@assets/generated_images/abstract_army_green_dark_texture_with_gold_accents.png";
import paintBrush from "@assets/generated_images/isolated_professional_paint_brush.png";
import painterConsulting from "@assets/generated_images/painter_consulting_with_customer.png";
import estimateCalculator from "@assets/generated_images/digital_estimate_calculator_interface.png";
import happyFamily from "@assets/generated_images/happy_family_with_painted_home.png";
import bookingCalendar from "@assets/generated_images/appointment_booking_calendar.png";
import businessDashboard from "@assets/generated_images/business_management_dashboard.png";
import paintingCrew from "@assets/generated_images/professional_painting_crew_at_work.png";
import colorWheelImage from "@assets/generated_images/paint_color_wheel_white_bg.png";
import interiorImage from "@assets/generated_images/interior_wall_painting.png";

interface HelpSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  icon: typeof Home;
  link?: string;
  linkText?: string;
  isHero?: boolean;
}

const VALID_PINS = ["0424", "1111", "2222", "3333", "4444"];

export function HeroSlideshow() {
  const tenant = useTenant();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"customer" | "staff">("customer");
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [staffUnlocked, setStaffUnlocked] = useState(false);
  const { toast } = useToast();

  const cityName = tenant.address?.city || "Your City";
  const ratingBadge = tenant.credentials?.googleRating ? `${cityName}'s #1 Rated` : "Top Rated";
  const isDemo = tenant.id === "demo";

  const customerSlides: HelpSlide[] = [
    {
      id: "hero",
      title: "Extraordinary",
      subtitle: "Craftsmanship.",
      description: tenant.description || "Premium residential and commercial painting.",
      image: heroBg,
      icon: Star,
      isHero: true
    },
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
      id: "visualizer",
      title: "AI Color Visualizer",
      description: "Upload a photo of your room and preview paint colors with AI-powered design insights.",
      image: interiorImage,
      icon: Sparkles,
      link: "/color-library",
      linkText: "Try Visualizer"
    },
    {
      id: "color-library",
      title: "Explore Our Color Library",
      description: "Browse curated colors from Sherwin-Williams and Benjamin Moore organized by hue family.",
      image: colorWheelImage,
      icon: Palette,
      link: "/color-library",
      linkText: "Browse Colors"
    },
    {
      id: "room-scanner",
      title: "Room Scanner",
      description: "Use your camera to estimate room dimensions and get accurate square footage for your quote.",
      image: interiorImage,
      icon: Camera,
      link: "/color-library",
      linkText: "Coming Soon"
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
      id: "glossary",
      title: "Painting Glossary",
      description: "Learn 120+ professional painting terms from A to Z with our comprehensive glossary.",
      image: paintBrush,
      icon: BookOpen,
      link: "/glossary",
      linkText: "View Glossary"
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
      id: "hero",
      title: "Extraordinary",
      subtitle: "Craftsmanship.",
      description: tenant.description || "Premium residential and commercial painting.",
      image: heroBg,
      icon: Star,
      isHero: true
    },
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
    <GlassCard className="p-0 relative overflow-hidden border-border dark:border-white/20 h-full group">

      <button
        onClick={goPrev}
        className="absolute left-2 md:left-3 top-2 md:top-3 z-20 p-1.5 md:p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/30 hover:bg-background/90 transition-all shadow-lg hover:scale-105"
        aria-label="Previous slide"
        data-testid="button-hero-prev"
      >
        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 md:right-3 top-2 md:top-3 z-20 p-1.5 md:p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/30 hover:bg-background/90 transition-all shadow-lg hover:scale-105"
        aria-label="Next slide"
        data-testid="button-hero-next"
      >
        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${currentSlide.id}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {currentSlide.isHero ? (
            /* Hero slide - full background with text overlay */
            <div className="p-4 pt-10 pb-6 md:p-12 md:pt-12 flex flex-col justify-center items-start h-full relative">
              <div 
                className="absolute inset-0 bg-center bg-cover z-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${currentSlide.image})`, backgroundSize: '300%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-0" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-accent/30 dark:bg-accent/20 border border-accent/50 dark:border-accent/30 text-cyan-800 dark:text-white text-[9px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-6 backdrop-blur-md shadow-sm">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  {ratingBadge}
                </div>
                <h1 className="text-xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-1 md:mb-6 text-glow">
                  {currentSlide.title} <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#6B5344] dark:from-accent dark:to-[#8B7355]">
                    {currentSlide.subtitle}
                  </span>
                </h1>
                <p className="text-[11px] md:text-xl text-cyan-700 dark:text-cyan-700 font-semibold mb-2 md:mb-8 max-w-md leading-snug md:leading-relaxed drop-shadow-lg">
                  {currentSlide.description}
                </p>
                <p className="text-[10px] md:text-sm text-muted-foreground italic">
                  Swipe to see how we can help you
                </p>
              </div>

              <img 
                src={paintBrush} 
                alt="Brush" 
                className="hidden md:block absolute -right-10 -bottom-20 w-[400px] h-auto object-contain z-[5] opacity-90 drop-shadow-2xl rotate-[-15deg] transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:translate-x-2 pointer-events-none"
              />
            </div>
          ) : (
            /* Tutorial slides - split screen: image left, content right */
            <div className="flex h-full">
              {/* Left side - Image */}
              <div className="hidden md:block w-[45%] relative overflow-hidden">
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
              </div>
              
              {/* Right side - Content */}
              <div className="flex-1 flex flex-col justify-center p-4 pt-10 pb-6 md:p-8 md:pt-10 relative bg-background">
                {/* Mobile background image */}
                <div 
                  className="md:hidden absolute inset-0 bg-center bg-cover z-0 opacity-20"
                  style={{ backgroundImage: `url(${currentSlide.image})` }}
                />
                <div className="md:hidden absolute inset-0 bg-background/80 z-0" />
                
                <div className="relative z-10 text-center md:text-left">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/20 border border-accent/30 mb-3 md:mb-4">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  
                  <h2 className="text-lg md:text-2xl lg:text-3xl font-display font-bold text-foreground mb-2 md:mb-3">
                    {currentSlide.title}
                  </h2>
                  
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4 md:mb-5 max-w-md mx-auto md:mx-0">
                    {currentSlide.description}
                  </p>
                  
                  {/* Feature bullets */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-4 md:mb-5 text-xs md:text-sm">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-foreground">Easy online booking</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-foreground">Transparent pricing</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-foreground">Quality guarantee</span>
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  {currentSlide.link && (
                    <a href={currentSlide.link}>
                      <Button variant="outline" className="gap-2" data-testid={`button-slide-${currentSlide.id}`}>
                        {currentSlide.linkText}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </div>
                
                {/* Decorative paintbrush */}
                <img 
                  src={paintBrush} 
                  alt="" 
                  className="hidden md:block absolute -right-6 -bottom-16 w-[180px] h-auto object-contain z-[5] opacity-70 drop-shadow-xl rotate-[-15deg] pointer-events-none"
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Free Estimate Button - Customer mode, hero slide only */}
      {mode === "customer" && currentSlide.isHero && (
        <a 
          href="/estimate" 
          className="absolute bottom-12 md:bottom-14 right-1 md:right-1.5 z-20"
          data-testid="link-hero-free-estimate"
        >
          <Button size="sm" className="shadow-lg gap-1 text-[10px] px-2 py-1 h-6">
            <Calculator className="w-2.5 h-2.5" />
            Estimate
          </Button>
        </a>
      )}

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 md:h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? "bg-accent w-5 md:w-6" 
                : "bg-white/40 hover:bg-white/60 w-1.5 md:w-2"
            }`}
            aria-label={`Go to ${slide.title}`}
            data-testid={`button-hero-dot-${idx}`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
