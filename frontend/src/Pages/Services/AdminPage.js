import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "../../Styles/AdminPage.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const location = useLocation();
  if (location.pathname === "/admin") {
    document.title = "Admin Panel";
  }

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // melyik sort szerkesztjük – kulcs: id vagy (ha az nincs) name
  const [editingUser, setEditingUser] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [visibleCount, setVisibleCount] = useState(10); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://dongesz.com/api/Users/scoreboard");
      setUsers(response.data.result);
      setFilteredUsers(response.data.result);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setVisibleCount(10); // Keresés után vissza 10-re
  };

  const loadMoreUsers = () => {
    setVisibleCount(prev => prev + 10);
  };

  const startEdit = (user) => {
    // ha nincs id a scoreboard-válaszban, használjuk a nevet kulcsnak
    const key = user.id ?? user.name;
    setEditingUser(key);
    setEditValues({
      name: user.name,
      totalScore: user.totalScore,
      totalXp: user.totalXp
    });
  };

  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveEdit = async (userId) => {
    try {
      await axios.put(`https://dongesz.com/api/Users/${userId}`, editValues);
      fetchUsers(); // Refresh data
      setEditingUser(null);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://dongesz.com/api/Users/${userId}`);
        fetchUsers(); // Refresh data
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const displayUsers = filteredUsers.slice(0, visibleCount);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel - All Users ({users.length} total)</h1>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="loading-center">
            <ClipLoader size={50} color="#8c7153" />
          </div>
        ) : error ? (
          <div className="error-message">
            The data could not be loaded.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-data">
            No users found.
          </div>
        ) : (
          <>
            <div className="table-info">
              Showing {displayUsers.length} of {filteredUsers.length} users
            </div>
            <div className="table-scroll-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Profile Picture</th>
                    <th>Username</th>
                    <th>Score</th>
                    <th>XP</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user, index) => {
                    const rowKey = user.id ?? user.name;
                    const isEditing = editingUser === rowKey;
                    return (
                  <tr key={rowKey}>
                      <td>{index + 1}</td>
                      <td>
                        <img 
                          src={user.profilePictureUrl} 
                          alt="Avatar" 
                          className="avatar-img"
                        />
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            value={editValues.name}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            className="edit-input"
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.totalScore}
                            onChange={(e) => handleEditChange('totalScore', parseInt(e.target.value) || 0)}
                            className="edit-input"
                          />
                        ) : (
                          <span className="score-value">{user.totalScore}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValues.totalXp}
                            onChange={(e) => handleEditChange('totalXp', parseInt(e.target.value) || 0)}
                            className="edit-input"
                          />
                        ) : (
                          <span className="xp-value">{user.totalXp}</span>
                        )}
                      </td>
                      <td className="action-buttons">
                        {isEditing ? (
                          <>
                            <button 
                              className="save-btn"
                              onClick={() => saveEdit(user.id)}
                            >
                              💾 Save
                            </button>
                            <button 
                              className="cancel-btn"
                              onClick={() => setEditingUser(null)}
                            >
                              ❌ Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="edit-btn"
                              onClick={() => startEdit(user)}
                              title="Edit user"
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteUser(user.id)}
                              title="Delete user"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {visibleCount < filteredUsers.length && (
              <div className="load-more-section">
                <button 
                  className="load-more-btn"
                  onClick={loadMoreUsers}
                >
                  Load More (+10 users)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
