import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Mic, MicOff, Trash2 } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import rollieMascot from "@assets/generated_images/lume_rollie_mascot.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type VoiceGender = "male" | "female";
type Language = "en" | "es";

const translations = {
  en: {
    greeting: "Hey there! I'm Rollie, your painting assistant! How can I help you today?",
    errorMessage: "Sorry, I'm having trouble connecting right now. Please try again!",
    askRollie: "Ask Rollie!",
    female: "Female",
    male: "Male",
    clearChat: "Clear chat",
    stopListening: "Stop listening",
    speakToRollie: "Speak to Rollie",
    listening: "Listening...",
    typeOrSpeak: "Type or speak...",
    speechNotSupported: "Speech recognition is not supported in your browser.",
  },
  es: {
    greeting: "¡Hola! ¡Soy Rollie, tu asistente de pintura! ¿En qué puedo ayudarte hoy?",
    errorMessage: "Lo siento, tengo problemas para conectarme ahora. ¡Por favor, intenta de nuevo!",
    askRollie: "¡Pregunta a Rollie!",
    female: "Femenino",
    male: "Masculino",
    clearChat: "Limpiar chat",
    stopListening: "Dejar de escuchar",
    speakToRollie: "Habla con Rollie",
    listening: "Escuchando...",
    typeOrSpeak: "Escribe o habla...",
    speechNotSupported: "El reconocimiento de voz no está disponible en tu navegador.",
  },
};

