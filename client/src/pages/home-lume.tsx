import { PageLayout } from "@/components/layout/page-layout";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { LeadCaptureModal } from "@/components/lead-generation/lead-capture-modal";

export default function HomeLume() {
  const tenant = useTenant();

  return (
    <PageLayout>
      <LeadCaptureModal tenantId={tenant.id} tenantName={tenant.name} />
      
      <main className="fixed inset-0 flex items-center justify-center bg-white" style={{ top: '60px', bottom: '40px' }}>
        <section 
          className="w-full h-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right, white 0%, #e5e7eb 25%, #9ca3af 50%, #e5e7eb 75%, white 100%)'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-wide text-gray-800"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              Lume
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 font-light">
              We elevate the backdrop of your life.
            </p>
          </motion.div>
        </section>
      </main>
    </PageLayout>
  );
}
