import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const [totalPremium, setTotalPremium] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);

  const csvURL = import.meta.env.VITE_CSV_URL;

  useEffect(() => {
    fetch(csvURL)
      .then(res => res.text())
      .then(text => {
        const rows = text.split("\n").slice(1);
        const parsed = rows.map(row => row.split(","));

        let premiumSum = 0;
        let commissionSum = 0;
        let monthSum = 0;

        const currentMonth = new Date().getMonth();

        parsed.forEach(row => {
          const date = new Date(row[0]);
          const premium = Number(row[9]) || 0;
          const commission = Number(row[10]) || 0;

          premiumSum += premium;
          commissionSum += commission;

          if (date.getMonth() === currentMonth) {
            monthSum += commission;
          }
        });

        setTotalPremium(premiumSum);
        setTotalCommission(commissionSum);
        setMonthlyProfit(monthSum);
        setData(parsed);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <h2>📊 Insurance Dashboard</h2>

      <div className="stats-grid">
        <div className="card-box">
          <h3>Total Premium</h3>
          <p>₹ {totalPremium}</p>
        </div>

        <div className="card-box">
          <h3>Total Commission</h3>
          <p>₹ {totalCommission}</p>
        </div>

        <div className="card-box">
          <h3>This Month Profit</h3>
          <p>₹ {monthlyProfit}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;