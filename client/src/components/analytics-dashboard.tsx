import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Eye, Clock, Globe, Smartphone, Monitor, Tablet,
  TrendingUp, Activity, ArrowUpRight, RefreshCw, Zap
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface AnalyticsData {
  today: { views: number; visitors: number };
  thisWeek: { views: number; visitors: number };
  thisMonth: { views: number; visitors: number };
  allTime: { views: number; visitors: number };
  liveVisitors: number;
  topPages: { page: string; views: number }[];
  topReferrers: { referrer: string; count: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  hourlyTraffic: { hour: number; views: number }[];
  dailyTraffic: { date: string; views: number; visitors: number }[];
}

const DEVICE_COLORS = {
  desktop: "#f59e0b",
  mobile: "#3b82f6",
  tablet: "#10b981"
};

export function AnalyticsDashboard() {
  const { data, isLoading, refetch, isFetching } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/dashboard");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-gold-400" />
            Site Analytics
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <GlassCard key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-20 mb-2" />
              <div className="h-8 bg-white/10 rounded w-16" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const deviceData = [
    { name: "Desktop", value: data.deviceBreakdown.desktop, color: DEVICE_COLORS.desktop },
    { name: "Mobile", value: data.deviceBreakdown.mobile, color: DEVICE_COLORS.mobile },
    { name: "Tablet", value: data.deviceBreakdown.tablet, color: DEVICE_COLORS.tablet },
  ].filter(d => d.value > 0);

  const totalDevices = deviceData.reduce((sum, d) => sum + d.value, 0);

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const found = data.hourlyTraffic.find(h => h.hour === i);
    return { hour: `${i}:00`, views: found?.views || 0 };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-gold-400" />
          Site Analytics
        </h2>
        <motion.button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid="button-refresh-analytics"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <GlassCard className="p-5 relative overflow-hidden" glow>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                <Zap className="w-4 h-4" />
                Live Now
              </div>
              <div className="text-3xl font-bold text-green-400" data-testid="text-live-visitors">
                {data.liveVisitors}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Active visitors</div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Eye className="w-4 h-4" />
                Today
              </div>
              <div className="text-3xl font-bold" data-testid="text-today-views">{data.today.views}</div>
              <div className="text-xs text-gold-400 flex items-center gap-1 mt-1">
                <Users className="w-3 h-3" />
                {data.today.visitors} visitors
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                This Week
              </div>
              <div className="text-3xl font-bold" data-testid="text-week-views">{data.thisWeek.views}</div>
              <div className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                <Users className="w-3 h-3" />
                {data.thisWeek.visitors} visitors
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Activity className="w-4 h-4" />
                This Month
              </div>
              <div className="text-3xl font-bold" data-testid="text-month-views">{data.thisMonth.views}</div>
              <div className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                <Users className="w-3 h-3" />
                {data.thisMonth.visitors} visitors
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <GlassCard className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Globe className="w-4 h-4" />
                All Time
              </div>
              <div className="text-3xl font-bold" data-testid="text-alltime-views">{data.allTime.views}</div>
              <div className="text-xs text-accent flex items-center gap-1 mt-1">
                <Users className="w-3 h-3" />
                {data.allTime.visitors} visitors
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <BentoGrid className="gap-4">
        <BentoItem colSpan={8} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.002 }}>
            <GlassCard className="h-full p-5 bg-gradient-to-br from-gold-400/10 via-transparent to-accent/5" glow>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400/20 to-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="text-lg font-display font-bold">Traffic Over Time</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyTraffic}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      fontSize={10}
                      tickFormatter={(v) => v.slice(5)}
                    />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(0,0,0,0.8)", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px"
                      }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#colorViews)" strokeWidth={2} />
                    <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="url(#colorVisitors)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 mt-3 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold-400" />
                  <span className="text-muted-foreground">Page Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-muted-foreground">Unique Visitors</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-5 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5" glow>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-lg font-display font-bold">Devices</h3>
              </div>
              {deviceData.length > 0 ? (
                <>
                  <div className="h-40 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "rgba(0,0,0,0.8)", 
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-3">
                    {deviceData.map((device) => (
                      <div key={device.name} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          {device.name === "Desktop" && <Monitor className="w-4 h-4" style={{ color: device.color }} />}
                          {device.name === "Mobile" && <Smartphone className="w-4 h-4" style={{ color: device.color }} />}
                          {device.name === "Tablet" && <Tablet className="w-4 h-4" style={{ color: device.color }} />}
                          <span>{device.name}</span>
                        </div>
                        <span className="font-medium" style={{ color: device.color }}>
                          {totalDevices > 0 ? Math.round((device.value / totalDevices) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  No device data yet
                </div>
              )}
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-5 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/5" glow>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-lg font-display font-bold">Top Pages</h3>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {data.topPages.length > 0 ? (
                  data.topPages.slice(0, 8).map((page, index) => (
                    <motion.div
                      key={page.page}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <span className="text-sm truncate max-w-[120px]" title={page.page}>
                        {page.page === "/" ? "Home" : page.page}
                      </span>
                      <span className="text-sm font-bold text-purple-400">{page.views}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No page data yet</div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-5 bg-gradient-to-br from-green-500/10 via-transparent to-teal-500/5" glow>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-lg font-display font-bold">Top Referrers</h3>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {data.topReferrers.length > 0 ? (
                  data.topReferrers.slice(0, 8).map((ref, index) => (
                    <motion.div
                      key={ref.referrer}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <span className="text-sm truncate max-w-[120px]" title={ref.referrer}>
                        {ref.referrer}
                      </span>
                      <span className="text-sm font-bold text-green-400">{ref.count}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No referrer data yet</div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-5 bg-gradient-to-br from-gold-400/10 via-transparent to-orange-500/5" glow>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400/20 to-orange-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gold-400" />
                </div>
                <h3 className="text-lg font-display font-bold">Today's Hourly</h3>
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <XAxis 
                      dataKey="hour" 
                      stroke="#666" 
                      fontSize={9}
                      interval={5}
                      tickFormatter={(v) => v.replace(":00", "")}
                    />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(0,0,0,0.8)", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px"
                      }}
                    />
                    <Bar dataKey="views" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>
      </BentoGrid>
    </div>
  );
}
