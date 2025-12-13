import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Lock, X, Upload, AlertTriangle, Loader2, CheckCircle, Sparkles, Check } from "lucide-react";

interface ScanResult {
  estimatedSquareFootage: number;
  confidence: number;
  reasoning: string;
  roomType: string;
}

interface RoomScannerProps {
  leadId?: string;
  onScanComplete?: (squareFootage: number) => void;
  locked?: boolean;
  accentColor?: string;
}

export function RoomScannerCard({ locked = true, accentColor = "accent" }: { locked?: boolean; accentColor?: string }) {
  const [showModal, setShowModal] = useState(false);

  if (locked) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Coming Soon
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-${accentColor}/20 flex items-center justify-center`}>
              <Camera className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-muted-foreground">AI Room Scanner</h3>
          </div>
          <p className="text-sm text-muted-foreground/70 mb-4">
            Upload room photos for AI-powered square footage estimation. Uses OpenAI Vision to analyze dimensions.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-muted-foreground/60">AI Vision</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-muted-foreground/60">Auto Calibration</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-muted-foreground/60">±10-20% Accuracy</span>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setShowModal(true)}
        className="cursor-pointer"
      >
        <GlassCard className="p-6" glow>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-${accentColor}/20 flex items-center justify-center`}>
              <Camera className={`w-5 h-5 text-${accentColor}`} />
            </div>
            <h3 className="text-xl font-display font-bold">AI Room Scanner</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Upload room photos for AI-powered square footage estimation.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-lg bg-${accentColor}/10 text-xs text-${accentColor}`}>AI Vision</span>
            <span className={`px-2 py-1 rounded-lg bg-${accentColor}/10 text-xs text-${accentColor}`}>Auto Calibration</span>
          </div>
        </GlassCard>
      </motion.div>

      <RoomScannerModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}

interface RoomScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  onScanComplete?: (squareFootage: number) => void;
}

export function RoomScannerModal({ isOpen, onClose, leadId, onScanComplete }: RoomScannerModalProps) {
  const [scannerImage, setScannerImage] = useState<string | null>(null);
  const [scannerRoomType, setScannerRoomType] = useState("living_room");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setScannerImage(event.target?.result as string);
      setScanResult(null);
      setScanError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRoomScan = async () => {
    if (!scannerImage) return;
    
    setIsScanning(true);
    setScanError(null);
    setScanResult(null);

    try {
      const response = await fetch("/api/room-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: scannerImage,
          leadId: leadId || "dashboard-scan",
          roomType: scannerRoomType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze room");
      }

      const result = await response.json();
      setScanResult({
        estimatedSquareFootage: result.estimatedSquareFootage,
        confidence: result.confidence,
        reasoning: result.reasoning,
        roomType: result.roomType,
      });
    } catch (error: any) {
      console.error("Room scan error:", error);
      setScanError(error.message || "Failed to analyze room. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleApply = () => {
    if (scanResult && onScanComplete) {
      onScanComplete(Math.round(scanResult.estimatedSquareFootage));
    }
    handleClose();
  };

  const handleClose = () => {
    setScannerImage(null);
    setScanResult(null);
    setScanError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-gold-400/20 to-accent/30 blur-3xl opacity-50" />
              
              <GlassCard className="relative p-8 border-accent/20" glow>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  data-testid="button-close-scanner-modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center border border-accent/30">
                    <Camera className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-2">AI Room Scanner</h2>
                  <p className="text-muted-foreground text-sm">
                    Upload a photo of your room for AI-powered square footage estimation
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-accent mb-2">Calibration Tips for Best Results</p>
                      <ul className="text-muted-foreground space-y-1 text-xs">
                        <li><strong>1. Include a door</strong> - Standard doors are 6'8" (80") tall. This helps AI calibrate scale.</li>
                        <li><strong>2. Stand in corner</strong> - Capture 2 walls for better depth perception.</li>
                        <li><strong>3. Include furniture</strong> - Standard items (beds, sofas) provide additional scale reference.</li>
                        <li><strong>4. Good lighting</strong> - Well-lit rooms give clearer dimension cues.</li>
                        <li><strong>5. Landscape mode</strong> - Hold phone horizontally for wider field of view.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-400 mb-1">Disclaimer</p>
                      <ul className="text-muted-foreground space-y-1 text-xs">
                        <li>• AI estimates are approximations only (±10-20% accuracy)</li>
                        <li>• For final pricing, professional measurement is required</li>
                        <li>• Results improve with better calibration references</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Room Type</Label>
                  <select
                    value={scannerRoomType}
                    onChange={(e) => setScannerRoomType(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/20 text-foreground focus:border-accent/50 focus:outline-none"
                    data-testid="select-scanner-room-type"
                  >
                    <option value="living_room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="dining_room">Dining Room</option>
                    <option value="office">Office / Study</option>
                    <option value="hallway">Hallway</option>
                    <option value="basement">Basement</option>
                    <option value="garage">Garage</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  {!scannerImage ? (
                    <label className="block w-full h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-accent/50 transition-colors cursor-pointer bg-white/5">
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground">Click to upload room photo</p>
                        <p className="text-xs text-muted-foreground/60">JPG, PNG up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        data-testid="input-scanner-room-image"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={scannerImage}
                        alt="Room to scan"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setScannerImage(null);
                          setScanResult(null);
                          setScanError(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                        data-testid="button-clear-scanner-image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {scanError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <p className="text-red-400 text-sm">{scanError}</p>
                  </div>
                )}

                {scanResult && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-400 mb-2">Scan Complete!</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Estimated Sq Ft</p>
                            <p className="text-2xl font-bold text-foreground">
                              {Math.round(scanResult.estimatedSquareFootage)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <p className="text-lg font-bold text-foreground">
                              {scanResult.confidence}%
                            </p>
                          </div>
                        </div>
                        {scanResult.reasoning && (
                          <p className="text-xs text-muted-foreground mt-3 italic">
                            "{scanResult.reasoning}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!scanResult ? (
                    <FlipButton
                      onClick={handleRoomScan}
                      disabled={!scannerImage || isScanning}
                      className="flex-1"
                      data-testid="button-scan-room-modal"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Scan Room
                        </>
                      )}
                    </FlipButton>
                  ) : (
                    <FlipButton
                      onClick={onScanComplete ? handleApply : handleClose}
                      className="flex-1"
                      data-testid="button-apply-scanner-result"
                    >
                      <Check className="w-4 h-4" />
                      {onScanComplete 
                        ? `Use ${Math.round(scanResult.estimatedSquareFootage)} sq ft`
                        : "Done"
                      }
                    </FlipButton>
                  )}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
