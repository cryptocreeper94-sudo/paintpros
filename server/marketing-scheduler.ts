import { db } from './db';
import { marketingPosts, marketingScheduleConfigs, marketingDeploys } from '@shared/schema';
import { eq, and, ne, asc, sql } from 'drizzle-orm';
import { getConnector, Platform } from './social-connectors';

let schedulerInterval: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

const SCHEDULER_INTERVAL_MS = 60 * 1000; // Check every 60 seconds

async function getNextPost(platform: Platform): Promise<typeof marketingPosts.$inferSelect | null> {
  const posts = await db
    .select()
    .from(marketingPosts)
    .where(eq(marketingPosts.isActive, true))
    .orderBy(asc(marketingPosts.usageCount), asc(marketingPosts.lastUsedAt))
    .limit(1);

  return posts[0] || null;
}

async function deployPost(platform: Platform, post: typeof marketingPosts.$inferSelect): Promise<void> {
  const connector = getConnector(platform);
  
  if (!connector.isConfigured()) {
    console.log(`[Scheduler] ${platform} not configured, skipping`);
    return;
  }

  console.log(`[Scheduler] Deploying to ${platform}: "${post.content.substring(0, 50)}..."`);

  const result = await connector.post(post.content, post.imageUrl || undefined);

  await db.insert(marketingDeploys).values({
    postId: post.id,
    platform,
    status: result.success ? 'success' : 'failed',
    externalId: result.externalId,
    errorMessage: result.error,
  });

  if (result.success) {
    await db
      .update(marketingPosts)
      .set({
        usageCount: sql`${marketingPosts.usageCount} + 1`,
        lastUsedAt: new Date(),
      })
      .where(eq(marketingPosts.id, post.id));

    await db
      .update(marketingScheduleConfigs)
      .set({ lastDeployedAt: new Date(), updatedAt: new Date() })
      .where(eq(marketingScheduleConfigs.platform, platform));

    console.log(`[Scheduler] Successfully deployed to ${platform}, externalId: ${result.externalId}`);
  } else {
    console.error(`[Scheduler] Failed to deploy to ${platform}: ${result.error}`);
  }
}

async function checkAndDeployScheduled(): Promise<void> {
  try {
    const configs = await db
      .select()
      .from(marketingScheduleConfigs)
      .where(eq(marketingScheduleConfigs.isActive, true));

    for (const config of configs) {
      const now = Date.now();
      const lastDeployed = config.lastDeployedAt ? config.lastDeployedAt.getTime() : 0;
      const intervalMs = config.intervalMinutes * 60 * 1000;

      if (now - lastDeployed >= intervalMs) {
        const post = await getNextPost(config.platform as Platform);
        if (post) {
          await deployPost(config.platform as Platform, post);
        } else {
          console.log(`[Scheduler] No active posts available for ${config.platform}`);
        }
      }
    }
  } catch (error) {
    console.error('[Scheduler] Error in scheduled check:', error);
  }
}

export function startScheduler(): void {
  if (isRunning) {
    console.log('[Scheduler] Already running');
    return;
  }

  console.log('[Marketing Scheduler] Starting...');
  isRunning = true;
  schedulerInterval = setInterval(checkAndDeployScheduled, SCHEDULER_INTERVAL_MS);
  
  checkAndDeployScheduled();
}

export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  isRunning = false;
  console.log('[Marketing Scheduler] Stopped');
}

export function getSchedulerStatus(): { isRunning: boolean; intervalMs: number } {
  return { isRunning, intervalMs: SCHEDULER_INTERVAL_MS };
}

export async function manualDeploy(
  platform: Platform,
  content: string,
  imageUrl?: string
): Promise<{ success: boolean; externalId?: string; error?: string }> {
  const connector = getConnector(platform);
  
  if (!connector.isConfigured()) {
    return { success: false, error: `${platform} not configured` };
  }

  const result = await connector.post(content, imageUrl);

  await db.insert(marketingDeploys).values({
    platform,
    status: result.success ? 'success' : 'failed',
    externalId: result.externalId,
    errorMessage: result.error,
  });

  return result;
}
