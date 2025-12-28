import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/context/TenantContext";
import { PageLayout } from "@/components/layout/page-layout";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { NotificationSettings } from "@/components/notification-settings";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Settings, 
  ClipboardList, 
  Gift,
  Home,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  Download,
  Copy,
  User,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  LogIn,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import type { 
  Lead, 
  Estimate, 
  Booking, 
  Document, 
  CustomerPreferences 
} from "@shared/schema";
import { Link, useLocation } from "wouter";

interface DashboardData {
  estimates: Estimate[];
  bookings: Booking[];
  documents: Document[];
  preferences: CustomerPreferences | null;
  leads: Lead[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
  sent: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  viewed: "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
  accepted: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  scheduled: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  "in_progress": "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
  completed: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  cancelled: "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30",
  confirmed: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  draft: "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30",
  signed: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  contacted: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  converted: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
};

export default function AccountPage() {
  const { user, isLoading: authLoading } = useAuth();
  const tenant = useTenant();
  const { toast } = useToast();

  const [, navigate] = useLocation();

  const { data: dashboard, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ["/api/customer/dashboard"],
    enabled: !!user,
    retry: 2,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (prefs: Record<string, unknown>) => {
      return apiRequest("/api/customer/preferences", "POST", prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/preferences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customer/dashboard"] });
      toast({ title: "Preferences saved" });
    },
    onError: () => {
      toast({ title: "Failed to save preferences", variant: "destructive" });
    },
  });

  const acceptEstimateMutation = useMutation({
    mutationFn: async (estimateId: string) => {
      return apiRequest(`/api/estimates/${estimateId}/accept`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customer/dashboard"] });
      toast({ title: "Estimate accepted!", description: "We'll be in touch soon to schedule your project." });
    },
    onError: () => {
      toast({ title: "Failed to accept estimate", description: "Please try again or contact us.", variant: "destructive" });
    },
  });

  const generateReferralCode = () => {
    const code = `${tenant.name.replace(/\s+/g, "").toUpperCase().slice(0, 3)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    navigator.clipboard.writeText(code);
    toast({ title: "Referral code copied!", description: code });
  };

  if (authLoading) {
    return (
      <PageLayout>
        <main className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 animate-spin text-accent" />
        </main>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <GlassCard className="p-8 md:p-12" glow="accent">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-accent" />
                </div>
                <h1 className="text-2xl md:text-4xl font-display font-bold">
                  Sign In to Your Account
                </h1>
                <p className="text-muted-foreground max-w-md">
                  Access your estimate history, track jobs, manage appointments, and more by signing in to your customer portal.
                </p>
                <Link href="/" className="inline-block">
                  <Button size="lg" className="gap-2" data-testid="button-sign-in-prompt">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </main>
      </PageLayout>
    );
  }

  if (isError) {
    return (
      <PageLayout>
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center" data-testid="container-error-state">
            <GlassCard className="p-8 md:p-12" glow="accent">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl md:text-4xl font-display font-bold" data-testid="text-error-title">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground max-w-md" data-testid="text-error-message">
                  We couldn't load your account information. Please try again or contact support if the problem persists.
                </p>
                <Button size="lg" className="gap-2" onClick={() => refetch()} data-testid="button-retry-load">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            </GlassCard>
          </div>
        </main>
      </PageLayout>
    );
  }

  const estimates = dashboard?.estimates || [];
  const bookings = dashboard?.bookings || [];
  const documents = dashboard?.documents || [];
  const preferences = dashboard?.preferences;

  // Filtering and sorting state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filtered and sorted estimates
  const filteredEstimates = useMemo(() => {
    let result = [...estimates];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(e => e.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        const amountA = Number(a.totalEstimate) || 0;
        const amountB = Number(b.totalEstimate) || 0;
        return sortOrder === "desc" ? amountB - amountA : amountA - amountB;
      }
    });
    
    return result;
  }, [estimates, statusFilter, sortBy, sortOrder]);

  const activeJobs = estimates.filter(e => 
    e.status === "accepted" || e.status === "in_progress" || e.status === "scheduled"
  );
  const completedJobs = estimates.filter(e => e.status === "completed");
  const pendingEstimates = estimates.filter(e => 
    e.status === "pending" || e.status === "sent" || e.status === "contacted"
  );
  const upcomingBookings = bookings.filter(b => 
    b.status === "confirmed" || b.status === "scheduled"
  );


  return (
    <PageLayout>
      <main className="pt-8 md:pt-4 px-2 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-2">
            <h1 className="text-2xl md:text-4xl font-display font-bold mb-2">
              Welcome back, {user.firstName || user.email?.split("@")[0] || "Customer"}
            </h1>
            <p className="text-muted-foreground">
              Manage your projects and preferences with {tenant.name}
            </p>
          </div>

          <BentoGrid>
            {/* Quick Stats - Overview Cards */}
            <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
              <GlassCard className="p-4 md:p-6 h-full flex flex-col justify-between" hoverEffect="subtle" glow="accent">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estimates</span>
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold">{estimates.length}</div>
                <p className="text-xs text-muted-foreground">{pendingEstimates.length} pending</p>
              </GlassCard>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
              <GlassCard className="p-4 md:p-6 h-full flex flex-col justify-between" hoverEffect="subtle" glow="blue">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Jobs</span>
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold">{activeJobs.length}</div>
                <p className="text-xs text-muted-foreground">{completedJobs.length} completed</p>
              </GlassCard>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
              <GlassCard className="p-4 md:p-6 h-full flex flex-col justify-between" hoverEffect="subtle" glow="green">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Appointments</span>
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold">{bookings.length}</div>
                <p className="text-xs text-muted-foreground">{upcomingBookings.length} upcoming</p>
              </GlassCard>
            </BentoItem>

            <BentoItem colSpan={3} rowSpan={1} mobileColSpan={2} mobileRowSpan={1}>
              <GlassCard className="p-4 md:p-6 h-full flex flex-col justify-between" hoverEffect="subtle" glow="purple">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Documents</span>
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold">{documents.length}</div>
                <p className="text-xs text-muted-foreground">Contracts & invoices</p>
              </GlassCard>
            </BentoItem>

            {/* Estimate History - Full Width with Accordion */}
            <BentoItem colSpan={8} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
              <GlassCard className="p-4 md:p-6 h-full" hoverEffect={false}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-lg md:text-xl font-display font-bold">Estimate History</h2>
                  </div>
                  <Link href="/estimate">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-new-estimate">
                      New Estimate <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>

                {/* Filter and Sort Controls */}
                {estimates.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[130px]" data-testid="select-status-filter">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "amount")}>
                        <SelectTrigger className="w-[110px]" data-testid="select-sort-by">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        data-testid="button-toggle-sort-order"
                      >
                        {sortOrder === "desc" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                      </Button>
                    </div>
                    {statusFilter !== "all" && estimates.length > 0 && (
                      <Badge variant="secondary" className="text-xs" data-testid="badge-filter-count">
                        {filteredEstimates.length} of {estimates.length} shown
                      </Badge>
                    )}
                  </div>
                )}

                {estimates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No estimates yet</p>
                    <Link href="/estimate">
                      <Button className="gap-2" data-testid="button-get-first-estimate">
                        Get Your Free Estimate <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ) : filteredEstimates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center" data-testid="container-no-filter-results">
                    <Filter className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2" data-testid="text-no-filter-results">No estimates match your filters</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStatusFilter("all")}
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[300px] md:max-h-[400px] pr-2">
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredEstimates.map((estimate) => (
                          <AccordionItem 
                            key={estimate.id} 
                            value={estimate.id}
                            className="border rounded-lg bg-card/50 px-4"
                            data-testid={`accordion-estimate-${estimate.id}`}
                          >
                            <AccordionTrigger className="hover:no-underline py-3">
                              <div className="flex items-center justify-between w-full pr-4 gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <DollarSign className="w-4 h-4 text-accent" />
                                  </div>
                                  <div className="text-left min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {estimate.pricingTier === "full_job" ? "Full Interior" : 
                                       estimate.pricingTier === "walls_only" ? "Walls Only" : 
                                       estimate.pricingTier === "doors_only" ? "Doors Only" : "Custom Job"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {estimate.createdAt ? format(new Date(estimate.createdAt), "MMM d, yyyy") : "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <Badge className={statusColors[estimate.status || "pending"]}>
                                    {estimate.status || "pending"}
                                  </Badge>
                                  <span className="font-bold text-accent">${Number(estimate.totalEstimate || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Square Feet</p>
                                  <p className="font-medium">{estimate.squareFootage || "N/A"} sq ft</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Doors</p>
                                  <p className="font-medium">{estimate.doorCount || 0}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Includes</p>
                                  <p className="font-medium text-xs">
                                    {[
                                      estimate.includeWalls && "Walls",
                                      estimate.includeTrim && "Trim",
                                      estimate.includeCeilings && "Ceilings",
                                    ].filter(Boolean).join(", ") || "Custom"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground text-xs mb-1">Pricing</p>
                                  <p className="font-medium capitalize">{estimate.pricingTier?.replace("_", " ") || "Standard"}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4 flex-wrap">
                                <Link href={`/proposal/${estimate.id}`}>
                                  <Button variant="outline" size="sm" className="gap-2" data-testid={`button-view-proposal-${estimate.id}`}>
                                    <FileText className="w-3 h-3" /> View Proposal
                                  </Button>
                                </Link>
                                {(estimate.status === "pending" || estimate.status === "contacted" || estimate.status === "sent") && (
                                  <Button 
                                    size="sm" 
                                    className="gap-2" 
                                    onClick={() => acceptEstimateMutation.mutate(estimate.id)}
                                    disabled={acceptEstimateMutation.isPending}
                                    data-testid={`button-accept-estimate-${estimate.id}`}
                                  >
                                    {acceptEstimateMutation.isPending ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3" />
                                    )}
                                    Accept Estimate
                                  </Button>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </GlassCard>
            </BentoItem>

            {/* Referral Program Card */}
            <BentoItem colSpan={4} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
              <GlassCard className="p-4 md:p-6 h-full bg-gradient-to-br from-accent/10 to-purple-500/10" hoverEffect="subtle" glow>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold">Referral Program</h2>
                    <p className="text-xs text-muted-foreground">Earn rewards for referrals</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background/50 border border-border">
                    <p className="text-sm font-medium mb-2">Share your referral code</p>
                    <div className="flex gap-2">
                      <Input 
                        readOnly 
                        value="Generate a code" 
                        className="font-mono text-sm"
                        data-testid="input-referral-code"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={generateReferralCode}
                        data-testid="button-copy-referral"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">$50</p>
                      <p className="text-xs text-muted-foreground">Credit per referral</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
                      <p className="text-2xl font-bold text-accent">0</p>
                      <p className="text-xs text-muted-foreground">Referrals made</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Upcoming Appointments */}
            <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
              <GlassCard className="p-4 md:p-6 h-full" hoverEffect={false}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-500" />
                    </div>
                    <h2 className="text-lg md:text-xl font-display font-bold">Appointments</h2>
                  </div>
                  <Link href="/estimate">
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-book-appointment">
                      Book Now <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm mb-3">No appointments scheduled</p>
                    <Link href="/estimate">
                      <Button size="sm" className="gap-2" data-testid="button-schedule-consultation">
                        Schedule a Consultation
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[280px]">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="p-3 rounded-lg bg-card/50 border border-border flex items-center gap-4"
                        data-testid={`card-booking-${booking.id}`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {booking.scheduledDate ? format(new Date(booking.scheduledDate), "d") : "--"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {booking.scheduledDate ? format(new Date(booking.scheduledDate), "MMM") : "--"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{booking.serviceType || "Consultation"}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{booking.scheduledTime || "Time TBD"}</span>
                          </div>
                        </div>
                        <Badge className={statusColors[booking.status || "pending"]}>
                          {booking.status || "pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </BentoItem>

            {/* Documents */}
            <BentoItem colSpan={6} rowSpan={2} mobileColSpan={4} mobileRowSpan={2}>
              <GlassCard className="p-4 md:p-6 h-full" hoverEffect={false}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <h2 className="text-lg md:text-xl font-display font-bold">Documents</h2>
                </div>

                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">No documents available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contracts and invoices will appear here
                    </p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-2">
                    {documents.slice(0, 5).map((doc) => (
                      <AccordionItem 
                        key={doc.id} 
                        value={doc.id}
                        className="border rounded-lg bg-card/50 px-4"
                        data-testid={`accordion-document-${doc.id}`}
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 w-full pr-4">
                            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{doc.title || doc.fileName}</p>
                              <p className="text-xs text-muted-foreground capitalize">{doc.documentType}</p>
                            </div>
                            <Badge className={statusColors[doc.status || "draft"]}>
                              {doc.status || "draft"}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm" className="gap-2" data-testid={`button-download-doc-${doc.id}`}>
                              <Download className="w-3 h-3" /> Download
                            </Button>
                            {doc.status === "pending" && (
                              <Link href={`/proposal/${doc.id}/sign`}>
                                <Button size="sm" className="gap-2" data-testid={`button-sign-doc-${doc.id}`}>
                                  <CheckCircle2 className="w-3 h-3" /> Sign Document
                                </Button>
                              </Link>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </GlassCard>
            </BentoItem>

            {/* Saved Preferences */}
            <BentoItem colSpan={12} rowSpan={2} mobileColSpan={4} mobileRowSpan={3}>
              <GlassCard className="p-4 md:p-6 h-full" hoverEffect={false}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-display font-bold">Saved Preferences</h2>
                    <p className="text-xs text-muted-foreground">Pre-fill your info for faster estimates</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Contact Method
                    </label>
                    <Select 
                      defaultValue={preferences?.preferredContactMethod || "email"}
                      onValueChange={(v) => updatePreferencesMutation.mutate({ preferredContactMethod: v })}
                    >
                      <SelectTrigger data-testid="select-contact-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Best Time
                    </label>
                    <Select 
                      defaultValue={preferences?.preferredContactTime || "morning"}
                      onValueChange={(v) => updatePreferencesMutation.mutate({ preferredContactTime: v })}
                    >
                      <SelectTrigger data-testid="select-contact-time">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      Property Type
                    </label>
                    <Select 
                      defaultValue={preferences?.propertyType || "house"}
                      onValueChange={(v) => updatePreferencesMutation.mutate({ propertyType: v })}
                    >
                      <SelectTrigger data-testid="select-property-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Property Size
                    </label>
                    <Select 
                      defaultValue={preferences?.propertySize || "medium"}
                      onValueChange={(v) => updatePreferencesMutation.mutate({ propertySize: v })}
                    >
                      <SelectTrigger data-testid="select-property-size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (under 1,500 sqft)</SelectItem>
                        <SelectItem value="medium">Medium (1,500-3,000 sqft)</SelectItem>
                        <SelectItem value="large">Large (3,000+ sqft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      Special Instructions
                    </label>
                    <Textarea 
                      placeholder="e.g., Gate code: 1234, Best time to call: mornings..."
                      defaultValue={preferences?.specialInstructions || ""}
                      onBlur={(e) => updatePreferencesMutation.mutate({ specialInstructions: e.target.value })}
                      className="resize-none"
                      rows={2}
                      data-testid="input-pref-instructions"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      Access Notes
                    </label>
                    <Textarea 
                      placeholder="e.g., Parking in driveway, ring doorbell twice..."
                      defaultValue={preferences?.accessNotes || ""}
                      onBlur={(e) => updatePreferencesMutation.mutate({ accessNotes: e.target.value })}
                      className="resize-none"
                      rows={2}
                      data-testid="input-pref-access"
                    />
                  </div>
                </div>
              </GlassCard>
            </BentoItem>

            {/* Notification Preferences */}
            <BentoItem colSpan={12} rowSpan={1} mobileColSpan={4} mobileRowSpan={2}>
              <NotificationSettings userId={user?.id} />
            </BentoItem>
          </BentoGrid>
        </div>
      </main>
    </PageLayout>
  );
}
