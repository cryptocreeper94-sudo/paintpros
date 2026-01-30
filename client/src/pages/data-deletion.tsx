import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { Trash2, Mail, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataDeletion() {
  const tenant = useTenant();
  const currentYear = new Date().getFullYear();

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
              <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold mb-3" data-testid="text-deletion-title">
              Data Deletion Request
            </h1>
            <p className="text-muted-foreground">
              How to request deletion of your personal data
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
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Your Privacy Rights</h2>
                  <p className="text-muted-foreground">
                    You have the right to request deletion of your personal data at any time. 
                    We are committed to protecting your privacy and will process your request 
                    in accordance with applicable data protection laws.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">How to Request Data Deletion</h2>
                  <p className="text-muted-foreground mb-4">
                    To request deletion of your data, please contact us using one of the following methods:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Email: <a href="mailto:privacy@paintpros.io" className="text-accent hover:underline">privacy@paintpros.io</a></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Include "Data Deletion Request" in the subject line</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Provide the email address associated with your account</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">What Happens Next</h2>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>We will verify your identity to protect your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>Your request will be processed within 30 days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>You will receive confirmation once deletion is complete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>Some data may be retained for legal compliance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Data We Will Delete</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>Account information and profile data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>Contact information and preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>Usage data and analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <span>Marketing preferences and communication history</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <div className="text-center pt-4">
              <Button asChild variant="outline" size="lg">
                <a href="mailto:privacy@paintpros.io?subject=Data%20Deletion%20Request" data-testid="button-request-deletion">
                  <Mail className="w-4 h-4 mr-2" />
                  Request Data Deletion
                </a>
              </Button>
            </div>
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
