import { db } from './db';
import { metaIntegrations, marketingImages, marketingPosts, scheduledPosts } from '@shared/schema';
import { eq, and, asc, sql } from 'drizzle-orm';
import { TwitterConnector } from './social-connectors';

let postingInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const CHECK_INTERVAL_MS = 60 * 1000;

const ECOSYSTEM_TENANTS = [
  'darkwave',
  'dwtl',
  'pulse',
  'tlid', 
  'tradeworksai',
  'paintpros',
  'tldriverconnect',
  'garagebot',
  'trustshield',
  'lotopspro',
  'vedasolus',
  'brewboard',
  'orbitstaffing',
  'orbycommander',
  'strikeagent'
];

// Website URLs for each tenant - appended to posts
// Only dwsc.io and dwtl.io use /welcome landing page
const TENANT_URLS: Record<string, string> = {
  'darkwave': 'https://dwsc.io/welcome',
  'dwtl': 'https://dwtl.io/welcome',
  'pulse': 'https://dwsc.io/welcome',
  'tlid': 'https://tlid.io',
  'tradeworksai': 'https://tradeworksai.com',
  'paintpros': 'https://paintpros.io',
  'tldriverconnect': 'https://dwsc.io/welcome',
  'garagebot': 'https://dwsc.io/welcome',
  'trustshield': 'https://trustshield.tech',
  'lotopspro': 'https://dwsc.io/welcome',
  'vedasolus': 'https://dwsc.io/welcome',
  'brewboard': 'https://dwsc.io/welcome',
  'orbitstaffing': 'https://dwsc.io/welcome',
  'orbycommander': 'https://dwsc.io/welcome',
  'strikeagent': 'https://dwsc.io/welcome'
};

// Hourly posting 6am-10pm CST = 17 slots per day
// With 6 businesses rotating, each gets ~3 posts per day
const POSTING_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

// X/Twitter rate limit protection
// Free tier: 500 posts/month, but strict per-minute limits
// Only catch up 1 X post per restart to avoid burst rate limiting
let xPostsThisSession = 0;
const MAX_X_POSTS_PER_RESTART = 1; // Prevent burst catch-ups

function getCurrentCSTTime(): { hour: number; dayOfWeek: number; minute: number } {
  const now = new Date();
  const cstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return {
    hour: cstTime.getHours(),
    minute: cstTime.getMinutes(),
    dayOfWeek: cstTime.getDay()
  };
}

async function getDarkWaveIntegration() {
  const [integration] = await db
    .select()
    .from(metaIntegrations)
    .where(eq(metaIntegrations.tenantId, 'darkwave'))
    .limit(1);
  return integration;
}

