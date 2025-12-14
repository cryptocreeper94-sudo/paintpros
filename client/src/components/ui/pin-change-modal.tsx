import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "./glass-card";
import { Input } from "./input";
import { FlipButton } from "./flip-button";
import { Lock, AlertCircle, Check, X } from "lucide-react";

interface PinChangeModalProps {
  isOpen: boolean;
  role: string;
  roleLabel: string;
  currentPin: string;
  onSuccess: () => void;
  onClose: () => void;
  accentColor?: string;
}

export function PinChangeModal({ 
  isOpen, 
  role, 
  roleLabel, 
  currentPin, 
  onSuccess,
  onClose,
  accentColor = "accent"
}: PinChangeModalProps) {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setError("PIN must contain only numbers");
      return;
    }

    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    if (newPin === currentPin) {
      setError("New PIN must be different from current PIN");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/pin/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, currentPin, newPin }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change PIN");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change PIN");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 border-accent/30" glow>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              data-testid="button-close-pin-modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <motion.div 
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-${accentColor}/30 to-blue-500/20 flex items-center justify-center border border-${accentColor}/30`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Lock className={`w-8 h-8 text-${accentColor}`} />
              </motion.div>
              <h2 className="text-2xl font-display font-bold mb-2">Change Your PIN</h2>
              <p className="text-muted-foreground text-sm">
                For security, please set a new PIN for your {roleLabel} account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">New PIN</label>
                <Input
                  type="password"
                  placeholder="Enter new 4-digit PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl"
                  maxLength={4}
                  data-testid="input-new-pin"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Confirm PIN</label>
                <Input
                  type="password"
                  placeholder="Confirm new PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="bg-white/5 border-white/20 text-center text-2xl h-14 tracking-[0.5em] rounded-xl"
                  maxLength={4}
                  data-testid="input-confirm-pin"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <FlipButton 
                className="w-full h-12" 
                disabled={isSubmitting || newPin.length !== 4 || confirmPin.length !== 4}
                data-testid="button-change-pin"
              >
                {isSubmitting ? "Changing..." : "Set New PIN"} <Check className="w-5 h-5" />
              </FlipButton>
            </form>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
