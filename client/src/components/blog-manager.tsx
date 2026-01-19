import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PenLine, Sparkles, Save, Eye, Trash2, Plus, Clock, 
  Calendar, Tag, ChevronLeft, Send, FileText, BarChart3
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost, BlogCategory } from "@shared/schema";

interface AiGeneratedContent {
  title: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  suggestedTags: string[];
}

export function BlogManager() {
  const tenant = useTenant();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("posts");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiLength, setAiLength] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    tags: [] as string[],
    authorName: "",
    authorRole: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: "draft" as "draft" | "published" | "scheduled",
    featuredImage: "",
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts", tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts?tenantId=${tenant.id}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog/categories", tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/blog/categories?tenantId=${tenant.id}`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tenantId: tenant.id }),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      resetForm();
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      resetForm();
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; description?: string }) => {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tenantId: tenant.id }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/categories"] });
    },
  });

  const generateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/blog/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          tone: aiTone,
          length: aiLength,
          tenantId: tenant.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate content");
      const content: AiGeneratedContent = await res.json();
      
      setFormData(prev => ({
        ...prev,
        title: content.title,
        excerpt: content.excerpt,
        content: content.content,
        metaDescription: content.metaDescription,
        tags: content.suggestedTags,
        slug: content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      }));
      setIsCreating(true);
      setActiveTab("posts");
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: "",
      tags: [],
      authorName: "",
      authorRole: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      status: "draft",
      featuredImage: "",
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      categoryId: post.categoryId || "",
      tags: post.tags || [],
      authorName: post.authorName || "",
      authorRole: post.authorRole || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      metaKeywords: post.metaKeywords || "",
      status: post.status as "draft" | "published" | "scheduled",
      featuredImage: post.featuredImage || "",
    });
    setEditingPost(post);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handlePublish = () => {
    const publishData = { ...formData, status: "published" as const };
    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: publishData });
    } else {
      createPostMutation.mutate(publishData);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Published</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Scheduled</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Draft</Badge>;
    }
  };

  if (isCreating || editingPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetForm}
            data-testid="button-back-to-posts"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">
            {editingPost ? "Edit Post" : "New Blog Post"}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-4">
              <Input
                placeholder="Post Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                }))}
                className="text-xl font-bold border-none bg-transparent focus-visible:ring-0 px-0"
                data-testid="input-post-title"
              />
              <Input
                placeholder="URL Slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="text-sm text-muted-foreground border-none bg-transparent focus-visible:ring-0 px-0"
                data-testid="input-post-slug"
              />
            </GlassCard>

            <GlassCard className="p-4">
              <Textarea
                placeholder="Write a brief excerpt (shown in previews)..."
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="min-h-[80px] border-none bg-transparent focus-visible:ring-0 resize-none"
                data-testid="textarea-post-excerpt"
              />
            </GlassCard>

            <GlassCard className="p-4">
              <Textarea
                placeholder="Write your blog post content here... (Markdown supported)"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[400px] border-none bg-transparent focus-visible:ring-0 resize-none font-mono text-sm"
                data-testid="textarea-post-content"
              />
            </GlassCard>
          </div>

          <div className="space-y-4">
            <GlassCard className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold-400" />
                Post Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as typeof prev.status }))}
                  >
                    <SelectTrigger data-testid="select-post-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(v) => setFormData(prev => ({ ...prev, categoryId: v }))}
                  >
                    <SelectTrigger data-testid="select-post-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tags (comma separated)</label>
                  <Input
                    value={formData.tags.join(", ")}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                    }))}
                    placeholder="painting tips, interior, DIY"
                    data-testid="input-post-tags"
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold-400" />
                SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Meta Title</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="SEO title (max 70 chars)"
                    maxLength={70}
                    data-testid="input-meta-title"
                  />
                  <span className="text-xs text-muted-foreground">{formData.metaTitle.length}/70</span>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Meta Description</label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="SEO description (max 160 chars)"
                    maxLength={160}
                    className="min-h-[60px]"
                    data-testid="textarea-meta-description"
                  />
                  <span className="text-xs text-muted-foreground">{formData.metaDescription.length}/160</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <h3 className="font-semibold mb-4">Author</h3>
              <div className="space-y-4">
                <Input
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Author name"
                  data-testid="input-author-name"
                />
                <Input
                  value={formData.authorRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorRole: e.target.value }))}
                  placeholder="Author role (e.g., Lead Painter)"
                  data-testid="input-author-role"
                />
              </div>
            </GlassCard>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSave}
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
                data-testid="button-save-draft"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                className="flex-1 bg-gold-400 hover:bg-gold-500 text-black"
                onClick={handlePublish}
                disabled={createPostMutation.isPending || updatePostMutation.isPending}
                data-testid="button-publish"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <PenLine className="w-6 h-6 text-gold-400" />
            Blog Manager
          </h2>
          <p className="text-muted-foreground">Create and manage blog content for {tenant.name}</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-gold-400 hover:bg-gold-500 text-black"
          data-testid="button-new-post"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/40">
          <TabsTrigger value="posts" className="data-[state=active]:bg-gold-400/20">
            <FileText className="w-4 h-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-gold-400/20">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Writer
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-gold-400/20">
            <Tag className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400" />
            </div>
          ) : posts.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <PenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground mb-4">Create your first post or use AI to generate content</p>
              <div className="flex justify-center gap-2">
                <Button onClick={() => setIsCreating(true)} data-testid="button-create-first-post">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("ai")} data-testid="button-use-ai">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use AI Writer
                </Button>
              </div>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="p-4 hover-elevate cursor-pointer" onClick={() => handleEditPost(post)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(post.status)}
                          {post.aiGenerated && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTimeMinutes} min read
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.viewCount} views
                          </span>
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this post?")) {
                            deletePostMutation.mutate(post.id);
                          }
                        }}
                        data-testid={`button-delete-post-${post.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-gold-400" />
              <h3 className="text-lg font-semibold">AI Blog Writer</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Tell us what you want to write about and we'll generate a professional blog post for your painting company.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What would you like to write about?</label>
                <Textarea
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., How to choose the right paint colors for your living room, Tips for preparing walls before painting, Benefits of hiring professional painters..."
                  className="min-h-[100px]"
                  data-testid="textarea-ai-topic"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tone</label>
                  <Select value={aiTone} onValueChange={setAiTone}>
                    <SelectTrigger data-testid="select-ai-tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Length</label>
                  <Select value={aiLength} onValueChange={setAiLength}>
                    <SelectTrigger data-testid="select-ai-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (400-600 words)</SelectItem>
                      <SelectItem value="medium">Medium (700-900 words)</SelectItem>
                      <SelectItem value="long">Long (1200-1500 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={generateWithAI}
                disabled={!aiTopic.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-500 to-gold-400 hover:from-purple-600 hover:to-gold-500"
                data-testid="button-generate-ai"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Blog Categories</h3>
              <Button
                size="sm"
                onClick={() => {
                  const name = prompt("Category name:");
                  if (name) {
                    createCategoryMutation.mutate({
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    });
                  }
                }}
                data-testid="button-add-category"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No categories yet. Add some to organize your blog posts.
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">/{cat.slug}</span>
                    </div>
                    <Badge variant="outline">{cat.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
