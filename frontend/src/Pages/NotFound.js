import { Link, useLocation } from "react-router-dom";
import "../Styles/NotFound.css";

const NotFound = () => {
  const location = useLocation()
  if (location.pathname === "*") {
    document.title = "Not found"
  }
  return (
    <div className="not-found-container">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <button className="home-button">
            Go Back Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
