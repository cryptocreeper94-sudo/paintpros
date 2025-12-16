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
