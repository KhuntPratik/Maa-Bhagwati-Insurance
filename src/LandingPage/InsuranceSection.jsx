
import "./InsuranceSection.css";

function InsuranceSection({ services, onQuote }) {
    return (
        <section id="services" className="section services-section">
            

                {/* Insurance Section Heading */}
                <div className="insurance-heading">
                    <div>
                        <p className="eyebrow dark">Our Insurance Services</p>

                        <h2>
                            Vehicle insurance made <span>simple and reliable</span>
                        </h2>
                    </div>

                 
                </div>
          

            {/* Insurance Cards */}
            <div className="service-grid">
                {services.map((service) => (
                    <article className="service-card" key={service.title}>
                        <div className="service-icon" aria-hidden="true">
                            {service.icon}
                        </div>

                        <h3>{service.title}</h3>

                        <p>{service.description}</p>

                        <button
                            type="button"
                            className="text-button"
                            onClick={onQuote}
                        >
                            Get Quote →
                        </button>
                    </article>
                ))}
            </div>


        </section>
    );
}

export default InsuranceSection;

