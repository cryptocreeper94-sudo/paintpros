// Firebase Google Sign-In Button for PaintPros.io
// Works alongside existing PIN authentication system

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { signInWithGoogle, logOut } from "@/lib/firebase";
import { SiGoogle } from "react-icons/si";
import { Loader2, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FirebaseLoginButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showUserMenu?: boolean;
}

export function FirebaseLoginButton({
  variant = "outline",
  size = "default",
  className = "",
  showUserMenu = true,
}: FirebaseLoginButtonProps) {
  const { user, loading, isAuthenticated } = useFirebaseAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (isAuthenticated && user) {
    if (showUserMenu) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={className} data-testid="button-user-menu">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{user.displayName}</p>
              <p className="text-muted-foreground text-xs">{user.email}</p>
            </div>
            <DropdownMenuItem onClick={handleSignOut} data-testid="button-sign-out">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button variant={variant} size={size} onClick={handleSignOut} className={className} data-testid="button-sign-out">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignIn}
      disabled={isSigningIn}
      className={className}
      data-testid="button-google-sign-in"
    >
      {isSigningIn ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <SiGoogle className="w-4 h-4 mr-2" />
      )}
      Sign in with Google
    </Button>
  );
}
