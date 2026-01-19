import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  MessageSquare, Send, Users, Phone, Globe, Loader2, CheckCircle, 
  AlertCircle, Languages, ChevronDown, Zap 
} from "lucide-react";
import { cardBackgroundStyles, iconContainerStyles } from "@/lib/theme-effects";

interface CrewMember {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  preferredLanguage?: 'en' | 'es';
}

const SMS_TEMPLATES = {
  jobAssigned: { en: "Job Assigned", es: "Trabajo Asignado" },
  timeReminder: { en: "Time Reminder", es: "Recordatorio" },
  incidentAlert: { en: "Incident Alert", es: "Alerta de Incidente" },
  crewDispatch: { en: "Crew Dispatch", es: "Despacho" },
  weatherAlert: { en: "Weather Alert", es: "Alerta de Clima" },
  custom: { en: "Custom Message", es: "Mensaje Personalizado" },
};

const QUICK_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  "Good morning team!": { en: "Good morning team!", es: "¡Buenos días equipo!" },
  "Please check in when you arrive": { en: "Please check in when you arrive", es: "Por favor registra tu llegada" },
  "Job completed, great work!": { en: "Job completed, great work!", es: "¡Trabajo completado, excelente trabajo!" },
  "Weather delay - stay safe": { en: "Weather delay - stay safe", es: "Retraso por clima - cuídate" },
  "Materials ready for pickup": { en: "Materials ready for pickup", es: "Materiales listos para recoger" },
  "Meeting at 8am tomorrow": { en: "Meeting at 8am tomorrow", es: "Reunión mañana a las 8am" },
  "Don't forget to clock out": { en: "Don't forget to clock out", es: "No olvides registrar tu salida" },
  "Call me when you can": { en: "Call me when you can", es: "Llámame cuando puedas" },
};

