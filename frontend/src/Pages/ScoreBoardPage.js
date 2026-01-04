import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // <-- SPINNER
import "../Styles/Scoreboard.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Scoreboard = () => {
  const location = useLocation();
  if (location.pathname === "/scoreboard") {
    document.title = "Scoreboard";
  }

  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);

  const [loading, setLoading] = useState(false); // <-- BETÖLTÉS
  const [error, setError] = useState(false); // <-- HIBA

  useEffect(() => {
    const fetchScoreboardPlayer = async () => {
      try{
        const response = await axios.get(
          "https://dongesz.com/api/Users/playerScore"
        );
        setScores(response.data.result);
        setFilteredScores(response.data.result)
        setLoading(response.data.success);
        setError(response.data.success);
      }
      catch(error){
        console.log(error)
      }
    };
    fetchScoreboardPlayer();
  }, []);

  const applyFilter = (filterType) => {

    if (filterType === "username") {
      setFilteredScores(
        [...scores].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else if (filterType === "wins") {
      setFilteredScores(
        [...scores].sort((a, b) => b.totalScore - a.totalScore)
      );
    } else if (filterType === "xp") {
      setFilteredScores([...scores].sort((a, b) => b.totalXp - a.totalXp));
    } else {
      setFilteredScores();
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center scoreboard-container">
      <div className="scoreboard-header mb-4">
        <h1>Top Scores</h1>
      </div>

      <div className="filter-buttons mb-4">
        <button className="filter-btn" onClick={() => applyFilter("wins")}>
          Sort by Score
        </button>
        <button className="filter-btn" onClick={() => applyFilter("username")}>
          Sort by Username
        </button>
        <button className="filter-btn" onClick={() => applyFilter("xp")}>
          Sort by Xp
        </button>
      </div>

      <div className="searchBar">
        <input
          type="text"
          className="search"
          placeholder="Type player name..."
        />
        <button className="filter-btn mb-4">Search</button>
      </div>

      <div className="table">
        <table className="scoreboard-table w-full max-w-4xl">
          <thead>
            <tr className="border-b">
              <th className="p-2">#</th>
              <th className="p-2">Username</th>
              <th className="p-2">Score</th>
              <th className="p-2">XP</th>
            </tr>
          </thead>

          <tbody>
            {!loading || !error ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  <ClipLoader size={40} />
                  {error && (
                    <p style={{ marginTop: "14px", color: "red" }}>
                      The data could not be loaded.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              filteredScores.slice(0, 10).map((score, index) => (
                <tr key={score.id}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{score.name}</td>
                  <td className="p-2 font-bold">{score.totalScore}</td>
                  <td className="p-2 font-bold">{score.totalXp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;
