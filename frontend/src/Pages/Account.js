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
import api from "../api/api";
import Toast from "../Component/Toast";
import ConfirmModal from "../Component/ConfirmModal";

const Account = ({ setloginIn, setuserDataState, showAdminpanel }) => {
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
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirm(false)}
      />

      <ConfirmModal
        open={deleteConfirm}
        message="Enter your password to delete your account"
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        confirmDanger
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
              <img
                src={resultData.profilePictureUrl}
                className="avatarPic"
                alt="Avatar"
                title="Kattints a kép cseréjéhez"
              />
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
            Details : {successResult ? resultData.bio : ""}
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
          <Settings resultData={resultData} successResult={successResult} />
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
      <li>Total Xp: {successResult ? resultData.totalXp : ""}</li>
    </ul>
  </div>
);

const Settings = ({ resultData }) => {
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

    // BIO update
    if (bio !== resultData.bio && bio) {
      try {
        const response = await api.put("/main/Users/me/bio", { bio });

        if (response.data.success) {
          successMessages.push("Bio updated successfully");
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

      <h2>Account Settings</h2>
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
            <label>Change your details:</label>
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
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmpassword}
                placeholder="Enter new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "55%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#4b3621",
                }}
              >
                {showPassword ? <EyeOff size={30} /> : <Eye size={30} />}
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
