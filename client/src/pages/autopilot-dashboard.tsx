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
  RefreshCw
} from "lucide-react";

interface DashboardData {
  subscriber: {
    id: string;
    businessName: string;
    isActive: boolean;
    facebookPageName?: string;
    instagramUsername?: string;
    dailyBudget: number;
    postsPerDay: number;
  };
  stats: {
    totalPosts: number;
    totalReach: number;
    totalEngagement: number;
    adsRunning: number;
  };
  recentPosts: {
    id: string;
    platform: string;
    message: string;
    postedAt: string;
    reach: number;
    engagement: number;
  }[];
}

interface ContentItem {
  id: string;
  type: 'image' | 'message';
  content: string;
  category: string;
  isActive: boolean;
}

export default function AutopilotDashboard() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Settings state
  const [settings, setSettings] = useState({
    postsPerDay: 3,
    dailyBudget: 30,
    includeAds: true,
    isActive: true
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
    
    // In production, upload to server. For now, create placeholder
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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Marketing Autopilot</h1>
              <p className="text-slate-400 text-sm">Manage your automated social media</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={settings.isActive 
                ? "bg-green-500/20 text-green-400 border-green-500/30" 
                : "bg-slate-700 text-slate-400"
              }>
                {settings.isActive ? (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 mr-1" />
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Connected Accounts */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Facebook className="w-5 h-5 text-blue-500" />
                <span className="text-white">Facebook Page Connected</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span className="text-white">Instagram Connected</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-slate-400 text-sm">Posts This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">4.2K</p>
                      <p className="text-slate-400 text-sm">Total Reach</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">312</p>
                      <p className="text-slate-400 text-sm">Engagements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">3</p>
                      <p className="text-slate-400 text-sm">Ads Running</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                      <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                        {i % 2 === 0 ? (
                          <Instagram className="w-6 h-6 text-pink-400" />
                        ) : (
                          <Facebook className="w-6 h-6 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white mb-1">Quality work you can trust! Check out our latest project...</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> 342 reach
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> 28 likes
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" /> 4 shares
                          </span>
                        </div>
                      </div>
                      <span className="text-slate-500 text-sm">2h ago</span>
                    </div>
                  ))}
                </div>
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
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>$0 (organic only)</span>
                    <span>$100/day</span>
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
                      <span className="text-slate-400">Ad Spend ({settings.dailyBudget} x 30)</span>
                      <span className="text-white">${settings.dailyBudget * 30}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Posts</span>
                      <span className="text-white">~{settings.postsPerDay * 30}/mo</span>
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
