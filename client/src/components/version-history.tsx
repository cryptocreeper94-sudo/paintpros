import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, ExternalLink, Hash, Calendar, Shield, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface ReleaseVersion {
  id: string;
  tenantId: string;
  version: string;
  buildNumber: number;
  hallmarkId: string | null;
  contentHash: string;
  solanaTxSignature: string | null;
  solanaTxStatus: string | null;
  deploymentId: string | null;
  releaseNotes: string | null;
  issuedAt: string;
  createdAt: string;
}

interface VersionHistoryProps {
  showAllTenants?: boolean;
  maxItems?: number;
}

export function VersionHistory({ showAllTenants = false, maxItems = 20 }: VersionHistoryProps) {
  const tenant = useTenant();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTenant, setFilterTenant] = useState<string | null>(null);

  const tenantId = showAllTenants ? filterTenant : tenant.id;

  const { data: releases = [], isLoading } = useQuery<ReleaseVersion[]>({
    queryKey: ["/api/releases", tenantId, maxItems],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (tenantId) params.set("tenantId", tenantId);
      params.set("limit", maxItems.toString());
      const url = `/api/releases?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch releases");
      return res.json();
    },
  });

  const filteredReleases = releases.filter((release) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      release.version.toLowerCase().includes(query) ||
      release.contentHash.toLowerCase().includes(query) ||
      release.solanaTxSignature?.toLowerCase().includes(query) ||
      release.releaseNotes?.toLowerCase().includes(query) ||
      release.tenantId.toLowerCase().includes(query)
    );
  });

  const tenantNames: Record<string, string> = {
    orbit: "ORBIT Platform",
    npp: "Nashville Painting Professionals",
    demo: "PaintPros.io Platform",
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Version History
        </h3>
        <div className="flex items-center gap-2">
          {showAllTenants && (
            <select
              value={filterTenant || ""}
              onChange={(e) => setFilterTenant(e.target.value || null)}
              className="px-3 py-1.5 rounded-lg bg-background/50 border border-border/50 text-sm"
              data-testid="select-tenant-filter"
            >
              <option value="">All Tenants</option>
              <option value="orbit">ORBIT</option>
              <option value="npp">NPP</option>
              <option value="demo">Demo</option>
            </select>
          )}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search versions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-48"
              data-testid="input-search-versions"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading versions...</div>
      ) : filteredReleases.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No versions found</div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {filteredReleases.map((release) => (
            <AccordionItem
              key={release.id}
              value={release.id}
              className="border border-border/30 rounded-lg px-3 bg-background/30"
            >
              <AccordionTrigger className="hover:no-underline py-3" data-testid={`accordion-release-${release.id}`}>
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">v{release.version}</span>
                    <span className="text-xs text-muted-foreground">Build #{release.buildNumber}</span>
                    {showAllTenants && (
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                        {release.tenantId.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {release.solanaTxStatus === "confirmed" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(release.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-3 text-sm">
                  {showAllTenants && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground w-24">Tenant:</span>
                      <span className="font-medium">{tenantNames[release.tenantId] || release.tenantId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-20">Hash:</span>
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono break-all">
                      {release.contentHash}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground w-20">Deployed:</span>
                    <span>{format(new Date(release.createdAt), "PPpp")}</span>
                  </div>
                  {release.solanaTxSignature && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground w-20">Solana TX:</span>
                      <a
                        href={`https://explorer.solana.com/tx/${release.solanaTxSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-xs font-mono"
                        data-testid={`link-solana-tx-${release.id}`}
                      >
                        {release.solanaTxSignature.slice(0, 20)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {release.releaseNotes && (
                    <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                      <span className="text-muted-foreground">Notes:</span> {release.releaseNotes}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </GlassCard>
  );
}
