import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { ShieldCheck, ExternalLink, CheckCircle2, Waves } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useTenant } from "@/context/TenantContext";
import darkwaveLogo from "@assets/generated_images/darkwave_blockchain_logo_icon.png";

interface TenantRelease {
  id: string;
  version: string;
  hallmarkNumber: string;
  darkwaveTxSignature: string | null;
  darkwaveTxStatus: string;
  createdAt: string;
  tenantId: string;
  hallmarkDetails?: {
    darkwaveTxSignature?: string | null;
    darkwaveExplorerUrl?: string | null;
  } | null;
}

interface DarkwaveVerifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DarkwaveVerifiedModal({ isOpen, onClose }: DarkwaveVerifiedModalProps) {
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
  
  const darkwaveTxSig = latestRelease?.darkwaveTxSignature || latestRelease?.hallmarkDetails?.darkwaveTxSignature;
  const darkwaveExplorerUrl = darkwaveTxSig 
    ? (latestRelease?.hallmarkDetails?.darkwaveExplorerUrl || `https://explorer.darkwave.io/tx/${darkwaveTxSig}`)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg font-display">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="text-purple-700 dark:text-purple-400">{companyName}</span> Verified
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 pt-1">
          {/* Darkwave Logo Display */}
          <div className="flex justify-center mb-2">
            <img 
              src={darkwaveLogo} 
              alt="Darkwave Chain" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* How We Protect You - Compact Description */}
          <GlassCard className="p-3 bg-gradient-to-br from-[#7C3AED]/10 to-[#3B82F6]/10 border-[#7C3AED]/20">
            <h3 className="text-xs font-display font-bold text-foreground dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
              Dual-Chain Protection
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              In addition to Solana, your documents are <span className="text-purple-700 dark:text-purple-400 font-medium">verified on Darkwave Chain</span> for maximum security. 
              This dual-chain approach creates redundant, immutable records across two independent blockchains.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
              <span className="text-purple-700 dark:text-purple-400 font-medium">Enhanced security:</span> Even if one blockchain has issues, your records remain safe and verifiable on the other.
            </p>
          </GlassCard>

          {/* Verify Our Data Button */}
          {darkwaveExplorerUrl ? (
            <a
              href={darkwaveExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              data-testid="link-verify-data-darkwave"
            >
              <GlassCard className="p-3 bg-gradient-to-r from-[#7C3AED]/30 to-[#3B82F6]/30 border-[#7C3AED]/40 hover:border-[#7C3AED]/60 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-1" style={{ lineHeight: 0 }}>
                      <QRCodeCanvas 
                        value={darkwaveExplorerUrl}
                        size={40}
                        level="L"
                        includeMargin={false}
                        bgColor="#7C3AED"
                        fgColor="#FFFFFF"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-purple-700 dark:text-purple-400">
                        Verify on Darkwave
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        View our blockchain registry on Darkwave Explorer
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                </div>
              </GlassCard>
            </a>
          ) : (
            <GlassCard className="p-3 bg-gradient-to-r from-[#7C3AED]/20 to-[#3B82F6]/20 border-[#7C3AED]/30">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                <div>
                  <h4 className="font-display font-bold text-sm text-purple-700 dark:text-purple-400">
                    {companyName} Verified
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Registered on Darkwave Chain
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          <p className="text-[8px] text-muted-foreground/50 text-center">
            Powered by Darkwave Chain + Solana for dual-chain verification
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
