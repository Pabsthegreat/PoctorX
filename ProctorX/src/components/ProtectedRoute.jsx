import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Redirect to login if no user or incorrect role
    if (!user || user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;

