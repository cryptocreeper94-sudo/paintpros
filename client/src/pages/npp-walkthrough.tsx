import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronRight, 
  X,
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
  CheckCircle2
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
      description: "I'm going to walk you through everything. Just follow the arrows. It's easier than it sounds, I promise.",
      icon: <Sparkles className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "start"
    },
    {
      id: 1,
      title: "Your Website",
      description: "This is what customers see when they Google you. Professional. Clean. Works on phones. Click the link to see it live.",
      icon: <Home className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "website",
      action: { label: "See Your Website", url: "https://nashpaintpros.io" }
    },
    {
      id: 2,
      title: "The CRM (Your Leads & Jobs)",
      description: "Same as Drip Jobs. Leads come in, you send estimates, jobs get scheduled, you get paid. You already know this part.",
      icon: <ClipboardList className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "crm",
      action: { label: "See the CRM", url: "https://nashpaintpros.io/owner" }
    },
    {
      id: 3,
      title: "Your Calendar",
      description: "All your jobs. Drag to reschedule. Your crew sees their schedule on their phone. Syncs with Google Calendar if you want.",
      icon: <Calendar className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "calendar",
      action: { label: "See the Calendar", url: "https://nashpaintpros.io/owner" }
    },
    {
      id: 4,
      title: "The Online Scheduler (This is New)",
      description: "Customers can book their own estimate appointments. No phone tag. No missed calls. They pick a time, it shows up on your calendar. Done.",
      icon: <MousePointerClick className="w-8 h-8" />,
      arrowDirection: 'up',
      highlight: "scheduler",
      action: { label: "Try the Scheduler", url: "https://nashpaintpros.io/book" }
    },
    {
      id: 5,
      title: "Field Tools",
      description: "Calculators on your phone. Square footage, paint needed, pricing. Build an estimate on-site and send it before you leave.",
      icon: <Wrench className="w-8 h-8" />,
      arrowDirection: 'right',
      highlight: "tools",
      action: { label: "See Field Tools", url: "https://nashpaintpros.io/app" }
    },
    {
      id: 6,
      title: "Crew Access",
      description: "Your crew gets their own login. They see their schedule, clock in with GPS, take photos. You see everything they do.",
      icon: <Users className="w-8 h-8" />,
      arrowDirection: 'down',
      highlight: "crew",
      action: { label: "See Crew View", url: "https://nashpaintpros.io/crew-lead" }
    },
    {
      id: 7,
      title: "Marketing Hub",
      description: "Posts to Facebook and Instagram automatically. You can add your own posts too. Stays active without you touching it.",
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
      title: "That's It. You're Done.",
      description: "Click any of these to go back and explore. I'm here if you have questions.",
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
            <h2 className="text-xl text-muted-foreground mb-6">Your System Walkthrough</h2>
            <p className="text-muted-foreground mb-8">
              I'll walk you through everything step by step.<br/>
              Just follow the arrows. Takes about 3 minutes.<br/>
              <span className="italic">(Yes, I timed it.)</span>
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
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step counter */}
      <div className="fixed top-4 right-4 z-50">
        <Card className="px-4 py-2 text-sm">
          Step {currentStep + 1} of {tourSteps.length}
        </Card>
      </div>

      {/* Main content */}
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
            <Card className="p-8">
              {/* Icon and arrow */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {currentTourStep.icon}
                </div>
                <FloatingArrow direction={currentTourStep.arrowDirection} />
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentTourStep.title}</h2>

              {/* Special hardware store content */}
              {currentTourStep.description === "HARDWARE_STORE_SPECIAL" ? (
                <div className="space-y-6 mb-6">
                  <p className="text-lg text-muted-foreground">
                    Not saying drop Sherwin-Williams. They give you discounts, delivery, credit terms. That's useful.
                    But there might be something we're missing.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">The Local Hardware Store Difference:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <span>Community hub - the old-timers hang out, talk, know everybody</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <span>Warm referrals - "Who painted your house?" happens there naturally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                        <span>Trust transfer - their recommendation carries real weight</span>
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
              ) : (
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {currentTourStep.description}
                </p>
              )}

              {/* Action button (if any) */}
              {currentTourStep.action && (
                <div className="mb-8">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 w-full md:w-auto"
                    onClick={() => window.open(currentTourStep.action!.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {currentTourStep.action.label}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    (Opens in new tab - come back here when you're done looking)
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="gap-2"
                >
                  Back
                </Button>

                {/* Dots */}
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

            {/* Quick links on final step */}
            {currentStep === tourSteps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                <Card 
                  className="p-4 text-center hover-elevate cursor-pointer"
                  onClick={() => window.open('https://nashpaintpros.io', '_blank')}
                >
                  <Home className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Website</span>
                </Card>
                <Card 
                  className="p-4 text-center hover-elevate cursor-pointer"
                  onClick={() => window.open('https://nashpaintpros.io/book', '_blank')}
                >
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Scheduler</span>
                </Card>
                <Card 
                  className="p-4 text-center hover-elevate cursor-pointer"
                  onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}
                >
                  <Wrench className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Field Tools</span>
                </Card>
                <Card 
                  className="p-4 text-center hover-elevate cursor-pointer"
                  onClick={() => window.open('https://nashpaintpros.io/marketing-hub', '_blank')}
                >
                  <Megaphone className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <span className="text-sm font-medium">Marketing</span>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
