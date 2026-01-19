import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowRight, ArrowLeft, Check, Building2, Palette, CreditCard, Zap, Brain,
  Paintbrush, Home, Wrench, Droplets, Leaf, HardHat, Wind, Upload, User, Mail, Phone, MapPin,
  CheckCircle2, Star, Calculator, Mic, Camera
} from "lucide-react";

const TRADE_VERTICALS = [
  { id: "painting", name: "Painting", nameEs: "Pintura", icon: Paintbrush, color: "#4A5D3E", description: "Interior & exterior painting services", descriptionEs: "Servicios de pintura interior y exterior" },
  { id: "roofing", name: "Roofing", nameEs: "Techos", icon: Home, color: "#dc2626", description: "Residential & commercial roofing", descriptionEs: "Techos residenciales y comerciales" },
  { id: "hvac", name: "HVAC", nameEs: "Climatización", icon: Wind, color: "#0ea5e9", description: "Heating, cooling & ventilation", descriptionEs: "Calefacción, refrigeración y ventilación" },
  { id: "electrical", name: "Electrical", nameEs: "Electricidad", icon: Zap, color: "#eab308", description: "Electrical installation & repair", descriptionEs: "Instalación y reparación eléctrica" },
  { id: "plumbing", name: "Plumbing", nameEs: "Plomería", icon: Droplets, color: "#2563eb", description: "Plumbing services & repairs", descriptionEs: "Servicios y reparaciones de plomería" },
  { id: "landscaping", name: "Landscaping", nameEs: "Jardinería", icon: Leaf, color: "#22c55e", description: "Landscape design & maintenance", descriptionEs: "Diseño y mantenimiento de jardines" },
  { id: "construction", name: "General Construction", nameEs: "Construcción General", icon: HardHat, color: "#78716c", description: "Remodeling & new construction", descriptionEs: "Remodelación y nueva construcción" },
];

const SUBSCRIPTION_TIERS = [
  { 
    id: "starter", 
    name: "Starter", 
    nameEs: "Inicial",
    price: 29, 
    subtitle: "Estimator Tool",
    subtitleEs: "Herramienta de Estimación",
    features: ["Online Estimator", "Lead Capture", "Basic CRM", "Email Support"],
    featuresEs: ["Estimador en Línea", "Captura de Leads", "CRM Básico", "Soporte por Email"],
    popular: false
  },
  { 
    id: "professional", 
    name: "Professional", 
    nameEs: "Profesional",
    price: 199, 
    subtitle: "Full Suite",
    subtitleEs: "Suite Completa",
    features: ["Everything in Starter", "Advanced CRM", "Unlimited Team", "Priority Support", "Analytics Dashboard"],
    featuresEs: ["Todo en Inicial", "CRM Avanzado", "Equipo Ilimitado", "Soporte Prioritario", "Panel de Análisis"],
    popular: true
  },
  { 
    id: "enterprise", 
    name: "Enterprise", 
    nameEs: "Empresarial",
    price: 499, 
    subtitle: "Franchise License",
    subtitleEs: "Licencia de Franquicia",
    features: ["Everything in Professional", "Multi-Location", "API Access", "Dedicated Account Manager", "Custom Integrations"],
    featuresEs: ["Todo en Profesional", "Multi-Ubicación", "Acceso API", "Gerente de Cuenta Dedicado", "Integraciones Personalizadas"],
    popular: false
  },
];

const TRADEWORKS_ADDON = {
  price: 29,
  features: ["85+ Trade Calculators", "AI Voice Assistant", "Photo Analysis", "Offline Mode", "Instant Estimates"],
  featuresEs: ["85+ Calculadoras de Oficios", "Asistente de Voz IA", "Análisis de Fotos", "Modo Sin Conexión", "Estimaciones Instantáneas"],
};

