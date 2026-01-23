import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Megaphone, Download, Smartphone, CheckCircle, 
  Share, PlusSquare, MoreVertical, ArrowDown
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallMarketingPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Update manifest link to marketing manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/manifest-marketing.json');
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <PageLayout>
      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 bg-white/10 backdrop-blur-xl border-purple-500/30">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <Megaphone className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                NPP Marketing Hub
              </h1>
              <p className="text-purple-200">
                Your marketing command center
              </p>
            </div>

            {isInstalled ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-white font-medium">Already Installed!</p>
                <p className="text-purple-200 text-sm">
                  Look for the NPP Marketing Hub icon on your home screen.
                </p>
                <Button
                  onClick={() => window.location.href = '/marketing-hub'}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Open Marketing Hub
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Android / Chrome install button */}
                {deferredPrompt && (
                  <Button
                    onClick={handleInstall}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 py-6 text-lg"
                    data-testid="button-install-pwa"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Install App
                  </Button>
                )}

                {/* iOS Instructions */}
                {isIOS && !deferredPrompt && (
                  <div className="space-y-4">
                    <p className="text-white font-medium text-center">
                      Install on your iPhone:
                    </p>
                    <div className="bg-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                          <Share className="w-4 h-4" />
                        </div>
                        <span>1. Tap the <strong>Share</strong> button</span>
                      </div>
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                          <ArrowDown className="w-4 h-4" />
                        </div>
                        <span>2. Scroll down in the menu</span>
                      </div>
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                          <PlusSquare className="w-4 h-4" />
                        </div>
                        <span>3. Tap <strong>"Add to Home Screen"</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Android fallback instructions */}
                {isAndroid && !deferredPrompt && (
                  <div className="space-y-4">
                    <p className="text-white font-medium text-center">
                      Install on your Android:
                    </p>
                    <div className="bg-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                          <MoreVertical className="w-4 h-4" />
                        </div>
                        <span>1. Tap the <strong>menu</strong> (3 dots)</span>
                      </div>
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span>2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Desktop instructions */}
                {!isIOS && !isAndroid && !deferredPrompt && (
                  <div className="space-y-4">
                    <p className="text-white font-medium text-center">
                      Install on Desktop:
                    </p>
                    <div className="bg-white/10 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3 text-purple-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center">
                          <Download className="w-4 h-4" />
                        </div>
                        <span>Look for the install icon in your browser's address bar</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features list */}
                <div className="pt-4 border-t border-purple-500/30">
                  <p className="text-purple-200 text-sm mb-3">What you get:</p>
                  <ul className="space-y-2 text-sm text-purple-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Quick access from home screen
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Full-screen experience
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Stay logged in for 30 days
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Instant notifications (coming soon)
                    </li>
                  </ul>
                </div>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/marketing-hub'}
                  className="w-full border-purple-400 text-purple-200 hover:bg-purple-500/20"
                >
                  Continue to Web Version
                </Button>
              </div>
            )}

            <p className="text-xs text-purple-300/60 text-center mt-6">
              Powered by Orbit
            </p>
          </GlassCard>
        </motion.div>
      </main>
    </PageLayout>
  );
}
