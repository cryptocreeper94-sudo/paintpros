import { useState } from "react";
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
  Link as LinkIcon
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";

interface MarketingHubProps {
  showTenantSwitcher?: boolean;
}

const TENANTS = [
  { id: "npp", name: "Nashville Painting Professionals", shortName: "NPP", color: "gold" },
  { id: "lume", name: "Lume Paint Co", shortName: "Lume", color: "gray" },
  { id: "paintpros", name: "paintpros.io", shortName: "PaintPros", color: "blue" },
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

  const currentTenant = TENANTS.find(t => t.id === selectedTenant) || TENANTS[0];

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose" data-testid="tab-compose">
            <Send className="w-4 h-4 mr-2" />
            {t('marketing.compose') || 'Compose'}
          </TabsTrigger>
          <TabsTrigger value="calendar" data-testid="tab-calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {t('marketing.calendar') || 'Calendar'}
          </TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('marketing.analytics') || 'Analytics'}
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
          <div className="grid grid-cols-2 gap-4">
            {/* Facebook Analytics */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Facebook className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Facebook</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('marketing.followers') || 'Followers'}
                  </span>
                  <span className="font-medium">{mockAnalytics.facebook.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('marketing.reach') || 'Reach (30d)'}
                  </span>
                  <span className="font-medium">{mockAnalytics.facebook.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {t('marketing.engagement') || 'Engagement'}
                  </span>
                  <span className="font-medium">{mockAnalytics.facebook.engagement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t('marketing.posts') || 'Posts'}
                  </span>
                  <span className="font-medium">{mockAnalytics.facebook.posts}</span>
                </div>
              </div>
            </GlassCard>

            {/* Instagram Analytics */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Instagram className="w-5 h-5 text-pink-500" />
                <h3 className="font-semibold">Instagram</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('marketing.followers') || 'Followers'}
                  </span>
                  <span className="font-medium">{mockAnalytics.instagram.followers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {t('marketing.reach') || 'Reach (30d)'}
                  </span>
                  <span className="font-medium">{mockAnalytics.instagram.reach.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {t('marketing.engagement') || 'Engagement'}
                  </span>
                  <span className="font-medium">{mockAnalytics.instagram.engagement}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t('marketing.posts') || 'Posts'}
                  </span>
                  <span className="font-medium">{mockAnalytics.instagram.posts}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Quick Stats */}
          <GlassCard className="p-4 mt-4">
            <h3 className="font-semibold mb-4">{t('marketing.performanceSummary') || 'Performance Summary'}</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-500">{(mockAnalytics.facebook.followers + mockAnalytics.instagram.followers).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{t('marketing.totalFollowers') || 'Total Followers'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{(mockAnalytics.facebook.reach + mockAnalytics.instagram.reach).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{t('marketing.totalReach') || 'Total Reach'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{((mockAnalytics.facebook.engagement + mockAnalytics.instagram.engagement) / 2).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{t('marketing.avgEngagement') || 'Avg Engagement'}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">{mockAnalytics.facebook.posts + mockAnalytics.instagram.posts}</div>
                <div className="text-xs text-muted-foreground">{t('marketing.totalPosts') || 'Total Posts'}</div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
