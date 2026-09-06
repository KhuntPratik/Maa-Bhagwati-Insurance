import { buildWhatsAppLink } from "../../config/site";
import "./Footer.css";

function Footer({ siteConfig }) {
  return <footer className="site-footer"><div className="container footer-layout"><div><img src="/logo.svg" alt="Maa Bhagwati Insurance logo" className="footer-logo" /><h3>Maa Bhagwati Insurance</h3><p>{siteConfig.tagline}</p></div><div><h4>Quick Links</h4><ul><li><a href="#top">Home</a></li><li><a href="#about">About</a></li><li><a href="#services">Services</a></li><li><a href="#renew-insurance">Renew Insurance</a></li><li><a href="#claim-assistance">Claim Assistance</a></li><li><a href="#contact">Contact</a></li></ul></div><div><h4>Connect</h4><ul><li><a href="tel:+918780777688">Phone</a></li><li><a href={buildWhatsAppLink(siteConfig.whatsappMessage)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li><li><a href={`mailto:${siteConfig.email}`}>Email</a></li></ul></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Maa Bhagwati Insurance. All rights reserved.</p></div></footer>;
}

export default Footer;
