import { PageLayout } from "@/components/layout/page-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, PenTool } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { cardVariants, staggerContainer } from "@/lib/theme-effects";

const blogPosts = [
  {
    id: 1,
    title: "5 Tips for Choosing the Right Paint Colors",
    excerpt: "Selecting the perfect paint color can be overwhelming. Here are our top tips for making the right choice for your home.",
    date: "2025-12-10",
    category: "Tips & Tricks",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Interior vs Exterior Paint: What's the Difference?",
    excerpt: "Understanding the difference between interior and exterior paint is crucial for a successful painting project.",
    date: "2025-12-05",
    category: "Education",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "How to Prepare Your Walls for Painting",
    excerpt: "Proper wall preparation is the key to a professional-looking paint job. Learn the essential steps.",
    date: "2025-11-28",
    category: "How-To",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "2025 Color Trends for Your Home",
    excerpt: "Discover the hottest paint color trends for 2025 and how to incorporate them into your space.",
    date: "2025-11-20",
    category: "Trends",
    readTime: "3 min read",
  },
  {
    id: 5,
    title: "Why Professional Painters Are Worth the Investment",
    excerpt: "Thinking about DIY? Here's why hiring professional painters can save you time and money in the long run.",
    date: "2025-11-15",
    category: "Insights",
    readTime: "4 min read",
  },
];

export default function Blog() {
  const tenant = useTenant();

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
            <h1 className="text-4xl font-display font-bold mb-3">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tips, tricks, and insights from {tenant.name}. Stay up to date with the latest in painting and home improvement.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={cardVariants}
                custom={index}
              >
                <GlassCard 
                  className="h-full p-6 cursor-pointer group" 
                  glow="accent" 
                  hoverEffect="3d"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/20 text-accent">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <GlassCard className="p-8 max-w-2xl mx-auto" glow="gold">
              <PenTool className="w-10 h-10 text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">More Content Coming Soon!</h3>
              <p className="text-muted-foreground">
                We're working on more helpful articles and guides. Check back soon for new content from Ryan and the team.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </PageLayout>
  );
}
