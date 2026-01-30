import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  Settings,
  Play,
  Pause,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Facebook,
  Instagram,
  Clock,
  TrendingUp,
  Target,
  Loader2,
  RefreshCw,
  ChevronRight,
  Wand2,
  Copy,
  Eye
} from "lucide-react";
import { useLocation } from "wouter";

interface ContentItem {
  id: string;
  type: 'image' | 'caption';
  content: string;
  caption?: string;
  category: string;
  isCustom: boolean;
  selected: boolean;
}

interface PostingPreferences {
  postsPerDay: number;
  postingTimes: string[];
  includeAds: boolean;
  adBudgetDaily: number;
  platforms: {
    facebook: boolean;
    instagram: boolean;
  };
  contentMix: {
    promotional: number;
    educational: number;
    behindScenes: number;
  };
}

const PRE_MADE_IMAGES = [
  { id: "img1", url: "/images/painting-before-after-1.jpg", category: "Before/After", caption: "Transform your space with professional painting services" },
  { id: "img2", url: "/images/painting-team.jpg", category: "Team", caption: "Our experienced crew bringing color to life" },
  { id: "img3", url: "/images/color-consultation.jpg", category: "Services", caption: "Free color consultation with every project" },
  { id: "img4", url: "/images/exterior-painting.jpg", category: "Exterior", caption: "Boost your curb appeal with a fresh coat" },
  { id: "img5", url: "/images/interior-modern.jpg", category: "Interior", caption: "Modern interiors that inspire" },
  { id: "img6", url: "/images/cabinet-refinish.jpg", category: "Specialty", caption: "Cabinet refinishing at a fraction of replacement cost" },
];

const PRE_MADE_CAPTIONS = [
  { id: "cap1", category: "Promotional", text: "Ready to transform your home? Get a free estimate today! Link in bio." },
  { id: "cap2", category: "Promotional", text: "Spring special: 15% off exterior painting. Book now before spots fill up!" },
  { id: "cap3", category: "Educational", text: "Did you know? Quality paint can last 10+ years with proper prep. We never skip the prep work." },
  { id: "cap4", category: "Educational", text: "Choosing the right finish matters. Flat for ceilings, eggshell for walls, semi-gloss for trim." },
  { id: "cap5", category: "Behind the Scenes", text: "Early morning starts mean we finish on time. Our crew takes pride in every detail." },
  { id: "cap6", category: "Behind the Scenes", text: "Just wrapped up another happy customer! Swipe to see the transformation." },
  { id: "cap7", category: "Testimonial", text: "\"Best painting experience we've ever had!\" - Another 5-star review from a satisfied customer" },
  { id: "cap8", category: "Seasonal", text: "Fall is the perfect time for interior projects. What room needs a refresh?" },
];

