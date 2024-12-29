import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/admin/Index";
import UserDashboard from "./pages/dashboard/Index";
import EventsPage from "./pages/admin/events";
import PollsPage from "./pages/admin/polls";
import MembersPage from "./pages/admin/members";
import SuggestionsPage from "./pages/admin/suggestions";
import AnnouncementsPage from "./pages/admin/announcements";
import BudgetPage from "./pages/admin/budget";
import PhotosPage from "./pages/admin/photos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/events" element={<EventsPage />} />
          <Route path="/admin/polls" element={<PollsPage />} />
          <Route path="/admin/members" element={<MembersPage />} />
          <Route path="/admin/suggestions" element={<SuggestionsPage />} />
          <Route path="/admin/announcements" element={<AnnouncementsPage />} />
          <Route path="/admin/budget" element={<BudgetPage />} />
          <Route path="/admin/photos" element={<PhotosPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;