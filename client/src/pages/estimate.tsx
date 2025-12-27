import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowLeft, Calculator, Check, DoorOpen, Paintbrush, Square, Layers, Camera, X, Lock, Upload, Loader2, Crown, Star, Award, Palette, User, Mail, Phone, Home, ImagePlus, Ruler, CheckCircle, AlertCircle, Send, Wrench } from "lucide-react";
import { MaterialBreakdown } from "@/components/material-breakdown";
import { useAccess } from "@/context/AccessContext";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { RoomScannerModal } from "@/components/room-scanner";
import type { PaintColor } from "@shared/schema";

import wallsImg from "@assets/generated_images/interior_wall_painting.png";
import trimImg from "@assets/generated_images/trim_and_molding.png";
import ceilingsImg from "@assets/generated_images/ceiling_painting.png";
import doorsImg from "@assets/generated_images/door_painting.png";

interface UploadedPhoto {
  id: string;
  base64: string;
  roomType: string;
  caption: string;
}

interface SelectedColor {
  colorId: string;
  colorName: string;
  hexValue: string;
  brand: string;
  colorCode: string;
  surface: 'walls' | 'trim' | 'ceilings' | 'doors' | 'cabinets';
}

type PricingTierLevel = "good" | "better" | "best";

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

export default function Estimate() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  
  const PRICING = {
    wallsOnlyPerSqFt: tenant.pricing.wallsOnlyPerSqFt,
    trimOnlyPerSqFt: tenant.pricing.trimOnlyPerSqFt,
    ceilingsOnlyPerSqFt: tenant.pricing.ceilingsOnlyPerSqFt,
    wallsAndTrimPerSqFt: tenant.pricing.wallsAndTrimPerSqFt,
    fullJobPerSqFt: tenant.pricing.fullJobPerSqFt,
    doorsPerUnit: tenant.pricing.doorsPerUnit,
    cabinetDoorsPerUnit: tenant.pricing.cabinetDoorsPerUnit,
    cabinetDrawersPerUnit: tenant.pricing.cabinetDrawersPerUnit,
  };

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Contact Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Step 2: Services
  const [jobSelections, setJobSelections] = useState({
    walls: false,
    trim: false,
    ceilings: false,
    doors: false,
    cabinets: false,
  });

  // Step 3: Photos (up to 4)
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [photoRoomType, setPhotoRoomType] = useState("living_room");

  // Step 4: Measurements & Colors
  const [squareFootage, setSquareFootage] = useState<number>(0);
  const [doorCount, setDoorCount] = useState<number>(0);
  const [cabinetDoors, setCabinetDoors] = useState<number>(0);
  const [cabinetDrawers, setCabinetDrawers] = useState<number>(0);
  const [selectedColors, setSelectedColors] = useState<SelectedColor[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerSurface, setColorPickerSurface] = useState<'walls' | 'trim' | 'ceilings' | 'doors' | 'cabinets'>('walls');
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Step 5: Review & Submit
  const [selectedPricingTier, setSelectedPricingTier] = useState<PricingTierLevel>("better");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Pro View for contractors/owners with live access only
  const [showProView, setShowProView] = useState(false);
  const access = useAccess();
  const canAccessProTools = access?.currentUser?.isAuthenticated && 
    access?.currentUser?.accessMode === "live" &&
    ["admin", "owner", "developer"].includes(access?.currentUser?.role || "");

  // AI Feature usage tracking (1 use ever for demo)
  const [aiScannerUsed, setAiScannerUsed] = useState(() => {
    if (isDemo && typeof window !== 'undefined') {
      try {
        return localStorage.getItem('demo_ai_scanner_used') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  // Fetch colors for color picker
  const { data: colors = [] } = useQuery<PaintColor[]>({
    queryKey: ['/api/colors'],
    enabled: showColorPicker,
  });

  // Filter colors by brand based on tenant
  const availableColors = useMemo(() => {
    if (isDemo) {
      return colors; // Demo shows all brands
    }
    // NPP shows only professional brands
    return colors.filter(c => 
      c.brand === 'sherwin-williams' || c.brand === 'benjamin-moore'
    );
  }, [colors, isDemo]);

  // Load demo values
  useEffect(() => {
    if (isDemo) {
      setFirstName("Demo");
      setLastName("User");
      setEmail("cryptocreeper94@gmail.com");
      setPhone("(555) 123-4567");
      setAddress("123 Demo Street, Nashville, TN 37203");
      setJobSelections({ walls: true, trim: true, ceilings: false, doors: true, cabinets: false });
      setSquareFootage(2500);
      setDoorCount(8);
    }
  }, [isDemo]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadedPhotos.length >= 4) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newPhoto: UploadedPhoto = {
        id: `photo-${Date.now()}`,
        base64,
        roomType: photoRoomType,
        caption: ""
      };
      setUploadedPhotos(prev => [...prev, newPhoto]);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (photoId: string) => {
    setUploadedPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const addColor = (color: PaintColor, surface: 'walls' | 'trim' | 'ceilings' | 'doors' | 'cabinets') => {
    const existing = selectedColors.find(c => c.surface === surface);
    if (existing) {
      setSelectedColors(prev => prev.map(c => 
        c.surface === surface 
          ? { colorId: color.id, colorName: color.colorName, hexValue: color.hexValue, brand: color.brand, colorCode: color.colorCode, surface }
          : c
      ));
    } else {
      setSelectedColors(prev => [...prev, {
        colorId: color.id,
        colorName: color.colorName,
        hexValue: color.hexValue,
        brand: color.brand,
        colorCode: color.colorCode,
        surface
      }]);
    }
    setShowColorPicker(false);
  };

  const removeColor = (surface: string) => {
    setSelectedColors(prev => prev.filter(c => c.surface !== surface));
  };

  // Handle AI Scanner result
  const handleScannerResult = (result: { squareFootage: number }) => {
    setSquareFootage(result.squareFootage);
    if (isDemo && typeof window !== 'undefined') {
      try {
        localStorage.setItem('demo_ai_scanner_used', 'true');
      } catch {
        // Privacy mode or localStorage unavailable
      }
      setAiScannerUsed(true);
    }
  };

  // Calculate estimate
  const estimate = useMemo(() => {
    const { walls, trim, ceilings, doors, cabinets } = jobSelections;
    let surfaceTotal = 0;

    // Determine rate based on selection combination
    if (walls && trim && ceilings) {
      surfaceTotal = squareFootage * PRICING.fullJobPerSqFt;
    } else if (walls && trim && !ceilings) {
      surfaceTotal = squareFootage * PRICING.wallsAndTrimPerSqFt;
    } else if (walls && !trim && !ceilings) {
      surfaceTotal = squareFootage * PRICING.wallsOnlyPerSqFt;
    } else if (!walls && trim && !ceilings) {
      surfaceTotal = squareFootage * PRICING.trimOnlyPerSqFt;
    } else if (!walls && !trim && ceilings) {
      surfaceTotal = squareFootage * PRICING.ceilingsOnlyPerSqFt;
    } else if (walls || trim || ceilings) {
      // Mixed selections - use full job rate
      surfaceTotal = squareFootage * PRICING.fullJobPerSqFt;
    }

    // Add doors
    const doorsTotal = doors ? doorCount * PRICING.doorsPerUnit : 0;

    // Add cabinets
    const cabinetsTotal = cabinets 
      ? (cabinetDoors * PRICING.cabinetDoorsPerUnit) + (cabinetDrawers * PRICING.cabinetDrawersPerUnit)
      : 0;

    const baseTotal = surfaceTotal + doorsTotal + cabinetsTotal;
    const tierMultiplier = pricingTierOptions[selectedPricingTier].multiplier;
    const total = baseTotal * tierMultiplier;

    return { baseTotal, total, tierMultiplier };
  }, [jobSelections, squareFootage, doorCount, cabinetDoors, cabinetDrawers, selectedPricingTier, PRICING]);

  // Validation
  const isStep1Valid = firstName.trim() && lastName.trim() && email.includes('@') && email.includes('.');
  const isStep2Valid = Object.values(jobSelections).some(Boolean);
  const needsSquareFootage = jobSelections.walls || jobSelections.trim || jobSelections.ceilings;
  const needsDoors = jobSelections.doors;
  const needsCabinets = jobSelections.cabinets;
  const isStep4Valid = (!needsSquareFootage || squareFootage > 0) && 
                        (!needsDoors || doorCount > 0) &&
                        (!needsCabinets || (cabinetDoors > 0 || cabinetDrawers > 0));
  
  const canProceed = (step: number) => {
    switch (step) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return true; // Photos optional
      case 4: return isStep4Valid;
      case 5: return estimate.total > 0;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (isDemo) {
      setSubmitError("Demo mode - estimates are view-only. Subscribe to send actual estimates.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Submit estimate via API with Resend email
      const response = await fetch("/api/estimates/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant.id,
          customer: {
            firstName,
            lastName,
            email,
            phone,
            address
          },
          services: jobSelections,
          measurements: {
            squareFootage,
            doorCount,
            cabinetDoors,
            cabinetDrawers
          },
          colors: selectedColors,
          photos: uploadedPhotos.map(p => ({
            base64: p.base64,
            roomType: p.roomType,
            caption: p.caption
          })),
          pricing: {
            tier: selectedPricingTier,
            tierName: pricingTierOptions[selectedPricingTier].name,
            total: estimate.total
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit estimate");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Estimate submission error:", error);
      setSubmitError("There was an error submitting your estimate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Contact Information",
    "Select Services", 
    "Upload Room Photos",
    "Measurements & Colors",
    "Review & Submit"
  ];

  const stepIcons = [User, Paintbrush, Camera, Ruler, CheckCircle];

  if (submitted) {
    return (
      <PageLayout>
        <main className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassCard className="p-8 text-center" glow>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-display font-bold mb-4">Estimate Submitted!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you, {firstName}! Your estimate has been sent to your email at <strong>{email}</strong>.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  Our team will also receive a copy and will reach out within 24 hours to discuss your project.
                </p>
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
                  <p className="text-lg font-semibold">Your Estimate Total</p>
                  <p className="text-4xl font-display font-bold text-accent mt-2">
                    ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {pricingTierOptions[selectedPricingTier].name} Package
                  </p>
                </div>
                <Button onClick={() => window.location.href = "/"} variant="outline" data-testid="button-return-home">
                  Return to Home
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Demo Lock Banner */}
      {isDemo && (
        <div className="fixed bottom-[56px] left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-accent/90 to-amber-500/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-border pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-black/20">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-black text-sm">Demo Mode - Estimates Locked</h3>
                <p className="text-black/70 text-xs">This is a preview. Subscribe for full access.</p>
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

      <main className="py-8 px-4 pb-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Get Your Free Estimate
              </h1>
              <p className="text-muted-foreground">
                Complete the steps below for an instant quote from {tenant.name}
              </p>
            </motion.div>
          </div>

          {/* Progress Steps - Mobile Optimized */}
          <div className="mb-6 md:mb-8">
            {/* Mobile: Compact step indicator */}
            <div className="flex items-center justify-center gap-2 mb-3 md:hidden">
              <span className="text-sm font-semibold text-accent">Step {currentStep}</span>
              <span className="text-sm text-muted-foreground">of {totalSteps}</span>
              <span className="text-sm font-medium ml-2">{stepTitles[currentStep - 1]}</span>
            </div>
            
            {/* Desktop: Full step indicator */}
            <div className="hidden md:flex items-center justify-between">
              {stepTitles.map((title, index) => {
                const step = index + 1;
                const Icon = stepIcons[index];
                const isActive = currentStep === step;
                const isCompleted = currentStep > step;
                
                return (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-accent text-white' :
                        'bg-muted text-muted-foreground'
                      }`}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    <p className={`text-xs text-center ${isActive ? 'text-accent font-semibold' : 'text-muted-foreground'}`}>
                      {title}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-muted h-2 md:h-2 rounded-full mt-3 md:mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-4 md:p-8" glow>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    {(() => { const Icon = stepIcons[currentStep - 1]; return <Icon className="w-5 h-5 text-accent" />; })()}
                  </div>
                  Step {currentStep}: {stepTitles[currentStep - 1]}
                </h2>

                {/* Step 1: Contact Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="mb-2 block">First Name *</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="h-12"
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="mb-2 block">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Smith"
                          className="h-12"
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 block">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="h-12"
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="mb-2 block">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="h-12"
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="mb-2 block">Property Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, Nashville, TN 37203"
                        className="h-12"
                        data-testid="input-address"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Services - Mobile Optimized Grid */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {[
                      { key: 'walls', label: 'Walls', icon: Square, img: wallsImg },
                      { key: 'trim', label: 'Trim & Molding', icon: Layers, img: trimImg },
                      { key: 'ceilings', label: 'Ceilings', icon: Square, img: ceilingsImg },
                      { key: 'doors', label: 'Doors', icon: DoorOpen, img: doorsImg },
                      { key: 'cabinets', label: 'Cabinets', icon: Home, img: null },
                    ].map(({ key, label, icon: Icon, img }) => {
                      const isSelected = jobSelections[key as keyof typeof jobSelections];
                      return (
                        <motion.button
                          key={key}
                          onClick={() => setJobSelections(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={`relative p-3 md:p-4 rounded-xl border-2 transition-all min-h-[140px] md:min-h-[160px] ${
                            isSelected 
                              ? 'border-accent bg-accent/10' 
                              : 'border-border hover:border-accent/50 active:border-accent/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          data-testid={`button-service-${key}`}
                        >
                          {img && (
                            <div className="w-full h-16 md:h-24 rounded-lg overflow-hidden mb-2 md:mb-3">
                              <img src={img} alt={label} className="w-full h-full object-cover" />
                            </div>
                          )}
                          {!img && (
                            <div className="w-full h-16 md:h-24 rounded-lg bg-muted/50 mb-2 md:mb-3 flex items-center justify-center">
                              <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs md:text-sm leading-tight">{label}</span>
                            <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'bg-accent border-accent' : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Step 3: Photos */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Upload up to 4 photos of the rooms you want painted. This helps us provide a more accurate estimate.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.base64}
                            alt={photo.roomType}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-remove-photo-${photo.id}`}
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs px-2 py-1 rounded-b-xl text-white">
                            {photo.roomType.replace('_', ' ')}
                          </div>
                        </div>
                      ))}
                      
                      {uploadedPhotos.length < 4 && (
                        <label className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-accent/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/20">
                          <ImagePlus className="w-8 h-8 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Add Photo</span>
                          <select
                            value={photoRoomType}
                            onChange={(e) => setPhotoRoomType(e.target.value)}
                            className="text-xs bg-transparent border-0 text-center text-muted-foreground"
                            onClick={(e) => e.stopPropagation()}
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            data-testid="input-photo-upload"
                          />
                        </label>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Photos are optional but help us give you a more accurate estimate
                    </p>
                  </div>
                )}

                {/* Step 4: Measurements & Colors */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Square Footage */}
                    {needsSquareFootage && (
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <Label className="mb-3 block font-semibold">Total Square Footage *</Label>
                        <div className="flex gap-3">
                          <Input
                            type="number"
                            value={squareFootage || ''}
                            onChange={(e) => setSquareFootage(Number(e.target.value))}
                            placeholder="e.g., 2500"
                            className="h-12 flex-1"
                            data-testid="input-square-footage"
                          />
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (isDemo && aiScannerUsed) {
                                alert("You've used your free AI Room Scanner. Subscribe for unlimited access.");
                                return;
                              }
                              setShowScannerModal(true);
                            }}
                            className={`h-12 ${isDemo && aiScannerUsed ? 'opacity-50' : ''}`}
                            data-testid="button-ai-scanner"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            {isDemo && aiScannerUsed ? (
                              <><Lock className="w-3 h-3 mr-1" /> Locked</>
                            ) : (
                              'AI Scan'
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Enter the total paintable square footage or use our AI scanner
                        </p>
                      </div>
                    )}

                    {/* Door Count */}
                    {needsDoors && (
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <Label className="mb-3 block font-semibold">Number of Doors *</Label>
                        <Input
                          type="number"
                          value={doorCount || ''}
                          onChange={(e) => setDoorCount(Number(e.target.value))}
                          placeholder="e.g., 8"
                          className="h-12"
                          min={0}
                          data-testid="input-door-count"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Count both sides if painting front and back
                        </p>
                      </div>
                    )}

                    {/* Cabinet Details */}
                    {needsCabinets && (
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <Label className="mb-3 block font-semibold">Cabinet Details *</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">Cabinet Doors</Label>
                            <Input
                              type="number"
                              value={cabinetDoors || ''}
                              onChange={(e) => setCabinetDoors(Number(e.target.value))}
                              placeholder="e.g., 20"
                              className="h-12"
                              min={0}
                              data-testid="input-cabinet-doors"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground mb-2 block">Cabinet Drawers</Label>
                            <Input
                              type="number"
                              value={cabinetDrawers || ''}
                              onChange={(e) => setCabinetDrawers(Number(e.target.value))}
                              placeholder="e.g., 10"
                              className="h-12"
                              min={0}
                              data-testid="input-cabinet-drawers"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Color Selection */}
                    <div className="p-4 rounded-xl bg-muted/10 border border-border">
                      <Label className="mb-3 block font-semibold flex items-center gap-2">
                        <Palette className="w-4 h-4 text-accent" />
                        Color Preferences (Optional)
                      </Label>
                      
                      <div className="space-y-3">
                        {Object.entries(jobSelections).filter(([_, selected]) => selected).map(([surface]) => {
                          const selectedColor = selectedColors.find(c => c.surface === surface);
                          return (
                            <div key={surface} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-border">
                              <span className="capitalize font-medium">{surface}</span>
                              {selectedColor ? (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: selectedColor.hexValue }}
                                  />
                                  <span className="text-sm">{selectedColor.colorName}</span>
                                  <button
                                    onClick={() => removeColor(surface)}
                                    className="w-5 h-5 rounded-full bg-muted hover:bg-red-100 flex items-center justify-center"
                                    data-testid={`button-remove-color-${surface}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setColorPickerSurface(surface as any);
                                    setShowColorPicker(true);
                                  }}
                                  data-testid={`button-pick-color-${surface}`}
                                >
                                  <Palette className="w-3 h-3 mr-1" />
                                  Pick Color
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Browse our curated color library or tell us about your preferences
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Submit */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-accent" />
                          Contact
                        </h3>
                        <p className="text-sm">{firstName} {lastName}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                        {phone && <p className="text-sm text-muted-foreground">{phone}</p>}
                        {address && <p className="text-sm text-muted-foreground">{address}</p>}
                      </div>
                      
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Paintbrush className="w-4 h-4 text-accent" />
                          Services
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(jobSelections)
                            .filter(([_, selected]) => selected)
                            .map(([service]) => (
                              <span key={service} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full capitalize">
                                {service}
                              </span>
                            ))}
                        </div>
                        {needsSquareFootage && (
                          <p className="text-sm text-muted-foreground mt-2">{squareFootage.toLocaleString()} sq ft</p>
                        )}
                        {needsDoors && doorCount > 0 && (
                          <p className="text-sm text-muted-foreground">{doorCount} doors</p>
                        )}
                        {needsCabinets && (cabinetDoors > 0 || cabinetDrawers > 0) && (
                          <p className="text-sm text-muted-foreground">{cabinetDoors} cabinet doors, {cabinetDrawers} drawers</p>
                        )}
                      </div>
                    </div>

                    {/* Uploaded Photos Preview */}
                    {uploadedPhotos.length > 0 && (
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-accent" />
                          Photos ({uploadedPhotos.length})
                        </h3>
                        <div className="flex gap-2 overflow-x-auto">
                          {uploadedPhotos.map(photo => (
                            <img 
                              key={photo.id} 
                              src={photo.base64} 
                              alt={photo.roomType}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Colors */}
                    {selectedColors.length > 0 && (
                      <div className="p-4 rounded-xl bg-muted/10 border border-border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Palette className="w-4 h-4 text-accent" />
                          Selected Colors
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedColors.map(color => (
                            <div key={color.surface} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-border">
                              <div 
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: color.hexValue }}
                              />
                              <div>
                                <p className="text-xs font-medium">{color.colorName}</p>
                                <p className="text-[10px] text-muted-foreground capitalize">{color.surface}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Package Selection */}
                    <div className="p-4 rounded-xl bg-muted/10 border border-border">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-accent" />
                        Choose Your Package
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {(["good", "better", "best"] as const).map((tier) => {
                          const tierData = pricingTierOptions[tier];
                          const isSelected = selectedPricingTier === tier;
                          const tierTotal = estimate.baseTotal * tierData.multiplier;
                          
                          return (
                            <motion.button
                              key={tier}
                              onClick={() => setSelectedPricingTier(tier)}
                              className={`relative p-4 rounded-xl text-center transition-all border-2 ${
                                isSelected 
                                  ? 'border-accent bg-accent/10 shadow-lg' 
                                  : 'border-border hover:border-accent/50'
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
                              
                              <div className="flex items-center justify-center gap-1 mb-2">
                                {tier === "good" && <Star className="w-4 h-4 text-muted-foreground" />}
                                {tier === "better" && <Star className="w-4 h-4 text-accent" />}
                                {tier === "best" && <Crown className="w-4 h-4 text-amber-400" />}
                              </div>
                              
                              <span className="text-sm font-bold block">{tierData.name}</span>
                              <span className="text-lg font-bold text-accent block mt-1">
                                ${tierTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </span>
                              
                              {isSelected && (
                                <motion.div 
                                  className="absolute top-2 right-2"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                >
                                  <Check className="w-4 h-4 text-accent" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 p-3 rounded-lg bg-white/50">
                        <p className="text-xs text-muted-foreground mb-2">{pricingTierOptions[selectedPricingTier].description}</p>
                        <div className="flex flex-wrap gap-1">
                          {pricingTierOptions[selectedPricingTier].features.map((feature, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="p-6 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent/30">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Your Estimate</span>
                        <motion.span 
                          key={estimate.total}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className="text-4xl font-display font-bold text-accent"
                        >
                          ${estimate.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </motion.span>
                      </div>
                      <p className="text-xs text-muted-foreground text-center border-t border-border/50 pt-4">
                        This estimate is a guide for discussion purposes only. Final pricing will be confirmed after an in-person consultation.
                      </p>
                    </div>

                    {/* Pro View - Material & Labor Breakdown (Contractors/Owners only) */}
                    {canAccessProTools && needsSquareFootage && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Wrench className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Pro View</p>
                              <p className="text-xs text-muted-foreground">
                                {squareFootage > 0 
                                  ? "Material quantities & labor estimates" 
                                  : "Enter square footage in Step 4 to see breakdown"}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={showProView}
                            onCheckedChange={setShowProView}
                            disabled={squareFootage <= 0}
                            data-testid="switch-pro-view"
                          />
                        </div>
                        
                        <AnimatePresence>
                          {showProView && needsSquareFootage && squareFootage > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <MaterialBreakdown
                                input={{
                                  squareFootage: squareFootage,
                                  includeWalls: jobSelections.walls,
                                  includeCeilings: jobSelections.ceilings,
                                  includeTrim: jobSelections.trim,
                                  doorCount: doorCount,
                                  roomCount: Math.max(1, Math.ceil(squareFootage / 250)),
                                  ceilingHeight: 9,
                                  surfaceCondition: "good",
                                  paintQuality: selectedPricingTier === "best" ? "ultra_premium" : selectedPricingTier === "better" ? "premium" : "standard"
                                }}
                                showPricing={true}
                                showLabor={true}
                                className="mt-4"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {submitError && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="h-12"
              data-testid="button-prev-step"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentStep < totalSteps ? (
              <FlipButton
                onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
                disabled={!canProceed(currentStep)}
                className="h-12"
                data-testid="button-next-step"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </FlipButton>
            ) : (
              <FlipButton
                onClick={handleSubmit}
                disabled={isSubmitting || estimate.total === 0}
                className="h-12"
                data-testid="button-submit-estimate"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Estimate
                  </>
                )}
              </FlipButton>
            )}
          </div>
        </div>
      </main>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowColorPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold capitalize">Select Color for {colorPickerSurface}</h3>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
                  data-testid="button-close-color-picker"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {availableColors.map((color) => (
                  <motion.button
                    key={color.id}
                    onClick={() => addColor(color, colorPickerSurface)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-testid={`button-color-${color.id}`}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-white shadow mb-2"
                      style={{ backgroundColor: color.hexValue }}
                    />
                    <span className="text-xs text-center line-clamp-2">{color.colorName}</span>
                    <span className="text-[10px] text-muted-foreground">{color.colorCode}</span>
                  </motion.button>
                ))}
              </div>
              
              {availableColors.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading colors...</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Room Scanner Modal */}
      {showScannerModal && (
        <RoomScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          onScanComplete={(sqft) => handleScannerResult({ squareFootage: sqft })}
        />
      )}
    </PageLayout>
  );
}