export default function AutopilotPortal() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("content");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedCaptions, setSelectedCaptions] = useState<string[]>([]);
  const [customImages, setCustomImages] = useState<{ id: string; url: string; caption: string }[]>([]);
  const [customCaptions, setCustomCaptions] = useState<{ id: string; text: string }[]>([]);
  const [newCaption, setNewCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preferences, setPreferences] = useState<PostingPreferences>({
    postsPerDay: 3,
    postingTimes: ["9:00 AM", "1:00 PM", "6:00 PM"],
    includeAds: false,
    adBudgetDaily: 10,
    platforms: { facebook: true, instagram: true },
    contentMix: { promotional: 30, educational: 40, behindScenes: 30 }
  });
  const [isAutopilotActive, setIsAutopilotActive] = useState(false);

  // Get subscriber ID from URL or session
  const subscriberId = new URLSearchParams(window.location.search).get('id');

  // Fetch subscriber data
  const { data: subscriber, isLoading } = useQuery({
    queryKey: ["/api/marketing-autopilot/subscriber", subscriberId],
    enabled: !!subscriberId
  });

  const toggleImage = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleCaption = (captionId: string) => {
    setSelectedCaptions(prev => 
      prev.includes(captionId) 
        ? prev.filter(id => id !== captionId)
        : [...prev, captionId]
    );
  };

  const addCustomCaption = () => {
    if (newCaption.trim()) {
      const id = `custom-${Date.now()}`;
      setCustomCaptions(prev => [...prev, { id, text: newCaption.trim() }]);
      setSelectedCaptions(prev => [...prev, id]);
      setNewCaption("");
      toast({ title: "Caption added to your library" });
    }
  };

  const generateCaptions = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/marketing-autopilot/generate-captions", {
        businessType: "painting",
        count: 5
      });
      const generated = await response.json();
      if (generated.captions) {
        const newCaptions = generated.captions.map((text: string, i: number) => ({
          id: `gen-${Date.now()}-${i}`,
          text
        }));
        setCustomCaptions(prev => [...prev, ...newCaptions]);
        toast({ title: "Generated 5 new captions for you!" });
      }
    } catch (error) {
      toast({ title: "Generation temporarily unavailable", variant: "destructive" });
    }
    setIsGenerating(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setCustomImages(prev => [...prev, {
          id,
          url: reader.result as string,
          caption: ""
        }]);
        setSelectedImages(prev => [...prev, id]);
      };
      reader.readAsDataURL(file);
    }
    toast({ title: `${files.length} image(s) uploaded` });
  };

  const savePreferences = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/preferences`, {
        selectedImages,
        selectedCaptions,
        customImages,
        customCaptions,
        preferences
      });
    },
    onSuccess: () => {
      toast({ title: "Preferences saved" });
    }
  });

  const activateAutopilot = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/start`, {
        selectedImages,
        selectedCaptions,
        customImages,
        customCaptions,
        preferences
      });
    },
    onSuccess: () => {
      setIsAutopilotActive(true);
      toast({ title: "Autopilot activated! Your posts will start publishing automatically." });
    }
  });

  const totalSelectedContent = selectedImages.length + selectedCaptions.length + customImages.length + customCaptions.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Marketing Autopilot</h1>
              <p className="text-slate-400 text-sm">Set up your automated social media in minutes</p>
            </div>
            <div className="flex items-center gap-4">
              {isAutopilotActive ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  <Play className="w-4 h-4 mr-2" />
                  Autopilot Active
                </Badge>
              ) : (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Setup Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { step: 1, label: "Choose Content", icon: ImageIcon },
            { step: 2, label: "Write Captions", icon: MessageSquare },
            { step: 3, label: "Set Schedule", icon: Calendar },
            { step: 4, label: "Launch", icon: Play }
          ].map((item, i) => (
            <div key={item.step} className="flex items-center">
              <div className={`flex items-center gap-3 ${
                activeTab === ["content", "captions", "schedule", "launch"][i] 
                  ? "text-blue-400" 
                  : "text-slate-500"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeTab === ["content", "captions", "schedule", "launch"][i]
                    ? "bg-blue-500/20 border border-blue-500/50"
                    : "bg-slate-800 border border-slate-700"
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium hidden md:block">{item.label}</span>
              </div>
              {i < 3 && <ChevronRight className="w-5 h-5 text-slate-600 mx-4" />}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700 grid grid-cols-4 w-full">
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-500/20">
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </TabsTrigger>
            <TabsTrigger value="captions" className="data-[state=active]:bg-blue-500/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Captions
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-500/20">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="launch" className="data-[state=active]:bg-green-500/20">
              <Play className="w-4 h-4 mr-2" />
              Launch
            </TabsTrigger>
          </TabsList>

          {/* Images Tab */}
          <TabsContent value="content" className="space-y-6">
            {/* Upload Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload Your Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-slate-400">Drop images here or click to upload</span>
                  <span className="text-slate-500 text-sm">JPG, PNG up to 10MB each</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    data-testid="input-upload-images"
                  />
                </label>

                {customImages.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                    {customImages.map(img => (
                      <div
                        key={img.id}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImages.includes(img.id)
                            ? "border-blue-500 ring-2 ring-blue-500/30"
                            : "border-transparent hover:border-slate-600"
                        }`}
                        onClick={() => toggleImage(img.id)}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {selectedImages.includes(img.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pre-made Images */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Pre-Made Content Library
                  <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-0">Pro</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-4">
                  Select from our professionally designed images - we'll mix these with your uploads
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {PRE_MADE_IMAGES.map(img => (
                    <div
                      key={img.id}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all group ${
                        selectedImages.includes(img.id)
                          ? "border-purple-500 ring-2 ring-purple-500/30"
                          : "border-transparent hover:border-slate-600"
                      }`}
                      onClick={() => toggleImage(img.id)}
                      data-testid={`image-${img.id}`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-xs">{img.category}</span>
                      </div>
                      {selectedImages.includes(img.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <div className="text-slate-400">
                {selectedImages.length} images selected
              </div>
              <Button onClick={() => setActiveTab("captions")} data-testid="button-next-captions">
                Next: Captions
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Captions Tab */}
          <TabsContent value="captions" className="space-y-6">
            {/* Write Your Own */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Write Your Own Captions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Write a caption for your posts..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white flex-1"
                    data-testid="input-new-caption"
                  />
                  <div className="flex flex-col gap-2">
                    <Button onClick={addCustomCaption} disabled={!newCaption.trim()} data-testid="button-add-caption">
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={generateCaptions}
                      disabled={isGenerating}
                      data-testid="button-generate-captions"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {customCaptions.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-slate-400">Your Captions</Label>
                    {customCaptions.map(cap => (
                      <div
                        key={cap.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedCaptions.includes(cap.id)
                            ? "bg-blue-500/20 border border-blue-500/50"
                            : "bg-slate-900 border border-slate-700 hover:border-slate-600"
                        }`}
                        onClick={() => toggleCaption(cap.id)}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-white text-sm">{cap.text}</p>
                          {selectedCaptions.includes(cap.id) && (
                            <Check className="w-4 h-4 text-blue-400 ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pre-made Captions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Pre-Written Captions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {PRE_MADE_CAPTIONS.map(cap => (
                    <div
                      key={cap.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCaptions.includes(cap.id)
                          ? "bg-purple-500/20 border border-purple-500/50"
                          : "bg-slate-900 border border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => toggleCaption(cap.id)}
                      data-testid={`caption-${cap.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className="bg-slate-700 text-slate-300 border-0 text-xs mb-2">
                            {cap.category}
                          </Badge>
                          <p className="text-white text-sm">{cap.text}</p>
                        </div>
                        {selectedCaptions.includes(cap.id) && (
                          <Check className="w-4 h-4 text-purple-400 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("content")}>
                Back
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  {selectedCaptions.length + customCaptions.length} captions selected
                </span>
                <Button onClick={() => setActiveTab("schedule")} data-testid="button-next-schedule">
                  Next: Schedule
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Posting Frequency */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Posting Frequency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Posts per day</Label>
                    <Select
                      value={preferences.postsPerDay.toString()}
                      onValueChange={(v) => setPreferences({ ...preferences, postsPerDay: parseInt(v) })}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white mt-2" data-testid="select-posts-per-day">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 post/day</SelectItem>
                        <SelectItem value="2">2 posts/day</SelectItem>
                        <SelectItem value="3">3 posts/day (Recommended)</SelectItem>
                        <SelectItem value="4">4 posts/day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Best posting times</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "8:00 PM"].map(time => (
                        <Badge
                          key={time}
                          className={`cursor-pointer ${
                            preferences.postingTimes.includes(time)
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              : "bg-slate-700 text-slate-300 border-slate-600"
                          }`}
                          onClick={() => {
                            setPreferences(prev => ({
                              ...prev,
                              postingTimes: prev.postingTimes.includes(time)
                                ? prev.postingTimes.filter(t => t !== time)
                                : [...prev.postingTimes, time]
                            }));
                          }}
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platforms */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-blue-500" />
                      <span className="text-white">Facebook</span>
                    </div>
                    <Switch
                      checked={preferences.platforms.facebook}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        platforms: { ...preferences.platforms, facebook: checked }
                      })}
                      data-testid="switch-facebook"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span className="text-white">Instagram</span>
                    </div>
                    <Switch
                      checked={preferences.platforms.instagram}
                      onCheckedChange={(checked) => setPreferences({
                        ...preferences,
                        platforms: { ...preferences.platforms, instagram: checked }
                      })}
                      data-testid="switch-instagram"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ads vs Organic */}
              <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Advertising Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg mb-4">
                    <div>
                      <p className="text-white font-medium">Include Paid Ads</p>
                      <p className="text-slate-400 text-sm">Boost your best posts to reach more customers</p>
                    </div>
                    <Switch
                      checked={preferences.includeAds}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, includeAds: checked })}
                      data-testid="switch-include-ads"
                    />
                  </div>

                  <AnimatePresence>
                    {preferences.includeAds && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-slate-300">Daily Ad Budget</Label>
                          <Select
                            value={preferences.adBudgetDaily.toString()}
                            onValueChange={(v) => setPreferences({ ...preferences, adBudgetDaily: parseInt(v) })}
                          >
                            <SelectTrigger className="bg-slate-900 border-slate-600 text-white mt-2" data-testid="select-ad-budget">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">$5/day (~$150/month)</SelectItem>
                              <SelectItem value="10">$10/day (~$300/month)</SelectItem>
                              <SelectItem value="20">$20/day (~$600/month)</SelectItem>
                              <SelectItem value="50">$50/day (~$1,500/month)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-slate-500 text-sm">
                          Ad spend is billed separately through your connected Meta account
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("captions")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("launch")} className="bg-green-600 hover:bg-green-700" data-testid="button-next-launch">
                Review & Launch
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* Launch Tab */}
          <TabsContent value="launch" className="space-y-6">
            <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-green-400" />
                  </div>
                  Ready to Launch Your Autopilot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <ImageIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Images</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{selectedImages.length + customImages.length}</p>
                    <p className="text-slate-400 text-sm">in your content library</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">Captions</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{selectedCaptions.length + customCaptions.length}</p>
                    <p className="text-slate-400 text-sm">ready to post</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Schedule</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{preferences.postsPerDay}x</p>
                    <p className="text-slate-400 text-sm">posts per day</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-medium mb-3">Your Configuration</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Platforms:</span>
                      <span className="text-white">
                        {[
                          preferences.platforms.facebook && "Facebook",
                          preferences.platforms.instagram && "Instagram"
                        ].filter(Boolean).join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Posting times:</span>
                      <span className="text-white">{preferences.postingTimes.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ads enabled:</span>
                      <span className="text-white">{preferences.includeAds ? `Yes ($${preferences.adBudgetDaily}/day)` : "No (Organic only)"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly posts:</span>
                      <span className="text-white">~{preferences.postsPerDay * 30} posts</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-14 text-lg"
                  onClick={() => activateAutopilot.mutate()}
                  disabled={activateAutopilot.isPending || totalSelectedContent < 3}
                  data-testid="button-activate-autopilot"
                >
                  {activateAutopilot.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Play className="w-5 h-5 mr-2" />
                  )}
                  Activate Autopilot
                </Button>

                {totalSelectedContent < 3 && (
                  <p className="text-center text-yellow-400 text-sm mt-3">
                    Please select at least 3 pieces of content (images + captions) to get started
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
