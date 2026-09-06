import { buildWhatsAppLink, siteConfig } from "../config/site";

function WhatsAppButton({ className = "whatsapp-float", label = "WhatsApp" }) {
  return (
    <a
      href={buildWhatsAppLink(siteConfig.whatsappMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Contact Maa Bhagwati Insurance on WhatsApp"
      title="Contact on WhatsApp"
    >
      {label === "WhatsApp" ? (
        <span className="whatsapp-icon" aria-hidden="true">💬</span>
      ) : (
        label
      )}
    </a>
  );
}

export default WhatsAppButton;
