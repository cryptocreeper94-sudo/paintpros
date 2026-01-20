import { PageLayout } from "@/components/layout/page-layout";
import { BookingWizard } from "@/components/booking-wizard";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";

export default function Book() {
  const tenant = useTenant();

  return (
    <PageLayout>
      <main className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-gray-50 to-white px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
              Book Your Appointment
            </h1>
            <p className="text-gray-600">
              Schedule a consultation with {tenant.name}
            </p>
          </motion.div>

          <BookingWizard />
        </div>
      </main>
    </PageLayout>
  );
}
