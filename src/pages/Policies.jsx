import React, { useEffect, useState } from "react";
import "./Policies.css";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");

  const csvURL = import.meta.env.VITE_CSV_URL;

  useEffect(() => {
    fetch(csvURL)
      .then(res => res.text())
      .then(text => {
        const rows = text.split("\n").slice(1);

        const parsed = rows
          .map(row => row.split(","))
          .filter(row => row.length > 5);

        setPolicies(parsed);
      });
  }, []);

  const filteredPolicies = policies.filter(policy =>
    policy.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const headers = [
    "Date",
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