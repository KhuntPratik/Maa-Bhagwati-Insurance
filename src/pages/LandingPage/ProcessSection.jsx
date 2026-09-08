import "./ProcessSection.css";

function ProcessSection({ steps }) {
  return (
    <section className="section process-section">
      <div>

        {/* Section Header */}
        <div className="section-copy">
          <p className="eyebrow dark">
            Simple Process
          </p>

          <h2>
            How we make insurance support easy
          </h2>
        </div>

        {/* Process Steps */}
        <div className="row g-4 mt-2">
          {steps.map((step) => (
            <div
              className="col-12 col-md-6 col-xl-3"
              key={step.number}
            >
              <div className="process-card h-100">
                <span className="step-number">
                  {step.number}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProcessSection;