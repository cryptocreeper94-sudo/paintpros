import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, FileText, Pen, AlertCircle, Loader2, Calendar, DollarSign, CheckCircle, X } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import type { Proposal, ProposalSignature } from "@shared/schema";

export default function ProposalSign() {
  const [, params] = useRoute("/proposal/:id/sign");
  const proposalId = params?.id;
  const queryClient = useQueryClient();
  
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signError, setSignError] = useState("");
  
  const { data: proposal, isLoading, error } = useQuery<Proposal>({
    queryKey: ["/api/proposals", proposalId],
    queryFn: async () => {
      const res = await fetch(`/api/proposals/${proposalId}`);
      if (!res.ok) throw new Error("Proposal not found");
      return res.json();
    },
    enabled: !!proposalId,
  });

  const { data: existingSignature } = useQuery<ProposalSignature | null>({
    queryKey: ["/api/proposals", proposalId, "signature"],
    queryFn: async () => {
      const res = await fetch(`/api/proposals/${proposalId}/signature`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!proposalId,
  });

  const signMutation = useMutation({
    mutationFn: async ({ signatureData, signerName, signerEmail }: { signatureData: string; signerName: string; signerEmail: string }) => {
      const res = await fetch(`/api/proposals/${proposalId}/signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId,
          signatureData,
          signerName,
          signerEmail,
          ipAddress: null,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit signature");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals", proposalId, "signature"] });
      setShowSignatureModal(false);
      setSignError("");
    },
    onError: (err: any) => {
      setSignError(err.message || "Failed to submit signature");
    },
  });

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSign = () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setSignError("Please draw your signature");
      return;
    }
    if (!signerName.trim()) {
      setSignError("Please enter your name");
      return;
    }
    if (!signerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail)) {
      setSignError("Please enter a valid email");
      return;
    }

    const signatureData = sigCanvasRef.current.toDataURL("image/png");
    signMutation.mutate({ signatureData, signerName, signerEmail });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading proposal...</p>
          </div>
        </main>
      </PageLayout>
    );
  }

  if (error || !proposal) {
    return (
      <PageLayout>
        <main className="flex-1 flex items-center justify-center">
          <GlassCard className="p-8 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Proposal Not Found</h2>
            <p className="text-muted-foreground">
              This proposal link may be invalid or expired.
            </p>
          </GlassCard>
        </main>
      </PageLayout>
    );
  }

  const isSigned = proposal.status === "signed" || !!existingSignature;

  return (
    <PageLayout>
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Painting Proposal
            </h1>
            <p className="text-muted-foreground">
              Review and sign your proposal below
            </p>
          </div>

          {/* Proposal Details */}
          <GlassCard className="p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                <p className="text-lg font-semibold">{proposal.customerName || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                <p className="text-lg">{proposal.customerEmail || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                <p className="text-lg">{proposal.customerAddress || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="text-lg">{proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-white/10 pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                Pricing Summary
              </h3>
              <div className="flex justify-between py-4 border-t-2 border-accent/30">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-accent">
                  ${Number(proposal.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Proposal Content */}
            {proposal.content && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold mb-4">Proposal Details</h3>
                <div className="prose prose-invert max-w-none text-sm text-muted-foreground whitespace-pre-wrap">
                  {proposal.content}
                </div>
              </div>
            )}
          </GlassCard>

          {/* Signature Section */}
          <GlassCard className="p-8" glow>
            {isSigned ? (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/30 to-green-400/20 flex items-center justify-center border border-green-500/30"
                >
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-display font-bold mb-2 text-green-400">
                  Proposal Signed!
                </h2>
                <p className="text-muted-foreground mb-4">
                  This proposal was signed on{" "}
                  {existingSignature?.signedAt 
                    ? new Date(existingSignature.signedAt).toLocaleDateString() 
                    : "N/A"}
                </p>
                {existingSignature?.signatureData && (
                  <div className="inline-block bg-white/10 rounded-xl p-4 border border-white/20">
                    <img 
                      src={existingSignature.signatureData} 
                      alt="Signature" 
                      className="max-h-24"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Signed by: {existingSignature.signerName}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-gold-400/10 flex items-center justify-center">
                  <Pen className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-xl font-display font-bold mb-2">
                  Ready to Sign?
                </h2>
                <p className="text-muted-foreground mb-6">
                  By signing, you agree to the terms of this proposal
                </p>
                <FlipButton
                  onClick={() => setShowSignatureModal(true)}
                  className="px-8"
                  data-testid="button-open-signature"
                >
                  <Pen className="w-4 h-4 mr-2" />
                  Sign Proposal
                </FlipButton>
              </div>
            )}
          </GlassCard>
        </div>
      </main>

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignatureModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-4 sm:p-8 relative max-h-[90vh] overflow-y-auto" glow>
                <button
                  onClick={() => {
                    setShowSignatureModal(false);
                    setSignError("");
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  data-testid="button-close-signature-modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">
                    Sign Your Proposal
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Draw your signature below
                  </p>
                </div>

                {signError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {signError}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Full Name</label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="John Smith"
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/20 focus:border-accent/50 focus:outline-none"
                      data-testid="input-signer-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email</label>
                    <input
                      type="email"
                      value={signerEmail}
                      onChange={(e) => setSignerEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/20 focus:border-accent/50 focus:outline-none"
                      data-testid="input-signer-email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Signature</label>
                  <div className="relative bg-white rounded-xl overflow-hidden">
                    <SignatureCanvas
                      ref={sigCanvasRef}
                      penColor="black"
                      canvasProps={{
                        width: 400,
                        height: 150,
                        className: "w-full h-[150px] touch-none",
                        style: { touchAction: "none" }
                      }}
                      data-testid="canvas-signature"
                    />
                    <button
                      onClick={clearSignature}
                      className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
                      data-testid="button-clear-signature"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Draw your signature using your mouse or finger
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSignatureModal(false);
                      setSignError("");
                    }}
                    className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors"
                    data-testid="button-cancel-signature"
                  >
                    Cancel
                  </button>
                  <FlipButton
                    onClick={handleSign}
                    className="flex-1"
                    disabled={signMutation.isPending}
                    data-testid="button-submit-signature"
                  >
                    {signMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Sign & Submit
                      </>
                    )}
                  </FlipButton>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By signing, you agree to the terms outlined in this proposal
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
