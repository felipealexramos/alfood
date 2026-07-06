import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../auth/session";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Renders its children only for an authenticated admin; otherwise redirects
 * to the login page. Wraps the /admin routes (login itself stays outside).
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
