import { useState, useEffect } from "react";
import { useParams, useSearch } from "wouter";
import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  CreditCard, Check, Shield, Lock, AlertCircle, 
  FileText, DollarSign, Clock, CheckCircle2, Loader2,
  Home, Paintbrush, Coins
} from "lucide-react";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { toast } from "sonner";
import type { Estimate, Lead, Payment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Pay() {
  const { estimateId } = useParams<{ estimateId: string }>();
  const searchString = useSearch();
  const config = useTenant();
  const [paymentStep, setPaymentStep] = useState<"review" | "payment" | "success">("review");
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse URL params for payment status
  const urlParams = new URLSearchParams(searchString);
  const paymentStatus = urlParams.get("status");
  const paymentMethod = urlParams.get("method");

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

  // Handle successful payment from URL params
  useEffect(() => {
    if (paymentStatus === "success") {
      setPaymentStep("success");
      toast.success(paymentMethod === "crypto" ? "Crypto payment confirmed!" : "Payment successful!");
    } else if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled. Please try again.");
    }
  }, [paymentStatus, paymentMethod]);

  useEffect(() => {
    if (existingPayment?.status === "completed") {
      setPaymentStep("success");
    }
  }, [existingPayment]);

  // Stripe payment handler
  const handleStripePayment = async () => {
    if (!estimate) return;
    
    setIsProcessing(true);
    try {
      const response = await apiRequest("/api/payments/stripe/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          estimateId: estimate.id,
          amount: parseFloat(estimate.totalEstimate),
          description: `Painting Services - ${config.name}`,
          customerEmail: lead?.email,
        }),
      });

      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Stripe error:", error);
      toast.error(error.message || "Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  // Coinbase payment handler
  const handleCryptoPayment = async () => {
    if (!estimate) return;
    
    setIsProcessing(true);
    try {
      const response = await apiRequest("/api/payments/coinbase/create-charge", {
        method: "POST",
        body: JSON.stringify({
          estimateId: estimate.id,
          amount: parseFloat(estimate.totalEstimate),
          description: `Painting Services - ${config.name}`,
          customerEmail: lead?.email,
        }),
      });

      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (error: any) {
      console.error("Coinbase error:", error);
      toast.error(error.message || "Failed to initiate crypto payment. Please try again.");
      setIsProcessing(false);
    }
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
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-border dark:border-white/10">
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
                  <div className="border-t border-border dark:border-white/10 pt-3 flex justify-between font-bold">
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

            {/* Payment Options */}
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
                      <div className="bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Pricing Tier</span>
                        </div>
                        <p className="font-medium capitalize">{estimate.pricingTier.replace(/_/g, " ")}</p>
                      </div>

                      {estimate.squareFootage && estimate.squareFootage > 0 && (
                        <div className="bg-white/5 rounded-xl p-4 border border-border dark:border-white/10">
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
                        <h2 className="font-bold">Choose Payment Method</h2>
                        <p className="text-xs text-muted-foreground">Select how you'd like to pay</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Credit Card Option - Stripe */}
                      <button
                        onClick={handleStripePayment}
                        disabled={isProcessing}
                        className="w-full text-left group"
                        data-testid="button-pay-stripe"
                      >
                        <div className="bg-white/5 rounded-xl p-5 border border-border dark:border-white/10 hover:border-accent/40 transition-all group-hover:bg-black/5 dark:bg-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">Credit / Debit Card</h3>
                                <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                              </div>
                            </div>
                            {isProcessing ? (
                              <Loader2 className="w-5 h-5 animate-spin text-accent" />
                            ) : (
                              <div className="text-accent font-bold">
                                ${parseFloat(estimate.totalEstimate).toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Shield className="w-3 h-3" />
                            <span>Powered by Stripe - Secure payment processing</span>
                          </div>
                        </div>
                      </button>

                      {/* Crypto Option - Coinbase */}
                      <button
                        onClick={handleCryptoPayment}
                        disabled={isProcessing}
                        className="w-full text-left group"
                        data-testid="button-pay-crypto"
                      >
                        <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/40 transition-all group-hover:from-orange-500/20 group-hover:to-purple-500/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/30 to-purple-500/30 flex items-center justify-center">
                                <Coins className="w-6 h-6 text-orange-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                  Pay with Crypto
                                  <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">NEW</span>
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <SiBitcoin className="w-4 h-4 text-orange-400" />
                                  <SiEthereum className="w-4 h-4 text-purple-400" />
                                  <span>Bitcoin, Ethereum & more</span>
                                </div>
                              </div>
                            </div>
                            {isProcessing ? (
                              <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
                            ) : (
                              <div className="text-orange-400 font-bold">
                                ${parseFloat(estimate.totalEstimate).toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Lock className="w-3 h-3" />
                            <span>Powered by Coinbase Commerce - Fast & secure</span>
                          </div>
                        </div>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPaymentStep("review")}
                      className="w-full mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="button-back-review"
                    >
                      Back to review
                    </button>
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
