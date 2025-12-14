import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { ArrowRight, ArrowDown, Calculator, Check, DoorOpen, Paintbrush, Square, Layers, Camera, Sparkles, Zap, X, Lock, Upload, AlertTriangle, Loader2, CheckCircle, Crown, Star, Award, Shield, CalendarCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BookingWizard } from "@/components/booking-wizard";
import { RoomScannerModal } from "@/components/room-scanner";

import wallsImg from "@assets/generated_images/interior_wall_painting.png";
import trimImg from "@assets/generated_images/trim_and_molding.png";
import ceilingsImg from "@assets/generated_images/ceiling_painting.png";
import doorsImg from "@assets/generated_images/door_painting.png";

interface LeadData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface JobSelections {
  walls: boolean;
  trim: boolean;
  ceilings: boolean;
  doors: boolean;
}

export default function Estimate() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  
  const PRICING = {
    DOOR_PRICE: tenant.pricing.doorsPerUnit,
    FULL_JOB_RATE: tenant.pricing.fullJobPerSqFt,
    WALLS_ONLY_RATE: tenant.pricing.wallsPerSqFt,
  };

  const [showEmailModal, setShowEmailModal] = useState(!isDemo);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [lead, setLead] = useState<LeadData | null>(null);

  // Load saved email from localStorage on mount (skip for demo)
  useEffect(() => {
    if (isDemo) {
      // For demo mode, set hardcoded example values
      setJobSelections({ walls: true, trim: true, ceilings: false, doors: true });
      setSquareFootage(2500);
      setDoorCount(8);
      return;
    }
    
    const savedEmail = localStorage.getItem("estimatorEmail");
    const savedLead = localStorage.getItem("estimatorLead");
    
    if (savedEmail) {
      setEmail(savedEmail);
    }
    
    if (savedLead) {
      const leadData = JSON.parse(savedLead);
      setLead(leadData);
      setEmail(leadData.email || '');
      setFirstName(leadData.firstName || '');
      setLastName(leadData.lastName || '');
      setPhone(leadData.phone || '');
      setShowEmailModal(false);
    }
  }, [isDemo]);

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
  const SCANNER_LOCKED = false;

  // Photo upload state
  interface UploadedPhoto {
    id: string;
    base64: string;
    roomType: string;
    caption: string;
  }
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoRoomType, setPhotoRoomType] = useState("living_room");
  const [photoCaption, setPhotoCaption] = useState("");

  // Good/Better/Best pricing tier selection
  type PricingTierLevel = "good" | "better" | "best";
  const [selectedPricingTier, setSelectedPricingTier] = useState<PricingTierLevel>("better");

  // Blockchain verification opt-in
  const [blockchainOptIn, setBlockchainOptIn] = useState(false);
  const [blockchainResult, setBlockchainResult] = useState<{
    hallmarkNumber: string;
    solscanUrl?: string;
    solanaStatus: string;
  } | null>(null);

  const pricingTierOptions = {
    good: {
      name: "Good",
      description: "Quality work at an affordable price",
      multiplier: 1.0,
      features: ["Standard paint quality", "1-year warranty", "Basic prep work"],
      badge: null,
    },
    better: {
      name: "Better",
      description: "Premium finish with enhanced durability",
      multiplier: 1.20,
      features: ["Premium paint brands", "3-year warranty", "Thorough prep & priming", "Touch-up kit included"],
      badge: "Most Popular",
    },
    best: {
      name: "Best",
      description: "Top-tier luxury finish with full protection",
      multiplier: 1.40,
      features: ["Luxury paint brands", "5-year warranty", "Complete surface repair", "Custom color matching", "Deep cleaning included", "Priority scheduling"],
      badge: "Premium",
    },
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newPhoto: UploadedPhoto = {
        id: `photo-${Date.now()}`,
        base64,
        roomType: photoRoomType,
        caption: photoCaption
      };
      setUploadedPhotos(prev => [...prev, newPhoto]);
      setPhotoCaption("");
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

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

    const baseTotal = wallsPrice + trimPrice + ceilingsPrice + doorsPrice;
    const tierMultiplier = pricingTierOptions[selectedPricingTier].multiplier;
    const total = baseTotal * tierMultiplier;

    return { wallsPrice, trimPrice, ceilingsPrice, doorsPrice, baseTotal, total, rate, rateLabel, tierMultiplier };
  }, [jobSelections, squareFootage, doorCount, selectedPricingTier]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setEmailError("Please enter your first name");
      return;
    }
    if (!lastName.trim()) {
      setEmailError("Please enter your last name");
      return;
    }
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
        body: JSON.stringify({ email }), // Only send email to API
      });
      if (!response.ok) throw new Error("Failed to submit email");
      const data = await response.json();
      
      // Build complete lead data combining API response with form state
      const fullLeadData: LeadData = {
        id: data.id,
        email,
        firstName,
        lastName,
        phone,
      };
      
      setLead(fullLeadData);
      localStorage.setItem("estimatorEmail", email);
      localStorage.setItem("estimatorLead", JSON.stringify(fullLeadData));
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
          wallsPrice: (estimate.wallsPrice * estimate.tierMultiplier).toFixed(2),
          trimPrice: (estimate.trimPrice * estimate.tierMultiplier).toFixed(2),
          ceilingsPrice: (estimate.ceilingsPrice * estimate.tierMultiplier).toFixed(2),
          doorsPrice: (estimate.doorsPrice * estimate.tierMultiplier).toFixed(2),
          totalEstimate: estimate.total.toFixed(2),
          pricingTier,
          selectedPackage: selectedPricingTier,
          tierMultiplier: estimate.tierMultiplier.toFixed(2),
        }),
      });
      if (!response.ok) throw new Error("Failed to submit estimate");
      const estimateData = await response.json();
      
      if (uploadedPhotos.length > 0) {
        for (const photo of uploadedPhotos) {
          try {
            await fetch(`/api/estimates/${estimateData.id}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageBase64: photo.base64,
                roomType: photo.roomType,
                caption: photo.caption || null
              }),
            });
          } catch (photoError) {
            console.error("Error uploading photo:", photoError);
          }
        }
      }
      
      // Create blockchain-verified document asset if opted in
      if (blockchainOptIn) {
        try {
          const estimateContent = JSON.stringify({
            estimateId: estimateData.id,
            leadEmail: lead.email,
            selections: jobSelections,
            squareFootage: needsSquareFootage ? squareFootage : 0,
            doorCount: jobSelections.doors ? doorCount : 0,
            pricing: {
              walls: estimate.wallsPrice * estimate.tierMultiplier,
              trim: estimate.trimPrice * estimate.tierMultiplier,
              ceilings: estimate.ceilingsPrice * estimate.tierMultiplier,
              doors: estimate.doorsPrice * estimate.tierMultiplier,
              total: estimate.total
            },
            package: selectedPricingTier,
            createdAt: new Date().toISOString()
          });

          const assetResponse = await fetch("/api/document-assets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tenantId: tenant.id,
              sourceType: "estimate",
              sourceId: estimateData.id,
              title: `Estimate #${estimateData.id} - ${lead.email}`,
              content: estimateContent,
              hashToSolana: true,
              createdBy: "customer"
            }),
          });

          if (assetResponse.ok) {
            const assetData = await assetResponse.json();
            setBlockchainResult({
              hallmarkNumber: assetData.hallmarkNumber,
              solscanUrl: assetData.solscanUrl,
              solanaStatus: assetData.solanaStatus
            });
          }
        } catch (blockchainError) {
          console.error("Blockchain verification error:", blockchainError);
        }
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
      {/* Demo Lock Overlay */}
      {isDemo && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-accent/90 to-amber-500/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20 pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-black/20">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-black text-sm">Demo Mode - Estimates Locked</h3>
                <p className="text-black/70 text-xs">This is a preview. Subscribe for full estimator access.</p>
              </div>
              <a 
                href="/investors" 
                className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-black/80 transition-colors whitespace-nowrap"
                data-testid="button-demo-subscribe"
              >
                View Plans
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailModal && !isDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md my-auto"
            >
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/30 via-gold-400/20 to-accent/30 blur-3xl opacity-50" />
                
                <GlassCard className="relative p-6 md:p-10 border-accent/20 max-h-[90vh] overflow-y-auto" glow>
                  <div className="text-center mb-6">
                    <motion.div 
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/30 to-gold-400/20 flex items-center justify-center border border-accent/30 shadow-lg shadow-accent/20"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Calculator className="w-8 h-8 text-accent" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                      Instant Quote Calculator
                    </h2>
                    <p className="text-muted-foreground text-base">
                      Thank you for choosing{" "}
                      <span className="text-accent font-semibold">{tenant.name}</span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-army-green-800/40 to-army-green-700/30 rounded-xl p-4 mb-6 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To provide you with a personalized quote, please enter your details below.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-xs text-muted-foreground mb-1 block">First Name *</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-white/5 border-white/20 h-12 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                          data-testid="input-first-name-capture"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-xs text-muted-foreground mb-1 block">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Smith"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-white/5 border-white/20 h-12 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                          data-testid="input-last-name-capture"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="emailCapture" className="text-xs text-muted-foreground mb-1 block">Email *</Label>
                      <Input
                        id="emailCapture"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/20 h-12 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                        data-testid="input-email-capture"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phoneCapture" className="text-xs text-muted-foreground mb-1 block">Phone <span className="text-muted-foreground/60">(optional, for text updates)</span></Label>
                      <Input
                        id="phoneCapture"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white/5 border-white/20 h-12 rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                        data-testid="input-phone-capture"
                      />
                    </div>

                    {emailError && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm text-center"
                      >
                        {emailError}
                      </motion.p>
                    )}

                    <FlipButton 
                      className="w-full h-14 text-base" 
                      disabled={isSubmittingEmail}
                      data-testid="button-submit-email"
                    >
                      {isSubmittingEmail ? "Please wait..." : "Get My Instant Quote"} 
                      <ArrowRight className="w-5 h-5" />
                    </FlipButton>
                  </form>

                  <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-2">
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
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {selectedPricingTier === "best" && <Crown className="w-4 h-4 text-amber-400" />}
                      {selectedPricingTier === "better" && <Star className="w-4 h-4 text-accent" />}
                      {selectedPricingTier === "good" && <Star className="w-4 h-4 text-muted-foreground" />}
                      <p className="text-muted-foreground text-sm">
                        {pricingTierOptions[selectedPricingTier].name} Package
                      </p>
                    </div>
                    <p className="text-4xl font-display font-bold text-accent">
                      ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    We'll send detailed information to <span className="text-accent font-medium">{lead?.email}</span> and reach out to finalize your quote.
                  </p>
                  
                  {blockchainResult && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 mb-6 border border-purple-500/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <p className="text-purple-300 text-sm font-medium">Blockchain Verified</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Hallmark: <span className="text-purple-300 font-mono">{blockchainResult.hallmarkNumber}</span>
                      </p>
                      {blockchainResult.solscanUrl && (
                        <a 
                          href={blockchainResult.solscanUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 underline"
                          data-testid="link-solscan"
                        >
                          View on Solscan
                        </a>
                      )}
                    </div>
                  )}
                  
                  <FlipButton 
                    onClick={() => {
                      setEstimateSubmitted(false);
                      setJobSelections({ walls: false, trim: false, ceilings: false, doors: false });
                      setSquareFootage(0);
                      setDoorCount(1);
                      setUploadedPhotos([]);
                      setShowPhotoUpload(false);
                      setSelectedPricingTier("better");
                      setBlockchainOptIn(false);
                      setBlockchainResult(null);
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
      <RoomScannerModal 
        isOpen={showScannerModal && !SCANNER_LOCKED} 
        onClose={() => setShowScannerModal(false)} 
        leadId={lead?.id}
        onScanComplete={(sqft) => setSquareFootage(sqft)}
      />

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
                              <button
                                onClick={() => setShowScannerModal(true)}
                                className="px-4 h-10 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                data-testid="button-scan-room-sqft"
                              >
                                <Camera className="w-4 h-4" />
                                Scan Room
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

              {/* Photo Upload Section */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Room Photos</h3>
                      <p className="text-xs text-muted-foreground">Optional: Help us see your space</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 text-sm font-medium transition-all"
                    data-testid="button-toggle-photos"
                  >
                    {showPhotoUpload ? "Hide" : uploadedPhotos.length > 0 ? `${uploadedPhotos.length} Photos` : "Add Photos"}
                  </button>
                </div>

                <AnimatePresence>
                  {showPhotoUpload && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <Label className="text-sm mb-2 block">Room Type</Label>
                            <select
                              value={photoRoomType}
                              onChange={(e) => setPhotoRoomType(e.target.value)}
                              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/20 text-sm"
                              data-testid="select-photo-room-type"
                            >
                              <option value="living_room">Living Room</option>
                              <option value="bedroom">Bedroom</option>
                              <option value="bathroom">Bathroom</option>
                              <option value="kitchen">Kitchen</option>
                              <option value="dining_room">Dining Room</option>
                              <option value="office">Office</option>
                              <option value="hallway">Hallway</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <Label className="text-sm mb-2 block">Caption (optional)</Label>
                            <Input
                              value={photoCaption}
                              onChange={(e) => setPhotoCaption(e.target.value)}
                              placeholder="e.g., North wall"
                              className="bg-white/5 border-white/20 h-10"
                              data-testid="input-photo-caption"
                            />
                          </div>
                        </div>

                        <label className="block w-full h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-accent/50 transition-colors cursor-pointer bg-white/5 mb-4">
                          <div className="flex flex-col items-center justify-center h-full gap-2">
                            <Upload className="w-6 h-6 text-accent" />
                            <p className="text-sm text-muted-foreground">Click to upload photo</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            data-testid="input-photo-upload"
                          />
                        </label>

                        {uploadedPhotos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {uploadedPhotos.map((photo) => (
                              <div key={photo.id} className="relative group">
                                <img
                                  src={photo.base64}
                                  alt={photo.caption || "Room photo"}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removePhoto(photo.id)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  data-testid={`button-remove-photo-${photo.id}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] px-1 py-0.5 rounded-b-lg truncate">
                                  {photo.roomType.replace('_', ' ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

                        {/* Good/Better/Best Pricing Tier Selector - Horizontal Carousel */}
                        {estimate.baseTotal > 0 && (
                          <div className="pt-6 mt-6 border-t border-white/10">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Award className="w-4 h-4 text-accent" />
                              Choose Your Package
                            </h4>
                            <div className="px-8">
                              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                                <CarouselContent className="-ml-2">
                                  {(["good", "better", "best"] as const).map((tier) => {
                                    const tierData = pricingTierOptions[tier];
                                    const isSelected = selectedPricingTier === tier;
                                    const tierTotal = estimate.baseTotal * tierData.multiplier;
                                    
                                    return (
                                      <CarouselItem key={tier} className="pl-2 basis-[140px] md:basis-1/3">
                                        <motion.button
                                          onClick={() => setSelectedPricingTier(tier)}
                                          className={`relative w-full p-3 rounded-xl text-left transition-all border-2 ${
                                            isSelected 
                                              ? 'border-accent bg-accent/10 shadow-lg shadow-accent/20' 
                                              : 'border-white/10 bg-white/5 hover:border-white/30'
                                          }`}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                          data-testid={`button-tier-${tier}`}
                                        >
                                          {tierData.badge && (
                                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                              tier === "better" ? "bg-accent text-white" : "bg-gradient-to-r from-amber-500 to-yellow-400 text-black"
                                            }`}>
                                              {tierData.badge}
                                            </div>
                                          )}
                                          
                                          <div className="flex items-center gap-1 mb-1">
                                            {tier === "good" && <Star className="w-3 h-3 text-muted-foreground" />}
                                            {tier === "better" && <Star className="w-3 h-3 text-accent" />}
                                            {tier === "best" && <Crown className="w-3 h-3 text-amber-400" />}
                                            <span className={`text-xs font-bold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                                              {tierData.name}
                                            </span>
                                          </div>
                                          
                                          <div className={`text-sm font-bold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                                            ${tierTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                          </div>
                                          
                                          {isSelected && (
                                            <motion.div 
                                              className="absolute top-2 right-2"
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                            >
                                              <Check className="w-3 h-3 text-accent" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      </CarouselItem>
                                    );
                                  })}
                                </CarouselContent>
                                <CarouselPrevious className="left-0 hidden sm:flex" />
                                <CarouselNext className="right-0 hidden sm:flex" />
                              </Carousel>
                            </div>
                            
                            {/* Selected Tier Features - Accordion */}
                            <Accordion type="single" collapsible defaultValue="features" className="mt-3">
                              <AccordionItem value="features" className="border-0 bg-white/5 rounded-lg overflow-hidden">
                                <AccordionTrigger className="text-xs px-3 py-2 hover:no-underline">
                                  <span className="flex items-center gap-2">
                                    {selectedPricingTier === "good" && <Star className="w-3 h-3 text-muted-foreground" />}
                                    {selectedPricingTier === "better" && <Star className="w-3 h-3 text-accent" />}
                                    {selectedPricingTier === "best" && <Crown className="w-3 h-3 text-amber-400" />}
                                    {pricingTierOptions[selectedPricingTier].name} Package Details
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                  <p className="text-xs text-muted-foreground mb-2">{pricingTierOptions[selectedPricingTier].description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {pricingTierOptions[selectedPricingTier].features.map((feature, i) => (
                                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                        {feature}
                                      </span>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
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

                        {/* Blockchain Verification Toggle */}
                        <div className="pt-4 mt-4 border-t border-white/10">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">Blockchain Verification</p>
                                <p className="text-[10px] text-muted-foreground">Tamper-proof record on Solana</p>
                              </div>
                            </div>
                            <Switch
                              checked={blockchainOptIn}
                              onCheckedChange={setBlockchainOptIn}
                              data-testid="switch-blockchain-opt-in"
                            />
                          </div>
                        </div>

                        <div className="pt-6">
                          <FlipButton 
                            className="w-full h-14 text-base" 
                            onClick={handleEstimateSubmit}
                            disabled={(needsSquareFootage && squareFootage === 0) || estimate.total === 0 || isSubmittingEstimate}
                            data-testid="button-submit-estimate"
                          >
                            {isSubmittingEstimate ? (blockchainOptIn ? "Verifying on Blockchain..." : "Saving...") : "Save My Estimate"}
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

                {/* Book Consultation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-accent" />
                      Book a Free Consultation
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Schedule a time for our team to visit and provide a detailed quote
                    </p>
                  </div>
                  <BookingWizard lead={lead} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
