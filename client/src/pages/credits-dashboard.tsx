import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTenant } from "@/context/TenantContext";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Package,
  Zap,
  Crown,
  Building2,
  ShoppingCart,
  History,
  Receipt,
  Loader2
} from "lucide-react";

interface CreditBalance {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

interface UsageLog {
  id: number;
  description: string;
  creditsUsed: number;
  createdAt: string;
}

interface PurchaseLog {
  id: number;
  packName: string;
  credits: number;
  amount: number;
  createdAt: string;
}

interface CreditPack {
  id: string;
  name: string;
  price: number;
  credits: number;
  icon: typeof Package;
  popular?: boolean;
}

const creditPacks: CreditPack[] = [
  { id: "starter", name: "Starter Pack", price: 1000, credits: 1000, icon: Package },
  { id: "value", name: "Value Pack", price: 2500, credits: 2500, icon: Zap, popular: true },
  { id: "pro", name: "Pro Pack", price: 5000, credits: 5000, icon: Crown },
  { id: "business", name: "Business Pack", price: 10000, credits: 10000, icon: Building2 },
];

function formatCentsToDollars(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CreditsDashboard() {
  const tenant = useTenant();
  const { toast } = useToast();
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);

  const { data: balance, isLoading: balanceLoading } = useQuery<CreditBalance>({
    queryKey: ['/api/credits', tenant.id, 'balance'],
    enabled: !!tenant.id,
  });

  const { data: usageHistory, isLoading: usageLoading } = useQuery<UsageLog[]>({
    queryKey: ['/api/credits', tenant.id, 'usage'],
    enabled: !!tenant.id,
  });

  const { data: purchaseHistory, isLoading: purchaseLoading } = useQuery<PurchaseLog[]>({
    queryKey: ['/api/credits', tenant.id, 'purchases'],
    enabled: !!tenant.id,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pack: CreditPack) => {
      return apiRequest('POST', '/api/credits/purchase', {
        tenantId: tenant.id,
        packId: pack.id,
        packName: pack.name,
        credits: pack.credits,
        amount: pack.price,
      });
    },
    onSuccess: (_, pack) => {
      queryClient.invalidateQueries({ queryKey: ['/api/credits', tenant.id, 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits', tenant.id, 'purchases'] });
      toast({
        title: "Purchase Successful",
        description: `You've purchased ${pack.credits.toLocaleString()} credits for ${formatCentsToDollars(pack.price)}.`,
      });
      setPurchasingPack(null);
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "Could not complete the purchase. Please try again.",
        variant: "destructive",
      });
      setPurchasingPack(null);
    },
  });

  const handlePurchase = (pack: CreditPack) => {
    setPurchasingPack(pack.id);
    purchaseMutation.mutate(pack);
  };

  const isLowBalance = (balance?.balance ?? 0) < 500;

  return (
    <PageLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" data-testid="text-page-title">
            <Coins className="w-7 h-7 text-accent" />
            AI Credits Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI credits and purchase history
          </p>
        </div>

        <Card data-testid="card-credit-balance">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Credit Balance
              </CardTitle>
              <CardDescription>Your current AI credit status</CardDescription>
            </div>
            {isLowBalance && (
              <Badge variant="destructive" className="flex items-center gap-1" data-testid="badge-low-balance">
                <AlertTriangle className="w-3 h-3" />
                Low Balance
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Coins className="w-4 h-4" />
                    Current Balance
                  </div>
                  <div className="text-2xl font-bold" data-testid="text-current-balance">
                    {formatCentsToDollars(balance?.balance ?? 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(balance?.balance ?? 0).toLocaleString()} credits
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Total Purchased
                  </div>
                  <div className="text-2xl font-bold" data-testid="text-total-purchased">
                    {formatCentsToDollars(balance?.totalPurchased ?? 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(balance?.totalPurchased ?? 0).toLocaleString()} credits
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingDown className="w-4 h-4 text-orange-500" />
                    Total Used
                  </div>
                  <div className="text-2xl font-bold" data-testid="text-total-used">
                    {formatCentsToDollars(balance?.totalUsed ?? 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(balance?.totalUsed ?? 0).toLocaleString()} credits
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5" />
            Purchase Credits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack) => {
              const Icon = pack.icon;
              const isPurchasing = purchasingPack === pack.id;
              return (
                <Card 
                  key={pack.id} 
                  className={pack.popular ? "border-accent" : ""}
                  data-testid={`card-pack-${pack.id}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Icon className="w-6 h-6 text-accent" />
                      {pack.popular && (
                        <Badge variant="default" className="text-xs">Popular</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{pack.name}</CardTitle>
                    <CardDescription>
                      {pack.credits.toLocaleString()} credits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">
                      {formatCentsToDollars(pack.price)}
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handlePurchase(pack)}
                      disabled={isPurchasing}
                      data-testid={`button-buy-${pack.id}`}
                    >
                      {isPurchasing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Buy Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-usage-history">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Usage History
              </CardTitle>
              <CardDescription>Recent AI credit usage</CardDescription>
            </CardHeader>
            <CardContent>
              {usageLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : !usageHistory || usageHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No usage history yet
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {usageHistory.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50"
                      data-testid={`usage-log-${log.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{log.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(log.createdAt)}
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        -{log.creditsUsed.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-purchase-history">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Purchase History
              </CardTitle>
              <CardDescription>Your credit purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {purchaseLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : !purchaseHistory || purchaseHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No purchases yet
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {purchaseHistory.map((purchase) => (
                    <div 
                      key={purchase.id} 
                      className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50"
                      data-testid={`purchase-log-${purchase.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{purchase.packName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(purchase.createdAt)}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium text-green-600 dark:text-green-400">
                          +{purchase.credits.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCentsToDollars(purchase.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
