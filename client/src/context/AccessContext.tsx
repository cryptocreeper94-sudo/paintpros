import { createContext, useContext, ReactNode, useState, useCallback } from "react";

export type UserRole = "admin" | "owner" | "project_manager" | "developer" | null;
export type AccessMode = "live" | "view_only";

export interface UserAccess {
  role: UserRole;
  userName: string | null;
  accessMode: AccessMode;
  isAuthenticated: boolean;
  canViewSalesData: boolean;
}

interface AccessContextType {
  currentUser: UserAccess;
  login: (role: UserRole, userName?: string) => void;
  logout: () => void;
  canEdit: () => boolean;
  canViewFinancials: () => boolean;
  canManageLeads: () => boolean;
  canManageSEO: () => boolean;
  canAccessDevTools: () => boolean;
  canViewSalesData: () => boolean;
}

const ACCESS_CONFIG: Record<Exclude<UserRole, null>, { accessMode: AccessMode; userName: string; canViewSalesData: boolean }> = {
  admin: { accessMode: "live", userName: "Sidonie", canViewSalesData: true },
  owner: { accessMode: "live", userName: "Ryan", canViewSalesData: false },
  project_manager: { accessMode: "view_only", userName: "Project Manager", canViewSalesData: false },
  developer: { accessMode: "live", userName: "Developer", canViewSalesData: true },
};

const defaultUser: UserAccess = {
  role: null,
  userName: null,
  accessMode: "view_only",
  isAuthenticated: false,
  canViewSalesData: false,
};

const AccessContext = createContext<AccessContextType | null>(null);

interface AccessProviderProps {
  children: ReactNode;
}

export function AccessProvider({ children }: AccessProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserAccess>(defaultUser);

  const login = useCallback((role: UserRole, userName?: string) => {
    if (!role) {
      setCurrentUser(defaultUser);
      return;
    }

    const config = ACCESS_CONFIG[role];
    setCurrentUser({
      role,
      userName: userName || config.userName,
      accessMode: config.accessMode,
      isAuthenticated: true,
      canViewSalesData: config.canViewSalesData,
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(defaultUser);
  }, []);

  const canEdit = useCallback(() => {
    return currentUser.accessMode === "live" && currentUser.isAuthenticated;
  }, [currentUser]);

  const canViewFinancials = useCallback(() => {
    return currentUser.isAuthenticated && 
      (currentUser.role === "owner" || currentUser.role === "developer");
  }, [currentUser]);

  const canManageLeads = useCallback(() => {
    return currentUser.isAuthenticated && 
      (currentUser.role === "admin" || currentUser.role === "developer");
  }, [currentUser]);

  const canManageSEO = useCallback(() => {
    return currentUser.accessMode === "live" && 
      (currentUser.role === "owner" || currentUser.role === "developer");
  }, [currentUser]);

  const canAccessDevTools = useCallback(() => {
    return currentUser.isAuthenticated && currentUser.role === "developer";
  }, [currentUser]);

  const canViewSalesData = useCallback(() => {
    return currentUser.isAuthenticated && currentUser.canViewSalesData;
  }, [currentUser]);

  return (
    <AccessContext.Provider value={{
      currentUser,
      login,
      logout,
      canEdit,
      canViewFinancials,
      canManageLeads,
      canManageSEO,
      canAccessDevTools,
      canViewSalesData,
    }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess(): AccessContextType {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error("useAccess must be used within an AccessProvider");
  }
  return context;
}

export function useAccessOptional(): AccessContextType | null {
  return useContext(AccessContext);
}
