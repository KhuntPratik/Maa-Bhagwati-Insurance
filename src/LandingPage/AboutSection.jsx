import "./AboutSection.css";

function AboutSection() {
  return (
    <section
      id="about"
      className="section about-section"
    >
      <div className="about-box">

        {/* Section Header */}
        <div className="section-copy">
          <p className="eyebrow dark">
            About Us
          </p>

          <h2>
            Maa Bhagwati Insurance
          </h2>
        </div>

        {/* About Description */}
        <p>
          Maa Bhagwati Insurance is a local insurance support business
          serving customers in Rajkot, Gujarat. We focus on clear vehicle
          insurance guidance, smooth renewal assistance, and dependable
          support for policy-related questions. Our goal is to help
          customers make informed decisions and keep their vehicles
          protected with confidence.
        </p>

      </div>
    </section>
  );
}

export default AboutSection;