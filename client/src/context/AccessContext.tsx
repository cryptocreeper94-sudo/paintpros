import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";

export type UserRole = "admin" | "owner" | "project_manager" | "developer" | "demo_viewer" | "crew_lead" | "ops_manager" | null;
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
  admin: { accessMode: "live", userName: "Admin", canViewSalesData: true },
  ops_manager: { accessMode: "live", userName: "Admin", canViewSalesData: true },
  owner: { accessMode: "live", userName: "Owner", canViewSalesData: false },
  project_manager: { accessMode: "view_only", userName: "Project Manager", canViewSalesData: false },
  developer: { accessMode: "live", userName: "Developer", canViewSalesData: true },
  demo_viewer: { accessMode: "view_only", userName: "Demo Viewer", canViewSalesData: true },
  crew_lead: { accessMode: "view_only", userName: "Crew Lead", canViewSalesData: false },
};

const defaultUser: UserAccess = {
  role: null,
  userName: null,
  accessMode: "view_only",
  isAuthenticated: false,
  canViewSalesData: false,
};

const STORAGE_KEY = "paintpros_auth";

function loadStoredAuth(): UserAccess {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role && ACCESS_CONFIG[parsed.role as Exclude<UserRole, null>]) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
  return defaultUser;
}

const AccessContext = createContext<AccessContextType | null>(null);

interface AccessProviderProps {
  children: ReactNode;
}

export function AccessProvider({ children }: AccessProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserAccess>(() => loadStoredAuth());

  const login = useCallback((role: UserRole, userName?: string) => {
    if (!role) {
      setCurrentUser(defaultUser);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const config = ACCESS_CONFIG[role];
    const newUser = {
      role,
      userName: userName || config.userName,
      accessMode: config.accessMode,
      isAuthenticated: true,
      canViewSalesData: config.canViewSalesData,
    };
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(defaultUser);
    localStorage.removeItem(STORAGE_KEY);
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
