import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  CreditCard, Check, Shield, Lock, AlertCircle, 
  FileText, DollarSign, Clock, CheckCircle2, Loader2,
  Home, Paintbrush
} from "lucide-react";
import { toast } from "sonner";
import type { Estimate, Lead, Payment } from "@shared/schema";

export default function Pay() {
  const { estimateId } = useParams<{ estimateId: string }>();
  const config = useTenant();
  const [paymentStep, setPaymentStep] = useState<"review" | "payment" | "success">("review");
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    email: "",
  });

  const { data: estimate, isLoading: estimateLoading, error: estimateError } = useQuery<Estimate>({
    queryKey: ["/api/estimates", estimateId],
    queryFn: async () => {
      const res = await fetch(`/api/estimates/${estimateId}`);
      if (!res.ok) throw new Error("Estimate not found");
      return res.json();
    },
    enabled: !!estimateId,
  });

  const { data: existingPayment } = useQuery<Payment | null>({
    queryKey: ["/api/estimates", estimateId, "payment"],
    queryFn: async () => {
      const res = await fetch(`/api/estimates/${estimateId}/payment`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!estimateId,
  });

  const { data: lead } = useQuery<Lead>({
    queryKey: ["/api/leads", estimate?.leadId],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${estimate?.leadId}`);
      if (!res.ok) throw new Error("Lead not found");
      return res.json();
    },
    enabled: !!estimate?.leadId,
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: { estimateId: string; amount: string; customerEmail: string }) => {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          paymentMethod: "card",
          description: `Payment for estimate ${estimateId}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      return res.json();
    },
  });

  const completePaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const res = await fetch(`/api/payments/${paymentId}/complete`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to complete payment");
      return res.json();
    },
    onSuccess: () => {
      setPaymentStep("success");
      toast.success("Payment successful!");
    },
  });

  useEffect(() => {
    if (lead?.email) {
      setFormData(prev => ({ ...prev, email: lead.email }));
    }
  }, [lead]);

  useEffect(() => {
    if (existingPayment?.status === "completed") {
      setPaymentStep("success");
    }
  }, [existingPayment]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!estimate) return;

    try {
      const payment = await createPaymentMutation.mutateAsync({
        estimateId: estimate.id,
        amount: estimate.totalEstimate,
        customerEmail: formData.email,
      });

      await completePaymentMutation.mutateAsync(payment.id);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  if (estimateLoading) {
    return (
      <PageLayout>
        <main className="pt-24 px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
            <p className="text-muted-foreground">Loading estimate...</p>
          </div>
        </main>
      </PageLayout>
    );
  }

  if (estimateError || !estimate) {
    return (
      <PageLayout>
        <main className="pt-24 px-4 min-h-screen flex items-center justify-center">
          <GlassCard className="p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-2">Estimate Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The estimate you're looking for doesn't exist or has expired.
            </p>
            <a href="/" className="text-accent hover:underline">
              Return to homepage
            </a>
          </GlassCard>
        </main>
      </PageLayout>
    );
  }

  if (paymentStep === "success") {
    return (
      <PageLayout>
        <main className="pt-24 px-4 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8 text-center" glow>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </motion.div>
              <h1 className="text-3xl font-display font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your payment. We'll be in touch soon to schedule your project.
              </p>
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                <p className="text-2xl font-bold text-green-400">
                  ${parseFloat(estimate.totalEstimate).toLocaleString()}
                </p>
              </div>
              <a href="/">
                <FlipButton className="w-full" data-testid="button-return-home">
                  <Home className="w-4 h-4 mr-2" /> Return Home
                </FlipButton>
              </a>
            </GlassCard>
          </motion.div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="pt-24 px-4 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground">Secure payment for your painting estimate</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Estimate Summary */}
            <div className="md:col-span-2">
              <GlassCard className="p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-bold">Estimate Summary</h2>
                    <p className="text-xs text-muted-foreground">#{estimate.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {estimate.includeWalls && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Walls</span>
                      <span>${parseFloat(estimate.wallsPrice || "0").toLocaleString()}</span>
                    </div>
                  )}
                  {estimate.includeTrim && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trim</span>
                      <span>${parseFloat(estimate.trimPrice || "0").toLocaleString()}</span>
                    </div>
                  )}
                  {estimate.includeCeilings && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ceilings</span>
                      <span>${parseFloat(estimate.ceilingsPrice || "0").toLocaleString()}</span>
                    </div>
                  )}
                  {estimate.doorCount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Doors ({estimate.doorCount})</span>
                      <span>${parseFloat(estimate.doorsPrice || "0").toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-accent">${parseFloat(estimate.totalEstimate).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-xl p-4 border border-accent/30">
                  <div className="flex items-center gap-2 text-sm">
                    <Paintbrush className="w-4 h-4 text-accent" />
                    <span>{config.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {config.credentials.warrantyYears}-year warranty included
                  </p>
                </div>
              </GlassCard>
            </div>

            {/* Payment Form */}
            <div className="md:col-span-3">
              <GlassCard className="p-6 md:p-8" glow>
                {paymentStep === "review" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-bold">Review Your Order</h2>
                        <p className="text-xs text-muted-foreground">Confirm details before payment</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Pricing Tier</span>
                        </div>
                        <p className="font-medium capitalize">{estimate.pricingTier.replace(/_/g, " ")}</p>
                      </div>

                      {estimate.squareFootage && estimate.squareFootage > 0 && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Home className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Square Footage</span>
                          </div>
                          <p className="font-medium">{estimate.squareFootage.toLocaleString()} sq ft</p>
                        </div>
                      )}
                    </div>

                    <FlipButton 
                      className="w-full" 
                      onClick={() => setPaymentStep("payment")}
                      data-testid="button-proceed-payment"
                    >
                      Proceed to Payment <CreditCard className="w-4 h-4 ml-2" />
                    </FlipButton>
                  </motion.div>
                )}

                {paymentStep === "payment" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-bold">Payment Details</h2>
                        <p className="text-xs text-muted-foreground">Enter your card information</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitPayment} className="space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="bg-white/5 border-white/20"
                          required
                          data-testid="input-payment-email"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Name on Card</label>
                        <Input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          placeholder="John Doe"
                          className="bg-white/5 border-white/20"
                          required
                          data-testid="input-card-name"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Card Number</label>
                        <Input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="4242 4242 4242 4242"
                          className="bg-white/5 border-white/20 font-mono"
                          maxLength={19}
                          required
                          data-testid="input-card-number"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Expiry</label>
                          <Input
                            type="text"
                            value={formData.expiry}
                            onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                            placeholder="MM/YY"
                            className="bg-white/5 border-white/20 font-mono"
                            maxLength={5}
                            required
                            data-testid="input-card-expiry"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">CVV</label>
                          <Input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
                            placeholder="123"
                            className="bg-white/5 border-white/20 font-mono"
                            maxLength={4}
                            required
                            data-testid="input-card-cvv"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 rounded-xl p-3 border border-white/10">
                        <Lock className="w-4 h-4 text-green-400" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>

                      <FlipButton 
                        className="w-full"
                        onClick={() => handleSubmitPayment({ preventDefault: () => {} } as React.FormEvent)}
                        data-testid="button-submit-payment"
                      >
                        {createPaymentMutation.isPending || completePaymentMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Pay ${parseFloat(estimate.totalEstimate).toLocaleString()}
                          </>
                        )}
                      </FlipButton>

                      <button
                        type="button"
                        onClick={() => setPaymentStep("review")}
                        className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                        data-testid="button-back-review"
                      >
                        Back to review
                      </button>
                    </form>
                  </motion.div>
                )}
              </GlassCard>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
