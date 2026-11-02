import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
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

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/docs" element={<ApiDocs />} />
              <Route path="/report/:analysisId" element={<SharedReport />} />
              <Route path="/auth/github/callback" element={<GitHubCallbackHandler />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/security-policy" element={<SecurityPage />} />
              {/* Protected routes */}
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
