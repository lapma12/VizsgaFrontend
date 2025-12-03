import { useState } from "react";
import { motion } from "framer-motion";
import "../Styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import axios from "axios";

function Register() {
  const [username, setUserN] = useState("");
  const [email, setEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // VALIDATION LOGIC
  const isUsernameValid = username.length >= 5 && username.length <= 16;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const isPasswordValid =
    isPasswordLengthValid &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar;

  const doPasswordsMatch = password === confirmPassword;
  const isFormValid =
    isUsernameValid && isEmailValid && isPasswordValid && doPasswordsMatch;

  // UPDATE FUNCTIONS
  const setUsername = (value) => setUserN(value);
  function setEmail(value) {
    setEmailState(value);
  }
  function setPassword(value) {
    setPasswordState(value);
  }

  // FORM SUBMISSION
  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      name: username,
      email: email,
      passwordHash: password, // kötelező, különben NULL → 500 hiba
      userType: "Player", // kötelező → nem lehet null
    };

    try {
      await axios.post("https://localhost:7282/api/Users", data);
      setSuccessMessage(
        "Welcome to the CastL website<br/>Successful registration!<br/><br/>Check your email address!"
      );

      setTimeout(() => { setSuccessMessage(""); navigate("/login") }, 5000);
    } catch (error) {
      console.log(error.response?.data);
      alert("Registration failed.");
    }
  };

  return (
    <div className="register-page">
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="success-alert"
          dangerouslySetInnerHTML={{ __html: successMessage }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="register-container"
      >
        <div className="register-info">
          <h2>WELCOME!!!</h2>
          <p>
            Step through the door to a new world, where every decision matters!
            Our <strong>community</strong> is not just a game — it's an
            experience shaped by you.
          </p>

          <div>
            <strong>
              <h3>
                <u>Registration requirements:</u>
              </h3>
            </strong>
          </div>
          <ul>
            <li className={isUsernameValid ? "valid" : ""}>
              <strong>Username:</strong> 5–16 characters
            </li>
            <li className={isEmailValid ? "valid" : ""}>
              <strong>Email:</strong> Valid format (e.g. user@example.com)
            </li>
            <li className={isPasswordValid ? "valid" : ""}>
              <strong>Password:</strong> 8+ characters, incl.:
              <ul>
                <li className={hasUppercase ? "valid" : ""}>
                  1 uppercase letter
                </li>
                <li className={hasLowercase ? "valid" : ""}>
                  1 lowercase letter
                </li>
                <li className={hasNumber ? "valid" : ""}>1 number</li>
                <li className={hasSpecialChar ? "valid" : ""}>
                  1 special character (!@#$%^&*)
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Registration form */}
        <div className="register-form">
          <h2>Create new account</h2>
          <form onSubmit={handleSave}>
            <div>
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={!isFormValid}>
              Register
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <a
              target="#"
              href={LoginPage}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="link-style"
            >
              Log in!
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
