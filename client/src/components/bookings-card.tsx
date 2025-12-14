import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, CalendarCheck } from "lucide-react";
import type { Booking } from "@shared/schema";
import { useTenant } from "@/context/TenantContext";

const STATUS_CONFIG = {
  pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
  confirmed: { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Confirmed" },
  completed: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Completed" },
  cancelled: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Cancelled" },
  no_show: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", label: "No Show" },
};

export function BookingsCard() {
  const tenant = useTenant();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/upcoming", tenant.id],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/upcoming?tenantId=${tenant.id}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update booking status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/upcoming", tenant.id] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by admin" }),
      });
      if (!res.ok) throw new Error("Failed to cancel booking");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/upcoming", tenant.id] });
    },
  });

  const getStatusStyle = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  };

  const isPending = updateStatusMutation.isPending || cancelMutation.isPending;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold" data-testid="text-bookings-title">Upcoming Bookings</h2>
            <p className="text-xs text-muted-foreground" data-testid="text-bookings-count">{bookings.length} scheduled</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar" data-testid="bookings-list">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No upcoming bookings</p>
            <p className="text-xs text-muted-foreground/70 mt-1">New appointments will appear here</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {bookings.map((booking, index) => {
              const statusConfig = getStatusStyle(booking.status);
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  data-testid={`booking-row-${booking.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate" data-testid={`text-customer-name-${booking.id}`}>
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate" data-testid={`text-service-type-${booking.id}`}>
                          {booking.serviceType}
                        </p>
                      </div>
                    </div>
                    <span 
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${statusConfig.color}`}
                      data-testid={`badge-status-${booking.id}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span data-testid={`text-date-${booking.id}`}>
                        {format(new Date(booking.scheduledDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span data-testid={`text-time-${booking.id}`}>{booking.scheduledTime}</span>
                    </div>
                  </div>

                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <div className="flex gap-1.5">
                      {booking.status === "pending" && (
                        <motion.button
                          onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "confirmed" })}
                          disabled={isPending}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-[10px] font-medium border border-green-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          data-testid={`button-confirm-${booking.id}`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Confirm
                        </motion.button>
                      )}
                      {booking.status === "confirmed" && (
                        <motion.button
                          onClick={() => updateStatusMutation.mutate({ id: booking.id, status: "completed" })}
                          disabled={isPending}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-[10px] font-medium border border-blue-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          data-testid={`button-complete-${booking.id}`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => cancelMutation.mutate(booking.id)}
                        disabled={isPending}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-medium border border-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`button-cancel-${booking.id}`}
                      >
                        <XCircle className="w-3 h-3" />
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
