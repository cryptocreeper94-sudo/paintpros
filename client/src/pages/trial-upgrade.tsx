import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Check, Sparkles, Shield, Users, FileText, Zap, 
  ArrowLeft, Crown, Rocket, Building2
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
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

  const getIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return Rocket;
      case 'professional': return Crown;
      case 'enterprise': return Building2;
      default: return Sparkles;
    }
  };

  const isPopular = (planId: string) => planId === 'professional';

  if (trialLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Trial not found</p>
            <Button onClick={() => setLocation('/start-trial')} className="mt-4">
              Start a Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
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

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">
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

          <div className="grid md:grid-cols-3 gap-6">
            {plans?.map((plan) => {
              const Icon = getIcon(plan.id);
              const popular = isPopular(plan.id);
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative ${popular ? 'border-2 border-emerald-500 shadow-lg' : ''}`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-500">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div className={`mx-auto p-3 rounded-full mb-2 ${popular ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                      <Icon className={`w-6 h-6 ${popular ? 'text-emerald-600' : 'text-slate-600'}`} />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-slate-500">/{plan.interval}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${popular ? '' : ''}`}
                      variant={popular ? 'default' : 'outline'}
                      onClick={() => upgradeMutation.mutate(plan.id)}
                      disabled={upgradeMutation.isPending}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {upgradeMutation.isPending ? 'Processing...' : `Choose ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-slate-900 text-white border-0">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <h4 className="font-semibold">Your Branding</h4>
                  <p className="text-sm text-slate-400">Colors & logo preserved</p>
                </div>
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <h4 className="font-semibold">Your Leads</h4>
                  <p className="text-sm text-slate-400">All contacts carry over</p>
                </div>
                <div>
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h4 className="font-semibold">Your Stamps</h4>
                  <p className="text-sm text-slate-400">Blockchain records intact</p>
                </div>
                <div>
                  <Zap className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                  <h4 className="font-semibold">Instant Access</h4>
                  <p className="text-sm text-slate-400">No setup required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
