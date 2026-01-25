import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadCaptureModalProps {
  tenantId?: string;
  tenantName?: string;
}

export function LeadCaptureModal({ tenantId = "lumepaint", tenantName = "Lume Paint Co" }: LeadCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    timeline: "",
    notes: "",
  });

  // Show modal after a short delay on first visit
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem(`lume_modal_seen_${tenantId}`);
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tenantId]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(`lume_modal_seen_${tenantId}`, "true");
  };

  const leadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/leads", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: "popup_modal",
        projectType: data.projectType,
        timeline: data.timeline,
        notes: data.notes,
        tenantId,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: "Please fill in required fields",
        description: "Name and phone number are required.",
        variant: "destructive",
      });
      return;
    }
    leadMutation.mutate(formData);
  };

  const projectTypes = [
    "Interior Painting",
    "Exterior Painting",
    "Full Home (Interior + Exterior)",
    "Cabinet Painting",
    "Commercial Space",
    "Touch-ups & Repairs",
  ];

  const timelines = [
    "As soon as possible",
    "Within 2 weeks",
    "Within a month",
    "Just exploring options",
  ];

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[90%] sm:max-w-md bg-gradient-to-br from-gray-50 to-white border-gray-200">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Thank You!
            </h3>
            <p className="text-gray-600">
              We'll be in touch within 24 hours with your personalized estimate.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] sm:max-w-md p-0 border-[3px] border-[#1e3a5f] bg-[#1e3a5f] overflow-hidden shadow-2xl">
        <div className="m-2 border-2 border-[#0f1f33] rounded-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] bg-gradient-to-br from-gray-50 to-white p-6">
          <DialogHeader className="text-center pb-2">
            <div className="mb-3">
              <h2 className="font-display text-2xl text-[#1e3a5f] tracking-wide">Lume<span className="text-xs align-top">™</span> Paint Co</h2>
              <p className="text-xs text-[#1e3a5f]/70 italic mt-0.5">Elevating the backdrop of your life.</p>
            </div>
            <DialogTitle className="text-xl font-display text-[#1e3a5f]">
              Get Your Free Estimate
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Get your free estimate using our room visualizer tool - right from your phone!
            </DialogDescription>
          </DialogHeader>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Your Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/80 border-gray-200 focus:border-gray-400"
                    data-testid="input-modal-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(615) 555-0123"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-white/80 border-gray-200 focus:border-gray-400"
                    data-testid="input-modal-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/80 border-gray-200 focus:border-gray-400"
                    data-testid="input-modal-email"
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white"
                  disabled={!formData.name || !formData.phone}
                  data-testid="button-modal-next"
                >
                  Next Step
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-gray-700">What type of project?</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                  >
                    <SelectTrigger className="bg-white/80 border-gray-200" data-testid="select-modal-project">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">When do you need this done?</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                  >
                    <SelectTrigger className="bg-white/80 border-gray-200" data-testid="select-modal-timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-gray-700">Anything else we should know?</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tell us about your project..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-white/80 border-gray-200 focus:border-gray-400 min-h-[80px]"
                    data-testid="textarea-modal-notes"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-gray-300"
                    data-testid="button-modal-back"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white"
                    disabled={leadMutation.isPending}
                    data-testid="button-modal-submit"
                  >
                    {leadMutation.isPending ? "Sending..." : "Get My Estimate"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

          <div className="flex items-center justify-center gap-2 pt-4 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>Response within 24 hours</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
