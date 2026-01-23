import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/context/TenantContext";
import { useAccess, type UserRole } from "@/context/AccessContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  MessageSquare,
  Star,
  Shield,
  Crown,
  Code,
  HardHat,
  MapPin,
  Megaphone
} from "lucide-react";

import heroBg from "@assets/generated_images/abstract_army_green_dark_texture_with_gold_accents.png";
import businessDashboard from "@assets/generated_images/business_management_dashboard.png";
import bookingCalendar from "@assets/generated_images/appointment_booking_calendar.png";
import estimateCalculator from "@assets/generated_images/digital_estimate_calculator_interface.png";
import paintingCrew from "@assets/generated_images/professional_painting_crew_at_work.png";
import painterConsulting from "@assets/generated_images/painter_consulting_with_customer.png";

interface StaffSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  icon: typeof BarChart3;
  isHero?: boolean;
}

const ROLE_ROUTES: Record<string, { route: string; displayName: string; color: string; icon: typeof Crown }> = {
  "owner": { route: "/owner", displayName: "Owner", color: "text-gold-400", icon: Crown },
  "ops_manager": { route: "/admin", displayName: "Admin", color: "text-blue-400", icon: Shield },
  "admin": { route: "/admin", displayName: "Admin", color: "text-blue-400", icon: Shield },
  "project_manager": { route: "/project-manager", displayName: "Project Manager", color: "text-teal-400", icon: MapPin },
  "crew_lead": { route: "/crew-lead", displayName: "Crew Lead", color: "text-orange-400", icon: HardHat },
  "developer": { route: "/developer", displayName: "Developer", color: "text-purple-400", icon: Code },
  "marketing": { route: "/marketing-hub", displayName: "Marketing Manager", color: "text-pink-400", icon: Megaphone },
  "demo_viewer": { route: "/demo-viewer", displayName: "Demo Viewer", color: "text-pink-400", icon: Star },
};

