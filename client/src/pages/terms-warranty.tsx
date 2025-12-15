import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Shield, FileText, Scale, CreditCard, AlertTriangle, Gavel, ScrollText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useTenant } from "@/context/TenantContext";

const sections = [
  {
    id: "warranty",
    title: "Warranty",
    icon: Shield,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
  },
  {
    id: "payment",
    title: "Payment Terms",
    icon: CreditCard,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "services",
    title: "Painting Services",
    icon: FileText,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  {
    id: "liability",
    title: "Liability",
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
  {
    id: "disputes",
    title: "Disputes & Governing Law",
    icon: Gavel,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
  },
  {
    id: "termination",
    title: "Termination",
    icon: ScrollText,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
  },
];

export default function TermsWarranty() {
  const tenant = useTenant();
  const warrantyYears = tenant.credentials?.warrantyYears || 3;

  return (
    <PageLayout>
      <div className="min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-green-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/20">
              <Scale className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Terms & Warranty
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our commitment to quality workmanship and transparent business practices.
              Please review these terms carefully before engaging our services.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 border border-border hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>

          <div className="space-y-8">
            <motion.section
              id="warranty"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Warranty</h2>
                    <p className="text-sm text-muted-foreground">{warrantyYears}-Year Workmanship Guarantee</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    The Contractor warrants that all painting services will be free from defects in workmanship 
                    for a period of <strong className="text-green-400">{warrantyYears} years</strong> from the project completion date.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        This Warranty Does NOT Cover:
                      </h4>
                      <ul className="space-y-1 text-muted-foreground text-xs">
                        <li>Damage from accidents, misuse, neglect, extreme weather, or water intrusion</li>
                        <li>Normal wear and tear, fading, or conditions outside the Contractor's control</li>
                        <li>Surfaces previously identified as unsuitable (e.g., damaged wood, moisture issues)</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Warranty Claim Process:
                      </h4>
                      <ul className="space-y-1 text-muted-foreground text-xs">
                        <li>Claims must be submitted in writing within 30 days of discovery</li>
                        <li>Repairs will be limited to affected areas</li>
                        <li>Repairs performed at the Contractor's discretion</li>
                        <li>This warranty replaces all other warranties, express or implied</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.section>

            <motion.section
              id="payment"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Payment Terms</h2>
                    <p className="text-sm text-muted-foreground">Deposit & Balance Structure</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    Unless otherwise stated, the Client shall pay <strong className="text-blue-400">25% of the total estimate</strong> as 
                    a deposit upon signing this Agreement.
                  </p>
                  <p>
                    The remaining <strong className="text-blue-400">75%</strong> (including any approved change orders) is due upon 
                    <strong> full completion</strong> of the agreed scope of work and upon receipt of a Final Invoice from {tenant.name}.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border">
                      <h4 className="font-semibold mb-2">Accepted Payment Methods:</h4>
                      <ul className="space-y-1 text-muted-foreground text-xs">
                        <li>Check</li>
                        <li>Credit card (subject to a 2.9% processing fee)</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Late Payment:
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        If the Final Invoice is not paid within 30 days, a <strong>1.5% monthly interest</strong> will apply. 
                        The Contractor reserves the right to pursue the balance due.
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    <strong>Additional Expenses:</strong> The Client shall not be responsible for any additional charges 
                    unless approved in writing by both Parties in advance.
                  </p>
                </div>
              </GlassCard>
            </motion.section>

            <motion.section
              id="services"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Painting Services</h2>
                    <p className="text-sm text-muted-foreground">Professional Standards & Equipment</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    The Contractor agrees to perform all painting services with the highest professional standards 
                    and in compliance with all applicable statutes, regulations, and authority requirements.
                  </p>
                  <p>
                    <strong>Equipment:</strong> The Contractor will provide all necessary tools and equipment 
                    required to complete the services.
                  </p>
                  <p>
                    <strong>Independent Contractor:</strong> The Contractor shall perform services as an independent 
                    contractor and is solely responsible for all applicable taxes and liabilities related to its operations.
                  </p>
                </div>
              </GlassCard>
            </motion.section>

            <motion.section
              id="liability"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Limitation of Liability</h2>
                    <p className="text-sm text-muted-foreground">Liability for Damages</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    Neither Party shall be liable for indirect, incidental, consequential, special, or exemplary damages 
                    (including lost profits or business interruption).
                  </p>
                  <p>
                    The <strong className="text-amber-400">maximum liability</strong> for either Party shall not exceed 
                    the total amount paid to the Contractor under this Agreement.
                  </p>
                  <p>
                    <strong>Liability for Damage:</strong> The Contractor is liable for any damage to property caused 
                    by its negligence or willful misconduct, including damage to the Client's or third-party property.
                  </p>
                </div>
              </GlassCard>
            </motion.section>

            <motion.section
              id="disputes"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Disputes & Governing Law</h2>
                    <p className="text-sm text-muted-foreground">Arbitration & Legal Framework</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    <strong>Governing Law:</strong> This Agreement shall be governed by and construed in accordance 
                    with the laws of the <strong className="text-red-400">State of Tennessee</strong>.
                  </p>
                  <p>
                    <strong>Dispute Resolution:</strong> All disputes shall be resolved by binding arbitration in 
                    the applicable County, Tennessee, under the Commercial Rules of the American Arbitration Association (AAA).
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Arbitration may be initiated by providing written notice</li>
                    <li>The arbitrator's decision will be final and binding</li>
                    <li>This arbitration clause shall be specifically enforceable</li>
                  </ul>
                  <p>
                    <strong>Entire Agreement & Amendment:</strong> This Agreement constitutes the entire agreement 
                    between the Parties and supersedes all prior negotiations, representations, or agreements. 
                    No amendment shall be valid unless made in writing and signed by both Parties.
                  </p>
                </div>
              </GlassCard>
            </motion.section>

            <motion.section
              id="termination"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <ScrollText className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold">Termination</h2>
                    <p className="text-sm text-muted-foreground">Contract Termination Rights</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    The Contractor reserves the right to terminate this Agreement at any time, with or without cause, 
                    by providing written notice to the Client. In the event of such termination:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>
                      The Contractor shall be entitled to compensation for all work completed up to the date of termination, 
                      including approved materials and any reasonable expenses incurred.
                    </li>
                    <li>
                      If work has not yet commenced, the Contractor may retain up to 10% of the deposit to cover 
                      administrative and mobilization costs.
                    </li>
                    <li>
                      Any remaining deposit shall be refunded to the Client within 14 business days, minus applicable charges.
                    </li>
                    <li>
                      The Contractor shall not be liable for any delays, costs, or damages incurred by the Client 
                      as a result of such termination.
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center pt-8"
            >
              <p className="text-sm text-muted-foreground mb-4">
                This Painting Services Agreement is made and entered into by and between 
                <strong className="text-foreground"> {tenant.name}, LLC</strong> (the "Contractor") 
                and the Client.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Last updated: December 2025
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
