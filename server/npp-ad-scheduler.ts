import { db } from './db';
import { adCampaigns, scheduledPosts, contentLibrary, metaIntegrations } from '@shared/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

let adSchedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const AD_CHECK_INTERVAL_MS = 30 * 60 * 1000; // Check every 30 minutes

function getCurrentCSTHour(): number {
  // Convert to Central Time (CST = UTC-6, CDT = UTC-5)
  const now = new Date();
  // Use America/Chicago timezone for Central Time (handles DST automatically)
  const cstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const hour = cstTime.getHours();
  console.log(`[Ad Scheduler] Current CST time: ${cstTime.toLocaleTimeString()}, hour: ${hour}`);
  return hour;
}

function isBusinessHours(startHour: number = 8, endHour: number = 18): boolean {
  const hour = getCurrentCSTHour();
  return hour >= startHour && hour < endHour;
}

async function getMetaIntegration(tenantId: string) {
  const integrations = await db
    .select()
    .from(metaIntegrations)
    .where(eq(metaIntegrations.tenantId, tenantId))
    .limit(1);
  return integrations[0] || null;
}

interface CampaignTargeting {
  city: string;
  state: string;
  radius: number;
  ageMin: number;
  ageMax: number;
}

async function boostPost(
  integration: typeof metaIntegrations.$inferSelect,
  postId: string,
  dailyBudget: number,
  targeting: CampaignTargeting
): Promise<{ success: boolean; adId?: string; error?: string }> {
  try {
    // Build geo targeting based on campaign settings
    const geoTargeting = {
      cities: [{ 
        key: '2514815', // Default Nashville key, would need a lookup API for other cities
        name: targeting.city, 
        region: targeting.state 
      }],
      location_types: ['home', 'recent'],
      radius: targeting.radius,
      distance_unit: 'mile'
    };

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
            geo_locations: geoTargeting,
            age_min: targeting.ageMin,
            age_max: targeting.ageMax
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
  const currentHour = getCurrentCSTHour();
  
  try {
    const campaigns = await db
      .select()
      .from(adCampaigns)
      .where(eq(adCampaigns.status, 'active'));

    if (campaigns.length === 0) {
      console.log('[Ad Scheduler] No active campaigns found');
      return;
    }

    for (const campaign of campaigns) {
      const tenantId = campaign.tenantId;
      if (!tenantId) continue;

      // Check campaign-specific business hours
      const startHour = campaign.businessHoursStart || 8;
      const endHour = campaign.businessHoursEnd || 18;
      
      if (currentHour < startHour || currentHour >= endHour) {
        console.log(`[Ad Scheduler] ${campaign.name}: Outside campaign hours (${startHour}:00-${endHour}:00), skipping`);
        continue;
      }

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
      
      // Build targeting from campaign settings
      const targeting: CampaignTargeting = {
        city: campaign.targetingCity || 'Nashville',
        state: campaign.targetingState || 'Tennessee',
        radius: campaign.targetingRadius || 25,
        ageMin: campaign.ageMin || 25,
        ageMax: campaign.ageMax || 65
      };
      
      console.log(`[Ad Scheduler] Boosting post for ${campaign.name}, budget: $${remainingBudget}, targeting: ${targeting.city}, ${targeting.state}`);

      const result = await boostPost(integration, postId, remainingBudget, targeting);

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
