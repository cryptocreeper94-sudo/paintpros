import { createContext, useContext, ReactNode, useState, useCallback } from "react";

export type UserRole = "admin" | "owner" | "area_manager" | "developer" | null;
export type AccessMode = "live" | "view_only";

export interface UserAccess {
  role: UserRole;
  userName: string | null;
  accessMode: AccessMode;
  isAuthenticated: boolean;
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
}

const ACCESS_CONFIG: Record<Exclude<UserRole, null>, { accessMode: AccessMode; userName: string }> = {
  admin: { accessMode: "live", userName: "Sidonie" },
  owner: { accessMode: "view_only", userName: "Ryan" },
  area_manager: { accessMode: "view_only", userName: "Area Manager" },
  developer: { accessMode: "live", userName: "Developer" },
};

const defaultUser: UserAccess = {
  role: null,
  userName: null,
  accessMode: "view_only",
  isAuthenticated: false,
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
