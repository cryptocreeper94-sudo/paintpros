import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { FileText, Scale, AlertCircle, Users, CreditCard, Ban, RefreshCw, Mail } from "lucide-react";

export default function Terms() {
  const tenant = useTenant();
  const currentYear = new Date().getFullYear();
  const lastUpdated = "January 30, 2026";

  return (
    <PageLayout>
      <main className="min-h-screen bg-background pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                <FileText className="w-7 h-7 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold mb-3" data-testid="text-terms-title">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Agreement to Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using our services, you agree to be bound by these Terms of Service 
                    and all applicable laws and regulations. If you do not agree with any of these terms, 
                    you are prohibited from using or accessing our services.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Use License</h2>
                  <p className="text-muted-foreground mb-4">
                    Permission is granted to temporarily use our services for personal or business purposes. 
                    This license does not include:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Modifying or copying our materials except as permitted</li>
                    <li>Using materials for commercial purposes without authorization</li>
                    <li>Attempting to reverse engineer any software</li>
                    <li>Removing any copyright or proprietary notations</li>
                    <li>Transferring the materials to another person</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Billing and Payments</h2>
                  <p className="text-muted-foreground mb-4">
                    For paid services:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>All fees are billed in advance on a monthly or annual basis</li>
                    <li>Prices are subject to change with 30 days notice</li>
                    <li>Refunds are handled on a case-by-case basis</li>
                    <li>You are responsible for providing accurate billing information</li>
                    <li>Failure to pay may result in service suspension</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Ban className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Prohibited Activities</h2>
                  <p className="text-muted-foreground mb-4">
                    You may not use our services to:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon intellectual property rights</li>
                    <li>Transmit harmful or malicious content</li>
                    <li>Engage in fraudulent or deceptive practices</li>
                    <li>Interfere with the proper functioning of our services</li>
                    <li>Collect user data without consent</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Disclaimer</h2>
                  <p className="text-muted-foreground">
                    Our services are provided "as is" without warranties of any kind, either express or implied. 
                    We do not warrant that our services will be uninterrupted, secure, or error-free. 
                    In no event shall we be liable for any indirect, incidental, special, consequential, 
                    or punitive damages arising from your use of our services.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Modifications</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to revise these terms at any time without notice. 
                    By continuing to use our services after any changes, you agree to be bound 
                    by the revised terms. It is your responsibility to review these terms periodically.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at{" "}
                    <a href="mailto:legal@paintpros.io" className="text-accent hover:underline">
                      legal@paintpros.io
                    </a>
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>&copy; {currentYear} {tenant.name}. All rights reserved.</p>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
