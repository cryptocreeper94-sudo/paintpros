/**
 * Marketing Autopilot Engine
 * 
 * Handles automated posting to Facebook & Instagram for all active Autopilot subscribers.
 * Each subscriber has their own Meta credentials stored in the database.
 */

import { db } from './db';
import { autopilotSubscriptions, metaIntegrations } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface PostResult {
  success: boolean;
  platform: 'facebook' | 'instagram';
  postId?: string;
  error?: string;
}

export interface AutopilotSubscriber {
  id: string;
  tenantId: string;
  businessName: string;
  status: string;
  facebookPageId?: string;
  facebookPageName?: string;
  instagramAccountId?: string;
  instagramUsername?: string;
  postingSchedule: string;
  dailyBudget?: number;
}

/**
 * Multi-tenant Facebook Connector
 * Posts to any Facebook Page using the provided credentials
 */
export class MultiTenantFacebookConnector {
  
  async post(
    pageId: string,
    accessToken: string,
    content: string,
    imageUrl?: string
  ): Promise<PostResult> {
    try {
      let url: string;
      let body: Record<string, string>;

      if (imageUrl) {
        // Post with image
        url = `https://graph.facebook.com/v18.0/${pageId}/photos`;
        body = {
          url: imageUrl,
          caption: content,
          access_token: accessToken,
        };
      } else {
        // Text-only post
        url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
        body = {
          message: content,
          access_token: accessToken,
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Autopilot Facebook] Post failed:', errorText);
        return { success: false, platform: 'facebook', error: errorText };
      }

      const data = await response.json() as { id: string };
      console.log('[Autopilot Facebook] Post successful:', data.id);
      return { success: true, platform: 'facebook', postId: data.id };
    } catch (error) {
      console.error('[Autopilot Facebook] Post error:', error);
      return { success: false, platform: 'facebook', error: String(error) };
    }
  }
}

/**
 * Multi-tenant Instagram Connector
 * Posts to any Instagram Business Account using the provided credentials
 * Instagram uses the same Page Access Token as Facebook (via linked Page)
 */
export class MultiTenantInstagramConnector {
  
  async post(
    instagramAccountId: string,
    accessToken: string,
    content: string,
    imageUrl: string
  ): Promise<PostResult> {
    try {
      // Step 1: Create media container
      const containerUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media`;
      const containerBody = {
        image_url: imageUrl,
        caption: content,
        access_token: accessToken,
      };

      const containerResponse = await fetch(containerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(containerBody),
      });

      if (!containerResponse.ok) {
        const errorText = await containerResponse.text();
        console.error('[Autopilot Instagram] Container creation failed:', errorText);
        return { success: false, platform: 'instagram', error: errorText };
      }

      const containerData = await containerResponse.json() as { id: string };
      const containerId = containerData.id;

      // Step 2: Publish the container
      const publishUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`;
      const publishBody = {
        creation_id: containerId,
        access_token: accessToken,
      };

      const publishResponse = await fetch(publishUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishBody),
      });

      if (!publishResponse.ok) {
        const errorText = await publishResponse.text();
        console.error('[Autopilot Instagram] Publish failed:', errorText);
        return { success: false, platform: 'instagram', error: errorText };
      }

      const publishData = await publishResponse.json() as { id: string };
      console.log('[Autopilot Instagram] Post successful:', publishData.id);
      return { success: true, platform: 'instagram', postId: publishData.id };
    } catch (error) {
      console.error('[Autopilot Instagram] Post error:', error);
      return { success: false, platform: 'instagram', error: String(error) };
    }
  }
}

/**
 * Autopilot Engine
 * Main class that coordinates posting for all subscribers
 */
export class AutopilotEngine {
  private facebookConnector: MultiTenantFacebookConnector;
  private instagramConnector: MultiTenantInstagramConnector;

  constructor() {
    this.facebookConnector = new MultiTenantFacebookConnector();
    this.instagramConnector = new MultiTenantInstagramConnector();
  }

  /**
   * Get all active subscribers with their Meta credentials
   */
  async getActiveSubscribers(): Promise<AutopilotSubscriber[]> {
    const subscribers = await db.select()
      .from(autopilotSubscriptions)
      .where(eq(autopilotSubscriptions.status, 'active'));
    
    return subscribers as AutopilotSubscriber[];
  }

