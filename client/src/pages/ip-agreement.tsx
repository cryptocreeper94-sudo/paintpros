import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, Printer, CheckCircle2, Shield, Link2, Loader2, DollarSign, Calendar, Zap } from "lucide-react";
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

    const agreementText = `IP PARTNERSHIP & ROYALTY AGREEMENT
Effective Date: ${new Date().toISOString()}
IP Contributor: Sidonie Summers
Platform Developer: Jason Andrews
PaintPros.io Profit Share: 50% of net profits after costs
Estimator Royalties: $25,000/year (W-2) or $20,000/year (1099) when Developer earns $125k+
One-Time Signing Bonus: $5,000 from initial project investment
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
    <div className="min-h-screen bg-white">
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-0">
        
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Partnership & Royalty Agreement</h1>
          <p className="text-lg text-gray-600">PaintPros.io Platform & Estimator Tool</p>
          <p className="text-sm text-gray-500 mt-2">Blockchain-Verified Document</p>
        </div>

        <Separator className="my-8" />

        {/* Introduction */}
        <section className="mb-8">
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-purple-900 mb-3">Dear Sidonie,</h2>
              <p className="text-gray-700 mb-4">
                This agreement formalizes what I've always intended: that you receive your rightful share of the revenue generated by your intellectual property contribution.
              </p>
              <p className="text-gray-700 mb-4">
                The <strong>Online Estimator Tool</strong> was your idea. You originated the concept that became the foundation of this entire platform. Without your contribution, none of this would exist. These payments are not gifts or charity - they are <strong>royalties you are owed</strong> for your intellectual property being used commercially.
              </p>
              <p className="text-gray-700">
                This money is generated <em>because of</em> your contribution. You have every right to receive it.
              </p>
              <p className="text-gray-700 mt-4 font-medium">
                - Jason
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Agreement Content */}
        <section className="mb-10">
          <Card>
            <CardContent className="p-6 space-y-6">
              
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
                <h2 className="text-lg font-bold text-gray-900 mb-3">2. Intellectual Property Contribution</h2>
                <p className="text-gray-700">
                  The Contributor originated the core concept for the <strong>Online Estimator Tool</strong>, which serves as a foundational feature of the PaintPros.io SaaS platform. This contribution is acknowledged as valuable intellectual property that enables the platform's competitive advantage and commercial viability.
                </p>
                <p className="text-gray-700 mt-3">
                  <strong>Why this matters:</strong> The estimator tool is the core feature that painting contractors pay for. It's what makes the platform valuable. Your idea is literally the engine that generates revenue.
                </p>
              </div>

              <Separator />

              {/* PART A - SaaS Platform */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Part A: PaintPros.io SaaS Platform</h2>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-900 font-semibold mb-2">
                    The Contributor shall receive:
                  </p>
                  <p className="text-2xl font-bold text-purple-700 mb-2">
                    50% of Net Profits
                  </p>
                  <p className="text-gray-600 text-sm">
                    After costs, from all revenue generated by the PaintPros.io platform, including:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• SaaS subscription fees ($349-$1,399+/month per customer)</li>
                    <li>• Franchise licensing fees</li>
                    <li>• Setup and onboarding fees ($5,000-$15,000 per customer)</li>
                    <li>• Per-location surcharges</li>
                    <li>• Any future revenue streams from the platform</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-3">
                    <strong>This is fully automated and passive:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>No work required from you.</strong> Customers sign up, pay, and use the platform automatically.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Passive income.</strong> You receive your 50% share without any operational responsibilities.</span>
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
                  The estimator tool you conceived is being used in the Nashville/Murfreesboro painting project. Because your intellectual property is generating this income, you are entitled to royalties from the project:
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-green-800 mb-3">Ongoing Royalties (Annual)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-900">If Jason earns $125k+/year as W-2</p>
                        <p className="text-sm text-gray-500">Base salary + bonuses as employee</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700">$25,000/year</p>
                        <p className="text-xs text-gray-500">~$2,083/month</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
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
                    * The 1099 amount is lower because Jason pays ~15% self-employment tax, reducing his net income. This keeps the split fair.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    * Payments distributed monthly, averaged throughout the year to account for bonus fluctuations.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    One-Time Signing Bonus
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">When Ryan signs the partnership proposal:</p>
                      <p className="text-sm text-gray-500">From the initial $29,000 project investment</p>
                    </div>
                    <p className="text-2xl font-bold text-amber-700">$5,000</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Why you're receiving this:</strong> These royalties represent your share of the value your intellectual property generates. The estimator tool is the core system being used in this project. You conceived it. This is your rightful portion of what it earns - not a gift, not charity, but payment for your contribution being used commercially.
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">3. Payment Terms</h2>
                <ul className="text-gray-700 space-y-2">
                  <li>• <strong>SaaS Profits:</strong> Calculated monthly, paid within 15 days of month close</li>
                  <li>• <strong>Project Royalties:</strong> Paid monthly, distributed evenly throughout the year</li>
                  <li>• <strong>Signing Bonus:</strong> Paid within 30 days of Ryan's signature on the partnership proposal</li>
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
                <h2 className="text-lg font-bold text-gray-900 mb-3">5. Blockchain Verification</h2>
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
            <Card className="border-2 border-green-200 bg-green-50">
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
                        className="text-purple-600 text-xs flex items-center gap-1 mt-2"
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
                        className="text-blue-600 text-xs flex items-center gap-1 mt-2"
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
              </CardContent>
            </Card>
          </section>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8 print:py-4">
          <p>IP Partnership & Royalty Agreement</p>
          <p>Jason Andrews & Sidonie Summers</p>
          <p className="mt-1">Dual-Chain Verified: Solana + Darkwave Smart Chain</p>
        </div>

      </div>
    </div>
  );
}
