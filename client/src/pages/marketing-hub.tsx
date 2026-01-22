import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TenantSwitcher, useTenantFilter } from "@/components/tenant-switcher";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, Instagram, Facebook, Home, Calendar, 
  TrendingUp, Clock, CheckCircle, AlertTriangle, Edit, 
  Trash2, Plus, Copy, Lock, User, 
  Sparkles, PenTool, Palette, Building2, TreePine, DoorOpen,
  LayoutGrid, Search, ChevronLeft, ChevronRight,
  FileText, Users, BarChart3, Target
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { format, subWeeks, isAfter, startOfWeek, addDays } from "date-fns";

const DEFAULT_PIN = "Mkt2025!";

interface SocialPost {
  id: string;
  brand: "npp" | "lumepaint";
  platform: "instagram" | "facebook" | "nextdoor";
  type: "evergreen" | "seasonal";
  category: "interior" | "exterior" | "commercial" | "cabinets" | "doors" | "trim" | "decks" | "general";
  content: string;
  imageUrl?: string;
  status: "draft" | "scheduled" | "posted";
  scheduledDate?: string;
  lastUsed?: string;
  claimedBy?: string;
  createdAt: string;
}

interface CalendarDay {
  date: Date;
  posts: SocialPost[];
}

const CATEGORIES = [
  { id: "interior", label: "Interior", icon: Home },
  { id: "exterior", label: "Exterior", icon: Building2 },
  { id: "commercial", label: "Commercial", icon: Building2 },
  { id: "cabinets", label: "Cabinets", icon: LayoutGrid },
  { id: "doors", label: "Doors", icon: DoorOpen },
  { id: "trim", label: "Trim", icon: PenTool },
  { id: "decks", label: "Decks & Fences", icon: TreePine },
  { id: "general", label: "General", icon: Palette },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-800" },
  { id: "nextdoor", label: "Nextdoor", icon: Home, color: "from-green-500 to-green-700" },
];

const SAMPLE_EVERGREEN_NPP: Partial<SocialPost>[] = [
  { content: "Transforming familiar spaces into extraordinary places. Nashville Painting Professionals - quality craftsmanship, exceptional results.", category: "general", platform: "instagram" },
  { content: "Interior painting that brings your vision to life. Transforming familiar spaces into extraordinary places.", category: "interior", platform: "instagram" },
  { content: "Protect your investment with professional exterior painting. Weather-resistant finishes that last.", category: "exterior", platform: "facebook" },
  { content: "Commercial painting solutions for businesses that demand excellence. Minimal disruption, maximum impact.", category: "commercial", platform: "facebook" },
  { content: "Cabinet refinishing that saves thousands over replacement. Fresh look, fraction of the cost.", category: "cabinets", platform: "nextdoor" },
  { content: "The details matter. Professional trim and door painting for a polished finish.", category: "trim", platform: "instagram" },
  { content: "Deck staining and fence refinishing. Extend the life of your outdoor spaces.", category: "decks", platform: "nextdoor" },
  { content: "Why choose Nashville Painting Professionals? We're transforming familiar spaces into extraordinary places - one home at a time.", category: "general", platform: "facebook" },
  { content: "Before & After: See the difference professional painting makes. Free estimates available.", category: "general", platform: "instagram" },
  { content: "Your neighbors trust us. Join hundreds of satisfied Nashville homeowners.", category: "general", platform: "nextdoor" },
  { content: "Quality paint. Expert application. Transforming familiar spaces into extraordinary places.", category: "general", platform: "instagram" },
  { content: "From prep to perfection - our process ensures flawless results every time.", category: "general", platform: "facebook" },
];

const SAMPLE_EVERGREEN_LUME: Partial<SocialPost>[] = [
  { content: "We elevate the backdrop of your life. Lume Paint Co - where color meets craftsmanship.", category: "general", platform: "instagram" },
  { content: "Interior transformations that reflect your style. Elevating the backdrop of your life.", category: "interior", platform: "instagram" },
  { content: "Exterior painting with lasting beauty. Lume protects what matters most.", category: "exterior", platform: "facebook" },
  { content: "Commercial spaces deserve professional finishes. Lume delivers on time, every time.", category: "commercial", platform: "facebook" },
  { content: "Breathe new life into your kitchen. Cabinet painting by Lume - elevating the backdrop of your life.", category: "cabinets", platform: "nextdoor" },
  { content: "Precision trim work. The finishing touch your home deserves.", category: "trim", platform: "instagram" },
  { content: "Outdoor living, perfected. Deck and fence services by Lume Paint Co.", category: "decks", platform: "nextdoor" },
  { content: "Why Lume? We elevate the backdrop of your life. Free consultations available.", category: "general", platform: "facebook" },
  { content: "See the Lume difference. Stunning transformations, happy homeowners.", category: "general", platform: "instagram" },
  { content: "Trusted by your community. Lume Paint Co - elevating the backdrop of your life.", category: "general", platform: "nextdoor" },
  { content: "We elevate the backdrop of your life. Lume Paint Co - where excellence shines.", category: "general", platform: "instagram" },
  { content: "Professional painters. Premium results. Elevating the backdrop of your life.", category: "general", platform: "facebook" },
];

