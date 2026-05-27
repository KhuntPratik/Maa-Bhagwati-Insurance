import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(
    localStorage.getItem("isAuthorized") === "true"
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const handleStorage = (e) => {
      if (e.key === "isAuthorized") {
        setIsAuthorized(e.newValue === "true");
      }
    };
    const handleAuthChange = () => {
      setIsAuthorized(localStorage.getItem("isAuthorized") === "true");
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleAuthChange);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthorized");
    setIsAuthorized(false);
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

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="logo">
          <Link to="/" className="logo-link" onClick={handleNavClick}>
            <span className="logo-icon">🛡️</span>
            Maa Bhagwati Insurance
          </Link>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={handleNavClick}>
            Home
          </Link>
          <Link to="/home" onClick={handleNavClick}>
            Quote
          </Link>
          <Link to="/policies" onClick={handleNavClick}>
            Policies
          </Link>
          {isAuthorized && (
            <Link to="/dashboard" onClick={handleNavClick}>
              Dashboard
            </Link>
          )}
          {isAuthorized ? (
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="nav-btn login-btn" onClick={() => {
              navigate("/home");
              setMenuOpen(false);
            }}>
              Login
            </button>
          )}
        </div>

        <a 
          href="https://api.whatsapp.com/send?phone=918780777688"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-whatsapp"
        >
          WhatsApp
        </a>
      </div>
    </nav>
  );
}

export default Navbar;