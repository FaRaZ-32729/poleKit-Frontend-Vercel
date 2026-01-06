import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contextApi/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, loading, isTokenExpired, logout } = useAuth();

    if (loading) return null; // or loader

    if (!user || !token || isTokenExpired(token)) {
        logout();
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
