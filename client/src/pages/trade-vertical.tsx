import { TradeVerticalLanding } from "@/components/trade-vertical-landing";
import { useParams } from "wouter";

interface TradeVerticalPageProps {
  tradeId?: string;
}

export default function TradeVerticalPage({ tradeId: propTradeId }: TradeVerticalPageProps) {
  const params = useParams<{ tradeId: string }>();
  const tradeId = propTradeId || params.tradeId || "roofing";
  
  return <TradeVerticalLanding tradeId={tradeId} />;
}
