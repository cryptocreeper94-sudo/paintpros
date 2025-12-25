import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Check, Sparkles, Shield, Users, FileText, Zap, 
  ArrowLeft, Crown, Rocket, Building2, ChevronRight, MapPin, Award
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  setupFee: number;
  interval: string;
  target: string;
  features: string[];
  popular?: boolean;
  perLocationFee?: number;
  blockchainAddon?: { available: boolean; price: number };
  isPaintProsFranchise?: boolean;
}

interface TrialData {
  id: string;
  ownerName: string;
  companyName: string;
  companySlug: string;
  primaryColor: string;
  status: string;
}

export default function TrialUpgrade() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [franchiseCity, setFranchiseCity] = useState("");
  const [franchiseState, setFranchiseState] = useState("");
  const [franchiseTerritory, setFranchiseTerritory] = useState("");

  const { data: trial, isLoading: trialLoading } = useQuery<TrialData>({
    queryKey: ['/api/trial', slug],
    queryFn: async () => {
      const response = await fetch(`/api/trial/${slug}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Trial not found');
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: plans, isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ['/api/trial/plans'],
    queryFn: async () => {
      const response = await fetch('/api/trial/plans', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to load plans');
      return response.json();
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", `/api/trial/${trial?.id}/upgrade`, { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upgrade failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const franchiseUpgradeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/trial/${trial?.id}/upgrade`, { 
        planId: 'paintpros_franchise',
        franchiseData: {
          city: franchiseCity,
          state: franchiseState,
          territory: franchiseTerritory,
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      setShowFranchiseModal(false);
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Franchise enrollment failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const getIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return Rocket;
      case 'professional': return Crown;
      case 'franchise': return Users;
      case 'enterprise': return Building2;
      case 'paintpros_franchise': return Award;
      default: return Sparkles;
    }
  };

  const regularPlans = plans?.filter(p => !p.isPaintProsFranchise) || [];
  const franchisePlan = plans?.find(p => p.isPaintProsFranchise);

  const isPopular = (plan: Plan) => plan.popular === true;
  
  const formatPrice = (plan: Plan) => {
    let priceDisplay = `$${plan.price}`;
    if (plan.perLocationFee) {
      priceDisplay += ` + $${plan.perLocationFee}/loc`;
    }
    return priceDisplay;
  };

  if (trialLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <GlassCard className="max-w-md p-6" hoverEffect="subtle" glow="accent">
          <p className="text-center mb-4">Trial not found</p>
          <Button onClick={() => setLocation('/start-trial')} className="w-full">
            Start a Trial
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation(`/trial/${slug}`)}
          className="mb-6"
          data-testid="button-back-to-portal"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Upgrade {trial.companyName}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Keep Everything You've Built
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your branding, settings, and all trial data carry over seamlessly. 
              Pick a plan and continue right where you left off.
            </p>
          </div>

          <div className="hidden md:block">
            <BentoGrid className="mb-8">
              {regularPlans.map((plan, index) => {
                const Icon = getIcon(plan.id);
                const popular = isPopular(plan);
                const colSpan = 3;
                
                return (
                  <BentoItem key={plan.id} colSpan={colSpan} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
                    <GlassCard 
                      hoverEffect="3d" 
                      glow={popular ? "green" : "none"}
                      depth={popular ? "deep" : "shallow"}
                      className={`p-6 h-full ${popular ? 'ring-2 ring-emerald-500' : ''}`}
                    >
                      {popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-emerald-500 text-white border-0 shadow-lg">Most Popular</Badge>
                        </div>
                      )}
                      <div className="text-center mb-4 pt-2">
                        <div className={`mx-auto p-3 rounded-full mb-3 w-fit ${popular ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                          <Icon className={`w-6 h-6 ${popular ? 'text-emerald-600' : 'text-slate-600'}`} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{plan.target}</p>
                        <div className="mt-3">
                          <span className="text-3xl font-bold">{formatPrice(plan)}</span>
                          <span className="text-slate-500">/{plan.interval}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1 font-medium">
                          + ${plan.setupFee.toLocaleString()} setup fee
                        </p>
                        {plan.blockchainAddon?.available && (
                          <p className="text-xs text-slate-400 mt-1">
                            Blockchain stamping: +${plan.blockchainAddon.price}/mo
                          </p>
                        )}
                      </div>
                      
                      <Accordion type="single" collapsible defaultValue="features" className="mb-4">
                        <AccordionItem value="features" className="border-0">
                          <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline py-2">
                            View Features
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="text-sm text-slate-600">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <Button 
                        className="w-full mt-auto"
                        variant={popular ? 'default' : 'outline'}
                        onClick={() => upgradeMutation.mutate(plan.id)}
                        disabled={upgradeMutation.isPending}
                        data-testid={`button-select-${plan.id}`}
                      >
                        {upgradeMutation.isPending ? 'Processing...' : `Choose ${plan.name}`}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </GlassCard>
                  </BentoItem>
                );
              })}
            </BentoGrid>
          </div>

          <div className="md:hidden mb-8">
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-2">
                {regularPlans.map((plan) => {
                  const Icon = getIcon(plan.id);
                  const popular = isPopular(plan);
                  
                  return (
                    <CarouselItem key={plan.id} className="pl-2 basis-[85%]">
                      <GlassCard 
                        hoverEffect="subtle" 
                        glow={popular ? "green" : "none"}
                        depth={popular ? "deep" : "shallow"}
                        className={`p-5 ${popular ? 'ring-2 ring-emerald-500' : ''}`}
                      >
                        {popular && (
                          <Badge className="bg-emerald-500 text-white border-0 mb-3">Most Popular</Badge>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-full ${popular ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            <Icon className={`w-5 h-5 ${popular ? 'text-emerald-600' : 'text-slate-600'}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{plan.name}</h3>
                            <p className="text-xs text-slate-500">{plan.target}</p>
                            <p className="text-lg font-bold">{formatPrice(plan)}<span className="text-sm text-slate-500">/mo</span></p>
                            <p className="text-xs text-slate-600">+ ${plan.setupFee.toLocaleString()} setup</p>
                          </div>
                        </div>
                        
                        <ul className="space-y-2 mb-4">
                          {plan.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-600">{feature}</span>
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-sm text-slate-500">+{plan.features.length - 3} more</li>
                          )}
                        </ul>
                        
                        <Button 
                          className="w-full"
                          variant={popular ? 'default' : 'outline'}
                          onClick={() => upgradeMutation.mutate(plan.id)}
                          disabled={upgradeMutation.isPending}
                          data-testid={`button-select-${plan.id}-mobile`}
                        >
                          Choose {plan.name}
                        </Button>
                      </GlassCard>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
              </div>
            </Carousel>
          </div>

          {franchisePlan && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">
                  <Award className="w-3 h-3 mr-1" />
                  Join an Established Brand
                </Badge>
              </div>
              <GlassCard 
                hoverEffect="3d" 
                glow="purple"
                depth="deep"
                className="p-6 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 ring-2 ring-purple-400/50"
              >
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{franchisePlan.name}</h3>
                        <p className="text-sm text-purple-600 font-medium">{franchisePlan.target}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4">
                      Skip the brand-building phase. Operate under the trusted PaintPros name with 
                      instant credibility, national marketing support, and exclusive territory rights.
                    </p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-slate-900">${franchisePlan.price}</span>
                      <span className="text-slate-500">/{franchisePlan.interval}</span>
                      {franchisePlan.perLocationFee && (
                        <span className="text-sm text-slate-500">+ ${franchisePlan.perLocationFee}/location</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-4">
                      + ${franchisePlan.setupFee.toLocaleString()} one-time setup fee
                    </p>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                      onClick={() => setShowFranchiseModal(true)}
                      data-testid="button-paintpros-franchise"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Claim Your Territory
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {franchisePlan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          <GlassCard hoverEffect="subtle" glow="accent" depth="deep" className="p-6 bg-slate-900/95">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div>
                <FileText className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <h4 className="font-semibold text-white">Your Branding</h4>
                <p className="text-sm text-slate-400">Colors & logo preserved</p>
              </div>
              <div>
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <h4 className="font-semibold text-white">Your Leads</h4>
                <p className="text-sm text-slate-400">All contacts carry over</p>
              </div>
              <div>
                <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <h4 className="font-semibold text-white">Your Stamps</h4>
                <p className="text-sm text-slate-400">Blockchain records intact</p>
              </div>
              <div>
                <Zap className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <h4 className="font-semibold text-white">Instant Access</h4>
                <p className="text-sm text-slate-400">No setup required</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <Dialog open={showFranchiseModal} onOpenChange={setShowFranchiseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Join PaintPros Franchise Network
            </DialogTitle>
            <DialogDescription>
              Claim your exclusive territory. Once approved, you'll operate under the PaintPros brand 
              with full marketing support and national recognition.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="franchise-city">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  id="franchise-city"
                  placeholder="e.g., Austin"
                  value={franchiseCity}
                  onChange={(e) => setFranchiseCity(e.target.value)}
                  className="pl-10"
                  data-testid="input-franchise-city"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="franchise-state">State</Label>
              <Input 
                id="franchise-state"
                placeholder="e.g., Texas"
                value={franchiseState}
                onChange={(e) => setFranchiseState(e.target.value)}
                data-testid="input-franchise-state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="franchise-territory">Exclusive Territory</Label>
              <Input 
                id="franchise-territory"
                placeholder="e.g., Greater Austin Metro Area"
                value={franchiseTerritory}
                onChange={(e) => setFranchiseTerritory(e.target.value)}
                data-testid="input-franchise-territory"
              />
              <p className="text-xs text-slate-500">Define your protected service area</p>
            </div>
            
            <GlassCard hoverEffect="none" depth="shallow" className="p-4 bg-purple-50/80">
              <h4 className="font-medium text-slate-900 mb-2">What you get:</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-purple-500" />
                  PaintPros branded website & materials
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-purple-500" />
                  Territory exclusivity protection
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-purple-500" />
                  National referral network access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-purple-500" />
                  Franchise training & onboarding
                </li>
              </ul>
            </GlassCard>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFranchiseModal(false)}
              data-testid="button-cancel-franchise"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              onClick={() => franchiseUpgradeMutation.mutate()}
              disabled={!franchiseCity || !franchiseState || !franchiseTerritory || franchiseUpgradeMutation.isPending}
              data-testid="button-confirm-franchise"
            >
              {franchiseUpgradeMutation.isPending ? 'Processing...' : 'Continue to Payment'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
