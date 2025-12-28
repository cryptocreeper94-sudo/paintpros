import { db } from "./db";
import { marketingPosts } from "@shared/schema";

export const MARKETING_POSTS = [
  // AI Estimator Posts (10)
  {
    content: "PaintPros - Professional painting business software. Get instant painting estimates in seconds with our AI-powered room scanner. Upload a photo, get accurate square footage and pricing. Try it free: https://paintpros.io #PaintingBusiness #ContractorTools #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-ai-estimator.png"
  },
  {
    content: "Stop guessing on paint jobs. PaintPros AI Scanner analyzes your room photos and calculates exact square footage - accurate estimates every time. Professional painting software built for contractors: https://paintpros.io/estimator #PaintingPros #AITools #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-room-scanner.png"
  },
  {
    content: "Professional painters use PaintPros to create accurate estimates 10x faster. Our AI-powered platform handles measurements, pricing, and proposals automatically. See why contractors are switching: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-speed-estimate.png"
  },
  {
    content: "Upload a room photo, get instant measurements. PaintPros AI does the math so you can focus on what you do best - painting. Professional painting business management: https://paintpros.io/estimator #ContractorTools #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-photo-upload.png"
  },
  {
    content: "Tired of on-site visits just for estimates? PaintPros AI room scanner gives you accurate square footage from any photo. Remote estimating made easy: https://paintpros.io #PaintingBusiness #RemoteEstimates #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-remote-estimate.png"
  },
  {
    content: "From photo to proposal in minutes. PaintPros - the complete painting business platform. AI handles measurements, you close the deal. Get started free: https://paintpros.io #PaintingBusiness #AITools #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-proposal.png"
  },
  {
    content: "Accurate estimates build customer trust. PaintPros AI Scanner ensures your quotes are spot-on every time - no more underestimating jobs. Professional painting software: https://paintpros.io #ContractorLife #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-accurate-quotes.png"
  },
  {
    content: "NEW: Multi-Room Scanner from PaintPros! Upload photos of every room and get a complete whole-house estimate in minutes. AI-powered accuracy for painting contractors: https://paintpros.io/multi-room-scanner #PaintingBusiness #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-multi-room-scanner.png"
  },
  {
    content: "Smart estimating for smart contractors. PaintPros AI - professional painting business software that saves you 10+ hours per week. Your time is valuable: https://paintpros.io #ContractorTools #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-time-savings.png"
  },
  {
    content: "PaintPros transforms how painting contractors do business. AI estimates, online booking, crew management - all in one platform. Join thousands of pros: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "ai-estimator",
    imageUrl: "/marketing/paintpros-all-in-one.png"
  },

  // Color Selection Posts (8)
  {
    content: "Can't decide on a paint color? PaintPros AI Color Visualizer lets you preview any color on your actual walls before buying. Professional painting software: https://paintpros.io/colors #PaintColors #HomeImprovement #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-color-visualizer.png"
  },
  {
    content: "Sherwin-Williams, Benjamin Moore, Behr - all major paint brands in one color library. PaintPros makes color selection easy for contractors and customers: https://paintpros.io/colors #PaintColors #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-color-library.png"
  },
  {
    content: "Upload a photo of your room, pick a color, see it on your walls instantly. PaintPros AI Visualizer - the future of paint color selection: https://paintpros.io/visualizer #HomeImprovement #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-wall-preview.png"
  },
  {
    content: "Coordinating colors made easy. PaintPros AI suggests trim, accent, and coordinating colors that work together beautifully. Professional painting software: https://paintpros.io/colors #InteriorDesign #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-coordinating-colors.png"
  },
  {
    content: "From Agreeable Gray to Naval - browse trending paint colors and see them in your space with PaintPros AI visualization. Try it free: https://paintpros.io/colors #TrendingColors #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-trending-colors.png"
  },
  {
    content: "No more paint samples on the wall. PaintPros AI Room Previewer lets you visualize unlimited colors instantly. Professional painting business software: https://paintpros.io/visualizer #HomeImprovement #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-no-samples.png"
  },
  {
    content: "Your clients can pick colors from their phone and see instant wall previews. PaintPros helps you close more deals with confident color choices: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-mobile-colors.png"
  },
  {
    content: "LRV ratings, undertones, coordinating colors - everything you need for the perfect color choice. PaintPros color tools for professionals: https://paintpros.io/colors #PaintColors #PaintPros",
    category: "color-selection",
    imageUrl: "/marketing/paintpros-color-info.png"
  },

  // Online Booking Posts (6)
  {
    content: "Let customers book painting services online, 24/7. PaintPros - no phone tag, no missed calls. Just easy scheduling for painting contractors: https://paintpros.io/booking #PaintingBusiness #PaintPros",
    category: "booking",
    imageUrl: "/marketing/paintpros-online-booking.png"
  },
  {
    content: "PaintPros 5-step booking wizard makes scheduling a paint job as easy as ordering food. Simple for customers, powerful for contractors: https://paintpros.io #ContractorTools #PaintPros",
    category: "booking",
    imageUrl: "/marketing/paintpros-booking-wizard.png"
  },
  {
    content: "Reduce admin time by 50% with PaintPros online booking. Customers self-schedule, you get all the details automatically. Professional painting software: https://paintpros.io/booking #PaintingBusiness #PaintPros",
    category: "booking",
    imageUrl: "/marketing/paintpros-admin-savings.png"
  },
  {
    content: "PaintPros automated appointment reminders reduce no-shows by 80%. Never lose a painting job to a forgotten appointment again: https://paintpros.io #ContractorLife #PaintPros",
    category: "booking",
    imageUrl: "/marketing/paintpros-reminders.png"
  },
  {
    content: "Calendar integration, automatic confirmations, customer notifications - PaintPros booking works while you work. Painting business management made easy: https://paintpros.io/booking #PaintingBusiness #PaintPros",
    category: "booking",
    imageUrl: "/marketing/paintpros-calendar.png"
  },
  {
    content: "From estimate request to booked job in one seamless flow. PaintPros helps you convert more leads with frictionless booking: https://paintpros.io #PaintingPros #PaintPros",
    category: "booking",
    imageUrl: "/marketing/paintpros-lead-conversion.png"
  },

  // Crew Management Posts (6)
  {
    content: "Track crew hours, manage job notes, and monitor progress - all from one dashboard. PaintPros crew management for painting contractors: https://paintpros.io/crew #CrewManagement #PaintPros",
    category: "crew",
    imageUrl: "/marketing/paintpros-crew-dashboard.png"
  },
  {
    content: "GPS job tracking, time entries, and incident reporting. PaintPros keeps your painting crews organized and accountable: https://paintpros.io/crew #PaintingBusiness #PaintPros",
    category: "crew",
    imageUrl: "/marketing/paintpros-gps-tracking.png"
  },
  {
    content: "Crew leads can clock in, add job photos, and submit notes from their phone. PaintPros provides real-time updates to the office: https://paintpros.io #ContractorTools #PaintPros",
    category: "crew",
    imageUrl: "/marketing/paintpros-mobile-crew.png"
  },
  {
    content: "Know where your crews are and what they're working on. PaintPros crew management keeps everyone connected. Professional painting software: https://paintpros.io/crew #PaintingBusiness #PaintPros",
    category: "crew",
    imageUrl: "/marketing/paintpros-crew-location.png"
  },
  {
    content: "Time tracking that actually works for painters. PaintPros offers simple clock-in/out with automatic job assignment: https://paintpros.io #CrewManagement #PaintPros",
    category: "crew",
    imageUrl: "/marketing/paintpros-time-tracking.png"
  },
  {
    content: "From job assignment to completion tracking - manage your entire paint crew from one place. PaintPros for painting contractors: https://paintpros.io/crew #PaintingBusiness #PaintPros",
    category: "crew",
    imageUrl: "/marketing/paintpros-job-management.png"
  },

  // CRM & Lead Management Posts (6)
  {
    content: "Never lose a lead again. PaintPros CRM tracks every prospect from first contact to closed deal. Professional painting business software: https://paintpros.io/crm #SalesManagement #PaintPros",
    category: "crm",
    imageUrl: "/marketing/paintpros-crm.png"
  },
  {
    content: "Follow-up reminders, deal stages, activity tracking - PaintPros CRM built specifically for painting contractors: https://paintpros.io/crm #PaintingBusiness #PaintPros",
    category: "crm",
    imageUrl: "/marketing/paintpros-follow-up.png"
  },
  {
    content: "Convert more estimates to jobs with PaintPros smart follow-up automation. Know exactly when to reach out: https://paintpros.io #ContractorTools #PaintPros",
    category: "crm",
    imageUrl: "/marketing/paintpros-automation.png"
  },
  {
    content: "All your customer info in one place. Past jobs, preferences, notes - everything you need to deliver great painting service. PaintPros CRM: https://paintpros.io/crm #PaintingBusiness #PaintPros",
    category: "crm",
    imageUrl: "/marketing/paintpros-customer-info.png"
  },
  {
    content: "Pipeline visibility that helps you forecast revenue and prioritize hot leads. PaintPros - paint smarter, not harder: https://paintpros.io #SalesManagement #PaintPros",
    category: "crm",
    imageUrl: "/marketing/paintpros-pipeline.png"
  },
  {
    content: "From cold lead to repeat customer - track the entire journey with PaintPros painting-focused CRM: https://paintpros.io/crm #PaintingBusiness #PaintPros",
    category: "crm",
    imageUrl: "/marketing/paintpros-customer-journey.png"
  },

  // Proposals & Documents Posts (6)
  {
    content: "Professional proposals in minutes. PaintPros offers digital signatures and instant delivery - close painting deals faster: https://paintpros.io/documents #PaintingBusiness #PaintPros",
    category: "proposals",
    imageUrl: "/marketing/paintpros-proposals.png"
  },
  {
    content: "Digital contracts with e-signatures. No more chasing paperwork. PaintPros gets signed agreements in minutes, not days: https://paintpros.io/documents #ContractorTools #PaintPros",
    category: "proposals",
    imageUrl: "/marketing/paintpros-esignatures.png"
  },
  {
    content: "Blockchain-verified documents for ultimate trust. Every PaintPros estimate and contract is tamper-proof and verifiable: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "proposals",
    imageUrl: "/marketing/paintpros-blockchain.png"
  },
  {
    content: "PDF proposals that look as professional as your work. PaintPros offers custom branding, clear pricing, easy signing: https://paintpros.io/documents #PaintingPros #PaintPros",
    category: "proposals",
    imageUrl: "/marketing/paintpros-pdf-proposals.png"
  },
  {
    content: "Track when customers view your proposals. PaintPros shows you the perfect moment to follow up and close the deal: https://paintpros.io #SalesManagement #PaintPros",
    category: "proposals",
    imageUrl: "/marketing/paintpros-proposal-tracking.png"
  },
  {
    content: "From estimate to signed contract in one click. PaintPros streamlines your painting sales process with digital proposals: https://paintpros.io/documents #PaintingBusiness #PaintPros",
    category: "proposals",
    imageUrl: "/marketing/paintpros-one-click.png"
  },

  // Blockchain & Verification Posts (4)
  {
    content: "First painting company software verified on Solana blockchain. Every PaintPros document is tamper-proof and traceable. Professional painting technology: https://paintpros.io #Web3 #PaintPros",
    category: "blockchain",
    imageUrl: "/marketing/paintpros-solana.png"
  },
  {
    content: "Blockchain-verified estimates build trust like nothing else. PaintPros shows customers their documents are authenticated: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "blockchain",
    imageUrl: "/marketing/paintpros-verified.png"
  },
  {
    content: "QR code verification on every estimate. PaintPros customers can instantly verify document authenticity. Future-proof your painting business: https://paintpros.io #ContractorTools #PaintPros",
    category: "blockchain",
    imageUrl: "/marketing/paintpros-qr-verify.png"
  },
  {
    content: "Dual-chain verification: Solana + Darkwave. PaintPros provides enterprise-grade document security for painting professionals: https://paintpros.io #Web3 #PaintPros",
    category: "blockchain",
    imageUrl: "/marketing/paintpros-dual-chain.png"
  },

  // Franchise & Multi-Location Posts (4)
  {
    content: "Scaling your painting business? PaintPros supports multi-location franchises with territory management and centralized reporting: https://paintpros.io/franchise #Franchise #PaintPros",
    category: "franchise",
    imageUrl: "/marketing/paintpros-franchise.png"
  },
  {
    content: "Partner API access for franchise owners. PaintPros connects your locations, shares data, and maintains brand consistency: https://paintpros.io/franchise #PaintingBusiness #PaintPros",
    category: "franchise",
    imageUrl: "/marketing/paintpros-partner-api.png"
  },
  {
    content: "From one truck to fifty locations - PaintPros grows with your painting business. Professional painting franchise software: https://paintpros.io #Franchise #Growth #PaintPros",
    category: "franchise",
    imageUrl: "/marketing/paintpros-growth.png"
  },
  {
    content: "White-label solution for painting franchises. Your brand, PaintPros technology. Scale your painting business without limits: https://paintpros.io/franchise #Franchise #PaintPros",
    category: "franchise",
    imageUrl: "/marketing/paintpros-white-label.png"
  },

  // General Value Props (6)
  {
    content: "PaintPros - the all-in-one platform for professional painters. Estimates, booking, CRM, crew management. One login, everything you need: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "general",
    imageUrl: "/marketing/paintpros-platform.png"
  },
  {
    content: "Join thousands of painting contractors who've upgraded their business with PaintPros. Professional painting software - try it free: https://paintpros.io #ContractorTools #PaintPros",
    category: "general",
    imageUrl: "/marketing/paintpros-join.png"
  },
  {
    content: "From solo painter to enterprise fleet - PaintPros has the tools for every stage of your painting business: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "general",
    imageUrl: "/marketing/paintpros-scale.png"
  },
  {
    content: "Modern painting business. Modern tools. PaintPros gives you the technology edge over your competition: https://paintpros.io #ContractorLife #PaintPros",
    category: "general",
    imageUrl: "/marketing/paintpros-modern.png"
  },
  {
    content: "Save 10+ hours per week on admin tasks with PaintPros. Spend more time painting, less time on paperwork: https://paintpros.io #WorkSmarter #PaintPros",
    category: "general",
    imageUrl: "/marketing/paintpros-save-time.png"
  },
  {
    content: "What's your painting business missing? AI estimates, online booking, CRM, crew tracking - get it all with PaintPros: https://paintpros.io #PaintingBusiness #PaintPros",
    category: "general",
    imageUrl: "/marketing/paintpros-complete.png"
  },

  // Trade Vertical - Roofing (7)
  {
    content: "RoofPros.io - AI-powered estimates for roofing contractors. Same smart technology from PaintPros, built for roofers. Learn more: https://roofpros.io #RoofingBusiness #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-hero.png"
  },
  {
    content: "Roofing contractors: Drone photos + AI = instant roof measurements and accurate estimates. RoofPros from the makers of PaintPros: https://roofpros.io #RoofingPros #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-drone.png"
  },
  {
    content: "From shingle replacement to full roof installation - RoofPros AI calculates materials, labor, and pricing instantly. Professional roofing software: https://roofpros.io #RoofingBusiness #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-materials.png"
  },
  {
    content: "Commercial and residential roofing estimates powered by AI. RoofPros - smart software for roofing contractors: https://roofpros.io #RoofingContractor #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-commercial.png"
  },
  {
    content: "Weather damage assessments in minutes, not hours. RoofPros AI analyzes photos and generates professional estimates fast: https://roofpros.io #StormDamage #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-weather.png"
  },
  {
    content: "Stop climbing roofs just for estimates. RoofPros AI calculates square footage from drone or ground photos. Smart roofing software: https://roofpros.io #RoofingBusiness #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-no-climb.png"
  },
  {
    content: "The future of roofing estimates is here. AI-powered, accurate, professional. RoofPros from the Orbit ecosystem: https://roofpros.io #RoofingPros #RoofPros",
    category: "trade-roofing",
    imageUrl: "/marketing/roofpros-future.png"
  },

  // Trade Vertical - HVAC (7)
  {
    content: "HVACPros.io - AI-powered load calculations and system sizing for HVAC contractors. From the makers of PaintPros: https://hvacpros.io #HVACContractor #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-hero.png"
  },
  {
    content: "HVAC contractors: Get instant BTU calculations and equipment recommendations with AI. HVACPros professional software: https://hvacpros.io #HVAC #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-btu.png"
  },
  {
    content: "From furnace replacement to full system installation - HVACPros AI handles the calculations, you close the deal: https://hvacpros.io #HVACBusiness #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-furnace.png"
  },
  {
    content: "Residential and commercial HVAC estimates powered by smart technology. HVACPros - professional contractor software: https://hvacpros.io #HVACContractor #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-commercial.png"
  },
  {
    content: "Room-by-room load calculations in minutes. Upload floor plans, get accurate system sizing. HVACPros AI for contractors: https://hvacpros.io #HVAC #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-load-calc.png"
  },
  {
    content: "Stop guessing on equipment sizing. HVACPros AI provides accurate recommendations every time. Smart HVAC software: https://hvacpros.io #HVACContractor #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-sizing.png"
  },
  {
    content: "The HVAC industry needs smarter tools. HVACPros delivers AI-powered estimates for professional contractors: https://hvacpros.io #HVACBusiness #HVACPros",
    category: "trade-hvac",
    imageUrl: "/marketing/hvacpros-smart.png"
  },

  // Trade Vertical - Electrical (7)
  {
    content: "ElectricPros.io - AI-powered estimates for electrical contractors. Panel upgrades, rewiring, installations. From the Orbit ecosystem: https://electricpros.io #ElectricalContractor #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-hero.png"
  },
  {
    content: "Electrical contractors: Calculate wire runs, breaker requirements, and labor hours with AI. ElectricPros professional software: https://electricpros.io #Electrician #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-wire-calc.png"
  },
  {
    content: "From outlet installation to whole-house rewiring - ElectricPros AI generates accurate estimates instantly: https://electricpros.io #ElectricalBusiness #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-rewiring.png"
  },
  {
    content: "Residential and commercial electrical estimates powered by smart technology. ElectricPros for contractors: https://electricpros.io #ElectricalContractor #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-commercial.png"
  },
  {
    content: "Code-compliant estimates every time. ElectricPros AI knows the requirements and calculates accordingly: https://electricpros.io #Electrician #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-code.png"
  },
  {
    content: "Panel upgrade quotes in minutes, not hours. ElectricPros AI analyzes photos and generates professional proposals: https://electricpros.io #ElectricalBusiness #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-panel.png"
  },
  {
    content: "Smart tools for smart electricians. ElectricPros - AI-powered estimates for professional electrical contractors: https://electricpros.io #ElectricalContractor #ElectricPros",
    category: "trade-electrical",
    imageUrl: "/marketing/electricpros-smart.png"
  },

  // Trade Vertical - Plumbing (7)
  {
    content: "PlumbPros.io - AI-powered estimates for plumbing contractors. Fixtures, piping, water heaters. From the Orbit ecosystem: https://plumbpros.io #PlumbingBusiness #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-hero.png"
  },
  {
    content: "Plumbing contractors: Get instant material lists and labor calculations with AI. PlumbPros professional software: https://plumbpros.io #Plumber #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-materials.png"
  },
  {
    content: "From faucet installation to whole-house repiping - PlumbPros AI handles the math, you focus on the work: https://plumbpros.io #PlumbingBusiness #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-repiping.png"
  },
  {
    content: "Residential and commercial plumbing estimates powered by smart technology. PlumbPros for contractors: https://plumbpros.io #PlumbingContractor #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-commercial.png"
  },
  {
    content: "Water heater replacement quotes in minutes. PlumbPros AI calculates sizing, materials, and labor accurately: https://plumbpros.io #Plumber #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-water-heater.png"
  },
  {
    content: "Stop underestimating plumbing jobs. PlumbPros AI ensures accurate pricing every time. Smart plumbing software: https://plumbpros.io #PlumbingBusiness #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-accurate.png"
  },
  {
    content: "The plumbing industry is going digital. PlumbPros - AI estimates for professional plumbing contractors: https://plumbpros.io #PlumbingContractor #PlumbPros",
    category: "trade-plumbing",
    imageUrl: "/marketing/plumbpros-digital.png"
  },

  // Trade Vertical - Landscaping (7)
  {
    content: "LandscapePros.io - AI-powered estimates for landscaping contractors. Lawns, hardscape, irrigation. From the Orbit ecosystem: https://landscapepros.io #LandscapingBusiness #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-hero.png"
  },
  {
    content: "Landscaping contractors: Calculate material quantities and labor hours with AI. LandscapePros professional software: https://landscapepros.io #Landscaping #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-materials.png"
  },
  {
    content: "From lawn installation to complete outdoor living spaces - LandscapePros AI generates professional estimates: https://landscapepros.io #LandscapingBusiness #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-outdoor.png"
  },
  {
    content: "Residential and commercial landscaping estimates powered by smart technology. LandscapePros for contractors: https://landscapepros.io #LandscapeContractor #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-commercial.png"
  },
  {
    content: "Measure properties from aerial photos. LandscapePros AI calculates square footage and material needs instantly: https://landscapepros.io #Landscaping #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-aerial.png"
  },
  {
    content: "Paver patios, retaining walls, planting beds - accurate estimates for every landscaping project. LandscapePros: https://landscapepros.io #LandscapingBusiness #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-hardscape.png"
  },
  {
    content: "Smart landscaping starts with smart estimates. LandscapePros - AI-powered tools for professional contractors: https://landscapepros.io #LandscapeContractor #LandscapePros",
    category: "trade-landscaping",
    imageUrl: "/marketing/landscapepros-smart.png"
  },

  // Trade Vertical - General Contracting (7)
  {
    content: "BuildPros.io - AI-powered estimates for general contractors. Remodels, additions, renovations. From the Orbit ecosystem: https://buildpros.io #GeneralContractor #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-hero.png"
  },
  {
    content: "General contractors: Get comprehensive project estimates with AI analysis. BuildPros professional software: https://buildpros.io #Construction #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-project.png"
  },
  {
    content: "From kitchen remodels to room additions - BuildPros AI calculates materials, trades, and timelines: https://buildpros.io #GeneralContractor #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-remodel.png"
  },
  {
    content: "Residential and commercial construction estimates powered by smart technology. BuildPros for GCs: https://buildpros.io #ConstructionBusiness #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-commercial.png"
  },
  {
    content: "Coordinate multiple trades with AI-powered scheduling and cost estimation. BuildPros for general contractors: https://buildpros.io #GeneralContractor #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-trades.png"
  },
  {
    content: "Stop losing money on underestimated projects. BuildPros AI ensures accurate pricing from day one: https://buildpros.io #ConstructionBusiness #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-accurate.png"
  },
  {
    content: "The GC industry needs better tools. BuildPros - smarter estimates for smarter general contractors: https://buildpros.io #GeneralContractor #BuildPros",
    category: "trade-general",
    imageUrl: "/marketing/buildpros-smart.png"
  }
];

export async function seedMarketingPosts() {
  console.log("[Marketing Seed] Starting to seed marketing posts...");
  
  try {
    for (const post of MARKETING_POSTS) {
      await db.insert(marketingPosts).values({
        content: post.content,
        category: post.category,
        imageUrl: post.imageUrl,
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
