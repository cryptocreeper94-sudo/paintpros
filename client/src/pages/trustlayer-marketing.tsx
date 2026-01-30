import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { cardVariants, staggerContainer, fadeInUp } from "@/lib/theme-effects";
import {
  Zap,
  Facebook,
  Instagram,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Loader2,
  Star,
  Target,
  MousePointer,
  Eye,
  Heart,
  Sparkles,
  Calculator,
  ImageIcon,
  Layers,
  Lock
} from "lucide-react";

export default function TrustLayerMarketing() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: 'TrustLayer Marketing',
        page_path: '/trustlayer/marketing'
      });
    }
  }, []);

  const signupMutation = useMutation({
    mutationFn: async (data: { email: string; businessName: string }) => {
      return apiRequest("POST", "/api/marketing-autopilot/subscribe", data);
    },
    onSuccess: () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          event_category: 'signup',
          event_label: 'trustlayer_marketing'
        });
      }
      toast({ title: "Welcome aboard! Check your email for next steps." });
      window.location.href = '/autopilot/setup';
    },
    onError: () => {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    }
  });

  const handleSignup = () => {
    if (!email || !businessName) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    signupMutation.mutate({ email, businessName });
  };

  const features = [
    { icon: Calendar, title: "Automated Posting", desc: "Posts go out daily on Facebook & Instagram - no manual work required" },
    { icon: Target, title: "Smart Ad Boosting", desc: "Top-performing posts automatically boosted for maximum reach" },
    { icon: BarChart3, title: "Full Analytics", desc: "Real-time reach, engagement, clicks, and leads tracking" },
    { icon: Calculator, title: "Budget Control", desc: "Set your budget, we handle optimal distribution" },
    { icon: ImageIcon, title: "Content Library", desc: "Upload your images & messages - we rotate them automatically" },
    { icon: Shield, title: "Guardian Shield Ready", desc: "Integrated trust verification for credibility" }
  ];

  const steps = [
    { num: 1, title: "Connect Accounts", desc: "Link your Facebook Page & Instagram" },
    { num: 2, title: "Set Preferences", desc: "Posts per day, budget, content mix" },
    { num: 3, title: "Upload Content", desc: "Add your images & marketing messages" },
    { num: 4, title: "Activate", desc: "We handle everything from here" }
  ];

  const testimonials = [
    { name: "Sarah M.", business: "Home Services", quote: "I used to spend 10 hours a week on social media. Now it's 10 minutes.", stars: 5 },
    { name: "Mike T.", business: "Contractor", quote: "My leads doubled in the first month. Incredible.", stars: 5 },
    { name: "Jennifer L.", business: "Landscaping", quote: "Set it and forget it is exactly right.", stars: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative border-b border-white/5 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.location.href = '/trustlayer'}
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-xl font-bold text-white">TrustLayer</p>
                <p className="text-slate-500 text-xs">Marketing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/trustlayer/guardian'} className="text-slate-400 hover:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Guardian Shield
              </Button>
              <Button size="sm" onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25" data-testid="button-header-signup">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-5 py-2 mb-6 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Guardian Shield Integrated</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Set It and Forget It Marketing
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Social Media on{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Autopilot
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Stop spending hours managing Facebook and Instagram. 
            TrustLayer Marketing posts for you, boosts your best content, and tracks everything.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Facebook className="w-6 h-6 text-blue-500" />
              <span>Facebook</span>
            </div>
            <span className="text-slate-600">+</span>
            <div className="flex items-center gap-2 text-slate-400">
              <Instagram className="w-6 h-6 text-pink-500" />
              <span>Instagram</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6 shadow-xl shadow-blue-500/25"
              onClick={() => setShowForm(true)}
              data-testid="button-get-started"
            >
              Get Started - $59/month
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white/10 bg-white/5 backdrop-blur-sm"
              onClick={() => window.location.href = '/autopilot/dashboard?id=demo'}
              data-testid="button-demo"
            >
              <Play className="w-5 h-5 mr-2" />
              See Demo Dashboard
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-500 text-sm mt-4"
          >
            + Your own ad spend budget (you control how much)
          </motion.p>
        </div>
      </div>

      {/* Signup Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard hoverEffect={false} glow="blue" depth="deep" className="max-w-md w-full">
              <div className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30"
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Start Your Free Trial</h2>
                  <p className="text-slate-400">14 days free, then $59/month</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Business Name</Label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Your business name"
                      className="bg-slate-900/50 border-white/10 focus:border-blue-500/50"
                      data-testid="input-business-name"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbusiness.com"
                      className="bg-slate-900/50 border-white/10 focus:border-blue-500/50"
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    onClick={handleSignup}
                    disabled={signupMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
                    data-testid="button-submit"
                  >
                    {signupMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Start Free Trial<ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Secured by Guardian Shield</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "10+", label: "Hours Saved/Week" },
              { value: "2x", label: "Lead Increase" },
              { value: "24/7", label: "Always Posting" },
              { value: "$59", label: "Per Month" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} custom={i}>
                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Complete Solution
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-slate-400 max-w-xl mx-auto">We handle the technical stuff so you can focus on your business</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={cardVariants} custom={i}>
              <GlassCard hoverEffect="subtle" glow="blue" depth="medium" className="h-full">
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="relative py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Get Started in 4 Simple Steps</h2>
            <p className="text-slate-400">Up and running in under 30 minutes</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} custom={i} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-2xl shadow-blue-500/30"
                >
                  {step.num}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Your Command Center</h2>
          <p className="text-slate-400">Everything you need to monitor your marketing performance</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <GlassCard hoverEffect="subtle" depth="deep">
            <div className="bg-slate-900/80 p-4 border-b border-white/5 flex items-center gap-2 rounded-t-xl">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-500 text-sm ml-4">TrustLayer Marketing Dashboard</span>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {[
                  { icon: Eye, value: "12,450", label: "Total Reach", color: "text-blue-400" },
                  { icon: Heart, value: "847", label: "Engagement", color: "text-pink-400" },
                  { icon: MousePointer, value: "234", label: "Clicks", color: "text-green-400" },
                  { icon: Users, value: "12", label: "New Leads", color: "text-yellow-400" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-900/50 rounded-xl p-5 border border-white/5"
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color} mb-3`} />
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <Button onClick={() => window.location.href = '/autopilot/dashboard?id=demo'} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Explore Full Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="relative py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">What Business Owners Say</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={cardVariants} custom={i}>
                <GlassCard hoverEffect="subtle" depth="medium" className="h-full">
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array(t.stars).fill(0).map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-lg mb-4">"{t.quote}"</p>
                    <div>
                      <p className="text-white font-medium">{t.name}</p>
                      <p className="text-slate-500 text-sm">{t.business}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pricing */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-lg mx-auto">
          <GlassCard hoverEffect="glow" glow="blue" animatedBorder depth="deep">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <div className="p-10">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Most Popular</Badge>
                <p className="text-5xl font-bold text-white mb-2">
                  $59<span className="text-xl text-slate-400">/month</span>
                </p>
                <p className="text-slate-400">+ your ad spend budget</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Unlimited posts to Facebook & Instagram",
                  "Automated ad boosting",
                  "Full analytics dashboard",
                  "Budget calculator & tracking",
                  "Content library management",
                  "Guardian Shield verification badge",
                  "14-day free trial"
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl shadow-blue-500/25"
                onClick={() => setShowForm(true)}
                data-testid="button-pricing-cta"
              >
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-slate-500 text-sm text-center mt-4">No credit card required</p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">TrustLayer Marketing</span>
          </div>
          <p className="text-slate-500">Part of the TrustLayer ecosystem | TLId.io</p>
        </div>
      </footer>
    </div>
  );
}
