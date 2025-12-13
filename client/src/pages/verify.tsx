import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, ExternalLink, ArrowLeft, Copy, Clock, User, FileText } from "lucide-react";
import { HallmarkBadge, HallmarkStamp, PoweredByOrbit } from "@/components/hallmark";
import { getAssetBadge, formatDate, truncateHash } from "@/lib/hallmark";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { toast } from "sonner";

interface HallmarkVerification {
  valid: boolean;
  hallmark?: {
    id: string;
    hallmarkNumber: string;
    assetNumber?: string;
    assetType: string;
    recipientName: string;
    recipientRole: string;
    contentHash: string;
    createdAt: string;
    verifiedAt?: string;
    blockchainTxSignature?: string;
    blockchainExplorerUrl?: string;
    metadata?: Record<string, any>;
  };
  badge?: {
    tier: string;
    color: string;
    icon: string;
    glow: string;
    edition?: string;
  };
  message?: string;
}

export default function Verify() {
  const params = useParams<{ hallmarkNumber: string }>();
  const hallmarkNumber = params.hallmarkNumber || "";

  const { data, isLoading, error } = useQuery<HallmarkVerification>({
    queryKey: ["/api/verify", hallmarkNumber],
    queryFn: async () => {
      const res = await fetch(`/api/verify/${encodeURIComponent(hallmarkNumber)}`);
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    enabled: !!hallmarkNumber,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Verifying hallmark...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
          <p className="text-muted-foreground mb-6">
            Unable to verify the hallmark. Please check the hallmark number and try again.
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const badge = data.badge || getAssetBadge(data.hallmark?.assetNumber || hallmarkNumber);
  const hallmark = data.hallmark;

  if (!data.valid || !hallmark) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Hallmark</h1>
          <p className="text-muted-foreground mb-4">
            {data.message || "This hallmark number does not exist in our system."}
          </p>
          <code className="block bg-muted px-4 py-2 rounded-lg text-sm font-mono mb-6">
            {hallmarkNumber}
          </code>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${badge.color} 0%, transparent 50%)`
        }}
      />

      <div className="container mx-auto px-4 py-8 relative">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle 
                className="w-20 h-20 mx-auto mb-4" 
                style={{ color: badge.color }}
              />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Verified Authentic</h1>
            <p className="text-muted-foreground">
              This document has been verified and is authentic
            </p>
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <HallmarkBadge
                hallmarkNumber={hallmark.hallmarkNumber}
                assetNumber={hallmark.assetNumber}
                size="lg"
              />

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{hallmark.recipientName}</h2>
                  <p className="text-muted-foreground capitalize">
                    {hallmark.recipientRole} • {hallmark.assetType.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Hallmark ID</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">{hallmark.hallmarkNumber}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(hallmark.hallmarkNumber)}
                        data-testid="button-copy-hallmark"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {hallmark.assetNumber && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Asset Number</span>
                      </div>
                      <code 
                        className="font-mono text-sm font-bold"
                        style={{ color: badge.color }}
                      >
                        {hallmark.assetNumber}
                      </code>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Issued</span>
                    </div>
                    <span className="text-sm">{formatDate(hallmark.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Content Hash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-muted-foreground">
                        {truncateHash(hallmark.contentHash, 10)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(hallmark.contentHash)}
                        data-testid="button-copy-hash"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {hallmark.blockchainTxSignature && (
            <GlassCard className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Blockchain Verified</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This hallmark has been permanently anchored to the Solana blockchain.
              </p>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <code className="font-mono text-xs break-all">
                  {truncateHash(hallmark.blockchainTxSignature, 16)}
                </code>
                {hallmark.blockchainExplorerUrl && (
                  <a
                    href={hallmark.blockchainExplorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-500 hover:underline text-sm ml-2"
                    data-testid="link-blockchain-explorer"
                  >
                    View
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </GlassCard>
          )}

          <div className="text-center pt-8 border-t border-border">
            <PoweredByOrbit size="lg" />
            <p className="text-xs text-muted-foreground mt-2">
              Secure document verification powered by ORBIT Hallmark System
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
