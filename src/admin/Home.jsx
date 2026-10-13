import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "./Home.css";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

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

  // PDF upload states
  const [pdfFile, setPdfFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

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
      .replace(/\//g, " ")
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
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
  // PDF TEXT EXTRACTION HELPERS
  // =========================
  const findValue = (text, patterns) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (match?.[1]) {
        return match[1].trim();
      }
    }

    return "";
  };

  // =========================
  // PDF UPLOAD AND AUTO-FILL
  // =========================
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate PDF
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please upload a valid PDF file ❌");
      e.target.value = "";
      return;
    }

    // Maximum file size: 15 MB
    if (file.size > 15 * 1024 * 1024) {
      alert("PDF file size must be below 15 MB ❌");
      e.target.value = "";
      return;
    }

    setPdfFile(file);
    setIsExtracting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      let fullText = "";

      // Read text from every PDF page
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item) => item.str || "")
          .join(" ");

        fullText += ` ${pageText}`;
      }

      // Normalize extracted text
      fullText = fullText
        .replace(/\s+/g, " ")
        .replace(/\u00a0/g, " ")
        .trim();

      if (!fullText) {
        alert(
          "No selectable text found in this PDF. " +
            "It may be a scanned PDF."
        );
        return;
      }

      // =========================
      // VEHICLE NUMBER
      // =========================
      const vehicleNo = findValue(fullText, [
        /Registration\s*No\.?\s*[:\-]?\s*([A-Z]{2}\s*\d{1,2}\s*[A-Z]{0,3}\s*\d{1,4})/i,
        /Vehicle\s*Registration\s*(?:Number|No\.?)\s*[:\-]?\s*([A-Z]{2}\s*\d{1,2}\s*[A-Z]{0,3}\s*\d{1,4})/i,
        /Registration\s*Mark\s*[:\-]?\s*([A-Z]{2}\s*\d{1,2}\s*[A-Z]{0,3}\s*\d{1,4})/i,
      ]).replace(/\s+/g, "").toUpperCase();

      // =========================
      // VEHICLE NAME
      // =========================
      let vehicleName = findValue(fullText, [
        /Make\s*\/\s*Model\s*\/\s*Variant\s+(.+?)\s+(?:CC\s*\/\s*KW|Engine|Chassis|Registration)/i,
        /Vehicle\s*Make\s*[:\-]\s*(.+?)\s+(?:Engine|Chassis|Registration)/i,
      ]);

      vehicleName = vehicleName
        .replace(/\//g, " ")
        .replace(/\s+(?:CC|KW|Engine|Chassis|Registration|Policy|No\.?|Address)\b.*$/i, "")
        .replace(/\s+/g, " ")
        .trim();

      // =========================
      // CUSTOMER NAME
      // =========================
      let customerName = findValue(fullText, [
        /Insured Details[\s\S]{0,150}?Name\s+Mr\.?\s*(.+?)\s+Unlock Policy Details/i,
        /Name\s*\(Registered owner of the Motor Vehicle\)\s*:\s*(.+?)\s+\d+\.\s*Vehicle Details/i,
        /Name\s*of\s*(?:the\s*)?Insured\s*[:\-]\s*(.+?)\s+(?:Address|Policy|Mobile|Contact)/i,
        /Insured\s*Name\s*[:\-]\s*(.+?)\s+(?:Address|Policy|Mobile|Contact)/i,
      ]);

      customerName = customerName
        .replace(/^Mr\.?\s*/i, "")
        .replace(/^Mrs\.?\s*/i, "")
        .replace(/^Ms\.?\s*/i, "")
        .replace(/\s+(?:Address|Policy|Mobile|Contact|Phone|Email|Vehicle|Engine|Chassis|Registration)\b.*$/i, "")
        .replace(/\s+/g, " ")
        .trim();

      // =========================
      // POLICY NUMBER
      // Extracted for reference.
      // Current form does not contain a policy-number field.
      // =========================
      const policyNumber = findValue(fullText, [
        /Policy\s*(?:No\.?|Number)\s*[:\-]?\s*([A-Z0-9/-]{5,})/i,
      ]);

      // =========================
      // PREMIUM
      // =========================
      const premium = findValue(fullText, [
        /Premium Amount \(Including GST\)\s*₹?\s*([\d,]+(?:\.\d{2})?)/i,
        /Total Premium\s*[:\-]?\s*₹?\s*([\d,]+(?:\.\d{2})?)/i,
        /Net Premium\s*[:\-]?\s*₹?\s*([\d,]+(?:\.\d{2})?)/i,
      ]).replace(/,/g, "");

      // =========================
      // INSURANCE COMPANY
      // =========================
      let company = "";

      if (/TATA\s*AIG/i.test(fullText)) {
        company = "TATA AIG";
      } else if (/ICICI\s*Lombard/i.test(fullText)) {
        company = "ICICI Lombard";
      } else if (/HDFC\s*ERGO/i.test(fullText)) {
        company = "HDFC ERGO";
      } else if (/Bajaj\s*/i.test(fullText)) {
        company = "Bajaj Allianz";
      } else if (/Go\s*Digit|Digit\s*Insurance/i.test(fullText)) {
        company = "Go Digit";
      } else if (/New India Assurance/i.test(fullText)) {
        company = "New India Assurance";
      } else if (/United India Insurance/i.test(fullText)) {
        company = "United India Insurance";
      } else if (/Reliance General Insurance/i.test(fullText)) {
        company = "Reliance General Insurance";
      } else if (/SBI General Insurance/i.test(fullText)) {
        company = "SBI General Insurance";
      } else if (/Oriental Insurance/i.test(fullText)) {
        company = "Oriental Insurance";
      }



      // =========================
      // INSURANCE TYPE
      // =========================
      let insuranceType = "";

      if (/Liability Only Policy|Third[\s-]*Party/i.test(fullText)) {
        insuranceType = "Third Party";
      } else if (
        /Comprehensive|Package Policy|Own Damage/i.test(fullText)
      ) {
        insuranceType = "Comprehensive";
      }

      // =========================
      // VEHICLE TYPE
      // =========================
      let vehicleType = "";

      if (
        /MOTOR\s*CYCLE|MOTORCYCLE|TWO\s*WHEELER|SCOOTER|SCOOTY/i.test(
          fullText
        )
      ) {
        vehicleType = "Two Wheeler";
      } else if (/\bCAR\b|PRIVATE CAR|FOUR WHEELER/i.test(fullText)) {
        vehicleType = "Car";
      } else if (
        /GOODS CARRYING|PASSENGER CARRYING|COMMERCIAL VEHICLE|TRUCK|BUS/i.test(
          fullText
        )
      ) {
        vehicleType = "Commercial";
      }

      // =========================
      // UPDATE FORM
      // Preserve fields that were not extracted.
      // =========================
      setFormData((prev) => ({
        ...prev,
        vehicleNo: vehicleNo || prev.vehicleNo,
        vehicleName: vehicleName || prev.vehicleName,
        customerName: customerName || prev.customerName,
        company: company || prev.company,
        premium: premium || prev.premium,
        insuranceType: insuranceType || prev.insuranceType,
        vehicleType: vehicleType || prev.vehicleType,
      }));

      console.log("PDF extraction result:", {
        vehicleNo,
        vehicleName,
        customerName,
        policyNumber,
        premium,
        company,
        insuranceType,
        vehicleType,
      });

      alert(
        "PDF processed successfully ✅\n\n" +
          "Extracted details have been filled into the form.\n" +
          "Please review the details before saving."
      );
    } catch (error) {
      console.error("PDF Extraction Error:", error);

      alert(
        "Could not read this PDF ❌\n\n" +
          "Please try another PDF policy document."
      );
    } finally {
      setIsExtracting(false);
    }
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
        Object.entries(dataToSend).map(([key, value]) => [
          key,
          String(value ?? ""),
        ])
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
      setPdfFile(null);

      const fileInput = document.getElementById("policyPdf");

      if (fileInput) {
        fileInput.value = "";
      }
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

            <button type="submit">Unlock</button>
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
    rows.push(formFields.slice(i, i + fieldsPerRow));
  }

  // =========================
  // FORM UI
  // =========================
  return (
    <div className="container">
      <div className="card large">
        <h2>🚗 Insurance Entry Form</h2>

        {/* =========================
            PDF UPLOAD SECTION
        ========================= */}
        <div className="pdf-upload-section">
          <label htmlFor="policyPdf">
            <strong>Upload Insurance Policy PDF</strong>
          </label>

          <input
            id="policyPdf"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePdfUpload}
            disabled={isExtracting || isSaving}
          />

          {isExtracting && (
            <p className="pdf-upload-status">
              Extracting policy details...
            </p>
          )}

          {pdfFile && !isExtracting && (
            <p className="pdf-upload-status">
              Selected: {pdfFile.name}
            </p>
          )}

          <small>
            Upload a text-based PDF policy. Review extracted details
            before saving.
          </small>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="form-row">
              {row.map((key) => (
                <div key={key} className="form-col">
                  {/* MOBILE */}
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
                  ) : key === "vehicleNo" ? (
                    /* VEHICLE NUMBER */
                    <input
                      name="vehicleNo"
                      value={formData.vehicleNo}
                      onChange={handleVehicleNoChange}
                      placeholder="Vehicle No (Ex: GJ03CF1234)"
                      type="text"
                      required
                    />
                  ) : key === "vehicleName" ? (
                    /* VEHICLE NAME */
                    <input
                      name="vehicleName"
                      value={formData.vehicleName}
                      onChange={handleVehicleNameChange}
                      placeholder="Vehicle Name (Ex: Honda City)"
                      type="text"
                      required
                    />
                  ) : key === "insuranceType" ? (
                    /* INSURANCE TYPE */
                    <select
                      name="insuranceType"
                      value={formData.insuranceType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Insurance Type</option>
                      <option value="Third Party">Third Party</option>
                      <option value="Comprehensive">Comprehensive</option>
                    </select>
                  ) : key === "vehicleType" ? (
                    /* VEHICLE TYPE */
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Car">Car</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  ) : key === "customerName" ||
                    key === "company" ||
                    key === "broker" ? (
                    /* CUSTOMER / COMPANY / BROKER */
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleCapitalCaseChange}
                      placeholder={key.replace(/([A-Z])/g, " $1")}
                      type="text"
                      required
                    />
                  ) : key === "premium" ||
                    key === "commission" ? (
                    /* PREMIUM / COMMISSION */
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={
                        key === "premium" ? "Premium" : "Commission"
                      }
                      type="number"
                      min="0"
                      required
                    />
                  ) : key === "paid" ? (
                    /* PAYMENT STATUS */
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
                  ) : key === "paidAmount" ? (
                    /* PAID AMOUNT */
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
                  ) : (
                    /* OTHER */
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key.replace(/([A-Z])/g, " $1")}
                      type="text"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* SUBMIT BUTTON */}
          <div className="form-row form-row-full">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSaving || isExtracting}
            >
              {isSaving ? "Saving..." : "Save Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;