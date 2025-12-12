import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { 
  FileText, Plus, Edit2, Trash2, Check, X, Copy, 
  ChevronDown, ChevronRight, Building2, Home, Paintbrush, Eye
} from "lucide-react";
import type { ProposalTemplate } from "@shared/schema";

const CATEGORIES = [
  { value: "interior", label: "Interior", icon: Home, color: "text-blue-400 bg-blue-500/20 border-blue-500/30" },
  { value: "exterior", label: "Exterior", icon: Building2, color: "text-green-400 bg-green-500/20 border-green-500/30" },
  { value: "commercial", label: "Commercial", icon: Building2, color: "text-purple-400 bg-purple-500/20 border-purple-500/30" },
  { value: "residential", label: "Residential", icon: Home, color: "text-gold-400 bg-gold-400/20 border-gold-400/30" },
];

const DEFAULT_TEMPLATE = `# Professional Painting Proposal

## Company Information
{{companyName}}
{{companyPhone}}
{{companyEmail}}

---

## Customer Information
**Name:** {{customerName}}
**Email:** {{customerEmail}}
**Phone:** {{customerPhone}}
**Address:** {{customerAddress}}

---

## Project Scope

{{projectDescription}}

### Work to be Performed:
- Surface preparation and cleaning
- Professional-grade paint application
- Clean-up and inspection

---

## Pricing Breakdown

| Item | Price |
|------|-------|
| Walls | {{wallsPrice}} |
| Trim | {{trimPrice}} |
| Ceilings | {{ceilingsPrice}} |
| Doors | {{doorsPrice}} |
| **Total** | **{{totalAmount}}** |

---

## Timeline
Estimated completion: {{estimatedDays}} business days

---

## Terms & Conditions
1. 50% deposit required to schedule work
2. Balance due upon completion
3. {{warrantyYears}}-year warranty on workmanship
4. Licensed and insured

---

## Acceptance
By signing below, you agree to the terms of this proposal.

Customer Signature: ____________________  Date: ________

`;

interface ProposalTemplateManagerProps {
  compact?: boolean;
  maxHeight?: string;
}

export function ProposalTemplateManager({ compact = false, maxHeight = "400px" }: ProposalTemplateManagerProps) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "interior",
    content: DEFAULT_TEMPLATE,
    isDefault: false,
    isActive: true,
  });

  const { data: templates = [], isLoading } = useQuery<ProposalTemplate[]>({
    queryKey: ["/api/proposal-templates"],
    queryFn: async () => {
      const res = await fetch("/api/proposal-templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/proposal-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-templates"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const res = await fetch(`/api/proposal-templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-templates"] });
      setEditingId(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/proposal-templates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete template");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposal-templates"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "interior",
      content: DEFAULT_TEMPLATE,
      isDefault: false,
      isActive: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (template: ProposalTemplate) => {
    setFormData({
      name: template.name,
      category: template.category,
      content: template.content,
      isDefault: template.isDefault,
      isActive: template.isActive,
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDuplicate = (template: ProposalTemplate) => {
    setFormData({
      name: `${template.name} (Copy)`,
      category: template.category,
      content: template.content,
      isDefault: false,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const getCategoryStyle = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.color || CATEGORIES[0].color;
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.label || category;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold">Proposal Templates</h2>
            <p className="text-xs text-muted-foreground">{templates.length} templates</p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-testid="button-add-template"
        >
          <Plus className="w-4 h-4" />
          {!compact && <span>New Template</span>}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Template Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Interior Full Repaint"
                    className="bg-black/30 border-white/20"
                    data-testid="input-template-name"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <motion.button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          formData.category === cat.value
                            ? cat.color + " ring-2 ring-white/20"
                            : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {cat.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Template Content (Markdown)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter template content with placeholders like {{customerName}}, {{totalAmount}}, etc."
                  className="w-full h-48 bg-black/30 border border-white/20 rounded-lg p-3 text-sm font-mono resize-y"
                  data-testid="input-template-content"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20"
                  />
                  <span className="text-sm">Set as default</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  disabled={!formData.name.trim() || createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-accent text-white font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="button-save-template"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  {editingId ? "Update" : "Create"} Template
                </motion.button>
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className={`space-y-2 overflow-y-auto pr-2 custom-scrollbar`} style={{ maxHeight }}>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">No templates yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Create your first proposal template</p>
          </div>
        ) : (
          templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border transition-all ${
                template.isActive
                  ? "bg-white/5 border-white/10"
                  : "bg-white/2 border-white/5 opacity-60"
              }`}
            >
              <div className="p-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => setExpandedId(expandedId === template.id ? null : template.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                  data-testid={`template-row-${template.id}`}
                >
                  {expandedId === template.id ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border shrink-0 ${getCategoryStyle(template.category)}`}>
                      {getCategoryLabel(template.category)}
                    </span>
                    <span className="truncate font-medium">{template.name}</span>
                    {template.isDefault && (
                      <span className="px-2 py-0.5 rounded bg-gold-400/20 text-gold-400 text-xs border border-gold-400/30">
                        Default
                      </span>
                    )}
                  </div>
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    onClick={() => handleDuplicate(template)}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Duplicate"
                    data-testid={`button-duplicate-template-${template.id}`}
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleEdit(template)}
                    className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit"
                    data-testid={`button-edit-template-${template.id}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => deleteMutation.mutate(template.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                    data-testid={`button-delete-template-${template.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === template.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden border-t border-white/10"
                  >
                    <div className="p-4 bg-black/20">
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        Preview
                      </div>
                      <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto bg-black/30 rounded-lg p-3">
                        {template.content.slice(0, 500)}
                        {template.content.length > 500 && "..."}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
