import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  Shield,
  CheckCircle2,
  ArrowRight,
  Car,
  Clock,
  Percent
} from "lucide-react";

export default function ProposalRyan() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-sm">Strategic Partnership Proposal</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Nashville Painting Professionals</h1>
          <p className="text-lg text-muted-foreground">Murfreesboro Sector Expansion</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Executive Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This proposal outlines a strategic partnership to expand Nashville Painting Professionals 
              into Rutherford County (Murfreesboro) through the Orbit ecosystem - a fully integrated 
              suite of business tools already powering contractors across multiple industries.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">$30,000</p>
                <p className="text-sm text-muted-foreground">3-Month Investment</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">&lt;5 weeks</p>
                <p className="text-sm text-muted-foreground">Payback Period</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">10x</p>
                <p className="text-sm text-muted-foreground">Functionality</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              The Orbit Ecosystem (All Live)
            </h2>
            <div className="grid gap-3">
              {[
                { name: "PaintPros.io", desc: "AI estimating, CRM, booking, crew management" },
                { name: "Orbit Staffing", desc: "Contractor marketplace, payroll, scheduling, bookkeeping" },
                { name: "RoofPros.io", desc: "Same platform for roofing contractors" },
                { name: "HVACPros.io", desc: "Same platform for HVAC contractors" },
                { name: "Darkwave Commerce", desc: "Payments, invoicing, blockchain verification" },
              ].map((item) => (
                <div key={item.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="font-medium">Founding Partner Benefits:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Direct integration with Orbit Staffing (simplified bookkeeping and payroll)</li>
                <li>Seamless data flow between all systems - zero double entry</li>
                <li>Priority access to new features before public release</li>
                <li>Direct input on platform development</li>
                <li>Future investor conversation potential</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Project Manager - Murfreesboro Sector
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-2">Scope of Services:</p>
                <ul className="space-y-2">
                  {["Project Management", "Marketing & Outreach", "IT Support", "Web Development", "SEO Placement", "Coordination & Oversight", "Orbit Staffing Integration"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Platform Features Included:</p>
                <ul className="space-y-2">
                  {["Custom AI Website", "AI Estimator + Rollie Voice", "Room Scanner & Color Visualizer", "CRM & Lead Management", "24/7 Online Booking", "Crew Management Tools", "Document Center", "SEO Management"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              The Numbers
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-destructive">Current Cost of Business (Status Quo)</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Expense</th>
                        <th className="text-right py-2">Monthly</th>
                        <th className="text-right py-2">Annual</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Current Website Provider</td>
                        <td className="text-right">$3,300</td>
                        <td className="text-right">$39,600</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Manual Estimating (10 hrs/week @ $50/hr)</td>
                        <td className="text-right">$2,000</td>
                        <td className="text-right">$24,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Lost Leads (no 24/7 booking)</td>
                        <td className="text-right">~$4,000</td>
                        <td className="text-right">~$48,000</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="py-2">Total Cost of Doing Nothing</td>
                        <td className="text-right text-destructive">$9,300</td>
                        <td className="text-right text-destructive">$111,600</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium text-green-600">Projected Returns with Orbit Partnership</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Improvement</th>
                        <th className="text-right py-2">Monthly Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">AI Estimator saves 10+ hours weekly</td>
                        <td className="text-right text-green-600">+$2,000 saved</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Improved lead capture (3 additional jobs/month)</td>
                        <td className="text-right text-green-600">+$24,000 revenue</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Reduced no-shows via automated reminders</td>
                        <td className="text-right text-green-600">+$2,000 saved</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="py-2">Net Monthly Benefit</td>
                        <td className="text-right text-green-600">+$28,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Investment Structure
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Payment</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Development Fee + Onboarding Deposit</td>
                    <td className="text-right font-medium">$5,000</td>
                    <td className="text-right text-muted-foreground">Upfront</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Weeks 1-4</td>
                    <td className="text-right">$2,000/week</td>
                    <td className="text-right text-muted-foreground">$8,000 total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Weeks 5-8</td>
                    <td className="text-right">$2,100/week</td>
                    <td className="text-right text-muted-foreground">$8,400 total</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Weeks 9-12</td>
                    <td className="text-right">$2,150/week</td>
                    <td className="text-right text-muted-foreground">$8,600 total</td>
                  </tr>
                  <tr className="font-bold bg-muted/50">
                    <td className="py-3">Total 3-Month Investment</td>
                    <td className="text-right text-primary text-lg">$30,000</td>
                    <td className="text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Performance Bonus Structure
            </h2>
            <p className="text-sm text-muted-foreground">
              Bonuses calculated on profit after cost - aligned incentives mean I only succeed when NPP succeeds.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Job Source</th>
                    <th className="text-right py-2">Bonus Rate</th>
                    <th className="text-right py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Jobs I Generate</td>
                    <td className="text-right font-bold text-primary">5%</td>
                    <td className="text-right text-muted-foreground">Leads I bring in directly</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Jobs Assigned to Me</td>
                    <td className="text-right font-bold text-primary">3%</td>
                    <td className="text-right text-muted-foreground">Existing leads handed to me</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Realtor Referrals</td>
                    <td className="text-right font-bold text-primary">8%</td>
                    <td className="text-right text-muted-foreground">Split 4% me / 4% realtor</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-medium mb-2">Example Payouts (on $10,000 profit job):</p>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="font-bold text-primary">$500</p>
                  <p className="text-muted-foreground">I generate lead</p>
                </div>
                <div>
                  <p className="font-bold text-primary">$300</p>
                  <p className="text-muted-foreground">Assigned lead</p>
                </div>
                <div>
                  <p className="font-bold text-primary">$400 + $400</p>
                  <p className="text-muted-foreground">Realtor referral</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Additional Terms
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium mb-2">Mileage Reimbursement</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span>Wilson or Rutherford County</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span>Outside Territory</span>
                    <span className="font-medium text-primary">$0.67/mile</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Extra Work (Outside Normal Scope)
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span>Weekdays</span>
                    <span className="font-medium text-primary">$35/hr (2-hr min)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-muted/50">
                    <span>Weekends</span>
                    <span className="font-medium text-primary">$60/hr (2-hr min)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Why This Deal Makes Sense
            </h2>
            
            <div className="grid gap-3">
              {[
                { title: "Eliminate Waste", desc: "Stop paying $111,600/year for an underperforming system" },
                { title: "Rapid ROI", desc: "Investment pays for itself within 5 weeks" },
                { title: "Operational Efficiency", desc: "Orbit Staffing integration streamlines bookkeeping" },
                { title: "Aligned Incentives", desc: "Performance bonuses mean shared success" },
                { title: "Ecosystem Access", desc: "Founding partner positioning in a growing platform" },
                { title: "Future Opportunity", desc: "Pathway to deeper investment conversations" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <ArrowRight className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Move Forward?</h2>
            <p className="opacity-90">
              This is a limited-time founding partner opportunity. The ecosystem is live, 
              other contractors are already expressing interest, and market timing is critical.
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="lg" className="gap-2" data-testid="button-schedule-call">
                Schedule a Conversation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm opacity-75 pt-4">Prepared by Orbit Ventures</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
