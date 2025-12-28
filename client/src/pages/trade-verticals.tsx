import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Paintbrush, Home, Thermometer, Zap, Droplets, Trees, Hammer,
  ArrowRight, Globe, Users, Shield, CheckCircle2, Building2
} from "lucide-react";
import { tradeVerticals, type TradeType } from "@shared/trade-verticals";

const iconMap: Record<string, any> = {
  Paintbrush, Home, Thermometer, Zap, Droplets, Trees, Hammer
};

export default function TradeVerticals() {
  const trades = Object.values(tradeVerticals);

  return (
    <PageLayout>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <section className="py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-300">
                Orbit Ventures SaaS Portfolio
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                Trade Vertical Platforms
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                White-label SaaS solutions for skilled trade businesses. Each platform includes 
                booking, CRM, crew management, payments, and blockchain verification.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {trades.map((trade, index) => {
                const IconComponent = iconMap[trade.icon] || Building2;
                const isLive = trade.id === 'painting';
                
                return (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full hover-elevate cursor-pointer border-2 transition-colors"
                      style={{ borderColor: isLive ? trade.primaryColor : undefined }}
                      data-testid={`card-trade-${trade.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${trade.primaryColor}20` }}
                          >
                            <IconComponent 
                              className="w-6 h-6" 
                              style={{ color: trade.primaryColor }}
                            />
                          </div>
                          {isLive ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Live
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl text-gray-900">{trade.name}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {trade.tagline}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Globe className="w-4 h-4" />
                            <span className="font-mono">{trade.placeholderDomain}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {trade.services.slice(0, 3).map(service => (
                              <Badge 
                                key={service.id} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {service.name}
                              </Badge>
                            ))}
                            {trade.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{trade.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                          {isLive ? (
                            <Link href="/">
                              <Button 
                                className="w-full mt-4 gap-2"
                                style={{ backgroundColor: trade.primaryColor }}
                                data-testid={`button-view-${trade.id}`}
                              >
                                View Live Site
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="w-full mt-4 gap-2"
                              disabled
                              data-testid={`button-coming-${trade.id}`}
                            >
                              Domain Pending
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Shared Platform Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Multi-Tenant" },
                  { icon: Shield, label: "Blockchain Verified" },
                  { icon: CheckCircle2, label: "Online Booking" },
                  { icon: Building2, label: "Franchise Ready" },
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col items-center text-center p-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                      <feature.icon className="w-5 h-5 text-purple-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-6 text-sm">
                Each platform shares the same powerful backend: CRM, crew management, 
                document center, payment processing, and real-time messaging.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
