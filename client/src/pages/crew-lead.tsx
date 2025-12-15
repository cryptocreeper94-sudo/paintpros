import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  HardHat, Users, Clock, FileText, AlertTriangle, Camera, CheckCircle, 
  Plus, Calendar, ArrowRight, Send, Trash2, Edit, User
} from "lucide-react";
import { hover3D, hover3DSubtle, cardVariants, staggerContainer, iconContainerStyles, cardBackgroundStyles } from "@/lib/theme-effects";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CrewLead, CrewMember, TimeEntry, JobNote, IncidentReport } from "@shared/schema";
import { format } from "date-fns";
import { useTenant } from "@/context/TenantContext";
import { Textarea } from "@/components/ui/textarea";
import { MessagingWidget } from "@/components/messaging-widget";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const DEFAULT_PIN = "3333";

export default function CrewLeadDashboard() {
  const tenant = useTenant();
  const isDemo = tenant.id === "demo";
  const [isAuthenticated, setIsAuthenticated] = useState(isDemo);
  const [currentLead, setCurrentLead] = useState<CrewLead | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "time" | "notes" | "incidents">("overview");
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("/api/crew/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, tenantId: tenant.id }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid PIN");
        setPin("");
        return;
      }
      
      const crewLead = await res.json();
      setCurrentLead(crewLead);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Login failed. Please try again.");
      setPin("");
    }
  };

  const { data: crewMembers = [], isLoading: membersLoading } = useQuery<CrewMember[]>({
    queryKey: ["/api/crew/leads", currentLead?.id, "members"],
    queryFn: async () => {
      if (!currentLead?.id) return [];
      const res = await fetch(`/api/crew/leads/${currentLead.id}/members`);
      if (!res.ok) throw new Error("Failed to fetch crew members");
      return res.json();
    },
    enabled: isAuthenticated && !!currentLead?.id,
  });

  const { data: timeEntries = [], isLoading: timeLoading } = useQuery<TimeEntry[]>({
    queryKey: ["/api/crew/time-entries", currentLead?.id],
    queryFn: async () => {
      if (!currentLead?.id) return [];
      const res = await fetch(`/api/crew/time-entries?crewLeadId=${currentLead.id}`);
      if (!res.ok) throw new Error("Failed to fetch time entries");
      return res.json();
    },
    enabled: isAuthenticated && !!currentLead?.id,
  });

  const { data: jobNotes = [], isLoading: notesLoading } = useQuery<JobNote[]>({
    queryKey: ["/api/crew/job-notes", currentLead?.id],
    queryFn: async () => {
      if (!currentLead?.id) return [];
      const res = await fetch(`/api/crew/job-notes?crewLeadId=${currentLead.id}`);
      if (!res.ok) throw new Error("Failed to fetch job notes");
      return res.json();
    },
    enabled: isAuthenticated && !!currentLead?.id,
  });

  const { data: incidentReports = [], isLoading: incidentsLoading } = useQuery<IncidentReport[]>({
    queryKey: ["/api/crew/incident-reports", currentLead?.id],
    queryFn: async () => {
      if (!currentLead?.id) return [];
      const res = await fetch(`/api/crew/incident-reports?crewLeadId=${currentLead.id}`);
      if (!res.ok) throw new Error("Failed to fetch incident reports");
      return res.json();
    },
    enabled: isAuthenticated && !!currentLead?.id,
  });

  const activeMembers = crewMembers.filter(m => m.isActive);
  const pendingTimeEntries = timeEntries.filter(e => e.status === "pending");
  const unresolvedIncidents = incidentReports.filter(r => r.status !== "resolved");
  const todayHours = timeEntries
    .filter(e => {
      const entryDate = new Date(e.date);
      const today = new Date();
      return entryDate.toDateString() === today.toDateString();
    })
    .reduce((sum, e) => sum + parseFloat(e.hoursWorked || "0"), 0);

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <main className="pt-24 px-4 md:px-8 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-orange-500/20 blur-3xl opacity-40" />
              <GlassCard className="relative p-10 border-accent/20" glow>
                <div className="text-center mb-8">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/30 to-orange-500/20 flex items-center justify-center border border-accent/30 shadow-lg shadow-accent/20"
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    transition={{ type: "spring" }}
                  >
                    <HardHat className="w-10 h-10 text-accent" />
                  </motion.div>
                  <h1 className="text-3xl font-display font-bold mb-2">Crew Lead Portal</h1>
                  <p className="text-muted-foreground">Enter your PIN to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="text-center text-2xl tracking-widest bg-white/5 border-white/20 focus:border-accent/50"
                    data-testid="input-crew-pin"
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="button-crew-login"
                    disabled={pin.length !== 4}
                  >
                    Access Dashboard
                  </Button>
                </form>
              </GlassCard>
            </div>
          </motion.div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="pt-20 pb-24 px-4 md:px-8 min-h-screen">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={cardVariants} custom={0} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  Welcome, {currentLead?.firstName || "Crew Lead"}
                </h1>
                <p className="text-muted-foreground">
                  Manage your crew, track time, and report job progress
                </p>
              </div>
              <div className="flex gap-2">
                {["overview", "time", "notes", "incidents"].map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    data-testid={`button-tab-${tab}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {activeTab === "overview" && (
            <BentoGrid>
              <BentoItem colSpan={1}>
                <motion.div variants={cardVariants} custom={1} whileHover={hover3DSubtle}>
                  <GlassCard className={`h-full p-6 ${cardBackgroundStyles.accent}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.lg} ${iconContainerStyles.gradients.accent}`}>
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {activeMembers.length} Active
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">My Crew</h3>
                    <p className="text-3xl font-bold text-accent">{crewMembers.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Team members</p>
                  </GlassCard>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={1}>
                <motion.div variants={cardVariants} custom={2} whileHover={hover3DSubtle}>
                  <GlassCard className={`h-full p-6 ${cardBackgroundStyles.blue}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.lg} ${iconContainerStyles.gradients.blue}`}>
                        <Clock className="w-6 h-6 text-blue-400" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Today
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Hours Today</h3>
                    <p className="text-3xl font-bold text-blue-400">{todayHours.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Logged hours</p>
                  </GlassCard>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={1}>
                <motion.div variants={cardVariants} custom={3} whileHover={hover3DSubtle}>
                  <GlassCard className={`h-full p-6 ${cardBackgroundStyles.green}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.lg} ${iconContainerStyles.gradients.green}`}>
                        <FileText className="w-6 h-6 text-green-400" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Pending
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Time Entries</h3>
                    <p className="text-3xl font-bold text-green-400">{pendingTimeEntries.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Awaiting approval</p>
                  </GlassCard>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={1}>
                <motion.div variants={cardVariants} custom={4} whileHover={hover3DSubtle}>
                  <GlassCard className={`h-full p-6 ${cardBackgroundStyles.yellow}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${iconContainerStyles.base} ${iconContainerStyles.sizes.lg} ${iconContainerStyles.gradients.yellow}`}>
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                      </div>
                      {unresolvedIncidents.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Action Needed
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Incidents</h3>
                    <p className="text-3xl font-bold text-yellow-400">{unresolvedIncidents.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Open reports</p>
                  </GlassCard>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={2} rowSpan={2}>
                <motion.div variants={cardVariants} custom={5} whileHover={hover3DSubtle}>
                  <GlassCard className="h-full p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Crew Members</h3>
                      <Button size="sm" variant="outline" data-testid="button-add-member">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {membersLoading ? (
                        <p className="text-muted-foreground">Loading...</p>
                      ) : activeMembers.length === 0 ? (
                        <p className="text-muted-foreground">No crew members yet</p>
                      ) : (
                        activeMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-accent" />
                              </div>
                              <div>
                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                <p className="text-sm text-muted-foreground">{member.role || "Crew Member"}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">${member.hourlyRate || "0.00"}/hr</p>
                              {member.phone && (
                                <p className="text-xs text-muted-foreground">{member.phone}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              </BentoItem>

              <BentoItem colSpan={2}>
                <motion.div variants={cardVariants} custom={6} whileHover={hover3DSubtle}>
                  <GlassCard className="h-full p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("time")}
                        data-testid="button-quick-time"
                      >
                        <Clock className="w-6 h-6 text-blue-400" />
                        <span>Log Time</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("notes")}
                        data-testid="button-quick-note"
                      >
                        <FileText className="w-6 h-6 text-green-400" />
                        <span>Add Note</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("incidents")}
                        data-testid="button-quick-incident"
                      >
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        <span>Report Incident</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        data-testid="button-quick-photo"
                      >
                        <Camera className="w-6 h-6 text-purple-400" />
                        <span>Take Photo</span>
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              </BentoItem>
            </BentoGrid>
          )}

          {activeTab === "time" && (
            <TimeEntriesPanel 
              crewLeadId={currentLead?.id || ""} 
              crewMembers={crewMembers}
              timeEntries={timeEntries}
              isLoading={timeLoading}
            />
          )}

          {activeTab === "notes" && (
            <JobNotesPanel 
              crewLeadId={currentLead?.id || ""} 
              jobNotes={jobNotes}
              isLoading={notesLoading}
            />
          )}

          {activeTab === "incidents" && (
            <IncidentsPanel 
              crewLeadId={currentLead?.id || ""} 
              tenantId={tenant.id}
              incidents={incidentReports}
              isLoading={incidentsLoading}
            />
          )}
        </motion.div>
      </main>
      
      <MessagingWidget 
        currentUserId={currentLead?.id || "crew-lead"}
        currentUserRole="crew-lead"
        currentUserName={currentLead?.name || "Crew Lead"}
      />
    </PageLayout>
  );
}

function TimeEntriesPanel({ 
  crewLeadId, 
  crewMembers,
  timeEntries,
  isLoading 
}: { 
  crewLeadId: string;
  crewMembers: CrewMember[];
  timeEntries: TimeEntry[];
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState("");
  const [workDate, setWorkDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [hoursWorked, setHoursWorked] = useState("");
  const [description, setDescription] = useState("");

  const createEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/crew/time-entries", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crew/time-entries"] });
      setSelectedMember("");
      setHoursWorked("");
      setDescription("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !hoursWorked) return;
    
    createEntryMutation.mutate({
      leadId: crewLeadId,
      crewMemberId: selectedMember,
      date: new Date(workDate),
      hoursWorked: parseFloat(hoursWorked),
      notes: description,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div variants={cardVariants} custom={1}>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Log Time Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Team Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger data-testid="select-member">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {crewMembers.filter(m => m.isActive).map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                <Input
                  type="date"
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                  data-testid="input-work-date"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Hours</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  placeholder="8.0"
                  value={hoursWorked}
                  onChange={(e) => setHoursWorked(e.target.value)}
                  data-testid="input-hours"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Description</label>
              <Textarea
                placeholder="Work description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-time-description"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!selectedMember || !hoursWorked || createEntryMutation.isPending}
              data-testid="button-submit-time"
            >
              {createEntryMutation.isPending ? "Saving..." : "Log Time Entry"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>

      <motion.div variants={cardVariants} custom={2}>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Entries</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : timeEntries.length === 0 ? (
              <p className="text-muted-foreground">No time entries yet</p>
            ) : (
              timeEntries.slice(0, 10).map((entry) => {
                const member = crewMembers.find(m => m.id === entry.crewMemberId);
                return (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {member ? `${member.firstName} ${member.lastName}` : "Unknown"}
                      </span>
                      <Badge 
                        variant={
                          entry.status === "approved" ? "default" : 
                          entry.status === "submitted" ? "secondary" : "outline"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
                      <span className="font-semibold text-foreground">{entry.hoursWorked}h</span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function JobNotesPanel({ 
  crewLeadId, 
  jobNotes,
  isLoading 
}: { 
  crewLeadId: string;
  jobNotes: JobNote[];
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createNoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/crew/job-notes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crew/job-notes"] });
      setTitle("");
      setContent("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    createNoteMutation.mutate({
      leadId: crewLeadId,
      title,
      content,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div variants={cardVariants} custom={1}>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Add Job Note</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Title</label>
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-testid="input-note-title"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Details</label>
              <Textarea
                placeholder="Describe the update..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                data-testid="input-note-content"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!title || !content || createNoteMutation.isPending}
              data-testid="button-submit-note"
            >
              {createNoteMutation.isPending ? "Saving..." : "Save Note"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>

      <motion.div variants={cardVariants} custom={2}>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Notes</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : jobNotes.length === 0 ? (
              <p className="text-muted-foreground">No job notes yet</p>
            ) : (
              jobNotes.slice(0, 10).map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{note.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}</span>
                    {(note.sentToOwner || note.sentToAdmin) && (
                      <Badge variant="secondary" className="text-xs">
                        <Send className="w-3 h-3 mr-1" />
                        Sent
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function IncidentsPanel({ 
  crewLeadId, 
  tenantId,
  incidents,
  isLoading 
}: { 
  crewLeadId: string;
  tenantId: string;
  incidents: IncidentReport[];
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();
  const [incidentType, setIncidentType] = useState("safety");
  const [severity, setSeverity] = useState("low");
  const [description, setDescription] = useState("");
  const [jobAddress, setJobAddress] = useState("");

  const createIncidentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/crew/incident-reports", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crew/incident-reports"] });
      setDescription("");
      setJobAddress("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    
    createIncidentMutation.mutate({
      leadId: crewLeadId,
      tenantId,
      incidentType,
      severity,
      description,
      jobAddress,
      incidentDate: new Date(),
    });
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "text-red-400";
      case "high": return "text-orange-400";
      case "medium": return "text-yellow-400";
      default: return "text-green-400";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div variants={cardVariants} custom={1}>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Report Incident</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                <Select value={incidentType} onValueChange={setIncidentType}>
                  <SelectTrigger data-testid="select-incident-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="damage">Property Damage</SelectItem>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="equipment">Equipment Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Severity</label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger data-testid="select-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Job Address</label>
              <Input
                placeholder="Where did it happen?"
                value={jobAddress}
                onChange={(e) => setJobAddress(e.target.value)}
                data-testid="input-incident-location"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Description</label>
              <Textarea
                placeholder="Describe what happened..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-incident-description"
              />
            </div>
            <Button 
              type="submit" 
              variant="destructive"
              className="w-full"
              disabled={!description || createIncidentMutation.isPending}
              data-testid="button-submit-incident"
            >
              {createIncidentMutation.isPending ? "Submitting..." : "Submit Incident Report"}
            </Button>
          </form>
        </GlassCard>
      </motion.div>

      <motion.div variants={cardVariants} custom={2}>
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold mb-4">Incident History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : incidents.length === 0 ? (
              <p className="text-muted-foreground">No incident reports</p>
            ) : (
              incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(incident.severity || "low")}`} />
                      <span className="font-medium capitalize">{incident.incidentType}</span>
                    </div>
                    <Badge 
                      variant={incident.status === "resolved" ? "default" : "destructive"}
                    >
                      {incident.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{incident.description}</p>
                  {incident.jobAddress && (
                    <p className="text-xs text-muted-foreground mt-1">Location: {incident.jobAddress}</p>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {format(new Date(incident.incidentDate), "MMM d, yyyy h:mm a")}
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
