import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
      <Route path="/employees/list" component={EmployeesList} />
      <Route path="/error/400" component={BadRequest} />
      <Route path="/error/401" component={Unauthorized} />
      <Route path="/error/403" component={Forbidden} />
      <Route path="/error/404" component={NotFound} />
      <Route path="/error/500" component={ServerError} />
      <Route path="/error/503" component={Maintenance} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
