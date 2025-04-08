import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles }) => {
    const userRole = localStorage.getItem("userRole");

    return allowedRoles.includes(userRole) ? element : <Navigate to="/team_dashboard" />;
};

export default PrivateRoute;
