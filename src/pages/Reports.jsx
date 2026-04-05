import React, { useState } from "react";
import MonthSelector from "../components/MonthSelector";
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
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
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

  // Radar chart data (Weekly Habit Analyzer)
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayTotals = {
    "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0, "Sunday": 0
  };

  monthlyExpenses.forEach((exp) => {
    if (exp.date) {
      const [y, m, d] = exp.date.split('-');
      const dateObj = new Date(y, m - 1, d);
      const dayName = weekdays[dateObj.getDay()];
      if (weekdayTotals[dayName] !== undefined) {
        weekdayTotals[dayName] += Number(exp.amount);
      }
    }
  });

  const radarData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => ({
    subject: day,
    amount: weekdayTotals[day]
  }));

  return (
    <div className="page-container">
      <PageHeader title="Reports" subtitle="Visual insights into your spending habits" />

      {/* Summary Cards Row */}
      <div className="stats-grid">
        <div className="card" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
          <MonthSelector
            label="Analysis Month"
            value={month}
            onChange={(val) => setMonth(val)}
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
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${currency}${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total Spend']}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
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
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${currency}${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Weekly Habit Analyzer (Radar Chart) */}
        <div className="card">
          <h3 className="card-title">Weekly Habit Analyzer</h3>
          {radarData.every(d => d.amount === 0) ? (
            <div className="empty-chart">
              <p>No spending recorded</p>
            </div>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar
                    name="Spend Volume"
                    dataKey="amount"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fill="var(--primary)"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    formatter={(value) => [`${currency}${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total Spent']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;