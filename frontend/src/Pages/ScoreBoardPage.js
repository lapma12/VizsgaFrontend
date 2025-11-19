import React, { useState, useEffect } from "react";
import "../Styles/Scoreboard.css";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [, setFilter] = useState("all");

  useEffect(() => {
    // Scoreboard lekérés
    fetch("https://localhost:7282/api/Scoreboard")
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
        setFilteredScores(data);
      })
      .catch((err) => console.error(err));

    // Users lekérés
    fetch("https://localhost:7282/api/Users")
      .then((res) => res.json())
      .then((userData) => setUsers(userData))
      .catch((err) => console.error(err));
  }, []);

  // Username keresése ID alapján
  const getUsernameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  const applyFilter = (filterType) => {
    setFilter(filterType);

    if (filterType === "username") {
      setFilteredScores(
        [...scores].sort((a, b) => {
          const nameA = getUsernameById(a.id);
          const nameB = getUsernameById(b.id);
          return nameA.localeCompare(nameB);
        })
      );
    } else if (filterType === "wins") {
      setFilteredScores(
        [...scores].sort((a, b) => b.totalScore - a.totalScore)
      );
    } else {
      setFilteredScores(scores);
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
        <button className="filter-btn" onClick={() => applyFilter("all")}>
          Show All
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
            </tr>
          </thead>
          <tbody>
            {filteredScores.slice(0, 10).map((score, index) => (
              <tr key={score.id}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{getUsernameById(score.id)}</td>
                <td className="p-2 font-bold">{score.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;
