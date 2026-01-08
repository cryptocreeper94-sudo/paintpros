import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, CheckCircle2, Heart, Shield, DollarSign, Database, ArrowRight, Upload, Users, Briefcase } from "lucide-react";

interface PartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasSignedAgreement?: boolean;
  onLaunchImport?: () => void;
}

export function PartnerModal({ open, onOpenChange, hasSignedAgreement = false, onLaunchImport }: PartnerModalProps) {
  const handleDownloadAgreement = () => {
    window.open("/ip-agreement", "_blank");
  };

  const handleDownloadRyanProposal = () => {
    window.open("/proposal-ryan", "_blank");
  };

  const handleGoToPartnerDashboard = () => {
    window.location.href = "/partner";
  };

  const handleLaunchImport = () => {
    onOpenChange(false);
    if (onLaunchImport) {
      setTimeout(() => onLaunchImport(), 300);
    }
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
              <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">Welcome, Sidonie</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Your partner documents are ready
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* DripJobs Migration - Priority Card */}
          <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Migrate from DripJobs</h3>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Bring all your leads and deals into PaintPros. It only takes a few minutes!
              </p>

              {/* Visual Steps */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3 p-2 bg-white/60 dark:bg-black/20 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Export from DripJobs</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Go to <strong>Contacts</strong> tab, click the <strong>3 dots menu</strong>, select <strong>Export</strong>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-white/60 dark:bg-black/20 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">For Deals too</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Go to <strong>Sales Pipeline</strong>, click <strong>3 dots</strong>, then <strong>Export</strong>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-2 bg-white/60 dark:bg-black/20 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Upload here</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Use the import tool below - preview your data before saving
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleLaunchImport}
                className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white"
                data-testid="button-launch-dripjobs-import"
              >
                <Upload className="w-4 h-4" />
                Launch DripJobs Import
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* IP Agreement */}
          <Card className="border-green-300 dark:border-green-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-700 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">Your IP Agreement</h3>
                    {hasSignedAgreement ? (
                      <Badge className="bg-green-100 text-green-800 border border-green-300">Signed</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 border-amber-300">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    50% co-ownership across PaintPros, Brew and Board, and Orbit Staffing.
                  </p>
                  <Button 
                    onClick={handleDownloadAgreement} 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    data-testid="button-view-ip-agreement"
                  >
                    <FileText className="w-4 h-4" />
                    {hasSignedAgreement ? "View" : "Review & Sign"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Dashboard */}
          <Card className="border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Your Royalties</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Track earnings, payment settings, and profit share.
                  </p>
                  <Button 
                    onClick={handleGoToPartnerDashboard} 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    data-testid="button-go-to-partner-dashboard"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    View Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)} data-testid="button-close-partner-modal">
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
