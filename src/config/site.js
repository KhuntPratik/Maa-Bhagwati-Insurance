export const siteConfig = {
  businessName: "Maa Bhagwati Insurance",
  location: "Rajkot, Gujarat, India",
  tagline: "Your Protection, Our Commitment",
  phone: "+91 87807 77688",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "918780777688",
  email: import.meta.env.VITE_CONTACT_EMAIL || "info@maabhagwatiinsurance.in",
  businessHours: "Monday to Saturday: 9:00 AM - 8:00 PM",
  whatsappMessage: "Hello Maa Bhagwati Insurance, I want to get an insurance quotation.",
  googleMapsUrl: "https://maps.google.com/?q=Rajkot%20Gujarat%20India",
};

export function buildWhatsAppLink(message = siteConfig.whatsappMessage) {
  return `https://api.whatsapp.com/send?phone=${siteConfig.whatsappNumber}&text=${encodeURIComponent(message)}`;
}
