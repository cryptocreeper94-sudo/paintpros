import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Home,
  Calendar,
  Calculator,
  MapPin,
  Clock,
  Camera,
  Mic,
  Phone,
  Navigation,
  Cloud,
  Droplets,
  Palette,
  FileText,
  DollarSign,
  Users,
  Wrench,
  Settings,
  ChevronRight,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Truck,
  Store,
  Car,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Plus,
  Send,
  Volume2,
  Radio,
  X,
  ArrowLeft,
  Zap,
  Brain,
  Sparkles,
  Upload,
  Image,
  ClipboardList,
  Package,
  Timer,
  Route,
  Building2,
  PaintBucket
} from "lucide-react";

export default function FieldTool() {
  const tenant = useTenant();
  const [activeSection, setActiveSection] = useState("home");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showMileage, setShowMileage] = useState(false);
  const [showPhotoAI, setShowPhotoAI] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch today's jobs
  const { data: bookings = [] } = useQuery<any[]>({
    queryKey: ["/api/bookings"],
  });

  // Timer for clock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - clockInTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      setIsClockedIn(false);
      setClockInTime(null);
      setElapsedTime(0);
    } else {
      setIsClockedIn(true);
      setClockInTime(new Date());
    }
  };

  // Get tenant-specific branding
  const getTenantColors = () => {
    const primaryColor = tenant?.theme?.primaryColor || "#f97316";
    return {
      primary: primaryColor,
      gradient: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
    };
  };

  const colors = getTenantColors();
  const appName = tenant?.name ? `${tenant.name.split(' ')[0]} Field Tool` : "Field Tool";

  // Today's jobs from bookings
  const todaysJobs = bookings.filter((b: any) => {
    if (!b.date) return false;
    const bookingDate = new Date(b.date);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  });

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;
    
    const userMessage = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/ai/field-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          context: {
            tenant: tenant?.name,
            todaysJobs: todaysJobs.length,
            isClockedIn
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I'm here to help! You can ask me about paint calculations, weather conditions, job details, or dictate notes." 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm ready to assist with calculations, weather checks, paint recommendations, and more!" 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick actions for field work
  const quickActions = [
    { icon: Calculator, label: "Calculator", action: () => setShowCalculator(true), color: "bg-blue-500" },
    { icon: Cloud, label: "Weather", action: () => setShowWeather(true), color: "bg-cyan-500" },
    { icon: Car, label: "Mileage", action: () => setShowMileage(true), color: "bg-purple-500" },
    { icon: Camera, label: "Photo AI", action: () => setShowPhotoAI(true), color: "bg-pink-500" },
    { icon: Store, label: "Paint Stores", action: () => setActiveSection("stores"), color: "bg-green-500" },
    { icon: Palette, label: "Colors", action: () => setActiveSection("colors"), color: "bg-orange-500" },
  ];

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "jobs", icon: ClipboardList, label: "Jobs" },
    { id: "tools", icon: Wrench, label: "Tools" },
    { id: "time", icon: Clock, label: "Time" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Header with tenant branding */}
      <div 
        className="sticky top-0 z-40 px-4 py-3 backdrop-blur-xl border-b border-white/10"
        style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 100%)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colors.gradient }}
            >
              <PaintBucket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{appName}</h1>
              <p className="text-xs text-gray-400">{tenant?.tagline || "Field Operations"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-gray-400"
              onClick={() => setShowAIAssistant(true)}
            >
              <Brain className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-gray-400">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Clock In/Out Banner */}
      <div className="px-4 py-3">
        <Card 
          className="p-4 border-0"
          style={{ 
            background: isClockedIn 
              ? `linear-gradient(135deg, #22c55e20 0%, #16a34a20 100%)` 
              : `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.primary}10 100%)`,
            borderColor: isClockedIn ? '#22c55e40' : `${colors.primary}40`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm text-gray-400">
                  {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
                </span>
              </div>
              {isClockedIn && (
                <p className="text-2xl font-mono font-bold text-white mt-1">
                  {formatElapsedTime(elapsedTime)}
                </p>
              )}
            </div>
            <Button 
              onClick={handleClockToggle}
              className={isClockedIn ? 'bg-red-500 hover:bg-red-600' : ''}
              style={!isClockedIn ? { background: colors.primary } : {}}
            >
              {isClockedIn ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isClockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </div>
        </Card>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            {/* Quick Actions Grid */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action, i) => (
                  <Card 
                    key={i}
                    className="bg-gray-900/50 border-gray-800 p-4 text-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={action.action}
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-white">{action.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Today's Jobs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-400">Today's Jobs</h2>
                <Button variant="ghost" size="sm" className="text-xs" style={{ color: colors.primary }} onClick={() => setActiveSection("jobs")}>
                  View All
                </Button>
              </div>
              <div className="space-y-2">
                {todaysJobs.length > 0 ? todaysJobs.slice(0, 3).map((job: any, i: number) => (
                  <Card key={job.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[50px]">
                          <p className="text-white font-medium">{job.timeSlot?.split(' ')[0] || '9:00'}</p>
                          <p className="text-gray-500 text-xs">{job.timeSlot?.split(' ')[1] || 'AM'}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-800" />
                        <div>
                          <p className="text-white font-medium">{job.customerName || 'Customer'}</p>
                          <p className="text-gray-500 text-sm">{job.serviceType || 'Service'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {job.phone && (
                          <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
                            <a href={`tel:${job.phone}`}><Phone className="w-4 h-4 text-gray-400" /></a>
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-9 w-9">
                          <Navigation className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-500 text-sm">No jobs scheduled today</p>
                  </Card>
                )}
              </div>
            </div>

            {/* AI Assistant Teaser */}
            <Card 
              className="p-4 border-0 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.primary}10 100%)` }}
              onClick={() => setShowAIAssistant(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: colors.gradient }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">AI Field Assistant</p>
                  <p className="text-gray-400 text-sm">Voice commands, calculations, recommendations</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          </motion.div>
        )}

        {activeSection === "jobs" && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">All Jobs</h2>
            <div className="space-y-3">
              {bookings.length > 0 ? bookings.map((job: any, i: number) => (
                <Card key={job.id || i} className="bg-gray-900/50 border-gray-800 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{job.customerName || 'Customer'}</p>
                      <p className="text-gray-500 text-sm">{job.serviceType || 'Service'}</p>
                      {job.date && (
                        <p className="text-gray-600 text-xs mt-1">
                          {format(new Date(job.date), 'MMM d')} at {job.timeSlot || '9:00 AM'}
                        </p>
                      )}
                    </div>
                    <Badge className={job.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"}>
                      {job.status || 'Scheduled'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {job.phone && (
                      <Button size="sm" variant="outline" className="flex-1 border-gray-700" asChild>
                        <a href={`tel:${job.phone}`}><Phone className="w-3 h-3 mr-1" /> Call</a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="flex-1 border-gray-700">
                      <Navigation className="w-3 h-3 mr-1" /> Navigate
                    </Button>
                    <Button size="sm" style={{ background: colors.primary }}>
                      <FileText className="w-3 h-3 mr-1" /> Notes
                    </Button>
                  </div>
                </Card>
              )) : (
                <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                  <p className="text-gray-500">No jobs scheduled</p>
                </Card>
              )}
            </div>
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
            <h2 className="text-lg font-semibold text-white">Field Tools</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calculator, label: "Paint Calculator", desc: "Coverage & gallons", action: () => setShowCalculator(true) },
                { icon: Palette, label: "Color Match", desc: "Find paint colors", action: () => setActiveSection("colors") },
                { icon: Store, label: "Paint Stores", desc: "Nearby locations", action: () => setActiveSection("stores") },
                { icon: Cloud, label: "Weather", desc: "Check conditions", action: () => setShowWeather(true) },
                { icon: Car, label: "Mileage", desc: "Track travel", action: () => setShowMileage(true) },
                { icon: Camera, label: "Photo AI", desc: "Analyze photos", action: () => setShowPhotoAI(true) },
                { icon: Package, label: "Materials", desc: "Order supplies", action: () => {} },
                { icon: FileText, label: "Job Notes", desc: "Add notes/photos", action: () => {} },
              ].map((tool, i) => (
                <Card 
                  key={i}
                  className="bg-gray-900/50 border-gray-800 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={tool.action}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${colors.primary}30` }}>
                      <tool.icon className="w-5 h-5" style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{tool.label}</p>
                      <p className="text-gray-500 text-xs">{tool.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "time" && (
          <motion.div
            key="time"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">Time Tracking</h2>
            
            <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${isClockedIn ? 'bg-green-500/20' : 'bg-gray-800'}`}>
                <Timer className={`w-10 h-10 ${isClockedIn ? 'text-green-400' : 'text-gray-500'}`} />
              </div>
              <p className="text-4xl font-mono font-bold text-white mb-2">
                {formatElapsedTime(elapsedTime)}
              </p>
              <p className="text-gray-500 mb-4">
                {isClockedIn ? `Started at ${clockInTime?.toLocaleTimeString()}` : 'Ready to start'}
              </p>
              <Button 
                size="lg"
                onClick={handleClockToggle}
                className={isClockedIn ? 'bg-red-500 hover:bg-red-600' : ''}
                style={!isClockedIn ? { background: colors.primary } : {}}
              >
                {isClockedIn ? 'Clock Out' : 'Clock In'}
              </Button>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">This Week</h3>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, i) => (
                <Card key={day} className="bg-gray-900/50 border-gray-800 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white">{day}</span>
                    <span className="text-gray-400 font-mono">{i < 3 ? "8:00" : "0:00"}</span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "stores" && (
          <motion.div
            key="stores"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Button size="icon" variant="ghost" onClick={() => setActiveSection("home")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-white">Nearby Paint Stores</h2>
            </div>
            
            {[
              { name: "Sherwin-Williams", address: "123 Main St", distance: "0.8 mi", hours: "7am-6pm" },
              { name: "Benjamin Moore", address: "456 Oak Ave", distance: "1.2 mi", hours: "8am-5pm" },
              { name: "PPG Paints", address: "789 Pine Rd", distance: "2.1 mi", hours: "7am-7pm" },
              { name: "Home Depot", address: "321 Commerce Blvd", distance: "3.5 mi", hours: "6am-10pm" },
            ].map((store, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{store.name}</p>
                    <p className="text-gray-500 text-sm">{store.address}</p>
                    <p className="text-gray-600 text-xs mt-1">{store.hours}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-gray-800 text-gray-400 mb-2">{store.distance}</Badge>
                    <Button size="sm" style={{ background: colors.primary }}>
                      <Navigation className="w-3 h-3 mr-1" /> Go
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {activeSection === "colors" && (
          <motion.div
            key="colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Button size="icon" variant="ghost" onClick={() => setActiveSection("home")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-white">Color Tools</h2>
            </div>

            <Card 
              className="p-4 border-0 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${colors.primary}30 0%, ${colors.primary}10 100%)` }}
              onClick={() => setShowPhotoAI(true)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: colors.gradient }}>
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">AI Color Match</p>
                  <p className="text-gray-400 text-sm">Take a photo to find matching paints</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Popular Colors</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Simply White", hex: "#F5F5F0" },
                  { name: "Agreeable Gray", hex: "#D5D0C8" },
                  { name: "Repose Gray", hex: "#C2BDB6" },
                  { name: "Accessible Beige", hex: "#D4C8B5" },
                  { name: "Alabaster", hex: "#F2EDE3" },
                  { name: "Extra White", hex: "#F1F1EF" },
                  { name: "Snowbound", hex: "#EBE8E1" },
                  { name: "Pure White", hex: "#F0EDE5" },
                ].map((color, i) => (
                  <Card key={i} className="bg-gray-900/50 border-gray-800 p-2 text-center cursor-pointer">
                    <div 
                      className="w-full aspect-square rounded-lg mb-1"
                      style={{ background: color.hex }}
                    />
                    <p className="text-white text-xs truncate">{color.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-800 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                activeSection === item.id ? '' : 'text-gray-500'
              }`}
              style={activeSection === item.id ? { color: colors.primary } : {}}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Sheet */}
      <Sheet open={showCalculator} onOpenChange={setShowCalculator}>
        <SheetContent side="bottom" className="h-[85vh] bg-gray-900 border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">Paint Calculator</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Room Width (ft)</label>
              <Input type="number" placeholder="12" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Room Length (ft)</label>
              <Input type="number" placeholder="14" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Ceiling Height (ft)</label>
              <Input type="number" placeholder="8" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Number of Doors</label>
              <Input type="number" placeholder="2" className="bg-gray-800 border-gray-700" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Number of Windows</label>
              <Input type="number" placeholder="2" className="bg-gray-800 border-gray-700" />
            </div>
            <Button className="w-full" style={{ background: colors.primary }}>Calculate</Button>
            
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Wall Area</p>
                  <p className="text-white text-lg font-bold">416 sq ft</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Paint Needed</p>
                  <p className="text-white text-lg font-bold">1.2 gal</p>
                </div>
              </div>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Weather Sheet */}
      <Sheet open={showWeather} onOpenChange={setShowWeather}>
        <SheetContent side="bottom" className="h-[70vh] bg-gray-900 border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">Weather Conditions</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-800/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Nashville, TN</p>
                  <p className="text-5xl font-bold text-white">72°</p>
                  <p className="text-gray-300">Partly Cloudy</p>
                </div>
                <Sun className="w-20 h-20 text-yellow-400" />
              </div>
            </Card>
            
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-gray-800 border-gray-700 p-3 text-center">
                <Droplets className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                <p className="text-white font-medium">45%</p>
                <p className="text-gray-500 text-xs">Humidity</p>
              </Card>
              <Card className="bg-gray-800 border-gray-700 p-3 text-center">
                <Wind className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-white font-medium">8 mph</p>
                <p className="text-gray-500 text-xs">Wind</p>
              </Card>
              <Card className="bg-gray-800 border-gray-700 p-3 text-center">
                <CloudRain className="w-5 h-5 mx-auto text-blue-300 mb-1" />
                <p className="text-white font-medium">10%</p>
                <p className="text-gray-500 text-xs">Rain</p>
              </Card>
            </div>

            <Card className="bg-green-900/30 border-green-800/50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Good for Exterior Paint</p>
                  <p className="text-gray-400 text-sm">Conditions are ideal for exterior painting</p>
                </div>
              </div>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mileage Sheet */}
      <Sheet open={showMileage} onOpenChange={setShowMileage}>
        <SheetContent side="bottom" className="h-[70vh] bg-gray-900 border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">Mileage Tracker</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-xs">Today</p>
                  <p className="text-2xl font-bold text-white">24.5 mi</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">This Week</p>
                  <p className="text-2xl font-bold text-white">142 mi</p>
                </div>
              </div>
            </Card>

            <Button className="w-full" style={{ background: colors.primary }}>
              <Route className="w-4 h-4 mr-2" /> Start Tracking
            </Button>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Recent Trips</h3>
              {[
                { from: "Office", to: "Johnson Residence", miles: 8.2, time: "9:15 AM" },
                { from: "Johnson Residence", to: "Paint Store", miles: 3.1, time: "12:30 PM" },
                { from: "Paint Store", to: "Smith Office", miles: 5.4, time: "1:45 PM" },
              ].map((trip, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{trip.from} → {trip.to}</p>
                      <p className="text-gray-500 text-xs">{trip.time}</p>
                    </div>
                    <Badge className="bg-gray-700 text-gray-300">{trip.miles} mi</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Photo AI Sheet */}
      <Sheet open={showPhotoAI} onOpenChange={setShowPhotoAI}>
        <SheetContent side="bottom" className="h-[80vh] bg-gray-900 border-gray-800">
          <SheetHeader>
            <SheetTitle className="text-white">AI Photo Analysis</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Card className="bg-gray-800 border-gray-700 p-8 text-center border-dashed">
              <Camera className="w-12 h-12 mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400 mb-4">Take a photo or upload to analyze</p>
              <div className="flex gap-3 justify-center">
                <Button style={{ background: colors.primary }}>
                  <Camera className="w-4 h-4 mr-2" /> Camera
                </Button>
                <Button variant="outline" className="border-gray-700">
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
              </div>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">AI Can Help With</h3>
              {[
                { icon: Palette, label: "Color matching from photos" },
                { icon: Calculator, label: "Estimate surface area" },
                { icon: AlertCircle, label: "Identify surface issues" },
                { icon: Package, label: "Suggest materials needed" },
              ].map((item, i) => (
                <Card key={i} className="bg-gray-800 border-gray-700 p-3">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" style={{ color: colors.primary }} />
                    <span className="text-white text-sm">{item.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* AI Assistant Overlay */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: colors.gradient }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">Field Assistant</h2>
                  <p className="text-gray-500 text-xs">Voice-enabled AI helper</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowAIAssistant(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${colors.primary}20` }}>
                    <Brain className="w-8 h-8" style={{ color: colors.primary }} />
                  </div>
                  <p className="text-white font-medium mb-2">How can I help?</p>
                  <p className="text-gray-500 text-sm mb-4">Try asking:</p>
                  <div className="space-y-2">
                    {[
                      "How many gallons for a 12x14 room?",
                      "What's the weather like today?",
                      "Find the nearest paint store",
                      "Calculate square footage",
                    ].map((suggestion, i) => (
                      <Button 
                        key={i}
                        variant="outline" 
                        size="sm"
                        className="border-gray-700 text-gray-300"
                        onClick={() => setInputText(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'rounded-br-sm' 
                      : 'bg-gray-800 rounded-bl-sm'
                  }`} style={msg.role === 'user' ? { background: colors.primary } : {}}>
                    <p className="text-white text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-1 bg-gray-800 border-gray-700"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  className={`w-12 h-12 rounded-xl ${isListening ? '' : 'border-gray-700'}`}
                  style={isListening ? { background: colors.primary } : {}}
                  onClick={toggleListening}
                >
                  {isListening ? <Radio className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-xl"
                  style={{ background: colors.primary }}
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isProcessing}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
