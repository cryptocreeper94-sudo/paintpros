/**
 * Meta OAuth Handler
 * 
 * Implements Facebook/Instagram OAuth flow for Marketing Autopilot subscribers.
 * Users click "Connect with Facebook" → authorize → we get long-lived page tokens.
 */

import { db } from './db';
import { metaIntegrations, autopilotSubscriptions } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Meta OAuth Configuration
const META_APP_ID = process.env.META_APP_ID || process.env.FACEBOOK_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || process.env.FACEBOOK_APP_SECRET || '';

// Permissions we need to post on behalf of businesses
const PERMISSIONS = [
  'pages_manage_posts',      // Post to Facebook Pages
  'pages_read_engagement',   // Read page insights
  'instagram_basic',         // Basic Instagram access
  'instagram_content_publish', // Post to Instagram
  'business_management'      // Manage business pages
].join(',');

export interface OAuthState {
  subscriberId: string;
  returnUrl: string;
}

export class MetaOAuthHandler {
  private appId: string;
  private appSecret: string;
  private redirectUri: string;

  constructor() {
    this.appId = META_APP_ID;
    this.appSecret = META_APP_SECRET;
    // Use the actual domain in production
    this.redirectUri = `${process.env.REPLIT_DOMAINS?.split(',')[0] ? 'https://' + process.env.REPLIT_DOMAINS.split(',')[0] : 'http://localhost:5000'}/api/meta/callback`;
  }

  isConfigured(): boolean {
    return !!(this.appId && this.appSecret);
  }

