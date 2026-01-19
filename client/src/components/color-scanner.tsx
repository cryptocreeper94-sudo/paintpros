import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  ScanLine, 
  X, 
  Check, 
  RefreshCw, 
  Crosshair,
  Store,
  ShoppingCart,
  ExternalLink,
  Upload,
  Sparkles,
  Palette
} from "lucide-react";
import { 
  PAINT_CATALOG, 
  findClosestByBrand, 
  getMatchQuality,
  type CatalogColor 
} from "@/data/paint-catalog";
import { cn } from "@/lib/utils";

interface ColorScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect?: (color: CatalogColor) => void;
}

interface ScannedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

const BRAND_INFO: Record<string, { name: string; storeUrl: string; logo?: string }> = {
  "sherwin-williams": { 
    name: "Sherwin-Williams",
    storeUrl: "https://www.sherwin-williams.com/en-us/color/"
  },
  "benjamin-moore": { 
    name: "Benjamin Moore",
    storeUrl: "https://www.benjaminmoore.com/en-us/paint-colors/"
  },
  "behr": { 
    name: "Behr (Home Depot)",
    storeUrl: "https://www.behr.com/consumer/colors/paint-colors/"
  },
  "ppg": { 
    name: "PPG",
    storeUrl: "https://www.ppgpaints.com/color/"
  },
  "valspar": { 
    name: "Valspar (Lowe's)",
    storeUrl: "https://www.valspar.com/en/colors/"
  }
};

export function ColorScanner({ isOpen, onClose, onColorSelect }: ColorScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [scannedColor, setScannedColor] = useState<ScannedColor | null>(null);
  const [matches, setMatches] = useState<Record<string, (CatalogColor & { distance: number })[]> | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
  const [isScanning, setIsScanning] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera access or upload an image.");
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const extractColorFromCanvas = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number): ScannedColor => {
    const size = 10;
    const imageData = ctx.getImageData(x - size/2, y - size/2, size, size);
    const data = imageData.data;
    
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    
    return { hex, rgb: { r, g, b } };
  }, []);

  const captureColor = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const x = Math.round((crosshairPos.x / 100) * canvas.width);
    const y = Math.round((crosshairPos.y / 100) * canvas.height);
    
    const color = extractColorFromCanvas(ctx, x, y);
    setScannedColor(color);
    
    const matchResults = findClosestByBrand(color.hex, 3);
    setMatches(matchResults);
    setSelectedBrand(null);
    
    setTimeout(() => setIsScanning(false), 500);
  }, [crosshairPos, extractColorFromCanvas]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const x = Math.round(img.width / 2);
      const y = Math.round(img.height / 2);
      
      const color = extractColorFromCanvas(ctx, x, y);
      setScannedColor(color);
      
      const matchResults = findClosestByBrand(color.hex, 3);
      setMatches(matchResults);
      setSelectedBrand(null);
      
      stopCamera();
    };
    img.src = URL.createObjectURL(file);
  }, [extractColorFromCanvas, stopCamera]);

  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshairPos({ x, y });
  }, []);

  const resetScanner = useCallback(() => {
    setScannedColor(null);
    setMatches(null);
    setSelectedBrand(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    if (isOpen && !scannedColor) {
      startCamera();
    }
    return () => {
      if (!isOpen) {
        stopCamera();
        resetScanner();
      }
    };
  }, [isOpen, scannedColor, startCamera, stopCamera, resetScanner]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10 p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <ScanLine className="w-5 h-5 text-accent" />
            Color Match Scanner
            <Badge variant="outline" className="ml-2 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          {!scannedColor ? (
            <>
              <div 
                className="relative bg-black rounded-xl overflow-hidden aspect-video cursor-crosshair"
                onClick={handleVideoClick}
              >
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {isStreaming && (
                  <motion.div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${crosshairPos.x}%`,
                      top: `${crosshairPos.y}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Crosshair className="w-12 h-12 text-white drop-shadow-lg" />
                  </motion.div>
                )}
                
                {!isStreaming && !error && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4 text-center">
                    <Camera className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                )}

                {isScanning && (
                  <motion.div 
                    className="absolute inset-0 bg-accent/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={captureColor}
                  disabled={!isStreaming}
                  className="flex-1"
                  data-testid="button-capture-color"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Color
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                  data-testid="button-upload-image"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Point your camera at any color and tap to position the crosshair, then capture. 
                We'll match it to paint colors from top brands.
              </p>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-20 h-20 rounded-xl shadow-lg border-4 border-white"
                      style={{ backgroundColor: scannedColor.hex }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Scanned Color</p>
                      <p className="text-2xl font-mono font-bold">{scannedColor.hex}</p>
                      <p className="text-xs text-muted-foreground">
                        RGB({scannedColor.rgb.r}, {scannedColor.rgb.g}, {scannedColor.rgb.b})
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={resetScanner}
                      data-testid="button-rescan"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassCard>
                
                {matches && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Palette className="w-4 h-4 text-accent" />
                      Best Matches by Brand
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(BRAND_INFO).map(brand => (
                        <Button
                          key={brand}
                          variant={selectedBrand === brand ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                          className="text-xs"
                          data-testid={`button-brand-${brand}`}
                        >
                          {BRAND_INFO[brand].name.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {Object.entries(matches)
                        .filter(([brand]) => !selectedBrand || brand === selectedBrand)
                        .map(([brand, colors]) => (
                          <div key={brand} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-muted-foreground">
                                {BRAND_INFO[brand].name}
                              </p>
                              <a 
                                href={BRAND_INFO[brand].storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                                data-testid={`link-store-${brand}`}
                              >
                                <Store className="w-3 h-3" />
                                Visit Store
                              </a>
                            </div>
                            
                            {colors.map((color, idx) => {
                              const quality = getMatchQuality(color.distance);
                              return (
                                <motion.div
                                  key={color.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                  <GlassCard 
                                    className={cn(
                                      "p-3 cursor-pointer transition-all",
                                      "hover:ring-2 hover:ring-accent/50"
                                    )}
                                    onClick={() => onColorSelect?.(color)}
                                    data-testid={`card-color-match-${color.id}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div 
                                        className="w-12 h-12 rounded-lg shadow border-2 border-white flex-shrink-0"
                                        style={{ backgroundColor: color.hex }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{color.name}</p>
                                        <p className="text-xs text-muted-foreground">{color.code}</p>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <Badge variant="secondary" className={cn("text-xs", quality.color)}>
                                          {quality.label}
                                        </Badge>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                          {color.distance.toFixed(1)} Delta-E
                                        </p>
                                      </div>
                                    </div>
                                  </GlassCard>
                                </motion.div>
                              );
                            })}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={resetScanner}
                    className="flex-1"
                    data-testid="button-scan-again"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scan Another
                  </Button>
                  <Button 
                    onClick={onClose}
                    className="flex-1"
                    data-testid="button-done"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Done
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
