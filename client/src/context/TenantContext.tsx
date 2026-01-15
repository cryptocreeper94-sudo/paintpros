import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { TenantConfig, getCurrentTenant, getTenantById, getTenantIdFromHostname } from "@/config/tenant";

const TenantContext = createContext<TenantConfig | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  tenant?: TenantConfig;
}

export function TenantProvider({ children, tenant }: TenantProviderProps) {
  const [currentTenant, setCurrentTenant] = useState<TenantConfig>(
    tenant || getCurrentTenant()
  );
  const [isLoading, setIsLoading] = useState(!tenant);

  useEffect(() => {
    if (tenant) {
      setCurrentTenant(tenant);
      setIsLoading(false);
      return;
    }

    // Check for tenant override via query parameter (for preview/demo purposes)
    const urlParams = new URLSearchParams(window.location.search);
    const tenantOverride = urlParams.get('tenant');
    if (tenantOverride) {
      const tenantConfig = getTenantById(tenantOverride);
      setCurrentTenant(tenantConfig);
      setIsLoading(false);
      return;
    }

    async function fetchTenant() {
      try {
        const response = await fetch('/api/tenant');
        if (response.ok) {
          const data = await response.json();
          if (data.tenantId) {
            const tenantConfig = getTenantById(data.tenantId);
            setCurrentTenant(tenantConfig);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch tenant from API, using client-side detection');
        const tenantId = getTenantIdFromHostname(window.location.hostname);
        setCurrentTenant(getTenantById(tenantId));
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenant();
  }, [tenant]);

  if (isLoading) {
    return (
      <TenantContext.Provider value={currentTenant}>
        {children}
      </TenantContext.Provider>
    );
  }
  
  return (
    <TenantContext.Provider value={currentTenant}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantConfig {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

export function useTenantOptional(): TenantConfig | null {
  return useContext(TenantContext);
}
