import { Eye, Lock, X } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/context/DemoContext";

export function DemoModeBanner() {
  const { isDemoMode } = useDemo();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoMode || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm shadow-lg">
      <Eye className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">Demo Mode</span>
      <span className="hidden sm:inline text-white/80">
        You're viewing sample data. All features are read-only.
      </span>
      <Lock className="w-3.5 h-3.5 text-white/60" />
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 p-1 hover:bg-white/20 rounded transition-colors"
        data-testid="button-dismiss-demo-banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