  /**
   * Get Meta integration credentials for a subscriber
   */
  async getMetaCredentials(tenantId: string) {
    const [integration] = await db.select()
      .from(metaIntegrations)
      .where(eq(metaIntegrations.tenantId, tenantId));
    
    return integration;
  }

  /**
   * Post to Facebook for a specific subscriber
   */
  async postToFacebook(
    subscriberId: string,
    content: string,
    imageUrl?: string
  ): Promise<PostResult> {
    // Get subscriber
    const [subscriber] = await db.select()
      .from(autopilotSubscriptions)
      .where(eq(autopilotSubscriptions.id, subscriberId));

    if (!subscriber) {
      return { success: false, platform: 'facebook', error: 'Subscriber not found' };
    }

    // Get Meta credentials
    const credentials = await this.getMetaCredentials(subscriber.tenantId);
    if (!credentials || !credentials.facebookPageId || !credentials.facebookPageAccessToken) {
      return { success: false, platform: 'facebook', error: 'Facebook not connected' };
    }

    return this.facebookConnector.post(
      credentials.facebookPageId,
      credentials.facebookPageAccessToken,
      content,
      imageUrl
    );
  }

  /**
   * Post to Instagram for a specific subscriber
   */
  async postToInstagram(
    subscriberId: string,
    content: string,
    imageUrl: string // Required for Instagram
  ): Promise<PostResult> {
    // Get subscriber
    const [subscriber] = await db.select()
      .from(autopilotSubscriptions)
      .where(eq(autopilotSubscriptions.id, subscriberId));

    if (!subscriber) {
      return { success: false, platform: 'instagram', error: 'Subscriber not found' };
    }

    // Get Meta credentials
    const credentials = await this.getMetaCredentials(subscriber.tenantId);
    if (!credentials || !credentials.instagramAccountId || !credentials.facebookPageAccessToken) {
      return { success: false, platform: 'instagram', error: 'Instagram not connected' };
    }

    return this.instagramConnector.post(
      credentials.instagramAccountId,
      credentials.facebookPageAccessToken, // Instagram uses the same token
      content,
      imageUrl
    );
  }

  /**
   * Post to both platforms for a subscriber
   */
  async postToBoth(
    subscriberId: string,
    content: string,
    imageUrl?: string
  ): Promise<{ facebook?: PostResult; instagram?: PostResult }> {
    const results: { facebook?: PostResult; instagram?: PostResult } = {};

    // Post to Facebook
    results.facebook = await this.postToFacebook(subscriberId, content, imageUrl);

    // Post to Instagram (only if image provided - Instagram requires images)
    if (imageUrl) {
      results.instagram = await this.postToInstagram(subscriberId, content, imageUrl);
    }

    return results;
  }

  /**
   * Run posting job for all active subscribers
   * This would be called by a scheduled task/cron job
   */
  async runScheduledPosts(): Promise<void> {
    console.log('[Autopilot] Starting scheduled post run...');
    
    const subscribers = await this.getActiveSubscribers();
    console.log(`[Autopilot] Found ${subscribers.length} active subscribers`);

    for (const subscriber of subscribers) {
      try {
        // Parse posting schedule
        const schedule = subscriber.postingSchedule 
          ? JSON.parse(subscriber.postingSchedule) 
          : null;

        if (!schedule) {
          console.log(`[Autopilot] No schedule for ${subscriber.businessName}, skipping`);
          continue;
        }

        // Generate content for this subscriber
        // In production, this would pull from their content library or generate new content
        const content = await this.generateContent(subscriber);
        
        // Post to platforms
        const result = await this.postToBoth(subscriber.id, content.caption, content.imageUrl);
        
        console.log(`[Autopilot] Posted for ${subscriber.businessName}:`, result);
      } catch (error) {
        console.error(`[Autopilot] Error posting for ${subscriber.businessName}:`, error);
      }
    }

    console.log('[Autopilot] Scheduled post run complete');
  }

  /**
   * Generate content for a subscriber
   * This is a placeholder - in production would use content library or OpenAI
   */
  private async generateContent(subscriber: AutopilotSubscriber): Promise<{ caption: string; imageUrl?: string }> {
    // Placeholder content - in production would pull from subscriber's content library
    // or generate using OpenAI based on their business type
    return {
      caption: `Quality service from ${subscriber.businessName}. Contact us today for a free estimate!`,
      imageUrl: undefined // Would pull from their uploaded images
    };
  }
}

// Export singleton instance
export const autopilotEngine = new AutopilotEngine();
