import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Camera,
  Sparkles,
  ArrowLeftRight
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BeforeAfterPair {
  id: string;
  projectName: string;
  roomName: string;
  beforeUrl: string;
  afterUrl: string;
  caption?: string;
}

interface BeforeAfterGalleryProps {
  pairs: BeforeAfterPair[];
  title?: string;
  showNavigation?: boolean;
  autoPlay?: boolean;
  className?: string;
}

function ComparisonSlider({ beforeUrl, afterUrl, className = "" }: { 
  beforeUrl: string; 
  afterUrl: string; 
  className?: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg cursor-ew-resize select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      data-testid="comparison-slider"
    >
      <img 
        src={afterUrl} 
        alt="After" 
        className="w-full h-full object-cover"
        draggable={false}
      />
      
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={beforeUrl} 
          alt="Before" 
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-primary">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      <div className="absolute top-3 left-3">
        <Badge variant="secondary" className="bg-black/60 text-white border-0 backdrop-blur-sm">
          Before
        </Badge>
      </div>
      <div className="absolute top-3 right-3">
        <Badge className="bg-primary text-primary-foreground border-0">
          After
        </Badge>
      </div>
    </div>
  );
}

export function BeforeAfterGallery({ 
  pairs, 
  title = "Project Gallery",
  showNavigation = true,
  autoPlay = false,
  className = ""
}: BeforeAfterGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!autoPlay || pairs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pairs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, pairs.length]);

  if (pairs.length === 0) {
    return (
      <Card className={`${className} bg-gradient-to-br from-gray-50 to-gray-100`}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No project photos yet</p>
          <p className="text-sm text-gray-400 mt-1">Photos will appear here as projects are completed</p>
        </CardContent>
      </Card>
    );
  }

  const currentPair = pairs[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pairs.length);
  };

  return (
    <>
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              {pairs.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  {currentIndex + 1} / {pairs.length}
                </Badge>
              )}
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => setIsFullscreen(true)}
                data-testid="button-fullscreen-gallery"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ComparisonSlider 
                beforeUrl={currentPair.beforeUrl}
                afterUrl={currentPair.afterUrl}
                className="aspect-video"
              />
              
              <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-medium text-sm">{currentPair.projectName}</p>
                  <p className="text-xs text-muted-foreground">{currentPair.roomName}</p>
                </div>
                {currentPair.caption && (
                  <p className="text-xs text-muted-foreground italic">"{currentPair.caption}"</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {showNavigation && pairs.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button 
                size="icon" 
                variant="outline"
                onClick={goToPrevious}
                data-testid="button-gallery-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex gap-1">
                {pairs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? "bg-primary w-4" 
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    data-testid={`button-gallery-dot-${index}`}
                  />
                ))}
              </div>
              
              <Button 
                size="icon" 
                variant="outline"
                onClick={goToNext}
                data-testid="button-gallery-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black">
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
              data-testid="button-close-fullscreen"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <ComparisonSlider 
              beforeUrl={currentPair.beforeUrl}
              afterUrl={currentPair.afterUrl}
              className="aspect-video max-h-[80vh]"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-medium">{currentPair.projectName}</p>
              <p className="text-white/70 text-sm">{currentPair.roomName}</p>
            </div>
          </div>
          
          {pairs.length > 1 && (
            <div className="flex items-center justify-center gap-4 p-4 bg-black">
              <Button 
                size="icon" 
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <span className="text-white/70 text-sm">
                {currentIndex + 1} of {pairs.length}
              </span>
              
              <Button 
                size="icon" 
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function BeforeAfterUploader({ 
  onUpload,
  isUploading = false
}: { 
  onUpload: (before: File, after: File, metadata: { projectName: string; roomName: string; caption?: string }) => void;
  isUploading?: boolean;
}) {
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [caption, setCaption] = useState("");

  const handleBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
    }
  };

  const handleAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (beforeFile && afterFile && projectName && roomName) {
      onUpload(beforeFile, afterFile, { projectName, roomName, caption });
    }
  };

  const isValid = beforeFile && afterFile && projectName && roomName;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Add Before/After Photos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Before Photo</label>
            <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors overflow-hidden">
              {beforePreview ? (
                <img src={beforePreview} alt="Before" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleBeforeChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                data-testid="input-before-photo"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">After Photo</label>
            <div className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors overflow-hidden">
              {afterPreview ? (
                <img src={afterPreview} alt="After" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleAfterChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                data-testid="input-after-photo"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input 
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Smith Residence"
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              data-testid="input-project-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room Name</label>
            <input 
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., Living Room"
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
              data-testid="input-room-name"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
          <input 
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="e.g., Complete transformation with SW Agreeable Gray"
            className="w-full px-3 py-2 rounded-md border border-input bg-background"
            data-testid="input-caption"
          />
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={!isValid || isUploading}
          className="w-full"
          data-testid="button-upload-photos"
        >
          {isUploading ? "Uploading..." : "Upload Photos"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default BeforeAfterGallery;
