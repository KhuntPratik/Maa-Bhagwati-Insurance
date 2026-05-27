import React, { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage() {
    const [formData, setFormData] = useState({
        vehicleNumber: "",
        mobileNumber: "",
        vehicleType: "",
        insuranceType: "",
    });

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

  const handleFormSubmit = (e) => {
  e.preventDefault();

  const message = `
🚘 *Insurance Quote Request*

👤 Customer Details:
📱 Mobile: ${formData.mobileNumber}

🚗 Vehicle Details:
🔹 Vehicle Number: ${formData.vehicleNumber}
🔹 Vehicle Type: ${formData.vehicleType}
🔹 Insurance Type: ${formData.insuranceType}

Please share the insurance quote details.
Thank you 🙏
`;

  const whatsappLink = `https://api.whatsapp.com/send?phone=918780777688&text=${encodeURIComponent(message)}`;

  window.open(whatsappLink, "_blank");
};

    const services = [
        {
            icon: "🏍️",
            title: "Two Wheeler Insurance",
            description: "Comprehensive coverage for bikes and scooters with affordable premiums",
        },
        {
            icon: "🚗",
            title: "Four Wheeler Insurance",
            description: "Protection for cars with flexible plans and quick claim settlement",
        },
        {
            icon: "🚚",
            title: "Commercial Vehicle Insurance",
            description: "Dedicated coverage for commercial vehicles and fleet insurance",
        },
    ];

    const features = [
        { icon: "⚡", title: "Fast Service", description: "Get quotes in minutes" },
        { icon: "💰", title: "Lowest Premium", description: "Best rates guaranteed" },
        { icon: "🛡️", title: "Trusted Support", description: "24/7 customer support" },
        {
            icon: "📋",
            title: "Quick Claim Assistance",
            description: "Hassle-free claims process",
        },
    ];

    const reviews = [
        {
            name: "Rajesh Kumar",
            text: "Best insurance company! Quick claim settlement and excellent support.",
            rating: 5,
        },
        {
            name: "Priya Singh",
            text: "Very affordable premiums and their customer service is outstanding.",
            rating: 5,
        },
        {
            name: "Amit Patel",
            text: "Highly recommended! Got my policy done in just 10 minutes.",
            rating: 5,
        },
    ];

    const faqs = [
        {
            question: "How quickly can I get an insurance quote?",
            answer:
                "You can get an instant quote in just 2-3 minutes by filling our quote form or contacting us on WhatsApp.",
        },
        {
            question: "What documents are required for vehicle insurance?",
            answer:
                "You'll need your vehicle registration, driver's license, and previous insurance documents (if any).",
        },
        {
            question: "How do I file a claim?",
            answer:
                "Contact us immediately on WhatsApp at 8780777688 with photos of the damage and we'll guide you through the process.",
        },
        {
            question: "Are there any hidden charges?",
            answer:
                "No hidden charges! We believe in complete transparency. All costs are clearly mentioned upfront.",
        },
    ];

    const [expandedFaq, setExpandedFaq] = useState(null);

    return (
        <div className="landing-page">
            {/* Floating WhatsApp Button */}
            <a
                href="https://api.whatsapp.com/send?phone=918780777688&text=Hello%20Maa%20Bhagwati%20Insurance"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-float"
                title="Contact on WhatsApp"
            >
                <span className="whatsapp-icon">💬</span>
            </a>

            {/* Navigation */}
            <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
                <div className="nav-container">
                    <div className="logo">
                        <h2>Maa Bhagwati Insurance</h2>
                    </div>
                    <div className="nav-links">
                        <a href="#services">Services</a>
                        <a href="#quote">Get Quote</a>
                        <a href="#why-us">Why Us</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <a
                        href="https://api.whatsapp.com/send?phone=918780777688"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-whatsapp"
                    >
                        WhatsApp
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Protect Your Vehicle With Trusted Insurance</h1>
                    <p className="hero-subtitle">
                        Two Wheeler, Four Wheeler & Commercial Vehicle Insurance
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary" onClick={() => document.getElementById("quote-form").scrollIntoView({ behavior: "smooth" })}>
                            Get Instant Quote
                        </button>
                        <a
                            href="https://api.whatsapp.com/send?phone=918780777688&text=Hello%20Maa%20Bhagwati%20Insurance%20I%20need%20to%20know%20about%20vehicle%20insurance"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            Contact on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="services-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Our Services</h2>
                        <p>Comprehensive insurance solutions for all your vehicle needs</p>
                    </div>
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card glass-card">
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                                <a
                                    href="https://api.whatsapp.com/send?phone=918780777688"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="service-link"
                                >
                                    Learn More →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Insurance Quote Form */}
            <section id="quote" className="quote-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Get Your Insurance Quote</h2>
                        <p>Fill in your details to get an instant quote</p>
                    </div>
                    <form id="quote-form" className="quote-form glass-card" onSubmit={handleFormSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="vehicleNumber">Vehicle Number</label>
                                <input
                                    type="text"
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    placeholder="e.g., GJ03MA2202"
                                    value={formData.vehicleNumber}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .toUpperCase()
                                            .replace(/[^A-Z0-9]/g, "");

                                        setFormData((prev) => ({
                                            ...prev,
                                            vehicleNumber: value,
                                        }));
                                    }}
                                    maxLength={10}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobileNumber">Mobile Number</label>
                                <input
                                    type="tel"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    placeholder="e.g., 9876543210"
                                    value={formData.mobileNumber}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Two Wheeler">Two Wheeler</option>
                                    <option value="Four Wheeler">Four Wheeler</option>
                                    <option value="Commercial Vehicle">Commercial Vehicle</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="insuranceType">Insurance Type</label>
                                <select
                                    id="insuranceType"
                                    name="insuranceType"
                                    value={formData.insuranceType}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Select Insurance Type</option>
                                    <option value="Third Party">Third Party</option>
                                    <option value="Comprehensive">Comprehensive</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-large">
                            Get Quote on WhatsApp
                        </button>
                    </form>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="why-us" className="why-us-section">
                <div className="section-container">
                    <div className="section-header white">
                        <h2>Why Choose Maa Bhagwati Insurance</h2>
                        <p>We are committed to providing the best insurance experience</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card glass-card white-text">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="reviews-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Customer Reviews</h2>
                        <p>Trusted by thousands of happy customers</p>
                    </div>
                    <div className="reviews-grid">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-card glass-card">
                                <div className="stars">
                                    {Array(review.rating)
                                        .fill(0)
                                        .map((_, i) => (
                                            <span key={i} className="star">⭐</span>
                                        ))}
                                </div>
                                <p className="review-text">"{review.text}"</p>
                                <p className="review-author">- {review.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Frequently Asked Questions</h2>
                        <p>Find answers to common questions about our insurance products</p>
                    </div>
                    <div className="faq-container">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item glass-card">
                                <button
                                    className="faq-question"
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <span className={`faq-icon ${expandedFaq === index ? "open" : ""}`}>
                                        ▼
                                    </span>
                                </button>
                                {expandedFaq === index && <div className="faq-answer">{faq.answer}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="section-container">
                    <div className="section-header white">
                        <h2>Get in Touch</h2>
                        <p>We're here to help you 24/7</p>
                    </div>
                    <div className="contact-content">
                        <div className="contact-info glass-card white-text">
                            <h3>Maa Bhagwati Insurance</h3>
                            <p className="contact-detail">
                                <span className="icon">📱</span>
                                <a href="tel:8780777688">8780777688</a>
                            </p>
                            <p className="contact-detail text-white">
                                <span className="icon">💬</span>
                                <a
                                    href="https://api.whatsapp.com/send?phone=918780777688"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Contact on WhatsApp
                                </a>
                            </p>
                            <p className="contact-detail">
                                <span className="icon">🕐</span>
                                Available 24/7
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="section-container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Maa Bhagwati Insurance</h3>
                            <p>Your trusted partner in vehicle insurance protection</p>
                        </div>
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li>
                                    <a href="#services">Services</a>
                                </li>
                                <li>
                                    <a href="#why-us">Why Us</a>
                                </li>
                                <li>
                                    <a href="#contact">Contact</a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Contact</h4>
                            <p>Phone: 8780777688</p>
                            <p>Available 24/7</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 Maa Bhagwati Insurance. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
