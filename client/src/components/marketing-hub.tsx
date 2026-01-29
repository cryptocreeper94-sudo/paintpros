import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Facebook, 
  Instagram, 
  Calendar as CalendarIcon, 
  Send, 
  Image as ImageIcon, 
  Globe, 
  Clock, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Sparkles,
  Languages,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Presentation,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
  Palette,
  FileText,
  Target,
  Megaphone,
  DollarSign,
  RefreshCw,
  Loader2
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";

interface MarketingHubProps {
  showTenantSwitcher?: boolean;
}

const TENANTS = [
  { id: "npp", name: "Nashville Painting Professionals", shortName: "NPP", color: "gold" },
  { id: "lume", name: "Lume Paint Co", shortName: "Lume", color: "gray" },
  { id: "demo", name: "paintpros.io", shortName: "PaintPros", color: "blue" },
  { id: "roofpros", name: "RoofPros.io", shortName: "Roof", color: "red" },
  { id: "hvacpros", name: "HVACPros.io", shortName: "HVAC", color: "sky" },
  { id: "electricpros", name: "ElectricPros.io", shortName: "Electric", color: "yellow" },
  { id: "plumbpros", name: "PlumbPros.io", shortName: "Plumb", color: "blue" },
  { id: "landscapepros", name: "LandscapePros.io", shortName: "Landscape", color: "green" },
  { id: "buildpros", name: "BuildPros.io", shortName: "Build", color: "stone" },
];

interface ScheduledPost {
  id: string;
  tenant: string;
  content: string;
  contentEs?: string;
  platform: "facebook" | "instagram" | "both";
  language: "en" | "es" | "both";
  scheduledDate: Date;
  status: "scheduled" | "posted" | "failed";
  imageUrl?: string;
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    tenant: "npp",
    content: "Transform your home with a fresh coat of paint! Book your free estimate today.",
    contentEs: "¡Transforma tu hogar con una nueva capa de pintura! Reserva tu presupuesto gratis hoy.",
    platform: "both",
    language: "both",
    scheduledDate: new Date(Date.now() + 86400000),
    status: "scheduled",
  },
  {
    id: "2",
    tenant: "lume",
    content: "Minimalist design meets premium quality. Discover Lume Paint Co.",
    platform: "instagram",
    language: "en",
    scheduledDate: new Date(Date.now() + 172800000),
    status: "scheduled",
  },
];

const mockAnalytics = {
  facebook: {
    followers: 2847,
    reach: 12500,
    engagement: 4.2,
    posts: 24,
  },
  instagram: {
    followers: 5621,
    reach: 28900,
    engagement: 6.8,
    posts: 48,
  },
};

