import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Home,
  Smartphone,
  Monitor,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  Shield,
  BarChart3,
  Calendar,
  Megaphone,
  Wrench,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  background?: string;
}

export default function PlatformPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);

  const slides: Slide[] = [
    {
      id: 1,
      title: "TrustLayer Marketing Platform",
      subtitle: "Your Complete Business Operating System",
      content: (
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16 text-primary" />
            <Sparkles className="w-12 h-12 text-amber-500" />
          </div>
          <p className="text-2xl text-center max-w-2xl text-muted-foreground">
            One platform. Every tool you need. Built specifically for the trades.
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Automated Marketing</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Field Tools</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Team Management</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "The Problem",
      subtitle: "What You're Dealing With Now",
      content: (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <div className="flex items-start gap-4">
              <DollarSign className="w-10 h-10 text-destructive shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Expensive Websites</h3>
                <p className="text-muted-foreground">$40,000/year for a static brochure site that does nothing but sit there</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <div className="flex items-start gap-4">
              <Clock className="w-10 h-10 text-destructive shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Manual Everything</h3>
                <p className="text-muted-foreground">Hours spent on social media, scheduling, posting, tracking - time you don't have</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <div className="flex items-start gap-4">
              <Users className="w-10 h-10 text-destructive shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">Scattered Tools</h3>
                <p className="text-muted-foreground">Different apps for estimates, scheduling, marketing, crew management - nothing talks to each other</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 border-destructive/50 bg-destructive/5">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-10 h-10 text-destructive shrink-0" />
              <div>
                <h3 className="font-bold text-xl mb-2">No Visibility</h3>
                <p className="text-muted-foreground">You can't see what's working, what's not, or where your money is going</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 3,
      title: "The Solution",
      subtitle: "Everything In One Place",
      content: (
        <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 w-full">
            <Card className="p-6 text-center hover-elevate">
              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg">Your Website</h3>
              <p className="text-sm text-muted-foreground mt-2">Professional, modern, built for conversions</p>
            </Card>
            <Card className="p-6 text-center hover-elevate">
              <Megaphone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg">Marketing Hub</h3>
              <p className="text-sm text-muted-foreground mt-2">Automated posting & ads that run themselves</p>
            </Card>
            <Card className="p-6 text-center hover-elevate">
              <Wrench className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold text-lg">Field Tools</h3>
              <p className="text-sm text-muted-foreground mt-2">Calculators & estimates in your pocket</p>
            </Card>
          </div>
          <div className="flex items-center gap-4 text-xl font-semibold text-primary">
            <Zap className="w-8 h-8" />
            <span>All connected. All automated. All yours.</span>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Your Professional Website",
      subtitle: "Not a Brochure - A Business Machine",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">Modern, Mobile-First Design</h3>
                <p className="text-muted-foreground">Looks stunning on every device</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">Built-In Estimator</h3>
                <p className="text-muted-foreground">Customers can get quotes instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">Online Booking</h3>
                <p className="text-muted-foreground">Schedule appointments 24/7</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold">SEO Optimized</h3>
                <p className="text-muted-foreground">Show up when people search for painters</p>
              </div>
            </div>
          </div>
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="aspect-video rounded-lg bg-background/80 flex items-center justify-center">
              <div className="text-center">
                <Monitor className="w-16 h-16 mx-auto text-primary mb-4" />
                <p className="text-lg font-semibold">nashpaintpros.io</p>
                <p className="text-sm text-muted-foreground">Live & Active</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Marketing Hub",
      subtitle: "Set It & Forget It",
      content: (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Calendar className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-2">Automated Posting</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>Weekdays: 5 posts/day (6am-10pm)</p>
                <p>Weekends: 3 posts/day (8am-8pm)</p>
                <p className="text-primary font-semibold mt-3">Facebook + Instagram automatically</p>
              </div>
            </Card>
            <Card className="p-6">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-2">Automated Ads</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>$25/day Facebook + $25/day Instagram</p>
                <p>Targeted to your service area</p>
                <p className="text-primary font-semibold mt-3">20,000+ impressions in 48 hours</p>
              </div>
            </Card>
          </div>
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-12 h-12 text-primary" />
              <div>
                <h3 className="font-bold text-xl">Real-Time Analytics</h3>
                <p className="text-muted-foreground">See exactly what's working, what's not, and where every dollar goes</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 6,
      title: "Field Tools",
      subtitle: "Everything Your Crew Needs - In Their Pocket",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-center">
              <Smartphone className="w-32 h-32 text-primary" />
            </div>
            <p className="text-center mt-4 font-semibold">nashpaintpros.io/app</p>
          </Card>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Professional Calculators</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Paint Coverage</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Labor Estimates</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Material Lists</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Square Footage</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Pricing Tools</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Time Tracking</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">No more spreadsheets. No more guessing. Accurate estimates on the spot.</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Role-Based Access",
      subtitle: "Right Tools for the Right People",
      content: (
        <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <Card className="p-6 text-center hover-elevate">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Owner</h3>
            <p className="text-sm text-muted-foreground">Full dashboard, analytics, financials, all controls</p>
          </Card>
          <Card className="p-6 text-center hover-elevate">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Admin</h3>
            <p className="text-sm text-muted-foreground">Team management, scheduling, customer info</p>
          </Card>
          <Card className="p-6 text-center hover-elevate">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Crew Lead</h3>
            <p className="text-sm text-muted-foreground">Job details, field tools, time tracking, crew info</p>
          </Card>
          <Card className="p-6 text-center hover-elevate">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Marketing</h3>
            <p className="text-sm text-muted-foreground">Posts, campaigns, analytics, content library</p>
          </Card>
        </div>
      )
    },
    {
      id: 8,
      title: "Multi-Tenant Ready",
      subtitle: "One Platform, Multiple Businesses",
      content: (
        <div className="space-y-8 max-w-4xl mx-auto">
          <p className="text-xl text-center text-muted-foreground">
            Run multiple brands from one dashboard. Each with their own branding, content, and customer-facing experience.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-primary/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[hsl(85,20%,35%)] flex items-center justify-center">
                  <span className="text-white font-bold">NPP</span>
                </div>
                <div>
                  <h3 className="font-bold">Nashville Painting Professionals</h3>
                  <p className="text-sm text-muted-foreground">nashpaintpros.io</p>
                </div>
              </div>
              <p className="text-muted-foreground">Full website, marketing automation, field tools - all branded for NPP</p>
            </Card>
            <Card className="p-6 border-2 border-amber-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <div>
                  <h3 className="font-bold">Lume Paint Co</h3>
                  <p className="text-sm text-muted-foreground">lumepaint.co</p>
                </div>
              </div>
              <p className="text-muted-foreground">Completely separate brand, same powerful platform underneath</p>
            </Card>
          </div>
          <Card className="p-4 bg-primary/5 text-center">
            <p className="font-semibold">Add more businesses anytime. Each one gets the full platform experience.</p>
          </Card>
        </div>
      )
    },
    {
      id: 9,
      title: "The Numbers",
      subtitle: "What This Would Actually Cost",
      content: (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-destructive/30 bg-destructive/5">
              <h3 className="font-bold text-xl mb-4 text-destructive">Traditional Development</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Frontend Development</span>
                  <span className="font-semibold">$80,000 - $120,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Backend Development</span>
                  <span className="font-semibold">$60,000 - $100,000</span>
                </div>
                <div className="flex justify-between">
                  <span>API Integrations</span>
                  <span className="font-semibold">$40,000 - $60,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Design & UX</span>
                  <span className="font-semibold">$30,000 - $50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Testing & QA</span>
                  <span className="font-semibold">$20,000 - $35,000</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-destructive">
                  <span>TOTAL</span>
                  <span>$345,000 - $560,000</span>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-primary/30 bg-primary/5">
              <h3 className="font-bold text-xl mb-4 text-primary">TrustLayer Platform</h3>
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-5xl font-bold text-primary mb-4">Built</p>
                <p className="text-2xl text-muted-foreground">Ready to Use</p>
                <p className="text-2xl text-muted-foreground">Right Now</p>
                <div className="mt-6 flex items-center gap-2 text-primary">
                  <Zap className="w-6 h-6" />
                  <span className="font-semibold">Same capabilities. Fraction of the cost.</span>
                </div>
              </div>
            </Card>
          </div>
          <p className="text-center text-muted-foreground">
            For context: A basic brochure website from agencies like Horton Group costs $40,000/year.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: "Get Started Today",
      subtitle: "Everything is Ready",
      content: (
        <div className="space-y-8 max-w-3xl mx-auto text-center">
          <p className="text-2xl text-muted-foreground">
            The platform is live. The automation is running. The tools are built.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 hover-elevate">
              <div className="text-4xl font-bold text-primary mb-2">1</div>
              <h3 className="font-bold mb-2">Log In</h3>
              <p className="text-sm text-muted-foreground">Access your dashboard based on your role</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <h3 className="font-bold mb-2">Explore</h3>
              <p className="text-sm text-muted-foreground">See your analytics, content, and tools</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <h3 className="font-bold mb-2">Let It Work</h3>
              <p className="text-sm text-muted-foreground">The automation handles the rest</p>
            </Card>
          </div>
          <div className="pt-8 space-y-4">
            <p className="text-xl font-semibold">Your Links:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://nashpaintpros.io" target="_blank" rel="noopener noreferrer" className="bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                nashpaintpros.io
              </a>
              <a href="https://nashpaintpros.io/app" target="_blank" rel="noopener noreferrer" className="bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                nashpaintpros.io/app
              </a>
              <a href="https://nashpaintpros.io/marketing-hub" target="_blank" rel="noopener noreferrer" className="bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                nashpaintpros.io/marketing-hub
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isAutoPlay) {
      const timer = setInterval(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [isAutoPlay, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Escape") {
        setIsAutoPlay(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="max-w-6xl w-full">
                <div className="text-center mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{slides[currentSlide].title}</h1>
                  {slides[currentSlide].subtitle && (
                    <p className="text-xl md:text-2xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
                  )}
                </div>
                <div className="mt-8">
                  {slides[currentSlide].content}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                data-testid="button-prev-slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                data-testid="button-autoplay"
              >
                {isAutoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                data-testid="button-next-slide"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? "bg-primary w-8" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`button-slide-${index}`}
                />
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