export function SmsMessenger() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState<"all" | "individual">("all");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sendLanguage, setSendLanguage] = useState<"en" | "es" | "both">("both");
  const [showQuickMessages, setShowQuickMessages] = useState(false);

  const { data: smsStatus } = useQuery<{ configured: boolean }>({
    queryKey: ["/api/sms/status"],
  });

  const { data: crewMembers = [] } = useQuery<CrewMember[]>({
    queryKey: ["/api/crew/members"],
    queryFn: async () => {
      const res = await fetch("/api/crew/members");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const sendSmsMutation = useMutation({
    mutationFn: async (data: { to: string; message: string; language: string }) => {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send SMS");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: language === "es" ? "Mensaje enviado" : "Message sent",
        description: language === "es" ? "SMS enviado exitosamente" : "SMS sent successfully",
      });
      setMessage("");
    },
    onError: () => {
      toast({
        title: language === "es" ? "Error" : "Error",
        description: language === "es" ? "Error al enviar SMS" : "Failed to send SMS",
        variant: "destructive",
      });
    },
  });

  const sendBulkMutation = useMutation({
    mutationFn: async (data: { phones: string[]; template: string; params: string[]; language: string }) => {
      const res = await fetch("/api/sms/crew-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send bulk SMS");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: language === "es" ? "Mensajes enviados" : "Messages sent",
        description: language === "es" 
          ? `${data.sent} enviados, ${data.failed} fallidos` 
          : `${data.sent} sent, ${data.failed} failed`,
      });
      setMessage("");
    },
  });

  const handleSend = () => {
    if (!message.trim()) return;

    if (recipientType === "individual" && selectedPhone) {
      if (sendLanguage === "both") {
        const esMessage = translateToSpanish(message);
        sendSmsMutation.mutate({ to: selectedPhone, message: `${message}\n---\n${esMessage}`, language: "en" });
      } else {
        const finalMessage = sendLanguage === "es" ? translateToSpanish(message) : message;
        sendSmsMutation.mutate({ to: selectedPhone, message: finalMessage, language: sendLanguage });
      }
    } else {
      const phones = crewMembers
        .filter(m => m.phone)
        .map(m => m.phone as string);
      
      if (phones.length === 0) {
        toast({
          title: language === "es" ? "Sin destinatarios" : "No recipients",
          description: language === "es" ? "No hay números de teléfono" : "No phone numbers available",
          variant: "destructive",
        });
        return;
      }

      const finalMessage = sendLanguage === "both" 
        ? `${message}\n---\n${translateToSpanish(message)}`
        : sendLanguage === "es" ? translateToSpanish(message) : message;

      phones.forEach(phone => {
        sendSmsMutation.mutate({ to: phone, message: finalMessage, language: sendLanguage === "both" ? "en" : sendLanguage });
      });
    }
  };

  const translateToSpanish = (text: string): string => {
    const found = QUICK_TRANSLATIONS[text];
    if (found) return found.es;
    return text;
  };

  const useQuickMessage = (msg: string) => {
    setMessage(msg);
    setShowQuickMessages(false);
  };

  const crewWithPhones = crewMembers.filter(m => m.phone);
  const isConfigured = smsStatus?.configured ?? false;
  const isSending = sendSmsMutation.isPending || sendBulkMutation.isPending;

  return (
    <GlassCard className={`p-4 ${cardBackgroundStyles.green}`} glow="green">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.gradients.green} ${iconContainerStyles.base}`}>
            <MessageSquare className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold">{t('sms.sendSms')}</h3>
            <p className="text-xs text-muted-foreground">
              {language === "es" ? "Comunicación con el equipo" : "Crew communication"}
            </p>
          </div>
        </div>
        <Badge variant={isConfigured ? "default" : "secondary"} className="text-xs">
          {isConfigured ? (
            <><CheckCircle className="w-3 h-3 mr-1" /> {language === "es" ? "Activo" : "Active"}</>
          ) : (
            <><AlertCircle className="w-3 h-3 mr-1" /> {language === "es" ? "No configurado" : "Not configured"}</>
          )}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Select value={recipientType} onValueChange={(v) => setRecipientType(v as "all" | "individual")}>
            <SelectTrigger className="w-32 h-8 text-xs" data-testid="select-recipient-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {language === "es" ? "Todo el equipo" : "All Crew"}
                </div>
              </SelectItem>
              <SelectItem value="individual">
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {language === "es" ? "Individual" : "Individual"}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {recipientType === "individual" && (
            <Select value={selectedPhone} onValueChange={setSelectedPhone}>
              <SelectTrigger className="flex-1 h-8 text-xs" data-testid="select-crew-member">
                <SelectValue placeholder={language === "es" ? "Seleccionar miembro" : "Select member"} />
              </SelectTrigger>
              <SelectContent>
                {crewWithPhones.map(member => (
                  <SelectItem key={member.id} value={member.phone!}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={sendLanguage} onValueChange={(v) => setSendLanguage(v as "en" | "es" | "both")}>
            <SelectTrigger className="w-28 h-8 text-xs" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" /> EN
                </div>
              </SelectItem>
              <SelectItem value="es">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" /> ES
                </div>
              </SelectItem>
              <SelectItem value="both">
                <div className="flex items-center gap-1">
                  <Languages className="w-3 h-3" /> {language === "es" ? "Ambos" : "Both"}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={language === "es" ? "Escribe tu mensaje..." : "Type your message..."}
            className="min-h-[80px] text-sm resize-none bg-black/5 dark:bg-white/5 border-border"
            data-testid="input-sms-message"
          />
          <button
            type="button"
            onClick={() => setShowQuickMessages(!showQuickMessages)}
            className="absolute right-2 bottom-2 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            data-testid="button-quick-messages"
          >
            <Zap className="w-4 h-4 text-yellow-500" />
          </button>
        </div>

        <AnimatePresence>
          {showQuickMessages && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1 p-2 bg-black/5 dark:bg-white/5 rounded-lg">
                {Object.entries(QUICK_TRANSLATIONS).map(([msg, translations]) => (
                  <button
                    key={msg}
                    onClick={() => useQuickMessage(msg)}
                    className="text-left p-2 text-xs rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="font-medium">{translations.en}</div>
                    <div className="text-muted-foreground">{translations.es}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {recipientType === "all" 
              ? (language === "es" ? `${crewWithPhones.length} destinatarios` : `${crewWithPhones.length} recipients`)
              : selectedPhone || (language === "es" ? "Selecciona destinatario" : "Select recipient")
            }
          </div>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!message.trim() || isSending || !isConfigured || (recipientType === "individual" && !selectedPhone)}
            className="gap-1"
            data-testid="button-send-sms"
          >
            {isSending ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> {language === "es" ? "Enviando..." : "Sending..."}</>
            ) : (
              <><Send className="w-3 h-3" /> {t('sms.send')}</>
            )}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