const SAMPLE_SEASONAL_NPP: Partial<SocialPost>[] = [
  { content: "Spring is here! Book your exterior refresh before the summer rush. Free estimates this week only.", category: "exterior", platform: "instagram" },
  { content: "New Year, New Colors! Start 2026 with a fresh interior look. 10% off January bookings.", category: "interior", platform: "facebook" },
  { content: "Summer deck season is coming! Get your deck stained now before the heat sets in.", category: "decks", platform: "nextdoor" },
  { content: "Fall painting special: Interior projects with premium paint at no extra charge.", category: "interior", platform: "instagram" },
  { content: "Holiday prep: Get your home guest-ready with a quick refresh. Booking now for December.", category: "general", platform: "facebook" },
];

const SAMPLE_SEASONAL_LUME: Partial<SocialPost>[] = [
  { content: "Spring refresh season! Lume is booking exterior projects now. Beat the summer rush.", category: "exterior", platform: "instagram" },
  { content: "New Year special: Transform your space with Lume. Complimentary color consultation in January.", category: "interior", platform: "facebook" },
  { content: "Deck season approaches! Protect your outdoor investment with Lume's expert staining.", category: "decks", platform: "nextdoor" },
  { content: "Fall interior special: Cozy up with new colors. Lume's autumn palette recommendations.", category: "interior", platform: "instagram" },
  { content: "Holiday entertaining? Lume can refresh your space before the guests arrive.", category: "general", platform: "facebook" },
];

