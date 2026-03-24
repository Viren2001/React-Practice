import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { getCategoryIcon } from "../utils/categoryIcons";
import BudgetProgress from "../components/BudgetProgress";
import BudgetAlert from "../components/BudgetAlert";
import EmptyState from "../components/EmptyState";
import { useNavigate } from "react-router-dom";

function Dashboard({ expenses = [], month, setMonth, budget = 0, updateBudget, categoryBudgets = {}, currency = "$" }) {
    const navigate = useNavigate();

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
    const daysInMonth = new Date(parseInt(month?.split("-")[0]), parseInt(month?.split("-")[1]), 0).getDate();
    const today = new Date();
    const currentDay = month === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}` ? today.getDate() : daysInMonth;
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

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <PageHeader title="Dashboard" subtitle="Your financial overview at a glance" />

            {/* Smart Budget Alert */}
            <BudgetAlert spent={monthTotal} budget={budget} currency={currency} />

            {/* Category Budget Alerts */}
            {Object.entries(categoryBudgets).map(([cat, catBudget]) => {
                const catSpent = categoryTotals[cat] || 0;
                if (catBudget > 0 && catSpent / catBudget >= 0.8) {
                    return (
                        <BudgetAlert key={cat} spent={catSpent} budget={catBudget} currency={currency} />
                    );
                }
                return null;
            })}

            <div className="dashboard-grid">
                {/* Month Selector */}
                <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 className="card-label">Current Period</h3>
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                {/* Monthly Total */}
                <div className="card">
                    <h3 className="card-label">Month Spending</h3>
                    <p style={{ fontSize: "32px", fontWeight: "800", color: "var(--primary)", margin: "0 0 8px 0" }}>
                        {currency}{monthTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                        {monthlyExpenses.length} transactions this month
                    </div>
                </div>

                {/* Monthly Budget */}
                <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Monthly Budget</h3>
                        <button 
                            onClick={() => isEditingBudget ? handleSaveBudget() : setIsEditingBudget(true)}
                            style={{ 
                                background: "rgba(37, 99, 235, 0.1)", 
                                border: "none", 
                                color: "var(--primary)", 
                                padding: "4px 10px",
                                cursor: "pointer", 
                                fontSize: "11px", 
                                fontWeight: "700",
                                borderRadius: "6px"
                            }}
                        >
                            {isEditingBudget ? "SAVE" : "EDIT"}
                        </button>
                    </div>

                    {isEditingBudget ? (
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <span style={{ fontWeight: "700", color: "var(--text-main)" }}>$</span>
                            <input
                                type="number"
                                value={tempBudget}
                                onChange={(e) => setTempBudget(e.target.value)}
                                autoFocus
                                style={{ 
                                    padding: "8px", 
                                    borderRadius: "8px", 
                                    border: "2px solid var(--primary)", 
                                    width: "100%",
                                    fontSize: "18px",
                                    fontWeight: "800"
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
                <div className="card insight-card">
                    <h3 className="card-label">Daily Average</h3>
                    <p style={{ fontSize: "24px", fontWeight: "800", color: "var(--success)", margin: 0 }}>
                        {currency}{dailyAvg.toFixed(2)}
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>per day this month</div>
                </div>
                <div className="card insight-card">
                    <h3 className="card-label">Top Category</h3>
                    {topCategory ? (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                {getCategoryIcon(topCategory[0])}
                                <span style={{ fontSize: "18px", fontWeight: "700" }}>{topCategory[0]}</span>
                            </div>
                            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                                {currency}{topCategory[1].toFixed(2)} spent
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>No data</div>
                    )}
                </div>
                <div className="card insight-card">
                    <h3 className="card-label">Budget Left</h3>
                    <p style={{ 
                        fontSize: "24px", 
                        fontWeight: "800", 
                        color: budget > 0 && monthTotal > budget ? "var(--danger)" : "var(--primary)", 
                        margin: 0 
                    }}>
                        {budget > 0 ? `${currency}${(budget - monthTotal).toFixed(2)}` : "Not set"}
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {budget > 0 ? `of ${currency}${budget.toFixed(2)} budget` : "Set in settings"}
                    </div>
                </div>
            </div>

            {/* Recent Expenses List */}
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Recent Transactions</h3>
                    <button 
                        onClick={() => navigate('/expenses')} 
                        style={{ backgroundColor: "transparent", color: "var(--primary)", padding: 0, fontSize: "13px", border: "none", cursor: "pointer" }}
                    >
                        View All
                    </button>
                </div>
                
                {monthlyExpenses.length === 0 ? (
                    <EmptyState
                        type="dashboard"
                        title="No transactions yet"
                        subtitle="Start tracking your spending to see insights here"
                        action={{ label: "Add Expense", onClick: () => navigate('/expenses') }}
                    />
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {monthlyExpenses.slice(-5).reverse().map((exp) => (
                            <li key={exp.id} className="recent-tx-item" style={{ gap: "16px" }}>
                                <div className="expense-icon-box">
                                    {getCategoryIcon(exp.category)}
                                </div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {exp.name}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                                        {exp.category} • {exp.date}
                                    </div>
                                </div>
                                <div style={{ fontWeight: "800", fontSize: "16px", marginLeft: "16px", color: "var(--text-main)", flexShrink: 0 }}>
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
