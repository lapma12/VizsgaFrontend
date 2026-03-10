import { useEffect, useState } from "react";
import "../Styles/Account.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Settings as CogIcon,
  BarChart2,
  Trash2,
  EyeOff,
  Eye,
} from "lucide-react";
import { MdAccountCircle } from "react-icons/md";
import api from "../api/api";
import Toast from "../Component/Toast";
import ConfirmModal from "../Component/ConfirmModal";
import axios from "axios";

const Account = ({ setloginIn, setuserDataState }) => {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("results");
  const navigate = useNavigate();

  //ALERT
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //ALERT BOXES
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //DATA
  const [successResult, setSuccesssResult] = useState(false);
  const [resultData, setresultData] = useState(null);

  if (location.pathname === "/account") {
    document.title = "My Account -> " + resultData?.name;
  }

  useEffect(() => {
    setloginIn(true);
  }, [setloginIn]);

  const handleConfirm = () => {
    setSuccessMessage("");
  };
  //LOG OUT FROM ACCOUNT
  const handleLogoutClick = () => {
    setLogoutConfirm(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setloginIn(false);
    setLogoutConfirm(false);
    navigate("/login");
  };

  //DELETE ACCOUNT
  const handleDeleteClick = () => {
    setDeleteConfirm(true);
  };
  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    try {
      const passCheck = await api.post("/auth/Auth/me/checkpassword", {
        password: confirmPassword,
      });
      if (passCheck.data.success) {
        const response = await api.delete("/main/Users/me/");
        console.log(response);
        if (response.data.success) {
          setSuccessMessage(response.data.message);
          localStorage.removeItem("authToken");
          setloginIn(false);
          setDeleteConfirm(false);
          setConfirmPassword("");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } else {
        setErrorMessage("Password is wrong!");
      }
    } catch (error) {
      if (confirmPassword === "") {
        setErrorMessage("Fill the gap!");
      } else {
        console.error(error);
        setErrorMessage("Account deletion failed");
      }
    }
  };
  //PICTURE CHANGE
  const handlePicChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post(
        "/main/Users/me/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setuserDataState(true);
      console.log(response);
      setSuccessMessage("Profile picture updated!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Profile picture upload failed");
    }
  };
  //ALL DATA TO ACCOUNT
  useEffect(() => {
    setloginIn(true);
    const fetchMe = async () => {
      try {
        const res = await api.get("/main/Users/me/result");
        setSuccesssResult(true);
        setresultData(res.data.result);
      } catch {
        navigate("/login");
      }
    };
    fetchMe();
  }, [navigate, setloginIn, successMessage]);

  return (
    <div className="account-page">
      <Toast
        type="success"
        message={successMessage}
        onClose={handleConfirm}
        html
      />
      <Toast
        type="error"
        message={errorMessage}
        onClose={() => setErrorMessage("")}
        html
      />

      <ConfirmModal
        open={logoutConfirm}
        message="Do you want to log out?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        showProgress={false}
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirm(false)}
      />

      <ConfirmModal
        open={deleteConfirm}
        message="Enter your password to delete your account"
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        confirmDanger
        showProgress={false}
        onConfirm={handleDeleteAccount}
        onCancel={() => {
          setDeleteConfirm(false);
          setConfirmPassword("");
        }}
      >
        <div style={{ position: "relative", marginBottom: "0.5rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            placeholder="Enter your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 2.5rem 0.5rem 0.75rem",
              borderRadius: "8px",
              border: "2px solid #8c7153",
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#444",
            }}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </span>
        </div>
      </ConfirmModal>

      <div className="account-header">
        {resultData && (
          <>
            <label htmlFor="avatar" className="avatar-wrapper">
              {resultData.profilePictureUrl ? (
                <img
                  src={resultData.profilePictureUrl}
                  className="avatarPic"
                  alt="Avatar"
                  title="Kattints a kép cseréjéhez"
                />
              ) : (
                <div className="avatarPic avatarPic--placeholder" title="Kattints a kép cseréjéhez">
                  <MdAccountCircle size={64} />
                </div>
              )}
            </label>
          </>
        )}
        <div className="account-info">
          <h1 className="account-title">
            Welcome,{" "}
            <span className="username">
              {successResult ? resultData.name : ""}
            </span>
          </h1>

          <p className="account-subtitle">
            Bio : {successResult ? resultData.bio : "" || null}
          </p>
          <p className="account-subtitle">
            Account is created at :{" "}
            {successResult
              ? new Date(resultData.createdAt).toISOString().split("T")[0]
              : ""}
          </p>

          {/* Rejtett file input */}
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={handlePicChange}
            hidden
          />
        </div>
      </div>

      <div className="account-menu">
        <button
          className={`${activeTab === "results" ? "active" : ""} btn-pill btn-pill--primary`}
          onClick={() => setActiveTab("results")}
        >
          <BarChart2 size={18} /> My Results
        </button>
        <button
          className={`${activeTab === "settings" ? "active" : ""} btn-pill btn-pill--primary`}
          onClick={() => setActiveTab("settings")}
        >
          <CogIcon size={18} /> Settings
        </button>
      </div>

      <div className="account-content">
        {activeTab === "results" && (
          <Results resultData={resultData} successResult={successResult} />
        )}
        {activeTab === "settings" && (
          <Settings
            resultData={resultData}
            onProfileUpdated={(updater) =>
              setresultData((prev) =>
                typeof updater === "function" ? updater(prev) : updater
              )
            }
          />
        )}
      </div>

      <div className="account-footer">
        <button
          className="logout-btn btn-pill btn-pill--ghost"
          onClick={() => {
            handleLogoutClick();
          }}
        >
          Log out
        </button>
        <button
          className="delete-btn"
          onClick={() => {
            handleDeleteClick();
          }}
        >
          <Trash2 size={18} /> Delete Account
        </button>
      </div>
    </div>
  );
};

