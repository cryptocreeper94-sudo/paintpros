import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Calculator, Sparkles, Download, CheckCircle, ArrowRight, Smartphone } from 'lucide-react';
import { Link } from 'wouter';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function EstimatorApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

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
      description: 'Good, Better, Best pricing packages generated in seconds'
    },
    {
      icon: Sparkles,
      title: 'Color Visualizer',
      description: 'Preview any paint color on your actual walls'
    }
  ];

  useEffect(() => {
    document.title = 'AI Paint Estimator - Get Instant Quotes';
    
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', '/estimator/manifest.json');
    } else {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/estimator/manifest.json';
      document.head.appendChild(manifestLink);
    }
    
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#4a90d9');
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

          <div className="mt-8 text-center">
            <Badge variant="secondary" className="gap-1">
              Powered by PaintPros.io
            </Badge>
          </div>
      </div>
    </div>
  );
}
