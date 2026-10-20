
import { useState } from "react";
import { buildWhatsAppLink } from "../config/site";
import { useLocation } from "react-router-dom";
import "./Header.css";

function Header({ isScrolled, siteConfig }) {
  const { pathname } = useLocation();
  const homePrefix = pathname === "/" ? "" : "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#top" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about" },
    { label: "Renew Insurance", href: "#renew-insurance" },
    { label: "Claim Assistance", href: "#claim-assistance" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`site-header ${isScrolled ? "scrolled" : ""}`}
    >
      <div className="container nav-container">
        {/* Brand */}
        <a
          href={`${homePrefix}#top`}
          className="brand"
          aria-label="Maa Bhagwati Insurance home"
          onClick={closeMenu}
        >
          <img
            src="/logo nav.png"
            alt="Maa Bhagwati Insurance"
            className="brand-logo"
          />

          <div className="brand-details">
            <span className="brand-name">
              Maa Bhagwati Insurance
            </span>
         
            <small>{siteConfig.location}</small>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="main-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={`${homePrefix}${link.href}`}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* WhatsApp CTA */}
        <a
          href={buildWhatsAppLink(siteConfig.whatsappMessage)}
          className="nav-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
          </svg>
          <span>WhatsApp Us</span>
        </a>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={`${homePrefix}${link.href}`}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}

        <a
          href={buildWhatsAppLink(siteConfig.whatsappMessage)}
          className="mobile-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
          </svg>
          Chat on WhatsApp
        </a>
      </nav>
    </header>
  );
}

export default Header;
