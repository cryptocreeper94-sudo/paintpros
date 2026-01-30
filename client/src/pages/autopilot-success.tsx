import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Facebook,
  Instagram,
  ArrowRight,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Link, useSearch } from "wouter";

export default function AutopilotSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tenantId = params.get('tenant');
  const [connecting, setConnecting] = useState(false);

  const handleConnectMeta = () => {
    setConnecting(true);
    // In production, this would redirect to Meta OAuth
    // For now, show instructions
    setTimeout(() => setConnecting(false), 1000);
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
        className="relative z-10 w-full max-w-md"
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
              Your subscription is now active. Just one more step to get your automated posting started.
            </p>

            {/* Connect Meta Section */}
            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Connect Your Social Accounts
              </h2>
              
              <p className="text-sm text-slate-400 mb-6">
                Click below to connect your Facebook Page and Instagram. This takes about 30 seconds.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleConnectMeta}
                  disabled={connecting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  data-testid="button-connect-facebook"
                >
                  {connecting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Facebook className="w-5 h-5 mr-2" />
                      Connect Facebook & Instagram
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 mt-4 text-slate-500 text-sm">
                <div className="flex items-center gap-1">
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </div>
                <span>+</span>
                <div className="flex items-center gap-1">
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="text-left space-y-3 mb-6">
              <h3 className="text-sm font-medium text-slate-300">What happens next:</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-400">1</span>
                  </div>
                  <span>Connect your Facebook Page & Instagram above</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-400">2</span>
                  </div>
                  <span>We'll configure your posting schedule (24-48 hours)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-400">3</span>
                  </div>
                  <span>Automated posts start flowing to your accounts</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <p className="text-xs text-slate-500">
              Questions? We'll reach out via email within 24 hours to make sure everything is set up correctly.
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
