import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
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

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchScoreboardPlayer = async () => {
      try {
        const response = await axios.get(
          "https://dongesz.com/api/Users/playerScore"
        );
        setScores(response.data.result);
        setFilteredScores(response.data.result);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchScoreboardPlayer();
  }, []);

  const handleSearch = () => {
    const filtered = scores.filter((score) =>
      score.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredScores(filtered);
  };

  const applyFilter = (filterType) => {
    let sorted = [...filteredScores];

    if (filterType === "username") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filterType === "wins") {
      sorted.sort((a, b) => b.totalScore - a.totalScore);
    } else if (filterType === "xp") {
      sorted.sort((a, b) => b.totalXp - a.totalXp);
    }

    setFilteredScores(sorted);
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
          Sort by XP
        </button>
      </div>

      <div className="searchBar">
        <input
          type="text"
          className="search"
          placeholder="Type player name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="filter-btn mb-4" onClick={handleSearch}>
          Search
        </button>
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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  <ClipLoader size={40} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-red-500">
                  The data could not be loaded.
                </td>
              </tr>
            ) : filteredScores.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  No players found.
                </td>
              </tr>
            ) : (
              filteredScores.slice(0, 10).map((score, index) => (
                <tr key={score.id || score.name}>
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
