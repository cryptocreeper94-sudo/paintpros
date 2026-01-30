import { db } from './db';
import { blogPosts, blogCategories } from '@shared/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const SCHEDULER_INTERVAL_MS = 60 * 60 * 1000; // Check every hour

interface BlogScheduleConfig {
  tenantId: string;
  enabled: boolean;
  postsPerWeek: number;
  lastGeneratedAt: Date | null;
}

const blogScheduleConfigs: BlogScheduleConfig[] = [
  { tenantId: 'npp', enabled: true, postsPerWeek: 2, lastGeneratedAt: null },
  { tenantId: 'lumepaint', enabled: true, postsPerWeek: 2, lastGeneratedAt: null },
  { tenantId: 'demo', enabled: true, postsPerWeek: 3, lastGeneratedAt: null },
  { tenantId: 'tradeworks', enabled: true, postsPerWeek: 3, lastGeneratedAt: null },
];

const seoTopics: Record<string, string[]> = {
  npp: [
    "Best paint colors for Nashville homes in 2026",
    "How to prepare your Nashville home for exterior painting",
    "Interior painting tips for Tennessee weather",
    "Choosing between flat and satin paint finishes",
    "When to repaint your home's exterior in Nashville",
    "Color trends for Southern homes",
    "DIY vs professional painting: what Nashville homeowners need to know",
    "How to protect your paint from Nashville humidity",
  ],
  lumepaint: [
    "Elevating your space with designer paint colors",
    "The psychology of color in luxury home design",
    "Premium paint finishes that transform your home",
    "Creating a cohesive color palette throughout your home",
    "The art of accent walls: when and where to use them",
    "How professional painters achieve flawless results",
    "Timeless paint colors that never go out of style",
    "The importance of proper surface preparation",
  ],
  demo: [
    "How to find reliable painting contractors near you",
    "Questions to ask before hiring a painting company",
    "Understanding painting estimates and quotes",
    "TradeWorks AI: The ultimate field toolkit for contractors",
    "What to expect during a professional painting project",
    "How technology is transforming the painting industry",
    "Tips for getting accurate painting quotes online",
    "The benefits of using a contractor marketplace",
  ],
  tradeworks: [
    "Essential calculators every painting contractor needs",
    "How to estimate electrical work accurately",
    "Plumbing calculations made easy with AI",
    "HVAC sizing: getting it right the first time",
    "Roofing material calculations for contractors",
    "Carpentry measurements and material estimation",
    "Concrete and masonry volume calculations",
    "Landscaping estimates: materials and labor",
  ],
};

const tenantContexts: Record<string, string> = {
  npp: "Nashville Painting Professionals - a trusted local painting company in Nashville, TN. Use a friendly, professional tone focused on the Nashville area.",
  lumepaint: "Lume Paint Co - a premium painting company with the tagline 'We elevate the backdrop of your life'. Use a sophisticated, modern tone.",
  demo: "PaintPros.io - a marketplace connecting homeowners with professional painters. Include tips for hiring contractors. Mention TradeWorks AI as a professional tool for contractors.",
  tradeworks: "TradeWorks AI - a professional field toolkit with 85+ calculators for 8 trades. Write helpful trade tips that showcase the value of having professional calculation tools.",
};

