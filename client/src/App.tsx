import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { HiseeuLanguageProvider } from "./contexts/HiseeuLanguageContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import HiseeuHome from "./pages/HiseeuHome";
import HiseeuHomeV2 from "./pages/HiseeuHomeV2";
import HiseeuAdmin from "./pages/HiseeuAdmin";
import HiseeuAdminV2 from "./pages/HiseeuAdminV2";
import FAQHome from "./pages/FAQHome";
import FAQManagement from "./pages/FAQManagement";
import FAQHomeLorex from "./pages/FAQHomeLorex";
import ProductSeriesPage from "./pages/ProductSeriesPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/hiseeu"} component={HiseeuHomeV2} />
      <Route path={"/hiseeu-v1"} component={HiseeuHome} />
      <Route path={"/hiseeu/admin"} component={HiseeuAdminV2} />
      <Route path={"/hiseeu/admin-v1"} component={HiseeuAdmin} />
      <Route path={"/faq"} component={FAQHomeLorex} />
      <Route path={"/faq-old"} component={FAQHome} />
      <Route path={"/products/:seriesId"} component={ProductSeriesPage} />
      <Route path={"/admin/faq/:id"} component={FAQManagement} />
      <Route path={"/admin/faq"} component={FAQManagement} />
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/analytics"} component={AnalyticsDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <LanguageProvider>
          <HiseeuLanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </HiseeuLanguageProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
