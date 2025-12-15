import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Users, HardHat, Clock, AlertTriangle, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import type { CrewLead } from "@shared/schema";
import { useTenant } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function CrewManagementCard() {
  const tenant = useTenant();

  const { data: crewLeads = [], isLoading: leadsLoading, isError: leadsError } = useQuery<CrewLead[]>({
    queryKey: ["/api/crew/leads", tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/crew/leads?tenantId=${tenant.id}`);
      if (!res.ok) throw new Error("Failed to fetch crew leads");
      return res.json();
    },
    retry: 1,
  });

  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery<{
    totalMembers: number;
    pendingTimeEntries: number;
    openIncidents: number;
  }>({
    queryKey: ["/api/crew/stats", tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/crew/stats?tenantId=${tenant.id}`);
      if (!res.ok) {
        return { totalMembers: 0, pendingTimeEntries: 0, openIncidents: 0 };
      }
      return res.json();
    },
    retry: 1,
  });

  const isLoading = leadsLoading || statsLoading;
  const hasError = leadsError || statsError;
  const activeLeads = crewLeads.filter(lead => lead.isActive);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-accent/20 flex items-center justify-center">
            <HardHat className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold" data-testid="text-crew-title">Crew Management</h2>
            <p className="text-xs text-muted-foreground" data-testid="text-crew-count">{activeLeads.length} active leads</p>
          </div>
        </div>
        <Link href="/crew-lead">
          <Button size="sm" variant="outline" data-testid="button-view-crew-dashboard">
            <ExternalLink className="w-3 h-3 mr-1" />
            Portal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
          <Users className="w-4 h-4 mx-auto mb-1 text-blue-400" />
          <p className="text-lg font-bold text-blue-400" data-testid="text-total-members">{stats?.totalMembers || 0}</p>
          <p className="text-[10px] text-muted-foreground">Members</p>
        </div>
        <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
          <p className="text-lg font-bold text-yellow-400" data-testid="text-pending-entries">{stats?.pendingTimeEntries || 0}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </div>
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
          <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-red-400" />
          <p className="text-lg font-bold text-red-400" data-testid="text-open-incidents">{stats?.openIncidents || 0}</p>
          <p className="text-[10px] text-muted-foreground">Incidents</p>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1" data-testid="crew-leads-list">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : hasError ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-400/50" />
            <p className="text-sm text-muted-foreground">Unable to load crew data</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Please try again later</p>
          </div>
        ) : activeLeads.length === 0 ? (
          <div className="text-center py-8">
            <HardHat className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No crew leads yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add crew leads to manage your teams</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {activeLeads.slice(0, 5).map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                data-testid={`crew-lead-row-${lead.id}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <HardHat className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate" data-testid={`text-lead-name-${lead.id}`}>
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.phone || lead.email || "No contact"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {lead.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
