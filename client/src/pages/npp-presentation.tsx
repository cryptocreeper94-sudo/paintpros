import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Calendar,
  Users,
  Clock,
  Megaphone,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Home,
  ClipboardList,
  Smartphone,
  MousePointerClick,
  Store,
  Handshake,
  TrendingUp,
  Coffee,
  DollarSign,
  Heart,
  Lightbulb,
  MapPin,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export default function NPPPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);
  const [showTOC, setShowTOC] = useState(false);

  const slides: Slide[] = [
    {
      id: 0,
      title: "Nash PaintPros",
      subtitle: "Your New System - The Simple Version",
      content: (
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-xl text-center max-w-2xl text-muted-foreground">
            Everything you're already doing... just easier.
          </p>
          <p className="text-lg text-center text-muted-foreground/70 italic">
            (Yes, I know you hate watching presentations. I'll keep it short.)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="p-4 text-center">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Like Drip Jobs</span>
            </Card>
            <Card className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Like Google Cal</span>
            </Card>
            <Card className="p-4 text-center">
              <Megaphone className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Auto Marketing</span>
            </Card>
            <Card className="p-4 text-center">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Works on Phone</span>
            </Card>
          </div>
          <p className="text-primary font-semibold mt-4">Use the arrows or click the dots below to navigate</p>
        </div>
      )
    },
    {
      id: 1,
      title: "Table of Contents",
      subtitle: "Jump to whatever you want",
      content: (
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-3">
            {[
              { num: 2, title: "Your Website", desc: "What customers see" },
              { num: 3, title: "The CRM", desc: "Just like Drip Jobs" },
              { num: 4, title: "Your Calendar", desc: "Google Calendar but better" },
              { num: 5, title: "The Online Scheduler", desc: "This is the new thing" },
              { num: 6, title: "Field Tools", desc: "Calculators in your pocket" },
              { num: 7, title: "Marketing Hub", desc: "Posts itself. Seriously." },
              { num: 8, title: "An Idea Worth Exploring", desc: "Local hardware stores" },
              { num: 9, title: "That's It", desc: "Told you it'd be short" }
            ].map((item) => (
              <Card 
                key={item.num}
                className="p-4 hover-elevate cursor-pointer flex items-center gap-4"
                onClick={() => goToSlide(item.num)}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Your Website",
      subtitle: "nashpaintpros.io",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                This is what customers see when they find you online.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Professional look (you're not some guy with a ladder)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Works on phones (because that's where everyone is)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Shows your services, your work, your reviews</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>Customers can book online (more on that later)</span>
                </li>
              </ul>
              <Button 
                className="mt-4"
                onClick={() => window.open('https://nashpaintpros.io', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                See It Live
              </Button>
            </div>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <Home className="w-16 h-16 mx-auto mb-4 text-primary" />
              <p className="text-center text-muted-foreground">
                Your website is working 24/7.<br/>
                Even when you're asleep. <br/>
                <span className="text-sm italic">(Unlike that one guy on your crew.)</span>
              </p>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "The CRM",
      subtitle: "Just Like Drip Jobs. You Already Know This.",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xl text-muted-foreground">
              If you know how to use Drip Jobs, you know how to use this.
            </p>
            <p className="text-muted-foreground/70 mt-2 italic">
              Same workflow. Same logic. Different shirt.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold mb-2">Leads Come In</h3>
              <p className="text-sm text-muted-foreground">From the website, from calls, from referrals. All in one place.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-bold mb-2">You Send Estimates</h3>
              <p className="text-sm text-muted-foreground">Just like Drip Jobs. Track what's pending, what's approved, what's done.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold mb-2">You Get Paid</h3>
              <p className="text-sm text-muted-foreground">Invoice, collect, done. QuickBooks can sync when you're ready.</p>
            </Card>
          </div>
          <p className="text-center mt-8 text-muted-foreground">
            No learning curve. No 47 training videos. It just... works.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "Your Calendar",
      subtitle: "Google Calendar, But It Does More",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Card className="p-6">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-center mb-4">What You're Used To</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  See all your jobs on a calendar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Drag and drop to reschedule
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Syncs with Google Calendar
                </li>
              </ul>
            </Card>
            <Card className="p-6 border-2 border-primary">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-center mb-4">What's New</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Crew members see their schedule
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  GPS check-in when they arrive
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Weather alerts (rain tomorrow?)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Customers can book themselves
                </li>
              </ul>
            </Card>
          </div>
          <p className="text-center mt-6 text-muted-foreground italic">
            That last one is the game changer. Keep going.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: "The Online Scheduler",
      subtitle: "This Is The New Thing",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-semibold mb-4">
              This is the innovative feature
            </div>
            <p className="text-xl text-muted-foreground">
              Customers can book their own estimate appointments.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 text-red-500">The Old Way</h3>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 text-sm">1</span>
                  <span>Customer calls or texts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 text-sm">2</span>
                  <span>You're on a ladder. Ignore it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 text-sm">3</span>
                  <span>Call back later. They don't answer.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 text-sm">4</span>
                  <span>Phone tag for 3 days.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 text-sm">5</span>
                  <span>Maybe you book it. Maybe they called someone else.</span>
                </li>
              </ol>
            </Card>
            <Card className="p-6 border-2 border-blue-500">
              <h3 className="font-bold text-lg mb-4 text-blue-500">The New Way</h3>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 text-sm">1</span>
                  <span>Customer goes to your website</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 text-sm">2</span>
                  <span>Clicks "Book Estimate"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 text-sm">3</span>
                  <span>Picks a time that works for them</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 text-sm">4</span>
                  <span>Done. It's on your calendar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 text-sm">5</span>
                  <span>You never picked up the phone.</span>
                </li>
              </ol>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Button onClick={() => window.open('https://nashpaintpros.io/book', '_blank')}>
              <MousePointerClick className="w-4 h-4 mr-2" />
              Try It Yourself
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Field Tools",
      subtitle: "Calculators. On Your Phone. That's It.",
      content: (
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xl text-muted-foreground mb-8">
            No more napkin math. No more "let me get back to you on that."
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}>
              <Wrench className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold mb-2">Paint Calculator</h3>
              <p className="text-sm text-muted-foreground">Square footage, paint needed, material cost. Quick and accurate.</p>
            </Card>
            <Card className="p-6 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}>
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold mb-2">Time Estimator</h3>
              <p className="text-sm text-muted-foreground">How long will this job take? Get a realistic answer.</p>
            </Card>
            <Card className="p-6 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-bold mb-2">Price Builder</h3>
              <p className="text-sm text-muted-foreground">Build an estimate on-site. Send it before you leave.</p>
            </Card>
          </div>
          <p className="text-center mt-8 text-muted-foreground">
            Works on your phone. Works offline. <br/>
            <span className="italic">(Works even when the WiFi at the job site doesn't.)</span>
          </p>
        </div>
      )
    },
    {
      id: 7,
      title: "Marketing Hub",
      subtitle: "Posts Itself. Seriously.",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Megaphone className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-xl text-muted-foreground">
              Social media is important. But who has time for that?
            </p>
          </div>
          <Card className="p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">What It Does:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Posts to Facebook automatically</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Posts to Instagram automatically</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>Rotates content so it's not the same thing</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span>You can add your own posts too</span>
              </div>
            </div>
          </Card>
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              The system posts content about your services throughout the day.<br/>
              You stay visible without touching your phone.<br/>
              <span className="italic">(Unless you want to post that cool before/after shot.)</span>
            </p>
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => window.open('https://nashpaintpros.io/marketing-hub', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              See The Marketing Hub
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "An Idea Worth Exploring",
      subtitle: "Local Hardware Stores",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Store className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-xl text-muted-foreground">
              This isn't a criticism. It's a thought.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                What Sherwin-Williams Gives Us
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Discounts on paint</li>
                <li>Free delivery</li>
                <li>Credit terms</li>
                <li>A rep who manages 100 other accounts</li>
              </ul>
              <p className="mt-4 text-sm font-medium">Good for operations.</p>
            </Card>
            
            <Card className="p-6 border-2 border-primary">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Handshake className="w-5 h-5 text-primary" />
                What Local Hardware Stores Could Give Us
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Warm referrals to their customers</li>
                <li>Business cards at the counter</li>
                <li>"Who should I call?" → "Call these guys."</li>
                <li>Trust that transfers directly</li>
              </ul>
              <p className="mt-4 text-sm font-medium text-primary">Good for growth.</p>
            </Card>
          </div>
          
          <Card className="p-6 bg-muted/30">
            <h3 className="font-bold text-center mb-4">The Math (Rough Estimate)</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">2</div>
                <div className="text-sm text-muted-foreground">Local stores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">5/mo each</div>
                <div className="text-sm text-muted-foreground">Referrals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Close rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">$144k-$288k</div>
                <div className="text-sm text-muted-foreground">Per year</div>
              </div>
            </div>
          </Card>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              The local hardware store is the community hub.<br/>
              That's where the old-timers hang out. That's where the referrals happen.<br/>
              <span className="italic">Just something to think about.</span>
            </p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "That's It",
      subtitle: "Told You It'd Be Short",
      content: (
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
          <p className="text-xl text-muted-foreground mb-8">
            You've got a system that works.<br/>
            Start using it when you're ready.<br/>
            I'm here if you have questions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="p-4 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io', '_blank')}>
              <Home className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="font-medium">Your Website</span>
            </Card>
            <Card className="p-4 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/book', '_blank')}>
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="font-medium">Online Scheduler</span>
            </Card>
            <Card className="p-4 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}>
              <Wrench className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="font-medium">Field Tools</span>
            </Card>
            <Card className="p-4 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/marketing-hub', '_blank')}>
              <Megaphone className="w-8 h-8 mx-auto mb-2 text-primary" />
              <span className="font-medium">Marketing Hub</span>
            </Card>
          </div>
          
          <p className="text-muted-foreground italic">
            And no, you don't have to watch this again.<br/>
            But you can. It's at nashpaintpros.io/npp-demo
          </p>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        setDirection(1);
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsAutoPlay(false);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [isAutoPlay, currentSlide, slides.length]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setShowTOC(false);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col">
        <div className="border-b bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold">NPP System Overview</h1>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => goToSlide(1)}
                data-testid="button-toc"
              >
                <Menu className="w-4 h-4 mr-2" />
                Contents
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Slide {currentSlide + 1} of {slides.length}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
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
              className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 overflow-y-auto"
            >
              <div className="max-w-6xl w-full">
                <div className="text-center mb-6 md:mb-8">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{slides[currentSlide].title}</h1>
                  {slides[currentSlide].subtitle && (
                    <p className="text-lg md:text-2xl text-muted-foreground">{slides[currentSlide].subtitle}</p>
                  )}
                </div>
                <div className="mt-6">
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

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? "bg-primary w-6 md:w-8" 
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
