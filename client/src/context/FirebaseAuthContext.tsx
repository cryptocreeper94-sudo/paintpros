// Firebase Authentication Context for PaintPros.io
// Provides auth state management alongside existing PIN system

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthChange, handleRedirectResult, type User } from "@/lib/firebase";

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on page load
    handleRedirectResult().then((redirectUser) => {
      if (redirectUser) {
        setUser(redirectUser);
      }
    });

    // Listen for auth state changes
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}
