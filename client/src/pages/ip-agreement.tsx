import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Printer, CheckCircle2, Shield, Link2, Loader2 } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function IPAgreementPage() {
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
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
    mutationFn: async (data: { documentHash: string; signerName: string; signerEmail: string }) => {
      const response = await apiRequest("POST", "/api/blockchain/stamp", {
        documentHash: data.documentHash,
        documentType: "IP Partnership Agreement",
        metadata: {
          signerName: data.signerName,
          signerEmail: data.signerEmail,
          agreementType: "50/50 Profit Share - PaintPros SaaS Platform",
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
    if (!signerName.trim() || !signerEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email.",
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

    // Create document hash from agreement content + signature
    const agreementText = `IP PARTNERSHIP AGREEMENT - PaintPros.io Platform
Effective Date: ${new Date().toISOString()}
IP Contributor: Sidonie
Platform Owner: [Your Name]
Profit Share: 50% of net profits after costs
Scope: PaintPros.io SaaS platform and all franchise/licensing revenue
Signer: ${signerName}
Email: ${signerEmail}`;

    // Simple hash for demo (in production, use proper SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(agreementText + signatureRef.current?.toDataURL());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setSigned(true);
    
    // Stamp on blockchain
    stampMutation.mutate({
      documentHash: hashHex,
      signerName,
      signerEmail,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-0">
        
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Partnership Agreement</h1>
          <p className="text-lg text-gray-600">PaintPros.io Platform</p>
          <p className="text-sm text-gray-500 mt-2">Blockchain-Verified Document</p>
        </div>

        <Separator className="my-8" />

        {/* Agreement Content */}
        <section className="mb-10">
          <Card>
            <CardContent className="p-6 space-y-6">
              
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">1. Parties</h2>
                <p className="text-gray-700">
                  This Intellectual Property Partnership Agreement ("Agreement") is entered into between:
                </p>
                <ul className="mt-2 space-y-1 text-gray-700">
                  <li><strong>IP Contributor:</strong> Sidonie ("Contributor")</li>
                  <li><strong>Platform Developer:</strong> [Your Name] ("Developer")</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">2. Intellectual Property Contribution</h2>
                <p className="text-gray-700">
                  The Contributor originated the core concept for the <strong>Online Estimator Tool</strong>, which serves as a foundational feature of the PaintPros.io SaaS platform. This contribution is acknowledged as valuable intellectual property that enables the platform's competitive advantage.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">3. Profit Share Agreement</h2>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-gray-900 font-semibold mb-2">
                    The Contributor shall receive:
                  </p>
                  <p className="text-2xl font-bold text-purple-700 mb-2">
                    50% of Net Profits
                  </p>
                  <p className="text-gray-600 text-sm">
                    After costs, from all revenue generated by the PaintPros.io platform, including but not limited to:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                    <li>• SaaS subscription fees</li>
                    <li>• Franchise licensing fees</li>
                    <li>• Setup and onboarding fees</li>
                    <li>• Per-location surcharges</li>
                    <li>• Any future revenue streams from the platform</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">4. Payment Terms</h2>
                <p className="text-gray-700">
                  Profit distributions shall be calculated monthly and paid within 15 days of the close of each month. The Developer shall maintain transparent records accessible to the Contributor for verification purposes.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">5. Duration</h2>
                <p className="text-gray-700">
                  This agreement shall remain in effect in perpetuity, continuing through any sale, merger, acquisition, or transfer of the platform. The Contributor's rights under this agreement shall pass to their heirs and beneficiaries.
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Digital Signature</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signerName">Full Legal Name</Label>
                    <Input
                      id="signerName"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="Enter your full name"
                      data-testid="input-signer-name"
                    />
                  </div>
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
                </div>

                <div>
                  <Label>Signature</Label>
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

                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Signed by: <strong>{signerName}</strong> ({signerEmail})
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
          <p>IP Partnership Agreement - PaintPros.io Platform</p>
          <p>Dual-Chain Verified: Solana + Darkwave Smart Chain</p>
        </div>

      </div>
    </div>
  );
}
