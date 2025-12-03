import { useState } from "react";
//import axios from "axios";
import { motion } from "framer-motion";
import "../Styles/RegisterPage.css";
import { useLocation, useNavigate } from "react-router-dom"; // for navigation
import Register from "./RegisterPage";

function LoginPage() {
  const location = useLocation()
  if (location.pathname === "/login") {
    document.title = "Login"
  }
  const [userInput, setUserInput] = useState("");
  const [getUser, setGetUser] = useState([])
  //const [password, setPassword] = useState("");
  const navigate = useNavigate(); // for navigation
  function handleSubmit(e) {
    e.preventDefault();
  }
  const goToAccount = (event) => {
    event.preventDefault();
    fetch("https://localhost:7282/api/Users")
      .then(res => res.json())
      .then(users => {
        setGetUser(users); // most már egy tömb
        const matchedUser = getUser.find(u => u.name === userInput);
        const matchedEmail = getUser.find(u => u.email === userInput);
        if (matchedUser || matchedEmail) {
          alert("Sikeres bejelentkezés");
          setTimeout(() => {
            navigate("/account")
          }, 2000);
          
        } else {
          alert("Nincs találat");
        }
      })
      .catch(err => console.error(err));
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
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="register-container"
      >
        <div className="register-info">
          <h2>WELCOME BACK!</h2>
          <p>
            Step back into the adventure! Your journey is far from over, and we're thrilled to have you with us. Every decision still matters, and new quests, competitions, and challenges await!
          </p>
          <p>
            Simply log in to continue your adventure, reconnect with your friends, and explore the endless possibilities this world has to offer.
          </p>
          <p>
            🔑 <strong>Log in now</strong> and continue where you left off. Your next great adventure is just a click away!
          </p>
        </div>

        <div class="register-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username or Email</label>
              <input
                type="text"
                placeholder="Enter username or email"
                onChange={(e) => setUserInput(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                //onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" onClick={goToAccount}>Login</button>
          </form>
          <div className="links">
            <p className="dontHaveAccount">
              <a
                href={Register}
                target="#" onClick={goToRegisterPage} className="link-style">
                Don't have an account?
              </a>
            </p>
            <p className="login-link">
              <a
                href={Register}
                target="#" onClick={goToForgotPasswordPage} className="link-style">
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
