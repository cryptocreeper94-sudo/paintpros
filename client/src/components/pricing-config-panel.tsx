import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTenant } from "@/context/TenantContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Save,
  Loader2,
  PaintBucket,
  DoorOpen,
  Layers
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

interface PricingConfigPanelProps {
  compact?: boolean;
}

export function PricingConfigPanel({ compact = false }: PricingConfigPanelProps) {
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
        title: "Pricing Saved",
        description: "Your estimator pricing has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save pricing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateConfig = (field: keyof EstimatorConfig, value: string) => {
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

  if (isLoading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </GlassCard>
    );
  }

  if (!config) {
    return (
      <GlassCard className="p-4">
        <div className="text-center py-8 text-muted-foreground">
          No pricing configuration found
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4" hoverEffect="subtle">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Estimator Pricing</h3>
        </div>
        <Button 
          size="sm"
          onClick={handleSave} 
          disabled={!hasChanges || saveMutation.isPending}
          data-testid="button-save-pricing"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" />
              Save
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PaintBucket className="w-4 h-4" />
          <span>Interior Painting (per sq ft)</span>
        </div>
        
        <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 md:grid-cols-3 gap-3"}>
          <div className="space-y-1">
            <Label htmlFor="wallsPerSqFt" className="text-xs">Walls Only</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="wallsPerSqFt"
                type="number"
                step="0.01"
                value={config.wallsPerSqFt}
                onChange={(e) => updateConfig('wallsPerSqFt', e.target.value)}
                className="pl-6 h-8 text-sm"
                data-testid="input-walls"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="ceilingsPerSqFt" className="text-xs">Ceilings</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="ceilingsPerSqFt"
                type="number"
                step="0.01"
                value={config.ceilingsPerSqFt}
                onChange={(e) => updateConfig('ceilingsPerSqFt', e.target.value)}
                className="pl-6 h-8 text-sm"
                data-testid="input-ceilings"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="trimPerSqFt" className="text-xs">Trim Only</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="trimPerSqFt"
                type="number"
                step="0.01"
                value={config.trimPerSqFt}
                onChange={(e) => updateConfig('trimPerSqFt', e.target.value)}
                className="pl-6 h-8 text-sm"
                data-testid="input-trim"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="wallsAndTrimPerSqFt" className="text-xs">Walls + Trim</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="wallsAndTrimPerSqFt"
                type="number"
                step="0.01"
                value={config.wallsAndTrimPerSqFt}
                onChange={(e) => updateConfig('wallsAndTrimPerSqFt', e.target.value)}
                className="pl-6 h-8 text-sm"
                data-testid="input-walls-trim"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fullJobPerSqFt" className="text-xs">Full Job</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="fullJobPerSqFt"
                type="number"
                step="0.01"
                value={config.fullJobPerSqFt}
                onChange={(e) => updateConfig('fullJobPerSqFt', e.target.value)}
                className="pl-6 h-8 text-sm"
                data-testid="input-full-job"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <DoorOpen className="w-4 h-4" />
            <span>Doors & Cabinets (per unit)</span>
          </div>
          
          <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-3"}>
            <div className="space-y-1">
              <Label htmlFor="doorsPerUnit" className="text-xs">Doors</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="doorsPerUnit"
                  type="number"
                  step="1"
                  value={config.doorsPerUnit}
                  onChange={(e) => updateConfig('doorsPerUnit', e.target.value)}
                  className="pl-6 h-8 text-sm"
                  data-testid="input-doors"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cabinetDoorsPerUnit" className="text-xs">Cabinet Doors</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="cabinetDoorsPerUnit"
                  type="number"
                  step="1"
                  value={config.cabinetDoorsPerUnit}
                  onChange={(e) => updateConfig('cabinetDoorsPerUnit', e.target.value)}
                  className="pl-6 h-8 text-sm"
                  data-testid="input-cabinet-doors"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cabinetDrawersPerUnit" className="text-xs">Cabinet Drawers</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="cabinetDrawersPerUnit"
                  type="number"
                  step="1"
                  value={config.cabinetDrawersPerUnit}
                  onChange={(e) => updateConfig('cabinetDrawersPerUnit', e.target.value)}
                  className="pl-6 h-8 text-sm"
                  data-testid="input-cabinet-drawers"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Layers className="w-4 h-4" />
            <span>Multipliers & Minimum</span>
          </div>
          
          <div className={compact ? "grid grid-cols-2 gap-3" : "grid grid-cols-3 gap-3"}>
            <div className="space-y-1">
              <Label htmlFor="minimumJobAmount" className="text-xs">Minimum Job</Label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input
                  id="minimumJobAmount"
                  type="number"
                  step="50"
                  value={config.minimumJobAmount}
                  onChange={(e) => updateConfig('minimumJobAmount', e.target.value)}
                  className="pl-6 h-8 text-sm"
                  data-testid="input-minimum"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="exteriorMultiplier" className="text-xs">Exterior Mult.</Label>
              <div className="relative">
                <Input
                  id="exteriorMultiplier"
                  type="number"
                  step="0.05"
                  value={config.exteriorMultiplier}
                  onChange={(e) => updateConfig('exteriorMultiplier', e.target.value)}
                  className="h-8 text-sm"
                  data-testid="input-exterior-mult"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">x</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="commercialMultiplier" className="text-xs">Commercial Mult.</Label>
              <div className="relative">
                <Input
                  id="commercialMultiplier"
                  type="number"
                  step="0.05"
                  value={config.commercialMultiplier}
                  onChange={(e) => updateConfig('commercialMultiplier', e.target.value)}
                  className="h-8 text-sm"
                  data-testid="input-commercial-mult"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
