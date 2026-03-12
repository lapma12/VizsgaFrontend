import { motion } from "framer-motion";
import "../Styles/Game.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import gameArchive from "../assets/Castlv1.rar";

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
        <h1 className="game-title">CastL Game</h1>

        <div className="tutorial-section">
          <h2 className="tutorial-title">🎥 How to play</h2>
          <p className="tutorial-description">
            Watch the short tutorial, then download and start the game.
          </p>
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/mPzMe115FKU"
              title="CastL Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div className="download-section">
          <p className="game-description">
            Download the game, extract the archive, then run the <strong>.exe</strong> file.
          </p>

          <a href={gameArchive} className="download-button" download="CastL_Game.rar">
            🎮 Download the Game
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default GamePage;
