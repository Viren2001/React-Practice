import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#7c3aed", "#ca8a04", "#f97316", "#14b8a6"];
const cardStyle = {
  padding: "20px",
  marginBottom: "20px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

function Reports({ expenses = [] }) {
  // Local state for month selector
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // default to current month

  // Filter expenses for selected month
  const monthlyExpenses = expenses.filter((exp) => exp.date?.slice(0, 7) === month);

  // Monthly total
  const monthTotal = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // All-time total
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Pie chart data by category
  const categoryTotals = monthlyExpenses.reduce((acc, e) => {
    const cat = e.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(e.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  // Bar chart data (daily totals)
  const dailyTotals = {};
  monthlyExpenses.forEach((exp) => {
    if (exp.date) dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + Number(exp.amount);
  });
  const barData = Object.entries(dailyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <PageHeader title="Reports" subtitle="Analyze your spending patterns" />

      {/* Month Selector */}
      <div style={cardStyle}>
        <label>
          Select Month:{" "}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
        <div style={{ marginTop: "10px" }}>
          <div style={{ fontWeight: "bold", fontSize: "18px", color: "#2563eb" }}>
            Total Expenses (All-Time): ${total.toFixed(2)}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "18px", color: "#16a34a" }}>
            Total Expenses (Month: {month}): ${monthTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div style={cardStyle}>
        <h3>Expenses by Category (Month: {month})</h3>
        {monthlyExpenses.length === 0 ? (
          <p style={{ textAlign: "center" }}>No expenses for this month.</p>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", height: "55vh" }}>
            <PieChart width={400} height={400}>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div style={cardStyle}>
        <h3>Daily Expenses (Month: {month})</h3>
        {barData.length === 0 ? (
          <p style={{ textAlign: "center" }}>No expenses for this month.</p>
        ) : (
          <BarChart width={800} height={300} data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        )}
      </div>
    </div>
  );
}

export default Reports;