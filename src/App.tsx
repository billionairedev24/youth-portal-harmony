import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ThemeProvider } from "@/contexts/theme-context";
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
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requiredRole="admin">
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/polls"
            element={
              <ProtectedRoute requiredRole="admin">
                <PollsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute requiredRole="admin">
                <MembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/suggestions"
            element={
              <ProtectedRoute requiredRole="admin">
                <SuggestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute requiredRole="admin">
                <AnnouncementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/budget"
            element={
              <ProtectedRoute requiredRole="admin">
                <BudgetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/photos"
            element={
              <ProtectedRoute requiredRole="admin">
                <PhotosPage />
              </ProtectedRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
