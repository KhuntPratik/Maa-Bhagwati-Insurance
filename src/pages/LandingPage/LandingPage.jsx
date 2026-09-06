import { useEffect, useState } from "react";
import "./LandingPage.css";
import WhatsAppButton from "../../components/WhatsAppButton";
import { buildWhatsAppLink, siteConfig } from "../../config/site";
import Header from "./Header";
import HeroSection from "./HeroSection";
import InsuranceSection from "./InsuranceSection";
import QuoteSection from "./QuoteSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import ProcessSection from "./ProcessSection";
import TrustSection from "./TrustSection";
import RenewalSection from "./RenewalSection";
import ClaimSection from "./ClaimSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

const services = [
  { icon: "🏍️", title: "Two Wheeler Insurance", description: "Affordable protection plans for scooters and bikes, designed for daily commuting and peace of mind." },
  { icon: "🚗", title: "Four Wheeler Insurance", description: "Flexible coverage options for personal cars with support for renewals, updates, and policy assistance." },
  { icon: "🚚", title: "Commercial Vehicle Insurance", description: "Reliable insurance support for business and commercial vehicles used for transport and logistics." },
  { icon: "📄", title: "Third Party Insurance", description: "Essential coverage solutions for legal compliance and basic vehicle protection as required by law." },
  { icon: "🛡️", title: "Comprehensive Insurance", description: "Broader protection with added support for vehicle damage, accident assistance, and policy guidance." },
  { icon: "🔄", title: "Insurance Renewal", description: "Quick and simple policy renewal support to avoid gaps in coverage and keep your vehicle protected." },
  { icon: "📋", title: "Policy Assistance", description: "Helpful guidance on selecting the right vehicle insurance plan based on your needs and usage." },
  { icon: "🧾", title: "Claim Assistance", description: "Step-by-step assistance to understand claim requirements and the documentation needed after an accident." },
];

const whyChooseUs = [
  { icon: "🧩", title: "Multiple Insurance Options", description: "Choose from tailored plans for bikes, cars, and commercial vehicles." },
  { icon: "⚡", title: "Easy Renewal", description: "Renew your policy quickly with a simple and guided process." },
  { icon: "💬", title: "Quick Assistance", description: "Get fast answers from a team that understands insurance requirements." },
  { icon: "🔍", title: "Transparent Process", description: "Clear guidance and straightforward steps without confusion or hidden claims." },
  { icon: "🤝", title: "Customer Support", description: "Friendly support for documentation, renewals, and policy questions." },
  { icon: "🛠️", title: "Claim Guidance", description: "Understand claim steps, required documents, and the insurer review process clearly." },
];

const processSteps = [
  { number: "01", title: "Share Your Requirement", description: "Tell us about your vehicle and the kind of insurance cover you need." },
  { number: "02", title: "Choose the Right Plan", description: "We help compare suitable options and explain the coverage structure in simple terms." },
  { number: "03", title: "Complete Paperwork", description: "Submit the required details and documents for a smooth application process." },
  { number: "04", title: "Get Support", description: "Receive ongoing guidance for renewal, claim questions, and policy assistance." },
];

const initialQuoteState = { customerName: "", mobileNumber: "", vehicleNumber: "", vehicleType: "", insuranceType: "", previousPolicyExpiryDate: "", message: "" };
const initialRenewalState = { customerName: "", mobileNumber: "", vehicleNumber: "", policyExpiryDate: "", vehicleType: "", previousPolicy: "" };

