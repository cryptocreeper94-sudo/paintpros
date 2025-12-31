import { Calculator, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EstimatorPromoCardProps {
  variant?: 'default' | 'compact';
}

export function EstimatorPromoCard({ variant = 'default' }: EstimatorPromoCardProps) {
  const isCompact = variant === 'compact';

  return (
    <GlassCard 
      className={`relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border-emerald-500/30 ${isCompact ? 'p-3' : 'p-4 md:p-6'}`}
      hoverEffect
      glow
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 animate-pulse opacity-30" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className={`${isCompact ? 'p-2' : 'p-2.5'} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30`}>
              <Calculator className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
            </div>
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                <Sparkles className="w-3 h-3 mr-1" />
                NEW TOOL
              </Badge>
            </div>
          </div>
          <Zap className={`${isCompact ? 'w-5 h-5' : 'w-6 h-6'} text-emerald-500 animate-pulse`} />
        </div>

        <h3 className={`font-display font-bold ${isCompact ? 'text-sm' : 'text-base md:text-lg'} text-foreground mb-1.5`}>
          AI Paint Estimator
        </h3>
        
        <p className={`${isCompact ? 'text-[10px]' : 'text-xs md:text-sm'} text-muted-foreground mb-3 leading-relaxed`}>
          Get instant, accurate paint estimates powered by AI. Calculate costs for any room in seconds.
        </p>

        <div className={`flex flex-wrap gap-2 mb-4 ${isCompact ? 'text-[9px]' : 'text-[10px] md:text-xs'}`}>
          <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Instant Quotes
          </span>
          <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            AI-Powered
          </span>
          <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Free to Try
          </span>
        </div>

        <a href="/estimator-app" className="block" data-testid="link-estimator-promo">
          <Button 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold gap-2"
            data-testid="button-try-estimator"
          >
            <Calculator className="w-4 h-4" />
            Try the Estimator
            <ArrowRight className="w-4 h-4" />
          </Button>
        </a>

        <p className={`text-center mt-2 ${isCompact ? 'text-[8px]' : 'text-[9px] md:text-xs'} text-muted-foreground`}>
          Available as standalone app • Add to home screen
        </p>
      </div>
    </GlassCard>
  );
}
