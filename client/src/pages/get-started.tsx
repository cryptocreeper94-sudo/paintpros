import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Palette, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  Sparkles,
  DollarSign,
  Clock,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PartnershipType = "franchise" | "custom" | null;

export default function GetStarted() {
  const [selectedType, setSelectedType] = useState<PartnershipType>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cityName: "",
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    territory: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDomainPreview = () => {
    if (selectedType === "franchise" && formData.cityName) {
      const prefix = formData.cityName.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
      return `${prefix}paintpros.io`;
    }
    return formData.businessName ? `${formData.businessName.toLowerCase().replace(/[^a-z]/g, "")}.com` : "yourbrand.com";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Get Started with PaintPros</h1>
          <p className="text-muted-foreground">
            Choose your partnership model and we'll have you up and running in days, not months.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <Card 
                  className={`p-6 cursor-pointer transition-all hover-elevate ${
                    selectedType === "franchise" 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : ""
                  }`}
                  onClick={() => setSelectedType("franchise")}
                  data-testid="card-franchise-option"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">PaintPros Franchise</h3>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>[City]PaintPros.io domain included</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>Proven branding and marketing playbook</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>Exclusive territory protection</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>Launch in 48 hours</span>
                    </li>
                  </ul>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">$299</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <span className="text-sm text-muted-foreground">$499 setup</span>
                    </div>
                  </div>
                </Card>

                <Card 
                  className={`p-6 cursor-pointer transition-all hover-elevate ${
                    selectedType === "custom" 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : ""
                  }`}
                  onClick={() => setSelectedType("custom")}
                  data-testid="card-custom-option"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Custom White-Label</h3>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Your brand, your domain, your identity</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Full color and messaging customization</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>No PaintPros branding anywhere</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>Priority support included</span>
                    </li>
                  </ul>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">$499</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <span className="text-sm text-muted-foreground">$999 setup</span>
                    </div>
                  </div>
                </Card>
              </div>

              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <Button 
                    size="lg" 
                    onClick={() => setStep(2)}
                    data-testid="button-continue"
                  >
                    Continue with {selectedType === "franchise" ? "Franchise" : "Custom"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  {selectedType === "franchise" ? (
                    <MapPin className="w-6 h-6 text-primary" />
                  ) : (
                    <Palette className="w-6 h-6 text-primary" />
                  )}
                  <h2 className="text-xl font-semibold">
                    {selectedType === "franchise" ? "Franchise Details" : "Your Brand Details"}
                  </h2>
                </div>

                <div className="space-y-4">
                  {selectedType === "franchise" ? (
                    <>
                      <div>
                        <Label htmlFor="cityName">City Name</Label>
                        <Input 
                          id="cityName"
                          placeholder="e.g., Nashville, Franklin, Murfreesboro"
                          value={formData.cityName}
                          onChange={(e) => handleInputChange("cityName", e.target.value)}
                          data-testid="input-city-name"
                        />
                        {formData.cityName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Your domain: <span className="font-mono text-primary">{getDomainPreview()}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="territory">Service Territory</Label>
                        <Input 
                          id="territory"
                          placeholder="e.g., Davidson County, Williamson County"
                          value={formData.territory}
                          onChange={(e) => handleInputChange("territory", e.target.value)}
                          data-testid="input-territory"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input 
                        id="businessName"
                        placeholder="e.g., Smith Painting Co"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        data-testid="input-business-name"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="contactName">Your Name</Label>
                    <Input 
                      id="contactName"
                      placeholder="Full name"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      data-testid="input-contact-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(1)}
                    data-testid="button-back"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setStep(3)}
                    data-testid="button-review"
                  >
                    Review & Submit
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 max-w-lg mx-auto">
                <div className="text-center mb-6">
                  <Sparkles className="w-12 h-12 mx-auto text-primary mb-3" />
                  <h2 className="text-xl font-semibold">Almost There!</h2>
                  <p className="text-muted-foreground">Review your selection</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Partnership Type</span>
                    <Badge>{selectedType === "franchise" ? "Franchise" : "Custom White-Label"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Domain</span>
                    <span className="font-mono text-sm">{getDomainPreview()}</span>
                  </div>
                  {selectedType === "franchise" && formData.territory && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Territory</span>
                      <span className="text-sm">{formData.territory}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="text-sm">{formData.contactName || formData.email}</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Investment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>One-time Setup Fee</span>
                      <span className="font-semibold">${selectedType === "franchise" ? "499" : "999"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Platform Fee</span>
                      <span className="font-semibold">${selectedType === "franchise" ? "299" : "499"}/mo</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Due Today</span>
                      <span className="text-primary">${selectedType === "franchise" ? "798" : "1,498"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
                  <div className="p-2">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-muted-foreground">48hr Launch</span>
                  </div>
                  <div className="p-2">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Cancel Anytime</span>
                  </div>
                  <div className="p-2">
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <span className="text-muted-foreground">Full Platform</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep(2)}
                    data-testid="button-back-review"
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1"
                    data-testid="button-submit"
                  >
                    Submit Application
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  We'll review your application and reach out within 24 hours.
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
