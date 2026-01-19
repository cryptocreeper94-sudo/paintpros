import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AccessProvider } from "@/context/AccessContext";
import { DemoProvider } from "@/context/DemoContext";
import { DemoModeBanner } from "@/components/demo-mode-banner";
import { useAnalytics } from "@/hooks/useAnalytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import About from "@/pages/about";
import Reviews from "@/pages/reviews";
import Estimate from "@/pages/estimate";
import Admin from "@/pages/admin";
import Owner from "@/pages/owner";
import Developer from "@/pages/developer";
import ProjectManager from "@/pages/project-manager";
import Verify from "@/pages/verify";
import Pay from "@/pages/pay";
import ProposalSign from "@/pages/proposal-sign";
import Investors from "@/pages/investors";
import Compare from "@/pages/compare";
import Pricing from "@/pages/pricing";
import CrewLead from "@/pages/crew-lead";
import ContractorApplication from "@/pages/contractor-application";
import Blog from "@/pages/blog";
import TermsWarranty from "@/pages/terms-warranty";
import Account from "@/pages/account";
import Help from "@/pages/help";
import AuthPage from "@/pages/auth";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Awards from "@/pages/awards";
import Team from "@/pages/team";
import ColorLibrary from "@/pages/color-library";
import Resources from "@/pages/resources";
import Glossary from "@/pages/glossary";
import DemoViewer from "@/pages/demo-viewer";
import TrialSignup from "@/pages/trial-signup";
import TrialPortal from "@/pages/trial-portal";
import TrialUpgrade from "@/pages/trial-upgrade";
import TrialUpgradeSuccess from "@/pages/trial-upgrade-success";
import PartnershipProposal from "@/pages/proposal";
import IPAgreement from "@/pages/ip-agreement";
import RoyaltyDashboard from "@/pages/royalty-dashboard";
import PartnerDashboard from "@/pages/partner-dashboard";
import ProposalRyan from "@/pages/proposal-ryan";
import Marketing from "@/pages/marketing";
import Why40kFails from "@/pages/why-40k-fails";
import TradeVerticals from "@/pages/trade-verticals";
import EstimatorApp from "@/pages/estimator-app";
import EstimatorConfig from "@/pages/estimator-config";
import CreditsDashboard from "@/pages/credits-dashboard";
import CreditsSuccess from "@/pages/credits-success";
import CreditsCancel from "@/pages/credits-cancel";
import SubscriberDashboard from "@/pages/subscriber-dashboard";
import InvestorDemo from "@/pages/investor-demo";
import Partners from "@/pages/partners";
import PrivacyPolicy from "@/pages/privacy-policy";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import { PaintBuddy } from "@/components/ui/paint-buddy";

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/about" component={About} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/estimate" component={Estimate} />
      <Route path="/admin" component={Admin} />
      <Route path="/owner" component={Owner} />
      <Route path="/estimator-config" component={EstimatorConfig} />
      <Route path="/project-manager" component={ProjectManager} />
      <Route path="/developer" component={Developer} />
      <Route path="/verify/:hallmarkNumber" component={Verify} />
      <Route path="/pay/:estimateId" component={Pay} />
      <Route path="/proposal/:id/sign" component={ProposalSign} />
      <Route path="/investors" component={Investors} />
      <Route path="/investor-demo" component={InvestorDemo} />
      <Route path="/partnership-proposal" component={PartnershipProposal} />
      <Route path="/ip-agreement" component={IPAgreement} />
      <Route path="/royalty-dashboard" component={RoyaltyDashboard} />
      <Route path="/partner" component={PartnerDashboard} />
      <Route path="/proposal-ryan" component={ProposalRyan} />
      <Route path="/marketing" component={Marketing} />
      <Route path="/comparison" component={Why40kFails} />
      <Route path="/compare" component={Compare} />
      <Route path="/trade-verticals" component={TradeVerticals} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/crew-lead" component={CrewLead} />
      <Route path="/contractor-application" component={ContractorApplication} />
      <Route path="/blog" component={Blog} />
      <Route path="/terms" component={TermsWarranty} />
      <Route path="/warranty" component={TermsWarranty} />
      <Route path="/account" component={Account} />
      <Route path="/help" component={Help} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/awards" component={Awards} />
      <Route path="/team" component={Team} />
      <Route path="/colors" component={ColorLibrary} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/color-library" component={ColorLibrary} />
      <Route path="/resources" component={Resources} />
      <Route path="/demo-viewer" component={DemoViewer} />
      <Route path="/start-trial" component={TrialSignup} />
      <Route path="/trial/:slug" component={TrialPortal} />
      <Route path="/trial/:slug/upgrade" component={TrialUpgrade} />
      <Route path="/trial/:slug/upgrade-success" component={TrialUpgradeSuccess} />
      <Route path="/estimator-app" component={EstimatorApp} />
      <Route path="/credits" component={CreditsDashboard} />
      <Route path="/credits/success" component={CreditsSuccess} />
      <Route path="/credits/cancel" component={CreditsCancel} />
      <Route path="/subscriber-dashboard" component={SubscriberDashboard} />
      <Route path="/partners" component={Partners} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <DemoProvider>
            <AccessProvider>
              <TooltipProvider>
                <DemoModeBanner />
                <ScrollToTop />
                <AnalyticsTracker />
                <Toaster />
                <Router />
                <PaintBuddy />
              </TooltipProvider>
            </AccessProvider>
          </DemoProvider>
        </TenantProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
