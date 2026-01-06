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
  ArrowRight,
  Globe,
  Target,
  Cpu,
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
    { metric: "Homepage Sessions", oldSite: "1,058", newSite: "1,176", winner: "new" },
    { metric: "Top Subpage Sessions", oldSite: "/contact/ — 285", newSite: "/api/blockchain/stats — 2,171", winner: "new" },
    { metric: "Unique IPs", oldSite: "Not listed", newSite: "5,569", winner: "new" },
    { metric: "Referrer Traffic", oldSite: "Not listed", newSite: "google.com — 1,492; yahoo.com — 726", winner: "new" },
    { metric: "Engagement Rate", oldSite: "92–100%", newSite: "High request volume, strong interest", winner: "tie" },
    { metric: "SEO Targeting", oldSite: "Generic, non-local", newSite: "AI-driven, local SEO ready", winner: "new" },
  ];

  const newSiteFeatures = [
    "AI-powered",
    "SEO-adaptive",
    "Built for local dominance",
    "Integrated with analytics and behavior tracking",
    "Designed for high-intent lead capture",
    "Capable of automated content generation",
    "Faster, lighter, and more discoverable",
    "Built to scale with campaigns, ads, and seasonal pushes",
  ];

  const oldSiteProblems = [
    "No geo-targeted content",
    "No keyword clusters",
    "No service-area landing pages",
    "No structured data",
    "No automated SEO tuning",
  ];

  const newSiteCapabilities = [
    "Target every city, suburb, and neighborhood in Middle Tennessee",
    "Rank for residential and commercial painting keywords",
    "Capture high-intent traffic",
    "Expand automatically as new content is added",
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Hero Section */}
      <section className="py-16 px-6" style={{ backgroundColor: colors.greenDark }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge 
              className="mb-6 text-sm px-4 py-2"
              style={{ backgroundColor: colors.gold, color: colors.textDark }}
            >
              Website Performance Analysis
            </Badge>
            <h1 
              className="text-3xl md:text-5xl font-serif mb-6 leading-tight"
              style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
            >
              Why Your $40K Website Is Holding You Back
            </h1>
            <p className="text-lg md:text-xl opacity-90" style={{ color: colors.greenLight }}>
              A clear comparison of what you're paying versus what you're getting
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Cost vs Value */}
      <section className="py-16 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <DollarSign className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-2xl md:text-3xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Cost vs. Value
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center border-t-4" style={{ borderTopColor: "#dc2626" }}>
                <p className="text-4xl font-bold mb-2" style={{ color: "#dc2626" }}>$40,000</p>
                <p className="text-sm font-medium" style={{ color: colors.textDark }}>per year</p>
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>Current Website Cost</p>
              </Card>
              <Card className="p-6 text-center border-t-4" style={{ borderTopColor: colors.gold }}>
                <p className="text-lg font-bold mb-2" style={{ color: colors.textDark }}>Basic Static Site</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Minimal Functionality</p>
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>Platform Type</p>
              </Card>
              <Card className="p-6 text-center border-t-4" style={{ borderTopColor: colors.greenDark }}>
                <p className="text-lg font-bold mb-2" style={{ color: colors.greenDark }}>Zero</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Advanced Features</p>
                <p className="text-xs mt-2" style={{ color: colors.textLight }}>AI/Automation Tools</p>
              </Card>
            </div>

            <Card className="p-6" style={{ backgroundColor: colors.greenLight }}>
              <h3 className="font-bold mb-4" style={{ color: colors.greenDark }}>Missing Features:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#dc2626" }} />
                    <span className="text-sm" style={{ color: colors.textDark }}>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 mt-6 border-l-4" style={{ borderLeftColor: colors.gold, backgroundColor: colors.gold + "15", borderRadius: 0 }}>
              <p className="text-lg font-medium" style={{ color: colors.textDark }}>
                "You are paying enterprise-level pricing for a website that performs like a <strong>$20/month template</strong>."
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Performance Comparison */}
      <section className="py-16 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <BarChart3 className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-2xl md:text-3xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Performance Comparison
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: "#fee2e2" }}>
                <p className="text-sm font-medium" style={{ color: "#dc2626" }}>Old Site</p>
                <p className="text-2xl font-bold" style={{ color: "#dc2626" }}>90 Days</p>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.greenLight }}>
                <p className="text-sm font-medium" style={{ color: colors.greenDark }}>New Site</p>
                <p className="text-2xl font-bold" style={{ color: colors.greenDark }}>3 Weeks</p>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: colors.greenDark }}>
                      <th className="text-left p-4 text-white font-medium">Metric</th>
                      <th className="text-left p-4 text-white font-medium">Old Site (90 Days)</th>
                      <th className="text-left p-4 text-white font-medium">New Site (3 Weeks)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr 
                        key={i} 
                        className="border-b"
                        style={{ backgroundColor: i % 2 === 0 ? "white" : colors.background }}
                      >
                        <td className="p-4 font-medium" style={{ color: colors.textDark }}>{row.metric}</td>
                        <td className="p-4" style={{ color: colors.textLight }}>{row.oldSite}</td>
                        <td className="p-4 font-medium" style={{ color: colors.greenDark }}>{row.newSite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 mt-6 text-center" style={{ backgroundColor: colors.greenDark }}>
              <p className="text-xl font-bold" style={{ color: "white" }}>
                The new site matched or exceeded the old site's 90-day traffic in under 21 days.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Why the New Site Wins */}
      <section className="py-16 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <Zap className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-2xl md:text-3xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Why the New Site Wins
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {newSiteFeatures.map((feature, i) => (
                <Card key={i} className="p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: colors.greenDark }} />
                  <span style={{ color: colors.textDark }}>{feature}</span>
                </Card>
              ))}
            </div>

            <Card className="p-8 text-center" style={{ backgroundColor: colors.gold + "20", border: `2px solid ${colors.gold}` }}>
              <Cpu className="w-12 h-12 mx-auto mb-4" style={{ color: colors.gold }} />
              <p className="text-2xl font-serif font-bold" style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}>
                "This is not a website. It is a marketing engine."
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Local SEO Advantage */}
      <section className="py-16 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <MapPin className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-2xl md:text-3xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Local SEO Advantage
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: "#dc2626" }}>
                  <XCircle className="w-5 h-5" />
                  Old Site Has:
                </h3>
                <div className="space-y-3">
                  {oldSiteProblems.map((problem, i) => (
                    <Card key={i} className="p-4 flex items-center gap-3" style={{ backgroundColor: "#fef2f2" }}>
                      <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#dc2626" }} />
                      <span style={{ color: colors.textDark }}>{problem}</span>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: colors.greenDark }}>
                  <CheckCircle className="w-5 h-5" />
                  New Site Is Built To:
                </h3>
                <div className="space-y-3">
                  {newSiteCapabilities.map((capability, i) => (
                    <Card key={i} className="p-4 flex items-center gap-3" style={{ backgroundColor: colors.greenLight }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.greenDark }} />
                      <span style={{ color: colors.textDark }}>{capability}</span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Financial Argument */}
      <section className="py-16 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: colors.greenLight }}
              >
                <TrendingUp className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-2xl md:text-3xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                The Financial Reality
              </h2>
            </div>

            <Card className="p-8" style={{ backgroundColor: colors.greenDark }}>
              <p className="text-xl md:text-2xl leading-relaxed" style={{ color: "white" }}>
                "You are paying <strong style={{ color: colors.gold }}>$40,000 per year</strong> for a static brochure site. Our AI-driven platform outperforms it at a fraction of the cost — and generates <strong style={{ color: colors.gold }}>measurable traffic growth</strong>, <strong style={{ color: colors.gold }}>lead flow</strong>, and <strong style={{ color: colors.gold }}>long-term SEO value</strong>."
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 text-center">
                <Globe className="w-10 h-10 mx-auto mb-3" style={{ color: colors.greenDark }} />
                <p className="font-bold text-2xl" style={{ color: colors.greenDark }}>5,569+</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Unique IPs in 3 weeks</p>
              </Card>
              <Card className="p-6 text-center">
                <Search className="w-10 h-10 mx-auto mb-3" style={{ color: colors.gold }} />
                <p className="font-bold text-2xl" style={{ color: colors.gold }}>2,218+</p>
                <p className="text-sm" style={{ color: colors.textLight }}>Search engine referrals</p>
              </Card>
              <Card className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto mb-3" style={{ color: colors.greenDark }} />
                <p className="font-bold text-2xl" style={{ color: colors.greenDark }}>21 Days</p>
                <p className="text-sm" style={{ color: colors.textLight }}>To exceed 90-day performance</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Closing Statement */}
      <section className="py-16 px-6" style={{ backgroundColor: colors.greenDark }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-2xl md:text-4xl font-serif mb-6"
              style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
            >
              Ready to stop paying for a website that doesn't perform?
            </h2>
            <p className="text-lg opacity-90 mb-8" style={{ color: colors.greenLight }}>
              Let's switch to a platform that actually grows your business.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: colors.gold }}>
              <ArrowRight className="w-4 h-4" />
              <span>Nashville Painting Professionals</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
