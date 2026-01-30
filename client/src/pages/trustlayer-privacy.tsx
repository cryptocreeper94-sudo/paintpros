import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Globe, Mail } from "lucide-react";

export default function TrustLayerPrivacy() {
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-slate-400">TrustLayer by Orbit | TLId.io</p>
            </div>
          </div>

          <p className="text-slate-400 mb-8">Last Updated: January 30, 2026</p>

          <div className="space-y-8 text-slate-300">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
              </div>
              <p className="leading-relaxed">
                TrustLayer ("we," "our," or "us") operates the TLId.io platform and related services. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our automated digital marketing services, including connections to Meta Business 
                Suite (Facebook/Instagram) and other third-party platforms.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">2. Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Account Information</h3>
                  <p className="leading-relaxed">
                    When you create an account, we collect your name, email address, business name, 
                    and billing information necessary to process payments through Stripe.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Connected Platform Data</h3>
                  <p className="leading-relaxed">
                    When you connect your Meta Business Suite, we receive access tokens that allow us to 
                    post content and manage ads on your behalf. We access only the permissions you explicitly 
                    authorize and do not store your Facebook/Instagram passwords.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Content & Media</h3>
                  <p className="leading-relaxed">
                    We store the images, messages, and content you upload to our platform for automated 
                    posting. This content remains your property and is used solely for the services you request.
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Analytics Data</h3>
                  <p className="leading-relaxed">
                    We collect performance metrics from your connected platforms (reach, engagement, ad spend) 
                    to provide analytics dashboards and optimize your campaigns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">3. How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>To provide automated posting services to Facebook, Instagram, and other platforms</li>
                <li>To manage and optimize your advertising campaigns within your set budget</li>
                <li>To process payments and manage your subscription</li>
                <li>To provide analytics and performance reports</li>
                <li>To communicate with you about your account and our services</li>
                <li>To improve our platform and develop new features</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">4. Information Sharing</h2>
              </div>
              <p className="leading-relaxed mb-4">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li><strong>Service Providers:</strong> Stripe for payment processing, Meta for social media posting</li>
                <li><strong>Connected Platforms:</strong> To publish content you authorize on your social media accounts</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">5. Data Security</h2>
              </div>
              <p className="leading-relaxed">
                We implement industry-standard security measures including encryption, secure access controls, 
                and regular security audits. Access tokens for connected platforms are encrypted at rest. 
                All data is verified through the DWTL.io blockchain trust layer for integrity.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">6. Your Rights</h2>
              </div>
              <p className="leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 leading-relaxed">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Disconnect your Meta Business Suite at any time</li>
                <li>Opt out of marketing communications</li>
                <li>Export your content and data</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">7. Third-Party Platforms</h2>
              </div>
              <p className="leading-relaxed">
                When you connect Meta Business Suite or other platforms, those platforms have their own 
                privacy policies. We encourage you to review Meta's Privacy Policy and any other connected 
                platform's policies. We are not responsible for the privacy practices of third-party platforms.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-pink-400" />
                <h2 className="text-xl font-semibold text-white">8. Contact Us</h2>
              </div>
              <p className="leading-relaxed">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
                <p className="text-white font-medium">TrustLayer Privacy Team</p>
                <p className="text-slate-400">Email: privacy@tlid.io</p>
                <p className="text-slate-400">Support: support@tlid.io</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new policy on this page and updating the "Last Updated" date. 
                Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-slate-500 text-sm">
              Part of the Orbit Ecosystem | Powered by DWTL.io Blockchain
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
