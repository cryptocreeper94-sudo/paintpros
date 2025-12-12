import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { ArrowRight, ArrowDown, Calculator, Check, DoorOpen, Paintbrush, Square, Layers, Camera, Sparkles, Zap, X, Lock, Upload, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/context/TenantContext";

import wallsImg from "@assets/generated_images/interior_wall_painting.png";
import trimImg from "@assets/generated_images/trim_and_molding.png";
import ceilingsImg from "@assets/generated_images/ceiling_painting.png";
import doorsImg from "@assets/generated_images/door_painting.png";

interface LeadData {
  id: string;
  email: string;
}

interface JobSelections {
  walls: boolean;
  trim: boolean;
  ceilings: boolean;
  doors: boolean;
}

export default function Estimate() {
  const tenant = useTenant();
  
  const PRICING = {
    DOOR_PRICE: tenant.pricing.doorsPerUnit,
    FULL_JOB_RATE: tenant.pricing.fullJobPerSqFt,
    WALLS_ONLY_RATE: tenant.pricing.wallsPerSqFt,
  };

  const [showEmailModal, setShowEmailModal] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [lead, setLead] = useState<LeadData | null>(null);

  // Load saved email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("estimatorEmail");
    const savedLead = localStorage.getItem("estimatorLead");
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
    
    if (savedLead) {
      const leadData = JSON.parse(savedLead);
      setLead(leadData);
      setShowEmailModal(false);
    }
  }, []);

  const [jobSelections, setJobSelections] = useState<JobSelections>({
    walls: false,
    trim: false,
    ceilings: false,
    doors: false,
  });
  const [squareFootage, setSquareFootage] = useState<number>(0);
  const [doorCount, setDoorCount] = useState<number>(1);
  const [isSubmittingEstimate, setIsSubmittingEstimate] = useState(false);
  const [estimateSubmitted, setEstimateSubmitted] = useState(false);

  // Room Scanner State
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerImage, setScannerImage] = useState<string | null>(null);
  const [scannerRoomType, setScannerRoomType] = useState("living_room");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    estimatedSquareFootage: number;
    confidence: number;
    reasoning: string;
    roomType: string;
  } | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Feature is locked for beta
  const SCANNER_LOCKED = true;

  const needsSquareFootage = jobSelections.walls || jobSelections.trim || jobSelections.ceilings;

  const pricingTier = useMemo(() => {
    const { walls, trim, ceilings, doors } = jobSelections;
    const hasFullJob = walls && trim && ceilings;
    const hasWallsOnly = walls && !trim && !ceilings;
    const hasDoors = doors;
    const hasAnySurface = walls || trim || ceilings;

    if (hasFullJob && hasDoors) return "full_job_with_doors";
    if (hasFullJob) return "full_job";
    if (hasWallsOnly && hasDoors) return "walls_with_doors";
    if (hasWallsOnly) return "walls_only";
    if (hasDoors && !hasAnySurface) return "doors_only";
    if (hasDoors && hasAnySurface) return "custom_with_doors";
    if (hasAnySurface) return "custom";
    return "none";
  }, [jobSelections]);

  const estimate = useMemo(() => {
    const { walls, trim, ceilings, doors } = jobSelections;
    
    let wallsPrice = 0;
    let trimPrice = 0;
    let ceilingsPrice = 0;
    let doorsPrice = 0;
    let rate = 0;
    let rateLabel = "";

    const isFullJob = walls && trim && ceilings;
    
    if (isFullJob) {
      rate = PRICING.FULL_JOB_RATE;
      rateLabel = "Full Job Rate";
      const perItem = (squareFootage * rate) / 3;
      wallsPrice = perItem;
      trimPrice = perItem;
      ceilingsPrice = perItem;
    } else if (walls && !trim && !ceilings) {
      rate = PRICING.WALLS_ONLY_RATE;
      rateLabel = "Walls Only Rate";
      wallsPrice = squareFootage * rate;
    } else if (walls || trim || ceilings) {
      const selectedCount = [walls, trim, ceilings].filter(Boolean).length;
      rate = PRICING.FULL_JOB_RATE;
      rateLabel = "Standard Rate";
      const perItem = (squareFootage * rate) / selectedCount;
      if (walls) wallsPrice = perItem;
      if (trim) trimPrice = perItem;
      if (ceilings) ceilingsPrice = perItem;
    }

    if (doors) {
      doorsPrice = doorCount * PRICING.DOOR_PRICE;
    }

    const total = wallsPrice + trimPrice + ceilingsPrice + doorsPrice;

    return { wallsPrice, trimPrice, ceilingsPrice, doorsPrice, total, rate, rateLabel };
  }, [jobSelections, squareFootage, doorCount]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setIsSubmittingEmail(true);
    setEmailError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Failed to submit email");
      const data = await response.json();
      setLead(data);
      // Save email and lead data to localStorage for future estimates
      localStorage.setItem("estimatorEmail", email);
      localStorage.setItem("estimatorLead", JSON.stringify(data));
      setShowEmailModal(false);
    } catch (error) {
      console.error("Error submitting email:", error);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleEstimateSubmit = async () => {
    if (!lead) return;
    setIsSubmittingEstimate(true);
    try {
      const response = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          includeWalls: jobSelections.walls,
          includeTrim: jobSelections.trim,
          includeCeilings: jobSelections.ceilings,
          doorCount: jobSelections.doors ? doorCount : 0,
          squareFootage: needsSquareFootage ? squareFootage : 0,
          wallsPrice: estimate.wallsPrice.toFixed(2),
          trimPrice: estimate.trimPrice.toFixed(2),
          ceilingsPrice: estimate.ceilingsPrice.toFixed(2),
          doorsPrice: estimate.doorsPrice.toFixed(2),
          totalEstimate: estimate.total.toFixed(2),
          pricingTier,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit estimate");
      setEstimateSubmitted(true);
    } catch (error) {
      console.error("Error submitting estimate:", error);
      alert("There was an error saving your estimate. Please try again.");
    } finally {
      setIsSubmittingEstimate(false);
    }
  };

  const hasAnySelection = Object.values(jobSelections).some(Boolean);

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
    if (!scannerImage || !lead) return;
    
    setIsScanning(true);
    setScanError(null);
    setScanResult(null);

    try {
      const response = await fetch("/api/room-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: scannerImage,
          leadId: lead.id,
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

  const applyScannedSquareFootage = () => {
    if (scanResult) {
      setSquareFootage(Math.round(scanResult.estimatedSquareFootage));
      setShowScannerModal(false);
    }
  };

  return (
    <PageLayout>
      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-gold-400/20 to-accent/30 blur-3xl opacity-50" />
                
                <GlassCard className="relative p-10 border-accent/20" glow>
                  <div className="text-center mb-8">
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center border border-accent/30 shadow-lg shadow-accent/20"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Calculator className="w-10 h-10 text-accent" />
                    </motion.div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                      Instant Quote Calculator
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Thank you for choosing{" "}
                      <span className="text-accent font-semibold">{tenant.name}</span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-army-green-800/40 to-army-green-700/30 rounded-xl p-5 mb-8 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To reduce spam and provide you with personalized quote information, 
                        please enter your email address below.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/20 text-center text-lg h-14 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                        data-testid="input-email-capture"
                      />
                      {emailError && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-3 text-center"
                        >
                          {emailError}
                        </motion.p>
                      )}
                    </div>

                    <FlipButton 
                      className="w-full h-14 text-base" 
                      disabled={isSubmittingEmail}
                      data-testid="button-submit-email"
                    >
                      {isSubmittingEmail ? "Please wait..." : "Get My Instant Quote"} 
                      <ArrowRight className="w-5 h-5" />
                    </FlipButton>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3" />
                    We respect your privacy. No spam, ever.
                  </p>
                </GlassCard>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estimate Submitted Success */}
      <AnimatePresence>
        {estimateSubmitted && (
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
              className="w-full max-w-md"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-accent/20 to-green-500/30 blur-3xl opacity-50" />
                
                <GlassCard className="relative p-10 text-center border-green-500/20" glow>
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-500/30 to-green-400/20 flex items-center justify-center border border-green-500/30 shadow-lg shadow-green-500/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    <Check className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                    Estimate Saved!
                  </h2>
                  <div className="bg-gradient-to-r from-accent/20 to-gold-400/10 rounded-xl p-6 mb-6 border border-accent/20">
                    <p className="text-muted-foreground mb-2 text-sm">Your estimated total</p>
                    <p className="text-4xl font-display font-bold text-accent">
                      ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    We'll send detailed information to <span className="text-accent font-medium">{lead?.email}</span> and reach out to finalize your quote.
                  </p>
                  <FlipButton 
                    onClick={() => {
                      setEstimateSubmitted(false);
                      setJobSelections({ walls: false, trim: false, ceilings: false, doors: false });
                      setSquareFootage(0);
                      setDoorCount(1);
                    }}
                    data-testid="button-new-estimate"
                  >
                    Create Another Estimate
                  </FlipButton>
                </GlassCard>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Scanner Modal */}
      <AnimatePresence>
        {showScannerModal && !SCANNER_LOCKED && (
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
              className="w-full max-w-lg"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-gold-400/20 to-accent/30 blur-3xl opacity-50" />
                
                <GlassCard className="relative p-8 border-accent/20" glow>
                  <button
                    onClick={() => {
                      setShowScannerModal(false);
                      setScannerImage(null);
                      setScanResult(null);
                      setScanError(null);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    data-testid="button-close-scanner"
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

                  {/* Calibration & Best Practices */}
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

                  {/* Disclaimers */}
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

                  {/* Room Type Selection */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2 block">Room Type</Label>
                    <select
                      value={scannerRoomType}
                      onChange={(e) => setScannerRoomType(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/20 text-foreground focus:border-accent/50 focus:outline-none"
                      data-testid="select-room-type"
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

                  {/* Image Upload */}
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
                          data-testid="input-room-image"
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
                          data-testid="button-clear-image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Scan Error */}
                  {scanError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                      <p className="text-red-400 text-sm">{scanError}</p>
                    </div>
                  )}

                  {/* Scan Result */}
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

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {!scanResult ? (
                      <FlipButton
                        onClick={handleRoomScan}
                        disabled={!scannerImage || isScanning}
                        className="flex-1"
                        data-testid="button-scan-room"
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
                        onClick={applyScannedSquareFootage}
                        className="flex-1"
                        data-testid="button-apply-scan"
                      >
                        <Check className="w-4 h-4" />
                        Use {Math.round(scanResult.estimatedSquareFootage)} sq ft
                      </FlipButton>
                    )}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 px-4 md:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Instant Pricing Calculator
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Get Your <span className="text-accent">Free Quote</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select your services below and see your estimate update in real-time. No waiting, no hassle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Job Selection */}
            <motion.div 
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Paintbrush className="w-5 h-5 text-accent" />
                  </div>
                  Select Your Services
                </h2>
                <p className="text-muted-foreground text-sm ml-[52px]">Click any card to add it to your estimate</p>
              </div>

              <GlassCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'walls', label: 'Walls', desc: 'Interior wall painting', icon: Square, image: wallsImg },
                  { key: 'trim', label: 'Trim', desc: 'Baseboards, crown molding, window frames', icon: Layers, image: trimImg },
                  { key: 'ceilings', label: 'Ceilings', desc: 'Ceiling painting and touch-ups', icon: Square, image: ceilingsImg },
                  { key: 'doors', label: 'Doors', desc: `$${PRICING.DOOR_PRICE} per door`, icon: DoorOpen, image: doorsImg },
                ].map((service) => (
                  <motion.div 
                    key={service.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative min-h-[160px] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                      jobSelections[service.key as keyof JobSelections]
                        ? 'border-accent shadow-lg shadow-accent/20' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setJobSelections(prev => ({ ...prev, [service.key]: !prev[service.key as keyof JobSelections] }))}
                    data-testid={`checkbox-${service.key}`}
                  >
                    <img 
                      src={service.image} 
                      alt={service.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 transition-all ${
                      jobSelections[service.key as keyof JobSelections]
                        ? 'bg-gradient-to-r from-accent/60 via-accent/40 to-transparent'
                        : 'bg-gradient-to-r from-black/70 via-black/50 to-transparent'
                    }`} />
                    
                    <div className="absolute inset-0 p-5 flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        jobSelections[service.key as keyof JobSelections]
                          ? 'bg-accent border-2 border-white'
                          : 'bg-white/10 border-2 border-white/30'
                      }`}>
                        {jobSelections[service.key as keyof JobSelections] && (
                          <Check className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Label className="text-xl font-display font-bold cursor-pointer block text-white drop-shadow-lg">
                          {service.label}
                        </Label>
                        <p className="text-sm text-white/80 drop-shadow">{service.desc}</p>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        jobSelections[service.key as keyof JobSelections] ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {jobSelections[service.key as keyof JobSelections] && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent text-white text-xs font-bold">
                        Selected
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

                {/* Conditional Inputs */}
                <AnimatePresence mode="wait">
                  {(needsSquareFootage || jobSelections.doors) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8 pt-8 border-t border-white/10 space-y-8"
                    >
                      {needsSquareFootage && (
                        <div>
                          <Label className="text-xl font-bold mb-4 block flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                              <Square className="w-4 h-4 text-accent" />
                            </div>
                            Square Footage
                          </Label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Enter the total square footage of the area to be painted.
                          </p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Input
                              type="number"
                              placeholder="0"
                              value={squareFootage || ""}
                              onChange={(e) => setSquareFootage(parseInt(e.target.value) || 0)}
                              className="bg-white/5 border-white/20 text-xl h-14 w-48 text-center rounded-xl focus:border-accent/50"
                              min={0}
                              data-testid="input-square-footage"
                            />
                            <span className="text-lg text-muted-foreground font-medium">sq ft</span>
                            <div className="flex gap-2 ml-2">
                              <button
                                onClick={() => setSquareFootage(0)}
                                className="px-4 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                data-testid="button-clear-sqft"
                              >
                                <X className="w-4 h-4" />
                                Clear
                              </button>
                            </div>
                          </div>
                          
                          {/* Animated Arrow Down */}
                          {squareFootage > 0 && (
                            <motion.div 
                              className="flex flex-col items-center mt-8"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <p className="text-sm text-muted-foreground mb-2">See your estimate below</p>
                              <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <ArrowDown className="w-6 h-6 text-accent" />
                              </motion.div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {jobSelections.doors && (
                        <div>
                          <Label className="text-xl font-bold mb-4 block flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                              <DoorOpen className="w-4 h-4 text-accent" />
                            </div>
                            Number of Doors
                          </Label>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setDoorCount(Math.max(1, doorCount - 1))}
                              className="w-14 h-14 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl font-bold transition-all hover:scale-105 active:scale-95"
                              data-testid="button-door-minus"
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              value={doorCount}
                              onChange={(e) => setDoorCount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="bg-white/5 border-white/20 text-2xl h-14 w-24 text-center rounded-xl font-bold"
                              min={1}
                              data-testid="input-door-count"
                            />
                            <button
                              onClick={() => setDoorCount(doorCount + 1)}
                              className="w-14 h-14 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-2xl font-bold transition-all hover:scale-105 active:scale-95"
                              data-testid="button-door-plus"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>

              {/* AI Room Scanner - Locked Feature */}
              <GlassCard className="p-6 border-dashed border-accent/30 bg-gradient-to-r from-accent/5 to-transparent relative overflow-hidden">
                {SCANNER_LOCKED && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-accent" />
                      </div>
                      <h4 className="text-lg font-bold mb-2">Premium Feature</h4>
                      <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                        AI Room Scanner is available for premium customers. Contact us to unlock this feature.
                      </p>
                      <div className="px-4 py-2 rounded-full bg-accent/20 text-accent text-xs font-medium inline-flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Beta Access Only
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">AI Room Scanner</h3>
                      <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                        {SCANNER_LOCKED ? "Locked" : "Beta"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a photo of your room and our AI will estimate the square footage. Best for quick quotes without measuring tape.
                    </p>
                    
                    <button
                      onClick={() => !SCANNER_LOCKED && setShowScannerModal(true)}
                      disabled={SCANNER_LOCKED}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                        SCANNER_LOCKED 
                          ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                          : "bg-accent/20 text-accent hover:bg-accent/30"
                      }`}
                      data-testid="button-open-scanner"
                    >
                      <Camera className="w-4 h-4" />
                      Scan Room
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Right: Live Estimate */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-24 space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent blur-3xl opacity-30 -z-10" />
                  
                  <GlassCard className="p-8 border-accent/20" glow>
                    <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-accent" />
                      </div>
                      Your Estimate
                    </h2>

                    {!hasAnySelection ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Paintbrush className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">Select services to see your estimate</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobSelections.walls && (
                          <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-muted-foreground">Walls</span>
                            <span className="font-bold text-lg">${estimate.wallsPrice.toFixed(2)}</span>
                          </div>
                        )}
                        {jobSelections.trim && (
                          <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-muted-foreground">Trim</span>
                            <span className="font-bold text-lg">${estimate.trimPrice.toFixed(2)}</span>
                          </div>
                        )}
                        {jobSelections.ceilings && (
                          <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-muted-foreground">Ceilings</span>
                            <span className="font-bold text-lg">${estimate.ceilingsPrice.toFixed(2)}</span>
                          </div>
                        )}
                        {jobSelections.doors && (
                          <div className="flex justify-between items-center py-3 border-b border-white/10">
                            <span className="text-muted-foreground">Doors ({doorCount}x)</span>
                            <span className="font-bold text-lg">${estimate.doorsPrice.toFixed(2)}</span>
                          </div>
                        )}

                        {needsSquareFootage && estimate.rate > 0 && squareFootage > 0 && (
                          <div className="bg-white/5 rounded-xl p-4 mt-4">
                            <p className="text-sm text-muted-foreground">
                              <span className="text-accent font-medium">{estimate.rateLabel}</span>: ${estimate.rate.toFixed(2)}/sq ft × {squareFootage} sq ft
                            </p>
                          </div>
                        )}

                        {needsSquareFootage && squareFootage === 0 && (
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
                            <p className="text-sm text-amber-300 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Enter square footage to calculate
                            </p>
                          </div>
                        )}

                        <div className="pt-6 mt-6 border-t-2 border-accent/30">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Estimate</span>
                            <motion.span 
                              key={estimate.total}
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              className="text-4xl font-display font-bold text-accent"
                            >
                              ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </motion.span>
                          </div>
                        </div>

                        <div className="pt-6">
                          <FlipButton 
                            className="w-full h-14 text-base" 
                            onClick={handleEstimateSubmit}
                            disabled={(needsSquareFootage && squareFootage === 0) || estimate.total === 0 || isSubmittingEstimate}
                            data-testid="button-submit-estimate"
                          >
                            {isSubmittingEstimate ? "Saving..." : "Save My Estimate"}
                            <ArrowRight className="w-5 h-5" />
                          </FlipButton>
                          <p className="text-xs text-muted-foreground text-center mt-4">
                            We'll reach out within 24 hours to finalize
                          </p>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </div>

                {/* Pricing Guide */}
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Pricing Guide
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-muted-foreground">Walls + Trim + Ceilings</span>
                      <span className="font-semibold text-accent">$5.00/sq ft</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-muted-foreground">Walls Only</span>
                      <span className="font-semibold text-accent">$2.50/sq ft</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Doors (front & back)</span>
                      <span className="font-semibold text-accent">$150 each</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
