import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Building2, Key, MapPin, Plus, Trash2, Copy, Eye, EyeOff, 
  RefreshCw, Clock, Globe, Activity, DollarSign, Users,
  CheckCircle, XCircle, AlertCircle, Loader2, Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { PARTNER_API_SCOPES } from "@shared/schema";

interface Franchise {
  id: string;
  franchiseId: string;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerCompany: string | null;
  ownerPhone: string | null;
  territoryName: string;
  territoryRegion: string | null;
  territoryExclusive: boolean | null;
  franchiseTier: string | null;
  platformFeeMonthly: string | null;
  royaltyPercent: string | null;
  status: string | null;
  totalOrders: number | null;
  totalRevenue: string | null;
  createdAt: Date | null;
}

interface ApiCredential {
  id: string;
  franchiseId: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  environment: string | null;
  scopes: string[] | null;
  rateLimitPerMinute: number | null;
  rateLimitPerDay: number | null;
  requestCount: number | null;
  lastUsedAt: Date | null;
  isActive: boolean | null;
  createdAt: Date | null;
}

interface ApiLog {
  id: string;
  method: string;
  endpoint: string;
  statusCode: number | null;
  responseTimeMs: number | null;
  createdAt: Date | null;
}

export function FranchiseManagement() {
  const queryClient = useQueryClient();
  const [selectedFranchise, setSelectedFranchise] = useState<Franchise | null>(null);
  const [showCreateFranchise, setShowCreateFranchise] = useState(false);
  const [showCreateCredential, setShowCreateCredential] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [newCredential, setNewCredential] = useState<ApiCredential | null>(null);
  
  const [franchiseForm, setFranchiseForm] = useState({
    franchiseId: "",
    territoryName: "",
    territoryRegion: "",
    ownerName: "",
    ownerEmail: "",
    ownerCompany: "",
    ownerPhone: "",
    franchiseTier: "standard",
    platformFeeMonthly: "299",
    royaltyPercent: "5",
    status: "pending"
  });

  const [credentialForm, setCredentialForm] = useState({
    name: "",
    environment: "production",
    scopes: ["estimates:read", "leads:read"]
  });

  const { data: franchises = [], isLoading: franchisesLoading } = useQuery<Franchise[]>({
    queryKey: ["/api/franchises"]
  });

  const { data: credentials = [], isLoading: credentialsLoading } = useQuery<ApiCredential[]>({
    queryKey: ["/api/franchises", selectedFranchise?.id, "credentials"],
    enabled: !!selectedFranchise
  });

  const { data: apiLogs = [] } = useQuery<ApiLog[]>({
    queryKey: ["/api/franchises", selectedFranchise?.id, "api-logs"],
    enabled: !!selectedFranchise
  });

  const createFranchiseMutation = useMutation({
    mutationFn: async (data: typeof franchiseForm) => {
      const res = await apiRequest("POST", "/api/franchises", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/franchises"] });
      setShowCreateFranchise(false);
      setFranchiseForm({
        franchiseId: "",
        territoryName: "",
        territoryRegion: "",
        ownerName: "",
        ownerEmail: "",
        ownerCompany: "",
        ownerPhone: "",
        franchiseTier: "standard",
        platformFeeMonthly: "299",
        royaltyPercent: "5",
        status: "pending"
      });
      toast.success("Franchise created successfully");
    },
    onError: () => toast.error("Failed to create franchise")
  });

  const updateFranchiseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Franchise> }) => {
      const res = await apiRequest("PUT", `/api/franchises/${id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/franchises"] });
      toast.success("Franchise updated");
    },
    onError: () => toast.error("Failed to update franchise")
  });

  const deleteFranchiseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/franchises/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/franchises"] });
      setSelectedFranchise(null);
      toast.success("Franchise deleted");
    },
    onError: () => toast.error("Failed to delete franchise")
  });

  const createCredentialMutation = useMutation({
    mutationFn: async (data: typeof credentialForm) => {
      const res = await apiRequest("POST", `/api/franchises/${selectedFranchise?.id}/credentials`, data);
      return await res.json() as ApiCredential;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/franchises", selectedFranchise?.id, "credentials"] });
      setNewCredential(data);
      setCredentialForm({ name: "", environment: "production", scopes: ["estimates:read", "leads:read"] });
      toast.success("API credential created - save the secret now!");
    },
    onError: () => toast.error("Failed to create credential")
  });

  const updateCredentialMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ApiCredential> }) => {
      const res = await apiRequest("PUT", `/api/franchises/${selectedFranchise?.id}/credentials/${id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/franchises", selectedFranchise?.id, "credentials"] });
      toast.success("Credential updated");
    },
    onError: () => toast.error("Failed to update credential")
  });

  const deleteCredentialMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/franchises/${selectedFranchise?.id}/credentials/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/franchises", selectedFranchise?.id, "credentials"] });
      toast.success("Credential deleted");
    },
    onError: () => toast.error("Failed to delete credential")
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleRevealSecret = (id: string) => {
    setRevealedSecrets(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "suspended": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (franchisesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Franchise Management
          </h2>
          <p className="text-muted-foreground text-sm">Manage territories, API access, and partner integrations</p>
        </div>
        <Dialog open={showCreateFranchise} onOpenChange={setShowCreateFranchise}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-franchise">
              <Plus className="w-4 h-4 mr-2" />
              New Franchise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Franchise</DialogTitle>
              <DialogDescription>Add a new franchise territory</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Franchise ID</Label>
                  <Input
                    placeholder="NPP-001"
                    value={franchiseForm.franchiseId}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, franchiseId: e.target.value }))}
                    data-testid="input-franchise-id"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Territory Name</Label>
                  <Input
                    placeholder="Nashville Metro"
                    value={franchiseForm.territoryName}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, territoryName: e.target.value }))}
                    data-testid="input-territory-name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <Input
                    placeholder="John Smith"
                    value={franchiseForm.ownerName}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, ownerName: e.target.value }))}
                    data-testid="input-owner-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Owner Email</Label>
                  <Input
                    type="email"
                    placeholder="owner@company.com"
                    value={franchiseForm.ownerEmail}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, ownerEmail: e.target.value }))}
                    data-testid="input-owner-email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Company LLC"
                    value={franchiseForm.ownerCompany}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, ownerCompany: e.target.value }))}
                    data-testid="input-owner-company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input
                    placeholder="Tennessee"
                    value={franchiseForm.territoryRegion}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, territoryRegion: e.target.value }))}
                    data-testid="input-territory-region"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tier</Label>
                  <Select value={franchiseForm.franchiseTier} onValueChange={(v) => setFranchiseForm(prev => ({ ...prev, franchiseTier: v }))}>
                    <SelectTrigger data-testid="select-franchise-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Fee</Label>
                  <Input
                    type="number"
                    value={franchiseForm.platformFeeMonthly}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, platformFeeMonthly: e.target.value }))}
                    data-testid="input-platform-fee"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Royalty %</Label>
                  <Input
                    type="number"
                    value={franchiseForm.royaltyPercent}
                    onChange={(e) => setFranchiseForm(prev => ({ ...prev, royaltyPercent: e.target.value }))}
                    data-testid="input-royalty-percent"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateFranchise(false)}>Cancel</Button>
              <Button 
                onClick={() => createFranchiseMutation.mutate(franchiseForm)}
                disabled={createFranchiseMutation.isPending || !franchiseForm.franchiseId || !franchiseForm.territoryName}
                data-testid="button-submit-franchise"
              >
                {createFranchiseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Franchise
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Franchises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
              {franchises.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No franchises yet</p>
              ) : (
                franchises.map((franchise) => (
                  <div
                    key={franchise.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFranchise?.id === franchise.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedFranchise(franchise)}
                    data-testid={`franchise-card-${franchise.franchiseId}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{franchise.territoryName}</div>
                        <div className="text-xs text-muted-foreground">{franchise.franchiseId}</div>
                      </div>
                      <Badge className={getStatusColor(franchise.status)}>
                        {franchise.status}
                      </Badge>
                    </div>
                    {franchise.ownerCompany && (
                      <div className="text-xs text-muted-foreground mt-1">{franchise.ownerCompany}</div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedFranchise ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedFranchise.territoryName}
                      <Badge className={getStatusColor(selectedFranchise.status)}>
                        {selectedFranchise.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{selectedFranchise.franchiseId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={selectedFranchise.status || "pending"} 
                      onValueChange={(v) => updateFranchiseMutation.mutate({ id: selectedFranchise.id, updates: { status: v } })}
                    >
                      <SelectTrigger className="w-32" data-testid="select-franchise-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete this franchise and all associated data?")) {
                          deleteFranchiseMutation.mutate(selectedFranchise.id);
                        }
                      }}
                      data-testid="button-delete-franchise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
                    <TabsTrigger value="api" data-testid="tab-api">API Keys</TabsTrigger>
                    <TabsTrigger value="logs" data-testid="tab-logs">API Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Owner</div>
                        <div className="font-medium">{selectedFranchise.ownerName || "Not set"}</div>
                        <div className="text-sm text-muted-foreground">{selectedFranchise.ownerEmail}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Company</div>
                        <div className="font-medium">{selectedFranchise.ownerCompany || "Not set"}</div>
                        <div className="text-sm text-muted-foreground">{selectedFranchise.ownerPhone}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Monthly Fee
                        </div>
                        <div className="font-medium text-lg">${selectedFranchise.platformFeeMonthly || "0"}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Royalty</div>
                        <div className="font-medium text-lg">{selectedFranchise.royaltyPercent || "0"}%</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground">Tier</div>
                        <div className="font-medium text-lg capitalize">{selectedFranchise.franchiseTier}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Total Orders
                        </div>
                        <div className="font-medium text-2xl">{selectedFranchise.totalOrders || 0}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Total Revenue
                        </div>
                        <div className="font-medium text-2xl">${selectedFranchise.totalRevenue || "0.00"}</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="api" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Manage API keys for programmatic access
                      </div>
                      <Dialog open={showCreateCredential} onOpenChange={setShowCreateCredential}>
                        <DialogTrigger asChild>
                          <Button size="sm" data-testid="button-create-api-key">
                            <Key className="w-4 h-4 mr-2" />
                            New API Key
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create API Credential</DialogTitle>
                            <DialogDescription>Generate a new API key for this franchise</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                placeholder="Production API"
                                value={credentialForm.name}
                                onChange={(e) => setCredentialForm(prev => ({ ...prev, name: e.target.value }))}
                                data-testid="input-credential-name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Environment</Label>
                              <Select value={credentialForm.environment} onValueChange={(v) => setCredentialForm(prev => ({ ...prev, environment: v }))}>
                                <SelectTrigger data-testid="select-credential-environment">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="production">Production</SelectItem>
                                  <SelectItem value="sandbox">Sandbox</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Scopes</Label>
                              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                                {PARTNER_API_SCOPES.map((scope) => (
                                  <label key={scope} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={credentialForm.scopes.includes(scope)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setCredentialForm(prev => ({ ...prev, scopes: [...prev.scopes, scope] }));
                                        } else {
                                          setCredentialForm(prev => ({ ...prev, scopes: prev.scopes.filter(s => s !== scope) }));
                                        }
                                      }}
                                      data-testid={`checkbox-scope-${scope}`}
                                    />
                                    {scope}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCreateCredential(false)}>Cancel</Button>
                            <Button
                              onClick={() => createCredentialMutation.mutate(credentialForm)}
                              disabled={createCredentialMutation.isPending || !credentialForm.name}
                              data-testid="button-submit-credential"
                            >
                              {createCredentialMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              Generate Key
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {newCredential && (
                      <div className="p-4 border-2 border-yellow-500 rounded-lg bg-yellow-500/10">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-yellow-500">Save these credentials now!</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">API Key</Label>
                            <div className="flex gap-2">
                              <Input value={newCredential.apiKey} readOnly className="font-mono text-xs" />
                              <Button size="icon" variant="outline" onClick={() => copyToClipboard(newCredential.apiKey, "API Key")}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">API Secret (only shown once)</Label>
                            <div className="flex gap-2">
                              <Input value={newCredential.apiSecret} readOnly className="font-mono text-xs" />
                              <Button size="icon" variant="outline" onClick={() => copyToClipboard(newCredential.apiSecret, "API Secret")}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" className="mt-3 w-full" onClick={() => setNewCredential(null)}>
                          I've saved these credentials
                        </Button>
                      </div>
                    )}

                    {credentialsLoading ? (
                      <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : credentials.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No API keys created yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {credentials.map((cred) => (
                          <div key={cred.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span className="font-medium">{cred.name}</span>
                                <Badge variant="outline" className="text-xs">{cred.environment}</Badge>
                                {cred.isActive ? (
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                                ) : (
                                  <Badge className="bg-red-500/20 text-red-400 text-xs">Disabled</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={cred.isActive ?? false}
                                  onCheckedChange={(checked) => updateCredentialMutation.mutate({ id: cred.id, updates: { isActive: checked } })}
                                  data-testid={`switch-credential-${cred.id}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteCredentialMutation.mutate(cred.id)}
                                  data-testid={`button-delete-credential-${cred.id}`}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                              <code>{cred.apiKey}</code>
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyToClipboard(cred.apiKey, "API Key")}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{cred.requestCount || 0} requests</span>
                              {cred.lastUsedAt && <span>Last used: {new Date(cred.lastUsedAt).toLocaleDateString()}</span>}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(cred.scopes || []).map((scope) => (
                                <Badge key={scope} variant="secondary" className="text-xs">{scope}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="logs" className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Recent API requests from this franchise
                    </div>
                    {apiLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No API requests yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {apiLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between p-2 border rounded text-sm">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono text-xs">{log.method}</Badge>
                              <span className="font-mono text-xs truncate max-w-[200px]">{log.endpoint}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <Badge className={log.statusCode && log.statusCode < 400 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                                {log.statusCode}
                              </Badge>
                              <span>{log.responseTimeMs}ms</span>
                              <span>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ""}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Select a franchise to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}