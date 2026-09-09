import { buildWhatsAppLink } from "../config/site";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ isScrolled, siteConfig }) {
  return (
    <header
      className={`site-header ${isScrolled ? "scrolled" : ""}`}
    >
      <div className="container nav-container">

        {/* Brand */}
        <a
          href="#top"
          className="brand"
          aria-label="Maa Bhagwati Insurance home"
          title="Maa Bhagwati Insurance"
        >
          <img
            src="/logo nav.png"
            alt="Maa Bhagwati Insurance logo"
            className="brand-logo"
          />

          <div>
            <span className="brand-name">
              Maa Bhagwati Insurance
            </span>

            <small>
              {siteConfig.location}
            </small>
          </div>
        </a>

        {/* Navigation */}
        <nav
          className="main-nav"
          aria-label="Main navigation"
        >
          <a href="#top">Home</a>

          <a href="#services">Services</a>

          <a href="#about">About</a>

          <a href="#renew-insurance">
            Renew Insurance
          </a>

          <a href="#claim-assistance">
            Claim Assistance
          </a>

          <a href="#contact">Contact</a>
        </nav>

        

        {/* WhatsApp Button */}
        <a
          href={buildWhatsAppLink(
            siteConfig.whatsappMessage
          )}
          className="primary-button nav-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>

      </div>
    </header>
  );
}

export default Header;