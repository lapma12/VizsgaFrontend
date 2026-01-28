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
import axios from "axios";


function Navbar({ loginIn, setloginIn }) {
  const navRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [getname, setGetName] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [picture, setPicture] = useState("")
  const navigate = useNavigate();


  let id = localStorage.getItem("USERID");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = (e) => {
    e.preventDefault();
    setloginIn(false)
    setIsOpen(false);
    navigate('/login');
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
    if (id !== undefined && id !== null) {
      const GetNameById = async () => {
        try {
          const response = await axios.get(`https://dongesz.com/api/Users/${id}`);
          setGetName(response.data);
          setPicture(response.data.result.profilePictureUrl);

        } catch (error) {
          console.error(error);
        }
      };
      GetNameById();
    }
  }, [id]);

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
        {loginIn && id ? (
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
          {loginIn && id ? (
            <NavLink
              to={`/account/${id}`}
              className="loginIn-btn"
              onClick={closeNavbar}
            >
              Account: {getname?.success ? getname.result.name : ""}
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
          {loginIn && id ? (
            <div className="relative">
              <img src={picture} alt="Avatar" title="avatar" className="img_button" onClick={toggleMenu} />
              {isOpen && (
                <div className="dropdownmenu">
                  <div >
                    <NavLink to={`/account/${id}`} className="myaccountMenu">
                      My account
                    </NavLink>
                  </div>
                  <div className="singoutMenu">
                    <button className="singout" onClick={handleLogout}>Sing out</button>
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