export default function MarketingHub() {
  const tenant = useTenant();
  const { selectedTenant, setSelectedTenant } = useTenantFilter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState(DEFAULT_PIN);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<"catalog" | "calendar" | "analytics">("catalog");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicatePost, setDuplicatePost] = useState<SocialPost | null>(null);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [calendarWeekStart, setCalendarWeekStart] = useState(startOfWeek(new Date()));

  useEffect(() => {
    const savedPosts = localStorage.getItem("marketing_posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const initialPosts: SocialPost[] = [
        ...SAMPLE_EVERGREEN_NPP.map((p, i) => ({
          ...p,
          id: `npp-evergreen-${i}`,
          brand: "npp" as const,
          type: "evergreen" as const,
          status: "draft" as const,
          createdAt: new Date().toISOString(),
        })),
        ...SAMPLE_SEASONAL_NPP.map((p, i) => ({
          ...p,
          id: `npp-seasonal-${i}`,
          brand: "npp" as const,
          type: "seasonal" as const,
          status: "draft" as const,
          createdAt: new Date().toISOString(),
        })),
        ...SAMPLE_EVERGREEN_LUME.map((p, i) => ({
          ...p,
          id: `lume-evergreen-${i}`,
          brand: "lumepaint" as const,
          type: "evergreen" as const,
          status: "draft" as const,
          createdAt: new Date().toISOString(),
        })),
        ...SAMPLE_SEASONAL_LUME.map((p, i) => ({
          ...p,
          id: `lume-seasonal-${i}`,
          brand: "lumepaint" as const,
          type: "seasonal" as const,
          status: "draft" as const,
          createdAt: new Date().toISOString(),
        })),
      ] as SocialPost[];
      setPosts(initialPosts);
      localStorage.setItem("marketing_posts", JSON.stringify(initialPosts));
    }

    const savedPin = localStorage.getItem("marketing_pin");
    if (savedPin) {
      setCurrentPin(savedPin);
    }
  }, []);

  const validatePinStrength = (testPin: string): boolean => {
    const hasLower = /[a-z]/.test(testPin);
    const hasUpper = /[A-Z]/.test(testPin);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(testPin);
    const hasNumber = /[0-9]/.test(testPin);
    return hasLower && hasUpper && hasSpecial && hasNumber && testPin.length >= 6;
  };

  const handleLogin = () => {
    if (pin === currentPin) {
      setIsAuthenticated(true);
      setError("");
      if (pin === DEFAULT_PIN) {
        setShowPinChange(true);
      }
    } else {
      setError("Invalid PIN. Please try again.");
    }
  };

  const handlePinChange = (newPin: string) => {
    if (validatePinStrength(newPin)) {
      setCurrentPin(newPin);
      localStorage.setItem("marketing_pin", newPin);
      setShowPinChange(false);
    }
  };

  const savePosts = (updated: SocialPost[]) => {
    setPosts(updated);
    localStorage.setItem("marketing_posts", JSON.stringify(updated));
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (post.brand !== selectedTenant) return false;
      if (platformFilter !== "all" && post.platform !== platformFilter) return false;
      if (typeFilter !== "all" && post.type !== typeFilter) return false;
      if (categoryFilter !== "all" && post.category !== categoryFilter) return false;
      if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [posts, selectedTenant, platformFilter, typeFilter, categoryFilter, searchQuery]);

  const checkDuplicateUsage = (post: SocialPost): boolean => {
    if (!post.lastUsed) return false;
    const fourWeeksAgo = subWeeks(new Date(), 4);
    return isAfter(new Date(post.lastUsed), fourWeeksAgo);
  };

  const schedulePost = (post: SocialPost, date: string) => {
    if (checkDuplicateUsage(post)) {
      setDuplicatePost(post);
      setShowDuplicateWarning(true);
      return;
    }
    confirmSchedule(post, date);
  };

  const confirmSchedule = (post: SocialPost, date: string) => {
    const updated = posts.map(p => 
      p.id === post.id 
        ? { ...p, status: "scheduled" as const, scheduledDate: date, lastUsed: date }
        : p
    );
    savePosts(updated);
    setShowDuplicateWarning(false);
    setDuplicatePost(null);
  };

  const markAsPosted = (postId: string) => {
    const updated = posts.map(p => 
      p.id === postId ? { ...p, status: "posted" as const, lastUsed: new Date().toISOString() } : p
    );
    savePosts(updated);
  };

  const claimPost = (postId: string, userName: string) => {
    const updated = posts.map(p => 
      p.id === postId ? { ...p, claimedBy: userName } : p
    );
    savePosts(updated);
  };

  const deletePost = (postId: string) => {
    const updated = posts.filter(p => p.id !== postId);
    savePosts(updated);
  };

  const updatePost = (postId: string, updates: Partial<SocialPost>) => {
    const updated = posts.map(p => 
      p.id === postId ? { ...p, ...updates } : p
    );
    savePosts(updated);
    setEditingPost(null);
  };

  const addPost = (newPost: Partial<SocialPost>) => {
    const post: SocialPost = {
      id: `${selectedTenant}-${Date.now()}`,
      brand: selectedTenant as "npp" | "lumepaint",
      platform: newPost.platform || "instagram",
      type: newPost.type || "evergreen",
      category: newPost.category || "general",
      content: newPost.content || "",
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    savePosts([...posts, post]);
    setShowAddModal(false);
  };

  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(calendarWeekStart, i);
      const dayPosts = posts.filter(p => 
        p.brand === selectedTenant && 
        p.scheduledDate && 
        format(new Date(p.scheduledDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      days.push({ date, posts: dayPosts });
    }
    return days;
  }, [calendarWeekStart, posts, selectedTenant]);

  const stats = useMemo(() => {
    const brandPosts = posts.filter(p => p.brand === selectedTenant);
    return {
      total: brandPosts.length,
      evergreen: brandPosts.filter(p => p.type === "evergreen").length,
      seasonal: brandPosts.filter(p => p.type === "seasonal").length,
      scheduled: brandPosts.filter(p => p.status === "scheduled").length,
      posted: brandPosts.filter(p => p.status === "posted").length,
      drafts: brandPosts.filter(p => p.status === "draft").length,
    };
  }, [posts, selectedTenant]);

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <main className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <GlassCard className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  Marketing Hub
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Social Media Catalog & Scheduling
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="text-center text-xl tracking-widest"
                  data-testid="input-marketing-pin"
                />
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <Button 
                  onClick={handleLogin} 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
                  data-testid="button-marketing-login"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Access Dashboard
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                First time? Use default PIN, then set your own secure PIN.
              </p>
            </GlassCard>
          </motion.div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="min-h-screen py-8 px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                Marketing Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Social media catalog & scheduling for {selectedTenant === "npp" ? "NPP" : "Lume"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <TenantSwitcher 
                selectedTenant={selectedTenant} 
                onTenantChange={setSelectedTenant} 
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPinChange(true)}
                data-testid="button-change-pin"
              >
                <Lock className="w-4 h-4 mr-1" />
                PIN
              </Button>
            </div>
          </motion.div>

          <BentoGrid className="gap-3">
            <BentoItem colSpan={2} mobileColSpan={2}>
              <GlassCard className="p-4 text-center h-full flex flex-col justify-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Posts</p>
              </GlassCard>
            </BentoItem>
            <BentoItem colSpan={2} mobileColSpan={2}>
              <GlassCard className="p-4 text-center h-full flex flex-col justify-center bg-green-50 dark:bg-green-900/20">
                <p className="text-2xl font-bold text-green-600">{stats.evergreen}</p>
                <p className="text-xs text-gray-500">Evergreen</p>
              </GlassCard>
            </BentoItem>
            <BentoItem colSpan={2} mobileColSpan={2}>
              <GlassCard className="p-4 text-center h-full flex flex-col justify-center bg-orange-50 dark:bg-orange-900/20">
                <p className="text-2xl font-bold text-orange-600">{stats.seasonal}</p>
                <p className="text-xs text-gray-500">Seasonal</p>
              </GlassCard>
            </BentoItem>
            <BentoItem colSpan={2} mobileColSpan={2}>
              <GlassCard className="p-4 text-center h-full flex flex-col justify-center bg-blue-50 dark:bg-blue-900/20">
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                <p className="text-xs text-gray-500">Scheduled</p>
              </GlassCard>
            </BentoItem>
            <BentoItem colSpan={2} mobileColSpan={2}>
              <GlassCard className="p-4 text-center h-full flex flex-col justify-center bg-purple-50 dark:bg-purple-900/20">
                <p className="text-2xl font-bold text-purple-600">{stats.posted}</p>
                <p className="text-xs text-gray-500">Posted</p>
              </GlassCard>
            </BentoItem>
            <BentoItem colSpan={2} mobileColSpan={2}>
              <GlassCard className="p-4 text-center h-full flex flex-col justify-center bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
                <p className="text-xs text-gray-500">Drafts</p>
              </GlassCard>
            </BentoItem>
          </BentoGrid>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="catalog" className="flex items-center gap-2" data-testid="tab-catalog">
                <FileText className="w-4 h-4" />
                Content Catalog
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2" data-testid="tab-calendar">
                <Calendar className="w-4 h-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="space-y-6">
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Search messages..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-posts"
                    />
                  </div>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger className="w-full md:w-40" data-testid="select-platform">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="nextdoor">Nextdoor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-40" data-testid="select-type">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="evergreen">Evergreen</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-40" data-testid="select-category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowAddModal(true)} data-testid="button-add-post">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Post
                  </Button>
                </div>
              </GlassCard>

              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredPosts.map((post, index) => {
                    const platform = PLATFORMS.find(p => p.id === post.platform);
                    const category = CATEGORIES.find(c => c.id === post.category);
                    const recentlyUsed = checkDuplicateUsage(post);
                    
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <GlassCard className={`p-4 ${recentlyUsed ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-900/10' : ''}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform?.color} flex items-center justify-center`}>
                                  {platform && <platform.icon className="w-4 h-4 text-white" />}
                                </div>
                                <Badge variant={post.type === "evergreen" ? "default" : "secondary"}>
                                  {post.type}
                                </Badge>
                                <Badge variant="outline">
                                  {category?.label}
                                </Badge>
                                {post.status === "scheduled" && (
                                  <Badge className="bg-blue-500">Scheduled</Badge>
                                )}
                                {post.status === "posted" && (
                                  <Badge className="bg-green-500">Posted</Badge>
                                )}
                                {recentlyUsed && (
                                  <Badge variant="outline" className="border-orange-400 text-orange-600">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Used Recently
                                  </Badge>
                                )}
                                {post.claimedBy && (
                                  <Badge variant="outline" className="border-purple-400 text-purple-600">
                                    <User className="w-3 h-3 mr-1" />
                                    {post.claimedBy}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                              {post.lastUsed && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Last used: {format(new Date(post.lastUsed), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(post.content);
                                }}
                                title="Copy to clipboard"
                                data-testid={`button-copy-${post.id}`}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingPost(post)}
                                title="Edit post"
                                data-testid={`button-edit-${post.id}`}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsPosted(post.id)}
                                title="Mark as posted"
                                data-testid={`button-posted-${post.id}`}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => deletePost(post.id)}
                                title="Delete post"
                                data-testid={`button-delete-${post.id}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredPosts.length === 0 && (
                  <GlassCard className="p-12 text-center">
                    <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No posts found matching your filters</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setShowAddModal(true)}
                      data-testid="button-add-first-post"
                    >
                      Create Your First Post
                    </Button>
                  </GlassCard>
                )}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="sm" onClick={() => setCalendarWeekStart(addDays(calendarWeekStart, -7))} data-testid="button-prev-week">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-lg font-semibold">
                    Week of {format(calendarWeekStart, "MMMM d, yyyy")}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => setCalendarWeekStart(addDays(calendarWeekStart, 7))} data-testid="button-next-week">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, i) => (
                    <div key={i} className="min-h-[150px]">
                      <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                        <p className="text-xs text-gray-500">{format(day.date, "EEE")}</p>
                        <p className="font-bold">{format(day.date, "d")}</p>
                      </div>
                      <div className="border border-t-0 rounded-b-lg p-2 space-y-1 min-h-[100px]">
                        {day.posts.map(post => {
                          const platform = PLATFORMS.find(p => p.id === post.platform);
                          return (
                            <div 
                              key={post.id}
                              className={`p-1 rounded text-xs bg-gradient-to-r ${platform?.color} text-white truncate cursor-pointer`}
                              title={post.content}
                              onClick={() => setEditingPost(post)}
                            >
                              {post.content.slice(0, 20)}...
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Quick Schedule
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select a post and date to add to the schedule
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {PLATFORMS.map(platform => {
                    const platformPosts = posts.filter(p => p.brand === selectedTenant && p.platform === platform.id);
                    const scheduled = platformPosts.filter(p => p.status === "scheduled").length;
                    const available = platformPosts.filter(p => p.status === "draft").length;
                    
                    return (
                      <Card key={platform.id}>
                        <CardHeader className={`bg-gradient-to-r ${platform.color} text-white rounded-t-lg py-3`}>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <platform.icon className="w-4 h-4" />
                            {platform.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>{scheduled} scheduled</span>
                            <span>{available} available</span>
                          </div>
                          <Select onValueChange={(postId) => {
                            const post = posts.find(p => p.id === postId);
                            if (post) schedulePost(post, new Date().toISOString());
                          }}>
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="Schedule a post..." />
                            </SelectTrigger>
                            <SelectContent>
                              {posts
                                .filter(p => p.brand === selectedTenant && p.platform === platform.id && p.status === "draft")
                                .slice(0, 10)
                                .map(p => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.content.slice(0, 40)}...
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Content by Platform
                  </h3>
                  <div className="space-y-4">
                    {PLATFORMS.map(platform => {
                      const platformPosts = posts.filter(p => p.brand === selectedTenant && p.platform === platform.id);
                      const posted = platformPosts.filter(p => p.status === "posted").length;
                      const total = platformPosts.length;
                      return (
                        <div key={platform.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                              <platform.icon className="w-4 h-4 text-white" />
                            </div>
                            <span>{platform.label}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{total}</p>
                            <p className="text-xs text-gray-500">{posted} posted</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-blue-500" />
                    Category Distribution
                  </h3>
                  <div className="space-y-3">
                    {CATEGORIES.map(cat => {
                      const count = posts.filter(p => p.brand === selectedTenant && p.category === cat.id).length;
                      const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                      return (
                        <div key={cat.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1">
                              <cat.icon className="w-3 h-3" />
                              {cat.label}
                            </span>
                            <span>{count}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                <GlassCard className="p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    Team Activity & Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">{posts.filter(p => p.brand === selectedTenant && p.claimedBy).length}</p>
                      <p className="text-xs text-gray-500">Claimed</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.posted}</p>
                      <p className="text-xs text-gray-500">Posted</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                      <p className="text-xs text-gray-500">Scheduled</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
                      <p className="text-xs text-gray-500">Drafts</p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {posts.filter(p => p.brand === selectedTenant && checkDuplicateUsage(p)).length}
                      </p>
                      <p className="text-xs text-gray-500">Recently Used</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Post
            </DialogTitle>
          </DialogHeader>
          <AddPostForm 
            onSubmit={addPost} 
            onCancel={() => setShowAddModal(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Post
            </DialogTitle>
          </DialogHeader>
          {editingPost && (
            <EditPostForm 
              post={editingPost}
              onSubmit={(updates) => updatePost(editingPost.id, updates)} 
              onCancel={() => setEditingPost(null)}
              onClaim={(name) => claimPost(editingPost.id, name)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPinChange} onOpenChange={setShowPinChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Your Secure PIN</DialogTitle>
          </DialogHeader>
          <PinChangeForm 
            onSubmit={handlePinChange}
            validateStrength={validatePinStrength}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              Recently Used Content
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            This post was used within the last 4 weeks. Are you sure you want to schedule it again?
          </p>
          {duplicatePost && (
            <div className="p-3 bg-orange-50 rounded-lg text-sm">
              <p className="text-gray-700">{duplicatePost.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Last used: {duplicatePost.lastUsed && format(new Date(duplicatePost.lastUsed), "MMM d, yyyy")}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateWarning(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => duplicatePost && confirmSchedule(duplicatePost, new Date().toISOString())}
            >
              Schedule Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

function AddPostForm({ onSubmit, onCancel }: { 
  onSubmit: (post: Partial<SocialPost>) => void; 
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [type, setType] = useState("evergreen");
  const [category, setCategory] = useState("general");

  return (
    <div className="space-y-4">
      <div>
        <Label>Platform</Label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger data-testid="select-add-platform">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="nextdoor">Nextdoor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger data-testid="select-add-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="evergreen">Evergreen (Permanent Rotation)</SelectItem>
            <SelectItem value="seasonal">Seasonal (Weekly Review)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger data-testid="select-add-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Message Content</Label>
        <Textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your social media message..."
          rows={4}
          data-testid="textarea-post-content"
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={() => onSubmit({ content, platform: platform as any, type: type as any, category: category as any })}
          disabled={!content.trim()}
          data-testid="button-submit-post"
        >
          Add Post
        </Button>
      </DialogFooter>
    </div>
  );
}

function EditPostForm({ post, onSubmit, onCancel, onClaim }: { 
  post: SocialPost;
  onSubmit: (updates: Partial<SocialPost>) => void; 
  onCancel: () => void;
  onClaim: (name: string) => void;
}) {
  const [content, setContent] = useState(post.content);
  const [platform, setPlatform] = useState(post.platform);
  const [type, setType] = useState(post.type);
  const [category, setCategory] = useState(post.category);
  const [claimName, setClaimName] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <Label>Platform</Label>
        <Select value={platform} onValueChange={(v) => setPlatform(v as typeof platform)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="nextdoor">Nextdoor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="evergreen">Evergreen (Permanent Rotation)</SelectItem>
            <SelectItem value="seasonal">Seasonal (Weekly Review)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Message Content</Label>
        <Textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
      </div>
      
      <div className="border-t pt-4">
        <Label>Claim This Post</Label>
        <div className="flex gap-2 mt-1">
          <Input 
            placeholder="Your name"
            value={claimName}
            onChange={(e) => setClaimName(e.target.value)}
          />
          <Button 
            variant="outline" 
            onClick={() => {
              if (claimName.trim()) {
                onClaim(claimName.trim());
              }
            }}
            disabled={!claimName.trim()}
          >
            Claim
          </Button>
        </div>
        {post.claimedBy && (
          <p className="text-xs text-purple-600 mt-1">Currently claimed by: {post.claimedBy}</p>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={() => onSubmit({ content, platform, type, category })}
          disabled={!content.trim()}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </div>
  );
}

function PinChangeForm({ onSubmit, validateStrength }: { 
  onSubmit: (pin: string) => void;
  validateStrength: (pin: string) => boolean;
}) {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!validateStrength(newPin)) {
      setError("PIN must have uppercase, lowercase, number, and special character (min 6 chars)");
      return;
    }
    if (newPin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    onSubmit(newPin);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Create a secure PIN with at least:
      </p>
      <ul className="text-xs text-gray-500 list-disc list-inside">
        <li>One uppercase letter</li>
        <li>One lowercase letter</li>
        <li>One number</li>
        <li>One special character (!@#$%^&*)</li>
        <li>Minimum 6 characters</li>
      </ul>
      <div>
        <Label>New PIN</Label>
        <Input 
          type="password"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          placeholder="Enter new PIN"
          data-testid="input-new-pin"
        />
      </div>
      <div>
        <Label>Confirm PIN</Label>
        <Input 
          type="password"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          placeholder="Confirm new PIN"
          data-testid="input-confirm-pin"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <DialogFooter>
        <Button onClick={handleSubmit} data-testid="button-save-pin">Save PIN</Button>
      </DialogFooter>
    </div>
  );
}
