import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Settings,
  DollarSign,
  Play,
  Pause,
  Check,
  Facebook,
  Instagram,
  ImageIcon,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
  Loader2,
  Plus,
  Trash2,
  Upload,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Users,
  Target,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  PieChart,
  Activity,
  Sparkles
} from "lucide-react";

interface ContentItem {
  id: string;
  type: 'image' | 'message';
  content: string;
  category: string;
  isActive: boolean;
}

interface MetaStatus {
  connected: boolean;
  facebookPageName?: string;
  instagramUsername?: string;
  tokenExpiresAt?: string;
}

export default function AutopilotDashboard() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Settings state
  const [settings, setSettings] = useState({
    postsPerDay: 3,
    adsPerDay: 2,
    dailyBudget: 50,
    includeAds: true,
    isActive: true
  });

  // Budget calculator state
  const [budgetCalc, setBudgetCalc] = useState({
    monthlyBudget: 1000,
    facebookPercent: 60,
    instagramPercent: 40
  });

  // Content library state
  const [messages, setMessages] = useState<ContentItem[]>([
    { id: '1', type: 'message', content: 'Quality work you can trust. Get your free estimate today!', category: 'promotional', isActive: true },
    { id: '2', type: 'message', content: 'Did you know? A fresh coat of paint can increase your home value by up to 5%!', category: 'educational', isActive: true },
    { id: '3', type: 'message', content: 'Another satisfied customer! Thank you for trusting us with your project.', category: 'testimonial', isActive: true }
  ]);

  const [images, setImages] = useState<ContentItem[]>([
    { id: '1', type: 'image', content: '/placeholder-before-after.jpg', category: 'before-after', isActive: true },
    { id: '2', type: 'image', content: '/placeholder-project.jpg', category: 'project', isActive: true }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [newMessageCategory, setNewMessageCategory] = useState('promotional');

  // Get subscriber ID from URL
  const params = new URLSearchParams(window.location.search);
  const subscriberId = params.get('id');

  // Fetch Meta connection status including token expiration
  const { data: metaStatus } = useQuery<MetaStatus>({
    queryKey: ["/api/meta/status", subscriberId],
    enabled: !!subscriberId
  });

  // Calculate token expiration status
  const getTokenExpirationStatus = () => {
    if (!metaStatus?.tokenExpiresAt) return null;
    const expiresAt = new Date(metaStatus.tokenExpiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
      return { status: 'expired', daysUntilExpiry, message: 'Token expired! Reconnect required.' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'critical', daysUntilExpiry, message: `Token expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}!` };
    } else if (daysUntilExpiry <= 14) {
      return { status: 'warning', daysUntilExpiry, message: `Token expires in ${daysUntilExpiry} days` };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'info', daysUntilExpiry, message: `Token valid for ${daysUntilExpiry} days` };
    }
    return { status: 'ok', daysUntilExpiry, message: `Token valid until ${expiresAt.toLocaleDateString()}` };
  };
  
  const tokenStatus = getTokenExpirationStatus();

  // Mock analytics data (would come from API in production)
  const analytics = {
    thisWeek: {
      posts: 21,
      reach: 12450,
      engagement: 847,
      clicks: 234,
      adsSpent: 245.50,
      leads: 12
    },
    lastWeek: {
      posts: 21,
      reach: 10200,
      engagement: 712,
      clicks: 198,
      adsSpent: 245.50,
      leads: 9
    },
    byPlatform: {
      facebook: { reach: 7800, engagement: 512, spent: 147.30 },
      instagram: { reach: 4650, engagement: 335, spent: 98.20 }
    },
    topPosts: [
      { id: '1', message: 'Check out this amazing transformation!', reach: 2340, engagement: 156, platform: 'facebook' },
      { id: '2', message: 'Before and after - what a difference!', reach: 1890, engagement: 142, platform: 'instagram' },
      { id: '3', message: 'Quality craftsmanship on display', reach: 1560, engagement: 98, platform: 'facebook' }
    ]
  };

  // Calculate budget breakdown
  const fbBudget = (budgetCalc.monthlyBudget * budgetCalc.facebookPercent) / 100;
  const igBudget = (budgetCalc.monthlyBudget * budgetCalc.instagramPercent) / 100;
  const dailyTotal = budgetCalc.monthlyBudget / 30;
  const estimatedReach = Math.round(budgetCalc.monthlyBudget * 15); // ~$15 per 1000 reach
  const estimatedClicks = Math.round(budgetCalc.monthlyBudget * 0.8); // ~$1.25 per click
  const estimatedLeads = Math.round(budgetCalc.monthlyBudget * 0.04); // ~$25 per lead

  // Calculate percent changes
  const reachChange = ((analytics.thisWeek.reach - analytics.lastWeek.reach) / analytics.lastWeek.reach * 100).toFixed(1);
  const engagementChange = ((analytics.thisWeek.engagement - analytics.lastWeek.engagement) / analytics.lastWeek.engagement * 100).toFixed(1);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      return apiRequest("PATCH", `/api/marketing-autopilot/${subscriberId}/settings`, newSettings);
    },
    onSuccess: () => {
      toast({ title: "Settings saved!" });
    }
  });

  // Toggle autopilot mutation
  const toggleAutopilotMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      const endpoint = isActive ? 'start' : 'pause';
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/${endpoint}`);
    },
    onSuccess: (_, isActive) => {
      setSettings(prev => ({ ...prev, isActive }));
      toast({ title: isActive ? "Autopilot activated!" : "Autopilot paused" });
    }
  });

  const addMessage = () => {
    if (!newMessage.trim()) return;
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: 'message',
      content: newMessage,
      category: newMessageCategory,
      isActive: true
    };
    setMessages([...messages, newItem]);
    setNewMessage('');
    toast({ title: "Message added to your content library" });
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    toast({ title: "Message removed" });
  };

  const toggleMessageActive = (id: string) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file, i) => {
      const newImage: ContentItem = {
        id: Date.now().toString() + i,
        type: 'image',
        content: URL.createObjectURL(file),
        category: 'project',
        isActive: true
      };
      setImages(prev => [...prev, newImage]);
    });
    
    toast({ title: `${files.length} image(s) added` });
  };

  const categoryColors: Record<string, string> = {
    promotional: 'bg-blue-500/20 text-blue-400',
    educational: 'bg-green-500/20 text-green-400',
    testimonial: 'bg-yellow-500/20 text-yellow-400',
    'behind-scenes': 'bg-purple-500/20 text-purple-400',
    'before-after': 'bg-pink-500/20 text-pink-400',
    project: 'bg-orange-500/20 text-orange-400'
  };

  if (!subscriberId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Dashboard Access Required</h2>
            <p className="text-slate-400">Please access this page from your account email link.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">TrustLayer Marketing Dashboard</h1>
              <p className="text-slate-400 text-sm">Your automated social media command center</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={settings.isActive 
                ? "bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2" 
                : "bg-slate-700 text-slate-400 px-4 py-2"
              }>
                {settings.isActive ? (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Autopilot Active
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Paused
                  </>
                )}
              </Badge>
              <Button
                variant={settings.isActive ? "outline" : "default"}
                onClick={() => toggleAutopilotMutation.mutate(!settings.isActive)}
                disabled={toggleAutopilotMutation.isPending}
                data-testid="button-toggle-autopilot"
              >
                {toggleAutopilotMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : settings.isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Connected Accounts */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-500" />
                  <span className="text-white">{metaStatus?.facebookPageName || 'Facebook Page'}</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  <span className="text-white">{metaStatus?.instagramUsername ? `@${metaStatus.instagramUsername}` : 'Instagram'}</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                {/* Token Expiration Warning */}
                {tokenStatus && (
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    tokenStatus.status === 'expired' ? 'bg-red-500/20 text-red-400' :
                    tokenStatus.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                    tokenStatus.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    tokenStatus.status === 'info' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {tokenStatus.status === 'expired' || tokenStatus.status === 'critical' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : tokenStatus.status === 'warning' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    <span>{tokenStatus.message}</span>
                  </div>
                )}
              </div>
              <Button 
                variant={tokenStatus?.status === 'expired' || tokenStatus?.status === 'critical' ? 'destructive' : 'ghost'} 
                size="sm" 
                onClick={() => window.location.href = `/autopilot/portal?id=${subscriberId}`}
                data-testid="button-manage-connection"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {tokenStatus?.status === 'expired' ? 'Reconnect Now' : 
                 tokenStatus?.status === 'critical' ? 'Renew Token' : 
                 'Manage Connection'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-blue-500/20">
              <Calculator className="w-4 h-4 mr-2" />
              Budget Calculator
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500/20">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-500/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-blue-500/20">
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Main Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Reach</p>
                      <p className="text-3xl font-bold text-white">{analytics.thisWeek.reach.toLocaleString()}</p>
                      <div className={`flex items-center text-sm mt-1 ${Number(reachChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(reachChange) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(Number(reachChange))}% from last week</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Engagement</p>
                      <p className="text-3xl font-bold text-white">{analytics.thisWeek.engagement.toLocaleString()}</p>
                      <div className={`flex items-center text-sm mt-1 ${Number(engagementChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(engagementChange) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(Number(engagementChange))}% from last week</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Link Clicks</p>
                      <p className="text-3xl font-bold text-white">{analytics.thisWeek.clicks}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        ${(analytics.thisWeek.adsSpent / analytics.thisWeek.clicks).toFixed(2)} per click
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <MousePointer className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Leads Generated</p>
                      <p className="text-3xl font-bold text-white">{analytics.thisWeek.leads}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        ${(analytics.thisWeek.adsSpent / analytics.thisWeek.leads).toFixed(2)} per lead
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    Performance by Platform
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Facebook */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Facebook className="w-5 h-5 text-blue-500" />
                        <span className="text-white font-medium">Facebook</span>
                      </div>
                      <span className="text-slate-400">${analytics.byPlatform.facebook.spent.toFixed(2)} spent</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Reach</p>
                        <p className="text-white font-bold">{analytics.byPlatform.facebook.reach.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Engagement</p>
                        <p className="text-white font-bold">{analytics.byPlatform.facebook.engagement}</p>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <span className="text-white font-medium">Instagram</span>
                      </div>
                      <span className="text-slate-400">${analytics.byPlatform.instagram.spent.toFixed(2)} spent</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Reach</p>
                        <p className="text-white font-bold">{analytics.byPlatform.instagram.reach.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <p className="text-slate-400 text-xs">Engagement</p>
                        <p className="text-white font-bold">{analytics.byPlatform.instagram.engagement}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Posts */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Top Performing Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analytics.topPosts.map((post, i) => (
                    <div key={post.id} className="flex items-start gap-4 p-3 bg-slate-900/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{post.message}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                          {post.platform === 'facebook' ? (
                            <Facebook className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Instagram className="w-3 h-3 text-pink-500" />
                          )}
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {post.reach.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {post.engagement}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Ad Spend Summary */}
            <Card className="bg-gradient-to-r from-slate-800/50 to-blue-900/20 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold mb-1">This Week's Ad Spend</h3>
                    <p className="text-3xl font-bold text-white">${analytics.thisWeek.adsSpent.toFixed(2)}</p>
                    <p className="text-slate-400 text-sm">of ${(settings.dailyBudget * 7).toFixed(2)} weekly budget</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-slate-400 text-sm">Posts Published</p>
                        <p className="text-2xl font-bold text-white">{analytics.thisWeek.posts}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Ads Running</p>
                        <p className="text-2xl font-bold text-green-400">3</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Progress value={(analytics.thisWeek.adsSpent / (settings.dailyBudget * 7)) * 100} className="mt-4" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-400" />
                  Ad Budget Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Monthly Budget Input */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-300 text-lg">Monthly Ad Budget</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">$</span>
                      <Input
                        type="number"
                        value={budgetCalc.monthlyBudget}
                        onChange={(e) => setBudgetCalc({ ...budgetCalc, monthlyBudget: Number(e.target.value) })}
                        className="w-32 bg-slate-900 border-slate-700 text-2xl font-bold text-white text-center"
                        data-testid="input-monthly-budget"
                      />
                    </div>
                  </div>
                  <Slider
                    value={[budgetCalc.monthlyBudget]}
                    onValueChange={([value]) => setBudgetCalc({ ...budgetCalc, monthlyBudget: value })}
                    min={100}
                    max={5000}
                    step={50}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$100</span>
                    <span>$5,000</span>
                  </div>
                </div>

                {/* Platform Split */}
                <div className="bg-slate-900/50 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Platform Distribution</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-5 h-5 text-blue-500" />
                          <span className="text-white">Facebook</span>
                        </div>
                        <span className="text-white font-bold">{budgetCalc.facebookPercent}% (${fbBudget.toFixed(0)}/mo)</span>
                      </div>
                      <Slider
                        value={[budgetCalc.facebookPercent]}
                        onValueChange={([value]) => setBudgetCalc({ 
                          ...budgetCalc, 
                          facebookPercent: value,
                          instagramPercent: 100 - value
                        })}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Instagram className="w-5 h-5 text-pink-500" />
                          <span className="text-white">Instagram</span>
                        </div>
                        <span className="text-white font-bold">{budgetCalc.instagramPercent}% (${igBudget.toFixed(0)}/mo)</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                          style={{ width: `${budgetCalc.instagramPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projections */}
                <div>
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Estimated Results
                  </h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Daily Spend</p>
                      <p className="text-2xl font-bold text-white">${dailyTotal.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Est. Monthly Reach</p>
                      <p className="text-2xl font-bold text-blue-400">{estimatedReach.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Est. Link Clicks</p>
                      <p className="text-2xl font-bold text-green-400">{estimatedClicks}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-center">
                      <p className="text-slate-400 text-sm mb-1">Est. Leads</p>
                      <p className="text-2xl font-bold text-yellow-400">{estimatedLeads}</p>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                  <h4 className="text-white font-medium mb-4">Total Monthly Investment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Autopilot Service Fee</span>
                      <span className="text-white">$59.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Facebook Ad Spend</span>
                      <span className="text-white">${fbBudget.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Instagram Ad Spend</span>
                      <span className="text-white">${igBudget.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                      <span className="text-white font-medium text-lg">Total</span>
                      <span className="text-3xl font-bold text-green-400">${(59 + budgetCalc.monthlyBudget).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Cost Per Lead (estimated)</span>
                      <span className="text-white font-medium">${((59 + budgetCalc.monthlyBudget) / estimatedLeads).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setSettings({ ...settings, dailyBudget: Math.round(dailyTotal) });
                    setActiveTab('settings');
                    toast({ title: "Budget applied to settings!" });
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="button-apply-budget"
                >
                  Apply This Budget
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Posting Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Posts Per Day */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-300">Posts Per Day</Label>
                    <span className="text-2xl font-bold text-white">{settings.postsPerDay}</span>
                  </div>
                  <Slider
                    value={[settings.postsPerDay]}
                    onValueChange={([value]) => setSettings({ ...settings, postsPerDay: value })}
                    min={1}
                    max={6}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>1 post</span>
                    <span>6 posts</span>
                  </div>
                </div>

                {/* Ads Per Day */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-300">Ads Per Day (boosted posts)</Label>
                    <span className="text-2xl font-bold text-white">{settings.adsPerDay}</span>
                  </div>
                  <Slider
                    value={[settings.adsPerDay]}
                    onValueChange={([value]) => setSettings({ ...settings, adsPerDay: value })}
                    min={0}
                    max={4}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>0 (organic only)</span>
                    <span>4 ads</span>
                  </div>
                </div>

                {/* Daily Budget */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-300">Daily Ad Budget</Label>
                    <span className="text-2xl font-bold text-white">${settings.dailyBudget}</span>
                  </div>
                  <Slider
                    value={[settings.dailyBudget]}
                    onValueChange={([value]) => setSettings({ ...settings, dailyBudget: value })}
                    min={0}
                    max={200}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$0 (organic only)</span>
                    <span>$200/day</span>
                  </div>
                </div>

                {/* Include Paid Ads */}
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Include Paid Ads</p>
                    <p className="text-slate-400 text-sm">Boost top-performing posts automatically</p>
                  </div>
                  <Switch
                    checked={settings.includeAds}
                    onCheckedChange={(checked) => setSettings({ ...settings, includeAds: checked })}
                    data-testid="switch-include-ads"
                  />
                </div>

                {/* Monthly Summary */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Monthly Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Autopilot Service</span>
                      <span className="text-white">$59/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ad Spend (${settings.dailyBudget} x 30)</span>
                      <span className="text-white">${settings.dailyBudget * 30}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Posts</span>
                      <span className="text-white">~{settings.postsPerDay * 30}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Boosted</span>
                      <span className="text-white">~{settings.adsPerDay * 30}/mo</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 flex justify-between">
                      <span className="text-white font-medium">Total Investment</span>
                      <span className="text-green-400 font-bold">${59 + (settings.dailyBudget * 30)}/mo</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => saveSettingsMutation.mutate(settings)}
                  disabled={saveSettingsMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="button-save-settings"
                >
                  {saveSettingsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Your Messaging Library
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Message */}
                <div className="bg-slate-900/50 rounded-lg p-4 space-y-4">
                  <h4 className="text-white font-medium">Add New Message</h4>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Enter your marketing message..."
                    className="bg-slate-800 border-slate-700 min-h-[100px]"
                    data-testid="textarea-new-message"
                  />
                  <div className="flex items-center gap-4">
                    <select
                      value={newMessageCategory}
                      onChange={(e) => setNewMessageCategory(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="promotional">Promotional</option>
                      <option value="educational">Educational</option>
                      <option value="testimonial">Testimonial</option>
                      <option value="behind-scenes">Behind the Scenes</option>
                    </select>
                    <Button onClick={addMessage} data-testid="button-add-message">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Message
                    </Button>
                  </div>
                </div>

                {/* Message List */}
                <div className="space-y-3">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border transition-all ${
                        message.isActive 
                          ? 'bg-slate-900/50 border-slate-700' 
                          : 'bg-slate-900/20 border-slate-800 opacity-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-white mb-2">{message.content}</p>
                          <Badge className={categoryColors[message.category] || 'bg-slate-700'}>
                            {message.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={message.isActive}
                            onCheckedChange={() => toggleMessageActive(message.id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMessage(message.id)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-slate-500 text-sm text-center">
                  Active messages will be rotated in your automated posts
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  Your Image Library
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">Upload Images</p>
                  <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
                  <p className="text-slate-500 text-xs mt-2">JPG, PNG up to 10MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map(image => (
                    <div
                      key={image.id}
                      className={`relative rounded-lg overflow-hidden group ${
                        !image.isActive && 'opacity-50'
                      }`}
                    >
                      <img
                        src={image.content}
                        alt="Content"
                        className="w-full h-32 object-cover bg-slate-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setImages(images.map(i => 
                              i.id === image.id ? { ...i, isActive: !i.isActive } : i
                            ));
                          }}
                          className="bg-slate-800/50"
                        >
                          {image.isActive ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setImages(images.filter(i => i.id !== image.id))}
                          className="bg-slate-800/50 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Badge className={`absolute bottom-2 left-2 ${categoryColors[image.category] || 'bg-slate-700'}`}>
                        {image.category}
                      </Badge>
                    </div>
                  ))}
                </div>

                <p className="text-slate-500 text-sm text-center">
                  Active images will be paired with your messages for posts
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
