import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, Lock, Search, FileCheck, ExternalLink, ChevronDown, Hash, Award } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FOUNDING_ASSETS } from "@shared/schema";

interface SolanaVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SolanaVerifiedModal({ isOpen, onClose }: SolanaVerifiedModalProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const platformAsset = FOUNDING_ASSETS.ORBIT_PLATFORM;
  const serialNumber = platformAsset.number;
  const displaySerial = serialNumber.replace('#', '');
  const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(serialNumber)}`;

  const features = [
    {
      id: "security",
      icon: Lock,
      title: "Immutable Security",
      summary: "Your data is cryptographically secured on the Solana blockchain.",
      details: "Every estimate, contract, and transaction is hashed and timestamped on the Solana blockchain. This creates an unalterable record that can never be modified or deleted, protecting both you and our company."
    },
    {
      id: "verify",
      icon: Search,
      title: "Verifiable Records",
      summary: "Look up any document hash on the public blockchain.",
      details: "Each document you receive includes a unique blockchain hash. You can verify this hash on any Solana blockchain explorer to confirm its authenticity and timestamp. This proves exactly when your estimate or contract was created."
    },
    {
      id: "trust",
      icon: FileCheck,
      title: "Transparent Business",
      summary: "We prove our legitimacy with blockchain technology.",
      details: "Unlike traditional businesses that can alter records, our blockchain verification means every promise we make is permanently recorded. You can trust that your quote, warranty terms, and project details will never change without your knowledge."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-display">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195]">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            Solana Blockchain Verified
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <GlassCard className="p-4 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border-[#14F195]/20">
            <div className="flex gap-4">
              <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#14F195' }}>
                <QRCodeSVG 
                  value={verifyUrl}
                  size={100}
                  level="H"
                  includeMargin={false}
                  bgColor="#14F195"
                  fgColor="#000000"
                />
              </div>
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
              We use <span className="font-bold text-[#14F195]">Solana blockchain technology</span> to permanently record and verify all customer documents. This ensures complete transparency and trust in every transaction.
            </p>
          </GlassCard>

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">How It Works</h4>
            
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
            href={verifyUrl}
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
