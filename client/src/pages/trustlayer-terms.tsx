import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, CreditCard, AlertTriangle, Scale, Clock, Ban, Mail } from "lucide-react";

export default function TrustLayerTerms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          className="mb-8 text-slate-400 hover:text-white"
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-slate-400">TrustLayer by Orbit | TLId.io</p>
            </div>
          </div>

          <p className="text-slate-400 mb-8">Last Updated: January 30, 2026</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
              </div>
              <p className="leading-relaxed">
                By accessing or using TrustLayer services at TLId.io ("Service"), you agree to be bound 
                by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Service. 
                These Terms apply to all users, including businesses connecting their Meta Business Suite 
                for automated marketing services.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">2. Description of Service</h2>
              </div>
              <p className="leading-relaxed mb-4">
                TrustLayer provides automated digital marketing services including:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Automated posting to Facebook and Instagram via Meta Business Suite connection</li>
                <li>Ad campaign management and optimization within your specified budget</li>
                <li>Content scheduling and rotation based on your preferences</li>
                <li>Analytics and performance tracking</li>
                <li>Business verification and trust badge services (Guardian Shield)</li>
                <li>Integration with Orbit Staffing for workforce management</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">3. Subscription & Payment</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Pricing</h3>
                  <p className="leading-relaxed">
                    TrustLayer Marketing: $59/month. Guardian Shield: $49/month. Orbit Staffing Connect: $79/month. 
                    Complete Bundle: $149/month. Prices are subject to change with 30 days notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Billing</h3>
                  <p className="leading-relaxed">
                    Subscriptions are billed monthly in advance via Stripe. You authorize us to charge your 
                    payment method on file for recurring fees. Ad spend budgets are separate from subscription 
                    fees and are charged as incurred.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Cancellation</h3>
                  <p className="leading-relaxed">
                    You may cancel your subscription at any time. Cancellation takes effect at the end of 
                    your current billing period. No refunds are provided for partial months. Upon cancellation, 
                    automated posting will stop and your connected platforms will be disconnected.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">4. User Responsibilities</h2>
              </div>
              <p className="leading-relaxed mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Provide accurate business and account information</li>
                <li>Maintain valid authorization to post on your connected social media accounts</li>
                <li>Ensure all content you upload complies with applicable laws and platform policies</li>
                <li>Not use the Service for illegal, misleading, or harmful content</li>
                <li>Not violate Meta's Terms of Service or Community Standards</li>
                <li>Maintain sufficient funds for ad campaigns you configure</li>
                <li>Keep your account credentials secure</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Ban className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-semibold text-white">5. Prohibited Content</h2>
              </div>
              <p className="leading-relaxed mb-4">You may not upload or distribute content that:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Is illegal, fraudulent, or deceptive</li>
                <li>Infringes intellectual property rights</li>
                <li>Contains hate speech, harassment, or discrimination</li>
                <li>Promotes violence or illegal activities</li>
                <li>Contains malware or harmful code</li>
                <li>Violates Meta's advertising policies</li>
                <li>Makes false claims about products or services</li>
              </ul>
              <p className="leading-relaxed mt-4">
                We reserve the right to remove prohibited content and suspend accounts that violate these terms.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
              </div>
              <p className="leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>The Service is provided "AS IS" without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
                <li>We are not responsible for actions taken by Meta or other third-party platforms</li>
                <li>We do not guarantee specific marketing results, reach, or engagement</li>
                <li>Our total liability shall not exceed the amount you paid in the past 12 months</li>
                <li>We are not liable for platform outages, API changes, or account suspensions by third parties</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">7. Indemnification</h2>
              </div>
              <p className="leading-relaxed">
                You agree to indemnify and hold harmless TrustLayer, its officers, directors, employees, 
                and agents from any claims, damages, losses, or expenses (including legal fees) arising 
                from your use of the Service, your content, your violation of these Terms, or your violation 
                of any third-party rights or platform policies.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">8. Service Availability</h2>
              </div>
              <p className="leading-relaxed">
                We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform 
                maintenance, updates, or experience outages. Meta and other third-party platforms may 
                change their APIs or policies, which may affect our Service. We will make reasonable 
                efforts to adapt to such changes but are not liable for disruptions caused by third parties.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-pink-400" />
                <h2 className="text-xl font-semibold text-white">9. Intellectual Property</h2>
              </div>
              <p className="leading-relaxed">
                You retain ownership of content you upload. By using our Service, you grant us a license 
                to use, store, and distribute your content solely to provide the Service. The TrustLayer 
                platform, branding, and technology remain our exclusive property.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-semibold text-white">10. Governing Law & Disputes</h2>
              </div>
              <p className="leading-relaxed">
                These Terms are governed by the laws of the State of Tennessee. Any disputes shall be 
                resolved through binding arbitration in Nashville, Tennessee, except for claims that 
                may be brought in small claims court. You waive any right to participate in class actions.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">11. Contact Information</h2>
              </div>
              <p className="leading-relaxed">
                For questions about these Terms, contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                <p className="text-white font-medium">TrustLayer Legal</p>
                <p className="text-slate-400">Email: legal@tlid.io</p>
                <p className="text-slate-400">Support: support@tlid.io</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Changes to Terms</h2>
              <p className="leading-relaxed">
                We may modify these Terms at any time. Material changes will be communicated via email 
                or notice on our platform. Continued use after changes constitutes acceptance. If you 
                disagree with changes, you must cancel your subscription before they take effect.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-slate-500 text-sm">
              Part of the TrustLayer Ecosystem | Powered by DWTL.io Blockchain
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
