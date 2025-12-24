import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { GlassCard } from "@/components/ui/glass-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  CheckCircle2, Sparkles, ArrowRight, Loader2, AlertCircle, 
  Check, Crown, Rocket, Building2, Shield, FileText, Users, Zap
} from "lucide-react";

interface TrialData {
  id: string;
  ownerName: string;
  companyName: string;
  companySlug: string;
  primaryColor: string;
}

interface ConversionResult {
  success: boolean;
  tenant: {
    planId: string;
  };
}

const planFeatures: Record<string, { features: string[]; icon: any; color: string }> = {
  starter: {
    icon: Rocket,
    color: 'emerald',
    features: [
      'Unlimited estimates and proposals',
      'Up to 50 leads per month',
      '5 blockchain stamps per month',
      'Basic branding customization',
    ],
  },
  professional: {
    icon: Crown,
    color: 'emerald',
    features: [
      'Unlimited estimates and proposals',
      'Unlimited lead capture',
      '25 blockchain stamps per month',
      'Full branding customization',
      'Priority support',
    ],
  },
  enterprise: {
    icon: Building2,
    color: 'purple',
    features: [
      'Everything in Professional',
      'Unlimited blockchain stamps',
      'White-label domain',
      'API access',
      'Dedicated support',
    ],
  },
};

export default function TrialUpgradeSuccess() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [converting, setConverting] = useState(true);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  const { data: trial } = useQuery<TrialData>({
    queryKey: ['/api/trial', slug],
    queryFn: async () => {
      const response = await fetch(`/api/trial/${slug}`, { credentials: 'include' });
      if (!response.ok) throw new Error('Trial not found');
      return response.json();
    },
    enabled: !!slug,
  });

  const convertMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", `/api/trial/${trial?.id}/convert`, {
        planId,
        stripeSessionId: sessionId,
      });
      return response.json() as Promise<ConversionResult>;
    },
    onSuccess: (data) => {
      setConverting(false);
      setConverted(true);
      setSelectedPlan(data.tenant?.planId || 'professional');
    },
    onError: (err: any) => {
      setConverting(false);
      setError(err.message || 'Failed to activate your account. Please contact support.');
    },
  });

  useEffect(() => {
    if (!sessionId) {
      setConverting(false);
      setError('Missing payment confirmation. Please try upgrading again or contact support.');
      return;
    }

    if (trial?.id && !convertMutation.isPending && !converted && !error) {
      const planFromUrl = urlParams.get('plan') || 'professional';
      convertMutation.mutate(planFromUrl);
    }
  }, [trial?.id, sessionId]);

  const plan = selectedPlan ? planFeatures[selectedPlan] : planFeatures.professional;
  const PlanIcon = plan?.icon || Crown;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 flex items-center justify-center p-4">
        <GlassCard hoverEffect="subtle" glow="none" depth="medium" className="max-w-md w-full p-6 border-2 border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-red-900">Something Went Wrong</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setLocation(`/trial/${slug}/upgrade`)} data-testid="button-try-again">
                Try Again
              </Button>
              <Button variant="ghost" onClick={() => setLocation(`/trial/${slug}`)} data-testid="button-back-to-portal">
                Back to Portal
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (converting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
        <GlassCard hoverEffect={false} glow="green" depth="medium" className="max-w-md w-full p-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2 text-slate-900">Setting Up Your Account</h2>
            <p className="text-slate-600">
              We're activating your full access now. This only takes a moment...
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
      <GlassCard hoverEffect="3d" glow="green" depth="deep" className="max-w-lg w-full p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          
          <Badge className="mb-3 bg-emerald-100 text-emerald-700 border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Account Activated
          </Badge>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to PaintPros.io!
          </h1>
          
          <p className="text-slate-600">
            {trial?.companyName} is now fully activated. All your trial work has been preserved.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="features" className="mb-6">
          <AccordionItem value="features" className="border rounded-lg bg-emerald-50/80 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                <PlanIcon className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">
                  {selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : 'Professional'} Plan Features
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ul className="space-y-2">
                {plan?.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-emerald-800">{feature}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs text-slate-600">Unlimited Estimates</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-slate-600">Lead Capture</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <Shield className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-slate-600">Blockchain Stamps</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-amber-600" />
            <p className="text-xs text-slate-600">Priority Support</p>
          </div>
        </div>

        <Button 
          size="lg"
          className="w-full"
          onClick={() => setLocation(`/trial/${slug}`)}
          data-testid="button-go-to-dashboard"
        >
          Go to Your Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <p className="text-xs text-slate-500 mt-4 text-center">
          A receipt has been sent to your email. You can manage your subscription anytime.
        </p>
      </GlassCard>
    </div>
  );
}
