import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Mic, MicOff, Shield, Trash2 } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import rollieMascot from "@assets/generated_images/rollie_bowtie_transparent.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAgentTab() {
  const tenant = useTenant();
  const [isTabExpanded, setIsTabExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const isLume = tenant?.id === "lumepaint" || tenant?.id === "lume";
  
  const greeting = isLume 
    ? "Hello! I'm your Lume Paint Co assistant. How can I help elevate your space today?"
    : "Hello! I'm your TrustLayer AI assistant. How can I help you with your marketing today?";

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

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const stripEmojisAndSymbols = (text: string) => {
    return text
      .replace(/[\u2600-\u26FF\u2700-\u27BF]/g, "")
      .replace(/[*#_~`|]/g, "")
      .trim();
  };

  const speakText = async (text: string) => {
    const cleanText = stripEmojisAndSymbols(text);
    if (!cleanText) return;

    setIsSpeaking(true);
    try {
      const response = await fetch("/api/elevenlabs/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText.substring(0, 500),
          voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        audio.play();
      }
    } catch (error) {
      console.error("TTS error:", error);
    }
    setIsSpeaking(false);
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
          message: userMessage,
          systemPrompt: `You are a helpful AI assistant for ${tenant?.name || 'TrustLayer Marketing'}. Help users with their marketing questions, content creation, and platform guidance. Be concise, professional, and helpful.`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage = data.message || data.response || "I'm here to help!";
        setMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }]);
        speakText(assistantMessage);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again!" }]);
    }

    setIsLoading(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Lume: Black Bowtie at bottom-right | Others: Side Tab */}
      <AnimatePresence>
        {!isOpen && (
          isLume ? (
            // Lume Paint Co - Black Bowtie at bottom-right corner
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="fixed bottom-4 right-4 z-50 group"
              data-testid="ai-agent-bowtie"
            >
              {/* Sharp Black Bowtie SVG */}
              <motion.div
                className="w-14 h-14 flex items-center justify-center"
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg 
                  viewBox="0 0 100 40" 
                  className="w-14 h-7 drop-shadow-lg"
                  fill="currentColor"
                >
                  {/* Left wing - sharp triangular shape */}
                  <polygon 
                    points="0,0 42,16 42,24 0,40" 
                    className="text-gray-800 dark:text-gray-700"
                  />
                  {/* Right wing - sharp triangular shape */}
                  <polygon 
                    points="100,0 58,16 58,24 100,40" 
                    className="text-gray-800 dark:text-gray-700"
                  />
                  {/* Center knot - rectangle */}
                  <rect x="42" y="12" width="16" height="16" rx="2" className="text-gray-900 dark:text-gray-800" />
                </svg>
              </motion.div>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ask Rollie!
              </span>
            </motion.button>
          ) : (
            // Other Tenants - Side Tab then Purple Shield
            !isTabExpanded ? (
              <motion.button
                initial={{ x: 50 }}
                animate={{ x: 0 }}
                exit={{ x: 50 }}
                onClick={() => setIsTabExpanded(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-purple-600 hover:bg-purple-700 text-white px-2 py-4 rounded-l-lg shadow-lg transition-all"
                data-testid="ai-agent-tab"
              >
                <span className="text-xs font-bold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  AI
                </span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 50 }}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
              >
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setIsTabExpanded(false);
                  }}
                  className="relative group"
                  data-testid="ai-agent-button"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-xl border-4 border-purple-400 hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Close/collapse button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTabExpanded(false);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </button>
              </motion.div>
            )
          )
        )}
      </AnimatePresence>

      {/* Full Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className={`${isLume ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-purple-600 to-purple-800'} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                {isLume ? (
                  <img src={rollieMascot} alt="Rollie" className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold text-sm">{isLume ? 'Rollie' : 'TrustLayer AI'}</h3>
                  <p className={`${isLume ? 'text-gray-300' : 'text-purple-200'} text-xs`}>{isLume ? 'Your Painting Buddy' : 'Marketing Assistant'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-sm text-purple-800 dark:text-purple-200">
                  {greeting}
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  data-testid="ai-mic-button"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  data-testid="ai-chat-input"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="ai-send-button"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {isSpeaking && (
                <p className="text-xs text-purple-600 mt-2 text-center animate-pulse">
                  Speaking...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
