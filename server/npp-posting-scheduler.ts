import { db } from './db';
import { metaIntegrations, autoPostingSchedule, scheduledPosts, marketingImages, marketingPosts } from '@shared/schema';
import { eq, and, asc, sql } from 'drizzle-orm';
import { TwitterConnector, NextdoorConnector } from './social-connectors';

let postingInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const CHECK_INTERVAL_MS = 60 * 1000;

function getCurrentCSTTime(): { hour: number; dayOfWeek: number; minute: number } {
  const now = new Date();
  const cstTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  return {
    hour: cstTime.getHours(),
    minute: cstTime.getMinutes(),
    dayOfWeek: cstTime.getDay()
  };
}

async function getMetaIntegration(tenantId: string) {
  const [integration] = await db
    .select()
    .from(metaIntegrations)
    .where(eq(metaIntegrations.tenantId, tenantId))
    .limit(1);
  return integration;
}

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${token}`);
    return response.ok;
  } catch {
    return false;
  }
}

async function getNextImage(tenantId: string, category?: string) {
  // If category specified, filter by it (especially important for before-after)
  if (category) {
    const categoryImages = await db
      .select()
      .from(marketingImages)
      .where(and(
        eq(marketingImages.tenantId, tenantId),
        eq(marketingImages.isActive, true),
        eq(marketingImages.category, category)
      ))
      .orderBy(asc(marketingImages.usageCount), asc(marketingImages.lastUsedAt))
      .limit(1);
    
    if (categoryImages[0]) return categoryImages[0];
  }
  
  // Fallback to any active image (but NOT before-after unless specifically requested)
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

async function getNextMessage() {
  const messages = await db
    .select()
    .from(marketingPosts)
    .where(eq(marketingPosts.isActive, true))
    .orderBy(asc(marketingPosts.usageCount), asc(marketingPosts.lastUsedAt))
    .limit(1);
  
  return messages[0] || null;
}

// Get the PAGE access token from a system user token
async function getPageAccessToken(pageId: string, systemToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${pageId}?fields=access_token&access_token=${systemToken}`
    );
    if (!response.ok) {
      console.log(`[FB Token] Failed to get page token`);
      return null;
    }
    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.log(`[FB Token] Error:`, String(error));
    return null;
  }
}

async function postToFacebook(
  pageId: string,
  systemUserToken: string,
  message: string,
  imageUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    // Get the PAGE token from the system user token - this is required for posting
    const pageToken = await getPageAccessToken(pageId, systemUserToken);
    if (!pageToken) {
      return { success: false, error: 'Could not get page access token' };
    }

    let url: string;
    let body: URLSearchParams;

    if (imageUrl) {
      // Use /photos endpoint for image posts
      url = `https://graph.facebook.com/v21.0/${pageId}/photos`;
      body = new URLSearchParams({
        url: imageUrl,
        caption: message,
        access_token: pageToken,
        published: 'true',
      });
    } else {
      // Use /feed endpoint for text-only posts
      url = `https://graph.facebook.com/v21.0/${pageId}/feed`;
      body = new URLSearchParams({
        message: message,
        access_token: pageToken,
      });
    }

    console.log(`[FB Post] Calling ${url.split('?')[0]}`);

    const response = await fetch(url, {
      method: 'POST',
      body: body,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log(`[FB Post] Error response:`, JSON.stringify(data));
      return { success: false, error: data.error?.message || 'Post failed' };
    }

    console.log(`[FB Post] Success! Post ID: ${data.id || data.post_id}`);
    return { success: true, postId: data.id || data.post_id };
  } catch (error) {
    console.log(`[FB Post] Exception:`, String(error));
    return { success: false, error: String(error) };
  }
}

