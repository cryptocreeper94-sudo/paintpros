import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Eye, Globe, Smartphone, Monitor, Tablet,
  TrendingUp, RefreshCw, Zap, Building2, ChevronDown, Clock, ArrowUpRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const TENANT_PREFIXES: Record<string, { prefix: string; name: string; color: string }> = {
  npp: { prefix: 'NPP', name: 'Nashville Painting Professionals', color: '#5a7a4d' },
  demo: { prefix: 'PAINTPROS', name: 'PaintPros.io', color: '#d4a853' },
  orbit: { prefix: 'ORBIT', name: 'ORBIT Platform', color: '#9945FF' },
};

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

function TenantDashboardContent({ tenantId, tenantInfo }: { tenantId: string; tenantInfo: { prefix: string; name: string; color: string } }) {
  const { data, isLoading, refetch, isFetching } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard", tenantId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/dashboard?tenantId=${tenantId}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-20 mb-2" />
            <div className="h-8 bg-white/10 rounded w-16" />
          </GlassCard>
        ))}
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
    <div className="space-y-6 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tenantInfo.color }} />
          <span className="text-sm text-muted-foreground">{tenantInfo.prefix} Analytics</span>
        </div>
        <motion.button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          data-testid={`button-refresh-tenant-analytics-${tenantId}`}
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <GlassCard className="p-4 relative overflow-hidden" glow>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
              <Zap className="w-3 h-3" />
              Live Now
            </div>
            <div className="text-2xl font-bold text-green-400" data-testid={`text-live-visitors-${tenantId}`}>
              {data.liveVisitors}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active visitors</div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Eye className="w-3 h-3" />
              Today
            </div>
            <div className="text-2xl font-bold" data-testid={`text-today-views-${tenantId}`}>{data.today.views}</div>
            <div className="text-xs text-gold-400 flex items-center gap-1 mt-1">
              <Users className="w-2 h-2" />
              {data.today.visitors} visitors
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3" />
              This Week
            </div>
            <div className="text-2xl font-bold" data-testid={`text-week-views-${tenantId}`}>{data.thisWeek.views}</div>
            <div className="text-xs text-blue-400 flex items-center gap-1 mt-1">
              <Users className="w-2 h-2" />
              {data.thisWeek.visitors} visitors
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <BarChart3 className="w-3 h-3" />
              This Month
            </div>
            <div className="text-2xl font-bold" data-testid={`text-month-views-${tenantId}`}>{data.thisMonth.views}</div>
            <div className="text-xs text-purple-400 flex items-center gap-1 mt-1">
              <Users className="w-2 h-2" />
              {data.thisMonth.visitors} visitors
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Globe className="w-3 h-3" />
              All Time
            </div>
            <div className="text-2xl font-bold" data-testid={`text-alltime-views-${tenantId}`}>{data.allTime.views}</div>
            <div className="text-xs text-orange-400 flex items-center gap-1 mt-1">
              <Users className="w-2 h-2" />
              {data.allTime.visitors} visitors
            </div>
          </div>
        </GlassCard>
      </div>

      <BentoGrid className="gap-3">
        <BentoItem colSpan={6} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.005 }}>
            <GlassCard className="h-full p-4 bg-gradient-to-br from-blue-500/10 via-transparent to-accent/5" glow>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h3 className="text-sm font-display font-bold">Daily Traffic (30 Days)</h3>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.dailyTraffic}>
                    <defs>
                      <linearGradient id={`colorViews-${tenantId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={tenantInfo.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={tenantInfo.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="#666" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="views" stroke={tenantInfo.color} fillOpacity={1} fill={`url(#colorViews-${tenantId})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={6} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.005 }}>
            <GlassCard className="h-full p-4 bg-gradient-to-br from-gold-400/10 via-transparent to-orange-500/5" glow>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400/20 to-orange-500/20 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <h3 className="text-sm font-display font-bold">Hourly Traffic (Today)</h3>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData}>
                    <XAxis dataKey="hour" tick={{ fontSize: 9 }} tickFormatter={(v) => v.replace(':00', '')} stroke="#666" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#666" />
                    <Tooltip 
                      contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="views" fill={tenantInfo.color} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-4 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/5" glow>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <h3 className="text-sm font-display font-bold">Top Pages</h3>
              </div>
              <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
                {data.topPages.slice(0, 5).map((page, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-muted-foreground truncate max-w-[100px]">{page.page === "/" ? "Home" : page.page}</span>
                    <span className="font-bold text-purple-400">{page.views}</span>
                  </div>
                ))}
                {data.topPages.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">No data yet</div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-4 bg-gradient-to-br from-green-500/10 via-transparent to-teal-500/5" glow>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
                </div>
                <h3 className="text-sm font-display font-bold">Top Referrers</h3>
              </div>
              <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
                {data.topReferrers.slice(0, 5).map((ref, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-muted-foreground truncate max-w-[100px]">{ref.referrer}</span>
                    <span className="font-bold text-green-400">{ref.count}</span>
                  </div>
                ))}
                {data.topReferrers.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">No referrer data</div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </BentoItem>

        <BentoItem colSpan={4} rowSpan={2}>
          <motion.div className="h-full" whileHover={{ scale: 1.01 }}>
            <GlassCard className="h-full p-4 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5" glow>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h3 className="text-sm font-display font-bold">Devices</h3>
              </div>
              {totalDevices > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={35}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {deviceData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3 text-amber-500" />
                        <span>Desktop</span>
                      </div>
                      <span className="font-bold text-amber-500">{data.deviceBreakdown.desktop}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3 h-3 text-blue-500" />
                        <span>Mobile</span>
                      </div>
                      <span className="font-bold text-blue-500">{data.deviceBreakdown.mobile}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-white/5">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-3 h-3 text-green-500" />
                        <span>Tablet</span>
                      </div>
                      <span className="font-bold text-green-500">{data.deviceBreakdown.tablet}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-4">No device data</div>
              )}
            </GlassCard>
          </motion.div>
        </BentoItem>
      </BentoGrid>
    </div>
  );
}

export function TenantAnalyticsDashboard() {
  const [openItem, setOpenItem] = useState<string>("");

  const { data: tenantsData } = useQuery<{ tenants: string[] }>({
    queryKey: ["/api/analytics/tenants"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/tenants");
      if (!res.ok) throw new Error("Failed to fetch tenants");
      return res.json();
    },
  });

  const availableTenants = tenantsData?.tenants || [];
  const allKnownTenants = Object.keys(TENANT_PREFIXES);
  const tenantsToShow = allKnownTenants.filter(t => availableTenants.includes(t) || t === "npp");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="w-6 h-6 text-gold-400" />
        <h2 className="text-xl font-display font-bold">Client Analytics</h2>
      </div>
      
      <Accordion 
        type="single" 
        collapsible 
        value={openItem} 
        onValueChange={setOpenItem}
        className="space-y-2"
      >
        {tenantsToShow.map((tenantId) => {
          const tenantInfo = TENANT_PREFIXES[tenantId];
          if (!tenantInfo) return null;
          
          return (
            <AccordionItem 
              key={tenantId} 
              value={tenantId}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
            >
              <AccordionTrigger 
                className="px-4 py-3 hover:no-underline hover:bg-white/5 transition-colors"
                data-testid={`accordion-trigger-${tenantId}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: tenantInfo.color }}
                  />
                  <span className="font-medium">{tenantInfo.name}</span>
                  <span className="text-xs text-muted-foreground bg-white/10 px-2 py-0.5 rounded">
                    {tenantInfo.prefix}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <TenantDashboardContent tenantId={tenantId} tenantInfo={tenantInfo} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {tenantsToShow.length === 0 && (
        <GlassCard className="p-8 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No tenant analytics data available yet.</p>
        </GlassCard>
      )}
    </div>
  );
}
