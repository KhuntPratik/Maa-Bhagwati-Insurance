import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthorized");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
    setMenuOpen(false);
  };

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="logo">
          <Link to="/" className="logo-link" onClick={handleNavClick}>
            <span className="logo-icon">🛡️</span>
            Maa Bhagwati Insurance
          </Link>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle admin menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link
            className={isActive("/dashboard") ? "active-link" : ""}
            to="/dashboard"
            onClick={handleNavClick}
          >
            Dashboard
          </Link>
          <Link
            className={isActive("/home") ? "active-link" : ""}
            to="/home"
            onClick={handleNavClick}
          >
            New Entry
          </Link>
          <Link
            className={isActive("/policies") ? "active-link" : ""}
            to="/policies"
            onClick={handleNavClick}
          >
            Policies
          </Link>
          <Link to="/" onClick={handleNavClick}>
            View Website
          </Link>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;