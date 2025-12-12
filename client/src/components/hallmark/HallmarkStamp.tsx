import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getAssetBadge, formatDate, truncateHash } from "@/lib/hallmark";
import { Shield, ExternalLink, CheckCircle } from "lucide-react";

interface HallmarkStampProps {
  hallmarkNumber: string;
  assetNumber?: string;
  contentHash: string;
  createdAt: Date | string;
  recipientName: string;
  assetType: string;
  blockchainTxSignature?: string;
  verificationUrl?: string;
  compact?: boolean;
  className?: string;
}

export function HallmarkStamp({
  hallmarkNumber,
  assetNumber,
  contentHash,
  createdAt,
  recipientName,
  assetType,
  blockchainTxSignature,
  verificationUrl,
  compact = false,
  className
}: HallmarkStampProps) {
  const badge = getAssetBadge(assetNumber || hallmarkNumber);
  const verifyUrl = verificationUrl || `/verify/${hallmarkNumber}`;

  if (compact) {
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
          "bg-background/50 border border-border/50",
          className
        )}
        data-testid={`hallmark-stamp-compact-${hallmarkNumber}`}
      >
        <span>{badge.icon}</span>
        <span className="font-mono text-xs" style={{ color: badge.color }}>
          {hallmarkNumber}
        </span>
        {blockchainTxSignature && (
          <CheckCircle className="w-3 h-3 text-green-500" />
        )}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative p-4 rounded-xl border",
        "bg-gradient-to-br from-background/80 to-background/40",
        "backdrop-blur-sm",
        className
      )}
      style={{ borderColor: `${badge.color}30` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid={`hallmark-stamp-${hallmarkNumber}`}
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-10"
        style={{
          background: `linear-gradient(135deg, ${badge.color}20, transparent)`
        }}
      />

      <div className="relative flex items-start gap-4">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${badge.color}30, ${badge.color}10)`,
            border: `2px solid ${badge.color}40`
          }}
        >
          <Shield className="w-5 h-5" style={{ color: badge.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{badge.icon}</span>
            <span 
              className="font-bold text-sm uppercase tracking-wide"
              style={{ color: badge.color }}
            >
              {badge.tier}
            </span>
            {blockchainTxSignature && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Hallmark:</span>
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                {hallmarkNumber}
              </code>
            </div>

            {assetNumber && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Asset:</span>
                <code 
                  className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{ 
                    background: `${badge.color}20`,
                    color: badge.color
                  }}
                >
                  {assetNumber}
                </code>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Type:</span>
              <span className="capitalize">{assetType.replace(/_/g, ' ')}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Issued to:</span>
              <span>{recipientName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Date:</span>
              <span>{formatDate(createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Hash:</span>
              <code className="font-mono text-xs text-muted-foreground">
                {truncateHash(contentHash, 12)}
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs hover:underline"
          style={{ color: badge.color }}
          data-testid="link-verify-hallmark"
        >
          Verify Authenticity
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="text-xs text-muted-foreground">
          Powered by ORBIT
        </div>
      </div>
    </motion.div>
  );
}
