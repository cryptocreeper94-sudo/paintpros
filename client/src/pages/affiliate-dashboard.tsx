import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Copy,
  Check,
  Users,
  UserCheck,
  Wallet,
  DollarSign,
  ArrowRight,
  Link as LinkIcon,
  Trophy,
  Star,
  Gem,
  Crown,
  Award,
  Loader2,
  ExternalLink,
  Clock,
  CircleDot,
} from "lucide-react";
import { useState } from "react";

interface TierInfo {
  name: string;
  rate: number;
  convertedCount: number;
  nextTier: { name: string; minReferrals: number; rate: number } | null;
}

interface DashboardStats {
  totalReferrals: number;
  convertedReferrals: number;
  pendingReferrals: number;
  pendingEarnings: string;
  paidEarnings: string;
}

interface Referral {
  id: number;
  referralHash: string;
  platform: string;
  status: string;
  createdAt: string;
  convertedAt: string | null;
}

interface Commission {
  id: number;
  amount: string;
  currency: string;
  tier: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

interface TierDef {
  name: string;
  minReferrals: number;
  rate: number;
}

interface AffiliateDashboardData {
  userId: string;
  uniqueHash: string;
  tier: TierInfo;
  stats: DashboardStats;
  referrals: Referral[];
  commissions: Commission[];
  tiers: TierDef[];
}

interface EcosystemApp {
  id: number;
  name: string;
  prefix: string;
  genesis: string;
  domain: string;
}

interface AffiliateLinkData {
  referralHash: string;
  link: string;
  platforms: Record<string, string>;
  ecosystem: EcosystemApp[];
}

interface GenesisHallmark {
  verified: boolean;
  hallmark: {
    hallmarkNumber: string;
    assetType: string;
    recipientName: string;
    metadata: Record<string, unknown>;
    createdAt: string;
  };
}

const TIER_ICONS: Record<string, typeof Star> = {
  Base: Star,
  Silver: Award,
  Gold: Trophy,
  Platinum: Crown,
  Diamond: Gem,
};

const TIER_COLORS: Record<string, string> = {
  Base: "text-muted-foreground",
  Silver: "text-slate-400",
  Gold: "text-amber-500",
  Platinum: "text-blue-400",
  Diamond: "text-violet-400",
};

function GenesisHallmarkBadge() {
  const { data, isLoading } = useQuery<GenesisHallmark>({
    queryKey: ["/api/hallmark/genesis"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-md border border-border bg-card">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading genesis hallmark...</span>
      </div>
    );
  }

  if (!data?.verified) return null;

  return (
    <Card data-testid="card-genesis-hallmark">
      <CardContent className="flex items-center gap-3 p-4 flex-wrap">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" data-testid="text-genesis-hallmark-number">
            Genesis Hallmark {data.hallmark.hallmarkNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            Trust Layer Verified &middot; {data.hallmark.recipientName}
          </p>
        </div>
        <Badge variant="outline" data-testid="badge-genesis-verified">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      </CardContent>
    </Card>
  );
}

function ReferralLinkSection({ linkData }: { linkData: AffiliateLinkData | undefined }) {
  const [copied, setCopied] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);

  const handleCopy = (text?: string) => {
    if (!text && !linkData?.link) return;
    navigator.clipboard.writeText(text || linkData!.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!linkData) return null;

  const ecosystem = linkData.ecosystem || [];
  const visibleApps = showAllApps ? ecosystem : ecosystem.slice(0, 9);

  return (
    <>
      <Card data-testid="card-referral-link">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
            <LinkIcon className="w-4 h-4" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0 p-2 rounded-md bg-muted text-sm font-mono truncate" data-testid="text-referral-link">
              {linkData.link}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleCopy()}
              data-testid="button-copy-link"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your unique affiliate ID works across all 33 Trust Layer ecosystem platforms
          </p>
        </CardContent>
      </Card>

      {ecosystem.length > 0 && (
        <Card data-testid="card-ecosystem-registry">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 flex-wrap">
              <Shield className="w-4 h-4" />
              Trust Layer Ecosystem ({ecosystem.length} Platforms)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {visibleApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-2 p-2 rounded-md border border-border text-sm"
                  data-testid={`row-ecosystem-app-${app.id}`}
                >
                  <Badge variant="outline" className="font-mono text-xs shrink-0 w-8 justify-center">
                    {app.prefix}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{app.name}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{app.genesis}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 h-7 w-7"
                    onClick={() => handleCopy(`https://${app.domain}/ref/${linkData.referralHash}`)}
                    data-testid={`button-copy-${app.prefix.toLowerCase()}`}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            {ecosystem.length > 9 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowAllApps(!showAllApps)}
                data-testid="button-toggle-ecosystem"
              >
                {showAllApps ? "Show Less" : `Show All ${ecosystem.length} Platforms`}
                <ArrowRight className={`w-3 h-3 ml-1 transition-transform ${showAllApps ? "rotate-90" : ""}`} />
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

function TierProgressBar({ tier, tiers }: { tier: TierInfo; tiers: TierDef[] }) {
  const currentIndex = tiers.findIndex((t) => t.name === tier.name);
  const progressPercent = ((currentIndex + 1) / tiers.length) * 100;

  return (
    <Card data-testid="card-tier-progress">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 flex-wrap">
          <Trophy className="w-4 h-4" />
          Tier Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {(() => {
            const Icon = TIER_ICONS[tier.name] || Star;
            return <Icon className={`w-6 h-6 ${TIER_COLORS[tier.name] || ""}`} />;
          })()}
          <div>
            <p className="font-semibold" data-testid="text-current-tier">{tier.name} Tier</p>
            <p className="text-xs text-muted-foreground">
              {(tier.rate * 100).toFixed(1)}% commission rate
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{tier.convertedCount} converted referrals</span>
            {tier.nextTier && (
              <span>{tier.nextTier.minReferrals} needed for {tier.nextTier.name}</span>
            )}
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
              data-testid="progress-tier"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {tiers.map((t, i) => {
            const Icon = TIER_ICONS[t.name] || Star;
            const isActive = i <= currentIndex;
            return (
              <div
                key={t.name}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground"
                }`}
                data-testid={`tier-step-${t.name.toLowerCase()}`}
              >
                <Icon className="w-3 h-3" />
                {t.name}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function CommissionTierTable({ tiers, currentTierName }: { tiers: TierDef[]; currentTierName: string }) {
  return (
    <Card data-testid="card-commission-tiers">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 flex-wrap">
          <Award className="w-4 h-4" />
          Commission Tiers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground px-2 pb-1">
            <span>Tier</span>
            <span>Min Referrals</span>
            <span>Commission</span>
          </div>
          {tiers.map((t) => {
            const Icon = TIER_ICONS[t.name] || Star;
            const isCurrent = t.name === currentTierName;
            return (
              <div
                key={t.name}
                className={`grid grid-cols-3 gap-2 items-center px-2 py-2 rounded-md text-sm ${
                  isCurrent ? "bg-primary/10 font-medium" : ""
                }`}
                data-testid={`row-tier-${t.name.toLowerCase()}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${TIER_COLORS[t.name] || ""}`} />
                  <span>{t.name}</span>
                  {isCurrent && (
                    <Badge variant="outline" className="text-xs ml-1">
                      Current
                    </Badge>
                  )}
                </div>
                <span>{t.minReferrals}+</span>
                <span>{(t.rate * 100).toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AffiliateDashboard() {
  const { toast } = useToast();

  const { data: dashboard, isLoading: dashLoading } = useQuery<AffiliateDashboardData>({
    queryKey: ["/api/affiliate/dashboard"],
  });

  const { data: linkData, isLoading: linkLoading } = useQuery<AffiliateLinkData>({
    queryKey: ["/api/affiliate/link"],
  });

  const payoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/affiliate/request-payout");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Payout requested", description: "Your payout request has been submitted." });
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/dashboard"] });
    },
    onError: (err: Error) => {
      toast({ title: "Payout failed", description: err.message, variant: "destructive" });
    },
  });

  const pendingAmount = parseFloat(dashboard?.stats.pendingEarnings || "0");
  const canPayout = pendingAmount >= 10;

  if (dashLoading || linkLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Affiliate Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Earn commissions by referring users across 33 Trust Layer ecosystem platforms
          </p>
        </div>

        <GenesisHallmarkBadge />

        <ReferralLinkSection linkData={linkData} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card data-testid="card-stat-total-referrals">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-referrals">
                    {dashboard?.stats.totalReferrals ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-converted">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-converted-referrals">
                    {dashboard?.stats.convertedReferrals ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Converted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-pending-earnings">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-pending-earnings">
                    {dashboard?.stats.pendingEarnings ?? "0.00"} SIG
                  </p>
                  <p className="text-xs text-muted-foreground">Pending Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-paid-earnings">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-paid-earnings">
                    {dashboard?.stats.paidEarnings ?? "0.00"} SIG
                  </p>
                  <p className="text-xs text-muted-foreground">Paid Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {dashboard && (
          <TierProgressBar tier={dashboard.tier} tiers={dashboard.tiers} />
        )}

        {dashboard && (
          <CommissionTierTable tiers={dashboard.tiers} currentTierName={dashboard.tier.name} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-recent-referrals">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                <Users className="w-4 h-4" />
                Recent Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!dashboard?.referrals || dashboard.referrals.length === 0) ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No referrals yet. Share your link to get started.
                </p>
              ) : (
                <div className="space-y-2">
                  {dashboard.referrals.map((ref) => (
                    <div
                      key={ref.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md border border-border text-sm flex-wrap"
                      data-testid={`row-referral-${ref.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono text-xs truncate max-w-[120px]">
                          {ref.referralHash.slice(0, 8)}...
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {ref.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={ref.status === "converted" ? "default" : "outline"}
                          className="text-xs"
                          data-testid={`badge-referral-status-${ref.id}`}
                        >
                          {ref.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-recent-commissions">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                <DollarSign className="w-4 h-4" />
                Recent Commissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!dashboard?.commissions || dashboard.commissions.length === 0) ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No commissions yet. Earn by converting referrals.
                </p>
              ) : (
                <div className="space-y-2">
                  {dashboard.commissions.map((comm) => (
                    <div
                      key={comm.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md border border-border text-sm flex-wrap"
                      data-testid={`row-commission-${comm.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span className="font-semibold">
                          {comm.amount} {comm.currency}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {comm.tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={comm.status === "paid" ? "default" : "outline"}
                          className="text-xs"
                          data-testid={`badge-commission-status-${comm.id}`}
                        >
                          {comm.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => payoutMutation.mutate()}
            disabled={!canPayout || payoutMutation.isPending}
            data-testid="button-request-payout"
          >
            {payoutMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Request Payout
            {!canPayout && (
              <span className="ml-1 text-xs">(min 10 SIG)</span>
            )}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
