import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useTenant } from '@/context/TenantContext';

export function PWAInstallPrompt() {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const tenant = useTenant();

  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
    if (canInstall && !isInstalled && !hasSeenPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (dismissed || isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        data-testid="pwa-install-prompt"
      >
        <div className="glass-panel rounded-2xl p-6 border border-accent/30 shadow-2xl">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-dismiss-pwa"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Install {tenant.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add to your home screen for quick access to estimates, scheduling, and more!
              </p>
              <button
                onClick={handleInstall}
                className="w-full py-3 px-4 bg-accent text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-lg"
                data-testid="button-install-pwa"
              >
                <Download className="w-5 h-5" />
                Install App
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
