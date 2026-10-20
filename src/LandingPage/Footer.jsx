import { Link, useLocation } from "react-router-dom";
import { buildWhatsAppLink } from "../config/site";
import "./Footer.css";

function Footer({ siteConfig }) {
  const { pathname } = useLocation();
  const homePrefix = pathname === "/" ? "" : "/";
  return (
    <footer className="site-footer">
      <div className="footer-layout">

        {/* Brand Information */}
        <div>
          <img
            src="/logo1.png"
            alt="Maa Bhagwati Insurance logo"
            className="footer-logo"
          />

          <h3>
            Maa Bhagwati Insurance
          </h3>

          <p>
            {siteConfig.tagline}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4>
            Quick Links
          </h4>

          <ul>
            <li>
              <a href={`${homePrefix}#top`}>Home</a>
            </li>

            <li>
              <a href={`${homePrefix}#about`}>About</a>
            </li>

            <li>
              <a href={`${homePrefix}#services`}>Services</a>
            </li>

            <li>
              <a href={`${homePrefix}#renew-insurance`}>
                Renew Insurance
              </a>
            </li>

            <li>
              <a href={`${homePrefix}#claim-assistance`}>
                Claim Assistance
              </a>
            </li>

            <li>
              <a href={`${homePrefix}#contact`}>Contact</a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4>
            Connect
          </h4>

          <ul>
            <li>
              <a href="tel:+918780777688">
                Phone
              </a>
            </li>

            <li>
              <a
                href={buildWhatsAppLink(
                  siteConfig.whatsappMessage
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>

            <li>
              <a href={`mailto:${siteConfig.email}`}>
                Email
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">

        <Link to="/admin">
          <p>
          © {new Date().getFullYear()} Maa Bhagwati Insurance.
          All rights reserved.
        </p>
        </Link>

       
       
      </div>
    </footer>
  );
}

export default Footer;
