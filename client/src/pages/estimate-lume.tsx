import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { useTenant } from "@/context/TenantContext";
import { apiRequest } from "@/lib/queryClient";
import { format, addDays } from "date-fns";
import { 
  Home, Building2, Paintbrush, 
  CalendarDays, Clock, User, CheckCircle,
  ArrowLeft, ArrowRight, Loader2, Palette,
  Phone, Mail, MapPin, Ruler, Sparkles,
  Smartphone, Download
} from "lucide-react";
import { Link } from "wouter";

import rollieMascot from "@assets/generated_images/rollie_bw_final.png";

interface EstimateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: "interior" | "exterior" | "cabinets" | "";
  rooms: {
    living: boolean;
    bedroom: boolean;
    bathroom: boolean;
    kitchen: boolean;
    dining: boolean;
    office: boolean;
    hallway: boolean;
    other: boolean;
  };
  surfaces: {
    walls: boolean;
    ceilings: boolean;
    trim: boolean;
    doors: boolean;
  };
  squareFootage: string;
  colorPreference: string;
  additionalNotes: string;
  preferredDate: Date | null;
  preferredTime: string;
}

const timeSlots = [
  "Morning (8am - 12pm)",
  "Afternoon (12pm - 4pm)",
  "Evening (4pm - 6pm)",
];

