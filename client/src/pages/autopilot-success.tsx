import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Image,
  MessageSquare,
  Calendar
} from "lucide-react";
import { useSearch, useLocation } from "wouter";

export default function AutopilotSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const subscriberId = params.get('subscriber') || params.get('id');
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (subscriberId) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/autopilot/portal?id=${subscriberId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [subscriberId, navigate]);

  const goToPortal = () => {
    if (subscriberId) {
      navigate(`/autopilot/portal?id=${subscriberId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700 overflow-hidden">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
            </motion.div>

            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">
              Payment Successful
            </Badge>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to Marketing Autopilot!
            </h1>
            
            <p className="text-slate-400 mb-8">
              Your subscription is active. Let's set up your automated posting in just a few minutes.
            </p>

            {/* What You'll Do */}
            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Quick Setup (5 minutes)
              </h2>
              
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Image className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Choose Your Images</p>
                    <p className="text-slate-500 text-xs">Upload yours or pick from our library</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Write or Select Captions</p>
                    <p className="text-slate-500 text-xs">Use pre-written or create your own</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Set Your Schedule</p>
                    <p className="text-slate-500 text-xs">Choose how often to post</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={goToPortal}
              size="lg"
              className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg"
              data-testid="button-go-to-portal"
            >
              Set Up Your Autopilot
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {subscriberId && countdown > 0 && (
              <p className="text-slate-500 text-sm mt-4">
                Redirecting in {countdown} seconds...
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-slate-600 text-xs mt-4">
          Powered by TrustLayer Ecosystem
        </p>
      </motion.div>
    </div>
  );
}
