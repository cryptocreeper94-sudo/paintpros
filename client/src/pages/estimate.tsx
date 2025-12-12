import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { ArrowRight, Calculator, X, Check, DoorOpen, Paintbrush, Square, Layers } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

// Pricing constants
const PRICING = {
  DOOR_PRICE: 150, // Per door (front & back)
  FULL_JOB_RATE: 5.00, // Per sq ft (walls + trim + ceilings)
  WALLS_ONLY_RATE: 2.50, // Per sq ft (walls only)
};

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
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [lead, setLead] = useState<LeadData | null>(null);

  // Estimator state
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

  // Calculate if we need square footage input
  const needsSquareFootage = jobSelections.walls || jobSelections.trim || jobSelections.ceilings;

  // Determine pricing tier
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

  // Calculate live estimate
  const estimate = useMemo(() => {
    const { walls, trim, ceilings, doors } = jobSelections;
    
    let wallsPrice = 0;
    let trimPrice = 0;
    let ceilingsPrice = 0;
    let doorsPrice = 0;
    let rate = 0;
    let rateLabel = "";

    // Determine rate based on combo
    const isFullJob = walls && trim && ceilings;
    
    if (isFullJob) {
      // Full job: $5/sq ft split across all three
      rate = PRICING.FULL_JOB_RATE;
      rateLabel = "Full Job Rate";
      const perItem = (squareFootage * rate) / 3;
      wallsPrice = perItem;
      trimPrice = perItem;
      ceilingsPrice = perItem;
    } else if (walls && !trim && !ceilings) {
      // Walls only: $2.50/sq ft
      rate = PRICING.WALLS_ONLY_RATE;
      rateLabel = "Walls Only Rate";
      wallsPrice = squareFootage * rate;
    } else if (walls || trim || ceilings) {
      // Custom combo - use walls only rate for walls, full job rate split for others
      // For now, use full job rate divided by selected items
      const selectedCount = [walls, trim, ceilings].filter(Boolean).length;
      rate = PRICING.FULL_JOB_RATE;
      rateLabel = "Standard Rate";
      const perItem = (squareFootage * rate) / selectedCount;
      if (walls) wallsPrice = perItem;
      if (trim) trimPrice = perItem;
      if (ceilings) ceilingsPrice = perItem;
    }

    // Doors are always flat rate
    if (doors) {
      doorsPrice = doorCount * PRICING.DOOR_PRICE;
    }

    const total = wallsPrice + trimPrice + ceilingsPrice + doorsPrice;

    return {
      wallsPrice,
      trimPrice,
      ceilingsPrice,
      doorsPrice,
      total,
      rate,
      rateLabel,
    };
  }, [jobSelections, squareFootage, doorCount]);

  // Validate email
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle email submission
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

      if (!response.ok) {
        throw new Error("Failed to submit email");
      }

      const data = await response.json();
      setLead(data);
      setShowEmailModal(false);
    } catch (error) {
      console.error("Error submitting email:", error);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Handle estimate submission
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

      if (!response.ok) {
        throw new Error("Failed to submit estimate");
      }

      setEstimateSubmitted(true);
    } catch (error) {
      console.error("Error submitting estimate:", error);
      alert("There was an error saving your estimate. Please try again.");
    } finally {
      setIsSubmittingEstimate(false);
    }
  };

  const hasAnySelection = Object.values(jobSelections).some(Boolean);

  return (
    <PageLayout>
      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8" glow>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                    Welcome to Our Estimator
                  </h2>
                  <p className="text-muted-foreground">
                    Thank you for choosing <span className="text-accent font-semibold">Nashville Painting Professionals</span>. 
                    We'd love to provide you a quote.
                  </p>
                </div>

                <div className="bg-army-green-800/30 rounded-lg p-4 mb-6 border border-white/10">
                  <p className="text-sm text-muted-foreground text-center">
                    To reduce spam and provide you with personalized information about your quote, 
                    please enter your email address below.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-center text-lg h-12"
                      data-testid="input-email-capture"
                    />
                    {emailError && (
                      <p className="text-red-400 text-sm mt-2 text-center">{emailError}</p>
                    )}
                  </div>

                  <FlipButton 
                    className="w-full" 
                    disabled={isSubmittingEmail}
                    data-testid="button-submit-email"
                  >
                    {isSubmittingEmail ? "Please wait..." : "Get My Estimate"} 
                    <ArrowRight className="w-4 h-4" />
                  </FlipButton>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  We respect your privacy. No spam, ever.
                </p>
              </GlassCard>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8 text-center" glow>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Estimate Saved!
                </h2>
                <p className="text-muted-foreground mb-4">
                  Your estimate of <span className="text-accent font-bold text-xl">${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> has been saved.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  We'll send detailed information to <span className="text-accent">{lead?.email}</span> and one of our professionals will reach out to finalize your quote.
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 px-4 md:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
              Instant Estimate
            </h1>
            <p className="text-xl text-muted-foreground">
              Select your services below and get a live quote instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Job Selection */}
            <div className="lg:col-span-3">
              <GlassCard className="p-6 md:p-8" glow>
                <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-accent" />
                  Select Your Services
                </h2>

                {/* Service Checkboxes */}
                <div className="space-y-4 mb-8">
                  <div 
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      jobSelections.walls 
                        ? 'bg-accent/10 border-accent/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setJobSelections(prev => ({ ...prev, walls: !prev.walls }))}
                    data-testid="checkbox-walls"
                  >
                    <Checkbox 
                      checked={jobSelections.walls}
                      onCheckedChange={(checked) => setJobSelections(prev => ({ ...prev, walls: !!checked }))}
                      className="border-white/30"
                    />
                    <div className="flex-1">
                      <Label className="text-lg font-semibold cursor-pointer">Walls</Label>
                      <p className="text-sm text-muted-foreground">Interior wall painting</p>
                    </div>
                    <Square className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div 
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      jobSelections.trim 
                        ? 'bg-accent/10 border-accent/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setJobSelections(prev => ({ ...prev, trim: !prev.trim }))}
                    data-testid="checkbox-trim"
                  >
                    <Checkbox 
                      checked={jobSelections.trim}
                      onCheckedChange={(checked) => setJobSelections(prev => ({ ...prev, trim: !!checked }))}
                      className="border-white/30"
                    />
                    <div className="flex-1">
                      <Label className="text-lg font-semibold cursor-pointer">Trim</Label>
                      <p className="text-sm text-muted-foreground">Baseboards, crown molding, window frames</p>
                    </div>
                    <Layers className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div 
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      jobSelections.ceilings 
                        ? 'bg-accent/10 border-accent/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setJobSelections(prev => ({ ...prev, ceilings: !prev.ceilings }))}
                    data-testid="checkbox-ceilings"
                  >
                    <Checkbox 
                      checked={jobSelections.ceilings}
                      onCheckedChange={(checked) => setJobSelections(prev => ({ ...prev, ceilings: !!checked }))}
                      className="border-white/30"
                    />
                    <div className="flex-1">
                      <Label className="text-lg font-semibold cursor-pointer">Ceilings</Label>
                      <p className="text-sm text-muted-foreground">Ceiling painting and touch-ups</p>
                    </div>
                    <Square className="w-5 h-5 text-muted-foreground rotate-180" />
                  </div>

                  <div 
                    className={`flex items-center space-x-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      jobSelections.doors 
                        ? 'bg-accent/10 border-accent/50' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setJobSelections(prev => ({ ...prev, doors: !prev.doors }))}
                    data-testid="checkbox-doors"
                  >
                    <Checkbox 
                      checked={jobSelections.doors}
                      onCheckedChange={(checked) => setJobSelections(prev => ({ ...prev, doors: !!checked }))}
                      className="border-white/30"
                    />
                    <div className="flex-1">
                      <Label className="text-lg font-semibold cursor-pointer">Doors</Label>
                      <p className="text-sm text-muted-foreground">Front & back - $150 per door</p>
                    </div>
                    <DoorOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Conditional Inputs */}
                <AnimatePresence mode="wait">
                  {(needsSquareFootage || jobSelections.doors) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 border-t border-white/10 pt-6"
                    >
                      {needsSquareFootage && (
                        <div>
                          <Label className="text-lg font-semibold mb-3 block">
                            Square Footage
                          </Label>
                          <p className="text-sm text-muted-foreground mb-3">
                            Enter the total square footage of the area to be painted.
                          </p>
                          <div className="flex items-center gap-4">
                            <Input
                              type="number"
                              placeholder="0"
                              value={squareFootage || ""}
                              onChange={(e) => setSquareFootage(parseInt(e.target.value) || 0)}
                              className="bg-white/5 border-white/10 text-lg h-12 w-40"
                              min={0}
                              data-testid="input-square-footage"
                            />
                            <span className="text-muted-foreground">sq ft</span>
                          </div>
                        </div>
                      )}

                      {jobSelections.doors && (
                        <div>
                          <Label className="text-lg font-semibold mb-3 block">
                            Number of Doors
                          </Label>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setDoorCount(Math.max(1, doorCount - 1))}
                              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-colors"
                              data-testid="button-door-minus"
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              value={doorCount}
                              onChange={(e) => setDoorCount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="bg-white/5 border-white/10 text-lg h-12 w-20 text-center"
                              min={1}
                              data-testid="input-door-count"
                            />
                            <button
                              onClick={() => setDoorCount(doorCount + 1)}
                              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-colors"
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
            </div>

            {/* Right: Live Estimate */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <GlassCard className="p-6 md:p-8" glow>
                  <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-accent" />
                    Your Estimate
                  </h2>

                  {!hasAnySelection ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Select services to see your estimate</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Pricing Breakdown */}
                      {jobSelections.walls && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-muted-foreground">Walls</span>
                          <span className="font-semibold">${estimate.wallsPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {jobSelections.trim && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-muted-foreground">Trim</span>
                          <span className="font-semibold">${estimate.trimPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {jobSelections.ceilings && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-muted-foreground">Ceilings</span>
                          <span className="font-semibold">${estimate.ceilingsPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {jobSelections.doors && (
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-muted-foreground">Doors ({doorCount}x)</span>
                          <span className="font-semibold">${estimate.doorsPrice.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Rate Info */}
                      {needsSquareFootage && estimate.rate > 0 && squareFootage > 0 && (
                        <div className="bg-army-green-800/30 rounded-lg p-3 mt-4">
                          <p className="text-xs text-muted-foreground">
                            {estimate.rateLabel}: ${estimate.rate.toFixed(2)}/sq ft × {squareFootage} sq ft
                          </p>
                        </div>
                      )}

                      {/* Validation Warning */}
                      {needsSquareFootage && squareFootage === 0 && (
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 mt-4">
                          <p className="text-sm text-amber-300">
                            Please enter square footage to calculate your estimate.
                          </p>
                        </div>
                      )}

                      {/* Total */}
                      <div className="pt-4 mt-4 border-t-2 border-accent/30">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Estimate</span>
                          <span className="text-3xl font-display font-bold text-accent">
                            ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <FlipButton 
                          className="w-full" 
                          onClick={handleEstimateSubmit}
                          disabled={(needsSquareFootage && squareFootage === 0) || estimate.total === 0 || isSubmittingEstimate}
                          data-testid="button-submit-estimate"
                        >
                          {isSubmittingEstimate ? "Saving..." : "Save My Estimate"}
                          <ArrowRight className="w-4 h-4" />
                        </FlipButton>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                          We'll reach out to finalize your quote
                        </p>
                      </div>
                    </div>
                  )}
                </GlassCard>

                {/* Pricing Info */}
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold mb-2 text-sm">Pricing Guide</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Walls + Trim + Ceilings: $5.00/sq ft</li>
                    <li>• Walls Only: $2.50/sq ft</li>
                    <li>• Doors (front & back): $150 each</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
