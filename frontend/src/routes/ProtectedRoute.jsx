import { Navigate, useLocation } from "react-router-dom";

import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <Loader label="Memeriksa sesi login" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
