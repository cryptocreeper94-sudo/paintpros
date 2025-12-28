import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Printer, CheckCircle2, ArrowRight, Calendar, DollarSign, Briefcase, Users, Globe, Wrench, TrendingUp } from "lucide-react";

export default function ProposalPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      {/* Proposal Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0">
        
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A5D3E] to-[#5A6D4E] flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partnership Proposal</h1>
          <p className="text-lg text-gray-600">The Murfreesboro Project</p>
          <p className="text-sm text-gray-500 mt-2">Prepared: December 2024</p>
        </div>

        <Separator className="my-8" />

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#4A5D3E]" />
            Executive Summary
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                This proposal outlines a strategic partnership for the development and management of the Murfreesboro expansion project. The engagement includes comprehensive digital presence development, IT infrastructure, project management support, and future advertising capabilities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The partnership is structured in two phases: a 3-month beta period to establish digital foundations and prove value, followed by a transition to full-time engagement with competitive compensation aligned with industry standards.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Scope of Services */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#4A5D3E]" />
            Scope of Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#4A5D3E]" />
                  Website Development
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>Custom website build and design</li>
                  <li>Mobile-responsive layout</li>
                  <li>Online estimator tool</li>
                  <li>Lead capture forms</li>
                  <li>Ongoing updates and maintenance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#4A5D3E]" />
                  SEO & Local Presence
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>Search engine optimization</li>
                  <li>Google Business Profile setup</li>
                  <li>Local directory listings</li>
                  <li>Review management strategy</li>
                  <li>Content optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#4A5D3E]" />
                  IT & Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>System setup and configuration</li>
                  <li>Email and domain management</li>
                  <li>Technical troubleshooting</li>
                  <li>Software recommendations</li>
                  <li>Security best practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#4A5D3E]" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>Job oversight and coordination</li>
                  <li>Client communication</li>
                  <li>Schedule management</li>
                  <li>Quality assurance</li>
                  <li>Site visits as needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Phase 1: Beta Period */}
        <section className="mb-10 page-break-before">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4A5D3E]" />
            Phase 1: Beta Period (3 Months)
          </h2>
          <Card className="border-2 border-[#4A5D3E]/20">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Monthly Retainer</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Website, SEO, IT, Design Services</span>
                    <span className="font-bold text-[#4A5D3E]">$8,500/month</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>3-Month Beta Total</span>
                    <span className="font-semibold">$25,500</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Project Bonus Structure</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Projects I Originate AND Manage</span>
                      <span className="font-bold text-[#4A5D3E]">5% of Project Value</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Includes prospecting, sales, closing, and full project management
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700">Projects Assigned to Me (Full Management)</span>
                      <span className="font-bold text-[#4A5D3E]">2% of Project Value</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      For projects handed off for ongoing management (not ad-hoc visits)
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Example: $300,000 project I originate = $15,000 bonus
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Ad-Hoc Field Support</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-xs text-gray-500 mb-3">
                    For quick site visits, check-ins, or dispatch calls (not full project management)
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Weekday Rate</span>
                    <span className="font-bold text-[#4A5D3E]">$55/hour (2-hour minimum)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Weekend/Holiday Rate</span>
                    <span className="font-bold text-[#4A5D3E]">$75/hour (2-hour minimum)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Mileage (outside base territory)</span>
                    <span className="font-bold text-[#4A5D3E]">$0.67/mile (IRS rate)</span>
                  </div>
                  <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Base territory: Wilson County and Rutherford County, TN. Mileage applies outside these counties.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Beta Deliverables</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Complete website launch",
                    "SEO foundation established",
                    "Google Business Profile optimized",
                    "Lead capture system active",
                    "IT infrastructure setup",
                    "Project management support as needed"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#4A5D3E]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Phase 2: Salary Conversion */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#4A5D3E]" />
            Phase 2: Full-Time Engagement (Post-Beta)
          </h2>
          <Card className="border-2 border-[#4A5D3E]/20">
            <CardContent className="p-6">
              <p className="text-gray-700 mb-6">
                Upon successful completion of the beta period and mutual agreement, the engagement transitions to a full-time salaried position:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Compensation Package</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Annual Base Salary</span>
                    <span className="font-bold text-[#4A5D3E]">$120,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Insurance Stipend</span>
                    <span className="font-bold text-[#4A5D3E]">$6,000/year ($500/month)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Project Bonuses (5% originated / 2% assigned)</span>
                    <span className="font-bold text-[#4A5D3E]">$15,000 - $30,000 est.</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Target Compensation</span>
                    <span className="font-bold text-[#4A5D3E] text-lg">$141,000 - $156,000</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Included Responsibilities</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    "Continued website management",
                    "SEO and digital marketing",
                    "Full IT support",
                    "Project management",
                    "Advertising expansion (future)",
                    "Franchise location support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <ArrowRight className="w-4 h-4 text-[#4A5D3E]" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Terms & Conditions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
          <Card>
            <CardContent className="p-6 text-sm text-gray-700 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Payment Terms</h4>
                <p>Retainer payments due on the 1st of each month. Project bonuses paid upon client payment collection (Net-15).</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">1099 Contractor Status</h4>
                <p>During the beta period, engagement is structured as 1099 independent contractor. Contractor responsible for self-employment taxes and insurance.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Transition Clause</h4>
                <p>Upon mutual agreement after the beta period, contractor may convert to W-2 employee status with benefits eligibility. If conversion is deferred beyond 90 days post-beta, 1099 rate increases by 10%.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Scope Changes</h4>
                <p>If responsibilities expand significantly beyond the defined scope, compensation will be renegotiated accordingly.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Termination</h4>
                <p>Either party may terminate with 30 days written notice after the beta period. During beta, 14 days notice required with prorated payment for work completed.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Franchise Expansion Note */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Future Expansion Opportunity</h2>
          <Card className="bg-[#4A5D3E]/5 border-[#4A5D3E]/20">
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                The Murfreesboro Project serves as a pilot for potential franchise expansion. The website and systems being built are designed to scale across multiple locations:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Nash Paint Pros", "Murfreesboro Paint Pros", "Franklin Paint Pros", "Clarksville Paint Pros"].map((name) => (
                  <span key={name} className="px-3 py-1 bg-white rounded-full text-sm text-[#4A5D3E] border border-[#4A5D3E]/30">
                    {name}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Domain structure: paintingpros.io with location-specific subdomains or variations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Trade Vertical Expansion */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#4A5D3E]" />
            Multi-Trade Vertical Expansion
          </h2>
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                The platform architecture supports expansion beyond painting into additional skilled trade verticals. Each vertical shares the same core infrastructure but features trade-specific branding, services, and estimators:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {[
                  { name: "PaintPros", domain: "paintpros.io", status: "Live" },
                  { name: "RoofPros", domain: "roofpros.io", status: "Planned" },
                  { name: "HVACPros", domain: "hvacpros.io", status: "Planned" },
                  { name: "ElectricPros", domain: "electricpros.io", status: "Planned" },
                  { name: "PlumbPros", domain: "plumbpros.io", status: "Planned" },
                  { name: "BuildPros", domain: "buildpros.io", status: "Planned" },
                ].map((vertical) => (
                  <div key={vertical.name} className={`p-3 rounded-lg border text-center ${
                    vertical.status === "Live" 
                      ? "bg-green-100 border-green-300" 
                      : "bg-white border-green-200"
                  }`}>
                    <p className="font-medium text-green-800 text-sm">{vertical.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{vertical.domain}</p>
                    <span className={`text-xs mt-1 inline-block ${
                      vertical.status === "Live" ? "text-green-600" : "text-gray-400"
                    }`}>{vertical.status}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                <p className="text-sm text-green-800 font-medium">
                  Combined Total Addressable Market: $2.2T+ across all trade verticals
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Signature Block */}
        <section className="mb-10 page-break-before">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Agreement</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-8">
                By signing below, both parties agree to the terms outlined in this proposal for the Murfreesboro Project partnership.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contractor</p>
                  <div className="border-b-2 border-gray-300 h-16 mb-2"></div>
                  <p className="text-sm text-gray-700">Signature</p>
                  <div className="border-b border-gray-200 h-8 mt-4 mb-2"></div>
                  <p className="text-sm text-gray-700">Date</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company Representative</p>
                  <p className="text-sm text-gray-700 mb-2">Ryan</p>
                  <div className="border-b-2 border-gray-300 h-16 mb-2"></div>
                  <p className="text-sm text-gray-700">Signature</p>
                  <div className="border-b border-gray-200 h-8 mt-4 mb-2"></div>
                  <p className="text-sm text-gray-700">Date</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8 print:py-4">
          <p>The Murfreesboro Project Partnership Proposal</p>
          <p>December 2024</p>
        </div>

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break-before { page-break-before: always; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  );
}
