import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Key,
  DollarSign,
  Play,
  Pause,
  Check,
  Facebook,
  Instagram,
  Clock,
  TrendingUp,
  Target,
  Loader2,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  Settings2,
  Link2,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useLocation } from "wouter";

interface AutopilotConfig {
  // Meta Connection
  facebookConnected: boolean;
  instagramConnected: boolean;
  facebookPageName: string;
  instagramUsername: string;
  
  // Daily Budget
  dailyBudget: number;
  
  // Posting Preferences
  postsPerDay: number;
  includeAds: boolean;
  adSpendPercent: number; // What % of daily budget goes to ads
  
  // Content Mix
  contentMix: {
    promotional: number;
    educational: number;
    behindScenes: number;
  };
  
  // Status
  isActive: boolean;
}

export default function AutopilotPortal() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isActivating, setIsActivating] = useState(false);
  
  const [config, setConfig] = useState<AutopilotConfig>({
    facebookConnected: false,
    instagramConnected: false,
    facebookPageName: "",
    instagramUsername: "",
    dailyBudget: 20,
    postsPerDay: 3,
    includeAds: true,
    adSpendPercent: 50,
    contentMix: { promotional: 30, educational: 40, behindScenes: 30 },
    isActive: false
  });

  // Meta connection credentials
  const [metaCredentials, setMetaCredentials] = useState({
    facebookPageId: "",
    facebookPageName: "",
    facebookAccessToken: "",
    instagramAccountId: "",
    instagramUsername: ""
  });

  const subscriberId = new URLSearchParams(window.location.search).get('id');

  // Fetch subscriber data
  const { data: subscriber, isLoading } = useQuery({
    queryKey: ["/api/marketing-autopilot/subscriber", subscriberId],
    enabled: !!subscriberId
  });

  // Connect Meta mutation
  const connectMetaMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/connect-meta`, metaCredentials);
    },
    onSuccess: () => {
      setConfig(prev => ({
        ...prev,
        facebookConnected: true,
        instagramConnected: !!metaCredentials.instagramAccountId,
        facebookPageName: metaCredentials.facebookPageName,
        instagramUsername: metaCredentials.instagramUsername
      }));
      setCurrentStep(2);
      toast({ title: "Accounts connected successfully!" });
    },
    onError: () => {
      toast({ title: "Connection failed. Please check your credentials.", variant: "destructive" });
    }
  });

  // Activate autopilot mutation
  const activateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/start`, {
        config,
        dailyBudget: config.dailyBudget,
        postsPerDay: config.postsPerDay,
        includeAds: config.includeAds,
        adSpendPercent: config.adSpendPercent,
        contentMix: config.contentMix
      });
    },
    onSuccess: () => {
      setConfig(prev => ({ ...prev, isActive: true }));
      toast({ title: "Your Marketing Autopilot is now active!" });
    }
  });

  const monthlyAdSpend = config.dailyBudget * 30;
  const monthlySubscription = 59;
  const totalMonthly = monthlyAdSpend + monthlySubscription;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Marketing Autopilot</h1>
              <p className="text-slate-400 text-sm">Automated social media marketing for your business</p>
            </div>
            {config.isActive && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-10">
          {[
            { step: 1, label: "Connect Accounts", icon: Key },
            { step: 2, label: "Set Budget", icon: DollarSign },
            { step: 3, label: "Activate", icon: Play }
          ].map((item, i) => (
            <div key={item.step} className="flex items-center flex-1">
              <div className={`flex items-center gap-3 ${
                currentStep >= item.step ? "text-blue-400" : "text-slate-500"
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep > item.step
                    ? "bg-green-500/20 border-2 border-green-500"
                    : currentStep === item.step
                    ? "bg-blue-500/20 border-2 border-blue-500"
                    : "bg-slate-800 border-2 border-slate-700"
                }`}>
                  {currentStep > item.step ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <item.icon className="w-6 h-6" />
                  )}
                </div>
                <span className="font-medium hidden md:block">{item.label}</span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > item.step ? "bg-green-500" : "bg-slate-700"
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Connect Accounts */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-400" />
                    </div>
                    Connect Your Social Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                      <div>
                        <p className="text-white font-medium">Your credentials are encrypted & secure</p>
                        <p className="text-slate-400 text-sm">We only use these to post on your behalf. You can revoke access anytime.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Facebook className="w-6 h-6 text-blue-500" />
                        <span className="text-white font-medium">Facebook Page</span>
                        <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-0">Required</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-slate-400 text-sm">Page Name</Label>
                          <Input
                            placeholder="Your Business Name"
                            value={metaCredentials.facebookPageName}
                            onChange={(e) => setMetaCredentials({ ...metaCredentials, facebookPageName: e.target.value })}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                            data-testid="input-fb-page-name"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 text-sm">Page ID</Label>
                          <Input
                            placeholder="e.g., 1234567890123456"
                            value={metaCredentials.facebookPageId}
                            onChange={(e) => setMetaCredentials({ ...metaCredentials, facebookPageId: e.target.value })}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                            data-testid="input-fb-page-id"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 text-sm">Page Access Token</Label>
                          <Input
                            type="password"
                            placeholder="Your page access token"
                            value={metaCredentials.facebookAccessToken}
                            onChange={(e) => setMetaCredentials({ ...metaCredentials, facebookAccessToken: e.target.value })}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                            data-testid="input-fb-token"
                          />
                          <p className="text-xs text-slate-500 mt-1">Get this from Meta Business Suite or Graph API Explorer</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Instagram className="w-6 h-6 text-pink-500" />
                        <span className="text-white font-medium">Instagram Business</span>
                        <Badge className="ml-auto bg-slate-700 text-slate-300 border-0">Optional</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-slate-400 text-sm">Instagram Username</Label>
                          <Input
                            placeholder="@yourbusiness"
                            value={metaCredentials.instagramUsername}
                            onChange={(e) => setMetaCredentials({ ...metaCredentials, instagramUsername: e.target.value })}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                            data-testid="input-ig-username"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 text-sm">Instagram Business Account ID</Label>
                          <Input
                            placeholder="e.g., 17841400000000000"
                            value={metaCredentials.instagramAccountId}
                            onChange={(e) => setMetaCredentials({ ...metaCredentials, instagramAccountId: e.target.value })}
                            className="bg-slate-800 border-slate-600 text-white mt-1"
                            data-testid="input-ig-id"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => connectMetaMutation.mutate()}
                    disabled={!metaCredentials.facebookPageId || !metaCredentials.facebookAccessToken || connectMetaMutation.isPending}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                    data-testid="button-connect-accounts"
                  >
                    {connectMetaMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Link2 className="w-5 h-5 mr-2" />
                        Connect Accounts
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Set Budget */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Connected Status */}
              <Card className="bg-green-500/10 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium">Accounts Connected</p>
                      <p className="text-slate-400 text-sm">
                        {config.facebookPageName && `Facebook: ${config.facebookPageName}`}
                        {config.instagramUsername && ` • Instagram: @${config.instagramUsername}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    Set Your Daily Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Daily Budget Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-slate-300">Daily Marketing Budget</Label>
                      <span className="text-3xl font-bold text-white">${config.dailyBudget}</span>
                    </div>
                    <Slider
                      value={[config.dailyBudget]}
                      onValueChange={([value]) => setConfig({ ...config, dailyBudget: value })}
                      min={5}
                      max={100}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>$5/day</span>
                      <span>$100/day</span>
                    </div>
                  </div>

                  {/* Budget Breakdown */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      Monthly Cost Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Autopilot Service</span>
                        <span className="text-white">${monthlySubscription}/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Ad Spend (${config.dailyBudget} x 30 days)</span>
                        <span className="text-white">${monthlyAdSpend}/mo</span>
                      </div>
                      <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                        <span className="text-white font-medium">Total Monthly Investment</span>
                        <span className="text-2xl font-bold text-green-400">${totalMonthly}/mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Posting Frequency */}
                  <div>
                    <Label className="text-slate-300 mb-3 block">Posting Frequency</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 2, label: "2x Daily", desc: "Light presence" },
                        { value: 3, label: "3x Daily", desc: "Recommended" },
                        { value: 4, label: "4x Daily", desc: "Maximum reach" }
                      ].map(option => (
                        <div
                          key={option.value}
                          className={`p-4 rounded-lg cursor-pointer transition-all text-center ${
                            config.postsPerDay === option.value
                              ? "bg-blue-500/20 border-2 border-blue-500"
                              : "bg-slate-900 border-2 border-slate-700 hover:border-slate-600"
                          }`}
                          onClick={() => setConfig({ ...config, postsPerDay: option.value })}
                        >
                          <p className="text-white font-medium">{option.label}</p>
                          <p className="text-slate-500 text-xs">{option.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Include Paid Ads */}
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white font-medium">Include Paid Ads</p>
                        <p className="text-slate-400 text-sm">Boost top posts for more reach</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.includeAds}
                      onCheckedChange={(checked) => setConfig({ ...config, includeAds: checked })}
                      data-testid="switch-include-ads"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      data-testid="button-next-activate"
                    >
                      Review & Activate
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Activate */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-green-400" />
                    </div>
                    Ready to Activate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-slate-400 text-sm mb-2">Connected Accounts</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-500" />
                          <span className="text-white">{config.facebookPageName || "Facebook Page"}</span>
                        </div>
                        {config.instagramUsername && (
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-500" />
                            <span className="text-white">@{config.instagramUsername}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-slate-400 text-sm mb-2">Posting Schedule</h4>
                      <p className="text-white text-xl font-bold">{config.postsPerDay} posts/day</p>
                      <p className="text-slate-400 text-sm">~{config.postsPerDay * 30} posts/month</p>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-slate-400 text-sm mb-2">Daily Budget</h4>
                      <p className="text-white text-xl font-bold">${config.dailyBudget}/day</p>
                      <p className="text-slate-400 text-sm">{config.includeAds ? "Organic + Paid Ads" : "Organic Only"}</p>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-slate-400 text-sm mb-2">Monthly Investment</h4>
                      <p className="text-green-400 text-xl font-bold">${totalMonthly}/month</p>
                      <p className="text-slate-400 text-sm">${monthlySubscription} service + ${monthlyAdSpend} ads</p>
                    </div>
                  </div>

                  {/* What Happens Next */}
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">What happens when you activate:</h4>
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>We start creating and scheduling content for your business</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Posts go live automatically at optimal times</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Top-performing posts get boosted (if ads enabled)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>You can view analytics and adjust settings anytime</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => activateMutation.mutate()}
                      disabled={activateMutation.isPending || config.isActive}
                      className="flex-1 h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg"
                      data-testid="button-activate"
                    >
                      {activateMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : config.isActive ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Autopilot Active
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Activate Autopilot
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Status Card */}
              {config.isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Card className="bg-green-500/10 border-green-500/30">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Your Marketing Autopilot is Live!</h3>
                      <p className="text-slate-400 mb-4">
                        We're now handling your social media. Your first posts will go live within 24 hours.
                      </p>
                      <p className="text-slate-500 text-sm">
                        Questions? Contact support@paintpros.io
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
