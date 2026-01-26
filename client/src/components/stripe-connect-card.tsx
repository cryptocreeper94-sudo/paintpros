import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, AlertCircle, ExternalLink, Link2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/context/TenantContext";

export function StripeConnectCard() {
  const tenant = useTenant();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const stripeConfig = tenant.stripe;
  const usePlatformKeys = stripeConfig?.usePlatformKeys ?? false;
  const isConfigured = stripeConfig?.configured ?? false;
  
  const handleConnectStripe = async () => {
    setIsConnecting(true);
    
    window.open(
      "https://dashboard.stripe.com/apikeys",
      "_blank",
      "noopener,noreferrer"
    );
    
    setTimeout(() => setIsConnecting(false), 1000);
  };
  
  return (
    <GlassCard className="p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Payment Processing</h3>
          <p className="text-gray-400 text-sm">Stripe Integration</p>
        </div>
      </div>
      
      {usePlatformKeys ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Check className="w-3 h-3 mr-1" />
              Connected
            </Badge>
            <span className="text-gray-400 text-sm">Using platform account</span>
          </div>
          <p className="text-gray-500 text-sm">
            This tenant uses the platform's Stripe account for payment processing. 
            All transactions are processed through PaintPros.io.
          </p>
        </div>
      ) : isConfigured ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Check className="w-3 h-3 mr-1" />
              Connected
            </Badge>
            <span className="text-gray-400 text-sm">Own Stripe account</span>
          </div>
          <p className="text-gray-500 text-sm">
            Your Stripe account is connected. Payments go directly to your account.
          </p>
          <Button
            data-testid="button-manage-stripe"
            variant="outline"
            size="sm"
            className="w-full border-gray-700"
            onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Stripe Dashboard
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Connected
            </Badge>
          </div>
          <p className="text-gray-500 text-sm">
            Connect your Stripe account to accept payments directly. 
            You'll receive payments straight to your bank account.
          </p>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              data-testid="button-connect-stripe"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              onClick={handleConnectStripe}
              disabled={isConnecting}
            >
              <Link2 className="w-4 h-4 mr-2" />
              {isConnecting ? "Opening Stripe..." : "Connect Your Stripe Account"}
            </Button>
          </motion.div>
          <p className="text-gray-600 text-xs text-center">
            You'll be redirected to Stripe to get your API keys
          </p>
        </div>
      )}
    </GlassCard>
  );
}
