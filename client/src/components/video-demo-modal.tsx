import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

interface VideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoDemoModal({ isOpen, onClose }: VideoDemoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-accent" />
            Platform Demo Video
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-6">
              <Play className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Demo Video Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're preparing a comprehensive walkthrough of all platform features. 
              In the meantime, explore the interactive demo below.
            </p>
            <div className="flex gap-3">
              <Button onClick={onClose} data-testid="button-explore-demo">
                Explore Live Demo
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href="https://calendly.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  data-testid="link-schedule-call"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Schedule a Call
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { title: "AI Features", duration: "4 min", desc: "Route optimization, risk scoring, proposals" },
            { title: "Blockchain", duration: "3 min", desc: "Document stamping, NFTs, smart contracts" },
            { title: "Multi-Tenant", duration: "5 min", desc: "White-label, franchises, role dashboards" }
          ].map((video) => (
            <div
              key={video.title}
              className="p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground">{video.duration}</span>
              </div>
              <h4 className="font-bold text-sm">{video.title}</h4>
              <p className="text-xs text-muted-foreground">{video.desc}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
