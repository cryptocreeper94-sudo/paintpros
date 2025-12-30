import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Coins, 
  AlertTriangle,
  Calculator,
  Settings,
  Plus,
  CreditCard,
  Sparkles,
  Image,
  Star,
  Calendar,
  Users,
  ArrowRight,
  Loader2,
  Rocket
} from "lucide-react";

interface CreditBalance {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

function formatCentsToDollars(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function SubscriberDashboard() {
  const tenant = useTenant();

  const { data: balance, isLoading: balanceLoading } = useQuery<CreditBalance>({
    queryKey: ['/api/credits', tenant.id, 'balance'],
    enabled: !!tenant.id,
  });

  const isLowBalance = (balance?.balance ?? 0) < 500;

  const fullSuiteBenefits = [
    { icon: Image, text: "Portfolio Showcase" },
    { icon: Star, text: "Review Management" },
    { icon: Calendar, text: "Online Booking" },
    { icon: Users, text: "CRM & Lead Tracking" },
  ];

  return (
    <PageLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-welcome-message">
              Welcome, {tenant.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your AI-powered estimator
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm" data-testid="badge-subscription-tier">
              <Calculator className="w-3 h-3 mr-1" />
              Estimator Plan
            </Badge>
            <Link href="/pricing">
              <Button variant="outline" size="sm" data-testid="link-upgrade-header">
                <Rocket className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card data-testid="card-ai-credits">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-accent" />
                  AI Credits
                </CardTitle>
                <CardDescription>Your current credit balance</CardDescription>
              </div>
              {isLowBalance && !balanceLoading && (
                <Badge variant="destructive" className="flex items-center gap-1" data-testid="badge-low-balance">
                  <AlertTriangle className="w-3 h-3" />
                  Low Balance
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {balanceLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
                    <div className="text-3xl font-bold" data-testid="text-credit-balance">
                      {formatCentsToDollars(balance?.balance ?? 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(balance?.balance ?? 0).toLocaleString()} credits available
                    </div>
                  </div>
                  {isLowBalance && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm" data-testid="text-low-balance-warning">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        Your balance is running low. Purchase more credits to continue using AI features.
                      </div>
                    </div>
                  )}
                  <Link href="/credits">
                    <Button className="w-full" data-testid="button-buy-credits">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Buy Credits
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-estimator-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                Estimator Tools
              </CardTitle>
              <CardDescription>Access your estimator and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/estimate">
                <div className="p-4 rounded-lg bg-muted/50 hover-elevate cursor-pointer flex items-center justify-between gap-4" data-testid="link-estimator">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-accent/10">
                      <Calculator className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium">AI Estimator</div>
                      <div className="text-sm text-muted-foreground">Create instant estimates</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
              <Link href="/estimator-config">
                <div className="p-4 rounded-lg bg-muted/50 hover-elevate cursor-pointer flex items-center justify-between gap-4" data-testid="link-estimator-config">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-accent/10">
                      <Settings className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium">Configure Pricing</div>
                      <div className="text-sm text-muted-foreground">Customize your rates</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-quick-actions">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/estimate">
                <Button data-testid="button-create-estimate">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Estimate
                </Button>
              </Link>
              <Link href="/credits">
                <Button variant="outline" data-testid="button-view-credits">
                  <Coins className="w-4 h-4 mr-2" />
                  View Credits
                </Button>
              </Link>
              <Link href="/estimator-config">
                <Button variant="outline" data-testid="button-configure-pricing">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-accent/5" data-testid="card-upgrade-cta">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-accent" />
              Upgrade to Full PaintPros.io Business Suite
            </CardTitle>
            <CardDescription>
              Unlock powerful tools to grow your painting business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fullSuiteBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg bg-background/50 text-center"
                    data-testid={`benefit-${index}`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-accent" />
                    <div className="text-sm font-medium">{benefit.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/pricing">
                <Button className="w-full sm:w-auto" data-testid="button-upgrade-now">
                  <Rocket className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="outline" className="w-full sm:w-auto" data-testid="button-compare-plans">
                  Compare Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
