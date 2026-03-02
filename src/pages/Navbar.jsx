import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(
    localStorage.getItem("isAuthorized") === "true"
  );

  useEffect(() => {
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
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthorized");
    setIsAuthorized(false);
    // notify other components in the same window
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">
          Maa Bhagwati Insurance
        </Link>
      </div>

      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          Dashboard
        </Link>
        <Link to="/policies" onClick={() => setMenuOpen(false)}>
          Policies
        </Link>
        {isAuthorized ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="logout-btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;