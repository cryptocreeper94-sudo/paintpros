import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Mic, MicOff, Trash2 } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import rollieMascot from "@assets/generated_images/rollie_transparent.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type VoiceGender = "male" | "female";

export function PaintBuddy() {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
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

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text,
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
      };
      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      const greeting = `Hey there! I'm Rollie, your painting assistant! How can I help you today?`;
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
      const errorMsg = "Sorry, I'm having trouble connecting right now. Please try again!";
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
              Ask Rollie!
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-4"
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
                      Female
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
                      Male
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Clear Button */}
                  <button
                    onClick={handleClear}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Clear chat"
                    data-testid="button-clear-chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    data-testid="button-paint-buddy-close"
                  >
                    <X className="w-4 h-4" />
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
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  {/* Microphone Button */}
                  <button
                    onClick={toggleListening}
                    className={`p-2.5 rounded-xl transition-all ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title={isListening ? "Stop listening" : "Speak to Rollie"}
                    data-testid="button-microphone"
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isListening ? "Listening..." : "Type or speak..."}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl px-4 py-2.5 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    data-testid="input-paint-buddy-message"
                  />

                  {/* Send Button */}
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-paint-buddy-send"
                  >
                    <Send className="w-5 h-5" />
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