export function PaintBuddy() {
  const tenant = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>("female");
  const [language, setLanguage] = useState<Language>("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Get current translations
  const t = translations[language];

  // Sync language with global i18n system
  useEffect(() => {
    const updateLanguage = () => {
      const storedLang = localStorage.getItem("paintpros-language");
      setLanguage(storedLang === "es" ? "es" : "en");
    };
    
    updateLanguage();
    
    // Listen for storage changes (from other tabs or components)
    window.addEventListener("storage", updateLanguage);
    
    // Poll for language changes (since storage event doesn't fire in same tab)
    const interval = setInterval(updateLanguage, 500);
    
    return () => {
      window.removeEventListener("storage", updateLanguage);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition - recreate when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "es" ? "es-ES" : "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t.speechNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stripEmojisAndSymbols = (text: string): string => {
    const emojiPattern = /(?:[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?\u20E3|\u3299|\u3297|\u303D|\u3030|\u24C2|\uD83C[\uDD70-\uDD71]|\uD83C[\uDD7E-\uDD7F]|\uD83C\uDD8E|\uD83C[\uDD91-\uDD9A]|\uD83C[\uDDE6-\uDDFF]|\uD83C[\uDE01-\uDE02]|\uD83C\uDE1A|\uD83C\uDE2F|\uD83C[\uDE32-\uDE3A]|\uD83C[\uDE50-\uDE51]|\u203C|\u2049|[\u25AA-\u25AB]|\u25B6|\u25C0|[\u25FB-\u25FE]|\u00A9|\u00AE|\u2122|\u2139|\uD83C\uDC04|[\u2600-\u26FF]|\u2B05|\u2B06|\u2B07|\u2B1B|\u2B1C|\u2B50|\u2B55|\u231A|\u231B|\u2328|\u23CF|[\u23E9-\u23F3]|[\u23F8-\u23FA]|\uD83C\uDCCF|\u2934|\u2935|[\u2190-\u21FF])+/g;
    return text
      .replace(emojiPattern, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  };

  const speakText = async (text: string) => {
    const cleanText = stripEmojisAndSymbols(text);
    if (!cleanText) {
      setIsSpeaking(false);
      return;
    }
    
    try {
      setIsSpeaking(true);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: cleanText,
          voice: voiceGender === "male" ? "onyx" : "nova"
        }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        fallbackSpeak(cleanText);
      };
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      fallbackSpeak(cleanText);
    }
  };

  const fallbackSpeak = (text: string) => {
    const cleanText = stripEmojisAndSymbols(text);
    if (!cleanText) {
      setIsSpeaking(false);
      return;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === "es" ? "es-ES" : "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const targetLang = language === "es" ? "es" : "en";
      const preferredVoice = voices.find(v => 
        v.lang.startsWith(targetLang) && 
        (v.name.toLowerCase().includes("samantha") || 
         v.name.toLowerCase().includes("google") ||
         v.name.toLowerCase().includes("natural") ||
         v.name.toLowerCase().includes("premium"))
      ) || voices.find(v => v.lang.startsWith(targetLang));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const greeting = t.greeting;
      setMessages([{ role: "assistant", content: greeting }]);
      speakText(greeting);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          tenantName: tenant.name,
          tenantId: tenant.id,
          language: language,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      speakText(data.message);
    } catch (error) {
      const errorMsg = t.errorMessage;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Minimized Rollie - Bottom Right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed bottom-[54px] right-[18px] z-50 group"
            data-testid="button-paint-buddy-open"
          >
            <motion.img
              src={rollieMascot}
              alt="Paint Buddy"
              className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(212,175,55,0.9)] transition-all"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {t.askRollie}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Rollie - Centered with Comic Bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-start px-4 pt-16 pb-4"
            onClick={handleClose}
            data-testid="panel-paint-buddy-overlay"
          >
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-[calc(100%-32px)] max-w-[360px] md:max-w-[400px] max-h-[50vh] md:max-h-[400px] flex flex-col overflow-hidden mx-auto"
              style={{
                borderRadius: "24px",
              }}
              data-testid="panel-paint-buddy-bubble"
            >
              {/* Bubble tail/pointer */}
              <div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: "20px solid white",
                }}
              />
              <div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 dark:block hidden"
                style={{
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: "20px solid rgb(31, 41, 55)",
                }}
              />

              {/* Header with controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  {/* Language Toggle - syncs with global i18n */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-0.5">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        localStorage.setItem("paintpros-language", "en");
                      }}
                      className={`px-2 py-1 text-xs font-medium rounded-full transition-all ${
                        language === "en"
                          ? "bg-amber-500 text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      data-testid="button-lang-en"
                    >
                      EN
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("es");
                        localStorage.setItem("paintpros-language", "es");
                      }}
                      className={`px-2 py-1 text-xs font-medium rounded-full transition-all ${
                        language === "es"
                          ? "bg-amber-500 text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      data-testid="button-lang-es"
                    >
                      ES
                    </button>
                  </div>
                  {/* Voice Gender Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-0.5">
                    <button
                      onClick={() => setVoiceGender("female")}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                        voiceGender === "female"
                          ? "bg-pink-500 text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      data-testid="button-voice-female"
                    >
                      {t.female}
                    </button>
                    <button
                      onClick={() => setVoiceGender("male")}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                        voiceGender === "male"
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                      data-testid="button-voice-male"
                    >
                      {t.male}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Clear Button */}
                  <button
                    onClick={handleClear}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title={t.clearChat}
                    data-testid="button-clear-chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {/* Close Button - Made larger and more visible */}
                  <button
                    onClick={handleClose}
                    className="p-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                    data-testid="button-paint-buddy-close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[150px]">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-amber-500 text-white rounded-br-sm"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
                      <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-1.5 w-full">
                  {/* Microphone Button */}
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title={isListening ? t.stopListening : t.speakToRollie}
                    data-testid="button-microphone"
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isListening ? t.listening : t.typeOrSpeak}
                    className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    data-testid="input-paint-buddy-message"
                  />

                  {/* Send Button */}
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    data-testid="button-paint-buddy-send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Large Rollie Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className="mt-1 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={rollieMascot}
                alt="Rollie"
                className={`w-24 h-24 md:w-40 md:h-40 object-contain drop-shadow-2xl ${
                  isSpeaking ? "animate-bounce" : ""
                }`}
                animate={isSpeaking ? { scale: [1, 1.05, 1] } : { y: [0, -6, 0] }}
                transition={{ duration: isSpeaking ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
                data-testid="img-rollie-large"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
