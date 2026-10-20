import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WhatsAppButton from "../components/WhatsAppButton";
import { siteConfig } from "../config/site";
import { setPageMetadata } from "../utils/pageMetadata";
import Footer from "./Footer";
import Header from "./Header";
import "./TwoWheelerInsurancePage.css";

const whatsappMessage = "Hello Maa Bhagwati Insurance, I want to enquire about two-wheeler insurance in Rajkot.";
const canonicalUrl = "https://maa-bhagwati-insurance.vercel.app/two-wheeler-insurance-rajkot";
const title = "Two-Wheeler Insurance in Rajkot | Maa Bhagwati Insurance";
const description = "Looking for two-wheeler insurance in Rajkot? Contact Maa Bhagwati Insurance for bike insurance enquiries, coverage options and renewal assistance.";

const faqs = [
  {
    question: "What is two-wheeler insurance?",
    answer: "Two-wheeler insurance is a policy for a motorcycle or scooter. Depending on the policy selected, it can cover liability to other people and property, damage to your own vehicle, or both, subject to the policy terms.",
  },
  {
    question: "What is the difference between third-party and comprehensive insurance?",
    answer: "Third-party liability insurance covers specified legal liability for injury, death, or property damage caused to a third party; it does not cover damage to your own bike. A comprehensive or package policy generally combines third-party liability with own-damage cover, subject to exclusions and policy terms. Third-party cover is required for vehicles used on public roads in India.",
  },
  {
    question: "How can I enquire about bike insurance in Rajkot?",
    answer: "Use the WhatsApp enquiry button on this page and share your bike details and the type of cover you want to discuss. The team can help you review available options and their terms.",
  },
  {
    question: "Can I get help with bike insurance renewal?",
    answer: "Yes. Contact Maa Bhagwati Insurance for bike insurance renewal assistance. Keep your existing policy details and renewal date handy so the enquiry can be reviewed.",
  },
  {
    question: "What details are needed to request a quote?",
    answer: "You may be asked for the registration number, make and model, registration year, previous policy details and expiry date, and the cover you are considering. The insurer may request additional information or documents.",
  },
];

function TwoWheelerInsurancePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setPageMetadata({ title, description, canonical: canonicalUrl });
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="two-wheeler-page">
      <WhatsAppButton />
      <Header isScrolled={isScrolled} siteConfig={siteConfig} />

      <main>
        <section className="two-wheeler-hero">
          <div className="two-wheeler-container two-wheeler-hero-content">
            <div className="two-wheeler-hero-copy">
              <p className="eyebrow dark">Two-wheeler insurance</p>
              <h1>Two-Wheeler Insurance in Rajkot</h1>
              <p className="two-wheeler-lead">
                Get help understanding bike insurance options, cover details and renewal steps for your motorcycle or scooter.
              </p>
              <WhatsAppButton
                className="whatsapp-button two-wheeler-hero-cta"
                label="Enquire on WhatsApp"
                message={whatsappMessage}
              />
            </div>
            <div className="two-wheeler-hero-visual" aria-label="Maa Bhagwati Insurance, Rajkot, Gujarat">
              <span className="two-wheeler-visual-label">Insurance guidance for your ride</span>
              <img src="/logo nav.png" alt="Maa Bhagwati Insurance" />
              <span className="two-wheeler-visual-location">Rajkot, Gujarat</span>
            </div>
          </div>
        </section>

        <div className="two-wheeler-container two-wheeler-content">
          <section aria-labelledby="bike-insurance-help">
            <h2 id="bike-insurance-help">Bike insurance assistance in Rajkot</h2>
            <p>
              If you are comparing two-wheeler insurance in Rajkot, Maa Bhagwati Insurance can help you enquire about available cover options and understand the main policy terms. Cover, price, eligibility and final issuance are determined by the insurer and the details of your vehicle and application.
            </p>
          </section>

          <section aria-labelledby="cover-types">
            <h2 id="cover-types">Third-party and comprehensive cover</h2>
            <div className="two-wheeler-card-grid">
              <article className="two-wheeler-card">
                <h3>Third-party liability</h3>
                <p>
                  Third-party liability cover addresses specified legal liability for injury, death or property damage caused to another party. It does not cover damage to your own bike. Third-party insurance is required for vehicles used on public roads in India.
                </p>
              </article>
              <article className="two-wheeler-card">
                <h3>Comprehensive or package cover</h3>
                <p>
                  A comprehensive or package policy generally combines third-party liability with cover for damage to your own insured bike. The exact protection, exclusions, deductibles and add-ons depend on the policy wording, so review those details before choosing.
                </p>
              </article>
            </div>
            <p className="two-wheeler-note">
              Cover descriptions are general. Read the insurer’s policy wording and confirm the applicable terms for your vehicle.
            </p>
          </section>

          <section aria-labelledby="renewal-help">
            <h2 id="renewal-help">Bike insurance renewal assistance</h2>
            <p>
              For bike insurance renewal, keep your current policy and expiry date nearby. You can ask about renewal options, the cover in your existing policy and any information the insurer needs. Review the renewed policy schedule and terms before proceeding.
            </p>
            <Link className="two-wheeler-inline-link" to="/#renew-insurance">
              Visit the vehicle insurance renewal section
            </Link>
          </section>

          <section aria-labelledby="quote-steps">
            <h2 id="quote-steps">How to request a bike insurance quote</h2>
            <ol className="two-wheeler-steps">
              <li>Share your bike’s registration and basic vehicle details.</li>
              <li>Receive the available options for your enquiry.</li>
              <li>Review the coverage, exclusions, deductibles and premium details.</li>
              <li>Proceed with an insurer only if you are satisfied with the terms.</li>
            </ol>
          </section>

          <section aria-labelledby="documents-needed">
            <h2 id="documents-needed">Details and documents you may need</h2>
            <p>Requirements vary by insurer and situation. You may be asked for some of the following:</p>
            <ul className="two-wheeler-document-list">
              <li>Vehicle registration certificate or registration details</li>
              <li>Existing or expired policy details, if applicable</li>
              <li>Vehicle make, model, variant and year of registration</li>
              <li>Contact and identity details requested during the insurer’s process</li>
              <li>Inspection information or photographs, if requested by the insurer</li>
            </ul>
          </section>

          <section aria-labelledby="two-wheeler-faqs">
            <h2 id="two-wheeler-faqs">Frequently asked questions</h2>
            <div className="two-wheeler-faq-list">
              {faqs.map(({ question, answer }) => (
                <article className="two-wheeler-faq" key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="two-wheeler-contact" aria-labelledby="two-wheeler-contact-heading">
            <h2 id="two-wheeler-contact-heading">Enquire about two-wheeler insurance in Rajkot</h2>
            <p>Send your bike details and questions on WhatsApp to discuss insurance options or renewal assistance.</p>
            <WhatsAppButton
              className="whatsapp-button two-wheeler-contact-cta"
              label="Enquire on WhatsApp"
              message={whatsappMessage}
            />
            <p className="two-wheeler-home-link"><Link to="/">Return to the Maa Bhagwati Insurance homepage</Link></p>
          </section>
        </div>
      </main>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}

export default TwoWheelerInsurancePage;