const onboardingSchema = z.object({
  // Step 1: Company Info
  companyName: z.string().min(2, "Company name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().optional(),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  
  // Step 2: Trade Vertical
  tradeVertical: z.string(),
  
  // Step 3: Branding
  primaryColor: z.string().default("#4A5D3E"),
  accentColor: z.string().default("#C4A052"),
  logoUrl: z.string().optional(),
  
  // Step 4: TradeWorks AI
  tradeworksEnabled: z.boolean().default(false),
  
  // Step 5: Subscription
  subscriptionTier: z.string().default("professional"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface TenantOnboardingWizardProps {
  onComplete?: (tenantId: string) => void;
}

export function TenantOnboardingWizard({ onComplete }: TenantOnboardingWizardProps) {
  const { language, t } = useI18n();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companyName: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      companyCity: "",
      companyState: "",
      tradeVertical: "painting",
      primaryColor: "#4A5D3E",
      accentColor: "#C4A052",
      logoUrl: "",
      tradeworksEnabled: false,
      subscriptionTier: "professional",
    },
  });

  const selectedTrade = TRADE_VERTICALS.find(t => t.id === form.watch("tradeVertical"));
  const selectedTier = SUBSCRIPTION_TIERS.find(t => t.id === form.watch("subscriptionTier"));
  const tradeworksEnabled = form.watch("tradeworksEnabled");

  const createTenantMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      const response = await apiRequest("POST", "/api/tenants/provision", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: language === 'es' ? "Sitio Creado" : "Site Created",
        description: language === 'es' 
          ? "Tu sitio web profesional está listo." 
          : "Your professional website is ready.",
      });
      onComplete?.(data.tenantId);
    },
    onError: (error: any) => {
      toast({
        title: language === 'es' ? "Error" : "Error",
        description: error.message || (language === 'es' ? "No se pudo crear el sitio" : "Failed to create site"),
        variant: "destructive",
      });
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: (keyof OnboardingFormData)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["companyName", "ownerName", "ownerEmail"];
        break;
      case 2:
        fieldsToValidate = ["tradeVertical"];
        break;
      case 3:
        fieldsToValidate = ["primaryColor"];
        break;
      case 4:
        fieldsToValidate = ["tradeworksEnabled"];
        break;
      case 5:
        fieldsToValidate = ["subscriptionTier"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        createTenantMutation.mutate(form.getValues());
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const calculateTotal = () => {
    const tierPrice = selectedTier?.price || 0;
    const tradeworksPrice = tradeworksEnabled ? TRADEWORKS_ADDON.price : 0;
    return tierPrice + tradeworksPrice;
  };

  const stepTitles = {
    1: { en: "Company Information", es: "Información de la Empresa" },
    2: { en: "Select Your Trade", es: "Selecciona Tu Oficio" },
    3: { en: "Brand Your Site", es: "Personaliza Tu Marca" },
    4: { en: "TradeWorks AI Toolkit", es: "Kit de Herramientas TradeWorks AI" },
    5: { en: "Choose Your Plan", es: "Elige Tu Plan" },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {language === 'es' ? 'Crea Tu Sitio Web Profesional' : 'Create Your Professional Website'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'Configura tu presencia en línea en minutos' 
              : 'Set up your online presence in minutes'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s < step 
                      ? 'bg-primary text-primary-foreground' 
                      : s === step 
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 5 && (
                  <div className={`w-8 md:w-16 h-1 ${s < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">
            {language === 'es' 
              ? stepTitles[step as keyof typeof stepTitles].es 
              : stepTitles[step as keyof typeof stepTitles].en}
          </h2>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <GlassCard className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Company Info */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {language === 'es' ? 'Nombre de la Empresa' : 'Company Name'}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="ABC Painting Co." {...field} data-testid="input-company-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {language === 'es' ? 'Nombre del Propietario' : 'Owner Name'}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} data-testid="input-owner-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ownerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {language === 'es' ? 'Email' : 'Email'}
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} data-testid="input-owner-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ownerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {language === 'es' ? 'Teléfono' : 'Phone'}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} data-testid="input-owner-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {language === 'es' ? 'Ciudad' : 'City'}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nashville" {...field} data-testid="input-company-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === 'es' ? 'Estado' : 'State'}</FormLabel>
                            <FormControl>
                              <Input placeholder="TN" {...field} data-testid="input-company-state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Trade Selection */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {TRADE_VERTICALS.map((trade) => {
                        const Icon = trade.icon;
                        const isSelected = form.watch("tradeVertical") === trade.id;
                        return (
                          <button
                            key={trade.id}
                            type="button"
                            onClick={() => {
                              form.setValue("tradeVertical", trade.id);
                              form.setValue("primaryColor", trade.color);
                            }}
                            className={`p-4 rounded-lg border-2 text-left transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            data-testid={`trade-${trade.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${trade.color}20`, color: trade.color }}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {language === 'es' ? trade.nameEs : trade.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {language === 'es' ? trade.descriptionEs : trade.description}
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Branding */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="primaryColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Palette className="w-4 h-4" />
                                {language === 'es' ? 'Color Principal' : 'Primary Color'}
                              </FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <input 
                                    type="color" 
                                    {...field} 
                                    className="w-12 h-10 rounded cursor-pointer"
                                    data-testid="input-primary-color"
                                  />
                                  <Input value={field.value} onChange={field.onChange} className="flex-1" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="accentColor"
                          render={({ field }) => (
                            <FormItem className="mt-4">
                              <FormLabel>{language === 'es' ? 'Color de Acento' : 'Accent Color'}</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <input 
                                    type="color" 
                                    {...field} 
                                    className="w-12 h-10 rounded cursor-pointer"
                                    data-testid="input-accent-color"
                                  />
                                  <Input value={field.value} onChange={field.onChange} className="flex-1" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="mt-4">
                          <Label className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            {language === 'es' ? 'Logo (Opcional)' : 'Logo (Optional)'}
                          </Label>
                          <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                            {language === 'es' 
                              ? 'Arrastra tu logo aquí o haz clic para subir' 
                              : 'Drag your logo here or click to upload'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Preview */}
                      <div>
                        <Label>{language === 'es' ? 'Vista Previa' : 'Preview'}</Label>
                        <div 
                          className="mt-2 rounded-lg p-6 text-white min-h-[200px]"
                          style={{ 
                            background: `linear-gradient(135deg, ${form.watch("primaryColor")} 0%, ${form.watch("accentColor")} 100%)` 
                          }}
                        >
                          <div className="text-2xl font-bold mb-2">{form.watch("companyName") || "Your Company"}</div>
                          <div className="text-white/80">
                            {selectedTrade && (language === 'es' ? selectedTrade.nameEs : selectedTrade.name)} {language === 'es' ? 'Profesionales' : 'Professionals'}
                          </div>
                          <Button className="mt-4 bg-white/20 hover:bg-white/30 text-white">
                            {language === 'es' ? 'Cotización Gratis' : 'Free Estimate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: TradeWorks AI */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-amber-900 via-orange-800 to-yellow-900 rounded-lg p-6 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <Brain className="w-10 h-10 text-yellow-400" />
                        <div>
                          <h3 className="text-2xl font-bold">TradeWorks AI</h3>
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            ${TRADEWORKS_ADDON.price}/{language === 'es' ? 'mes' : 'mo'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-white/80 mb-6">
                        {language === 'es'
                          ? 'Añade poderosas herramientas de cálculo con IA a tu sitio web y equipo de campo.'
                          : 'Add powerful AI-powered calculation tools to your website and field crew.'}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {(language === 'es' ? TRADEWORKS_ADDON.featuresEs : TRADEWORKS_ADDON.features).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
                            {i === 0 && <Calculator className="w-5 h-5 text-yellow-400" />}
                            {i === 1 && <Mic className="w-5 h-5 text-yellow-400" />}
                            {i === 2 && <Camera className="w-5 h-5 text-yellow-400" />}
                            {i === 3 && <Zap className="w-5 h-5 text-yellow-400" />}
                            {i === 4 && <CheckCircle2 className="w-5 h-5 text-yellow-400" />}
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="tradeworksEnabled"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                              <div>
                                <FormLabel className="text-white text-lg">
                                  {language === 'es' ? 'Añadir TradeWorks AI' : 'Add TradeWorks AI'}
                                </FormLabel>
                                <p className="text-white/70 text-sm">
                                  {language === 'es' 
                                    ? 'Potencia tu negocio con herramientas de IA' 
                                    : 'Power up your business with AI tools'}
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-tradeworks"
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Subscription */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {SUBSCRIPTION_TIERS.map((tier) => {
                        const isSelected = form.watch("subscriptionTier") === tier.id;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => form.setValue("subscriptionTier", tier.id)}
                            className={`relative p-6 rounded-lg border-2 text-left transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            data-testid={`tier-${tier.id}`}
                          >
                            {tier.popular && (
                              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                                <Star className="w-3 h-3 mr-1" />
                                {language === 'es' ? 'Popular' : 'Popular'}
                              </Badge>
                            )}
                            <div className="text-lg font-semibold">
                              {language === 'es' ? tier.nameEs : tier.name}
                            </div>
                            <div className="text-3xl font-bold my-2">
                              ${tier.price}
                              <span className="text-sm font-normal text-muted-foreground">
                                /{language === 'es' ? 'mes' : 'mo'}
                              </span>
                            </div>
                            <ul className="space-y-2 mt-4">
                              {(language === 'es' ? tier.featuresEs : tier.features).map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </button>
                        );
                      })}
                    </div>

                    {/* Order Summary */}
                    <GlassCard className="p-4 bg-muted/50">
                      <h4 className="font-semibold mb-3">
                        {language === 'es' ? 'Resumen del Pedido' : 'Order Summary'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{selectedTier?.name} {language === 'es' ? 'Plan' : 'Plan'}</span>
                          <span>${selectedTier?.price}/{language === 'es' ? 'mes' : 'mo'}</span>
                        </div>
                        {tradeworksEnabled && (
                          <div className="flex justify-between">
                            <span>TradeWorks AI</span>
                            <span>${TRADEWORKS_ADDON.price}/{language === 'es' ? 'mes' : 'mo'}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>${calculateTotal()}/{language === 'es' ? 'mes' : 'mo'}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="gap-2"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'es' ? 'Atrás' : 'Back'}
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={createTenantMutation.isPending}
                  className="gap-2"
                  data-testid="button-next"
                >
                  {createTenantMutation.isPending ? (
                    language === 'es' ? 'Creando...' : 'Creating...'
                  ) : step === totalSteps ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      {language === 'es' ? 'Completar y Pagar' : 'Complete & Pay'}
                    </>
                  ) : (
                    <>
                      {language === 'es' ? 'Continuar' : 'Continue'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </form>
        </Form>
      </div>
    </div>
  );
}
