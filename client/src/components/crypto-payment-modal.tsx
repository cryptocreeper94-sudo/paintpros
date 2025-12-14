import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SiBitcoin, SiEthereum } from "react-icons/si";
import { ArrowRight, Shield, Zap, Globe, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CryptoPaymentModal({ isOpen, onClose }: CryptoPaymentModalProps) {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Transactions",
      description: "No waiting for bank transfers. Your payment is confirmed in minutes."
    },
    {
      icon: Shield,
      title: "Secure & Transparent",
      description: "Blockchain technology ensures every transaction is secure and verifiable."
    },
    {
      icon: Globe,
      title: "Borderless Payments",
      description: "Pay from anywhere in the world without currency conversion fees."
    },
    {
      icon: TrendingUp,
      title: "Future-Forward",
      description: "Join the digital economy revolution with cutting-edge payment technology."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-lg max-h-[85vh] overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-background via-background to-orange-500/5">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3 text-lg md:text-2xl font-display">
            <div className="flex -space-x-1">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <SiBitcoin className="w-4 h-4 text-orange-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <SiEthereum className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            Crypto Payments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 rounded-lg p-3 md:p-4 border border-orange-500/20">
            <h3 className="font-bold text-sm md:text-base mb-1">Embrace the Digital Economy</h3>
            <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed">
              We're proud to be at the forefront of the digital payment revolution. As a tech-forward painting company, we believe in offering our customers the most innovative and convenient payment options available.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 md:gap-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-2 md:p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="p-1.5 rounded-lg bg-accent/10 flex-shrink-0">
                  <benefit.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs md:text-sm">{benefit.title}</h4>
                  <p className="text-base md:text-xs text-muted-foreground leading-snug">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/50">
            <h4 className="font-semibold text-xs md:text-sm mb-2">Accepted Cryptocurrencies</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <SiBitcoin className="w-3 h-3 text-orange-400" />
                <span className="text-base md:text-xs font-medium">Bitcoin</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                <SiEthereum className="w-3 h-3 text-purple-400" />
                <span className="text-base md:text-xs font-medium">Ethereum</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="text-base md:text-xs font-medium">USDC</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="text-base md:text-xs font-medium">+ More</span>
              </div>
            </div>
          </div>

          <p className="text-base md:text-xs text-muted-foreground text-center italic">
            Powered by Coinbase Commerce for secure, reliable crypto transactions.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <a href="/estimate" className="w-full">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white" data-testid="button-get-crypto-estimate">
                Get Your Estimate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Button variant="ghost" onClick={onClose} className="text-xs" data-testid="button-close-crypto-modal">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
