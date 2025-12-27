import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Calculator, Sparkles, Download, CheckCircle, ArrowRight, Smartphone, Share2, Copy, Check } from 'lucide-react';
import { Link } from 'wouter';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function EstimatorApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { toast } = useToast();
  
  const appUrl = typeof window !== 'undefined' ? `${window.location.origin}/estimator-app` : '';
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Paint Estimator',
          text: 'Get instant paint estimates with AI room scanning. Try it free!',
          url: appUrl
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShareOpen(true);
        }
      }
    } else {
      setShareOpen(true);
    }
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast({ title: 'Link copied!', description: 'Ready to paste and share' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Could not copy', description: 'Please copy the link manually', variant: 'destructive' });
    }
  };

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const features = [
    {
      icon: Camera,
      title: 'AI Room Scanner',
      description: 'Upload a photo, get accurate square footage instantly'
    },
    {
      icon: Calculator,
      title: 'Instant Estimates',
      description: 'Professional pricing estimates generated in seconds'
    },
    {
      icon: Sparkles,
      title: 'Color Visualizer',
      description: 'Preview any paint color on your actual walls'
    }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'AI Paint Estimator - Get Instant Quotes';
    
    const existingManifest = document.querySelector('link[rel="manifest"]');
    const originalManifestHref = existingManifest?.getAttribute('href') || '/manifest.json';
    if (existingManifest) {
      existingManifest.setAttribute('href', '/estimator/manifest.json');
    } else {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/estimator/manifest.json';
      document.head.appendChild(manifestLink);
    }
    
    let themeColor = document.querySelector('meta[name="theme-color"]');
    const originalThemeColor = themeColor?.getAttribute('content') || '#3a4f41';
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#4a90d9');
    
    const setMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    setMetaTag('og:title', 'AI Paint Estimator');
    setMetaTag('og:description', 'Get instant paint estimates with AI room scanning. Upload a photo, get professional quotes in seconds.');
    setMetaTag('og:image', `${window.location.origin}/pwa/estimator/icon-512.png`);
    setMetaTag('og:url', `${window.location.origin}/estimator-app`);
    setMetaTag('og:type', 'website');
    
    return () => {
      document.title = originalTitle;
      const manifestEl = document.querySelector('link[rel="manifest"]');
      if (manifestEl) {
        manifestEl.setAttribute('href', originalManifestHref);
      }
      const themeEl = document.querySelector('meta[name="theme-color"]');
      if (themeEl) {
        themeEl.setAttribute('content', originalThemeColor);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 mb-4">
              <Calculator className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">AI Paint Estimator</h1>
            <p className="text-slate-400">Professional estimates in seconds</p>
          </div>

          {!isInstalled && deferredPrompt && (
            <Card className="mb-6 border-blue-500/30 bg-slate-800/50 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Smartphone className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Install App</h3>
                    <p className="text-sm text-slate-400">Add to home screen for quick access</p>
                  </div>
                  <Button 
                    onClick={handleInstall} 
                    disabled={isInstalling}
                    className="gap-2"
                    data-testid="button-install-pwa"
                  >
                    <Download className="w-4 h-4" />
                    {isInstalling ? 'Installing...' : 'Install'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isInstalled && (
            <Card className="mb-6 border-green-500/30 bg-green-900/20 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">App installed on your device</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10">
                      <feature.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{feature.title}</h3>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <Link href="/estimator">
              <Button className="w-full gap-2" size="lg" data-testid="button-start-estimate">
                <Camera className="w-5 h-5" />
                Start New Estimate
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Link>
            
            <Link href="/estimator-pricing">
              <Button variant="outline" className="w-full gap-2" data-testid="button-view-plans">
                <Sparkles className="w-4 h-4" />
                View Plans
              </Button>
            </Link>
          </div>

          <Card className="mt-6 bg-slate-800/30 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="font-medium text-white mb-1">Share This App</h3>
                <p className="text-sm text-slate-400">Send to contractors or customers</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  className="flex-1 gap-2"
                  data-testid="button-share-app"
                >
                  <Share2 className="w-4 h-4" />
                  Share Link
                </Button>
                <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2" data-testid="button-show-qr">
                      QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                      <DialogTitle className="text-white text-center">Share AI Paint Estimator</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG 
                          value={appUrl} 
                          size={200}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <p className="text-sm text-slate-400 text-center">
                        Scan to open or screenshot to share
                      </p>
                      <div className="w-full flex gap-2">
                        <div className="flex-1 bg-slate-800 rounded px-3 py-2 text-sm text-slate-300 truncate">
                          {appUrl}
                        </div>
                        <Button 
                          onClick={handleCopyLink} 
                          size="icon" 
                          variant="outline"
                          data-testid="button-copy-link"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Badge variant="secondary" className="gap-1">
              Powered by PaintPros.io
            </Badge>
          </div>
      </div>
    </div>
  );
}
