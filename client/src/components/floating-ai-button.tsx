import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import mascotImage from "/icons/paintpros-mascot.png";

interface FloatingAIButtonProps {
  onOpenChat?: () => void;
}

export function FloatingAIButton({ onOpenChat }: FloatingAIButtonProps) {
  const tenant = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  if (!tenant.features.aiAssistant) {
    return null;
  }

  const handleSend = () => {
    if (message.trim()) {
      console.log("AI Message:", message);
      setMessage("");
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-2xl border-2 border-accent/50 bg-transparent hover:scale-110 transition-transform"
        style={{
          boxShadow: "0 0 30px rgba(197, 160, 89, 0.4), 0 8px 32px rgba(0,0,0,0.3)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-ai-assistant"
      >
        <img
          src={tenant.logo || mascotImage}
          alt="AI Assistant"
          className="w-full h-full object-cover"
        />
        
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-accent/20 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 right-4 z-50 w-80 md:w-96 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            data-testid="panel-ai-chat"
          >
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-accent/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={tenant.logo || mascotImage}
                  alt="AI"
                  className="w-10 h-10 rounded-full border border-accent/30"
                />
                <div>
                  <h3 className="font-bold text-sm">Paint Pro AI</h3>
                  <p className="text-[10px] text-muted-foreground">Your painting assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="button-close-ai"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 h-48 overflow-y-auto">
              <div className="bg-accent/10 rounded-lg p-3 text-sm">
                <p className="text-muted-foreground">
                  Hi! I'm your Paint Pro AI assistant. I can help you with:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground/80">
                  <li>• Estimating your painting project</li>
                  <li>• Choosing the right colors</li>
                  <li>• Understanding our services</li>
                  <li>• Scheduling an appointment</li>
                </ul>
              </div>
            </div>

            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50"
                  data-testid="input-ai-message"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                  data-testid="button-send-ai"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
