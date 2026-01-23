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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TenantSwitcher, useTenantFilter } from "@/components/tenant-switcher";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, Instagram, Facebook, Home, Calendar, 
  TrendingUp, Clock, CheckCircle, AlertTriangle, Edit, 
  Trash2, Plus, Copy, Lock, User, Mic,
  Sparkles, PenTool, Palette, Building2, TreePine, DoorOpen,
  LayoutGrid, Search, ChevronLeft, ChevronRight,
  FileText, Users, BarChart3, Target, Lightbulb, Volume2, VolumeX, Loader2,
  ImageIcon, MessageSquare, Layers, Wand2, Star, LogOut
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useQuery } from "@tanstack/react-query";
import { Eye, Zap, Globe, Smartphone, Monitor, Tablet, RefreshCw, MapPin } from "lucide-react";
import { AreaChart, Area } from "recharts";
import { format, subWeeks, subDays, isAfter, startOfWeek, addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

// DAM System Types
type ImageSubject = "interior-walls" | "exterior-home" | "cabinet-work" | "deck-staining" | "trim-detail" | "door-painting" | "commercial-space" | "before-after" | "team-action" | "general";
type ImageStyle = "finished-result" | "before-after" | "action-shot" | "detail-closeup" | "wide-angle" | "testimonial";
type ImageSeason = "spring" | "summer" | "fall" | "winter" | "all-year";

interface LibraryImage {
  id: string;
  brand: "npp" | "lumepaint";
  url: string;
  subject: ImageSubject;
  style: ImageStyle;
  season: ImageSeason;
  quality: 1 | 2 | 3 | 4 | 5;
  description: string;
  tags: string[];
  createdAt: string;
}

type MessageTone = "professional" | "friendly" | "promotional" | "educational" | "urgent";
type MessageCTA = "book-now" | "get-quote" | "learn-more" | "call-us" | "visit-site" | "none";

interface MessageTemplate {
  id: string;
  brand: "npp" | "lumepaint";
  content: string;
  subject: ImageSubject;
  tone: MessageTone;
  cta: MessageCTA;
  platform: "instagram" | "facebook" | "nextdoor" | "all";
  hashtags: string[];
  createdAt: string;
}

interface ContentBundle {
  id: string;
  brand: "npp" | "lumepaint";
  imageId: string;
  messageId: string;
  status: "suggested" | "approved" | "scheduled" | "posted";
  scheduledDate?: string;
  platform: "instagram" | "facebook" | "nextdoor";
  createdAt: string;
}

const IMAGE_SUBJECTS: { id: ImageSubject; label: string }[] = [
  { id: "interior-walls", label: "Interior Walls" },
  { id: "exterior-home", label: "Exterior Home" },
  { id: "cabinet-work", label: "Cabinet Work" },
  { id: "deck-staining", label: "Deck Staining" },
  { id: "trim-detail", label: "Trim & Detail" },
  { id: "door-painting", label: "Door Painting" },
  { id: "commercial-space", label: "Commercial Space" },
  { id: "before-after", label: "Before/After" },
  { id: "team-action", label: "Team Action" },
  { id: "general", label: "General/Brand" },
];

const IMAGE_STYLES: { id: ImageStyle; label: string }[] = [
  { id: "finished-result", label: "Finished Result" },
  { id: "before-after", label: "Before/After" },
  { id: "action-shot", label: "Action Shot" },
  { id: "detail-closeup", label: "Detail Close-up" },
  { id: "wide-angle", label: "Wide Angle" },
  { id: "testimonial", label: "Testimonial" },
];

const IMAGE_SEASONS: { id: ImageSeason; label: string }[] = [
  { id: "all-year", label: "All Year" },
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "fall", label: "Fall" },
  { id: "winter", label: "Winter" },
];

const MESSAGE_TONES: { id: MessageTone; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "promotional", label: "Promotional" },
  { id: "educational", label: "Educational" },
  { id: "urgent", label: "Urgent" },
];

