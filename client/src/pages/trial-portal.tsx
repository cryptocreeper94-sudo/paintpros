import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { BrandingConfigurator } from "@/components/trial/branding-configurator";
import { 
  Clock, CheckCircle2, Palette, FileText, Shield, 
  Users, ArrowRight, Sparkles, Rocket, AlertTriangle, 
  Building2, Mail, MapPin, ExternalLink, ChevronRight
} from "lucide-react";

interface TrialData {
  id: string;
  ownerName: string;
  ownerEmail: string;
  companyName: string;
  companySlug: string;
  companyCity: string | null;
  companyState: string | null;
  primaryColor: string;
  accentColor: string;
  logoUrl: string | null;
  status: string;
  hoursRemaining: number;
  isExpired: boolean;
  usage: {
    estimates: { used: number; limit: number };
    leads: { used: number; limit: number };
    blockchainStamps: { used: number; limit: number };
  };
  progress: {
    currentStep: number;
    completedSteps: string[];
    totalSteps: number;
    percentComplete: number;
  };
}

function MissionControlChecklist({ trial, onStepClick }: { trial: TrialData; onStepClick: (step: string) => void }) {
  const steps = [
    { 
      id: 'setup', 
      title: 'Customize Your Portal', 
      desc: 'Add your logo and brand colors',
      icon: Building2,
    },
    { 
      id: 'visualizer', 
      title: 'Try the Color Visualizer', 
      desc: 'Upload a photo and preview paint colors',
      icon: Palette,
    },
    { 
      id: 'estimate', 
      title: 'Create Your First Estimate', 
      desc: 'See how the estimating tool works',
      icon: FileText,
    },
    { 
      id: 'stamp', 
      title: 'Blockchain Stamp an Estimate', 
      desc: 'Verify your document on the blockchain',
      icon: Shield,
    },
  ];

  const completedSteps = trial.progress?.completedSteps || [];

  return (
    <GlassCard hoverEffect={false} glow="green" depth="shallow" className="p-4 md:p-6">
      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Trial Mission Control</h3>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700 border-0">
          {completedSteps.length}/{steps.length} Complete
        </Badge>
      </div>
      <Progress value={trial.progress?.percentComplete || 0} className="h-2 mb-4" />
      
      <Accordion type="single" collapsible defaultValue="steps" className="border-0">
        <AccordionItem value="steps" className="border-0">
          <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline py-2">
            View Checklist
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {steps.map((step) => {
                const isComplete = completedSteps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => onStepClick(step.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      isComplete 
                        ? 'bg-emerald-50/80 border border-emerald-200' 
                        : 'bg-white/50 border border-slate-200 hover-elevate'
                    }`}
                    data-testid={`button-step-${step.id}`}
                  >
                    <div className={`p-2 rounded-full shrink-0 ${isComplete ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <step.icon className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${isComplete ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-500 truncate">{step.desc}</p>
                    </div>
                    {!isComplete && <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </GlassCard>
  );
}

function UsageItem({ title, used, limit, icon: Icon }: { title: string; used: number; limit: number; icon: any }) {
  const isAtLimit = used >= limit;
  const percentage = Math.min((used / limit) * 100, 100);
  
  return (
    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${isAtLimit ? 'text-amber-400' : 'text-white/80'}`} />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        <span className={`text-sm font-bold ${isAtLimit ? 'text-amber-400' : 'text-white'}`}>
          {used}/{limit}
        </span>
      </div>
      <Progress value={percentage} className={`h-2 bg-white/20 ${isAtLimit ? '[&>div]:bg-amber-400' : '[&>div]:bg-emerald-400'}`} />
      {isAtLimit && (
        <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Limit reached
        </p>
      )}
    </div>
  );
}

function TimeRemaining({ hours }: { hours: number }) {
  if (hours <= 0) {
    return (
      <Badge variant="destructive" className="text-sm px-3 py-1">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Trial Expired
      </Badge>
    );
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return (
    <Badge className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700 border-0">
      <Clock className="w-3 h-3 mr-1" />
      {days > 0 ? `${days}d ${remainingHours}h` : `${hours}h`} remaining
    </Badge>
  );
}

const quickActions = [
  { id: 'estimate', title: 'Create Estimate', desc: 'Generate a quote', icon: FileText, color: 'text-emerald-600', route: '/estimate' },
  { id: 'visualizer', title: 'Color Visualizer', desc: 'Preview on walls', icon: Palette, color: 'text-purple-600', route: '/colors' },
  { id: 'library', title: 'Color Library', desc: 'Browse colors', icon: Palette, color: 'text-blue-600', route: '/color-library' },
  { id: 'glossary', title: 'Paint Glossary', desc: 'Terms A-Z', icon: FileText, color: 'text-amber-600', route: '/glossary' },
];

export default function TrialPortal() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);

  const { data: trial, isLoading, error } = useQuery<TrialData>({
    queryKey: ['/api/trial', slug],
    queryFn: async () => {
      const response = await fetch(`/api/trial/${slug}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const completeStepMutation = useMutation({
    mutationFn: async (step: string) => {
      const response = await apiRequest("POST", `/api/trial/${trial?.id}/complete-step`, { step });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trial', slug] });
    },
  });

  const handleStepClick = (step: string) => {
    switch (step) {
      case 'setup':
        setBrandingModalOpen(true);
        break;
      case 'visualizer':
        setLocation('/colors');
        break;
      case 'estimate':
        setLocation('/estimate');
        break;
      case 'stamp':
        toast({
          title: "Create an estimate first",
          description: "You'll be able to stamp it after creating",
        });
        setLocation('/estimate');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error || !trial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <GlassCard hoverEffect="subtle" glow="accent" className="max-w-md mx-4 p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Trial Not Found</h2>
            <p className="text-slate-600 mb-4">
              This trial portal doesn't exist or may have expired.
            </p>
            <Button onClick={() => setLocation('/start-trial')} data-testid="button-start-new-trial">
              Start a New Trial
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <header 
        className="border-b border-slate-200/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {trial.logoUrl ? (
                <img src={trial.logoUrl} alt={trial.companyName} className="h-10 w-auto" />
              ) : (
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: trial.primaryColor }}
                >
                  {trial.companyName.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-bold text-lg text-slate-900">{trial.companyName}</h1>
                {trial.companyCity && trial.companyState && (
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {trial.companyCity}, {trial.companyState}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeRemaining hours={trial.hoursRemaining} />
              <Button 
                onClick={() => setLocation(`/trial/${slug}/upgrade`)}
                data-testid="button-upgrade"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Welcome, {trial.ownerName}!
            </h2>
            <p className="text-slate-600">
              Your trial portal is live. Complete the checklist below to explore all features.
            </p>
          </div>

          <BentoGrid className="mb-6">
            <BentoItem colSpan={8} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
              <MissionControlChecklist trial={trial} onStepClick={handleStepClick} />
            </BentoItem>

            <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
              <GlassCard hoverEffect="3d" glow="purple" depth="deep" className="p-4 h-full bg-slate-900/95">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white">Trial Usage</h3>
                </div>
                <div className="space-y-3">
                  <UsageItem 
                    title="Estimates" 
                    used={trial.usage.estimates.used} 
                    limit={trial.usage.estimates.limit}
                    icon={FileText}
                  />
                  <UsageItem 
                    title="Leads Captured" 
                    used={trial.usage.leads.used} 
                    limit={trial.usage.leads.limit}
                    icon={Users}
                  />
                  <UsageItem 
                    title="Blockchain Stamps" 
                    used={trial.usage.blockchainStamps.used} 
                    limit={trial.usage.blockchainStamps.limit}
                    icon={Shield}
                  />
                </div>
              </GlassCard>
            </BentoItem>
          </BentoGrid>

          <div className="hidden md:block mb-6">
            <GlassCard hoverEffect={false} glow="none" depth="shallow" className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Quick Actions</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <button 
                    key={action.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-slate-200 hover-elevate transition-colors text-left"
                    onClick={() => setLocation(action.route)}
                    data-testid={`button-${action.id}`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900">{action.title}</div>
                      <div className="text-xs text-slate-500">{action.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="md:hidden mb-6">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Quick Actions</h3>
            </div>
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-2">
                {quickActions.map((action) => (
                  <CarouselItem key={action.id} className="pl-2 basis-[70%]">
                    <GlassCard hoverEffect="subtle" glow="none" depth="shallow" className="p-4">
                      <button 
                        className="flex items-center gap-3 w-full text-left"
                        onClick={() => setLocation(action.route)}
                        data-testid={`button-${action.id}-mobile`}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                          <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-slate-900">{action.title}</div>
                          <div className="text-xs text-slate-500">{action.desc}</div>
                        </div>
                      </button>
                    </GlassCard>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <BentoGrid>
            <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <GlassCard hoverEffect="subtle" glow="none" depth="shallow" className="p-4 h-full">
                <h4 className="font-semibold text-slate-900 mb-2">Portal Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{trial.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span className="truncate">/trial/{trial.companySlug}</span>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            <BentoItem colSpan={6} rowSpan={1} mobileColSpan={4} mobileRowSpan={1}>
              <GlassCard hoverEffect="3d" glow="green" depth="medium" className="p-4 h-full bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                <h4 className="font-semibold text-emerald-900 mb-2">Ready to Go Full Time?</h4>
                <p className="text-sm text-emerald-700 mb-3">
                  Unlock unlimited estimates, leads, and blockchain stamps.
                </p>
                <Button 
                  className="w-full"
                  data-testid="button-view-pricing"
                  onClick={() => setLocation(`/trial/${slug}/upgrade`)}
                >
                  View Pricing Plans
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </GlassCard>
            </BentoItem>
          </BentoGrid>

          {trial.isExpired && (
            <GlassCard hoverEffect={false} glow="none" depth="shallow" className="mt-6 p-6 border-2 border-amber-300 bg-amber-50/80">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 text-lg">Your Trial Has Expired</h3>
                  <p className="text-amber-700 mt-1 mb-4">
                    Don't lose your progress! Upgrade now to keep your portal, leads, and all customizations.
                  </p>
                  <Button 
                    onClick={() => setLocation(`/trial/${slug}/upgrade`)}
                    data-testid="button-upgrade-expired"
                  >
                    Upgrade to Keep Your Portal
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
      
      <BrandingConfigurator
        open={brandingModalOpen}
        onOpenChange={setBrandingModalOpen}
        trialId={trial.id}
        trialSlug={slug || ''}
        currentBranding={{
          companyName: trial.companyName,
          primaryColor: trial.primaryColor,
          accentColor: trial.accentColor,
          logoUrl: trial.logoUrl,
        }}
        onSaveSuccess={() => {
          if (!trial.progress?.completedSteps?.includes('setup')) {
            completeStepMutation.mutate('setup');
          }
        }}
      />
    </div>
  );
}
