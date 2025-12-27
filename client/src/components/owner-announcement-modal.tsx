import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Mail, 
  Mic, 
  Phone,
  X
} from "lucide-react";

const ANNOUNCEMENT_VERSION = "2024-12-27-v1";

interface OwnerAnnouncementModalProps {
  open?: boolean;
}

export function OwnerAnnouncementModal({ open: controlledOpen }: OwnerAnnouncementModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const seenVersion = localStorage.getItem("owner-announcement-seen");
    if (seenVersion !== ANNOUNCEMENT_VERSION) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("owner-announcement-seen", ANNOUNCEMENT_VERSION);
    setIsOpen(false);
  };

  const showModal = controlledOpen !== undefined ? controlledOpen : isOpen;

  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Hey Sid!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <p className="text-base text-foreground leading-relaxed">
            This is the newest publish! We got the email working, so give it a shot.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-1.5 bg-emerald-500/10 rounded-md">
                <Mic className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Try Rollie Again</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  New voice system - sounds way better now, not like a creepy robot anymore
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-1.5 bg-blue-500/10 rounded-md">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Emails Working</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Estimates now send from nashpaintpros.io with a clean new design
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-sm text-emerald-700 dark:text-emerald-400">Give me a call after you see this</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              The AI agent can fill you in on all the details. Talk soon!
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose} className="gap-2" data-testid="button-close-announcement">
              Got It
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
