import React, { useState, useEffect } from "react";
import "./Home.css";

const CORRECT_PIN = "9825";

const initialState = {
  vehicleNo: "",
  vehicleName: "",
  customerName: "",
  mobile: "",
  insuranceType: "",
  vehicleType: "",
  company: "",
  broker: "",
  premium: "",
  commission: "",
  paid: false,
  paidAmount: "",
};

function Home() {
  const [formData, setFormData] = useState(initialState);
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const scriptURL = import.meta.env.VITE_SCRIPT_URL;

  // =========================
  // CHECK AUTHORIZATION
  // =========================
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthorized(
        localStorage.getItem("isAuthorized") === "true"
      );
    };

    checkAuth();

    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  // =========================
  // PIN
  // =========================
  const handlePinSubmit = (e) => {
    e.preventDefault();

    if (pin === CORRECT_PIN) {
      localStorage.setItem("isAuthorized", "true");
      setIsAuthorized(true);
      setPin("");

      window.dispatchEvent(new Event("authChange"));
    } else {
      alert("Wrong PIN ❌");
    }
  };

  // =========================
  // NORMAL INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // MOBILE NUMBER
  // =========================
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // If user pastes +91XXXXXXXXXX
    if (value.length > 10 && value.startsWith("91")) {
      value = value.substring(2);
    }

    // Maximum 10 digits
    value = value.slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      mobile: value,
    }));
  };

  // =========================
  // VEHICLE NUMBER
  // =========================
  const handleVehicleNoChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/\s/g, "");

    setFormData((prev) => ({
      ...prev,
      vehicleNo: value,
    }));
  };

  // =========================
  // VEHICLE NAME
  // =========================
  const handleVehicleNameChange = (e) => {
    const value = e.target.value
      .toLowerCase()
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

    setFormData((prev) => ({
      ...prev,
      vehicleName: value,
    }));
  };

  // =========================
  // CUSTOMER / COMPANY / BROKER
  // =========================
  const handleCapitalCaseChange = (e) => {
    const { name } = e.target;

    const value = e.target.value
      .toLowerCase()
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scriptURL) {
      alert(
        "Google Apps Script URL is missing ❌\n\n" +
        "Check VITE_SCRIPT_URL in .env"
      );
      return;
    }

    const mobile = formData.mobile.replace(/\D/g, "");

    // Validate mobile
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert(
        "Please enter a valid 10-digit Indian mobile number ❌\n\n" +
        "Example: 9876543210"
      );
      return;
    }

    // Validate paid amount
    if (
      formData.paid === false &&
      (!formData.paidAmount ||
        Number(formData.paidAmount) <= 0)
    ) {
      alert("Please enter Paid Amount when Unpaid is selected ❌");
      return;
    }

    try {
      setIsSaving(true);

      const dataToSend = {
        ...formData,
        paid: formData.paid ? "true" : "false",
        paidAmount: formData.paidAmount,
        mobile: `+91${mobile}`,
      };

      console.log("Sending data:", dataToSend);

      const formBody = new URLSearchParams(
        dataToSend
      ).toString();

      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody,
      });

      // no-cors response cannot be read
      alert("Policy request sent successfully ✅");

      setFormData(initialState);
    } catch (error) {
      console.error("Submit Error:", error);

      alert(
        "Request could not be sent ❌\n\n" +
        "Please check your internet connection and Apps Script URL."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =========================
  // PIN SCREEN
  // =========================
  if (!isAuthorized) {
    return (
      <div className="container">
        <div className="card">
          <h2>🔐 Secure Access</h2>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
            />

            <button type="submit">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // FORM FIELDS
  // =========================
  const formFields = Object.keys(formData);

  const fieldsPerRow = 2;

  const rows = [];

  for (
    let i = 0;
    i < formFields.length;
    i += fieldsPerRow
  ) {
    rows.push(
      formFields.slice(i, i + fieldsPerRow)
    );
  }

  // =========================
  // FORM UI
  // =========================
  return (
    <div className="container">
      <div className="card large">

        <h2>🚗 Insurance Entry Form</h2>

        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >

          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="form-row"
            >

              {row.map((key) => (
                <div
                  key={key}
                  className="form-col"
                >

                  {/* =========================
                     MOBILE
                  ========================= */}
                  {key === "mobile" ? (
                    <>
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleMobileChange}
                        placeholder="9876543210"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        required
                      />

                      <small>
                        {formData.mobile.length}/10 digits
                      </small>
                    </>
                  )

                    /* =========================
                       VEHICLE NUMBER
                    ========================= */
                    : key === "vehicleNo" ? (
                      <input
                        name="vehicleNo"
                        value={formData.vehicleNo}
                        onChange={handleVehicleNoChange}
                        placeholder="Vehicle No (Ex: GJ03CF1234)"
                        type="text"
                        required
                      />
                    )

                      /* =========================
                         VEHICLE NAME
                      ========================= */
                      : key === "vehicleName" ? (
                        <input
                          name="vehicleName"
                          value={formData.vehicleName}
                          onChange={handleVehicleNameChange}
                          placeholder="Vehicle Name (Ex: Honda City)"
                          type="text"
                          required
                        />
                      )

                        /* =========================
                           INSURANCE TYPE
                        ========================= */
                        : key === "insuranceType" ? (
                          <select
                            name="insuranceType"
                            value={formData.insuranceType}
                            onChange={handleChange}
                            required
                          >
                            <option value="">
                              Select Insurance Type
                            </option>

                            <option value="Third Party">
                              Third Party
                            </option>

                            <option value="Comprehensive">
                              Comprehensive
                            </option>
                          </select>
                        )

                          /* =========================
                             VEHICLE TYPE
                          ========================= */
                          : key === "vehicleType" ? (
                            <select
                              name="vehicleType"
                              value={formData.vehicleType}
                              onChange={handleChange}
                              required
                            >
                              <option value="">
                                Select Vehicle Type
                              </option>

                              <option value="Car">
                                Car
                              </option>

                              <option value="Two Wheeler">
                                Two Wheeler
                              </option>

                              <option value="Commercial">
                                Commercial
                              </option>
                            </select>
                          )

                            /* =========================
                               CUSTOMER / COMPANY / BROKER
                            ========================= */
                            : key === "customerName" ||
                              key === "company" ||
                              key === "broker" ? (
                              <input
                                name={key}
                                value={formData[key]}
                                onChange={handleCapitalCaseChange}
                                placeholder={key.replace(
                                  /([A-Z])/g,
                                  " $1"
                                )}
                                type="text"
                                required
                              />
                            )

                              /* =========================
                                 PREMIUM / COMMISSION
                              ========================= */
                              : key === "premium" ||
                                key === "commission" ? (
                                <input
                                  name={key}
                                  value={formData[key]}
                                  onChange={handleChange}
                                  placeholder={
                                    key === "premium"
                                      ? "Premium"
                                      : "Commission"
                                  }
                                  type="number"
                                  min="0"
                                  required
                                />
                              )

                                /* =========================
                                   PAYMENT STATUS
                                ========================= */
                                : key === "paid" ? (
                                  <div className="payment-field">

                                    <label className="field-label">
                                      Payment Status
                                    </label>

                                    <div className="radio-group">

                                      <label className="radio-option">
                                        <input
                                          type="radio"
                                          name="paid"
                                          checked={formData.paid === true}
                                          onChange={() =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              paid: true,
                                            }))
                                          }
                                        />

                                        <span>Paid</span>
                                      </label>

                                      <label className="radio-option">
                                        <input
                                          type="radio"
                                          name="paid"
                                          checked={formData.paid === false}
                                          onChange={() =>
                                            setFormData((prev) => ({
                                              ...prev,
                                              paid: false,
                                              paidAmount: "",
                                            }))
                                          }
                                        />

                                        <span>Unpaid</span>
                                      </label>

                                    </div>

                                  </div>
                                )

                                  /* =========================
                                     PAID AMOUNT
                                  ========================= */
                                  : key === "paidAmount" ? (
                                    <input
                                      name="paidAmount"
                                      value={formData.paidAmount}
                                      onChange={handleChange}
                                      placeholder="Paid Amount"
                                      type="number"
                                      min="0"
                                      required={formData.paid === false}
                                      disabled={formData.paid === true}
                                    />
                                  )

                                    /* =========================
                                       OTHER
                                    ========================= */
                                    : (
                                      <input
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        placeholder={key.replace(
                                          /([A-Z])/g,
                                          " $1"
                                        )}
                                        type="text"
                                      />
                                    )}

                </div>
              ))}

            </div>
          ))}

          {/* =========================
              SUBMIT BUTTON
          ========================= */}
          <div className="form-row form-row-full">

            <button
              type="submit"
              className="submit-btn"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save Data"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Home;
