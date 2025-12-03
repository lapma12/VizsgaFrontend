import React, { useState } from "react";
import "../Styles/ForgotPasswordPage.css";
import { useLocation } from "react-router-dom";

const ForgotPasswordPage = () => {
  const location = useLocation()
  if (location.pathname === "/forgot-password") {
    document.title = "Forgot-password"
  }

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Itt hívhatod meg az API-t, pl. axios.post('/api/forgot-password', { email })
    console.log("Elküldött email:", email);

    setSubmitted(true);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        {!submitted ? (
          <>
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
          </>
        ) : (
          <div className="success-message">
            <h2>Check your inbox!</h2>
            <p>
              If the email you entered is registered, you’ll receive password reset
              instructions shortly.
            </p>
            <button onClick={() => setSubmitted(false)}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
