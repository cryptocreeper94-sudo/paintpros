import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Printer, CheckCircle2, Shield, Link2, Loader2, DollarSign, Calendar, Zap, TrendingUp, Users, Lightbulb, FileText } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function IPAgreementPage() {
  const [signerEmail, setSignerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentHandle, setPaymentHandle] = useState("");
  const [signed, setSigned] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [stampData, setStampData] = useState<{
    solana?: string;
    darkwave?: string;
    hash?: string;
  } | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const stampMutation = useMutation({
    mutationFn: async (data: { documentHash: string; signerEmail: string; paymentMethod: string; paymentHandle: string }) => {
      const response = await apiRequest("POST", "/api/blockchain/stamp", {
        documentHash: data.documentHash,
        documentType: "IP Partnership & Royalty Agreement",
        metadata: {
          contributor: "Sidonie Summers",
          developer: "Jason Andrews",
          signerEmail: data.signerEmail,
          paymentMethod: data.paymentMethod,
          paymentHandle: data.paymentHandle,
          agreementType: "IP Partnership + Estimator Royalties",
          effectiveDate: new Date().toISOString(),
          version: "1.0",
        }
      });
      return response.json();
    },
    onSuccess: (data) => {
      setStamped(true);
      setStampData({
        solana: data.solanaSignature,
        darkwave: data.darkwaveHash,
        hash: data.documentHash,
      });
      toast({
        title: "Agreement Stamped on Blockchain",
        description: "This agreement is now permanently recorded on Solana and Darkwave.",
      });
    },
    onError: () => {
      toast({
        title: "Stamping Failed",
        description: "Could not stamp on blockchain. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSign = async () => {
    if (!signerEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod || !paymentHandle.trim()) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method and enter your handle/username.",
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

    const agreementText = `IP PARTNERSHIP & ROYALTY AGREEMENT - Version 1.0
Effective Date: ${new Date().toISOString()}
IP Contributor: Sidonie Summers
Platform Developer: Jason Andrews
COVERED PLATFORMS:
  1. PaintPros.io (paintpros.io) - Painting contractor SaaS
  2. Brew and Board (brewandboard.coffee) - Coffee franchise SaaS  
  3. Orbit Staffing (orbitstaffing.io) - Staffing platform SaaS
SaaS Profit Share: 50% of net profits after costs (ALL THREE PLATFORMS)
Nashville Project Royalties: $25,000/year (W-2) or $20,000/year (1099) when Developer earns $125k+
One-Time Signing Bonus: $6,000 from initial project investment
Payment Method: ${paymentMethod} - ${paymentHandle}
Email: ${signerEmail}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(agreementText + signatureRef.current?.toDataURL());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setSigned(true);
    
    stampMutation.mutate({
      documentHash: hashHex,
      signerEmail,
      paymentMethod,
      paymentHandle,
    });
  };

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-6 print:max-w-none">
        
        <div className="text-center mb-12 pt-8 print:pt-0 print:mb-6">
          <div className="flex items-center justify-center gap-3 mb-4 print:hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl">IP Partnership & Royalty Agreement</h1>
          <p className="text-lg text-gray-600">Orbit Ventures SaaS Portfolio</p>
          <p className="text-sm text-gray-500 mt-2">Version 1.0 - Blockchain-Verified Document</p>
          <p className="text-xs text-gray-400 mt-1">Date: {new Date().toLocaleDateString()}</p>
        </div>

        <Separator className="my-8 print:my-4" />

        {/* Introduction */}
        <section className="mb-8 print:mb-4">
          <Card className="border-purple-200 bg-purple-50 print:bg-white print:border-gray-300">
            <CardContent className="p-6 print:p-4">
              <h2 className="text-lg font-bold text-purple-900 mb-3 print:text-gray-900">Dear Sidonie,</h2>
              <p className="text-gray-700 mb-4">
                This agreement formalizes what I've always intended: that when revenue is generated from our SaaS platforms, you will receive your rightful share.
              </p>
              <p className="text-gray-700 mb-4">
                You originated the ideas for <strong>all three platforms</strong> covered by this agreement. PaintPros.io's customer-facing estimation tools, Brew and Board's coffee franchise system, and Orbit Staffing's workflow management - these all came from your vision. You researched markets, identified gaps, and conceived the approaches we're now building. Without your contribution, none of this would exist.
              </p>
              <p className="text-gray-700 mb-4">
                When this platform generates revenue, it will be <em>because of</em> your intellectual contribution. The payments outlined in this agreement are <strong>royalties you will be entitled to</strong> - not gifts, not charity - but compensation for your intellectual property being used commercially.
              </p>
              <p className="text-gray-700 mt-4 font-medium">
                - Jason
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Agreement Content */}
        <section className="mb-10 print:mb-6">
          <Card>
            <CardContent className="p-6 space-y-6 print:p-4 print:space-y-4">
              
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">1. Parties</h2>
                <p className="text-gray-700">
                  This Intellectual Property Partnership & Royalty Agreement ("Agreement") is entered into between:
                </p>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li><strong>IP Contributor:</strong> Sidonie Summers ("Contributor")</li>
                  <li><strong>Platform Developer:</strong> Jason Andrews ("Developer")</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  2. Intellectual Property Contribution
                </h2>
                <p className="text-gray-700 mb-3">
                  The Contributor originated the core concepts for <strong>three SaaS platforms</strong>:
                </p>
                
                <div className="space-y-4 mb-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg print:bg-white">
                    <h4 className="font-bold text-purple-900 mb-2">1. PaintPros.io (paintpros.io)</h4>
                    <p className="text-sm text-gray-700 mb-2">Multi-tenant SaaS platform for painting contractors with white-label websites, franchise enrollment, and customer-facing estimation tools:</p>
                    <ul className="text-gray-700 space-y-1 ml-4 text-sm">
                      <li>• <strong>Online Estimator Tool</strong> - Helps homeowners understand project scope and pricing</li>
                      <li>• <strong>AI Color Visualizer</strong> - Allows customers to preview paint colors on their walls</li>
                      <li>• <strong>Square Footage Estimator</strong> - Camera-based room measurement tool</li>
                      <li>• <strong>Manual Calculator</strong> - Traditional input-based estimation</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg print:bg-white">
                    <h4 className="font-bold text-amber-900 mb-2">2. Brew and Board (brewandboard.coffee)</h4>
                    <p className="text-sm text-gray-700">SaaS franchise platform for coffee shop operations and management. Scalable, white-label solution for coffee franchise operators with inventory, scheduling, and customer engagement tools.</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg print:bg-white">
                    <h4 className="font-bold text-blue-900 mb-2">3. Orbit Staffing (orbitstaffing.io)</h4>
                    <p className="text-sm text-gray-700">Full-service staffing company platform with efficient workflow management. Born from experience working in the staffing industry and identifying operational inefficiencies that could be solved through automation and better tooling.</p>
                  </div>
                </div>
                
                <p className="text-gray-700">
                  The Contributor provided research on existing market solutions and identified gaps that informed all three platforms' development.
                </p>
                
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg print:bg-white">
                  <p className="text-gray-700">
                    <strong>How this creates value:</strong> All three platforms are licensed to business owners in their respective industries. The tools and systems drive customer engagement, operational efficiency, and lead generation - making each platform valuable to the business owners who pay for licenses.
                  </p>
                </div>
              </div>

              <Separator />

              {/* PART A - SaaS Platform */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Part A: SaaS Platform Revenue (All Three Platforms)</h2>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4 print:bg-white">
                  <p className="text-gray-900 font-semibold mb-2">
                    When the platforms generate revenue, the Contributor shall receive:
                  </p>
                  <p className="text-2xl font-bold text-purple-700 mb-2">
                    50% of Net Profits
                  </p>
                  <p className="text-gray-600 text-sm">
                    After costs, from all revenue generated by ALL THREE platforms:
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="p-2 bg-white rounded border border-purple-100">
                      <p className="font-medium text-purple-900">PaintPros.io</p>
                      <p className="text-xs text-gray-600">Painting contractor SaaS subscriptions, franchise licensing, setup fees</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-amber-100">
                      <p className="font-medium text-amber-900">Brew and Board</p>
                      <p className="text-xs text-gray-600">Coffee franchise SaaS subscriptions, setup fees, per-location charges</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-blue-100">
                      <p className="font-medium text-blue-900">Orbit Staffing</p>
                      <p className="text-xs text-gray-600">Staffing platform subscriptions, placement fees, service charges</p>
                    </div>
                  </div>
                </div>

                {/* Growth Projections */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4 print:bg-white">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    Potential Growth Projections (Combined)
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Based on pricing tiers across all three platforms, here's what your 50% share could look like as the portfolio grows:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">5 customers (mid-tier avg)</span>
                      </div>
                      <span className="font-semibold text-purple-700">~$15,000/year</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">10 customers</span>
                      </div>
                      <span className="font-semibold text-purple-700">~$30,000/year</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">25 customers</span>
                      </div>
                      <span className="font-semibold text-purple-700">~$75,000/year</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">50 customers</span>
                      </div>
                      <span className="font-semibold text-purple-700">~$150,000/year</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    * Projections based on average subscription of $500/month. Actual amounts will vary based on customer mix and costs.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 print:bg-white">
                  <p className="text-gray-700 mb-3">
                    <strong>This will be fully automated and passive:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>No work required from you.</strong> Business owners sign up, pay, and use the platform automatically.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Passive income.</strong> You will receive your 50% share without any operational responsibilities.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Jason handles everything:</strong> Technical maintenance, customer support, billing, and platform operations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Automatic notifications.</strong> You'll be notified of any system issues affecting customers.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* PART B - Project Royalties */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Part B: Nashville/Murfreesboro Project Royalties</h2>
                </div>
                
                <p className="text-gray-700 mb-4">
                  The estimation tools you conceived are being deployed in the Nashville/Murfreesboro painting project. When this project generates income, your intellectual property will be a core part of its value. These royalties represent your share:
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 print:bg-white">
                  <h3 className="font-bold text-green-800 mb-3">Base Royalties (Annual)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 flex-wrap gap-2">
                      <div>
                        <p className="font-medium text-gray-900">If Jason earns $125k+/year as W-2</p>
                        <p className="text-sm text-gray-500">Base salary + bonuses as employee</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700">$25,000/year</p>
                        <p className="text-xs text-gray-500">~$2,083/month</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200 flex-wrap gap-2">
                      <div>
                        <p className="font-medium text-gray-900">If Jason earns $125k+/year as 1099</p>
                        <p className="text-sm text-gray-500">Independent contractor basis</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700">$20,000/year</p>
                        <p className="text-xs text-gray-500">~$1,667/month</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    * The 1099 amount is lower because Jason pays ~15% self-employment tax, reducing net income. This keeps the split fair.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    * Payments distributed monthly, averaged throughout the year to account for bonus fluctuations.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 print:bg-white">
                  <h3 className="font-bold text-emerald-800 mb-3">Additional Royalties (Above $125k)</h3>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200 flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-gray-900">For any amount Jason earns above $125k/year</p>
                      <p className="text-sm text-gray-500">Calculated on total earnings exceeding the threshold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-700">15%</p>
                      <p className="text-xs text-gray-500">of amount over $125k</p>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-100">
                    <p className="text-xs text-gray-600 font-medium mb-2">Example:</p>
                    <p className="text-xs text-gray-500">If Jason earns $150,000/year as W-2:</p>
                    <p className="text-xs text-gray-500">• Base royalty: $25,000</p>
                    <p className="text-xs text-gray-500">• 15% of $25,000 (amount over $125k): $3,750</p>
                    <p className="text-xs text-gray-700 font-medium">• Total: $28,750/year</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 print:bg-white">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    One-Time Signing Bonus
                  </h3>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-gray-700">When the partnership deal closes:</p>
                      <p className="text-sm text-gray-500">From the initial project investment, paid as soon as funds are received</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">$6,000</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You can receive this as a cashier's check or via your preferred payment method below.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 print:bg-white">
                  <p className="text-sm text-gray-600">
                    <strong>Why you will receive this:</strong> These royalties represent your share of the value your intellectual property will generate. The estimation tools are a core system in this project. You conceived them. This is your rightful portion of what they earn - not a gift, not charity, but compensation for your contribution being used commercially.
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">3. Payment Terms</h2>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>SaaS Profits:</strong> Calculated monthly, paid within 15 days of month close (once revenue begins)</li>
                  <li>• <strong>Project Royalties:</strong> Paid monthly, distributed evenly throughout the year (once project is active)</li>
                  <li>• <strong>Signing Bonus:</strong> Paid as soon as funds are received from the partnership deal (cashier's check available upon request)</li>
                  <li>• <strong>Transparency:</strong> Full access to revenue records for verification</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">4. Duration & Inheritance</h2>
                <p className="text-gray-700">
                  This agreement shall remain in effect <strong>in perpetuity</strong>, continuing through any sale, merger, acquisition, or transfer of the platform or project. The Contributor's rights under this agreement shall <strong>pass to their heirs and beneficiaries</strong>, ensuring this income stream continues for their family.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  5. Document Versioning
                </h2>
                <p className="text-gray-700">
                  This agreement may be updated by mutual consent of both parties. Each version will be assigned a new version number, digitally signed, and recorded on the blockchain as a new entry. Previous versions remain on the blockchain as a permanent record of the agreement's history.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Current Version:</strong> 1.0
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">6. Blockchain Verification</h2>
                <p className="text-gray-700">
                  This agreement shall be cryptographically hashed and recorded on both the <strong>Solana</strong> blockchain and the <strong>Darkwave Smart Chain</strong> to provide immutable proof of its existence, terms, and execution date.
                </p>
              </div>

            </CardContent>
          </Card>
        </section>

        {/* Signature Section */}
        {!stamped && (
          <section className="mb-10 print:hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Digital Signature & Payment Setup</h2>
            <Card>
              <CardContent className="p-6 space-y-6">
                
                <div>
                  <Label htmlFor="signerEmail">Email Address</Label>
                  <Input
                    id="signerEmail"
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    placeholder="Enter your email"
                    data-testid="input-signer-email"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">Preferred Payment Method</Label>
                  <p className="text-sm text-gray-500 mb-3">Select how you'd like to receive payments:</p>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value="venmo" id="venmo" data-testid="radio-venmo" />
                      <Label htmlFor="venmo" className="flex-1 cursor-pointer">
                        <span className="font-medium">Venmo</span>
                        <span className="text-sm text-gray-500 ml-2">Fast, mobile payments</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value="cashapp" id="cashapp" data-testid="radio-cashapp" />
                      <Label htmlFor="cashapp" className="flex-1 cursor-pointer">
                        <span className="font-medium">Cash App</span>
                        <span className="text-sm text-gray-500 ml-2">Quick transfers</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                      <RadioGroupItem value="zelle" id="zelle" data-testid="radio-zelle" />
                      <Label htmlFor="zelle" className="flex-1 cursor-pointer">
                        <span className="font-medium">Zelle</span>
                        <span className="text-sm text-gray-500 ml-2">Bank-to-bank transfer</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod && (
                  <div>
                    <Label htmlFor="paymentHandle">
                      {paymentMethod === "venmo" && "Venmo Username"}
                      {paymentMethod === "cashapp" && "Cash App $Cashtag"}
                      {paymentMethod === "zelle" && "Zelle Email or Phone"}
                    </Label>
                    <Input
                      id="paymentHandle"
                      value={paymentHandle}
                      onChange={(e) => setPaymentHandle(e.target.value)}
                      placeholder={
                        paymentMethod === "venmo" ? "@username" :
                        paymentMethod === "cashapp" ? "$cashtag" :
                        "email@example.com or phone number"
                      }
                      data-testid="input-payment-handle"
                    />
                  </div>
                )}

                <div>
                  <Label>Signature</Label>
                  <p className="text-sm text-gray-500 mb-2">Sign below to acknowledge and accept this agreement:</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg mt-1 bg-white">
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        className: "w-full h-32",
                        style: { width: "100%", height: "128px" }
                      }}
                      backgroundColor="white"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSignature}
                    className="mt-1"
                    data-testid="button-clear-signature"
                  >
                    Clear Signature
                  </Button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Save a copy:</strong> After signing, use the "Print / Save as PDF" button at the top right to download a copy of this agreement for your records. You can review it anytime.
                  </p>
                </div>

                <Button
                  onClick={handleSign}
                  disabled={stampMutation.isPending}
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600"
                  size="lg"
                  data-testid="button-sign-and-stamp"
                >
                  {stampMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Stamping on Blockchain...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Sign & Stamp on Blockchain
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Blockchain Verification */}
        {stamped && stampData && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Agreement Verified on Blockchain
            </h2>
            <Card className="border-2 border-green-200 bg-green-50 print:bg-white print:border-gray-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <Shield className="w-5 h-5" />
                  This agreement is permanently recorded and cannot be altered.
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-500 mb-1">Solana Transaction</p>
                    <p className="font-mono text-xs break-all text-gray-700">
                      {stampData.solana || "Pending..."}
                    </p>
                    {stampData.solana && (
                      <a
                        href={`https://solscan.io/tx/${stampData.solana}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 text-xs flex items-center gap-1 mt-2 print:hidden"
                      >
                        <Link2 className="w-3 h-3" />
                        View on Solscan
                      </a>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-500 mb-1">Darkwave Hash</p>
                    <p className="font-mono text-xs break-all text-gray-700">
                      {stampData.darkwave || "Pending..."}
                    </p>
                    {stampData.darkwave && (
                      <a
                        href={`https://explorer.darkwave.io/tx/${stampData.darkwave}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs flex items-center gap-1 mt-2 print:hidden"
                      >
                        <Link2 className="w-3 h-3" />
                        View on Darkwave Explorer
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-500 mb-1">Document Hash (SHA-256)</p>
                  <p className="font-mono text-xs break-all text-gray-700">
                    {stampData.hash}
                  </p>
                </div>

                <div className="text-center pt-4 space-y-1">
                  <p className="text-sm text-gray-600">
                    Signed by: <strong>Sidonie Summers</strong> ({signerEmail})
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: <strong>{paymentMethod}</strong> - {paymentHandle}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 print:bg-white print:border-gray-300">
                  <p className="text-sm text-gray-600">
                    <strong>Save your copy:</strong> Click "Print / Save as PDF" at the top right to download this signed agreement for your records.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8 print:py-4 print:border-t print:mt-4">
          <p className="font-medium">IP Partnership & Royalty Agreement</p>
          <p>Jason Andrews & Sidonie Summers</p>
          <p className="mt-1">Version 1.0 - Dual-Chain Verified: Solana + Darkwave Smart Chain</p>
        </div>

      </div>
    </div>
  );
}
