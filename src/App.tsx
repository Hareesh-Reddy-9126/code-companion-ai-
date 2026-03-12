import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import CodeReview from "./pages/CodeReview";
import PullRequests from "./pages/PullRequests";
import SecurityScanner from "./pages/SecurityScanner";
import Performance from "./pages/Performance";
import Architecture from "./pages/Architecture";
import History from "./pages/History";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SharedReport from "./pages/SharedReport";
import NotFound from "./pages/NotFound";
import GitHubCallbackHandler from "./pages/GitHubCallbackHandler";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/report/:analysisId" element={<SharedReport />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackHandler />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/repositories" element={<Repositories />} />
              <Route path="/code-review" element={<CodeReview />} />
              <Route path="/pull-requests" element={<PullRequests />} />
              <Route path="/security" element={<SecurityScanner />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
