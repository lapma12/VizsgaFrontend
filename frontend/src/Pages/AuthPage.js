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

    // Példa: password confirm ellenőrzés
    const doPasswordsMatch = password === confirmPassword;

    if (!doPasswordsMatch) {
      setErrorMessage("Passwords do not match!");
      setSuccessMessage("");
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
      subject: "Successful registration",
      body:  `
      <html>
        <head>
          <style>
            :root {
              --bgColor: #e8d8b4;
              --accentDark: #4b3621;
              --accentLight: #8c7153;
              --highlight: #e1c373;
              --textDark: #2d1b0f;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: #e8d8b4;
              color: #2d1b0f;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background-color: #8c7153;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              color: #4b3621;
              margin-bottom: 20px;
            }
            .highlight {
              display: inline-block;
              padding: 5px 10px;
              background-color: #e1c373;
              color: #4b3621;
              border-radius: 4px;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #4b3621;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Welcome to CastL!</div>
            <div class="highlight">Successful registration</div>
            <p>Thank you for joining our platform. You can now explore all the features CastL offers!</p>
            <div class="footer">© 2026 CastL. All rights reserved.</div>
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

      const emailSender = await axios.post(
        "https://dongesz.com/api/main/Email",
        emailData
      );

      if (res.data.success && emailSender.data.success) {
        setSuccessMessage("Successfully registered, check your email");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMessage(res.data.message || "Registration failed!");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Failed Registration!");
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
      <Toast type="success" message={successMessage} onClose={() => setSuccessMessage("")} html />
      <Toast type="error" message={errorMessage} onClose={() => setErrorMessage("")} html />

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
              <h2>WELCOME</h2>

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
                <button type="submit">Login</button>
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


                <button type="submit" disabled={!doPasswordsMatch}>
                  Register
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
