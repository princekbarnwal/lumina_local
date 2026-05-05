import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "../services/api.js";

function ProtectedRoute() {
  if (!authStorage.getToken()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
