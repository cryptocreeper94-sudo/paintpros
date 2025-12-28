import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileUp, 
  FileText, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Home,
  Ruler,
  Square,
  LayoutGrid,
  Download,
  Wand2,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ExtractedRoom {
  name: string;
  width: number;
  length: number;
  height: number;
  squareFootage: number;
  wallArea: number;
}

interface ExtractionResult {
  rooms: ExtractedRoom[];
  totalSquareFootage: number;
  totalWallArea: number;
  roomCount: number;
  notes: string[];
}

interface BlueprintUploadProps {
  tenantId: string;
  onExtracted?: (data: ExtractionResult) => void;
  className?: string;
}

export function BlueprintUpload({ tenantId, onExtracted, className = "" }: BlueprintUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<"idle" | "uploading" | "extracting" | "completed" | "error">("idle");
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const extractMutation = useMutation({
    mutationFn: async (file: File): Promise<{ extractedData: ExtractionResult }> => {
      const formData = new FormData();
      formData.append("blueprint", file);
      formData.append("tenantId", tenantId);
      
      setExtractionStatus("uploading");
      setExtractionProgress(20);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setExtractionProgress(40);
      
      setExtractionStatus("extracting");
      setExtractionProgress(60);
      
      const response = await apiRequest("POST", "/api/blueprints/extract", formData);
      const data = await response.json();
      
      setExtractionProgress(100);
      return data;
    },
    onSuccess: (data) => {
      setExtractionStatus("completed");
      setExtractedData(data.extractedData);
      setShowResults(true);
      if (onExtracted && data.extractedData) {
        onExtracted(data.extractedData);
      }
      toast({
        title: "Blueprint Analyzed",
        description: `Found ${data.extractedData?.roomCount || 0} rooms totaling ${data.extractedData?.totalSquareFootage?.toLocaleString() || 0} sq ft`,
      });
    },
    onError: (error) => {
      setExtractionStatus("error");
      toast({
        title: "Extraction Failed",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      handleFileSelect(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or image file",
        variant: "destructive",
      });
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setExtractionStatus("idle");
    setExtractedData(null);
    
    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const startExtraction = () => {
    if (uploadedFile) {
      extractMutation.mutate(uploadedFile);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setExtractionStatus("idle");
    setExtractionProgress(0);
    setExtractedData(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5 text-indigo-600" />
            Blueprint Upload
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {!uploadedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-gray-300 hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              data-testid="dropzone-blueprint"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                data-testid="input-blueprint-file"
              />
              
              <div className="text-center">
                <motion.div
                  animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center"
                >
                  <FileText className="w-8 h-8 text-indigo-600" />
                </motion.div>
                
                <h4 className="font-semibold mb-1">Upload Floor Plans</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drop a PDF or image of your floor plan here
                </p>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">PDF</Badge>
                  <Badge variant="outline">PNG</Badge>
                  <Badge variant="outline">JPG</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={resetUpload}
                  data-testid="button-remove-file"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {previewUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={previewUrl} 
                    alt="Blueprint preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {extractionStatus === "idle" && (
                <Button 
                  onClick={startExtraction} 
                  className="w-full"
                  data-testid="button-extract-dimensions"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Extract Dimensions with AI
                </Button>
              )}
              
              {(extractionStatus === "uploading" || extractionStatus === "extracting") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm">
                      {extractionStatus === "uploading" ? "Uploading..." : "Analyzing blueprint..."}
                    </span>
                  </div>
                  <Progress value={extractionProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Our AI is identifying rooms and calculating dimensions
                  </p>
                </div>
              )}
              
              {extractionStatus === "completed" && extractedData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-green-50 border border-green-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Extraction Complete</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 rounded bg-white">
                      <LayoutGrid className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <p className="font-bold text-lg">{extractedData.roomCount}</p>
                      <p className="text-xs text-muted-foreground">Rooms</p>
                    </div>
                    <div className="text-center p-2 rounded bg-white">
                      <Square className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <p className="font-bold text-lg">{extractedData.totalSquareFootage.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sq Ft</p>
                    </div>
                    <div className="text-center p-2 rounded bg-white">
                      <Ruler className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <p className="font-bold text-lg">{extractedData.totalWallArea.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Wall Area</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowResults(true)}
                    data-testid="button-view-details"
                  >
                    View Room Details
                  </Button>
                </motion.div>
              )}
              
              {extractionStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-50 border border-red-200"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Extraction Failed</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    Unable to extract dimensions. Try a clearer image or manual entry.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={resetUpload}
                  >
                    Try Again
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              Extracted Room Details
            </DialogTitle>
          </DialogHeader>
          
          {extractedData && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-primary/5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{extractedData.roomCount}</p>
                  <p className="text-sm text-muted-foreground">Rooms Found</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{extractedData.totalSquareFootage.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Sq Ft</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{extractedData.totalWallArea.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Wall Area</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-semibold">Room Breakdown</h4>
                {extractedData.rooms.map((room, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <Home className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {room.width}' x {room.length}' x {room.height}' ceiling
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{room.squareFootage.toLocaleString()} sq ft</p>
                      <p className="text-xs text-muted-foreground">{room.wallArea.toLocaleString()} wall area</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {extractedData.notes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {extractedData.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    if (onExtracted && extractedData) {
                      onExtracted(extractedData);
                    }
                    setShowResults(false);
                    toast({ title: "Dimensions applied to estimate" });
                  }}
                  data-testid="button-apply-dimensions"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Apply to Estimate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function BlueprintUploadCompact({ 
  tenantId, 
  onExtracted,
  className = "" 
}: BlueprintUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExtracted = (data: ExtractionResult) => {
    if (onExtracted) {
      onExtracted(data);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsDialogOpen(true)}
        className={className}
        data-testid="button-upload-blueprint-compact"
      >
        <FileUp className="w-4 h-4 mr-2" />
        Upload Blueprint
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <BlueprintUpload 
            tenantId={tenantId} 
            onExtracted={handleExtracted}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BlueprintUpload;
