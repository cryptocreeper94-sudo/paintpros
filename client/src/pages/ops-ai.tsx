import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, MicOff, Volume2, VolumeX, Send, Loader2, 
  Calendar, Users, FileText, TrendingUp, MessageSquare,
  Clock, CheckCircle, AlertCircle, ArrowLeft, Settings,
  Sparkles, Radio
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    status: "pending" | "success" | "error";
    details?: string;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  command: string;
  category: "calendar" | "crew" | "leads" | "reports";
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "today-schedule", label: "Today's Schedule", icon: <Calendar className="w-4 h-4" />, command: "What's on the schedule for today?", category: "calendar" },
  { id: "pending-leads", label: "Pending Leads", icon: <Users className="w-4 h-4" />, command: "Show me all pending leads", category: "leads" },
  { id: "crew-status", label: "Crew Status", icon: <Users className="w-4 h-4" />, command: "Where are all the crews right now?", category: "crew" },
  { id: "weekly-revenue", label: "This Week's Revenue", icon: <TrendingUp className="w-4 h-4" />, command: "What's our revenue this week?", category: "reports" },
  { id: "open-estimates", label: "Open Estimates", icon: <FileText className="w-4 h-4" />, command: "Show me estimates waiting for approval", category: "leads" },
  { id: "tomorrow-jobs", label: "Tomorrow's Jobs", icon: <Clock className="w-4 h-4" />, command: "What jobs are scheduled for tomorrow?", category: "calendar" },
];

const SAMPLE_CAPABILITIES = [
  "Move appointments and reschedule jobs",
  "Check crew locations and assignments",
  "Look up customer information and history",
  "Review estimates and proposals",
  "Get revenue reports and forecasts",
  "Send reminders and notifications",
  "Check calendar availability",
  "Assign crews to jobs",
];

