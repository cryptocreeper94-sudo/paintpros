import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Facebook,
  Instagram,
  Settings,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Link2,
  Unlink
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

interface Subscriber {
  id: string;
  tenantId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  website?: string;
  status: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  metaConnected: boolean;
  facebookPageId?: string;
  facebookPageName?: string;
  instagramAccountId?: string;
  instagramUsername?: string;
  postingSchedule: string;
  monthlyPrice: string;
  activatedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AutopilotAdmin() {
  const { toast } = useToast();
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [metaCredentials, setMetaCredentials] = useState({
    facebookPageId: "",
    facebookPageName: "",
    instagramAccountId: "",
    instagramUsername: "",
    accessToken: ""
  });

  // Fetch all subscribers
  const { data: subscribers = [], isLoading, refetch } = useQuery<Subscriber[]>({
    queryKey: ["/api/marketing-autopilot/all"],
  });

  // Activate subscriber mutation
  const activateMutation = useMutation({
    mutationFn: async (subscriberId: string) => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/activate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-autopilot/all"] });
      toast({ title: "Subscriber activated" });
    },
    onError: () => {
      toast({ title: "Failed to activate", variant: "destructive" });
    }
  });

  // Pause subscriber mutation
  const pauseMutation = useMutation({
    mutationFn: async (subscriberId: string) => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/pause`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-autopilot/all"] });
      toast({ title: "Subscriber paused" });
    },
    onError: () => {
      toast({ title: "Failed to pause", variant: "destructive" });
    }
  });

  // Connect Meta mutation
  const connectMetaMutation = useMutation({
    mutationFn: async ({ subscriberId, credentials }: { subscriberId: string; credentials: typeof metaCredentials }) => {
      return apiRequest("POST", `/api/marketing-autopilot/${subscriberId}/connect-meta`, credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-autopilot/all"] });
      setConnectDialogOpen(false);
      setMetaCredentials({ facebookPageId: "", facebookPageName: "", instagramAccountId: "", instagramUsername: "", accessToken: "" });
      toast({ title: "Meta connected successfully" });
    },
    onError: () => {
      toast({ title: "Failed to connect Meta", variant: "destructive" });
    }
  });

  const pendingSubscribers = subscribers.filter(s => s.status === 'pending');
  const activeSubscribers = subscribers.filter(s => s.status === 'active');
  const pausedSubscribers = subscribers.filter(s => s.status === 'paused');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'paused':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30"><Pause className="w-3 h-3 mr-1" />Paused</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const SubscriberCard = ({ subscriber }: { subscriber: Subscriber }) => (
    <Card className="bg-slate-800/50 border-slate-700 hover-elevate">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              {subscriber.businessName}
            </h3>
            <p className="text-sm text-slate-400">{subscriber.ownerName}</p>
          </div>
          {getStatusBadge(subscriber.status)}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Mail className="w-3 h-3" />
            <span>{subscriber.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Phone className="w-3 h-3" />
            <span>{subscriber.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>Signed up: {format(new Date(subscriber.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <DollarSign className="w-3 h-3" />
            <span>${subscriber.monthlyPrice}/month</span>
          </div>
        </div>

        {/* Meta Connection Status */}
        <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 uppercase">Social Accounts</span>
            {subscriber.metaConnected ? (
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                <Link2 className="w-3 h-3 mr-1" />Connected
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                <Unlink className="w-3 h-3 mr-1" />Not Connected
              </Badge>
            )}
          </div>
          {subscriber.metaConnected ? (
            <div className="space-y-1 text-xs text-slate-400">
              {subscriber.facebookPageName && (
                <div className="flex items-center gap-2">
                  <Facebook className="w-3 h-3 text-blue-500" />
                  <span>{subscriber.facebookPageName}</span>
                </div>
              )}
              {subscriber.instagramUsername && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-3 h-3 text-pink-500" />
                  <span>@{subscriber.instagramUsername}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Click "Connect Meta" to link their accounts</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!subscriber.metaConnected && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedSubscriber(subscriber);
                setConnectDialogOpen(true);
              }}
              data-testid={`button-connect-meta-${subscriber.id}`}
            >
              <Facebook className="w-3 h-3 mr-1" />
              Connect Meta
            </Button>
          )}
          
          {subscriber.status === 'pending' && subscriber.metaConnected && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => activateMutation.mutate(subscriber.id)}
              disabled={activateMutation.isPending}
              data-testid={`button-activate-${subscriber.id}`}
            >
              {activateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
              Activate
            </Button>
          )}
          
          {subscriber.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => pauseMutation.mutate(subscriber.id)}
              disabled={pauseMutation.isPending}
              data-testid={`button-pause-${subscriber.id}`}
            >
              {pauseMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3 mr-1" />}
              Pause
            </Button>
          )}
          
          {subscriber.status === 'paused' && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => activateMutation.mutate(subscriber.id)}
              disabled={activateMutation.isPending}
              data-testid={`button-resume-${subscriber.id}`}
            >
              {activateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
              Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Marketing Autopilot</h1>
            <p className="text-slate-400">Manage your subscription clients</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/autopilot">
              <Button data-testid="button-view-landing">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Landing Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{subscribers.length}</p>
                  <p className="text-xs text-slate-400">Total Subscribers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activeSubscribers.length}</p>
                  <p className="text-xs text-slate-400">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pendingSubscribers.length}</p>
                  <p className="text-xs text-slate-400">Pending Setup</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">${activeSubscribers.length * 59}</p>
                  <p className="text-xs text-slate-400">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500/20">
              Pending ({pendingSubscribers.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-green-500/20">
              Active ({activeSubscribers.length})
            </TabsTrigger>
            <TabsTrigger value="paused" className="data-[state=active]:bg-slate-500/20">
              Paused ({pausedSubscribers.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({subscribers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingSubscribers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No pending subscribers</p>
                  <p className="text-sm text-slate-500">New signups will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingSubscribers.map(sub => (
                  <SubscriberCard key={sub.id} subscriber={sub} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeSubscribers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No active subscribers yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSubscribers.map(sub => (
                  <SubscriberCard key={sub.id} subscriber={sub} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="paused">
            {pausedSubscribers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Pause className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No paused subscribers</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pausedSubscribers.map(sub => (
                  <SubscriberCard key={sub.id} subscriber={sub} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all">
            {subscribers.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No subscribers yet</p>
                  <p className="text-sm text-slate-500 mt-2">Share your landing page to get started</p>
                  <Link href="/autopilot">
                    <Button className="mt-4" data-testid="button-view-landing-empty">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Landing Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscribers.map(sub => (
                  <SubscriberCard key={sub.id} subscriber={sub} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Connect Meta Dialog */}
        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Connect Meta for {selectedSubscriber?.businessName}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <p className="text-sm text-slate-400">
                Enter the Facebook and Instagram details for this business. You'll need to get these from their Meta Business Suite.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Facebook Page ID</Label>
                  <Input
                    placeholder="e.g., 1234567890"
                    value={metaCredentials.facebookPageId}
                    onChange={(e) => setMetaCredentials({ ...metaCredentials, facebookPageId: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white mt-1"
                    data-testid="input-facebook-page-id"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Facebook Page Name</Label>
                  <Input
                    placeholder="e.g., Johnson's Painting LLC"
                    value={metaCredentials.facebookPageName}
                    onChange={(e) => setMetaCredentials({ ...metaCredentials, facebookPageName: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white mt-1"
                    data-testid="input-facebook-page-name"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Instagram Account ID</Label>
                  <Input
                    placeholder="e.g., 17841400000000000"
                    value={metaCredentials.instagramAccountId}
                    onChange={(e) => setMetaCredentials({ ...metaCredentials, instagramAccountId: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white mt-1"
                    data-testid="input-instagram-account-id"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Instagram Username</Label>
                  <Input
                    placeholder="e.g., johnsonspainting"
                    value={metaCredentials.instagramUsername}
                    onChange={(e) => setMetaCredentials({ ...metaCredentials, instagramUsername: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white mt-1"
                    data-testid="input-instagram-username"
                  />
                </div>
                
                <div>
                  <Label className="text-slate-300">Page Access Token</Label>
                  <Input
                    placeholder="Long-lived page access token"
                    value={metaCredentials.accessToken}
                    onChange={(e) => setMetaCredentials({ ...metaCredentials, accessToken: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white mt-1"
                    data-testid="input-access-token"
                  />
                  <p className="text-xs text-slate-500 mt-1">Get this from Meta Graph API Explorer or their Business Suite</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setConnectDialogOpen(false)}
                  className="flex-1"
                  data-testid="button-cancel-connect"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedSubscriber) {
                      connectMetaMutation.mutate({
                        subscriberId: selectedSubscriber.id,
                        credentials: metaCredentials
                      });
                    }
                  }}
                  disabled={connectMetaMutation.isPending || !metaCredentials.facebookPageId}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  data-testid="button-save-meta"
                >
                  {connectMetaMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
