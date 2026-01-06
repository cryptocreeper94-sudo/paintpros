import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  MapPin, 
  BarChart3,
  CheckCircle,
  XCircle,
  Globe,
  Target,
  Search
} from "lucide-react";

const colors = {
  background: "#FAF7F0",
  greenDark: "#1F3D2B",
  greenMedium: "#2D5A3D",
  greenLight: "#E8F0E8",
  gold: "#E8C15C",
  textDark: "#1a1a1a",
  textLight: "#666666",
};

export default function Why40kFails() {
  const comparisonData = [
    { metric: "Homepage Sessions", oldSite: "1,058", newSite: "1,176" },
    { metric: "Top Subpage Sessions", oldSite: "/contact/ — 285", newSite: "/api/blockchain/stats — 2,171" },
    { metric: "Unique IPs", oldSite: "Not listed", newSite: "5,569" },
    { metric: "Referrer Traffic", oldSite: "Not listed", newSite: "google.com — 1,492; yahoo.com — 726" },
    { metric: "Engagement Rate", oldSite: "92–100%", newSite: "High request volume" },
    { metric: "SEO Targeting", oldSite: "Generic, non-local", newSite: "AI-driven, local SEO ready" },
  ];

  const newSiteFeatures = [
    "AI-powered functionality",
    "SEO-adaptive architecture",
    "Local market targeting",
    "Analytics and behavior tracking",
    "High-intent lead capture",
    "Automated content generation",
    "Optimized load performance",
    "Scalable for campaigns and seasonal activity",
  ];

  const oldSiteGaps = [
    "No geo-targeted content",
    "No keyword clusters",
    "No service-area landing pages",
    "No structured data",
    "No automated SEO tuning",
  ];

  const newSiteCapabilities = [
    "Targets cities, suburbs, and neighborhoods in Middle Tennessee",
    "Ranks for residential and commercial painting keywords",
    "Captures high-intent traffic",
    "Expands automatically as new content is added",
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <section className="py-12 px-6" style={{ backgroundColor: colors.greenDark }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              className="mb-4 text-sm px-4 py-2"
              style={{ backgroundColor: colors.gold, color: colors.textDark }}
            >
              Website Performance Analysis
            </Badge>
            <h1 
              className="text-3xl md:text-4xl font-serif mb-4"
              style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
            >
              Current Website vs. New Platform
            </h1>
            <p className="text-base opacity-90" style={{ color: colors.greenLight }}>
              A factual comparison of performance data
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Current Cost */}
      <section className="py-12 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <DollarSign className="w-5 h-5" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-xl md:text-2xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Current Website Cost
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="p-5 text-center">
                <p className="text-3xl font-bold mb-1" style={{ color: colors.textDark }}>$40,000</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Annual cost</p>
              </Card>
              <Card className="p-5 text-center">
                <p className="text-lg font-medium mb-1" style={{ color: colors.textDark }}>Static site</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Platform type</p>
              </Card>
              <Card className="p-5 text-center">
                <p className="text-lg font-medium mb-1" style={{ color: colors.textDark }}>Limited</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Functionality</p>
              </Card>
            </div>

            <Card className="p-5" style={{ backgroundColor: colors.greenLight }}>
              <h3 className="font-medium mb-3" style={{ color: colors.greenDark }}>Features not included in current site:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "AI tools",
                  "Automation",
                  "Analytics intelligence",
                  "Dynamic SEO",
                  "Lead funnels",
                  "Campaign systems",
                  "Local targeting",
                  "Performance optimization"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.textLight }} />
                    <span className="text-sm" style={{ color: colors.textDark }}>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Performance Data */}
      <section className="py-12 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-xl md:text-2xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Performance Data
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "white" }}>
                <p className="text-sm font-medium" style={{ color: colors.textDark }}>Current Site</p>
                <p className="text-lg font-bold" style={{ color: colors.textDark }}>90-Day Period</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: colors.greenLight }}>
                <p className="text-sm font-medium" style={{ color: colors.greenDark }}>New Site</p>
                <p className="text-lg font-bold" style={{ color: colors.greenDark }}>3-Week Period</p>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: colors.greenDark }}>
                      <th className="text-left p-3 text-white text-sm font-medium">Metric</th>
                      <th className="text-left p-3 text-white text-sm font-medium">Current Site (90 Days)</th>
                      <th className="text-left p-3 text-white text-sm font-medium">New Site (3 Weeks)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr 
                        key={i} 
                        className="border-b"
                        style={{ backgroundColor: i % 2 === 0 ? "white" : colors.background }}
                      >
                        <td className="p-3 text-sm font-medium" style={{ color: colors.textDark }}>{row.metric}</td>
                        <td className="p-3 text-sm" style={{ color: colors.textLight }}>{row.oldSite}</td>
                        <td className="p-3 text-sm" style={{ color: colors.greenDark }}>{row.newSite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <p className="text-sm mt-4 text-center" style={{ color: colors.textLight }}>
              The new site matched or exceeded 90-day traffic metrics within 21 days.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: New Site Capabilities */}
      <section className="py-12 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <Zap className="w-5 h-5" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-xl md:text-2xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                New Site Capabilities
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {newSiteFeatures.map((feature, i) => (
                <Card key={i} className="p-3 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.greenDark }} />
                  <span className="text-sm" style={{ color: colors.textDark }}>{feature}</span>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Local SEO Comparison */}
      <section className="py-12 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <MapPin className="w-5 h-5" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-xl md:text-2xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Local SEO Comparison
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3 text-sm" style={{ color: colors.textDark }}>
                  Current Site:
                </h3>
                <div className="space-y-2">
                  {oldSiteGaps.map((item, i) => (
                    <Card key={i} className="p-3 flex items-center gap-3">
                      <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.textLight }} />
                      <span className="text-sm" style={{ color: colors.textDark }}>{item}</span>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-sm" style={{ color: colors.greenDark }}>
                  New Site:
                </h3>
                <div className="space-y-2">
                  {newSiteCapabilities.map((item, i) => (
                    <Card key={i} className="p-3 flex items-center gap-3" style={{ backgroundColor: colors.greenLight }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.greenDark }} />
                      <span className="text-sm" style={{ color: colors.textDark }}>{item}</span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Summary Metrics */}
      <section className="py-12 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-xl md:text-2xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Summary
              </h2>
            </div>

            <Card className="p-5 mb-6" style={{ backgroundColor: colors.greenLight }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.textDark }}>
                The current website costs $40,000 per year and operates as a static brochure site. The new platform, in its first three weeks, generated more traffic, stronger search engine referrals, and provides measurable analytics, local SEO targeting, and scalable functionality.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Globe className="w-8 h-8 mx-auto mb-2" style={{ color: colors.greenDark }} />
                <p className="font-bold text-xl" style={{ color: colors.greenDark }}>5,569</p>
                <p className="text-xs" style={{ color: colors.textLight }}>Unique IPs (3 weeks)</p>
              </Card>
              <Card className="p-4 text-center">
                <Search className="w-8 h-8 mx-auto mb-2" style={{ color: colors.gold }} />
                <p className="font-bold text-xl" style={{ color: colors.gold }}>2,218</p>
                <p className="text-xs" style={{ color: colors.textLight }}>Search engine referrals</p>
              </Card>
              <Card className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2" style={{ color: colors.greenDark }} />
                <p className="font-bold text-xl" style={{ color: colors.greenDark }}>21 days</p>
                <p className="text-xs" style={{ color: colors.textLight }}>To match 90-day performance</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-12 px-6" style={{ backgroundColor: colors.greenDark }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p 
              className="text-lg md:text-xl font-serif"
              style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
            >
              I look forward to getting the new site implemented as soon as possible.
            </p>
            <p className="text-sm mt-4 opacity-80" style={{ color: colors.greenLight }}>
              Nashville Painting Professionals
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
