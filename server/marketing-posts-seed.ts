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
  { content: "What's your painting business missing? AI estimates, online booking, CRM, crew tracking - get it all at paintpros.io", category: "general" }
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
