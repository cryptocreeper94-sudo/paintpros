import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Lock, Search, FileCheck, ExternalLink, ChevronDown, Hash, Award, History, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FOUNDING_ASSETS } from "@shared/schema";
import { useTenant } from "@/context/TenantContext";

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
  const tenant = useTenant();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [qrExpanded, setQrExpanded] = useState(false);
  const [stamps, setStamps] = useState<BlockchainStamp[]>([]);
  const [loadingStamps, setLoadingStamps] = useState(false);
  const isDemo = tenant.id === "demo";
  const solanaLabel = isDemo ? "Painting Company Software" : "Painting Company";
  
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
  
  const tenantAsset = isDemo ? FOUNDING_ASSETS.PAINTPROS_PLATFORM : FOUNDING_ASSETS.NPP_GENESIS;
  const serialNumber = tenantAsset.number;
  const displaySerial = serialNumber.replace('#', '');
  const solscanUrl = isDemo 
    ? "https://solscan.io/account/PaintPros000000000002"
    : "https://solscan.io/account/NPP0000000001";

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
        
        <div className="space-y-2 pt-1">
          {/* Combined Header with QR and Serial */}
          <GlassCard className="p-3 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border-[#14F195]/20">
            <div className="flex gap-3">
              <button
                onClick={() => setQrExpanded(!qrExpanded)}
                className="rounded-lg bg-white p-1 block cursor-pointer hover:ring-2 hover:ring-[#14F195] transition-all self-start"
                data-testid="button-expand-qr"
                style={{ lineHeight: 0 }}
              >
                <QRCodeCanvas 
                  value={solscanUrl}
                  size={qrExpanded ? 120 : 60}
                  level="L"
                  includeMargin={false}
                  bgColor="#14F195"
                  fgColor="#000000"
                />
              </button>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white text-[8px] font-bold uppercase tracking-wider mb-1">
                  <Award className="w-2.5 h-2.5" />
                  {tenantAsset.badge}
                </div>
                <h3 className="text-sm font-display font-bold text-white leading-tight">
                  The <span className="text-[#14F195]">First</span> Solana-Verified <span className="text-[#14F195]">{solanaLabel}</span>
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-sm font-bold text-[#14F195]">{displaySerial}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <p className="text-xs text-muted-foreground px-1">
            <span className="text-[#14F195] font-medium">Blockchain verified</span> — Your documents are tamper-proof and permanently recorded.
          </p>

          {/* Compact Features Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setExpandedSection(expandedSection === feature.id ? null : feature.id)}
                className="text-left"
                data-testid={`button-solana-feature-${feature.id}`}
              >
                <GlassCard className="p-2 hover:border-accent/40 transition-all h-full">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <feature.icon className="w-3 h-3 text-accent flex-shrink-0" />
                    <h5 className="font-bold text-[10px] leading-tight">{feature.title}</h5>
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-tight">{feature.summary}</p>
                  {expandedSection === feature.id && (
                    <p className="text-[9px] text-muted-foreground/80 mt-1 pt-1 border-t border-white/10 leading-snug">
                      {feature.details}
                    </p>
                  )}
                </GlassCard>
              </button>
            ))}
          </div>

          {/* History & Verify Row */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setExpandedSection(expandedSection === 'history' ? null : 'history')}
              className="flex-1 text-left"
              data-testid="button-blockchain-history"
            >
              <GlassCard className="p-2 hover:border-[#14F195]/40 transition-all h-full">
                <div className="flex items-center gap-1.5">
                  <History className="w-3 h-3 text-[#14F195]" />
                  <span className="font-bold text-[10px]">History</span>
                  <span className="text-[9px] text-muted-foreground">({stamps.length})</span>
                  <ChevronDown className={`w-3 h-3 text-muted-foreground ml-auto transition-transform ${expandedSection === 'history' ? 'rotate-180' : ''}`} />
                </div>
              </GlassCard>
            </button>
            <a
              href={solscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              data-testid="link-verify-platform"
            >
              <GlassCard className="p-2 hover:border-[#14F195]/40 transition-all h-full bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20">
                <div className="flex items-center gap-1.5">
                  <Search className="w-3 h-3 text-[#14F195]" />
                  <span className="font-bold text-[10px] text-[#14F195]">Verify on Solana</span>
                  <ExternalLink className="w-3 h-3 text-[#14F195] ml-auto" />
                </div>
              </GlassCard>
            </a>
          </div>

          {/* Expandable History */}
          {expandedSection === 'history' && (
            <GlassCard className="p-2">
              {loadingStamps ? (
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              ) : stamps.length === 0 ? (
                <p className="text-[10px] text-muted-foreground/70">No stamps yet.</p>
              ) : (
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {stamps.slice(0, 5).map((stamp) => (
                    <div key={stamp.id} className="flex items-center gap-2 text-[9px]">
                      {stamp.status === 'confirmed' ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#14F195]" />
                      ) : (
                        <Clock className="w-2.5 h-2.5 text-yellow-400" />
                      )}
                      <span className="text-muted-foreground uppercase">{stamp.entityType}</span>
                      <span className="font-mono text-[#14F195]/70 truncate flex-1">{stamp.documentHash.substring(0, 16)}...</span>
                      {stamp.transactionSignature && (
                        <a
                          href={`https://explorer.solana.com/tx/${stamp.transactionSignature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#14F195] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}

          <p className="text-[8px] text-muted-foreground/50 text-center">
            Powered by Solana • Fast, secure, eco-friendly
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
