import { useState, useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingUp, Clock, Users, Zap } from "lucide-react";

interface ROICalculatorProps {
  className?: string;
}

export function ROICalculator({ className }: ROICalculatorProps) {
  const [crews, setCrews] = useState(5);
  const [jobsPerMonth, setJobsPerMonth] = useState(20);
  const [avgJobValue, setAvgJobValue] = useState(3500);

  const calculations = useMemo(() => {
    const currentRevenue = jobsPerMonth * avgJobValue * 12;
    const adminHoursPerWeek = crews * 3;
    const adminCostPerYear = adminHoursPerWeek * 52 * 25;
    
    const efficiencyGain = 0.25;
    const additionalJobs = Math.floor(jobsPerMonth * efficiencyGain);
    const additionalRevenue = additionalJobs * avgJobValue * 12;
    
    const adminSavings = adminCostPerYear * 0.6;
    const aiProposalSavings = jobsPerMonth * 12 * 15;
    const routeOptSavings = crews * 50 * 52;
    
    const totalSavings = adminSavings + aiProposalSavings + routeOptSavings;
    const totalBenefit = additionalRevenue + totalSavings;
    
    const platformCost = crews <= 3 ? 349 * 12 : crews <= 10 ? 549 * 12 : 799 * 12;
    const roi = ((totalBenefit - platformCost) / platformCost) * 100;
    const paybackMonths = platformCost / (totalBenefit / 12);

    return {
      currentRevenue,
      additionalRevenue,
      adminSavings,
      aiProposalSavings,
      routeOptSavings,
      totalSavings,
      totalBenefit,
      platformCost,
      roi,
      paybackMonths: Math.max(0.5, paybackMonths)
    };
  }, [crews, jobsPerMonth, avgJobValue]);

  return (
    <GlassCard className={`p-6 ${className}`} data-tour="roi">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-500/20">
          <Calculator className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">ROI Calculator</h3>
          <p className="text-xs text-muted-foreground">Calculate your potential returns</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Number of Crews
            </label>
            <span className="font-bold text-accent">{crews}</span>
          </div>
          <Slider
            value={[crews]}
            onValueChange={([value]) => setCrews(value)}
            min={1}
            max={25}
            step={1}
            className="w-full"
            data-testid="slider-crews"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Jobs per Month
            </label>
            <span className="font-bold text-accent">{jobsPerMonth}</span>
          </div>
          <Slider
            value={[jobsPerMonth]}
            onValueChange={([value]) => setJobsPerMonth(value)}
            min={5}
            max={100}
            step={5}
            className="w-full"
            data-testid="slider-jobs"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Average Job Value
            </label>
            <span className="font-bold text-accent">${avgJobValue.toLocaleString()}</span>
          </div>
          <Slider
            value={[avgJobValue]}
            onValueChange={([value]) => setAvgJobValue(value)}
            min={500}
            max={15000}
            step={250}
            className="w-full"
            data-testid="slider-job-value"
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-muted-foreground mb-1">Additional Revenue</p>
            <p className="text-lg sm:text-xl font-bold text-green-400">
              +${(calculations.additionalRevenue / 1000).toFixed(0)}K
              <span className="text-xs font-normal text-muted-foreground">/yr</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Cost Savings</p>
            <p className="text-lg sm:text-xl font-bold text-blue-400">
              ${(calculations.totalSavings / 1000).toFixed(0)}K
              <span className="text-xs font-normal text-muted-foreground">/yr</span>
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
            <span className="text-sm font-medium">Total Annual Benefit</span>
            <span className="text-xl sm:text-2xl font-bold text-accent">
              ${(calculations.totalBenefit / 1000).toFixed(0)}K
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className="font-bold text-green-400">{calculations.roi.toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Payback</p>
                <p className="font-bold text-blue-400">{calculations.paybackMonths.toFixed(1)} mo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Savings Breakdown:</p>
          <div className="space-y-1">
            {[
              { label: "Admin time saved", value: calculations.adminSavings },
              { label: "AI proposal generation", value: calculations.aiProposalSavings },
              { label: "Route optimization", value: calculations.routeOptSavings }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-mono">${(item.value / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
