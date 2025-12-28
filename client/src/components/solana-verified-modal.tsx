import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useTenant } from "@/context/TenantContext";

interface TenantRelease {
  id: string;
  version: string;
  hallmarkNumber: string;
  solanaTxSignature: string | null;
  solanaTxStatus: string;
  createdAt: string;
  tenantId: string;
}

interface SolanaVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SolanaVerifiedModal({ isOpen, onClose }: SolanaVerifiedModalProps) {
  const tenant = useTenant();
  const [latestRelease, setLatestRelease] = useState<TenantRelease | null>(null);
  const isDemo = tenant.id === "demo";
  const companyName = tenant.name;
  
  useEffect(() => {
    if (isOpen) {
      const tenantId = isDemo ? 'demo' : 'npp';
      fetch(`/api/releases/latest?tenantId=${tenantId}`)
        .then(res => res.json())
        .then(data => setLatestRelease(data))
        .catch(() => setLatestRelease(null));
    }
  }, [isOpen, isDemo]);
  
  const solscanUrl = latestRelease?.solanaTxSignature 
    ? `https://solscan.io/tx/${latestRelease.solanaTxSignature}`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg font-display">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#9945FF] to-[#14F195] shadow-[0_0_20px_rgba(20,241,149,0.4)]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-cyan-700 dark:text-[#14F195]">{companyName}</span> Verified
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 pt-1">
          {/* How We Protect You - Compact Description */}
          <GlassCard className="p-3 bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border-[#14F195]/20">
            <h3 className="text-xs font-display font-bold text-foreground dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-700 dark:text-[#14F195]" />
              How We Protect You
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Every estimate, contract, and warranty we create is <span className="text-cyan-700 dark:text-[#14F195] font-medium">permanently recorded on the Solana blockchain</span>. 
              Your documents are tamper-proof and can never be altered or deleted. Unlike traditional contractors, 
              our blockchain verification creates an immutable record that protects you from fraud.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
              <span className="text-cyan-700 dark:text-[#14F195] font-medium">Your guarantee:</span> Pricing, warranty terms, and project scope are locked in permanently—perfect for insurance claims or disputes.
            </p>
          </GlassCard>

          {/* Verify Our Data Button */}
          {solscanUrl ? (
            <a
              href={solscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              data-testid="link-verify-data-solscan"
            >
              <GlassCard className="p-3 bg-gradient-to-r from-[#9945FF]/30 to-[#14F195]/30 border-[#14F195]/40 hover:border-[#14F195]/60 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-1" style={{ lineHeight: 0 }}>
                      <QRCodeCanvas 
                        value={solscanUrl}
                        size={40}
                        level="L"
                        includeMargin={false}
                        bgColor="#14F195"
                        fgColor="#000000"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-cyan-700 dark:text-[#14F195]">
                        Verify Our Data Here
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        View our blockchain registry on Solscan
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-700 dark:text-[#14F195]" />
                </div>
              </GlassCard>
            </a>
          ) : (
            <GlassCard className="p-3 bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 border-[#14F195]/30">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-700 dark:text-[#14F195]" />
                <div>
                  <h4 className="font-display font-bold text-sm text-cyan-700 dark:text-[#14F195]">
                    {companyName} Verified
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Registered on Solana blockchain
                  </p>
                </div>
              </div>
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
