import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Clock, CheckCircle2, Circle, Palette, FileText, Shield, 
  Users, ArrowRight, Sparkles, Rocket, AlertTriangle, 
  Building2, Phone, Mail, MapPin, ExternalLink
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
      action: () => onStepClick('setup')
    },
    { 
      id: 'visualizer', 
      title: 'Try the Color Visualizer', 
      desc: 'Upload a photo and preview paint colors',
      icon: Palette,
      action: () => onStepClick('visualizer')
    },
    { 
      id: 'estimate', 
      title: 'Create Your First Estimate', 
      desc: 'See how the estimating tool works',
      icon: FileText,
      action: () => onStepClick('estimate')
    },
    { 
      id: 'stamp', 
      title: 'Blockchain Stamp an Estimate', 
      desc: 'Verify your document on the blockchain',
      icon: Shield,
      action: () => onStepClick('stamp')
    },
  ];

  const completedSteps = trial.progress?.completedSteps || [];

  return (
    <Card className="border-2 border-emerald-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-lg">Trial Mission Control</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {completedSteps.length}/{steps.length} Complete
          </Badge>
        </div>
        <Progress value={trial.progress?.percentComplete || 0} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => {
          const isComplete = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={step.action}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                isComplete 
                  ? 'bg-emerald-50 border border-emerald-200' 
                  : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
              }`}
              data-testid={`button-step-${step.id}`}
            >
              <div className={`p-2 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-slate-200'}`}>
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
      </CardContent>
    </Card>
  );
}

function UsageCard({ title, used, limit, icon: Icon }: { title: string; used: number; limit: number; icon: any }) {
  const isAtLimit = used >= limit;
  const percentage = (used / limit) * 100;
  
  return (
    <Card className={isAtLimit ? 'border-amber-300 bg-amber-50' : ''}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${isAtLimit ? 'text-amber-600' : 'text-slate-500'}`} />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <span className={`text-sm font-bold ${isAtLimit ? 'text-amber-600' : 'text-slate-700'}`}>
            {used}/{limit}
          </span>
        </div>
        <Progress value={percentage} className={`h-2 ${isAtLimit ? '[&>div]:bg-amber-500' : ''}`} />
        {isAtLimit && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Limit reached - upgrade for more
          </p>
        )}
      </CardContent>
    </Card>
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
    <Badge variant="secondary" className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700">
      <Clock className="w-3 h-3 mr-1" />
      {days > 0 ? `${days}d ${remainingHours}h` : `${hours}h`} remaining
    </Badge>
  );
}

export default function TrialPortal() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
        setActiveSection('branding');
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (error || !trial) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Trial Not Found</h2>
            <p className="text-slate-600 mb-4">
              This trial portal doesn't exist or may have expired.
            </p>
            <Button onClick={() => setLocation('/start-trial')} data-testid="button-start-new-trial">
              Start a New Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <header 
        className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
        style={{ borderColor: trial.primaryColor + '40' }}
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
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {trial.companyCity && trial.companyState && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {trial.companyCity}, {trial.companyState}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TimeRemaining hours={trial.hoursRemaining} />
              <Button 
                data-testid="button-upgrade"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome, {trial.ownerName}!
            </h2>
            <p className="text-slate-600">
              Your trial portal is live. Complete the checklist below to explore all features.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MissionControlChecklist trial={trial} onStepClick={handleStepClick} />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      onClick={() => setLocation('/estimate')}
                      data-testid="button-create-estimate"
                    >
                      <FileText className="w-5 h-5 mr-3 text-emerald-600" />
                      <div className="text-left">
                        <div className="font-medium">Create Estimate</div>
                        <div className="text-xs text-slate-500">Generate a professional quote</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      onClick={() => setLocation('/colors')}
                      data-testid="button-color-visualizer"
                    >
                      <Palette className="w-5 h-5 mr-3 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">Color Visualizer</div>
                        <div className="text-xs text-slate-500">Preview colors on walls</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      onClick={() => setLocation('/color-library')}
                      data-testid="button-color-library"
                    >
                      <Palette className="w-5 h-5 mr-3 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Color Library</div>
                        <div className="text-xs text-slate-500">Browse paint colors</div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 justify-start"
                      onClick={() => setLocation('/glossary')}
                      data-testid="button-glossary"
                    >
                      <FileText className="w-5 h-5 mr-3 text-amber-600" />
                      <div className="text-left">
                        <div className="font-medium">Paint Glossary</div>
                        <div className="text-xs text-slate-500">Industry terms A-Z</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {trial.isExpired && (
                <Card className="border-amber-300 bg-amber-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                      <div>
                        <h3 className="font-bold text-amber-900 text-lg">Your Trial Has Expired</h3>
                        <p className="text-amber-700 mt-1 mb-4">
                          Don't lose your progress! Upgrade now to keep your portal, leads, and all customizations.
                        </p>
                        <Button data-testid="button-upgrade-expired">
                          Upgrade to Keep Your Portal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card className="bg-slate-900 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Trial Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <UsageCard 
                    title="Estimates" 
                    used={trial.usage.estimates.used} 
                    limit={trial.usage.estimates.limit}
                    icon={FileText}
                  />
                  <UsageCard 
                    title="Leads Captured" 
                    used={trial.usage.leads.used} 
                    limit={trial.usage.leads.limit}
                    icon={Users}
                  />
                  <UsageCard 
                    title="Blockchain Stamps" 
                    used={trial.usage.blockchainStamps.used} 
                    limit={trial.usage.blockchainStamps.limit}
                    icon={Shield}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Portal Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{trial.ownerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate">/trial/{trial.companySlug}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-emerald-900 mb-2">Ready to Go Full Time?</h4>
                  <p className="text-sm text-emerald-700 mb-3">
                    Unlock unlimited estimates, leads, and blockchain stamps with a paid plan.
                  </p>
                  <Button 
                    className="w-full"
                    data-testid="button-view-pricing"
                    onClick={() => setLocation('/pricing')}
                  >
                    View Pricing Plans
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
