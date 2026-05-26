import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireAdmin() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}