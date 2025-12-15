import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Shield, UserCheck, Loader2, Save, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  { value: "owner", label: "Owner", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "admin", label: "Admin", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { value: "project-manager", label: "Project Manager", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "area-manager", label: "Area Manager", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { value: "crew-lead", label: "Crew Lead", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "developer", label: "Developer", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
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
      return apiRequest("PATCH", `/api/team/users/${userId}/role`, {
        role,
        tenantId: tenant.id,
      });
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

  const getRoleBadge = (role: string | null) => {
    if (!role) return null;
    const roleConfig = AVAILABLE_ROLES.find((r) => r.value === role);
    return (
      <Badge variant="outline" className={`text-[10px] ${roleConfig?.color || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
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

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setSelectedRole(user.role || "");
  };

  const handleSaveRole = (userId: string) => {
    updateRoleMutation.mutate({
      userId,
      role: selectedRole || null,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-accent/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold" data-testid="text-team-title">Team Management</h2>
            <p className="text-xs text-muted-foreground" data-testid="text-team-count">
              {users.length} registered user{users.length !== 1 ? "s" : ""}
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
          className="pl-9"
          data-testid="input-team-search"
        />
      </div>

      <ScrollArea className="flex-1 -mx-1 px-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <Users className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? "No users match your search" : "No registered users yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-lg bg-card/50 border border-border/50 hover-elevate"
                  data-testid={`user-row-${user.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm shrink-0">
                        {getDisplayName(user)[0].toUpperCase()}
                      </div>
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
                      <div className="flex items-center gap-2">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger className="w-[140px] h-8" data-testid={`select-role-${user.id}`}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Role</SelectItem>
                            {AVAILABLE_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleSaveRole(user.id)}
                          disabled={updateRoleMutation.isPending}
                          data-testid={`button-save-role-${user.id}`}
                        >
                          {updateRoleMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          data-testid={`button-cancel-edit-${user.id}`}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      <div className="pt-2 border-t border-border/50">
        <div className="flex flex-wrap gap-1">
          {AVAILABLE_ROLES.map((role) => (
            <Badge key={role.value} variant="outline" className={`text-[9px] ${role.color}`}>
              {role.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
