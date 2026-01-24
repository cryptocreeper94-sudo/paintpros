import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, User, ArrowLeft, Share2, 
  BookOpen, Tag, Eye, ArrowRight, PenTool
} from "lucide-react";
import type { BlogPost, BlogCategory } from "@shared/schema";
import { cardVariants, staggerContainer } from "@/lib/theme-effects";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

function BlogList() {
  const tenant = useTenant();

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts", tenant.id, "published"],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts?tenantId=${tenant.id}&status=published`);
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

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <main className="min-h-screen bg-background pt-20 pb-16 px-4">
          <div className="max-w-5xl mx-auto flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400" />
          </div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="min-h-screen bg-background pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl font-display font-bold mb-3" data-testid="text-blog-title">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tips, tricks, and insights from {tenant.name}. Stay up to date with the latest in painting and home improvement.
            </p>
          </motion.div>

          
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-12 text-center max-w-2xl mx-auto" glow="gold">
                <PenTool className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  We're working on bringing you valuable content about painting tips, trends, and home improvement. Check back soon!
                </p>
              </GlassCard>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  custom={index}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <GlassCard 
                      className="h-full cursor-pointer group overflow-hidden" 
                      glow="accent" 
                      hoverEffect="3d"
                    >
                      {post.featuredImage && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={post.featuredImage} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {getCategoryName(post.categoryId) && (
                            <Badge variant="outline" className="text-gold-400 border-gold-400/30">
                              {getCategoryName(post.categoryId)}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTimeMinutes} min
                          </span>
                        </div>
                        
                        <h2 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2" data-testid={`text-post-title-${post.id}`}>
                          {post.title}
                        </h2>
                        
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.viewCount || 0}
                            </span>
                            {post.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                          <span className="flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            Read <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

function BlogPostView({ slug }: { slug: string }) {
  const tenant = useTenant();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", slug, tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${slug}?tenantId=${tenant.id}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
  });

  const trackViewMutation = useMutation({
    mutationFn: async (postId: string) => {
      await fetch(`/api/blog/posts/${postId}/view`, { method: "POST" });
    },
  });

  useEffect(() => {
    if (post?.id) {
      trackViewMutation.mutate(post.id);
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <PageLayout>
        <main className="min-h-screen bg-background pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400" />
          </div>
        </main>
      </PageLayout>
    );
  }

  if (error || !post) {
    return (
      <PageLayout>
        <main className="min-h-screen bg-background pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button variant="outline" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
      </PageLayout>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const renderContent = (content: string) => {
    return content
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3 text-foreground">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc text-muted-foreground">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground leading-relaxed">')
      .replace(/^(?!<[hul])(.+)$/gm, (match) => {
        if (match.trim().startsWith('<')) return match;
        return `<p class="mb-4 text-muted-foreground leading-relaxed">${match}</p>`;
      });
  };

  return (
    <PageLayout>
      <article className="min-h-screen bg-background pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            {post.featuredImage && (
              <div className="aspect-video rounded-xl overflow-hidden">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {post.tags?.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-gold-400 border-gold-400/30">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold" data-testid="text-post-heading">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {post.authorName && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-gold-400" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{post.authorName}</span>
                      {post.authorRole && (
                        <span className="text-muted-foreground"> · {post.authorRole}</span>
                      )}
                    </div>
                  </div>
                )}
                {post.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTimeMinutes} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {(post.viewCount || 0) + 1} views
                </span>
              </div>
            </div>

            <GlassCard className="p-6 md:p-8">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />
            </GlassCard>

            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Found this helpful? Share it with others!
              </p>
              <Button 
                variant="outline" 
                size="sm"
                data-testid="button-share"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </article>
    </PageLayout>
  );
}

export default function Blog() {
  const [match, params] = useRoute("/blog/:slug");
  
  if (match && params?.slug) {
    return <BlogPostView slug={params.slug} />;
  }
  
  return <BlogList />;
}
