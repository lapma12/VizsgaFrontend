import { motion } from "framer-motion";
import "../Styles/Game.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import tutorialvideo  from "../assets/CastLTutorial.mp4"

function GamePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/game") {
      document.title = "Game";
    }
  }, [location.pathname]);

  return (
    <div className="game-page">
      <motion.div
        className="game-container"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="game-title">Welcome to the World of the Game!</h1>

        <p className="game-description">
          Are you ready to enter an exciting universe full of challenges?
          In this game, you write your own story. Fight, explore, and
          experience the adventure in a completely new way!
        </p>

        {/* ===== Tutorial Section ===== */}
        <div className="tutorial-section">
          <h2 className="tutorial-title">🎥 Watch the Tutorial</h2>
          <p className="tutorial-description">
            Learn the basics before you jump into the action!
          </p>
          <div className="video-wrapper">
            <video controls>
              <source src={tutorialvideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* ===== Download Section ===== */}
        <div className="download-section">
          <p className="game-description">
            Ready to start your adventure?
          </p>

          <a
            href="/assets/your-game.zip"
            className="download-button"
            download
          >
            🎮 Download the Game
          </a>
        </div>

      </motion.div>
    </div>
  );
}

export default GamePage;
