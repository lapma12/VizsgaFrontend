import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../Styles/Account.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserCircle,
  Settings as CogIcon,
  BarChart2,
  Trash2,
} from "lucide-react";

const Account = ({ id }) => {
  const location = useLocation();
  if (location.pathname === "/account") {
    document.title = "Account";
  }

  const [activeTab, setActiveTab] = useState("results");
  const navigate = useNavigate();
  const [accountData, setaccountData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const goToHome = (event) => {
    event.preventDefault();
    navigate("/");
  };
  useEffect(() => {
    fetch("https://localhost:7282/api/Users/" + id)
      .then((res) => res.json())
      .then((data) => setaccountData(data))
      .catch((err) => console.error(err));
  }, []);

  const deleteAccount = async () => {
    try {
      await fetch("https://localhost:7282/api/Users/" + id, {
        method: "DELETE",
      });
      console.log("DELETE is used");
      setSuccessMessage("Successfully delete");
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
      <div className="account-header">
        <UserCircle className="account-avatar" size={80} />
        <div className="account-info">
          <h1 className="account-title">
            Welcome, <span className="username">{accountData.name}</span>
          </h1>
          <p className="account-subtitle">
            Your personal account settings and results
          </p>
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
        {activeTab === "results" && <Results accountData={accountData} />}
        {activeTab === "settings" && <Settings accountData={accountData} />}
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

const Results = ({ accountData }) => (
  <div className="results-section">
    <h2>My Results</h2>
    <ul>
      <li>{accountData.userType}</li>
      <li>{accountData.createdAt}</li>
    </ul>
  </div>
);

const Settings = ({ accountData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Update account:", { username, password });
  };

  return (
    <div className="settings-section">
      <h2>Account Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>New Username: {accountData.name}</label>
        <input
          type="text"
          value={username}
          placeholder="Enter new username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>New Password: {accountData.email}</label>
        <input
          type="password"
          value={password}
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Account;
