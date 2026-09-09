import { color } from "framer-motion";
import "./WhyChooseUsSection.css";

function WhyChooseUsSection({ items }) {
 return (
  <section
    id="why-us"
    className="section dark-section"
  >
    <div>

      {/* Section Header */}
      <div className="section-copy">
        <p className="eyebrow">
          Why Choose Us
        </p>

        <h2 className="text-dark">
          Professional support you can trust
        </h2>
      </div>

      {/* Features */}
      <div className="row g-4">
        {items.map((item) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={item.title}
          >
            <article className="feature-card h-100">
              <div
                className="feature-icon"
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.description}
              </p>
            </article>
          </div>
        ))}
      </div>

    </div>
  </section>
);
}

export default WhyChooseUsSection;
