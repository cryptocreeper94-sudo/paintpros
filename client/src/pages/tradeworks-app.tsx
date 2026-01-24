import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Mic, MicOff, Volume2, VolumeX, Send, Loader2, 
  Calendar, Users, FileText, TrendingUp, MessageSquare,
  Clock, CheckCircle, AlertCircle, ArrowLeft, Settings,
  Sparkles, Radio, Home, DollarSign, Briefcase, Calculator,
  Palette, Camera, MapPin, Receipt, Phone, Mail, Star,
  ChevronRight, Plus, Search, Bell, Menu, X, Truck,
  CloudSun, Wrench, ClipboardList, CreditCard, PieChart,
  Target, Zap, Building2, HardHat, BarChart3, Wallet,
  FileCheck, Shield, Car, Package, UserCheck, Bot, Upload
} from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DripJobsImport } from "@/components/crm/dripjobs-import";
import { format } from "date-fns";

type AppSection = "home" | "sales" | "schedule" | "money" | "crew" | "tools" | "ai";

interface QuickStat {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    status: "pending" | "success" | "error";
    details?: string;
  };
}

const PIN_CODES: Record<string, { name: string; role: string }> = {
  "1111": { name: "Ryan", role: "Owner" },
  "88888": { name: "Logan", role: "Marketing" },
  "0424": { name: "Brian", role: "Developer" },
  "2024": { name: "Sidonie", role: "Partner" },
};

