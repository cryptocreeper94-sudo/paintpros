import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { FlipButton } from "@/components/ui/flip-button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTenant } from "@/context/TenantContext";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { 
  Home, Building2, Paintbrush, Store, 
  CalendarDays, Clock, User, CheckCircle,
  ArrowLeft, ArrowRight, Loader2
} from "lucide-react";

interface LeadData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface BookingWizardProps {
  lead?: LeadData | null;
}

interface BookingData {
  serviceType: string;
  scheduledDate: Date | null;
  scheduledTime: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  projectDescription: string;
  referralSource: string;
}

const serviceTypes = [
  { id: "interior", label: "Interior Painting", icon: Paintbrush, description: "Walls, ceilings, trim, and doors" },
  { id: "exterior", label: "Exterior Painting", icon: Home, description: "Siding, trim, and outdoor surfaces" },
  { id: "commercial", label: "Commercial", icon: Store, description: "Office, retail, and business spaces" },
  { id: "residential", label: "Residential", icon: Building2, description: "Full home painting projects" },
];

const steps = [
  { id: 1, title: "Service Type", icon: Paintbrush },
  { id: 2, title: "Select Date", icon: CalendarDays },
  { id: 3, title: "Select Time", icon: Clock },
  { id: 4, title: "Your Details", icon: User },
  { id: 5, title: "Confirmation", icon: CheckCircle },
];

