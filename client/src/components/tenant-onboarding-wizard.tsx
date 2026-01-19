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

const PLATFORM_TIERS = [
  { 
    id: "tools-only", 
    name: "Tools Only", 
    nameEs: "Solo Herramientas",
    price: 0, 
    subtitle: "Estimator Tools",
    subtitleEs: "Herramientas de Estimación",
    features: ["Trade Estimators", "Lead Capture", "Basic CRM"],
    featuresEs: ["Estimadores de Oficios", "Captura de Leads", "CRM Básico"],
    popular: false
  },
  { 
    id: "professional", 
    name: "Professional", 
    nameEs: "Profesional",
    price: 199, 
    subtitle: "Full Suite",
    subtitleEs: "Suite Completa",
    features: ["Professional Website", "Advanced CRM", "Unlimited Team", "Priority Support", "Analytics Dashboard"],
    featuresEs: ["Sitio Web Profesional", "CRM Avanzado", "Equipo Ilimitado", "Soporte Prioritario", "Panel de Análisis"],
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

const TRADE_PRICING = {
  single: 29,
  threeBundle: 59,
  allBundle: 99,
};

const COMBO_PRICING = {
  proAllTrades: 269,
  enterpriseAllTrades: 569,
};

function calculateTotalPrice(selectedTrades: string[], platformTier: string, billingInterval: 'month' | 'year'): number {
  const tradeCount = selectedTrades.length;
  let total = 0;
  
  const platform = PLATFORM_TIERS.find(t => t.id === platformTier);
  const hasPlatform = platformTier === 'professional' || platformTier === 'enterprise';
  
  if (hasPlatform && tradeCount === 6) {
    total = platformTier === 'enterprise' ? COMBO_PRICING.enterpriseAllTrades : COMBO_PRICING.proAllTrades;
  } else {
    if (platform) total += platform.price;
    
    if (tradeCount === 6) {
      total += TRADE_PRICING.allBundle;
    } else if (tradeCount >= 3) {
      total += TRADE_PRICING.threeBundle + (tradeCount - 3) * TRADE_PRICING.single;
    } else {
      total += tradeCount * TRADE_PRICING.single;
    }
  }
  
  if (billingInterval === 'year') {
    total = Math.round(total * 10);
  }
  
  return total;
}

const onboardingSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().optional(),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  tradeVertical: z.string(),
  selectedTrades: z.array(z.string()).default([]),
  primaryColor: z.string().default("#4A5D3E"),
  accentColor: z.string().default("#C4A052"),
  logoUrl: z.string().optional(),
  subscriptionTier: z.string().default("professional"),
  billingInterval: z.enum(["month", "year"]).default("month"),
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
      selectedTrades: ["painting"],
      primaryColor: "#4A5D3E",
      accentColor: "#C4A052",
      logoUrl: "",
      subscriptionTier: "professional",
      billingInterval: "month",
    },
  });

  const selectedTrade = TRADE_VERTICALS.find(t => t.id === form.watch("tradeVertical"));
  const selectedTier = PLATFORM_TIERS.find(t => t.id === form.watch("subscriptionTier"));
  const selectedTrades = form.watch("selectedTrades") || [];
  const billingInterval = form.watch("billingInterval");
  const totalPrice = calculateTotalPrice(selectedTrades, form.watch("subscriptionTier"), billingInterval);

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
        fieldsToValidate = ["selectedTrades"];
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

  const toggleTrade = (tradeId: string) => {
    const current = form.getValues("selectedTrades") || [];
    if (current.includes(tradeId)) {
      form.setValue("selectedTrades", current.filter((t: string) => t !== tradeId));
    } else {
      form.setValue("selectedTrades", [...current, tradeId]);
    }
  };

  const stepTitles = {
    1: { en: "Company Information", es: "Información de la Empresa" },
    2: { en: "Select Your Trade", es: "Selecciona Tu Oficio" },
    3: { en: "Brand Your Site", es: "Personaliza Tu Marca" },
    4: { en: "Estimator Tools", es: "Herramientas de Estimación" },
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

                {/* Step 4: Trade Selection */}
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
                        <Calculator className="w-10 h-10 text-yellow-400" />
                        <div>
                          <h3 className="text-2xl font-bold">
                            {language === 'es' ? 'Herramientas de Estimación' : 'Estimator Tools'}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {language === 'es' 
                              ? 'Selecciona los oficios para tu equipo' 
                              : 'Select trade tools for your team'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-yellow-400">$29</div>
                          <div className="text-white/70">{language === 'es' ? '1 oficio' : '1 trade'}</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-yellow-400">$59</div>
                          <div className="text-white/70">{language === 'es' ? '3 oficios' : '3 trades'}</div>
                          <Badge className="bg-green-500/20 text-green-300 text-xs mt-1">
                            {language === 'es' ? 'Ahorra $28' : 'Save $28'}
                          </Badge>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <div className="text-2xl font-bold text-yellow-400">$99</div>
                          <div className="text-white/70">{language === 'es' ? '6 oficios' : 'All 6'}  </div>
                          <Badge className="bg-green-500/20 text-green-300 text-xs mt-1">
                            {language === 'es' ? 'Ahorra $75' : 'Save $75'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {TRADE_VERTICALS.filter(t => t.id !== 'construction').map((trade) => {
                          const isSelected = selectedTrades.includes(trade.id);
                          const TradeIcon = trade.icon;
                          return (
                            <button
                              key={trade.id}
                              type="button"
                              onClick={() => toggleTrade(trade.id)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                isSelected 
                                  ? 'border-yellow-400 bg-yellow-400/20' 
                                  : 'border-white/20 hover:border-white/40 bg-white/5'
                              }`}
                              data-testid={`trade-tool-${trade.id}`}
                            >
                              <div className="flex items-center gap-2">
                                <TradeIcon className="w-5 h-5" style={{ color: trade.color }} />
                                <span className="font-medium">
                                  {language === 'es' ? trade.nameEs : trade.name}
                                </span>
                                {isSelected && <Check className="w-4 h-4 text-yellow-400 ml-auto" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 p-3 bg-white/10 rounded-lg flex items-center justify-between">
                        <span className="font-medium">
                          {language === 'es' ? 'Herramientas seleccionadas' : 'Selected tools'}: {selectedTrades.length}
                        </span>
                        <span className="text-yellow-400 font-bold">
                          ${selectedTrades.length === 6 ? 99 : selectedTrades.length >= 3 ? 59 + (selectedTrades.length - 3) * 29 : selectedTrades.length * 29}/{language === 'es' ? 'mes' : 'mo'}
                        </span>
                      </div>
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
                    {/* Billing Interval Toggle */}
                    <div className="flex justify-center">
                      <Tabs value={billingInterval} onValueChange={(v) => form.setValue("billingInterval", v as "month" | "year")}>
                        <TabsList>
                          <TabsTrigger value="month" data-testid="billing-monthly">
                            {language === 'es' ? 'Mensual' : 'Monthly'}
                          </TabsTrigger>
                          <TabsTrigger value="year" data-testid="billing-annual">
                            {language === 'es' ? 'Anual' : 'Annual'}
                            <Badge className="ml-2 bg-green-500/20 text-green-600 text-xs">
                              {language === 'es' ? '2 meses gratis' : '2 months free'}
                            </Badge>
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {PLATFORM_TIERS.map((tier) => {
                        const isSelected = form.watch("subscriptionTier") === tier.id;
                        const displayPrice = billingInterval === 'year' ? Math.round(tier.price * 10) : tier.price;
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
                            <div className="text-sm text-muted-foreground mb-2">
                              {language === 'es' ? tier.subtitleEs : tier.subtitle}
                            </div>
                            <div className="text-3xl font-bold my-2">
                              {tier.price === 0 ? (language === 'es' ? 'Gratis' : 'Free') : `$${displayPrice}`}
                              {tier.price > 0 && (
                                <span className="text-sm font-normal text-muted-foreground">
                                  /{billingInterval === 'year' ? (language === 'es' ? 'año' : 'yr') : (language === 'es' ? 'mes' : 'mo')}
                                </span>
                              )}
                            </div>
                            <ul className="space-y-2 mt-4">
                              {(language === 'es' ? tier.featuresEs : tier.features).map((feature: string, i: number) => (
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
                        {selectedTier && selectedTier.price > 0 && (
                          <div className="flex justify-between">
                            <span>{language === 'es' ? selectedTier.nameEs : selectedTier.name} {language === 'es' ? 'Plataforma' : 'Platform'}</span>
                            <span>${billingInterval === 'year' ? Math.round(selectedTier.price * 10) : selectedTier.price}/{billingInterval === 'year' ? (language === 'es' ? 'año' : 'yr') : (language === 'es' ? 'mes' : 'mo')}</span>
                          </div>
                        )}
                        {selectedTrades.length > 0 && (
                          <div className="flex justify-between">
                            <span>{language === 'es' ? 'Herramientas' : 'Estimator Tools'} ({selectedTrades.length})</span>
                            <span>
                              ${billingInterval === 'year' 
                                ? Math.round((selectedTrades.length === 6 ? 99 : selectedTrades.length >= 3 ? 59 + (selectedTrades.length - 3) * 29 : selectedTrades.length * 29) * 10)
                                : (selectedTrades.length === 6 ? 99 : selectedTrades.length >= 3 ? 59 + (selectedTrades.length - 3) * 29 : selectedTrades.length * 29)
                              }/{billingInterval === 'year' ? (language === 'es' ? 'año' : 'yr') : (language === 'es' ? 'mes' : 'mo')}
                            </span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>${totalPrice}/{billingInterval === 'year' ? (language === 'es' ? 'año' : 'yr') : (language === 'es' ? 'mes' : 'mo')}</span>
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
