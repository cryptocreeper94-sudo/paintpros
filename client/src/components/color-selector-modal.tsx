import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { Palette, ExternalLink } from "lucide-react";
import { useTenant } from "@/context/TenantContext";

interface ColorSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColorSelectorModal({ isOpen, onClose }: ColorSelectorModalProps) {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  
  const colorTools = [
    {
      name: "Sherwin-Williams",
      description: "ColorSnap Visualizer - Upload photos and try colors",
      url: "https://www.sherwin-williams.com/visualizer/",
      colors: ["#DC4405", "#005DAA", "#EEAB00", "#006F44"],
    },
    {
      name: "Benjamin Moore",
      description: "Personal Color Viewer - Explore 3,500+ colors",
      url: "https://www.benjaminmoore.com/en-us/color-overview/personal-color-viewer",
      colors: ["#C41E3A", "#1E4D2B", "#2B4865", "#9B870C"],
    },
    ...(isDemo ? [
      {
        name: "Behr",
        description: "ColorSmart - Home Depot's color matching tool",
        url: "https://www.behr.com/consumer/colors/paint-colors/",
        colors: ["#4A6276", "#A8B5A0", "#8B7355", "#BFB8AD"],
      },
      {
        name: "Valspar",
        description: "Virtual Painter - Lowe's color visualization",
        url: "https://www.valspar.com/en/colors/browse-colors",
        colors: ["#4B5E6B", "#3D5C52", "#C8D0D3", "#E5D9C7"],
      },
    ] : []),
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <Palette className="w-5 h-5 text-accent" />
            Choose Your Color Tool
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Select a paint brand to explore their color palette and visualization tools:
          </p>
          
          <div className="space-y-3">
            {colorTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid={`link-color-selector-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={onClose}
              >
                <GlassCard 
                  className="p-4 cursor-pointer hover:border-accent/40 transition-all group"
                  hoverEffect
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  
                  {/* Color preview swatches */}
                  <div className="flex gap-1.5 mt-3">
                    {tool.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-md shadow-inner border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 border border-white/10" />
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
          
          <p className="text-[10px] text-muted-foreground/60 text-center pt-2">
            Both tools are free to use and will open in a new tab
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