async function postToInstagram(
  instagramAccountId: string,
  facebookPageId: string,
  systemUserToken: string,
  caption: string,
  imageUrl: string
): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  try {
    // Get the PAGE token from the system user token
    const pageToken = await getPageAccessToken(facebookPageId, systemUserToken);
    if (!pageToken) {
      return { success: false, error: 'Could not get page access token for Instagram' };
    }

    // Instagram requires JPEG format - convert PNG URL if needed
    let finalImageUrl = imageUrl;
    if (imageUrl.toLowerCase().endsWith('.png')) {
      console.log(`[IG Post] Warning: PNG image may not work. Trying anyway: ${imageUrl}`);
    }

    const containerResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          image_url: finalImageUrl,
          caption: caption,
          access_token: pageToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json();
      return { success: false, error: error.error?.message || 'Container creation failed' };
    }

    const containerData = await containerResponse.json();
    const containerId = containerData.id;

    await new Promise(resolve => setTimeout(resolve, 3000));

    const publishResponse = await fetch(
      `https://graph.facebook.com/v21.0/${instagramAccountId}/media_publish`,
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
    return { success: true, mediaId: publishData.id };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function checkAndExecuteScheduledPosts(): Promise<void> {
  const { hour, minute, dayOfWeek } = getCurrentCSTTime();
  
  try {
    // Get ALL schedules for today that haven't been executed yet
    // This allows catching up on missed posts from earlier in the day
    const allTodaySchedules = await db
      .select()
      .from(autoPostingSchedule)
      .where(and(
        eq(autoPostingSchedule.tenantId, 'npp'),
        eq(autoPostingSchedule.isActive, true),
        eq(autoPostingSchedule.dayOfWeek, dayOfWeek)
      ));

    // Filter to schedules that are due (hour has passed) and not yet executed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueSchedules = allTodaySchedules.filter(schedule => {
      // Only consider schedules where the hour has passed
      if (schedule.hourOfDay > hour) return false;
      
      // Check if already executed today
      if (schedule.lastExecutedAt) {
        const lastExec = new Date(schedule.lastExecutedAt);
        if (lastExec >= today) {
          return false; // Already executed today
        }
      }
      return true;
    });

    if (dueSchedules.length === 0) return;
    
    console.log(`[NPP Posting] Found ${dueSchedules.length} due/missed posts to execute`);

    for (const schedule of dueSchedules) {

      console.log(`[NPP Posting] Executing scheduled post for ${schedule.tenantId} - Day ${dayOfWeek}, Hour ${hour}`);

      const integration = await getMetaIntegration(schedule.tenantId);
      if (!integration || !integration.facebookPageAccessToken) {
        console.log(`[NPP Posting] No Meta integration for ${schedule.tenantId}`);
        continue;
      }

      const tokenValid = await validateToken(integration.facebookPageAccessToken);
      if (!tokenValid) {
        console.log(`[NPP Posting] Token validation failed for ${schedule.tenantId}, attempting post anyway...`);
        // Don't skip - attempt the post and let Facebook tell us the real error
      }

      const messageContent = await getNextMessage();
      
      // CRITICAL: Match image category to message category
      // Especially important for "Before & After" posts - must show actual before/after images
      let imageCategory: string | undefined;
      const isBeforeAfterMessage = messageContent?.content?.toLowerCase().includes('before') && 
                                    messageContent?.content?.toLowerCase().includes('after');
      
      if (messageContent?.content) {
        const content = messageContent.content.toLowerCase();
        if (isBeforeAfterMessage) {
          imageCategory = 'before_after'; // Use underscore to match database
          console.log(`[NPP Posting] Before/After message detected - requiring before_after image`);
        } else if (content.includes('exterior') || content.includes('curb appeal')) {
          imageCategory = 'exterior';
        } else if (content.includes('interior') || content.includes('living') || content.includes('bedroom')) {
          imageCategory = 'interior';
        } else if (content.includes('cabinet') || content.includes('kitchen')) {
          imageCategory = 'cabinets';
        } else if (content.includes('deck') || content.includes('fence')) {
          imageCategory = 'decks';
        } else if (content.includes('commercial') || content.includes('office') || content.includes('business')) {
          imageCategory = 'commercial';
        }
      }
      
      const image = await getNextImage(schedule.tenantId, imageCategory);
      
      if (!image && !messageContent) {
        console.log(`[NPP Posting] No content available for ${schedule.tenantId}`);
        continue;
      }
      
      // VALIDATION: If message mentions before/after but no matching before_after image available, skip this post
      // Check both naming conventions (before-after and before_after)
      const imageIsBeforeAfter = image?.category === 'before_after' || 
                                  image?.category === 'before-after' ||
                                  image?.filename?.toLowerCase().includes('before');
      
      if (isBeforeAfterMessage && !imageIsBeforeAfter) {
        console.log(`[NPP Posting] SKIPPING: Before/After message but no before/after image available (got category: ${image?.category}). This prevents misleading posts.`);
        continue;
      }

      const message = messageContent?.content || 'Quality painting services from Nashville Painting Professionals! Call 615-555-PAINT for your free estimate.';
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : 'https://paintpros.io';
      const imageUrl = image ? `${baseUrl}${image.filePath}` : undefined;
      
      console.log(`[NPP Posting] Using image: ${image?.filename || 'none'}, message: ${messageContent?.id || 'default'}`);
      console.log(`[NPP Posting] Image URL: ${imageUrl}`);

      let fbResult: { success: boolean; postId?: string; error?: string } = { success: false };
      let igResult: { success: boolean; mediaId?: string; error?: string } = { success: false };

      if (integration.facebookPageId && (schedule.platform === 'facebook' || schedule.platform === 'both')) {
        console.log(`[NPP Posting] Posting to Facebook...`);
        fbResult = await postToFacebook(
          integration.facebookPageId,
          integration.facebookPageAccessToken,
          message,
          imageUrl
        );
        if (fbResult.success) {
          console.log(`[NPP Posting] Facebook post successful: ${fbResult.postId}`);
        } else {
          console.log(`[NPP Posting] Facebook post failed: ${fbResult.error}`);
        }
      }

      if (integration.instagramAccountId && imageUrl && (schedule.platform === 'instagram' || schedule.platform === 'both')) {
        console.log(`[NPP Posting] Posting to Instagram...`);
        igResult = await postToInstagram(
          integration.instagramAccountId,
          integration.facebookPageId,
          integration.facebookPageAccessToken,
          message,
          imageUrl
        );
        if (igResult.success) {
          console.log(`[NPP Posting] Instagram post successful: ${igResult.mediaId}`);
        } else {
          console.log(`[NPP Posting] Instagram post failed: ${igResult.error}`);
        }
      }

      // Post to X/Twitter if configured
      let xResult: { success: boolean; tweetId?: string; error?: string } = { success: false };
      const twitterConnector = TwitterConnector.forTenant(integration);
      if (twitterConnector) {
        console.log(`[NPP Posting] Posting to X/Twitter...`);
        const tweetResult = await twitterConnector.post(message, imageUrl);
        xResult = { success: tweetResult.success, tweetId: tweetResult.externalId, error: tweetResult.error };
        if (xResult.success) {
          console.log(`[NPP Posting] X/Twitter post successful: ${xResult.tweetId}`);
        } else {
          console.log(`[NPP Posting] X/Twitter post failed: ${xResult.error}`);
        }
      }

      // Post to Nextdoor if configured
      let nextdoorResult: { success: boolean; postId?: string; error?: string } = { success: false };
      const nextdoorConnector = NextdoorConnector.forTenant(integration);
      if (nextdoorConnector) {
        console.log(`[NPP Posting] Posting to Nextdoor...`);
        const ndResult = await nextdoorConnector.post(message, imageUrl);
        nextdoorResult = { success: ndResult.success, postId: ndResult.externalId, error: ndResult.error };
        if (nextdoorResult.success) {
          console.log(`[NPP Posting] Nextdoor post successful: ${nextdoorResult.postId}`);
        } else {
          console.log(`[NPP Posting] Nextdoor post failed: ${nextdoorResult.error}`);
        }
      }

      if (fbResult.success || igResult.success || xResult.success || nextdoorResult.success) {
        await db.insert(scheduledPosts).values({
          tenantId: schedule.tenantId,
          contentLibraryId: image?.id || messageContent?.id || null,
          message: message,
          imageUrl: imageUrl,
          platform: schedule.platform === 'both' ? 'facebook' : (schedule.platform || 'facebook'),
          status: 'published',
          facebookPostId: fbResult.postId,
          instagramMediaId: igResult.mediaId,
          scheduledAt: new Date(),
          publishedAt: new Date(),
        });

        // Update image usage tracking
        if (image) {
          await db
            .update(marketingImages)
            .set({
              usageCount: sql`COALESCE(${marketingImages.usageCount}, 0) + 1`,
              lastUsedAt: new Date(),
            })
            .where(eq(marketingImages.id, image.id));
        }
        
        // Update message usage tracking
        if (messageContent) {
          await db
            .update(marketingPosts)
            .set({
              usageCount: sql`COALESCE(${marketingPosts.usageCount}, 0) + 1`,
              lastUsedAt: new Date(),
            })
            .where(eq(marketingPosts.id, messageContent.id));
        }

        await db
          .update(autoPostingSchedule)
          .set({ lastExecutedAt: new Date() })
          .where(eq(autoPostingSchedule.id, schedule.id));
      }
    }
  } catch (error) {
    console.error('[NPP Posting] Error in scheduled check:', error);
  }
}

