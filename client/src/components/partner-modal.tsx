import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, CheckCircle2, Heart, Shield, DollarSign, Database, ArrowRight } from "lucide-react";

interface PartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasSignedAgreement?: boolean;
}

export function PartnerModal({ open, onOpenChange, hasSignedAgreement = false }: PartnerModalProps) {
  const handleDownloadAgreement = () => {
    window.open("/ip-agreement", "_blank");
  };

  const handleDownloadRyanProposal = () => {
    window.open("/proposal-ryan", "_blank");
  };

  const handleGoToPartnerDashboard = () => {
    window.location.href = "/partner";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl text-gray-900">Welcome, Sidonie</DialogTitle>
              <DialogDescription className="text-gray-600">
                Your partner documents are ready
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Card className="border-green-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">Your IP Agreement</h3>
                    {hasSignedAgreement ? (
                      <Badge className="bg-green-100 text-green-800 border border-green-300">Signed</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 border-amber-300">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    50% co-ownership across PaintPros, Brew and Board, and Orbit Staffing. Blockchain verified.
                  </p>
                  <Button 
                    onClick={handleDownloadAgreement} 
                    variant="default" 
                    className="gap-2 w-full"
                    data-testid="button-view-ip-agreement"
                  >
                    <FileText className="w-4 h-4" />
                    {hasSignedAgreement ? "View Agreement" : "Review & Sign"}
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Ryan's Proposal</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    90-day Murfreesboro expansion proposal. Jason would like your feedback before sending.
                  </p>
                  <Button 
                    onClick={handleDownloadRyanProposal} 
                    variant="outline" 
                    className="gap-2 w-full"
                    data-testid="button-view-ryan-proposal"
                  >
                    <Download className="w-4 h-4" />
                    Review Proposal
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Database className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">DripJobs Migration</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Ready to bring over your leads and deals from DripJobs? Here's how:
                  </p>
                  <ol className="text-xs text-gray-600 space-y-1 mb-3 list-decimal list-inside">
                    <li>Log into DripJobs and go to <strong>Leads</strong> or <strong>Deals</strong></li>
                    <li>Click <strong>Export</strong> and download as CSV</li>
                    <li>Use the <strong>DripJobs Import</strong> card on your dashboard</li>
                    <li>Upload the CSV and preview before importing</li>
                  </ol>
                  <p className="text-xs text-amber-700 font-medium">
                    The import tool validates your data and shows any issues before saving.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-300 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Your Partner Dashboard</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Track your royalties, payment settings, and profit share across all platforms.
                  </p>
                  <Button 
                    onClick={handleGoToPartnerDashboard} 
                    variant="secondary" 
                    className="gap-2 w-full"
                    data-testid="button-go-to-partner-dashboard"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)} data-testid="button-close-partner-modal">
            Continue to Admin Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
