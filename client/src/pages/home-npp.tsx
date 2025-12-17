import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant } from "@/context/TenantContext";
import { ArrowRight, MapPin } from "lucide-react";
import { MessagingWidget } from "@/components/messaging-widget";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export default function HomeNPP() {
  const tenant = useTenant();
  const [zipCode, setZipCode] = useState("");

  const handleGetEstimate = () => {
    // NPP goes directly to estimate, demo requires ZIP
    if (tenant.id === "demo") {
      if (zipCode.length === 5) {
        window.location.href = `/estimate?zip=${zipCode}`;
      }
    } else {
      // NPP - go directly to estimate
      window.location.href = `/estimate`;
    }
  };

  return (
    <PageLayout>
      <main className="min-h-[calc(100vh-120px)] flex flex-col">
        {/* Hero Section - Minimalist with ZIP search */}
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto space-y-8">
            {/* Company tagline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Professional Painting
              <span className="block text-accent">Made Simple</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
              Get an instant estimate for your painting project in seconds.
            </p>

            {/* ZIP Code Search Box */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4">
              <div className="relative flex-1 w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  onKeyDown={(e) => e.key === "Enter" && handleGetEstimate()}
                  className="pl-10 h-12 text-lg"
                  data-testid="input-zip-code"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleGetEstimate}
                disabled={tenant.id === "demo" && zipCode.length !== 5}
                className="w-full sm:w-auto gap-2"
                data-testid="button-get-estimate"
              >
                Get Your Estimate
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Free estimates · No obligation · Licensed & Insured
            </p>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8">
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-xs">Scroll to learn more</span>
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Second Section - Additional content (placeholder) */}
        <section className="py-16 md:py-24 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
              Why Choose {tenant.name}?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="font-semibold text-lg">Get Your Quote</h3>
                <p className="text-muted-foreground text-sm">
                  Enter your ZIP and project details for an instant estimate.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="font-semibold text-lg">Schedule Service</h3>
                <p className="text-muted-foreground text-sm">
                  Pick a time that works for you through our easy booking system.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="font-semibold text-lg">Love Your Space</h3>
                <p className="text-muted-foreground text-sm">
                  Our professional crew transforms your space with precision.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <PWAInstallPrompt />
      <MessagingWidget 
        currentUserId="visitor"
        currentUserRole="visitor"
        currentUserName="Visitor"
      />
    </PageLayout>
  );
}
