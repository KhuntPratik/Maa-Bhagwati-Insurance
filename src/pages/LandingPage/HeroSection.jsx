import { buildWhatsAppLink } from "../../config/site";
import "./HeroSection.css";

function HeroSection({ siteConfig }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
 return (
  <section className="hero-section">
    <div className=" hero-content">
      <div className="hero-copy">
        <p className="eyebrow">
          મહાન ગૌરવ સાથે તમારી સુરક્ષા
        </p>

        <h1>
          <span className="gujarati-title">
            તમારી સુરક્ષા, અમારી પ્રતિબદ્ધતા
          </span>

          <span className="english-title">
            Your Protection, Our Commitment
          </span>
        </h1>

        <p className="hero-description">
          Trusted vehicle insurance guidance for two-wheelers,
          four-wheelers, and commercial vehicles in Rajkot, Gujarat.
          We help you compare options, renew on time, and understand
          claim support clearly.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => scrollTo("quote-form")}
          >
            Get Quote
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => scrollTo("renew-insurance")}
          >
            Renew Insurance
          </button>

          <a
            href={buildWhatsAppLink(siteConfig.whatsappMessage)}
            className="secondary-button whatsapp-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <ul
          className="hero-points"
          aria-label="Business highlights"
        >
          <li>Quick assistance</li>
          <li>Policy guidance</li>
          <li>Claim support</li>
        </ul>
      </div>

      <div className="hero-card">
        <div className="status-badge">
          Trusted insurance support
        </div>

        <h2 className="status-badge-inner">
          Insurance solutions for every journey
        </h2>

        <div className="mini-grid">
          <div>
            <strong>Two Wheeler</strong>
            <span>Bike &amp; scooter cover</span>
          </div>

          <div>
            <strong>Four Wheeler</strong>
            <span>Car insurance plans</span>
          </div>

          <div>
            <strong>Commercial</strong>
            <span>Fleet &amp; vehicle policies</span>
          </div>

          <div>
            <strong>Claims</strong>
            <span>Document guidance</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}

export default HeroSection;
