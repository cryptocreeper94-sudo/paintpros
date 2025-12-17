import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calculator, Palette, Briefcase, Star, Calendar, Phone, FileText, Users } from "lucide-react";
import { GlassCard } from "./glass-card";
import { useTenant } from "@/context/TenantContext";

interface NavSlide {
  id: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  href: string;
  gradient: string;
  forRoles: ("user" | "employee" | "all")[];
}

export function NavigationCarousel() {
  const tenant = useTenant();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDemo = tenant.id === "demo";

  const slides: NavSlide[] = [
    {
      id: "estimate",
      title: "Get Your Estimate",
      description: "Use our instant calculator to get a custom quote in seconds",
      icon: Calculator,
      href: "/estimate",
      gradient: "from-accent/30 to-accent/10",
      forRoles: ["user", "all"]
    },
    {
      id: "services",
      title: "Our Services",
      description: "Explore interior, exterior, commercial & residential painting",
      icon: Palette,
      href: "/services",
      gradient: "from-cyan-500/30 to-cyan-500/10",
      forRoles: ["user", "all"]
    },
    {
      id: "portfolio",
      title: "View Portfolio",
      description: "Browse our gallery of completed projects & transformations",
      icon: Briefcase,
      href: "/portfolio",
      gradient: "from-purple-500/30 to-purple-500/10",
      forRoles: ["user", "all"]
    },
    {
      id: "reviews",
      title: "Customer Reviews",
      description: "Read what our satisfied customers have to say",
      icon: Star,
      href: "/reviews",
      gradient: "from-yellow-500/30 to-yellow-500/10",
      forRoles: ["user", "all"]
    },
    {
      id: "booking",
      title: "Book Appointment",
      description: "Schedule your free consultation at a time that works for you",
      icon: Calendar,
      href: "/booking",
      gradient: "from-green-500/30 to-green-500/10",
      forRoles: ["user", "all"]
    },
    {
      id: "contact",
      title: "Contact Us",
      description: "Get in touch with our team for questions or quotes",
      icon: Phone,
      href: "/contact",
      gradient: "from-blue-500/30 to-blue-500/10",
      forRoles: ["user", "all"]
    },
    {
      id: "documents",
      title: "Document Center",
      description: "Access contracts, estimates, and project files",
      icon: FileText,
      href: "/documents",
      gradient: "from-orange-500/30 to-orange-500/10",
      forRoles: ["employee", "all"]
    },
    {
      id: "crm",
      title: "CRM Dashboard",
      description: "Manage leads, deals, and customer relationships",
      icon: Users,
      href: "/crm",
      gradient: "from-pink-500/30 to-pink-500/10",
      forRoles: ["employee", "all"]
    }
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <GlassCard 
      className="relative overflow-hidden h-full p-0"
      glow
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      <div className="relative h-full flex items-center">
        <button
          onClick={goPrev}
          className="absolute left-1 md:left-2 z-20 p-1.5 md:p-2 rounded-full bg-background/60 backdrop-blur-md border border-white/20 hover:bg-background/80 transition-all shadow-lg"
          aria-label="Previous slide"
          data-testid="button-nav-carousel-prev"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>

        <div className="flex-1 px-10 md:px-14">
          <AnimatePresence mode="wait">
            <motion.a
              key={currentSlide.id}
              href={currentSlide.href}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
              className="block h-full"
              data-testid={`link-nav-slide-${currentSlide.id}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.gradient} opacity-50`} />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-2 md:gap-4 py-3 md:py-4 h-full justify-center">
                <div className="p-2 md:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                  <Icon className="w-5 h-5 md:w-8 md:h-8 text-accent" />
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-sm md:text-lg font-display font-bold text-foreground dark:text-white mb-0.5">
                    {currentSlide.title}
                  </h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground leading-snug max-w-xs">
                    {currentSlide.description}
                  </p>
                </div>
                
                <div className="hidden md:flex items-center gap-1 text-accent text-sm font-medium">
                  <span>Go</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          </AnimatePresence>
        </div>

        <button
          onClick={goToNext}
          className="absolute right-1 md:right-2 z-20 p-1.5 md:p-2 rounded-full bg-background/60 backdrop-blur-md border border-white/20 hover:bg-background/80 transition-all shadow-lg"
          aria-label="Next slide"
          data-testid="button-nav-carousel-next"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </button>
      </div>

      <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              idx === currentIndex 
                ? "bg-accent w-3 md:w-4" 
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            data-testid={`button-nav-dot-${idx}`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
