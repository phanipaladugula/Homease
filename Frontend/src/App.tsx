
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import PersonalityTest from "./pages/PersonalityTest";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import FlatDetail from "./pages/FlatDetail";
import Settings from "./pages/Settings";
import PhoneVerification from "./pages/PhoneVerification";
import PostFlat from "./pages/PostFlat";
import PostFlatmate from "./pages/PostFlatmate";
import CompatibilityCheck from "./pages/CompatibilityCheck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/personality-test" element={<PersonalityTest />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/flatmate/:id" element={<ProfileDetail />} />
          <Route path="/flat/:id" element={<FlatDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/phone-verification" element={<PhoneVerification />} />
          <Route path="/post-flat" element={<PostFlat />} />
          <Route path="/post-flatmate" element={<PostFlatmate />} />
          <Route path="/compatibility/:id" element={<CompatibilityCheck />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
