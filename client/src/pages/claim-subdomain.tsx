import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { cardVariants, fadeInUp } from "@/lib/theme-effects";
import {
  Globe,
  Check,
  X,
  Loader2,
  ArrowRight,
  Shield,
  Zap,
  Building2,
  ExternalLink,
  Sparkles,
  AlertCircle,
  CheckCircle,
  LogIn
} from "lucide-react";
import { Link } from "wouter";

export default function ClaimSubdomain() {
  const [subdomain, setSubdomain] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [checkResult, setCheckResult] = useState<{
    available: boolean;
    reason?: string;
    fullDomain?: string;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimedDomain, setClaimedDomain] = useState("");

  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  const { data: existingDomain } = useQuery({
    queryKey: ['/api/domains/me'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!authUser
  });

  const checkAvailability = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`/api/domains/check/${name}`);
      return res.json();
    },
    onSuccess: (data) => {
      setCheckResult(data);
    }
  });

  const claimDomain = useMutation({
    mutationFn: async (data: { subdomain: string; businessName: string }) => {
      const res = await apiRequest('POST', '/api/domains/claim', {
        subdomain: data.subdomain,
        businessName: data.businessName,
        targetType: 'profile'
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      setClaimed(true);
      setClaimedDomain(data.fullDomain);
    }
  });

  useEffect(() => {
    if (subdomain.length >= 3) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        checkAvailability.mutate(subdomain);
        setIsTyping(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setCheckResult(null);
    }
  }, [subdomain]);

  const handleClaim = () => {
    if (checkResult?.available && subdomain.length >= 3) {
      claimDomain.mutate({ subdomain, businessName });
    }
  };

  const handleLogin = () => {
    window.location.href = '/__repl_auth/login';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const existingDomainData = existingDomain as { hasDomain?: boolean; fullDomain?: string; domain?: any } | null;
  if (existingDomainData?.hasDomain) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <GlassCard className="p-8 text-center" glow="blue">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto flex items-center justify-center mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Your Domain</h1>
            <p className="text-slate-400 mb-6">You already have a TrustLayer subdomain</p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-400 mb-1">Your URL</p>
              <p className="text-xl font-bold text-blue-400">{existingDomainData.fullDomain}</p>
            </div>
            
            <div className="space-y-3">
              <Link href="/trustlayer">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  Go to TrustLayer Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => window.open(`https://${existingDomainData.fullDomain}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Your Domain
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (claimed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <GlassCard className="p-8 text-center" glow="green">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mx-auto flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Domain Claimed!</h1>
            <p className="text-slate-400 mb-6">Your TrustLayer subdomain is now active</p>
            
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-400 mb-1">Your URL</p>
              <p className="text-xl font-bold text-emerald-400">{claimedDomain}</p>
            </div>
            
            <div className="space-y-3">
              <Link href="/trustlayer">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600">
                  <Building2 className="w-4 h-4 mr-2" />
                  Go to TrustLayer Dashboard
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => window.open(`https://${claimedDomain}`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Your Domain
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <Link href="/trustlayer">
          <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to TrustLayer
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 text-blue-300">
            <Globe className="w-3 h-3 mr-1" />
            TrustLayer ID
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Claim Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              .tlid.io
            </span>{" "}
            Domain
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get your personalized TrustLayer subdomain. Build trust with a verified business identity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-8" glow="blue">
            <div className="space-y-6">
              <div>
                <Label className="text-white text-lg mb-3 block">Choose Your Subdomain</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="yourname"
                      className="h-14 text-xl bg-slate-800/50 border-slate-700 text-white pr-32"
                      data-testid="input-subdomain"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                      .tlid.io
                    </span>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-slate-400 mt-3"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Checking availability...</span>
                    </motion.div>
                  )}
                  
                  {!isTyping && checkResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-2 mt-3 ${
                        checkResult.available ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {checkResult.available ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{checkResult.fullDomain} is available!</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          <span>{checkResult.reason || 'This subdomain is taken'}</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label className="text-white text-lg mb-3 block">Business Name (Optional)</Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Business LLC"
                  className="h-12 bg-slate-800/50 border-slate-700 text-white"
                  data-testid="input-business-name"
                />
                <p className="text-sm text-slate-500 mt-2">
                  This will appear on your TrustLayer profile page
                </p>
              </div>

              {!authUser ? (
                <Button
                  onClick={handleLogin}
                  className="w-full h-14 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  data-testid="button-login"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In to Claim Your Domain
                </Button>
              ) : (
                <Button
                  onClick={handleClaim}
                  disabled={!checkResult?.available || claimDomain.isPending}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  data-testid="button-claim-domain"
                >
                  {claimDomain.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                    Claim Your Domain
                  </>
                )}
              </Button>
              )}

              {claimDomain.isError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-red-400 justify-center"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Failed to claim domain. Please try again.</span>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: Globe, title: "Your URL", desc: "Get yourname.tlid.io" },
            { icon: Shield, title: "Verified", desc: "Trusted business identity" },
            { icon: Zap, title: "Instant", desc: "Active immediately" }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
