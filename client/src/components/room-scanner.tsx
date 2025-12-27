import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Lock, X, Upload, AlertTriangle, Loader2, CheckCircle, Sparkles, Check } from "lucide-react";

interface ScanResult {
  estimatedSquareFootage: number;
  wallSurfaceSqft?: number;
  confidence: number;
  reasoning: string;
  roomType: string;
  referenceObjectsUsed?: string[];
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
        wallSurfaceSqft: result.wallSurfaceSqft,
        confidence: result.confidence,
        reasoning: result.reasoning,
        roomType: result.roomType,
        referenceObjectsUsed: result.referenceObjectsUsed,
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg my-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-gold-400/20 to-accent/30 blur-3xl opacity-50" />
              
              <GlassCard className="relative p-4 sm:p-6 md:p-8 border-accent/20 max-h-[calc(100dvh-2rem)] overflow-y-auto" glow>
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-11 h-11 min-h-[44px] min-w-[44px] rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors touch-manipulation"
                  data-testid="button-close-scanner-modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-4 sm:mb-6 pt-8 sm:pt-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center border border-accent/30">
                    <Camera className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">AI Room Scanner</h2>
                  <p className="text-muted-foreground text-sm px-2">
                    Snap or upload a photo for AI-powered square footage estimation
                  </p>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Camera className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 hidden sm:block" />
                    <div className="text-sm">
                      <p className="font-medium text-accent mb-1.5 sm:mb-2 text-xs sm:text-sm">📷 Tips for Best Results</p>
                      <ul className="text-muted-foreground space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs leading-relaxed">
                        <li><strong>Include a door</strong> - Helps AI calibrate scale</li>
                        <li><strong>Stand in corner</strong> - Capture 2 walls</li>
                        <li><strong>Good lighting</strong> - Clearer dimension cues</li>
                        <li className="hidden sm:list-item"><strong>Landscape mode</strong> - Wider field of view</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <p className="font-medium text-amber-400 mb-1">Disclaimer</p>
                      <p className="text-muted-foreground text-[11px] sm:text-xs leading-relaxed">
                        AI estimates are approximations (±10-20%). Final pricing requires professional measurement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <Label className="text-xs sm:text-sm font-medium mb-2 block">Room Type</Label>
                  <select
                    value={scannerRoomType}
                    onChange={(e) => setScannerRoomType(e.target.value)}
                    className="w-full min-h-[48px] h-12 px-4 rounded-xl bg-white/5 border border-border dark:border-white/20 text-foreground text-base focus:border-accent/50 focus:outline-none touch-manipulation"
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

                <div className="mb-4 sm:mb-6">
                  {!scannerImage ? (
                    <label className="block w-full min-h-[160px] sm:h-48 rounded-xl border-2 border-dashed border-border dark:border-white/20 hover:border-accent/50 active:border-accent/70 active:bg-accent/5 transition-colors cursor-pointer bg-white/5 touch-manipulation">
                      <div className="flex flex-col items-center justify-center h-full gap-2 sm:gap-3 py-6">
                        <div className="w-14 h-14 sm:w-12 sm:h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Camera className="w-7 h-7 sm:w-6 sm:h-6 text-accent" />
                        </div>
                        <div className="text-center px-4">
                          <p className="text-sm sm:text-sm text-muted-foreground font-medium">Tap to take photo or upload</p>
                          <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 10MB</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
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
                        className="w-full h-40 sm:h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setScannerImage(null);
                          setScanResult(null);
                          setScanError(null);
                        }}
                        className="absolute top-2 right-2 w-11 h-11 min-h-[44px] min-w-[44px] rounded-lg bg-black/60 hover:bg-black/80 active:bg-black/90 flex items-center justify-center transition-colors touch-manipulation"
                        data-testid="button-clear-scanner-image"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {scanError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="text-red-400 text-xs sm:text-sm">{scanError}</p>
                  </div>
                )}

                {scanResult && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-400 mb-2 text-sm sm:text-base">Scan Complete!</p>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs sm:text-sm">Floor Sq Ft</p>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">
                              {Math.round(scanResult.estimatedSquareFootage)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs sm:text-sm">Confidence</p>
                            <p className="text-lg font-bold text-foreground">
                              {scanResult.confidence}%
                            </p>
                          </div>
                          {scanResult.wallSurfaceSqft && (
                            <div className="col-span-2">
                              <p className="text-muted-foreground text-xs sm:text-sm">Wall Surface Area</p>
                              <p className="text-lg font-bold text-foreground">
                                ~{Math.round(scanResult.wallSurfaceSqft)} sq ft
                              </p>
                            </div>
                          )}
                        </div>
                        {scanResult.referenceObjectsUsed && scanResult.referenceObjectsUsed.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-[10px] text-muted-foreground">Calibrated with:</span>
                            {scanResult.referenceObjectsUsed.map((obj, i) => (
                              <span key={i} className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded">
                                {obj}
                              </span>
                            ))}
                          </div>
                        )}
                        {scanResult.reasoning && (
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 sm:mt-3 italic leading-relaxed">
                            "{scanResult.reasoning}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pb-safe">
                  {!scanResult ? (
                    <FlipButton
                      onClick={handleRoomScan}
                      disabled={!scannerImage || isScanning}
                      className="flex-1 min-h-[48px] text-sm sm:text-base touch-manipulation"
                      data-testid="button-scan-room-modal"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          Scan Room
                        </>
                      )}
                    </FlipButton>
                  ) : (
                    <FlipButton
                      onClick={onScanComplete ? handleApply : handleClose}
                      className="flex-1 min-h-[48px] text-sm sm:text-base touch-manipulation"
                      data-testid="button-apply-scanner-result"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
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
