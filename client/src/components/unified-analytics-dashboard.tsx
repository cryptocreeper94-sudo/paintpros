import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Users, Eye, Clock, Globe, Smartphone, Monitor, Tablet,
  TrendingUp, Activity, ArrowUpRight, RefreshCw, Zap, MapPin, Tag,
  Building2, Paintbrush, Store, Target, AlertCircle, CheckCircle2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface GeoData {
  countries: { country: string; views: number; visitors: number }[];
  cities: { city: string; country: string; views: number }[];
  totalWithLocation: number;
  totalWithoutLocation: number;
}

interface SeoPerformance {
  overallScore: number;
  breakdown: {
    titleScore: number;
    metaScore: number;
    keywordScore: number;
    structuredDataScore: number;
    socialScore: number;
  };
  totalPages: number;
  optimizedPages: number;
  issues: string[];
  recommendations: string[];
}

interface SeoTag {
  id: string;
  tagType: string;
  value: string;
  isActive: boolean;
  tenantId: string;
}

const TENANT_CONFIG = {
  npp: {
    name: "Nashville Painting Pros",
    shortName: "NPP",
    icon: Paintbrush,
    color: "text-amber-400",
    bgColor: "from-amber-500/20",
    borderColor: "border-amber-500/30"
  },
  lumepaint: {
    name: "Lume Paint Co",
    shortName: "Lume",
    icon: Building2,
    color: "text-gray-400",
    bgColor: "from-gray-500/20",
    borderColor: "border-gray-500/30"
  },
  demo: {
    name: "Demo Marketplace",
    shortName: "Demo",
    icon: Store,
    color: "text-blue-400",
    bgColor: "from-blue-500/20",
    borderColor: "border-blue-500/30"
  }
};

const DEVICE_COLORS = {
  desktop: "#f59e0b",
  mobile: "#3b82f6",
  tablet: "#10b981"
};