async function getPageAccessToken(pageId: string, systemToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=access_token&access_token=${systemToken}`
    );
    if (!response.ok) {
      console.log(`[DW Scheduler] Failed to get page token`);
      return null;
    }
    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.log(`[DW Scheduler] Token error:`, String(error));
    return null;
  }
}

async function getNextImageForTenant(tenantId: string) {
  const images = await db
    .select()
    .from(marketingImages)
    .where(and(
      eq(marketingImages.tenantId, tenantId),
      eq(marketingImages.isActive, true)
    ))
    .orderBy(asc(marketingImages.usageCount), asc(marketingImages.lastUsedAt))
    .limit(1);
  
  return images[0] || null;
}

async function getNextPostForTenant(tenantId: string) {
  const posts = await db
    .select()
    .from(marketingPosts)
    .where(and(
      eq(marketingPosts.tenantId, tenantId),
      eq(marketingPosts.isActive, true)
    ))
    .orderBy(asc(marketingPosts.usageCount), asc(marketingPosts.lastUsedAt))
    .limit(1);
  
  return posts[0] || null;
}

async function postToFacebook(
  pageId: string,
  pageToken: string,
  message: string,
  imageUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    let url: string;
    let body: URLSearchParams;

    if (imageUrl) {
      url = `https://graph.facebook.com/v21.0/${pageId}/photos`;
      console.log(`[DW FB] Calling ${url}`);
      body = new URLSearchParams({
        url: imageUrl,
        caption: message,
        access_token: pageToken,
      });
    } else {
      url = `https://graph.facebook.com/v21.0/${pageId}/feed`;
      body = new URLSearchParams({
        message: message,
        access_token: pageToken,
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(`[DW FB] Error:`, JSON.stringify(error));
      return { success: false, error: error.error?.message || 'Post failed' };
    }

    const data = await response.json();
    console.log(`[DW FB] Success! Post ID: ${data.post_id || data.id}`);
    return { success: true, postId: data.post_id || data.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function postToInstagram(
  igAccountId: string,
  pageToken: string,
  message: string,
  imageUrl: string
): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  try {
    if (imageUrl.endsWith('.png')) {
      console.log(`[DW IG] Warning: PNG may not work. Trying: ${imageUrl}`);
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          image_url: imageUrl,
          caption: message,
          access_token: pageToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json();
      console.log(`[DW IG] Container error:`, JSON.stringify(error));
      return { success: false, error: error.error?.message || 'Container failed' };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    await new Promise(resolve => setTimeout(resolve, 5000));

    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          creation_id: containerId,
          access_token: pageToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      return { success: false, error: error.error?.message || 'Publish failed' };
    }

    const publishData = await publishResponse.json();
    console.log(`[DW IG] Success! Media ID: ${publishData.id}`);
    return { success: true, mediaId: publishData.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

function getTodayKey(): string {
  const now = new Date();
  const cstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return `${cstTime.getFullYear()}-${cstTime.getMonth()}-${cstTime.getDate()}`;
}

const executedSlots: Map<string, Set<string>> = new Map();

async function checkAndExecuteScheduledPosts(): Promise<void> {
  const { hour } = getCurrentCSTTime();
  
  const todayKey = getTodayKey();
  if (!executedSlots.has(todayKey)) {
    executedSlots.clear();
    executedSlots.set(todayKey, new Set());
  }
  const todayExecuted = executedSlots.get(todayKey)!;

  // Check all hours up to current hour
  const dueHours = POSTING_HOURS.filter(h => h <= hour);
  const pendingSlots = dueHours.filter(h => !todayExecuted.has(`${h}`));
  
  if (pendingSlots.length === 0) return;
  
  console.log(`[DW Scheduler] ${pendingSlots.length} pending slot(s) to execute`);

  const integration = await getDarkWaveIntegration();
  if (!integration || !integration.facebookPageAccessToken) {
    console.log(`[DW Scheduler] No DarkWave Meta integration found`);
    return;
  }

  const pageToken = await getPageAccessToken(
    integration.facebookPageId!,
    integration.facebookPageAccessToken
  );
  
  if (!pageToken) {
    console.log(`[DW Scheduler] Could not get page token, trying direct token...`);
  }

  const effectiveToken = pageToken || integration.facebookPageAccessToken;

  for (const slotHour of pendingSlots) {
    const tenantIndex = slotHour % ECOSYSTEM_TENANTS.length;
    const tenant = ECOSYSTEM_TENANTS[tenantIndex];
    
    console.log(`[DW Scheduler] Slot ${slotHour}:00 CST - Posting for ${tenant}`);
    
    const post = await getNextPostForTenant(tenant);
    const image = await getNextImageForTenant(tenant);
    
    if (!post && !image) {
      console.log(`[DW Scheduler] No content for ${tenant}, skipping`);
      todayExecuted.add(`${slotHour}`);
      continue;
    }

    // Append tenant URL to message
    const tenantUrl = TENANT_URLS[tenant] || 'https://dwsc.io/welcome';
    const baseMessage = post?.content || `Discover more about what we do`;
    const message = `${baseMessage}\n\n${tenantUrl}`;
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'https://darkwavestudios.io';
    const imageUrl = image ? `${baseUrl}${image.filePath}` : undefined;

    console.log(`[DW Scheduler] Content: ${post?.id || 'default'}, Image: ${image?.filename || 'none'}`);

    if (integration.facebookPageId) {
      const fbResult = await postToFacebook(
        integration.facebookPageId,
        effectiveToken,
        message,
        imageUrl
      );
      
      if (fbResult.success && post) {
        await db.update(marketingPosts)
          .set({ 
            usageCount: sql`${marketingPosts.usageCount} + 1`,
            lastUsedAt: new Date()
          })
          .where(eq(marketingPosts.id, post.id));
      }
    }

    if (integration.instagramAccountId && imageUrl) {
      await postToInstagram(
        integration.instagramAccountId,
        effectiveToken,
        message,
        imageUrl
      );
      
      if (image) {
        await db.update(marketingImages)
          .set({
            usageCount: sql`${marketingImages.usageCount} + 1`,
            lastUsedAt: new Date()
          })
          .where(eq(marketingImages.id, image.id));
      }
    }

    // Post to X (Twitter) - limit catch-ups to prevent burst rate limiting
    // Posts hourly but only catches up 1 missed slot per restart
    const twitter = new TwitterConnector();
    if (twitter.isConfigured()) {
      if (xPostsThisSession < MAX_X_POSTS_PER_RESTART || pendingSlots.length === 1) {
        // Allow if: first catch-up post OR this is the only pending slot (real-time)
        const xResult = await twitter.post(message, imageUrl);
        xPostsThisSession++; // Increment regardless of success to prevent burst retries
        if (xResult.success) {
          console.log(`[DW X] Success! Tweet ID: ${xResult.externalId}`);
        } else {
          console.log(`[DW X] Failed: ${xResult.error}`);
          // If rate limited, mark as hit limit to skip remaining catch-ups
          if (xResult.error?.includes('429') || xResult.error?.includes('Too Many')) {
            xPostsThisSession = MAX_X_POSTS_PER_RESTART + 10; // Stop all X posting this session
            console.log(`[DW X] Rate limited - skipping X for remaining catch-ups`);
          }
        }
        // Add delay between X posts to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.log(`[DW X] Skipped catch-up for slot ${slotHour} (FB posted, X limit reached)`);
      }
    }

    todayExecuted.add(`${slotHour}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

export function startDarkWaveUnifiedScheduler(): void {
  if (isRunning) {
    console.log('[DW Scheduler] Already running');
    return;
  }

  console.log('[DW Scheduler] Starting Unified Ecosystem Scheduler...');
  console.log('[DW Scheduler] All businesses post through DarkWave Trust Layer');
  console.log('[DW Scheduler] Tenants:', ECOSYSTEM_TENANTS.join(', '));
  console.log('[DW Scheduler] Organic posts hourly 6am-10pm CST (17 posts/day)');
  console.log('[DW Scheduler] Each business gets ~3 posts per day (rotating)');
  
  // Check X/Twitter configuration
  const twitter = new TwitterConnector();
  if (twitter.isConfigured()) {
    console.log('[DW Scheduler] X (Twitter) posting: ENABLED (hourly, burst-protected)');
  } else {
    console.log('[DW Scheduler] X (Twitter) posting: DISABLED (missing credentials)');
  }
  
  // Reset X post counter for this session
  xPostsThisSession = 0;

  isRunning = true;

  checkAndExecuteScheduledPosts().catch(err => {
    console.error('[DW Scheduler] Initial check error:', err);
  });

  postingInterval = setInterval(() => {
    checkAndExecuteScheduledPosts().catch(err => {
      console.error('[DW Scheduler] Check error:', err);
    });
  }, CHECK_INTERVAL_MS);
}

export function stopDarkWaveUnifiedScheduler(): void {
  if (postingInterval) {
    clearInterval(postingInterval);
    postingInterval = null;
  }
  isRunning = false;
  console.log('[DW Scheduler] Stopped');
}
