import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

let client: Twilio.Twilio | null = null;

function getClient() {
  if (!client && accountSid && authToken) {
    client = Twilio(accountSid, authToken);
  }
  return client;
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioPhone);
}

export interface SmsOptions {
  to: string;
  message: string;
  language?: 'en' | 'es';
}

const SMS_TEMPLATES = {
  en: {
    jobAssigned: (jobName: string) => `New job assigned: ${jobName}. Check your crew dashboard for details.`,
    timeReminder: (crewName: string) => `Reminder: ${crewName}, please clock in for your shift.`,
    incidentAlert: (location: string) => `Incident reported at ${location}. Please review immediately.`,
    bookingConfirmation: (date: string, time: string) => `Your booking is confirmed for ${date} at ${time}. We'll see you then!`,
    estimateReady: (name: string) => `Hi ${name}, your estimate is ready! Check your email or customer portal for details.`,
    paymentReceived: (amount: string) => `Payment of $${amount} received. Thank you!`,
    crewDispatch: (address: string, time: string) => `Dispatch: Head to ${address} by ${time}. Stay safe!`,
    weatherAlert: (condition: string) => `Weather alert: ${condition}. Check conditions before starting outdoor work.`,
  },
  es: {
    jobAssigned: (jobName: string) => `Nuevo trabajo asignado: ${jobName}. Revisa tu panel de equipo para más detalles.`,
    timeReminder: (crewName: string) => `Recordatorio: ${crewName}, por favor registra tu entrada.`,
    incidentAlert: (location: string) => `Incidente reportado en ${location}. Por favor revisa inmediatamente.`,
    bookingConfirmation: (date: string, time: string) => `Tu reserva está confirmada para el ${date} a las ${time}. ¡Te esperamos!`,
    estimateReady: (name: string) => `Hola ${name}, tu cotización está lista. Revisa tu correo o portal de cliente.`,
    paymentReceived: (amount: string) => `Pago de $${amount} recibido. ¡Gracias!`,
    crewDispatch: (address: string, time: string) => `Despacho: Dirígete a ${address} antes de las ${time}. ¡Cuídate!`,
    weatherAlert: (condition: string) => `Alerta de clima: ${condition}. Verifica las condiciones antes de trabajar al aire libre.`,
  }
};

export type SmsTemplateType = keyof typeof SMS_TEMPLATES.en;

export async function sendSms(options: SmsOptions): Promise<{ success: boolean; sid?: string; error?: string }> {
  const twilioClient = getClient();
  
  if (!twilioClient || !twilioPhone) {
    return { success: false, error: "Twilio not configured" };
  }

  try {
    const message = await twilioClient.messages.create({
      body: options.message,
      from: twilioPhone,
      to: options.to,
    });

    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error("Twilio SMS error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function sendTemplatedSms(
  to: string,
  template: SmsTemplateType,
  params: string[],
  language: 'en' | 'es' = 'en'
): Promise<{ success: boolean; sid?: string; error?: string }> {
  const templates = SMS_TEMPLATES[language];
  const templateFn = templates[template] as (...args: string[]) => string;
  
  if (!templateFn) {
    return { success: false, error: `Template "${template}" not found` };
  }

  const message = templateFn(...params);
  return sendSms({ to, message, language });
}

export async function sendBulkSms(
  recipients: { to: string; message: string }[]
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = await Promise.all(
    recipients.map(r => sendSms({ to: r.to, message: r.message }))
  );

  const errors: string[] = [];
  let sent = 0;
  let failed = 0;

  results.forEach((r, i) => {
    if (r.success) {
      sent++;
    } else {
      failed++;
      errors.push(`${recipients[i].to}: ${r.error}`);
    }
  });

  return { sent, failed, errors };
}

export async function sendCrewNotification(
  phones: string[],
  template: SmsTemplateType,
  params: string[],
  language: 'en' | 'es' = 'en'
): Promise<{ sent: number; failed: number }> {
  const templates = SMS_TEMPLATES[language];
  const templateFn = templates[template] as (...args: string[]) => string;
  const message = templateFn(...params);

  const recipients = phones.map(to => ({ to, message }));
  const result = await sendBulkSms(recipients);
  
  return { sent: result.sent, failed: result.failed };
}
