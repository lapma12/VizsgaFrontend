import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Home from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import About from "./Pages/AboutPage";
import Scoreboard from "./Pages/ScoreBoardPage";
import NotFound from "./Pages/NotFound";
import Game from "./Pages/GamePage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import Account from "./Pages/Account";
import { useState } from "react";
import PrivacyPolicy from "./Pages/Services/Privacypolicy";
import Terms from "./Pages/Services/Terms";
import FAQ from "./Pages/Services/FAQ";

function App() {
  //const [id, setId] = useState();
  const [loginIn, setloginIn] = useState(false);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar loginIn={loginIn} setloginIn={setloginIn}/>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/scoreboard" element={<Scoreboard/>} />
            <Route path="/game" element={<Game />} />
            <Route path="/account" element={<Account setloginIn={setloginIn}/>}/>
            <Route path="/account/:id" element={<Account setloginIn={setloginIn} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
            <Route path="/terms" element={<Terms/>}/>
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
