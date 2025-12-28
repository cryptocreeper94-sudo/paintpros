import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Globe, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Edit, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Twitter,
  Share2
} from "lucide-react";
import type { SeoPage } from "@shared/schema";

function LiveHeadTagsViewer() {
  const [tags, setTags] = useState<{ name: string; content: string; type: string }[]>([]);
  const [expanded, setExpanded] = useState(false);

  const refreshTags = () => {
    const headTags: { name: string; content: string; type: string }[] = [];
    
    headTags.push({ name: "title", content: document.title, type: "title" });
    
    const metas = document.querySelectorAll("meta");
    metas.forEach((meta) => {
      const name = meta.getAttribute("name") || meta.getAttribute("property") || meta.getAttribute("http-equiv");
      const content = meta.getAttribute("content");
      if (name && content) {
        const type = meta.getAttribute("property") ? "og/twitter" : "meta";
        headTags.push({ name, content, type });
      }
    });
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      headTags.push({ name: "canonical", content: canonical.getAttribute("href") || "", type: "link" });
    }
    
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach((script, i) => {
      try {
        const data = JSON.parse(script.textContent || "{}");
        headTags.push({ name: `JSON-LD ${i + 1} (${data["@type"] || "Schema"})`, content: JSON.stringify(data, null, 2), type: "schema" });
      } catch {}
    });
    
    setTags(headTags);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h4 className="font-medium flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Live Head Tags
        </h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshTags} data-testid="button-refresh-head-tags">
            <RefreshCw className="w-4 h-4 mr-2" />
            Scan Page
          </Button>
          {tags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
      
      {tags.length > 0 && (
        <div className={`space-y-1 ${expanded ? "" : "max-h-[200px] overflow-hidden"}`}>
          {tags.map((tag, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50 text-xs">
              <Badge variant="outline" className="shrink-0">
                {tag.type === "og/twitter" ? "OG" : tag.type === "schema" ? "LD" : tag.type.toUpperCase()}
              </Badge>
              <div className="min-w-0 flex-1">
                <span className="font-mono text-primary">{tag.name}</span>
                <div className="text-muted-foreground truncate max-w-full">
                  {tag.content.length > 150 ? tag.content.substring(0, 150) + "..." : tag.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tags.length === 0 && (
        <div className="text-sm text-muted-foreground p-4 text-center border rounded-lg bg-muted/20">
          Click "Scan Page" to view all active meta tags on this page
        </div>
      )}
    </div>
  );
}

interface SeoSummary {
  totalPages: number;
  averageScore: number;
  pagesWithFullSeo: number;
  pagesNeedingWork: number;
  pages: {
    id: string;
    pagePath: string;
    pageTitle: string;
    seoScore: number | null;
    missingFields: string[] | null;
  }[];
}

export function SeoTracker() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<SeoPage | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  
  const { data: summary, isLoading, refetch } = useQuery<SeoSummary>({
    queryKey: ["/api/seo/summary"],
  });
  
  const { data: allPages } = useQuery<SeoPage[]>({
    queryKey: ["/api/seo/pages"],
  });
  
  const initializeMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/seo/pages/initialize"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/pages"] });
      toast({ title: "SEO pages initialized successfully" });
    },
    onError: () => {
      toast({ title: "Failed to initialize SEO pages", variant: "destructive" });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SeoPage> }) => 
      apiRequest("PATCH", `/api/seo/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seo/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seo/pages"] });
      setEditDialogOpen(false);
      setSelectedPage(null);
      toast({ title: "SEO settings updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update SEO settings", variant: "destructive" });
    },
  });
  
  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="secondary">Not Set</Badge>;
    if (score >= 80) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Excellent</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Needs Work</Badge>;
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Poor</Badge>;
  };
  
  const handleEdit = (pageId: string) => {
    const page = allPages?.find(p => p.id === pageId);
    if (page) {
      setSelectedPage(page);
      setEditDialogOpen(true);
    }
  };
  
  const handleSave = () => {
    if (!selectedPage) return;
    updateMutation.mutate({ id: selectedPage.id, data: selectedPage });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              SEO Tracker
            </CardTitle>
            <CardDescription>
              Manage meta tags, Open Graph, Twitter Cards, and structured data
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              data-testid="button-refresh-seo"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm" 
              onClick={() => initializeMutation.mutate()}
              disabled={initializeMutation.isPending}
              data-testid="button-initialize-seo"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {initializeMutation.isPending ? "Initializing..." : "Initialize Pages"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{summary?.totalPages || 0}</div>
            <div className="text-sm text-muted-foreground">Total Pages</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold flex items-center gap-2">
              {summary?.averageScore || 0}%
              <Progress value={summary?.averageScore || 0} className="w-16 h-2" />
            </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10">
            <div className="text-2xl font-bold text-green-500">{summary?.pagesWithFullSeo || 0}</div>
            <div className="text-sm text-muted-foreground">Optimized</div>
          </div>
          <div className="p-4 rounded-lg bg-red-500/10">
            <div className="text-2xl font-bold text-red-500">{summary?.pagesNeedingWork || 0}</div>
            <div className="text-sm text-muted-foreground">Need Work</div>
          </div>
        </div>
        
        <Separator />

        {/* Live Head Tags Viewer */}
        <LiveHeadTagsViewer />
        
        <Separator />
        
        {/* Page List */}
        <div className="space-y-2">
          <h4 className="font-medium">Pages</h4>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {summary?.pages?.map((page) => (
                <div 
                  key={page.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex items-center justify-between p-3 cursor-pointer hover-elevate"
                    onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
                    data-testid={`seo-page-${page.pagePath}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getScoreColor(page.seoScore)}`} />
                      <div>
                        <div className="font-medium">{page.pageTitle}</div>
                        <div className="text-sm text-muted-foreground">{page.pagePath}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getScoreBadge(page.seoScore)}
                      <span className="text-sm font-medium">{page.seoScore || 0}%</span>
                      {expandedPage === page.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  
                  {expandedPage === page.id && (
                    <div className="p-3 border-t bg-muted/30">
                      <div className="space-y-3">
                        {page.missingFields && page.missingFields.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-yellow-500 mb-2">
                              <AlertTriangle className="w-4 h-4" />
                              Missing Fields
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {page.missingFields.map((field) => (
                                <Badge key={field} variant="outline" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(!page.missingFields || page.missingFields.length === 0) && (
                          <div className="flex items-center gap-2 text-sm text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            All SEO fields are configured
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          onClick={() => handleEdit(page.id)}
                          data-testid={`button-edit-seo-${page.pagePath}`}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit SEO Settings
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {(!summary?.pages || summary.pages.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No SEO pages configured yet.</p>
                  <p className="text-sm">Click "Initialize Pages" to get started.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SEO Settings - {selectedPage?.pageTitle}</DialogTitle>
          </DialogHeader>
          
          {selectedPage && (
            <Tabs defaultValue="meta" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="meta">
                  <FileText className="w-4 h-4 mr-2" />
                  Meta
                </TabsTrigger>
                <TabsTrigger value="og">
                  <Share2 className="w-4 h-4 mr-2" />
                  Open Graph
                </TabsTrigger>
                <TabsTrigger value="twitter">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </TabsTrigger>
                <TabsTrigger value="structured">
                  <Globe className="w-4 h-4 mr-2" />
                  Schema
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="meta" className="space-y-4 mt-4">
                <div className="p-4 rounded-lg border bg-muted/30 mb-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">Google Search Preview</Label>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-lg">
                    <div className="text-xs text-muted-foreground mb-1">
                      {selectedPage.canonicalUrl || "https://yourdomain.com" + selectedPage.pagePath}
                    </div>
                    <div className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1 font-medium">
                      {selectedPage.metaTitle || "Page Title - Your Business Name"}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {selectedPage.metaDescription || "Meta description will appear here. Write a compelling description that encourages users to click."}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title (30-60 chars)</Label>
                  <Input 
                    id="metaTitle"
                    value={selectedPage.metaTitle || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaTitle: e.target.value })}
                    placeholder="Page title for search engines"
                    data-testid="input-meta-title"
                  />
                  <div className="text-xs text-muted-foreground">
                    {(selectedPage.metaTitle || "").length}/60 characters
                    {(selectedPage.metaTitle || "").length > 60 && (
                      <span className="text-yellow-500 ml-2">Title may be truncated</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description (120-160 chars)</Label>
                  <Textarea 
                    id="metaDescription"
                    value={selectedPage.metaDescription || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaDescription: e.target.value })}
                    placeholder="Brief description for search results"
                    data-testid="input-meta-description"
                  />
                  <div className="text-xs text-muted-foreground">
                    {(selectedPage.metaDescription || "").length}/160 characters
                    {(selectedPage.metaDescription || "").length > 160 && (
                      <span className="text-yellow-500 ml-2">Description may be truncated</span>
                    )}
                    {(selectedPage.metaDescription || "").length < 120 && (selectedPage.metaDescription || "").length > 0 && (
                      <span className="text-blue-500 ml-2">Consider adding more detail</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Keywords (comma-separated)</Label>
                  <Input 
                    id="metaKeywords"
                    value={selectedPage.metaKeywords || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaKeywords: e.target.value })}
                    placeholder="painting, contractors, services"
                    data-testid="input-meta-keywords"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="canonicalUrl">Canonical URL</Label>
                  <Input 
                    id="canonicalUrl"
                    value={selectedPage.canonicalUrl || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, canonicalUrl: e.target.value })}
                    placeholder="https://example.com/page"
                    data-testid="input-canonical-url"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaRobots">Robots Directive</Label>
                  <Input 
                    id="metaRobots"
                    value={selectedPage.metaRobots || "index, follow"}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaRobots: e.target.value })}
                    placeholder="index, follow"
                    data-testid="input-meta-robots"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="og" className="space-y-4 mt-4">
                <div className="p-4 rounded-lg border bg-muted/30 mb-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">Facebook/LinkedIn Preview</Label>
                  <div className="bg-white dark:bg-gray-900 rounded-lg border overflow-hidden max-w-md">
                    <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 relative">
                      {(selectedPage.ogImage || selectedPage.metaTitle) ? (
                        <img 
                          src={selectedPage.ogImage || "/og-image.png"} 
                          alt="OG Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = "/og-image.png"; }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          No image set
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-muted-foreground uppercase mb-1">
                        {selectedPage.canonicalUrl ? new URL(selectedPage.canonicalUrl).hostname : "yourdomain.com"}
                      </div>
                      <div className="font-semibold text-sm text-foreground line-clamp-2">
                        {selectedPage.ogTitle || selectedPage.metaTitle || "Page Title"}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {selectedPage.ogDescription || selectedPage.metaDescription || "Page description will appear here"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input 
                    id="ogTitle"
                    value={selectedPage.ogTitle || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, ogTitle: e.target.value })}
                    placeholder="Title for social sharing"
                    data-testid="input-og-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <Textarea 
                    id="ogDescription"
                    value={selectedPage.ogDescription || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, ogDescription: e.target.value })}
                    placeholder="Description for social sharing"
                    data-testid="input-og-description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input 
                    id="ogImage"
                    value={selectedPage.ogImage || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, ogImage: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                    data-testid="input-og-image"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogType">OG Type</Label>
                    <Input 
                      id="ogType"
                      value={selectedPage.ogType || "website"}
                      onChange={(e) => setSelectedPage({ ...selectedPage, ogType: e.target.value })}
                      placeholder="website"
                      data-testid="input-og-type"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogLocale">OG Locale</Label>
                    <Input 
                      id="ogLocale"
                      value={selectedPage.ogLocale || "en_US"}
                      onChange={(e) => setSelectedPage({ ...selectedPage, ogLocale: e.target.value })}
                      placeholder="en_US"
                      data-testid="input-og-locale"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="twitter" className="space-y-4 mt-4">
                <div className="p-4 rounded-lg border bg-muted/30 mb-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">Twitter/X Card Preview</Label>
                  <div className="bg-white dark:bg-gray-900 rounded-xl border overflow-hidden max-w-md">
                    <div className="aspect-[2/1] bg-gray-100 dark:bg-gray-800 relative">
                      {(selectedPage.twitterImage || selectedPage.ogImage) ? (
                        <img 
                          src={selectedPage.twitterImage || selectedPage.ogImage || "/og-image.png"} 
                          alt="Twitter Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = "/og-image.png"; }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          No image set
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="font-semibold text-sm text-foreground line-clamp-1">
                        {selectedPage.twitterTitle || selectedPage.ogTitle || selectedPage.metaTitle || "Page Title"}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {selectedPage.twitterDescription || selectedPage.ogDescription || selectedPage.metaDescription || "Page description"}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Globe className="w-3 h-3" />
                        {selectedPage.canonicalUrl ? new URL(selectedPage.canonicalUrl).hostname : "yourdomain.com"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterCard">Card Type</Label>
                  <Input 
                    id="twitterCard"
                    value={selectedPage.twitterCard || "summary_large_image"}
                    onChange={(e) => setSelectedPage({ ...selectedPage, twitterCard: e.target.value })}
                    placeholder="summary_large_image"
                    data-testid="input-twitter-card"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitterTitle">Twitter Title</Label>
                  <Input 
                    id="twitterTitle"
                    value={selectedPage.twitterTitle || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, twitterTitle: e.target.value })}
                    placeholder="Title for Twitter"
                    data-testid="input-twitter-title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitterDescription">Twitter Description</Label>
                  <Textarea 
                    id="twitterDescription"
                    value={selectedPage.twitterDescription || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, twitterDescription: e.target.value })}
                    placeholder="Description for Twitter"
                    data-testid="input-twitter-description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitterImage">Twitter Image URL</Label>
                  <Input 
                    id="twitterImage"
                    value={selectedPage.twitterImage || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, twitterImage: e.target.value })}
                    placeholder="https://example.com/twitter-image.jpg"
                    data-testid="input-twitter-image"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitterSite">Twitter Handle</Label>
                  <Input 
                    id="twitterSite"
                    value={selectedPage.twitterSite || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, twitterSite: e.target.value })}
                    placeholder="@yourbusiness"
                    data-testid="input-twitter-site"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="structured" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="structuredDataType">Schema Type</Label>
                  <Input 
                    id="structuredDataType"
                    value={selectedPage.structuredDataType || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, structuredDataType: e.target.value })}
                    placeholder="LocalBusiness, Service, Organization, FAQPage"
                    data-testid="input-structured-type"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="structuredData">JSON-LD (Schema.org)</Label>
                  <Textarea 
                    id="structuredData"
                    className="font-mono text-sm min-h-[200px]"
                    value={selectedPage.structuredData ? JSON.stringify(selectedPage.structuredData, null, 2) : ""}
                    onChange={(e) => {
                      try {
                        const parsed = e.target.value ? JSON.parse(e.target.value) : null;
                        setSelectedPage({ ...selectedPage, structuredData: parsed });
                      } catch {
                      }
                    }}
                    placeholder='{"@context": "https://schema.org", "@type": "LocalBusiness", ...}'
                    data-testid="input-structured-data"
                  />
                  <div className="text-xs text-muted-foreground">
                    Enter valid JSON-LD structured data. 
                    <a href="https://schema.org" target="_blank" rel="noopener" className="text-primary ml-1">
                      Schema.org reference
                      <ExternalLink className="w-3 h-3 inline ml-1" />
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
              data-testid="button-save-seo"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
