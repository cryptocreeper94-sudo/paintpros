import { db } from './db';
import { adCampaigns, scheduledPosts, contentLibrary, metaIntegrations } from '@shared/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

let adSchedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const AD_CHECK_INTERVAL_MS = 30 * 60 * 1000; // Check every 30 minutes

function getCurrentCSTHour(): number {
  const now = new Date();
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
  cityKey?: string;
}

const cityKeyCache: Map<string, string> = new Map();

async function lookupMetaCityKey(
  accessToken: string,
  city: string,
  state: string
): Promise<string | null> {
  const cacheKey = `${city.toLowerCase()},${state.toLowerCase()}`;
  
  if (cityKeyCache.has(cacheKey)) {
    return cityKeyCache.get(cacheKey)!;
  }
  
  try {
    const searchQuery = encodeURIComponent(`${city}, ${state}`);
    const response = await fetch(
      `https://graph.facebook.com/v21.0/search?type=adgeolocation&q=${searchQuery}&location_types=city&access_token=${accessToken}`
    );
    
    if (!response.ok) {
      console.log(`[Geo Lookup] Failed to lookup city: ${city}, ${state}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const match = data.data.find((loc: any) => 
        loc.name.toLowerCase() === city.toLowerCase() &&
        (loc.region?.toLowerCase() === state.toLowerCase() || 
         loc.region_id?.toLowerCase() === state.toLowerCase())
      ) || data.data[0];
      
      const cityKey = match.key;
      console.log(`[Geo Lookup] Found city key for ${city}, ${state}: ${cityKey} (${match.name})`);
      
      cityKeyCache.set(cacheKey, cityKey);
      return cityKey;
    }
    
    console.log(`[Geo Lookup] No results found for ${city}, ${state}`);
    return null;
  } catch (error) {
    console.error(`[Geo Lookup] Error looking up city:`, error);
    return null;
  }
}

// Create a proper ad campaign using Meta Marketing API
async function createAdCampaign(
  integration: typeof metaIntegrations.$inferSelect,
  postId: string,
  pageId: string,
  dailyBudget: number,
  targeting: CampaignTargeting,
  campaignName: string
): Promise<{ success: boolean; campaignId?: string; adSetId?: string; adId?: string; error?: string }> {
  try {
    const adAccountId = integration.adAccountId;
    const accessToken = integration.facebookPageAccessToken;
    
    if (!adAccountId) {
      return { success: false, error: 'No Ad Account ID configured. Please add your Meta Ad Account ID.' };
    }
    
    if (!accessToken) {
      return { success: false, error: 'No access token available' };
    }

    // Look up city key for targeting
    let cityKey = targeting.cityKey;
    if (!cityKey) {
      cityKey = await lookupMetaCityKey(accessToken, targeting.city, targeting.state) || '2514815';
    }

    // Step 1: Create Campaign
    console.log(`[Ad Scheduler] Creating campaign in ad account ${adAccountId}...`);
    const campaignResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/campaigns`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          name: `${campaignName} - ${new Date().toLocaleDateString()}`,
          objective: 'OUTCOME_AWARENESS',
          status: 'PAUSED', // Create paused, activate after full setup
          special_ad_categories: []
        })
      }
    );

    if (!campaignResponse.ok) {
      const error = await campaignResponse.json();
      return { success: false, error: `Campaign creation failed: ${error.error?.message || JSON.stringify(error)}` };
    }

    const campaignData = await campaignResponse.json();
    const campaignId = campaignData.id;
    console.log(`[Ad Scheduler] Campaign created: ${campaignId}`);

    // Step 2: Create Ad Set with targeting
    const adSetResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/adsets`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          name: `${campaignName} AdSet`,
          campaign_id: campaignId,
          daily_budget: Math.round(dailyBudget * 100), // Convert to cents
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'REACH',
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          status: 'PAUSED',
          targeting: {
            geo_locations: {
              cities: [{ 
                key: cityKey,
                radius: targeting.radius,
                distance_unit: 'mile'
              }]
            },
            age_min: targeting.ageMin,
            age_max: targeting.ageMax,
            publisher_platforms: ['facebook', 'instagram'],
            facebook_positions: ['feed', 'instant_article', 'instream_video'],
            instagram_positions: ['stream', 'story', 'explore']
          },
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        })
      }
    );

    if (!adSetResponse.ok) {
      const error = await adSetResponse.json();
      // Clean up campaign on failure
      await fetch(`https://graph.facebook.com/v21.0/${campaignId}`, {
        method: 'DELETE',
        body: JSON.stringify({ access_token: accessToken })
      });
      return { success: false, error: `Ad Set creation failed: ${error.error?.message || JSON.stringify(error)}` };
    }

    const adSetData = await adSetResponse.json();
    const adSetId = adSetData.id;
    console.log(`[Ad Scheduler] Ad Set created: ${adSetId}`);

    // Step 3: Create Ad using the existing post
    const adResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/ads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          name: `${campaignName} Ad`,
          adset_id: adSetId,
          status: 'PAUSED',
          creative: {
            object_story_id: postId.includes('_') ? postId : `${pageId}_${postId}`
          }
        })
      }
    );

    if (!adResponse.ok) {
      const error = await adResponse.json();
      // Clean up on failure
      await fetch(`https://graph.facebook.com/v21.0/${adSetId}`, {
        method: 'DELETE',
        body: JSON.stringify({ access_token: accessToken })
      });
      await fetch(`https://graph.facebook.com/v21.0/${campaignId}`, {
        method: 'DELETE',
        body: JSON.stringify({ access_token: accessToken })
      });
      return { success: false, error: `Ad creation failed: ${error.error?.message || JSON.stringify(error)}` };
    }

    const adData = await adResponse.json();
    const adId = adData.id;
    console.log(`[Ad Scheduler] Ad created: ${adId}`);

    // Step 4: Activate the campaign
    await fetch(`https://graph.facebook.com/v21.0/${campaignId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        status: 'ACTIVE'
      })
    });

    await fetch(`https://graph.facebook.com/v21.0/${adSetId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        status: 'ACTIVE'
      })
    });

    await fetch(`https://graph.facebook.com/v21.0/${adId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        status: 'ACTIVE'
      })
    });

    console.log(`[Ad Scheduler] Campaign ${campaignId} activated successfully!`);

    return { 
      success: true, 
      campaignId, 
      adSetId, 
      adId 
    };

  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// Fallback: Try simple boost if ad account not configured
async function boostPost(
  integration: typeof metaIntegrations.$inferSelect,
  postId: string,
  dailyBudget: number,
  targeting: CampaignTargeting
): Promise<{ success: boolean; adId?: string; error?: string }> {
  try {
    const accessToken = integration.facebookPageAccessToken;
    if (!accessToken) {
      return { success: false, error: 'No access token' };
    }

    let cityKey = targeting.cityKey;
    if (!cityKey) {
      cityKey = await lookupMetaCityKey(accessToken, targeting.city, targeting.state) || '2514815';
    }

    // Try using the promotions endpoint
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${postId}/promotions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          daily_budget: Math.round(dailyBudget * 100),
          duration: 1,
          targeting: {
            geo_locations: {
              cities: [{ 
                key: cityKey,
                name: targeting.city, 
                region: targeting.state 
              }]
            },
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

      // Validate token
      if (integration.facebookPageAccessToken) {
        try {
          const tokenCheck = await fetch(
            `https://graph.facebook.com/v21.0/me?access_token=${integration.facebookPageAccessToken}`
          );
          if (!tokenCheck.ok) {
            console.log(`[Ad Scheduler] Token expired for ${tenantId}, please reconnect Meta`);
            continue;
          }
        } catch (tokenErr) {
          console.log(`[Ad Scheduler] Token validation failed for ${tenantId}, skipping`);
          continue;
        }
      }

      // Check daily spend cap
      const todaySpent = Number(campaign.spent) || 0;
      const dailyBudget = Number(campaign.dailyBudget) || 25;
      
      if (todaySpent >= dailyBudget) {
        console.log(`[Ad Scheduler] ${campaign.name}: Daily budget ($${dailyBudget}) reached`);
        continue;
      }

      // Get recent published posts
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
        console.log(`[Ad Scheduler] No published posts to promote for ${tenantId}`);
        continue;
      }

      const postToBoost = recentPosts[0];
      const isFacebookCampaign = campaign.name.toLowerCase().includes('facebook');
      const postId = isFacebookCampaign 
        ? postToBoost.facebookPostId 
        : postToBoost.instagramMediaId;

      if (!postId) {
        console.log(`[Ad Scheduler] No ${isFacebookCampaign ? 'Facebook' : 'Instagram'} post ID available`);
        continue;
      }

      const remainingBudget = dailyBudget - Number(todaySpent);
      
      const targeting: CampaignTargeting = {
        city: campaign.targetingCity || 'Nashville',
        state: campaign.targetingState || 'Tennessee',
        radius: campaign.targetingRadius || 25,
        ageMin: campaign.ageMin || 25,
        ageMax: campaign.ageMax || 65
      };
      
      console.log(`[Ad Scheduler] Processing ${campaign.name}: budget $${remainingBudget}, targeting ${targeting.city}, ${targeting.state}`);

      let result: { success: boolean; campaignId?: string; adId?: string; error?: string };

      // Use proper Marketing API if ad account is configured
      if (integration.adAccountId) {
        result = await createAdCampaign(
          integration,
          postId,
          integration.facebookPageId || '',
          remainingBudget,
          targeting,
          campaign.name
        );
      } else {
        // Fallback to boost (limited functionality)
        console.log(`[Ad Scheduler] No Ad Account configured, trying boost fallback...`);
        result = await boostPost(integration, postId, remainingBudget, targeting);
      }

      if (result.success) {
        console.log(`[Ad Scheduler] SUCCESS: ${campaign.name} - Campaign: ${result.campaignId || result.adId}`);
        
        await db
          .update(adCampaigns)
          .set({ 
            spent: sql`COALESCE(${adCampaigns.spent}, 0) + ${remainingBudget}`,
            metaAdId: result.campaignId || result.adId,
            errorMessage: null,
            updatedAt: new Date()
          })
          .where(eq(adCampaigns.id, campaign.id));
      } else {
        console.log(`[Ad Scheduler] FAILED: ${campaign.name} - ${result.error}`);
        
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

  // Check every 30 minutes
  adSchedulerInterval = setInterval(checkAndRunAdCampaigns, AD_CHECK_INTERVAL_MS);

  // Reset daily spend at midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    resetDailySpend();
    setInterval(resetDailySpend, 24 * 60 * 60 * 1000);
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