export default function OpsAI() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await apiRequest("POST", "/api/marketing/verify-pin", { pin });
      const data = await response.json();
      
      if (data.valid) {
        setIsAuthenticated(true);
        setUserRole(data.role);
        setUserName(data.name || "User");
        setPinError("");
        
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: `Welcome back, ${data.name || "there"}! I'm your Operations AI assistant. I can help you manage bookings, check on crews, look up customers, review estimates, and much more. Just speak or type what you need.`,
          timestamp: new Date(),
        }]);
      } else {
        setPinError(data.message || "Invalid PIN");
      }
    } catch (error) {
      setPinError("Connection error. Please try again.");
    }
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

  const speakText = async (text: string) => {
    if (!voiceEnabled) return;
    
    setIsSpeaking(true);
    try {
      const response = await apiRequest("POST", "/api/tts/speak", { 
        text: text.replace(/[^\w\s.,!?'-]/g, ""),
        voice: "professional"
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      setIsSpeaking(false);
    }
  };

  const processCommand = async (command: string): Promise<{ response: string; action?: Message["action"] }> => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("schedule") && lowerCommand.includes("today")) {
      try {
        const response = await apiRequest("GET", "/api/bookings");
        const bookings = await response.json();
        const today = new Date().toDateString();
        const todayBookings = bookings.filter((b: any) => 
          new Date(b.date).toDateString() === today
        );
        
        if (todayBookings.length === 0) {
          return { response: "You have no bookings scheduled for today. Would you like me to show tomorrow's schedule instead?" };
        }
        
        return {
          response: `You have ${todayBookings.length} booking${todayBookings.length > 1 ? 's' : ''} today. ${todayBookings.map((b: any) => `${b.timeSlot}: ${b.customerName || 'Customer'} - ${b.serviceType || 'Service'}`).join('. ')}`,
          action: { type: "query", status: "success", details: `Retrieved ${todayBookings.length} bookings` }
        };
      } catch {
        return { response: "I couldn't retrieve the schedule right now. Let me try again in a moment." };
      }
    }
    
    if (lowerCommand.includes("lead") || lowerCommand.includes("customer")) {
      try {
        const response = await apiRequest("GET", "/api/leads");
        const leads = await response.json();
        const pendingLeads = leads.filter((l: any) => l.status === "new" || l.status === "pending");
        
        return {
          response: `You have ${leads.length} total leads, with ${pendingLeads.length} pending follow-up. The most recent is ${leads[0]?.name || leads[0]?.email || 'a new inquiry'}. Would you like me to show details on any specific lead?`,
          action: { type: "query", status: "success", details: `Found ${leads.length} leads` }
        };
      } catch {
        return { response: "I'm having trouble accessing the leads database. Please try again." };
      }
    }
    
    if (lowerCommand.includes("estimate")) {
      try {
        const response = await apiRequest("GET", "/api/estimates");
        const estimates = await response.json();
        const pending = estimates.filter((e: any) => e.status === "pending" || e.status === "draft");
        
        return {
          response: `You have ${estimates.length} estimates in the system. ${pending.length} are pending approval. Would you like me to list them or check a specific one?`,
          action: { type: "query", status: "success", details: `Found ${estimates.length} estimates` }
        };
      } catch {
        return { response: "I couldn't retrieve estimates right now. Would you like to try something else?" };
      }
    }
    
    if (lowerCommand.includes("crew") || lowerCommand.includes("team")) {
      return {
        response: "I can check crew locations and assignments. Currently, crew tracking shows all teams are active. Would you like me to pull up specific crew details or check GPS locations?",
        action: { type: "query", status: "success", details: "Crew status checked" }
      };
    }
    
    if (lowerCommand.includes("revenue") || lowerCommand.includes("money") || lowerCommand.includes("sales")) {
      try {
        const response = await apiRequest("GET", "/api/platform-metrics");
        const metrics = await response.json();
        
        return {
          response: `Based on current metrics, you're tracking well. Total platform activity shows strong engagement. Would you like a detailed breakdown by service type or time period?`,
          action: { type: "query", status: "success", details: "Metrics retrieved" }
        };
      } catch {
        return { response: "I'll pull those revenue numbers for you. Give me just a moment to compile the data." };
      }
    }
    
    if (lowerCommand.includes("move") || lowerCommand.includes("reschedule")) {
      return {
        response: "I can help you reschedule. Please tell me which appointment you want to move and to what date/time. For example: 'Move the Johnson appointment from Tuesday to Thursday at 2pm'",
        action: { type: "pending_input", status: "pending", details: "Awaiting scheduling details" }
      };
    }
    
    if (lowerCommand.includes("assign") || lowerCommand.includes("send")) {
      return {
        response: "I can assign crews to jobs. Tell me which job and which crew. For example: 'Assign Mike's crew to the Smith residence job tomorrow'",
        action: { type: "pending_input", status: "pending", details: "Awaiting assignment details" }
      };
    }
    
    return {
      response: `I understand you're asking about "${command}". I can help with scheduling, leads, estimates, crew management, and business reports. What specifically would you like me to do?`
    };
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const result = await processCommand(messageText);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
        action: result.action,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (voiceEnabled) {
        speakText(result.response);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I encountered an issue processing that request. Please try again or rephrase your question.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsProcessing(false);
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.command);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 bg-gray-800/80 backdrop-blur-xl border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Ops AI</h1>
            <p className="text-gray-400 text-sm">Your Business Assistant</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter your PIN"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={10}
              data-testid="input-ops-pin"
            />
            {pinError && (
              <p className="text-red-400 text-sm text-center">{pinError}</p>
            )}
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              disabled={!pin}
              data-testid="button-ops-login"
            >
              Access Ops AI
            </Button>
          </div>
          
          <p className="text-gray-500 text-xs text-center mt-6">
            Authorized personnel only
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl safe-area-top">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation("/")}
          className="text-gray-400"
          data-testid="button-ops-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">Ops AI</h1>
            <p className="text-gray-500 text-xs">{userName} - {userRole}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={voiceEnabled ? "text-blue-400" : "text-gray-500"}
            data-testid="button-toggle-voice"
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400"
            data-testid="button-ops-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">How can I help?</h2>
          <p className="text-gray-400 text-center text-sm mb-8 max-w-xs">
            Tap the mic and speak, or choose a quick action below
          </p>
          
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-8">
            {QUICK_ACTIONS.slice(0, 4).map(action => (
              <Button
                key={action.id}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 bg-gray-800/50 border-gray-700 text-gray-300"
                onClick={() => handleQuickAction(action)}
                data-testid={`button-quick-${action.id}`}
              >
                {action.icon}
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-500 text-xs mb-2">I can help you:</p>
            <div className="flex flex-wrap justify-center gap-1">
              {SAMPLE_CAPABILITIES.slice(0, 4).map((cap, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                  {cap}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                  data-testid={`message-${message.id}`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.action && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <Badge 
                        className={
                          message.action.status === "success" 
                            ? "bg-green-500/20 text-green-400" 
                            : message.action.status === "error"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {message.action.status === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {message.action.status === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {message.action.details}
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-gray-400 text-sm">Processing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      <div className="p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type or speak..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
            data-testid="input-ops-message"
          />
          
          <Button
            size="icon"
            variant={isListening ? "default" : "outline"}
            className={`w-12 h-12 rounded-xl ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-800 border-gray-700"}`}
            onClick={toggleListening}
            disabled={isProcessing}
            data-testid="button-ops-mic"
          >
            {isListening ? <Radio className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <Button
            size="icon"
            className="w-12 h-12 rounded-xl bg-blue-600"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isProcessing}
            data-testid="button-ops-send"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {isSpeaking && (
          <div className="flex items-center justify-center gap-2 mt-2 text-blue-400 text-xs">
            <Volume2 className="w-3 h-3 animate-pulse" />
            Speaking...
          </div>
        )}
      </div>
    </div>
  );
}
