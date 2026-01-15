import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Flame, 
  Sun, 
  Snowflake, 
  Home, 
  Building2, 
  PaintBucket,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: "residential" | "commercial" | "";
  projectType: string[];
  timeline: "hot" | "warm" | "cold" | "";
  squareFootage: string;
  description: string;
  budget: string;
}

const initialFormData: LeadFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  propertyType: "",
  projectType: [],
  timeline: "",
  squareFootage: "",
  description: "",
  budget: "",
};

const projectTypes = [
  { id: "interior", label: "Interior Painting" },
  { id: "exterior", label: "Exterior Painting" },
  { id: "cabinets", label: "Cabinet Painting" },
  { id: "trim", label: "Trim & Molding" },
  { id: "drywall", label: "Drywall Repair" },
  { id: "deck", label: "Deck Staining" },
  { id: "commercial", label: "Commercial Project" },
  { id: "other", label: "Other" },
];

const timelineOptions = [
  { 
    value: "hot", 
    label: "ASAP - Within 1 Week", 
    description: "I'm ready to get started immediately",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30"
  },
  { 
    value: "warm", 
    label: "Soon - 1-4 Weeks", 
    description: "Planning to start in the next month",
    icon: Sun,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/30"
  },
  { 
    value: "cold", 
    label: "Just Exploring", 
    description: "Getting quotes for future planning",
    icon: Snowflake,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/30"
  },
];

const budgetRanges = [
  "Under $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Not sure yet",
];

export function LeadSubmissionForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/marketplace/leads", {
        ...data,
        source: "marketplace",
        urgency: data.timeline,
      });
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "Local painters will contact you shortly with quotes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof LeadFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProjectType = (id: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: prev.projectType.includes(id)
        ? prev.projectType.filter(t => t !== id)
        : [...prev.projectType, id]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.timeline !== "";
      case 2:
        return formData.propertyType !== "" && formData.projectType.length > 0;
      case 3:
        return formData.name && formData.email && formData.phone && formData.zip;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (canProceed()) {
      submitMutation.mutate(formData);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="p-8 text-center" glow="gold">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">You're All Set!</h2>
          <p className="text-muted-foreground mb-4">
            Your request has been sent to verified painters in your area.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge className={timelineOptions.find(t => t.value === formData.timeline)?.bgColor}>
              {formData.timeline === "hot" && <Flame className="w-3 h-3 mr-1" />}
              {formData.timeline === "warm" && <Sun className="w-3 h-3 mr-1" />}
              {formData.timeline === "cold" && <Snowflake className="w-3 h-3 mr-1" />}
              {timelineOptions.find(t => t.value === formData.timeline)?.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Expect responses within 24-48 hours
          </p>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6" glow="gold">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-display font-bold">Get Free Quotes</h2>
      </div>

      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= s 
                ? "bg-amber-500 text-white" 
                : "bg-muted text-muted-foreground"
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                step > s ? "bg-amber-500" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">When do you need the work done?</h3>
            <RadioGroup
              value={formData.timeline}
              onValueChange={(v) => handleInputChange("timeline", v as LeadFormData["timeline"])}
              className="space-y-3"
            >
              {timelineOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.timeline === option.value 
                      ? option.bgColor 
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                  onClick={() => handleInputChange("timeline", option.value as LeadFormData["timeline"])}
                  data-testid={`radio-timeline-${option.value}`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <option.icon className={`w-6 h-6 mr-3 ${option.color}`} />
                  <div>
                    <Label htmlFor={option.value} className="text-base font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Type</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("propertyType", "residential")}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.propertyType === "residential"
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                  data-testid="button-property-residential"
                >
                  <Home className="w-8 h-8" />
                  <span className="font-medium">Residential</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("propertyType", "commercial")}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
                    formData.propertyType === "commercial"
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                  data-testid="button-property-commercial"
                >
                  <Building2 className="w-8 h-8" />
                  <span className="font-medium">Commercial</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">What needs painting?</h3>
              <div className="grid grid-cols-2 gap-2">
                {projectTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.projectType.includes(type.id)
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => toggleProjectType(type.id)}
                    data-testid={`checkbox-project-${type.id}`}
                  >
                    <Checkbox 
                      checked={formData.projectType.includes(type.id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="sqft">Approximate Square Footage (optional)</Label>
              <Input
                id="sqft"
                type="text"
                placeholder="e.g., 2000"
                value={formData.squareFootage}
                onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                data-testid="input-sqft"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">Your Contact Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-10"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    data-testid="input-name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-10"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Nashville"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  data-testid="input-city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="TN"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  data-testid="input-state"
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="zip"
                    className="pl-10"
                    placeholder="37203"
                    value={formData.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                    data-testid="input-zip"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <select
                id="budget"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                data-testid="select-budget"
              >
                <option value="">Select a range...</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="description">Project Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us more about your project..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                data-testid="input-description"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-6 pt-4 border-t">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            data-testid="button-next"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || submitMutation.isPending}
            className="bg-amber-500 hover:bg-amber-600"
            data-testid="button-submit-lead"
          >
            {submitMutation.isPending ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Get My Quotes
              </>
            )}
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
