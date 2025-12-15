import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import SignatureCanvas from "react-signature-canvas";
import { PDFAnnotationEditor } from "./pdf-annotation-editor";
import { 
  FileText, Upload, Download, Pen, Eye, Trash2, Plus, Search, 
  Filter, Clock, CheckCircle, AlertCircle, FileSignature, 
  File, FileSpreadsheet, Receipt, ClipboardList, Edit3
} from "lucide-react";
import type { Document as DocType, DocumentSignature } from "@shared/schema";

type ExtendedDocument = Omit<DocType, 'metadata'> & {
  metadata?: {
    customerName?: string;
    customerEmail?: string;
    [key: string]: unknown;
  } | null;
};

const DOCUMENT_TYPES = [
  { value: "contract", label: "Contracts", icon: FileText },
  { value: "estimate", label: "Estimates", icon: FileSpreadsheet },
  { value: "invoice", label: "Invoices", icon: Receipt },
  { value: "proposal", label: "Proposals", icon: ClipboardList },
  { value: "other", label: "Other", icon: File },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  signed: "bg-green-500/20 text-green-600 dark:text-green-400",
  expired: "bg-red-500/20 text-red-600 dark:text-red-400",
  archived: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
};

interface DocumentCenterProps {
  tenantId?: string;
}

