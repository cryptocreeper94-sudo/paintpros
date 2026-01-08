import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { 
  Target, TrendingUp, Users, Calendar, MessageSquare, 
  Award, CheckCircle, ArrowRight, BarChart3, PieChartIcon,
  Briefcase, Star, Globe, Megaphone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Import images
import nppLogo from "@assets/Logo_NPP_Vertical_Dark_1767572957240.png";
import leadSourceChart from "@assets/Copilot_20260104_182823_1767572957239.png";
import leadGrowthChart from "@assets/image_17675100614516569353268297259618_1767572957240.jpeg";
import industryGrowthChart from "@assets/image_17675101516292714960872208183295_1767572957241.jpeg";

// Brand colors from spec
const colors = {
  background: "#FAF7F0",
  textDark: "#1F3D2B",
  greenLight: "#CFE8D5",
  greenMid: "#8DBF9A",
  greenDark: "#2F6B3F",
  gold: "#E8C15C"
};

// Target Audience by County data
const countyData = [
  { name: "Williamson", value: 35, color: colors.gold },
  { name: "Davidson", value: 30, color: colors.greenDark },
  { name: "Rutherford", value: 15, color: colors.greenMid },
  { name: "Wilson", value: 10, color: colors.greenLight },
  { name: "Sumner/Dickson", value: 10, color: "#A8D4B0" }
];

export default function Marketing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* COVER SHEET */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <img 
            src={nppLogo} 
            alt="Nashville Painting Professionals" 
            className="w-64 md:w-80 mx-auto mb-12"
            data-testid="img-npp-logo"
          />
          <h1 
            className="text-4xl md:text-6xl font-serif mb-6"
            style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
          >
            Marketing Campaign 2026
          </h1>
          <p 
            className="text-2xl md:text-3xl italic mb-8"
            style={{ color: colors.greenDark, fontFamily: "'Playfair Display', serif" }}
          >
            "We elevate the backdrop of your life."
          </p>
          <Badge 
            className="text-sm px-4 py-2"
            style={{ backgroundColor: colors.greenDark, color: "white" }}
          >
            Strategic Growth Plan
          </Badge>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 text-center"
        >
          <p className="text-sm" style={{ color: colors.textDark }}>Scroll to continue</p>
          <ArrowRight className="w-5 h-5 mx-auto mt-2 rotate-90" style={{ color: colors.greenDark }} />
        </motion.div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
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
                <Briefcase className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Executive Summary
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vision */}
              <Card className="p-6 border-l-4" style={{ borderLeftColor: colors.gold }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5" style={{ color: colors.gold }} />
                  <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>Vision</h3>
                </div>
                <p style={{ color: colors.textDark }}>
                  Build the most trusted premium painting brand in Middle Tennessee. We're not just painting walls — we're transforming homes into expressions of our clients' aspirations.
                </p>
              </Card>

              {/* Opportunity */}
              <Card className="p-6 border-l-4" style={{ borderLeftColor: colors.greenDark }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5" style={{ color: colors.greenDark }} />
                  <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>Opportunity</h3>
                </div>
                <p style={{ color: colors.textDark }}>
                  The U.S. painting industry is projected to reach <strong>$45.8 billion by 2026</strong>, with Williamson County positioned as the premium growth engine in our region.
                </p>
              </Card>

              {/* Strategy */}
              <Card className="p-6 border-l-4" style={{ borderLeftColor: colors.greenMid }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5" style={{ color: colors.greenMid }} />
                  <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>Strategy</h3>
                </div>
                <p style={{ color: colors.textDark }}>
                  Target high-income homeowners in Franklin, Brentwood, and surrounding counties. Leverage social media presence, referral systems, and unwavering brand consistency.
                </p>
              </Card>

              {/* Execution */}
              <Card className="p-6 border-l-4" style={{ borderLeftColor: colors.gold }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5" style={{ color: colors.gold }} />
                  <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>Execution</h3>
                </div>
                <p style={{ color: colors.textDark }}>
                  Led by Jason (Marketing Director), with Instagram collaboration from Logan and project delivery accountability from Garrett. Ryan focuses on sales while Sidonie manages operations.
                </p>
              </Card>
            </div>

            {/* Outcome */}
            <Card className="p-8 mt-8 text-center" style={{ backgroundColor: colors.greenLight }}>
              <Award className="w-10 h-10 mx-auto mb-4" style={{ color: colors.greenDark }} />
              <h3 className="font-bold text-xl mb-3" style={{ color: colors.textDark }}>Expected Outcome</h3>
              <p className="text-lg" style={{ color: colors.textDark }}>
                Scalable, referral-driven growth with an elevated client experience and unmatched brand trust throughout Middle Tennessee.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* MARKET OPPORTUNITY */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto">
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
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Market Opportunity
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textDark }}>
                  U.S. Painting Industry Growth
                </h3>
                <p className="mb-4" style={{ color: colors.textDark }}>
                  The residential and commercial painting industry continues its steady upward trajectory, driven by:
                </p>
                <ul className="space-y-3">
                  {[
                    "Rising home values driving renovation investments",
                    "Post-pandemic home improvement momentum",
                    "Growing preference for professional services over DIY",
                    "Increased focus on curb appeal and home staging"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.greenDark }} />
                      <span style={{ color: colors.textDark }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.greenLight }}>
                  <p className="font-bold" style={{ color: colors.greenDark }}>
                    Market Growth: $42.1B (2023) → $45.8B (2026)
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textDark }}>
                    Representing an 8.8% increase over 4 years
                  </p>
                </div>
              </div>
              <div>
                <Card className="p-4 overflow-hidden">
                  <img 
                    src={industryGrowthChart} 
                    alt="U.S. Painting Industry Growth" 
                    className="w-full h-auto rounded"
                    data-testid="img-industry-growth"
                  />
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICE OFFERINGS & COMMERCIAL EXPANSION */}
      <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
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
                <Briefcase className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Service Offerings
              </h2>
            </div>

            {/* Service Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Residential */}
              <Card className="p-6 border-t-4" style={{ borderTopColor: colors.greenDark }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.textDark }}>
                  Residential Services
                </h3>
                <p className="mb-4 text-sm" style={{ color: colors.textDark }}>
                  Our core business serving homeowners in Middle Tennessee's most desirable neighborhoods.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Interior Painting",
                    "Exterior Painting", 
                    "Cabinet Refinishing",
                    "Deck & Fence Staining",
                    "Drywall Repair",
                    "Color Consultation"
                  ].map((service, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.greenDark }} />
                      <span className="text-sm" style={{ color: colors.textDark }}>{service}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.greenLight }}>
                  <p className="text-sm font-medium" style={{ color: colors.greenDark }}>
                    Current Mix: ~85% of revenue
                  </p>
                </div>
              </Card>

              {/* Commercial */}
              <Card className="p-6 border-t-4" style={{ borderTopColor: colors.gold }}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold" style={{ color: colors.textDark }}>
                    Commercial Services
                  </h3>
                  <Badge style={{ backgroundColor: colors.gold, color: colors.textDark }}>
                    Growth Focus
                  </Badge>
                </div>
                <p className="mb-4 text-sm" style={{ color: colors.textDark }}>
                  Expanding our footprint in the commercial sector with the same premium quality and attention to detail.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Office Buildings",
                    "Retail Spaces",
                    "Restaurants & Hospitality",
                    "Medical Facilities",
                    "Property Management",
                    "HOA Common Areas"
                  ].map((service, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.gold }} />
                      <span className="text-sm" style={{ color: colors.textDark }}>{service}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: colors.gold + "20" }}>
                  <p className="text-sm font-medium" style={{ color: colors.textDark }}>
                    Current Mix: ~15% of revenue | Target: 25-30% by Year 2
                  </p>
                </div>
              </Card>
            </div>

            {/* Commercial Expansion Strategy */}
            <Card className="p-6" style={{ backgroundColor: colors.background }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.textDark }}>
                Commercial Expansion Strategy
              </h3>
              <p className="mb-4" style={{ color: colors.textDark }}>
                The commercial painting market in Middle Tennessee represents a significant growth opportunity. With Nashville's continued development boom, we're strategically positioning NPP to capture a larger share of this market.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "white" }}>
                  <p className="text-2xl font-bold" style={{ color: colors.greenDark }}>$12.8B</p>
                  <p className="text-sm" style={{ color: colors.textDark }}>U.S. Commercial Painting Market (2026)</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "white" }}>
                  <p className="text-2xl font-bold" style={{ color: colors.gold }}>25-30%</p>
                  <p className="text-sm" style={{ color: colors.textDark }}>Target Commercial Revenue Mix</p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: "white" }}>
                  <p className="text-2xl font-bold" style={{ color: colors.greenDark }}>2x</p>
                  <p className="text-sm" style={{ color: colors.textDark }}>Avg. Commercial Project Value vs Residential</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-bold mb-3" style={{ color: colors.textDark }}>Key Initiatives:</h4>
                <ul className="space-y-2">
                  {[
                    "Build relationships with property managers and commercial real estate firms",
                    "Develop case studies from successful commercial projects",
                    "Create commercial-specific marketing materials and proposals",
                    "Establish partnerships with general contractors for new construction",
                    "Target recurring maintenance contracts for property management companies"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.gold }} />
                      <span className="text-sm" style={{ color: colors.textDark }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* TARGET AUDIENCE */}
      <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
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
                <PieChartIcon className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Target Audience by County
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-6" style={{ color: colors.textDark }}>
                  Our strategic focus prioritizes the highest-value markets in Middle Tennessee, with particular emphasis on affluent communities where premium painting services command top-tier pricing.
                </p>
                
                <div className="space-y-4">
                  {countyData.map((county) => (
                    <div key={county.name} className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: county.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium" style={{ color: colors.textDark }}>{county.name}</span>
                          <span className="font-bold" style={{ color: colors.greenDark }}>{county.value}%</span>
                        </div>
                        <div className="h-2 rounded-full mt-1" style={{ backgroundColor: colors.greenLight }}>
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ width: `${county.value}%`, backgroundColor: county.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.gold + "20" }}>
                  <p className="font-bold" style={{ color: colors.textDark }}>
                    <Star className="w-4 h-4 inline mr-2" style={{ color: colors.gold }} />
                    Williamson County Focus
                  </p>
                  <p className="text-sm mt-1" style={{ color: colors.textDark }}>
                    Franklin and Brentwood represent our highest-value market segment with median home values exceeding $800K and strong demand for premium finishes.
                  </p>
                </div>
              </div>
              
              <div>
                <Card className="p-6">
                  <h3 className="text-center font-serif text-xl mb-4" style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}>
                    Target Audience by County
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={countyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={30}
                        dataKey="value"
                        label={false}
                      >
                        {countyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {countyData.map((county) => (
                      <div key={county.name} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: county.color }}
                        />
                        <span className="text-xs" style={{ color: colors.textDark }}>
                          {county.name} ({county.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs mt-4" style={{ color: colors.textDark }}>
                    Nashville Painting Professionals
                  </p>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEAD SOURCES */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto">
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
                <Globe className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Lead Source Distribution
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Card className="p-4 overflow-hidden">
                  <img 
                    src={leadSourceChart} 
                    alt="Lead Source Distribution" 
                    className="w-full h-auto rounded"
                    data-testid="img-lead-source"
                  />
                </Card>
              </div>
              <div>
                <p className="mb-6" style={{ color: colors.textDark }}>
                  Understanding where our leads originate allows us to allocate marketing resources effectively and double down on high-performing channels.
                </p>
                
                <div className="space-y-4">
                  <Card className="p-4" style={{ borderLeft: `4px solid ${colors.greenDark}` }}>
                    <h4 className="font-bold" style={{ color: colors.textDark }}>Online (45%)</h4>
                    <p className="text-sm" style={{ color: colors.textDark }}>
                      Google Search, SEO, and website inquiries represent our largest lead source. Continued investment in local SEO and Google Business Profile optimization is critical.
                    </p>
                  </Card>
                  
                  <Card className="p-4" style={{ borderLeft: `4px solid ${colors.greenMid}` }}>
                    <h4 className="font-bold" style={{ color: colors.textDark }}>Referrals (30%)</h4>
                    <p className="text-sm" style={{ color: colors.textDark }}>
                      Word-of-mouth from satisfied customers. This validates our focus on exceptional client experience — happy clients become our best salespeople.
                    </p>
                  </Card>
                  
                  <Card className="p-4" style={{ borderLeft: `4px solid ${colors.gold}` }}>
                    <h4 className="font-bold" style={{ color: colors.textDark }}>Advertising (15%)</h4>
                    <p className="text-sm" style={{ color: colors.textDark }}>
                      Paid advertising including social media ads, local publications, and targeted digital campaigns in our focus counties.
                    </p>
                  </Card>
                  
                  <Card className="p-4" style={{ borderLeft: `4px solid ${colors.greenLight}` }}>
                    <h4 className="font-bold" style={{ color: colors.textDark }}>Other (10%)</h4>
                    <p className="text-sm" style={{ color: colors.textDark }}>
                      Yard signs, community events, partnerships with realtors and interior designers, and repeat customers.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GROWTH PROJECTION */}
      <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
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
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Projected Lead Growth
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-6" style={{ color: colors.textDark }}>
                  Our 12-month campaign is designed to scale lead generation from approximately <strong>25 leads per month</strong> to over <strong>145 leads per month</strong> — a 480% increase through systematic marketing execution.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="p-4 text-center" style={{ backgroundColor: colors.greenLight }}>
                    <p className="text-3xl font-bold" style={{ color: colors.greenDark }}>25</p>
                    <p className="text-sm" style={{ color: colors.textDark }}>Month 1 Leads</p>
                  </Card>
                  <Card className="p-4 text-center" style={{ backgroundColor: colors.gold + "30" }}>
                    <p className="text-3xl font-bold" style={{ color: colors.gold }}>145+</p>
                    <p className="text-sm" style={{ color: colors.textDark }}>Month 12 Leads</p>
                  </Card>
                </div>

                <h3 className="font-bold text-lg mb-3" style={{ color: colors.textDark }}>Growth Drivers:</h3>
                <ul className="space-y-2">
                  {[
                    "Consistent social media presence and engagement",
                    "Referral program with incentives for past clients",
                    "Local SEO optimization and review generation",
                    "Strategic partnerships with realtors and designers",
                    "Signature client experience driving word-of-mouth"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.greenDark }} />
                      <span className="text-sm" style={{ color: colors.textDark }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Card className="p-4 overflow-hidden">
                  <img 
                    src={leadGrowthChart} 
                    alt="Projected Lead Growth Over 12 Months" 
                    className="w-full h-auto rounded"
                    data-testid="img-lead-growth"
                  />
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 12-MONTH CAMPAIGN TIMELINE */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto">
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
                <Calendar className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                12-Month Campaign Timeline
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  phase: "Phase 1",
                  months: "Months 1-2",
                  title: "Branding & Digital Foundations",
                  items: [
                    "Finalize brand guidelines and visual identity",
                    "Optimize Google Business Profile",
                    "Launch refreshed website with SEO foundations",
                    "Establish baseline metrics and KPIs"
                  ],
                  color: colors.greenDark
                },
                {
                  phase: "Phase 2",
                  months: "Months 3-4",
                  title: "Social Media & Community Engagement",
                  items: [
                    "Launch Instagram strategy (led with Logan)",
                    "Activate Facebook and X presence (led by Jason)",
                    "Begin content calendar execution",
                    "Community event participation"
                  ],
                  color: colors.greenMid
                },
                {
                  phase: "Phase 3",
                  months: "Months 5-6",
                  title: "Referral Systems & Signature Experience",
                  items: [
                    "Launch formal referral program with incentives",
                    "Document and train team on signature client experience",
                    "Garrett's project management protocols fully operational",
                    "Begin collecting and showcasing testimonials"
                  ],
                  color: colors.gold
                },
                {
                  phase: "Phase 4",
                  months: "Months 7-12",
                  title: "Scale, Optimize, Expand",
                  items: [
                    "Analyze performance data and optimize channels",
                    "Scale high-performing marketing initiatives",
                    "Expand geographic reach within target counties",
                    "Build strategic partnerships with realtors and designers"
                  ],
                  color: colors.greenDark
                }
              ].map((phase, index) => (
                <Card 
                  key={index} 
                  className="p-6 border-l-4"
                  style={{ borderLeftColor: phase.color }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <Badge style={{ backgroundColor: phase.color, color: "white" }}>
                      {phase.phase}
                    </Badge>
                    <span className="text-sm font-medium" style={{ color: colors.greenDark }}>
                      {phase.months}
                    </span>
                    <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>
                      {phase.title}
                    </h3>
                  </div>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: phase.color }} />
                        <span className="text-sm" style={{ color: colors.textDark }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TEAM ROLES */}
      <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
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
                <Users className="w-6 h-6" style={{ color: colors.greenDark }} />
              </div>
              <h2 
                className="text-3xl md:text-4xl font-serif"
                style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
              >
                Team Roles & Responsibilities
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Jason", role: "Marketing Director", desc: "Overall marketing strategy, Facebook, X, brand consistency, campaign execution" },
                { name: "Logan", role: "Instagram Lead", desc: "Instagram content creation and engagement, visual brand representation" },
                { name: "Garrett", role: "Project Management", desc: "Signature client experience delivery, quality assurance, project execution" },
                { name: "Ryan", role: "Sales Focus", desc: "Lead conversion, client consultations, estimate presentations" },
                { name: "Sidonie", role: "Operations", desc: "Scheduling, crew coordination, administrative support" }
              ].map((person, index) => (
                <Card key={index} className="p-6">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: colors.greenLight }}
                  >
                    <span className="text-xl font-bold" style={{ color: colors.greenDark }}>
                      {person.name[0]}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>{person.name}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: colors.greenDark }}>{person.role}</p>
                  <p className="text-sm" style={{ color: colors.textDark }}>{person.desc}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 mt-8" style={{ backgroundColor: colors.greenLight }}>
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-6 h-6" style={{ color: colors.greenDark }} />
                <h3 className="font-bold text-lg" style={{ color: colors.textDark }}>Leadership Note</h3>
              </div>
              <p className="italic" style={{ color: colors.textDark }}>
                "Garrett's leadership ensures our brand promise becomes a lived reality. Execution is a leadership responsibility, not a shared one."
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* STEP 1: FOUNDATION SETUP - Static Display */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.greenDark }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Badge 
                className="mb-4 text-sm px-4 py-2"
                style={{ backgroundColor: colors.gold, color: colors.textDark }}
              >
                NPP_STEP1_FOUNDATION
              </Badge>
              <h2 
                className="text-3xl md:text-5xl font-serif mb-4"
                style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
              >
                Step 1: Foundation Setup
              </h2>
              <p className="text-xl italic" style={{ color: colors.greenLight }}>
                "We elevate the backdrop of your life."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 1 Content Slides */}
      <section className="py-16 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 mb-8" style={{ backgroundColor: colors.greenLight }}>
              <p className="font-medium" style={{ color: colors.greenDark }}>
                Purpose: Establish the infrastructure for the 12-month marketing campaign.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                "Brand & messaging alignment",
                "Asset inventory & access",
                "Website contract clarity",
                "Current vs. new site comparison",
                "AI tools integration",
                "Radio advertising strategy",
                "Team collaboration",
                "Weekly/biweekly checklist structure"
              ].map((item, i) => (
                <Card key={i} className="p-4 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.greenDark }} />
                  <span className="text-sm" style={{ color: colors.textDark }}>{item}</span>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h4 className="font-bold mb-3" style={{ color: colors.textDark }}>
                  Current Site: NashvillePaintingProfessionals.com
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: colors.textDark }}>
                  <li>• Traditional brochure-style site</li>
                  <li>• Limited SEO structure</li>
                  <li>• No dynamic content or funnel logic</li>
                  <li>• Not optimized for modern conversion</li>
                </ul>
              </Card>

              <Card className="p-6" style={{ backgroundColor: colors.greenLight }}>
                <h4 className="font-bold mb-3" style={{ color: colors.greenDark }}>
                  New Site: NashPaintPros.io
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: colors.textDark }}>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.greenDark }} />
                    Modern, fast, AI-driven marketing engine
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.greenDark }} />
                    Built for conversion, SEO, and scalability
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.greenDark }} />
                    Includes AI tools and automated workflows
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.greenDark }} />
                    Already outperforming legacy site by 3x
                  </li>
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Tools & Radio */}
      <section className="py-16 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h4 className="font-bold mb-3" style={{ color: colors.greenDark }}>AI Paint Visualizer</h4>
                <p className="text-sm" style={{ color: colors.textDark }}>
                  Homeowners preview colors on their actual home photos.
                </p>
              </Card>
              <Card className="p-6">
                <h4 className="font-bold mb-3" style={{ color: colors.greenDark }}>Square Footage Estimate Scanner</h4>
                <p className="text-sm" style={{ color: colors.textDark }}>
                  Calculates project size. Bundles all info into a one-click send-to-team package.
                </p>
              </Card>
            </div>

            <Card className="p-6" style={{ backgroundColor: colors.gold + "20" }}>
              <h4 className="font-bold mb-3" style={{ color: colors.textDark }}>Nashville Radio Advertising</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm" style={{ color: colors.textDark }}>
                <div>
                  <p className="font-medium">Pricing</p>
                  <p>$25–$100+ per airing</p>
                  <p>$200–$5,000/week</p>
                </div>
                <div>
                  <p className="font-medium">Target</p>
                  <p>Homeowners 30–65</p>
                </div>
                <div>
                  <p className="font-medium">Deliverables</p>
                  <p>30-sec script, 4-week test</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Step 1 Deliverables - Full Explanations */}
      <section className="py-16 px-6" style={{ backgroundColor: "white" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 
              className="text-2xl font-serif mb-8"
              style={{ color: colors.textDark, fontFamily: "'Playfair Display', serif" }}
            >
              Step 1 Deliverables
            </h3>
            
            <div className="space-y-6">
              {/* Approved Tagline Usage */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>Approved Tagline Usage</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      Official confirmation and deployment of NPP's brand tagline: <strong>"We elevate the backdrop of your life."</strong>
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: colors.textDark }}>
                      <li>• Approved for use on letterhead, invoices, and proposals</li>
                      <li>• Integrated into social media headers and bios</li>
                      <li>• Placement on website header/footer (pending Horton contract rules)</li>
                      <li>• Incorporated into all marketing materials and radio scripts</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Complete Brand Asset Library */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>Complete Brand Asset Library</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      Centralized collection of all brand materials for consistent marketing execution.
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: colors.textDark }}>
                      <li>• Logo files (all formats: PNG, SVG, PDF)</li>
                      <li>• Official color codes (Dark Green #1F3D2B, Gold #E8C15C, Cream #FAF7F0)</li>
                      <li>• Typography guidelines (Playfair Display for headers)</li>
                      <li>• Social media templates, flyer templates, ad templates</li>
                      <li>• Access credentials for Facebook, Instagram, Google Business Profile, Meta Ads, Google Ads</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Website Contract Clarity Summary */}
              <Card className="p-6" style={{ backgroundColor: colors.greenLight }}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold }}>
                    <Award className="w-5 h-5" style={{ color: colors.textDark }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.greenDark }}>Website Contract Clarity Summary (Horton Group)</h4>
                    <p className="text-sm mb-3 font-medium" style={{ color: colors.greenDark }}>
                      Full understanding of existing contractual obligations and NPP's rights:
                    </p>
                    <div className="text-sm space-y-3" style={{ color: colors.textDark }}>
                      <div>
                        <p className="font-bold" style={{ color: colors.greenDark }}>What Horton Owns:</p>
                        <p>The website they built (NashvillePaintingProfessionals.com) and the server it lives on.</p>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: colors.greenDark }}>What Horton Does NOT Own:</p>
                        <ul className="ml-4">
                          <li>• NPP's brand, logo, or intellectual property</li>
                          <li>• NPP's domain name</li>
                          <li>• NPP's right to build additional websites</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: colors.greenDark }}>Key Contract Facts:</p>
                        <ul className="ml-4">
                          <li>• <strong>No exclusivity clause</strong> - NPP can have multiple web properties</li>
                          <li>• <strong>No non-compete language</strong> - NPP can work with any vendor</li>
                          <li>• <strong>No restrictions</strong> on building new marketing sites</li>
                          <li>• <strong>Only binding obligation:</strong> Remaining financial payments</li>
                          <li>• Leaving early only removes Horton's support - no litigation risk</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg mt-4" style={{ backgroundColor: "white" }}>
                        <p className="font-bold" style={{ color: colors.greenDark }}>Bottom Line:</p>
                        <p>NPP is free to use NashPaintPros.io as the primary marketing engine while maintaining the legacy Horton site for the duration of the contract. There is no legal barrier to this approach.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current vs. New Site Comparison */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>Current vs. New Site Comparison</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      Documented analysis showing why NashPaintPros.io is the superior marketing platform.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-bold mb-2" style={{ color: colors.textDark }}>Legacy Site Limitations:</p>
                        <ul style={{ color: colors.textDark }}>
                          <li>• Static brochure-style design</li>
                          <li>• No SEO optimization</li>
                          <li>• No conversion funnels</li>
                          <li>• WordPress maintenance burden</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-bold mb-2" style={{ color: colors.greenDark }}>New Site Advantages:</p>
                        <ul style={{ color: colors.textDark }}>
                          <li>• AI-powered tools (visualizer, scanner)</li>
                          <li>• Built for SEO and conversions</li>
                          <li>• 3x performance with zero promotion</li>
                          <li>• Modern, fast, scalable</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Tools Integrated */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>AI Tools Integrated into Workflow</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      Competitive advantage through technology that no other local painter offers.
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: colors.textDark }}>
                      <li>• <strong>AI Paint Visualizer:</strong> Customers preview colors on their actual home photos before committing</li>
                      <li>• <strong>Square Footage Scanner:</strong> Quick estimate calculations bundled into one-click lead packages</li>
                      <li>• Team trained on using AI tools in sales process</li>
                      <li>• Integration into marketing messaging highlighting tech leadership</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Radio Advertising Test Plan */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>Radio Advertising Test Plan</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      4-week pilot campaign to test radio effectiveness in Nashville market.
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: colors.textDark }}>
                      <li>• 30-second script featuring official tagline</li>
                      <li>• Target demographic: Homeowners 30-65</li>
                      <li>• Budget range: $200-$5,000/week depending on station selection</li>
                      <li>• Unique tracking phone number assigned for attribution</li>
                      <li>• Station selection based on audience demographics</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Lead Tracking Dashboard */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>Lead Tracking Dashboard (Initial)</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      Visibility into where leads come from and which channels perform best.
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: colors.textDark }}>
                      <li>• Document current lead tracking methods</li>
                      <li>• Identify top-performing lead sources</li>
                      <li>• Identify tracking gaps to address</li>
                      <li>• Unique tracking numbers assigned: Radio, Social, Print</li>
                      <li>• Initial dashboard build for ongoing visibility</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Team Collaboration Structure */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: colors.gold + "30" }}>
                    <Award className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.textDark }}>Team Collaboration Structure</h4>
                    <p className="text-sm mb-3" style={{ color: colors.textDark }}>
                      Clear roles and processes for marketing execution across the team.
                    </p>
                    <ul className="text-sm space-y-1" style={{ color: colors.textDark }}>
                      <li>• Identified contacts for: Field content capture, Approvals, Project updates</li>
                      <li>• Social media support roles confirmed</li>
                      <li>• Shared content library established</li>
                      <li>• Content submission workflow documented</li>
                      <li>• Weekly/biweekly checklist structure for ongoing accountability</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.greenDark }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Megaphone className="w-16 h-16 mx-auto mb-6" style={{ color: colors.gold }} />
            <h2 
              className="text-3xl md:text-5xl font-serif mb-6"
              style={{ color: "white", fontFamily: "'Playfair Display', serif" }}
            >
              Let's Build the Most Trusted Painting Brand in Middle Tennessee
            </h2>
            <p className="text-xl mb-8" style={{ color: colors.greenLight }}>
              Together, we will elevate the backdrop of our clients' lives.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="text-lg px-6 py-3" style={{ backgroundColor: colors.gold, color: colors.textDark }}>
                Nashville Painting Professionals
              </Badge>
              <Badge className="text-lg px-6 py-3" style={{ backgroundColor: "white", color: colors.greenDark }}>
                2026 Marketing Campaign
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-5xl mx-auto text-center">
          <img 
            src={nppLogo} 
            alt="Nashville Painting Professionals" 
            className="w-32 mx-auto mb-4"
          />
          <p className="text-sm" style={{ color: colors.textDark }}>
            Nashville Painting Professionals | Marketing Campaign 2026
          </p>
          <p className="text-sm italic mt-2" style={{ color: colors.greenDark }}>
            "We elevate the backdrop of your life."
          </p>
        </div>
      </footer>
    </div>
  );
}
