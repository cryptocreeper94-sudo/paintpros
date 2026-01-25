import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";
import { motion } from "framer-motion";
import { Shield, Eye, Lock, Database, Bell, Mail, FileText, ExternalLink } from "lucide-react";

export default function PrivacyPolicy() {
  const tenant = useTenant();
  const currentYear = new Date().getFullYear();
  const lastUpdated = "January 25, 2026";

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
                <Shield className="w-7 h-7 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold mb-3" data-testid="text-privacy-title">
              Privacy Policy
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
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">
                    When you use our services, we may collect the following information:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span><strong className="text-foreground">Contact Information:</strong> Name, email address, phone number, and mailing address when you request an estimate or book services.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span><strong className="text-foreground">Project Details:</strong> Information about your property and painting needs to provide accurate estimates.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our website, including pages visited and features used.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span><strong className="text-foreground">Device Information:</strong> Browser type, IP address, and device identifiers for analytics and security.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Provide accurate painting estimates and quotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Schedule and coordinate painting services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Communicate with you about your projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Improve our website and services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Send service updates and promotional materials (with your consent)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your personal information. This includes encrypted data transmission (SSL/TLS), secure data storage, and regular security audits. We do not sell, trade, or rent your personal information to third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Cookies and Tracking</h2>
                  <p className="text-muted-foreground">
                    Our website uses cookies and similar technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser preferences. Some features may not function properly if cookies are disabled.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Your Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    You have the right to:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Access the personal information we hold about you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Request correction of inaccurate information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Request deletion of your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span>Opt out of marketing communications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="accent">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at:
                  </p>
                  <div className="mt-3 p-4 bg-muted/30 rounded-lg">
                    <p className="font-medium text-foreground">{tenant.name}</p>
                    {tenant.email && <p className="text-muted-foreground">{tenant.email}</p>}
                    {tenant.phone && <p className="text-muted-foreground">{tenant.phone}</p>}
                    {tenant.address && (
                      <p className="text-muted-foreground">
                        {tenant.address.city}, {tenant.address.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border/50">
              <p>&copy; {currentYear} {tenant.name}. All rights reserved.</p>
            </div>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
