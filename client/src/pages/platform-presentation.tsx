import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Smartphone,
  Monitor,
  Users,
  Clock,
  DollarSign,
  Zap,
  BarChart3,
  Calendar,
  Megaphone,
  Wrench,
  Building2,
  CheckCircle2,
  ArrowRight,
  Globe,
  Calculator,
  FileText,
  CreditCard,
  Briefcase,
  ClipboardList,
  Settings,
  ExternalLink,
  MousePointerClick
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export default function PlatformPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Your Complete Business System",
      subtitle: "Everything You Need. One Platform.",
      content: (
        <div className="flex flex-col items-center justify-center gap-8">
          <p className="text-2xl text-center max-w-3xl text-muted-foreground">
            Built to work the way you already work. Integrates with Drip Jobs. Connects to QuickBooks. 
            All your tools, all your data, all in one place.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io', '_blank')}>
              <Globe className="w-10 h-10 mx-auto mb-2 text-primary" />
              <span className="font-semibold">Website</span>
            </Card>
            <Card className="p-4 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/marketing-hub', '_blank')}>
              <Megaphone className="w-10 h-10 mx-auto mb-2 text-primary" />
              <span className="font-semibold">Marketing</span>
            </Card>
            <Card className="p-4 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/app', '_blank')}>
              <Wrench className="w-10 h-10 mx-auto mb-2 text-primary" />
              <span className="font-semibold">Field Tools</span>
            </Card>
            <Card className="p-4 text-center hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/owner', '_blank')}>
              <Building2 className="w-10 h-10 mx-auto mb-2 text-primary" />
              <span className="font-semibold">Back Office</span>
            </Card>
          </div>
          <p className="text-lg text-primary font-semibold mt-4">Click any card to see it live</p>
        </div>
      )
    },
    {
      id: 2,
      title: "Designed Around Your Workflow",
      subtitle: "Works Like Drip Jobs. Connects to QuickBooks.",
      content: (
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-2 border-primary/30">
              <ClipboardList className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-2">CRM Built-In</h3>
              <p className="text-muted-foreground mb-4">Same workflow as Drip Jobs - leads, estimates, jobs, invoices. If you know Drip Jobs, you already know this.</p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span>Drip Jobs Compatible</span>
              </div>
            </Card>
            <Card className="p-6 border-2 border-green-500/30">
              <CreditCard className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">QuickBooks Sync</h3>
              <p className="text-muted-foreground mb-4">Invoices, payments, expenses - all synced automatically. No double entry. No mistakes.</p>
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>QuickBooks Integration</span>
              </div>
            </Card>
            <Card className="p-6 border-2 border-amber-500/30">
              <Settings className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="font-bold text-xl mb-2">Your Way</h3>
              <p className="text-muted-foreground mb-4">Customize pricing, services, workflows. It adapts to how you run your business, not the other way around.</p>
              <div className="flex items-center gap-2 text-sm text-amber-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fully Customizable</span>
              </div>
            </Card>
          </div>
          <Card className="p-4 bg-primary/5 text-center">
            <p className="text-lg">No learning curve. No starting over. Just better tools that work together.</p>
          </Card>
        </div>
      )
    },
    {
      id: 3,
      title: "Step 1: Your Website",
      subtitle: "Professional. Modern. Works For You 24/7.",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="font-bold text-lg">Customers Find You</h3>
                <p className="text-muted-foreground">SEO optimized so you show up when people search "painters near me"</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="font-bold text-lg">They Get An Instant Estimate</h3>
                <p className="text-muted-foreground">Built-in estimator gives them a ballpark before you even get involved</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="font-bold text-lg">They Book Online</h3>
                <p className="text-muted-foreground">Schedule appointments while you sleep. Wake up to booked jobs.</p>
              </div>
            </div>
            <a 
              href="https://nashpaintpros.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors mt-4"
            >
              <span>See Your Website Live</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="aspect-video rounded-lg bg-background/80 flex flex-col items-center justify-center p-4">
              <Monitor className="w-20 h-20 text-primary mb-4" />
              <p className="text-2xl font-bold">nashpaintpros.io</p>
              <p className="text-muted-foreground">Your customers see this</p>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "Step 2: Your Back Office",
      subtitle: "Everything You Need to Run the Business",
      content: (
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/owner', '_blank')}>
              <Building2 className="w-10 h-10 text-amber-500 mb-3" />
              <h3 className="font-bold mb-1">Owner Dashboard</h3>
              <p className="text-sm text-muted-foreground">Full visibility. Every number. Every job.</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-3">
                <MousePointerClick className="w-3 h-3" />
                <span>Click to view</span>
              </div>
            </Card>
            <Card className="p-5 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/admin', '_blank')}>
              <Users className="w-10 h-10 text-blue-500 mb-3" />
              <h3 className="font-bold mb-1">Admin Panel</h3>
              <p className="text-sm text-muted-foreground">Team, scheduling, customer management.</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-3">
                <MousePointerClick className="w-3 h-3" />
                <span>Click to view</span>
              </div>
            </Card>
            <Card className="p-5 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/crew-lead', '_blank')}>
              <Wrench className="w-10 h-10 text-green-500 mb-3" />
              <h3 className="font-bold mb-1">Crew Lead</h3>
              <p className="text-sm text-muted-foreground">Job details, crew assignments, time tracking.</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-3">
                <MousePointerClick className="w-3 h-3" />
                <span>Click to view</span>
              </div>
            </Card>
            <Card className="p-5 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/project-manager', '_blank')}>
              <Briefcase className="w-10 h-10 text-purple-500 mb-3" />
              <h3 className="font-bold mb-1">Project Manager</h3>
              <p className="text-sm text-muted-foreground">Oversee everything. Keep jobs on track.</p>
              <div className="flex items-center gap-1 text-xs text-primary mt-3">
                <MousePointerClick className="w-3 h-3" />
                <span>Click to view</span>
              </div>
            </Card>
          </div>
          <Card className="p-6 bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Just Like Drip Jobs</h3>
                <p className="text-muted-foreground">Same flow: Leads → Estimates → Jobs → Invoices → Payments. You already know how to use it.</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "Step 3: Your CRM",
      subtitle: "Track Every Lead. Close Every Deal.",
      content: (
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
            <Card className="p-4 flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-500 font-bold">1</span>
              </div>
              <div>
                <p className="font-bold">Lead Comes In</p>
                <p className="text-sm text-muted-foreground">Website, call, referral</p>
              </div>
            </Card>
            <ArrowRight className="w-6 h-6 text-muted-foreground self-center hidden md:block" />
            <Card className="p-4 flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-500 font-bold">2</span>
              </div>
              <div>
                <p className="font-bold">Create Estimate</p>
                <p className="text-sm text-muted-foreground">Use calculators or manual</p>
              </div>
            </Card>
            <ArrowRight className="w-6 h-6 text-muted-foreground self-center hidden md:block" />
            <Card className="p-4 flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 font-bold">3</span>
              </div>
              <div>
                <p className="font-bold">Job Accepted</p>
                <p className="text-sm text-muted-foreground">Schedule & assign crew</p>
              </div>
            </Card>
            <ArrowRight className="w-6 h-6 text-muted-foreground self-center hidden md:block" />
            <Card className="p-4 flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">4</span>
              </div>
              <div>
                <p className="font-bold">Get Paid</p>
                <p className="text-sm text-muted-foreground">Invoice → QuickBooks</p>
              </div>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-primary" />
                Drip Jobs Familiar
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Same pipeline view</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Same status workflow</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Drag and drop jobs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Customer history</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-500" />
                QuickBooks Connected
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Auto-sync invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Payment tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Expense management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Financial reports</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Step 4: Field Tools",
      subtitle: "Professional Calculators. In Your Pocket.",
      content: (
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex flex-col items-center justify-center p-4">
              <Smartphone className="w-24 h-24 text-primary mb-4" />
              <p className="text-2xl font-bold">nashpaintpros.io/app</p>
              <p className="text-muted-foreground mb-4">Pull it up on any phone</p>
              <a 
                href="https://nashpaintpros.io/app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <span>Open Field Tool</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </Card>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">What's Inside</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Paint Coverage</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Labor Hours</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Material Costs</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Square Footage</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Price Per Door</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Trim & Molding</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Cabinet Pricing</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Deck Staining</span>
              </Card>
            </div>
            <p className="text-muted-foreground pt-2">Accurate estimates on the job site. No more guessing. No more spreadsheets.</p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Step 5: Marketing That Runs Itself",
      subtitle: "Automated. Targeted. Always Working.",
      content: (
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-3">Automated Posting</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Weekdays</span>
                  <span className="text-muted-foreground">5 posts/day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Weekends</span>
                  <span className="text-muted-foreground">3 posts/day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="font-medium">Platforms</span>
                  <span className="text-primary font-semibold">Facebook + Instagram</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-3">Paid Ads Running</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Facebook</span>
                  <span className="text-muted-foreground">$25/day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Instagram</span>
                  <span className="text-muted-foreground">$25/day</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <span className="font-medium">Impressions</span>
                  <span className="text-green-500 font-semibold">20,000+ in 48 hrs</span>
                </div>
              </div>
            </Card>
          </div>
          <a 
            href="https://nashpaintpros.io/marketing-hub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Megaphone className="w-5 h-5" />
            <span>Open Marketing Hub</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )
    },
    {
      id: 8,
      title: "Who Has Access To What",
      subtitle: "Right Tools. Right People. Right Access.",
      content: (
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-2 border-amber-500/30 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/owner', '_blank')}>
              <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-bold text-lg text-center mb-3">Owner</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-500" /> Everything</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-500" /> Financials</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-500" /> All reports</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-500" /> Settings</li>
              </ul>
            </Card>
            <Card className="p-5 border-2 border-blue-500/30 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/admin', '_blank')}>
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg text-center mb-3">Admin</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Team management</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Scheduling</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Customers</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Estimates</li>
              </ul>
            </Card>
            <Card className="p-5 border-2 border-green-500/30 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/crew-lead', '_blank')}>
              <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-bold text-lg text-center mb-3">Crew Lead</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Job details</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Field tools</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Time tracking</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Crew info</li>
              </ul>
            </Card>
            <Card className="p-5 border-2 border-purple-500/30 hover-elevate cursor-pointer" onClick={() => window.open('https://nashpaintpros.io/marketing-hub', '_blank')}>
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-bold text-lg text-center mb-3">Marketing</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-500" /> Social posts</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-500" /> Ad campaigns</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-500" /> Analytics</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-purple-500" /> Content</li>
              </ul>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-6">Click any role to see their view</p>
        </div>
      )
    },
    {
      id: 9,
      title: "Why Integrate?",
      subtitle: "Stop Juggling. Start Scaling.",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-destructive/30 bg-destructive/5">
              <h3 className="font-bold text-xl mb-4 text-destructive">Without Integration</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Hours managing multiple systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Manual social media posting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Spreadsheet estimates</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>Paying for 5+ different tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span>$40K/year for a brochure website</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 border-primary/30 bg-primary/5">
              <h3 className="font-bold text-xl mb-4 text-primary">With This System</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Everything in one dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Marketing runs automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Professional estimates in seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>One system, everything included</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Website that actually works for you</span>
                </li>
              </ul>
            </Card>
          </div>
          <Card className="p-6 text-center bg-gradient-to-r from-primary/10 to-amber-500/10">
            <p className="text-xl font-semibold">Yes, it takes effort to switch. But you're switching to one system instead of managing five.</p>
          </Card>
        </div>
      )
    },
    {
      id: 10,
      title: "It's Ready Now",
      subtitle: "Everything Is Built. Just Start Using It.",
      content: (
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-muted-foreground mb-8">
            The website is live. The marketing is running. The tools are built. All you have to do is use them.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <a href="https://nashpaintpros.io" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="p-4 hover-elevate h-full">
                <Globe className="w-10 h-10 mx-auto mb-3 text-primary" />
                <p className="font-bold">Website</p>
                <p className="text-xs text-muted-foreground mt-1">nashpaintpros.io</p>
              </Card>
            </a>
            <a href="https://nashpaintpros.io/owner" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="p-4 hover-elevate h-full">
                <Building2 className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <p className="font-bold">Back Office</p>
                <p className="text-xs text-muted-foreground mt-1">/owner</p>
              </Card>
            </a>
            <a href="https://nashpaintpros.io/app" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="p-4 hover-elevate h-full">
                <Wrench className="w-10 h-10 mx-auto mb-3 text-green-500" />
                <p className="font-bold">Field Tools</p>
                <p className="text-xs text-muted-foreground mt-1">/app</p>
              </Card>
            </a>
            <a href="https://nashpaintpros.io/marketing-hub" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="p-4 hover-elevate h-full">
                <Megaphone className="w-10 h-10 mx-auto mb-3 text-purple-500" />
                <p className="font-bold">Marketing Hub</p>
                <p className="text-xs text-muted-foreground mt-1">/marketing-hub</p>
              </Card>
            </a>
          </div>
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">This Is Your System</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Built specifically for how you run your business. Designed to work with the tools you already know. 
              Ready to use right now.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Drip Jobs Compatible</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>QuickBooks Integration</span>
              </div>
              <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Automated Marketing</span>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isAutoPlay) {
      const timer = setInterval(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 10000);
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
