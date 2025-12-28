import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Database, 
  CreditCard, 
  Mail, 
  Link2, 
  Sparkles, 
  ChevronDown,
  RefreshCw,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "error";
  message: string;
  responseTime?: number;
  lastError?: string;
}

interface SystemHealthResponse {
  status: "healthy" | "degraded" | "error";
  version: string;
  timestamp: string;
  responseTime: number;
  checks: HealthCheck[];
}

const serviceIcons: Record<string, typeof Activity> = {
  database: Database,
  payments: CreditCard,
  email: Mail,
  blockchain: Link2,
  ai: Sparkles
};

const statusColors: Record<string, string> = {
  healthy: "bg-green-500/20 text-green-400 border-green-500/30",
  degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusLabels: Record<string, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  error: "Error"
};

export function SystemHealthCard() {
  const [expanded, setExpanded] = useState(false);

  const { data: health, isLoading, isError, error, refetch, isFetching } = useQuery<SystemHealthResponse>({
    queryKey: ["/api/system/health"],
    refetchInterval: 60000,
    staleTime: 30000
  });

  const overallStatus = isError ? "error" : (health?.status || "healthy");
  const OverallIcon = Activity;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted/50 border border-border/50">
            <OverallIcon className="w-4 h-4 text-foreground" />
          </div>
          <h3 className="font-semibold text-sm">System Health</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => refetch()}
            disabled={isFetching}
            data-testid="button-refresh-health"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Badge 
            className={`${statusColors[overallStatus]} text-xs`}
            data-testid="badge-overall-status"
          >
            {isLoading ? "Checking..." : statusLabels[overallStatus]}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
          <p className="text-xs font-medium text-red-400 mb-1">Health Check Failed</p>
          <p className="text-xs text-red-300 mb-2">
            {error instanceof Error ? error.message : "Unable to reach health endpoint"}
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => refetch()}
            className="text-xs"
            data-testid="button-retry-health"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      ) : health ? (
        <>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {health.checks.map((check) => {
              const Icon = serviceIcons[check.name] || Activity;
              return (
                <div 
                  key={check.name}
                  className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/30"
                  title={check.message}
                  data-testid={`health-indicator-${check.name}`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === "healthy" ? "bg-green-500" :
                    check.status === "degraded" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <Icon className="w-3 h-3 text-muted-foreground" />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs text-muted-foreground hover-elevate rounded-md p-2"
            data-testid="button-expand-health-details"
          >
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {health.responseTime}ms response
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {health.checks.map((check) => {
                    const Icon = serviceIcons[check.name] || Activity;
                    return (
                      <div 
                        key={check.name}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/20"
                        data-testid={`health-detail-${check.name}`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs capitalize">{check.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {check.responseTime && (
                            <span className="text-xs text-muted-foreground">{check.responseTime}ms</span>
                          )}
                          <Badge className={`${statusColors[check.status]} text-xs`}>
                            {statusLabels[check.status]}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  {health.checks.some(c => c.lastError) && (
                    <div className="mt-2 p-2 rounded-md bg-red-500/10 border border-red-500/20">
                      <p className="text-xs font-medium text-red-400 mb-1">Recent Issues</p>
                      {health.checks.filter(c => c.lastError).map((check) => (
                        <p key={check.name} className="text-xs text-red-300">
                          {check.name}: {check.lastError}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    v{health.version} | Last checked: {new Date(health.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : null}
    </GlassCard>
  );
}
