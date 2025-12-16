import { db } from "./db";
import { emailVerificationTokens, users } from "@shared/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export function isEmailConfigured(): boolean {
  return !!resend;
}

export async function createVerificationToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(emailVerificationTokens).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function sendVerificationEmail(
  email: string, 
  firstName: string, 
  token: string,
  tenantName: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log("[Email Verification] Resend not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
  const fromEmail = process.env.CONTACT_EMAIL || "noreply@paintpros.io";

  try {
    await resend.emails.send({
      from: `${tenantName} <${fromEmail}>`,
      to: email,
      subject: `Verify your email - ${tenantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2d4a3e 0%, #1a2e25 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: 600;">${tenantName}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333; margin: 0 0 20px; font-size: 24px;">Welcome, ${firstName}!</h2>
                      <p style="color: #666; line-height: 1.6; margin: 0 0 20px;">
                        Thank you for creating an account with us. Please verify your email address by clicking the button below.
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #d4af37 0%, #b8962f 100%); color: #1a2e25; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                              Verify Email Address
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                        This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                      </p>
                      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                      <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 0;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${verificationUrl}" style="color: #d4af37; word-break: break-all;">${verificationUrl}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("[Email Verification] Failed to send:", error);
    return { success: false, error: error.message };
  }
}

export async function verifyEmailToken(token: string): Promise<{ 
  success: boolean; 
  userId?: string; 
  error?: string 
}> {
  const [tokenRecord] = await db.select()
    .from(emailVerificationTokens)
    .where(and(
      eq(emailVerificationTokens.token, token),
      gt(emailVerificationTokens.expiresAt, new Date())
    ));

  if (!tokenRecord) {
    return { success: false, error: "Invalid or expired verification token" };
  }

  if (tokenRecord.usedAt) {
    return { success: false, error: "This verification link has already been used" };
  }

  await db.update(emailVerificationTokens)
    .set({ usedAt: new Date() })
    .where(eq(emailVerificationTokens.id, tokenRecord.id));

  await db.update(users)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, tokenRecord.userId));

  return { success: true, userId: tokenRecord.userId };
}

export async function resendVerificationEmail(
  userId: string,
  tenantName: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    return { success: false, error: "User not found" };
  }

  if (user.emailVerified) {
    return { success: false, error: "Email is already verified" };
  }

  const token = await createVerificationToken(userId);
  
  return sendVerificationEmail(
    user.email!,
    user.firstName || "Customer",
    token,
    tenantName,
    baseUrl
  );
}
