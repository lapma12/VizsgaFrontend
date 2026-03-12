import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../Styles/AuthRegisterLogin.css";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "../Component/PasswordInput";
import Toast from "../Component/Toast";
import { jwtDecode } from "jwt-decode";


export default function AuthPage({ setshowAdminPanel }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const location = useLocation();
  if (location.pathname === "/login") {
    document.title = "Sign Up";
  }

  // LOGIN STATE
  const [userInput, setUserInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER STATE
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ALERTS
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const doPasswordsMatch = password === confirmPassword;

  //LOGIN
  async function handleLogin(e) {
    e.preventDefault();

    const data = {
      userName: userInput,
      password: loginPassword,
    };

    try {
      const res = await axios.post(
        "https://dongesz.com/api/auth/Auth/login",
        data
      );
      const success = res.data.success;

      if (success) {
        localStorage.setItem("authToken", res.data.token);
        setSuccessMessage("Successfully login!");
        const token = localStorage.getItem("authToken");
        const decoded = jwtDecode(token);
        const decodeRole = decoded.role || decoded.roles || decoded.userType;
        const isAdmin = Array.isArray(decodeRole)
          ? decodeRole.includes("Admin")
          : typeof decodeRole === "string" && decodeRole.includes("Admin");
        setErrorMessage("");
        setshowAdminPanel(isAdmin);

        if (isAdmin) {
          setTimeout(() => navigate("/admin"), 2000);
        } else {
          setTimeout(() => navigate("/account"), 2000);
        }

      } else {
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      if (error.response?.status === 400) {
        setErrorMessage("Invalid username or password");
      } else {
        setErrorMessage("Login failed");
      }
    }
  }
  async function handleRegister(e) {
    e.preventDefault();

    if (isRegistering) return;
    setIsRegistering(true);

    if (!acceptTerms) {
      setErrorMessage("You must accept the Terms of Use before registering.");
      setSuccessMessage("");
      setIsRegistering(false);
      return;
    }

    // Példa: password confirm ellenőrzés
    const doPasswordsMatch = password === confirmPassword;

    if (!doPasswordsMatch) {
      setErrorMessage("Passwords do not match!");
      setSuccessMessage("");
      setIsRegistering(false);
      return;
    }

    const data = {
      userName: username,
      password: password,
      email: email,
      fullName: username,
    };

    const emailData = {
      to: email,
      subject: "Welcome to CastL – Registration successful",
      body: `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to CastL</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #e8d8b4;
            color: #2d1b0f;
          }

          .email-root {
            padding: 24px 12px;
          }

          .email-card {
            max-width: 560px;
            margin: 0 auto;
            background: #f8ecd0;
            border-radius: 16px;
            border: 1px solid rgba(75, 54, 33, 0.35);
            box-shadow: 0 16px 40px rgba(75, 54, 33, 0.35);
            overflow: hidden;
          }

          .email-header {
            padding: 20px 22px 10px;
            border-bottom: 1px solid rgba(75, 54, 33, 0.15);
          }

          .email-title {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.03em;
            color: #3a2414;
          }

          .email-subtitle {
            margin-top: 6px;
            font-size: 13px;
            color: #6f5640;
          }

          .email-body {
            padding: 18px 22px 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #3b2616;
          }

          .highlight-box {
            margin: 14px 0 12px;
            padding: 10px 12px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(140, 113, 83, 0.5);
            font-size: 13px;
            color: #5c4630;
          }

          .cta-wrapper {
            padding: 10px 22px 20px;
          }

          .cta-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px 22px;
            border-radius: 999px;
            border: 0;
            background: linear-gradient(135deg, #8c7153, #a7885f);
            color: #fff !important;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
          }

          .email-footer {
            padding: 10px 22px 16px;
            border-top: 1px solid rgba(75, 54, 33, 0.18);
            font-size: 11px;
            color: #7b6347;
            background: #e0cfa4;
          }
        </style>
      </head>
      <body>
        <div class="email-root">
          <div class="email-card">
            <div class="email-header">
              <div class="email-title">Welcome to CastL</div>
              <div class="email-subtitle">
                Your account is ready. You can log in and start playing.
              </div>
            </div>

            <div class="email-body">
              <p>Hi ${username || "Explorer"},</p>
              <p>
                Your <strong>CastL</strong> account has been created with the email
                <strong>${email}</strong>.
              </p>

              <div class="highlight-box">
                Use the button below to return to CastL and log in with your new account.
              </div>

              <p>
                If you did not create this account, you can ignore this message.
              </p>
            </div>

            <div class="cta-wrapper">
              <a
                href="dongesz.com/login"
                class="cta-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Back to CastL
              </a>
            </div>

            <div class="email-footer">
              Automatic message about your CastL registration. Please do not reply.
            </div>
          </div>
        </div>
      </body>
      </html>
      `
    };

    try {
      const res = await axios.post(
        "https://dongesz.com/api/auth/Auth/register",
        data
      );

      if (res.data.success) {
        
        const emailSender = await axios.post(
          "https://dongesz.com/api/main/Email",
          emailData
        );

        if (emailSender.data.success) {
          setErrorMessage("");

          setTimeout(() => {
            setSuccessMessage("Successfully registered, check your email");
            setMode("login");
            setIsRegistering(false);
          }, 2000);
        } else {
          setErrorMessage("Registration succeeded, but email sending failed.");
          setSuccessMessage("");
          setIsRegistering(false);
        }
      } else {
        setErrorMessage(res.data.message || "Registration failed!");
        setSuccessMessage("");
        setIsRegistering(false);
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed Registration!");
      setIsRegistering(false);
    }
  }

  const goToForgotPasswordPage = (event) => {
    event.preventDefault();
    navigate("/forgot-password");
  };
  const goToRegisterPage = (event) => {
    event.preventDefault();
    setMode("register");
  };

  return (
    <div className="register-page">
      <Toast
        type="success"
        message={successMessage}
        onClose={() => setSuccessMessage("")}
        html
      />
      <Toast
        type="error"
        message={errorMessage}
        onClose={() => setErrorMessage("")}
        html
      />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-left">
          {mode === "login" && (
            <div className="register-info">
              <h2>WELCOME BACK</h2>

              <p>
                Step back into the adventure! Your journey is far from over, and
                we're thrilled to have you with us. Every decision still
                matters, and new quests, competitions, and challenges await!
              </p>

              <p>
                Simply log in to continue your adventure, reconnect with your
                friends, and explore the endless possibilities this world has to
                offer.
              </p>

              <p>
                🔑 <strong>Log in now</strong> and continue where you left off.
                Your next great adventure is just a click away!
              </p>
            </div>
          )}

          {mode === "register" && (
            <div className="register-info">
              <div className="register-info-header">
                <h2>WELCOME</h2>
                <div className="password-info">
                  <span className="password-info-icon">i</span>
                  <div className="password-info-tooltip">
                    <p className="password-info-title">Password requirements</p>
                    <ul>
                      <li>At least 8 characters long</li>
                      <li>Contains at least one uppercase letter (A–Z)</li>
                      <li>Contains at least one number (0–9)</li>
                      <li>Contains at least one special character (!, ?, %, @, #, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                Step through the door to a new world, where every decision
                matters! Our <strong>community</strong> is not just a game —
                it's an experience shaped by you.
              </p>

              <div>
                <p>Start your adventure by filling out the form below!</p>
              </div>
            </div>
          )}

          <button
            className="left-switch"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create Account" : "Already a member? Login"}
          </button>
        </div>
        <div className="auth-right">
          <div className="auth-header">
            <div className={`auth-slider ${mode}`} />
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Sign Up
            </button>
          </div>

          {/* FORM BODY */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {mode === "login" && (
              <form onSubmit={handleLogin} className="register-form">
                <h2>Login</h2>
                <input
                  type="text"
                  placeholder="Username or Email"
                  onChange={(e) => setUserInput(e.target.value)}
                  required
                />
                <PasswordInput
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <div className="links">
                  <p className="dontHaveAccount">
                    <a
                      href="/register"
                      target="#"
                      onClick={goToRegisterPage}
                      className="link-style"
                    >
                      Don't have an account?
                    </a>
                  </p>
                  <p className="login-link">
                    <a
                      href="/forgot_password"
                      target="#"
                      onClick={goToForgotPasswordPage}
                      className="link-style"
                    >
                      Forgot Password
                    </a>
                  </p>
                </div>
                <button type="submit" className="btn-pill btn-pill--primary">Login</button>
              </form>
            )}

            {mode === "register" && (
              <form onSubmit={handleRegister} className="register-form">
                <h2>Sign Up</h2>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="terms-row">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <label htmlFor="acceptTerms">
                    I accept the{" "}
                    <a href="/terms" className="terms-link">
                      Terms of Use
                    </a>
                  </label>
                </div>
                <p className="terms-error">
                  You must accept the Terms of Use to create an account.
                </p>

                <button
                  type="submit"
                  disabled={!doPasswordsMatch || isRegistering || !acceptTerms}
                  className="btn-pill btn-pill--primary"
                >
                  {isRegistering ? (
                    <span className="btn-loading">
                      <span className="spinner" />
                      <span>Registering...</span>
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
