import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "../../Styles/AdminPage.css";
import { useLocation } from "react-router-dom";
import api from "../../api/api";
import Toast from "../../Component/Toast";
import ConfirmModal from "../../Component/ConfirmModal";

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
  const [editingUser, setEditingUser] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, message: "", onConfirm: null });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/main/Admin/Users");
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
    setVisibleCount(10);
  };

  const loadMoreUsers = () => {
    setVisibleCount(prev => prev + 10);
  };

  const startEdit = (user) => {
    const key = user.id ?? user.name;
    setEditingUser(key);
    setEditValues({
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl,
      userType: user.type,
      isAdmin: user.type === "Admin",
    });
  };


  const handleEditChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveEdit = async (user) => {
    try {
      const userId = user.id;
      const originalIsAdmin = user.type === "Admin";

      const formData = new FormData();
      formData.append("Name", editValues.name);
      formData.append("Email", editValues.email);
      formData.append("Bio", editValues.bio);
      formData.append("UserType", editValues.userType);

      if (editValues.profilePictureFile) {
        formData.append("ProfilePicture", editValues.profilePictureFile);
      }

      // Update profile
      await api.put(`main/Admin/Users/${userId}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });


      if (editValues.isAdmin !== originalIsAdmin) {
        await api.post("/auth/Auth/toggleadminrole", {
          userName: user.name,
        });
      }

      fetchUsers();
      setEditingUser(null);
      setSuccessMessage("User saved successfully!");
      setErrorMessage("");
    } catch (err) {
      console.error("Error saving user:", err);
      setErrorMessage(err.response?.data?.message || "Failed to save user.");
      setSuccessMessage("");
    }
  };

  const openConfirm = (message, onConfirm) => {
    setConfirmModal({ open: true, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, message: "", onConfirm: null });
  };

  const deleteUser = async (userId) => {
    openConfirm("Are you sure you want to delete this user?", async () => {
      closeConfirm();
      try {
        await api.delete(`main/Admin/Users/${userId}`);
        fetchUsers();
        setSuccessMessage("User deleted successfully!");
        setErrorMessage("");
      } catch (err) {
        console.error("Error deleting user:", err);
        setErrorMessage(err.response?.data?.message || "Failed to delete user.");
        setSuccessMessage("");
      }
    });
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditValues(prev => ({
      ...prev,
      profilePictureFile: file,
      previewUrl: URL.createObjectURL(file)
    }));
  };


  const displayUsers = filteredUsers.slice(0, visibleCount);

  return (
    <div className="admin-container">
      <Toast type="success" message={successMessage} onClose={() => setSuccessMessage("")} />
      <Toast type="error" message={errorMessage} onClose={() => setErrorMessage("")} />

      <ConfirmModal
        open={confirmModal.open}
        message={confirmModal.message}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmDanger
        onConfirm={() => {
          if (confirmModal.onConfirm) confirmModal.onConfirm();
        }}
        onCancel={closeConfirm}
      />

      <div className="admin-panel-card">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p className="admin-subtitle">
            Manage all users easily – total users: <span>{users.length}</span>
          </p>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn btn-pill" onClick={handleSearch}>
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
                      <th>Email</th>
                      <th>Bio</th>
                      <th>Add Admin</th>
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
                            {isEditing ? (
                              <>
                                <input
                                  type="file"
                                  id={`fileInput-${user.id}`}
                                  onChange={handleFileChange}
                                  className="file-input"
                                />
                                <label htmlFor={`fileInput-${user.id}`} className="avatar-label">
                                  <img
                                    src={editValues.previewUrl || editValues.profilePictureUrl}
                                    alt="Avatar"
                                    className="avatar-img"
                                  />
                                </label>
                              </>
                            ) : (
                              <img
                                src={user.profilePictureUrl}
                                alt="Avatar"
                                className="avatar-img"
                              />
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                value={editValues.name}
                                onChange={(e) => handleEditChange('name', e.target.value)}
                                className="values"
                              />
                            ) : (
                              user.name
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.email}
                                onChange={(e) => handleEditChange('email', e.target.value)}
                                className="values"
                              />
                            ) : (
                              <span className="values">{user.email}</span>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editValues.bio}
                                onChange={(e) => handleEditChange('bio', e.target.value)}
                                className="values"
                              />
                            ) : (
                              <span className="values">{user.bio}</span>
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <button
                                type="button"
                                className={`admin-toggle-btn ${editValues.isAdmin ? "admin-toggle-btn--yes" : "admin-toggle-btn--no"}`}
                                onClick={() =>
                                  setEditValues(prev => ({ ...prev, isAdmin: !prev.isAdmin }))
                                }
                              >
                                {editValues.isAdmin ? "Yes" : "No"}
                              </button>
                            ) : (
                              <span
                                // className={
                                //   user.type === "Admin"
                                //     ? "admin-badge admin-badge--admin"
                                //     : "admin-badge admin-badge--user"
                                // }
                              >
                                
                              </span>
                            )}
                          </td>
                          <td className="action-buttons">
                            {isEditing ? (
                              <>
                                <button
                                  className="save-btn btn-pill"
                                  onClick={() => saveEdit(user)}
                                >
                                  💾 Save
                                </button>
                                <button
                                  className="cancel-btn btn-pill"
                                  onClick={() => setEditingUser(null)}
                                >
                                  ❌ Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="edit-btn btn-pill"
                                  onClick={() => startEdit(user)}
                                  title="Edit user"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  className="delete-btn btn-pill btn-pill--danger"
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
    </div>
  );
};

export default AdminPage;
