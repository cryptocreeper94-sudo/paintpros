import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Calculator, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Shield,
  Lock,
  Home,
  Star,
  Bell,
  Gift,
  Palette,
  Clock,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useTenant } from "@/context/TenantContext";

import painterConsulting from "@assets/generated_images/painter_consulting_with_customer.png";
import estimateCalculator from "@assets/generated_images/digital_estimate_calculator_interface.png";
import paintingCrew from "@assets/generated_images/professional_painting_crew_at_work.png";
import businessDashboard from "@assets/generated_images/business_management_dashboard.png";
import happyFamily from "@assets/generated_images/happy_family_with_painted_home.png";
import bookingCalendar from "@assets/generated_images/appointment_booking_calendar.png";

interface Slide {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: typeof Home;
  link: string;
  linkText: string;
  features: string[];
}

const customerSlides: Slide[] = [
  {
    id: "welcome",
    title: "Welcome to Your Painting Partner",
    description: "We make it easy to transform your space with professional painting services. From getting a quote to booking your appointment, everything is at your fingertips.",
    image: painterConsulting,
    icon: Home,
    link: "/",
    linkText: "Visit Homepage",
    features: ["Easy online booking", "Transparent pricing", "Quality guarantee"]
  },
  {
    id: "estimate",
    title: "Get an Instant Estimate",
    description: "Use our smart estimator to get an accurate quote in seconds. Just enter your room details and see real-time pricing for your project.",
    image: estimateCalculator,
    icon: Calculator,
    link: "/estimate",
    linkText: "Try the Estimator",
    features: ["Room-by-room pricing", "Multiple service options", "Save and compare quotes"]
  },
  {
    id: "booking",
    title: "Book Your Appointment",
    description: "Schedule your painting service at a time that works for you. Our 5-step booking wizard makes it simple to reserve your spot.",
    image: bookingCalendar,
    icon: Calendar,
    link: "/estimate",
    linkText: "Book Now",
    features: ["Choose your date & time", "Flexible scheduling", "Instant confirmation"]
  },
  {
    id: "account",
    title: "Your Customer Portal",
    description: "Access your account to view estimates, track jobs, manage appointments, and update your preferences all in one place.",
    image: happyFamily,
    icon: Users,
    link: "/account",
    linkText: "View My Account",
    features: ["Estimate history", "Job tracking", "Document access", "Notification settings"]
  },
  {
    id: "notifications",
    title: "Stay Informed",
    description: "Never miss an appointment with our reminder system. Get email and push notifications 24 hours and 1 hour before your scheduled service.",
    image: bookingCalendar,
    icon: Bell,
    link: "/account",
    linkText: "Manage Notifications",
    features: ["Email reminders", "Push notifications", "Customizable preferences"]
  },
  {
    id: "referral",
    title: "Refer & Earn",
    description: "Love our work? Share your referral link with friends and family. When they book, you both benefit from our referral program.",
    image: happyFamily,
    icon: Gift,
    link: "/account",
    linkText: "Get Referral Link",
    features: ["Easy sharing", "Track referrals", "Earn rewards"]
  }
];

