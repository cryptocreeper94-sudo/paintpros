import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { ArrowRight, Calculator, Check, DoorOpen, Paintbrush, Square, Layers, Camera, Sparkles, Zap } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

// Pricing constants
const PRICING = {
  DOOR_PRICE: 150,
  FULL_JOB_RATE: 5.00,
  WALLS_ONLY_RATE: 2.50,
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
  const [showEmailModal, setShowEmailModal] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [lead, setLead] = useState<LeadData | null>(null);

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
                      <span className="text-accent font-semibold">Nashville Painting Professionals</span>
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
              <GlassCard className="p-8" glow>
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Paintbrush className="w-5 h-5 text-accent" />
                  </div>
                  Select Your Services
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'walls', label: 'Walls', desc: 'Interior wall painting', icon: Square },
                    { key: 'trim', label: 'Trim', desc: 'Baseboards, crown molding, window frames', icon: Layers },
                    { key: 'ceilings', label: 'Ceilings', desc: 'Ceiling painting and touch-ups', icon: Square },
                    { key: 'doors', label: 'Doors', desc: 'Front & back included - $150 per door', icon: DoorOpen },
                  ].map((service) => (
                    <motion.div 
                      key={service.key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        jobSelections[service.key as keyof JobSelections]
                          ? 'bg-gradient-to-r from-accent/15 to-accent/5 border-accent/50 shadow-lg shadow-accent/10' 
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => setJobSelections(prev => ({ ...prev, [service.key]: !prev[service.key as keyof JobSelections] }))}
                      data-testid={`checkbox-${service.key}`}
                    >
                      <Checkbox 
                        checked={jobSelections[service.key as keyof JobSelections]}
                        onCheckedChange={(checked) => setJobSelections(prev => ({ ...prev, [service.key]: !!checked }))}
                        className="w-6 h-6 border-white/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <div className="flex-1">
                        <Label className="text-lg font-bold cursor-pointer block">{service.label}</Label>
                        <p className="text-sm text-muted-foreground">{service.desc}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        jobSelections[service.key as keyof JobSelections] ? 'bg-accent/20' : 'bg-white/5'
                      }`}>
                        <service.icon className={`w-5 h-5 ${
                          jobSelections[service.key as keyof JobSelections] ? 'text-accent' : 'text-muted-foreground'
                        }`} />
                      </div>
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
                          <div className="flex items-center gap-4">
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
                          </div>
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

              {/* AI Room Scan - Coming Soon */}
              <GlassCard className="p-6 border-dashed border-accent/30 bg-gradient-to-r from-accent/5 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">AI Room Scanner</h3>
                      <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">Coming Soon</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Snap a photo of your room and let our AI estimate the square footage for you. Perfect for quick quotes without measuring.
                    </p>
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
