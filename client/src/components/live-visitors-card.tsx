import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Smartphone, Monitor, Tablet, Eye, Globe, 
  ChevronRight, Activity, MapPin, Clock, HelpCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LiveVisitor {
  sessionId: string;
  deviceType: string;
  browser: string;
  page: string;
  lastSeen: string;
  isBot: boolean;
}

interface LiveVisitorData {
  total: number;
  realVisitors: number;
  bots: number;
  byDevice: { desktop: number; mobile: number; tablet: number };
  byPage: { page: string; count: number }[];
  visitors: LiveVisitor[];
}

export function LiveVisitorsCard() {
  const [showDetails, setShowDetails] = useState(false);

  const { data, isLoading } = useQuery<LiveVisitorData>({
    queryKey: ["/api/analytics/live-visitors"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/live-visitors");
      if (!res.ok) throw new Error("Failed to fetch live visitors");
      return res.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading || !data) {
    return (
      <GlassCard className="p-5 relative overflow-hidden animate-pulse" glow>
        <div className="h-4 bg-white/10 rounded w-20 mb-2" />
        <div className="h-8 bg-white/10 rounded w-16" />
      </GlassCard>
    );
  }

  const deviceIcons = {
    desktop: <Monitor className="w-3 h-3" />,
    mobile: <Smartphone className="w-3 h-3" />,
    tablet: <Tablet className="w-3 h-3" />,
  };

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setShowDetails(true)}
        className="cursor-pointer"
        data-testid="card-live-visitors"
      >
        <GlassCard className="p-5 relative overflow-hidden group" glow>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          
          {/* Pulse animation for live indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-xs text-green-400">LIVE</span>
          </div>
          
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-4 h-4 text-green-400/60" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
              <Activity className="w-4 h-4" />
              Live Visitors
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-400" data-testid="text-live-count">
                {data.realVisitors}
              </span>
              {data.bots > 0 && (
                <span className="text-xs text-muted-foreground">
                  (+{data.bots} bots)
                </span>
              )}
            </div>
            
            {/* Device breakdown mini bar */}
            {data.realVisitors > 0 && (
              <div className="mt-3 flex items-center gap-3 text-xs">
                {data.byDevice.desktop > 0 && (
                  <div className="flex items-center gap-1 text-gold-400">
                    <Monitor className="w-3 h-3" />
                    <span>{data.byDevice.desktop}</span>
                  </div>
                )}
                {data.byDevice.mobile > 0 && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Smartphone className="w-3 h-3" />
                    <span>{data.byDevice.mobile}</span>
                  </div>
                )}
                {data.byDevice.tablet > 0 && (
                  <div className="flex items-center gap-1 text-purple-400">
                    <Tablet className="w-3 h-3" />
                    <span>{data.byDevice.tablet}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Top pages preview */}
            {data.byPage.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground truncate">
                Top: {data.byPage.slice(0, 2).map(p => p.page === "/" ? "Home" : p.page).join(", ")}
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Detailed Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="relative">
                <Activity className="w-5 h-5 text-green-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              Live Visitors
              <span className="text-green-400 ml-2">({data.realVisitors})</span>
            </DialogTitle>
            <DialogDescription>
              Real-time breakdown of who's on your site right now
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gold-400/10 border border-gold-400/20 text-center">
                <Monitor className="w-5 h-5 mx-auto text-gold-400 mb-1" />
                <div className="text-xl font-bold text-gold-400">{data.byDevice.desktop}</div>
                <div className="text-xs text-muted-foreground">Desktop</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                <Smartphone className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <div className="text-xl font-bold text-blue-400">{data.byDevice.mobile}</div>
                <div className="text-xs text-muted-foreground">Mobile</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                <Tablet className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                <div className="text-xl font-bold text-purple-400">{data.byDevice.tablet}</div>
                <div className="text-xs text-muted-foreground">Tablet</div>
              </div>
            </div>

            {/* Pages Being Viewed */}
            {data.byPage.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Pages Being Viewed
                </h4>
                <div className="space-y-1.5">
                  {data.byPage.map((page, i) => (
                    <div 
                      key={page.page} 
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                    >
                      <span className="text-sm truncate max-w-[200px]">
                        {page.page === "/" ? "Home" : page.page}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {[...Array(Math.min(page.count, 5))].map((_, j) => (
                            <div 
                              key={j} 
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400/30 to-blue-400/30 border border-white/20 flex items-center justify-center"
                            >
                              <Users className="w-2.5 h-2.5 text-white/70" />
                            </div>
                          ))}
                          {page.count > 5 && (
                            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-base">
                              +{page.count - 5}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-bold text-green-400 min-w-[24px] text-right">
                          {page.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Visitors (scrollable for scale) */}
            {data.visitors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Active Sessions ({data.visitors.filter(v => !v.isBot).length})
                </h4>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1.5 pr-4">
                    {data.visitors.filter(v => !v.isBot).map((visitor, i) => (
                      <motion.div
                        key={visitor.sessionId || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            visitor.deviceType === "mobile" 
                              ? "bg-blue-500/20 text-blue-400" 
                              : visitor.deviceType === "tablet"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gold-400/20 text-gold-400"
                          }`}>
                            {visitor.deviceType === "mobile" ? (
                              <Smartphone className="w-3.5 h-3.5" />
                            ) : visitor.deviceType === "tablet" ? (
                              <Tablet className="w-3.5 h-3.5" />
                            ) : (
                              <Monitor className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {visitor.browser} • {visitor.deviceType}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {visitor.page === "/" ? "Home" : visitor.page}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {visitor.lastSeen}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Bot notice */}
            {data.bots > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t border-white/10">
                <HelpCircle className="w-3 h-3" />
                {data.bots} bot/crawler visits filtered out (search engines, preview systems)
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
