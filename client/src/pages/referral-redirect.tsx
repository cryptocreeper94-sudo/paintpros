import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function ReferralRedirect() {
  const params = useParams<{ hash: string }>();
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function trackAndRedirect() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const platform = urlParams.get("platform") || "paintpros";
        await apiRequest("POST", "/api/affiliate/track", {
          referralHash: params.hash,
          platform,
        });
      } catch (e) {
      }
      setLocation("/");
    }
    trackAndRedirect();
  }, [params.hash, setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
