import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Lock, Search, FileCheck, ExternalLink, ChevronDown, Hash, Award, History, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FOUNDING_ASSETS } from "@shared/schema";

interface BlockchainStamp {
  id: string;
  entityType: string;
  entityId: string;
  documentHash: string;
  transactionSignature: string | null;
  network: string;
  slot: number | null;
  blockTime: string | null;
  status: string;
  createdAt: string;
}

interface SolanaVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SolanaVerifiedModal({ isOpen, onClose }: SolanaVerifiedModalProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [qrExpanded, setQrExpanded] = useState(false);
  const [stamps, setStamps] = useState<BlockchainStamp[]>([]);
  const [loadingStamps, setLoadingStamps] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setLoadingStamps(true);
      fetch('/api/blockchain/stamps')
        .then(res => res.json())
        .then(data => {
          setStamps(Array.isArray(data) ? data : []);
          setLoadingStamps(false);
        })
        .catch(() => {
          setStamps([]);
          setLoadingStamps(false);
        });
    }
  }, [isOpen]);
  
  const platformAsset = FOUNDING_ASSETS.ORBIT_PLATFORM;
  const serialNumber = platformAsset.number;
  const displaySerial = serialNumber.replace('#', '');
  const solscanUrl = "https://solscan.io/account/PaintPros000000000001";

  const features = [
    {
      id: "antifraud",
      icon: ShieldCheck,
      title: "Anti-Fraud Protection",
      summary: "Every document is tamper-proof and permanently recorded.",
      details: "Your estimates, contracts, and warranties are cryptographically hashed and stored on the Solana blockchain. No one—not even us—can alter or delete these records. This protects you from fraud, disputes, and 'he said, she said' situations."
    },
    {
      id: "recall",
      icon: Search,
      title: "Document Recall",
      summary: "Access your complete project history anytime.",
      details: "Lost your estimate? Forgot what was quoted? Every document we create for you is permanently stored with a blockchain timestamp. You can recall your paint colors, pricing agreements, warranty terms, and project details years from now."
    },
    {
      id: "verify",
      icon: FileCheck,
      title: "Instant Verification",
      summary: "Prove authenticity with one click.",
      details: "Each document includes a unique hash that can be verified on any Solana blockchain explorer. This proves exactly when your quote was created and that it hasn't been changed—perfect for insurance claims, warranties, or disputes."
    },
    {
      id: "trust",
      icon: Lock,
      title: "Transparent Business",
      summary: "We prove our legitimacy through technology.",
      details: "While other contractors can alter records and change their quotes, our blockchain verification means every promise is permanent. You can trust that your warranty terms, project scope, and pricing will never change without your knowledge."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-display">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] shadow-[0_0_20px_rgba(20,241,149,0.4)]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            Solana Blockchain Verified
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          {/* FIRST IN INDUSTRY Banner */}
          <GlassCard className="p-4 bg-gradient-to-r from-[#9945FF]/20 via-[#14F195]/10 to-[#9945FF]/20 border-[#14F195]/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF]/10 via-transparent to-[#14F195]/10 animate-pulse" />
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                <Award className="w-3 h-3" />
                Industry First
              </div>
              <h3 className="text-lg md:text-xl font-display font-bold text-white mb-1">
                The <span className="text-[#14F195]">First</span> Solana-Verified
                <br />Commercial & Residential <span className="text-[#14F195]">Painting Company</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Setting a new standard in contractor transparency and trust
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border-[#14F195]/20">
            <div className="flex gap-4">
              <button
                onClick={() => setQrExpanded(!qrExpanded)}
                className="rounded-lg bg-white p-1.5 block cursor-pointer hover:ring-2 hover:ring-[#14F195] transition-all self-start"
                data-testid="button-expand-qr"
                style={{ lineHeight: 0 }}
              >
                <div 
                  className="overflow-hidden"
                  style={{ 
                    width: qrExpanded ? 160 : 75, 
                    height: qrExpanded ? 160 : 75,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <QRCodeCanvas 
                    value={solscanUrl}
                    size={qrExpanded ? 160 : 75}
                    level="L"
                    includeMargin={false}
                    bgColor="#14F195"
                    fgColor="#000000"
                  />
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-[#14F195]" />
                  <span className="text-xs font-bold text-[#14F195] uppercase tracking-wide">{platformAsset.badge}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Serial Number:</span>
                  </div>
                  <p className="font-mono text-lg font-bold text-[#14F195] tracking-wider">{displaySerial}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Scan QR code or check footer to verify
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 border-accent/20">
            <p className="text-sm leading-relaxed">
              We use <span className="font-bold text-[#14F195]">Solana blockchain technology</span> to permanently record and verify all customer documents. Your estimates, contracts, and warranties are <span className="font-bold text-white">tamper-proof</span> and can be recalled anytime—protecting you from fraud and disputes.
            </p>
          </GlassCard>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Why This Matters</h4>
            
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setExpandedSection(expandedSection === feature.id ? null : feature.id)}
                className="w-full text-left"
                data-testid={`button-solana-feature-${feature.id}`}
              >
                <GlassCard className="p-3 hover:border-accent/40 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10 flex-shrink-0 mt-0.5">
                      <feature.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm">{feature.title}</h5>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSection === feature.id ? 'rotate-180' : ''}`} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{feature.summary}</p>
                      {expandedSection === feature.id && (
                        <p className="text-xs text-muted-foreground/80 mt-2 pt-2 border-t border-white/10 leading-relaxed">
                          {feature.details}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </button>
            ))}
          </div>

          <button
            onClick={() => setExpandedSection(expandedSection === 'history' ? null : 'history')}
            className="w-full text-left"
            data-testid="button-blockchain-history"
          >
            <GlassCard className="p-3 hover:border-[#14F195]/40 transition-all">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#14F195]/10 flex-shrink-0 mt-0.5">
                  <History className="w-4 h-4 text-[#14F195]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm">Blockchain Hash History</h5>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedSection === 'history' ? 'rotate-180' : ''}`} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stamps.length > 0 ? `${stamps.length} verified stamps on Solana` : 'View all blockchain stamps'}
                  </p>
                  {expandedSection === 'history' && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      {loadingStamps ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Loading stamps...
                        </div>
                      ) : stamps.length === 0 ? (
                        <p className="text-xs text-muted-foreground/70">
                          No blockchain stamps yet. Stamps are created when documents are verified.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                          {stamps.slice(0, 10).map((stamp) => (
                            <div key={stamp.id} className="p-2 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  {stamp.status === 'confirmed' ? (
                                    <CheckCircle2 className="w-3 h-3 text-[#14F195]" />
                                  ) : stamp.status === 'failed' ? (
                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                  ) : (
                                    <Clock className="w-3 h-3 text-yellow-400" />
                                  )}
                                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                    {stamp.entityType}
                                  </span>
                                </div>
                                <span className="text-[9px] text-muted-foreground/60">
                                  {stamp.createdAt ? new Date(stamp.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                              <p className="font-mono text-[9px] text-[#14F195]/80 break-all leading-relaxed">
                                {stamp.documentHash.substring(0, 32)}...
                              </p>
                              {stamp.transactionSignature && (
                                <a
                                  href={stamp.network === 'devnet' 
                                    ? `https://explorer.solana.com/tx/${stamp.transactionSignature}?cluster=devnet`
                                    : `https://explorer.solana.com/tx/${stamp.transactionSignature}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-[9px] text-[#14F195] hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View on Solana <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          ))}
                          {stamps.length > 10 && (
                            <p className="text-[10px] text-muted-foreground/60 text-center pt-1">
                              + {stamps.length - 10} more stamps
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </button>

          <GlassCard className="p-4">
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-accent" />
              Verify Your Documents
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Every estimate and contract includes a unique hash in the footer. You can verify this on the Solana blockchain:
            </p>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Copy the document hash from your estimate or contract</li>
              <li>Visit any Solana blockchain explorer</li>
              <li>Search for the transaction to see the timestamp and verification</li>
            </ol>
          </GlassCard>

          <a
            href={solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2.5 px-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-medium rounded-lg text-center hover:opacity-90 transition-all"
            data-testid="link-verify-platform"
          >
            Verify Platform Authenticity
          </a>

          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            data-testid="link-learn-solana"
          >
            <GlassCard className="p-3 hover:border-[#14F195]/40 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </div>
                  <span className="text-sm font-medium group-hover:text-[#14F195] transition-colors">Learn more about Solana</span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#14F195] transition-colors" />
              </div>
            </GlassCard>
          </a>

          <p className="text-[10px] text-muted-foreground/60 text-center">
            Powered by Solana blockchain • Fast, secure, and eco-friendly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
