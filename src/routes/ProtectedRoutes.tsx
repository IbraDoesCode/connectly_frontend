import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { authenticatedUser } = useAuth();

  return authenticatedUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
