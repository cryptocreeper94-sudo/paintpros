import { createContext, useContext, ReactNode } from "react";
import { TenantConfig, getCurrentTenant } from "@/config/tenant";

const TenantContext = createContext<TenantConfig | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  tenant?: TenantConfig;
}

export function TenantProvider({ children, tenant }: TenantProviderProps) {
  const currentTenant = tenant || getCurrentTenant();
  
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
