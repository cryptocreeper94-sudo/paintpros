import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DripJobsImport } from "./dripjobs-import";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { cardBackgroundStyles, iconContainerStyles } from "@/lib/theme-effects";
import { format } from "date-fns";

interface DataImport {
  id: string;
  status: string;
  successCount: number;
  totalRows: number;
  importType: string;
  createdAt: string;
}

const steps = [
  { num: 1, text: "Export CSV from DripJobs" },
  { num: 2, text: "Upload & map your fields" },
  { num: 3, text: "Review & import" },
];

export function DripJobsImportCard() {
  const [isOpen, setIsOpen] = useState(false);
  const tenant = useTenant();

  const { data: importHistory = [] } = useQuery<DataImport[]>({
    queryKey: ["/api/imports"],
    queryFn: async () => {
      const res = await fetch("/api/imports", {
        headers: { "x-tenant-id": tenant?.id || "demo" },
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const lastImport = importHistory[0];

  return (
    <>
      <GlassCard className={`h-full p-4 ${cardBackgroundStyles.blue}`} glow="blue" hoverEffect={false}>
        <div className="flex items-center gap-2 mb-3">
          <motion.div 
            className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.blue}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-lg font-display font-bold">Import from DripJobs</h2>
            <p className="text-xs text-muted-foreground">Migrate your leads & deals</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {steps.map((step) => (
            <div key={step.num} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-medium text-blue-400">
                {step.num}
              </div>
              <span className="text-muted-foreground">{step.text}</span>
            </div>
          ))}
        </div>

        {lastImport && (
          <div className="mb-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border dark:border-white/10">
            <div className="flex items-center gap-2 text-xs">
              {lastImport.status === "completed" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-yellow-500" />
              )}
              <span className="text-muted-foreground">
                Last import: {lastImport.successCount}/{lastImport.totalRows} {lastImport.importType}
              </span>
              <Badge variant="outline" className="text-[10px] ml-auto">
                {format(new Date(lastImport.createdAt), "MMM d")}
              </Badge>
            </div>
          </div>
        )}

        <Button 
          onClick={() => setIsOpen(true)} 
          className="w-full"
          data-testid="button-open-dripjobs-import"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import CSV Files
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </GlassCard>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              Import from DripJobs
            </SheetTitle>
            <SheetDescription>
              Upload CSV files exported from DripJobs. Max 5,000 rows, 10MB file size.
            </SheetDescription>
          </SheetHeader>
          <DripJobsImport onComplete={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
