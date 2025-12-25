import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Printer, CheckCircle2, Rocket, Zap, Users, TrendingUp, Globe, Calendar, Shield, MessageSquare, Target, Sparkles, Download } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "@/hooks/use-toast";

export default function ProposalRyan() {
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signed, setSigned] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSign = () => {
    if (!signerName.trim() || !signerEmail.trim()) {
      toast({
        title: "Please fill in your details",
        description: "Name and email are required to sign.",
        variant: "destructive",
      });
      return;
    }
    if (signatureRef.current?.isEmpty()) {
      toast({
        title: "Signature Required",
        description: "Please sign in the signature box.",
        variant: "destructive",
      });
      return;
    }
    setSigned(true);
    toast({
      title: "Proposal Signed!",
      description: "Thank you! Let's build something great together.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white print:bg-white">
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePrint} variant="outline" className="gap-2" data-testid="button-print-proposal">
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button onClick={handlePrint} variant="default" className="gap-2" data-testid="button-download-proposal">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-6 print:max-w-none">
        
        <div className="text-center mb-10 pt-8 print:pt-0">
          <div className="flex items-center justify-center gap-3 mb-4 print:hidden">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">Murfreesboro Expansion Partnership</h1>
          <p className="text-lg text-gray-600">90-Day Launch Proposal</p>
          <p className="text-sm text-green-600 font-medium mt-2">A New Chapter for a New Market</p>
        </div>

        <Separator className="my-8 print:my-4" />

        <section className="mb-8">
          <Card className="border-green-300 bg-white print:bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hey Ryan,</h2>
              <p className="text-gray-800 mb-4">
                I've been thinking a lot about what we discussed, and I'm genuinely excited about the opportunity to help expand into Murfreesboro. You've built something incredible with Nashville Painting Professionals, and I believe we can replicate that success in a brand new market.
              </p>
              <p className="text-gray-800 mb-4">
                This proposal outlines a <strong className="text-gray-900">90-day launch plan</strong> where I handle the tech, marketing, and project coordination - so you can focus on what you do best: selling and growing the business. If after 90 days we're not seeing the traction we want, we revisit and adjust. No pressure, just results.
              </p>
              <p className="text-gray-800">
                I also want to mention - I'd love to collaborate with <strong className="text-gray-900">Logan</strong> on the social media side. He's got great instincts with Instagram, and I think combining his creative eye with the automation tools we're building could be really powerful. The more minds working together, the better.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            The Vision: Murfreesboro as a New LLC
          </h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <p className="text-gray-800">
                This isn't just adding a service area - this is building a <strong className="text-gray-900">new company</strong>. A fresh brand, a fresh LLC, positioned specifically for the Murfreesboro and Rutherford County market. Separate from NPP, but leveraging everything that's made NPP successful.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">What You Get</h3>
                  <ul className="text-sm text-gray-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Brand new professional website built for Murfreesboro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Automatic lead capture & scheduling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>SEO to rank on Google locally</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Social media foundation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Instant online estimates for customers</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">The Automation Advantage</h3>
                  <ul className="text-sm text-gray-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Leads come in automatically, 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Customers book appointments themselves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>I step in to ensure quality & close deals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>After the job - automated follow-up</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Minimal hands-on, maximum results</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-700" />
            The Murfreesboro Connection
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-800 mb-4">
                Here's what makes Murfreesboro a no-brainer: My sister is a <strong className="text-gray-900">top real estate agent</strong> in the area. She has connections to homeowners, property managers, and investors who constantly need painting services. That's a built-in referral network from day one.
              </p>
              <p className="text-gray-800 mb-4">
                Plus, your high-end Nashville clients will naturally refer friends and family in the Murfreesboro area. The reputation you've built travels with you.
              </p>
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  <strong className="text-gray-900">Referral Structure:</strong> When my sister refers a project, we split the referral fee fairly. When I bring in leads directly, I earn a small commission. This keeps everyone motivated and aligned.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-700" />
            Part of Something Bigger
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-800 mb-4">
                The painting platform is just one piece of what we're building. The same technology powering this expansion connects to <strong className="text-gray-900">Orbit Staffing</strong> - a comprehensive workforce and financial management system. Everything syncs automatically: revenue tracking, project management, payroll coordination.
              </p>
              <p className="text-gray-800 mb-4">
                And there's more on the horizon: <strong className="text-gray-900">Brew and Board</strong> (coffee franchise management) uses the same ecosystem. As these platforms grow, there are opportunities to be part of that growth too - if you're interested.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-green-100 text-green-900 border border-green-300">PaintPros.io</Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-900 border border-amber-300">Brew and Board</Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-900 border border-blue-300">Orbit Staffing</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            What the 90 Days Includes
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Website Development</p>
                        <p className="text-sm text-gray-600">Professional site for the new Murfreesboro LLC</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">SEO & Google Ranking</p>
                        <p className="text-sm text-gray-600">Get found when people search locally</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Social Media Setup</p>
                        <p className="text-sm text-gray-600">Collaborating with Logan on strategy</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Automation & Lead Capture</p>
                        <p className="text-sm text-gray-600">Automatic scheduling, instant estimates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Project Management</p>
                        <p className="text-sm text-gray-600">Ensuring jobs run smoothly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Ongoing IT & Customization</p>
                        <p className="text-sm text-gray-600">Maintenance, updates, improvements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-700" />
            Additional Support Terms
          </h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-800 mb-4">
                For any project management work outside of normal scope - troubleshooting issues, handling problems on-site, or managing jobs that come up unexpectedly:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                  <p className="font-bold text-gray-900 mb-2">Business Hours</p>
                  <p className="text-gray-800">$30-35/hour</p>
                  <p className="text-sm text-gray-600">2-hour minimum</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                  <p className="font-bold text-gray-900 mb-2">Evenings & Weekends</p>
                  <p className="text-gray-800">$60/hour</p>
                  <p className="text-sm text-gray-600">2-hour minimum</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900 mb-2">Travel</p>
                <p className="text-gray-800">$0.67/mile for jobs outside Wilson or Rutherford counties</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card className="border-green-300 bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">The Investment</h2>
              <p className="text-gray-800 mb-4">
                For the full 90-day launch package - websites, SEO, automation, social media setup, project management, IT support, and ongoing customization - I think <strong className="text-gray-900">$30,000</strong> is fair.
              </p>
              <p className="text-gray-800 mb-4">
                To put that in perspective: if you were to hire separate people to handle web development, SEO, social media, IT, and project management, you'd easily be looking at <strong className="text-gray-900">$200,000+ per year</strong>. This is a fraction of that cost for a comprehensive 90-day launch.
              </p>
              <div className="bg-green-50 border border-green-300 rounded-lg p-4 mt-4">
                <p className="text-gray-800 font-medium">
                  And here's my commitment: If after 90 days we're not seeing the results we want, we sit down and revisit. No hard feelings, just honest evaluation and adjustment.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bonus Structure</h2>
              <p className="text-gray-800 mb-4">
                When projects complete on-time and under budget, I believe in sharing the wins. Industry standard for project completion bonuses is typically <strong className="text-gray-900">5-10% of the savings</strong>. We can discuss the exact structure that works for both of us.
              </p>
              <p className="text-sm text-gray-700 italic">
                This keeps everyone aligned - I'm motivated to run efficient projects, you save money, we both win.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        <section className="mb-8 print:hidden">
          <Card className={signed ? "border-green-400 bg-green-50" : ""}>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {signed ? "Signed!" : "Ready to Get Started?"}
              </h2>
              
              {signed ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Thank you, {signerName}!</p>
                  <p className="text-gray-700">Let's build something great together. I'll be in touch soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-800 mb-4">
                    If this looks good to you, sign below and let's make it happen. Looking forward to working together!
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <Input
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Ryan..."
                        data-testid="input-signer-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                      <Input
                        type="email"
                        value={signerEmail}
                        onChange={(e) => setSignerEmail(e.target.value)}
                        placeholder="ryan@example.com"
                        data-testid="input-signer-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
                      <SignatureCanvas
                        ref={signatureRef}
                        canvasProps={{
                          className: "w-full h-32",
                          style: { width: "100%", height: "128px" }
                        }}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" onClick={clearSignature} data-testid="button-clear-signature">
                        Clear
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleSign} className="w-full gap-2" size="lg" data-testid="button-sign-proposal">
                    <CheckCircle2 className="w-5 h-5" />
                    Sign & Accept Proposal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="text-center text-sm text-gray-500 mt-8 print:mt-4">
          <p>Questions? Let's talk. This is about building something together.</p>
          <p className="mt-1">- Jason</p>
        </div>
      </div>
    </div>
  );
}