export default function EstimateLume() {
  const tenant = useTenant();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  const [data, setData] = useState<EstimateData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    rooms: {
      living: false,
      bedroom: false,
      bathroom: false,
      kitchen: false,
      dining: false,
      office: false,
      hallway: false,
      other: false,
    },
    surfaces: {
      walls: true,
      ceilings: false,
      trim: false,
      doors: false,
    },
    squareFootage: "",
    colorPreference: "",
    additionalNotes: "",
    preferredDate: null,
    preferredTime: "",
  });

  const totalSteps = 4;

  const submitMutation = useMutation({
    mutationFn: async (formData: EstimateData) => {
      const res = await apiRequest("POST", "/api/estimates/submit", {
        tenantId: tenant.id,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        services: {
          type: formData.serviceType,
          rooms: formData.rooms,
          surfaces: formData.surfaces,
        },
        measurements: {
          squareFootage: parseInt(formData.squareFootage) || 0,
        },
        colorPreference: formData.colorPreference,
        notes: formData.additionalNotes,
        appointment: {
          preferredDate: formData.preferredDate?.toISOString(),
          preferredTime: formData.preferredTime,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const updateField = <K extends keyof EstimateData>(field: K, value: EstimateData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = data.firstName.trim() && data.email.includes("@") && data.phone.length >= 10;
  const isStep2Valid = data.serviceType !== "" && Object.values(data.surfaces).some(Boolean);
  const isStep3Valid = true;
  
  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      case 4: return true;
      default: return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            Request Received
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you, {data.firstName}! We've received your estimate request and will reach out shortly.
          </p>
          {data.preferredDate && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Preferred Callback</p>
              <p className="font-medium">
                {format(data.preferredDate, "EEEE, MMMM d")} - {data.preferredTime}
              </p>
              <p className="text-xs text-gray-400 mt-2">We'll call to confirm</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to <strong>{data.email}</strong>
          </p>
          <Link href="/">
            <Button variant="outline" className="border-black text-black hover:bg-gray-100" data-testid="button-return-home">
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="h-14 border-b border-gray-100 flex items-center justify-between px-4">
        <Link href="/">
          <span className="text-xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            Lume
          </span>
        </Link>
        <span className="text-sm text-gray-500">Free Estimate</span>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
              Get Your Free Estimate
            </h1>
            <img src={rollieMascot} alt="" className="w-12 h-12 object-contain" />
          </div>
          
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step <= currentStep ? "bg-black" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </h2>
                  <p className="text-sm text-gray-500">How can we reach you?</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={data.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="John"
                        className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={data.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Smith"
                        className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="(615) 555-0123"
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Property Address</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="address"
                        value={data.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="123 Main St, Nashville, TN"
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                        data-testid="input-address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <Paintbrush className="w-5 h-5" />
                    Project Details
                  </h2>
                  <p className="text-sm text-gray-500">Tell us about your painting project</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Service Type *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "interior", label: "Interior", icon: Home },
                        { id: "exterior", label: "Exterior", icon: Building2 },
                        { id: "cabinets", label: "Cabinets", icon: Sparkles },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => updateField("serviceType", id as "interior" | "exterior" | "cabinets")}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            data.serviceType === id
                              ? "border-black bg-black text-white"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          data-testid={`button-service-${id}`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.serviceType === "interior" && (
                    <div>
                      <Label className="mb-3 block">Rooms to Paint</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries({
                          living: "Living Room",
                          bedroom: "Bedrooms",
                          bathroom: "Bathrooms",
                          kitchen: "Kitchen",
                          dining: "Dining Room",
                          office: "Office",
                          hallway: "Hallways",
                          other: "Other",
                        }).map(([key, label]) => (
                          <label
                            key={key}
                            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={data.rooms[key as keyof typeof data.rooms]}
                              onCheckedChange={(checked) =>
                                updateField("rooms", { ...data.rooms, [key]: checked })
                              }
                            />
                            <span className="text-sm">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="mb-3 block">Surfaces *</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries({
                        walls: "Walls",
                        ceilings: "Ceilings",
                        trim: "Trim & Molding",
                        doors: "Doors",
                      }).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            updateField("surfaces", {
                              ...data.surfaces,
                              [key]: !data.surfaces[key as keyof typeof data.surfaces],
                            })
                          }
                          className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                            data.surfaces[key as keyof typeof data.surfaces]
                              ? "border-black bg-black text-white"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          data-testid={`button-surface-${key}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sqft">Approximate Square Footage</Label>
                    <div className="relative mt-1">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="sqft"
                        type="number"
                        value={data.squareFootage}
                        onChange={(e) => updateField("squareFootage", e.target.value)}
                        placeholder="e.g., 1500"
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black"
                        data-testid="input-sqft"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Don't know? We'll measure during the consultation.</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Schedule Consultation
                  </h2>
                  <p className="text-sm text-gray-500">When would you like us to call?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Preferred Date</Label>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <Calendar
                        mode="single"
                        selected={data.preferredDate || undefined}
                        onSelect={(date) => updateField("preferredDate", date || null)}
                        disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Preferred Time</Label>
                    <div className="grid gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => updateField("preferredTime", slot)}
                          className={`p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                            data.preferredTime === slot
                              ? "border-black bg-black text-white"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          data-testid={`button-time-${slot.split(" ")[0].toLowerCase()}`}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    We'll call to confirm your appointment time.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Final Details
                  </h2>
                  <p className="text-sm text-gray-500">Any colors or notes to share?</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="colors">Color Preferences</Label>
                    <Input
                      id="colors"
                      value={data.colorPreference}
                      onChange={(e) => updateField("colorPreference", e.target.value)}
                      placeholder="e.g., White walls, dark trim, or 'not sure yet'"
                      className="mt-1 border-gray-300 focus:border-black focus:ring-black"
                      data-testid="input-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      We can help with color selection during consultation.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={data.additionalNotes}
                      onChange={(e) => updateField("additionalNotes", e.target.value)}
                      placeholder="Any special requests, timeline needs, or questions..."
                      className="mt-1 min-h-[100px] border-gray-300 focus:border-black focus:ring-black"
                      data-testid="input-notes"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium mb-3">Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service:</span>
                        <span className="font-medium capitalize">{data.serviceType} Painting</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Surfaces:</span>
                        <span className="font-medium">
                          {Object.entries(data.surfaces)
                            .filter(([_, v]) => v)
                            .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                            .join(", ")}
                        </span>
                      </div>
                      {data.squareFootage && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Sq Ft:</span>
                          <span className="font-medium">{data.squareFootage}</span>
                        </div>
                      )}
                      {data.preferredDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Callback:</span>
                          <span className="font-medium">
                            {format(data.preferredDate, "MMM d")} - {data.preferredTime.split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900 text-white rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="w-5 h-5" />
                      <span className="font-medium">Want Enhanced Features?</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Download our mobile app for room scanning, instant color matching, and real-time estimates.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white hover:text-black w-full"
                      data-testid="button-download-app"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Get the Lume App
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex-1 border-gray-300"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              data-testid="button-next"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => submitMutation.mutate(data)}
              disabled={submitMutation.isPending}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
              data-testid="button-submit"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