  /**
   * Generate the OAuth authorization URL
   */
  getAuthorizationUrl(subscriberId: string, returnUrl: string = '/autopilot/portal'): string {
    const state = Buffer.from(JSON.stringify({
      subscriberId,
      returnUrl
    })).toString('base64');

    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: PERMISSIONS,
      response_type: 'code',
      state
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    expiresIn: number;
  } | null> {
    try {
      const params = new URLSearchParams({
        client_id: this.appId,
        client_secret: this.appSecret,
        redirect_uri: this.redirectUri,
        code
      });

      const response = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('[Meta OAuth] Token exchange failed:', error);
        return null;
      }

      const data = await response.json() as { access_token: string; expires_in: number };
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      console.error('[Meta OAuth] Token exchange error:', error);
      return null;
    }
  }

  /**
   * Exchange short-lived token for long-lived token (~60 days)
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  } | null> {
    try {
      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: this.appId,
        client_secret: this.appSecret,
        fb_exchange_token: shortLivedToken
      });

      const response = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('[Meta OAuth] Long-lived token exchange failed:', error);
        return null;
      }

      const data = await response.json() as { access_token: string; expires_in: number };
      console.log('[Meta OAuth] Got long-lived token, expires in:', Math.round(data.expires_in / 86400), 'days');
      
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      console.error('[Meta OAuth] Long-lived token error:', error);
      return null;
    }
  }

  /**
   * Get user's Facebook Pages
   */
  async getUserPages(accessToken: string): Promise<{
    id: string;
    name: string;
    accessToken: string;
    instagramBusinessAccountId?: string;
  }[]> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`
      );

      if (!response.ok) {
        console.error('[Meta OAuth] Failed to get pages:', await response.text());
        return [];
      }

      const data = await response.json() as {
        data: {
          id: string;
          name: string;
          access_token: string;
          instagram_business_account?: { id: string };
        }[];
      };

      return data.data.map(page => ({
        id: page.id,
        name: page.name,
        accessToken: page.access_token,
        instagramBusinessAccountId: page.instagram_business_account?.id
      }));
    } catch (error) {
      console.error('[Meta OAuth] Get pages error:', error);
      return [];
    }
  }

  /**
   * Get Instagram username from business account ID
   */
  async getInstagramUsername(instagramAccountId: string, accessToken: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${instagramAccountId}?fields=username&access_token=${accessToken}`
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as { username: string };
      return data.username;
    } catch (error) {
      return null;
    }
  }

  /**
   * Complete OAuth flow - save tokens to database
   */
  async completeOAuthFlow(
    subscriberId: string,
    code: string
  ): Promise<{ success: boolean; error?: string; pages?: { id: string; name: string }[] }> {
    try {
      // 1. Exchange code for short-lived token
      const shortLivedResult = await this.exchangeCodeForToken(code);
      if (!shortLivedResult) {
        return { success: false, error: 'Failed to exchange authorization code' };
      }

      // 2. Exchange for long-lived token
      const longLivedResult = await this.exchangeForLongLivedToken(shortLivedResult.accessToken);
      if (!longLivedResult) {
        return { success: false, error: 'Failed to get long-lived token' };
      }

      // 3. Get user's pages
      const pages = await this.getUserPages(longLivedResult.accessToken);
      if (pages.length === 0) {
        return { success: false, error: 'No Facebook Pages found. Please make sure you have admin access to a Facebook Page.' };
      }

      // 4. Get subscriber's tenant ID
      const [subscriber] = await db.select()
        .from(autopilotSubscriptions)
        .where(eq(autopilotSubscriptions.id, subscriberId));

      if (!subscriber) {
        return { success: false, error: 'Subscriber not found' };
      }

      // 5. Use the first page (or we could let user choose)
      const selectedPage = pages[0];
      
      // 6. Get Instagram username if connected
      let instagramUsername: string | null = null;
      if (selectedPage.instagramBusinessAccountId) {
        instagramUsername = await this.getInstagramUsername(
          selectedPage.instagramBusinessAccountId,
          selectedPage.accessToken
        );
      }

      // 7. Calculate token expiration date
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + longLivedResult.expiresIn);

      // 8. Save to database
      await db.insert(metaIntegrations).values({
        id: crypto.randomUUID(),
        tenantId: subscriber.tenantId,
        appId: this.appId,
        facebookPageId: selectedPage.id,
        facebookPageName: selectedPage.name,
        facebookPageAccessToken: selectedPage.accessToken,
        facebookConnected: true,
        instagramAccountId: selectedPage.instagramBusinessAccountId || null,
        instagramUsername: instagramUsername,
        instagramConnected: !!selectedPage.instagramBusinessAccountId,
        tokenExpiresAt: expiresAt,
        tokenType: 'long_lived',
        lastSyncAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: metaIntegrations.tenantId,
        set: {
          facebookPageId: selectedPage.id,
          facebookPageName: selectedPage.name,
          facebookPageAccessToken: selectedPage.accessToken,
          facebookConnected: true,
          instagramAccountId: selectedPage.instagramBusinessAccountId || null,
          instagramUsername: instagramUsername,
          instagramConnected: !!selectedPage.instagramBusinessAccountId,
          tokenExpiresAt: expiresAt,
          tokenType: 'long_lived',
          lastSyncAt: new Date(),
          updatedAt: new Date()
        }
      });

      // 9. Update subscriber record
      await db.update(autopilotSubscriptions)
        .set({
          metaConnected: true,
          facebookPageId: selectedPage.id,
          facebookPageName: selectedPage.name,
          instagramAccountId: selectedPage.instagramBusinessAccountId || null,
          instagramUsername: instagramUsername,
          updatedAt: new Date()
        })
        .where(eq(autopilotSubscriptions.id, subscriberId));

      console.log(`[Meta OAuth] Successfully connected ${selectedPage.name} for subscriber ${subscriberId}`);

      return { 
        success: true, 
        pages: pages.map(p => ({ id: p.id, name: p.name }))
      };
    } catch (error) {
      console.error('[Meta OAuth] Complete flow error:', error);
      return { success: false, error: String(error) };
    }
  }
}

export const metaOAuth = new MetaOAuthHandler();
