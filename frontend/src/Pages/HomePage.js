import { Link, useLocation } from "react-router-dom";
import "../Styles/Main.css";
import { useEffect,useState } from "react";
import Logo from "../Img/mainlogo.png" 

const Homepage = () => {
  const location = useLocation()
  if (location.pathname === "/") {
    document.title = "Home"
  }

  const [count, setCount] = useState("");

  useEffect(() => {
    fetch("https://localhost:7282/api/Users/playerCount")
    .then((res) => res.json())
    .then((playerCount) => {setCount(playerCount)})
    .catch((err) => {
        console.error(err);})
  }, [])
  
  
  return (
    <div className="homepage-container">
      <div className="homepage-card">
        <img src={Logo} alt="CastL Logo" className="homepage-logo" />
        <h1 className="homepage-title">Welcome to <span>CastL</span>!</h1>
        <p className="homepage-description">
          Explore our world, join the adventure, and become part of the CastL community.
        </p>

        <hr className="homepage-divider" />

        <div className="homepage-buttons">
          <a
            href="/assets/your-game.zip"
            className="homepage-btn download-btn"
            download
          >
            🎮 Download the Game
          </a>

          <Link to="/register">
            <button className="homepage-btn start-btn">
              🏰 Get Started
            </button>
          </Link>
        </div>

        <p className="player-count">
          Online players: <span id="playerCount">{count.playerCount}</span>
        </p>
      </div>
    </div>
  );
};

export default Homepage;
