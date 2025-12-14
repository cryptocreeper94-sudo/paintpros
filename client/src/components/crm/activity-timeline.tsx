import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CrmActivity } from "@shared/schema";
import { format } from "date-fns";
import { 
  Phone, Mail, MapPin, FileText, Plus, X, Check, Clock
} from "lucide-react";

const ACTIVITY_TYPES = [
  { id: "call", label: "Call", icon: Phone, color: "bg-green-500/20 text-green-400" },
  { id: "email", label: "Email", icon: Mail, color: "bg-blue-500/20 text-blue-400" },
  { id: "visit", label: "Site Visit", icon: MapPin, color: "bg-purple-500/20 text-purple-400" },
  { id: "note", label: "Note", icon: FileText, color: "bg-amber-500/20 text-amber-400" },
];

interface ActivityTimelineProps {
  entityType?: string;
  entityId?: string;
  showAll?: boolean;
  maxHeight?: string;
}

export function ActivityTimeline({ 
  entityType, 
  entityId, 
  showAll = true,
  maxHeight = "300px"
}: ActivityTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({ 
    activityType: "call", 
    title: "", 
    description: "",
    entityType: entityType || "deal",
    entityId: entityId || ""
  });
  
  const queryClient = useQueryClient();

  const queryKey = showAll 
    ? ["/api/crm/activities"]
    : ["/api/crm/activities", entityType, entityId];

  const { data: activities = [], isLoading } = useQuery<CrmActivity[]>({
    queryKey,
    queryFn: async () => {
      const url = showAll 
        ? "/api/crm/activities"
        : `/api/crm/activities/${entityType}/${entityId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json();
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activity: typeof newActivity) => {
      const res = await fetch("/api/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activity),
      });
      if (!res.ok) throw new Error("Failed to create activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/activities"] });
      setShowAddForm(false);
      setNewActivity({ 
        activityType: "call", 
        title: "", 
        description: "",
        entityType: entityType || "deal",
        entityId: entityId || ""
      });
    },
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.title.trim() && newActivity.entityId) {
      createActivityMutation.mutate(newActivity);
    }
  };

  const getActivityTypeInfo = (typeId: string) => {
    return ACTIVITY_TYPES.find(t => t.id === typeId) || ACTIVITY_TYPES[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold">Activity Timeline</h3>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent text-sm border border-accent/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-testid="button-add-activity"
        >
          <Plus className="w-3 h-3" />
          Log Activity
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleAddActivity}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 border border-border dark:border-white/10 space-y-3">
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      type="button"
                      onClick={() => setNewActivity({ ...newActivity, activityType: type.id })}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        newActivity.activityType === type.id 
                          ? type.color + " border-current ring-2 ring-white/20" 
                          : "bg-black/5 dark:bg-white/5 text-muted-foreground border-border dark:border-white/10 hover:bg-black/5 dark:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-3 h-3" />
                      {type.label}
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="Activity title..."
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                  data-testid="input-activity-title"
                />
                <Input
                  type="text"
                  placeholder="Deal/Lead ID..."
                  value={newActivity.entityId}
                  onChange={(e) => setNewActivity({ ...newActivity, entityId: e.target.value })}
                  className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                  data-testid="input-activity-entity-id"
                />
              </div>
              
              <Input
                type="text"
                placeholder="Description (optional)..."
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                className="bg-black/5 dark:bg-white/5 border-border dark:border-white/20 rounded-xl"
                data-testid="input-activity-description"
              />
              
              <div className="flex gap-2 justify-end">
                <motion.button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!newActivity.title.trim() || !newActivity.entityId || createActivityMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-accent text-white font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="button-submit-activity"
                >
                  <Check className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className={`space-y-2 overflow-y-auto pr-2 custom-scrollbar`} style={{ maxHeight }}>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground text-sm">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No activities yet</p>
          </div>
        ) : (
          activities.slice(0, 20).map((activity, index) => {
            const typeInfo = getActivityTypeInfo(activity.activityType);
            const Icon = typeInfo.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 hover:bg-black/5 dark:bg-white/10 transition-colors"
                data-testid={`activity-row-${activity.id}`}
              >
                <div className={`w-8 h-8 rounded-lg ${typeInfo.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{activity.title}</p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">{activity.description}</p>
                  )}
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    {activity.entityType}: {activity.entityId.slice(0, 8)}...
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
