import { useState } from "react";
import { motion } from "framer-motion";
import "../Styles/RegisterPage.css";
import { useLocation, useNavigate } from "react-router-dom"; // for navigation
import Register from "./RegisterPage";
import axios from "axios";

function LoginPage({ setId }) {
  const location = useLocation();
  if (location.pathname === "/login") {
    document.title = "Login";
  }
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, seterrorMessage] = useState("");

  const handleConfirm = () => {
    setSuccessMessage("");
  };

  const [counterFailed, setcounterFailed] = useState(0);
  const navigate = useNavigate(); // for navigation

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: userInput,
      email: userInput,
      password: password,
    };

    let userResult = await axios.post(
      "https://dongesz.com/api/Users/playerLogin",
      data
    );
    console.log(userResult);
    try {
      if (userResult.data.success) {
<<<<<<< HEAD
        localStorage.setItem("USERID",userResult.data.result)
        localStorage.getItem("USERID")
        //setId(userResult.data.result);

        setLoading(true);
=======
        const userId = userResult.data.result;
        setId(userId); 
        localStorage.setItem("USERID",userId)
        setSuccessMessage(userResult.data.message);
        seterrorMessage("");
>>>>>>> 29826853decbb73a0a4c69ffbb0835d00f9b3df1
        setTimeout(() => {
          setSuccessMessage("")
          navigate(`/account/${userId}`); 
        }, 2000);
      } else {
        setcounterFailed(counterFailed + 1);
        if (counterFailed === 5) {
          seterrorMessage(userResult.date.message);
          setSuccessMessage("");
        } else {
          seterrorMessage("Wrong username or password");
          setSuccessMessage("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const goToRegisterPage = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/register"); // Navigate to the registration page
  };

  const goToForgotPasswordPage = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/forgot-password"); // Navigate to the forgot password page
  };

  return (
    <div className="login-page">
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
          <h2>WELCOME BACK!</h2>
          <p>
            Step back into the adventure! Your journey is far from over, and
            we're thrilled to have you with us. Every decision still matters,
            and new quests, competitions, and challenges await!
          </p>
          <p>
            Simply log in to continue your adventure, reconnect with your
            friends, and explore the endless possibilities this world has to
            offer.
          </p>
          <p>
            🔑 <strong>Log in now</strong> and continue where you left off. Your
            next great adventure is just a click away!
          </p>
        </div>

        <div class="register-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Enter username or email"
                onChange={(e) => setUserInput(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
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
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
