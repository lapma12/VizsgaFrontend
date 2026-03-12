import React, { useState, useEffect, useCallback } from "react";
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
  const [confirmModal, setConfirmModal] = useState({ open: false, message: "" });
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteLog, setDeleteLog] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // "users" | "newContent"



  const applyRoleOverrides = (list) => {
    try {
      const raw = localStorage.getItem("adminRoleOverrides");
      if (!raw) return list;
      const overrides = JSON.parse(raw);
      if (!overrides || typeof overrides !== "object") return list;

      return list.map((u) => {
        const overrideType = overrides[u.id] ?? overrides[u.name];
        return overrideType
          ? {
            ...u,
            userType: overrideType,
          }
          : u;
      });
    } catch {
      return list;
    }
  };
  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/main/Admin/Users");
      const withOverrides = applyRoleOverrides(response.data.result);
      setUsers(withOverrides);
      setFilteredUsers(withOverrides);
      setLoading(false);

      // load local delete/bann log for admin view
      try {
        const raw = localStorage.getItem("adminDeleteLog");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setDeleteLog(parsed);
          }
        }
      } catch {
        // ignore log errors
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
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
      // backend: user.userType tartalmazza a szerepet
      userType: user.userType,
      isAdmin: user.userType === "Admin",
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
      const originalIsAdmin = user.userType === "Admin";
      const newUserType = editValues.isAdmin ? "Admin" : "User";

      const formData = new FormData();
      formData.append("Name", editValues.name);
      formData.append("Email", editValues.email);
      formData.append("Bio", editValues.bio);
      // Role "Yes" esetén az Admin típust küldjük fel
      formData.append("UserType", newUserType);

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
      try {
        const raw = localStorage.getItem("adminRoleOverrides");
        const overrides = raw ? JSON.parse(raw) : {};
        const key = userId ?? user.name;
        overrides[key] = newUserType;
        localStorage.setItem("adminRoleOverrides", JSON.stringify(overrides));
      } catch {
      }

      setUsers(prev =>
        prev.map((u) =>
          u.id === userId
            ? {
              ...u,
              name: editValues.name,
              email: editValues.email,
              bio: editValues.bio,
              profilePictureUrl: editValues.previewUrl || editValues.profilePictureUrl,
              userType: newUserType,
            }
            : u
        )
      );

      setFilteredUsers(prev =>
        prev.map((u) =>
          u.id === userId
            ? {
              ...u,
              name: editValues.name,
              email: editValues.email,
              bio: editValues.bio,
              profilePictureUrl: editValues.previewUrl || editValues.profilePictureUrl,
              userType: newUserType,
            }
            : u
        )
      );

      setEditingUser(null);
      setSuccessMessage("User saved successfully!");
      setErrorMessage("");
    } catch (err) {
      console.error("Error saving user:", err);
      setErrorMessage(err.response?.data?.message || "Failed to save user.");
      setSuccessMessage("");
    }
  };

  const openConfirm = (message) => {
    setConfirmModal({ open: true, message });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, message: "" });
    setUserToDelete(null);
    setDeleteReason("");
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete || !userToDelete.email) {
      setErrorMessage("User data is missing, cannot delete.");
      return;
    }

    if (!deleteReason.trim()) {
      setErrorMessage("Please provide a reason for the deletion.");
      return;
    }

    closeConfirm();

    try {
      await api.delete(`main/Admin/Users/${userToDelete.id}`);

      const emailData = {
        to: userToDelete.email,
        subject: "Your CastL account has been deleted",
        body: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account deleted</title>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #e8d8b4;
        color: #2d1b0f;
      }
      .email-root {
        padding: 24px 12px;
      }
      .email-card {
        max-width: 560px;
        margin: 0 auto;
        background: #f8ecd0;
        border-radius: 16px;
        border: 1px solid rgba(75, 54, 33, 0.35);
        box-shadow: 0 16px 40px rgba(75, 54, 33, 0.35);
        overflow: hidden;
      }
      .email-header {
        padding: 20px 22px 10px;
        border-bottom: 1px solid rgba(75, 54, 33, 0.15);
      }
      .email-title {
        font-size: 22px;
        font-weight: 700;
        color: #3a2414;
      }
      .email-body {
        padding: 18px 22px;
        font-size: 14px;
        line-height: 1.6;
      }
      .email-footer {
        padding: 10px 22px 16px;
        border-top: 1px solid rgba(75, 54, 33, 0.18);
        font-size: 11px;
        color: #7b6347;
        background: #e0cfa4;
      }
      .reason-box {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(140, 113, 83, 0.5);
        font-size: 13px;
        color: #5c4630;
      }
    </style>
  </head>
  <body>
    <div class="email-root">
      <div class="email-card">
        <div class="email-header">
          <div class="email-title">Your CastL account has been deleted</div>
        </div>
        <div class="email-body">
          <p>Hi ${userToDelete.name || "Player"},</p>
          <p>
            We would like to let you know that your CastL account associated with
            <strong>${userToDelete.email}</strong> has been deleted by an administrator.
          </p>
          <div class="reason-box">
            <strong>Reason provided by the administrator:</strong><br/>
            ${deleteReason.trim().replace(/\n/g, "<br/>")}
          </div>
          <p>
            If you believe this action was taken in error or you have any questions,
            please contact our support team.
          </p>
        </div>
        <div class="email-footer">
          Automatic message about your CastL account deletion. Please do not reply.
        </div>
      </div>
    </div>
  </body>
</html>
        `,
      };

      await api.post("/main/Email", emailData);

      // log ban/delete locally for admin overview
      try {
        const entry = {
          id: userToDelete.id,
          name: userToDelete.name,
          email: userToDelete.email,
          reason: deleteReason.trim(),
          deletedAt: new Date().toISOString(),
        };
        setDeleteLog((prev) => {
          const next = [entry, ...prev];
          try {
            localStorage.setItem("adminDeleteLog", JSON.stringify(next));
          } catch {
            // ignore storage errors
          }
          return next;
        });
      } catch {
        // ignore log errors
      }

      fetchUsers();
      setSuccessMessage("User deleted, logged and notification email sent.");
      setErrorMessage("");
    } catch (err) {
      console.error("Error deleting user:", err);
      setErrorMessage(err.response?.data?.message || "Failed to delete user or send email.");
      setSuccessMessage("");
    }
  };

  const deleteUser = (user) => {
    setUserToDelete(user);
    setDeleteReason("");
    openConfirm("Please provide a reason for deleting this account.");
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

  const [Title, setTitle] = useState("")
  const [Image, setImage] = useState(null)
  const [Content, setContent] = useState("");

  const HandleNewsPost = async (e) => {
    e.preventDefault();

    if (!Title || !Content || !Image) {
      setErrorMessage("Please fill all fields and choose an image.");
      return;
    }

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("Content", Content);
    formData.append("Image", Image);

    try {
      await api.post(`main/News`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Successfully uploaded!");
      setErrorMessage("");
      setTitle("");
      setContent("");
      setImage(null);
    } catch (err) {
      console.error("Something went wrong:", err);
      setErrorMessage(err.response?.data?.message || "Something went wrong");
      setSuccessMessage("");
    }
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
        showProgress={false}
        onConfirm={handleConfirmDelete}
        onCancel={closeConfirm}
      >
        {userToDelete && (
          <div className="admin-delete-reason">
            <label className="admin-form-label">Reason for deletion</label>
            <textarea
              className="admin-form-input admin-form-textarea"
              placeholder="Describe why this account is being deleted..."
              rows={4}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
          </div>
        )}
      </ConfirmModal>

      <div className="admin-panel-card">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p className="admin-subtitle">
            Manage all users easily – total users: <span>{users.length}</span>
          </p>
        </div>
        {/* PAGE CHANGE BUTTONS */}
        <div className="admin-tabs">
          <button
            className={
              activeTab === "users"
                ? "admin-tab-btn admin-tab-btn--active"
                : "admin-tab-btn"
            }
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={
              activeTab === "newContent"
                ? "admin-tab-btn admin-tab-btn--active"
                : "admin-tab-btn"
            }
            onClick={() => setActiveTab("newContent")}
          >
            New content
          </button>
        </div>

        {activeTab === "users" && (
          <>
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
                    Showing <strong>{displayUsers.length}</strong> of{" "}
                    <strong>{filteredUsers.length}</strong> users
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Contact</th>
                          <th>Bio</th>
                          <th>Role</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayUsers.map((user, index) => {
                          const rowKey = user.id ?? user.name;
                          const isEditing = editingUser === rowKey;
                          return (
                            <tr
                              key={rowKey}
                              className={
                                isEditing ? "admin-row admin-row--editing" : "admin-row"
                              }
                            >
                              <td>{index + 1}</td>
                              <td>
                                <div className="user-cell">
                                  <div className="user-cell__avatar">
                                    {isEditing ? (
                                      <>
                                        <input
                                          type="file"
                                          id={`fileInput-${user.id}`}
                                          onChange={handleFileChange}
                                          className="file-input"
                                        />
                                        <label
                                          htmlFor={`fileInput-${user.id}`}
                                          className="avatar-label"
                                        >
                                          <img
                                            src={
                                              editValues.previewUrl ||
                                              editValues.profilePictureUrl
                                            }
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
                                  </div>
                                  <div className="user-cell__info">
                                    {isEditing ? (
                                      <input
                                        value={editValues.name}
                                        onChange={(e) =>
                                          handleEditChange("name", e.target.value)
                                        }
                                        className="values user-cell__name-input"
                                      />
                                    ) : (
                                      <span className="user-cell__name">{user.name}</span>
                                    )}
                                    {!isEditing && (
                                      <span className="user-cell__id">
                                        ID: {user.id ?? "—"}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={editValues.email}
                                    onChange={(e) =>
                                      handleEditChange("email", e.target.value)
                                    }
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
                                    onChange={(e) =>
                                      handleEditChange("bio", e.target.value)
                                    }
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
                                    className={`admin-toggle-btn ${editValues.isAdmin
                                      ? "admin-toggle-btn--yes"
                                      : "admin-toggle-btn--no"
                                      }`}
                                    onClick={() =>
                                      setEditValues((prev) => ({
                                        ...prev,
                                        isAdmin: !prev.isAdmin,
                                      }))
                                    }
                                  >
                                    {editValues.isAdmin ? "Yes" : "No"}
                                  </button>
                                ) : (
                                  <span
                                    className={
                                      user.userType === "Admin"
                                        ? "admin-badge admin-badge--admin"
                                        : "admin-badge admin-badge--user"
                                    }
                                  >
                                    {user.userType === "Admin" ? "Admin" : "User"}
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
                                      onClick={() => deleteUser(user)}
                                      title="Delete user"
                                    >
                                      🗑️ Ban
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

                  {deleteLog.length > 0 && (
                    <div className="admin-delete-log">
                      <h3 className="admin-delete-log__title">Deleted / banned accounts</h3>
                      <table className="admin-table admin-delete-log__table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Reason</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {deleteLog.map((entry, index) => (
                            <tr key={`${entry.id}-${entry.deletedAt}-${index}`}>
                              <td>{index + 1}</td>
                              <td>{entry.name}</td>
                              <td>{entry.email}</td>
                              <td>{entry.reason}</td>
                              <td>{new Date(entry.deletedAt).toISOString().split("T")[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {activeTab === "newContent" && (
          <div className="admin-newcontent-card">
            <h2 className="admin-newcontent-title">New content upload</h2>
            <p className="admin-newcontent-subtitle">
              Here you will be able to upload things to the new page.
            </p>
            <form className="admin-newcontent-form" onSubmit={HandleNewsPost}>
              <div className="admin-form-row">
                <label className="admin-form-label">Title</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Enter title..."
                  value={Title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-form-label">Description</label>
                <textarea
                  className="admin-form-input admin-form-textarea"
                  placeholder="Short description..."
                  rows={4}
                  value={Content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="admin-form-row">
                <label className="admin-form-label">Image upload</label>
                <div className="admin-image-upload">
                  <label className="admin-image-upload__dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-image-upload__input"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImage(file);
                      }}
                    />
                    <span className="admin-image-upload__icon">📁</span>
                    <span className="admin-image-upload__text">
                      {Image ? "Image selected" : "Click to choose an image or drag & drop here"}
                    </span>
                  </label>
                  <p className="admin-image-upload__hint">
                    Recommended: JPG or PNG, max. 5MB.
                  </p>
                </div>
              </div>
              <div className="admin-form-row admin-form-row--actions">
                <button
                  type="submit"
                  className="save-btn btn-pill admin-form-submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
