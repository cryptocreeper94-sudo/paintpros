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

export interface EstimateAcceptedData {
  customerName: string;
  customerEmail: string;
  estimateId: string;
  estimateTotal: number;
  jobType: string;
  squareFootage?: number;
  tenantName: string;
}

export async function sendEstimateAcceptedEmail(data: EstimateAcceptedData): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const businessEmail = process.env.CONTACT_EMAIL || 'contact@paintpros.io';
    const sender = fromEmail || `${data.tenantName} <onboarding@resend.dev>`;

    // Send confirmation to customer
    await client.emails.send({
      from: sender,
      to: [data.customerEmail],
      subject: `Estimate Accepted - ${data.tenantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Thank You for Accepting Your Estimate!</h2>
          <p>Hi ${data.customerName},</p>
          <p>We're excited to confirm that you've accepted your painting estimate. Our team will be in touch shortly to schedule your project.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1a1a1a;">Estimate Details</h3>
            <p><strong>Estimate ID:</strong> ${data.estimateId.slice(0, 8).toUpperCase()}</p>
            <p><strong>Job Type:</strong> ${data.jobType}</p>
            ${data.squareFootage ? `<p><strong>Square Footage:</strong> ${data.squareFootage} sq ft</p>` : ''}
            <p style="font-size: 24px; color: #22c55e; font-weight: bold;">Total: $${data.estimateTotal.toLocaleString()}</p>
          </div>
          
          <p>If you have any questions, feel free to reply to this email or contact us directly.</p>
          <p>Thank you for choosing ${data.tenantName}!</p>
        </div>
      `
    });

    // Send notification to business
    await client.emails.send({
      from: sender,
      to: [businessEmail],
      subject: `New Estimate Accepted - $${data.estimateTotal.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Estimate Accepted!</h2>
          <p>A customer has accepted their painting estimate.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Estimate Details</h3>
            <p><strong>Estimate ID:</strong> ${data.estimateId}</p>
            <p><strong>Job Type:</strong> ${data.jobType}</p>
            ${data.squareFootage ? `<p><strong>Square Footage:</strong> ${data.squareFootage} sq ft</p>` : ''}
            <p style="font-size: 24px; color: #22c55e; font-weight: bold;">Total: $${data.estimateTotal.toLocaleString()}</p>
          </div>
          
          <p>Please reach out to schedule the project.</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send estimate accepted email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export interface AppointmentReminderData {
  customerEmail: string;
  customerName: string;
  appointmentDate: Date;
  appointmentTime: string;
  serviceType: string;
  tenantName: string;
  timeFrame: string;
}

export async function sendAppointmentReminderEmail(data: AppointmentReminderData): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    
    const sender = fromEmail || 'PaintPros.io <onboarding@resend.dev>';
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    await client.emails.send({
      from: sender,
      to: [data.customerEmail],
      subject: `Appointment Reminder - ${data.timeFrame}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Appointment Reminder</h2>
          <p>Hi ${data.customerName},</p>
          <p>This is a friendly reminder that your ${data.serviceType} appointment is scheduled ${data.timeFrame}.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1a1a1a;">Appointment Details</h3>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${data.appointmentTime}</p>
            <p><strong>Service:</strong> ${data.serviceType}</p>
          </div>
          
          <p>If you need to reschedule or have any questions, please reply to this email or contact us directly.</p>
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br/>${data.tenantName}</p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send appointment reminder email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export interface TenantWelcomeData {
  ownerName: string;
  ownerEmail: string;
  companyName: string;
  companySlug: string;
  subscriptionTier: string;
  monthlyPrice: string;
}

export async function sendTenantWelcomeEmail(data: TenantWelcomeData): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const sender = fromEmail || 'PaintPros.io <onboarding@resend.dev>';

    const tierNames: Record<string, string> = {
      starter: 'Starter',
      professional: 'Professional',
      franchise: 'Franchise Core',
      enterprise: 'Enterprise',
    };

    await client.emails.send({
      from: sender,
      to: [data.ownerEmail],
      subject: `Welcome to PaintPros.io - Your ${data.companyName} Portal is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: linear-gradient(135deg, #4A5D3E, #6B8E5B); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to PaintPros.io</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <p style="font-size: 18px;">Hi ${data.ownerName},</p>
            <p>Congratulations! Your <strong>${data.companyName}</strong> portal is now live and ready to use.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A5D3E;">
              <h3 style="margin-top: 0; color: #4A5D3E;">Your Subscription Details</h3>
              <p><strong>Plan:</strong> ${tierNames[data.subscriptionTier] || data.subscriptionTier}</p>
              <p><strong>Monthly Rate:</strong> $${data.monthlyPrice}/month</p>
              <p><strong>Portal URL:</strong> <a href="https://paintpros.io/${data.companySlug}" style="color: #4A5D3E;">paintpros.io/${data.companySlug}</a></p>
            </div>
            
            <h3 style="color: #1a1a1a;">What's Next?</h3>
            <ol style="line-height: 1.8;">
              <li><strong>Set up your password</strong> - You'll receive a separate email to create your login credentials</li>
              <li><strong>Customize your branding</strong> - Upload your logo and adjust your colors in the dashboard</li>
              <li><strong>Add your first estimate</strong> - Start using the AI-powered estimator to impress customers</li>
              <li><strong>Explore features</strong> - Check out the Color Library, AI Visualizer, and CRM tools</li>
            </ol>
            
            <div style="background: #4A5D3E; color: white; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0;">Need help getting started?</p>
              <p style="margin: 10px 0 0 0;">Reply to this email or visit our <a href="https://paintpros.io/support" style="color: #c8e6c9;">support center</a></p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>PaintPros.io by Orbit - Professional Tools for Painting Contractors</p>
          </div>
        </div>
      `
    });

    console.log(`[Email] Welcome email sent to ${data.ownerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export interface AdminNotificationData {
  type: 'new_tenant' | 'trial_expired' | 'subscription_cancelled';
  tenantName: string;
  tenantEmail: string;
  details: Record<string, any>;
}

export async function sendAdminNotificationEmail(data: AdminNotificationData): Promise<{ success: boolean; error?: string }> {
  try {
    const { client, fromEmail } = await getResendClient();
    const sender = fromEmail || 'PaintPros.io <onboarding@resend.dev>';
    const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || 'admin@paintpros.io';

    const subjects: Record<string, string> = {
      new_tenant: `New Tenant Signup: ${data.tenantName}`,
      trial_expired: `Trial Expired: ${data.tenantName}`,
      subscription_cancelled: `Subscription Cancelled: ${data.tenantName}`,
    };

    await client.emails.send({
      from: sender,
      to: [adminEmail],
      subject: subjects[data.type] || `Alert: ${data.tenantName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Admin Alert: ${data.type.replace(/_/g, ' ').toUpperCase()}</h2>
          <p><strong>Tenant:</strong> ${data.tenantName}</p>
          <p><strong>Email:</strong> ${data.tenantEmail}</p>
          <h3>Details:</h3>
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data.details, null, 2)}</pre>
          <p><a href="https://paintpros.io/admin/tenants">View in Admin Dashboard</a></p>
        </div>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
