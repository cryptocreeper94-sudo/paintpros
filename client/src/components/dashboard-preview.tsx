import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Shield, Crown, HardHat, Briefcase, Code, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardRole {
  id: string;
  name: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bgColor: string;
  path: string;
  pin: string;
  features: string[];
}

const DASHBOARD_ROLES: DashboardRole[] = [
  {
    id: "admin",
    name: "Admin (Ops Manager)",
    description: "Full access to leads, estimates, analytics, and team management",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    path: "/admin",
    pin: "4444",
    features: [
      "Live Visitors & Analytics",
      "Lead & Estimate Management",
      "Follow-up Tracking",
      "CRM Calendar",
      "Document Center",
      "Crew Management",
      "Team Management",
      "Sales/Jobs Pipeline"
    ]
  },
  {
    id: "owner",
    name: "Owner",
    description: "Strategic overview with revenue metrics and business analytics",
    icon: Crown,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    path: "/owner",
    pin: "1111",
    features: [
      "Revenue Overview",
      "Analytics Dashboard",
      "Document Center",
      "CRM Calendar",
      "Team Management",
      "Release Management",
      "Blockchain Hallmarks"
    ]
  },
  {
    id: "project-manager",
    name: "Project Manager",
    description: "Project scheduling, crew coordination, and job tracking",
    icon: Briefcase,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    path: "/project-manager",
    pin: "2222",
    features: [
      "Project Schedule",
      "Crew Assignments",
      "Job Status Tracking",
      "Sales Pipeline",
      "Upcoming Bookings"
    ]
  },
  {
    id: "crew-lead",
    name: "Crew Lead",
    description: "Field operations, time tracking, and incident reporting",
    icon: HardHat,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    path: "/crew-lead",
    pin: "3333",
    features: [
      "Crew Member Management",
      "Time Entry Tracking",
      "Job Notes",
      "Incident Reporting",
      "Spanish Language Support"
    ]
  },
  {
    id: "developer",
    name: "Developer",
    description: "Technical settings, integrations, and system configuration",
    icon: Code,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    path: "/developer",
    pin: "0424",
    features: [
      "Release Management",
      "Blockchain Stamping",
      "Integration Setup",
      "Orbit Ecosystem",
      "Technical Roadmap"
    ]
  }
];

interface DashboardPreviewProps {
  currentRole: string;
}

export function DashboardPreview({ currentRole }: DashboardPreviewProps) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<DashboardRole | null>(null);

  const handleViewDashboard = (role: DashboardRole) => {
    window.location.href = role.path;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          data-testid="button-dashboard-preview"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">View Other Dashboards</span>
          <span className="sm:hidden">Dashboards</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Dashboard Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Preview what each role can see and access. Click to navigate to that dashboard.
          </p>
          
          <div className="grid gap-3">
            {DASHBOARD_ROLES.map((role) => {
              const Icon = role.icon;
              const isCurrentRole = role.id === currentRole;
              
              return (
                <motion.div
                  key={role.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isCurrentRole 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedRole(selectedRole?.id === role.id ? null : role)}
                  data-testid={`dashboard-role-${role.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${role.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${role.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold flex items-center gap-2">
                          {role.name}
                          {isCurrentRole && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Current
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-muted-foreground font-mono">
                          PIN: {role.pin}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.description}
                      </p>
                      
                      {selectedRole?.id === role.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-border"
                        >
                          <div className="text-xs font-medium text-foreground mb-2">Features:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {role.features.map((feature, idx) => (
                              <span 
                                key={idx}
                                className="text-xs px-2 py-1 rounded-md bg-background border border-border"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                          
                          {!isCurrentRole && (
                            <Button
                              size="sm"
                              className="mt-3 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDashboard(role);
                              }}
                              data-testid={`button-goto-${role.id}`}
                            >
                              Go to {role.name} Dashboard
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </div>
                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                      selectedRole?.id === role.id ? "rotate-90" : ""
                    }`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
