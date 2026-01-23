import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sun, Moon, Sunset, Sparkles, BookOpen, ArrowRight, 
  CheckCircle, Megaphone, BarChart3, Calendar, FileText,
  Users, Settings, Lightbulb, Smartphone, MoreVertical, Share
} from "lucide-react";

interface PersonalizedGreetingProps {
  userName: string;
  userRole?: string;
  showWelcomeModal?: boolean;
  onWelcomeComplete?: () => void;
  variant?: "default" | "compact" | "hero";
  primaryColor?: string;
}

function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  return "evening";
}

function getGreeting(timeOfDay: "morning" | "afternoon" | "evening"): string {
  switch (timeOfDay) {
    case "morning": return "Good morning";
    case "afternoon": return "Good afternoon";
    case "evening": return "Good evening";
  }
}

function getGreetingIcon(timeOfDay: "morning" | "afternoon" | "evening") {
  switch (timeOfDay) {
    case "morning": return Sun;
    case "afternoon": return Sunset;
    case "evening": return Moon;
  }
}

export function PersonalizedGreeting({ 
  userName, 
  userRole,
  showWelcomeModal = false,
  onWelcomeComplete,
  variant = "default",
  primaryColor = "#D4AF37"
}: PersonalizedGreetingProps) {
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [showModal, setShowModal] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showWelcomeModal && userName) {
      const welcomeKey = `welcome_seen_${userName.toLowerCase().replace(/\s+/g, '_')}`;
      const seen = localStorage.getItem(welcomeKey);
      if (!seen) {
        setTimeout(() => setShowModal(true), 500);
      } else {
        setHasSeenWelcome(true);
      }
    }
  }, [showWelcomeModal, userName]);

  const handleCloseWelcome = () => {
    const welcomeKey = `welcome_seen_${userName.toLowerCase().replace(/\s+/g, '_')}`;
    localStorage.setItem(welcomeKey, "true");
    setShowModal(false);
    setHasSeenWelcome(true);
    onWelcomeComplete?.();
  };

  const greeting = getGreeting(timeOfDay);
  const Icon = getGreetingIcon(timeOfDay);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: primaryColor }} />
        <span className="text-sm">
          {greeting}, <span className="font-semibold">{userName}</span>
        </span>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ 
                rotate: timeOfDay === "morning" ? [0, 10, -10, 0] : 0,
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Icon className="w-8 h-8" style={{ color: primaryColor }} />
            </motion.div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting}, <span style={{ color: primaryColor }}>{userName}</span>
          </h1>
          {userRole && (
            <Badge className="mt-2" style={{ background: `${primaryColor}20`, color: primaryColor, borderColor: primaryColor }}>
              {userRole}
            </Badge>
          )}
        </motion.div>

        <WelcomeModal 
          isOpen={showModal} 
          onClose={handleCloseWelcome} 
          userName={userName}
          userRole={userRole}
          primaryColor={primaryColor}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: `${primaryColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: primaryColor }} />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">
            {greeting}, <span style={{ color: primaryColor }}>{userName}</span>
          </p>
          {userRole && (
            <p className="text-sm text-gray-400">{userRole}</p>
          )}
        </div>
      </motion.div>

      <WelcomeModal 
        isOpen={showModal} 
        onClose={handleCloseWelcome} 
        userName={userName}
        userRole={userRole}
        primaryColor={primaryColor}
      />
    </>
  );
}

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole?: string;
  primaryColor: string;
}

function WelcomeModal({ isOpen, onClose, userName, userRole, primaryColor }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const isMarketingRole = userRole?.toLowerCase().includes("marketing");

  const marketingSteps = [
    {
      title: "Welcome to Marketing Hub",
      icon: Megaphone,
      content: `Hey ${userName}! This is your central command for all marketing operations. Here's a quick tour of what you can do.`
    },
    {
      title: "Content Management",
      icon: FileText,
      content: "Browse and manage your content library with images, captions, and pre-built bundles. Schedule posts directly to social media."
    },
    {
      title: "Analytics & Insights",
      icon: BarChart3,
      content: "Track engagement, monitor performance, and see what content is resonating with your audience."
    },
    {
      title: "Calendar & Scheduling",
      icon: Calendar,
      content: "Plan your content in advance with the visual calendar. Drag and drop to reschedule posts."
    },
    {
      title: "Add to Your Home Screen",
      icon: Smartphone,
      content: "Want quick access? Tap the 3 dots (or Share button on iPhone) in your browser, then tap 'Add to Home Screen'. You'll get an app icon for instant access!"
    },
    {
      title: "You're All Set!",
      icon: CheckCircle,
      content: "Need help? Check the documentation or reach out to the team. Let's make some great content!"
    }
  ];

  const generalSteps = [
    {
      title: `Welcome, ${userName}!`,
      icon: Sparkles,
      content: "We're glad you're here! Let's take a quick look at what you can do."
    },
    {
      title: "Your Dashboard",
      icon: BarChart3,
      content: "Get a quick overview of important metrics, recent activity, and upcoming tasks all in one place."
    },
    {
      title: "Quick Actions",
      icon: Lightbulb,
      content: "Use the quick action buttons to navigate to common tasks. Everything is designed to be just a tap away."
    },
    {
      title: "Add to Your Home Screen",
      icon: Smartphone,
      content: "Want quick access? Tap the 3 dots (or Share button on iPhone) in your browser, then tap 'Add to Home Screen'. You'll get an app icon for instant access!"
    },
    {
      title: "You're Ready!",
      icon: CheckCircle,
      content: "Explore the features and don't hesitate to reach out if you need any help. Let's get started!"
    }
  ];

  const steps = isMarketingRole ? marketingSteps : generalSteps;
  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md" aria-describedby="welcome-modal-description">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${primaryColor}20` }}
            >
              <StepIcon className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <DialogTitle className="text-xl">{currentStep.title}</DialogTitle>
              <p className="text-sm text-gray-400">Step {step + 1} of {steps.length}</p>
            </div>
          </div>
        </DialogHeader>
        
        <DialogDescription id="welcome-modal-description" className="sr-only">
          Welcome walkthrough for new users
        </DialogDescription>

        <div className="py-4">
          <p className="text-gray-300 leading-relaxed">{currentStep.content}</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {steps.map((_, i) => (
            <div 
              key={i}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{ 
                background: i <= step ? primaryColor : 'rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>

        <DialogFooter className="flex gap-2">
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button 
            onClick={handleNext}
            className="flex-1"
            style={{ background: primaryColor }}
          >
            {step === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>

        {step === steps.length - 1 && (
          <Card className="bg-gray-800/50 border-gray-700 p-3 mt-2">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-300">Need more help?</p>
                <a 
                  href="/help" 
                  className="text-sm hover:underline"
                  style={{ color: primaryColor }}
                >
                  View full documentation
                </a>
              </div>
            </div>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function useTimeGreeting(userName: string): string {
  const [greeting, setGreeting] = useState(() => {
    const timeOfDay = getTimeOfDay();
    return `${getGreeting(timeOfDay)}, ${userName}`;
  });

  useEffect(() => {
    const updateGreeting = () => {
      const timeOfDay = getTimeOfDay();
      setGreeting(`${getGreeting(timeOfDay)}, ${userName}`);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [userName]);

  return greeting;
}
