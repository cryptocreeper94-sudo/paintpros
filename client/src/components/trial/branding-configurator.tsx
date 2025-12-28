import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Palette, Image, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";

interface BrandingConfiguratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trialId: string;
  trialSlug: string;
  currentBranding: {
    companyName: string;
    primaryColor: string;
    accentColor: string;
    logoUrl: string | null;
  };
  onSaveSuccess?: () => void;
}

const presetColors = [
  { name: "Forest Green", value: "#4A5D3E" },
  { name: "Ocean Blue", value: "#2563EB" },
  { name: "Sunset Orange", value: "#EA580C" },
  { name: "Royal Purple", value: "#7C3AED" },
  { name: "Crimson Red", value: "#DC2626" },
  { name: "Teal", value: "#0D9488" },
  { name: "Slate", value: "#475569" },
  { name: "Gold", value: "#CA8A04" },
];

export function BrandingConfigurator({ 
  open, 
  onOpenChange, 
  trialId, 
  trialSlug,
  currentBranding,
  onSaveSuccess
}: BrandingConfiguratorProps) {
  const { toast } = useToast();
  
  const [primaryColor, setPrimaryColor] = useState(currentBranding.primaryColor);
  const [accentColor, setAccentColor] = useState(currentBranding.accentColor);
  const [logoUrl, setLogoUrl] = useState(currentBranding.logoUrl || "");
  
  useEffect(() => {
    if (open) {
      setPrimaryColor(currentBranding.primaryColor);
      setAccentColor(currentBranding.accentColor);
      setLogoUrl(currentBranding.logoUrl || "");
    }
  }, [open, currentBranding]);
  
  const saveMutation = useMutation({
    mutationFn: async (data: { primaryColor: string; accentColor: string; logoUrl: string | null }) => {
      const response = await apiRequest("PATCH", `/api/trial/${trialId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trial', trialSlug] });
      toast({
        title: "Branding updated",
        description: "Your portal now reflects your brand colors.",
      });
      onSaveSuccess?.();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSave = () => {
    saveMutation.mutate({
      primaryColor,
      accentColor,
      logoUrl: logoUrl.trim() || null,
    });
  };
  
  const handleReset = () => {
    setPrimaryColor(currentBranding.primaryColor);
    setAccentColor(currentBranding.accentColor);
    setLogoUrl(currentBranding.logoUrl || "");
  };
  
  const hasChanges = 
    primaryColor !== currentBranding.primaryColor ||
    accentColor !== currentBranding.accentColor ||
    (logoUrl || null) !== currentBranding.logoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Customize Your Portal
          </DialogTitle>
          <DialogDescription>
            Add your brand colors and logo to personalize your painting portal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <GlassCard hoverEffect={false} glow="none" depth="shallow" className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                {currentBranding.companyName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{currentBranding.companyName}</p>
                <p className="text-sm text-slate-500">Live Preview</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                className="text-white"
              >
                Primary Button
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Accent Button
              </Button>
            </div>
          </GlassCard>
          
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4" />
                Primary Color
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 rounded-md border border-slate-200 cursor-pointer"
                  data-testid="input-primary-color"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                      setPrimaryColor(e.target.value);
                    }
                  }}
                  placeholder="#4A5D3E"
                  className="w-28 font-mono text-sm"
                  data-testid="input-primary-color-hex"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {presetColors.slice(0, 4).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setPrimaryColor(color.value)}
                    className={`w-8 h-8 rounded-md border-2 transition-all ${
                      primaryColor === color.value 
                        ? 'border-slate-900 scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    data-testid={`button-preset-primary-${color.name.toLowerCase().replace(' ', '-')}`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4" />
                Accent Color
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 rounded-md border border-slate-200 cursor-pointer"
                  data-testid="input-accent-color"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                      setAccentColor(e.target.value);
                    }
                  }}
                  placeholder="#5A6D4E"
                  className="w-28 font-mono text-sm"
                  data-testid="input-accent-color-hex"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {presetColors.slice(4).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={`w-8 h-8 rounded-md border-2 transition-all ${
                      accentColor === color.value 
                        ? 'border-slate-900 scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    data-testid={`button-preset-accent-${color.name.toLowerCase().replace(' ', '-')}`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4" />
                Logo URL
              </Label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/your-logo.png"
                data-testid="input-logo-url"
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter a URL to your company logo (PNG or JPG recommended)
              </p>
              {logoUrl && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    className="max-h-16 max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || saveMutation.isPending}
            data-testid="button-reset-branding"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saveMutation.isPending}
            data-testid="button-save-branding"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
