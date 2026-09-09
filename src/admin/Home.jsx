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
  commission: ""
};

function Home() {
  const [formData, setFormData] = useState(initialState);
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // check stored authorization on mount and listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthorized(localStorage.getItem("isAuthorized") === "true");
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  const scriptURL = import.meta.env.VITE_SCRIPT_URL;

  const handlePinSubmit = (e) => {
    e.preventDefault();

    if (pin === CORRECT_PIN) {
      localStorage.setItem("isAuthorized", "true");
      setIsAuthorized(true);
      setPin("");
      // notify other components (Navbar) in the same window about auth change
      window.dispatchEvent(new Event("authChange"));
    } else {
      alert("Wrong PIN ❌");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    let value = e.target.value;

    // Remove any non-digit characters
    value = value.replace(/\D/g, "");

    // Auto add +91 if not present
    if (value && !value.startsWith("91")) {
      value = "91" + value;
    }

    // Limit to 12 digits (91 + 10 digit number)
    value = value.slice(0, 12);

    setFormData({ ...formData, mobile: "+" + value });
  };

  const handleVehicleNoChange = (e) => {
    const value = e.target.value.toUpperCase();
    setFormData({ ...formData, vehicleNo: value });
  };

  const handleVehicleNameChange = (e) => {
    // Convert to capital case (First letter of each word capitalized)
    const value = e.target.value
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setFormData({ ...formData, vehicleName: value });
  };

  const handleCapitalCaseChange = (e) => {
    // Generic capital case handler for text fields
    const value = e.target.value
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (let key in formData) {
      form.append(key, formData[key]);
    }

    await fetch(scriptURL, {
      method: "POST",
      mode: "no-cors",
      body: form
    });

    alert("Data Saved ✅");
    setFormData(initialState);
  };



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

  const formFields = Object.keys(formData);
  const fieldsPerRow = 2;
  const rows = [];

  for (let i = 0; i < formFields.length; i += fieldsPerRow) {
    rows.push(formFields.slice(i, i + fieldsPerRow));
  }

  return (
    <div className="container">
      <div className="card large">
        <h2>🚗 Insurance Entry Form</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="form-row">
              {row.map((key) => (
                <div key={key} className="form-col">
                  {key === "mobile" ? (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleMobileChange}
                      placeholder="+91XXXXXXXXXX"
                      type="tel"
                      required
                    />
                  ) : key === "vehicleNo" ? (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleVehicleNoChange}
                      placeholder="Vehicle No (Ex: GJ03CF1234)"
                      type="text"
                      required
                    />
                  ) : key === "vehicleName" ? (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleVehicleNameChange}
                      placeholder="Vehicle Name (Ex: Honda City)"
                      type="text"
                      required
                    />
                  ) : key === "insuranceType" ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      required
                    >
                      <option value="">Select Insurance Type</option>
                      <option value="Third Party">Third Party</option>
                      <option value="Comprehensive">Comprehensive</option>
                    </select>
                  ) : key === "vehicleType" ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      required
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="Car">Car</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  ) : key === "customerName" || key === "company" || key === "broker" ? (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleCapitalCaseChange}
                      placeholder={key.replace(/([A-Z])/g, " $1")}
                      type="text"
                      required
                    />
                  ) : (
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={key.replace(/([A-Z])/g, " $1")}
                      type={key === "premium" || key === "commission" ? "number" : "text"}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="form-row form-row-full">
            <button type="submit" className="submit-btn">
              Save Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;