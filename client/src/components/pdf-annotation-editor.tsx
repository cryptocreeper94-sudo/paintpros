import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { 
  Type, Square, CheckSquare, PenTool, MousePointer, 
  ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Save, 
  Trash2, RotateCcw, Download, Highlighter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type AnnotationType = "text" | "signature" | "checkbox" | "highlight" | "rectangle";

interface Annotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  content?: string;
  checked?: boolean;
  color?: string;
}

interface PDFAnnotationEditorProps {
  pdfUrl?: string;
  pdfData?: ArrayBuffer;
  onSave?: (annotatedPdf: Uint8Array, annotations: Annotation[]) => void;
  onClose?: () => void;
}

const TOOLS = [
  { id: "select", icon: MousePointer, label: "Select" },
  { id: "text", icon: Type, label: "Text Field" },
  { id: "signature", icon: PenTool, label: "Signature Field" },
  { id: "checkbox", icon: CheckSquare, label: "Checkbox" },
  { id: "highlight", icon: Highlighter, label: "Highlight" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
] as const;

export function PDFAnnotationEditor({ 
  pdfUrl, 
  pdfData, 
  onSave, 
  onClose 
}: PDFAnnotationEditorProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 });
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    if (pdfData) {
      setPdfBytes(pdfData);
    } else if (pdfUrl) {
      fetch(pdfUrl)
        .then(res => res.arrayBuffer())
        .then(data => setPdfBytes(data))
        .catch(err => {
          console.error("Failed to load PDF:", err);
          toast({ title: "Error", description: "Failed to load PDF file.", variant: "destructive" });
        });
    }
  }, [pdfUrl, pdfData, toast]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const getMinSize = (tool: string) => {
    switch (tool) {
      case "checkbox": return { width: 20, height: 20 };
      case "highlight": return { width: 5, height: 5 };
      case "signature": return { width: 80, height: 30 };
      case "text": return { width: 50, height: 20 };
      default: return { width: 10, height: 10 };
    }
  };

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "select") return;
    
    const target = e.currentTarget;
    const canvas = target.querySelector("canvas");
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left) / scale;
    const y = (e.clientY - canvasRect.top) / scale;

    if (activeTool === "checkbox") {
      const newAnnotation: Annotation = {
        id: `ann-${Date.now()}`,
        type: "checkbox",
        x: Math.max(0, x - 10),
        y: Math.max(0, y - 10),
        width: 20,
        height: 20,
        page: currentPage,
        checked: false,
      };
      setAnnotations([...annotations, newAnnotation]);
    } else {
      setIsDrawing(true);
      setDrawStart({ x, y });
    }
  }, [activeTool, currentPage, scale, annotations]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
  }, [isDrawing]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    
    const target = e.currentTarget;
    const canvas = target.querySelector("canvas");
    if (!canvas) {
      setIsDrawing(false);
      return;
    }
    
    const canvasRect = canvas.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left) / scale;
    const y = (e.clientY - canvasRect.top) / scale;

    const rawWidth = Math.abs(x - drawStart.x);
    const rawHeight = Math.abs(y - drawStart.y);
    const startX = Math.min(x, drawStart.x);
    const startY = Math.min(y, drawStart.y);

    const minSize = getMinSize(activeTool);
    const width = Math.max(rawWidth, minSize.width);
    const height = Math.max(rawHeight, minSize.height);

    if (rawWidth < 3 && rawHeight < 3) {
      setIsDrawing(false);
      return;
    }

    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      type: activeTool as AnnotationType,
      x: startX,
      y: startY,
      width,
      height,
      page: currentPage,
      content: activeTool === "text" ? "Enter text" : undefined,
      color: activeTool === "highlight" ? "rgba(255, 255, 0, 0.3)" : undefined,
    };

    setAnnotations([...annotations, newAnnotation]);
    setIsDrawing(false);
  }, [isDrawing, drawStart, activeTool, currentPage, scale, annotations]);

  const handleAnnotationClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === "select") {
      setSelectedAnnotation(id);
      const ann = annotations.find(a => a.id === id);
      if (ann?.type === "checkbox") {
        setAnnotations(annotations.map(a => 
          a.id === id ? { ...a, checked: !a.checked } : a
        ));
      } else if (ann?.type === "text") {
        setEditingText(id);
        setTextValue(ann.content || "");
      }
    }
  };

  const deleteSelectedAnnotation = () => {
    if (selectedAnnotation) {
      setAnnotations(annotations.filter(a => a.id !== selectedAnnotation));
      setSelectedAnnotation(null);
    }
  };

  const updateTextContent = () => {
    if (editingText) {
      setAnnotations(annotations.map(a => 
        a.id === editingText ? { ...a, content: textValue } : a
      ));
      setEditingText(null);
      setTextValue("");
    }
  };

  const clearAnnotations = () => {
    setAnnotations([]);
    setSelectedAnnotation(null);
  };

  const saveAnnotatedPDF = async () => {
    if (!pdfBytes) {
      toast({ title: "Error", description: "No PDF loaded.", variant: "destructive" });
      return;
    }

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      for (const ann of annotations) {
        if (ann.page > pages.length) continue;
        const page = pages[ann.page - 1];
        const pageHeight = page.getHeight();
        const yFlipped = pageHeight - ann.y - ann.height;

        switch (ann.type) {
          case "text":
            page.drawRectangle({
              x: ann.x,
              y: yFlipped,
              width: ann.width,
              height: ann.height,
              borderColor: rgb(0.3, 0.3, 0.3),
              borderWidth: 1,
            });
            if (ann.content) {
              page.drawText(ann.content, {
                x: ann.x + 4,
                y: yFlipped + ann.height / 2 - 4,
                size: 10,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
            }
            break;

          case "signature":
            page.drawRectangle({
              x: ann.x,
              y: yFlipped,
              width: ann.width,
              height: ann.height,
              borderColor: rgb(0.2, 0.4, 0.8),
              borderWidth: 2,
            });
            page.drawText("Sign Here", {
              x: ann.x + ann.width / 2 - 25,
              y: yFlipped + ann.height / 2 - 4,
              size: 10,
              font: helveticaFont,
              color: rgb(0.5, 0.5, 0.5),
            });
            page.drawLine({
              start: { x: ann.x + 10, y: yFlipped + 10 },
              end: { x: ann.x + ann.width - 10, y: yFlipped + 10 },
              thickness: 1,
              color: rgb(0.3, 0.3, 0.3),
            });
            break;

          case "checkbox":
            page.drawRectangle({
              x: ann.x,
              y: yFlipped,
              width: ann.width,
              height: ann.height,
              borderColor: rgb(0.3, 0.3, 0.3),
              borderWidth: 1,
            });
            if (ann.checked) {
              page.drawText("X", {
                x: ann.x + 5,
                y: yFlipped + 4,
                size: 14,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
            }
            break;

          case "highlight":
            page.drawRectangle({
              x: ann.x,
              y: yFlipped,
              width: ann.width,
              height: ann.height,
              color: rgb(1, 1, 0),
              opacity: 0.3,
            });
            break;

          case "rectangle":
            page.drawRectangle({
              x: ann.x,
              y: yFlipped,
              width: ann.width,
              height: ann.height,
              borderColor: rgb(0, 0, 0),
              borderWidth: 2,
            });
            break;
        }
      }

      const modifiedPdfBytes = await pdfDoc.save();
      
      if (onSave) {
        onSave(modifiedPdfBytes, annotations);
      }

      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "annotated-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ title: "Saved", description: "Annotated PDF has been downloaded." });
    } catch (error) {
      console.error("Error saving PDF:", error);
      toast({ title: "Error", description: "Failed to save annotated PDF.", variant: "destructive" });
    }
  };

  const pageAnnotations = annotations.filter(a => a.page === currentPage);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between gap-2 p-2 border-b flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {TOOLS.map(tool => (
            <Button
              key={tool.id}
              size="sm"
              variant={activeTool === tool.id ? "default" : "ghost"}
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              data-testid={`button-tool-${tool.id}`}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={deleteSelectedAnnotation}
            disabled={!selectedAnnotation}
            title="Delete selected"
            data-testid="button-delete-annotation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={clearAnnotations}
            title="Clear all"
            data-testid="button-clear-annotations"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={saveAnnotatedPDF}
            data-testid="button-save-pdf"
          >
            <Download className="h-4 w-4 mr-1" />
            Save PDF
          </Button>
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm" data-testid="text-page-number">
            Page {currentPage} of {numPages}
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            data-testid="button-next-page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            data-testid="button-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setScale(s => Math.min(2, s + 0.1))}
            data-testid="button-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex justify-center p-4 min-h-full">
          <div
            ref={containerRef}
            className="relative inline-block shadow-lg"
            onMouseDown={handlePageClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: activeTool === "select" ? "default" : "crosshair" }}
          >
            {pdfBytes ? (
              <Document
                file={{ data: pdfBytes }}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="p-8 text-muted-foreground">Loading PDF...</div>}
                error={<div className="p-8 text-destructive">Failed to load PDF</div>}
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="relative"
                />
              </Document>
            ) : (
              <div className="w-[612px] h-[792px] bg-white dark:bg-gray-200 flex items-center justify-center text-muted-foreground border">
                Upload a PDF to annotate
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none">
            {pageAnnotations.map(ann => (
              <div
                key={ann.id}
                className={`absolute border-2 pointer-events-auto ${
                  selectedAnnotation === ann.id ? "border-primary ring-2 ring-primary/30" : ""
                } ${ann.type === "signature" ? "border-blue-500 border-dashed" : ""}
                ${ann.type === "text" ? "border-gray-400" : ""}
                ${ann.type === "checkbox" ? "border-gray-500" : ""}
                ${ann.type === "rectangle" ? "border-black" : ""}`}
                style={{
                  left: ann.x * scale,
                  top: ann.y * scale,
                  width: ann.width * scale,
                  height: ann.height * scale,
                  backgroundColor: ann.type === "highlight" ? "rgba(255, 255, 0, 0.3)" : "transparent",
                  cursor: "pointer",
                }}
                onClick={(e) => handleAnnotationClick(ann.id, e)}
                data-testid={`annotation-${ann.id}`}
              >
                {ann.type === "text" && (
                  <div className="flex items-center justify-center h-full text-xs text-gray-600 p-1 overflow-hidden">
                    {ann.content}
                  </div>
                )}
                {ann.type === "signature" && (
                  <div className="flex flex-col items-center justify-center h-full text-xs text-blue-500">
                    <PenTool className="h-3 w-3 mb-1" />
                    Sign Here
                  </div>
                )}
                {ann.type === "checkbox" && (
                  <div className="flex items-center justify-center h-full text-sm font-bold">
                    {ann.checked ? "X" : ""}
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {editingText && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg shadow-lg w-80 space-y-4">
            <Label>Edit Text Content</Label>
            <Input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Enter text..."
              autoFocus
              data-testid="input-annotation-text"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditingText(null); setTextValue(""); }}>
                Cancel
              </Button>
              <Button onClick={updateTextContent} data-testid="button-save-text">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <span className="font-medium">{annotations.length} annotations</span>
        {activeTool !== "select" && (
          <span className="ml-2">
            Click and drag to add {activeTool === "checkbox" ? "a checkbox" : `a ${activeTool}`}
          </span>
        )}
      </div>
    </div>
  );
}