const staffSlides: Slide[] = [
  {
    id: "dashboards",
    title: "Role-Based Dashboards",
    description: "Access your personalized dashboard based on your role. Owners, Admins, Project Managers, and Crew Leads each have tailored views with the tools they need.",
    image: businessDashboard,
    icon: BarChart3,
    link: "/admin",
    linkText: "Open Dashboard",
    features: ["Owner Dashboard", "Admin Dashboard", "Project Manager View", "Crew Lead Portal"]
  },
  {
    id: "crm",
    title: "CRM & Pipeline Management",
    description: "Track leads from first contact to completed job. Use our dual-mode pipeline for sales tracking and job management with DripJobs-style workflows.",
    image: businessDashboard,
    icon: Users,
    link: "/admin",
    linkText: "View CRM",
    features: ["Sales Pipeline", "Jobs Pipeline", "Lead tracking", "Status updates"]
  },
  {
    id: "calendar",
    title: "CRM Calendar",
    description: "Schedule appointments, meetings, and follow-ups with our integrated calendar. Set reminders and link events to leads and estimates.",
    image: bookingCalendar,
    icon: Calendar,
    link: "/admin",
    linkText: "Open Calendar",
    features: ["Month/Week/Day views", "Event reminders", "Color-coded types", "Recurring events"]
  },
  {
    id: "documents",
    title: "Document Center",
    description: "Create, manage, and get signatures on contracts, estimates, invoices, and proposals. All documents are tracked with version history.",
    image: estimateCalculator,
    icon: FileText,
    link: "/admin",
    linkText: "View Documents",
    features: ["Digital signatures", "PDF generation", "Version tracking", "Blockchain verification"]
  },
  {
    id: "crew",
    title: "Crew Management",
    description: "Manage your painting crews with time tracking, job notes, and incident reporting. Crew leads can clock in/out and document their work.",
    image: paintingCrew,
    icon: Users,
    link: "/crew-lead",
    linkText: "Crew Portal",
    features: ["Time tracking", "Job notes", "Incident reports", "Spanish language support"]
  },
  {
    id: "messaging",
    title: "Internal Messaging",
    description: "Stay connected with your team and customers through our real-time messaging system. Speech-to-text, typing indicators, and role badges included.",
    image: painterConsulting,
    icon: MessageSquare,
    link: "/admin",
    linkText: "Open Messages",
    features: ["Real-time chat", "Speech-to-text", "Unread counts", "Role badges"]
  },
  {
    id: "franchise",
    title: "Franchise Management",
    description: "For multi-location operations: manage territories, API credentials, and partner integrations. Full franchise CRUD with tiered pricing.",
    image: businessDashboard,
    icon: Settings,
    link: "/developer",
    linkText: "Developer Portal",
    features: ["Territory licensing", "Partner API", "Usage tracking", "Rate limiting"]
  }
];

function Slideshow({ slides, title }: { slides: Slide[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  const goNext = () => setCurrentIndex((i) => (i + 1) % slides.length);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {currentIndex + 1} / {slides.length}
          </Badge>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-48 md:h-80">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 md:to-transparent" />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <currentSlide.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold">{currentSlide.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">{currentSlide.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {currentSlide.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={currentSlide.link}>
                    <Button className="w-full md:w-auto" data-testid={`button-try-${currentSlide.id}`}>
                      {currentSlide.linkText}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            data-testid="button-slide-prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex 
                    ? "bg-accent w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                data-testid={`button-slide-dot-${idx}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            data-testid="button-slide-next"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StaffPinGate({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");

  const validPins = ["4444", "1111", "2222", "0424", "3333"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validPins.includes(pin)) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Invalid PIN. Please try again.");
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <GlassCard className="p-8 text-center max-w-md mx-auto">
      <div className="p-4 rounded-full bg-accent/20 w-fit mx-auto mb-6">
        <Lock className="w-8 h-8 text-accent" />
      </div>
      <h3 className="text-xl font-bold mb-2">Staff Access Required</h3>
      <p className="text-muted-foreground mb-6">
        Enter your staff PIN to view the staff training guide.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="Enter 4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          className="text-center text-2xl tracking-widest"
          data-testid="input-staff-pin"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full" data-testid="button-unlock-staff">
          <Shield className="w-4 h-4 mr-2" />
          Unlock Staff Guide
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-4">
        Staff PINs are provided by your manager.
      </p>
    </GlassCard>
  );
}

export default function Help() {
  const tenant = useTenant();

  return (
    <PageLayout>
      <main className="pt-16 md:pt-24 px-4 md:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Help Center
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome to {tenant.name}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn how to get the most out of our platform with these interactive guides.
            </p>
          </div>

          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="customer" data-testid="tab-customer-guide">
                <Home className="w-4 h-4 mr-2" />
                Customer Guide
              </TabsTrigger>
              <TabsTrigger value="staff" data-testid="tab-staff-guide">
                <Shield className="w-4 h-4 mr-2" />
                Staff Guide
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <Slideshow slides={customerSlides} title="Customer Features" />
            </TabsContent>

            <TabsContent value="staff">
              <StaffPinGate>
                <Slideshow slides={staffSlides} title="Staff Features" />
              </StaffPinGate>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <GlassCard className="p-6 inline-block">
              <p className="text-muted-foreground mb-4">
                Need more help? Contact our support team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/">
                  <Button variant="outline" data-testid="button-back-home">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link href="/account">
                  <Button data-testid="button-contact-support">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
