import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

function generateSessionId(): string {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

export function useAnalytics() {
  const [location] = useLocation();
  const lastPageRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const sessionId = generateSessionId();
    const referrer = document.referrer || null;

    const trackPageView = async (page: string, duration?: number) => {
      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page,
            referrer: lastPageRef.current === null ? referrer : lastPageRef.current,
            sessionId,
            duration: duration || null
          })
        });
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    };

    if (lastPageRef.current !== null && lastPageRef.current !== location) {
      const duration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      trackPageView(lastPageRef.current, duration);
    }

    lastPageRef.current = location;
    pageStartTimeRef.current = Date.now();
    trackPageView(location);

    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      navigator.sendBeacon("/api/analytics/track", JSON.stringify({
        page: location,
        sessionId,
        duration
      }));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location]);
}
