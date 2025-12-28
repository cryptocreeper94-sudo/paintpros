import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Files, 
  Plus, 
  Copy, 
  Trash2, 
  Edit2, 
  Home, 
  Building2, 
  Repeat, 
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import type { ProjectTemplate } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectTemplatesProps {
  tenantId: string;
  onSelectTemplate?: (template: ProjectTemplate) => void;
  className?: string;
}

const FileTemplate = Files;

const TEMPLATE_CATEGORIES = [
  { value: "residential", label: "Residential", icon: Home },
  { value: "commercial", label: "Commercial", icon: Building2 },
  { value: "apartment_turnover", label: "Apartment Turnover", icon: Repeat },
  { value: "touch_up", label: "Touch Up", icon: Clock },
];

const DEFAULT_TEMPLATES: Partial<ProjectTemplate>[] = [
  {
    name: "Standard 3BR Home",
    description: "Full interior repaint for a typical 3-bedroom home with 2 bathrooms",
    category: "residential",
    services: ["walls", "ceilings", "trim", "doors"],
    defaultSquareFootage: 1800,
    roomCount: 8,
    laborMultiplier: "1.0",
    materialMultiplier: "1.0",
  },
  {
    name: "Apartment Turnover",
    description: "Quick repaint for rental unit between tenants",
    category: "apartment_turnover",
    services: ["walls"],
    defaultSquareFootage: 900,
    roomCount: 4,
    laborMultiplier: "0.8",
    materialMultiplier: "0.9",
  },
  {
    name: "Commercial Office",
    description: "Open floor plan office space with neutral tones",
    category: "commercial",
    services: ["walls", "ceilings"],
    defaultSquareFootage: 3000,
    roomCount: 1,
    laborMultiplier: "1.2",
    materialMultiplier: "1.0",
  },
];

function TemplateCard({ 
  template, 
  onSelect, 
  onEdit, 
  onDelete,
  isDefault = false 
}: { 
  template: Partial<ProjectTemplate>; 
  onSelect?: () => void; 
  onEdit?: () => void;
  onDelete?: () => void;
  isDefault?: boolean;
}) {
  const category = TEMPLATE_CATEGORIES.find(c => c.value === template.category);
  const CategoryIcon = category?.icon || FileTemplate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                {category && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {category.label}
                  </Badge>
                )}
              </div>
            </div>
            {isDefault && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {template.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {template.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            {template.services && Array.isArray(template.services) && (template.services as string[]).map((service: string) => (
              <Badge key={service} variant="outline" className="text-xs capitalize">
                {service}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
            <div>Sq Ft: {template.defaultSquareFootage?.toLocaleString()}</div>
            <div>Rooms: {template.roomCount}</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={onSelect}
              className="flex-1"
              data-testid={`button-use-template-${template.name?.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <Copy className="w-4 h-4 mr-2" />
              Use Template
            </Button>
            {!isDefault && (
              <>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={onEdit}
                  data-testid="button-edit-template"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={onDelete}
                  data-testid="button-delete-template"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CreateTemplateDialog({ 
  open, 
  onOpenChange, 
  tenantId,
  editingTemplate
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  editingTemplate?: ProjectTemplate | null;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: editingTemplate?.name || "",
    description: editingTemplate?.description || "",
    category: editingTemplate?.category || "residential",
    defaultSquareFootage: editingTemplate?.defaultSquareFootage || 1500,
    roomCount: editingTemplate?.roomCount || 6,
    services: editingTemplate?.services || [],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/project-templates", {
        ...data,
        tenantId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-templates", tenantId] });
      toast({ title: "Template created successfully" });
      onOpenChange(false);
    },
  });

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: (prev.services as string[]).includes(service) 
        ? (prev.services as string[]).filter(s => s !== service)
        : [...(prev.services as string[]), service],
    }));
  };

  const allServices = ["walls", "ceilings", "trim", "doors", "cabinets", "exterior"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTemplate ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            Save your estimate settings as a reusable template
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Template Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Standard 3BR Home"
              data-testid="input-template-name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this template..."
              className="resize-none"
              data-testid="input-template-description"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger data-testid="select-template-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <cat.icon className="w-4 h-4" />
                      {cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Default Sq Ft</label>
              <Input
                type="number"
                value={formData.defaultSquareFootage}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultSquareFootage: parseInt(e.target.value) || 0 }))}
                data-testid="input-template-sqft"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Room Count</label>
              <Input
                type="number"
                value={formData.roomCount}
                onChange={(e) => setFormData(prev => ({ ...prev, roomCount: parseInt(e.target.value) || 0 }))}
                data-testid="input-template-rooms"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Services Included</label>
            <div className="flex flex-wrap gap-2">
              {allServices.map(service => (
                <Button
                  key={service}
                  type="button"
                  variant={(formData.services as string[]).includes(service) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleServiceToggle(service)}
                  className="capitalize"
                  data-testid={`button-service-${service}`}
                >
                  {(formData.services as string[]).includes(service) && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  {service}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createMutation.mutate(formData)}
              disabled={!formData.name || createMutation.isPending}
              data-testid="button-save-template"
            >
              {createMutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectTemplates({ tenantId, onSelectTemplate, className = "" }: ProjectTemplatesProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<ProjectTemplate[]>({
    queryKey: ["/api/project-templates", tenantId],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/project-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/project-templates", tenantId] });
      toast({ title: "Template deleted" });
    },
  });

  const filteredTemplates = selectedCategory 
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const filteredDefaults = selectedCategory
    ? DEFAULT_TEMPLATES.filter(t => t.category === selectedCategory)
    : DEFAULT_TEMPLATES;

  const handleSelectTemplate = (template: Partial<ProjectTemplate>) => {
    if (onSelectTemplate) {
      onSelectTemplate(template as ProjectTemplate);
    }
    toast({
      title: "Template Applied",
      description: `Applied "${template.name}" settings to your estimate`,
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileTemplate className="w-5 h-5 text-primary" />
          Project Templates
        </h3>
        <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-template">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>
      
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {TEMPLATE_CATEGORIES.map(cat => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            <cat.icon className="w-3 h-3 mr-1" />
            {cat.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDefaults.map((template, idx) => (
              <TemplateCard
                key={`default-${idx}`}
                template={template}
                onSelect={() => handleSelectTemplate(template)}
                isDefault
              />
            ))}
            
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleSelectTemplate(template)}
                onEdit={() => {
                  setEditingTemplate(template);
                  setIsCreateOpen(true);
                }}
                onDelete={() => {
                  if (confirm("Delete this template?")) {
                    deleteMutation.mutate(template.id);
                  }
                }}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <CreateTemplateDialog 
        open={isCreateOpen} 
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setEditingTemplate(null);
        }}
        tenantId={tenantId}
        editingTemplate={editingTemplate}
      />
    </div>
  );
}

export default ProjectTemplates;
