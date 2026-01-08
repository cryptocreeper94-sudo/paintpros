import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useTenant } from "@/context/TenantContext";
import type { DataImport } from "@shared/schema";
import { format } from "date-fns";
import { 
  Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, RefreshCw, Download, Trash2, ChevronDown, ChevronUp,
  Users, Briefcase, Clock, FileText, MapPin, Mail, Phone
} from "lucide-react";

interface ParsedRow {
  [key: string]: string;
}

interface FieldMapping {
  [targetField: string]: string;
}

const TARGET_FIELDS = {
  leads: [
    { id: "name", label: "Name", icon: Users, required: true },
    { id: "email", label: "Email", icon: Mail, required: true },
    { id: "phone", label: "Phone", icon: Phone, required: false },
    { id: "address", label: "Address", icon: MapPin, required: false },
    { id: "notes", label: "Notes", icon: FileText, required: false },
  ],
  deals: [
    { id: "title", label: "Title/Job Name", icon: Briefcase, required: true },
    { id: "value", label: "Value/Amount", icon: FileText, required: false },
    { id: "customerName", label: "Customer Name", icon: Users, required: true },
    { id: "customerEmail", label: "Customer Email", icon: Mail, required: false },
    { id: "customerPhone", label: "Customer Phone", icon: Phone, required: false },
    { id: "jobAddress", label: "Job Address", icon: MapPin, required: false },
    { id: "notes", label: "Notes", icon: FileText, required: false },
  ],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ROWS = 5000;

export function DripJobsImport() {
  const tenant = useTenant();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "importing" | "complete">("upload");
  const [importType, setImportType] = useState<"leads" | "deals">("leads");
  const [csvData, setCsvData] = useState<ParsedRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping>({});
  const [fileName, setFileName] = useState<string>("");
  const [importResult, setImportResult] = useState<DataImport | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // Check if all required fields are mapped
  const hasRequiredMappings = () => {
    const targetFields = TARGET_FIELDS[importType];
    const requiredFields = targetFields.filter(f => f.required);
    return requiredFields.every(field => fieldMappings[field.id]);
  };
  
  const getMissingRequiredFields = () => {
    const targetFields = TARGET_FIELDS[importType];
    return targetFields
      .filter(f => f.required && !fieldMappings[f.id])
      .map(f => f.label);
  };

  const { data: importHistory = [], isLoading: historyLoading } = useQuery<DataImport[]>({
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

  const { data: suggestedMappings } = useQuery({
    queryKey: ["/api/imports/field-mappings/dripjobs"],
    enabled: step === "mapping",
  });

  const [importError, setImportError] = useState<string | null>(null);
  
  const importMutation = useMutation({
    mutationFn: async (payload: { data: ParsedRow[]; fieldMappings: FieldMapping; importType: string; fileName: string }) => {
      const res = await fetch("/api/imports", {
        method: "POST",
        body: JSON.stringify({
          sourceSystem: "dripjobs",
          importType: payload.importType,
          fileName: payload.fileName,
          data: payload.data,
          fieldMappings: payload.fieldMappings,
        }),
        headers: { 
          "Content-Type": "application/json",
          "x-tenant-id": tenant?.id || "demo",
        },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Import failed" }));
        throw new Error(errorData.error || "Import failed");
      }
      return res.json() as Promise<DataImport>;
    },
    onSuccess: (result) => {
      setImportError(null);
      setImportResult(result);
      setStep("complete");
      queryClient.invalidateQueries({ queryKey: ["/api/imports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
    },
    onError: (error: Error) => {
      setImportError(error.message);
      setStep("preview");
    },
  });

  const parseCSV = useCallback((text: string): { headers: string[]; rows: ParsedRow[] } => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    const rows: ParsedRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/("([^"]*("")*)*"|[^,]*)/g) || [];
      const row: ParsedRow = {};
      headers.forEach((header, index) => {
        let value = values[index] || "";
        value = value.trim().replace(/^"|"$/g, "").replace(/""/g, '"');
        row[header] = value;
      });
      if (Object.values(row).some(v => v)) {
        rows.push(row);
      }
    }

    return { headers, rows };
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setParseError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onerror = () => {
      setParseError("Failed to read file. Please try again.");
    };
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const { headers, rows } = parseCSV(text);
        
        if (rows.length === 0) {
          setParseError("No data found in file. Please check the CSV format.");
          return;
        }
        
        if (rows.length > MAX_ROWS) {
          setParseError(`Too many rows (${rows.length}). Maximum is ${MAX_ROWS} rows per import.`);
          return;
        }
        
        setCsvHeaders(headers);
        setCsvData(rows);
        
        const autoMappings: FieldMapping = {};
        const targetFields = TARGET_FIELDS[importType];
        targetFields.forEach(field => {
          const suggestions = (suggestedMappings as any)?.[importType]?.[field.id] || [];
          const match = headers.find(h => 
            suggestions.some((s: string) => h.toLowerCase() === s.toLowerCase()) ||
            h.toLowerCase().includes(field.id.toLowerCase())
          );
          if (match) {
            autoMappings[field.id] = match;
          }
        });
        setFieldMappings(autoMappings);
        setStep("mapping");
      } catch (err) {
        setParseError("Failed to parse CSV file. Please check the format.");
      }
    };
    reader.readAsText(file);
  }, [parseCSV, importType, suggestedMappings]);

  const handleImport = () => {
    setStep("importing");
    importMutation.mutate({
      data: csvData,
      fieldMappings,
      importType,
      fileName,
    });
  };

  const resetImport = () => {
    setStep("upload");
    setCsvData([]);
    setCsvHeaders([]);
    setFieldMappings({});
    setFileName("");
    setImportResult(null);
    setParseError(null);
    setImportError(null);
  };

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Import from DripJobs</h3>
        <p className="text-sm text-muted-foreground">
          Export your data from DripJobs as CSV and upload it here
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant={importType === "leads" ? "default" : "outline"}
          onClick={() => setImportType("leads")}
          data-testid="button-import-leads"
        >
          <Users className="w-4 h-4 mr-2" />
          Import Leads
        </Button>
        <Button
          variant={importType === "deals" ? "default" : "outline"}
          onClick={() => setImportType("deals")}
          data-testid="button-import-deals"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Import Deals/Jobs
        </Button>
      </div>

      {parseError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{parseError}</span>
        </div>
      )}

      <label
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover-elevate transition-all"
        data-testid="upload-zone"
      >
        <Upload className="w-12 h-12 text-muted-foreground mb-4" />
        <span className="text-sm font-medium">Click to upload CSV file</span>
        <span className="text-xs text-muted-foreground mt-1">Max {MAX_ROWS.toLocaleString()} rows, {MAX_FILE_SIZE / 1024 / 1024}MB</span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          data-testid="input-csv-upload"
        />
      </label>

      <div className="p-4 rounded-xl bg-muted/50 space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          How to export from DripJobs:
        </h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Go to DripJobs dashboard</li>
          <li>Navigate to {importType === "leads" ? "Contacts/Leads" : "Jobs/Estimates"}</li>
          <li>Click Export and select CSV format</li>
          <li>Upload the downloaded file here</li>
        </ol>
      </div>
    </motion.div>
  );

  const renderMappingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Map Your Fields</h3>
          <p className="text-sm text-muted-foreground">
            {csvData.length} rows found in {fileName}
          </p>
        </div>
        <Badge variant="outline">{importType === "leads" ? "Leads" : "Deals"}</Badge>
      </div>

      <div className="space-y-3">
        {TARGET_FIELDS[importType].map(field => {
          const Icon = field.icon;
          return (
            <div key={field.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 w-40">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Select
                value={fieldMappings[field.id] || ""}
                onValueChange={(value) => setFieldMappings({ ...fieldMappings, [field.id]: value })}
              >
                <SelectTrigger className="flex-1" data-testid={`select-mapping-${field.id}`}>
                  <SelectValue placeholder="Select CSV column..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- Skip this field --</SelectItem>
                  {csvHeaders.map(header => (
                    <SelectItem key={header} value={header}>{header}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      {!hasRequiredMappings() && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">
            Required fields missing: {getMissingRequiredFields().join(", ")}
          </span>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={resetImport} data-testid="button-cancel-import">
          Cancel
        </Button>
        <Button 
          onClick={() => setStep("preview")} 
          disabled={!hasRequiredMappings()}
          data-testid="button-preview-import"
        >
          Preview Import
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderPreviewStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Preview Import</h3>
          <p className="text-sm text-muted-foreground">
            Review your data before importing
          </p>
        </div>
        <Badge>{csvData.length} records</Badge>
      </div>

      <div className="max-h-[300px] overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left font-medium">#</th>
              {TARGET_FIELDS[importType].slice(0, 4).map(field => (
                <th key={field.id} className="px-3 py-2 text-left font-medium">{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.slice(0, 10).map((row, index) => (
              <tr key={index} className="border-t">
                <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                {TARGET_FIELDS[importType].slice(0, 4).map(field => (
                  <td key={field.id} className="px-3 py-2 truncate max-w-[150px]">
                    {row[fieldMappings[field.id]] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {csvData.length > 10 && (
          <div className="px-3 py-2 text-center text-sm text-muted-foreground bg-muted/50">
            ...and {csvData.length - 10} more rows
          </div>
        )}
      </div>

      {importError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{importError}</span>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => setStep("mapping")} data-testid="button-back-to-mapping">
          Back
        </Button>
        <Button onClick={handleImport} disabled={importMutation.isPending} data-testid="button-start-import">
          <Upload className="w-4 h-4 mr-2" />
          Import {csvData.length} Records
        </Button>
      </div>
    </motion.div>
  );

  const renderImportingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 text-center py-8"
    >
      <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary" />
      <div>
        <h3 className="text-lg font-semibold">Importing Your Data</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Processing {csvData.length} records...
        </p>
      </div>
      <Progress value={50} className="max-w-xs mx-auto" />
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-center py-8"
    >
      {importResult?.errorCount === 0 ? (
        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
      ) : (
        <AlertTriangle className="w-16 h-16 mx-auto text-amber-500" />
      )}
      
      <div>
        <h3 className="text-lg font-semibold">
          {importResult?.errorCount === 0 ? "Import Complete!" : "Import Completed with Errors"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Successfully imported {importResult?.successCount || 0} of {importResult?.totalRows || 0} records
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">{importResult?.successCount || 0}</div>
          <div className="text-xs text-muted-foreground">Imported</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{importResult?.errorCount || 0}</div>
          <div className="text-xs text-muted-foreground">Errors</div>
        </div>
      </div>

      {importResult?.errorLog && (
        <div className="text-left p-4 rounded-xl bg-destructive/10 border border-destructive/20 max-h-[150px] overflow-auto">
          <p className="text-sm font-medium text-destructive mb-2">Error Details:</p>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{importResult.errorLog}</pre>
        </div>
      )}

      <Button onClick={resetImport} data-testid="button-new-import">
        <Upload className="w-4 h-4 mr-2" />
        Import More Data
      </Button>
    </motion.div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          DripJobs Data Import
        </CardTitle>
        <CardDescription>
          Migrate your data from DripJobs to PaintPros CRM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {step === "upload" && renderUploadStep()}
          {step === "mapping" && renderMappingStep()}
          {step === "preview" && renderPreviewStep()}
          {step === "importing" && renderImportingStep()}
          {step === "complete" && renderCompleteStep()}
        </AnimatePresence>

        <div className="border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="w-full justify-between"
            data-testid="button-toggle-history"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Import History ({importHistory.length})
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-3">
                  {historyLoading ? (
                    <div className="text-center text-sm text-muted-foreground py-4">Loading...</div>
                  ) : importHistory.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">No imports yet</div>
                  ) : (
                    importHistory.slice(0, 5).map((imp) => (
                      <div
                        key={imp.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                        data-testid={`import-history-${imp.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {imp.status === "completed" ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : imp.status === "completed_with_errors" ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{imp.fileName || "Untitled import"}</p>
                            <p className="text-xs text-muted-foreground">
                              {imp.successCount}/{imp.totalRows} imported
                              {imp.createdAt && ` - ${format(new Date(imp.createdAt), "MMM d, yyyy")}`}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {imp.importType}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
