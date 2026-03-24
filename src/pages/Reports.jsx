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
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#7c3aed", "#f59e0b", "#ef4444", "#14b8a6"];

function Reports({ expenses = [], month: propMonth, currency = "$" }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  // Filter expenses for selected month
  const monthlyExpenses = expenses.filter((exp) => exp.date?.slice(0, 7) === month);
  const monthTotal = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Pie chart data (Category Breakdown)
  const categoryTotals = monthlyExpenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(e.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  // Trend & Bar data (Daily Totals)
  const dailyTotals = {};
  // Initialize with all days of the month to show a smooth trend
  const year = parseInt(month.split('-')[0]);
  const m = parseInt(month.split('-')[1]);
  const daysInMonth = new Date(year, m, 0).getDate();
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${month}-${d.toString().padStart(2, '0')}`;
    dailyTotals[dateStr] = 0;
  }

  monthlyExpenses.forEach((exp) => {
    if (exp.date && dailyTotals[exp.date] !== undefined) {
      dailyTotals[exp.date] += Number(exp.amount);
    }
  });

  const timeData = Object.entries(dailyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ 
      date: date.split('-')[2], // Just the day number
      fullDate: date,
      total 
    }));

  return (
    <div className="page-container">
      <PageHeader title="Reports" subtitle="Visual insights into your spending habits" />

      {/* Summary Cards Row */}
      <div className="stats-grid">
        <div className="card">
          <h3 className="card-label">Analysis Month</h3>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="card">
          <h3 className="card-label">Monthly Volume</h3>
          <p className="stats-value success">{currency}{monthTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="card-subtext">Across {monthlyExpenses.length} transactions</p>
        </div>
        <div className="card">
          <h3 className="card-label">Lifetime Total</h3>
          <p className="stats-value primary">{currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="card-subtext">Total spending logged</p>
        </div>
      </div>

      {/* Main Trends Chart */}
      <div className="card chart-main-card">
        <h3 className="card-title">Spending Trend</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-md)',
                  color: 'var(--text-main)'
                }} 
              />
              <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        {/* Category Breakdown */}
        <div className="card">
          <h3 className="card-title">Category Breakdown</h3>
          {pieData.length === 0 ? (
            <div className="empty-chart">
              <p>No data available</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                        backgroundColor: 'var(--bg-card)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '10px',
                        color: 'var(--text-main)'
                      }} 
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Daily Comparison Bar Chart */}
        <div className="card">
          <h3 className="card-title">Daily Distribution</h3>
          {timeData.filter(d => d.total > 0).length === 0 ? (
            <div className="empty-chart">
              <p>No daily spending recorded</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData.filter(d => d.total > 0)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(37, 99, 235, 0.05)'}}
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-card)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '10px',
                      color: 'var(--text-main)'
                    }} 
                  />
                  <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;