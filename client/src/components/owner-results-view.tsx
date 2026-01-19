import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, Eye, Globe, Target, ChevronUp, ChevronDown, 
  Minus, BarChart3, MapPin, Activity
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topPages: { path: string; views: number }[];
  topReferrers: { source: string; visits: number }[];
  deviceBreakdown: { device: string; count: number }[];
  hourlyTraffic: { hour: number; views: number }[];
  dailyTraffic: { date: string; views: number; visitors: number }[];
}

interface GeoData {
  countries: { country: string; views: number; visitors: number }[];
  cities: { city: string; country: string; views: number }[];
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

const TENANT_CONFIG = {
  npp: { name: "Nashville Painting Pros", color: "#D4AF37", icon: "🎨" },
  lumepaint: { name: "Lume Paint Co", color: "#9CA3AF", icon: "✨" },
  demo: { name: "PaintPros.io", color: "#3B82F6", icon: "🏪" },
};

const CHART_COLORS = ["#D4AF37", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"];

export function OwnerResultsView() {
  const [activeTenant, setActiveTenant] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("analytics_tenant") || "npp";
    }
    return "npp";
  });

  useEffect(() => {
    sessionStorage.setItem("analytics_tenant", activeTenant);
  }, [activeTenant]);

  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/stats", activeTenant],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/stats?tenantId=${activeTenant}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: geoData } = useQuery<GeoData>({
    queryKey: ["/api/analytics/geography", activeTenant],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/geography?tenantId=${activeTenant}`);
      if (!res.ok) throw new Error("Failed to fetch geo data");
      return res.json();
    },
    refetchInterval: 60000,
  });

  const { data: seoData } = useQuery<SeoPerformance>({
    queryKey: ["/api/seo/performance", activeTenant],
    queryFn: async () => {
      const res = await fetch(`/api/seo/performance?tenantId=${activeTenant}`);
      if (!res.ok) throw new Error("Failed to fetch SEO data");
      return res.json();
    },
  });

  const currentConfig = TENANT_CONFIG[activeTenant as keyof typeof TENANT_CONFIG];

  const weeklyData = analyticsData?.dailyTraffic?.slice(-7) || [];
  const previousWeekViews = analyticsData?.dailyTraffic?.slice(-14, -7).reduce((sum, d) => sum + d.views, 0) || 0;
  const currentWeekViews = weeklyData.reduce((sum, d) => sum + d.views, 0);
  const weeklyChange = previousWeekViews > 0 
    ? Math.round(((currentWeekViews - previousWeekViews) / previousWeekViews) * 100) 
    : 0;

  const deviceData = analyticsData?.deviceBreakdown?.map((d, i) => ({
    name: d.device,
    value: d.count,
    fill: CHART_COLORS[i % CHART_COLORS.length]
  })) || [];

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-500", bg: "bg-green-500/20" };
    if (score >= 60) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500/20" };
    if (score >= 40) return { label: "Needs Work", color: "text-amber-500", bg: "bg-amber-500/20" };
    return { label: "Critical", color: "text-red-500", bg: "bg-red-500/20" };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Performance</h2>
          <p className="text-muted-foreground">How your websites are doing</p>
        </div>
        <Tabs value={activeTenant} onValueChange={setActiveTenant}>
          <TabsList className="bg-black/40">
            {Object.entries(TENANT_CONFIG).map(([id, config]) => (
              <TabsTrigger 
                key={id} 
                value={id}
                className="data-[state=active]:bg-gold-400/20"
                data-testid={`tab-${id}`}
              >
                <span className="mr-1">{config.icon}</span>
                <span className="hidden sm:inline">{config.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visitors</p>
                <p className="text-3xl font-bold">{analyticsData?.uniqueVisitors?.toLocaleString() || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-gold-400/20">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              {weeklyChange > 0 ? (
                <><ChevronUp className="w-4 h-4 text-green-500" /><span className="text-green-500">+{weeklyChange}%</span></>
              ) : weeklyChange < 0 ? (
                <><ChevronDown className="w-4 h-4 text-red-500" /><span className="text-red-500">{weeklyChange}%</span></>
              ) : (
                <><Minus className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">No change</span></>
              )}
              <span className="text-muted-foreground">vs last week</span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-3xl font-bold">{analyticsData?.totalViews?.toLocaleString() || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {analyticsData?.averageTimeOnSite 
                ? `Avg ${Math.round(analyticsData.averageTimeOnSite / 60)}m ${analyticsData.averageTimeOnSite % 60}s on site`
                : "Tracking active"}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SEO Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(seoData?.overallScore || 0)}`}>
                  {seoData?.overallScore || 0}/100
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getScoreStatus(seoData?.overallScore || 0).bg} ${getScoreStatus(seoData?.overallScore || 0).color}`}>
                {getScoreStatus(seoData?.overallScore || 0).label}
              </span>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Location</p>
                <p className="text-xl font-bold truncate">
                  {geoData?.cities?.[0]?.city || geoData?.countries?.[0]?.country || "—"}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <MapPin className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {geoData?.countries?.length || 0} countries reached
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gold-400" />
              <h3 className="font-semibold">Weekly Traffic</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888" 
                    fontSize={12}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return d.toLocaleDateString('en-US', { weekday: 'short' });
                    }}
                  />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke={currentConfig.color} 
                    fillOpacity={1} 
                    fill="url(#colorViews)"
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#3B82F6" 
                    fillOpacity={0.3} 
                    fill="#3B82F6"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentConfig.color }} />
                <span className="text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Visitors</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-gold-400" />
              <h3 className="font-semibold">Devices</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {deviceData.map((device, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: device.fill }} />
                  <span className="text-muted-foreground">{device.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gold-400" />
              <h3 className="font-semibold">Popular Pages</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.topPages?.slice(0, 5) || []} layout="vertical">
                  <XAxis type="number" stroke="#888" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="path" 
                    stroke="#888" 
                    fontSize={11}
                    width={100}
                    tickFormatter={(val) => val.length > 15 ? val.slice(0, 15) + '...' : val}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="views" fill={currentConfig.color} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gold-400" />
              <h3 className="font-semibold">Visitor Locations</h3>
            </div>
            <div className="space-y-3">
              {geoData?.countries?.slice(0, 5).map((country, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                    <span className="text-sm">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 rounded-full bg-gold-400/30"
                      style={{ 
                        width: `${Math.min(100, (country.views / (geoData?.countries?.[0]?.views || 1)) * 100)}px`
                      }}
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: '100%',
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {country.views}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-8">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No location data yet</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {seoData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gold-400" />
              <h3 className="font-semibold">SEO Health</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: "Titles", score: seoData.breakdown.titleScore },
                { label: "Meta Descriptions", score: seoData.breakdown.metaScore },
                { label: "Keywords", score: seoData.breakdown.keywordScore },
                { label: "Structured Data", score: seoData.breakdown.structuredDataScore },
                { label: "Social Tags", score: seoData.breakdown.socialScore },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-white/10"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={`${item.score * 1.76} 176`}
                        className={item.score >= 70 ? "text-green-500" : item.score >= 40 ? "text-amber-500" : "text-red-500"}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{item.score}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            {seoData.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-2">Quick wins to improve your score:</p>
                <ul className="text-sm space-y-1">
                  {seoData.recommendations.slice(0, 3).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold-400">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
