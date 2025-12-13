import { useState } from "react";
import { Facebook, Instagram, Linkedin, Shield, X } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { FOUNDING_ASSETS } from "@shared/schema";

interface ReleaseInfo {
  version: string;
  buildNumber: number;
  hallmarkNumber: string;
  solanaTxStatus: string;
  hallmarkDetails?: {
    blockchainTxSignature?: string;
    blockchainExplorerUrl?: string;
  };
}

export function Footer() {
  const tenant = useTenant();
  const [showModal, setShowModal] = useState(false);
  
  const { data: releaseInfo } = useQuery<ReleaseInfo>({
    queryKey: ['/api/releases/latest'],
    staleTime: 60000,
  });
  
  const version = releaseInfo?.version || "1.0.0";
  const buildNumber = releaseInfo?.buildNumber || 0;
  const hallmarkNumber = releaseInfo?.hallmarkNumber || FOUNDING_ASSETS.ORBIT_PLATFORM.number;
  const displayHallmark = hallmarkNumber.replace('#', '');
  
  const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(hallmarkNumber)}`;
  
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#4B5320]/20 backdrop-blur-md border-t border-white/10 text-[10px] md:text-xs text-muted-foreground h-[60px] flex items-center">
        <div className="w-full px-3 md:px-4 flex justify-evenly md:justify-between items-center">
          
          {/* Copyright */}
          <div className="whitespace-nowrap text-[9px] md:text-[10px]">
            © {new Date().getFullYear()} <span className="hidden sm:inline">{tenant.name}</span><span className="sm:hidden">NPP</span>
          </div>
          
          {/* Hallmark Badge */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 transition-all hover:scale-110 group"
            data-testid="button-hallmark-badge"
          >
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-fuchsia-400 group-hover:text-fuchsia-300 drop-shadow-[0_0_6px_rgba(236,72,153,0.8)]" />
            <span className="hidden md:inline text-fuchsia-300/90 font-mono text-[9px] group-hover:text-fuchsia-200">
              {displayHallmark}
            </span>
          </button>
          
          {/* Version */}
          <span className="text-muted-foreground/60 font-mono text-[8px] md:text-[9px]">
            v{version}
          </span>

          {/* Socials */}
          <div className="flex gap-2 md:gap-3">
            {tenant.social?.instagram && (
              <a href={tenant.social.instagram} className="hover:text-accent transition-colors"><Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>
            )}
            {tenant.social?.facebook && (
              <a href={tenant.social.facebook} className="hover:text-accent transition-colors"><Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>
            )}
            {tenant.social?.linkedin && (
              <a href={tenant.social.linkedin} className="hover:text-accent transition-colors"><Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>
            )}
            {!tenant.social?.instagram && !tenant.social?.facebook && !tenant.social?.linkedin && (
              <>
                <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>
                <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>
                <a href="#" className="hover:text-accent transition-colors"><Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" /></a>
              </>
            )}
          </div>
          
          {/* Desktop Links */}
          <div className="gap-4 whitespace-nowrap hidden md:flex">
            <a href="/investors" className="hover:text-accent transition-colors" data-testid="link-investors">Investors</a>
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a>
          </div>

        </div>
      </footer>

      {/* Hallmark Verification Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#2a2f1f] to-[#1a1d14] border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Solana Verified Platform</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="button-close-hallmark-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white rounded-xl">
                <QRCodeSVG 
                  value={verifyUrl}
                  size={150}
                  level="H"
                  includeMargin={false}
                />
              </div>
              
              {/* Hallmark Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hallmark ID:</span>
                  <span className="font-mono text-amber-400">{displayHallmark}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="font-mono text-white">v{version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Build:</span>
                  <span className="font-mono text-white">#{buildNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${
                    releaseInfo?.solanaTxStatus === 'confirmed' 
                      ? 'text-green-400' 
                      : releaseInfo?.solanaTxStatus === 'genesis'
                        ? 'text-amber-400'
                        : 'text-gray-400'
                  }`}>
                    {releaseInfo?.solanaTxStatus === 'confirmed' 
                      ? '✓ Blockchain Verified' 
                      : releaseInfo?.solanaTxStatus === 'genesis'
                        ? '★ Genesis Platform'
                        : 'Pending'}
                  </span>
                </div>
              </div>
              
              {/* Verification Link */}
              <a 
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-lg text-center hover:from-amber-400 hover:to-yellow-400 transition-all"
                data-testid="link-verify-hallmark"
              >
                Verify Authenticity
              </a>
              
              {/* Powered by */}
              <p className="text-center text-[10px] text-gray-500">
                Powered by ORBIT Hallmark System
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
