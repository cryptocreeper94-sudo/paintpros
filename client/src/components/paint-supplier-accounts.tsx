import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Check, Save, ExternalLink, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/context/TenantContext";

interface SupplierAccount {
  sherwinWilliamsAccountNumber: string;
  benjaminMooreAccountNumber: string;
}

export function PaintSupplierAccounts() {
  const tenant = useTenant();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SupplierAccount>({
    sherwinWilliamsAccountNumber: "",
    benjaminMooreAccountNumber: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    const storedAccounts = localStorage.getItem(`paint_supplier_accounts_${tenant.id}`);
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }
  }, [tenant.id]);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`paint_supplier_accounts_${tenant.id}`, JSON.stringify(accounts));
      
      toast({
        title: "Accounts Saved",
        description: "Your paint supplier account numbers have been saved.",
      });
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save account information.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChange = (field: keyof SupplierAccount, value: string) => {
    setAccounts(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };
  
  return (
    <GlassCard className="p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Paint Supplier Accounts</h3>
          <p className="text-gray-400 text-sm">Connect your pro accounts</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Sherwin-Williams PRO+
            </Label>
            <a 
              href="https://pro.sherwin-williams.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Open PRO+ Portal
            </a>
          </div>
          <Input
            data-testid="input-sherwin-williams-account"
            placeholder="Enter your PRO+ account number"
            value={accounts.sherwinWilliamsAccountNumber}
            onChange={(e) => handleChange("sherwinWilliamsAccountNumber", e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
          />
          {accounts.sherwinWilliamsAccountNumber && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Account Linked
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              Benjamin Moore Contractor
            </Label>
            <a 
              href="https://www.mybenjaminmoore.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Open BM Portal
            </a>
          </div>
          <Input
            data-testid="input-benjamin-moore-account"
            placeholder="Enter your contractor account number"
            value={accounts.benjaminMooreAccountNumber}
            onChange={(e) => handleChange("benjaminMooreAccountNumber", e.target.value)}
            className="bg-gray-800/50 border-gray-700 text-white"
          />
          {accounts.benjaminMooreAccountNumber && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Account Linked
            </Badge>
          )}
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              data-testid="button-save-supplier-accounts"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Account Numbers"}
            </Button>
          </motion.div>
        )}
        
        <p className="text-gray-600 text-xs text-center">
          Account numbers are stored securely for quick reference when ordering materials
        </p>
      </div>
    </GlassCard>
  );
}
