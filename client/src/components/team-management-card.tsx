import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Loader2, Save, X, Edit2, Crown, Shield, Briefcase, HardHat, Code, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GlassCard } from "@/components/ui/glass-card";
import { useTenant } from "@/context/TenantContext";
import { toast } from "sonner";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  tenantId: string | null;
  createdAt: string;
}

const AVAILABLE_ROLES = [
  { value: "owner", label: "Owner", icon: Crown, gradient: "from-purple-500 to-pink-500", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { value: "admin", label: "Admin", icon: Shield, gradient: "from-red-500 to-orange-500", color: "bg-red-500/20 text-red-300 border-red-500/40" },
  { value: "project-manager", label: "Project Manager", icon: Briefcase, gradient: "from-blue-500 to-cyan-500", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  { value: "crew-lead", label: "Crew Lead", icon: HardHat, gradient: "from-green-500 to-emerald-500", color: "bg-green-500/20 text-green-300 border-green-500/40" },
  { value: "developer", label: "Developer", icon: Code, gradient: "from-amber-500 to-yellow-500", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
];

export function TeamManagementCard() {
  const tenant = useTenant();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/team/users", tenant.id],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string | null }) => {
      return apiRequest("PATCH", `/api/team/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/users"] });
      toast.success("Role updated successfully");
      setEditingUserId(null);
      setSelectedRole("");
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  const getRoleConfig = (role: string | null) => {
    return AVAILABLE_ROLES.find((r) => r.value === role);
  };

  const getRoleBadge = (role: string | null) => {
    if (!role) return <Badge variant="outline" className="text-[10px] bg-gray-500/20 text-gray-400 border-gray-500/30">Unassigned</Badge>;
    const roleConfig = getRoleConfig(role);
    const IconComponent = roleConfig?.icon || Users;
    return (
      <Badge variant="outline" className={`text-[10px] gap-1 ${roleConfig?.color || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
        <IconComponent className="w-3 h-3" />
        {roleConfig?.label || role}
      </Badge>
    );
  };

  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || "Unknown User";
  };

  const getAvatarGradient = (user: User) => {
    const roleConfig = getRoleConfig(user.role);
    return roleConfig?.gradient || "from-gray-400 to-gray-600";
  };

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role || "");
  };

  const handleSaveRole = (userId: string) => {
    updateRoleMutation.mutate({
      userId,
      role: selectedRole === "none" ? null : selectedRole || null,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-accent/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Users className="w-5 h-5 text-purple-400" />
          </motion.div>
          <div>
            <h2 className="text-lg font-display font-bold bg-gradient-to-r from-purple-400 to-accent bg-clip-text text-transparent" data-testid="text-team-title">
              Team Management
            </h2>
            <p className="text-xs text-muted-foreground" data-testid="text-team-count">
              {users.length} team member{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 focus:border-purple-500/50 transition-colors"
          data-testid="input-team-search"
        />
      </div>

      <ScrollArea className="flex-1 -mx-1 px-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-32 text-muted-foreground"
          >
            <Users className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">
              {searchQuery ? "No users match your search" : "No registered users yet"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard
                    hoverEffect="subtle"
                    glow={user.role === "owner" ? "purple" : user.role === "admin" ? "gold" : false}
                    depth="shallow"
                    className="p-3"
                    data-testid={`user-row-${user.id}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <motion.div 
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(user)} flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-lg`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {getDisplayName(user)[0].toUpperCase()}
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate" data-testid={`text-user-name-${user.id}`}>
                            {getDisplayName(user)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>

                      {editingUserId === user.id ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2"
                        >
                          <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[140px] h-8 bg-white/5 border-white/20" data-testid={`select-role-${user.id}`}>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Role</SelectItem>
                              {AVAILABLE_ROLES.map((role) => {
                                const IconComponent = role.icon;
                                return (
                                  <SelectItem key={role.value} value={role.value}>
                                    <div className="flex items-center gap-2">
                                      <IconComponent className="w-3 h-3" />
                                      {role.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveRole(user.id)}
                            disabled={updateRoleMutation.isPending}
                            className="text-green-400"
                            data-testid={`button-save-role-${user.id}`}
                          >
                            {updateRoleMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="text-red-400"
                            data-testid={`button-cancel-edit-${user.id}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditClick(user)}
                            data-testid={`button-edit-role-${user.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      <div className="pt-3 border-t border-white/10">
        <p className="text-xs text-muted-foreground mb-2">Available Roles</p>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_ROLES.map((role) => {
            const IconComponent = role.icon;
            return (
              <Badge key={role.value} variant="outline" className={`text-[9px] gap-1 ${role.color}`}>
                <IconComponent className="w-2.5 h-2.5" />
                {role.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