const Results = ({ resultData, successResult }) => (
  <div className="results-section">
    <h2>My Results</h2>
    <ul>
      <li>Total Score : {successResult ? resultData.totalScore : ""}</li>
      <li>Total Kill: {successResult ? resultData.totalKills : ""}</li>
    </ul>
  </div>
);

const Settings = ({ resultData, onProfileUpdated }) => {
  const [username, setUsername] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [bio, setBio] = useState(resultData?.bio || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    setSuccessMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    let successMessages = [];
    let hasError = false;

    const emailData = {
      to: resultData.email,
      subject: "CastL – Password changed successfully",
      body: `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password changed</title>
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
    </style>
  </head>
  <body>
    <div class="email-root">
      <div class="email-card">
        <div class="email-header">
          <div class="email-title">CastL</div>
        </div>

        <div class="email-body">
          <p>Hi ${username || "Explorer"},</p>
          <p>Your password has been <strong>successfully changed</strong>.</p>
          <p>If you did not make this change, please secure your account immediately.</p>
        </div>

        <div class="email-footer">
          Automatic security notification from CastL.
        </div>
      </div>
    </div>
  </body>
  </html>
  `
    };
    console.log(resultData.email);


    // BIO update
    if (bio !== resultData.bio && bio) {
      try {
        const response = await api.put("/main/Users/me/bio", { bio });

        if (response.data.success) {
          successMessages.push("Bio updated successfully");
          if (onProfileUpdated) {
            onProfileUpdated((prev) => ({
              ...prev,
              bio,
            }));
          }
        } else {
          hasError = true;
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        console.error(error);
        hasError = true;
        setErrorMessage("Bio update failed");
      }
    }

    // USERNAME update
    if (username !== resultData.name && username) {
      try {
        const response = await api.put("/main/Users/me/name", {
          name: username,
        });

        if (response.data.success) {
          successMessages.push("Username updated successfully");
          if (onProfileUpdated) {
            onProfileUpdated((prev) => ({
              ...prev,
              name: username,
            }));
          }
        } else {
          hasError = true;
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        console.error(error);
        hasError = true;
        setErrorMessage("Username update failed");
      }
    }
    // PASSWORD update
    if (oldPassword && newpassword && confirmpassword) {
      if (newpassword !== confirmpassword) {
        hasError = true;
        setErrorMessage("New passwords do not match");
      } else {
        try {
          const response = await api.put("/auth/Auth/me/password", {
            currentPassword: oldPassword,
            newPassword: newpassword,
          });

          if (response.data.success) {
            successMessages.push("Password updated successfully");

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // email küldés külön
            try {
              await axios.post("https://dongesz.com/api/main/Email", emailData);
            } catch (emailError) {
              console.error("Email sending failed:", emailError);
            }

          } else {
            hasError = true;
            setErrorMessage(response.data.message);
          }
        } catch (error) {
          console.error(error);
          hasError = true;
          setErrorMessage("Password update failed");
        }
      }
    }

    if (!hasError && successMessages.length > 0) {
      setSuccessMessage(successMessages.join(" | "));
    }
    if (successMessages.length === 0 && !hasError) {
      setErrorMessage("No changes were made");
    }
  };

  return (
    <div className="settings-section">
      <Toast
        type="success"
        message={successMessage}
        onClose={handleConfirm}
        html
      />
      <Toast
        type="error"
        message={errorMessage}
        onClose={() => setErrorMessage("")}
        html
      />

      <div className="settings-header-row">
        <h2>Account Settings</h2>
        <div className="password-info">
          <span className="password-info-icon">i</span>
          <div className="password-info-tooltip">
            <p className="password-info-title">Password requirements</p>
            <ul>
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter (A–Z)</li>
              <li>Contains at least one number (0–9)</li>
              <li>Contains at least one special character (!, ?, %, @, #, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-columns">
          <div className="settings-column">
            <h3>Username</h3>
            <label className="current-username">
              Current username: {resultData.name}
            </label>
            <input
              type="text"
              value={username}
              placeholder="Enter new username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Change your bio:</label>
            <textarea
              className="textBoxforDetils"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* RIGHT COLUMN – PASSWORDS */}
          <div className="settings-column">
            <h3>Password</h3>
            <label>Old Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              placeholder="Enter old password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label>New Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newpassword}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm Password:</label>
            <div className="settings-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmpassword}
                placeholder="Enter new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="settings-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-hidden
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </span>
            </div>
          </div>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
export default Account;
