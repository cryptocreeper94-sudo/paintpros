import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Calendar,
  Users,
  Megaphone,
  Wrench,
  Home,
  ClipboardList,
  MousePointerClick,
  Store,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Calculator,
  Clock,
  DollarSign,
  Facebook,
  Instagram,
  AlertCircle,
  Smartphone,
  MapPin,
  Camera,
  FileText,
  BarChart3,
  Settings,
  Sun,
  CloudRain,
  Palette,
  PenLine,
  LayoutGrid,
  Ruler,
  Play,
  Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  arrowDirection: 'right' | 'down' | 'up' | 'left';
  highlight: string;
  action?: { label: string; url: string };
}

const AUTOPLAY_INTERVAL = 12000; // 12 seconds per slide

export default function NPPWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 0,
      title: "Welcome to Your New System",
      description: "WELCOME_SPECIAL",
      icon: <Sparkles className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "start"
    },
    {
      id: 1,
      title: "A Different Kind of Marketing Content",
      description: "ORGANIC_GRAPHICS_SPECIAL",
      icon: <Palette className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "graphics"
    },
    {
      id: 2,
      title: "Your Professional Website",
      description: "WEBSITE_SPECIAL",
      icon: <Home className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "website",
      action: { label: "See Demo Website", url: "https://paintpros.io" }
    },
    {
      id: 2,
      title: "The CRM - Leads & Jobs",
      description: "CRM_SPECIAL",
      icon: <ClipboardList className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "crm",
      action: { label: "See the Owner Dashboard", url: "https://paintpros.io/owner" }
    },
    {
      id: 3,
      title: "Your Calendar System",
      description: "CALENDAR_SPECIAL",
      icon: <Calendar className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "calendar",
      action: { label: "See the Calendar", url: "https://paintpros.io/owner" }
    },
    {
      id: 4,
      title: "Online Booking (The New Thing)",
      description: "SCHEDULER_SPECIAL",
      icon: <MousePointerClick className="w-8 h-8" />,
      arrowDirection: 'up',
      highlight: "scheduler",
      action: { label: "Try the Scheduler", url: "https://paintpros.io/book" }
    },
    {
      id: 5,
      title: "The Field Tool App",
      description: "FIELDTOOL_SPECIAL",
      icon: <Wrench className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "tools",
      action: { label: "Open the Field Tool", url: "https://paintpros.io/app" }
    },
    {
      id: 6,
      title: "Crew Management",
      description: "CREW_SPECIAL",
      icon: <Users className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "crew",
      action: { label: "See Crew View", url: "https://paintpros.io/crew-lead" }
    },
    {
      id: 7,
      title: "The Marketing Hub",
      description: "MARKETING_SPECIAL",
      icon: <Megaphone className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "marketing",
      action: { label: "See Marketing Hub", url: "https://paintpros.io/marketing-hub" }
    },
    {
      id: 8,
      title: "Pro Tools - The Good Stuff",
      description: "PROTOOLS_SPECIAL",
      icon: <Sparkles className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "protools"
    },
    {
      id: 9,
      title: "How It All Connects",
      description: "FLYWHEEL_SPECIAL",
      icon: <BarChart3 className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "flywheel"
    },
    {
      id: 10,
      title: "The Bottom Line - Lead Generation",
      description: "LEADGEN_SPECIAL",
      icon: <Users className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "leadgen"
    },
    {
      id: 11,
      title: "Two Ways to Partner",
      description: "PARTNERSHIP_SPECIAL",
      icon: <Store className="w-8 h-8" />,
      arrowDirection: 'up',
      highlight: "partnership"
    },
    {
      id: 12,
      title: "Quick Reference - Everything",
      description: "REFERENCE_SPECIAL",
      icon: <CheckCircle2 className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "done"
    }
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setIsAutoPlaying(false); // Pause autoplay when manually navigating
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  // Autoplay effect
  useEffect(() => {
    if (!isAutoPlaying || !isStarted) return;
    
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= tourSteps.length - 1) {
          setIsAutoPlaying(false); // Stop at the end
          return prev;
        }
        return prev + 1;
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isStarted, tourSteps.length]);

  const FloatingArrow = ({ direction }: { direction: string }) => {
    const arrowVariants = {
      animate: {
        x: direction === 'right' ? [0, 10, 0] : direction === 'left' ? [0, -10, 0] : 0,
        y: direction === 'down' ? [0, 10, 0] : direction === 'up' ? [0, -10, 0] : 0,
      }
    };

    const ArrowIcon = direction === 'right' ? ArrowRight : 
                      direction === 'down' ? ArrowDown : 
                      direction === 'up' ? ArrowUp : ArrowRight;

    return (
      <motion.div
        variants={arrowVariants}
        animate="animate"
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="text-primary"
      >
        <ArrowIcon className="w-8 h-8" />
      </motion.div>
    );
  };

  const renderSpecialContent = (description: string) => {
    switch (description) {
      case "WELCOME_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              I'm going to walk you through your entire system. Everything you need is already built and ready to use.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <ClipboardList className="w-6 h-6 mx-auto mb-1 text-primary" />
                <span className="text-xs">CRM (Like Drip Jobs)</span>
              </Card>
              <Card className="p-3 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-1 text-primary" />
                <span className="text-xs">Calendar</span>
              </Card>
              <Card className="p-3 text-center">
                <Wrench className="w-6 h-6 mx-auto mb-1 text-primary" />
                <span className="text-xs">Field Tools</span>
              </Card>
              <Card className="p-3 text-center">
                <Megaphone className="w-6 h-6 mx-auto mb-1 text-primary" />
                <span className="text-xs">Marketing</span>
              </Card>
            </div>
            <p className="text-muted-foreground italic text-sm">
              Takes about 5 minutes. I timed it.
            </p>
          </div>
        );

      case "ORGANIC_GRAPHICS_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              We create two styles of visuals for your marketing - photorealistic images and artistic print-style graphics. 
              Both are designed to make your brand stand out.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Photorealistic Images</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Professional-quality images that showcase beautiful painting work and inspire customers.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src="/walkthrough-images/photorealistic-living-room.png" 
                    alt="Beautiful living room transformation" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src="/walkthrough-images/photorealistic-exterior.png" 
                    alt="Stunning exterior paint job" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Art Print Style Graphics</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Artistic, stylized visuals with an organic, artisanal feel - perfect for brand messaging.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src="/walkthrough-images/artprint-paintpros-brush.png" 
                    alt="Paint Pros Co artistic brush design" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src="/walkthrough-images/artprint-paintpros-colors.png" 
                    alt="Paint Pros Co color palette art" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>The strategy:</strong> Photorealistic images showcase the quality of work. 
                Art prints carry your brand message. Together with real job photos, 
                they keep your feed active, professional, and authentic.
              </p>
            </div>
          </div>
        );

      case "WEBSITE_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              This is what customers see when they find you online. Professional, clean, works on any device.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">What's on your website:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Home page</strong> - Your brand, services overview, trust signals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Services pages</strong> - Interior, exterior, cabinet, commercial painting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Gallery</strong> - Before/after photos of your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Book Online button</strong> - Customers schedule estimates themselves</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Contact info</strong> - Phone, email, service area</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Works 24/7. Even when you're asleep. Unlike that one guy on your crew.
            </p>
          </div>
        );

      case "CRM_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Same workflow as Drip Jobs. If you know Drip Jobs, you already know this.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Your Owner Dashboard includes:</h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-medium">Leads</span>
                    <p className="text-xs text-muted-foreground">New inquiries come in here. From website, calls, wherever.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-medium">Estimates</span>
                    <p className="text-xs text-muted-foreground">Create, send, track. See what's pending, what's approved.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-medium">Jobs</span>
                    <p className="text-xs text-muted-foreground">Scheduled work. See what's coming up, what's in progress.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="font-medium">Invoices</span>
                    <p className="text-xs text-muted-foreground">Bill customers, track payments. QuickBooks can sync when ready.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "CALENDAR_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Your calendar shows all your jobs. Drag to reschedule. Your crew sees their schedule on their phones.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  What you're used to
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• See all jobs on a calendar</li>
                  <li>• Color-coded by status</li>
                  <li>• Drag and drop to move</li>
                  <li>• Syncs with Google Calendar</li>
                </ul>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                  <Sparkles className="w-4 h-4" />
                  What's new
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <Sun className="w-3 h-3 inline" /> Weather alerts built in</li>
                  <li>• <CloudRain className="w-3 h-3 inline" /> Rain tomorrow? You'll know</li>
                  <li>• <Users className="w-3 h-3 inline" /> Crew sees their schedule</li>
                  <li>• <MapPin className="w-3 h-3 inline" /> GPS check-in when they arrive</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "SCHEDULER_SPECIAL":
        return (
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
              This is the innovative feature I added
            </div>
            <p className="text-lg text-muted-foreground">
              Customers can book their own estimate appointments. No phone tag. No missed calls.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">The Old Way</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Customer calls</li>
                  <li>2. You're on a ladder. Miss it.</li>
                  <li>3. Call back. They don't answer.</li>
                  <li>4. Phone tag for 3 days.</li>
                  <li>5. Maybe book. Maybe they called someone else.</li>
                </ol>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">The New Way</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Customer goes to your website</li>
                  <li>2. Clicks "Book Estimate"</li>
                  <li>3. Picks a time that works</li>
                  <li>4. Done. It's on your calendar.</li>
                  <li>5. You never picked up the phone.</li>
                </ol>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground italic">
              They book when it's convenient for them. You see it instantly.
            </p>
          </div>
        );

      case "FIELDTOOL_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Professional calculators on your phone. No more napkin math. No more "let me get back to you on that."
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">The Field Tool includes:</h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Paint Calculator</span>
                    <p className="text-xs text-muted-foreground">Enter room dimensions → Get gallons needed, material cost</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Time Estimator</span>
                    <p className="text-xs text-muted-foreground">How long will this job take? Get a realistic answer.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Price Builder</span>
                    <p className="text-xs text-muted-foreground">Build an estimate on-site. Send it before you leave.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Photo Documentation</span>
                    <p className="text-xs text-muted-foreground">Take before/after shots. Attached to the job automatically.</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Works on your phone. Works offline too. (Even when the WiFi at the job site doesn't.)
            </p>
          </div>
        );

      case "CREW_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Your crew gets their own login. They see their schedule, you see everything they do.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">What your crew can do:</h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-medium">See their schedule</span>
                    <p className="text-xs text-muted-foreground">What jobs they have today, tomorrow, this week</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-medium">GPS clock in/out</span>
                    <p className="text-xs text-muted-foreground">You know when they arrive and when they leave. No guessing.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="font-medium">Take photos</span>
                    <p className="text-xs text-muted-foreground">Before/after shots attached to the job automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-medium">View job details</span>
                    <p className="text-xs text-muted-foreground">Address, customer notes, what needs to be done</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              They use their phone. You see everything from your dashboard.
            </p>
          </div>
        );

      case "MARKETING_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Posts to Facebook and Instagram automatically. You stay visible without touching your phone.
            </p>
            
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">A note about Meta (Facebook/Instagram)</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Look, Meta Business Suite is... a lot. The permissions, the approvals, the constant changes. 
                    I've already dealt with most of that headache so you don't have to. 
                    The Marketing Hub handles the connection and keeps things running.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">What the Marketing Hub does:</h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-600/10 flex items-center justify-center shrink-0">
                    <Facebook className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium">Facebook posts</span>
                    <p className="text-xs text-muted-foreground">Automatic posts about your services throughout the day</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4 text-pink-500" />
                  </div>
                  <div>
                    <span className="font-medium">Instagram posts</span>
                    <p className="text-xs text-muted-foreground">Same content, formatted for Instagram</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Content rotation</span>
                    <p className="text-xs text-muted-foreground">Different messages so it's not the same thing every time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="font-medium">Add your own</span>
                    <p className="text-xs text-muted-foreground">Got a cool before/after? Post it manually anytime.</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              The system keeps you visible. You focus on painting.
            </p>
          </div>
        );

      case "PROTOOLS_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              These are the tools that set you apart. Built specifically for painting contractors.
            </p>
            
            <div className="grid gap-4">
              {/* Blueprint Upload */}
              <Card className="p-4 border-blue-500/20 bg-blue-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <LayoutGrid className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">Blueprint Upload</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a floor plan or blueprint. The system reads it automatically - 
                      extracts room names, dimensions, square footage, wall area. No measuring tape needed.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Ruler className="w-3 h-3 mr-1" />
                        Auto-dimensions
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calculator className="w-3 h-3 mr-1" />
                        Wall area calc
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Proposal Generator */}
              <Card className="p-4 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-600 dark:text-amber-400">Professional Proposals</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pre-built templates for interior, exterior, commercial, residential. 
                      Fill in the details, send it. Looks professional. Saves hours.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Home className="w-3 h-3 mr-1" />
                        Interior
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Home className="w-3 h-3 mr-1" />
                        Exterior
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Pricing tables
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Room Visualizer */}
              <Card className="p-4 border-purple-500/20 bg-purple-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Palette className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400">Room Visualizer</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customer can't picture the color? Take a photo of their room, 
                      apply a color, show them what it'll look like. Closes deals.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Camera className="w-3 h-3 mr-1" />
                        Photo upload
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Palette className="w-3 h-3 mr-1" />
                        Color preview
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Blog / SEO */}
              <Card className="p-4 border-blue-500/20 bg-blue-500/5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <PenLine className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">Blog & SEO</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Built-in blog for your website. Helps with Google rankings. 
                      Can even generate posts for you if you need content fast.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        SEO optimized
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Content assist
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground italic text-center pt-2">
              These aren't just nice-to-haves. They're competitive advantages.
            </p>
          </div>
        );

      case "FLYWHEEL_SPECIAL":
        return (
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Here's how all the pieces work together:
            </p>
            
            {/* The Flywheel Visual */}
            <div className="relative">
              <div className="grid grid-cols-1 gap-3">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border-2 border-blue-500">
                    <span className="text-blue-500 font-bold">1</span>
                  </div>
                  <div className="flex-1 bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                    <span className="font-medium">Marketing posts go out</span>
                    <span className="text-sm text-muted-foreground block">Facebook, Instagram - automatic</span>
                  </div>
                  <ArrowDown className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border-2 border-blue-500">
                    <span className="text-blue-500 font-bold">2</span>
                  </div>
                  <div className="flex-1 bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                    <span className="font-medium">Leads come in</span>
                    <span className="text-sm text-muted-foreground block">Website, calls, online booking</span>
                  </div>
                  <ArrowDown className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border-2 border-amber-500">
                    <span className="text-amber-500 font-bold">3</span>
                  </div>
                  <div className="flex-1 bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
                    <span className="font-medium">You close the sale</span>
                    <span className="text-sm text-muted-foreground block">Estimate, approval, scheduled</span>
                  </div>
                  <ArrowDown className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border-2 border-purple-500">
                    <span className="text-purple-500 font-bold">4</span>
                  </div>
                  <div className="flex-1 bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
                    <span className="font-medium">Crew does the work</span>
                    <span className="text-sm text-muted-foreground block">GPS check-in, photos, completion</span>
                  </div>
                  <ArrowDown className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* Step 5 - loops back */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0 border-2 border-pink-500">
                    <span className="text-pink-500 font-bold">5</span>
                  </div>
                  <div className="flex-1 bg-pink-500/5 rounded-lg p-3 border border-pink-500/20">
                    <span className="font-medium">Real photos feed back into marketing</span>
                    <span className="text-sm text-muted-foreground block">Before/after shots become new posts</span>
                  </div>
                  <ArrowUp className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              {/* Loop indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span className="px-3 italic">Then it repeats</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>The system handles steps 1, 2, and 4.</strong><br/>
                You handle step 3 (closing) and provide the real photos that make step 5 work.<br/>
                The better the photos, the better the marketing. The better the marketing, the more leads.
              </p>
            </div>
          </div>
        );

      case "LEADGEN_SPECIAL":
        return (
          <div className="space-y-5">
            <p className="text-lg text-muted-foreground">
              Everything we just talked about has one purpose: putting qualified leads in front of you.
            </p>

            {/* The Evidence */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Real Numbers (Last 2 Days)
              </h4>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">40,000+</span>
                <span className="block text-sm text-muted-foreground mt-1">Facebook Impressions</span>
              </div>
              <p className="text-sm text-muted-foreground text-center italic">
                That's from a system that was only partially running. Two days.
              </p>
            </div>

            {/* The Path */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">The Path from Visibility to Revenue:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
                  <span><strong>Impressions</strong> - People see your posts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">2</div>
                  <span><strong>Clicks</strong> - Some of them visit your website</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">3</div>
                  <span><strong>Leads</strong> - Some of those book an estimate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">4</div>
                  <span><strong>Jobs</strong> - You close a percentage of those</span>
                </div>
              </div>
            </div>

            {/* The Efficiency Advantage */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Where This System Saves Time:</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Marketing runs itself</strong> - Posts go out without you touching anything</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Booking runs itself</strong> - Customers schedule their own estimates</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>Crew tracking runs itself</strong> - GPS check-ins, photo uploads</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <span><strong>You focus on closing</strong> - The highest-value activity</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground italic text-center pt-2">
              More visibility + less admin time = more time closing, more jobs.
            </p>

            {/* The Honest Part */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">One Thing to Know</h4>
                  <p className="text-sm text-muted-foreground">
                    This isn't a "flip the switch and walk away" system. It needs tweaking. 
                    It needs your feedback on what's working and what isn't. 
                    Real photos from real jobs make it better. Your input makes it smarter.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    The framework is built. Now we dial it in together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "PARTNERSHIP_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Everything you've seen is ready to deploy. Two ways to get started:
            </p>
            
            <div className="grid gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-semibold text-lg">PaintPros Franchise</h4>
                </div>
                <ul className="space-y-2 text-muted-foreground text-sm mb-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>[City]PaintPros.io domain (nashpaintpros.io, boropaintpros.io, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Proven branding + marketing playbook included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Exclusive territory protection</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between bg-muted/50 rounded px-3 py-2">
                  <span className="text-sm">$499 setup + $299/month</span>
                  <span className="text-xs text-muted-foreground">Fastest to launch</span>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border">
                    <span className="font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-lg">Custom White-Label</h4>
                </div>
                <ul className="space-y-2 text-muted-foreground text-sm mb-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>Your brand, your domain, your colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>Full customization of messaging and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span>Complete independence from PaintPros branding</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between bg-background rounded px-3 py-2 border">
                  <span className="text-sm">$999 setup + $499/month</span>
                  <span className="text-xs text-muted-foreground">Premium option</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground italic text-center text-sm">
              Both include the full platform: CRM, scheduling, field tools, marketing automation, and all pro tools.
            </p>
          </div>
        );

      case "REFERENCE_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              That's everything. Here's a quick reference to get to any part of your system:
            </p>
            
            <div className="grid gap-3">
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://paintpros.io', '_blank')}
              >
                <Home className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Your Website</span>
                  <p className="text-xs text-muted-foreground">paintpros.io - Demo website</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
              
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://paintpros.io/owner', '_blank')}
              >
                <ClipboardList className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Owner Dashboard</span>
                  <p className="text-xs text-muted-foreground">Leads, estimates, jobs, invoices, calendar</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
              
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://paintpros.io/book', '_blank')}
              >
                <MousePointerClick className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Online Scheduler</span>
                  <p className="text-xs text-muted-foreground">Customers book estimates themselves</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
              
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://paintpros.io/app', '_blank')}
              >
                <Wrench className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Field Tool</span>
                  <p className="text-xs text-muted-foreground">Calculators, estimating, photos</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
              
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://paintpros.io/crew-lead', '_blank')}
              >
                <Users className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Crew View</span>
                  <p className="text-xs text-muted-foreground">What your crew sees on their phones</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
              
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://paintpros.io/marketing-hub', '_blank')}
              >
                <Megaphone className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Marketing Hub</span>
                  <p className="text-xs text-muted-foreground">Facebook/Instagram posting</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
            </div>
            
            <p className="text-sm text-muted-foreground italic text-center mt-4">
              This walkthrough lives at paintpros.io/walkthrough<br/>
              Come back anytime.
            </p>
          </div>
        );

      default:
        return (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
        );
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="p-8 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl font-bold mb-4">PaintPros Platform Demo</h1>
            <h2 className="text-xl text-muted-foreground mb-6">Complete System Walkthrough</h2>
            <p className="text-muted-foreground mb-8">
              I'll show you everything step by step.<br/>
              Each feature, where to find it, what it does.<br/>
              Takes about 3 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={() => setIsStarted(true)} className="gap-2">
                Click Through
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  setIsStarted(true);
                  setIsAutoPlaying(true);
                }} 
                className="gap-2"
              >
                <Play className="w-5 h-5" />
                Autoplay (~3 min)
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Button
          size="sm"
          variant={isAutoPlaying ? "default" : "outline"}
          onClick={toggleAutoPlay}
          className="gap-2"
        >
          {isAutoPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Play
            </>
          )}
        </Button>
        <Card className="px-4 py-2 text-sm">
          Step {currentStep + 1} of {tourSteps.length}
        </Card>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl w-full"
          >
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {currentTourStep.icon}
                </div>
                <FloatingArrow direction={currentTourStep.arrowDirection} />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentTourStep.title}</h2>

              {renderSpecialContent(currentTourStep.description)}

              {currentTourStep.action && (
                <div className="my-6">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full md:w-auto"
                    onClick={() => window.open(currentTourStep.action!.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {currentTourStep.action.label}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    (Opens in new tab - come back when you're done looking)
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  Back
                </Button>

                <div className="flex gap-1.5">
                  {tourSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentStep 
                          ? "bg-primary w-6" 
                          : index < currentStep
                          ? "bg-primary/50"
                          : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {currentStep < tourSteps.length - 1 ? (
                  <Button onClick={nextStep} className="gap-2">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={() => setIsStarted(false)} variant="outline">
                    Start Over
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