export function BookingWizard({ lead }: BookingWizardProps) {
  const tenant = useTenant();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Use lazy initializer to safely read prefill data from localStorage (only runs once)
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    let prefillData = null;
    if (typeof window !== 'undefined') {
      try {
        const prefill = localStorage.getItem("prefill_booking");
        if (prefill) {
          prefillData = JSON.parse(prefill);
          localStorage.removeItem("prefill_booking"); // Clear after reading
        }
      } catch (e) {
        console.error("Error reading prefill data:", e);
      }
    }
    
    return {
      serviceType: prefillData?.serviceType || "",
      scheduledDate: null,
      scheduledTime: "",
      customerFirstName: prefillData?.customerFirstName || lead?.firstName || "",
      customerLastName: prefillData?.customerLastName || lead?.lastName || "",
      customerEmail: prefillData?.customerEmail || lead?.email || "",
      customerPhone: prefillData?.customerPhone || lead?.phone || "",
      customerAddress: prefillData?.customerAddress || "",
      projectDescription: prefillData?.projectDescription || "",
      referralSource: prefillData?.referralSource || "",
    };
  });
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  
  const hasLeadEmail = !!(lead?.email);

  const dateString = bookingData.scheduledDate 
    ? format(bookingData.scheduledDate, "yyyy-MM-dd") 
    : "";

  const { data: slotsData, isLoading: slotsLoading, refetch: refetchSlots } = useQuery({
    queryKey: ["/api/availability/slots", dateString, tenant.id],
    queryFn: async () => {
      if (!dateString) return { date: "", slots: [] };
      const res = await fetch(`/api/availability/slots?date=${dateString}&tenantId=${tenant.id}`);
      return res.json();
    },
    enabled: !!dateString,
  });

  const initAvailabilityMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/availability/init", { tenantId: tenant.id });
      return res.json();
    },
    onSuccess: () => {
      if (dateString) {
        refetchSlots();
      }
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingData) => {
      const res = await apiRequest("POST", "/api/bookings", {
        tenantId: tenant.id,
        customerName: `${data.customerFirstName} ${data.customerLastName}`.trim(),
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        serviceType: data.serviceType,
        projectDescription: data.projectDescription,
        scheduledDate: data.scheduledDate?.toISOString(),
        scheduledTime: data.scheduledTime,
        referralSource: data.referralSource,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setSubmittedBooking(data);
      setCurrentStep(5);
    },
  });

  useEffect(() => {
    initAvailabilityMutation.mutate();
  }, []);

  // Sync bookingData when lead data is available/changes
  useEffect(() => {
    if (lead) {
      setBookingData(prev => ({
        ...prev,
        customerFirstName: lead.firstName || prev.customerFirstName,
        customerLastName: lead.lastName || prev.customerLastName,
        customerEmail: lead.email || prev.customerEmail,
        customerPhone: lead.phone || prev.customerPhone,
      }));
    }
  }, [lead]);

  const handleServiceSelect = (serviceId: string) => {
    setBookingData(prev => ({ ...prev, serviceType: serviceId }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setBookingData(prev => ({ ...prev, scheduledDate: date, scheduledTime: "" }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, scheduledTime: time }));
  };

  const handleInputChange = (field: keyof BookingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!bookingData.serviceType;
      case 2: return !!bookingData.scheduledDate;
      case 3: return !!bookingData.scheduledTime;
      case 4: return !!(bookingData.customerFirstName && bookingData.customerLastName && bookingData.customerEmail);
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      createBookingMutation.mutate(bookingData);
    } else if (currentStep < 5 && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setBookingData({
      serviceType: "",
      scheduledDate: null,
      scheduledTime: "",
      customerFirstName: lead?.firstName || "",
      customerLastName: lead?.lastName || "",
      customerEmail: lead?.email || "",
      customerPhone: lead?.phone || "",
      customerAddress: "",
      projectDescription: "",
      referralSource: "",
    });
    setSubmittedBooking(null);
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <GlassCard className="p-6" data-testid="booking-wizard">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
                animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                data-testid={`step-indicator-${step.id}`}
              >
                <step.icon className="w-5 h-5" />
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 w-8 md:w-16 mx-1 ${
                  currentStep > step.id ? "bg-accent" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-center">{steps[currentStep - 1].title}</h3>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-[300px]"
        >
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map((service) => (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    bookingData.serviceType === service.id
                      ? "border-accent bg-accent/10"
                      : "border-muted hover:border-accent/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`service-${service.id}`}
                >
                  <service.icon className="w-8 h-8 mb-2 text-accent" />
                  <h4 className="font-semibold">{service.label}</h4>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </motion.button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={bookingData.scheduledDate || undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                defaultMonth={new Date()}
                className="rounded-lg border"
                data-testid="date-picker"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              {slotsLoading || initAvailabilityMutation.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <span className="ml-2">Loading available times...</span>
                </div>
              ) : slotsData?.slots?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {slotsData.slots.map((slot: string) => (
                    <motion.button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        bookingData.scheduledTime === slot
                          ? "border-accent bg-accent/10"
                          : "border-muted hover:border-accent/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      data-testid={`time-slot-${slot.replace(':', '')}`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1 text-accent" />
                      <span className="text-sm font-medium">{formatTimeDisplay(slot)}</span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" data-testid="no-availability-message">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No availability for this date. Please try another day.</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerFirstName">First Name *</Label>
                  <Input
                    id="customerFirstName"
                    value={bookingData.customerFirstName}
                    onChange={handleInputChange("customerFirstName")}
                    placeholder="John"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerLastName">Last Name *</Label>
                  <Input
                    id="customerLastName"
                    value={bookingData.customerLastName}
                    onChange={handleInputChange("customerLastName")}
                    placeholder="Smith"
                    data-testid="input-last-name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={bookingData.customerEmail}
                    onChange={handleInputChange("customerEmail")}
                    placeholder="your@email.com"
                    readOnly={hasLeadEmail}
                    className={hasLeadEmail ? "bg-muted/30 cursor-not-allowed" : ""}
                    data-testid="input-email"
                  />
                  {hasLeadEmail && (
                    <p className="text-xs text-muted-foreground mt-1">Email captured from estimate</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={bookingData.customerPhone}
                    onChange={handleInputChange("customerPhone")}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input
                    id="customerAddress"
                    value={bookingData.customerAddress}
                    onChange={handleInputChange("customerAddress")}
                    placeholder="Your project address"
                    data-testid="input-address"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={bookingData.projectDescription}
                  onChange={handleInputChange("projectDescription")}
                  placeholder="Tell us about your painting project..."
                  rows={3}
                  data-testid="input-description"
                />
              </div>
              <div>
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <select
                  id="referralSource"
                  value={bookingData.referralSource}
                  onChange={(e) => setBookingData(prev => ({ ...prev, referralSource: e.target.value }))}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  data-testid="select-referral-source"
                >
                  <option value="">Select an option...</option>
                  <option value="google">Google Search</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="billboard">Billboard</option>
                  <option value="car_wrap">Car Wrap / Vehicle</option>
                  <option value="yard_sign">Yard Sign</option>
                  <option value="flyer">Flyer / Door Hanger</option>
                  <option value="referral">Friend / Family Referral</option>
                  <option value="nextdoor">Nextdoor</option>
                  <option value="yelp">Yelp</option>
                  <option value="homeadvisor">HomeAdvisor / Angi</option>
                  <option value="repeat">Previous Customer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 5 && submittedBooking && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Thank you for scheduling your consultation.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 max-w-md mx-auto text-left space-y-2">
                <p><strong>Service:</strong> {serviceTypes.find(s => s.id === bookingData.serviceType)?.label}</p>
                <p><strong>Date:</strong> {bookingData.scheduledDate ? format(bookingData.scheduledDate, "MMMM d, yyyy") : ""}</p>
                <p><strong>Time:</strong> {formatTimeDisplay(bookingData.scheduledTime)}</p>
                <p><strong>Name:</strong> {bookingData.customerFirstName} {bookingData.customerLastName}</p>
                <p><strong>Email:</strong> {bookingData.customerEmail}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                A confirmation email has been sent to {bookingData.customerEmail}
              </p>
              <FlipButton onClick={resetWizard} className="mt-6" data-testid="button-book-another">
                Book Another Consultation
              </FlipButton>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {currentStep < 5 && (
        <div className="flex justify-between mt-6 pt-4 border-t border-muted">
          <FlipButton
            onClick={handleBack}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "opacity-50" : ""}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </FlipButton>
          <FlipButton
            onClick={handleNext}
            disabled={!canProceed() || createBookingMutation.isPending}
            data-testid="button-next"
          >
            {createBookingMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : currentStep === 4 ? (
              <>
                Confirm Booking
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </FlipButton>
        </div>
      )}
    </GlassCard>
  );
}
