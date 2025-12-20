import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Brain, 
  Calendar, 
  Users, 
  FileText, 
  Shield, 
  Zap, 
  Globe,
  Smartphone,
  BarChart3,
  MessageSquare,
  CreditCard,
  Layers,
  ArrowRight,
  Sparkles,
  Building2
} from "lucide-react";
import { SiSolana } from "react-icons/si";

interface DemoWelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoWelcomeModal({ open, onClose }: DemoWelcomeModalProps) {
  const [step, setStep] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tools",
      description: "Room Visualizer, Color Library with 100+ curated colors, and intelligent estimating"
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "5-step customer wizard with availability management and automated reminders"
    },
    {
      icon: Users,
      title: "Crew Management",
      description: "Time tracking, job notes, incident reporting, and real-time crew coordination"
    },
    {
      icon: FileText,
      title: "PDF Document Center",
      description: "Digital signatures, contracts, estimates, and blockchain-verified documents"
    },
    {
      icon: BarChart3,
      title: "CRM Pipeline",
      description: "Lead tracking, deal stages, customer notes, and sales forecasting"
    },
    {
      icon: MessageSquare,
      title: "Internal Messaging",
      description: "Real-time chat with speech-to-text, typing indicators, and role badges"
    }
  ];

  const ecosystemApps = [
    { name: "Orbit Payroll", description: "Automated crew payments and tax filing" },
    { name: "Orbit Staffing", description: "Contractor marketplace and scheduling" },
    { name: "Darkwave Analytics", description: "Business intelligence dashboards" },
    { name: "Darkwave Commerce", description: "Payment processing and invoicing" }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Welcome to PaintPros.io
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  Complete Turnkey Business Solution
                </Badge>
                <h3 className="text-2xl font-bold text-gray-900">
                  The All-in-One Platform for Painting Contractors
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto">
                  PaintPros.io is a white-label SaaS platform that gives painting companies 
                  a premium online presence, AI-powered tools, and complete business management.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-gray-900 text-sm">{feature.title}</span>
                    </div>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(1)} className="gap-2">
                  Next: Ecosystem <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Connected Ecosystem
                </Badge>
                <h3 className="text-2xl font-bold text-gray-900">
                  Orbit + Darkwave Studios Integration
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto">
                  PaintPros.io seamlessly connects to the Orbit and Darkwave Studios 
                  ecosystem of business applications for complete operational control.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {ecosystemApps.map((app, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 bg-white space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-gray-900 text-sm">{app.name}</span>
                    </div>
                    <p className="text-xs text-gray-600">{app.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <SiSolana className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Blockchain Verification</h4>
                    <p className="text-sm text-gray-600">
                      All documents and estimates are stamped to the Solana blockchain 
                      for immutable proof of authenticity and tamper detection.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={() => setStep(2)} className="gap-2">
                  Next: Your Access <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  Full Demo Access
                </Badge>
                <h3 className="text-2xl font-bold text-gray-900">
                  Explore Everything
                </h3>
                <p className="text-gray-600 max-w-lg mx-auto">
                  As a Demo Viewer, you have read-only access to explore all dashboards 
                  and features across the entire platform.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">Dashboards You Can Access:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Owner", pin: "1111" },
                    { name: "Admin", pin: "4444" },
                    { name: "Developer", pin: "0424" },
                    { name: "Project Manager", pin: "2222" },
                    { name: "Crew Lead", pin: "3333" },
                    { name: "Demo Viewer", pin: "777" }
                  ].map((role, i) => (
                    <div key={i} className="p-2 rounded bg-gray-100 text-center">
                      <span className="text-sm font-medium text-gray-900">{role.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Read-Only Mode</h4>
                    <p className="text-sm text-gray-600">
                      You can view all features and sample data, but editing is disabled 
                      to preserve the demo environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={onClose} 
                  className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  <Zap className="w-4 h-4" />
                  Start Exploring
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === i ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
                data-testid={`step-indicator-${i}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
