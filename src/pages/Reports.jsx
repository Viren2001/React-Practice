import React, { useState, useEffect } from "react";
import MonthSelector from "../components/MonthSelector";
import PageHeader from "../components/PageHeader";
import { isDateInPeriod } from "../utils/dateUtils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ["#d946ef", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

function Reports({ expenses = [], month: propMonth, currency = "$" }) {
  const [month, setMonth] = useState(propMonth || new Date().toISOString().slice(0, 7));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (propMonth) setMonth(propMonth);
  }, [propMonth]);

  // Filter expenses using robust date utility
  const periodExpenses = expenses.filter((exp) => isDateInPeriod(exp.date, month));
  const periodTotal = periodExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Pie chart data (Category Breakdown)
  const categoryTotals = periodExpenses.reduce((acc, e) => {
    const cat = e.category || "Other";
    acc[cat] = (acc[cat] || 0) + Number(e.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals)
     .map(([name, value]) => ({ name, value }))
     .sort((a, b) => b.value - a.value);

  // Trend data grouped by date
  const dailyTotals = {};
  periodExpenses.forEach((exp) => {
    if (exp.date) {
      if (!dailyTotals[exp.date]) dailyTotals[exp.date] = 0;
      dailyTotals[exp.date] += Number(exp.amount);
    }
  });

  const timeData = Object.entries(dailyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => {
        const d = new Date(date);
        return {
           date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
           fullDate: date,
           total
        };
    });

  // Radar chart data (Weekly Habit Analyzer)
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayTotals = {
    "Monday": 0, "Tuesday": 0, "Wednesday": 0, "Thursday": 0, "Friday": 0, "Saturday": 0, "Sunday": 0
  };

  periodExpenses.forEach((exp) => {
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
    subject: day.slice(0, 3), // e.g. Mon, Tue
    amount: weekdayTotals[day]
  }));

  return (
    <div className="page-container" style={{ paddingBottom: "100px" }}>
      <PageHeader title="Visual Reports" subtitle="Deep dive into your spending analytics" />

      {/* Summary Cards Row */}
      <div className="stats-grid">
        <div className="card" style={{ overflow: "visible", position: "relative", zIndex: 10 }}>
          <MonthSelector
            label="Analysis Period"
            value={month}
            onChange={(val) => setMonth(val)}
            options={[{ label: "Full History", value: "All" }]}
          />
        </div>
        <div className="card glass-effect" style={{ borderTop: "4px solid var(--primary)" }}>
          <h3 className="card-label">Period Volume</h3>
          <p className="stats-value primary">{currency}{periodTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="card-subtext">Across {periodExpenses.length} transactions</p>
        </div>
        <div className="card glass-effect" style={{ borderTop: "4px solid var(--success)" }}>
          <h3 className="card-label">Lifetime Total</h3>
          <p className="stats-value success">{currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="card-subtext">Total spending logged</p>
        </div>
      </div>

      {/* Main Trends Chart */}
      <div className="card chart-main-card glass-effect">
        <h3 className="card-title">Cumulative Spending Trend</h3>
        {timeData.length > 0 ? (
            <div className="chart-container" style={{ height: "350px", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${currency}${val}`} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${currency}${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total Spend']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-main)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      fontWeight: '700'
                    }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: '900' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        ) : (
            <div className="empty-chart" style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              No trend data for this period
            </div>
        )}
      </div>

      <div className="charts-grid">
        {/* Category Breakdown */}
        <div className="card glass-effect">
          <h3 className="card-title">Expense Distribution</h3>
          {pieData.length === 0 ? (
            <div className="empty-chart" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <p>No data available</p>
            </div>
          ) : (
            <div className="chart-container" style={{ height: "300px", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                    label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={isMobile ? false : { stroke: 'var(--text-muted)', strokeWidth: 1 }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${currency}${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Volume']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-main)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      fontWeight: '700'
                    }}
                    itemStyle={{ color: 'var(--text-main)', fontWeight: '900' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Weekly Habit Analyzer (Radar Chart) */}
        <div className="card glass-effect">
          <h3 className="card-title">Weekly Habit Analyzer</h3>
          {radarData.every(d => d.amount === 0) ? (
            <div className="empty-chart" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <p>No spending recorded</p>
            </div>
          ) : (
            <div className="chart-container" style={{ height: "300px", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(217, 70, 239, 0.15)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 13, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar
                    name="Spend Volume"
                    dataKey="amount"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    fill="var(--primary)"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    formatter={(value) => [`${currency}${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Total Spent']}
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-main)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      fontWeight: '700'
                    }}
                    itemStyle={{ color: 'var(--primary)', fontWeight: '900' }}
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