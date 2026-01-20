import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { Phone, Mail, Calculator, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Start() {
  const tenant = useTenant();
  
  const phoneNumber = tenant.phone || "(615) 555-PAINT";
  const email = tenant.email || "service@nashvillepaintingprofessionals.com";
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

  return (
    <PageLayout>
      <main className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 text-center"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium text-accent uppercase tracking-wide">Premium Service</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Let's Get Started
            </h1>
            <p className="text-gray-600">
              Choose how you'd like to connect with us
            </p>
          </div>

          <div className="space-y-3">
            <a href={`tel:${cleanPhone}`} className="block">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg gap-3 bg-green-600 hover:bg-green-700 shadow-lg"
                data-testid="button-call-now"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </Button>
            </a>
            <p className="text-xs text-gray-500">{phoneNumber}</p>

            <a href={`mailto:${email}?subject=Quote Request from Instagram`} className="block">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full h-14 text-lg gap-3 border-2 shadow-md"
                data-testid="button-email-us"
              >
                <Mail className="w-5 h-5" />
                Email Us
              </Button>
            </a>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-gray-50 to-white px-4 text-sm text-gray-500">
                or get an instant quote
              </span>
            </div>
          </div>

          <Link href="/estimate">
            <Button 
              size="lg" 
              className="w-full h-16 text-lg gap-3 shadow-xl"
              data-testid="button-instant-estimate"
            >
              <Calculator className="w-5 h-5" />
              Get Instant Estimate
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-xs text-gray-500">Free AI-powered estimate in under 60 seconds</p>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {tenant.name} - Nashville's Most Trusted Painters
            </p>
          </div>
        </motion.div>
      </main>
    </PageLayout>
  );
}
