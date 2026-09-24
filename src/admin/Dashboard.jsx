import React, { useMemo } from "react";
import "./Dashboard.css";
import { useInsuranceContext } from "./InsuranceContext";

function Dashboard() {
  const { policies, loading } = useInsuranceContext();

  const stats = useMemo(() => {
    let premiumSum = 0;
    let commissionSum = 0;
    let monthSum = 0;

    const currentMonth = new Date().getMonth();

    policies.forEach((policy) => {
      const row = policy.data || [];
      const date = new Date(row[0]);
      const premium = Number(row[9]) || Number(row[10]) || 0;
      const commission = Number(row[10]) || Number(row[11]) || 0;

      premiumSum += premium;
      commissionSum += commission;

      if (!Number.isNaN(date.getTime()) && date.getMonth() === currentMonth) {
        monthSum += commission;
      }
    });

    return {
      totalPremium: premiumSum,
      totalCommission: commissionSum,
      monthlyProfit: monthSum,
    };
  }, [policies]);

  return (
    <div className="dashboard-container">
      <h2>📊 Insurance Dashboard</h2>

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <div className="stats-grid">
          <div className="card-box">
            <h3>Total Premium</h3>
            <p>₹ {stats.totalPremium}</p>
          </div>

          <div className="card-box">
            <h3>Total Commission</h3>
            <p>₹ {stats.totalCommission}</p>
          </div>

          <div className="card-box">
            <h3>This Month Profit</h3>
            <p>₹ {stats.monthlyProfit}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;