function LandingPage() {
  const [quoteForm, setQuoteForm] = useState(initialQuoteState);
  const [renewalForm, setRenewalForm] = useState(initialRenewalState);
  const [quoteErrors, setQuoteErrors] = useState({});
  const [renewalErrors, setRenewalErrors] = useState({});
  const [renewalSuccess, setRenewalSuccess] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.title = `${siteConfig.businessName} | ${siteConfig.tagline}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `Trusted vehicle insurance support in ${siteConfig.location}. Two wheeler, four wheeler, commercial vehicle, renewal and claim assistance.`);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuoteChange = (event) => {
    const { name, value } = event.target;
    setQuoteForm((previous) => ({ ...previous, [name]: value }));
    setQuoteErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleRenewalChange = (event) => {
    const { name, value, files } = event.target;
    setRenewalForm((previous) => ({ ...previous, [name]: files?.[0] || value }));
    setRenewalErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const validateQuote = () => {
    const errors = {};
    const phone = quoteForm.mobileNumber.replace(/\D/g, "");
    if (!quoteForm.customerName.trim()) errors.customerName = "Customer name is required.";
    if (phone.length !== 10) errors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    if (!quoteForm.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle number is required.";
    if (!quoteForm.vehicleType) errors.vehicleType = "Please select vehicle type.";
    if (!quoteForm.insuranceType) errors.insuranceType = "Please select insurance type.";
    if (!quoteForm.previousPolicyExpiryDate) errors.previousPolicyExpiryDate = "Previous policy expiry date is required.";
    if (!quoteForm.message.trim()) errors.message = "Please share a brief message.";
    return errors;
  };

  const validateRenewal = () => {
    const errors = {};
    const phone = renewalForm.mobileNumber.replace(/\D/g, "");
    if (!renewalForm.customerName.trim()) errors.customerName = "Customer name is required.";
    if (phone.length !== 10) errors.mobileNumber = "Please enter a valid 10-digit mobile number.";
    if (!renewalForm.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle number is required.";
    if (!renewalForm.policyExpiryDate) errors.policyExpiryDate = "Policy expiry date is required.";
    if (!renewalForm.vehicleType) errors.vehicleType = "Please select vehicle type.";
    if (!renewalForm.previousPolicy) errors.previousPolicy = "Please upload the previous policy document.";
    return errors;
  };

  const handleQuoteWhatsApp = () => window.open(buildWhatsAppLink("Hello Maa Bhagwati Insurance, I want to get an insurance quotation."), "_blank", "noopener,noreferrer");

  const handleQuoteSubmit = (event) => {
    event.preventDefault();
    const errors = validateQuote();
    setQuoteErrors(errors);
    if (Object.keys(errors).length) return;
    const message = ["Hello Maa Bhagwati Insurance,", "I want to get an insurance quotation.", "", ...Object.entries(quoteForm).map(([key, value]) => `${key}: ${value}`)].join("\n");
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setQuoteForm(initialQuoteState);
  };

  const handleRenewalSubmit = (event) => {
    event.preventDefault();
    const errors = validateRenewal();
    setRenewalErrors(errors);
    if (Object.keys(errors).length) return;
    setRenewalSuccess(true);
    setRenewalForm(initialRenewalState);
  };

  return (
    <div className="">
      {/* Floating WhatsApp Button */}
      <WhatsAppButton className="whatsapp-float" />

      {/* Header / Navigation */}
      <Header
        isScrolled={isScrolled}
        siteConfig={siteConfig}
      />

      {/* Main Content */}
      <main id="top">
        {/* Hero Section */}
        <HeroSection
          siteConfig={siteConfig}
        />

        {/* Insurance Services Section */}
        <InsuranceSection
          services={services}
          onQuote={handleQuoteWhatsApp}
        />

        {/* Quote Section */}
        <QuoteSection
          quoteForm={quoteForm}
          quoteErrors={quoteErrors}
          onChange={handleQuoteChange}
          onSubmit={handleQuoteSubmit}
          onWhatsApp={handleQuoteWhatsApp}
        />

        {/* Why Choose Us Section */}
        <WhyChooseUsSection
          items={whyChooseUs}
        />

        {/* Process Section */}
        <ProcessSection
          steps={processSteps}
        />

        {/* Trust Section */}
        <TrustSection />

        {/* Renewal Section */}
        <RenewalSection
          renewalForm={renewalForm}
          renewalErrors={renewalErrors}
          renewalSuccess={renewalSuccess}
          onChange={handleRenewalChange}
          onSubmit={handleRenewalSubmit}
        />

        {/* Claim Section */}
        <ClaimSection />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection
          siteConfig={siteConfig}
        />
      </main>

      {/* Footer */}
      <Footer
        siteConfig={siteConfig}
      />
    </div>
  );
}

  export default LandingPage;
