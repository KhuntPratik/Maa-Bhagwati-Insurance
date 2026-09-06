import { buildWhatsAppLink } from "../../config/site";
import "./ContactSection.css";

function ContactSection({ siteConfig }) {
  return <section id="contact" className="section contact-section"><div className="container contact-layout"><div className="section-copy"><p className="eyebrow dark">Contact</p><h2>Speak with our team</h2></div><div className="contact-card"><div className="contact-item"><span>🏢</span><div><strong>Maa Bhagwati Insurance</strong><p>{siteConfig.location}</p></div></div><div className="contact-item"><span>📞</span><div><strong>Phone</strong><p><a href="tel:+918780777688">{siteConfig.phone}</a></p></div></div><div className="contact-item"><span>💬</span><div><strong>WhatsApp</strong><p><a href={buildWhatsAppLink(siteConfig.whatsappMessage)} target="_blank" rel="noopener noreferrer">Chat with us</a></p></div></div><div className="contact-item"><span>✉️</span><div><strong>Email</strong><p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p></div></div><div className="contact-item"><span>🕒</span><div><strong>Business Hours</strong><p>{siteConfig.businessHours}</p></div></div><div className="contact-actions"><a href={siteConfig.googleMapsUrl} className="primary-button" target="_blank" rel="noopener noreferrer">Google Maps</a><a href={buildWhatsAppLink(siteConfig.whatsappMessage)} className="secondary-button" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></div></section>;
}

export default ContactSection;
