import React, { useEffect, useState } from "react";
import "./Policies.css";
import { useInsuranceContext } from "./InsuranceContext";

function Policies() {
  const { policies, loading, fetchPolicies } = useInsuranceContext();
  const [search, setSearch] = useState("");

  const [editingRow, setEditingRow] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const scriptURL = import.meta.env.VITE_SCRIPT_URL;

  // ==============================
  // SEARCH
  // ==============================
  const filteredPolicies = policies.filter((policy) =>
    policy.data
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==============================
  // HEADERS
  // ==============================
  const headers = [
    "Date",
    "Expire Date",
    "Vehicle No",
    "Vehicle Name",
    "Customer Name",
    "Mobile",
    "Insurance Type",
    "Vehicle Type",
    "Company",
    "Broker",
    "Premium",
    "Your Commission",
    "Paid",
    "Paid Amount",
    "Action",
  ];

  // ==============================
  // EDIT PAYMENT STATUS
  // ==============================
  const handleEditPayment = (sheetRow, currentStatus) => {
    setEditingRow(sheetRow);

    const isPaid =
      String(currentStatus).trim().toLowerCase() === "true";

    setPaymentStatus(isPaid ? "true" : "false");
  };

  // ==============================
  // CANCEL
  // ==============================
  const handleCancelPayment = () => {
    setEditingRow(null);
    setPaymentStatus("");
  };

  const handlePaymentReminder = (row) => {
    const customerName = row[4] || "Customer";
    const vehicleNo = row[2] || "";
    const mobile = String(row[5] || "")
      .replace(/\D/g, "")
      .replace(/^91/, "");

    if (!mobile) {
      alert("Customer mobile number not found ❌");
      return;
    }

    const message = `નમસ્તે ${customerName} 🙏

તમારા વાહન ${vehicleNo} ની Insurance પેઇમેન્ટ ગુડાલાલ માટે રિમાઇન્ડર છે. કૃપા કરીને પેમેન્ટ કરી દો. ✅

Maa Bhagwati Insurance`;

    const whatsappUrl = `https://wa.me/91${mobile}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    alert("Payment reminder WhatsApp opened ✅");
  };

  // ==============================
  // PAYMENT RECEIVED + WHATSAPP
  // ==============================
  const handlePaymentReceived = async (row, sheetRow) => {
    const customerName = row[4] || "Customer";
    const vehicleNo = row[2] || "";

    const mobile = String(row[5] || "")
      .replace(/\D/g, "")
      .replace(/^91/, "");

    if (!mobile) {
      alert("Customer mobile number not found ❌");
      return;
    }

    if (!scriptURL) {
      alert("VITE_SCRIPT_URL is missing ❌");
      return;
    }

    try {
      setIsSaving(true);

      // ==============================
      // UPDATE GOOGLE SHEET AS PAID
      // ==============================
      const data = new URLSearchParams();

      data.append("action", "updatePayment");
      data.append("sheetRow", String(sheetRow));
      data.append("paid", "true");

      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: data.toString(),
      });

      // ==============================
      // PAYMENT RECEIVED MESSAGE
      // ==============================
      const message = `નમસ્તે ${customerName} 🙏

તમારા વાહન ${vehicleNo} ના Insurance નું પેમેન્ટ સફળતાપૂર્વક પ્રાપ્ત થયું છે. ✅

આભાર 🙏

Maa Bhagwati Insurance`;

      const whatsappUrl = `https://wa.me/91${mobile}?text=${encodeURIComponent(
        message
      )}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // ==============================
      // UPDATE UI
      // ==============================
      alert("Payment marked as Paid & WhatsApp opened ✅");

      // Refresh sheet data
      setTimeout(() => {
        fetchPolicies();
      }, 1500);

    } catch (error) {
      console.error(
        "Payment received error:",
        error
      );

      alert(
        "Payment update failed ❌"
      );
    } finally {
      setIsSaving(false);
    }
  };


  // ==============================
  // SAVE PAYMENT STATUS
  // ==============================

  const handleSavePayment = async (sheetRow, status) => {
    if (!scriptURL) {
      alert("VITE_SCRIPT_URL is missing ❌");
      return;
    }

    setIsSaving(true);

    try {
      const data = new URLSearchParams();

      data.append("action", "updatePayment");
      data.append("sheetRow", String(sheetRow));
      data.append("paid", status);

      console.log("Updating payment:", {
        sheetRow,
        paid: status,
      });

      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: data.toString(),
      });

      alert(
        status === "true"
          ? "Payment marked as Paid ✅"
          : "Payment marked as Unpaid ❌"
      );

      setEditingRow(null);
      setPaymentStatus("");

      // Reload Google Sheet data
      setTimeout(() => {
        fetchPolicies();
      }, 1500);
    } catch (error) {
      console.error("Payment update error:", error);
      alert("Payment update failed ❌");
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="policies-container">
      <h2>📋 All Policies</h2>

      <input
        className="search-input"
        type="text"
        placeholder="Search by vehicle, customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="policies-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredPolicies.map((policy) => {
              const row = policy.data;
              const sheetRow = policy.sheetRow;

              const isPaid =
                String(row[12]).trim().toLowerCase() === "true";

              return (
                <tr key={sheetRow}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      data-label={headers[i] || ""}
                    >
                      {i === 12 ? (
                        isPaid ? (
                          <span className="paid-status paid">
                            Paid
                          </span>
                        ) : (
                          <span className="paid-status unpaid">
                            Unpaid
                          </span>
                        )
                      ) : (
                        cell
                      )}
                    </td>
                  ))}

                  {/* ==============================
                      ACTION COLUMN
                  ============================== */}

                  <td data-label="Action">

                    {editingRow === sheetRow ? (
                      <div className="payment-edit-box">

                        <div className="payment-status-buttons">

                          {/* PAID */}
                          <button
                            type="button"
                            className="status-btn selected-paid"
                            onClick={() =>
                              handleSavePayment(sheetRow, "true")
                            }
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "✓ Paid"}
                          </button>

                          {/* UNPAID */}
                          <button
                            type="button"
                            className="status-btn selected-unpaid"
                            onClick={() =>
                              handleSavePayment(sheetRow, "false")
                            }
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "✕ Unpaid"}
                          </button>

                          {/* CANCEL */}
                          <button
                            type="button"
                            className="cancel-payment-btn"
                            onClick={handleCancelPayment}
                            disabled={isSaving}
                          >
                            Cancel
                          </button>

                        </div>

                      </div>
                    ) : (
                      <button
                        type="button"
                        className="edit-payment-btn"
                        onClick={() =>
                          handleEditPayment(sheetRow, row[12])
                        }
                      >
                        ✏️
                      </button>
                    )}

                    {/* WhatsApp + Reminder */}
                    
                    <div className="action-buttons">

                      {/* PAYMENT RECEIVED */}
                      {!isPaid && (
                        <button
                          type="button"
                          className="whatsapp-btn"
                          onClick={() =>
                            handlePaymentReceived(row, sheetRow)
                          }
                          disabled={isSaving}
                        >
                          💰 Payment Received
                        </button>
                      )}

                      {/* PAYMENT REMINDER */}
                      {!isPaid && (
                        <button
                          type="button"
                          className="reminder-btn"
                          onClick={() =>
                            handlePaymentReminder(row)
                          }
                          disabled={isSaving}
                        >
                          🔔 Reminder
                        </button>
                      )}

                    </div>
                  


                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Policies;
