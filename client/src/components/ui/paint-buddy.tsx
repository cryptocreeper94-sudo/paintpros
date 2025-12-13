import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Volume2, VolumeX } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import painterMascot from "@assets/generated_images/pixar_painter_mascot_transparent.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function PaintBuddy() {
  const tenant = useTenant();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const hasVisited = localStorage.getItem("paintbuddy_visited");
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem("paintbuddy_visited", "true");
      setTimeout(() => {
        setShowGreeting(true);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
        setIsMinimized(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
      };
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hey there! I'm Rollie, your painting assistant! I can help you with estimates, answer questions about our services, or guide you through the site. What can I help you with today?`,
        },
      ]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
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
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showGreeting && isFirstVisit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            className="fixed bottom-24 right-8 z-50 flex items-end gap-4"
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl rounded-br-sm p-4 shadow-2xl max-w-xs border border-accent/30"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Hey there! 👋 I'm <span className="text-accent">Rollie</span>,
                your painting assistant!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Click on me anytime if you need help!
              </p>
            </motion.div>

            <motion.img
              src={painterMascot}
              alt="Paint Buddy"
              className="w-32 h-32 object-contain drop-shadow-2xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized && !showGreeting && (
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
              src={painterMascot}
              alt="Paint Buddy"
              className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(212,175,55,0.9)] transition-all"
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ask Rollie!
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[54px] right-[18px] z-50 w-[380px] h-[500px] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            data-testid="panel-paint-buddy-chat"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-accent/20 to-cyan-500/20">
              <img
                src={painterMascot}
                alt="Rollie"
                className="w-12 h-12 object-contain drop-shadow-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white">Rollie</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online - Ready to help!
                </p>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${isSpeaking ? "animate-pulse" : ""}`}
                data-testid="button-paint-buddy-voice"
                title={voiceEnabled ? "Mute voice" : "Enable voice"}
              >
                {voiceEnabled ? (
                  <Volume2 className="w-5 h-5 text-accent" />
                ) : (
                  <VolumeX className="w-5 h-5 text-white/50" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                data-testid="button-paint-buddy-close"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-accent text-black rounded-br-sm"
                        : "bg-white/10 text-white rounded-bl-sm"
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
                  <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50"
                  data-testid="input-paint-buddy-message"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-accent text-black rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-paint-buddy-send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