const MESSAGE_CTAS: { id: MessageCTA; label: string }[] = [
  { id: "none", label: "No CTA" },
  { id: "book-now", label: "Book Now" },
  { id: "get-quote", label: "Get Quote" },
  { id: "learn-more", label: "Learn More" },
  { id: "call-us", label: "Call Us" },
  { id: "visit-site", label: "Visit Site" },
];

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
  const [userName, setUserName] = useState<string>("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Logout function - clears session and resets state
  const handleLogout = () => {
    localStorage.removeItem("marketing_session");
    setIsAuthenticated(false);
    setUserRole("");
    setUserName("");
    setPin("");
    setStayLoggedIn(false);
  };
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "images" | "messages" | "bundles" | "catalog" | "calendar" | "analytics">("overview");
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
  
  // DAM System State
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([]);
  const [contentBundles, setContentBundles] = useState<ContentBundle[]>([]);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [showAddMessageModal, setShowAddMessageModal] = useState(false);
  
  // Notes/Notepad state
  interface TeamNote {
    id: string;
    author: string;
    role: string;
    content: string;
    createdAt: string;
    tenant: string;
  }
  const [teamNotes, setTeamNotes] = useState<TeamNote[]>(() => {
    const saved = localStorage.getItem("marketing_team_notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [newNoteContent, setNewNoteContent] = useState("");
  
  // Dismiss intro sections (persists in localStorage per user)
  const [introHidden, setIntroHidden] = useState(() => {
    const saved = localStorage.getItem(`marketing_intro_hidden_${userRole}`);
    return saved === "true";
  });
  const hideIntro = () => {
    setIntroHidden(true);
    localStorage.setItem(`marketing_intro_hidden_${userRole}`, "true");
  };
  const showIntro = () => {
    setIntroHidden(false);
    localStorage.setItem(`marketing_intro_hidden_${userRole}`, "false");
  };
  
  const [imageSubjectFilter, setImageSubjectFilter] = useState<string>("all");
  const [messageSubjectFilter, setMessageSubjectFilter] = useState<string>("all");
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);

  // Role-specific content - different messaging for different users
  const isMarketingRole = userRole === "marketing";
  const isDeveloperRole = userRole === "developer";
  const isOwnerRole = userRole === "owner";
  const isAdminRole = userRole === "admin" || userRole === "ops_manager";
  const tenantName = selectedTenant === "npp" ? "Nashville Painting Professionals" : "Lume Paint Co";

  // Section content for voice reading (stripped of emojis) - role-specific
  const getSectionContent = (): Record<string, string> => {
    if (isMarketingRole) {
      return {
        welcome: `Hey ${userName}, here's what I built for us. This is our Marketing Hub for ${tenantName}. I've been building this system so we can run a professional marketing operation together without either of us having to spend hours on it. Below I'll walk you through what's ready, how to use it, what I'm still connecting, and where we're headed. Let's make this thing dominate.`,
        section1: `Section 1: What's Ready Right Now. We have over 100 marketing images loaded and organized, a visual content catalog where you can browse everything, a scheduling calendar to plan your posts, real-time analytics tracking with charts and metrics, and a Team Notes feature so we can leave messages for each other.`,
        section2: `Section 2: How To Operate It. Your Tasks. The system is built and ready to go. Now I need your help running it. These are your responsibilities to keep the marketing machine operating at maximum effectiveness. First, Review AI Captions: When the AI generates content, review it before it goes live. Does it sound like NPP? Your approval ensures brand voice stays consistent. Second, Spot Trends: You're on social media daily. When you see trending formats or ideas that could work for a painting company, flag them. This keeps our content fresh and relevant. Third, Monitor Engagement: Check the Analytics tab weekly. Note which posts are winning and which are underperforming. This data drives our optimization decisions. Fourth, Curate the Library: Browse the Content Catalog regularly. Flag outdated images, suggest new pairings, and keep the library fresh. Quality in equals quality out.`,
        section3: `Section 3: What I'm Still Connecting. Step 1, Manual Rotation, is current. Setting up the first content rotation manually to establish the baseline. Step 2, Meta API Connection, is in progress. Working on getting the direct API connection to Meta set up. Step 3, Full Automation, is coming next.`,
        section4: `Section 4: Where We're Headed. The Marketing AI will handle Content Suggestions, Smart Scheduling, Performance Alerts, and Ad Optimization automatically.`,
        section5: `Section 5: How We Stay In Sync. Use the Team Notes tab to leave messages. For example, you post: "Hey, updated next week's Nextdoor post." I reply: "Got it, scheduled for next week." Everyone sees the notes and stays in the loop. The goal is efficiency. The system runs like a carousel, it never stops.`,
      };
    }
    // Developer view - Marketing Director with multi-tenant access
    if (isDeveloperRole) {
      return {
        welcome: `Welcome back, ${userName}. Marketing Director view for ${tenantName}. Use the tenant switcher to manage NPP and Lume marketing operations. Full access to content, analytics, scheduling, and automation across all properties.`,
        section1: `Content Library: Over 100 marketing images organized by category. AI-powered caption generation. Visual content catalog with scheduling calendar.`,
        section2: `Analytics: Real-time performance tracking, engagement metrics, and platform breakdowns. Monitor what's working across all tenants.`,
        section3: `Automation Status: Manual rotation active. Meta API integration in progress. Full automation coming soon.`,
        section4: `Roadmap: AI content suggestions, smart scheduling, performance alerts, and ad optimization.`,
        section5: `Multi-Tenant Access: Switch between NPP and Lume using the tenant selector. All analytics are tenant-separated.`,
      };
    }
    // Owner and Admin view
    return {
      welcome: `Welcome back, ${userName}. You're viewing the Marketing Hub for ${tenantName}. Use the tenant switcher above to switch between NPP and Lume. This dashboard gives you visibility into marketing operations and performance.`,
      section1: `Content Library: Over 100 marketing images organized by category. AI-powered caption generation. Visual content catalog with scheduling calendar.`,
      section2: `Analytics: Real-time performance tracking, engagement metrics, and platform breakdowns. Monitor what's working across all tenants.`,
      section3: `Automation Status: Manual rotation active. Meta API integration in progress. Full automation coming soon.`,
      section4: `Roadmap: AI content suggestions, smart scheduling, performance alerts, and ad optimization.`,
      section5: `Multi-Tenant Access: Switch between NPP and Lume using the tenant selector. All analytics are tenant-separated.`,
    };
  };

  const sectionContent = getSectionContent();

  // Strip emojis from text for clean voice output
  const stripEmojis = (text: string): string => {
    // Remove common emoji ranges and special characters
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')  // Misc symbols, emoticons, dingbats
      .replace(/[\u{2600}-\u{26FF}]/gu, '')    // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, '')    // Dingbats
      .replace(/[\u{FE00}-\u{FE0F}]/gu, '')    // Variation selectors
      .replace(/[\u{1F000}-\u{1F02F}]/gu, '')  // Mahjong tiles
      .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '')  // Playing cards
      .replace(/\s+/g, ' ')
      .trim();
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

  // Check for saved session on mount (30-day persistence)
  useEffect(() => {
    const savedSession = localStorage.getItem("marketing_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.expiry && new Date(session.expiry) > new Date()) {
          setIsAuthenticated(true);
          setUserRole(session.role);
          setUserName(session.name);
        } else {
          // Session expired, clear it
          localStorage.removeItem("marketing_session");
        }
      } catch (e) {
        localStorage.removeItem("marketing_session");
      }
    }
  }, []);

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

    // Load DAM data
    const savedImages = localStorage.getItem("marketing_images");
    if (savedImages) {
      setLibraryImages(JSON.parse(savedImages));
    } else {
      // Full image library - 60 NPP + 60 Lume = 120 total
      const nppImages: LibraryImage[] = [
        // NPP Interior Walls (15)
        { id: "npp-int-1", brand: "npp", url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop", description: "Living room transformation - fresh white walls", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["living room", "white", "modern"], createdAt: new Date().toISOString() },
        { id: "npp-int-2", brand: "npp", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop", description: "Modern apartment interior refresh", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["apartment", "modern", "clean"], createdAt: new Date().toISOString() },
        { id: "npp-int-3", brand: "npp", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop", description: "Bedroom accent wall in navy", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["bedroom", "accent wall", "navy"], createdAt: new Date().toISOString() },
        { id: "npp-int-4", brand: "npp", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop", description: "Kitchen walls bright and clean", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["kitchen", "bright", "clean"], createdAt: new Date().toISOString() },
        { id: "npp-int-5", brand: "npp", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop", description: "Master bedroom calming colors", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["bedroom", "calming", "neutral"], createdAt: new Date().toISOString() },
        { id: "npp-int-6", brand: "npp", url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop", description: "Home office professional finish", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["office", "professional", "home"], createdAt: new Date().toISOString() },
        { id: "npp-int-7", brand: "npp", url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop", description: "Guest bedroom welcoming warmth", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["bedroom", "warm", "welcoming"], createdAt: new Date().toISOString() },
        { id: "npp-int-8", brand: "npp", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", description: "Bathroom fresh paint update", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["bathroom", "fresh", "update"], createdAt: new Date().toISOString() },
        { id: "npp-int-9", brand: "npp", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", description: "Open concept living space", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["open concept", "living", "modern"], createdAt: new Date().toISOString() },
        { id: "npp-int-10", brand: "npp", url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop", description: "Dining room elegant finish", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["dining", "elegant", "formal"], createdAt: new Date().toISOString() },
        { id: "npp-int-11", brand: "npp", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop", description: "Hallway bright transformation", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["hallway", "bright", "clean"], createdAt: new Date().toISOString() },
        { id: "npp-int-12", brand: "npp", url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop", description: "Nursery soft colors", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["nursery", "soft", "baby"], createdAt: new Date().toISOString() },
        { id: "npp-int-13", brand: "npp", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop", description: "Laundry room refresh", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["laundry", "clean", "bright"], createdAt: new Date().toISOString() },
        { id: "npp-int-14", brand: "npp", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop", description: "Basement family room makeover", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["basement", "family room", "cozy"], createdAt: new Date().toISOString() },
        { id: "npp-int-15", brand: "npp", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop", description: "Sunroom cheerful update", subject: "interior-walls", style: "finished-result", season: "spring", quality: 5, tags: ["sunroom", "cheerful", "bright"], createdAt: new Date().toISOString() },
        // NPP Exterior (15)
        { id: "npp-ext-1", brand: "npp", url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop", description: "Exterior home curb appeal boost", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["exterior", "curb appeal", "home"], createdAt: new Date().toISOString() },
        { id: "npp-ext-2", brand: "npp", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop", description: "Modern home exterior finish", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["modern", "exterior", "sleek"], createdAt: new Date().toISOString() },
        { id: "npp-ext-3", brand: "npp", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop", description: "Traditional home fresh paint", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["traditional", "classic", "home"], createdAt: new Date().toISOString() },
        { id: "npp-ext-4", brand: "npp", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", description: "Luxury home exterior detail", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["luxury", "detail", "premium"], createdAt: new Date().toISOString() },
        { id: "npp-ext-5", brand: "npp", url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop", description: "Suburban home transformation", subject: "exterior-home", style: "before-after", season: "summer", quality: 5, tags: ["suburban", "family", "transformation"], createdAt: new Date().toISOString() },
        { id: "npp-ext-6", brand: "npp", url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop", description: "Colonial style home repaint", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 4, tags: ["colonial", "classic", "repaint"], createdAt: new Date().toISOString() },
        { id: "npp-ext-7", brand: "npp", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop", description: "Ranch home exterior update", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 4, tags: ["ranch", "single story", "update"], createdAt: new Date().toISOString() },
        { id: "npp-ext-8", brand: "npp", url: "https://images.unsplash.com/photo-1600573472572-8aba7a8a1a6b?w=400&h=300&fit=crop", description: "Craftsman home character preserved", subject: "exterior-home", style: "finished-result", season: "fall", quality: 5, tags: ["craftsman", "character", "detail"], createdAt: new Date().toISOString() },
        { id: "npp-ext-9", brand: "npp", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&h=300&fit=crop", description: "Two-story home complete repaint", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["two-story", "complete", "family"], createdAt: new Date().toISOString() },
        { id: "npp-ext-10", brand: "npp", url: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop", description: "Porch and siding refresh", subject: "exterior-home", style: "finished-result", season: "spring", quality: 4, tags: ["porch", "siding", "refresh"], createdAt: new Date().toISOString() },
        { id: "npp-ext-11", brand: "npp", url: "https://images.unsplash.com/photo-1600566752447-f4e219adffef?w=400&h=300&fit=crop", description: "Garage door and trim update", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 4, tags: ["garage", "trim", "detail"], createdAt: new Date().toISOString() },
        { id: "npp-ext-12", brand: "npp", url: "https://images.unsplash.com/photo-1600607688066-890987f18a86?w=400&h=300&fit=crop", description: "Front entry makeover", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["entry", "front door", "welcoming"], createdAt: new Date().toISOString() },
        { id: "npp-ext-13", brand: "npp", url: "https://images.unsplash.com/photo-1600566752734-2a0cd58f8e68?w=400&h=300&fit=crop", description: "Shutters and accent colors", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 4, tags: ["shutters", "accent", "color"], createdAt: new Date().toISOString() },
        { id: "npp-ext-14", brand: "npp", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop", description: "Historic home preservation", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["historic", "preservation", "classic"], createdAt: new Date().toISOString() },
        { id: "npp-ext-15", brand: "npp", url: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&h=300&fit=crop", description: "New construction final paint", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["new construction", "final", "fresh"], createdAt: new Date().toISOString() },
        // NPP Cabinets (10)
        { id: "npp-cab-1", brand: "npp", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", description: "White kitchen cabinet refresh", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["kitchen", "white", "cabinets"], createdAt: new Date().toISOString() },
        { id: "npp-cab-2", brand: "npp", url: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&h=300&fit=crop", description: "Navy blue cabinet transformation", subject: "cabinet-work", style: "before-after", season: "all-year", quality: 5, tags: ["navy", "modern", "transformation"], createdAt: new Date().toISOString() },
        { id: "npp-cab-3", brand: "npp", url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=300&fit=crop", description: "Bathroom vanity update", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["bathroom", "vanity", "update"], createdAt: new Date().toISOString() },
        { id: "npp-cab-4", brand: "npp", url: "https://images.unsplash.com/photo-1556909190-bdbce8b8ad87?w=400&h=300&fit=crop", description: "Built-in shelving refinish", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["built-in", "shelving", "refinish"], createdAt: new Date().toISOString() },
        { id: "npp-cab-5", brand: "npp", url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop", description: "Laundry room cabinets bright", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["laundry", "bright", "functional"], createdAt: new Date().toISOString() },
        { id: "npp-cab-6", brand: "npp", url: "https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=400&h=300&fit=crop", description: "Pantry cabinet organization", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["pantry", "organization", "clean"], createdAt: new Date().toISOString() },
        { id: "npp-cab-7", brand: "npp", url: "https://images.unsplash.com/photo-1556909114-c0ed1b2f60f3?w=400&h=300&fit=crop", description: "Gray kitchen cabinet elegance", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["gray", "elegant", "modern"], createdAt: new Date().toISOString() },
        { id: "npp-cab-8", brand: "npp", url: "https://images.unsplash.com/photo-1556909253-5c2a2e3e5c0e?w=400&h=300&fit=crop", description: "Two-tone cabinet design", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["two-tone", "design", "trendy"], createdAt: new Date().toISOString() },
        { id: "npp-cab-9", brand: "npp", url: "https://images.unsplash.com/photo-1556909114-4e7e70034e0a?w=400&h=300&fit=crop", description: "Office built-in cabinetry", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["office", "built-in", "professional"], createdAt: new Date().toISOString() },
        { id: "npp-cab-10", brand: "npp", url: "https://images.unsplash.com/photo-1556909200-ff7c1ab5a00d?w=400&h=300&fit=crop", description: "Entertainment center refinish", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["entertainment", "living room", "refinish"], createdAt: new Date().toISOString() },
        // NPP Trim/Doors (10)
        { id: "npp-trim-1", brand: "npp", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", description: "Crown molding detail work", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["crown molding", "detail", "elegant"], createdAt: new Date().toISOString() },
        { id: "npp-trim-2", brand: "npp", url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop", description: "Baseboard refresh clean lines", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 4, tags: ["baseboard", "clean", "crisp"], createdAt: new Date().toISOString() },
        { id: "npp-trim-3", brand: "npp", url: "https://images.unsplash.com/photo-1558618140-f0c2c6b09ec6?w=400&h=300&fit=crop", description: "Window trim precision", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 4, tags: ["window", "trim", "precision"], createdAt: new Date().toISOString() },
        { id: "npp-trim-4", brand: "npp", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", description: "Door frame refinish", subject: "door-painting", style: "finished-result", season: "all-year", quality: 4, tags: ["door frame", "refinish", "detail"], createdAt: new Date().toISOString() },
        { id: "npp-trim-5", brand: "npp", url: "https://images.unsplash.com/photo-1558618669-5c9e5b10f0f4?w=400&h=300&fit=crop", description: "Interior doors bold color", subject: "door-painting", style: "finished-result", season: "all-year", quality: 5, tags: ["interior doors", "bold", "statement"], createdAt: new Date().toISOString() },
        { id: "npp-trim-6", brand: "npp", url: "https://images.unsplash.com/photo-1558618693-df6f9b19c90d?w=400&h=300&fit=crop", description: "Front door welcoming red", subject: "door-painting", style: "finished-result", season: "all-year", quality: 5, tags: ["front door", "red", "welcoming"], createdAt: new Date().toISOString() },
        { id: "npp-trim-7", brand: "npp", url: "https://images.unsplash.com/photo-1558618723-d41614eb9423?w=400&h=300&fit=crop", description: "Stair railing refresh", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 4, tags: ["stairs", "railing", "refresh"], createdAt: new Date().toISOString() },
        { id: "npp-trim-8", brand: "npp", url: "https://images.unsplash.com/photo-1558618776-5e0d0f91d8b4?w=400&h=300&fit=crop", description: "Wainscoting classic elegance", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["wainscoting", "classic", "elegant"], createdAt: new Date().toISOString() },
        { id: "npp-trim-9", brand: "npp", url: "https://images.unsplash.com/photo-1558618798-7b9f1a2cc4a5?w=400&h=300&fit=crop", description: "Black interior doors modern", subject: "door-painting", style: "finished-result", season: "all-year", quality: 5, tags: ["black doors", "modern", "contrast"], createdAt: new Date().toISOString() },
        { id: "npp-trim-10", brand: "npp", url: "https://images.unsplash.com/photo-1558618839-7ac9a77d2f5b?w=400&h=300&fit=crop", description: "Fireplace mantel refinish", subject: "trim-detail", style: "finished-result", season: "fall", quality: 5, tags: ["fireplace", "mantel", "cozy"], createdAt: new Date().toISOString() },
        // NPP Commercial/General (10)
        { id: "npp-com-1", brand: "npp", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", description: "Office building lobby fresh", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["office", "commercial", "professional"], createdAt: new Date().toISOString() },
        { id: "npp-com-2", brand: "npp", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop", description: "Retail storefront update", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["retail", "storefront", "business"], createdAt: new Date().toISOString() },
        { id: "npp-com-3", brand: "npp", url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop", description: "Restaurant interior ambiance", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["restaurant", "ambiance", "dining"], createdAt: new Date().toISOString() },
        { id: "npp-com-4", brand: "npp", url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop", description: "Medical office clean professional", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 4, tags: ["medical", "clean", "professional"], createdAt: new Date().toISOString() },
        { id: "npp-com-5", brand: "npp", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", description: "Conference room executive finish", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["conference", "executive", "corporate"], createdAt: new Date().toISOString() },
        { id: "npp-gen-1", brand: "npp", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", description: "Paint swatches color selection", subject: "general", style: "action-shot", season: "all-year", quality: 4, tags: ["swatches", "colors", "selection"], createdAt: new Date().toISOString() },
        { id: "npp-gen-2", brand: "npp", url: "https://images.unsplash.com/photo-1558618044-8b2f26e6f2d8?w=400&h=300&fit=crop", description: "Professional painter at work", subject: "team-action", style: "action-shot", season: "all-year", quality: 5, tags: ["painter", "professional", "work"], createdAt: new Date().toISOString() },
        { id: "npp-gen-3", brand: "npp", url: "https://images.unsplash.com/photo-1558618072-3d0c3c2c0e8c?w=400&h=300&fit=crop", description: "Team collaboration on site", subject: "team-action", style: "action-shot", season: "all-year", quality: 5, tags: ["team", "collaboration", "site"], createdAt: new Date().toISOString() },
        { id: "npp-gen-4", brand: "npp", url: "https://images.unsplash.com/photo-1558618106-4f4c5f0f3e9d?w=400&h=300&fit=crop", description: "Before and after dramatic", subject: "before-after", style: "before-after", season: "all-year", quality: 5, tags: ["before after", "dramatic", "transformation"], createdAt: new Date().toISOString() },
        { id: "npp-gen-5", brand: "npp", url: "https://images.unsplash.com/photo-1558618141-ef3c7c2d06f9?w=400&h=300&fit=crop", description: "Color consultation service", subject: "general", style: "action-shot", season: "all-year", quality: 4, tags: ["consultation", "color", "service"], createdAt: new Date().toISOString() },
      ];
      
      const lumeImages: LibraryImage[] = [
        // Lume Interior Walls (15)
        { id: "lume-int-1", brand: "lumepaint", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", description: "Elevated living space design", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["elevated", "design", "living"], createdAt: new Date().toISOString() },
        { id: "lume-int-2", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop", description: "Sophisticated bedroom retreat", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["sophisticated", "bedroom", "retreat"], createdAt: new Date().toISOString() },
        { id: "lume-int-3", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop", description: "Minimalist aesthetic walls", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["minimalist", "aesthetic", "clean"], createdAt: new Date().toISOString() },
        { id: "lume-int-4", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=400&h=300&fit=crop", description: "Warm neutral palette living", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["warm", "neutral", "inviting"], createdAt: new Date().toISOString() },
        { id: "lume-int-5", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop", description: "Luxury master suite finish", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["luxury", "master suite", "premium"], createdAt: new Date().toISOString() },
        { id: "lume-int-6", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?w=400&h=300&fit=crop", description: "Zen bathroom sanctuary", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["zen", "bathroom", "sanctuary"], createdAt: new Date().toISOString() },
        { id: "lume-int-7", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop", description: "Home office inspiration", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["office", "inspiration", "productivity"], createdAt: new Date().toISOString() },
        { id: "lume-int-8", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600607688066-890987f18a86?w=400&h=300&fit=crop", description: "Dining room sophistication", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["dining", "sophisticated", "entertaining"], createdAt: new Date().toISOString() },
        { id: "lume-int-9", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop", description: "Reading nook cozy corner", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["reading nook", "cozy", "corner"], createdAt: new Date().toISOString() },
        { id: "lume-int-10", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop", description: "Kids room playful colors", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["kids", "playful", "fun"], createdAt: new Date().toISOString() },
        { id: "lume-int-11", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop", description: "Gallery wall backdrop", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["gallery", "art", "backdrop"], createdAt: new Date().toISOString() },
        { id: "lume-int-12", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop", description: "Entryway first impression", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 5, tags: ["entryway", "first impression", "welcoming"], createdAt: new Date().toISOString() },
        { id: "lume-int-13", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566752447-f4e219adffef?w=400&h=300&fit=crop", description: "Mudroom organized style", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["mudroom", "organized", "functional"], createdAt: new Date().toISOString() },
        { id: "lume-int-14", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566752734-2a0cd58f8e68?w=400&h=300&fit=crop", description: "Closet organization upgrade", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["closet", "organization", "upgrade"], createdAt: new Date().toISOString() },
        { id: "lume-int-15", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=400&h=300&fit=crop", description: "Bonus room versatile space", subject: "interior-walls", style: "finished-result", season: "all-year", quality: 4, tags: ["bonus room", "versatile", "flexible"], createdAt: new Date().toISOString() },
        // Lume Exterior (15)
        { id: "lume-ext-1", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop", description: "Elegant home exterior elevation", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["elegant", "elevation", "curb appeal"], createdAt: new Date().toISOString() },
        { id: "lume-ext-2", brand: "lumepaint", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop", description: "Contemporary architecture paint", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["contemporary", "architecture", "modern"], createdAt: new Date().toISOString() },
        { id: "lume-ext-3", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop", description: "Charming cottage exterior", subject: "exterior-home", style: "finished-result", season: "spring", quality: 5, tags: ["cottage", "charming", "quaint"], createdAt: new Date().toISOString() },
        { id: "lume-ext-4", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600573472572-8aba7a8a1a6b?w=400&h=300&fit=crop", description: "Farmhouse style refresh", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 5, tags: ["farmhouse", "style", "rustic"], createdAt: new Date().toISOString() },
        { id: "lume-ext-5", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&h=300&fit=crop", description: "Mediterranean villa tones", subject: "exterior-home", style: "finished-result", season: "summer", quality: 5, tags: ["mediterranean", "villa", "warm"], createdAt: new Date().toISOString() },
        { id: "lume-ext-6", brand: "lumepaint", url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop", description: "Beach house coastal colors", subject: "exterior-home", style: "finished-result", season: "summer", quality: 5, tags: ["beach", "coastal", "relaxed"], createdAt: new Date().toISOString() },
        { id: "lume-ext-7", brand: "lumepaint", url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop", description: "Mountain retreat exterior", subject: "exterior-home", style: "finished-result", season: "fall", quality: 5, tags: ["mountain", "retreat", "nature"], createdAt: new Date().toISOString() },
        { id: "lume-ext-8", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop", description: "Urban townhome update", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 4, tags: ["urban", "townhome", "city"], createdAt: new Date().toISOString() },
        { id: "lume-ext-9", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&h=300&fit=crop", description: "Lakefront property beauty", subject: "exterior-home", style: "finished-result", season: "summer", quality: 5, tags: ["lakefront", "waterfront", "scenic"], createdAt: new Date().toISOString() },
        { id: "lume-ext-10", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566752734-2a0cd58f8e68?w=400&h=300&fit=crop", description: "Garden shed charming update", subject: "exterior-home", style: "finished-result", season: "spring", quality: 4, tags: ["shed", "garden", "charming"], createdAt: new Date().toISOString() },
        { id: "lume-ext-11", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566752447-f4e219adffef?w=400&h=300&fit=crop", description: "Fence and gate refresh", subject: "exterior-home", style: "finished-result", season: "all-year", quality: 4, tags: ["fence", "gate", "boundary"], createdAt: new Date().toISOString() },
        { id: "lume-ext-12", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600607688066-890987f18a86?w=400&h=300&fit=crop", description: "Pergola outdoor living", subject: "deck-staining", style: "finished-result", season: "summer", quality: 5, tags: ["pergola", "outdoor", "entertainment"], createdAt: new Date().toISOString() },
        { id: "lume-ext-13", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop", description: "Pool house cabana style", subject: "exterior-home", style: "finished-result", season: "summer", quality: 5, tags: ["pool house", "cabana", "resort"], createdAt: new Date().toISOString() },
        { id: "lume-ext-14", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop", description: "Greenhouse glass and trim", subject: "exterior-home", style: "finished-result", season: "spring", quality: 4, tags: ["greenhouse", "garden", "botanical"], createdAt: new Date().toISOString() },
        { id: "lume-ext-15", brand: "lumepaint", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop", description: "Outdoor kitchen setup", subject: "exterior-home", style: "finished-result", season: "summer", quality: 5, tags: ["outdoor kitchen", "cooking", "entertaining"], createdAt: new Date().toISOString() },
        // Lume Cabinets (10)
        { id: "lume-cab-1", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", description: "Designer kitchen cabinets", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["designer", "kitchen", "luxury"], createdAt: new Date().toISOString() },
        { id: "lume-cab-2", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&h=300&fit=crop", description: "Sage green cabinet trend", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["sage", "green", "trendy"], createdAt: new Date().toISOString() },
        { id: "lume-cab-3", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=300&fit=crop", description: "Bathroom double vanity luxury", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["double vanity", "luxury", "spa"], createdAt: new Date().toISOString() },
        { id: "lume-cab-4", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909190-bdbce8b8ad87?w=400&h=300&fit=crop", description: "Butler pantry organization", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["butler pantry", "organization", "luxury"], createdAt: new Date().toISOString() },
        { id: "lume-cab-5", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&h=300&fit=crop", description: "Wet bar cabinet elegance", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["wet bar", "entertaining", "elegant"], createdAt: new Date().toISOString() },
        { id: "lume-cab-6", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=400&h=300&fit=crop", description: "Walk-in closet built-ins", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["closet", "built-in", "luxury"], createdAt: new Date().toISOString() },
        { id: "lume-cab-7", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909114-c0ed1b2f60f3?w=400&h=300&fit=crop", description: "Library shelving classic", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["library", "shelving", "classic"], createdAt: new Date().toISOString() },
        { id: "lume-cab-8", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909253-5c2a2e3e5c0e?w=400&h=300&fit=crop", description: "Wine cellar cabinetry", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["wine cellar", "storage", "luxury"], createdAt: new Date().toISOString() },
        { id: "lume-cab-9", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909114-4e7e70034e0a?w=400&h=300&fit=crop", description: "Craft room storage solution", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 4, tags: ["craft room", "storage", "creative"], createdAt: new Date().toISOString() },
        { id: "lume-cab-10", brand: "lumepaint", url: "https://images.unsplash.com/photo-1556909200-ff7c1ab5a00d?w=400&h=300&fit=crop", description: "Media room cabinet design", subject: "cabinet-work", style: "finished-result", season: "all-year", quality: 5, tags: ["media room", "entertainment", "design"], createdAt: new Date().toISOString() },
        // Lume Trim/Doors (10)
        { id: "lume-trim-1", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", description: "Architectural molding detail", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["architectural", "molding", "detail"], createdAt: new Date().toISOString() },
        { id: "lume-trim-2", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop", description: "Custom millwork finishing", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["custom", "millwork", "craftsmanship"], createdAt: new Date().toISOString() },
        { id: "lume-trim-3", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618140-f0c2c6b09ec6?w=400&h=300&fit=crop", description: "French door elegance", subject: "door-painting", style: "finished-result", season: "all-year", quality: 5, tags: ["french doors", "elegant", "glass"], createdAt: new Date().toISOString() },
        { id: "lume-trim-4", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618669-5c9e5b10f0f4?w=400&h=300&fit=crop", description: "Statement entry door", subject: "door-painting", style: "finished-result", season: "all-year", quality: 5, tags: ["entry", "statement", "grand"], createdAt: new Date().toISOString() },
        { id: "lume-trim-5", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618693-df6f9b19c90d?w=400&h=300&fit=crop", description: "Barn door rustic charm", subject: "door-painting", style: "finished-result", season: "all-year", quality: 5, tags: ["barn door", "rustic", "charm"], createdAt: new Date().toISOString() },
        { id: "lume-trim-6", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618723-d41614eb9423?w=400&h=300&fit=crop", description: "Grand staircase railing", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["staircase", "grand", "elegant"], createdAt: new Date().toISOString() },
        { id: "lume-trim-7", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618776-5e0d0f91d8b4?w=400&h=300&fit=crop", description: "Coffered ceiling luxury", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["coffered ceiling", "luxury", "architectural"], createdAt: new Date().toISOString() },
        { id: "lume-trim-8", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618798-7b9f1a2cc4a5?w=400&h=300&fit=crop", description: "Pocket doors space saving", subject: "door-painting", style: "finished-result", season: "all-year", quality: 4, tags: ["pocket doors", "space saving", "modern"], createdAt: new Date().toISOString() },
        { id: "lume-trim-9", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618839-7ac9a77d2f5b?w=400&h=300&fit=crop", description: "Picture frame wall panels", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["wall panels", "picture frame", "elegant"], createdAt: new Date().toISOString() },
        { id: "lume-trim-10", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618044-8b2f26e6f2d8?w=400&h=300&fit=crop", description: "Shiplap accent wall", subject: "trim-detail", style: "finished-result", season: "all-year", quality: 5, tags: ["shiplap", "accent", "texture"], createdAt: new Date().toISOString() },
        // Lume Commercial/General (10)
        { id: "lume-com-1", brand: "lumepaint", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", description: "Boutique hotel lobby", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["hotel", "boutique", "luxury"], createdAt: new Date().toISOString() },
        { id: "lume-com-2", brand: "lumepaint", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop", description: "Upscale salon interior", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["salon", "upscale", "beauty"], createdAt: new Date().toISOString() },
        { id: "lume-com-3", brand: "lumepaint", url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop", description: "Fine dining atmosphere", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["fine dining", "atmosphere", "elegant"], createdAt: new Date().toISOString() },
        { id: "lume-com-4", brand: "lumepaint", url: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop", description: "Spa wellness center", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["spa", "wellness", "relaxation"], createdAt: new Date().toISOString() },
        { id: "lume-com-5", brand: "lumepaint", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", description: "Art gallery exhibition space", subject: "commercial-space", style: "finished-result", season: "all-year", quality: 5, tags: ["gallery", "art", "exhibition"], createdAt: new Date().toISOString() },
        { id: "lume-gen-1", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", description: "Curated color palette", subject: "general", style: "action-shot", season: "all-year", quality: 5, tags: ["curated", "palette", "design"], createdAt: new Date().toISOString() },
        { id: "lume-gen-2", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618044-8b2f26e6f2d8?w=400&h=300&fit=crop", description: "Artisan craftsman at work", subject: "team-action", style: "action-shot", season: "all-year", quality: 5, tags: ["artisan", "craftsman", "skill"], createdAt: new Date().toISOString() },
        { id: "lume-gen-3", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618072-3d0c3c2c0e8c?w=400&h=300&fit=crop", description: "Expert team precision", subject: "team-action", style: "action-shot", season: "all-year", quality: 5, tags: ["expert", "precision", "team"], createdAt: new Date().toISOString() },
        { id: "lume-gen-4", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618106-4f4c5f0f3e9d?w=400&h=300&fit=crop", description: "Stunning transformation reveal", subject: "before-after", style: "before-after", season: "all-year", quality: 5, tags: ["transformation", "reveal", "stunning"], createdAt: new Date().toISOString() },
        { id: "lume-gen-5", brand: "lumepaint", url: "https://images.unsplash.com/photo-1558618141-ef3c7c2d06f9?w=400&h=300&fit=crop", description: "Design consultation session", subject: "general", style: "action-shot", season: "all-year", quality: 5, tags: ["design", "consultation", "expert"], createdAt: new Date().toISOString() },
      ];
      
      const allImages = [...nppImages, ...lumeImages];
      setLibraryImages(allImages);
      localStorage.setItem("marketing_images", JSON.stringify(allImages));
    }
    
    const savedMessages = localStorage.getItem("marketing_messages");
    if (savedMessages) {
      setMessageTemplates(JSON.parse(savedMessages));
    } else {
      // Sample messages for demonstration
      const sampleMessages: MessageTemplate[] = [
        {
          id: "msg-sample-1",
          brand: "npp",
          content: "Transform your space with a fresh coat of paint! Our expert team delivers stunning results every time. Contact us for a free estimate!",
          subject: "interior-walls",
          tone: "professional",
          callToAction: "quote",
          hashtags: ["#NashvillePainting", "#InteriorDesign", "#HomeImprovement"],
          createdAt: new Date().toISOString()
        },
        {
          id: "msg-sample-2",
          brand: "npp",
          content: "Boost your home's curb appeal with professional exterior painting. We use premium paints that last for years!",
          subject: "exterior-home",
          tone: "professional",
          callToAction: "quote",
          hashtags: ["#ExteriorPainting", "#CurbAppeal", "#NashvilleHomes"],
          createdAt: new Date().toISOString()
        },
        {
          id: "msg-sample-3",
          brand: "lumepaint",
          content: "Elevating the backdrop of your life, one room at a time. Let us bring your vision to life with color.",
          subject: "interior-walls",
          tone: "friendly",
          callToAction: "contact",
          hashtags: ["#LumePaint", "#ElevateYourSpace", "#ColorExperts"],
          createdAt: new Date().toISOString()
        }
      ];
      setMessageTemplates(sampleMessages);
      localStorage.setItem("marketing_messages", JSON.stringify(sampleMessages));
    }
    
    const savedBundles = localStorage.getItem("marketing_bundles");
    if (savedBundles) {
      setContentBundles(JSON.parse(savedBundles));
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
      
      if (data.success && (data.role === "marketing" || data.role === "developer" || data.role === "owner" || data.role === "admin" || data.role === "ops_manager")) {
        setIsAuthenticated(true);
        setUserRole(data.role);
        const roleNames: Record<string, string> = {
          marketing: "Logan",
          developer: "Jason", 
          owner: "Ryan",
          admin: "Sidonie",
          ops_manager: "Sidonie",
          project_manager: "PM",
          crew_lead: "Crew Lead",
        };
        const name = roleNames[data.role] || data.role;
        setUserName(name);
        setError("");
        setShowWelcomeModal(true);
        
        // Save session for 30 days if "Stay logged in" is checked
        if (stayLoggedIn) {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          localStorage.setItem("marketing_session", JSON.stringify({
            role: data.role,
            name: name,
            expiry: expiry.toISOString(),
          }));
        }
        
        if (data.mustChangePin) {
          setShowPinChange(true);
        }
      } else if (data.success) {
        setError("Access denied. Authorized personnel only.");
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

  // Website Analytics Query - Real traffic data
  const { data: websiteAnalytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery<{
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
  }>({
    queryKey: ["/api/analytics/dashboard", selectedTenant],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/dashboard?tenantId=${selectedTenant}`);
      if (!res.ok) return null;
      return res.json();
    },
    refetchInterval: 30000,
  });

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
                
                {/* Stay Logged In Option */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={stayLoggedIn}
                      onChange={(e) => setStayLoggedIn(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      data-testid="checkbox-stay-logged-in"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        Stay logged in for 30 days
                      </span>
                      {stayLoggedIn && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Only use on your personal device. Others with access to this browser can enter your dashboard.
                        </p>
                      )}
                    </div>
                  </label>
                </div>
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
                {selectedTenant === "npp" ? "Nashville Painting Professionals" : "Lume Paint Co"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {userName && (
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 border-purple-200">
                  {userName}
                </Badge>
              )}
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
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-red-600"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
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
            <TabsList className="flex flex-wrap gap-1 mb-6 h-auto p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
                <Sparkles className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2" data-testid="tab-images">
                <ImageIcon className="w-4 h-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2" data-testid="tab-messages">
                <MessageSquare className="w-4 h-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="bundles" className="flex items-center gap-2" data-testid="tab-bundles">
                <Layers className="w-4 h-4" />
                AI Bundles
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
              <TabsTrigger value="notes" className="flex items-center gap-2" data-testid="tab-notes">
                <FileText className="w-4 h-4" />
                Notes
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

              {/* Intro Toggle - Show/Hide all intro content */}
              {introHidden ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Welcome guide hidden</p>
                      <p className="text-xs text-muted-foreground">You've read the intro. Focus on what matters.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={showIntro} data-testid="button-show-intro">
                    Show Guide Again
                  </Button>
                </div>
              ) : (
                <>
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
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Team Notes</p>
                      <p className="text-xs text-gray-500">Leave messages for the team, stay in sync</p>
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
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl mb-4">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    Use the Notes Tab
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    The <strong>Notes</strong> tab is where we leave messages for each other. Quick updates, reminders, ideas - all in one place.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white">When you update content:</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Post a note: "Hey, updated next week's Nextdoor post."</p>
                  </div>
                  <div className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-900 dark:text-white">When I update content:</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">I'll post: "Got it, scheduled for next week. Also added spring promo content."</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    The goal is efficiency. Everyone sees the notes, everyone stays in the loop. 
                    The system runs like a carousel - it never stops.
                  </p>
                </div>
              </GlassCard>

                  {/* Dismiss Intro Button */}
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={hideIntro}
                      className="text-muted-foreground"
                      data-testid="button-hide-intro"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Got it - Hide this guide
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* IMAGES TAB - Image Library with Tags */}
            <TabsContent value="images" className="space-y-6">
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-500" />
                      Image Library
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tagged images that the AI can match with message templates
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={imageSubjectFilter} onValueChange={setImageSubjectFilter}>
                      <SelectTrigger className="w-40" data-testid="select-image-subject">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {IMAGE_SUBJECTS.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowAddImageModal(true)} data-testid="button-add-image">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Image
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {libraryImages.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Images Yet</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Add images to your library with subject tags. The AI will use these tags to match images with appropriate messages.
                  </p>
                  <Button onClick={() => setShowAddImageModal(true)} data-testid="button-add-first-image">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Image
                  </Button>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {libraryImages
                    .filter(img => img.brand === selectedTenant)
                    .filter(img => imageSubjectFilter === "all" || img.subject === imageSubjectFilter)
                    .map(img => (
                      <GlassCard key={img.id} className="p-2 overflow-hidden" data-testid={`card-library-image-${img.id}`}>
                        <img src={img.url} alt={img.description} className="w-full h-32 object-cover rounded-lg mb-2" />
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{img.description}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">{IMAGE_SUBJECTS.find(s => s.id === img.subject)?.label}</Badge>
                            <Badge variant="outline" className="text-xs">{img.style}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(n => (
                              <Star key={n} className={`w-3 h-3 ${n <= img.quality ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                </div>
              )}
            </TabsContent>

            {/* MESSAGES TAB - Message Templates with Tags */}
            <TabsContent value="messages" className="space-y-6">
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      Message Templates
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Captions and messages the AI can pair with matching images
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select value={messageSubjectFilter} onValueChange={setMessageSubjectFilter}>
                      <SelectTrigger className="w-40" data-testid="select-message-subject">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {IMAGE_SUBJECTS.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowAddMessageModal(true)} data-testid="button-add-message">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Message
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {messageTemplates.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Message Templates Yet</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Add message templates with subject tags. The AI will match these with images that share the same subject.
                  </p>
                  <Button onClick={() => setShowAddMessageModal(true)} data-testid="button-add-first-message">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Message
                  </Button>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {messageTemplates
                    .filter(msg => msg.brand === selectedTenant)
                    .filter(msg => messageSubjectFilter === "all" || msg.subject === messageSubjectFilter)
                    .map(msg => (
                      <GlassCard key={msg.id} className="p-4" data-testid={`card-message-template-${msg.id}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white mb-2">{msg.content}</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary">{IMAGE_SUBJECTS.find(s => s.id === msg.subject)?.label}</Badge>
                              <Badge variant="outline">{MESSAGE_TONES.find(t => t.id === msg.tone)?.label}</Badge>
                              {msg.cta !== "none" && <Badge className="bg-green-100 text-green-800">{MESSAGE_CTAS.find(c => c.id === msg.cta)?.label}</Badge>}
                              {msg.hashtags.length > 0 && <Badge variant="outline" className="text-blue-600">{msg.hashtags.length} hashtags</Badge>}
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" data-testid={`button-edit-message-${msg.id}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </GlassCard>
                    ))}
                </div>
              )}
            </TabsContent>

            {/* AI BUNDLES TAB - Smart Matching */}
            <TabsContent value="bundles" className="space-y-6">
              <GlassCard className="p-4">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-pink-500" />
                      AI Content Bundles
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Smart image + message combinations created by AI based on matching tags
                    </p>
                  </div>
                  <Button 
                    onClick={async () => {
                      setIsGeneratingMatch(true);
                      // AI matching logic - match images with messages by subject
                      const tenantImages = libraryImages.filter(img => img.brand === selectedTenant);
                      const tenantMessages = messageTemplates.filter(msg => msg.brand === selectedTenant);
                      const newBundles: ContentBundle[] = [];
                      
                      for (const image of tenantImages) {
                        const matchingMessages = tenantMessages.filter(msg => msg.subject === image.subject);
                        for (const msg of matchingMessages) {
                          // Check if this combination already exists
                          const exists = contentBundles.some(b => b.imageId === image.id && b.messageId === msg.id);
                          if (!exists) {
                            newBundles.push({
                              id: `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                              imageId: image.id,
                              messageId: msg.id,
                              brand: selectedTenant as "npp" | "lumepaint",
                              platform: msg.platform,
                              status: "suggested",
                              createdAt: new Date().toISOString(),
                            });
                          }
                        }
                      }
                      
                      const updated = [...contentBundles, ...newBundles];
                      setContentBundles(updated);
                      localStorage.setItem("marketing_bundles", JSON.stringify(updated));
                      setIsGeneratingMatch(false);
                    }}
                    disabled={isGeneratingMatch || libraryImages.length === 0 || messageTemplates.length === 0}
                    data-testid="button-generate-bundles"
                  >
                    {isGeneratingMatch ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-1" />
                        Generate Bundles
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>

              {(libraryImages.length === 0 || messageTemplates.length === 0) ? (
                <GlassCard className="p-8 text-center">
                  <Layers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Content First</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You need both images and message templates before the AI can create bundles. 
                    Add at least one image and one message to get started.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => setActiveTab("images")}>
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Add Images
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("messages")}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Add Messages
                    </Button>
                  </div>
                </GlassCard>
              ) : contentBundles.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Wand2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Generate</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Click "Generate Bundles" to have the AI create smart image + message combinations based on matching subject tags.
                  </p>
                </GlassCard>
              ) : (
                <div className="space-y-4">
                  {contentBundles
                    .filter(b => b.brand === selectedTenant)
                    .map(bundle => {
                      const image = libraryImages.find(i => i.id === bundle.imageId);
                      const message = messageTemplates.find(m => m.id === bundle.messageId);
                      return (
                        <GlassCard key={bundle.id} className="p-4" data-testid={`card-content-bundle-${bundle.id}`}>
                          <div className="flex gap-4">
                            {image && (
                              <img src={image.url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={bundle.status === "approved" ? "bg-green-500" : bundle.status === "suggested" ? "bg-yellow-500" : "bg-blue-500"}>
                                  {bundle.status}
                                </Badge>
                                <Badge variant="outline">{bundle.platform}</Badge>
                              </div>
                              <p className="text-sm text-gray-900 dark:text-white mb-2" data-testid={`text-bundle-content-${bundle.id}`}>{message?.content}</p>
                              {bundle.status === "suggested" && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-green-500"
                                    data-testid={`button-approve-bundle-${bundle.id}`}
                                    onClick={() => {
                                      const updated = contentBundles.map(b => 
                                        b.id === bundle.id ? { ...b, status: "approved" as const } : b
                                      );
                                      setContentBundles(updated);
                                      localStorage.setItem("marketing_bundles", JSON.stringify(updated));
                                    }}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline" data-testid={`button-edit-bundle-${bundle.id}`}>
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </GlassCard>
                      );
                    })}
                </div>
              )}
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

              {/* Recharts Visualizations */}
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard className="p-6" data-testid="analytics-posting-trend-chart">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Posting Activity (Last 14 Days)
                  </h3>
                  {(() => {
                    const tenantPosts = posts.filter(p => p.brand === selectedTenant);
                    const today = new Date();
                    const trendData = eachDayOfInterval({
                      start: subDays(today, 13),
                      end: today
                    }).map(day => {
                      const posted = tenantPosts.filter(p => 
                        p.status === "posted" && p.lastUsed && isSameDay(new Date(p.lastUsed), day)
                      ).length;
                      const scheduled = tenantPosts.filter(p => 
                        p.status === "scheduled" && p.scheduledDate && isSameDay(new Date(p.scheduledDate), day)
                      ).length;
                      return {
                        date: format(day, 'MM/dd'),
                        Posted: posted,
                        Scheduled: scheduled,
                        total: posted + scheduled
                      };
                    });
                    return (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,136,136,0.2)" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="rgba(136,136,136,0.5)" />
                          <YAxis tick={{ fontSize: 10 }} stroke="rgba(136,136,136,0.5)" allowDecimals={false} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: 'none', 
                              borderRadius: '8px',
                              fontSize: '12px'
                            }} 
                          />
                          <Line type="monotone" dataKey="Posted" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
                          <Line type="monotone" dataKey="Scheduled" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </GlassCard>

                <GlassCard className="p-6" data-testid="analytics-category-bar-chart">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Content by Category
                  </h3>
                  {(() => {
                    const tenantPosts = posts.filter(p => p.brand === selectedTenant);
                    const categoryData = CATEGORIES.map(cat => ({
                      name: cat.label.length > 8 ? cat.label.slice(0, 8) + '...' : cat.label,
                      count: tenantPosts.filter(p => p.category === cat.id).length
                    })).filter(d => d.count > 0);
                    
                    const COLORS = ['#ec4899', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'];
                    
                    return (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={categoryData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(136,136,136,0.2)" />
                          <XAxis type="number" tick={{ fontSize: 10 }} stroke="rgba(136,136,136,0.5)" allowDecimals={false} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="rgba(136,136,136,0.5)" width={70} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: 'none', 
                              borderRadius: '8px',
                              fontSize: '12px'
                            }} 
                          />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </GlassCard>
              </div>

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

              {/* Google Analytics Integration Section */}
              <GlassCard className="p-6 border-2 border-dashed border-blue-300 dark:border-blue-700" data-testid="analytics-ga-integration">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Google Analytics Integration
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-300">
                    Coming Soon
                  </Badge>
                </div>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">--</p>
                    <p className="text-xs text-muted-foreground">Live Visitors</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">--</p>
                    <p className="text-xs text-muted-foreground">Page Views (7d)</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">--</p>
                    <p className="text-xs text-muted-foreground">Avg Session</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-amber-600">--</p>
                    <p className="text-xs text-muted-foreground">Bounce Rate</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Traffic Trend (30 Days)
                    </h4>
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Connect GA4 to see traffic data</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      Top Referrers
                    </h4>
                    <div className="space-y-2">
                      {["Google Search", "Facebook", "Instagram", "Direct", "Nextdoor"].map((source, idx) => (
                        <div key={source} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{source}</span>
                          <span className="font-mono text-muted-foreground">--</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>GA4 Integration:</strong> Once connected, you'll see real-time website traffic, 
                    top pages, referral sources, device breakdown, and conversion tracking all synced with your 
                    social media performance data.
                  </p>
                </div>
              </GlassCard>

              {/* Platform Distribution Pie Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard className="p-6" data-testid="analytics-platform-pie">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-500" />
                    Content Distribution by Platform
                  </h3>
                  {(() => {
                    const tenantPosts = posts.filter(p => p.brand === selectedTenant);
                    const platformData = PLATFORMS.map(platform => ({
                      name: platform.label,
                      value: tenantPosts.filter(p => p.platform === platform.id).length,
                      color: platform.id === "instagram" ? "#E1306C" : platform.id === "facebook" ? "#4267B2" : "#00B636"
                    })).filter(d => d.value > 0);
                    
                    if (platformData.length === 0) {
                      return (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No content data yet</p>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie
                              data={platformData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {platformData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(0,0,0,0.8)', 
                                border: 'none', 
                                borderRadius: '8px',
                                fontSize: '12px'
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-2">
                          {platformData.map(platform => (
                            <div key={platform.name} className="flex items-center gap-1.5 text-xs">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                              <span>{platform.name}</span>
                              <span className="font-bold">({platform.value})</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </GlassCard>

                <GlassCard className="p-6" data-testid="analytics-content-health">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    Content Health Score
                  </h3>
                  {(() => {
                    const tenantPosts = posts.filter(p => p.brand === selectedTenant);
                    const total = tenantPosts.length;
                    const posted = tenantPosts.filter(p => p.status === "posted").length;
                    const scheduled = tenantPosts.filter(p => p.status === "scheduled").length;
                    const evergreen = tenantPosts.filter(p => p.type === "evergreen").length;
                    const categoryCount = new Set(tenantPosts.map(p => p.category)).size;
                    const platformCount = new Set(tenantPosts.map(p => p.platform)).size;
                    
                    // Calculate health score (0-100)
                    const diversityScore = Math.min(categoryCount * 12, 30); // Max 30 points
                    const coverageScore = Math.min(platformCount * 10, 30); // Max 30 points
                    const evergreenScore = total > 0 ? Math.round((evergreen / total) * 20) : 0; // Max 20 points
                    const activityScore = Math.min((posted + scheduled) * 2, 20); // Max 20 points
                    const healthScore = diversityScore + coverageScore + evergreenScore + activityScore;
                    
                    const scoreColor = healthScore >= 80 ? "text-green-600" : healthScore >= 60 ? "text-blue-600" : healthScore >= 40 ? "text-amber-600" : "text-red-600";
                    const bgColor = healthScore >= 80 ? "from-green-500 to-emerald-400" : healthScore >= 60 ? "from-blue-500 to-cyan-400" : healthScore >= 40 ? "from-amber-500 to-orange-400" : "from-red-500 to-rose-400";
                    
                    return (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                              <circle 
                                cx="64" cy="64" r="56" fill="none" strokeWidth="8" 
                                strokeLinecap="round"
                                className={`text-transparent bg-gradient-to-r ${bgColor}`}
                                style={{ 
                                  stroke: healthScore >= 80 ? '#22c55e' : healthScore >= 60 ? '#3b82f6' : healthScore >= 40 ? '#f59e0b' : '#ef4444',
                                  strokeDasharray: `${healthScore * 3.52} 352` 
                                }}
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                              <span className={`text-3xl font-bold ${scoreColor}`}>{healthScore}</span>
                              <span className="text-xs text-muted-foreground">/ 100</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="font-medium">Diversity</p>
                            <p className="text-muted-foreground">{diversityScore}/30 pts</p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="font-medium">Coverage</p>
                            <p className="text-muted-foreground">{coverageScore}/30 pts</p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="font-medium">Evergreen</p>
                            <p className="text-muted-foreground">{evergreenScore}/20 pts</p>
                          </div>
                          <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="font-medium">Activity</p>
                            <p className="text-muted-foreground">{activityScore}/20 pts</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </GlassCard>
              </div>

              {/* Best Posting Times */}
              <GlassCard className="p-6" data-testid="analytics-best-times">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Recommended Posting Times
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {PLATFORMS.map(platform => (
                    <div key={platform.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                          <platform.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{platform.label}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Day</span>
                          <span className="font-medium">{platform.id === "instagram" ? "Wed, Fri" : platform.id === "facebook" ? "Thu, Sun" : "Sat"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Time</span>
                          <span className="font-medium">{platform.id === "instagram" ? "11am, 7pm" : platform.id === "facebook" ? "1pm, 8pm" : "10am"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequency</span>
                          <span className="font-medium text-green-600">3x/week</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    These recommendations are based on industry best practices for painting/home services. 
                    Once GA4 is connected, we'll optimize these based on your actual audience engagement data.
                  </p>
                </div>
              </GlassCard>

              {/* WEBSITE ANALYTICS - Real Traffic Data */}
              <GlassCard className="p-6" data-testid="analytics-website-traffic">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedTenant === "npp" ? "from-blue-500 to-indigo-600" : "from-purple-500 to-violet-600"} flex items-center justify-center`}>
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Website Traffic</h3>
                      <p className={`text-sm font-medium ${selectedTenant === "npp" ? "text-blue-600" : "text-purple-600"}`}>
                        {selectedTenant === "npp" ? "Nashville Painting Professionals" : "Lume Paint Co"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${selectedTenant === "npp" 
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-blue-200" 
                        : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 border-purple-200"}`}
                    >
                      {selectedTenant === "npp" ? "NPP" : "LUME"}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetchAnalytics()}
                      data-testid="button-refresh-analytics"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {analyticsLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                      </div>
                    ))}
                  </div>
                ) : websiteAnalytics ? (
                  <div className="space-y-6">
                    {/* Traffic Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-xl">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <Zap className="w-4 h-4 animate-pulse" />
                          <span className="text-xs font-medium">Live Now</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{websiteAnalytics.liveVisitors}</p>
                        <p className="text-[10px] text-muted-foreground">Active visitors</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 rounded-xl">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-medium">Today</span>
                        </div>
                        <p className="text-2xl font-bold">{websiteAnalytics.today.views}</p>
                        <p className="text-[10px] text-muted-foreground">{websiteAnalytics.today.visitors} visitors</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/20 rounded-xl">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-medium">This Week</span>
                        </div>
                        <p className="text-2xl font-bold">{websiteAnalytics.thisWeek.views}</p>
                        <p className="text-[10px] text-muted-foreground">{websiteAnalytics.thisWeek.visitors} visitors</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 rounded-xl">
                        <div className="flex items-center gap-2 text-amber-600 mb-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-medium">This Month</span>
                        </div>
                        <p className="text-2xl font-bold">{websiteAnalytics.thisMonth.views}</p>
                        <p className="text-[10px] text-muted-foreground">{websiteAnalytics.thisMonth.visitors} visitors</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/30 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-medium">All Time</span>
                        </div>
                        <p className="text-2xl font-bold">{websiteAnalytics.allTime.views.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{websiteAnalytics.allTime.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Daily Traffic Chart */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          Daily Traffic (14 days)
                        </h4>
                        <ResponsiveContainer width="100%" height={150}>
                          <AreaChart data={websiteAnalytics.dailyTraffic}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="rgba(136,136,136,0.5)" />
                            <YAxis tick={{ fontSize: 9 }} stroke="rgba(136,136,136,0.5)" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} fill="url(#colorViews)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Device Breakdown */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-purple-500" />
                          Device Breakdown
                        </h4>
                        <div className="flex items-center gap-4">
                          <ResponsiveContainer width={100} height={100}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Desktop', value: websiteAnalytics.deviceBreakdown.desktop, color: '#f59e0b' },
                                  { name: 'Mobile', value: websiteAnalytics.deviceBreakdown.mobile, color: '#3b82f6' },
                                  { name: 'Tablet', value: websiteAnalytics.deviceBreakdown.tablet, color: '#10b981' },
                                ].filter(d => d.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                dataKey="value"
                              >
                                {[
                                  { name: 'Desktop', value: websiteAnalytics.deviceBreakdown.desktop, color: '#f59e0b' },
                                  { name: 'Mobile', value: websiteAnalytics.deviceBreakdown.mobile, color: '#3b82f6' },
                                  { name: 'Tablet', value: websiteAnalytics.deviceBreakdown.tablet, color: '#10b981' },
                                ].filter(d => d.value > 0).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-amber-500" />
                                <span>Desktop</span>
                              </div>
                              <span className="font-medium">{websiteAnalytics.deviceBreakdown.desktop}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-blue-500" />
                                <span>Mobile</span>
                              </div>
                              <span className="font-medium">{websiteAnalytics.deviceBreakdown.mobile}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Tablet className="w-4 h-4 text-green-500" />
                                <span>Tablet</span>
                              </div>
                              <span className="font-medium">{websiteAnalytics.deviceBreakdown.tablet}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Pages & Referrers */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500" />
                          Top Pages
                        </h4>
                        <div className="space-y-2">
                          {websiteAnalytics.topPages.slice(0, 5).map((page, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="truncate flex-1 text-muted-foreground">{page.page}</span>
                              <span className="font-medium ml-2">{page.views}</span>
                            </div>
                          ))}
                          {websiteAnalytics.topPages.length === 0 && (
                            <p className="text-sm text-muted-foreground">No page data yet</p>
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-teal-500" />
                          Top Referrers
                        </h4>
                        <div className="space-y-2">
                          {websiteAnalytics.topReferrers.slice(0, 5).map((ref, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="truncate flex-1 text-muted-foreground">{ref.referrer || 'Direct'}</span>
                              <span className="font-medium ml-2">{ref.count}</span>
                            </div>
                          ))}
                          {websiteAnalytics.topReferrers.length === 0 && (
                            <p className="text-sm text-muted-foreground">No referrer data yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${selectedTenant === "npp" ? "from-blue-500/20 to-indigo-600/20" : "from-purple-500/20 to-violet-600/20"} flex items-center justify-center`}>
                      <Globe className={`w-8 h-8 ${selectedTenant === "npp" ? "text-blue-500" : "text-purple-500"}`} />
                    </div>
                    <p className="font-medium mb-1">
                      {selectedTenant === "npp" ? "Nashville Painting Professionals" : "Lume Paint Co"}
                    </p>
                    <p className="text-sm text-muted-foreground">Website analytics will appear here once traffic is tracked</p>
                  </div>
                )}
              </GlassCard>
            </TabsContent>

            {/* NOTES TAB - Team communication notepad */}
            <TabsContent value="notes" className="space-y-6" data-testid="notes-tab-content">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    Team Notes
                  </h3>
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-600">
                    {teamNotes.filter(n => n.tenant === selectedTenant).length} notes
                  </Badge>
                </div>
                
                {/* Add New Note */}
                <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
                  <Label className="text-sm font-medium mb-2 block">Leave a note for the team</Label>
                  <Textarea
                    placeholder="What's happening? Updates, reminders, ideas..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="min-h-[100px] mb-3"
                    data-testid="input-new-note"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Posting as <span className="font-medium">{userName}</span> ({userRole === "marketing" ? "Marketing Manager" : userRole === "developer" ? "Marketing Director" : userRole === "owner" ? "Owner" : "Admin"})
                    </p>
                    <Button 
                      onClick={() => {
                        if (!newNoteContent.trim()) return;
                        const newNote: TeamNote = {
                          id: `note-${Date.now()}`,
                          author: userName,
                          role: userRole === "marketing" ? "Marketing Manager" : userRole === "developer" ? "Marketing Director" : userRole === "owner" ? "Owner" : "Admin",
                          content: newNoteContent.trim(),
                          createdAt: new Date().toISOString(),
                          tenant: selectedTenant
                        };
                        const updated = [newNote, ...teamNotes];
                        setTeamNotes(updated);
                        localStorage.setItem("marketing_team_notes", JSON.stringify(updated));
                        setNewNoteContent("");
                      }}
                      disabled={!newNoteContent.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid="button-add-note"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post Note
                    </Button>
                  </div>
                </div>

                {/* Notes List */}
                <div className="space-y-4">
                  {teamNotes
                    .filter(note => note.tenant === selectedTenant)
                    .map(note => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                              {note.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{note.author}</p>
                              <p className="text-xs text-muted-foreground">{note.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(note.createdAt), "MMM d, h:mm a")}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                const updated = teamNotes.filter(n => n.id !== note.id);
                                setTeamNotes(updated);
                                localStorage.setItem("marketing_team_notes", JSON.stringify(updated));
                              }}
                              data-testid={`button-delete-note-${note.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      </motion.div>
                    ))}
                  
                  {teamNotes.filter(n => n.tenant === selectedTenant).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-lg font-medium">No notes yet</p>
                      <p className="text-sm">Leave a note for your team above</p>
                    </div>
                  )}
                </div>
              </GlassCard>
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

      {/* Add Image Modal */}
      <Dialog open={showAddImageModal} onOpenChange={setShowAddImageModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-500" />
              Add Image to Library
            </DialogTitle>
          </DialogHeader>
          <AddImageForm 
            onSubmit={(image) => {
              const newImage: LibraryImage = {
                ...image,
                id: `img-${Date.now()}`,
                brand: selectedTenant as "npp" | "lumepaint",
                createdAt: new Date().toISOString(),
              };
              const updated = [...libraryImages, newImage];
              setLibraryImages(updated);
              localStorage.setItem("marketing_images", JSON.stringify(updated));
              setShowAddImageModal(false);
            }}
            onCancel={() => setShowAddImageModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Message Modal */}
      <Dialog open={showAddMessageModal} onOpenChange={setShowAddMessageModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Add Message Template
            </DialogTitle>
          </DialogHeader>
          <AddMessageForm 
            onSubmit={(message) => {
              const newMessage: MessageTemplate = {
                ...message,
                id: `msg-${Date.now()}`,
                brand: selectedTenant as "npp" | "lumepaint",
                createdAt: new Date().toISOString(),
              };
              const updated = [...messageTemplates, newMessage];
              setMessageTemplates(updated);
              localStorage.setItem("marketing_messages", JSON.stringify(updated));
              setShowAddMessageModal(false);
            }}
            onCancel={() => setShowAddMessageModal(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}

// Add Image Form Component
function AddImageForm({ onSubmit, onCancel }: {
  onSubmit: (image: Omit<LibraryImage, "id" | "brand" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState<ImageSubject>("general");
  const [style, setStyle] = useState<ImageStyle>("finished-result");
  const [season, setSeason] = useState<ImageSeason>("all-year");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [tags, setTags] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <Label>Image URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          data-testid="input-library-image-url"
        />
        {url && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <img src={url} alt="Preview" className="w-full h-32 object-cover rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the image"
          data-testid="input-image-description"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Subject</Label>
          <Select value={subject} onValueChange={(v) => setSubject(v as ImageSubject)}>
            <SelectTrigger data-testid="select-image-subject-form">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Style</Label>
          <Select value={style} onValueChange={(v) => setStyle(v as ImageStyle)}>
            <SelectTrigger data-testid="select-image-style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_STYLES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Season</Label>
          <Select value={season} onValueChange={(v) => setSeason(v as ImageSeason)}>
            <SelectTrigger data-testid="select-image-season">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SEASONS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Quality (1-5)</Label>
          <Select value={String(quality)} onValueChange={(v) => setQuality(Number(v) as 1|2|3|4|5)}>
            <SelectTrigger data-testid="select-image-quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n} Star{n > 1 ? 's' : ''}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Tags (comma separated)</Label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="modern, clean, residential"
          data-testid="input-image-tags"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onSubmit({ url, description, subject, style, season, quality, tags: tags.split(",").map(t => t.trim()).filter(Boolean) })}
          disabled={!url.trim()}
          data-testid="button-submit-image"
        >
          Add Image
        </Button>
      </DialogFooter>
    </div>
  );
}

// Add Message Form Component
function AddMessageForm({ onSubmit, onCancel }: {
  onSubmit: (message: Omit<MessageTemplate, "id" | "brand" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState<ImageSubject>("general");
  const [tone, setTone] = useState<MessageTone>("professional");
  const [cta, setCta] = useState<MessageCTA>("none");
  const [platform, setPlatform] = useState<"instagram" | "facebook" | "nextdoor" | "all">("all");
  const [hashtags, setHashtags] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <Label>Message Content</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message template..."
          rows={4}
          data-testid="textarea-message-content"
        />
        <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Subject Match</Label>
          <Select value={subject} onValueChange={(v) => setSubject(v as ImageSubject)}>
            <SelectTrigger data-testid="select-message-subject-form">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as MessageTone)}>
            <SelectTrigger data-testid="select-message-tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESSAGE_TONES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Call to Action</Label>
          <Select value={cta} onValueChange={(v) => setCta(v as MessageCTA)}>
            <SelectTrigger data-testid="select-message-cta">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESSAGE_CTAS.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Platform</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v as typeof platform)}>
            <SelectTrigger data-testid="select-message-platform">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="nextdoor">Nextdoor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Hashtags (comma separated)</Label>
        <Input
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="#NashvillePainting, #HomeImprovement"
          data-testid="input-message-hashtags"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onSubmit({ content, subject, tone, cta, platform, hashtags: hashtags.split(",").map(h => h.trim()).filter(Boolean) })}
          disabled={!content.trim()}
          data-testid="button-submit-message"
        >
          Add Message
        </Button>
      </DialogFooter>
    </div>
  );
}

function AddPostForm({ onSubmit, onCancel }: { 
  onSubmit: (post: Partial<SocialPost>) => void; 
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
        <Label>Image URL (optional)</Label>
        <Input 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg or leave blank"
          data-testid="input-image-url"
        />
        {imageUrl && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-32 object-cover rounded"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">Paste a URL to an image, or upload to a service and paste the link</p>
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
          onClick={() => onSubmit({ 
            content, 
            imageUrl: imageUrl || undefined,
            platform: platform as any, 
            type: type as any, 
            category: category as any 
          })}
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