export default function TradeWorksApp() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeSection, setActiveSection] = useState<AppSection>("home");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDripJobsImport, setShowDripJobsImport] = useState(false);
  
  // Paint calculator state
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [roomLength, setRoomLength] = useState<number>(14);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [numCoats, setNumCoats] = useState<number>(2);
  const [colorSearch, setColorSearch] = useState("");
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: leads = [] } = useQuery<any[]>({
    queryKey: ["/api/leads"],
    enabled: isAuthenticated,
  });

  const { data: bookings = [] } = useQuery<any[]>({
    queryKey: ["/api/bookings"],
    enabled: isAuthenticated,
  });

  const { data: estimates = [] } = useQuery<any[]>({
    queryKey: ["/api/estimates"],
    enabled: isAuthenticated,
  });

  const { data: payments = [] } = useQuery<any[]>({
    queryKey: ["/api/payments"],
    enabled: isAuthenticated,
  });

  const { data: crewLeads = [] } = useQuery<any[]>({
    queryKey: ["/api/crew/leads"],
    enabled: isAuthenticated,
  });

  const { data: crewStats } = useQuery<any>({
    queryKey: ["/api/crew/stats"],
    enabled: isAuthenticated,
  });

  const { data: paintColors = [], isLoading: isLoadingColors } = useQuery<any[]>({
    queryKey: ["/api/paint-colors"],
    enabled: isAuthenticated,
  });

  // Calculate paint coverage
  const wallSqFt = 2 * ceilingHeight * (roomWidth + roomLength);
  const sqFtPerGallon = 350;
  const gallonsNeeded = (wallSqFt * numCoats) / sqFtPerGallon;
  
  // Filter colors by search
  const filteredColors = colorSearch 
    ? paintColors.filter((c: any) => 
        c.colorName?.toLowerCase().includes(colorSearch.toLowerCase()) ||
        c.colorCode?.toLowerCase().includes(colorSearch.toLowerCase()) ||
        c.brand?.toLowerCase().includes(colorSearch.toLowerCase())
      )
    : paintColors;

  const todayStr = new Date().toDateString();
  const todaysJobs = bookings.filter((b: any) => new Date(b.date).toDateString() === todayStr);
  const pendingLeads = leads.filter((l: any) => l.status === "new" || l.status === "pending");
  const pendingEstimates = estimates.filter((e: any) => e.status === "pending" || e.status === "draft");
  
  // Calculate payment totals
  const thisMonthPayments = payments.filter((p: any) => {
    const paymentDate = new Date(p.createdAt);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  });
  const totalRevenue = thisMonthPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const paidPayments = payments.filter((p: any) => p.status === "completed" || p.status === "paid");
  const pendingPayments = payments.filter((p: any) => p.status === "pending");
  const overduePayments = payments.filter((p: any) => p.status === "overdue" || (p.status === "pending" && new Date(p.dueDate) < new Date()));

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

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogin = async () => {
    const user = PIN_CODES[pin];
    if (user) {
      setIsAuthenticated(true);
      setUserName(user.name);
      setUserRole(user.role);
      setPinError("");
    } else {
      setPinError("Invalid PIN");
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
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const processCommand = async (command: string): Promise<{ response: string; action?: Message["action"] }> => {
    const lower = command.toLowerCase();
    
    if (lower.includes("schedule") || lower.includes("calendar") || lower.includes("today")) {
      try {
        const response = await apiRequest("GET", "/api/bookings");
        const bookings = await response.json();
        const today = new Date().toDateString();
        const todayBookings = bookings.filter((b: any) => new Date(b.date).toDateString() === today);
        
        return {
          response: todayBookings.length > 0 
            ? `You have ${todayBookings.length} jobs today. ${todayBookings.map((b: any) => `${b.timeSlot}: ${b.customerName || 'Customer'}`).join('. ')}`
            : "No jobs scheduled for today. Would you like me to show tomorrow's schedule?",
          action: { type: "query", status: "success", details: `${todayBookings.length} jobs found` }
        };
      } catch {
        return { response: "I couldn't retrieve the schedule right now." };
      }
    }
    
    if (lower.includes("lead") || lower.includes("customer") || lower.includes("sales")) {
      try {
        const response = await apiRequest("GET", "/api/leads");
        const leads = await response.json();
        const pending = leads.filter((l: any) => l.status === "new" || l.status === "pending");
        return {
          response: `You have ${leads.length} total leads, ${pending.length} need follow-up. The newest is from ${leads[0]?.name || leads[0]?.email || 'a recent inquiry'}.`,
          action: { type: "query", status: "success", details: `${leads.length} leads` }
        };
      } catch {
        return { response: "Having trouble accessing leads right now." };
      }
    }
    
    if (lower.includes("estimate") || lower.includes("quote") || lower.includes("proposal")) {
      try {
        const response = await apiRequest("GET", "/api/estimates");
        const estimates = await response.json();
        const pending = estimates.filter((e: any) => e.status === "pending" || e.status === "draft");
        return {
          response: `${estimates.length} estimates in the system. ${pending.length} are waiting on approval.`,
          action: { type: "query", status: "success", details: `${estimates.length} estimates` }
        };
      } catch {
        return { response: "I'll get those estimates for you in a moment." };
      }
    }
    
    if (lower.includes("invoice") || lower.includes("payment") || lower.includes("money") || lower.includes("revenue")) {
      return {
        response: "I can help with invoicing. You can create invoices, check payment status, or send reminders. What would you like to do?",
        action: { type: "query", status: "success", details: "Invoicing ready" }
      };
    }
    
    if (lower.includes("crew") || lower.includes("team") || lower.includes("assign")) {
      return {
        response: "All crews are active. I can check locations, reassign teams, or update schedules. What do you need?",
        action: { type: "query", status: "success", details: "Crew status checked" }
      };
    }
    
    if (lower.includes("calculate") || lower.includes("measure") || lower.includes("square feet") || lower.includes("paint")) {
      setActiveSection("tools");
      return {
        response: "Opening TradeWorks calculator. You can estimate paint, measure rooms, or calculate materials.",
        action: { type: "navigation", status: "success", details: "Tools opened" }
      };
    }
    
    if (lower.includes("color") || lower.includes("match")) {
      setActiveSection("tools");
      return {
        response: "Opening color tools. You can match colors from photos or browse paint libraries.",
        action: { type: "navigation", status: "success", details: "Color tools opened" }
      };
    }
    
    return {
      response: `I can help with that. What specifically would you like me to do regarding "${command}"?`
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
      if (voiceEnabled) speakText(result.response);
    } catch {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I encountered an issue. Please try again.",
        timestamp: new Date(),
      }]);
    }

    setIsProcessing(false);
  };

  const todayStats: QuickStat[] = [
    { label: "Today's Jobs", value: String(todaysJobs.length), icon: <Calendar className="w-4 h-4" />, change: `${bookings.length} total scheduled`, trend: todaysJobs.length > 0 ? "up" : "neutral" },
    { label: "Pending Leads", value: String(pendingLeads.length), icon: <Users className="w-4 h-4" />, change: `${leads.length} total leads`, trend: pendingLeads.length > 0 ? "up" : "neutral" },
    { label: "Open Estimates", value: String(pendingEstimates.length), icon: <FileText className="w-4 h-4" />, change: `${estimates.length} total`, trend: pendingEstimates.length > 0 ? "up" : "neutral" },
    { label: "This Week", value: `${bookings.length} jobs`, icon: <TrendingUp className="w-4 h-4" />, change: "Active pipeline", trend: "up" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/30"
            >
              <Wrench className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">TradeWorks</h1>
            <p className="text-gray-500 text-sm">Your business in your pocket</p>
          </div>
          
          <Card className="bg-gray-900/80 border-gray-800 p-6 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter PIN"
                  className="w-full px-4 py-4 bg-black/50 border border-gray-800 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  maxLength={10}
                  data-testid="input-tradeworks-pin"
                />
              </div>
              
              <AnimatePresence>
                {pinError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {pinError}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <Button 
                onClick={handleLogin} 
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all"
                disabled={!pin}
                data-testid="button-tradeworks-login"
              >
                Access TradeWorks
              </Button>
            </div>
          </Card>
          
          <p className="text-gray-600 text-xs text-center mt-6">
            Authorized personnel only
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-black/80 backdrop-blur-xl sticky top-0 z-50 safe-area-top">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm leading-none">TradeWorks</h1>
            <p className="text-gray-500 text-xs">{userName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 relative"
            onClick={() => setShowNotifications(!showNotifications)}
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400"
            data-testid="button-settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-6"
            >
              <div className="grid grid-cols-2 gap-3">
                {todayStats.map((stat, i) => (
                  <Card key={i} className="bg-gray-900/50 border-gray-800 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                        {stat.icon}
                      </div>
                      {stat.trend === "up" && <Badge className="bg-green-500/20 text-green-400 text-xs">+</Badge>}
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                    {stat.change && <p className="text-gray-600 text-xs mt-1">{stat.change}</p>}
                  </Card>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-semibold">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: <Plus className="w-5 h-5" />, label: "New Lead", color: "from-blue-500 to-blue-600" },
                    { icon: <FileText className="w-5 h-5" />, label: "Estimate", color: "from-green-500 to-green-600" },
                    { icon: <CreditCard className="w-5 h-5" />, label: "Invoice", color: "from-purple-500 to-purple-600" },
                    { icon: <Calendar className="w-5 h-5" />, label: "Schedule", color: "from-orange-500 to-orange-600" },
                  ].map((action, i) => (
                    <Button
                      key={i}
                      variant="ghost"
                      className="h-auto py-3 flex flex-col items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-xl"
                      data-testid={`button-quick-${action.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white`}>
                        {action.icon}
                      </div>
                      <span className="text-gray-400 text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-semibold">Today's Jobs</h2>
                  <Button variant="ghost" size="sm" className="text-orange-400 text-xs" onClick={() => setActiveSection("schedule")}>View All</Button>
                </div>
                <div className="space-y-2">
                  {todaysJobs.length > 0 ? todaysJobs.slice(0, 3).map((job: any, i: number) => (
                    <Card key={job.id || i} className="bg-gray-900/50 border-gray-800 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-white text-sm font-medium">{job.timeSlot?.split(' ')[0] || '9:00'}</p>
                            <p className="text-gray-500 text-xs">{job.timeSlot?.split(' ')[1] || 'AM'}</p>
                          </div>
                          <div className="w-px h-10 bg-gray-800" />
                          <div>
                            <p className="text-white text-sm font-medium">{job.customerName || 'Customer'}</p>
                            <p className="text-gray-500 text-xs">{job.serviceType || 'Service'}</p>
                          </div>
                        </div>
                        <Badge className={job.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"}>
                          {job.status || 'Scheduled'}
                        </Badge>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-4 text-center">
                      <p className="text-gray-500 text-sm">No jobs scheduled for today</p>
                      <Button size="sm" className="mt-2 bg-orange-500" onClick={() => setActiveSection("schedule")}>View Schedule</Button>
                    </Card>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-semibold">Recent Leads</h2>
                  <Button variant="ghost" size="sm" className="text-orange-400 text-xs" onClick={() => setActiveSection("sales")}>View All</Button>
                </div>
                <div className="space-y-2">
                  {leads.length > 0 ? leads.slice(0, 3).map((lead: any, i: number) => (
                    <Card key={lead.id || i} className="bg-gray-900/50 border-gray-800 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {(lead.name || lead.email || 'L').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{lead.name || lead.email || 'New Lead'}</p>
                            <p className="text-gray-500 text-xs">{lead.serviceType || lead.source || 'Inquiry'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            lead.status === "new" ? "bg-blue-500/20 text-blue-400" :
                            lead.status === "hot" ? "bg-red-500/20 text-red-400" :
                            "bg-gray-800 text-gray-400"
                          }>
                            {lead.status || 'New'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-4 text-center">
                      <p className="text-gray-500 text-sm">No leads yet</p>
                      <Button size="sm" className="mt-2 bg-orange-500" onClick={() => setShowDripJobsImport(true)}>
                        <Upload className="w-4 h-4 mr-1" /> Import from DripJobs
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "sales" && (
            <motion.div 
              key="sales"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search leads, estimates..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    data-testid="input-sales-search"
                  />
                </div>
                <Button size="icon" className="bg-orange-500 hover:bg-orange-600 rounded-xl h-11 w-11">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <Tabs defaultValue="leads" className="w-full">
                <TabsList className="w-full bg-gray-900 border border-gray-800 p-1 rounded-xl">
                  <TabsTrigger value="leads" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Leads</TabsTrigger>
                  <TabsTrigger value="estimates" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Estimates</TabsTrigger>
                  <TabsTrigger value="proposals" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Proposals</TabsTrigger>
                </TabsList>
                
                <TabsContent value="leads" className="mt-4 space-y-2">
                  {leads.length > 0 ? leads.map((lead: any, i: number) => (
                    <Card key={lead.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {(lead.name || lead.email || 'L').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{lead.name || lead.email || 'New Lead'}</p>
                            <p className="text-gray-500 text-sm">{lead.serviceType || lead.source || 'Inquiry'}</p>
                          </div>
                        </div>
                        <Badge className={
                          lead.status === "hot" ? "bg-red-500/20 text-red-400" :
                          lead.status === "warm" ? "bg-orange-500/20 text-orange-400" :
                          lead.status === "new" ? "bg-blue-500/20 text-blue-400" :
                          "bg-gray-800 text-gray-400"
                        }>
                          {lead.status || 'New'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {lead.phone && (
                          <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300" asChild>
                            <a href={`tel:${lead.phone}`}><Phone className="w-3 h-3 mr-1" /> Call</a>
                          </Button>
                        )}
                        {lead.email && (
                          <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300" asChild>
                            <a href={`mailto:${lead.email}`}><Mail className="w-3 h-3 mr-1" /> Email</a>
                          </Button>
                        )}
                        <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
                          <FileText className="w-3 h-3 mr-1" /> Estimate
                        </Button>
                      </div>
                    </Card>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No leads yet</p>
                      <Button size="sm" className="mt-2 bg-orange-500" onClick={() => setShowDripJobsImport(true)}>
                        <Upload className="w-4 h-4 mr-1" /> Import from DripJobs
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="estimates" className="mt-4 space-y-2">
                  {estimates.length > 0 ? estimates.map((est: any, i: number) => (
                    <Card key={est.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{est.customerName || est.name || 'Estimate'}</p>
                          <p className="text-gray-500 text-sm">EST-{String(est.id).slice(0, 8)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${est.total?.toLocaleString() || est.amount?.toLocaleString() || '0'}</p>
                          <Badge className={
                            est.status === "approved" || est.status === "accepted" ? "bg-green-500/20 text-green-400" :
                            est.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            est.status === "sent" ? "bg-blue-500/20 text-blue-400" :
                            "bg-gray-800 text-gray-400"
                          }>
                            {est.status || 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No estimates yet</p>
                      <Button size="sm" className="mt-2 bg-orange-500">Create Estimate</Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="proposals" className="mt-4 space-y-2">
                  <div className="text-center py-8 text-gray-500">
                    <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No proposals yet</p>
                    <Button size="sm" className="mt-2 bg-orange-500">Create Proposal</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {activeSection === "schedule" && (
            <motion.div 
              key="schedule"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-semibold text-lg">Schedule</h2>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-1" /> Add Job
                </Button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <Button
                    key={day}
                    variant={i === 0 ? "default" : "outline"}
                    size="sm"
                    className={i === 0 ? "bg-orange-500" : "border-gray-700 text-gray-400"}
                  >
                    <div className="text-center">
                      <p className="text-xs">{day}</p>
                      <p className="text-sm font-medium">{23 + i}</p>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {bookings.length > 0 ? bookings.slice(0, 10).map((job: any, i: number) => (
                  <Card key={job.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                    <div className="flex gap-3">
                      <div className="text-center min-w-[60px]">
                        <p className="text-white font-medium">{job.timeSlot?.split(' ')[0] || '9:00'}</p>
                        <p className="text-gray-500 text-xs">{job.timeSlot?.split(' ')[1] || 'AM'}</p>
                        <p className="text-gray-600 text-xs mt-1">{job.date ? format(new Date(job.date), 'MMM d') : ''}</p>
                      </div>
                      <div className="w-px bg-gray-800" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-white font-medium">{job.customerName || 'Customer'}</p>
                            <p className="text-gray-500 text-sm">{job.serviceType || 'Service'}</p>
                            {job.address && (
                              <div className="flex items-center gap-1 mt-1 text-gray-600 text-xs">
                                <MapPin className="w-3 h-3" />
                                {job.address}
                              </div>
                            )}
                          </div>
                          <Badge className={job.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"}>
                            {job.status || 'Scheduled'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {job.phone && (
                            <Button size="sm" variant="ghost" className="text-gray-400" asChild>
                              <a href={`tel:${job.phone}`}><Phone className="w-3 h-3" /></a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-500">No jobs scheduled</p>
                    <Button size="sm" className="mt-3 bg-orange-500">
                      <Plus className="w-4 h-4 mr-1" /> Add Job
                    </Button>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === "money" && (
            <motion.div 
              key="money"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800/50 p-4">
                <p className="text-green-400 text-sm mb-1">This Month</p>
                <p className="text-white text-3xl font-bold">${(totalRevenue / 100).toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-400">{payments.length} payments</Badge>
                  {pendingPayments.length > 0 && (
                    <Badge className="bg-yellow-500/20 text-yellow-400">{pendingPayments.length} pending</Badge>
                  )}
                </div>
              </Card>

              <Tabs defaultValue="invoices" className="w-full">
                <TabsList className="w-full bg-gray-900 border border-gray-800 p-1 rounded-xl">
                  <TabsTrigger value="invoices" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Invoices</TabsTrigger>
                  <TabsTrigger value="estimates" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Estimates</TabsTrigger>
                  <TabsTrigger value="payroll" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Payroll</TabsTrigger>
                </TabsList>

                <TabsContent value="invoices" className="mt-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">Outstanding: <span className="text-white font-medium">${(pendingPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0) / 100).toLocaleString()}</span></p>
                    <Button size="sm" className="bg-orange-500">
                      <Plus className="w-4 h-4 mr-1" /> New Invoice
                    </Button>
                  </div>
                  {payments.length > 0 ? payments.slice(0, 10).map((payment: any, i: number) => (
                    <Card key={payment.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{payment.customerName || `Payment #${payment.id?.slice(0, 8)}`}</p>
                          <p className="text-gray-500 text-sm">{payment.estimateId ? `Est: ${payment.estimateId.slice(0, 8)}` : ''} - {format(new Date(payment.createdAt), 'MMM d')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${((payment.amount || 0) / 100).toLocaleString()}</p>
                          <Badge className={
                            payment.status === "completed" || payment.status === "paid" ? "bg-green-500/20 text-green-400" :
                            payment.status === "overdue" ? "bg-red-500/20 text-red-400" :
                            payment.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-gray-800 text-gray-400"
                          }>
                            {payment.status || 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                      <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500">No payments yet</p>
                      <p className="text-gray-600 text-sm mt-1">Payments will appear when estimates are paid</p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="estimates" className="mt-4 space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-sm">Total Value: <span className="text-white font-medium">${estimates.reduce((s: number, e: any) => s + (e.totalAmount || 0), 0).toLocaleString()}</span></p>
                    <Button size="sm" className="bg-orange-500">
                      <Plus className="w-4 h-4 mr-1" /> New Estimate
                    </Button>
                  </div>
                  {estimates.length > 0 ? estimates.slice(0, 10).map((est: any, i: number) => (
                    <Card key={est.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{est.customerName || est.name || 'Estimate'}</p>
                          <p className="text-gray-500 text-sm">{est.serviceType || 'Service'} - {format(new Date(est.createdAt), 'MMM d')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${(est.totalAmount || 0).toLocaleString()}</p>
                          <Badge className={
                            est.status === "approved" || est.status === "accepted" ? "bg-green-500/20 text-green-400" :
                            est.status === "rejected" ? "bg-red-500/20 text-red-400" :
                            est.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-gray-800 text-gray-400"
                          }>
                            {est.status || 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500">No estimates yet</p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="payroll" className="mt-4 space-y-2">
                  <Card className="bg-gray-900/50 border-gray-800 p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-400 text-sm">Team Members</p>
                      <Badge className="bg-orange-500/20 text-orange-400">{crewLeads.length} crew leads</Badge>
                    </div>
                    <p className="text-white text-2xl font-bold">{crewStats?.totalMembers || crewLeads.length} members</p>
                    <p className="text-gray-500 text-sm mt-1">Active crew</p>
                  </Card>
                  {crewLeads.length > 0 ? crewLeads.map((crew: any, i: number) => (
                    <Card key={crew.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white">
                            {(crew.name || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{crew.name || 'Crew Lead'}</p>
                            <p className="text-gray-500 text-sm">{crew.specialty || 'General'}</p>
                          </div>
                        </div>
                        <Badge className={crew.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"}>
                          {crew.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500">No crew leads yet</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {activeSection === "crew" && (
            <motion.div 
              key="crew"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white font-semibold text-lg">Team</h2>
                <Button size="sm" className="bg-orange-500">
                  <Plus className="w-4 h-4 mr-1" /> Add Member
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="bg-gray-900/50 border-gray-800 p-3 text-center">
                  <p className="text-2xl font-bold text-white">{crewStats?.totalMembers || crewLeads.length}</p>
                  <p className="text-gray-500 text-xs">Team Members</p>
                </Card>
                <Card className="bg-gray-900/50 border-gray-800 p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{crewStats?.activeToday || todaysJobs.length}</p>
                  <p className="text-gray-500 text-xs">On Jobs Today</p>
                </Card>
              </div>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="w-full bg-gray-900 border border-gray-800 p-1 rounded-xl">
                  <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Active</TabsTrigger>
                  <TabsTrigger value="time" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Time</TabsTrigger>
                  <TabsTrigger value="jobs" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4 space-y-2">
                  {crewLeads.length > 0 ? crewLeads.map((crew: any, i: number) => (
                    <Card key={crew.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {(crew.name || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${crew.isActive ? "bg-green-500" : "bg-gray-500"}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{crew.name || 'Crew Lead'}</p>
                            <p className="text-gray-500 text-sm">{crew.specialty || 'General'}</p>
                            {crew.phone && (
                              <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                                <Phone className="w-3 h-3" />
                                {crew.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={crew.isActive ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"}>
                            {crew.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <div className="flex gap-1">
                            {crew.phone && (
                              <Button size="icon" variant="ghost" className="w-8 h-8 text-gray-500" asChild>
                                <a href={`tel:${crew.phone}`}><Phone className="w-4 h-4" /></a>
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" className="w-8 h-8 text-gray-500">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                      <HardHat className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500">No crew leads yet</p>
                      <Button size="sm" className="mt-3 bg-orange-500">
                        <Plus className="w-4 h-4 mr-1" /> Add Crew Lead
                      </Button>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="time" className="mt-4 space-y-2">
                  {crewLeads.length > 0 ? crewLeads.filter((c: any) => c.isActive).map((crew: any, i: number) => (
                    <Card key={crew.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{crew.name || 'Crew Lead'}</p>
                          <p className="text-gray-500 text-sm">{crew.specialty || 'General'}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                      <Clock className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500">No time entries today</p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="jobs" className="mt-4 space-y-2">
                  {todaysJobs.length > 0 ? todaysJobs.map((job: any, i: number) => (
                    <Card key={job.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{job.customerName || 'Customer'}</p>
                          <p className="text-gray-500 text-sm">{job.serviceType || 'Service'} - {job.timeSlot || 'TBD'}</p>
                        </div>
                        <Badge className={job.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                          {job.status || 'Scheduled'}
                        </Badge>
                      </div>
                    </Card>
                  )) : (
                    <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500">No jobs scheduled today</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {activeSection === "tools" && (
            <motion.div 
              key="tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <Tabs defaultValue="calculator" className="w-full">
                <TabsList className="w-full bg-gray-900 border border-gray-800 p-1 rounded-xl mb-4">
                  <TabsTrigger value="calculator" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">
                    <Calculator className="w-4 h-4 mr-1" /> Calc
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">
                    <Palette className="w-4 h-4 mr-1" /> Colors
                  </TabsTrigger>
                  <TabsTrigger value="more" className="flex-1 data-[state=active]:bg-orange-500 rounded-lg">
                    <Wrench className="w-4 h-4 mr-1" /> More
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calculator" className="space-y-4">
                  <Card className="bg-gray-900/50 border-gray-800 p-4">
                    <h3 className="text-white font-semibold mb-4">Paint Calculator</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Room Width (ft)</label>
                        <input 
                          type="number" 
                          value={roomWidth}
                          onChange={(e) => setRoomWidth(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                          data-testid="input-room-width"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Room Length (ft)</label>
                        <input 
                          type="number" 
                          value={roomLength}
                          onChange={(e) => setRoomLength(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                          data-testid="input-room-length"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Ceiling Height (ft)</label>
                        <input 
                          type="number" 
                          value={ceilingHeight}
                          onChange={(e) => setCeilingHeight(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                          data-testid="input-ceiling-height"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Number of Coats</label>
                        <select 
                          value={numCoats}
                          onChange={(e) => setNumCoats(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" 
                          data-testid="select-coats"
                        >
                          <option value="1">1 Coat</option>
                          <option value="2">2 Coats</option>
                          <option value="3">3 Coats</option>
                        </select>
                      </div>
                      <Card className="bg-gray-800 p-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-gray-400 text-xs">Wall Sq Ft</p>
                            <p className="text-white text-xl font-bold">{wallSqFt.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Gallons Needed</p>
                            <p className="text-orange-400 text-xl font-bold">{gallonsNeeded.toFixed(1)}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs text-center mt-2">Based on {sqFtPerGallon} sq ft per gallon coverage</p>
                      </Card>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Search colors by name, code, or brand..."
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm"
                      data-testid="input-color-search"
                    />
                  </div>
                  <p className="text-gray-400 text-sm">
                    {colorSearch ? `${filteredColors.length} results` : `${paintColors.length} colors in library`}
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {isLoadingColors ? (
                      <div className="col-span-2 text-center py-8">
                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-gray-500">Loading colors...</p>
                      </div>
                    ) : filteredColors.length > 0 ? filteredColors.slice(0, 30).map((color: any, i: number) => (
                      <Card key={color.id || i} className="bg-gray-900/50 border-gray-800 p-3 cursor-pointer hover:bg-gray-800/50">
                        <div 
                          className="w-full h-16 rounded-lg mb-2 border border-gray-700"
                          style={{ backgroundColor: color.hexValue || '#888888' }}
                        />
                        <p className="text-white text-sm font-medium truncate">{color.colorName}</p>
                        <p className="text-gray-500 text-xs">{color.brand} - {color.colorCode}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge className="text-xs bg-gray-800 text-gray-400">{color.category}</Badge>
                          {color.lrv && <span className="text-gray-600 text-xs">LRV: {color.lrv}</span>}
                        </div>
                      </Card>
                    )) : (
                      <div className="col-span-2 text-center py-8">
                        <Palette className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                        <p className="text-gray-500">{colorSearch ? 'No colors match your search' : 'No colors available'}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="more" className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <Camera className="w-6 h-6" />, label: "Room Measure", desc: "Photo measure", color: "from-green-500 to-green-600" },
                      { icon: <Package className="w-6 h-6" />, label: "Material Calc", desc: "All materials", color: "from-orange-500 to-orange-600" },
                      { icon: <Car className="w-6 h-6" />, label: "Mileage", desc: "Track drives", color: "from-red-500 to-red-600" },
                      { icon: <CloudSun className="w-6 h-6" />, label: "Weather", desc: "Job conditions", color: "from-cyan-500 to-cyan-600" },
                      { icon: <FileCheck className="w-6 h-6" />, label: "Documents", desc: "Licenses, W9s", color: "from-amber-500 to-amber-600" },
                      { icon: <Shield className="w-6 h-6" />, label: "Safety", desc: "MSDS, procedures", color: "from-gray-500 to-gray-600" },
                    ].map((tool, i) => (
                      <Card key={i} className="bg-gray-900/50 border-gray-800 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                          {tool.icon}
                        </div>
                        <p className="text-white font-medium">{tool.label}</p>
                        <p className="text-gray-500 text-sm">{tool.desc}</p>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 px-2 py-2 safe-area-bottom z-40">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { id: "home" as AppSection, icon: <Home className="w-5 h-5" />, label: "Home" },
            { id: "sales" as AppSection, icon: <Target className="w-5 h-5" />, label: "Sales" },
            { id: "schedule" as AppSection, icon: <Calendar className="w-5 h-5" />, label: "Schedule" },
            { id: "money" as AppSection, icon: <Wallet className="w-5 h-5" />, label: "Money" },
            { id: "crew" as AppSection, icon: <HardHat className="w-5 h-5" />, label: "Crew" },
            { id: "tools" as AppSection, icon: <Wrench className="w-5 h-5" />, label: "Tools" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                activeSection === item.id 
                  ? "text-orange-400" 
                  : "text-gray-500"
              }`}
              data-testid={`nav-${item.id}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <Button
        onClick={() => setIsAIOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-orange-500/30 z-50"
        data-testid="button-open-ai"
      >
        <Bot className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isAIOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col"
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">AI Assistant</h2>
                  <p className="text-gray-500 text-xs">Voice or type commands</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={voiceEnabled ? "text-orange-400" : "text-gray-500"}
                >
                  {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAIOpen(false)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">How can I help?</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-xs">
                    I can manage your schedule, look up customers, create invoices, and more
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                    {[
                      "What's on today's schedule?",
                      "Show me pending leads",
                      "Create a new estimate",
                      "Check crew locations",
                    ].map((cmd, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 text-xs"
                        onClick={() => handleSendMessage(cmd)}
                      >
                        {cmd}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-2xl mx-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-orange-600 text-white"
                            : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.action && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <Badge className={
                              message.action.status === "success" ? "bg-green-500/20 text-green-400" :
                              message.action.status === "error" ? "bg-red-500/20 text-red-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }>
                              {message.action.status === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {message.action.details}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 rounded-2xl px-4 py-3">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-2 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type or speak..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isProcessing}
                  data-testid="input-ai-message"
                />
                <Button
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  className={`w-12 h-12 rounded-xl ${isListening ? "bg-red-500 animate-pulse" : "bg-gray-800 border-gray-700"}`}
                  onClick={toggleListening}
                  disabled={isProcessing}
                  data-testid="button-ai-mic"
                >
                  {isListening ? <Radio className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-xl bg-orange-500"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isProcessing}
                  data-testid="button-ai-send"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {isSpeaking && (
                <div className="flex items-center justify-center gap-2 mt-2 text-orange-400 text-xs">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  Speaking...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={showDripJobsImport} onOpenChange={setShowDripJobsImport}>
        <SheetContent side="bottom" className="h-[90vh] bg-gray-900 border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">Import from DripJobs</SheetTitle>
          </SheetHeader>
          <div className="mt-4 h-full overflow-auto">
            <DripJobsImport onComplete={() => setShowDripJobsImport(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
