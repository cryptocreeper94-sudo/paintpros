import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTenant } from "@/context/TenantContext";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PageLayout } from "@/components/layout/page-layout";
import { 
  Settings, 
  DollarSign, 
  Home, 
  Building2, 
  PaintBucket, 
  DoorOpen,
  Wrench,
  Camera,
  Mail,
  Save,
  Calculator,
  Zap,
  Users
} from "lucide-react";

interface EstimatorConfig {
  id?: number;
  tenantId: string;
  mode: "lead" | "full";
  wallsPerSqFt: string;
  ceilingsPerSqFt: string;
  trimPerSqFt: string;
  wallsAndTrimPerSqFt: string;
  fullJobPerSqFt: string;
  doorsPerUnit: string;
  cabinetDoorsPerUnit: string;
  cabinetDrawersPerUnit: string;
  minimumJobAmount: string;
  exteriorMultiplier: string;
  commercialMultiplier: string;
  drywallRepairPerSqFt: string;
  pressureWashingPerSqFt: string;
  deckStainingPerSqFt: string;
  collectPhotos: boolean;
  collectColors: boolean;
  requireContactInfo: boolean;
  notificationEmail: string | null;
  exists?: boolean;
}

export default function EstimatorConfigPage() {
  const tenant = useTenant();
  const { toast } = useToast();
  const [config, setConfig] = useState<EstimatorConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: fetchedConfig, isLoading } = useQuery<EstimatorConfig>({
    queryKey: ['/api/estimator-config', tenant.id],
    enabled: !!tenant.id,
  });

  useEffect(() => {
    if (fetchedConfig) {
      setConfig(fetchedConfig);
    }
  }, [fetchedConfig]);

  const saveMutation = useMutation({
    mutationFn: async (data: EstimatorConfig) => {
      return apiRequest('POST', '/api/estimator-config', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/estimator-config', tenant.id] });
      setHasChanges(false);
      toast({
        title: "Configuration Saved",
        description: "Your estimator settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateConfig = (field: keyof EstimatorConfig, value: any) => {
    if (config) {
      setConfig({ ...config, [field]: value });
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    if (config && tenant?.id) {
      saveMutation.mutate({ ...config, tenantId: tenant.id });
    }
  };

  if (isLoading || !config) {
    return (
      <PageLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading configuration...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" data-testid="text-page-title">
              <Calculator className="w-7 h-7 text-accent" />
              Estimator Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your pricing and lead collection settings
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || saveMutation.isPending}
            data-testid="button-save-config"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <BentoGrid className="auto-rows-auto">
          <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4}>
            <GlassCard className="p-4" hoverEffect="subtle">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Estimator Mode</h3>
                    <p className="text-sm text-muted-foreground">Choose how your estimator works</p>
                  </div>
                </div>
                <Tabs 
                  value={config.mode} 
                  onValueChange={(v) => updateConfig('mode', v as 'lead' | 'full')}
                  className="w-full md:w-auto"
                >
                  <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="lead" className="flex-1 md:flex-none gap-2" data-testid="tab-lead-mode">
                      <Users className="w-4 h-4" />
                      Lead Mode
                    </TabsTrigger>
                    <TabsTrigger value="full" className="flex-1 md:flex-none gap-2" data-testid="tab-full-mode">
                      <DollarSign className="w-4 h-4" />
                      Full Estimate
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                {config.mode === 'lead' ? (
                  <p className="text-sm">
                    <span className="font-medium">Lead Mode:</span> Homeowners can calculate project details and share them with you. 
                    No pricing is shown - perfect for viral lead generation.
                  </p>
                ) : (
                  <p className="text-sm">
                    <span className="font-medium">Full Estimate Mode:</span> Shows actual pricing based on your configured rates below. 
                    Customers see real estimates instantly.
                  </p>
                )}
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
            <GlassCard className="p-4 h-full" hoverEffect="subtle">
              <div className="flex items-center gap-2 mb-4">
                <PaintBucket className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Interior Painting Rates</h3>
                {config.mode === 'lead' && <Badge variant="secondary">Disabled in Lead Mode</Badge>}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallsPerSqFt">Walls Only ($/sqft)</Label>
                    <Input
                      id="wallsPerSqFt"
                      type="number"
                      step="0.01"
                      value={config.wallsPerSqFt}
                      onChange={(e) => updateConfig('wallsPerSqFt', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-walls-per-sqft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceilingsPerSqFt">Ceilings ($/sqft)</Label>
                    <Input
                      id="ceilingsPerSqFt"
                      type="number"
                      step="0.01"
                      value={config.ceilingsPerSqFt}
                      onChange={(e) => updateConfig('ceilingsPerSqFt', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-ceilings-per-sqft"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trimPerSqFt">Trim Only ($/sqft)</Label>
                    <Input
                      id="trimPerSqFt"
                      type="number"
                      step="0.01"
                      value={config.trimPerSqFt}
                      onChange={(e) => updateConfig('trimPerSqFt', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-trim-per-sqft"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallsAndTrimPerSqFt">Walls + Trim ($/sqft)</Label>
                    <Input
                      id="wallsAndTrimPerSqFt"
                      type="number"
                      step="0.01"
                      value={config.wallsAndTrimPerSqFt}
                      onChange={(e) => updateConfig('wallsAndTrimPerSqFt', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-walls-trim-per-sqft"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullJobPerSqFt">Full Job - Walls + Trim + Ceiling ($/sqft)</Label>
                  <Input
                    id="fullJobPerSqFt"
                    type="number"
                    step="0.01"
                    value={config.fullJobPerSqFt}
                    onChange={(e) => updateConfig('fullJobPerSqFt', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-full-job-per-sqft"
                  />
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4}>
            <GlassCard className="p-4 h-full" hoverEffect="subtle">
              <div className="flex items-center gap-2 mb-4">
                <DoorOpen className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Doors & Cabinets</h3>
                {config.mode === 'lead' && <Badge variant="secondary">Disabled in Lead Mode</Badge>}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doorsPerUnit">Interior Doors ($/door)</Label>
                  <Input
                    id="doorsPerUnit"
                    type="number"
                    step="1"
                    value={config.doorsPerUnit}
                    onChange={(e) => updateConfig('doorsPerUnit', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-doors-per-unit"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cabinetDoorsPerUnit">Cabinet Doors ($/door)</Label>
                    <Input
                      id="cabinetDoorsPerUnit"
                      type="number"
                      step="1"
                      value={config.cabinetDoorsPerUnit}
                      onChange={(e) => updateConfig('cabinetDoorsPerUnit', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-cabinet-doors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cabinetDrawersPerUnit">Cabinet Drawers ($/drawer)</Label>
                    <Input
                      id="cabinetDrawersPerUnit"
                      type="number"
                      step="1"
                      value={config.cabinetDrawersPerUnit}
                      onChange={(e) => updateConfig('cabinetDrawersPerUnit', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-cabinet-drawers"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="minimumJobAmount">Minimum Job Amount ($)</Label>
                    <Input
                      id="minimumJobAmount"
                      type="number"
                      step="50"
                      value={config.minimumJobAmount}
                      onChange={(e) => updateConfig('minimumJobAmount', e.target.value)}
                      disabled={config.mode === 'lead'}
                      data-testid="input-minimum-job"
                    />
                    <p className="text-xs text-muted-foreground">Smallest job you'll take</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4}>
            <GlassCard className="p-4 h-full" hoverEffect="subtle">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Multipliers</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exteriorMultiplier">Exterior Multiplier</Label>
                  <Input
                    id="exteriorMultiplier"
                    type="number"
                    step="0.05"
                    value={config.exteriorMultiplier}
                    onChange={(e) => updateConfig('exteriorMultiplier', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-exterior-multiplier"
                  />
                  <p className="text-xs text-muted-foreground">
                    1.25 = 25% more for exterior work
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commercialMultiplier">Commercial Multiplier</Label>
                  <Input
                    id="commercialMultiplier"
                    type="number"
                    step="0.05"
                    value={config.commercialMultiplier}
                    onChange={(e) => updateConfig('commercialMultiplier', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-commercial-multiplier"
                  />
                  <p className="text-xs text-muted-foreground">
                    1.15 = 15% more for commercial
                  </p>
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4}>
            <GlassCard className="p-4 h-full" hoverEffect="subtle">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Additional Services</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="drywallRepairPerSqFt">Drywall Repair ($/sqft)</Label>
                  <Input
                    id="drywallRepairPerSqFt"
                    type="number"
                    step="0.50"
                    value={config.drywallRepairPerSqFt}
                    onChange={(e) => updateConfig('drywallRepairPerSqFt', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-drywall-repair"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pressureWashingPerSqFt">Pressure Washing ($/sqft)</Label>
                  <Input
                    id="pressureWashingPerSqFt"
                    type="number"
                    step="0.05"
                    value={config.pressureWashingPerSqFt}
                    onChange={(e) => updateConfig('pressureWashingPerSqFt', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-pressure-washing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deckStainingPerSqFt">Deck Staining ($/sqft)</Label>
                  <Input
                    id="deckStainingPerSqFt"
                    type="number"
                    step="0.25"
                    value={config.deckStainingPerSqFt}
                    onChange={(e) => updateConfig('deckStainingPerSqFt', e.target.value)}
                    disabled={config.mode === 'lead'}
                    data-testid="input-deck-staining"
                  />
                </div>
              </div>
            </GlassCard>
          </BentoItem>

          <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4}>
            <GlassCard className="p-4 h-full" hoverEffect="subtle">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Lead Collection</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="collectPhotos" className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Request Photos
                    </Label>
                    <p className="text-xs text-muted-foreground">Ask for project photos</p>
                  </div>
                  <Switch
                    id="collectPhotos"
                    checked={config.collectPhotos}
                    onCheckedChange={(v) => updateConfig('collectPhotos', v)}
                    data-testid="switch-collect-photos"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="collectColors">Color Preferences</Label>
                    <p className="text-xs text-muted-foreground">Ask for color choices</p>
                  </div>
                  <Switch
                    id="collectColors"
                    checked={config.collectColors}
                    onCheckedChange={(v) => updateConfig('collectColors', v)}
                    data-testid="switch-collect-colors"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireContactInfo">Require Contact</Label>
                    <p className="text-xs text-muted-foreground">Must provide email/phone</p>
                  </div>
                  <Switch
                    id="requireContactInfo"
                    checked={config.requireContactInfo}
                    onCheckedChange={(v) => updateConfig('requireContactInfo', v)}
                    data-testid="switch-require-contact"
                  />
                </div>
                <div className="pt-2 border-t space-y-2">
                  <Label htmlFor="notificationEmail" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Notification Email
                  </Label>
                  <Input
                    id="notificationEmail"
                    type="email"
                    placeholder="leads@yourcompany.com"
                    value={config.notificationEmail || ''}
                    onChange={(e) => updateConfig('notificationEmail', e.target.value || null)}
                    data-testid="input-notification-email"
                  />
                </div>
              </div>
            </GlassCard>
          </BentoItem>
        </BentoGrid>
      </div>
    </PageLayout>
  );
}
