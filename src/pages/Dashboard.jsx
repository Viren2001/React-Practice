import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { getCategoryIcon } from "../utils/categoryIcons";
import BudgetProgress from "../components/BudgetProgress";
import BudgetAlert from "../components/BudgetAlert";
import EmptyState from "../components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MonthSelector from "../components/MonthSelector";
import {
    Wallet,
    TrendingDown,
    Calendar,
    Plus,
    ArrowRight,
    Activity,
    Target
} from "lucide-react";

function Dashboard({ expenses = [], month, setMonth, budget = 0, updateBudget, categoryBudgets = {}, currency = "$" }) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Filter expenses for selected month
    const monthlyExpenses = expenses.filter((exp) => exp.date?.slice(0, 7) === month);

    // Total for selected month
    const monthTotal = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Category totals for this month
    const categoryTotals = monthlyExpenses.reduce((acc, exp) => {
        const cat = exp.category || "Other";
        acc[cat] = (acc[cat] || 0) + Number(exp.amount);
        return acc;
    }, {});

    // Top spending category
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // Daily average
    const dateObj = new Date();
    const [year, m] = month ? month.split("-") : [dateObj.getFullYear(), dateObj.getMonth() + 1];
    const daysInMonth = new Date(parseInt(year), parseInt(m), 0).getDate();
    const currentDay = month === `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}` ? dateObj.getDate() : daysInMonth;
    const dailyAvg = currentDay > 0 ? monthTotal / currentDay : 0;

    // Local state for budget editing
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState(budget);

    // Sync tempBudget when budget changes
    useEffect(() => {
        setTempBudget(budget);
    }, [budget]);

    const handleSaveBudget = () => {
        updateBudget(tempBudget);
        setIsEditingBudget(false);
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="page-container">
            <div className="page-header-container" style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: "900", marginBottom: "4px", letterSpacing: "-0.04em" }}>
                    {greeting()}, {currentUser?.email?.split('@')[0]}!
                </h2>
                <p style={{ color: "var(--text-muted)", fontWeight: "500", fontSize: "clamp(13px, 3vw, 15px)" }}>Here's what's happening with your money this month.</p>
            </div>

            {/* Smart Budget Alert */}
            <BudgetAlert spent={monthTotal} budget={budget} currency={currency} />

            <div className="dashboard-grid">
                {/* Period Selector Card */}
                <div className="card glass-effect" style={{ borderTop: "4px solid var(--primary)", overflow: "visible", position: "relative", zIndex: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                        <div style={{ background: "rgba(var(--primary-rgb), 0.1)", color: "var(--primary)", padding: "12px", borderRadius: "14px", border: "1px solid var(--primary-glow)" }}>
                            <Calendar size={22} />
                        </div>
                        <h3 className="card-label" style={{ margin: 0, fontSize: "12px" }}>Financial Period</h3>
                    </div>
                    <MonthSelector
                        value={month}
                        onChange={(val) => setMonth(val)}
                    />
                </div>

                {/* Monthly Spending Card */}
                <div className="card glass-effect" style={{ borderTop: "4px solid var(--success)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                        <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                            <Wallet size={22} />
                        </div>
                        <h3 className="card-label" style={{ margin: 0, fontSize: "12px" }}>Total Outflow</h3>
                    </div>
                    <p className="stats-value" style={{ color: "var(--text-main)", margin: "0 0 10px 0", fontSize: "36px" }}>
                        {currency}{monthTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Activity size={14} /> {monthlyExpenses.length} transactions this month
                    </div>
                </div>

                {/* Budget Management Card */}
                <div className="card glass-effect" style={{ borderTop: "4px solid #7c3aed" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed", padding: "12px", borderRadius: "14px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
                                <Target size={22} />
                            </div>
                            <h3 className="card-label" style={{ margin: 0, fontSize: "12px" }}>Budget Control</h3>
                        </div>
                        <button
                            onClick={() => isEditingBudget ? handleSaveBudget() : setIsEditingBudget(true)}
                            className="glass-effect"
                            style={{
                                color: "var(--primary)",
                                padding: "8px 14px",
                                cursor: "pointer",
                                fontSize: "11px",
                                fontWeight: "800",
                                borderRadius: "10px",
                                border: "1.5px solid var(--primary-glow)"
                            }}
                        >
                            {isEditingBudget ? "SAVE" : "ADJUST"}
                        </button>
                    </div>

                    {isEditingBudget ? (
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <span style={{ fontWeight: "900", color: "var(--primary)", fontSize: "20px" }}>{currency}</span>
                            <input
                                type="number"
                                value={tempBudget}
                                onChange={(e) => setTempBudget(e.target.value)}
                                autoFocus
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "2px solid var(--primary)",
                                    width: "100%",
                                    fontSize: "20px",
                                    fontWeight: "900",
                                    background: "rgba(var(--bg-card-rgb), 0.8)",
                                    boxShadow: "0 10px 20px -10px var(--primary-glow)"
                                }}
                            />
                        </div>
                    ) : (
                        <BudgetProgress spent={monthTotal} budget={budget} currency={currency} />
                    )}
                </div>
            </div>

            {/* Quick Insights Row */}
            <div className="insights-grid">
                <div className="card glass insight-card">
                    <h3 className="card-label">Daily Average</h3>
                    <p style={{ fontSize: "24px", fontWeight: "900", color: "var(--success)" }}>
                        {currency}{dailyAvg.toFixed(2)}
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Expected spend per day</div>
                </div>

                <div className="card glass insight-card">
                    <h3 className="card-label">Top Category</h3>
                    {topCategory ? (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                <div style={{ background: "var(--bg-app)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                                    {getCategoryIcon(topCategory[0])}
                                </div>
                                <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.02em" }}>{topCategory[0]}</span>
                            </div>
                            <div style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>
                                {currency}{topCategory[1].toFixed(2)} total
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>No data to analyze</div>
                    )}
                </div>

                <div className="card glass insight-card">
                    <h3 className="card-label">Remaining</h3>
                    <p style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        color: budget > 0 && monthTotal > budget ? "var(--danger)" : "var(--primary)"
                    }}>
                        {budget > 0 ? `${currency}${(budget - monthTotal).toFixed(2)}` : "Not set"}
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
                        {budget > 0 ? `of ${currency}${budget.toLocaleString()} plan` : "Set a monthly goal"}
                    </div>
                </div>
            </div>

            {/* Recent Expenses List */}
            <div className="card glass" style={{ padding: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <TrendingDown size={22} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", letterSpacing: "-0.03em" }}>Recent Activity</h3>
                    </div>
                    <button
                        onClick={() => navigate('/expenses')}
                        style={{
                            backgroundColor: "rgba(var(--primary-rgb), 0.05)",
                            color: "var(--primary)",
                            padding: "8px 16px",
                            fontSize: "13px",
                            fontWeight: "800",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        See Reports <ArrowRight size={14} />
                    </button>
                </div>

                {monthlyExpenses.length === 0 ? (
                    <EmptyState
                        type="dashboard"
                        title="Your activity will appear here"
                        subtitle="Start adding transactions to see your spending patterns and trends."
                        action={{ label: "Add First Transaction", onClick: () => navigate('/expenses') }}
                    />
                ) : (
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                        {monthlyExpenses.slice(-5).reverse().map((exp) => (
                            <li key={exp.id} className="expense-item" style={{ margin: 0, background: "rgba(var(--bg-card-rgb), 0.3)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                                    <div className="expense-icon-box" style={{ background: "var(--bg-app)" }}>
                                        {getCategoryIcon(exp.category)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: "800", fontSize: "15px", color: "var(--text-main)" }}>
                                            {exp.name}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>
                                            {exp.category} • {exp.date}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: "900", fontSize: "18px", color: "var(--text-main)" }}>
                                    {currency}{Number(exp.amount).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
