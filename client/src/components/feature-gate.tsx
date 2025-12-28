import { ReactNode } from 'react';
import { useFeatureGate, FeatureKey } from '@/hooks/use-feature-gate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback,
  showUpgrade = true 
}: FeatureGateProps) {
  const { checkFeature, getFeatureDescription } = useFeatureGate();
  const gate = checkFeature(feature);

  if (gate.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <Card className="border-dashed border-2 opacity-75">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            {getFeatureDescription(feature)}
          </CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {gate.tierRequired?.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {gate.upgradeMessage}
        </p>
        <Link href="/estimator-pricing">
          <Button size="sm" variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Learn More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface FeatureLockedOverlayProps {
  feature: FeatureKey;
  children: ReactNode;
}

export function FeatureLockedOverlay({ feature, children }: FeatureLockedOverlayProps) {
  const { checkFeature, getFeatureDescription } = useFeatureGate();
  const gate = checkFeature(feature);

  if (gate.allowed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-40 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-md">
        <div className="text-center p-4">
          <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">{getFeatureDescription(feature)}</p>
          <p className="text-xs text-muted-foreground mb-3">{gate.upgradeMessage}</p>
          <Link href="/estimator-pricing">
            <Button size="sm" className="gap-1">
              <Sparkles className="w-3 h-3" />
              See Options
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface FeatureBadgeProps {
  feature: FeatureKey;
  showWhenLocked?: boolean;
}

export function FeatureBadge({ feature, showWhenLocked = true }: FeatureBadgeProps) {
  const { checkFeature } = useFeatureGate();
  const gate = checkFeature(feature);

  if (gate.allowed) {
    return null;
  }

  if (!showWhenLocked) {
    return null;
  }

  return (
    <Badge variant="outline" className="gap-1 text-xs">
      <Lock className="w-3 h-3" />
      {gate.tierRequired?.toUpperCase()}
    </Badge>
  );
}
