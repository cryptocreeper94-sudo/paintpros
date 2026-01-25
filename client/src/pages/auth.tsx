import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/context/TenantContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Eye, EyeOff, Mail, Lock, User, Phone, Smartphone, BarChart3, Calendar, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import nppLogo from "@/assets/npp-logo.jpg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const tenant = useTenant();

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        toast({ title: "Added to home screen!", description: "You can now access this quickly from your device." });
      }
      setDeferredPrompt(null);
    }
  };

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      setLocation("/account");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data;
      const res = await apiRequest("POST", "/api/auth/register", registerData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Account created!",
        description: "Welcome! Your account has been created successfully.",
      });
      setLocation("/account");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branded Gradient Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">Marketing Hub Pro</h1>
            <p className="text-lg text-white/80">Your central command for business growth</p>
          </motion.div>
          
          {/* Features */}
          <div className="space-y-5">
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-md bg-purple-500/30 border border-purple-400/30 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <p className="font-semibold">Smart Scheduling</p>
                <p className="text-sm text-white/70">Plan and organize your content calendar</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-md bg-amber-500/30 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <p className="font-semibold">Content Creation</p>
                <p className="text-sm text-white/70">Generate posts, ads, and messages</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="w-10 h-10 rounded-md bg-emerald-500/30 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <p className="font-semibold">ROI Analytics</p>
                <p className="text-sm text-white/70">Track performance and optimize spend</p>
              </div>
            </motion.div>
          </div>
          
          {/* Tenant Logos */}
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {tenant.id === "lumepaint" || tenant.id === "lume" ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>LUME</h2>
                <p className="text-xs tracking-widest uppercase text-white/70">Paint Co</p>
              </div>
            ) : (
              <img src={nppLogo} alt="Nashville Painting Professionals" className="h-14 w-auto rounded-md opacity-90" />
            )}
          </motion.div>
          
          {/* Footer */}
          <motion.div 
            className="pt-6 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <p className="text-xs text-white/50">Powered by Dark Wave Studios</p>
            <p className="text-xs text-white/40 mt-1">&copy; 2026 All rights reserved</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-background min-h-screen">
        <div className="w-full max-w-md px-2 sm:px-0">

        {/* Mobile Header - Only visible on smaller screens */}
        <div className="lg:hidden text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Marketing Hub Pro</h1>
          <p className="text-sm text-muted-foreground">Your central command for business growth</p>
        </div>

        {/* Login Card - Center */}
        <Card className="w-full">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-sm">
              {isLogin
                ? `Sign in to your ${tenant.name} account`
                : `Join ${tenant.name} to get started`}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
          {isLogin ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            autoComplete="email"
                            data-testid="input-login-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            autoComplete="current-password"
                            data-testid="input-login-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm text-muted-foreground"
                    onClick={() => setLocation("/forgot-password")}
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="John"
                              className="pl-10"
                              autoComplete="given-name"
                              data-testid="input-register-firstname"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            autoComplete="family-name"
                            data-testid="input-register-lastname"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                            autoComplete="email"
                            data-testid="input-register-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="tel"
                            placeholder="(555) 123-4567"
                            className="pl-10"
                            autoComplete="tel"
                            data-testid="input-register-phone"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            className="pl-10 pr-10"
                            autoComplete="new-password"
                            data-testid="input-register-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password-register"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10"
                            autoComplete="new-password"
                            data-testid="input-register-confirm-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                  data-testid="button-register-submit"
                >
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                loginForm.reset();
                registerForm.reset();
              }}
              data-testid="button-toggle-auth-mode"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>

          {/* Quick Access Install Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-center space-y-2">
              {isInstalled ? (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Added to your device
                </p>
              ) : deferredPrompt ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInstallClick}
                  className="gap-2"
                  data-testid="button-install-pwa"
                >
                  <Smartphone className="w-4 h-4" />
                  Add to Home Screen for Quick Access
                </Button>
              ) : isIOS ? (
                <div className="text-sm text-muted-foreground">
                  <p className="flex flex-wrap items-center justify-center gap-1 text-center leading-relaxed">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <span>Tap Share, then "Add to Home Screen"</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Open on mobile to add to your home screen
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Your session stays active for 30 days for convenience
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
        
        {/* Mobile Footer - Only visible on smaller screens */}
        <div className="lg:hidden text-center mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Powered by Dark Wave Studios</p>
          <p className="text-xs text-muted-foreground/70 mt-1">&copy; 2026 All rights reserved</p>
        </div>
        </div>
      </div>
    </div>
  );
}
