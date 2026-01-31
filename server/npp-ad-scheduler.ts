import { db } from './db';
import { adCampaigns, scheduledPosts, contentLibrary, metaIntegrations } from '@shared/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { format } from 'date-fns';

let adSchedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

// Meta App is now LIVE - ads enabled
const ADS_ENABLED = true;

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
    const campaignParams = new URLSearchParams({
      access_token: accessToken,
      name: `${campaignName} - ${new Date().toLocaleDateString()}`,
      objective: 'OUTCOME_AWARENESS',
      status: 'PAUSED',
      special_ad_categories: '[]',
      is_adset_budget_sharing_enabled: 'false'
    });
    
    const campaignResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/campaigns`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: campaignParams.toString()
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
    const targetingSpec = JSON.stringify({
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
      facebook_positions: ['feed'],
      instagram_positions: ['stream']
    });
    
    const adSetParams = new URLSearchParams({
      access_token: accessToken,
      name: `${campaignName} AdSet`,
      campaign_id: campaignId,
      daily_budget: String(Math.round(dailyBudget * 100)),
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'REACH',
      bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
      status: 'PAUSED',
      targeting: targetingSpec
    });
    
    const adSetResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/adsets`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: adSetParams.toString()
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

    // Step 3: Create Ad Creative directly (more reliable than reusing posts)
    const adCreativeSpec = JSON.stringify({
      object_story_spec: {
        page_id: pageId,
        link_data: {
          link: `https://nashpaintpros.io`,
          message: 'Transform your home with Nashville\'s trusted painting professionals. Free estimates, quality work guaranteed.',
          name: 'Nashville Painting Professionals',
          description: 'Professional interior and exterior painting services in Nashville, TN.',
          call_to_action: {
            type: 'LEARN_MORE',
            value: { link: 'https://nashpaintpros.io' }
          }
        }
      }
    });
    
    const creativeParams = new URLSearchParams({
      access_token: accessToken,
      name: `${campaignName} Creative`,
      object_story_spec: JSON.stringify({
        page_id: pageId,
        link_data: {
          link: 'https://nashpaintpros.io',
          message: 'Transform your home with Nashville\'s trusted painting professionals. Free estimates, quality work guaranteed.',
          name: 'Nashville Painting Professionals',
          description: 'Professional interior and exterior painting services.',
          call_to_action: { type: 'LEARN_MORE', value: { link: 'https://nashpaintpros.io' } }
        }
      })
    });
    
    const creativeResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/adcreatives`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: creativeParams.toString()
      }
    );
    
    if (!creativeResponse.ok) {
      const creativeError = await creativeResponse.json();
      console.log(`[Ad Scheduler] Creative creation failed: ${creativeError.error?.message}`);
      // Fallback: try using existing post
      console.log(`[Ad Scheduler] Trying existing post as fallback...`);
    }
    
    const creativeData = await creativeResponse.json();
    const creativeId = creativeData.id;
    console.log(`[Ad Scheduler] Creative created: ${creativeId}`);
    
    const adParams = new URLSearchParams({
      access_token: accessToken,
      name: `${campaignName} Ad`,
      adset_id: adSetId,
      status: 'PAUSED',
      creative: JSON.stringify({ creative_id: creativeId })
    });
    
    const adResponse = await fetch(
      `https://graph.facebook.com/v21.0/${adAccountId}/ads`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: adParams.toString()
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
    // First, sync real spend data from Meta for all tenants with active campaigns
    const activeTenants = await db
      .selectDistinct({ tenantId: adCampaigns.tenantId })
      .from(adCampaigns)
      .where(eq(adCampaigns.status, 'active'));
    
    for (const { tenantId } of activeTenants) {
      if (tenantId) {
        await syncMetaSpendData(tenantId);
      }
    }

    // Now get campaigns with updated spend data
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

      // Check daily spend cap (now using real synced data from Meta)
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
    // Only reset if it's actually midnight CST (not on every startup)
    const now = new Date();
    const cstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    const hour = cstTime.getHours();
    
    if (hour !== 0) {
      console.log('[Ad Scheduler] Skipping spend reset - not midnight CST');
      return;
    }
    
    await db
      .update(adCampaigns)
      .set({ spent: '0', updatedAt: new Date() })
      .where(eq(adCampaigns.status, 'active'));
    console.log('[Ad Scheduler] Daily spend reset for all active campaigns');
  } catch (error) {
    console.error('[Ad Scheduler] Error resetting daily spend:', error);
  }
}

