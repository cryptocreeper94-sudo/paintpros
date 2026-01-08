import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DollarSign, Wallet, TrendingUp, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cardBackgroundStyles, iconContainerStyles } from "@/lib/theme-effects";
import { Link } from "wouter";

interface RoyaltySummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  partnerShare: number;
  pendingPayout: number;
  lastPayoutDate: string | null;
  lastPayoutAmount: number;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function RoyaltySummaryCard() {
  const { data: royaltySummary } = useQuery<RoyaltySummary>({
    queryKey: ["/api/royalty/summary"],
  });

  return (
    <GlassCard className={`h-full p-4 ${cardBackgroundStyles.green}`} glow="green" hoverEffect={false}>
      <div className="flex items-center gap-2 mb-3">
        <motion.div 
          className={`${iconContainerStyles.sizes.md} ${iconContainerStyles.base} ${iconContainerStyles.gradients.green}`}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <DollarSign className="w-4 h-4 text-green-400" />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-lg font-display font-bold">Partner Royalties</h2>
          <p className="text-xs text-muted-foreground">Your 50% share</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <DollarSign className="w-3 h-3" />
            Total Earnings
          </div>
          <p className="text-lg font-bold text-green-500" data-testid="text-royalty-total">
            {formatCurrency(royaltySummary?.partnerShare)}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Wallet className="w-3 h-3" />
            Pending
          </div>
          <p className="text-lg font-bold text-blue-400" data-testid="text-royalty-pending">
            {formatCurrency(royaltySummary?.pendingPayout)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">Net Profit:</span>
        </div>
        <span className="font-semibold text-accent">{formatCurrency(royaltySummary?.netProfit)}</span>
      </div>

      <Link href="/partner">
        <Button variant="outline" size="sm" className="w-full" data-testid="button-view-royalties">
          View Full Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </GlassCard>
  );
}
