import { Link, useLocation } from "react-router-dom";
import "../Styles/Main.css";
import { useEffect, useState } from "react";
import Logo from "../Img/CastLLogo.png";
import axios from "axios";

const Homepage = () => {
  const location = useLocation();

  const [count, setCount] = useState(null);

  useEffect(() => {
    if (location.pathname === "/") {
      document.title = "Home";
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const response = await axios.get(
          "https://dongesz.com/api/main/Users/playerCount"
        );
        setCount(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlayerCount();
  }, []);

  return (
    <div className="homepage-container">
      <main className="homepage-card" role="main">
        <header className="homepage-hero">
          <img src={Logo} alt="CastL Logo" className="homepage-logo" />
          <p className="homepage-description">
            Explore our world, join the adventure, and become part of the CastL
            community.
          </p>
        </header>

        <hr className="homepage-divider" />

        <nav className="homepage-buttons" aria-label="Primary actions">
          <a
            href="/assets/your-game.zip"
            className="homepage-btn download-btn"
            download
          >
            🎮 Download the Game
          </a>

          <Link to="/login">
            <button className="homepage-btn start-btn" type="button">
              🏰 Get Started
            </button>
          </Link>
        </nav>

        <footer>
          <p className="player-count">
            Online players:{" "}
            <span id="playerCount">
              {count && count.success ? count.result.playerCount : ""}
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Homepage;
