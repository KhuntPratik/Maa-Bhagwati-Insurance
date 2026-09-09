import "./QuoteSection.css";

function QuoteSection({ quoteForm, quoteErrors, onChange, onSubmit, onWhatsApp }) {
 return (
  <section
    id="quote-form"
    className="section quote-section"
  >
    <div>
      <div className="row g-4 align-items-start">

        {/* Quote Section Content */}
        <div className="col-12 col-lg-4">
          <div className="section-copy quote-copy">
            <p className="eyebrow dark">
              Get Quote
            </p>

            <h2>
              Request a vehicle insurance quotation
            </h2>

            <p>
              Share your details and our team will guide you
              with the right insurance option for your vehicle.
            </p>
          </div>
        </div>

        {/* Quote Form */}
        <div className="col-12 col-lg-8">
          <form
            className="quote-form"
            onSubmit={onSubmit}
            noValidate
          >
            <div className="row g-3">

              {/* Customer Name */}
              <div className="col-12 col-md-6">
                <label
                  className="form-label"
                  htmlFor="customerName"
                >
                  Customer Name
                </label>

                <input
                  className="form-control"
                  id="customerName"
                  name="customerName"
                  value={quoteForm.customerName}
                  onChange={onChange}
                  placeholder="Enter your name"
                />

                {quoteErrors.customerName && (
                  <span className="error-text">
                    {quoteErrors.customerName}
                  </span>
                )}
              </div>

              {/* Mobile Number */}
              <div className="col-12 col-md-6">
                <label
                  className="form-label"
                  htmlFor="mobileNumber"
                >
                  Mobile Number
                </label>

                <input
                  className="form-control"
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  value={quoteForm.mobileNumber}
                  onChange={onChange}
                  placeholder="98765 43210"
                />

                {quoteErrors.mobileNumber && (
                  <span className="error-text">
                    {quoteErrors.mobileNumber}
                  </span>
                )}
              </div>

              {/* Vehicle Number */}
              <div className="col-12 col-md-6">
                <label
                  className="form-label"
                  htmlFor="vehicleNumber"
                >
                  Vehicle Number
                </label>

                <input
                  className="form-control"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={quoteForm.vehicleNumber}
                  onChange={onChange}
                  placeholder="GJ 01 AB 1234"
                />

                {quoteErrors.vehicleNumber && (
                  <span className="error-text">
                    {quoteErrors.vehicleNumber}
                  </span>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="col-12 col-md-6">
                <label
                  className="form-label"
                  htmlFor="vehicleType"
                >
                  Vehicle Type
                </label>

                <select
                  className="form-select"
                  id="vehicleType"
                  name="vehicleType"
                  value={quoteForm.vehicleType}
                  onChange={onChange}
                >
                  <option value="">
                    Select vehicle type
                  </option>
                  <option>Two Wheeler</option>
                  <option>Four Wheeler</option>
                  <option>Commercial Vehicle</option>
                </select>

                {quoteErrors.vehicleType && (
                  <span className="error-text">
                    {quoteErrors.vehicleType}
                  </span>
                )}
              </div>

              {/* Insurance Type */}
              <div className="col-12 col-md-6">
                <label
                  className="form-label"
                  htmlFor="insuranceType"
                >
                  Insurance Type
                </label>

                <select
                  className="form-select"
                  id="insuranceType"
                  name="insuranceType"
                  value={quoteForm.insuranceType}
                  onChange={onChange}
                >
                  <option value="">
                    Select insurance type
                  </option>
                  <option>Third Party</option>
                  <option>Comprehensive</option>
                  <option>Policy Assistance</option>
                </select>

                {quoteErrors.insuranceType && (
                  <span className="error-text">
                    {quoteErrors.insuranceType}
                  </span>
                )}
              </div>

              {/* Previous Policy Expiry Date */}
              <div className="col-12 col-md-6">
                <label
                  className="form-label"
                  htmlFor="previousPolicyExpiryDate"
                >
                  Previous Policy Expiry Date
                </label>

                <input
                  className="form-control"
                  id="previousPolicyExpiryDate"
                  name="previousPolicyExpiryDate"
                  type="date"
                  value={quoteForm.previousPolicyExpiryDate}
                  onChange={onChange}
                />

                {quoteErrors.previousPolicyExpiryDate && (
                  <span className="error-text">
                    {quoteErrors.previousPolicyExpiryDate}
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="message"
                >
                  Message
                </label>

                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  value={quoteForm.message}
                  onChange={onChange}
                  rows="4"
                  placeholder="Tell us what you need help with"
                />

                {quoteErrors.message && (
                  <span className="error-text">
                    {quoteErrors.message}
                  </span>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex flex-wrap gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-dark"
              >
                Submit
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={onWhatsApp}
              >
                WhatsApp Quote
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
);
}

export default QuoteSection;
