import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LogoMark } from "@/components/brand/Logo";
import Landing from "./pages/Landing";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Repositories = lazy(() => import("./pages/Repositories"));
const CodeReview = lazy(() => import("./pages/CodeReview"));
const PullRequests = lazy(() => import("./pages/PullRequests"));
const SecurityScanner = lazy(() => import("./pages/SecurityScanner"));
const Performance = lazy(() => import("./pages/Performance"));
const Architecture = lazy(() => import("./pages/Architecture"));
const History = lazy(() => import("./pages/History"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const Admin = lazy(() => import("./pages/Admin"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const SecurityPage = lazy(() => import("./pages/Security"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const SharedReport = lazy(() => import("./pages/SharedReport"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GitHubCallbackHandler = lazy(() => import("./pages/GitHubCallbackHandler"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const AutonomousAgent = lazy(() => import("./pages/AutonomousAgent"));
const Billing = lazy(() => import("./pages/Billing"));
const Organization = lazy(() => import("./pages/Organization"));
const CustomRules = lazy(() => import("./pages/CustomRules"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LogoMark size="lg" />
        <div className="h-1 w-24 overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Loading workspace</span>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public marketing + legal routes */}
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/enterprise" element={<Enterprise />} />
                <Route path="/docs" element={<ApiDocs />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/security-policy" element={<SecurityPage />} />
              </Route>

              {/* Standalone auth + shared routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/report/:analysisId" element={<SharedReport />} />
              <Route path="/auth/github/callback" element={<GitHubCallbackHandler />} />

              {/* Protected app routes */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/code-review" element={<CodeReview />} />
                <Route path="/pull-requests" element={<PullRequests />} />
                <Route path="/security" element={<SecurityScanner />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/autonomous-agent" element={<AutonomousAgent />} />
                <Route path="/custom-rules" element={<CustomRules />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
