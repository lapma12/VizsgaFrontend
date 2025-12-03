import { useState } from "react";
import "../Styles/Account.css";
import { useLocation, useNavigate } from "react-router-dom";
import { UserCircle, Settings as CogIcon, BarChart2, Trash2 } from "lucide-react";

const Account = () => {
  const location = useLocation()
  if (location.pathname == "/account") {
    document.title = "Account"
  }

  const [activeTab, setActiveTab] = useState("results");
  const navigate = useNavigate();

  const goToHome = (event) => {
    event.preventDefault();
    navigate("/");
  };

  const deleteAccount = () => {
    if (window.confirm("Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem visszavonható.")) {
      console.log("Account deleted");
      // TODO: API hívás ide jön majd
      navigate("/");
    }
  };

  return (
    <div className="account-page">
      <div className="account-header">
        <UserCircle className="account-avatar" size={80} />
        <div className="account-info">
          <h1 className="account-title">Welcome, <span className="username">Player123</span></h1>
          <p className="account-subtitle">Your personal account settings and results</p>
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
        {activeTab === "results" && <Results />}
        {activeTab === "settings" && <Settings />}
      </div>

      <div className="account-footer">
        <button className="logout-btn" onClick={goToHome}>Log out</button>
        <button className="delete-btn" onClick={deleteAccount}>
          <Trash2 size={18} /> Delete Account
        </button>
      </div>
    </div>
  );
};

const Results = () => (
  <div className="results-section">
    <h2>My Results</h2>
    <ul>
      <li>DATA</li>
      <li>DATA</li>
      <li>DATA</li>
    </ul>
  </div>
);

const Settings = () => {
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
        <label>New Username: username</label>
        <input
          type="text"
          value={username}
          placeholder="Enter new username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>New Password: password</label>
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
