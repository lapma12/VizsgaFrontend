import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import "../Styles/AdminRoute.css";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    const role =
      decoded.role ||
      decoded.userType ||
      decoded.roles ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!role || !role.includes("Admin")) {
      return (
        <div className="admin-denied-page">
          <motion.div
            className="admin-denied-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="admin-title">🚫 Access Denied</h2>
            <p className="admin-text">
              This area is reserved for administrators only.
            </p>

            <button
              className="admin-button"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </button>
          </motion.div>
        </div>
      );
    }

    return children;
  } catch (err) {
    console.error("JWT ERROR:", err);
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
