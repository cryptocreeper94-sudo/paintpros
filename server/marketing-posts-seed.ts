import { db } from "./db";
import { marketingPosts } from "@shared/schema";

export const MARKETING_POSTS = [
  // AI Estimator Posts (10)
  { content: "Get instant painting estimates in seconds with our AI-powered room scanner. Upload a photo, get accurate square footage. Try it free at paintpros.io", category: "ai-estimator" },
  { content: "Stop guessing on paint jobs. Our AI Scanner analyzes your room photos and calculates exact square footage. Accurate estimates, every time. #PaintingPros", category: "ai-estimator" },
  { content: "Professional painters use PaintPros AI to create accurate estimates 10x faster. See why contractors are switching to smart estimating.", category: "ai-estimator" },
  { content: "Upload a room photo, get instant measurements. Our AI does the math so you can focus on what you do best - painting. paintpros.io", category: "ai-estimator" },
  { content: "Tired of on-site visits just for estimates? Our AI room scanner gives you accurate sq ft from any photo. Try the future of painting estimates.", category: "ai-estimator" },
  { content: "Good, Better, Best pricing packages generated instantly. Give your customers options they'll love. Powered by AI at paintpros.io", category: "ai-estimator" },
  { content: "From photo to proposal in minutes. PaintPros AI handles the measurements, you close the deal. #PaintingBusiness #AITools", category: "ai-estimator" },
  { content: "Accurate estimates build trust. Our AI Scanner ensures your quotes are spot-on every time. No more underestimating jobs.", category: "ai-estimator" },
  { content: "New feature alert: Multi-room scanning! Upload photos of every room and get a complete whole-house estimate in minutes.", category: "ai-estimator" },
  { content: "Smart estimating for smart contractors. PaintPros AI - because your time is valuable. Get started free today.", category: "ai-estimator" },

  // Color Selection Posts (8)
  { content: "Can't decide on a paint color? Our AI Color Visualizer lets you preview any color on your actual walls before you buy. Try it now!", category: "color-selection" },
  { content: "Sherwin-Williams, Benjamin Moore, Behr - all major brands in one color library. Find the perfect shade at paintpros.io #PaintColors", category: "color-selection" },
  { content: "Upload a photo of your room, pick a color, see it on your walls instantly. The future of color selection is here.", category: "color-selection" },
  { content: "Coordinating colors made easy. Our AI suggests trim, accent, and coordinating colors that work together beautifully.", category: "color-selection" },
  { content: "From Agreeable Gray to Naval - browse trending paint colors and see them in your space. AI visualization at paintpros.io", category: "color-selection" },
  { content: "No more paint samples on the wall. Visualize unlimited colors instantly with our AI Room Previewer. #HomeImprovement", category: "color-selection" },
  { content: "Your clients can pick colors from their phone and see instant previews. Close more deals with confident color choices.", category: "color-selection" },
  { content: "LRV ratings, undertones, coordinating colors - everything you need to make the perfect color choice. All in one app.", category: "color-selection" },

  // Online Booking Posts (6)
  { content: "Let customers book painting services online, 24/7. No phone tag, no missed calls. Just easy scheduling at paintpros.io", category: "booking" },
  { content: "Our 5-step booking wizard makes scheduling a paint job as easy as ordering food. Simple for customers, powerful for you.", category: "booking" },
  { content: "Reduce admin time by 50% with online booking. Customers self-schedule, you get all the details. Win-win.", category: "booking" },
  { content: "Automated appointment reminders reduce no-shows by 80%. Never lose a job to a forgotten appointment again.", category: "booking" },
  { content: "Calendar integration, automatic confirmations, customer notifications - booking that works while you work.", category: "booking" },
  { content: "From estimate request to booked job in one seamless flow. Convert more leads with frictionless booking.", category: "booking" },

  // Crew Management Posts (6)
  { content: "Track crew hours, manage job notes, and monitor progress - all from one dashboard. Crew management made simple.", category: "crew" },
  { content: "GPS job tracking, time entries, and incident reporting. Keep your painting crews organized and accountable.", category: "crew" },
  { content: "Crew leads can clock in, add job photos, and submit notes from their phone. Real-time updates to the office.", category: "crew" },
  { content: "Know where your crews are and what they're working on. PaintPros crew management keeps everyone connected.", category: "crew" },
  { content: "Time tracking that actually works for painters. Simple clock-in/out with automatic job assignment.", category: "crew" },
  { content: "From job assignment to completion tracking - manage your entire paint crew from one place.", category: "crew" },

  // CRM & Lead Management Posts (6)
  { content: "Never lose a lead again. Our painting CRM tracks every prospect from first contact to closed deal. #SalesManagement", category: "crm" },
  { content: "Follow-up reminders, deal stages, activity tracking - CRM built specifically for painting contractors.", category: "crm" },
  { content: "Convert more estimates to jobs with smart follow-up automation. Know exactly when to reach out.", category: "crm" },
  { content: "All your customer info in one place. Past jobs, preferences, notes - everything you need to deliver great service.", category: "crm" },
  { content: "Pipeline visibility that helps you forecast revenue and prioritize hot leads. Paint smarter, not harder.", category: "crm" },
  { content: "From cold lead to repeat customer - track the entire journey with our painting-focused CRM.", category: "crm" },

  // Proposals & Documents Posts (6)
  { content: "Professional proposals in minutes. Good/Better/Best packages, digital signatures, instant delivery. Close deals faster.", category: "proposals" },
  { content: "Digital contracts with e-signatures. No more chasing paperwork. Get signed agreements in minutes, not days.", category: "proposals" },
  { content: "Blockchain-verified documents for ultimate trust. Every estimate and contract is tamper-proof and verifiable.", category: "proposals" },
  { content: "PDF proposals that look as professional as your work. Custom branding, clear pricing, easy to sign.", category: "proposals" },
  { content: "Track when customers view your proposals. Know the perfect moment to follow up and close the deal.", category: "proposals" },
  { content: "From estimate to signed contract in one click. Streamline your sales process with digital proposals.", category: "proposals" },

  // Blockchain & Verification Posts (4)
  { content: "First painting company software verified on Solana blockchain. Every document is tamper-proof and traceable. #Web3", category: "blockchain" },
  { content: "Blockchain-verified estimates build trust like nothing else. Show customers their documents are authenticated.", category: "blockchain" },
  { content: "QR code verification on every estimate. Customers can instantly verify authenticity. Future-proof your business.", category: "blockchain" },
  { content: "Dual-chain verification: Solana + Darkwave. Enterprise-grade document security for painting professionals.", category: "blockchain" },

  // Franchise & Multi-Location Posts (4)
  { content: "Scaling your painting business? PaintPros supports multi-location franchises with territory management and centralized reporting.", category: "franchise" },
  { content: "Partner API access for franchise owners. Connect your locations, share data, maintain brand consistency.", category: "franchise" },
  { content: "From one truck to fifty locations - PaintPros grows with your painting business. #Franchise #Growth", category: "franchise" },
  { content: "White-label solution for painting franchises. Your brand, our technology. Scale without limits.", category: "franchise" },

  // General Value Props (6)
  { content: "The all-in-one platform for professional painters. Estimates, booking, CRM, crew management - one login, everything you need.", category: "general" },
  { content: "Join thousands of painting contractors who've upgraded their business with PaintPros. Free trial at paintpros.io", category: "general" },
  { content: "From solo painter to enterprise fleet - PaintPros has the tools for every stage of your business.", category: "general" },
  { content: "Modern painting business. Modern tools. PaintPros gives you the technology edge over your competition.", category: "general" },
  { content: "Save 10+ hours per week on admin tasks. Spend more time painting, less time on paperwork. #WorkSmarter", category: "general" },
  { content: "What's your painting business missing? AI estimates, online booking, CRM, crew tracking - get it all at paintpros.io", category: "general" },

  // Trade Vertical - Roofing (7)
  { content: "RoofPros.io is coming - AI-powered estimates for roofing contractors. Same smart technology, built for roofers. Join the waitlist.", category: "trade-roofing" },
  { content: "Roofing contractors: Drone photos + AI = instant roof measurements and accurate estimates. Coming soon to roofpros.io", category: "trade-roofing" },
  { content: "From shingle replacement to full roof installation - RoofPros AI will calculate materials, labor, and pricing instantly.", category: "trade-roofing" },
  { content: "Commercial and residential roofing estimates powered by AI. RoofPros.io - launching soon for smart roofing contractors.", category: "trade-roofing" },
  { content: "Weather damage assessments in minutes, not hours. RoofPros AI analyzes photos and generates professional estimates fast.", category: "trade-roofing" },
  { content: "Stop climbing roofs just for estimates. RoofPros AI calculates square footage from drone or ground photos. #RoofingBusiness", category: "trade-roofing" },
  { content: "The future of roofing estimates is here. AI-powered, accurate, professional. RoofPros.io coming Q1 2025.", category: "trade-roofing" },

  // Trade Vertical - HVAC (7)
  { content: "HVACPros.io launching soon - AI-powered load calculations and system sizing for HVAC contractors. Join the waitlist.", category: "trade-hvac" },
  { content: "HVAC contractors: Get instant BTU calculations and equipment recommendations with AI. Coming to hvacpros.io", category: "trade-hvac" },
  { content: "From furnace replacement to full system installation - HVACPros AI handles the calculations, you close the deal.", category: "trade-hvac" },
  { content: "Residential and commercial HVAC estimates powered by smart technology. HVACPros.io - the future of HVAC sales.", category: "trade-hvac" },
  { content: "Room-by-room load calculations in minutes. Upload floor plans, get accurate system sizing. HVACPros AI is coming.", category: "trade-hvac" },
  { content: "Stop guessing on equipment sizing. HVACPros AI provides accurate recommendations every time. #HVACContractor", category: "trade-hvac" },
  { content: "The HVAC industry needs smarter tools. We're building them. HVACPros.io coming 2025.", category: "trade-hvac" },

  // Trade Vertical - Electrical (7)
  { content: "ElectricPros.io is on the way - AI-powered estimates for electrical contractors. Panel upgrades, rewiring, installations.", category: "trade-electrical" },
  { content: "Electrical contractors: Calculate wire runs, breaker requirements, and labor hours with AI. Coming to electricpros.io", category: "trade-electrical" },
  { content: "From outlet installation to whole-house rewiring - ElectricPros AI generates accurate estimates instantly.", category: "trade-electrical" },
  { content: "Residential and commercial electrical estimates powered by smart technology. ElectricPros.io launching 2025.", category: "trade-electrical" },
  { content: "Code-compliant estimates every time. ElectricPros AI knows the requirements and calculates accordingly.", category: "trade-electrical" },
  { content: "Panel upgrade quotes in minutes, not hours. ElectricPros AI analyzes photos and generates professional proposals.", category: "trade-electrical" },
  { content: "Smart tools for smart electricians. ElectricPros.io - AI-powered estimates coming soon. #ElectricalContractor", category: "trade-electrical" },

  // Trade Vertical - Plumbing (7)
  { content: "PlumbPros.io launching soon - AI-powered estimates for plumbing contractors. Fixtures, piping, water heaters.", category: "trade-plumbing" },
  { content: "Plumbing contractors: Get instant material lists and labor calculations with AI. Coming to plumbpros.io", category: "trade-plumbing" },
  { content: "From faucet installation to whole-house repiping - PlumbPros AI handles the math, you focus on the work.", category: "trade-plumbing" },
  { content: "Residential and commercial plumbing estimates powered by smart technology. PlumbPros.io coming 2025.", category: "trade-plumbing" },
  { content: "Water heater replacement quotes in minutes. PlumbPros AI calculates sizing, materials, and labor accurately.", category: "trade-plumbing" },
  { content: "Stop underestimating plumbing jobs. PlumbPros AI ensures accurate pricing every time. #PlumbingBusiness", category: "trade-plumbing" },
  { content: "The plumbing industry is going digital. PlumbPros.io - AI estimates for professional plumbers.", category: "trade-plumbing" },

  // Trade Vertical - Landscaping (7)
  { content: "LandscapePros.io is coming - AI-powered estimates for landscaping contractors. Lawns, hardscape, irrigation.", category: "trade-landscaping" },
  { content: "Landscaping contractors: Calculate material quantities and labor hours with AI. Coming to landscapepros.io", category: "trade-landscaping" },
  { content: "From lawn installation to complete outdoor living spaces - LandscapePros AI generates professional estimates.", category: "trade-landscaping" },
  { content: "Residential and commercial landscaping estimates powered by smart technology. LandscapePros.io launching 2025.", category: "trade-landscaping" },
  { content: "Measure properties from aerial photos. LandscapePros AI calculates square footage and material needs instantly.", category: "trade-landscaping" },
  { content: "Paver patios, retaining walls, planting beds - accurate estimates for every landscaping project. #LandscapingBusiness", category: "trade-landscaping" },
  { content: "Smart landscaping starts with smart estimates. LandscapePros.io - AI-powered tools for pros.", category: "trade-landscaping" },

  // Trade Vertical - General Contracting (7)
  { content: "BuildPros.io launching soon - AI-powered estimates for general contractors. Remodels, additions, renovations.", category: "trade-general" },
  { content: "General contractors: Get comprehensive project estimates with AI analysis. Coming to buildpros.io", category: "trade-general" },
  { content: "From kitchen remodels to room additions - BuildPros AI calculates materials, trades, and timelines.", category: "trade-general" },
  { content: "Residential and commercial construction estimates powered by smart technology. BuildPros.io coming 2025.", category: "trade-general" },
  { content: "Coordinate multiple trades with AI-powered scheduling and cost estimation. BuildPros.io for general contractors.", category: "trade-general" },
  { content: "Stop losing money on underestimated projects. BuildPros AI ensures accurate pricing from day one.", category: "trade-general" },
  { content: "The GC industry needs better tools. We're building them. BuildPros.io - smarter estimates for smarter contractors.", category: "trade-general" }
];

export async function seedMarketingPosts() {
  console.log("[Marketing Seed] Starting to seed marketing posts...");
  
  try {
    for (const post of MARKETING_POSTS) {
      await db.insert(marketingPosts).values({
        content: post.content,
        category: post.category,
        isActive: true,
      }).onConflictDoNothing();
    }
    
    console.log(`[Marketing Seed] Successfully seeded ${MARKETING_POSTS.length} marketing posts`);
  } catch (error) {
    console.error("[Marketing Seed] Error seeding posts:", error);
    throw error;
  }
}

// Run when executed directly
seedMarketingPosts()
  .then(() => {
    console.log("[Marketing Seed] Complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[Marketing Seed] Failed:", err);
    process.exit(1);
  });
