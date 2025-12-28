import { GlassCard } from "@/components/ui/glass-card";
import { Building2, Globe, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const TRADE_VERTICALS = [
  { name: "PaintPros", domain: "paintpros.io", market: "$46.5B", status: "Live" },
  { name: "RoofPros", domain: "roofpros.io", market: "$56B", status: "Coming Soon" },
  { name: "HVACPros", domain: "hvacpros.io", market: "$130B", status: "Coming Soon" },
  { name: "ElectricPros", domain: "electricpros.io", market: "$200B", status: "Coming Soon" },
  { name: "PlumbPros", domain: "plumbpros.io", market: "$130B", status: "Coming Soon" },
  { name: "LandscapePros", domain: "landscapepros.io", market: "$130B", status: "Coming Soon" },
  { name: "BuildPros", domain: "buildpros.io", market: "$1.5T", status: "Coming Soon" },
];

interface TradeVerticalsCardProps {
  showFullDetails?: boolean;
}

export function TradeVerticalsCard({ showFullDetails = false }: TradeVerticalsCardProps) {
  return (
    <GlassCard className="p-6" data-testid="card-trade-verticals">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Trade Vertical Expansion</h3>
          <p className="text-sm text-muted-foreground">Multi-trade franchising platform</p>
        </div>
      </div>

      <div className={`grid gap-2 mb-4 ${showFullDetails ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-7" : "grid-cols-2 md:grid-cols-4"}`}>
        {TRADE_VERTICALS.slice(0, showFullDetails ? 7 : 4).map((vertical) => (
          <div
            key={vertical.name}
            className={`p-2 rounded-lg border text-center transition-colors ${
              vertical.status === "Live"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-white/5 border-white/10 dark:border-white/10"
            }`}
            data-testid={`card-vertical-${vertical.name.toLowerCase()}`}
          >
            <p className="font-medium text-sm">{vertical.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{vertical.domain}</p>
            <p className={`text-xs mt-1 ${vertical.status === "Live" ? "text-green-500" : "text-muted-foreground"}`}>
              {vertical.status}
            </p>
          </div>
        ))}
      </div>

      {showFullDetails && (
        <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-green-500">$2.2T+</p>
            <p className="text-xs text-muted-foreground">Combined TAM</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-500">2M+</p>
            <p className="text-xs text-muted-foreground">Target Contractors</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-purple-500">7</p>
            <p className="text-xs text-muted-foreground">Trade Verticals</p>
          </div>
        </div>
      )}

      <Link href="/trade-verticals">
        <button className="w-full py-2 px-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-green-500/20" data-testid="button-view-trade-verticals">
          <Globe className="w-4 h-4" />
          View All Trade Verticals
        </button>
      </Link>
    </GlassCard>
  );
}