export function startNppPostingScheduler(): void {
  if (isRunning) {
    console.log('[NPP Posting] Already running');
    return;
  }

  console.log('[NPP Posting Scheduler] Starting...');
  console.log('[NPP Posting Scheduler] Weekdays (Mon-Fri): 5 posts at 6am,10am,2pm,6pm,10pm CST');
  console.log('[NPP Posting Scheduler] Weekends (Sat-Sun): 3 posts at 8am,2pm,8pm CST');
  isRunning = true;
  
  checkAndExecuteScheduledPosts();
  
  postingInterval = setInterval(checkAndExecuteScheduledPosts, CHECK_INTERVAL_MS);
}

export function stopNppPostingScheduler(): void {
  if (postingInterval) {
    clearInterval(postingInterval);
    postingInterval = null;
  }
  isRunning = false;
  console.log('[NPP Posting Scheduler] Stopped');
}

export async function triggerManualPost(tenantId: string): Promise<{ facebook?: any; instagram?: any }> {
  const integration = await getMetaIntegration(tenantId);
  if (!integration || !integration.facebookPageAccessToken) {
    throw new Error('No Meta integration configured');
  }

  const messageContent = await getNextMessage();
  
  // CRITICAL: Match image category to message category
  let imageCategory: string | undefined;
  const isBeforeAfterMessage = messageContent?.content?.toLowerCase().includes('before') && 
                                messageContent?.content?.toLowerCase().includes('after');
  
  if (messageContent?.content) {
    const content = messageContent.content.toLowerCase();
    if (isBeforeAfterMessage) {
      imageCategory = 'before_after'; // Use underscore to match database
    } else if (content.includes('exterior') || content.includes('curb appeal')) {
      imageCategory = 'exterior';
    } else if (content.includes('interior') || content.includes('living') || content.includes('bedroom')) {
      imageCategory = 'interior';
    } else if (content.includes('cabinet') || content.includes('kitchen')) {
      imageCategory = 'cabinets';
    } else if (content.includes('deck') || content.includes('fence')) {
      imageCategory = 'decks';
    } else if (content.includes('commercial') || content.includes('office') || content.includes('business')) {
      imageCategory = 'commercial';
    }
  }
  
  const image = await getNextImage(tenantId, imageCategory);
  
  if (!image && !messageContent) {
    throw new Error('No content available');
  }
  
  // VALIDATION: If message mentions before/after but no matching before_after image available, throw error
  const imageIsBeforeAfter = image?.category === 'before_after' || 
                              image?.category === 'before-after' ||
                              image?.filename?.toLowerCase().includes('before');
  
  if (isBeforeAfterMessage && !imageIsBeforeAfter) {
    throw new Error('Before/After message requires a before-after image. Please upload proper before/after comparison images first.');
  }

  const results: { facebook?: any; instagram?: any } = {};
  const message = messageContent?.content || 'Quality painting services from Nashville Painting Professionals!';
  const baseUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
    : 'https://paintpros.io';
  const imageUrl = image ? `${baseUrl}${image.filePath}` : undefined;

  if (integration.facebookPageId) {
    results.facebook = await postToFacebook(
      integration.facebookPageId,
      integration.facebookPageAccessToken,
      message,
      imageUrl
    );
  }

  if (integration.instagramAccountId && imageUrl) {
    results.instagram = await postToInstagram(
      integration.instagramAccountId,
      integration.facebookPageId,
      integration.facebookPageAccessToken,
      message,
      imageUrl
    );
  }

  if (results.facebook?.success || results.instagram?.success) {
    await db.insert(scheduledPosts).values({
      tenantId,
      contentLibraryId: image?.id || messageContent?.id || null,
      message: message,
      imageUrl: imageUrl,
      platform: 'facebook',
      status: 'published',
      facebookPostId: results.facebook?.postId,
      instagramMediaId: results.instagram?.mediaId,
      scheduledAt: new Date(),
      publishedAt: new Date(),
    });

    // Update image usage tracking
    if (image) {
      await db
        .update(marketingImages)
        .set({
          usageCount: sql`COALESCE(${marketingImages.usageCount}, 0) + 1`,
          lastUsedAt: new Date(),
        })
        .where(eq(marketingImages.id, image.id));
    }
    
    // Update message usage tracking
    if (messageContent) {
      await db
        .update(marketingPosts)
        .set({
          usageCount: sql`COALESCE(${marketingPosts.usageCount}, 0) + 1`,
          lastUsedAt: new Date(),
        })
        .where(eq(marketingPosts.id, messageContent.id));
    }
  }

  return results;
}
