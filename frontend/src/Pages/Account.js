import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../Styles/Account.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  UserCircle,
  Settings as CogIcon,
  BarChart2,
  Trash2,
} from "lucide-react";
import axios from "axios";

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
  const [resultData, setresultData] = useState([]);

  //ture or false
  useEffect(() => {
    setloginIn(true);
  }, [setloginIn]);


  const goToHome = () => {
    navigate("/");
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchAccountPlayerData = async () => {
      if (!id) return; // id ellenőrzés
      try {
        const response = await axios.get(`https://dongesz.com/api/Users/playerResult/${id}`);
        setSuccesssResult(response.data.success);
        setresultData(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccountPlayerData();
  }, [id]);

    const deleteAccount = async () => {
      if (!id) return;
      try {
        const deleteDataResult = await axios.delete(`https://dongesz.com/api/Users/${id}`);
        if (deleteDataResult.data.success) {
          setSuccessMessage(deleteDataResult.data.message);
          setErrorMessage("");
        } else {
          setErrorMessage(deleteDataResult.data.message);
          setSuccessMessage("");
        }

      } catch (err) {
        console.error(err);
        alert("Account deletion failed.");
      }
    };

    return (
      <div className="account-page">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-alert"
            dangerouslySetInnerHTML={{ __html: successMessage }}
          />
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-alert"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
        )}
        <div className="account-header">
          <UserCircle className="account-avatar" size={80} />
          <div className="account-info">
            <h1 className="account-title">
              Welcome,{" "}
              <span className="username">
                {successResult ? resultData.name : ""}
              </span>
            </h1>
            <p className="account-subtitle">Details :</p>
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
          {activeTab === "results" && <Results resultData={resultData} />}
          {activeTab === "settings" && <Settings resultData={resultData} />}
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

  const Results = ({ resultData }) => (
    <div className="results-section">
      <h2>My Results</h2>
      <ul>
        <li>Total Score : {resultData.totalScore}</li>
        <li>Total Xp: {resultData.totalXp}</li>
      </ul>
    </div>
  );

  const Settings = ({ resultData }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();

      const updateData = {
        email: resultData.email,
        oldPassword: oldPassword,
        newPassword: password,
      };

      try {
        const response = await axios.put(
          "https://localhost:7282/api/Users/playerPasswordUpdate",
          updateData
        );
        console.log("Full response:", response);
        if (response.data.success) {
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }

        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.log("Error response:", error.response?.data);
        setErrorMessage("Update filed");
        setSuccessMessage("");
      }
    };

    return (
      <div className="settings-section">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-alert"
            dangerouslySetInnerHTML={{ __html: successMessage }}
          />
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-alert"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
        )}
        <h2>Account Settings</h2>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-columns">
            {/* LEFT COLUMN – USERNAME */}
            <div className="settings-column">
              <h3>Username</h3>
              <label>Current username:</label>
              <p className="current-username">{resultData.name}</p>

              <input
                type="text"
                value={username}
                placeholder="Enter new username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Change your details:</label>
              <textarea className="textBoxforDetils" />
            </div>

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
                value={password}
                placeholder="Enter new password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    );
  };
  export default Account;
