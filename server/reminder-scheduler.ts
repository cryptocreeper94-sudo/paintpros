import { storage } from './storage';
import { sendPushNotification, isVapidConfigured } from './push-notifications';
import { sendAppointmentReminderEmail } from './resend';
import type { Booking } from '@shared/schema';

const REMINDER_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

const TENANT_NAMES: Record<string, string> = {
  npp: 'Nashville Painting Professionals',
  demo: 'PaintPros.io Demo'
};

interface ReminderConfig {
  type: 'email_24h' | 'email_1h' | 'push_24h' | 'push_1h';
  hoursAhead: number;
  maxHoursAhead: number;
}

const REMINDER_CONFIGS: ReminderConfig[] = [
  { type: 'email_24h', hoursAhead: 23, maxHoursAhead: 25 },
  { type: 'email_1h', hoursAhead: 0.5, maxHoursAhead: 1.5 },
  { type: 'push_24h', hoursAhead: 23, maxHoursAhead: 25 },
  { type: 'push_1h', hoursAhead: 0.5, maxHoursAhead: 1.5 },
];

async function sendEmailReminder(booking: Booking, reminderType: string): Promise<boolean> {
  const isOneHour = reminderType.includes('1h');
  const timeFrame = isOneHour ? 'in 1 hour' : 'tomorrow';
  const tenantName = TENANT_NAMES[booking.tenantId] || booking.tenantId;
  
  try {
    await sendAppointmentReminderEmail({
      customerEmail: booking.customerEmail,
      customerName: booking.customerName,
      appointmentDate: booking.scheduledDate,
      appointmentTime: booking.scheduledTime,
      serviceType: booking.serviceType,
      tenantName,
      timeFrame,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email reminder:', error);
    return false;
  }
}

async function sendPushReminder(booking: Booking, reminderType: string): Promise<boolean> {
  if (!isVapidConfigured()) {
    return false;
  }

  const isOneHour = reminderType.includes('1h');
  const timeFrame = isOneHour ? 'in 1 hour' : 'tomorrow';
  
  // Find the user associated with this booking's email
  const user = await storage.getUserByBookingEmail(booking.customerEmail, booking.tenantId);
  
  if (!user) {
    // No registered user for this booking - can't send push
    return false;
  }
  
  // Get subscriptions only for this specific user and tenant
  const subscriptions = await storage.getPushSubscriptionsByUserAndTenant(user.id, booking.tenantId);
  
  if (subscriptions.length === 0) {
    return false;
  }

  let successCount = 0;
  const tenantName = TENANT_NAMES[booking.tenantId] || booking.tenantId;
  
  for (const sub of subscriptions) {
    try {
      const result = await sendPushNotification(
        {
          endpoint: sub.endpoint,
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
        {
          title: `${tenantName} - Appointment Reminder`,
          body: `Your ${booking.serviceType} appointment is ${timeFrame} at ${booking.scheduledTime}`,
          url: '/account',
          bookingId: booking.id,
          tag: `reminder-${booking.id}-${reminderType}`,
        }
      );
      
      if (result.success) {
        successCount++;
      } else if (result.error === 'subscription_expired') {
        await storage.deletePushSubscription(sub.endpoint);
      }
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  return successCount > 0;
}

async function processReminders(): Promise<void> {
  console.log('[Reminder Scheduler] Checking for upcoming appointments...');

  for (const config of REMINDER_CONFIGS) {
    try {
      // Get all upcoming bookings (across all tenants)
      const bookings = await storage.getUpcomingBookingsForReminders(
        config.hoursAhead,
        config.maxHoursAhead
      );

      for (const booking of bookings) {
        // Skip if booking doesn't have required fields
        if (!booking.customerEmail || !booking.scheduledDate || !booking.scheduledTime) {
          continue;
        }
        
        const alreadySent = await storage.hasReminderBeenSent(booking.id, config.type);
        
        if (alreadySent) {
          continue;
        }

        let success = false;

        if (config.type.startsWith('email')) {
          success = await sendEmailReminder(booking, config.type);
        } else if (config.type.startsWith('push')) {
          success = await sendPushReminder(booking, config.type);
        }

        await storage.createAppointmentReminder({
          bookingId: booking.id,
          tenantId: booking.tenantId,
          reminderType: config.type,
          status: success ? 'sent' : 'failed',
          errorMessage: success ? null : 'Failed to send reminder',
        });

        if (success) {
          console.log(`[Reminder Scheduler] Sent ${config.type} reminder for booking ${booking.id} (tenant: ${booking.tenantId})`);
        }
      }
    } catch (error) {
      console.error(`[Reminder Scheduler] Error processing ${config.type} reminders:`, error);
    }
  }
}

let reminderInterval: NodeJS.Timeout | null = null;

export function startReminderScheduler(): void {
  if (reminderInterval) {
    return;
  }

  console.log('[Reminder Scheduler] Starting appointment reminder scheduler...');
  
  processReminders();
  
  reminderInterval = setInterval(processReminders, REMINDER_CHECK_INTERVAL);
}

export function stopReminderScheduler(): void {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
    console.log('[Reminder Scheduler] Stopped appointment reminder scheduler');
  }
}
