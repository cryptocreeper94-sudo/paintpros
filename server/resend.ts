// Resend email integration for PaintPros.io
// Uses Replit connector for secure API key management

import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export interface LeadNotificationData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  projectType: string;
  estimatedTotal?: number;
  address?: string;
  notes?: string;
  tenantName?: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    // Use CONTACT_EMAIL env var, or fall back to configured from email, or default
    const recipientEmail = process.env.CONTACT_EMAIL || 'contact@paintpros.io';
    
    const result = await client.emails.send({
      from: fromEmail || 'PaintPros.io <onboarding@resend.dev>',
      to: [recipientEmail],
      replyTo: data.email,
      subject: `New Contact from ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <hr />
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export async function sendLeadNotification(data: LeadNotificationData): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const recipientEmail = process.env.CONTACT_EMAIL || 'contact@paintpros.io';
    const formattedTotal = data.estimatedTotal 
      ? `$${data.estimatedTotal.toLocaleString()}` 
      : 'Not calculated';
    
    const result = await client.emails.send({
      from: fromEmail || 'PaintPros.io <onboarding@resend.dev>',
      to: [recipientEmail],
      replyTo: data.customerEmail,
      subject: `New Estimate Request: ${data.projectType} - ${data.customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffd700; margin: 0; font-size: 24px;">New Estimate Request</h1>
            <p style="color: #888; margin: 5px 0 0 0;">${data.tenantName || 'PaintPros.io'}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #333;">${data.customerName}</td>
              </tr>
              ${data.customerEmail ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td>
              </tr>` : ''}
              ${data.customerPhone ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0; color: #333;"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></td>
              </tr>` : ''}
              ${data.address ? `
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Address:</strong></td>
                <td style="padding: 8px 0; color: #333;">${data.address}</td>
              </tr>` : ''}
            </table>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">Project Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Project Type:</strong></td>
                <td style="padding: 8px 0; color: #333;">${data.projectType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Estimated Total:</strong></td>
                <td style="padding: 8px 0; color: #2e7d32; font-size: 18px; font-weight: bold;">${formattedTotal}</td>
              </tr>
            </table>
            ${data.notes ? `
            <div style="margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
              <strong style="color: #666;">Notes:</strong>
              <p style="color: #333; margin: 8px 0 0 0;">${data.notes}</p>
            </div>` : ''}
          </div>
          
          <div style="background: #1a1a2e; padding: 15px 20px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">
              This is an automated notification from ${data.tenantName || 'PaintPros.io'}
            </p>
          </div>
        </div>
      `
    });

    console.log('[Email] Lead notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Failed to send lead notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
