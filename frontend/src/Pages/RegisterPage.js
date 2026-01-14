import { useState } from "react";
import { motion } from "framer-motion";
import "../Styles/RegisterPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import axios from "axios";
import ReCAPTHA from "react-google-recaptcha";
//6LfwHUosAAAAAFShgVz8Fxo-xctMsRUzRZbva2tg
function Register() {
  const location = useLocation()
  if (location.pathname === "/register") {
    document.title = "Registration"
  }

  //form adatok
  const [username, setUserN] = useState("");
  const [email, setEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //alertek
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  //recap
  const [recap, setRecap] = useState(null)

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
  const handleConfirm = () => {
    setSuccessMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      name: username,
      email: email,
      password: password,
    };
    let registerResutData = await axios.post("https://dongesz.com/api/Users/playerRegister", data);
    try {
      if (isFormValid && registerResutData.data.success) {
        setSuccessMessage(
          "Welcome to the CastL website<br/>Successful registration!<br/><br/>You have login in.<br/><br/>Check your email address!"
        );
        seterrorMessage("")
        setTimeout(() => { setSuccessMessage(""); navigate("/login") }, 3000);
      }
      else {
        seterrorMessage("Something went wrong.<br/><br/>Please check the registration requirements and try again.")
        setSuccessMessage("")
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="register-page">
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="success-alert"
        >
            <>
              <div
                className="message"
                dangerouslySetInnerHTML={{ __html: successMessage }}
              />
              <button className="confirm-btn" onClick={handleConfirm}>
                OK
              </button>
            </>
        </motion.div>
      )}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="error-alert"
        >
          <div
            className="message"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
          <button
            className="error-confirm-btn"
            onClick={() => seterrorMessage("")}
          >
            OK
          </button>
        </motion.div>
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
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div class="recapStyle">
              <ReCAPTHA sitekey="6LfwHUosAAAAAFShgVz8Fxo-xctMsRUzRZbva2tg" onChange={val => setRecap(val)}/>
            </div>
            <button type="submit" disabled={!(isFormValid && recap)} >
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