// Presentation slides with audience view and speaker notes
const presentationSlides = [
  {
    id: 0,
    title: "Marketing Suite",
    subtitle: "Your Complete Marketing Command Center",
    icon: TrendingUp,
    iconColor: "text-pink-500",
    bgGradient: "from-pink-500/20 to-purple-500/20",
    bullets: [
      "One dashboard for all your marketing",
      "Create, schedule, and track content",
      "Built specifically for painting contractors"
    ],
    speakerNotes: "This is our central hub for everything marketing-related. Instead of juggling multiple apps and platforms, everything lives here. We designed this specifically for the painting industry - so it speaks your language and understands your business."
  },
  {
    id: 1,
    title: "Content Studio",
    subtitle: "Tab 1: Ready-to-Post Content Library",
    icon: Palette,
    iconColor: "text-purple-500",
    bgGradient: "from-purple-500/20 to-indigo-500/20",
    bullets: [
      "Professional images organized by category",
      "Pre-written captions for each platform",
      "Download and post in under 2 minutes",
      "Before/After photos from your jobs"
    ],
    speakerNotes: "Think of this as your content library. We've got professional images organized by type - interior, exterior, cabinets, decks. Each one comes with copy-paste captions already written for Facebook, Instagram, and Nextdoor. Your crews submit their Before/After photos, and we add them to the library so content stays fresh."
  },
  {
    id: 2,
    title: "Analytics Center",
    subtitle: "Tab 2: Know What's Working",
    icon: BarChart3,
    iconColor: "text-blue-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    bullets: [
      "Track engagement across all platforms",
      "See which posts generate the most leads",
      "Monthly performance reports",
      "Competitor benchmarking"
    ],
    speakerNotes: "No more guessing what works. This shows you exactly which posts are getting engagement, which ones are actually generating phone calls, and how you stack up against competitors. Over time, the system learns what content performs best for your specific audience."
  },
  {
    id: 3,
    title: "Content Calendar",
    subtitle: "Tab 3: Never Miss a Posting Day",
    icon: CalendarIcon,
    iconColor: "text-green-500",
    bgGradient: "from-green-500/20 to-emerald-500/20",
    bullets: [
      "Smart posting schedule (MWF/TThSat)",
      "Seasonal content suggestions",
      "Holiday and event reminders",
      "Drag-and-drop planning"
    ],
    speakerNotes: "The calendar tells you what to post and when. Monday, Wednesday, Friday we do project showcases - the Before/After stuff. Tuesday, Thursday, Saturday is tips and engagement content. Sunday is your planning day. It even reminds you about seasonal content and holidays."
  },
  {
    id: 4,
    title: "Marketing Playbook",
    subtitle: "Tab 4: Proven Strategies That Work",
    icon: Target,
    iconColor: "text-amber-500",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    bullets: [
      "Step-by-step campaign guides",
      "Seasonal promotion templates",
      "Review generation strategies",
      "Referral program blueprints"
    ],
    speakerNotes: "This is where the real strategy lives. We've compiled proven marketing playbooks specifically for painters. Want to run a spring special? There's a step-by-step guide. Need more Google reviews? There's a system for that. Referral program? We've got templates ready to go."
  },
  {
    id: 5,
    title: "Budget Tracker",
    subtitle: "Tab 5: Track Every Marketing Dollar",
    icon: DollarSign,
    iconColor: "text-emerald-500",
    bgGradient: "from-emerald-500/20 to-green-500/20",
    bullets: [
      "Monthly budget allocation",
      "Spend tracking by channel",
      "ROI calculations per campaign",
      "Cost-per-lead visibility"
    ],
    speakerNotes: "This is the accountability piece. We track every dollar spent on marketing and tie it back to results. You'll see exactly what your cost-per-lead is for each channel. No more wondering if that Facebook ad was worth it - you'll have the data."
  },
  {
    id: 6,
    title: "What We Need to Get Started",
    subtitle: "Quick Setup Requirements",
    icon: Settings,
    iconColor: "text-slate-500",
    bgGradient: "from-slate-500/20 to-gray-500/20",
    bullets: [
      "Meta Business Suite access approval",
      "Marketing budget confirmation",
      "Content approval workflow setup",
      "5 minutes of your time"
    ],
    speakerNotes: "To make this fully operational, we need access to Meta Business Suite - that's the Facebook and Instagram connection. The current account triggers fraud alerts when I try to access it, so we need to set that up together. Once connected, everything flows automatically."
  }
];

