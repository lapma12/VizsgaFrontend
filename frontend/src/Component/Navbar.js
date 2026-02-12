import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineFacebook } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { BsTable } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { IoLogoGameControllerB } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";
import { motion } from "framer-motion";

import "../Styles/Navbar.css";
import api from "../api/api";


function Navbar({ loginIn, setloginIn, userDataState, showAdminpanel, setshowAdminPanel }) {
  const navRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [successResult, setSuccesssResult] = useState(false);
  const [resultData, setresultData] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [picture, setPicture] = useState("")

  // ALERTS
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);

  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogoutClick = () => {
    setConfirmMessage("Do you want to Log out!");
    setOnConfirm(() => handleLogout);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setloginIn(false);
    setIsOpen(false);
    setshowAdminPanel(false);
    setConfirmMessage("");
    navigate("/login");
  };


  const toggleNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
    setMenuOpen((prev) => !prev);
  };

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
    setMenuOpen(false);
  };
  const [, setuserDataState2] = useState(null)

  useEffect(() => {
    const fetchMe = async () => {
      if (!localStorage.getItem("authToken")) {
        setloginIn(false);
        return;
      }
      try {
        const res = await api.get("https://dongesz.com/api/Users/me/result");
        setSuccesssResult(true);
        setresultData(res.data.result);
        setPicture(res.data.result.profilePictureUrl);
        setloginIn(true);
      } catch {
        setloginIn(false);
        navigate("/login");
      }
    };

    fetchMe();
    setuserDataState2(userDataState)
  }, [navigate, setloginIn, userDataState]);

  return (
    <header className="navbar">
      {confirmMessage && (
        <motion.div
          className="confirm-alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>{confirmMessage}</div>

          <div className="confirm-buttons">
            <button
              className="confirm-ok-btn"
              onClick={() => {
                if (onConfirm) onConfirm();
              }}
            >
              OK
            </button>

            <button
              className="confirm-cancel-btn"
              onClick={() => setConfirmMessage("")}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}


      <div className="navbar-left">
        <button onClick={() => window.open("https://www.instagram.com", "_blank")}>
          <FaInstagram />
        </button>
        <button onClick={() => window.open("https://www.facebook.com", "_blank")}>
          <AiOutlineFacebook />
        </button>
        <button onClick={() => window.open("https://twitter.com", "_blank")}>
          <RiTwitterXFill />
        </button>
      </div>

      <nav ref={navRef} className="navbar-center">
        <NavLink to="/" onClick={closeNavbar}>
          <span className="icon">
            <IoMdHome />
          </span>
          Home
        </NavLink>
        <NavLink to="/about" onClick={closeNavbar}>
          <span className="icon">
            <FaRegMessage />
          </span>
          About
        </NavLink>
        <NavLink to="/scoreboard" onClick={closeNavbar}>
          <span className="icon">
            <BsTable />
          </span>
          Scoreboard
        </NavLink>
        <NavLink to="/game" onClick={closeNavbar}>
          <span className="icon">
            <IoLogoGameControllerB />
          </span>
          Game
        </NavLink>
        {showAdminpanel ? (
          <NavLink to="/admin" onClick={closeNavbar}>
            <span className="icon">
              <IoMdSettings />
            </span>
            AdminPanel
          </NavLink>
        ) : ("")}
        <div className="nav-search-mobile">
          {loginIn ? (
            <NavLink
              to="/account"
              className="loginIn-btn"
              onClick={closeNavbar}
            >
              Account{successResult ? `: ${resultData.name}` : ""}
            </NavLink>
          ) : (
            <NavLink to="/login" className="loginIn-btn">
              Sing In
            </NavLink>
          )}
        </div>

        <button className="nav-toggle-btn" onClick={toggleNavbar}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      <div className="navbar-right">
        <>
          {loginIn ? (
            <div className="relative">
              <img
                src={picture}
                alt="Avatar"
                title="avatar"
                className="img_button"
                onClick={toggleMenu}
              />

              {isOpen && (
                <div className="dropdownmenu">
                  <div>
                    <NavLink
                      to="/account"
                      className="myaccountMenu"
                      onClick={() => setIsOpen(false)}
                    >
                      My account
                    </NavLink>
                  </div>
                  <div className="singoutMenu">
                    <button
                      className="singout"
                      onClick={() => {
                        handleLogoutClick();
                        setIsOpen(false);
                      }}

                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="signin" onClick={closeNavbar}>
              <span className="icon">
                <MdAccountCircle />
              </span>
              Sign In
            </NavLink>
          )}
        </>

        <button className="nav-toggle-btn" onClick={toggleNavbar}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
