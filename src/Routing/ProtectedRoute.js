import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role: expectedRole }) => {
  const adminToken = sessionStorage.getItem("adminToken");
  const leaderToken = sessionStorage.getItem("leaderToken");
  const role = sessionStorage.getItem("role");

  if (expectedRole === "ADMIN" && !adminToken) return <Navigate to="/login" />;
  if (expectedRole === "TEAM_LEADER" && !leaderToken) return <Navigate to="/login" />;
  if (role !== expectedRole) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
