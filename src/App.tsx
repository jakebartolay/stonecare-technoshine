import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useEffect } from "react";
import AOS from "aos";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EmployeesList from "@/pages/EmployeesList";
import AdminLogin from "@/pages/AdminLogin";
import { AdminContent, AdminDashboard, AdminEmployees, AdminGallery, AdminProducts, AdminReels, AdminReviews, AdminServices } from "@/pages/AdminPanel";
import BadRequest from "@/pages/errors/BadRequest";
import AdminUrlError from "@/pages/errors/AdminUrlError";
import Unauthorized from "@/pages/errors/Unauthorized";
import Forbidden from "@/pages/errors/Forbidden";
import ServerError from "@/pages/errors/ServerError";
import Maintenance from "@/pages/errors/Maintenance";
import { CookiePolicy, PrivacyPolicy, TermsOfService } from "@/pages/Legal";
import CompanyProfile from "@/pages/CompanyProfile";
import CompanyProfilePreview from "@/pages/CompanyProfilePreview";
import OrganizationChart from "@/pages/OrganizationChart";
import AboutPage from "@/pages/AboutPage";
import ClientsPage from "@/pages/ClientsPage";
import ContactPage from "@/pages/ContactPage";
import GalleryRedesignPage from "@/pages/GalleryRedesignPage";
import ServiceShowcasePage from "@/pages/ServiceShowcasePage";
import ServicesPage from "@/pages/ServicesPage";
import HelpPage from "@/pages/HelpPage";
import ProductInfoPage from "@/pages/ProductInfoPage";
import StoneCareProductPage from "@/pages/StoneCareProductPage";
import StoneCareShopPage from "@/pages/StoneCareShopPage";
import { heartbeatIntervalMs, trackSiteVisitor } from "@/lib/site-analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const tMg3ProductInfoPath = "/help/product-info/marble-glazer-t-mg3-synthetic-stone";

function LegacyTmg3ProductHelpRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate(tMg3ProductInfoPath, { replace: true });
  }, [navigate]);

  return null;
}

function Router() {
  return (
    <Switch>
      {/* Visible to public users: /, /services, /services/:slug, /about, /gallery, /clients, /contact */}
      <Route path="/" component={Home} />
      <Route path="/services/:slug" component={ServiceShowcasePage} />
      <Route path="/services/:slug/" component={ServiceShowcasePage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/" component={ServicesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/about/" component={AboutPage} />
      <Route path="/gallery" component={GalleryRedesignPage} />
      <Route path="/gallery/" component={GalleryRedesignPage} />

      {/* Legacy preview URL kept active for existing shared links */}
      <Route path="/gallery/preview" component={GalleryRedesignPage} />
      <Route path="/gallery/preview/" component={GalleryRedesignPage} />

      <Route path="/clients" component={ClientsPage} />
      <Route path="/clients/" component={ClientsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/contact/" component={ContactPage} />

      {/* Visible to public users: /help, /help/product-info/:productId */}
      <Route path="/help" component={HelpPage} />
      <Route path="/help/" component={HelpPage} />
      <Route path="/help/product-info/:productId" component={ProductInfoPage} />
      <Route path="/help/product-info/:productId/" component={ProductInfoPage} />
      <Route path="/product/help/t-mg3-5-liters" component={LegacyTmg3ProductHelpRedirect} />
      <Route path="/product/help/t-mg3-5-liters/" component={LegacyTmg3ProductHelpRedirect} />

      {/* Visible to public users: /stone-care/shops, /stone-care/shops/:slug */}
      <Route path="/stone-care/shops/:slug" component={StoneCareProductPage} />
      <Route path="/stone-care/shops/:slug/" component={StoneCareProductPage} />
      <Route path="/stone-care/shops" component={StoneCareShopPage} />
      <Route path="/stone-care/shops/" component={StoneCareShopPage} />

      {/* Visible to public users: /employees/list */}
      <Route path="/employees/list" component={EmployeesList} />

      {/* Visible to admin users: /company/admin/login, /company/admin/dashboard, /company/admin/services, /company/admin/products, /company/admin/employees, /company/admin/content */}
      <Route path="/company/admin/login" component={AdminLogin} />
      <Route path="/company/admin/login/" component={AdminLogin} />
      <Route path="/company/admin/services" component={AdminServices} />
      <Route path="/company/admin/services/" component={AdminServices} />
      <Route path="/company/admin/gallery" component={AdminGallery} />
      <Route path="/company/admin/gallery/" component={AdminGallery} />
      <Route path="/company/admin/reels" component={AdminReels} />
      <Route path="/company/admin/reels/" component={AdminReels} />
      <Route path="/company/admin/reviews" component={AdminReviews} />
      <Route path="/company/admin/reviews/" component={AdminReviews} />
      <Route path="/company/admin/products" component={AdminProducts} />
      <Route path="/company/admin/products/" component={AdminProducts} />
      <Route path="/company/admin/employees" component={AdminEmployees} />
      <Route path="/company/admin/employees/" component={AdminEmployees} />
      <Route path="/company/admin/content" component={AdminContent} />
      <Route path="/company/admin/content/" component={AdminContent} />
      <Route path="/company/admin/dashboard" component={AdminDashboard} />
      <Route path="/company/admin/dashboard/" component={AdminDashboard} />
      <Route path="/company/admin" component={AdminUrlError} />
      <Route path="/company/admin/" component={AdminUrlError} />

      {/* Visible to public users: /error/400, /error/401, /error/403, /error/404, /error/500, /error/503 */}
      <Route path="/error/400" component={BadRequest} />
      <Route path="/error/401" component={Unauthorized} />
      <Route path="/error/403" component={Forbidden} />
      <Route path="/error/404" component={NotFound} />
      <Route path="/error/500" component={ServerError} />
      <Route path="/error/503" component={Maintenance} />

      {/* Visible to public users: /privacy-policy, /terms-of-service, /cookie-policy */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/cookie-policy" component={CookiePolicy} />

      {/* Visible to public users: /company/company-profile, /company/company-client, /company/organization-chart, /company-profile, /organization-chart */}
      <Route path="/company/company-profile" component={CompanyProfile} />
      <Route path="/company/company-profile/" component={CompanyProfile} />
      <Route path="/company/company-client" component={CompanyProfilePreview} />
      <Route path="/company/company-client/" component={CompanyProfilePreview} />
      <Route path="/company/organization-chart" component={OrganizationChart} />
      <Route path="/company/organization-chart/" component={OrganizationChart} />
      <Route path="/company-profile" component={CompanyProfile} />
      <Route path="/company-profile/" component={CompanyProfile} />
      <Route path="/organization-chart" component={OrganizationChart} />
      <Route path="/organization-chart/" component={OrganizationChart} />

      {/* Client-facing 2026 landscape company profile */}
      <Route path="/company-profile/preview" component={CompanyProfilePreview} />
      <Route path="/company-profile/preview/" component={CompanyProfilePreview} />

      {/* Fallback route: visible when no matching link exists */}
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

function VisitorHeartbeat() {
  const [location] = useLocation();

  useEffect(() => {
    trackSiteVisitor();

    const intervalId = window.setInterval(trackSiteVisitor, heartbeatIntervalMs);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        trackSiteVisitor();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
      <HeroUIProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <VisitorHeartbeat />
            <Router />
          </WouterRouter>
          <ToastProvider
            maxVisibleToasts={4}
            placement="top-right"
            toastOffset={16}
            toastProps={{
              variant: "flat",
              radius: "md",
              timeout: 4600,
              shouldShowTimeoutProgress: true,
            }}
          />
        </TooltipProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

export default App;