async function generateBlogPost(tenantId: string, topic: string): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  tags: string[];
} | null> {
  try {
    const tenantContext = tenantContexts[tenantId] || tenantContexts.npp;
    
    const prompt = `Write a blog post about: "${topic}"

Company Context: ${tenantContext}

Requirements:
- Tone: professional and helpful
- Length: 700-900 words
- Structure with clear headings (use ## for headings)
- Include practical tips readers can use
- End with a subtle call-to-action

Format the response as JSON with these fields:
{
  "title": "Engaging blog post title",
  "excerpt": "2-3 sentence summary for previews",
  "content": "Full blog post content in markdown",
  "metaDescription": "SEO meta description (under 160 chars)",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}`;

    const baseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1";
    const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "";
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error(`[Blog Scheduler] AI API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    const slug = content.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return {
      title: content.title,
      slug,
      excerpt: content.excerpt,
      content: content.content,
      metaDescription: content.metaDescription,
      tags: content.suggestedTags || [],
    };
  } catch (error) {
    console.error('[Blog Scheduler] Error generating post:', error);
    return null;
  }
}

async function getRecentPostCount(tenantId: string, daysSince: number): Promise<number> {
  const since = new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000);
  const posts = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(and(
      eq(blogPosts.tenantId, tenantId),
      sql`${blogPosts.createdAt} >= ${since}`
    ));
  return posts[0]?.count || 0;
}

async function getRandomCategory(tenantId: string): Promise<string | null> {
  const categories = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.tenantId, tenantId));
  
  if (categories.length === 0) return null;
  return categories[Math.floor(Math.random() * categories.length)].id;
}

async function getUnusedTopic(tenantId: string): Promise<string | null> {
  const topics = seoTopics[tenantId] || seoTopics.npp;
  
  const recentPosts = await db
    .select({ title: blogPosts.title })
    .from(blogPosts)
    .where(eq(blogPosts.tenantId, tenantId))
    .orderBy(desc(blogPosts.createdAt))
    .limit(20);
  
  const usedTitles = recentPosts.map(p => p.title.toLowerCase());
  
  const unusedTopics = topics.filter(topic => 
    !usedTitles.some(title => title.includes(topic.toLowerCase().slice(0, 20)))
  );
  
  if (unusedTopics.length === 0) {
    return topics[Math.floor(Math.random() * topics.length)];
  }
  
  return unusedTopics[Math.floor(Math.random() * unusedTopics.length)];
}

async function checkAndGeneratePosts(): Promise<void> {
  if (isRunning) return;
  isRunning = true;

  try {
    for (const config of blogScheduleConfigs) {
      if (!config.enabled) continue;

      const postsThisWeek = await getRecentPostCount(config.tenantId, 7);
      
      if (postsThisWeek >= config.postsPerWeek) {
        continue;
      }

      const topic = await getUnusedTopic(config.tenantId);
      if (!topic) {
        console.log(`[Blog Scheduler] No topics available for ${config.tenantId}`);
        continue;
      }

      console.log(`[Blog Scheduler] Generating post for ${config.tenantId}: "${topic}"`);
      
      const post = await generateBlogPost(config.tenantId, topic);
      if (!post) {
        console.log(`[Blog Scheduler] Failed to generate post for ${config.tenantId}`);
        continue;
      }

      const categoryId = await getRandomCategory(config.tenantId);

      await db.insert(blogPosts).values({
        tenantId: config.tenantId,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        metaDescription: post.metaDescription,
        tags: post.tags,
        categoryId,
        status: 'published',
        publishedAt: new Date(),
        aiGenerated: true,
        aiPrompt: topic,
        authorName: config.tenantId === 'tradeworks' ? 'TradeWorks AI' : 'The Painting Team',
        authorRole: config.tenantId === 'tradeworks' ? 'AI Assistant' : 'Professional Painters',
        readingTimeMinutes: Math.ceil(post.content.split(' ').length / 200),
      });

      console.log(`[Blog Scheduler] Published: "${post.title}" for ${config.tenantId}`);
      config.lastGeneratedAt = new Date();
      
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } catch (error) {
    console.error('[Blog Scheduler] Error:', error);
  } finally {
    isRunning = false;
  }
}

export function startBlogScheduler(): void {
  if (schedulerInterval) return;
  
  console.log('[Blog Scheduler] Starting automatic blog generation...');
  
  setTimeout(() => {
    checkAndGeneratePosts();
  }, 30000);
  
  schedulerInterval = setInterval(checkAndGeneratePosts, SCHEDULER_INTERVAL_MS);
}

export function stopBlogScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('[Blog Scheduler] Stopped');
  }
}

export async function triggerBlogGeneration(tenantId?: string): Promise<{ generated: string[] }> {
  const generated: string[] = [];
  
  const configs = tenantId 
    ? blogScheduleConfigs.filter(c => c.tenantId === tenantId)
    : blogScheduleConfigs;

  for (const config of configs) {
    if (!config.enabled) continue;

    const topic = await getUnusedTopic(config.tenantId);
    if (!topic) continue;

    const post = await generateBlogPost(config.tenantId, topic);
    if (!post) continue;

    const categoryId = await getRandomCategory(config.tenantId);

    await db.insert(blogPosts).values({
      tenantId: config.tenantId,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      metaDescription: post.metaDescription,
      tags: post.tags,
      categoryId,
      status: 'published',
      publishedAt: new Date(),
      aiGenerated: true,
      aiPrompt: topic,
      authorName: config.tenantId === 'tradeworks' ? 'TradeWorks AI' : 'The Painting Team',
      authorRole: config.tenantId === 'tradeworks' ? 'AI Assistant' : 'Professional Painters',
      readingTimeMinutes: Math.ceil(post.content.split(' ').length / 200),
    });

    generated.push(`${config.tenantId}: ${post.title}`);
  }

  return { generated };
}