export function DocumentCenter({ tenantId = "npp" }: DocumentCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSignOpen, setIsSignOpen] = useState(false);
  const [isAnnotateOpen, setIsAnnotateOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ExtendedDocument | null>(null);
  const [uploadedPdfData, setUploadedPdfData] = useState<ArrayBuffer | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newDoc, setNewDoc] = useState({
    title: "",
    documentType: "contract",
    description: "",
    fileName: "document.pdf",
    metadata: {
      customerName: "",
      customerEmail: "",
    },
  });

  const [signerInfo, setSignerInfo] = useState({
    name: "",
    email: "",
  });

  const { data: documents = [], isLoading } = useQuery<ExtendedDocument[]>({
    queryKey: ["/api/documents", activeTab],
    queryFn: async () => {
      const url = activeTab === "all" 
        ? "/api/documents" 
        : `/api/documents?type=${activeTab}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newDoc) => {
      const res = await apiRequest("POST", "/api/documents", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setIsCreateOpen(false);
      setNewDoc({ title: "", documentType: "contract", description: "", fileName: "document.pdf", metadata: { customerName: "", customerEmail: "" } });
      toast({ title: "Document Created", description: "New document has been created successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create document.", variant: "destructive" });
    },
  });

  const signMutation = useMutation({
    mutationFn: async ({ documentId, signatureData }: { documentId: string; signatureData: string }) => {
      const res = await apiRequest("POST", `/api/documents/${documentId}/signatures`, {
        signerName: signerInfo.name,
        signerEmail: signerInfo.email,
        signatureData,
        signatureType: "drawn",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setIsSignOpen(false);
      setSelectedDoc(null);
      setSignerInfo({ name: "", email: "" });
      signatureRef.current?.clear();
      toast({ title: "Signed Successfully", description: "Document has been signed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to sign document.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Deleted", description: "Document has been deleted." });
    },
  });

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.metadata?.customerName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSign = () => {
    if (!selectedDoc || !signatureRef.current) return;
    if (signatureRef.current.isEmpty()) {
      toast({ title: "Error", description: "Please draw your signature.", variant: "destructive" });
      return;
    }
    if (!signerInfo.name || !signerInfo.email) {
      toast({ title: "Error", description: "Please enter your name and email.", variant: "destructive" });
      return;
    }
    const signatureData = signatureRef.current.toDataURL();
    signMutation.mutate({ documentId: selectedDoc.id, signatureData });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed": return <CheckCircle className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      case "expired": return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      toast({ title: "Error", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      setUploadedPdfData(arrayBuffer);
      setIsAnnotateOpen(true);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAnnotationSave = (annotatedPdf: Uint8Array, annotations: any[]) => {
    toast({ 
      title: "PDF Annotated", 
      description: `Saved ${annotations.length} annotations to PDF.` 
    });
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Document Center</h3>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-48"
              data-testid="input-document-search"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            data-testid="input-upload-pdf"
          />
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-upload-pdf"
          >
            <Upload className="h-4 w-4 mr-1" />
            Annotate PDF
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-create-document">
                <Plus className="h-4 w-4 mr-1" />
                New Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
                <DialogDescription>Add a new document to the system for tracking and signatures.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doc-title">Title</Label>
                  <Input
                    id="doc-title"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder="Document title"
                    data-testid="input-doc-title"
                  />
                </div>
                <div>
                  <Label htmlFor="doc-type">Type</Label>
                  <Select
                    value={newDoc.documentType}
                    onValueChange={(v) => setNewDoc({ ...newDoc, documentType: v })}
                  >
                    <SelectTrigger data-testid="select-doc-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={newDoc.metadata.customerName}
                    onChange={(e) => setNewDoc({ ...newDoc, metadata: { ...newDoc.metadata, customerName: e.target.value } })}
                    placeholder="Customer name"
                    data-testid="input-customer-name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={newDoc.metadata.customerEmail}
                    onChange={(e) => setNewDoc({ ...newDoc, metadata: { ...newDoc.metadata, customerEmail: e.target.value } })}
                    placeholder="customer@example.com"
                    data-testid="input-customer-email"
                  />
                </div>
                <div>
                  <Label htmlFor="doc-description">Description</Label>
                  <Textarea
                    id="doc-description"
                    value={newDoc.description}
                    onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                    placeholder="Document description..."
                    rows={3}
                    data-testid="textarea-doc-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => createMutation.mutate(newDoc)}
                  disabled={!newDoc.title || createMutation.isPending}
                  data-testid="button-submit-document"
                >
                  {createMutation.isPending ? "Creating..." : "Create Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
          {DOCUMENT_TYPES.slice(0, 4).map(t => (
            <TabsTrigger key={t.value} value={t.value} data-testid={`tab-${t.value}`}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No documents found</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover-elevate"
                    data-testid={`document-row-${doc.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {DOCUMENT_TYPES.find(t => t.value === doc.documentType)?.icon && (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{doc.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {doc.metadata?.customerName || "No customer"} 
                          {doc.createdAt && ` • ${format(new Date(doc.createdAt), "MMM d, yyyy")}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={STATUS_COLORS[doc.status]}>
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 capitalize">{doc.status}</span>
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setSelectedDoc(doc); setIsSignOpen(true); }}
                        disabled={doc.status === "signed"}
                        data-testid={`button-sign-${doc.id}`}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(doc.id)}
                        data-testid={`button-delete-${doc.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isSignOpen} onOpenChange={setIsSignOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              {selectedDoc?.title} - Please provide your signature below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signer-name">Your Name</Label>
                <Input
                  id="signer-name"
                  value={signerInfo.name}
                  onChange={(e) => setSignerInfo({ ...signerInfo, name: e.target.value })}
                  placeholder="Full name"
                  data-testid="input-signer-name"
                />
              </div>
              <div>
                <Label htmlFor="signer-email">Your Email</Label>
                <Input
                  id="signer-email"
                  type="email"
                  value={signerInfo.email}
                  onChange={(e) => setSignerInfo({ ...signerInfo, email: e.target.value })}
                  placeholder="email@example.com"
                  data-testid="input-signer-email"
                />
              </div>
            </div>
            <div>
              <Label>Signature</Label>
              <div className="border rounded-md bg-white dark:bg-gray-900" data-testid="canvas-signature-container">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: "w-full h-32 cursor-crosshair",
                  }}
                  backgroundColor="transparent"
                  penColor="black"
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1"
                onClick={() => signatureRef.current?.clear()}
                data-testid="button-clear-signature"
              >
                Clear Signature
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSignOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSign}
              disabled={signMutation.isPending}
              data-testid="button-submit-signature"
            >
              {signMutation.isPending ? "Signing..." : "Sign Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAnnotateOpen} onOpenChange={(open) => {
        setIsAnnotateOpen(open);
        if (!open) {
          setUploadedPdfData(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }}>
        <DialogContent className="max-w-5xl h-[85vh] p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>PDF Annotation Editor</DialogTitle>
            <DialogDescription>Add annotations to your PDF document</DialogDescription>
          </DialogHeader>
          {uploadedPdfData && (
            <PDFAnnotationEditor
              pdfData={uploadedPdfData}
              onSave={handleAnnotationSave}
              onClose={() => setIsAnnotateOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
}
