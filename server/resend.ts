// Resend email integration for PaintPros.io
// Uses Replit connector for secure API key management

import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  console.log("[Email] Getting Resend credentials...");
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    console.error("[Email] X_REPLIT_TOKEN not found");
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  console.log("[Email] Fetching from connector hostname:", hostname);
  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings?.api_key)) {
    console.error("[Email] Resend not connected - no API key in connection settings");
    throw new Error('Resend not connected');
  }
  console.log("[Email] Credentials obtained successfully, fromEmail:", connectionSettings.settings.from_email);
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

export interface EstimateProposalData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
  };
  services: {
    walls: boolean;
    trim: boolean;
    ceilings: boolean;
    doors: boolean;
    cabinets: boolean;
  };
  measurements: {
    squareFootage: number;
    doorCount: number;
    cabinetDoors: number;
    cabinetDrawers: number;
  };
  colors: Array<{
    colorName: string;
    hexValue: string;
    surface: string;
    brand: string;
  }>;
  pricing: {
    tier: string;
    tierName: string;
    total: number;
  };
  tenantName: string;
  serviceEmail: string;
}

export async function sendEstimateProposalEmail(data: EstimateProposalData): Promise<{ success: boolean; error?: string }> {
  console.log("[Email] Attempting to send estimate proposal email to:", data.customer.email);
  try {
    const { client, fromEmail } = await getResendClient();
    console.log("[Email] Resend client obtained, fromEmail:", fromEmail);
    const sender = fromEmail || `${data.tenantName} <onboarding@resend.dev>`;

    const servicesList = Object.entries(data.services)
      .filter(([_, selected]) => selected)
      .map(([service]) => service.charAt(0).toUpperCase() + service.slice(1))
      .join(', ');

    const colorSwatches = data.colors.map(c => 
      `<span style="display:inline-block;margin:2px;padding:4px 8px;background:${c.hexValue};color:${parseInt(c.hexValue.slice(1), 16) > 8388607 ? '#000' : '#fff'};border-radius:4px;font-size:12px;">${c.colorName} (${c.surface})</span>`
    ).join('');

    const measurementsHtml = [];
    if (data.measurements.squareFootage > 0) {
      measurementsHtml.push(`<p><strong>Square Footage:</strong> ${data.measurements.squareFootage.toLocaleString()} sq ft</p>`);
    }
    if (data.measurements.doorCount > 0) {
      measurementsHtml.push(`<p><strong>Doors:</strong> ${data.measurements.doorCount}</p>`);
    }
    if (data.measurements.cabinetDoors > 0 || data.measurements.cabinetDrawers > 0) {
      measurementsHtml.push(`<p><strong>Cabinet Doors:</strong> ${data.measurements.cabinetDoors}, <strong>Drawers:</strong> ${data.measurements.cabinetDrawers}</p>`);
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2d4a3e 0%, #3d6b54 100%); padding: 32px 24px; text-align: center;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">Nashville Painting</p>
                          <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; line-height: 1.2;">Professionals</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 16px;">
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="background-color: rgba(255,255,255,0.15); border-radius: 20px; padding: 8px 20px;">
                                <p style="margin: 0; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.95); text-transform: uppercase; letter-spacing: 1px;">Your Painting Estimate</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Greeting -->
                <tr>
                  <td style="padding: 32px 24px 0 24px;">
                    <p style="margin: 0; font-size: 20px; font-weight: 600; color: #18181b;">Hi ${data.customer.firstName},</p>
                    <p style="margin: 12px 0 0 0; font-size: 15px; line-height: 1.6; color: #52525b;">Thank you for your interest! Here's a summary of your painting estimate.</p>
                  </td>
                </tr>
                
                <!-- Price Card -->
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #2d4a3e 0%, #3d6b54 100%); border-radius: 12px;">
                      <tr>
                        <td style="padding: 28px; text-align: center;">
                          <p style="margin: 0; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 1px;">Estimated Total</p>
                          <p style="margin: 8px 0 0 0; font-size: 42px; font-weight: 700; color: #ffffff; letter-spacing: -1px;">$${data.pricing.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Project Details Grid -->
                <tr>
                  <td style="padding: 0 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 16px; background-color: #fafafa; border-radius: 12px;">
                          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Services Included</p>
                          <p style="margin: 0; font-size: 15px; font-weight: 500; color: #18181b; line-height: 1.5;">${servicesList}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Measurements -->
                ${measurementsHtml.length > 0 ? `
                <tr>
                  <td style="padding: 12px 24px 0 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 16px; background-color: #fafafa; border-radius: 12px;">
                          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Project Measurements</p>
                          ${data.measurements.squareFootage > 0 ? `<p style="margin: 0 0 4px 0; font-size: 15px; color: #18181b;"><span style="font-weight: 500;">${data.measurements.squareFootage.toLocaleString()} sq ft</span></p>` : ''}
                          ${data.measurements.doorCount > 0 ? `<p style="margin: 0 0 4px 0; font-size: 15px; color: #18181b;"><span style="font-weight: 500;">${data.measurements.doorCount} doors</span></p>` : ''}
                          ${data.measurements.cabinetDoors > 0 || data.measurements.cabinetDrawers > 0 ? `<p style="margin: 0; font-size: 15px; color: #18181b;"><span style="font-weight: 500;">${data.measurements.cabinetDoors} cabinet doors, ${data.measurements.cabinetDrawers} drawers</span></p>` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                <!-- Colors -->
                ${data.colors.length > 0 ? `
                <tr>
                  <td style="padding: 12px 24px 0 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 16px; background-color: #fafafa; border-radius: 12px;">
                          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px;">Selected Colors</p>
                          <table role="presentation" cellspacing="0" cellpadding="0">
                            ${data.colors.map(c => `
                            <tr>
                              <td style="padding: 4px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0">
                                  <tr>
                                    <td style="width: 24px; height: 24px; background-color: ${c.hexValue}; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1);"></td>
                                    <td style="padding-left: 12px;">
                                      <p style="margin: 0; font-size: 14px; font-weight: 500; color: #18181b;">${c.colorName}</p>
                                      <p style="margin: 2px 0 0 0; font-size: 12px; color: #71717a;">${c.brand} - ${c.surface}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            `).join('')}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                
                <!-- CTA Button -->
                <tr>
                  <td style="padding: 28px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <a href="mailto:${data.serviceEmail}?subject=Painting%20Estimate%20Inquiry" style="display: inline-block; background: linear-gradient(135deg, #2d4a3e 0%, #3d6b54 100%); color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">Schedule Your Consultation</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Next Steps -->
                <tr>
                  <td style="padding: 0 24px 24px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e4e4e7;">
                      <tr>
                        <td style="padding-top: 24px;">
                          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #18181b;">What happens next?</p>
                          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #52525b;">We'll contact you within 24 hours to schedule an in-person consultation. Final pricing will be confirmed after we assess your space.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #e4e4e7;">
                    <p style="margin: 0; font-size: 13px; color: #71717a;">Nashville Painting Professionals</p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #a1a1aa;">Powered by <a href="https://paintpros.io" style="color: #3d6b54; text-decoration: none;">PaintPros.io</a></p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send to customer
    await client.emails.send({
      from: sender,
      to: [data.customer.email],
      subject: `Your Painting Estimate from ${data.tenantName} - $${data.pricing.total.toLocaleString()}`,
      html: emailHtml
    });

    // Send to service team
    const businessEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #344e41;">New Estimate Request</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${data.customer.firstName} ${data.customer.lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.customer.email}">${data.customer.email}</a></p>
          ${data.customer.phone ? `<p><strong>Phone:</strong> <a href="tel:${data.customer.phone}">${data.customer.phone}</a></p>` : ''}
          ${data.customer.address ? `<p><strong>Address:</strong> ${data.customer.address}</p>` : ''}
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Project Details</h3>
          <p><strong>Services:</strong> ${servicesList}</p>
          ${measurementsHtml.join('')}
          ${data.colors.length > 0 ? `<p><strong>Colors:</strong> ${data.colors.map(c => c.colorName).join(', ')}</p>` : ''}
        </div>
        
        <div style="background: #22c55e; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">${data.pricing.tierName} Package</p>
          <p style="margin: 10px 0 0 0; font-size: 28px; font-weight: bold;">$${data.pricing.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <p style="margin-top: 20px;">Please follow up with this customer within 24 hours.</p>
      </div>
    `;

    await client.emails.send({
      from: sender,
      to: [data.serviceEmail],
      subject: `New Estimate: ${data.customer.firstName} ${data.customer.lastName} - $${data.pricing.total.toLocaleString()}`,
      html: businessEmailHtml
    });

    console.log(`[Email] Estimate proposal sent to ${data.customer.email} and ${data.serviceEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send estimate proposal email:', error);
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
