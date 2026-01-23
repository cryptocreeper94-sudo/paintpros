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
  Trash2, Plus, Copy, Lock, User, Mic,
  Sparkles, PenTool, Palette, Building2, TreePine, DoorOpen,
  LayoutGrid, Search, ChevronLeft, ChevronRight,
  FileText, Users, BarChart3, Target, Lightbulb, Volume2, VolumeX, Loader2
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { format, subWeeks, isAfter, startOfWeek, addDays } from "date-fns";

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
  const [userRole, setUserRole] = useState<string>("");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "catalog" | "calendar" | "analytics">("overview");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicatePost, setDuplicatePost] = useState<SocialPost | null>(null);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [calendarWeekStart, setCalendarWeekStart] = useState(startOfWeek(new Date()));
  const [isReading, setIsReading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Section content for voice reading (stripped of emojis)
  const sectionContent: Record<string, string> = {
    welcome: `Hey Logan, here's what I built for us. This is our Marketing Hub for ${selectedTenant === "npp" ? "Nashville Painting Professionals" : "Lume Paint Co"}. I've been building this system so we can run a professional marketing operation together without either of us having to spend hours on it. Below I'll walk you through what's ready, how to use it, what I'm still connecting, and where we're headed. Let's make this thing dominate.`,
    section1: `Section 1: What's Ready Right Now. We have over 100 marketing images loaded and organized, an AI assistant that can generate captions and analyze performance, a visual content catalog where you can browse everything, a scheduling calendar to plan your posts, and real-time analytics tracking.`,
    section2: `Section 2: How To Operate It. Your Tasks. The system is built and ready to go. Now I need your help running it. These are your responsibilities to keep the marketing machine operating at maximum effectiveness. First, Review AI Captions: When the AI generates content, review it before it goes live. Does it sound like NPP? Your approval ensures brand voice stays consistent. Second, Spot Trends: You're on social media daily. When you see trending formats or ideas that could work for a painting company, flag them. This keeps our content fresh and relevant. Third, Monitor Engagement: Check the Analytics tab weekly. Note which posts are winning and which are underperforming. This data drives our optimization decisions. Fourth, Curate the Library: Browse the Content Catalog regularly. Flag outdated images, suggest new pairings, and keep the library fresh. Quality in equals quality out. Your role is critical: The AI handles the heavy lifting, but your eyes on the system ensure we catch issues early and stay ahead of the competition. Together, we're running a marketing operation that most small businesses can't afford.`,
    section3: `Section 3: What I'm Still Connecting. Step 1, Manual Rotation, is current. Setting up the first content rotation manually to establish the baseline. This ensures we have proven content and timing patterns before the AI takes over. You'll see the calendar populate with our initial schedule. Step 2, Meta API Connection, is in progress. Working on getting the direct API connection to Meta, that's Facebook and Instagram, set up. This will allow the system to post automatically without anyone logging into Meta Business Suite. Step 3, Full Automation, is coming next. Once Meta is connected and manual rotation is proven, the AI takes over completely. The carousel runs 24 7 and you just get notified when something needs attention.`,
    section4: `Section 4: Where We're Headed, The Vision. Once implementation becomes normal, here's what our Marketing AI will handle automatically. Content Suggestions: Based on what's performing, it'll recommend what to post next. Smart Scheduling: Auto-populate the calendar based on engagement analytics. Performance Alerts: Get notified when something's going viral or tanking. Ad Optimization: Run ads at optimal times, target peak engagement windows based on your audience, adjust spend based on lead response rates, and pause underperforming ads before they waste budget.`,
    section5: `Section 5: How We Stay In Sync. When you update content, just send a quick message like, Hey, I updated next week's Nextdoor post. When I update content, I'll message you something like, Updated the seasonal posts for spring. Take a look when you can. The goal is efficiency. You get credit for running a killer marketing campaign while focusing on schoolwork. I focus on other things. The system runs like a carousel, it never stops.`,
  };

  // Strip emojis from text for clean voice output
  const stripEmojis = (text: string): string => {
    return text.replace(/[\u{1F600}-\\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\\u{1F1E0}-\\u{1F1FF}]|[\\u{2600}-\\u{26FF}]|[\u{2700}-\u{27BF}]|[\\u{1F900}-\\u{1F9FF}]|[\u{1FA00}-\\u{1FA6F}]|[\\u{1FA70}-\\u{1FAFF}]|[\u{231A}-\u{231B}]|[\\u{23E9}-\u{23F3}]|[\\u{23F8}-\u{23FA}]|[\\u{25AA}-\u{25AB}]|[\\u{25B6}]|[\u{25C0}]|[\\u{25FB}-\\u{25FE}]|[\\u{2614}-\u{2615}]|[\\u{2648}-\u{2653}]|[\\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\\u{26AB}]|[\\u{26BD}-\u{26BE}]|[\u{26C4}-\\u{26C5}]|[\\u{26CE}]|[\u{26D4}]|[\\u{26EA}]|[\\u{26F2}-\\u{26F3}]|[\u{26F5}]|[\\u{26FA}]|[\\u{26FD}]|[\u{2702}]|[\\u{2705}]|[\u{2708}-\u{270D}]|[\\u{270F}]|[\u{2712}]|[\u{2714}]|[\\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\\u{2733}-\u{2734}]|[\u{2744}]|[\\u{2747}]|[\\u{274C}]|[\u{274E}]|[\u{2753}-\\u{2755}]|[\\u{2757}]|[\\u{2763}-\u{2764}]|[\u{2795}-\\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\\u{3297}]|[\\u{3299}]/gu, '').replace(/\s+/g, ' ').trim();
  };

  // Handle text-to-speech for a section
  const handleReadSection = async (sectionId: string) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setCurrentAudio(null);
      setIsReading(false);
      return;
    }

    const content = sectionContent[sectionId];
    if (!content) return;

    const cleanText = stripEmojis(content);
    setIsReading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'alloy' }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsReading(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsReading(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsReading(false);
    }
  };

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

  }, []);

  const validatePinStrength = (testPin: string): boolean => {
    const hasLower = /[a-z]/.test(testPin);
    const hasUpper = /[A-Z]/.test(testPin);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(testPin);
    const hasNumber = /[0-9]/.test(testPin);
    return hasLower && hasUpper && hasSpecial && hasNumber && testPin.length >= 6;
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/pin/verify-any", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await response.json();
      
      if (data.success && (data.role === "marketing" || data.role === "developer" || data.role === "owner")) {
        setIsAuthenticated(true);
        setUserRole(data.role);
        setError("");
        if (data.mustChangePin) {
          setShowPinChange(true);
        }
      } else if (data.success) {
        setError("Access denied. Marketing, Developer, or Owner PIN required.");
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify PIN. Please try again.");
    }
  };

  const handlePinChange = async (newPin: string) => {
    if (validatePinStrength(newPin)) {
      try {
        const response = await fetch("/api/auth/pin/change", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: userRole, currentPin: pin, newPin }),
        });
        const data = await response.json();
        if (data.success) {
          setShowPinChange(false);
        }
      } catch (err) {
        console.error("Failed to change PIN:", err);
      }
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
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
                <Sparkles className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="catalog" className="flex items-center gap-2" data-testid="tab-catalog">
                <FileText className="w-4 h-4" />
                Catalog
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

            {/* OVERVIEW TAB - Welcome, Status, Roadmap */}
            <TabsContent value="overview" className="space-y-6">
              {/* Voice Assistant Tip - First thing Logan sees */}
              <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Voice Mode Available</p>
                  <p className="text-xs text-white/90">
                    Say "Hey, read me section 2" or click the speaker icon on any section to have the AI read it to you. 
                    Hands-free marketing updates while you multitask.
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={() => handleReadSection("welcome")}
                  data-testid="button-voice-demo"
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  Try It
                </Button>
              </div>

              {/* Welcome Section for Logan */}
              <GlassCard className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Hey Logan - Here's What I Built For Us
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      This is our Marketing Hub for {selectedTenant === "npp" ? "Nashville Painting Professionals" : "Lume Paint Co"}. 
                      I've been building this system so we can run a professional marketing operation together without 
                      either of us having to spend hours on it. Below I'll walk you through what's ready, how to use it, 
                      what I'm still connecting, and where we're headed. Let's make this thing dominate.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Section 1: What's Ready */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  1. What's Ready Right Now
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="ml-auto h-8 w-8"
                    onClick={() => handleReadSection("section1")}
                    data-testid="button-read-section1"
                  >
                    {isReading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">100+ Marketing Images</p>
                      <p className="text-xs text-gray-500">Digital Asset Library across 14 categories</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Content Catalog</p>
                      <p className="text-xs text-gray-500">Evergreen + Seasonal posts ready to schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Scheduling Calendar</p>
                      <p className="text-xs text-gray-500">4-week duplicate prevention built in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Analytics Dashboard</p>
                      <p className="text-xs text-gray-500">Weekly trends, KPIs, performance insights</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Meta Business Suite Integration Roadmap */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  AI Marketing Autopilot - Roadmap
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Our goal: Set it and forget it. The system posts automatically while you focus on what matters.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-300 font-bold text-sm">1</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Meta Business Suite Integration</p>
                      <p className="text-xs text-gray-500 mt-1">Connect Facebook + Instagram via Meta Graph API. Auto-post from your content library.</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-700 text-xs">Coming Soon</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-l-4 border-purple-500">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-300 font-bold text-sm">2</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">AI Content Generation</p>
                      <p className="text-xs text-gray-500 mt-1">AI writes captions using your brand voice. "Transforming familiar spaces..." for NPP.</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-700 text-xs">Coming Soon</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-500">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center flex-shrink-0 text-green-600 dark:text-green-300 font-bold text-sm">3</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Smart Carousel Scheduler</p>
                      <p className="text-xs text-gray-500 mt-1">System rotates through content automatically. You just send a message when updating.</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-700 text-xs">Coming Soon</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border-l-4 border-orange-500">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center flex-shrink-0 text-orange-600 dark:text-orange-300 font-bold text-sm">4</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Platform Expansion</p>
                      <p className="text-xs text-gray-500 mt-1">Start with Facebook/Instagram. Add X (Twitter) when franchising goes national.</p>
                      <Badge className="mt-2 bg-gray-100 text-gray-600 text-xs">Future</Badge>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Google Analytics Integration */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Google Analytics Integration
                </h3>
                <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Awaiting Authorization Code</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Once we receive the Google Analytics authorization code, this section will display:
                    </p>
                    <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
                      <li>Live visitor tracking</li>
                      <li>Traffic sources breakdown</li>
                      <li>Lead conversion metrics</li>
                      <li>Campaign performance (UTM tracking)</li>
                    </ul>
                    <Badge className="mt-3 bg-orange-100 text-orange-700 text-xs">Ready to Connect</Badge>
                  </div>
                </div>
              </GlassCard>

              {/* Section 2: How To Operate It */}
              <GlassCard className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  2. How To Operate It (Your Tasks)
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="ml-auto h-8 w-8"
                    onClick={() => handleReadSection("section2")}
                    data-testid="button-read-section2"
                  >
                    {isReading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  The system is built and ready to go. Now I need your help running it. These are your responsibilities 
                  to keep the marketing machine operating at maximum effectiveness:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-green-500">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Review AI Captions
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      When the AI generates content, review it before it goes live. Does it sound like NPP? 
                      Your approval ensures brand voice stays consistent.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      Spot Trends
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      You're on social media daily. When you see trending formats or ideas that could work 
                      for a painting company, flag them. This keeps our content fresh and relevant.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-purple-500">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-500" />
                      Monitor Engagement
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Check the Analytics tab weekly. Note which posts are winning and which are underperforming. 
                      This data drives our optimization decisions.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 border-pink-500">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-pink-500" />
                      Curate the Library
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Browse the Content Catalog regularly. Flag outdated images, suggest new pairings, 
                      and keep the library fresh. Quality in = quality out.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Your role is critical:</strong> The AI handles the heavy lifting, but your eyes on the system 
                    ensure we catch issues early and stay ahead of the competition. Together, we're running a marketing 
                    operation that most small businesses can't afford.
                  </p>
                </div>
              </GlassCard>

              {/* AI Marketing Assistant - Proactive & Productive */}
              <GlassCard className="p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 border-indigo-200 dark:border-indigo-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  AI Marketing Assistant
                  <Badge className="ml-2 bg-indigo-100 text-indigo-700 text-xs">Proactive Mode</Badge>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  This isn't just a chatbot - it's a working assistant that actually does things for you.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center gap-2 mb-2">
                      <PenTool className="w-4 h-4 text-indigo-500" />
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Content Suggestions</p>
                    </div>
                    <p className="text-xs text-gray-500">AI analyzes your best-performing posts and generates new caption ideas matching your brand voice.</p>
                    <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Active</Badge>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Smart Scheduling</p>
                    </div>
                    <p className="text-xs text-gray-500">Recommends optimal posting times based on engagement data. Prevents duplicate content automatically.</p>
                    <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Active</Badge>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-orange-100 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Performance Alerts</p>
                    </div>
                    <p className="text-xs text-gray-500">Notifies you when posts underperform or when engagement spikes. Suggests improvements automatically.</p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-700 text-xs">Coming Soon</Badge>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">What This Means For You</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        The AI doesn't just answer questions - it actively works. When you're busy with school, the AI is:
                      </p>
                      <ul className="text-xs text-gray-600 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                        <li>Analyzing which posts perform best and why</li>
                        <li>Generating new content ideas based on what works</li>
                        <li>Keeping the carousel running with fresh content</li>
                        <li>Flagging anything that needs human attention</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Section 3: What I'm Still Connecting */}
              <GlassCard className="p-6 border-2 border-blue-300 dark:border-blue-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                  3. What I'm Still Connecting
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="ml-auto h-8 w-8"
                    onClick={() => handleReadSection("section3")}
                    data-testid="button-read-section3"
                  >
                    {isReading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Step 1: Manual Rotation (Current)</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Setting up the first content rotation manually to establish the baseline. This ensures we have proven content 
                      and timing patterns before the AI takes over. You'll see the calendar populate with our initial schedule.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Step 2: Meta API Connection (In Progress)</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Working on getting the direct API connection to Meta (Facebook/Instagram) set up. 
                      This will allow the system to post automatically without anyone logging into Meta Business Suite.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Step 3: Full Automation (Coming Next)</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      Once Meta is connected and manual rotation is proven, the AI takes over completely. 
                      The carousel runs 24/7 and you just get notified when something needs attention.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                  Once fully connected, you'll be able to:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                  <li>Post directly to Facebook & Instagram from this dashboard</li>
                  <li>See all analytics in one place - no switching apps</li>
                  <li>Schedule and automate posts with AI assistance</li>
                  <li>Run the entire marketing operation right here</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 font-medium">
                  Until then, explore the Content Catalog and Analytics tabs. The foundation is ready!
                </p>
              </GlassCard>

              {/* Section 4: Where We're Headed */}
              <GlassCard className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  4. Where We're Headed (The Vision)
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="ml-auto h-8 w-8"
                    onClick={() => handleReadSection("section4")}
                    data-testid="button-read-section4"
                  >
                    {isReading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Once implementation becomes normal, here's what our Marketing AI will handle automatically:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-cyan-500" />
                      Voice Commands (Coming Soon)
                    </p>
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <p className="italic">"Generate a post about spring exterior painting"</p>
                      <p className="italic">"Schedule the deck staining post for Tuesday at 10am"</p>
                      <p className="italic">"What content hasn't been used in 30 days?"</p>
                      <p className="italic">"Show me our best performing posts this month"</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      Auto-Calendar Population
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Once Meta is connected, the AI will automatically populate your posting calendar based on:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Optimal posting times from your analytics data</li>
                      <li>Seasonal relevance (spring cleaning, summer decks, holiday prep)</li>
                      <li>Content rotation to prevent staleness</li>
                      <li>Platform-specific best practices (Instagram vs Facebook vs Nextdoor)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      Smart Ad Timing
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      When Meta integration is live, the AI will run ads at the right times:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Boost high-performing organic posts automatically</li>
                      <li>Target peak engagement windows based on your audience</li>
                      <li>Adjust spend based on lead response rates</li>
                      <li>Pause underperforming ads before they waste budget</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg">
                  <p className="text-xs text-cyan-800 dark:text-cyan-200">
                    <strong>Bottom Line:</strong> You focus on school. The AI keeps the marketing machine running. 
                    Just check in occasionally and send a quick message if you're updating anything.
                  </p>
                </div>
              </GlassCard>

              {/* Section 5: How We Stay In Sync */}
              <GlassCard className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  5. How We Stay In Sync
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="ml-auto h-8 w-8"
                    onClick={() => handleReadSection("section5")}
                    data-testid="button-read-section5"
                  >
                    {isReading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">When you update content:</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Just send a quick message: "Hey, I updated next week's Nextdoor post."</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900 dark:text-white">When I update content:</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">I'll message you: "Updated the seasonal posts for spring. Take a look when you can."</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    The goal is efficiency. You get credit for running a killer marketing campaign while focusing on schoolwork. 
                    I focus on other things. The system runs like a carousel - it never stops.
                  </p>
                </div>
              </GlassCard>
            </TabsContent>

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

            <TabsContent value="analytics" className="space-y-6" data-testid="analytics-tab-content">
              <BentoGrid className="gap-4">
                <BentoItem colSpan={3} mobileColSpan={6}>
                  <GlassCard className="p-4 h-full" data-testid="analytics-total-content">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total Content</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                      <Sparkles className="w-3 h-3" />
                      <span>{stats.evergreen} evergreen, {stats.seasonal} seasonal</span>
                    </div>
                  </GlassCard>
                </BentoItem>
                <BentoItem colSpan={3} mobileColSpan={6}>
                  <GlassCard className="p-4 h-full" data-testid="analytics-published">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.posted}</p>
                        <p className="text-xs text-muted-foreground">Published</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${stats.total > 0 ? (stats.posted / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {stats.total > 0 ? Math.round((stats.posted / stats.total) * 100) : 0}% publish rate
                    </p>
                  </GlassCard>
                </BentoItem>
                <BentoItem colSpan={3} mobileColSpan={6}>
                  <GlassCard className="p-4 h-full" data-testid="analytics-scheduled">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.scheduled}</p>
                        <p className="text-xs text-muted-foreground">Scheduled</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-amber-600">
                      <Calendar className="w-3 h-3" />
                      <span>Next 7 days pipeline</span>
                    </div>
                  </GlassCard>
                </BentoItem>
                <BentoItem colSpan={3} mobileColSpan={6}>
                  <GlassCard className="p-4 h-full" data-testid="analytics-evergreen-ratio">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{Math.round((stats.evergreen / Math.max(stats.total, 1)) * 100)}%</p>
                        <p className="text-xs text-muted-foreground">Evergreen Ratio</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="outline" className="text-[10px]">{stats.evergreen} evergreen</Badge>
                      <Badge variant="outline" className="text-[10px]">{stats.seasonal} seasonal</Badge>
                    </div>
                  </GlassCard>
                </BentoItem>
              </BentoGrid>

              <div className="grid md:grid-cols-3 gap-6">
                <GlassCard className="p-6" data-testid="analytics-platform-performance">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Platform Performance
                  </h3>
                  <div className="space-y-4">
                    {PLATFORMS.map(platform => {
                      const platformPosts = posts.filter(p => p.brand === selectedTenant && p.platform === platform.id);
                      const posted = platformPosts.filter(p => p.status === "posted").length;
                      const total = platformPosts.length;
                      const percent = stats.total > 0 ? (total / stats.total) * 100 : 0;
                      return (
                        <div key={platform.id}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                                <platform.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium">{platform.label}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{total}</p>
                              <p className="text-[10px] text-muted-foreground">{posted} posted</p>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className={`h-full bg-gradient-to-r ${platform.color} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Multi-Platform Coverage</span>
                      <span className="font-bold text-green-600">
                        {PLATFORMS.filter(p => posts.some(post => post.brand === selectedTenant && post.platform === p.id)).length}/{PLATFORMS.length} active
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6" data-testid="analytics-category-distribution">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-blue-500" />
                    Category Distribution
                  </h3>
                  <div className="space-y-3">
                    {CATEGORIES.slice(0, 6).map((cat, idx) => {
                      const count = posts.filter(p => p.brand === selectedTenant && p.category === cat.id).length;
                      const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                      const colors = [
                        "from-pink-500 to-rose-600",
                        "from-blue-500 to-cyan-600",
                        "from-green-500 to-emerald-600",
                        "from-amber-500 to-orange-600",
                        "from-purple-500 to-violet-600",
                        "from-indigo-500 to-blue-600",
                      ];
                      return (
                        <div key={cat.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="flex items-center gap-1.5">
                              <cat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                              {cat.label}
                            </span>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage Score</span>
                      <span className="font-bold text-blue-600">
                        {Math.round((CATEGORIES.filter(c => posts.some(p => p.brand === selectedTenant && p.category === c.id)).length / CATEGORIES.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6" data-testid="analytics-health-score">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold">Portfolio Insights</h3>
                  </div>
                  {(() => {
                    const activeContent = stats.posted + stats.scheduled;
                    const conversionRate = activeContent > 0 ? Math.round((stats.posted / activeContent) * 100) : 0;
                    const evergreenRatio = stats.total > 0 ? Math.round((stats.evergreen / stats.total) * 100) : 0;
                    const coverageCategories = CATEGORIES.filter(c => posts.some(p => p.brand === selectedTenant && p.category === c.id)).length;
                    const coveragePercent = Math.round((coverageCategories / CATEGORIES.length) * 100);
                    
                    return (
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Completion Rate</span>
                            <span className={`text-lg font-bold ${conversionRate >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
                              {conversionRate}%
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Published / (Scheduled + Published)</p>
                          <div className="h-1.5 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${conversionRate}%` }} 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                            <p className="text-lg font-bold text-purple-600">{evergreenRatio}%</p>
                            <p className="text-[10px] text-muted-foreground">Evergreen</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                            <p className="text-lg font-bold text-blue-600">{coveragePercent}%</p>
                            <p className="text-[10px] text-muted-foreground">Category Coverage</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t text-[10px] text-muted-foreground text-center">
                          Based on current content portfolio composition
                        </div>
                      </div>
                    );
                  })()}
                </GlassCard>
              </div>

              <GlassCard className="p-6" data-testid="analytics-activity-dashboard">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Activity Dashboard
                </h3>
                <BentoGrid className="gap-3">
                  <BentoItem colSpan={2} mobileColSpan={5}>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/20 rounded-xl text-center h-full flex flex-col justify-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{posts.filter(p => p.brand === selectedTenant && p.claimedBy).length}</p>
                      <p className="text-xs text-muted-foreground">Claimed Posts</p>
                    </div>
                  </BentoItem>
                  <BentoItem colSpan={2} mobileColSpan={5}>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-xl text-center h-full flex flex-col justify-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">{stats.posted}</p>
                      <p className="text-xs text-muted-foreground">Published</p>
                    </div>
                  </BentoItem>
                  <BentoItem colSpan={2} mobileColSpan={5}>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/20 rounded-xl text-center h-full flex flex-col justify-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                    </div>
                  </BentoItem>
                  <BentoItem colSpan={2} mobileColSpan={5}>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/30 rounded-xl text-center h-full flex flex-col justify-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
                      <p className="text-xs text-muted-foreground">Drafts</p>
                    </div>
                  </BentoItem>
                  <BentoItem colSpan={2} mobileColSpan={10}>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20 rounded-xl text-center h-full flex flex-col justify-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-orange-600">
                        {posts.filter(p => p.brand === selectedTenant && checkDuplicateUsage(p)).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Recently Used</p>
                    </div>
                  </BentoItem>
                </BentoGrid>
              </GlassCard>

              <GlassCard className="p-6" data-testid="analytics-weekly-trends">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Weekly Posting Trends
                </h3>
                <div className="space-y-4">
                  {(() => {
                    const tenantPosts = posts.filter(p => p.brand === selectedTenant);
                    const now = new Date();
                    const TARGET_PER_WEEK = 9;
                    const BAR_HEIGHT = 80;
                    
                    const weeks = Array.from({ length: 6 }, (_, i) => {
                      const weekStart = new Date(now);
                      weekStart.setDate(now.getDate() - (i * 7) - now.getDay());
                      weekStart.setHours(0, 0, 0, 0);
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 7);
                      
                      const scheduledInWeek = tenantPosts.filter(p => {
                        if (!p.scheduledDate || p.status !== 'scheduled') return false;
                        const postDate = new Date(p.scheduledDate);
                        return postDate >= weekStart && postDate < weekEnd;
                      }).length;
                      
                      const postedInWeek = tenantPosts.filter(p => {
                        if (p.status !== 'posted' || !p.lastUsed) return false;
                        const postDate = new Date(p.lastUsed);
                        return postDate >= weekStart && postDate < weekEnd;
                      }).length;
                      
                      return {
                        label: i === 0 ? 'This Week' : i === 1 ? 'Last Week' : `${i}w ago`,
                        scheduled: scheduledInWeek,
                        posted: postedInWeek,
                        total: scheduledInWeek + postedInWeek
                      };
                    }).reverse();
                    
                    const maxCount = Math.max(...weeks.map(w => w.total), TARGET_PER_WEEK);
                    const avgPerWeek = weeks.reduce((sum, w) => sum + w.total, 0) / weeks.length;
                    const onTarget = avgPerWeek >= TARGET_PER_WEEK;
                    
                    return (
                      <>
                        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                          <div>
                            <p className="text-sm font-medium">Weekly Cadence</p>
                            <p className="text-xs text-muted-foreground">6-week average vs target</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${onTarget ? 'text-green-600' : 'text-amber-600'}`}>
                              {avgPerWeek.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">/ {TARGET_PER_WEEK} target</p>
                          </div>
                        </div>
                        <div className="flex items-end gap-2" style={{ height: `${BAR_HEIGHT + 24}px` }}>
                          {weeks.map((week, idx) => {
                            const totalHeight = week.total > 0 ? (week.total / maxCount) * BAR_HEIGHT : 2;
                            const postedHeight = week.total > 0 ? (week.posted / week.total) * totalHeight : 0;
                            const scheduledHeight = totalHeight - postedHeight;
                            
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-center justify-end" style={{ height: `${BAR_HEIGHT}px` }}>
                                  <div className="w-full max-w-8 flex flex-col">
                                    {week.posted > 0 && (
                                      <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${postedHeight}px` }}
                                        transition={{ duration: 0.4, delay: idx * 0.06 }}
                                        className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm"
                                      />
                                    )}
                                    {week.scheduled > 0 && (
                                      <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${scheduledHeight}px` }}
                                        transition={{ duration: 0.4, delay: idx * 0.06 + 0.05 }}
                                        className={`w-full bg-gradient-to-t from-indigo-500 to-violet-400 ${week.posted === 0 ? 'rounded-t-sm' : ''}`}
                                      />
                                    )}
                                    {week.total === 0 && (
                                      <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 rounded" />
                                    )}
                                  </div>
                                </div>
                                <span className="text-[9px] text-muted-foreground text-center">{week.label}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-center gap-4 pt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded bg-gradient-to-r from-green-500 to-emerald-400" />
                            <span>Published</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded bg-gradient-to-r from-indigo-500 to-violet-400" />
                            <span>Scheduled</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </GlassCard>

              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard className="p-6" data-testid="analytics-top-content">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Top Performing Content
                  </h3>
                  <div className="space-y-3">
                    {posts
                      .filter(p => p.brand === selectedTenant && p.status === "posted")
                      .slice(0, 5)
                      .map((post, idx) => (
                        <div key={post.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px]">{post.platform}</Badge>
                              <Badge variant="outline" className="text-[10px]">{post.category}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    {posts.filter(p => p.brand === selectedTenant && p.status === "posted").length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No published content yet</p>
                      </div>
                    )}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Posting Schedule Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Weekly Target</span>
                        <span className="text-lg font-bold text-blue-600">9 posts</span>
                      </div>
                      <p className="text-xs text-muted-foreground">3 posts per platform recommended</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Current Pipeline</span>
                        <span className="text-lg font-bold text-green-600">{stats.scheduled} ready</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Scheduled for upcoming weeks</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Content Velocity</span>
                        <span className="text-lg font-bold text-purple-600">
                          {Math.round((stats.posted + stats.scheduled) / 4)}/week
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Average posting frequency</p>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Seasonal Balance</span>
                        <span className="text-lg font-bold text-amber-600">
                          {Math.round((stats.seasonal / Math.max(stats.total, 1)) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Timely promotional content</p>
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

      <Dialog open={showPinChange} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-500" />
              Welcome! Set Your Secure PIN
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>First Login Detected!</strong> For security, please create a new PIN. 
              {userRole === "marketing" && " This will be your personal access code for the Marketing Hub."}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Your PIN must include: uppercase, lowercase, number, special character (min 6 chars)
            </p>
          </div>
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
