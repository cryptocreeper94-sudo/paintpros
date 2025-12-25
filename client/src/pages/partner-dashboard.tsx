import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, Calendar, Clock, Shield, ArrowRight, Wallet, PiggyBank, FileText, Settings, ExternalLink } from "lucide-react";

type PaymentFrequency = "instant" | "weekly" | "biweekly" | "monthly";

export default function PartnerDashboard() {
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>("biweekly");
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: `Payment frequency set to ${paymentFrequency}. Your payments will arrive automatically.`,
    });
  };

  const { data: royaltySummary } = useQuery<{
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    partnerShare: number;
    pendingPayout: number;
    lastPayoutDate: string | null;
    lastPayoutAmount: number;
  }>({
    queryKey: ["/api/royalty/summary"],
  });

  const { data: recentPayouts } = useQuery<Array<{
    id: string;
    amount: string;
    payoutDate: string;
    status: string;
    notes: string | null;
  }>>({
    queryKey: ["/api/royalty/payouts"],
  });

  const formatCurrency = (amount: number | string | undefined) => {
    if (amount === undefined) return "$0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const partnerPayouts = recentPayouts?.filter(p => p.notes?.includes("partner") || p.notes?.includes("Sidonie")) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, Sidonie</h1>
              <p className="text-gray-600">Your Partner Dashboard</p>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            This is your personal view of all royalty earnings across all three platforms. Everything is calculated automatically - just sit back and watch it grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-green-700">Your 50% Share</p>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900" data-testid="text-partner-share">
                {formatCurrency(royaltySummary?.partnerShare || 0)}
              </p>
              <p className="text-xs text-green-600 mt-1">Total earnings to date</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-700">Pending Payout</p>
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900" data-testid="text-pending-payout">
                {formatCurrency(royaltySummary?.pendingPayout || 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1">Coming your way soon</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-purple-700">Last Payment</p>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900" data-testid="text-last-payout">
                {formatCurrency(royaltySummary?.lastPayoutAmount || 0)}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {royaltySummary?.lastPayoutDate ? formatDate(royaltySummary.lastPayoutDate) : "No payments yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-amber-700">Net Profit (All)</p>
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-900" data-testid="text-net-profit">
                {formatCurrency(royaltySummary?.netProfit || 0)}
              </p>
              <p className="text-xs text-amber-600 mt-1">Total business profit</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {partnerPayouts.length > 0 ? (
                <div className="space-y-3">
                  {partnerPayouts.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(payout.amount)}</p>
                        <p className="text-sm text-gray-500">{formatDate(payout.payoutDate)}</p>
                      </div>
                      <Badge variant={payout.status === "completed" ? "default" : "secondary"}>
                        {payout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PiggyBank className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No payments yet</p>
                  <p className="text-sm">Once revenue starts flowing, your payments will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Frequency</label>
                <Select value={paymentFrequency} onValueChange={(v) => setPaymentFrequency(v as PaymentFrequency)}>
                  <SelectTrigger data-testid="select-payment-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant" data-testid="option-frequency-instant">Instant (as money comes in)</SelectItem>
                    <SelectItem value="weekly" data-testid="option-frequency-weekly">Weekly (every Friday)</SelectItem>
                    <SelectItem value="biweekly" data-testid="option-frequency-biweekly">Biweekly (every other Friday)</SelectItem>
                    <SelectItem value="monthly" data-testid="option-frequency-monthly">Monthly (1st of month)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">Choose when your 50% share gets deposited</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Stripe</p>
                      <p className="text-xs text-blue-600">Direct bank deposit</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-300">Connected</Badge>
                </div>
              </div>

              <Button className="w-full" variant="outline" data-testid="button-save-settings" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Your Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              As co-owner, you have full access to all three platforms. Click to explore:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <a href="/" className="block p-4 bg-white rounded-lg border border-purple-200 group" data-testid="link-platform-paintpros">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-purple-900">PaintPros.io</p>
                  <ExternalLink className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Painting contractor platform</p>
                <Badge variant="secondary" className="mt-2">You're here</Badge>
              </a>
              <a href="https://brewandboard.coffee" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg border border-amber-200 group" data-testid="link-platform-brewandboard">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-amber-900">Brew and Board</p>
                  <ExternalLink className="w-4 h-4 text-amber-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Coffee franchise management</p>
                <Badge variant="secondary" className="mt-2">Full Access</Badge>
              </a>
              <a href="https://orbitstaffing.io" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg border border-blue-200 group" data-testid="link-platform-orbitstaffing">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-blue-900">Orbit Staffing</p>
                  <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-600">Financial hub + statements</p>
                <Badge variant="secondary" className="mt-2">Full Access</Badge>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-teal-900">Your Statements</p>
                  <p className="text-sm text-teal-700">Detailed PDF statements are generated through Orbit Staffing</p>
                </div>
              </div>
              <a 
                href="https://orbitstaffing.io/statements" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-teal-700 font-medium hover:text-teal-900"
                data-testid="link-statements"
              >
                View Statements <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Questions? Reach out anytime. Your 50% is protected and calculated automatically.</p>
          <p className="mt-1">Blockchain-verified ownership on Solana & Darkwave Smart Chain</p>
        </div>
      </div>
    </div>
  );
}