export function UnifiedAnalyticsDashboard() {
  const [activeTenant, setActiveTenant] = useState<string>("npp");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: nppData, isLoading: nppLoading, refetch: refetchNpp } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard", "npp"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/dashboard?tenantId=npp");
      if (!res.ok) throw new Error("Failed to fetch NPP analytics");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: lumeData, isLoading: lumeLoading, refetch: refetchLume } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard", "lumepaint"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/dashboard?tenantId=lumepaint");
      if (!res.ok) throw new Error("Failed to fetch Lume analytics");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: demoData, isLoading: demoLoading, refetch: refetchDemo } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/dashboard", "demo"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/dashboard?tenantId=demo");
      if (!res.ok) throw new Error("Failed to fetch Demo analytics");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: seoTags = [] } = useQuery<SeoTag[]>({
    queryKey: ["/api/seo-tags"],
  });

  const { data: nppGeo } = useQuery<GeoData>({
    queryKey: ["/api/analytics/geography", "npp"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/geography?tenantId=npp&days=30");
      if (!res.ok) throw new Error("Failed to fetch NPP geo data");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: lumeGeo } = useQuery<GeoData>({
    queryKey: ["/api/analytics/geography", "lumepaint"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/geography?tenantId=lumepaint&days=30");
      if (!res.ok) throw new Error("Failed to fetch Lume geo data");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: demoGeo } = useQuery<GeoData>({
    queryKey: ["/api/analytics/geography", "demo"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/geography?tenantId=demo&days=30");
      if (!res.ok) throw new Error("Failed to fetch Demo geo data");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const getGeoForTenant = (tenantId: string): GeoData | undefined => {
    switch (tenantId) {
      case "npp": return nppGeo;
      case "lumepaint": return lumeGeo;
      case "demo": return demoGeo;
      default: return nppGeo;
    }
  };

  const { data: nppSeo } = useQuery<SeoPerformance>({
    queryKey: ["/api/seo/performance", "npp"],
    queryFn: async () => {
      const res = await fetch("/api/seo/performance?tenantId=npp");
      if (!res.ok) throw new Error("Failed to fetch NPP SEO");
      return res.json();
    },
  });

  const { data: lumeSeo } = useQuery<SeoPerformance>({
    queryKey: ["/api/seo/performance", "lumepaint"],
    queryFn: async () => {
      const res = await fetch("/api/seo/performance?tenantId=lumepaint");
      if (!res.ok) throw new Error("Failed to fetch Lume SEO");
      return res.json();
    },
  });

  const { data: demoSeo } = useQuery<SeoPerformance>({
    queryKey: ["/api/seo/performance", "demo"],
    queryFn: async () => {
      const res = await fetch("/api/seo/performance?tenantId=demo");
      if (!res.ok) throw new Error("Failed to fetch Demo SEO");
      return res.json();
    },
  });

  const getSeoForTenant = (tenantId: string): SeoPerformance | undefined => {
    switch (tenantId) {
      case "npp": return nppSeo;
      case "lumepaint": return lumeSeo;
      case "demo": return demoSeo;
      default: return nppSeo;
    }
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchNpp(), refetchLume(), refetchDemo()]);
    setIsRefreshing(false);
  };

  const getDataForTenant = (tenantId: string): AnalyticsData | undefined => {
    switch (tenantId) {
      case "npp": return nppData;
      case "lumepaint": return lumeData;
      case "demo": return demoData;
      default: return nppData;
    }
  };

  const isLoadingTenant = (tenantId: string): boolean => {
    switch (tenantId) {
      case "npp": return nppLoading;
      case "lumepaint": return lumeLoading;
      case "demo": return demoLoading;
      default: return false;
    }
  };

  const getSeoTagsForTenant = (tenantId: string) => {
    return seoTags.filter(tag => tag.tenantId === tenantId);
  };

  const currentData = getDataForTenant(activeTenant);
  const currentLoading = isLoadingTenant(activeTenant);
  const currentConfig = TENANT_CONFIG[activeTenant as keyof typeof TENANT_CONFIG];
  const currentSeoTags = getSeoTagsForTenant(activeTenant);
  const currentGeo = getGeoForTenant(activeTenant);
  const currentSeo = getSeoForTenant(activeTenant);

  const hourlyData = currentData ? Array.from({ length: 24 }, (_, i) => {
    const found = currentData.hourlyTraffic.find(h => h.hour === i);
    return { hour: `${i}:00`, views: found?.views || 0 };
  }) : [];

  const deviceData = currentData ? [
    { name: "Desktop", value: currentData.deviceBreakdown.desktop, color: DEVICE_COLORS.desktop },
    { name: "Mobile", value: currentData.deviceBreakdown.mobile, color: DEVICE_COLORS.mobile },
    { name: "Tablet", value: currentData.deviceBreakdown.tablet, color: DEVICE_COLORS.tablet },
  ].filter(d => d.value > 0) : [];

  const totalLiveVisitors = (nppData?.liveVisitors || 0) + (lumeData?.liveVisitors || 0) + (demoData?.liveVisitors || 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-gold-400" />
            Multi-Site Analytics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track all your sites from one dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <Zap className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-sm font-medium text-green-400">{totalLiveVisitors} Live Total</span>
          </div>
          <motion.button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="button-refresh-all-analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh All
          </motion.button>
        </div>
      </div>

      <Tabs value={activeTenant} onValueChange={setActiveTenant} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 rounded-xl">
          {Object.entries(TENANT_CONFIG).map(([id, config]) => {
            const TenantIcon = config.icon;
            const tenantData = getDataForTenant(id);
            return (
              <TabsTrigger 
                key={id}
                value={id}
                className={`flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:${config.bgColor} data-[state=active]:to-transparent rounded-lg transition-all`}
                data-testid={`tab-tenant-${id}`}
              >
                <TenantIcon className={`w-4 h-4 ${config.color}`} />
                <span className="hidden sm:inline">{config.name}</span>
                <span className="sm:hidden">{config.shortName}</span>
                {tenantData && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10">
                    {tenantData.liveVisitors}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTenant}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            {currentLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <GlassCard key={i} className="p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-20 mb-2" />
                    <div className="h-8 bg-white/10 rounded w-16" />
                  </GlassCard>
                ))}
              </div>
            ) : currentData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <GlassCard className={`p-5 relative overflow-hidden border ${currentConfig.borderColor}`} glow>
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentConfig.bgColor} to-transparent`} />
                    <div className="relative">
                      <div className={`flex items-center gap-2 text-sm ${currentConfig.color} mb-1`}>
                        <Zap className="w-4 h-4" />
                        Live Now
                      </div>
                      <div className={`text-3xl font-bold ${currentConfig.color}`} data-testid="text-live-visitors">
                        {currentData.liveVisitors}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Active visitors</div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400/10 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Eye className="w-4 h-4" />
                        Today
                      </div>
                      <div className="text-3xl font-bold">{currentData.today.views}</div>
                      <div className="text-xs text-gold-400 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {currentData.today.visitors} visitors
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="w-4 h-4" />
                        This Week
                      </div>
                      <div className="text-3xl font-bold">{currentData.thisWeek.views}</div>
                      <div className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {currentData.thisWeek.visitors} visitors
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Activity className="w-4 h-4" />
                        This Month
                      </div>
                      <div className="text-3xl font-bold">{currentData.thisMonth.views}</div>
                      <div className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {currentData.thisMonth.visitors} visitors
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                    <div className="relative">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Globe className="w-4 h-4" />
                        All Time
                      </div>
                      <div className="text-3xl font-bold">{currentData.allTime.views}</div>
                      <div className="text-xs text-accent flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {currentData.allTime.visitors} visitors
                      </div>
                    </div>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <GlassCard className="lg:col-span-2 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">Daily Traffic (Last 7 Days)</h3>
                    </div>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentData.dailyTraffic.slice(-7)}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" stroke="#666" fontSize={12} />
                          <YAxis stroke="#666" fontSize={12} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px'
                            }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#colorViews)" />
                          <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Monitor className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">Device Breakdown</h3>
                    </div>
                    {deviceData.length > 0 ? (
                      <div className="h-[200px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              dataKey="value"
                              paddingAngle={2}
                            >
                              {deviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        No device data yet
                      </div>
                    )}
                    <div className="flex justify-center gap-4 mt-2">
                      {deviceData.map(d => (
                        <div key={d.name} className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">Top Pages</h3>
                    </div>
                    <div className="space-y-2">
                      {currentData.topPages.slice(0, 5).map((page, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="truncate flex-1 text-muted-foreground">{page.page}</span>
                          <span className="font-medium ml-2">{page.views}</span>
                        </div>
                      ))}
                      {currentData.topPages.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          No page data yet
                        </div>
                      )}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <ArrowUpRight className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">Top Referrers</h3>
                    </div>
                    <div className="space-y-2">
                      {currentData.topReferrers.slice(0, 5).map((ref, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="truncate flex-1 text-muted-foreground">{ref.referrer || 'Direct'}</span>
                          <span className="font-medium ml-2">{ref.count}</span>
                        </div>
                      ))}
                      {currentData.topReferrers.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          No referrer data yet
                        </div>
                      )}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">SEO Performance</h3>
                    </div>
                    {currentSeo ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="relative w-24 h-24">
                            <svg className="w-24 h-24 transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-white/10"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={`${currentSeo.overallScore * 2.51} 251`}
                                className={currentSeo.overallScore >= 70 ? "text-green-500" : currentSeo.overallScore >= 40 ? "text-amber-500" : "text-red-500"}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl font-bold">{currentSeo.overallScore}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Titles</span>
                            <span className={currentSeo.breakdown.titleScore >= 70 ? "text-green-400" : "text-amber-400"}>{currentSeo.breakdown.titleScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Meta</span>
                            <span className={currentSeo.breakdown.metaScore >= 70 ? "text-green-400" : "text-amber-400"}>{currentSeo.breakdown.metaScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Keywords</span>
                            <span className={currentSeo.breakdown.keywordScore >= 70 ? "text-green-400" : "text-amber-400"}>{currentSeo.breakdown.keywordScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Social</span>
                            <span className={currentSeo.breakdown.socialScore >= 70 ? "text-green-400" : "text-amber-400"}>{currentSeo.breakdown.socialScore}%</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10 text-xs text-muted-foreground">
                          {currentSeo.optimizedPages}/{currentSeo.totalPages} pages optimized
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground text-sm py-4">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        No SEO data available
                      </div>
                    )}
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">Visitor Locations</h3>
                      <span className="text-xs text-muted-foreground ml-auto">Last 30 days</span>
                    </div>
                    {currentGeo && currentGeo.countries.length > 0 ? (
                      <div className="space-y-3">
                        {currentGeo.countries.slice(0, 6).map((country, i) => {
                          const maxViews = currentGeo.countries[0]?.views || 1;
                          const percentage = Math.round((country.views / maxViews) * 100);
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  {country.country}
                                </span>
                                <span className="font-medium">{country.views} views</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        <Globe className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        No geographic data yet. Visitor locations will appear as traffic comes in.
                      </div>
                    )}
                  </GlassCard>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-gold-400" />
                      <h3 className="font-semibold">Top Cities</h3>
                    </div>
                    {currentGeo && currentGeo.cities.length > 0 ? (
                      <div className="space-y-2">
                        {currentGeo.cities.slice(0, 8).map((city, i) => (
                          <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                            <span className="text-muted-foreground">
                              {city.city}, {city.country}
                            </span>
                            <span className="font-medium">{city.views}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        No city data yet
                      </div>
                    )}
                    {currentGeo && (
                      <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-xs text-muted-foreground">
                        <span>With location: {currentGeo.totalWithLocation}</span>
                        <span>Unknown: {currentGeo.totalWithoutLocation}</span>
                      </div>
                    )}
                  </GlassCard>
                </div>

                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gold-400" />
                    <h3 className="font-semibold">Hourly Traffic Pattern</h3>
                  </div>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData}>
                        <XAxis 
                          dataKey="hour" 
                          stroke="#666" 
                          fontSize={10}
                          interval={2}
                        />
                        <YAxis stroke="#666" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="views" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No analytics data available
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
