import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";
import { 
  Calendar, CheckCircle2, RefreshCw, Trash2, ExternalLink, 
  Clock, Loader2, Link2, Link2Off
} from "lucide-react";
import { SiGoogle } from "react-icons/si";

interface CalendarConnection {
  id: string;
  googleEmail: string;
  calendarId: string;
  syncBookings: boolean;
  syncJobs: boolean;
  lastSynced: string | null;
  isActive: boolean;
  createdAt: string;
}

export function GoogleCalendarConnect() {
  const tenant = useTenant();
  const [justConnected, setJustConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gcal_connected") === "true") {
      const email = params.get("email");
      toast.success(`Google Calendar connected: ${email}`);
      setJustConnected(true);
      window.history.replaceState({}, "", window.location.pathname);
      queryClient.invalidateQueries({ queryKey: ["/api/google-calendar/connections", tenant.id] });
    }
  }, [tenant.id]);

  const { data: connections = [], isLoading } = useQuery<CalendarConnection[]>({
    queryKey: ["/api/google-calendar/connections", tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/google-calendar/connections?tenantId=${tenant.id}`);
      return res.json();
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      await apiRequest("DELETE", `/api/google-calendar/connections/${connectionId}`);
    },
    onSuccess: () => {
      toast.success("Calendar disconnected");
      queryClient.invalidateQueries({ queryKey: ["/api/google-calendar/connections", tenant.id] });
    },
    onError: () => {
      toast.error("Failed to disconnect calendar");
    }
  });

  const syncMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const res = await apiRequest("POST", "/api/google-calendar/sync", {
        connectionId,
        tenantId: tenant.id
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast.success(`Synced ${data.synced} of ${data.total} bookings`);
      queryClient.invalidateQueries({ queryKey: ["/api/google-calendar/connections", tenant.id] });
    },
    onError: () => {
      toast.error("Sync failed");
    }
  });

  const handleConnect = () => {
    window.location.href = `/api/google-calendar/auth?tenantId=${tenant.id}`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <GlassCard className="p-6" glow="accent">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Google Calendar</h3>
            <p className="text-sm text-muted-foreground">Sync bookings and jobs to your calendar</p>
          </div>
        </div>
        
        {connections.length === 0 && (
          <Button onClick={handleConnect} className="gap-2" data-testid="button-connect-gcal">
            <SiGoogle className="w-4 h-4" />
            Connect Calendar
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <Link2Off className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No calendar connected</p>
          <p className="text-xs text-muted-foreground mt-1">
            Connect your Google Calendar to automatically sync bookings and job schedules
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {connections.map((conn) => (
            <div 
              key={conn.id} 
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border gap-4 flex-wrap"
              data-testid={`calendar-connection-${conn.id}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-full bg-green-500/20">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{conn.googleEmail}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <Clock className="w-3 h-3" />
                    <span>Last synced: {formatDate(conn.lastSynced)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                {conn.syncBookings && (
                  <Badge variant="outline" className="text-xs">Bookings</Badge>
                )}
                {conn.syncJobs && (
                  <Badge variant="outline" className="text-xs">Jobs</Badge>
                )}
                
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => syncMutation.mutate(conn.id)}
                  disabled={syncMutation.isPending}
                  data-testid={`button-sync-${conn.id}`}
                >
                  <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => disconnectMutation.mutate(conn.id)}
                  disabled={disconnectMutation.isPending}
                  data-testid={`button-disconnect-${conn.id}`}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleConnect}
            className="w-full mt-2 gap-2"
            data-testid="button-add-another-calendar"
          >
            <Link2 className="w-4 h-4" />
            Add Another Calendar
          </Button>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Connecting your Google Calendar will automatically create events for confirmed bookings and scheduled jobs.
          Your calendar data stays private and is only used for sync purposes.
        </p>
      </div>
    </GlassCard>
  );
}
