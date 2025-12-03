import { useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { AiOutlineFacebook } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { BsTable } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { IoLogoGameControllerB } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { RiTwitterXFill } from "react-icons/ri";
import "../Styles/Navbar.css";

function Navbar() {
  const navRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
    setMenuOpen((prev) => !prev);
  };

  const closeNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button onClick={() => window.open("https://www.instagram.com", "_blank")}><FaInstagram /></button>
        <button onClick={() => window.open("https://www.facebook.com", "_blank")}><AiOutlineFacebook /></button>
        <button onClick={() => window.open("https://twitter.com", "_blank")}><RiTwitterXFill /></button>
      </div>

      <nav ref={navRef} className="navbar-center">
        <NavLink to="/" onClick={closeNavbar}><span className="icon"><IoMdHome /></span>Home</NavLink>
        <NavLink to="/about" onClick={closeNavbar}><span className="icon"><FaRegMessage /></span>About</NavLink>
        <NavLink to="/scoreboard" onClick={closeNavbar}><span className="icon"><BsTable /></span>Scoreboard</NavLink>
        <NavLink to="/game" onClick={closeNavbar}><span className="icon"><IoLogoGameControllerB />
        </span>Game</NavLink>
        <NavLink to="/login" onClick={closeNavbar}><span className="icon"><MdAccountCircle /></span>Sign In</NavLink>
        <div className="nav-search-mobile">
          <button className="search-btn"><IoSearchSharp /></button>
        </div>
      </nav>

      <div className="navbar-right">
        <button className="search-btn desktop-only"><IoSearchSharp /></button>

        <button className="nav-toggle-btn" onClick={toggleNavbar}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
