
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import SkillQuestions from "./pages/SkillQuestions";
import PracticeAnswers from "./pages/PracticeAnswers";
import CompanyQuestions from "./pages/CompanyQuestions";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/resume-upload" element={<AuthGuard><ResumeUpload /></AuthGuard>} />
          <Route path="/resume-analyzer" element={<AuthGuard><ResumeAnalyzer /></AuthGuard>} />
          <Route path="/skill-questions" element={<AuthGuard><SkillQuestions /></AuthGuard>} />
          <Route path="/practice-answers" element={<AuthGuard><PracticeAnswers /></AuthGuard>} />
          <Route path="/company-questions" element={<AuthGuard><CompanyQuestions /></AuthGuard>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
