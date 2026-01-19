import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function OnboardingSuccess() {
  const { language } = useI18n();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const tenantId = params.get("tenant");
  const sessionId = params.get("session_id");
  const [activating, setActivating] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (tenantId && sessionId) {
      fetch("/api/tenants/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, subscriptionId: sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setActivating(false);
          setActivated(data.success);
        })
        .catch(() => {
          setActivating(false);
        });
    } else {
      setActivating(false);
    }
  }, [tenantId, sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <GlassCard className="p-8 text-center">
          {activating ? (
            <div className="py-8">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold">
                {language === 'es' ? 'Activando tu sitio...' : 'Activating your site...'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {language === 'es' 
                  ? 'Esto solo tomará un momento' 
                  : 'This will just take a moment'}
              </p>
            </div>
          ) : activated ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <h1 className="text-2xl font-bold">
                    {language === 'es' ? '¡Felicidades!' : 'Congratulations!'}
                  </h1>
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                
                <p className="text-lg mb-6">
                  {language === 'es' 
                    ? 'Tu sitio web profesional está listo' 
                    : 'Your professional website is ready'}
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold mb-2">
                    {language === 'es' ? 'Próximos Pasos:' : 'Next Steps:'}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>
                        {language === 'es' 
                          ? 'Revisa tu email para las credenciales de acceso' 
                          : 'Check your email for login credentials'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>
                        {language === 'es' 
                          ? 'Personaliza tu perfil y servicios' 
                          : 'Customize your profile and services'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>
                        {language === 'es' 
                          ? 'Comparte tu nuevo sitio con clientes' 
                          : 'Share your new site with customers'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full gap-2"
                    onClick={() => window.open(`/admin`, '_blank')}
                    data-testid="button-go-to-dashboard"
                  >
                    {language === 'es' ? 'Ir al Panel de Control' : 'Go to Dashboard'}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setLocation("/")}
                    data-testid="button-view-site"
                  >
                    {language === 'es' ? 'Ver Mi Sitio' : 'View My Site'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="py-8">
              <h2 className="text-xl font-semibold text-destructive">
                {language === 'es' ? 'Error de Activación' : 'Activation Error'}
              </h2>
              <p className="text-muted-foreground mt-2 mb-6">
                {language === 'es' 
                  ? 'Hubo un problema activando tu sitio. Por favor contacta soporte.' 
                  : 'There was a problem activating your site. Please contact support.'}
              </p>
              <Button onClick={() => setLocation("/onboarding")} data-testid="button-try-again">
                {language === 'es' ? 'Intentar de Nuevo' : 'Try Again'}
              </Button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
