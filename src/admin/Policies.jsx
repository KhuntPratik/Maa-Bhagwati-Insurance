import React, { useEffect, useState } from "react";
import "./Policies.css";

function getExpiryDate(issueDate) {
  const date = new Date(issueDate);
  if (Number.isNaN(date.getTime())) return "-";

  date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");

  const csvURL = import.meta.env.VITE_CSV_URL;

useEffect(() => {
  fetch(csvURL)
    .then((res) => res.text())
    .then((text) => {
      const rows = text
        .split("\n")
        .slice(1)
        .filter((row) => row.trim());

      const parsed = rows
        .map((row) => row.split(",").map((cell) => cell.trim()))
        .filter((row) => row.length >= 12);

      setPolicies(parsed);
    })
    .catch((error) => {
      console.error("Error fetching policies:", error);
    });
}, [csvURL]);

  const filteredPolicies = policies.filter(policy =>
    policy.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    "Date",
    "Expire Date",
    "Vehicle No",
    "Vehicle Name",
    "Customer",
    "Mobile",
    "Insurance",
    "Vehicle Type",
    "Company",
    "Broker",
    "Premium",
    "Commission",
  ];



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
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPolicies.map((row, index) => (
              <tr key={index}>
                {row.map((cell, i) => (
                  <td key={i} data-label={headers[i] || ""}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Policies;