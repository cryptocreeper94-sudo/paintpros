import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Mic, MicOff, Trash2, Briefcase, FileText, Calendar, ClipboardList } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import rollieMascot from "@assets/generated_images/rollie_bw_final.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type VoiceGender = "male" | "female";

const OFFICE_SYSTEM_PROMPT = `You are Rollie, an office assistant AI helping staff with administrative tasks at a painting/trades company. You help with:
- Filing and document organization
- Scheduling and calendar management
- Creating checklists and task lists
- Drafting professional emails and communications
- Organizing project files and records
- Administrative workflow optimization
- Data entry guidance
- Report preparation

Be professional, efficient, and helpful. Keep responses concise and actionable. When suggesting file organization, use clear naming conventions and folder structures.`;

export function OfficeAssistant() {
  const tenant = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>("female");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const greeting = "Hello! I'm Rollie, your office assistant. I can help with filing, scheduling, drafting emails, creating checklists, and other administrative tasks. What can I help you with?";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

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
  }, []);

  const stripEmojisAndSymbols = (text: string) => {
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu, "")
      .replace(/[*#_~`|]/g, "")
      .trim();
  };

  const speakText = async (text: string) => {
    const cleanText = stripEmojisAndSymbols(text);
    if (!cleanText) return;
    
    setIsSpeaking(true);
    
    try {
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
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith("en") && 
        (v.name.toLowerCase().includes("samantha") || 
         v.name.toLowerCase().includes("google") ||
         v.name.toLowerCase().includes("natural") ||
         v.name.toLowerCase().includes("premium"))
      ) || voices.find(v => v.lang.startsWith("en"));
      
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

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Speech recognition error:", error);
      }
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
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
          systemPrompt: OFFICE_SYSTEM_PROMPT,
          assistantType: "office",
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
      const errorMsg = "Sorry, I'm having trouble connecting right now. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: FileText, label: "Draft Email", prompt: "Help me draft a professional email to" },
    { icon: Calendar, label: "Schedule", prompt: "Help me organize my schedule for" },
    { icon: ClipboardList, label: "Checklist", prompt: "Create a checklist for" },
  ];

  return (
    <>
      {/* Minimized - Briefcase Icon - Bottom Left */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-4 left-4 z-50 group"
            data-testid="button-office-assistant-open"
          >
            <motion.div
              className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Briefcase className="w-6 h-6 text-white" />
            </motion.div>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Office Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded - Centered with Comic Bubble (matching Rollie style) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-start px-4 pt-16 pb-4"
            onClick={handleClose}
            data-testid="panel-office-assistant-overlay"
          >
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-[calc(100%-32px)] max-w-[360px] md:max-w-[400px] max-h-[50vh] md:max-h-[400px] flex flex-col overflow-hidden mx-auto"
              style={{ borderRadius: "24px" }}
              data-testid="panel-office-assistant-bubble"
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
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">Office Assistant</span>
                  {/* Voice Gender Toggle */}
                  <div className="flex bg-blue-500 rounded-full p-0.5 ml-2">
                    <button
                      onClick={() => setVoiceGender("female")}
                      className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all ${
                        voiceGender === "female"
                          ? "bg-white text-blue-600"
                          : "text-blue-100"
                      }`}
                      data-testid="button-voice-female"
                    >
                      F
                    </button>
                    <button
                      onClick={() => setVoiceGender("male")}
                      className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all ${
                        voiceGender === "male"
                          ? "bg-white text-blue-600"
                          : "text-blue-100"
                      }`}
                      data-testid="button-voice-male"
                    >
                      M
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    className="p-2 text-blue-100 hover:text-white hover:bg-blue-500 rounded-full transition-colors"
                    title="Clear chat"
                    data-testid="button-office-clear"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-2 bg-blue-500 text-white hover:bg-blue-400 rounded-full transition-colors"
                    data-testid="button-office-close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick actions:</p>
                  <div className="flex gap-2 flex-wrap">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => setInput(action.prompt)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        data-testid={`button-quick-${action.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <action.icon className="w-3 h-3" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                          ? "bg-blue-600 text-white rounded-br-sm"
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
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-1.5 w-full">
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title={isListening ? "Stop listening" : "Speak to Rollie"}
                    data-testid="button-office-mic"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isListening ? "Listening..." : "Ask about filing, scheduling..."}
                    className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    data-testid="input-office-message"
                  />

                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    data-testid="button-office-send"
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
                alt="Rollie Office Assistant"
                className={`w-24 h-24 md:w-40 md:h-40 object-contain drop-shadow-2xl ${
                  isSpeaking ? "animate-bounce" : ""
                }`}
                animate={isSpeaking ? { scale: [1, 1.05, 1] } : { y: [0, -6, 0] }}
                transition={{ duration: isSpeaking ? 0.5 : 3, repeat: Infinity, ease: "easeInOut" }}
                data-testid="img-rollie-office"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
