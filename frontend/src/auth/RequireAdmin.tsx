import { Navigate, Outlet } from "react-router-dom";

function parseJwt(token: string): any | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const decoded = atob(base64Payload);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

function isAdmin(): boolean {
  const token = localStorage.getItem("auth_token");
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload) return false;

  // para distintos formatos de roles
  const roles = payload.roles || payload.authorities || [];

  return Array.isArray(roles) && roles.includes("ROLE_ADMIN");
}

export function RequireAdmin() {
  if (!isAdmin()) {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}