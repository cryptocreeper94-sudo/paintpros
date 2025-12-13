import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TenantProvider } from "@/context/TenantContext";
import { ThemeProvider } from "@/context/ThemeContext";
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
import AreaManager from "@/pages/area-manager";
import Verify from "@/pages/verify";
import Pay from "@/pages/pay";
import ProposalSign from "@/pages/proposal-sign";
import Investors from "@/pages/investors";
import { PaintBuddy } from "@/components/ui/paint-buddy";

function AnalyticsTracker() {
  useAnalytics();
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
      <Route path="/area-manager" component={AreaManager} />
      <Route path="/developer" component={Developer} />
      <Route path="/verify/:hallmarkNumber" component={Verify} />
      <Route path="/pay/:estimateId" component={Pay} />
      <Route path="/proposal/:id/sign" component={ProposalSign} />
      <Route path="/investors" component={Investors} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>
          <TooltipProvider>
            <AnalyticsTracker />
            <Toaster />
            <Router />
            <PaintBuddy />
          </TooltipProvider>
        </TenantProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
