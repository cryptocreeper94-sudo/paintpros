import { useState } from "react";
import { Facebook, Instagram, Linkedin, Shield, X, Sparkles, Calendar, Hash, ExternalLink, Users } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { FOUNDING_ASSETS } from "@shared/schema";
import { FooterWeatherWidget } from "@/components/FooterWeatherWidget";

interface ReleaseInfo {
  version: string;
  buildNumber: number;
  hallmarkNumber: string;
  solanaTxStatus: string;
  solanaTxSignature?: string;
  createdAt?: string;
  hallmarkDetails?: {
    blockchainTxSignature?: string;
    blockchainExplorerUrl?: string;
    metadata?: Record<string, any>;
  };
}

export function Footer() {
  const tenant = useTenant();
  const [showModal, setShowModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
    
  const { data: releaseInfo } = useQuery<ReleaseInfo>({
    queryKey: ['/api/releases/latest', tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/releases/latest?tenantId=${tenant.id}`);
      if (!res.ok) throw new Error('Failed to fetch release');
      return res.json();
    },
    staleTime: 60000,
  });
  
  const version = releaseInfo?.version || "1.0.0";
  const buildNumber = releaseInfo?.buildNumber || 0;
  const isDemo = tenant.id === "demo";
  const tenantAsset = isDemo ? FOUNDING_ASSETS.PAINTPROS_PLATFORM : FOUNDING_ASSETS.NPP_GENESIS;
  const hallmarkNumber = releaseInfo?.hallmarkNumber || tenantAsset.number;
  const displayHallmark = hallmarkNumber.replace('#', '');
  
  const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(hallmarkNumber)}`;
  
  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-transparent border-t border-white/10 text-[10px] md:text-xs text-muted-foreground h-[40px] max-h-[40px] flex items-center">
        <div className="w-full px-1 md:px-4 flex justify-between items-center">
          
          {/* Copyright */}
          <div className="whitespace-nowrap text-[9px] md:text-[10px] text-stone-600/90">
            {isDemo ? (
              <>
                <span className="hidden sm:inline">Powered by Darkwave Studios, LLC</span>
                <span className="sm:hidden">Darkwave Studios</span>
                <span className="ml-1">© 2025</span>
              </>
            ) : (
              <>
                © {new Date().getFullYear()} <span className="hidden sm:inline">{tenant.name}</span><span className="sm:hidden">{tenant.id === "lumepaint" ? "Lume" : "NPP"}</span>
              </>
            )}
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

          {/* Weather Widget */}
          <FooterWeatherWidget />
          
          {/* Version - Clickable */}
          <button
            onClick={() => setShowVersionModal(true)}
            className="font-mono text-[8px] md:text-[9px] transition-colors underline decoration-dotted underline-offset-2 text-amber-600/80 hover:text-amber-500"
            data-testid="button-version"
          >
            v{version}
          </button>

          {/* Socials - Show configured links or placeholders */}
          <div className="flex gap-2 md:gap-3 items-center">
            {tenant.social?.instagram ? (
              <a href={tenant.social.instagram} className="transition-all hover:scale-110" data-testid="link-instagram"><Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500/70 hover:text-pink-400" /></a>
            ) : (
              <a href="#" className="transition-all hover:scale-110" data-testid="link-instagram-placeholder"><Instagram className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-500/70 hover:text-pink-400" /></a>
            )}
            {tenant.social?.facebook ? (
              <a href={tenant.social.facebook} className="transition-all hover:scale-110" data-testid="link-facebook"><Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600/70 hover:text-blue-500" /></a>
            ) : (
              <a href="#" className="transition-all hover:scale-110" data-testid="link-facebook-placeholder"><Facebook className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600/70 hover:text-blue-500" /></a>
            )}
            {tenant.social?.linkedin ? (
              <a href={tenant.social.linkedin} className="transition-all hover:scale-110" data-testid="link-linkedin"><Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-600/70 hover:text-sky-500" /></a>
            ) : (
              <a href="#" className="transition-all hover:scale-110" data-testid="link-linkedin-placeholder"><Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-600/70 hover:text-sky-500" /></a>
            )}
            {/* Darkwave Smart Chain link for demo site */}
            {isDemo && (
              <a 
                href="https://dwsc.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-fuchsia-400/80 hover:text-fuchsia-300 transition-all hover:scale-105"
                title="Powered by Darkwave Smart Chain"
                data-testid="link-dwsc"
              >
                <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="text-[8px] md:text-[9px] font-medium hidden sm:inline">DWSC</span>
              </a>
            )}
          </div>
          
          {/* Team Button */}
          <a 
            href="/team" 
            className="flex items-center gap-1 text-emerald-700/70 hover:text-emerald-600 transition-colors text-[9px] md:text-[10px]"
            data-testid="link-team"
          >
            <Users className="w-3 h-3 md:w-3.5 md:h-3.5" />
            <span>Team</span>
          </a>
          
          {/* Desktop Links */}
          <div className="gap-4 whitespace-nowrap hidden md:flex text-stone-600/80">
            {isDemo && (
              <a href="/investors" className="hover:text-amber-600 transition-colors" data-testid="link-investors">Investors</a>
            )}
            <a href="/privacy" className="hover:text-amber-600 transition-colors" data-testid="link-privacy">Privacy Policy</a>
            <a href="/terms" className="hover:text-amber-600 transition-colors" data-testid="link-terms">Terms & Warranty</a>
          </div>

          
        </div>
      </footer>

      
      {/* Hallmark Verification Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 16px), 16px)', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)' }}
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white border border-amber-200 rounded-2xl p-5 max-w-sm w-full shadow-2xl max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">Solana Verified Platform</h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                data-testid="button-close-hallmark-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* First in Industry Badge */}
              <div className="bg-gradient-to-r from-purple-100 to-emerald-100 border border-emerald-300 rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Industry First</span>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  First Solana-Verified <span className="text-emerald-600">{tenant.id === "demo" ? "Painting Company Software" : "Painting Company"}</span>
                </p>
              </div>
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
                  <span className="text-gray-500">Hallmark ID:</span>
                  <span className="font-mono text-amber-600">{displayHallmark}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Version:</span>
                  <span className="font-mono text-gray-900">v{version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Build:</span>
                  <span className="font-mono text-gray-900">#{buildNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${
                    releaseInfo?.solanaTxStatus === 'confirmed' 
                      ? 'text-green-600' 
                      : releaseInfo?.solanaTxStatus === 'genesis'
                        ? 'text-amber-600'
                        : 'text-gray-500'
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
                {isDemo ? "ORBIT Hallmark System" : "Powered by ORBIT • NPP Verified"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Version Info Modal */}
      {showVersionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 16px), 16px)', paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)' }}
          onClick={() => setShowVersionModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#2a2f1f] to-[#1a1d14] border border-amber-500/30 rounded-2xl p-5 max-w-md w-full shadow-2xl max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Version {version}</h3>
              </div>
              <button 
                onClick={() => setShowVersionModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="button-close-version-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Version Details */}
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-400">Build:</span>
                  <span className="font-mono text-white">#{buildNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-400">Released:</span>
                  <span className="text-white">
                    {releaseInfo?.createdAt 
                      ? new Date(releaseInfo.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : 'Genesis Release'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${
                    releaseInfo?.solanaTxStatus === 'confirmed' 
                      ? 'text-green-400' 
                      : 'text-amber-400'
                  }`}>
                    {releaseInfo?.solanaTxStatus === 'confirmed' 
                      ? '✓ Blockchain Verified' 
                      : '★ Verified Platform'}
                  </span>
                </div>
              </div>

              {/* What's New */}
              <div>
                <h4 className="text-sm font-medium text-amber-400 mb-2">What's New in v{version}</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Automatic version stamping on deploy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Improved mobile layout with compact grid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Enhanced estimator with photo uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Solana blockchain verification</span>
                  </li>
                </ul>
              </div>

              {/* Blockchain Link */}
              {releaseInfo?.solanaTxSignature && (
                <a 
                  href={`https://explorer.solana.com/tx/${releaseInfo.solanaTxSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-medium rounded-lg text-center hover:from-purple-400 hover:to-fuchsia-400 transition-all"
                  data-testid="link-blockchain-tx"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Solana Explorer
                </a>
              )}
              
              {/* Powered by */}
              <p className="text-center text-[10px] text-gray-500">
                Paint Pros by ORBIT • Verified Software
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
