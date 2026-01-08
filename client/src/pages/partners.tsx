import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Shield, Users, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAccess } from "@/context/AccessContext";
import { useTenant } from "@/context/TenantContext";

// Partners page is for Sidonie (ops_manager) and Developer only - NOT owner
const ROLE_ROUTES: Record<string, string> = {
  ops_manager: "/admin",
  developer: "/developer",
};

const VALID_PARTNER_ROLES = ["ops_manager", "developer"];

const ROLE_LABELS: Record<string, { title: string; description: string }> = {
  ops_manager: { title: "Partner Dashboard", description: "CRM, imports, royalties & more" },
  developer: { title: "Developer Dashboard", description: "System tools & configuration" },
};

export default function Partners() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [, setLocation] = useLocation();
  const { login, currentUser } = useAccess();
  const tenant = useTenant();

  useEffect(() => {
    if (currentUser.isAuthenticated && currentUser.role) {
      const route = ROLE_ROUTES[currentUser.role];
      if (route) {
        setLocation(route);
      }
    }
  }, [currentUser, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/auth/pin/verify-any", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-tenant-id": tenant?.id || "demo",
        },
        body: JSON.stringify({ pin }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success && data.role) {
        // Only allow partner roles (ops_manager, developer) - not owner
        if (!VALID_PARTNER_ROLES.includes(data.role)) {
          setError("This PIN is not authorized for partner access.");
          setPin("");
          return;
        }
        login(data.role);
        const route = ROLE_ROUTES[data.role] || "/admin";
        setLocation(route);
      } else {
        setError("Invalid PIN. Please try again.");
        setPin("");
      }
    } catch (err) {
      setError("Unable to verify PIN. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center shadow-lg border border-accent/20"
            whileHover={{ scale: 1.05, rotateZ: 5 }}
          >
            <Users className="w-8 h-8 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Partner Access</h1>
          <p className="text-muted-foreground">Enter your PIN to access your dashboard</p>
        </div>

        <GlassCard className="p-6" glow="gold">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Partner PIN</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter your PIN"
                  className="pl-10 text-center text-lg tracking-widest"
                  autoFocus
                  data-testid="input-partner-pin"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={pin.length < 4 || isVerifying}
              data-testid="button-partner-login"
            >
              {isVerifying ? (
                "Verifying..."
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure partner access for authorized team members only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
