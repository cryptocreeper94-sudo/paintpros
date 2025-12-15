import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, Loader2, Mic, MicOff, MessageSquare, Plus, ArrowLeft, 
  Users, Search, Paperclip, Check, CheckCheck
} from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { io, Socket } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  senderName: string;
  content: string;
  messageType: string;
  attachments: string[];
  createdAt: string;
  isRead: boolean;
}

interface Participant {
  id: string;
  conversationId: string;
  userId: string;
  role: string;
  displayName: string;
  lastReadAt: string | null;
}

interface Conversation {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  createdAt: string;
  participants: Participant[];
  lastMessage: Message | null;
}

interface AvailableUser {
  id: string;
  role: string;
  displayName: string;
}

interface OnlineUser {
  userId: string;
  role: string;
  displayName: string;
  alwaysAvailable: boolean;
}

type WidgetView = "minimized" | "list" | "chat" | "new";

interface MessagingWidgetProps {
  currentUserId: string;
  currentUserRole: string;
  currentUserName: string;
}

export function MessagingWidget({ currentUserId, currentUserRole, currentUserName }: MessagingWidgetProps) {
  const tenant = useTenant();
  const [view, setView] = useState<WidgetView>("minimized");
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: conversations = [], isLoading: loadingConvos } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations", { tenantId: tenant.id, role: currentUserRole }],
    enabled: view !== "minimized"
  });

  const { data: messages = [], isLoading: loadingMessages, refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages/conversations", activeConversation?.id, "messages"],
    enabled: !!activeConversation
  });

  const { data: availableUsers = [] } = useQuery<AvailableUser[]>({
    queryKey: ["/api/messages/users", { tenantId: tenant.id }],
    enabled: view === "new"
  });

  const { data: onlineUsers = [] } = useQuery<OnlineUser[]>({
    queryKey: ["/api/messages/online-users"],
    enabled: view !== "minimized",
    refetchInterval: 10000
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeConversation) return;
      return apiRequest("POST", `/api/messages/conversations/${activeConversation.id}/messages`, {
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        content,
        messageType: "text"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations", activeConversation?.id, "messages"] });
    }
  });

  const createConversationMutation = useMutation({
    mutationFn: async (participant: AvailableUser) => {
      const name = `${currentUserName} & ${participant.displayName}`;
      const response = await apiRequest("POST", "/api/messages/conversations", {
        tenantId: tenant.id,
        name,
        type: "direct",
        createdBy: currentUserId,
        participants: [
          { userId: currentUserId, role: currentUserRole, displayName: currentUserName },
          { userId: participant.id, role: participant.role, displayName: participant.displayName }
        ]
      });
      return { response, participant };
    },
    onSuccess: async ({ response, participant }) => {
      const newConvo = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      
      // Send auto-message when starting conversation with developer
      if (participant.role === "developer") {
        await apiRequest("POST", `/api/messages/conversations/${newConvo.id}/messages`, {
          senderId: "system",
          senderRole: "system",
          senderName: "System",
          content: "Ryan (Developer) typically responds within 24-48 hours during business days. For urgent matters, please include 'URGENT' in your message.",
          messageType: "system"
        });
        queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations", newConvo.id, "messages"] });
      }
      
      setActiveConversation(newConvo);
      setView("chat");
    }
  });

  useEffect(() => {
    if (view !== "minimized") {
      if (!socket) {
        const newSocket = io(window.location.origin, {
          path: "/socket.io",
          transports: ["websocket", "polling"]
        });
        setSocket(newSocket);

        // Emit user online status when connected
        newSocket.on("connect", () => {
          newSocket.emit("user-online", {
            userId: currentUserId,
            role: currentUserRole,
            displayName: currentUserName
          });
        });

        newSocket.on("new-message", (message: Message) => {
          queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
        });

        newSocket.on("user-typing", ({ userId, userName }: { userId: string; userName: string }) => {
          setTypingUsers((prev) => new Map(prev).set(userId, userName));
        });

        newSocket.on("user-stop-typing", ({ userId }: { userId: string }) => {
          setTypingUsers((prev) => {
            const next = new Map(prev);
            next.delete(userId);
            return next;
          });
        });

        // Listen for user status changes
        newSocket.on("user-status-change", ({ userId, online }: { userId: string; online: boolean }) => {
          setOnlineUserIds((prev) => {
            const next = new Set(prev);
            if (online) {
              next.add(userId);
            } else {
              next.delete(userId);
            }
            return next;
          });
          queryClient.invalidateQueries({ queryKey: ["/api/messages/online-users"] });
        });
      }
    } else {
      if (socket) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        socket.disconnect();
        setSocket(null);
        setTypingUsers(new Map());
      }
    }
  }, [view, currentUserId, currentUserRole, currentUserName]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (socket && activeConversation) {
      socket.emit("join-conversation", activeConversation.id);
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        socket.emit("stop-typing", {
          conversationId: activeConversation.id,
          userId: currentUserId
        });
        socket.emit("leave-conversation", activeConversation.id);
      };
    }
  }, [socket, activeConversation?.id]);

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

  const handleSend = async () => {
    if (!input.trim() || !activeConversation) return;
    const content = input.trim();
    setInput("");

    if (socket) {
      socket.emit("send-message", {
        conversationId: activeConversation.id,
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        content,
        messageType: "text"
      });
    } else {
      await sendMessageMutation.mutateAsync(content);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (socket && activeConversation) {
      socket.emit("typing", {
        conversationId: activeConversation.id,
        userId: currentUserId,
        userName: currentUserName
      });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          conversationId: activeConversation.id,
          userId: currentUserId
        });
      }, 2000);
    }
  };

  const unreadCount = conversations.reduce((count, conv) => {
    const myParticipant = conv.participants.find(p => p.userId === currentUserId || p.role === currentUserRole);
    if (!myParticipant || !conv.lastMessage) return count;
    const lastRead = myParticipant.lastReadAt ? new Date(myParticipant.lastReadAt) : new Date(0);
    const lastMsgTime = new Date(conv.lastMessage.createdAt);
    if (conv.lastMessage.senderId !== currentUserId && lastMsgTime > lastRead) {
      return count + 1;
    }
    return count;
  }, 0);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  const filteredUsers = availableUsers.filter(
    (u) => u.role !== currentUserRole && u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-500/20 text-red-400 border-red-500/30",
      owner: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "project-manager": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "crew-lead": "bg-green-500/20 text-green-400 border-green-500/30",
      developer: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    };
    return colors[role] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <>
      <AnimatePresence>
        {view === "minimized" && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setView("list")}
            className="fixed bottom-[54px] left-[18px] z-[60] group"
            data-testid="button-messaging-open"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.div>
              )}
            </div>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Team Chat
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {view !== "minimized" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[54px] left-[18px] z-[60] w-[360px] max-w-[calc(100vw-36px)] h-[500px] max-h-[calc(100vh-100px)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col overflow-hidden"
            data-testid="panel-messaging"
          >
            {view === "list" && (
              <>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setView("new")}
                      data-testid="button-new-conversation"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setView("minimized")}
                      data-testid="button-messaging-close"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {loadingConvos ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No conversations yet</p>
                      <Button variant="link" size="sm" onClick={() => setView("new")}>
                        Start a new chat
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {conversations.map((conv) => {
                        const otherParticipant = conv.participants.find(
                          (p) => p.userId !== currentUserId && p.role !== currentUserRole
                        );
                        return (
                          <motion.button
                            key={conv.id}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            onClick={() => {
                              setActiveConversation(conv);
                              setView("chat");
                            }}
                            className="w-full p-3 text-left hover-elevate"
                            data-testid={`conversation-${conv.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shrink-0">
                                {(otherParticipant?.displayName || conv.name)[0].toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white truncate">
                                    {otherParticipant?.displayName || conv.name}
                                  </span>
                                  {conv.lastMessage && (
                                    <span className="text-xs text-gray-500 shrink-0">
                                      {formatTime(conv.lastMessage.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {otherParticipant && (
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor(otherParticipant.role)}`}>
                                      {otherParticipant.role}
                                    </Badge>
                                  )}
                                  {conv.lastMessage && (
                                    <p className="text-sm text-gray-500 truncate">
                                      {conv.lastMessage.content}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </>
            )}

            {view === "new" && (
              <>
                <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
                  <Button size="icon" variant="ghost" onClick={() => setView("list")}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New Conversation</h2>
                </div>

                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-users"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <Users className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No team members found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredUsers.map((user) => {
                        const onlineData = onlineUsers.find(u => u.userId === user.id || u.role === user.role);
                        const isOnline = onlineData?.alwaysAvailable || onlineUserIds.has(user.id) || onlineUserIds.has(user.role);
                        return (
                          <motion.button
                            key={user.role}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            onClick={() => createConversationMutation.mutate(user)}
                            disabled={createConversationMutation.isPending}
                            className="w-full p-3 text-left hover-elevate flex items-center gap-3"
                            data-testid={`user-${user.role}`}
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                                {user.displayName[0].toUpperCase()}
                              </div>
                              {isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {user.displayName}
                                </span>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor(user.role)}`}>
                                  {user.role}
                                </Badge>
                              </div>
                              {isOnline && (
                                <span className="text-xs text-green-500">Available</span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </>
            )}

            {view === "chat" && activeConversation && (
              <>
                <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
                  <Button size="icon" variant="ghost" onClick={() => { setView("list"); setActiveConversation(null); }}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                      {activeConversation.participants.find(
                        (p) => p.userId !== currentUserId && p.role !== currentUserRole
                      )?.displayName || activeConversation.name}
                    </h2>
                    {typingUsers.size > 0 && (
                      <p className="text-xs text-blue-500 animate-pulse">
                        {Array.from(typingUsers.values()).join(", ")} typing...
                      </p>
                    )}
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setView("minimized")}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-3">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => {
                        const isOwn = msg.senderId === currentUserId || msg.senderRole === currentUserRole;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? "bg-blue-500 text-white rounded-br-sm"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                              }`}
                            >
                              {!isOwn && (
                                <p className="text-[10px] font-medium opacity-70 mb-0.5">
                                  {msg.senderName}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                                <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                                {isOwn && (
                                  msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleListening}
                      className={isListening ? "bg-red-500 text-white hover:bg-red-600" : ""}
                      data-testid="button-mic"
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder={isListening ? "Listening..." : "Type a message..."}
                      className="flex-1"
                      data-testid="input-message"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      data-testid="button-send"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
