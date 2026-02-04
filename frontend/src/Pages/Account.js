import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../Styles/Account.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Settings as CogIcon,
  BarChart2,
  Trash2,
} from "lucide-react";
import api from "../api/api";

const Account = ({ setloginIn }) => {
  const location = useLocation();

  if (location.pathname === "/account") {
    document.title = "Account";
  }

  const [activeTab, setActiveTab] = useState("results");
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [successResult, setSuccesssResult] = useState(false);
  const [resultData, setresultData] = useState(null);

  useEffect(() => {
    setloginIn(true);
  }, [setloginIn])

  const handleConfirm = () => {
    setSuccessMessage("");
  };

  const goToHome = () => {
    localStorage.removeItem("authToken");
    setloginIn(false);
    navigate("/");
  };


  const handlePicChange = async (event) => {
    event.preventDefault();
    
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        "https://dongesz.com/api/Users/me/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setSuccessMessage("Profile picture updated!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Profile picture upload failed");
    }
  };

  useEffect(() => {
    setloginIn(true);

    const fetchMe = async () => {
      try {
        const res = await api.get("https://dongesz.com/api/Users/me/result");
        setSuccesssResult(true);
        setresultData(res.data.result);
      } catch {
        navigate("/login");
      }
    };

    fetchMe();
  }, [navigate, setloginIn]);
  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const response = await api.delete("/Users/me");

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        localStorage.removeItem("authToken");
        setloginIn(false);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Account deletion failed");
    }
  };

  return (
    <div className="account-page">
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="success-alert"
        >
          <>
            <div
              className="message"
              dangerouslySetInnerHTML={{ __html: successMessage }}
            />
            <button className="confirm-btn" onClick={handleConfirm}>
              OK
            </button>
          </>
        </motion.div>
      )}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="error-alert"
        >
          <div
            className="message"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
          <button
            className="error-confirm-btn"
            onClick={() => setErrorMessage("")}
          >
            OK
          </button>
        </motion.div>
      )}
      <div className="account-header">
        {resultData && (
          <>
            <img src={resultData.profilePictureUrl} className="avatarPic" alt="Avatar" title="Avatar" />
          </>
        )}
        <div className="account-info">
          <h1 className="account-title">
            Welcome,{" "}
            <span className="username">
              {successResult ? resultData.name : ""}
            </span>
          </h1>
          <p className="account-subtitle">Details : {successResult ? resultData.bio : ""}</p>
          <label>Profil pic:  </label>
          <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" onChange={handlePicChange} />
        </div>

      </div>

      <div className="account-menu">
        <button
          className={activeTab === "results" ? "active" : ""}
          onClick={() => setActiveTab("results")}
        >
          <BarChart2 size={18} /> My Results
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          <CogIcon size={18} /> Settings
        </button>
      </div>

      <div className="account-content">
        {activeTab === "results" && <Results resultData={resultData} successResult={successResult} />}
        {activeTab === "settings" && <Settings resultData={resultData} successResult={successResult}   />}
      </div>

      <div className="account-footer">
        <button className="logout-btn" onClick={goToHome}>
          Log out
        </button>
        <button className="delete-btn" onClick={deleteAccount}>
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
      <li>Total Score : {successResult ? resultData.totalScore : "" }</li>
      <li>Total Xp: {successResult ? resultData.totalXp : "" }</li>
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

  const handleConfirm = () => {
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bio.trim()) {
      setErrorMessage("Bio cannot be empty");
      return;
    }

    try {
      const response = await api.put("https://dongesz.com/api/Users/me/bio", {
        bio: bio,
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Update failed");
      setSuccessMessage("");
    }
  };


  return (
    <div className="settings-section">
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="success-alert"
        >
          <>
            <div
              className="message"
              dangerouslySetInnerHTML={{ __html: successMessage }}
            />
            <button className="confirm-btn" onClick={handleConfirm}>
              OK
            </button>
          </>
        </motion.div>
      )}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="error-alert"
        >
          <div
            className="message"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
          <button
            className="error-confirm-btn"
            onClick={() => setErrorMessage("")}
          >
            OK
          </button>
        </motion.div>
      )}
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-columns">
          {/* LEFT COLUMN – USERNAME */}
          <div className="settings-column">
            <h3>Username</h3>
            <label className="current-username">Current username:   {resultData.name}</label>

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
            /></div>

          {/* RIGHT COLUMN – PASSWORDS */}
          <div className="settings-column">
            <h3>Password</h3>

            <label>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              placeholder="Enter old password"
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <label>New Password:</label>
            <input
              type="password"
              value={newpassword}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmpassword}
              placeholder="Enter new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
export default Account;
