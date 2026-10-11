
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "./UploadPolicy.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function UploadPolicy() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [details, setDetails] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setError("");
    setDetails(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setFile(null);
      setError("PDF size must be less than 15 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const extractPolicy = async () => {
    if (!file) {
      setError("Please upload an insurance policy PDF.");
      return;
    }

    setLoading(true);
    setError("");
    setDetails(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
      }).promise;

      let fullText = "";

      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();

        fullText +=
          content.items.map((item) => item.str).join(" ") + "\n";
      }

      if (!fullText.trim()) {
        throw new Error(
          "No readable text found. This PDF may need OCR."
        );
      }

      const getValue = (pattern) =>
        fullText.match(pattern)?.[1]?.trim() || "";

      const policyDetails = {
        customerName: getValue(
          /Name\s+(?:\(Registered owner of the Motor Vehicle\):\s*)?(?:Mr\.?\s*)?([A-Za-z][A-Za-z .'-]+?)(?=\s{2,}|Address|Welcome|$)/i
        ),
        vehicleNumber: getValue(
          /Registration No\.?\s+([A-Z]{2}\s*\d{1,2}\s*[A-Z]{1,3}\s*\d{1,4})/i
        ),
        vehicleName: getValue(
          /Make\s*\/\s*Model\s*\/\s*Variant\s+(.+?)(?=\s+CC\s*\/\s*KW)/i
        ),
        policyNumber: getValue(
          /Policy No\.?\s+([A-Z0-9 ]+)/i
        ).replace(/\s+/g, " ").trim(),
        issueDate: getValue(
          /Date:\s*(\d{2}\/\d{2}\/\d{4})/i
        ),
        expiryDate: getValue(
          /Third-Party Cover\s+(\d{2}\/\d{2}\/\d{4}).*?(\d{2}\/\d{2}\/\d{4})/i
        ),
        insuranceCompany: /TATA AIG/i.test(fullText)
          ? "TATA AIG"
          : "",
        premium: getValue(
          /Premium Amount \(Including GST\)\s*₹?\s*([\d,]+(?:\.\d{2})?)/i
        ),
        engineNumber: getValue(
          /Engine No\.?\/Motor No\.?\s+([A-Z0-9]+)/i
        ),
        chassisNumber: getValue(
          /Chassis No\.?\s+([A-Z0-9]+)/i
        ),
        registrationDate: getValue(
          /Date of Registration\s+(\d{2}\/\d{2}\/\d{4})/i
        ),
        fuelType: getValue(
          /Fuel Type\s+([A-Z]+)/i
        ),
        broker: getValue(
          /Agent\/Intermediary Name\s+(.+?)\s+(?:150|\d{3,})/i
        ),
        policyType: /Liability Only Policy/i.test(fullText)
          ? "Third-Party"
          : "",
      };

      // Find the expiry date independently if the coverage line
      // was not extracted by the first pattern.
      if (!policyDetails.expiryDate) {
        const coverageMatch = fullText.match(
          /Third-Party Cover\s+(\d{2}\/\d{2}\/\d{4}).{0,100}?(\d{2}\/\d{2}\/\d{4})/i
        );

        if (coverageMatch) {
          policyDetails.expiryDate = coverageMatch[2];
        }
      }

      setDetails({ ...policyDetails, fullText });
    } catch (err) {
      setError(err.message || "Unable to read this PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailChange = (key, value) => {
    setDetails((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const { fullText, ...policy } = details;

    // Next step: connect this function to your existing
    // Google Sheets / Apps Script save logic.
    console.log("Extracted policy:", policy);

    alert(
      "Details extracted! Google Sheets saving is not connected yet."
    );
  };

  const fields = [
    ["customerName", "Customer Name"],
    ["vehicleNumber", "Vehicle Number"],
    ["vehicleName", "Vehicle Name / Model"],
    ["policyNumber", "Policy Number"],
    ["issueDate", "Policy Issue Date"],
    ["expiryDate", "Policy Expiry Date"],
    ["insuranceCompany", "Insurance Company"],
    ["policyType", "Policy Type"],
    ["premium", "Premium (₹)"],
    ["engineNumber", "Engine Number"],
    ["chassisNumber", "Chassis Number"],
    ["registrationDate", "Registration Date"],
    ["fuelType", "Fuel Type"],
    ["broker", "Broker"],
  ];

  return (
    <main className="upload-page">
      <div className="upload-container">
        <header className="upload-header">
          <div className="upload-icon">📄</div>
          <h1>Upload Insurance Policy</h1>
          <p>
            Upload a policy PDF to extract customer, vehicle,
            and insurance details automatically.
          </p>
        </header>

        <section className="upload-card">
          <label className="drop-zone" htmlFor="policy-pdf">
            <span className="upload-symbol">↑</span>
            <strong>
              {file ? file.name : "Choose insurance PDF"}
            </strong>
            <span>PDF files only · Maximum 15 MB</span>
            <input
              id="policy-pdf"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button
            className="extract-button"
            onClick={extractPolicy}
            disabled={!file || loading}
          >
            {loading ? "Extracting details..." : "Extract Policy Details"}
          </button>
        </section>

        {details && (
          <section className="details-card">
            <h2>Extracted Policy Details</h2>
            <p className="review-note">
              Please verify all fields against the original PDF
              before saving.
            </p>

            <div className="details-grid">
              {fields.map(([key, label]) => (
                <label className="field" key={key}>
                  <span>{label}</span>
                  <input
                    value={details[key] || ""}
                    onChange={(e) =>
                      handleDetailChange(key, e.target.value)
                    }
                    placeholder={`Enter ${label}`}
                  />
                </label>
              ))}
            </div>

            <button
              className="save-button"
              onClick={handleSave}
            >
              Save Policy Details
            </button>

            <details className="raw-text">
              <summary>View extracted PDF text</summary>
              <pre>{details.fullText}</pre>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
