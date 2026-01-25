import { motion } from "framer-motion";
import { 
  Calendar, BarChart3, Megaphone, Target, Clock, Users, 
  CheckCircle, ArrowRight, FileText, Lightbulb, Zap, Home, LogIn
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function MarketingOverview() {
  const [, setLocation] = useLocation();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            data-testid="button-home"
          >
            <Home className="w-5 h-5" />
            <span className="font-semibold">Home</span>
          </button>
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/marketing-hub")}
              className="text-white/70 hover:text-white"
              data-testid="button-nav-hub"
            >
              Marketing Hub
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/auth")}
              className="bg-purple-600 hover:bg-purple-700"
              data-testid="button-nav-signin"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <motion.div {...fadeIn}>
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Marketing Hub Pro
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Marketing,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
                Simplified & Centralized
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8">
              One hub to manage social media, track campaigns, create content, and measure results. 
              Built for painting professionals who want to grow without the chaos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700"
                onClick={() => setLocation("/marketing-hub")}
                data-testid="button-explore-hub"
              >
                Explore the Hub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white"
                onClick={() => setLocation("/auth")}
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reality Check Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-md p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-md bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Setting Realistic Expectations</h2>
                <div className="space-y-4 text-white/80">
                  <p>
                    <strong className="text-amber-400">Marketing takes time.</strong> This isn't a magic button that generates 100 leads overnight. 
                    Real, sustainable growth comes from consistent effort over weeks and months—not days.
                  </p>
                  <p>
                    What we're building here is a <strong className="text-white">foundation</strong>. A system that organizes your marketing, 
                    tracks what's working, and scales with your business. The tools are ready. The strategy is sound. 
                    But results require patience and consistent execution.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 pt-4">
                    <div className="bg-white/5 rounded-md p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">Week 1-2</p>
                      <p className="text-sm text-white/60">Setup & Learning</p>
                    </div>
                    <div className="bg-white/5 rounded-md p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">Month 1-2</p>
                      <p className="text-sm text-white/60">Content Building</p>
                    </div>
                    <div className="bg-white/5 rounded-md p-4 text-center">
                      <p className="text-2xl font-bold text-amber-400">Month 3+</p>
                      <p className="text-sm text-white/60">Momentum & Results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">The Problem with Scattered Marketing</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-12">
              Logging into 5 different platforms. Forgetting passwords. Posting inconsistently. 
              Losing track of what worked. Sound familiar?
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="bg-red-900/20 border-red-500/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-md bg-red-500/20 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Platform Chaos</h3>
                  <p className="text-sm text-white/60">
                    Facebook, Instagram, Google—each with different logins, interfaces, and learning curves
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-900/20 border-red-500/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-md bg-red-500/20 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Time Drain</h3>
                  <p className="text-sm text-white/60">
                    Hours spent creating content, only to forget to post it or lose track of the files
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-red-900/20 border-red-500/20">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-md bg-red-500/20 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">No Visibility</h3>
                  <p className="text-sm text-white/60">
                    Spending money on ads with no clear picture of what's actually driving leads
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Solution - Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Everything in One Place</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The Marketing Hub brings all your marketing activities together. No more scattered logins, 
              lost content, or mystery spending.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: "Content Calendar", desc: "Plan and schedule posts across platforms", bgClass: "bg-purple-500/20", textClass: "text-purple-400" },
              { icon: FileText, title: "Post Catalog", desc: "Save and organize all your content in one library", bgClass: "bg-blue-500/20", textClass: "text-blue-400" },
              { icon: Megaphone, title: "Copy Generator", desc: "Create social posts, ads, and SMS with smart assistance", bgClass: "bg-amber-500/20", textClass: "text-amber-400" },
              { icon: BarChart3, title: "Campaign ROI Tracker", desc: "Track spend and see what's actually working", bgClass: "bg-emerald-500/20", textClass: "text-emerald-400" },
              { icon: Target, title: "Analytics Dashboard", desc: "Website traffic, visitors, and performance metrics", bgClass: "bg-pink-500/20", textClass: "text-pink-400" },
              { icon: Lightbulb, title: "Marketing Playbook", desc: "Proven psychology tactics that drive action", bgClass: "bg-orange-500/20", textClass: "text-orange-400" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-md ${feature.bgClass} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.textClass}`} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Roadmap */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Integration Roadmap</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We're building connections to the platforms you already use. Here's where we are now and where we're headed.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="bg-emerald-900/20 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Connected Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-emerald-500/20 text-emerald-300">Active</Badge>
                  <span>Google Analytics - Website traffic tracking</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-emerald-500/20 text-emerald-300">Active</Badge>
                  <span>Google Local Services - Lead management</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-emerald-500/20 text-emerald-300">Active</Badge>
                  <span>Google Calendar - Booking sync</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-amber-900/20 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-amber-500/20 text-amber-300">Q1 2026</Badge>
                  <span>Meta Business Suite - Facebook/Instagram posting</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-amber-500/20 text-amber-300">Q1 2026</Badge>
                  <span>Google Ads - Campaign spend sync</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-amber-500/20 text-amber-300">Q2 2026</Badge>
                  <span>Automated posting across platforms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crew Capacity Reality */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-md p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-md bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Leads Are Only Part of the Equation</h2>
                <div className="space-y-4 text-white/80">
                  <p>
                    More leads are great—but only if you have the <strong className="text-blue-400">crew capacity</strong> to handle them. 
                    There's no point flooding your phone with calls if jobs can't be scheduled for 3 months.
                  </p>
                  <p>
                    The Marketing Hub is designed to <strong className="text-white">scale with your business</strong>. 
                    Start building your content library now. When you're ready to ramp up, the system is ready too.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers Preview */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Flexible Packaging</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The Marketing Hub can be included as part of your franchise package or offered as a standalone add-on 
              for businesses that want professional marketing tools.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="text-center pb-2">
                <Badge className="w-fit mx-auto mb-2 bg-slate-500/20 text-slate-300">Standard</Badge>
                <CardTitle className="text-white">Franchise Basic</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/60 text-sm mb-4">Website, booking, CRM, crew management</p>
                <div className="space-y-2 text-sm text-white/70">
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Professional website</p>
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Online booking</p>
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Lead management</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-b from-purple-900/30 to-purple-900/10 border-purple-500/30 ring-2 ring-purple-500/20">
              <CardHeader className="text-center pb-2">
                <Badge className="w-fit mx-auto mb-2 bg-purple-500/20 text-purple-300">Recommended</Badge>
                <CardTitle className="text-white">Franchise Pro</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/60 text-sm mb-4">Everything in Basic + Marketing Hub</p>
                <div className="space-y-2 text-sm text-white/70">
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> All Basic features</p>
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Marketing Hub Pro</p>
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Analytics & ROI tracking</p>
                  <p className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400" /> Content generation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore?</h2>
            <p className="text-white/70 mb-8">
              The Marketing Hub is built and ready. Take a look around, learn the system, 
              and start building your content library at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-purple-700"
                onClick={() => setLocation("/marketing-hub")}
                data-testid="button-open-marketing-hub"
              >
                Open Marketing Hub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/50 text-sm">
            Powered by{" "}
            <a 
              href="https://darkwavestudios.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-white/70 transition-colors"
              data-testid="link-darkwave-studios"
            >
              Dark Wave Studios
            </a>
          </p>
          <p className="text-white/30 text-xs mt-2">&copy; 2026 All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
