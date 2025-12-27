import https from 'https';
import http from 'http';
import crypto from 'crypto';

export interface DeployResult {
  success: boolean;
  externalId?: string;
  error?: string;
}

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location!).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const sortedParams = Object.keys(params).sort().map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
}

export class TwitterConnector {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || '';
    this.apiSecret = process.env.TWITTER_API_SECRET || '';
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
    this.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.apiSecret && this.accessToken && this.accessTokenSecret);
  }

  private getOAuthHeader(method: string, url: string, additionalParams: Record<string, string> = {}): string {
    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.apiKey,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: this.accessToken,
      oauth_version: '1.0',
      ...additionalParams,
    };

    const signature = generateOAuthSignature(method, url, oauthParams, this.apiSecret, this.accessTokenSecret);
    oauthParams.oauth_signature = signature;

    const headerParts = Object.keys(oauthParams)
      .filter(k => k.startsWith('oauth_'))
      .sort()
      .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`);

    return `OAuth ${headerParts.join(', ')}`;
  }

  async uploadMedia(imageUrl: string): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const imageBuffer = await downloadImage(imageUrl);
      const base64Image = imageBuffer.toString('base64');

      const url = 'https://upload.twitter.com/1.1/media/upload.json';
      
      // For form-urlencoded requests, body params MUST be included in OAuth signature
      const bodyParams = { media_data: base64Image };
      const body = `media_data=${encodeURIComponent(base64Image)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getOAuthHeader('POST', url, bodyParams),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!response.ok) {
        console.error('[Twitter] Media upload failed:', await response.text());
        return null;
      }

      const data = await response.json() as { media_id_string: string };
      return data.media_id_string;
    } catch (error) {
      console.error('[Twitter] Media upload error:', error);
      return null;
    }
  }

  async post(content: string, imageUrl?: string): Promise<DeployResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Twitter not configured' };
    }

    try {
      let mediaId: string | null = null;
      if (imageUrl) {
        mediaId = await this.uploadMedia(imageUrl);
      }

      const url = 'https://api.twitter.com/2/tweets';
      const body: { text: string; media?: { media_ids: string[] } } = { text: content };
      if (mediaId) {
        body.media = { media_ids: [mediaId] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.getOAuthHeader('POST', url),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Twitter] Post failed:', errorText);
        return { success: false, error: errorText };
      }

      const data = await response.json() as { data: { id: string } };
      return { success: true, externalId: data.data.id };
    } catch (error) {
      console.error('[Twitter] Post error:', error);
      return { success: false, error: String(error) };
    }
  }
}

export class DiscordConnector {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
  }

  isConfigured(): boolean {
    return !!this.webhookUrl;
  }

  async post(content: string, imageUrl?: string): Promise<DeployResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Discord not configured' };
    }

    try {
      const body: { content: string; embeds?: { image: { url: string } }[] } = { content };
      if (imageUrl) {
        body.embeds = [{ image: { url: imageUrl } }];
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Discord] Post failed:', errorText);
        return { success: false, error: errorText };
      }

      return { success: true };
    } catch (error) {
      console.error('[Discord] Post error:', error);
      return { success: false, error: String(error) };
    }
  }
}

export class TelegramConnector {
  private botToken: string;
  private channelId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.channelId = process.env.TELEGRAM_CHANNEL_ID || '';
  }

  isConfigured(): boolean {
    return !!(this.botToken && this.channelId);
  }

  async post(content: string, imageUrl?: string): Promise<DeployResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Telegram not configured' };
    }

    try {
      let url: string;
      let body: Record<string, string>;

      if (imageUrl) {
        url = `https://api.telegram.org/bot${this.botToken}/sendPhoto`;
        body = {
          chat_id: this.channelId,
          photo: imageUrl,
          caption: content,
        };
      } else {
        url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        body = {
          chat_id: this.channelId,
          text: content,
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Telegram] Post failed:', errorText);
        return { success: false, error: errorText };
      }

      const data = await response.json() as { result: { message_id: number } };
      return { success: true, externalId: String(data.result.message_id) };
    } catch (error) {
      console.error('[Telegram] Post error:', error);
      return { success: false, error: String(error) };
    }
  }
}

export class FacebookConnector {
  private pageId: string;
  private pageAccessToken: string;

  constructor() {
    this.pageId = process.env.FACEBOOK_PAGE_ID || '';
    this.pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
  }

  isConfigured(): boolean {
    return !!(this.pageId && this.pageAccessToken);
  }

  async post(content: string, imageUrl?: string): Promise<DeployResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Facebook not configured' };
    }

    try {
      let url: string;
      let body: Record<string, string>;

      if (imageUrl) {
        url = `https://graph.facebook.com/v18.0/${this.pageId}/photos`;
        body = {
          url: imageUrl,
          caption: content,
          access_token: this.pageAccessToken,
        };
      } else {
        url = `https://graph.facebook.com/v18.0/${this.pageId}/feed`;
        body = {
          message: content,
          access_token: this.pageAccessToken,
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Facebook] Post failed:', errorText);
        return { success: false, error: errorText };
      }

      const data = await response.json() as { id: string };
      return { success: true, externalId: data.id };
    } catch (error) {
      console.error('[Facebook] Post error:', error);
      return { success: false, error: String(error) };
    }
  }
}

export type Platform = 'twitter' | 'discord' | 'telegram' | 'facebook';

export const connectors = {
  twitter: new TwitterConnector(),
  discord: new DiscordConnector(),
  telegram: new TelegramConnector(),
  facebook: new FacebookConnector(),
};

export function getConnector(platform: Platform) {
  return connectors[platform];
}

export function getConfiguredPlatforms(): Platform[] {
  const platforms: Platform[] = [];
  if (connectors.twitter.isConfigured()) platforms.push('twitter');
  if (connectors.discord.isConfigured()) platforms.push('discord');
  if (connectors.telegram.isConfigured()) platforms.push('telegram');
  if (connectors.facebook.isConfigured()) platforms.push('facebook');
  return platforms;
}
