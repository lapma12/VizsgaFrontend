import React, { useState } from "react";
import "../Styles/ForgotPasswordPage.css";
import { useLocation } from "react-router-dom";

const ForgotPasswordPage = () => {
  const location = useLocation();
  if (location.pathname === "/forgot-password") {
    document.title = "Forgot-password";
  }

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h1>Forgot Password</h1>
        <p>Enter your registered email and we’ll send you reset instructions.</p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
