import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tenant {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const TENANTS: Tenant[] = [
  {
    id: "npp",
    name: "Nashville Painting Professionals",
    shortName: "NPP",
    color: "text-[#4a5d23]",
    bgColor: "bg-[#4a5d23]/10",
    borderColor: "border-[#4a5d23]/30",
  },
  {
    id: "lumepaint",
    name: "Lume Paint Co",
    shortName: "Lume",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-600/30",
  },
];

interface TenantSwitcherProps {
  selectedTenant: string;
  onTenantChange: (tenantId: string) => void;
  className?: string;
}

export function TenantSwitcher({ selectedTenant, onTenantChange, className }: TenantSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-2 p-2 bg-card/50 rounded-lg border", className)}>
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground mr-2">Viewing:</span>
      {TENANTS.map((tenant) => (
        <Button
          key={tenant.id}
          variant={selectedTenant === tenant.id ? "default" : "outline"}
          size="sm"
          onClick={() => onTenantChange(tenant.id)}
          className={cn(
            "relative min-w-[80px]",
            selectedTenant === tenant.id && tenant.id === "npp" && "bg-[#4a5d23] hover:bg-[#3d4d1c]",
            selectedTenant === tenant.id && tenant.id === "lumepaint" && "bg-purple-600 hover:bg-purple-700"
          )}
          data-testid={`tenant-switch-${tenant.id}`}
        >
          {selectedTenant === tenant.id && (
            <Check className="h-3 w-3 mr-1" />
          )}
          {tenant.shortName}
        </Button>
      ))}
    </div>
  );
}

export function useTenantFilter() {
  const [selectedTenant, setSelectedTenant] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dashboard_tenant') || 'npp';
    }
    return 'npp';
  });

  useEffect(() => {
    localStorage.setItem('dashboard_tenant', selectedTenant);
  }, [selectedTenant]);

  return {
    selectedTenant,
    setSelectedTenant,
    tenantLabel: TENANTS.find(t => t.id === selectedTenant)?.name || 'All Tenants',
  };
}

export { TENANTS };
