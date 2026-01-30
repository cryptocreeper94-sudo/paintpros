import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  Zap,
  Facebook,
  Instagram,
  CreditCard,
  Loader2,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  BarChart3,
  Shield,
  Settings,
  ImageIcon,
  MessageSquare,
  Calendar,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function MarketingAutopilot() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: ""
  });

  const handleSubscribe = async () => {
    if (!formData.businessName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/marketing-autopilot/subscribe", formData);
      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const howItWorks = [
    {
      step: 1,
      icon: Facebook,
      title: "Connect Your Accounts",
      description: "One-click connection to your Facebook Page & Instagram. We use secure OAuth - we never see your password."
    },
    {
      step: 2,
      icon: Settings,
      title: "Set Your Preferences",
      description: "Tell us how many posts per day, your daily ad budget, and upload your images & messaging."
    },
    {
      step: 3,
      icon: Zap,
      title: "Activate & Relax",
      description: "We handle everything from here. Consistent, professional posting runs automatically 24/7."
    }
  ];

  const features = [
    { icon: Calendar, title: "Automated Posting", desc: "2-4 posts daily, every day" },
    { icon: Target, title: "Paid Ad Campaigns", desc: "Boost posts within your budget" },
    { icon: ImageIcon, title: "Your Content", desc: "Use your own images & messaging" },
    { icon: BarChart3, title: "Performance Dashboard", desc: "See what's working" },
    { icon: Clock, title: "Optimal Timing", desc: "Posts go live at peak times" },
    { icon: Shield, title: "Always Running", desc: "No gaps in your presence" }
  ];

  const included = [
    "Auto-posting to Facebook & Instagram",
    "Up to 4 posts per day, 7 days a week",
    "Paid ad campaign management",
    "Performance analytics dashboard",
    "Content scheduling & optimization",
    "Easy dashboard to adjust anytime",
    "We handle all technical setup",
    "Cancel anytime - no contracts"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Automated Social Media Marketing
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Set It. Forget It.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                We Handle Your Social Media.
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Connect your business accounts, set your preferences, and let our automated system 
              post consistently to Facebook & Instagram - organic posts and paid ads included.
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Facebook className="w-6 h-6 text-blue-500" />
                <span className="text-slate-300">Facebook</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Instagram className="w-6 h-6 text-pink-500" />
                <span className="text-slate-300">Instagram</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="button-get-started"
              >
                Get Started - $59/month
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-slate-400 text-sm">+ your ad spend budget</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-16 px-6 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <Badge variant="outline" className="mb-3">Step {item.step}</Badge>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Control */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            You Set The Rules, We Execute
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Your easy-to-use dashboard lets you control everything. Adjust anytime.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Calendar className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-1">Post Frequency</h4>
                <p className="text-slate-400 text-sm">2-4 posts per day</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-1">Daily Budget</h4>
                <p className="text-slate-400 text-sm">$10 - $100+ per day</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <ImageIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-1">Your Images</h4>
                <p className="text-slate-400 text-sm">Upload your brand assets</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-1">Your Messaging</h4>
                <p className="text-slate-400 text-sm">Your voice, your brand</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-16 px-6 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything Included
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-lg mx-auto">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-blue-500/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Simple Pricing
                </Badge>
                
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">$59</span>
                  <span className="text-slate-400">/month</span>
                </div>
                
                <p className="text-slate-400">
                  + your daily ad budget (you choose the amount)
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {included.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                data-testid="button-subscribe"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Marketing Autopilot
              </Button>
              
              <p className="text-center text-slate-500 text-sm mt-4">
                Cancel anytime. No long-term contracts.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Signup Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Get Started</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="text-slate-400"
                  >
                    Close
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Business Name</Label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Your Business Name"
                      className="bg-slate-900 border-slate-700"
                      data-testid="input-business-name"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Your Name</Label>
                    <Input
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Full Name"
                      className="bg-slate-900 border-slate-700"
                      data-testid="input-owner-name"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@business.com"
                      className="bg-slate-900 border-slate-700"
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-300">Phone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 555-5555"
                      className="bg-slate-900 border-slate-700"
                      data-testid="input-phone"
                    />
                  </div>

                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    data-testid="button-checkout"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Continue to Payment
                      </>
                    )}
                  </Button>

                  <p className="text-center text-slate-500 text-xs">
                    You'll be redirected to our secure payment page
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
