import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import AOS from "aos";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EmployeesList from "@/pages/EmployeesList";
import BadRequest from "@/pages/errors/BadRequest";
import Unauthorized from "@/pages/errors/Unauthorized";
import Forbidden from "@/pages/errors/Forbidden";
import ServerError from "@/pages/errors/ServerError";
import Maintenance from "@/pages/errors/Maintenance";
import { CookiePolicy, PrivacyPolicy, TermsOfService } from "@/pages/Legal";
import CompanyProfile from "@/pages/CompanyProfile";
import OrganizationChart from "@/pages/OrganizationChart";
import AboutPage from "@/pages/AboutPage";
import ClientsPage from "@/pages/ClientsPage";
import ContactPage from "@/pages/ContactPage";
import GalleryPage from "@/pages/GalleryPage";
import ServicesPage from "@/pages/ServicesPage";
import StoneCareProductPage from "@/pages/StoneCareProductPage";
import StoneCareShopPage from "@/pages/StoneCareShopPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/" component={ServicesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/about/" component={AboutPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/gallery/" component={GalleryPage} />
      <Route path="/clients" component={ClientsPage} />
      <Route path="/clients/" component={ClientsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/contact/" component={ContactPage} />
      <Route path="/stone-care/shops/:slug" component={StoneCareProductPage} />
      <Route path="/stone-care/shops/:slug/" component={StoneCareProductPage} />
      <Route path="/stone-care/shops" component={StoneCareShopPage} />
      <Route path="/stone-care/shops/" component={StoneCareShopPage} />
      <Route path="/employees/list" component={EmployeesList} />
      <Route path="/error/400" component={BadRequest} />
      <Route path="/error/401" component={Unauthorized} />
      <Route path="/error/403" component={Forbidden} />
      <Route path="/error/404" component={NotFound} />
      <Route path="/error/500" component={ServerError} />
      <Route path="/error/503" component={Maintenance} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/company/company-profile" component={CompanyProfile} />
      <Route path="/company/company-profile/" component={CompanyProfile} />
      <Route path="/company/organization-chart" component={OrganizationChart} />
      <Route path="/company/organization-chart/" component={OrganizationChart} />
      <Route path="/company-profile" component={CompanyProfile} />
      <Route path="/company-profile/" component={CompanyProfile} />
      <Route path="/organization-chart" component={OrganizationChart} />
      <Route path="/organization-chart/" component={OrganizationChart} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 90,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
