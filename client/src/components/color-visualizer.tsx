import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Paintbrush, Loader2, Download, RotateCcw, Palette, Sparkles, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import type { PaintColor } from "@shared/schema";

interface ColorVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  initialColor?: { hex: string; name: string };
}

export function ColorVisualizer({ isOpen, onClose, initialColor }: ColorVisualizerProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ hex: string; name: string } | null>(initialColor || null);
  const [intensity, setIntensity] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: colors } = useQuery<PaintColor[]>({
    queryKey: ["/api/paint-colors"],
  });

  // Sync selectedColor when initialColor changes or modal opens
  useEffect(() => {
    if (isOpen && initialColor) {
      setSelectedColor(initialColor);
    }
  }, [isOpen, initialColor]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setUploadedImage(null);
      setProcessedImage(null);
      setIntensity([50]);
      setAiAnalysis(null);
    }
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setProcessedImage(null);
      setAiAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const applyColorOverlay = async () => {
    if (!uploadedImage || !selectedColor) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/color-visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          colorHex: selectedColor.hex,
          colorName: selectedColor.name,
          intensity: intensity[0],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const result = await response.json();
      setAiAnalysis(result.analysis);
      
      applyCanvasOverlay(intensity[0] / 100);
    } catch (error) {
      console.error("Color visualization error:", error);
      applyCanvasOverlay(intensity[0] / 100);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCanvasOverlay = (opacityValue: number) => {
    if (!canvasRef.current || !uploadedImage || !selectedColor) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = opacityValue;
      ctx.fillStyle = selectedColor.hex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      setProcessedImage(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = uploadedImage;
  };

  useEffect(() => {
    if (uploadedImage && selectedColor && processedImage) {
      applyCanvasOverlay(intensity[0] / 100);
    }
  }, [intensity]);

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.download = `color-preview-${selectedColor?.name || "custom"}.jpg`;
    link.href = processedImage;
    link.click();
  };

  const reset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setSelectedColor(initialColor || null);
    setIntensity([50]);
    setAiAnalysis(null);
  };

  const colorFamilies = [
    { name: "Neutrals", colors: colors?.filter(c => c.category === "neutral" || c.category === "white")?.slice(0, 8) || [] },
    { name: "Blues", colors: colors?.filter(c => c.hexValue?.toLowerCase().match(/^#[0-9a-f]{2}[0-9a-f]{2}[6-9a-f]{2}$/i) || c.colorName?.toLowerCase().includes("blue"))?.slice(0, 8) || [] },
    { name: "Greens", colors: colors?.filter(c => c.colorName?.toLowerCase().includes("green") || c.colorName?.toLowerCase().includes("sage"))?.slice(0, 8) || [] },
    { name: "Warm Tones", colors: colors?.filter(c => c.category === "warm" || c.undertone === "warm")?.slice(0, 8) || [] },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl my-auto"
        >
          <GlassCard className="relative p-4 sm:p-6 border-accent/20 max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              data-testid="button-close-visualizer"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-center mb-6 pt-6 sm:pt-0">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center border border-accent/30">
                <Paintbrush className="w-7 h-7 text-accent" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2">AI Color Visualizer</h2>
              <p className="text-gray-600 text-sm">
                Upload a photo of your wall and see how different paint colors would look
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Image Upload/Preview */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                  {processedImage ? (
                    <img src={processedImage} alt="Color preview" className="w-full h-full object-cover" />
                  ) : uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded wall" className="w-full h-full object-cover" />
                  ) : (
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium">Upload a photo of your wall</p>
                      <p className="text-gray-400 text-sm mt-1">Click to browse or drag and drop</p>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {uploadedImage && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={reset}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    {processedImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadImage}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}

                {aiAnalysis && (
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{aiAnalysis}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Color Selection */}
              <div className="space-y-4">
                {/* Selected Color Preview */}
                {selectedColor && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div 
                      className="w-12 h-12 rounded-lg shadow-inner border border-gray-200"
                      style={{ backgroundColor: selectedColor.hex }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{selectedColor.name}</p>
                      <p className="text-sm text-gray-500">{selectedColor.hex}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}

                {/* Intensity Slider */}
                {uploadedImage && selectedColor && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Color Intensity</span>
                      <span className="text-gray-500">{intensity[0]}%</span>
                    </div>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      min={10}
                      max={90}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Apply Button */}
                {uploadedImage && selectedColor && (
                  <Button
                    onClick={applyColorOverlay}
                    disabled={isProcessing}
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                    data-testid="button-apply-color"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Applying Color...
                      </>
                    ) : (
                      <>
                        <Paintbrush className="w-4 h-4 mr-2" />
                        Apply Color to Wall
                      </>
                    )}
                  </Button>
                )}

                {/* Color Palette */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Select a Color
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {colorFamilies.map((family) => (
                      family.colors.length > 0 && (
                        <div key={family.name} className="space-y-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{family.name}</p>
                          <div className="grid grid-cols-8 gap-1">
                            {family.colors.map((color) => (
                              <button
                                key={color.id}
                                onClick={() => setSelectedColor({ hex: color.hexValue, name: color.colorName })}
                                className={`w-8 h-8 rounded-md shadow-sm border-2 transition-all hover:scale-110 ${
                                  selectedColor?.hex === color.hexValue 
                                    ? "border-accent ring-2 ring-accent/30" 
                                    : "border-gray-200"
                                }`}
                                style={{ backgroundColor: color.hexValue }}
                                title={color.colorName}
                                data-testid={`button-color-${color.id}`}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Quick Colors */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Popular Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { hex: "#F3EDE4", name: "Pure White" },
                      { hex: "#D1CBC0", name: "Agreeable Gray" },
                      { hex: "#34495E", name: "Naval" },
                      { hex: "#5F7167", name: "Retreat" },
                      { hex: "#C12B2B", name: "Caliente" },
                      { hex: "#4D6B4A", name: "Webster Green" },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                          selectedColor?.hex === color.hex
                            ? "bg-accent/10 border-accent text-accent"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <span 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ColorVisualizerCard({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onOpen}
      className="cursor-pointer"
    >
      <GlassCard className="p-6 bg-gradient-to-br from-accent/5 to-gold-400/5 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Paintbrush className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900">AI Color Visualizer</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload a photo of your wall and preview how different paint colors would look in your space.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded-lg bg-accent/10 text-xs text-accent font-medium">AI-Powered</span>
          <span className="px-2 py-1 rounded-lg bg-accent/10 text-xs text-accent font-medium">Instant Preview</span>
          <span className="px-2 py-1 rounded-lg bg-accent/10 text-xs text-accent font-medium">70+ Colors</span>
        </div>
      </GlassCard>
    </motion.div>
  );
}
