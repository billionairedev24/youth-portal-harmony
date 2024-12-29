import { Navigate } from "react-router-dom";
import { mockUser } from "@/lib/utils";

const Index = () => {
  // Mock authentication check
  const isAuthenticated = true;
  const user = mockUser;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect based on user role
  if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return <Navigate to="/dashboard" />;
};

export default Index;