export default function Team() {
  const tenant = useTenant();
  const { toast } = useToast();
  const { login } = useAccess();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pinValue, setPinValue] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const staffSlides: StaffSlide[] = [
    {
      id: "hero",
      title: "Team",
      subtitle: "Portal",
      description: "Access your role-based dashboard and tools.",
      image: heroBg,
      icon: Star,
      isHero: true
    },
    {
      id: "dashboards",
      title: "Role-Based Dashboards",
      description: "Access your personalized dashboard based on your role. Owners, Admins, Project Managers, and Crew Leads each have specialized views.",
      image: businessDashboard,
      icon: BarChart3,
    },
    {
      id: "crm",
      title: "CRM & Pipeline",
      description: "Track leads from first contact to completed job. Manage your sales pipeline with our dual-mode CRM system.",
      image: businessDashboard,
      icon: Users,
    },
    {
      id: "calendar",
      title: "CRM Calendar",
      description: "Schedule appointments and set reminders for follow-ups. Never miss a customer touchpoint.",
      image: bookingCalendar,
      icon: Calendar,
    },
    {
      id: "documents",
      title: "Document Center",
      description: "Create contracts, estimates, and invoices. Get digital signatures with blockchain verification.",
      image: estimateCalculator,
      icon: FileText,
    },
    {
      id: "crew",
      title: "Crew Management",
      description: "Time tracking, job notes, and incident reporting. Keep your crew organized and accountable.",
      image: paintingCrew,
      icon: Settings,
    },
    {
      id: "messaging",
      title: "Internal Messaging",
      description: "Real-time chat with your team and customers. Stay connected on the job.",
      image: painterConsulting,
      icon: MessageSquare,
    }
  ];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % staffSlides.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + staffSlides.length) % staffSlides.length);
  };

  const handlePinSubmit = async () => {
    if (pinValue.length < 3 || pinValue.length > 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your PIN.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticating(true);

    try {
      const response = await fetch('/api/auth/pin/verify-any', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinValue }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.role) {
        const roleConfig = ROLE_ROUTES[data.role];
        login(data.role as UserRole, roleConfig?.displayName);
        if (roleConfig) {
          toast({
            title: `Welcome, ${roleConfig.displayName}!`,
            description: "Redirecting to your dashboard...",
          });
          setTimeout(() => {
            window.location.href = roleConfig.route;
          }, 500);
        } else {
          window.location.href = '/admin';
        }
      } else {
        toast({
          title: "Access Denied",
          description: data.message || "Invalid PIN. Please try again.",
          variant: "destructive",
        });
        setPinValue("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify PIN. Please try again.",
        variant: "destructive",
      });
      setPinValue("");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const currentSlide = staffSlides[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Staff Slideshow */}
          <GlassCard className="p-0 relative overflow-hidden border-border dark:border-white/20 h-[400px] md:h-[450px] group">
            <button
              onClick={goPrev}
              className="absolute left-2 md:left-3 top-2 md:top-3 z-20 p-1.5 md:p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/30 hover:bg-background/90 transition-all shadow-lg hover:scale-105"
              aria-label="Previous slide"
              data-testid="button-team-prev"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 md:right-3 top-2 md:top-3 z-20 p-1.5 md:p-2 rounded-full bg-background/70 backdrop-blur-md border border-white/30 hover:bg-background/90 transition-all shadow-lg hover:scale-105"
              aria-label="Next slide"
              data-testid="button-team-next"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {currentSlide.isHero ? (
                  <div className="p-6 pt-12 pb-8 md:p-12 md:pt-14 flex flex-col justify-center items-center h-full relative text-center">
                    <div 
                      className="absolute inset-0 bg-center bg-cover z-0 opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${currentSlide.image})`, backgroundSize: '300%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/60 z-0" />
                    
                    <div className="relative z-10 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 dark:bg-accent/20 border border-accent/50 dark:border-accent/30 text-cyan-800 dark:text-white text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
                        <Lock className="w-3 h-3" />
                        Staff Only
                      </div>
                      <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-4 text-glow">
                        {currentSlide.title}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#6B5344] dark:from-accent dark:to-[#8B7355]">
                          {currentSlide.subtitle}
                        </span>
                      </h1>
                      <p className="text-sm md:text-lg text-muted-foreground mb-4">
                        {currentSlide.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 italic">
                        Swipe to learn about staff features
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full">
                    <div className="hidden md:block w-[45%] relative overflow-hidden">
                      <img 
                        src={currentSlide.image} 
                        alt={currentSlide.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center p-6 pt-12 pb-8 md:p-8 md:pt-12 relative bg-background">
                      <div 
                        className="md:hidden absolute inset-0 bg-center bg-cover z-0 opacity-20"
                        style={{ backgroundImage: `url(${currentSlide.image})` }}
                      />
                      <div className="md:hidden absolute inset-0 bg-background/80 z-0" />
                      
                      <div className="relative z-10 text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 mb-4">
                          <Icon className="w-6 h-6 text-accent" />
                        </div>
                        
                        <h2 className="text-xl md:text-3xl font-display font-bold text-foreground mb-3">
                          {currentSlide.title}
                        </h2>
                        
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
                          {currentSlide.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {staffSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 md:h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? "bg-accent w-5 md:w-6" 
                      : "bg-white/40 hover:bg-white/60 w-1.5 md:w-2"
                  }`}
                  aria-label={`Go to ${slide.title}`}
                  data-testid={`button-team-dot-${idx}`}
                />
              ))}
            </div>
          </GlassCard>

          {/* PIN Entry */}
          <GlassCard className="p-6 md:p-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/20 border border-accent/30 mb-2">
                <Lock className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="text-xl md:text-2xl font-display font-bold text-foreground">
                Enter Your Staff PIN
              </h3>
              
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Enter your 4-digit PIN to access your dashboard
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto pt-2">
                <Input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="****"
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                  className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                  data-testid="input-staff-pin"
                  disabled={isAuthenticating}
                />
              </div>

              <Button 
                onClick={handlePinSubmit}
                disabled={pinValue.length !== 4 || isAuthenticating}
                className="w-full max-w-xs gap-2"
                data-testid="button-staff-login"
              >
                {isAuthenticating ? "Verifying..." : "Access Dashboard"}
              </Button>

              <p className="text-xs text-muted-foreground/70 pt-2">
                Contact your administrator if you don't have a PIN
              </p>
            </div>
          </GlassCard>

          {/* Role Legend */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(ROLE_ROUTES).map(([role, config]) => (
              <div 
                key={role}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-white/10"
              >
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-xs text-muted-foreground">{config.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