// Presentation Mode Component - Clean view for audience (no speaker notes)
function PresentationMode({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slide = presentationSlides[currentSlide];
  const SlideIcon = slide.icon;
  
  const nextSlide = () => {
    if (currentSlide < presentationSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-testid="presentation-mode"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            Slide {currentSlide + 1} of {presentationSlides.length}
          </Badge>
          <span className="text-sm text-muted-foreground">Marketing Hub Overview</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-presentation">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Main Content Area - Clean slide for audience */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          key={currentSlide}
          className="max-w-4xl w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className={`p-8 md:p-12 bg-gradient-to-br ${slide.bgGradient}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-background/50 flex items-center justify-center`}>
                <SlideIcon className={`w-8 h-8 ${slide.iconColor}`} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{slide.title}</h1>
                <p className="text-lg text-muted-foreground">{slide.subtitle}</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-8">
              {slide.bullets.map((bullet, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                >
                  <div className={`w-8 h-8 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-5 h-5 ${slide.iconColor}`} />
                  </div>
                  <p className="text-lg md:text-xl pt-1">{bullet}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-t border-border/50">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          data-testid="button-prev-slide"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {/* Slide indicators */}
        <div className="flex items-center gap-2">
          {presentationSlides.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide 
                  ? "w-6 bg-primary" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => setCurrentSlide(idx)}
              data-testid={`button-slide-${idx}`}
            />
          ))}
        </div>
        
        <Button
          variant={currentSlide === presentationSlides.length - 1 ? "default" : "outline"}
          onClick={currentSlide === presentationSlides.length - 1 ? onClose : nextSlide}
          data-testid="button-next-slide"
        >
          {currentSlide === presentationSlides.length - 1 ? (
            <>
              Done
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// Export the slides data so Developer page can use the speaker notes
export { presentationSlides };

// Content Library Tab Component
function ContentLibraryTab({ tenantId }: { tenantId: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    message: '',
    imageUrl: '',
    contentType: 'project_showcase',
    rotationType: 'A'
  });

  const { data: contentItems = [], refetch } = useQuery({
    queryKey: ['/api/content-library', tenantId],
    queryFn: async () => {
      const res = await fetch(`/api/content-library/${tenantId}`);
      return res.json();
    }
  });

  const { data: schedule = [] } = useQuery({
    queryKey: ['/api/auto-posting', tenantId, 'schedule'],
    queryFn: async () => {
      const res = await fetch(`/api/auto-posting/${tenantId}/schedule`);
      return res.json();
    }
  });

  const addContent = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/content-library/${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      return res.json();
    },
    onSuccess: () => {
      refetch();
      setShowAddForm(false);
      setNewContent({ title: '', message: '', imageUrl: '', contentType: 'project_showcase', rotationType: 'A' });
    }
  });

  const setupDefaultSchedule = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/auto-posting/${tenantId}/setup-default`, { method: 'POST' });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auto-posting', tenantId, 'schedule'] });
    }
  });

  const contentTypes = [
    { value: 'project_showcase', label: 'Project Showcase', badge: 'A' },
    { value: 'before_after', label: 'Before & After', badge: 'A' },
    { value: 'tip', label: 'Tip', badge: 'B' },
    { value: 'testimonial', label: 'Testimonial', badge: 'B' },
    { value: 'educational', label: 'Educational', badge: 'B' },
    { value: 'engagement', label: 'Engagement', badge: 'B' },
    { value: 'seasonal', label: 'Seasonal', badge: 'any' }
  ];

  return (
    <div className="space-y-4">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Content Library</h3>
            <p className="text-sm text-muted-foreground">
              {contentItems.length} items | Auto-posts 3-4x daily (MWF: Showcases, TThSat: Tips)
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setupDefaultSchedule.mutate()}
              disabled={setupDefaultSchedule.isPending}
              data-testid="button-setup-schedule"
            >
              {setupDefaultSchedule.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}
              Setup Auto-Post
            </Button>
            <Button size="sm" onClick={() => setShowAddForm(true)} data-testid="button-add-content">
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 border border-border rounded-lg bg-background/50 space-y-3">
            <Input
              placeholder="Content title..."
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              data-testid="input-content-title"
            />
            <Textarea
              placeholder="Post message..."
              value={newContent.message}
              onChange={(e) => setNewContent({ ...newContent, message: e.target.value })}
              rows={3}
              data-testid="input-content-message"
            />
            <Input
              placeholder="Image URL (optional)"
              value={newContent.imageUrl}
              onChange={(e) => setNewContent({ ...newContent, imageUrl: e.target.value })}
              data-testid="input-content-image"
            />
            <div className="flex gap-3">
              <Select value={newContent.contentType} onValueChange={(v) => setNewContent({ ...newContent, contentType: v })}>
                <SelectTrigger className="w-48" data-testid="select-content-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newContent.rotationType} onValueChange={(v) => setNewContent({ ...newContent, rotationType: v })}>
                <SelectTrigger className="w-32" data-testid="select-rotation">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Rotation A (MWF)</SelectItem>
                  <SelectItem value="B">Rotation B (TThSat)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button size="sm" onClick={() => addContent.mutate()} disabled={!newContent.title || !newContent.message || addContent.isPending}>
                {addContent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Content'}
              </Button>
            </div>
          </div>
        )}

        {schedule.length > 0 && (
          <div className="mb-4 p-3 border border-green-500/30 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Auto-posting active: {schedule.length} scheduled slots per week
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Posts at 8am, 12pm, 5pm, 8pm Mon-Sat CST
            </p>
          </div>
        )}

        <div className="space-y-2">
          {contentItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No content in library yet. Add your first post!</p>
            </div>
          ) : (
            contentItems.map((item: any) => (
              <div key={item.id} className="p-3 border border-border rounded-lg hover-elevate">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {contentTypes.find(t => t.value === item.contentType)?.label || item.contentType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Rotation {item.rotationType}
                      </Badge>
                      {item.status === 'active' && (
                        <Badge className="text-xs bg-green-500/20 text-green-600">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.message}</p>
                    {item.timesUsed > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Used {item.timesUsed}x | Last: {item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString() : 'Never'}
                      </p>
                    )}
                  </div>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover ml-3" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// Ad Campaigns Tab Component
function AdCampaignsTab({ tenantId }: { tenantId: string }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    objective: 'OUTCOME_AWARENESS',
    dailyBudget: '25',
    adMessage: '',
    adHeadline: '',
    targetingRadius: 25,
    ageMin: 25,
    ageMax: 65,
    destinationUrl: ''
  });

  const { data: campaigns = [], refetch } = useQuery({
    queryKey: ['/api/ad-campaigns', tenantId],
    queryFn: async () => {
      const res = await fetch(`/api/ad-campaigns/${tenantId}`);
      return res.json();
    }
  });

  const createCampaign = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/ad-campaigns/${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign)
      });
      return res.json();
    },
    onSuccess: () => {
      refetch();
      setShowCreateForm(false);
      setNewCampaign({
        name: '', objective: 'OUTCOME_AWARENESS', dailyBudget: '25', adMessage: '',
        adHeadline: '', targetingRadius: 25, ageMin: 25, ageMax: 65, destinationUrl: ''
      });
    }
  });

  const launchCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const res = await fetch(`/api/ad-campaigns/${tenantId}/${campaignId}/launch`, { method: 'POST' });
      return res.json();
    },
    onSuccess: () => refetch()
  });

  const syncCampaign = useMutation({
    mutationFn: async (campaignId: string) => {
      const res = await fetch(`/api/ad-campaigns/${tenantId}/${campaignId}/sync`, { method: 'POST' });
      return res.json();
    },
    onSuccess: () => refetch()
  });

  const objectives = [
    { value: 'OUTCOME_AWARENESS', label: 'Brand Awareness' },
    { value: 'OUTCOME_TRAFFIC', label: 'Website Traffic' },
    { value: 'OUTCOME_ENGAGEMENT', label: 'Engagement' },
    { value: 'OUTCOME_LEADS', label: 'Lead Generation' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'paused': return 'bg-gray-500/20 text-gray-600';
      case 'failed': return 'bg-red-500/20 text-red-600';
      default: return 'bg-blue-500/20 text-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Ad Campaigns</h3>
            <p className="text-sm text-muted-foreground">
              Local targeting: Nashville & Middle Tennessee (25-mile radius)
            </p>
          </div>
          <Button size="sm" onClick={() => setShowCreateForm(true)} data-testid="button-create-campaign">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-4 p-4 border border-border rounded-lg bg-background/50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Campaign name..."
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                data-testid="input-campaign-name"
              />
              <Select value={newCampaign.objective} onValueChange={(v) => setNewCampaign({ ...newCampaign, objective: v })}>
                <SelectTrigger data-testid="select-objective">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Daily Budget ($)</label>
                <Input
                  type="number"
                  value={newCampaign.dailyBudget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, dailyBudget: e.target.value })}
                  data-testid="input-budget"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Radius (miles)</label>
                <Input
                  type="number"
                  value={newCampaign.targetingRadius}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetingRadius: parseInt(e.target.value) })}
                  data-testid="input-radius"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Age Range</label>
                <div className="flex gap-1 items-center">
                  <Input
                    type="number"
                    value={newCampaign.ageMin}
                    onChange={(e) => setNewCampaign({ ...newCampaign, ageMin: parseInt(e.target.value) })}
                    className="w-16"
                  />
                  <span className="text-xs">-</span>
                  <Input
                    type="number"
                    value={newCampaign.ageMax}
                    onChange={(e) => setNewCampaign({ ...newCampaign, ageMax: parseInt(e.target.value) })}
                    className="w-16"
                  />
                </div>
              </div>
            </div>
            <Input
              placeholder="Ad headline..."
              value={newCampaign.adHeadline}
              onChange={(e) => setNewCampaign({ ...newCampaign, adHeadline: e.target.value })}
              data-testid="input-headline"
            />
            <Textarea
              placeholder="Ad message..."
              value={newCampaign.adMessage}
              onChange={(e) => setNewCampaign({ ...newCampaign, adMessage: e.target.value })}
              rows={2}
              data-testid="input-ad-message"
            />
            <Input
              placeholder="Destination URL..."
              value={newCampaign.destinationUrl}
              onChange={(e) => setNewCampaign({ ...newCampaign, destinationUrl: e.target.value })}
              data-testid="input-destination"
            />
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-600 dark:text-blue-400">
              <Target className="w-4 h-4 inline mr-1" />
              Targeting: Nashville, TN + {newCampaign.targetingRadius} mile radius | Ages {newCampaign.ageMin}-{newCampaign.ageMax}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>Cancel</Button>
              <Button size="sm" onClick={() => createCampaign.mutate()} disabled={!newCampaign.name || createCampaign.isPending}>
                {createCampaign.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Draft'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No ad campaigns yet. Create your first campaign!</p>
            </div>
          ) : (
            campaigns.map((campaign: any) => (
              <div key={campaign.id} className="p-4 border border-border rounded-lg hover-elevate">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{campaign.name}</span>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {objectives.find(o => o.value === campaign.objective)?.label || campaign.objective}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      ${campaign.dailyBudget}/day | {campaign.targetingCity}, {campaign.targetingState} ({campaign.targetingRadius}mi)
                    </p>
                    
                    {(campaign.impressions > 0 || campaign.clicks > 0) && (
                      <div className="grid grid-cols-5 gap-2 text-xs mt-2">
                        <div className="p-2 bg-background/50 rounded text-center">
                          <div className="font-bold text-blue-500">{campaign.impressions?.toLocaleString() || 0}</div>
                          <div className="text-muted-foreground">Impressions</div>
                        </div>
                        <div className="p-2 bg-background/50 rounded text-center">
                          <div className="font-bold text-green-500">{campaign.reach?.toLocaleString() || 0}</div>
                          <div className="text-muted-foreground">Reach</div>
                        </div>
                        <div className="p-2 bg-background/50 rounded text-center">
                          <div className="font-bold text-purple-500">{campaign.clicks || 0}</div>
                          <div className="text-muted-foreground">Clicks</div>
                        </div>
                        <div className="p-2 bg-background/50 rounded text-center">
                          <div className="font-bold text-orange-500">${campaign.spent || '0'}</div>
                          <div className="text-muted-foreground">Spent</div>
                        </div>
                        <div className="p-2 bg-background/50 rounded text-center">
                          <div className="font-bold text-yellow-500">{campaign.leads || 0}</div>
                          <div className="text-muted-foreground">Leads</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => launchCampaign.mutate(campaign.id)}
                        disabled={launchCampaign.isPending}
                        data-testid={`button-launch-${campaign.id}`}
                      >
                        {launchCampaign.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Launch'}
                      </Button>
                    )}
                    {campaign.metaCampaignId && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => syncCampaign.mutate(campaign.id)}
                        disabled={syncCampaign.isPending}
                        data-testid={`button-sync-${campaign.id}`}
                      >
                        {syncCampaign.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
                {campaign.errorMessage && (
                  <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-600">
                    {campaign.errorMessage}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}

export function MarketingHub({ showTenantSwitcher = true }: MarketingHubProps) {
  const { t } = useI18n();
  const [selectedTenant, setSelectedTenant] = useState(TENANTS[0].id);
  const [activeTab, setActiveTab] = useState("compose");
  const [postContent, setPostContent] = useState("");
  const [postContentEs, setPostContentEs] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"facebook" | "instagram" | "both">("both");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es" | "both">("both");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isTranslating, setIsTranslating] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);

  const [facebookConnected, setFacebookConnected] = useState(false);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);

  const currentTenant = TENANTS.find(t => t.id === selectedTenant) || TENANTS[0];

  // Fetch real Meta connection status
  const { data: metaStatus, refetch: refetchMetaStatus } = useQuery({
    queryKey: ['/api/meta', selectedTenant, 'status'],
    queryFn: async () => {
      const res = await fetch(`/api/meta/${selectedTenant}/status`);
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 30000,
  });

  // Fetch real analytics from Meta
  const { data: metaAnalytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['/api/meta', selectedTenant, 'analytics'],
    queryFn: async () => {
      const res = await fetch(`/api/meta/${selectedTenant}/analytics`);
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  // Fetch real scheduled posts from database
  const { data: dbScheduledPosts, refetch: refetchScheduledPosts } = useQuery({
    queryKey: ['/api/meta', selectedTenant, 'scheduled'],
    queryFn: async () => {
      const res = await fetch(`/api/meta/${selectedTenant}/scheduled`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Fetch performance summary
  const { data: performanceSummary } = useQuery({
    queryKey: ['/api/meta', selectedTenant, 'performance-summary'],
    queryFn: async () => {
      const res = await fetch(`/api/meta/${selectedTenant}/performance-summary`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Sync analytics mutation
  const syncAnalyticsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/meta/${selectedTenant}/sync-analytics`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meta', selectedTenant] });
    },
  });

  // Update connection status from Meta API response
  useEffect(() => {
    if (metaStatus) {
      setFacebookConnected(metaStatus.facebookConnected || false);
      setInstagramConnected(metaStatus.instagramConnected || false);
    }
  }, [metaStatus]);

  // Get real analytics or fallback to mock
  const analytics = metaAnalytics || mockAnalytics;

  const handleAutoTranslate = async () => {
    if (!postContent.trim()) return;
    setIsTranslating(true);
    
    // Simulate AI translation - in production this would call OpenAI
    setTimeout(() => {
      // Mock translation
      const translations: Record<string, string> = {
        "Transform your home": "Transforma tu hogar",
        "fresh coat of paint": "nueva capa de pintura",
        "Book your free estimate": "Reserva tu presupuesto gratis",
      };
      
      let translated = postContent;
      Object.entries(translations).forEach(([en, es]) => {
        translated = translated.replace(en, es);
      });
      
      // If no match, add a generic Spanish version indicator
      if (translated === postContent) {
        setPostContentEs(`[ES] ${postContent}`);
      } else {
        setPostContentEs(translated);
      }
      setIsTranslating(false);
    }, 1500);
  };

  const handleSchedulePost = () => {
    if (!postContent.trim()) return;
    
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      tenant: selectedTenant,
      content: postContent,
      contentEs: selectedLanguage !== "en" ? postContentEs : undefined,
      platform: selectedPlatform,
      language: selectedLanguage,
      scheduledDate: scheduledDate || new Date(),
      status: "scheduled",
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
    setPostContent("");
    setPostContentEs("");
    setScheduledDate(undefined);
  };

  const tenantPosts = scheduledPosts.filter(p => p.tenant === selectedTenant);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-5 h-5 text-pink-400" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold">{t('marketing.title') || 'Marketing Hub'}</h2>
            <p className="text-sm text-muted-foreground">{t('marketing.subtitle') || 'Social media & content management'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPresentation(true)}
            className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30 hover:border-pink-500/50"
            data-testid="button-start-tour"
          >
            <Presentation className="w-4 h-4 mr-2 text-pink-500" />
            Start Tour
          </Button>
          <LanguageToggle variant="compact" />
          {showTenantSwitcher && (
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="w-48" data-testid="select-tenant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TENANTS.map(tenant => (
                  <SelectItem key={tenant.id} value={tenant.id} data-testid={`select-tenant-${tenant.id}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${tenant.color}-500`} />
                      {tenant.shortName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {/* Presentation Mode Overlay */}
      {showPresentation && (
        <PresentationMode onClose={() => setShowPresentation(false)} />
      )}

      {/* Connection Status */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Facebook</span>
            </div>
            {facebookConnected ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('marketing.connected') || 'Connected'}
              </Badge>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setFacebookConnected(true)} data-testid="button-connect-facebook">
                <LinkIcon className="w-3 h-3 mr-1" />
                {t('marketing.connect') || 'Connect'}
              </Button>
            )}
          </div>
          {facebookConnected && (
            <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">{t('marketing.followers') || 'Followers'}:</span> <span className="font-medium">{mockAnalytics.facebook.followers.toLocaleString()}</span></div>
              <div><span className="text-muted-foreground">{t('marketing.engagement') || 'Engagement'}:</span> <span className="font-medium">{mockAnalytics.facebook.engagement}%</span></div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Instagram</span>
            </div>
            {instagramConnected ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('marketing.connected') || 'Connected'}
              </Badge>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setInstagramConnected(true)} data-testid="button-connect-instagram">
                <LinkIcon className="w-3 h-3 mr-1" />
                {t('marketing.connect') || 'Connect'}
              </Button>
            )}
          </div>
          {instagramConnected && (
            <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">{t('marketing.followers') || 'Followers'}:</span> <span className="font-medium">{mockAnalytics.instagram.followers.toLocaleString()}</span></div>
              <div><span className="text-muted-foreground">{t('marketing.engagement') || 'Engagement'}:</span> <span className="font-medium">{mockAnalytics.instagram.engagement}%</span></div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="compose" data-testid="tab-compose">
            <Send className="w-4 h-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="content-library" data-testid="tab-content-library">
            <FileText className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="ads" data-testid="tab-ads">
            <Megaphone className="w-4 h-4 mr-2" />
            Ads
          </TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4 mt-4">
          <GlassCard className="p-4">
            <div className="space-y-4">
              {/* Platform & Language Selection */}
              <div className="flex gap-3">
                <Select value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as any)}>
                  <SelectTrigger className="w-40" data-testid="select-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {t('marketing.bothPlatforms') || 'Both Platforms'}
                      </div>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-500" />
                        Facebook
                      </div>
                    </SelectItem>
                    <SelectItem value="instagram">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        Instagram
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as any)}>
                  <SelectTrigger className="w-40" data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        {t('marketing.bothLanguages') || 'Both Languages'}
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        🇺🇸 English
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        🇲🇽 Español
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* English Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  🇺🇸 {t('marketing.englishContent') || 'English Content'}
                </label>
                <Textarea
                  placeholder={t('marketing.writePost') || "Write your post..."}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-24 resize-none"
                  data-testid="input-post-content"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{postContent.length} / 2200 {t('marketing.characters') || 'characters'}</span>
                  <span>{selectedPlatform === "instagram" ? "Instagram max: 2200" : "Facebook max: 63,206"}</span>
                </div>
              </div>

              {/* Spanish Content */}
              {selectedLanguage !== "en" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      🇲🇽 {t('marketing.spanishContent') || 'Spanish Content'}
                    </label>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleAutoTranslate}
                      disabled={!postContent.trim() || isTranslating}
                      data-testid="button-auto-translate"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {isTranslating ? (t('marketing.translating') || 'Translating...') : (t('marketing.autoTranslate') || 'Auto-Translate')}
                    </Button>
                  </div>
                  <Textarea
                    placeholder={t('marketing.writeSpanishPost') || "Escribe tu publicación en español..."}
                    value={postContentEs}
                    onChange={(e) => setPostContentEs(e.target.value)}
                    className="min-h-24 resize-none"
                    data-testid="input-post-content-es"
                  />
                </div>
              )}

              {/* Image Upload Placeholder */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">{t('marketing.dragDropImage') || 'Drag & drop image or click to upload'}</p>
                <Button variant="outline" size="sm" className="mt-2" data-testid="button-upload-image">
                  <Plus className="w-4 h-4 mr-1" />
                  {t('marketing.addImage') || 'Add Image'}
                </Button>
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">{t('marketing.scheduleFor') || 'Schedule for'}</label>
                  <Input 
                    type="datetime-local" 
                    value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ""}
                    onChange={(e) => setScheduledDate(e.target.value ? new Date(e.target.value) : undefined)}
                    data-testid="input-schedule-date"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" data-testid="button-save-draft">
                  {t('marketing.saveDraft') || 'Save Draft'}
                </Button>
                <Button 
                  onClick={handleSchedulePost}
                  disabled={!postContent.trim() || (!facebookConnected && !instagramConnected)}
                  data-testid="button-schedule-post"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {scheduledDate ? (t('marketing.schedulePost') || 'Schedule Post') : (t('marketing.postNow') || 'Post Now')}
                </Button>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Content Library Tab */}
        <TabsContent value="content-library" className="mt-4">
          <ContentLibraryTab tenantId={selectedTenant} />
        </TabsContent>

        {/* Ad Campaigns Tab */}
        <TabsContent value="ads" className="mt-4">
          <AdCampaignsTab tenantId={selectedTenant} />
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="mt-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-4">{t('marketing.scheduledPosts') || 'Scheduled Posts'} ({tenantPosts.length})</h3>
            <div className="space-y-3">
              {tenantPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{t('marketing.noScheduledPosts') || 'No scheduled posts yet'}</p>
                </div>
              ) : (
                tenantPosts.map(post => (
                  <div key={post.id} className="p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {post.platform === "both" ? (
                            <>
                              <Facebook className="w-4 h-4 text-blue-500" />
                              <Instagram className="w-4 h-4 text-pink-500" />
                            </>
                          ) : post.platform === "facebook" ? (
                            <Facebook className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Instagram className="w-4 h-4 text-pink-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {post.scheduledDate.toLocaleDateString()} at {post.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Badge variant="outline" className={post.language === "both" ? "bg-purple-500/10" : post.language === "es" ? "bg-orange-500/10" : ""}>
                            {post.language === "both" ? "EN/ES" : post.language.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        {post.contentEs && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">🇲🇽 {post.contentEs}</p>
                        )}
                      </div>
                      <Badge variant={post.status === "scheduled" ? "secondary" : post.status === "posted" ? "default" : "destructive"}>
                        {post.status === "scheduled" ? (t('marketing.scheduled') || 'Scheduled') : 
                         post.status === "posted" ? (t('marketing.posted') || 'Posted') : 
                         (t('marketing.failed') || 'Failed')}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          {/* Sync Button */}
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => syncAnalyticsMutation.mutate()}
              disabled={syncAnalyticsMutation.isPending}
              data-testid="button-sync-analytics"
            >
              {syncAnalyticsMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {syncAnalyticsMutation.isPending ? 'Syncing...' : 'Sync Analytics'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Facebook Analytics */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Facebook className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Facebook</h3>
                {facebookConnected && (
                  <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                    Live
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('marketing.followers') || 'Followers'}
                  </span>
                  <span className="font-medium">{analytics.facebook.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('marketing.reach') || 'Reach (30d)'}
                  </span>
                  <span className="font-medium">{analytics.facebook.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {t('marketing.engagement') || 'Engagement'}
                  </span>
                  <span className="font-medium">{analytics.facebook.engagement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t('marketing.posts') || 'Posts'}
                  </span>
                  <span className="font-medium">{analytics.facebook.posts}</span>
                </div>
              </div>
            </GlassCard>

            {/* Instagram Analytics */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Instagram className="w-5 h-5 text-pink-500" />
                <h3 className="font-semibold">Instagram</h3>
                {instagramConnected && (
                  <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-500 border-green-500/30 text-xs">
                    Live
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('marketing.followers') || 'Followers'}
                  </span>
                  <span className="font-medium">{analytics.instagram.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('marketing.reach') || 'Reach (30d)'}
                  </span>
                  <span className="font-medium">{analytics.instagram.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {t('marketing.engagement') || 'Engagement'}
                  </span>
                  <span className="font-medium">{analytics.instagram.engagement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t('marketing.posts') || 'Posts'}
                  </span>
                  <span className="font-medium">{analytics.instagram.posts}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Quick Stats */}
          <GlassCard className="p-4 mt-4">
            <h3 className="font-semibold mb-4">{t('marketing.performanceSummary') || 'Performance Summary'}</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-500">{(analytics.facebook.followers + analytics.instagram.followers).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{t('marketing.totalFollowers') || 'Total Followers'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{(analytics.facebook.reach + analytics.instagram.reach).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{t('marketing.totalReach') || 'Total Reach'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{((analytics.facebook.engagement + analytics.instagram.engagement) / 2).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{t('marketing.avgEngagement') || 'Avg Engagement'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{analytics.facebook.posts + analytics.instagram.posts}</div>
                <div className="text-xs text-muted-foreground">{t('marketing.totalPosts') || 'Total Posts'}</div>
              </div>
            </div>
          </GlassCard>

          {/* Performance Insights */}
          {performanceSummary && performanceSummary.recommendations?.length > 0 && (
            <GlassCard className="p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Performance Insights</h3>
              </div>
              <div className="space-y-2">
                {performanceSummary.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
              {performanceSummary.byContentType && Object.keys(performanceSummary.byContentType).length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium mb-2">Content Type Performance</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(performanceSummary.byContentType).map(([type, data]: [string, any]) => (
                      <div key={type} className="p-2 rounded-lg bg-background/50 text-xs">
                        <div className="font-medium capitalize">{type.replace(/_/g, ' ')}</div>
                        <div className="text-muted-foreground">
                          {data.count} posts | Score: {data.avgScore?.toFixed(0) || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
