import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineFacebook } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { BsTable } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { IoLogoGameControllerB } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";
import { IoIosLogIn } from "react-icons/io";

import "../Styles/Navbar.css";
import api from "../api/api";


function Navbar({ loginIn, setloginIn }) {
  const navRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [successResult, setSuccesssResult] = useState(false);
  const [resultData, setresultData] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [picture, setPicture] = useState("")
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setloginIn(false);
    setIsOpen(false);
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
  }, [navigate, setloginIn]);

  return (
    <header className="navbar">
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
        {loginIn ? (
          ""
        ) : (
          <NavLink to="/login" onClick={closeNavbar}>
            <span className="icon">
              <MdAccountCircle />
            </span>
            Sign In
          </NavLink>
        )
        }


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
            <NavLink to="/login">
              <button className="loginIn-btn">
                Log In
              </button>
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
                        handleLogout();
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
            <NavLink to="/login">
              <button className="loginIn-btn">
                <IoIosLogIn />
              </button>
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