// Sync real spend data from Meta API and update campaigns table
async function syncMetaSpendData(tenantId: string): Promise<void> {
  try {
    const integration = await getMetaIntegration(tenantId);
    if (!integration || !integration.adAccountId || !integration.facebookPageAccessToken) {
      return;
    }

    const accessToken = integration.facebookPageAccessToken;
    
    // Fetch today's insights from Meta
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${integration.adAccountId}/insights?` +
      `fields=campaign_id,campaign_name,spend,impressions,reach,clicks&` +
      `date_preset=today&level=campaign&` +
      `access_token=${accessToken}`
    );

    if (!response.ok) {
      console.log('[Meta Sync] Failed to fetch today\'s insights');
      return;
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('[Meta Sync] No campaign insights for today (no active campaigns or no spend yet)');
      return;
    }

    // Aggregate spend by platform (Facebook vs Instagram) for today
    let facebookSpend = 0, instagramSpend = 0;
    let facebookImpressions = 0, instagramImpressions = 0;
    let facebookClicks = 0, instagramClicks = 0;
    
    for (const insight of data.data) {
      const campaignName = insight.campaign_name?.toLowerCase() || '';
      const spend = parseFloat(insight.spend || '0');
      const impressions = parseInt(insight.impressions || '0');
      const clicks = parseInt(insight.clicks || '0');

      console.log(`[Meta Sync] Campaign ${insight.campaign_name}: $${spend.toFixed(2)} spent, ${impressions} impressions, ${clicks} clicks`);

      // Aggregate by platform
      if (campaignName.includes('facebook')) {
        facebookSpend += spend;
        facebookImpressions += impressions;
        facebookClicks += clicks;
      } else if (campaignName.includes('instagram')) {
        instagramSpend += spend;
        instagramImpressions += impressions;
        instagramClicks += clicks;
      }
    }

    // Update our local Facebook campaign with aggregated real data
    if (facebookSpend > 0 || facebookImpressions > 0) {
      await db
        .update(adCampaigns)
        .set({
          spent: facebookSpend.toFixed(2),
          impressions: facebookImpressions,
          clicks: facebookClicks,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        })
        .where(and(
          eq(adCampaigns.tenantId, tenantId),
          sql`LOWER(${adCampaigns.name}) LIKE '%facebook%'`
        ));
      console.log(`[Meta Sync] Updated Facebook campaign: $${facebookSpend.toFixed(2)}, ${facebookImpressions} impressions`);
    }

    // Update our local Instagram campaign with aggregated real data
    if (instagramSpend > 0 || instagramImpressions > 0) {
      await db
        .update(adCampaigns)
        .set({
          spent: instagramSpend.toFixed(2),
          impressions: instagramImpressions,
          clicks: instagramClicks,
          lastSyncAt: new Date(),
          updatedAt: new Date()
        })
        .where(and(
          eq(adCampaigns.tenantId, tenantId),
          sql`LOWER(${adCampaigns.name}) LIKE '%instagram%'`
        ));
      console.log(`[Meta Sync] Updated Instagram campaign: $${instagramSpend.toFixed(2)}, ${instagramImpressions} impressions`);
    }

    console.log(`[Meta Sync] Synced ${data.data.length} Meta campaigns -> FB: $${facebookSpend.toFixed(2)}, IG: $${instagramSpend.toFixed(2)}`);
  } catch (error) {
    console.error('[Meta Sync] Error syncing spend data:', error);
  }
}

// Check for expired campaigns (7-day rotation) and underperforming ads
async function checkCampaignRotation(): Promise<void> {
  try {
    const now = new Date();
    
    // Find expired campaigns (endDate has passed)
    const expiredCampaigns = await db
      .select()
      .from(adCampaigns)
      .where(and(
        eq(adCampaigns.status, 'active'),
        sql`${adCampaigns.endDate} IS NOT NULL AND ${adCampaigns.endDate} < ${now}`
      ));
    
    for (const campaign of expiredCampaigns) {
      console.log(`[Ad Rotation] Campaign "${campaign.name}" has expired (7-day cycle complete)`);
      
      // Mark as completed
      await db
        .update(adCampaigns)
        .set({ 
          status: 'completed',
          updatedAt: new Date()
        })
        .where(eq(adCampaigns.id, campaign.id));
      
      // Create new campaign with fresh content (rotation)
      const newStart = new Date();
      const newEnd = new Date(newStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      await db.insert(adCampaigns).values({
        tenantId: campaign.tenantId,
        name: `${campaign.name.split(' - ')[0]} - ${campaign.platform === 'facebook' ? 'Facebook' : 'Instagram'} Rotation ${format(newStart, 'MMM d')}`,
        platform: campaign.platform,
        objective: campaign.objective || 'OUTCOME_AWARENESS',
        dailyBudget: campaign.dailyBudget,
        status: 'active',
        targetingCity: campaign.targetingCity,
        targetingState: campaign.targetingState,
        targetingRadius: campaign.targetingRadius,
        ageMin: campaign.ageMin,
        ageMax: campaign.ageMax,
        businessHoursStart: campaign.businessHoursStart,
        businessHoursEnd: campaign.businessHoursEnd,
        startDate: newStart,
        endDate: newEnd,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`[Ad Rotation] New ${campaign.platform} campaign created for 7-day cycle`);
    }
    
    // Check for underperforming ads (low engagement after 3+ days)
    const underperformingThreshold = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const activeCampaigns = await db
      .select()
      .from(adCampaigns)
      .where(and(
        eq(adCampaigns.status, 'active'),
        sql`${adCampaigns.startDate} IS NOT NULL AND ${adCampaigns.startDate} < ${underperformingThreshold}`
      ));
    
    for (const campaign of activeCampaigns) {
      // Check if impressions are very low (underperforming indicator)
      const impressions = campaign.impressions || 0;
      const clicks = campaign.clicks || 0;
      const daysRunning = Math.floor((now.getTime() - new Date(campaign.startDate!).getTime()) / (24 * 60 * 60 * 1000));
      
      // If running 3+ days with less than 100 impressions per day, flag as underperforming
      const avgDailyImpressions = daysRunning > 0 ? impressions / daysRunning : 0;
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      
      if (avgDailyImpressions < 100 || ctr < 0.5) {
        console.log(`[Ad Rotation] Campaign "${campaign.name}" underperforming: ${avgDailyImpressions.toFixed(0)} avg daily impressions, ${ctr.toFixed(2)}% CTR`);
        
        // Mark for review but don't auto-replace yet (notify in UI)
        await db
          .update(adCampaigns)
          .set({ 
            errorMessage: `Underperforming: ${avgDailyImpressions.toFixed(0)} avg impressions/day, ${ctr.toFixed(2)}% CTR. Consider replacing content.`,
            updatedAt: new Date()
          })
          .where(eq(adCampaigns.id, campaign.id));
      }
    }
  } catch (error) {
    console.error('[Ad Rotation] Error checking campaign rotation:', error);
  }
}

export function startAdScheduler(): void {
  if (!ADS_ENABLED) {
    console.log('[Ad Scheduler] DISABLED - Meta App needs Live Mode to run ads');
    console.log('[Ad Scheduler] To enable: Switch app to Live at developers.facebook.com');
    return;
  }

  if (isRunning) {
    console.log('[Ad Scheduler] Already running');
    return;
  }

  console.log('[Ad Scheduler] Starting NPP Meta Ad Scheduler...');
  console.log('[Ad Scheduler] Business hours: 8am-6pm, $50/day cap ($25 FB + $25 IG)');
  console.log('[Ad Scheduler] Campaign duration: 7 days with auto-rotation');
  isRunning = true;

  // Run immediately
  checkAndRunAdCampaigns();
  checkCampaignRotation(); // Check for expired/underperforming campaigns

  // Check every 30 minutes
  adSchedulerInterval = setInterval(() => {
    checkAndRunAdCampaigns();
    checkCampaignRotation();
  }, AD_CHECK_INTERVAL_MS);

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

// Fetch real spend data from Meta Insights API
export async function fetchMetaAdInsights(tenantId: string): Promise<{
  success: boolean;
  insights?: {
    campaignId: string;
    campaignName: string;
    spend: string;
    impressions: string;
    reach: string;
    clicks: string;
    dateStart: string;
    dateStop: string;
  }[];
  totalSpend?: number;
  accountSpend?: string;
  error?: string;
}> {
  try {
    const integration = await getMetaIntegration(tenantId);
    if (!integration || !integration.adAccountId) {
      return { success: false, error: 'No ad account configured' };
    }

    const accessToken = integration.facebookPageAccessToken;
    if (!accessToken) {
      return { success: false, error: 'No access token available' };
    }

    // Try multiple date presets to capture recent spend
    const datePresets = ['today', 'last_3d', 'last_7d'];
    let insights: any[] = [];
    let totalSpend = 0;
    let accountSpend = '0';

    // First, try to get account-level spend info
    try {
      const accountResponse = await fetch(
        `https://graph.facebook.com/v21.0/${integration.adAccountId}?` +
        `fields=amount_spent,balance,spend_cap&` +
        `access_token=${accessToken}`
      );
      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        // amount_spent is in cents
        accountSpend = (parseFloat(accountData.amount_spent || '0') / 100).toFixed(2);
        console.log(`[Meta Insights] Account total spend: $${accountSpend}`);
      }
    } catch (e) {
      console.log('[Meta Insights] Could not fetch account spend');
    }

    // Try fetching insights with different date ranges
    for (const preset of datePresets) {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${integration.adAccountId}/insights?` +
        `fields=campaign_id,campaign_name,spend,impressions,reach,clicks&` +
        `date_preset=${preset}&level=campaign&` +
        `access_token=${accessToken}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          insights = data.data.map((item: any) => ({
            campaignId: item.campaign_id,
            campaignName: item.campaign_name,
            spend: item.spend || '0',
            impressions: item.impressions || '0',
            reach: item.reach || '0',
            clicks: item.clicks || '0',
            dateStart: item.date_start,
            dateStop: item.date_stop,
          }));
          totalSpend = insights.reduce((sum: number, i: any) => sum + parseFloat(i.spend || '0'), 0);
          console.log(`[Meta Insights] Found ${insights.length} campaigns with ${preset}, spend: $${totalSpend.toFixed(2)}`);
          break;
        }
      }
    }

    // If no campaign insights but we have account spend, use that
    if (insights.length === 0 && parseFloat(accountSpend) > 0) {
      totalSpend = parseFloat(accountSpend);
    }

    console.log(`[Meta Insights] Final: ${insights.length} campaigns, total spend: $${totalSpend.toFixed(2)}`);

    return { success: true, insights, totalSpend, accountSpend };
  } catch (error) {
    console.error('[Meta Insights] Error fetching insights:', error);
    return { success: false, error: 'Failed to fetch Meta insights' };
  }
}
