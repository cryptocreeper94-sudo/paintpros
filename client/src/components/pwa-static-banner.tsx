import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useTenant } from '@/context/TenantContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function PWAStaticBanner() {
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();
  const tenant = useTenant();
  const isMobile = useIsMobile();
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem('pwa-static-banner-dismissed');
    if (hasDismissed) {
      setDismissed(true);
    }
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-static-banner-dismissed', 'true');
  };

  if (!isMobile || dismissed || isInstalled) return null;

  return (
    <div 
      className="relative w-full bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border border-accent/30 rounded-xl p-4 md:p-5"
      data-testid="pwa-static-banner"
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors p-1"
        data-testid="button-dismiss-pwa-banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent/30 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-6 h-6 md:w-7 md:h-7 text-accent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm md:text-base mb-0.5 text-foreground">Add to Home Screen</h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
            {isIOS 
              ? `Tap the share button and select "Add to Home Screen" to install ${tenant.name}`
              : `Install ${tenant.name} for quick access to estimates and more!`
            }
          </p>
        </div>

        {canInstall && !isIOS && (
          <Button
            onClick={handleInstall}
            className="flex-shrink-0 bg-accent text-primary font-bold gap-2"
            data-testid="button-install-pwa-banner"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Install</span>
          </Button>
        )}
      </div>
    </div>
  );
}
