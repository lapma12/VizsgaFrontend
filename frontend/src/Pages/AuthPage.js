import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "../Styles/AuthRegisterLogin.css";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "./RegisterPage";
import PasswordInput from "../Component/PasswordInput"


export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");

  const location = useLocation();
  if (location.pathname === "/login") {
    document.title = "auth";
  }
  // LOGIN STATE
  const [userInput, setUserInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER STATE
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recap, setRecap] = useState(null);

  // ALERTS
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isUsernameValid = username.length >= 5 && username.length <= 16;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const isPasswordValid =
    password.length >= 8 &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar;

  const doPasswordsMatch = password === confirmPassword;
  const isRegisterValid =
    isUsernameValid &&
    isEmailValid &&
    isPasswordValid &&
    doPasswordsMatch &&
    recap;

  async function handleLogin(e) {
    e.preventDefault();

    const data = {
      name: userInput,
      email: userInput,
      password: loginPassword,
    };

    try {
      const res = await axios.post(
        "https://dongesz.com/api/Users/playerLogin",
        data
      );

      if (res.data.success) {
        const userId = res.data.result;
        localStorage.setItem("USERID", userId);
        setSuccessMessage(res.data.message);
        setErrorMessage("");

        setTimeout(() => {
          navigate(`/account/${userId}`);
        }, 2000);
      } else {
        setErrorMessage("Wrong username or password");
      }
    } catch {
      setErrorMessage("Server error");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    const data = {
      name: username,
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(
        "https://dongesz.com/api/Users/playerRegister",
        data
      );

      if (res.data.success && isRegisterValid) {
        setSuccessMessage("Successful registration! Check your email.");
        setErrorMessage("");

        setTimeout(() => {
          setMode("login");
        }, 2500);
      } else {
        setErrorMessage("Registration failed. Check inputs.");
      }
    } catch {
      setErrorMessage("Server error");
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
      {/* ALERTS */}
      {successMessage && (
        <motion.div
          className="success-alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div dangerouslySetInnerHTML={{ __html: successMessage }} />
          <button className="confirm-btn" onClick={() => setSuccessMessage("")}>
            OK
          </button>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          className="error-alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div dangerouslySetInnerHTML={{ __html: errorMessage }} />
          <button
            className="error-confirm-btn"
            onClick={() => setErrorMessage("")}
          >
            OK
          </button>
        </motion.div>
      )}

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-left">
          {mode === "login" && (
            <div className="register-info">
              <h2>WELCOME BACK!</h2>

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
              <h2>WELCOME!!!</h2>

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
                      href={Register}
                      target="#"
                      onClick={goToRegisterPage}
                      className="link-style"
                    >
                      Don't have an account?
                    </a>
                  </p>
                  <p className="login-link">
                    <a
                      href={Register}
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
                <div className="recapStyle">
                  <ReCAPTCHA
                    sitekey="6LfwHUosAAAAAFShgVz8Fxo-xctMsRUzRZbva2tg"
                    onChange={setRecap}
                  />
                </div>

                <button type="submit" disabled={!isRegisterValid}>
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
