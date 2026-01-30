import { db } from './db';
import { adCampaigns, scheduledPosts, contentLibrary, metaIntegrations } from '@shared/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

let adSchedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const AD_CHECK_INTERVAL_MS = 30 * 60 * 1000; // Check every 30 minutes

function isBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 8 && hour < 18; // 8am to 6pm
}

async function getMetaIntegration(tenantId: string) {
  const integrations = await db
    .select()
    .from(metaIntegrations)
    .where(eq(metaIntegrations.tenantId, tenantId))
    .limit(1);
  return integrations[0] || null;
}

async function boostPost(
  integration: typeof metaIntegrations.$inferSelect,
  postId: string,
  dailyBudget: number
): Promise<{ success: boolean; adId?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${postId}/promotions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: integration.facebookPageAccessToken,
          daily_budget: Math.round(dailyBudget * 100), // Convert to cents
          duration: 1, // 1 day
          targeting: {
            geo_locations: {
              cities: [{ key: '2514815', name: 'Nashville', region: 'Tennessee' }],
              location_types: ['home', 'recent']
            },
            age_min: 25,
            age_max: 65
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Boost failed' };
    }

    const data = await response.json();
    return { success: true, adId: data.ad_id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function checkAndRunAdCampaigns(): Promise<void> {
  if (!isBusinessHours()) {
    console.log('[Ad Scheduler] Outside business hours (8am-6pm), skipping ad check');
    return;
  }

  try {
    const campaigns = await db
      .select()
      .from(adCampaigns)
      .where(eq(adCampaigns.status, 'active'));

    for (const campaign of campaigns) {
      const tenantId = campaign.tenantId;
      if (!tenantId) continue;

      const integration = await getMetaIntegration(tenantId);
      if (!integration || !integration.facebookConnected) {
        console.log(`[Ad Scheduler] No Meta integration for tenant ${tenantId}`);
        continue;
      }

      // Check daily spend cap
      const todaySpent = campaign.spent || 0;
      const dailyBudget = Number(campaign.dailyBudget) || 25;
      
      if (todaySpent >= dailyBudget) {
        console.log(`[Ad Scheduler] ${campaign.name}: Daily budget ($${dailyBudget}) reached, spent: $${todaySpent}`);
        continue;
      }

      // Get recent published posts to boost
      const recentPosts = await db
        .select()
        .from(scheduledPosts)
        .where(
          and(
            eq(scheduledPosts.tenantId, tenantId),
            eq(scheduledPosts.status, 'published')
          )
        )
        .orderBy(desc(scheduledPosts.publishedAt))
        .limit(1);

      if (recentPosts.length === 0) {
        console.log(`[Ad Scheduler] No published posts to boost for ${tenantId}`);
        continue;
      }

      const postToBoost = recentPosts[0];
      const postId = campaign.name.includes('Facebook') 
        ? postToBoost.facebookPostId 
        : postToBoost.instagramMediaId;

      if (!postId) {
        console.log(`[Ad Scheduler] No post ID available for boosting`);
        continue;
      }

      const remainingBudget = dailyBudget - todaySpent;
      console.log(`[Ad Scheduler] Boosting post for ${campaign.name}, budget: $${remainingBudget}`);

      const result = await boostPost(integration, postId, remainingBudget);

      if (result.success) {
        console.log(`[Ad Scheduler] Successfully boosted post, Ad ID: ${result.adId}`);
        
        // Update campaign spent amount
        await db
          .update(adCampaigns)
          .set({ 
            spent: sql`COALESCE(${adCampaigns.spent}, 0) + ${remainingBudget}`,
            metaAdId: result.adId,
            updatedAt: new Date()
          })
          .where(eq(adCampaigns.id, campaign.id));
      } else {
        console.log(`[Ad Scheduler] Failed to boost: ${result.error}`);
        
        await db
          .update(adCampaigns)
          .set({ 
            errorMessage: result.error,
            updatedAt: new Date()
          })
          .where(eq(adCampaigns.id, campaign.id));
      }
    }
  } catch (error) {
    console.error('[Ad Scheduler] Error:', error);
  }
}

// Reset daily spend at midnight
async function resetDailySpend(): Promise<void> {
  try {
    await db
      .update(adCampaigns)
      .set({ spent: '0', updatedAt: new Date() })
      .where(eq(adCampaigns.status, 'active'));
    console.log('[Ad Scheduler] Daily spend reset for all active campaigns');
  } catch (error) {
    console.error('[Ad Scheduler] Error resetting daily spend:', error);
  }
}

export function startAdScheduler(): void {
  if (isRunning) {
    console.log('[Ad Scheduler] Already running');
    return;
  }

  console.log('[Ad Scheduler] Starting NPP Meta Ad Scheduler...');
  console.log('[Ad Scheduler] Business hours: 8am-6pm, $50/day cap ($25 FB + $25 IG)');
  isRunning = true;

  // Run immediately
  checkAndRunAdCampaigns();

  // Check every 30 minutes during business hours
  adSchedulerInterval = setInterval(checkAndRunAdCampaigns, AD_CHECK_INTERVAL_MS);

  // Reset daily spend at midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    resetDailySpend();
    setInterval(resetDailySpend, 24 * 60 * 60 * 1000); // Reset every 24 hours
  }, msUntilMidnight);
}

export function stopAdScheduler(): void {
  if (adSchedulerInterval) {
    clearInterval(adSchedulerInterval);
    adSchedulerInterval = null;
  }
  isRunning = false;
  console.log('[Ad Scheduler] Stopped');
}

export function getAdSchedulerStatus(): { isRunning: boolean; isBusinessHours: boolean } {
  return { isRunning, isBusinessHours: isBusinessHours() };
}
