import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, ScanLine, Palette } from "lucide-react";
import { ColorVisualizer } from "@/components/color-visualizer";
import { ColorScanner } from "@/components/color-scanner";
import type { CatalogColor } from "@/data/paint-catalog";

export default function MaddieTools() {
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{ hex: string; name: string } | undefined>();

  const handleColorFromScanner = (color: CatalogColor) => {
    setSelectedColor({ hex: color.hex, name: color.name });
    setShowScanner(false);
    setShowVisualizer(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <Palette className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900" data-testid="text-page-title">
            Color Tools
          </h1>
          <p className="text-sm text-slate-500">
            Find the perfect color for your room
          </p>
        </div>

        <div className="grid gap-4">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-md border-slate-200"
            onClick={() => setShowVisualizer(true)}
            data-testid="card-room-visualizer"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Paintbrush className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900">Room Visualizer</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Upload a photo of your wall and preview how different paint colors would look in your space
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    data-testid="button-open-visualizer"
                  >
                    <Paintbrush className="w-4 h-4 mr-2" />
                    Open Visualizer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-md border-slate-200"
            onClick={() => setShowScanner(true)}
            data-testid="card-color-match"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <ScanLine className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900">Color Match</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Scan any color with your camera or upload a photo to find the closest matching paint from top brands
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    data-testid="button-open-scanner"
                  >
                    <ScanLine className="w-4 h-4 mr-2" />
                    Open Color Match
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-slate-400">
          Powered by PaintPros.io
        </p>
      </div>

      <ColorVisualizer
        isOpen={showVisualizer}
        onClose={() => setShowVisualizer(false)}
        initialColor={selectedColor}
        tenantId="demo"
      />

      <ColorScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onColorSelect={handleColorFromScanner}
      />
    </div>
  );
}
