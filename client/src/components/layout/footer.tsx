import { useState } from "react";
import { Facebook, Instagram, Linkedin, Shield, X, Sparkles, Calendar, Hash, ExternalLink, Send } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { FOUNDING_ASSETS } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import rollieMascot from "@assets/generated_images/rollie_transparent.png";

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
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  
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
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-[#344e41] border-t border-white/10 text-[10px] md:text-xs text-muted-foreground h-[40px] max-h-[40px] flex items-center">
        <div className="w-full px-3 md:px-4 flex justify-evenly md:justify-between items-center">
          
          {/* Copyright */}
          <div className="whitespace-nowrap text-[9px] md:text-[10px]">
            {isDemo ? (
              <>
                <span className="hidden sm:inline">Powered by Darkwave Studios, LLC</span>
                <span className="sm:hidden">Darkwave Studios</span>
                <span className="ml-1">© 2025</span>
              </>
            ) : (
              <>
                © {new Date().getFullYear()} <span className="hidden sm:inline">{tenant.name}</span><span className="sm:hidden">NPP</span>
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
          
          {/* Version - Clickable */}
          <button
            onClick={() => setShowVersionModal(true)}
            className="text-muted-foreground/60 font-mono text-[8px] md:text-[9px] hover:text-amber-400 transition-colors underline decoration-dotted underline-offset-2"
            data-testid="button-version"
          >
            v{version}
          </button>

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

          {/* AI Assistant - Rollie */}
          {tenant.features.aiAssistant && (
            <button
              onClick={() => setShowAiChat(!showAiChat)}
              className="relative hover:scale-110 transition-transform"
              data-testid="button-ai-assistant"
            >
              <img
                src={rollieMascot}
                alt="Rollie - AI Assistant"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
            </button>
          )}

        </div>
      </footer>

      {/* AI Chat Panel - Expands from footer */}
      <AnimatePresence>
        {showAiChat && tenant.features.aiAssistant && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-[40px] right-2 md:right-4 z-40 w-[calc(100%-1rem)] md:w-96 bg-background/95 backdrop-blur-xl border border-white/10 rounded-t-2xl shadow-2xl overflow-hidden"
            data-testid="panel-ai-chat"
          >
            <div className="p-3 md:p-4 border-b border-white/10 bg-gradient-to-r from-accent/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={rollieMascot}
                  alt="Rollie"
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
                <div>
                  <h3 className="font-bold text-sm">Rollie</h3>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground">Your painting assistant</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiChat(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="button-close-ai"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 md:p-4 h-40 md:h-48 overflow-y-auto">
              <div className="bg-accent/10 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground text-xs md:text-sm">
                  Hi! I'm Rollie, your Paint Pro assistant. I can help with:
                </p>
                <ul className="mt-2 space-y-1 text-[10px] md:text-xs text-muted-foreground/80">
                  <li>• Estimating your painting project</li>
                  <li>• Choosing the right colors</li>
                  <li>• Understanding our services</li>
                  <li>• Scheduling an appointment</li>
                </ul>
              </div>
            </div>

            <div className="p-2 md:p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && aiMessage.trim() && setAiMessage("")}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50"
                  data-testid="input-ai-message"
                />
                <button
                  onClick={() => aiMessage.trim() && setAiMessage("")}
                  className="p-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                  data-testid="button-send-ai"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {/* First in Industry Badge */}
              <div className="bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 border border-[#14F195]/30 rounded-lg p-3 text-center">
                <span className="text-[10px] font-bold text-[#14F195] uppercase tracking-wider">Industry First</span>
                <p className="text-sm font-semibold text-white mt-0.5">
                  First Solana-Verified <span className="text-[#14F195]">{tenant.id === "demo" ? "Painting Company Software" : "Painting Company"}</span>
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
                {isDemo ? "ORBIT Hallmark System" : "Powered by ORBIT • NPP Verified"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Version Info Modal */}
      {showVersionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowVersionModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-[#2a2f1f] to-[#1a1d14] border border-amber-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto"
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
