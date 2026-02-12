import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    console.log("JWT DATA:", decoded); // debug

    const role =
      decoded.role ||
      decoded.userType ||
      decoded.roles ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!role.includes("Admin")) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>🚫 Nincs jogosultságod</h2>
          <p>Ez az oldal csak adminok számára érhető el.</p>

          <button
            style={styles.button}
            onClick={() => (window.location.href = "/")}
          >
            Vissza a főoldalra
          </button>
        </div>
      );
    }

    return children;
  } catch (err) {
    console.error("JWT ERROR:", err);
    return <Navigate to="/admin" replace />;
  }
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "80px"
  },
  title: {
    color: "#c0392b"
  },
  button: {
    marginTop: "15px",
    padding: "10px 100px",
    cursor: "pointer"
  }
};

export default AdminRoute;
