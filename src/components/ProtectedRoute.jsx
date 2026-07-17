import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RouteLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 py-16 text-[#314131]">
      <div className="rounded-[28px] border border-[#e7ddcf] bg-white px-6 py-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)]">
        Checking your session...
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? "/admin/login" : "/login"} replace state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}