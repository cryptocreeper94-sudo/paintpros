import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle2, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";

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

export default function TrialUpgradeSuccess() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [converting, setConverting] = useState(true);
  const [converted, setConverted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Get session_id from URL on mount
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
    // Don't proceed without a valid session ID
    if (!sessionId) {
      setConverting(false);
      setError('Missing payment confirmation. Please try upgrading again or contact support.');
      return;
    }

    if (trial?.id && !convertMutation.isPending && !converted && !error) {
      // Extract plan from URL query params (passed from Stripe metadata)
      const planFromUrl = urlParams.get('plan') || 'professional';
      convertMutation.mutate(planFromUrl);
    }
  }, [trial?.id, sessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 border-red-200">
          <CardContent className="pt-8 pb-8 text-center">
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
          </CardContent>
        </Card>
      </div>
    );
  }

  if (converting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-8 pb-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Setting Up Your Account</h2>
            <p className="text-slate-600">
              We're activating your full access now. This only takes a moment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
      <Card className="max-w-lg mx-4 border-2 border-emerald-200">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to PaintPros.io!
          </h1>
          
          <p className="text-slate-600 mb-6">
            {trial?.companyName} is now fully activated. All your trial work has been preserved 
            and you have unlimited access to all features.
          </p>

          <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              What's Unlocked ({selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : 'Professional'} Plan)
            </h3>
            <ul className="text-sm text-emerald-700 space-y-1">
              {selectedPlan === 'starter' && (
                <>
                  <li>Unlimited estimates and proposals</li>
                  <li>Up to 50 leads per month</li>
                  <li>5 blockchain stamps per month</li>
                  <li>Basic branding customization</li>
                </>
              )}
              {selectedPlan === 'professional' && (
                <>
                  <li>Unlimited estimates and proposals</li>
                  <li>Unlimited lead capture</li>
                  <li>25 blockchain stamps per month</li>
                  <li>Full branding customization</li>
                  <li>Priority support</li>
                </>
              )}
              {selectedPlan === 'enterprise' && (
                <>
                  <li>Everything in Professional</li>
                  <li>Unlimited blockchain stamps</li>
                  <li>White-label domain</li>
                  <li>API access</li>
                  <li>Dedicated support</li>
                </>
              )}
              {!selectedPlan && (
                <>
                  <li>Unlimited estimates and proposals</li>
                  <li>Unlimited lead capture</li>
                  <li>25+ blockchain stamps per month</li>
                  <li>Full branding customization</li>
                  <li>Priority support</li>
                </>
              )}
            </ul>
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
          
          <p className="text-xs text-slate-500 mt-4">
            A receipt has been sent to your email. You can manage your subscription anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
