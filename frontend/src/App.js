import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Home from "./Pages/HomePage";
import About from "./Pages/AboutPage";
import NewsPage from "./Pages/NewsPage";
import Scoreboard from "./Pages/ScoreBoardPage";
import NotFound from "./Pages/NotFound";
import Game from "./Pages/GamePage";
import ForgotPasswordPage from "./Component/ForgotPasswordPage";
import Account from "./Pages/Account";
import { useState } from "react";
import PrivacyPolicy from "./Pages/Services/Privacypolicy";
import Terms from "./Pages/Services/Terms";
import FAQ from "./Pages/Services/FAQ";
import AuthPage from "./Pages/AuthPage";
import AdminPage from "./Pages/Services/AdminPage";
import AdminRoute from "./Component/AdminRoute";

function App() {
  const [loginIn, setloginIn] = useState(false);
  //LOGIN PANEL STATE
  const [showAdminpanel, setshowAdminPanel] = useState(false)
  const [userDataState, setuserDataState] = useState(false)
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar loginIn={loginIn} setloginIn={setloginIn} userDataState={userDataState} showAdminpanel={showAdminpanel} setshowAdminPanel={setshowAdminPanel} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage setshowAdminPanel={setshowAdminPanel} />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/game" element={<Game />} />
            <Route path="/account" element={<Account setloginIn={setloginIn} setuserDataState={setuserDataState} showAdminpanel={showAdminpanel} />} />
            <Route path="/admin" element={<AdminRoute> <AdminPage/> </AdminRoute>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
