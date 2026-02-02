import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  CloudRain
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

export default function NPPWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

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
      title: "Your Professional Website",
      description: "WEBSITE_SPECIAL",
      icon: <Home className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "website",
      action: { label: "See Your Website", url: "https://nashpaintpros.io" }
    },
    {
      id: 2,
      title: "The CRM - Leads & Jobs",
      description: "CRM_SPECIAL",
      icon: <ClipboardList className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "crm",
      action: { label: "See the Owner Dashboard", url: "https://nashpaintpros.io/owner" }
    },
    {
      id: 3,
      title: "Your Calendar System",
      description: "CALENDAR_SPECIAL",
      icon: <Calendar className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "calendar",
      action: { label: "See the Calendar", url: "https://nashpaintpros.io/owner" }
    },
    {
      id: 4,
      title: "Online Booking (The New Thing)",
      description: "SCHEDULER_SPECIAL",
      icon: <MousePointerClick className="w-8 h-8" />,
      arrowDirection: 'up',
      highlight: "scheduler",
      action: { label: "Try the Scheduler", url: "https://nashpaintpros.io/book" }
    },
    {
      id: 5,
      title: "The Field Tool App",
      description: "FIELDTOOL_SPECIAL",
      icon: <Wrench className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "tools",
      action: { label: "Open the Field Tool", url: "https://nashpaintpros.io/app" }
    },
    {
      id: 6,
      title: "Crew Management",
      description: "CREW_SPECIAL",
      icon: <Users className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "crew",
      action: { label: "See Crew View", url: "https://nashpaintpros.io/crew-lead" }
    },
    {
      id: 7,
      title: "The Marketing Hub",
      description: "MARKETING_SPECIAL",
      icon: <Megaphone className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "marketing",
      action: { label: "See Marketing Hub", url: "https://nashpaintpros.io/marketing-hub" }
    },
    {
      id: 8,
      title: "An Opportunity Worth Exploring",
      description: "HARDWARE_STORE_SPECIAL",
      icon: <Store className="w-8 h-8" />,
      arrowDirection: 'up',
      highlight: "hardware"
    },
    {
      id: 9,
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
  };

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
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Home page</strong> - Your brand, services overview, trust signals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Services pages</strong> - Interior, exterior, cabinet, commercial painting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Gallery</strong> - Before/after photos of your work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Book Online button</strong> - Customers schedule estimates themselves</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
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
                  <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-green-500" />
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
              <Card className="p-4 border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">The New Way</h4>
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
                  <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-green-500" />
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
                  <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center shrink-0">
                    <Settings className="w-4 h-4 text-green-500" />
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

      case "HARDWARE_STORE_SPECIAL":
        return (
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Not saying drop Sherwin-Williams. They give you discounts, delivery, credit terms. That's useful.
              But there might be something we're missing.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">The Local Hardware Store Difference:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span><strong>Community hub</strong> - the old-timers hang out, talk, know everybody</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span><strong>Warm referrals</strong> - "Who painted your house?" happens there naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <span><strong>Trust transfer</strong> - their recommendation carries real weight</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3">The Numbers (Rough Estimate):</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">2 local stores</span>
                  <span className="block font-bold text-lg">× 5 referrals/month each</span>
                </div>
                <div>
                  <span className="text-muted-foreground">= 10 referrals/month</span>
                  <span className="block font-bold text-lg">× 40% close rate</span>
                </div>
                <div>
                  <span className="text-muted-foreground">= 4 new jobs/month</span>
                  <span className="block font-bold text-lg">× $3,000-$6,000 avg</span>
                </div>
                <div>
                  <span className="text-muted-foreground">= </span>
                  <span className="block font-bold text-lg text-green-600">$144k-$288k/year</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                That's 7-14% of annual revenue. From just two stores.
              </p>
            </div>

            <p className="text-muted-foreground italic">
              Sherwin-Williams helps you operate. Local stores could help you grow.
              Just something to think about.
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
                onClick={() => window.open('https://nashpaintpros.io', '_blank')}
              >
                <Home className="w-8 h-8 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">Your Website</span>
                  <p className="text-xs text-muted-foreground">nashpaintpros.io - What customers see</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </Card>
              
              <Card 
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => window.open('https://nashpaintpros.io/owner', '_blank')}
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
                onClick={() => window.open('https://nashpaintpros.io/book', '_blank')}
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
                onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}
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
                onClick={() => window.open('https://nashpaintpros.io/crew-lead', '_blank')}
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
                onClick={() => window.open('https://nashpaintpros.io/marketing-hub', '_blank')}
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
              This walkthrough lives at nashpaintpros.io/walkthrough<br/>
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
            <h1 className="text-3xl font-bold mb-4">Nashville Painting Professionals</h1>
            <h2 className="text-xl text-muted-foreground mb-6">Your Complete System Walkthrough</h2>
            <p className="text-muted-foreground mb-8">
              I'll show you everything step by step.<br/>
              Each feature, where to find it, what it does.<br/>
              Takes about 5 minutes.
            </p>
            <Button size="lg" onClick={() => setIsStarted(true)} className="gap-2">
              Let's Go
              <ArrowRight className="w-5 h-5" />
            </Button>
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

      <div className="fixed top-4 right-4 z-50">
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
