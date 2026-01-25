import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Mic, MicOff, Trash2, Briefcase, FileText, Calendar, ClipboardList } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const OFFICE_SYSTEM_PROMPT = `You are an office assistant AI helping staff with administrative tasks at a painting/trades company. You help with:
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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const greeting = "Hello! I'm your office assistant. I can help with filing, scheduling, drafting emails, creating checklists, and other administrative tasks. What can I help you with?";

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
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
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
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again." },
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
      {/* Minimized - Briefcase Icon - Bottom Left to avoid conflict with MessagingWidget */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-4 left-4 z-50"
          >
            <Button
              size="icon"
              onClick={handleOpen}
              className="bg-blue-600 text-white shadow-lg group relative"
              data-testid="button-office-assistant-open"
            >
              <Briefcase className="w-5 h-5" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Office Assistant
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Panel - Bottom Left */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 left-4 z-50 w-[380px] max-w-[calc(100vw-32px)]"
            style={{ maxHeight: "min(600px, calc(100vh - 100px))" }}
          >
            <Card className="flex flex-col overflow-hidden shadow-2xl" data-testid="panel-office-assistant">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-md">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-semibold">Office Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClear}
                    className="text-white"
                    data-testid="button-office-clear"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClose}
                    className="text-white"
                    data-testid="button-office-close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="p-3 border-b bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                  <div className="flex gap-2 flex-wrap">
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(action.prompt)}
                        className="text-xs"
                        data-testid={`button-quick-${action.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <action.icon className="w-3 h-3 mr-1" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background" style={{ minHeight: "200px", maxHeight: "350px" }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-md text-sm ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-3 py-2 rounded-md">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-muted/50">
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    onClick={toggleListening}
                    data-testid="button-office-mic"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask about filing, scheduling..."
                    className="flex-1"
                    data-testid="input-office-message"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-blue-600 text-white"
                    data-testid="button-office-send"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
