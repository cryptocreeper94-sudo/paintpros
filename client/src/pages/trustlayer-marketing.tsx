import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  DollarSign,
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
  Settings,
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
    { icon: Calendar, title: "Automated Posting", desc: "Posts go out daily on Facebook & Instagram" },
    { icon: Target, title: "Smart Ad Boosting", desc: "Top posts automatically boosted" },
    { icon: BarChart3, title: "Full Analytics", desc: "Real-time reach, engagement, leads" },
    { icon: Calculator, title: "Budget Control", desc: "Set your budget, we handle distribution" },
    { icon: ImageIcon, title: "Content Library", desc: "Upload images & messages we rotate" },
    { icon: Shield, title: "Guardian Shield Ready", desc: "Integrated trust verification" }
  ];

  const steps = [
    { num: 1, title: "Connect Accounts", desc: "Link Facebook & Instagram" },
    { num: 2, title: "Set Preferences", desc: "Posts, budget, content" },
    { num: 3, title: "Upload Content", desc: "Your images & messages" },
    { num: 4, title: "Activate", desc: "We handle the rest" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.location.href = '/trustlayer'}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">TrustLayer</p>
                <p className="text-slate-500 text-xs">Marketing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/trustlayer/guardian'}>
                <Shield className="w-4 h-4 mr-2" />
                Guardian Shield
              </Button>
              <Button size="sm" onClick={() => setShowForm(true)} data-testid="button-header-signup">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm">Guardian Shield Integrated</span>
          </div>

          <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Set It and Forget It Marketing
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Social Media on{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Autopilot
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Stop spending hours managing Facebook and Instagram. 
            TrustLayer Marketing posts for you, boosts your best content, and tracks everything.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Facebook className="w-6 h-6 text-blue-500" />
              <span>Facebook</span>
            </div>
            <span className="text-slate-600">+</span>
            <div className="flex items-center gap-2 text-slate-400">
              <Instagram className="w-6 h-6 text-pink-500" />
              <span>Instagram</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-6"
              onClick={() => setShowForm(true)}
              data-testid="button-get-started"
            >
              Get Started - $59/month
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/autopilot/dashboard?id=demo'}
              data-testid="button-demo"
            >
              <Play className="w-5 h-5 mr-2" />
              See Demo Dashboard
            </Button>
          </div>

          <p className="text-slate-500 text-sm mt-4">+ Your own ad spend budget</p>
        </div>
      </div>

      {/* Signup Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
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
                      className="bg-slate-900 border-slate-700"
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
                      className="bg-slate-900 border-slate-700"
                      data-testid="input-email"
                    />
                  </div>
                  <Button
                    onClick={handleSignup}
                    disabled={signupMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    data-testid="button-submit"
                  >
                    {signupMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Start Free Trial<ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-slate-500 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Secured by Guardian Shield</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="border-y border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><p className="text-3xl font-bold text-white">10+</p><p className="text-slate-400">Hours Saved/Week</p></div>
            <div><p className="text-3xl font-bold text-white">2x</p><p className="text-slate-400">Lead Increase</p></div>
            <div><p className="text-3xl font-bold text-white">24/7</p><p className="text-slate-400">Always Posting</p></div>
            <div><p className="text-3xl font-bold text-white">$59</p><p className="text-slate-400">Per Month</p></div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-slate-400">We handle the technical stuff so you can focus on your business</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-800/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Get Started in 4 Steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Your Command Center</h2>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="bg-slate-900 p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-slate-500 text-sm ml-4">TrustLayer Marketing Dashboard</span>
            </div>
          </div>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900 rounded-lg p-4">
                <Eye className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-2xl font-bold text-white">12,450</p>
                <p className="text-slate-400 text-sm">Total Reach</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <Heart className="w-5 h-5 text-pink-400 mb-2" />
                <p className="text-2xl font-bold text-white">847</p>
                <p className="text-slate-400 text-sm">Engagement</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <MousePointer className="w-5 h-5 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">234</p>
                <p className="text-slate-400 text-sm">Clicks</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <Users className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-slate-400 text-sm">New Leads</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button onClick={() => window.location.href = '/autopilot/dashboard?id=demo'}>
                Explore Full Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-lg mx-auto">
          <Card className="bg-gradient-to-b from-slate-800 to-slate-800/50 border-blue-500/30 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-8">
              <div className="text-center mb-6">
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
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => setShowForm(true)}
                data-testid="button-pricing-cta"
              >
                Start 14-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Layers className="w-5 h-5" />
            <span>TrustLayer Marketing</span>
          </div>
          <p>Part of the TrustLayer ecosystem | TLId.io</p>
        </div>
      </div>
    </div>
  );
}
