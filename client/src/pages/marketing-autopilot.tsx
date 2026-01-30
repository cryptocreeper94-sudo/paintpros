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
  ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function MarketingAutopilot() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const included = [
    "Auto-posting to Facebook & Instagram",
    "3-4 posts per day, 7 days a week",
    "Ad campaign management included",
    "Performance analytics dashboard",
    "We handle all technical setup",
    "Cancel anytime"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700 overflow-hidden">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Automated Marketing
              </Badge>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Marketing Autopilot
              </h1>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Facebook className="w-5 h-5 text-blue-500" />
                <span className="text-slate-400">+</span>
                <Instagram className="w-5 h-5 text-pink-500" />
              </div>
              
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-white">$59</span>
                <span className="text-slate-400">/month</span>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-2 mb-8">
              {included.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Simple Form */}
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 text-sm">Business Name</Label>
                <Input
                  placeholder="Your Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  data-testid="input-business-name"
                />
              </div>
              
              <div>
                <Label className="text-slate-300 text-sm">Your Name</Label>
                <Input
                  placeholder="Full Name"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  data-testid="input-owner-name"
                />
              </div>
              
              <div>
                <Label className="text-slate-300 text-sm">Email</Label>
                <Input
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <Label className="text-slate-300 text-sm">Phone</Label>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-900/50 border-slate-600 text-white mt-1"
                  data-testid="input-phone"
                />
              </div>
              
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 mt-2"
                data-testid="button-subscribe"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Subscribe Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* How it works - super simple */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-center text-sm text-slate-400 mb-4">How it works:</p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="bg-slate-700 px-2 py-1 rounded">1. Subscribe</span>
                <ArrowRight className="w-3 h-3" />
                <span className="bg-slate-700 px-2 py-1 rounded">2. Connect FB/IG</span>
                <ArrowRight className="w-3 h-3" />
                <span className="bg-slate-700 px-2 py-1 rounded">3. Done!</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
              After payment, you'll connect your Facebook & Instagram with one click.
              <br />We handle everything else.
            </p>
          </CardContent>
        </Card>
        
        <p className="text-center text-slate-600 text-xs mt-4">
          Powered by Orbit Ecosystem
        </p>
      </motion.div>
    </div>
  );
}
